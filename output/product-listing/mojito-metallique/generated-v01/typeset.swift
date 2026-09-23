import AppKit
import Foundation

let canvasSize = NSSize(width: 2048, height: 2048)
let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)

let ink = NSColor(calibratedRed: 0.075, green: 0.070, blue: 0.065, alpha: 1)
let coral = NSColor(calibratedRed: 0.740, green: 0.105, blue: 0.095, alpha: 1)
let coralLight = NSColor(calibratedRed: 0.985, green: 0.455, blue: 0.355, alpha: 1)
let cream = NSColor(calibratedRed: 0.975, green: 0.944, blue: 0.886, alpha: 1)
let white = NSColor.white
let deepPlum = NSColor(calibratedRed: 0.105, green: 0.035, blue: 0.145, alpha: 0.97)

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
    color: NSColor = ink,
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
    if let shadow {
        attributes[.shadow] = shadow
    }
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
        pixelsWide: Int(canvasSize.width),
        pixelsHigh: Int(canvasSize.height),
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

try render(base: "08-product-profile-base.png", output: "08-product-profile-infographic.png") {
    drawText("MOJITO METALLIQUE", x: 112, y: 122, width: 760, height: 36, size: 23, weight: .bold, color: coral)
    drawText("PRODUCT\nPROFILE", x: 112, y: 178, width: 720, height: 190, size: 76, weight: .bold, lineHeight: 76)
    fillRect(x: 112, y: 385, width: 176, height: 6, color: coral)

    drawText("50 ML / 1.69 FL. OZ.", x: 112, y: 446, width: 700, height: 40, size: 27, weight: .bold)
    drawText("WOMEN'S LINE", x: 112, y: 512, width: 700, height: 40, size: 27, weight: .bold)

    drawText("VERIFIED DETAILS", x: 112, y: 612, width: 700, height: 30, size: 20, weight: .bold, color: coral)
    drawText(
        "CLEAR GLASS BOTTLE\nGOLDEN YELLOW LIQUID\nGLOSSY BLACK CAP\nSILVER COLLAR\nWHITE FRONT LABEL\nBRIGHT YELLOW CANISTER",
        x: 112,
        y: 658,
        width: 760,
        height: 360,
        size: 27,
        weight: .semibold,
        lineHeight: 51
    )

    drawText("PRODUCT CODE", x: 112, y: 1085, width: 270, height: 28, size: 19, weight: .bold, color: coral)
    drawText("P11138", x: 112, y: 1123, width: 500, height: 48, size: 31, weight: .bold)
}

try render(base: "09-ingredients-care-base.png", output: "09-ingredients-and-care-infographic.png") {
    let startX: CGFloat = 1120
    drawText("MOJITO METALLIQUE", x: startX, y: 118, width: 820, height: 36, size: 23, weight: .bold, color: coral)
    drawText("INGREDIENTS", x: startX, y: 176, width: 760, height: 70, size: 52, weight: .bold)
    fillRect(x: startX, y: 262, width: 176, height: 6, color: coral)
    drawText("AS PRINTED ON THE PACKAGE", x: startX, y: 298, width: 740, height: 30, size: 18, weight: .bold, color: coral)

    let leftIngredients = "Alcohol\nWater (Aqua)\nFragrance (Parfum)\nPEG-40 Hydrogenated\nCastor Oil\nPropylene Glycol"
    let rightIngredients = "Linalool\nLimonene\nCoumarin\nAnise Alcohol"
    drawText(leftIngredients, x: startX, y: 356, width: 420, height: 500, size: 21, weight: .medium, lineHeight: 47)
    drawText(rightIngredients, x: 1580, y: 356, width: 390, height: 500, size: 20, weight: .medium, lineHeight: 47)

    fillRect(x: startX, y: 830, width: 750, height: 2, color: NSColor(calibratedWhite: 0.80, alpha: 1))
    drawText("PACK DETAILS", x: startX, y: 880, width: 700, height: 30, size: 20, weight: .bold, color: coral)
    drawText(
        "50 ML / 1.69 FL. OZ.\nPRODUCT CODE  P11138\nBARCODE  5056795407345",
        x: startX,
        y: 928,
        width: 740,
        height: 190,
        size: 23,
        weight: .bold,
        lineHeight: 49
    )

    fillRect(x: startX, y: 1178, width: 184, height: 48, color: coral)
    drawText("FLAMMABLE", x: startX + 17, y: 1187, width: 160, height: 28, size: 17, weight: .bold, color: white)
    drawText("PICTOGRAM PRINTED ON BASE LABEL", x: startX, y: 1260, width: 740, height: 78, size: 20, weight: .semibold, lineHeight: 31)
}

