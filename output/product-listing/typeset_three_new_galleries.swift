import AppKit
import Foundation

struct GalleryConfig {
    let scent: String
    let accent: NSColor
    let dark: NSColor
    let cream: NSColor
    let liquid: String
    let canister: String
    let productCode: String
    let barcode: String
    let ingredients: [String]
    let description: String
    let fit: String
    let traits: [String]
    let frame07: String
}

let configs: [String: GalleryConfig] = [
    "alpine-rosemary-mint": GalleryConfig(
        scent: "ALPINE ROSEMARY MINT",
        accent: NSColor(calibratedRed: 0.92, green: 0.31, blue: 0.24, alpha: 1),
        dark: NSColor(calibratedRed: 0.06, green: 0.14, blue: 0.15, alpha: 1),
        cream: NSColor(calibratedRed: 0.97, green: 0.93, blue: 0.84, alpha: 1),
        liquid: "TURQUOISE LIQUID",
        canister: "TURQUOISE CANISTER",
        productCode: "P10838",
        barcode: "5056795407314",
        ingredients: [
            "Alcohol", "Water (Aqua)", "Fragrance (Parfum)",
            "PEG-40 Hydrogenated Castor Oil", "Propylene Glycol",
            "Benzyl Salicylate", "Linalool", "Limonene", "Coumarin",
            "Citronellol", "Alpha-Isomethyl Ionone", "Citral", "Eugenol",
            "Geraniol", "Cinnamal"
        ],
        description: "Oceanic freshness, aromatic greenery, and refined woods.",
        fit: "For someone who likes fresh energy, easy movement, and polished everyday style.",
        traits: ["FRESH ENERGY", "EASY MOVEMENT", "POLISHED"],
        frame07: "07-court-bench-still-life.png"
    ),
    "noir-cedar": GalleryConfig(
        scent: "NOIR CEDAR",
        accent: NSColor(calibratedRed: 0.92, green: 0.30, blue: 0.20, alpha: 1),
        dark: NSColor(calibratedRed: 0.06, green: 0.09, blue: 0.15, alpha: 1),
        cream: NSColor(calibratedRed: 0.97, green: 0.91, blue: 0.82, alpha: 1),
        liquid: "PALE AQUA-CLEAR LIQUID",
        canister: "NAVY CANISTER",
        productCode: "P11238",
        barcode: "5056795407352",
        ingredients: [
            "Alcohol", "Water (Aqua)", "Fragrance (Parfum)",
            "PEG-40 Hydrogenated Castor Oil", "Propylene Glycol", "Limonene",
            "Hexyl Cinnamal", "Coumarin", "Linalool", "Eugenol",
            "Alpha-Isomethyl Ionone", "Cinnamyl Alcohol", "Citral",
            "Citronellol", "Benzyl Benzoate", "Cinnamal"
        ],
        description: "Bright citrus, spiced cocoa, and smooth woods.",
        fit: "For someone drawn to lively evenings, warm contrast, and confident, playful polish.",
        traits: ["LIVELY", "WARM CONTRAST", "PLAYFUL POLISH"],
        frame07: "07-terrace-still-life.png"
    ),
    "seaside-cotton": GalleryConfig(
        scent: "SEASIDE COTTON",
        accent: NSColor(calibratedRed: 0.92, green: 0.33, blue: 0.23, alpha: 1),
        dark: NSColor(calibratedRed: 0.04, green: 0.13, blue: 0.22, alpha: 1),
        cream: NSColor(calibratedRed: 0.98, green: 0.94, blue: 0.86, alpha: 1),
        liquid: "AQUA-BLUE LIQUID",
        canister: "BRIGHT BLUE CANISTER",
        productCode: "P10938",
        barcode: "5056795407321",
        ingredients: [
            "Alcohol", "Water (Aqua)", "Fragrance (Parfum)",
            "PEG-40 Hydrogenated Castor Oil", "Propylene Glycol", "Linalool",
            "Limonene", "Hexyl Cinnamal", "Benzyl Salicylate",
            "Alpha-Isomethyl Ionone", "Citronellol", "Coumarin", "Citral",
            "Geraniol", "Amyl Cinnamal"
        ],
        description: "Sparkling citrus, aquatic greens, and soft, lasting warmth.",
        fit: "For someone who likes clean ease, coastal light, and relaxed everyday warmth.",
        traits: ["CLEAN EASE", "COASTAL LIGHT", "RELAXED WARMTH"],
        frame07: "07-coastal-tote-still-life.png"
    )
]

guard CommandLine.arguments.count == 2 else {
    fputs("Usage: typeset_three_new_galleries.swift /path/to/generated-v01\n", stderr)
    exit(2)
}

