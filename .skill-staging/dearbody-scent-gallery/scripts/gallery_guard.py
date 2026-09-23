#!/usr/bin/env python3
"""Validate and checksum-lock a DearBody 10-image gallery."""

from __future__ import annotations

import argparse
import hashlib
import re
import struct
import sys
from pathlib import Path


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
NAME_PATTERN = re.compile(r"^(\d{2})-.+\.png$", re.IGNORECASE)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def png_info(path: Path) -> tuple[int, int, bool]:
    """Return width, height, and whether an explicit sRGB/ICC marker exists."""
    with path.open("rb") as handle:
        if handle.read(8) != PNG_SIGNATURE:
            raise ValueError("not a PNG file")

        width = height = None
        has_color_profile = False
        while True:
            length_bytes = handle.read(4)
            if len(length_bytes) != 4:
                break
            length = struct.unpack(">I", length_bytes)[0]
            chunk_type = handle.read(4)
            chunk_data = handle.read(length)
            crc = handle.read(4)
            if len(chunk_type) != 4 or len(chunk_data) != length or len(crc) != 4:
                raise ValueError("truncated PNG")
            if chunk_type == b"IHDR":
                width, height = struct.unpack(">II", chunk_data[:8])
            elif chunk_type in {b"sRGB", b"iCCP"}:
                has_color_profile = True
            elif chunk_type == b"IEND":
                break

    if width is None or height is None:
        raise ValueError("missing IHDR")
    return width, height, has_color_profile


def collect_gallery(directory: Path) -> tuple[list[Path], list[str]]:
    errors: list[str] = []
    files: list[Path] = []

    if not directory.is_dir():
        return [], [f"Gallery directory does not exist: {directory}"]

    for path in sorted(directory.iterdir()):
        if not path.is_file() or path.name.startswith("."):
            continue
        match = NAME_PATTERN.match(path.name)
        if match:
            files.append(path)

    expected = [f"{number:02d}" for number in range(1, 11)]
    found = [NAME_PATTERN.match(path.name).group(1) for path in files]
    if len(files) != 10:
        errors.append(f"Expected 10 numbered PNG files, found {len(files)}")
    if found != expected:
        errors.append(f"Expected prefixes {expected}; found {found}")

    return files, errors


def validate_files(files: list[Path]) -> tuple[dict[str, str], list[str], list[str]]:
    hashes: dict[str, str] = {}
    errors: list[str] = []
    warnings: list[str] = []
    seen_hashes: dict[str, str] = {}

    for path in files:
        try:
            width, height, has_profile = png_info(path)
        except (OSError, ValueError, struct.error) as exc:
            errors.append(f"{path.name}: {exc}")
            continue

        if (width, height) != (2048, 2048):
            errors.append(f"{path.name}: expected 2048x2048, found {width}x{height}")
        if not has_profile:
            warnings.append(
                f"{path.name}: no explicit sRGB/iCCP marker; confirm/export as sRGB before delivery"
            )

        digest = sha256(path)
        hashes[path.name] = digest
        if digest in seen_hashes:
            errors.append(f"{path.name}: duplicate bytes of {seen_hashes[digest]}")
        else:
            seen_hashes[digest] = path.name

    return hashes, errors, warnings


def write_lock(path: Path, hashes: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    content = "".join(f"{digest}  {name}\n" for name, digest in sorted(hashes.items()))
    path.write_text(content, encoding="utf-8")


def read_lock(path: Path) -> tuple[dict[str, str], list[str]]:
    locked: dict[str, str] = {}
    errors: list[str] = []
    if not path.is_file():
        return {}, [f"Lock file does not exist: {path}"]

    for line_number, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw_line.strip()
        if not line:
            continue
        parts = line.split(None, 1)
        if len(parts) != 2 or not re.fullmatch(r"[0-9a-fA-F]{64}", parts[0]):
            errors.append(f"Malformed lock line {line_number}: {raw_line}")
            continue
        locked[parts[1].strip()] = parts[0].lower()
    return locked, errors


def verify_lock(current: dict[str, str], lock_path: Path) -> list[str]:
    locked, errors = read_lock(lock_path)
    for name, digest in locked.items():
        if name not in current:
            errors.append(f"Locked file missing: {name}")
        elif current[name] != digest:
            errors.append(f"Locked file changed: {name}")
    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate a DearBody 10-image gallery and manage SHA-256 locks."
    )
    parser.add_argument("gallery", type=Path, help="Directory containing 01- through 10- PNG files")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--write-lock", type=Path, help="Write current SHA-256 manifest")
    mode.add_argument("--verify-lock", type=Path, help="Verify files against a SHA-256 manifest")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    files, errors = collect_gallery(args.gallery)
    hashes, file_errors, warnings = validate_files(files)
    errors.extend(file_errors)

    if args.verify_lock:
        errors.extend(verify_lock(hashes, args.verify_lock))

    for warning in warnings:
        print(f"WARN: {warning}")
    for error in errors:
        print(f"FAIL: {error}", file=sys.stderr)

    if errors:
        print(f"Gallery guard failed with {len(errors)} issue(s).", file=sys.stderr)
        return 1

    if args.write_lock:
        write_lock(args.write_lock, hashes)
        print(f"Wrote SHA-256 lock: {args.write_lock}")

    print(f"PASS: {len(files)} unique numbered PNG files validated in {args.gallery}")
    if warnings:
        print(f"PASS WITH {len(warnings)} COLOR-PROFILE WARNING(S)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