try render(base: "10-closing-hero-base.png", output: "10-closing-hero.png") {
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(0.28)
    shadow.shadowBlurRadius = 11
    shadow.shadowOffset = NSSize(width: 0, height: -2)
    drawText("A SCENT\nJOURNEY", x: 92, y: 94, width: 900, height: 190, size: 74, weight: .bold, color: ink, lineHeight: 76, shadow: shadow)
    drawText("MOJITO METALLIQUE", x: 96, y: 292, width: 760, height: 38, size: 24, weight: .bold, color: coral, shadow: shadow)
    fillRect(x: 96, y: 350, width: 154, height: 6, color: coral)
}

try render(base: "11-scent-description-base.png", output: "11-scent-description-infographic.png") {
    fillRect(x: 0, y: 0, width: 900, height: 2048, color: cream)
    fillRect(x: 900, y: 0, width: 18, height: 2048, color: coral)

    drawText("MOJITO METALLIQUE", x: 112, y: 128, width: 700, height: 36, size: 23, weight: .bold, color: coral)
    drawText("SCENT\nDESCRIPTION", x: 112, y: 188, width: 680, height: 185, size: 68, weight: .bold, lineHeight: 70)
    fillRect(x: 112, y: 404, width: 176, height: 6, color: coral)

    drawText("APPROVED SCENT DESCRIPTION", x: 112, y: 480, width: 680, height: 34, size: 19, weight: .bold, color: coral)
    drawText(
        "Soft, creamy sweetness with a light fruity glow.",
        x: 112,
        y: 554,
        width: 680,
        height: 500,
        size: 52,
        weight: .semibold,
        lineHeight: 66
    )

    drawText("SOURCE", x: 112, y: 1120, width: 220, height: 28, size: 18, weight: .bold, color: coral)
    drawText("DEARBODY BRAND DEEP DIVE / CANVA / PAGE 2", x: 112, y: 1160, width: 650, height: 110, size: 23, weight: .bold, lineHeight: 33)
}

try render(base: "12-who-it-fits-base.png", output: "12-who-it-fits-infographic.png") {
    fillRect(x: 0, y: 0, width: 850, height: 2048, color: deepPlum)
    fillRect(x: 850, y: 0, width: 16, height: 2048, color: coralLight)

    drawText("MOJITO METALLIQUE", x: 92, y: 118, width: 680, height: 36, size: 23, weight: .bold, color: coralLight)
    drawText("WHO\nIT FITS", x: 92, y: 178, width: 650, height: 190, size: 74, weight: .bold, color: white, lineHeight: 75)
    fillRect(x: 92, y: 404, width: 176, height: 6, color: coralLight)

    drawText(
        "For someone drawn to soft, creamy sweetness and a light fruity glow.",
        x: 92,
        y: 492,
        width: 650,
        height: 590,
        size: 42,
        weight: .semibold,
        color: white,
        lineHeight: 55
    )

    drawText("SOFT\nCREAMY\nGLOWING", x: 92, y: 1175, width: 650, height: 220, size: 27, weight: .bold, color: coralLight, lineHeight: 50)
}
