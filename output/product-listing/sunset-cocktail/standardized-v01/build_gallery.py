from pathlib import Path
import subprocess

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[1]
SOURCE = PROJECT / "sunset-cocktail" / "generated-v03"
CUTOUTS = PROJECT / "sunset-cocktail" / "working" / "cutouts"
BACKGROUNDS = ROOT / "working" / "backgrounds"
FINAL = ROOT / "final"

SIZE = 2048
CREAM = "#F7EDDE"
INK = "#171717"
OXBLOOD = "#781F2A"
CORAL = "#E66E58"
PEACH = "#F0A58D"
BLACK = "#090909"

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
SRGB_PROFILE = "/System/Library/ColorSync/Profiles/sRGB Profile.icc"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def fit_square(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGB")
    return ImageOps.fit(image, (SIZE, SIZE), Image.Resampling.LANCZOS)


def save(image: Image.Image, name: str) -> None:
    FINAL.mkdir(parents=True, exist_ok=True)
    output = FINAL / name
    image.convert("RGB").save(
        output,
        format="PNG",
        optimize=True,
    )
    subprocess.run(
        ["sips", "-e", SRGB_PROFILE, str(output)],
        check=True,
        stdout=subprocess.DEVNULL,
    )


def alpha_crop(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    bbox = image.getchannel("A").getbbox()
    return image.crop(bbox)


def scaled(image: Image.Image, height: int) -> Image.Image:
    width = round(image.width * height / image.height)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def add_soft_shadow(
    base: Image.Image,
    center: tuple[int, int],
    radius: tuple[int, int],
    opacity: int = 85,
) -> None:
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    cx, cy = center
    rx, ry = radius
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(30, 11, 8, opacity))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    base.alpha_composite(shadow)


def place_product(
    base: Image.Image,
    product: Image.Image,
    center_x: int,
    bottom_y: int,
    height: int,
    shadow_width: int,
) -> None:
    item = scaled(product, height)
    x = center_x - item.width // 2
    y = bottom_y - item.height
    add_soft_shadow(base, (center_x, bottom_y - 2), (shadow_width, 25))
    base.alpha_composite(item, (x, y))


def stage_products(base: Image.Image, bottle: Image.Image, canister: Image.Image) -> None:
    can = scaled(canister, 1110)
    bottle_scaled = scaled(bottle, 1030)
    add_soft_shadow(base, (1655, 1760), (320, 60), opacity=100)
    base.alpha_composite(can, (1510 - can.width // 2, 1735 - can.height))
    base.alpha_composite(
        bottle_scaled,
        (1280 - bottle_scaled.width // 2, 1785 - bottle_scaled.height),
    )


def draw_featured_packshot(bottle: Image.Image, canister: Image.Image) -> None:
    save(
        fit_square(BACKGROUNDS / "01-featured-packshot-regenerated.png"),
        "01-featured-packshot.png",
    )


def copy_base_frames() -> None:
    mapping = {
        BACKGROUNDS / "02-brand-hero-regenerated.png": "02-brand-hero.png",
        BACKGROUNDS / "03-open-canister-regenerated.png": "03-packaging-reveal.png",
        BACKGROUNDS / "04-material-cap-detail-regenerated.png": "04-material-cap-detail.png",
    }
    for source_path, final_name in mapping.items():
        save(fit_square(source_path), final_name)


def build_lifestyle_frames(bottle: Image.Image) -> None:
    promenade = fit_square(
        BACKGROUNDS / "05-manila-bay-product-interaction-regenerated.png"
    )
    save(promenade, "05-manila-bay-promenade-lifestyle.png")

    handheld = fit_square(BACKGROUNDS / "06-sunset-handheld.png")
    save(handheld, "06-sunset-product-in-hand.png")

    picnic = fit_square(
        BACKGROUNDS / "07-waterfront-mens-social-regenerated.png"
    )
    save(picnic, "07-waterfront-picnic-lifestyle.png")


def draw_profile(bottle: Image.Image, canister: Image.Image) -> None:
    image = fit_square(
        BACKGROUNDS / "08-product-profile-base-regenerated.png"
    ).convert("RGBA")
    draw = ImageDraw.Draw(image)

    x = 120
    draw.text((x, 105), "SUNSET COCKTAIL", font=font(26, True), fill=OXBLOOD)
    draw.multiline_text(
        (x, 172),
        "PRODUCT\nPROFILE",
        font=font(70, True),
        fill=INK,
        spacing=-4,
    )
    draw.rectangle((x, 370, x + 265, 379), fill=CORAL)

    draw.text((x, 460), "50 ML / 1.69 FL. OZ.", font=font(28, True), fill=INK)
    draw.text((x, 518), "MEN'S LINE", font=font(28, True), fill=INK)
    draw.text((x, 640), "VERIFIED DETAILS", font=font(22, True), fill=OXBLOOD)

    details = [
        "CLEAR GLASS BOTTLE",
        "PALE-PEACH LIQUID",
        "GLOSSY BLACK CAP",
        "BLUSH-PINK CANISTER",
    ]
    y = 706
    for detail in details:
        draw.text((x, y), detail, font=font(29, True), fill=INK)
        y += 55

    draw.text((x, 1830), "PRODUCT CODE  P10538", font=font(22, True), fill=OXBLOOD)
    save(image, "08-product-profile-infographic.png")


def draw_ingredients(bottle: Image.Image) -> None:
    image = Image.new("RGBA", (SIZE, SIZE), CREAM)
    draw = ImageDraw.Draw(image)

    left_width = 850
    draw.rectangle((0, 0, left_width, SIZE), fill="#110B0D")
    draw.ellipse((-420, 740, 820, 2220), fill=OXBLOOD)
    draw.rectangle((left_width, 0, left_width + 14, SIZE), fill=CORAL)

    bottle_scaled = scaled(bottle, 1320)
    add_soft_shadow(image, (425, 1770), (245, 55), opacity=120)
    image.alpha_composite(
        bottle_scaled,
        (425 - bottle_scaled.width // 2, 1800 - bottle_scaled.height),
    )

    x = 950
    draw.text((x, 105), "SUNSET COCKTAIL", font=font(26, True), fill=OXBLOOD)
    draw.text((x, 178), "INGREDIENTS", font=font(66, True), fill=INK)
    draw.rectangle((x, 283, x + 315, 292), fill=CORAL)
    draw.text((x, 340), "AS PRINTED ON THE PACKAGE", font=font(23, True), fill=OXBLOOD)

    ingredients_left = [
        "Alcohol",
        "Water (Aqua)",
        "Fragrance (Parfum)",
        "PEG-40 Hydrogenated Castor Oil",
        "Propylene Glycol",
        "Alpha-Isomethyl Ionone",
        "Benzyl Salicylate",
    ]
    ingredients_right = [
        "Linalool",
        "Citronellol",
        "Geraniol",
        "Limonene",
        "Eugenol",
    ]
    for column_x, ingredients in ((x, ingredients_left), (1455, ingredients_right)):
        y = 458
        for ingredient in ingredients:
            draw.text((column_x, y), ingredient, font=font(25), fill=INK)
            y += 54

    draw.line((x, 1110, 1900, 1110), fill="#CFC5B7", width=2)
    draw.text((x, 1165), "PACK DETAILS", font=font(25, True), fill=INK)
    draw.text((x, 1250), "50 ML / 1.69 FL. OZ.", font=font(29, True), fill=INK)
    draw.text((x, 1310), "PRODUCT CODE  P10538", font=font(29, True), fill=INK)
    draw.text((x, 1370), "BARCODE  5056795407284", font=font(29, True), fill=INK)

    draw.rectangle((x, 1660, x + 245, 1718), fill=OXBLOOD)
    draw.text((x + 20, 1672), "FLAMMABLE", font=font(25, True), fill="white")
    draw.text(
        (x, 1760),
        "Keep away from heat and open flame.",
        font=font(29, True),
        fill=INK,
    )
    save(image, "09-ingredients-and-care-infographic.png")


def draw_closing() -> None:
    image = fit_square(SOURCE / "10-sunset-rooftop-closing.png").convert("RGBA")
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for y in range(760):
        alpha = max(0, round(150 * (1 - y / 760)))
        overlay_draw.rectangle((0, y, 1120, y + 1), fill=(62, 9, 19, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(32))
    image.alpha_composite(overlay)

    draw = ImageDraw.Draw(image)
    draw.text((105, 104), "A SCENT JOURNEY", font=font(64, True), fill="white")
    draw.text((108, 190), "SUNSET COCKTAIL", font=font(24, True), fill="#FFD0BF")
    draw.rectangle((108, 238, 315, 247), fill=CORAL)
    save(image, "10-closing-hero.png")


def build_contact_sheet() -> None:
    names = [
        "01-featured-packshot.png",
        "02-brand-hero.png",
        "03-packaging-reveal.png",
        "04-material-cap-detail.png",
        "05-manila-bay-promenade-lifestyle.png",
        "06-sunset-product-in-hand.png",
        "07-waterfront-picnic-lifestyle.png",
        "08-product-profile-infographic.png",
        "09-ingredients-and-care-infographic.png",
        "10-closing-hero.png",
    ]
    labels = [
        "01 Featured Packshot",
        "02 Brand Hero",
        "03 Packaging Reveal",
        "04 Material Detail",
        "05 Manila Bay Lifestyle",
        "06 Sunset Handheld",
        "07 Waterfront Social",
        "08 Product Profile",
        "09 Ingredients and Care",
        "10 Closing Hero",
    ]
    thumb = 620
    header = 72
    gap = 18
    sheet = Image.new(
        "RGB",
        (5 * thumb + 6 * gap, 2 * (thumb + header) + 3 * gap),
        "#171717",
    )
    draw = ImageDraw.Draw(sheet)
    for index, (name, label) in enumerate(zip(names, labels)):
        image = Image.open(FINAL / name).convert("RGB")
        image = ImageOps.fit(image, (thumb, thumb), Image.Resampling.LANCZOS)
        x = gap + (index % 5) * (thumb + gap)
        y = gap + (index // 5) * (thumb + header + gap)
        draw.text((x, y + 18), label, font=font(27, True), fill="white")
        sheet.paste(image, (x, y + header))
    output = ROOT / "contact-sheet.png"
    sheet.save(output, optimize=True)
    subprocess.run(
        ["sips", "-e", SRGB_PROFILE, str(output)],
        check=True,
        stdout=subprocess.DEVNULL,
    )


def main() -> None:
    bottle = alpha_crop(CUTOUTS / "sunset-cocktail-bottle-front-clean-cutout.png")
    canister = alpha_crop(CUTOUTS / "sunset-cocktail-canister-photo-cutout.png")
    draw_featured_packshot(bottle, canister)
    copy_base_frames()
    build_lifestyle_frames(bottle)
    draw_profile(bottle, canister)
    draw_ingredients(bottle)
    draw_closing()
    build_contact_sheet()


if __name__ == "__main__":
    main()
