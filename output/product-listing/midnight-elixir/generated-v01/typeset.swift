import AppKit
import Foundation

let canvasSize = NSSize(width: 2048, height: 2048)
let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)

let ink = NSColor(calibratedRed: 0.075, green: 0.070, blue: 0.065, alpha: 1)
let coral = NSColor(calibratedRed: 0.865, green: 0.285, blue: 0.205, alpha: 1)
let cream = NSColor(calibratedRed: 0.965, green: 0.902, blue: 0.808, alpha: 1)
let white = NSColor.white

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
    drawText("MIDNIGHT ELIXIR", x: 112, y: 122, width: 700, height: 36, size: 23, weight: .bold, color: coral)
    drawText("PRODUCT\nPROFILE", x: 112, y: 178, width: 720, height: 190, size: 76, weight: .bold, lineHeight: 76)
    fillRect(x: 112, y: 385, width: 176, height: 6, color: coral)

    drawText("50 ML / 1.69 FL. OZ.", x: 112, y: 446, width: 700, height: 40, size: 27, weight: .bold)
    drawText("MEN'S LINE", x: 112, y: 512, width: 700, height: 40, size: 27, weight: .bold)

    drawText("VERIFIED DETAILS", x: 112, y: 612, width: 700, height: 30, size: 20, weight: .bold, color: coral)
    drawText(
        "CLEAR GLASS BOTTLE\nPALE ICE-BLUE LIQUID\nGLOSSY BLACK CAP\nSILVER COLLAR\nBLACK FRONT LABEL\nSLATE-PERIWINKLE CANISTER",
        x: 112,
        y: 658,
        width: 760,
        height: 360,
        size: 27,
        weight: .semibold,
        lineHeight: 51
    )

    drawText("PRODUCT CODE", x: 112, y: 1085, width: 270, height: 28, size: 19, weight: .bold, color: coral)
    drawText("P10138", x: 112, y: 1123, width: 500, height: 48, size: 31, weight: .bold)
}

try render(base: "09-ingredients-care-base.png", output: "09-ingredients-and-care-infographic.png") {
    let startX: CGFloat = 875
    drawText("MIDNIGHT ELIXIR", x: startX, y: 118, width: 900, height: 36, size: 23, weight: .bold, color: coral)
    drawText("INGREDIENTS", x: startX, y: 176, width: 1000, height: 70, size: 55, weight: .bold)
    fillRect(x: startX, y: 262, width: 176, height: 6, color: coral)
    drawText("AS PRINTED ON THE PACKAGE", x: startX, y: 298, width: 900, height: 30, size: 18, weight: .bold, color: coral)

    let leftIngredients = "Alcohol\nWater (Aqua)\nFragrance (Parfum)\nPEG-40 Hydrogenated Castor Oil\nPropylene Glycol\nLinalool"
    let rightIngredients = "Limonene\nCoumarin\nCitronellol\nCitral\nGeraniol"
    drawText(leftIngredients, x: startX, y: 356, width: 520, height: 500, size: 24, weight: .medium, lineHeight: 55)
    drawText(rightIngredients, x: 1430, y: 356, width: 510, height: 500, size: 24, weight: .medium, lineHeight: 55)

    fillRect(x: startX, y: 870, width: 1040, height: 2, color: NSColor(calibratedWhite: 0.80, alpha: 1))
    drawText("PACK DETAILS", x: startX, y: 920, width: 900, height: 30, size: 20, weight: .bold, color: coral)
    drawText(
        "50 ML / 1.69 FL. OZ.\nPRODUCT CODE  P10138\nBARCODE  5056795407246",
        x: startX,
        y: 968,
        width: 1000,
        height: 190,
        size: 25,
        weight: .bold,
        lineHeight: 52
    )

    fillRect(x: startX, y: 1225, width: 184, height: 48, color: coral)
    drawText("FLAMMABLE", x: startX + 17, y: 1234, width: 160, height: 28, size: 17, weight: .bold, color: white)
    drawText("Keep away from heat and open flame.", x: startX, y: 1308, width: 990, height: 44, size: 23, weight: .semibold)
}

try render(base: "10-closing-hero-base.png", output: "10-closing-hero.png") {
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(0.28)
    shadow.shadowBlurRadius = 11
    shadow.shadowOffset = NSSize(width: 0, height: -2)
    drawText("A SCENT JOURNEY", x: 92, y: 94, width: 980, height: 100, size: 74, weight: .bold, color: white, shadow: shadow)
    drawText("MIDNIGHT ELIXIR", x: 96, y: 210, width: 650, height: 38, size: 24, weight: .bold, color: coral, shadow: shadow)
    fillRect(x: 96, y: 266, width: 154, height: 6, color: coral)
}

try render(base: "11-scent-description-base.png", output: "11-scent-description-infographic.png") {
    fillRect(x: 0, y: 0, width: 808, height: 2048, color: cream)
    fillRect(x: 808, y: 0, width: 18, height: 2048, color: coral)

    drawText("MIDNIGHT ELIXIR", x: 112, y: 128, width: 620, height: 36, size: 23, weight: .bold, color: coral)
    drawText("SCENT\nDESCRIPTION", x: 112, y: 188, width: 620, height: 185, size: 70, weight: .bold, lineHeight: 72)
    fillRect(x: 112, y: 404, width: 176, height: 6, color: coral)

    drawText("OFFICIAL PRODUCT DESCRIPTION", x: 112, y: 480, width: 620, height: 34, size: 19, weight: .bold, color: coral)
    drawText(
        "Midnight Elixir is fresh, powerful, and sophisticated, with a refined trail that moves naturally from sparkling citrus to aromatic woods.",
        x: 112,
        y: 554,
        width: 590,
        height: 560,
        size: 47,
        weight: .semibold,
        lineHeight: 61
    )

    drawText("SOURCE", x: 112, y: 1210, width: 220, height: 28, size: 18, weight: .bold, color: coral)
    drawText("DEARBODY OFFICIAL PRODUCT PUBLICATION", x: 112, y: 1250, width: 580, height: 110, size: 23, weight: .bold, lineHeight: 33)
}

try render(base: "12-who-it-fits-base.png", output: "12-who-it-fits-infographic.png") {
    fillRect(x: 0, y: 0, width: 660, height: 2048, color: NSColor(calibratedWhite: 0.045, alpha: 0.95))
    fillRect(x: 660, y: 0, width: 16, height: 2048, color: coral)

    drawText("MIDNIGHT ELIXIR", x: 92, y: 118, width: 500, height: 36, size: 23, weight: .bold, color: coral)
    drawText("WHO\nIT FITS", x: 92, y: 178, width: 500, height: 190, size: 74, weight: .bold, color: white, lineHeight: 75)
    fillRect(x: 92, y: 404, width: 176, height: 6, color: coral)

    drawText(
        "For someone drawn to crisp energy, refined confidence, and a clean yet intense aromatic-woody profile.",
        x: 92,
        y: 492,
        width: 500,
        height: 590,
        size: 40,
        weight: .semibold,
        color: white,
        lineHeight: 53
    )

    drawText("ENERGETIC\nREFINED\nCONFIDENT", x: 92, y: 1195, width: 500, height: 220, size: 26, weight: .bold, color: coral, lineHeight: 50)
}