let canvasSize = NSSize(width: 2048, height: 2048)
let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let slug = root.deletingLastPathComponent().lastPathComponent
guard let config = configs[slug] else {
    fputs("Unknown gallery slug: \(slug)\n", stderr)
    exit(2)
}

func font(_ size: CGFloat, weight: NSFont.Weight = .regular) -> NSFont {
    NSFont.systemFont(ofSize: size, weight: weight)
}

func rectFromTop(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasSize.height - y - height, width: width, height: height)
}

func drawText(
    _ text: String,
    x: CGFloat,
    y: CGFloat,
    width: CGFloat,
    height: CGFloat,
    size: CGFloat,
    weight: NSFont.Weight = .regular,
    color: NSColor,
    lineHeight: CGFloat? = nil,
    shadow: NSShadow? = nil
) {
    let style = NSMutableParagraphStyle()
    style.alignment = .left
    if let lineHeight {
        style.minimumLineHeight = lineHeight
        style.maximumLineHeight = lineHeight
    }
    var attributes: [NSAttributedString.Key: Any] = [
        .font: font(size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: style,
        .kern: 0
    ]
    if let shadow { attributes[.shadow] = shadow }
    (text as NSString).draw(
        with: rectFromTop(x: x, y: y, width: width, height: height),
        options: [.usesLineFragmentOrigin, .usesFontLeading],
        attributes: attributes
    )
}

func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, color: NSColor) {
    color.setFill()
    NSBezierPath(rect: rectFromTop(x: x, y: y, width: width, height: height)).fill()
}

func render(base: String, output: String, overlay: () -> Void) throws {
    let baseURL = root.appendingPathComponent("working").appendingPathComponent(base)
    guard let source = NSImage(contentsOf: baseURL) else {
        throw NSError(domain: "Typeset", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot load \(baseURL.path)"])
    }
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: 2048,
        pixelsHigh: 2048,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .calibratedRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ), let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
        throw NSError(domain: "Typeset", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot create bitmap context"])
    }

    bitmap.size = canvasSize
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    source.draw(in: NSRect(origin: .zero, size: canvasSize), from: .zero, operation: .copy, fraction: 1)
    overlay()
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "Typeset", code: 3, userInfo: [NSLocalizedDescriptionKey: "Cannot encode PNG"])
    }
    try data.write(to: root.appendingPathComponent("final").appendingPathComponent(output))
}

let white = NSColor.white

try render(base: "01-featured-packshot.png", output: "08-product-profile-infographic.png") {
    fillRect(x: 1060, y: 0, width: 988, height: 2048, color: config.cream.withAlphaComponent(0.97))
    fillRect(x: 1060, y: 0, width: 16, height: 2048, color: config.accent)
    let x: CGFloat = 1140
    drawText(config.scent, x: x, y: 118, width: 790, height: 36, size: 22, weight: .bold, color: config.accent)
    drawText("PRODUCT\nPROFILE", x: x, y: 176, width: 780, height: 170, size: 66, weight: .bold, color: config.dark, lineHeight: 68)
    fillRect(x: x, y: 374, width: 174, height: 6, color: config.accent)
    drawText("50 ML / 1.69 FL. OZ.", x: x, y: 430, width: 780, height: 40, size: 27, weight: .bold, color: config.dark)
    drawText("WOMEN'S LINE", x: x, y: 488, width: 780, height: 40, size: 27, weight: .bold, color: config.dark)
    drawText("VERIFIED DETAILS", x: x, y: 584, width: 760, height: 30, size: 19, weight: .bold, color: config.accent)
    let details = [
        "CLEAR CYLINDRICAL GLASS BOTTLE",
        config.liquid,
        "GLOSSY BLACK MAGNETIC CAP",
        "SILVER METAL COLLAR",
        "WHITE FRONT LABEL",
        config.canister,
        "SOLID BLACK CANISTER TOP"
    ].joined(separator: "\n")
    drawText(details, x: x, y: 632, width: 790, height: 440, size: 25, weight: .semibold, color: config.dark, lineHeight: 50)
    drawText("PRODUCT CODE", x: x, y: 1118, width: 320, height: 28, size: 18, weight: .bold, color: config.accent)
    drawText(config.productCode, x: x, y: 1157, width: 500, height: 46, size: 31, weight: .bold, color: config.dark)
}

