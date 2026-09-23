from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
TILE = 360


GALLERIES = {
    "citrus": (
        ROOT / "citrus-wish" / "standardized-v01",
        [
            "01-featured-packshot.png",
            "02-brand-hero.png",
            "03-packaging-reveal.png",
            "04-material-cap-detail.png",
            "05-coastal-scooter-lifestyle.png",
            "06-poolside-product-detail.png",
            "07-basketball-court-lifestyle.png",
            "08-product-profile-infographic.png",
            "09-ingredients-and-care-infographic.png",
            "10-closing-hero.png",
        ],
    ),
    "moonlight": (
        ROOT / "moonlight-velvet" / "standardized-v01",
        [
            "01-featured-packshot.png",
            "02-brand-hero.png",
            "03-packaging-reveal.png",
            "04-material-cap-detail.png",
            "05-listening-bar-lifestyle.png",
            "06-city-elevator-product-detail.png",
            "07-gallery-social-lifestyle.png",
            "08-product-profile-infographic.png",
            "09-ingredients-and-care-infographic.png",
            "10-closing-hero.png",
        ],
    ),
    "charme": (
        ROOT / "charme-envoutant" / "generated-v01",
        [
            "01-featured-packshot.png",
            "02-brand-hero.png",
            "03-packaging-reveal.png",
            "04-material-cap-detail.png",
            "05-mens-red-convertible.png",
            "06-mens-tropical-handheld.png",
            "07-mens-social-lifestyle.png",
            "08-product-profile-infographic.png",
            "09-ingredients-and-care-infographic.png",
            "10-closing-hero.png",
        ],
    ),
    "ivory": (
        ROOT / "ivory-reverie" / "generated-v01",
        [
            "01-featured-packshot.png",
            "02-brand-hero.png",
            "03-packaging-reveal.png",
            "04-material-cap-detail.png",
            "05-city-concourse-lifestyle.png",
            "06-barbershop-handheld.png",
            "07-bowling-social-lifestyle.png",
            "08-product-profile-infographic.png",
            "09-ingredients-and-care-infographic.png",
            "10-closing-hero.png",
        ],
    ),
}


def build_contact_sheet(directory: Path, names: list[str]) -> Image.Image:
    sheet = Image.new("RGB", (5 * TILE, 2 * TILE), "white")
    for index, name in enumerate(names):
        image = Image.open(directory / "final" / name).convert("RGB")
        image = ImageOps.fit(image, (TILE, TILE), Image.Resampling.LANCZOS)
        sheet.paste(image, ((index % 5) * TILE, (index // 5) * TILE))
    return sheet


def main() -> None:
    sheets = {}
    for key, (directory, names) in GALLERIES.items():
        sheet = build_contact_sheet(directory, names)
        sheet.save(directory / "contact-sheet.png", optimize=True)
        sheets[key] = sheet

    combined = Image.new("RGB", (5 * TILE, 8 * TILE), "white")
    for index, key in enumerate(("citrus", "moonlight", "charme", "ivory")):
        combined.paste(sheets[key], (0, index * 2 * TILE))
    combined.save(ROOT / "four-scent-standard-contact-sheet.png", optimize=True)


if __name__ == "__main__":
    main()
