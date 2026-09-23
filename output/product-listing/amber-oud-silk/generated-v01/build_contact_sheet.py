from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
FINAL = ROOT / "final"
TILE = 480


def main() -> None:
    names = sorted(path.name for path in FINAL.glob("*.png"))
    if len(names) != 12:
        raise RuntimeError(f"Expected 12 final PNGs, found {len(names)}")

    sheet = Image.new("RGB", (4 * TILE, 3 * TILE), "white")
    for index, name in enumerate(names):
        image = Image.open(FINAL / name).convert("RGB")
        image = ImageOps.fit(image, (TILE, TILE), Image.Resampling.LANCZOS)
        sheet.paste(image, ((index % 4) * TILE, (index // 4) * TILE))

    sheet.save(ROOT / "contact-sheet.png", optimize=True)


if __name__ == "__main__":
    main()