try render(base: "01-featured-packshot.png", output: "09-ingredients-and-care-infographic.png") {
    fillRect(x: 0, y: 0, width: 1240, height: 2048, color: config.cream.withAlphaComponent(0.97))
    fillRect(x: 1224, y: 0, width: 16, height: 2048, color: config.accent)
    let x: CGFloat = 94
    drawText(config.scent, x: x, y: 112, width: 1030, height: 36, size: 22, weight: .bold, color: config.accent)
    drawText("INGREDIENTS", x: x, y: 170, width: 1040, height: 70, size: 58, weight: .bold, color: config.dark)
    fillRect(x: x, y: 257, width: 174, height: 6, color: config.accent)
    drawText("AS PRINTED ON THE PACKAGE", x: x, y: 292, width: 900, height: 30, size: 18, weight: .bold, color: config.accent)

    let split = (config.ingredients.count + 1) / 2
    let left = config.ingredients[..<split].joined(separator: "\n")
    let right = config.ingredients[split...].joined(separator: "\n")
    drawText(left, x: x, y: 350, width: 520, height: 700, size: 21, weight: .medium, color: config.dark, lineHeight: 47)
    drawText(right, x: 630, y: 350, width: 510, height: 700, size: 21, weight: .medium, color: config.dark, lineHeight: 47)

    fillRect(x: x, y: 1010, width: 1040, height: 2, color: config.dark.withAlphaComponent(0.20))
    drawText("PACK DETAILS", x: x, y: 1060, width: 900, height: 30, size: 19, weight: .bold, color: config.accent)
    drawText("50 ML / 1.69 FL. OZ.\nPRODUCT CODE  \(config.productCode)\nBARCODE  \(config.barcode)", x: x, y: 1108, width: 1010, height: 190, size: 25, weight: .bold, color: config.dark, lineHeight: 52)
    fillRect(x: x, y: 1370, width: 184, height: 48, color: config.accent)
    drawText("FLAMMABLE", x: x + 16, y: 1379, width: 160, height: 28, size: 17, weight: .bold, color: white)
    drawText("Keep away from heat and open flame.", x: x, y: 1452, width: 1020, height: 44, size: 23, weight: .semibold, color: config.dark)
}

try render(base: "10-closing-hero-base.png", output: "10-closing-hero.png") {
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(0.34)
    shadow.shadowBlurRadius = 12
    shadow.shadowOffset = NSSize(width: 0, height: -2)
    drawText("A SCENT JOURNEY", x: 92, y: 92, width: 1100, height: 100, size: 73, weight: .bold, color: white, shadow: shadow)
    drawText(config.scent, x: 96, y: 210, width: 920, height: 38, size: 23, weight: .bold, color: config.accent, shadow: shadow)
    fillRect(x: 96, y: 266, width: 154, height: 6, color: config.accent)
}

try render(base: "11-scent-description-base.png", output: "11-scent-description-infographic.png") {
    fillRect(x: 0, y: 0, width: 840, height: 2048, color: config.cream)
    fillRect(x: 840, y: 0, width: 16, height: 2048, color: config.accent)
    drawText(config.scent, x: 108, y: 126, width: 650, height: 36, size: 22, weight: .bold, color: config.accent)
    drawText("SCENT\nDESCRIPTION", x: 108, y: 188, width: 650, height: 185, size: 66, weight: .bold, color: config.dark, lineHeight: 69)
    fillRect(x: 108, y: 404, width: 176, height: 6, color: config.accent)
    drawText("APPROVED BRAND DESCRIPTION", x: 108, y: 480, width: 640, height: 34, size: 18, weight: .bold, color: config.accent)
    drawText(config.description, x: 108, y: 554, width: 620, height: 500, size: 51, weight: .semibold, color: config.dark, lineHeight: 66)
    drawText("SOURCE", x: 108, y: 1140, width: 220, height: 28, size: 18, weight: .bold, color: config.accent)
    drawText("DEARBODY OFFICIAL SCENT PAGE", x: 108, y: 1180, width: 610, height: 90, size: 23, weight: .bold, color: config.dark, lineHeight: 34)
}

try render(base: config.frame07, output: "12-who-it-fits-infographic.png") {
    let panelX: CGFloat = 1360
    fillRect(x: panelX, y: 0, width: 688, height: 2048, color: config.dark.withAlphaComponent(0.95))
    fillRect(x: panelX, y: 0, width: 16, height: 2048, color: config.accent)
    let x: CGFloat = 1434
    drawText(config.scent, x: x, y: 118, width: 530, height: 70, size: 21, weight: .bold, color: config.accent)
    drawText("WHO\nIT FITS", x: x, y: 202, width: 520, height: 190, size: 67, weight: .bold, color: white, lineHeight: 69)
    fillRect(x: x, y: 420, width: 176, height: 6, color: config.accent)
    drawText(config.fit, x: x, y: 500, width: 500, height: 540, size: 38, weight: .semibold, color: white, lineHeight: 51)
    drawText(config.traits.joined(separator: "\n"), x: x, y: 1160, width: 500, height: 260, size: 24, weight: .bold, color: config.accent, lineHeight: 48)
}
