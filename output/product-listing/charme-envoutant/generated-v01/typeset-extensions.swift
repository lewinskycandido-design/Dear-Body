import AppKit
import Foundation

let canvasSize = NSSize(width: 2048, height: 2048)
let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)

let ink = NSColor(calibratedRed: 0.075, green: 0.070, blue: 0.065, alpha: 1)
let orange = NSColor(calibratedRed: 1.000, green: 0.260, blue: 0.055, alpha: 1)
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
    lineHeight: CGFloat? = nil
) {
    let style = NSMutableParagraphStyle()
    style.alignment = .left
    if let lineHeight {
        style.minimumLineHeight = lineHeight
        style.maximumLineHeight = lineHeight
    }
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font(size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: style,
        .kern: 0
    ]
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
        throw NSError(domain: "TypesetExtensions", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot load \(baseURL.path)"])
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
        throw NSError(domain: "TypesetExtensions", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot create bitmap context"])
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
        throw NSError(domain: "TypesetExtensions", code: 3, userInfo: [NSLocalizedDescriptionKey: "Cannot encode PNG"])
    }
    try data.write(to: root.appendingPathComponent("final").appendingPathComponent(output))
}

try render(base: "11-scent-description-base.png", output: "11-scent-description-infographic.png") {
    fillRect(x: 0, y: 0, width: 808, height: 2048, color: cream)
    fillRect(x: 808, y: 0, width: 18, height: 2048, color: orange)

    drawText("CHARME ENVOÛTANT", x: 112, y: 128, width: 620, height: 36, size: 23, weight: .bold, color: orange)
    drawText("SCENT\nDESCRIPTION", x: 112, y: 188, width: 620, height: 185, size: 70, weight: .bold, lineHeight: 72)
    fillRect(x: 112, y: 404, width: 176, height: 6, color: orange)

    drawText("APPROVED BRAND DESCRIPTION", x: 112, y: 480, width: 620, height: 34, size: 19, weight: .bold, color: orange)
    drawText(
        "Rich, spiced sweetness that feels deep and indulgent.",
        x: 112,
        y: 554,
        width: 590,
        height: 510,
        size: 52,
        weight: .semibold,
        lineHeight: 66
    )

    drawText("SOURCE", x: 112, y: 1150, width: 220, height: 28, size: 18, weight: .bold, color: orange)
    drawText("DEAR BODY BRAND DEEP DIVE", x: 112, y: 1190, width: 580, height: 90, size: 24, weight: .bold, lineHeight: 34)
}

try render(base: "12-who-it-fits-base.png", output: "12-who-it-fits-infographic.png") {
    fillRect(x: 0, y: 0, width: 650, height: 2048, color: NSColor(calibratedWhite: 0.055, alpha: 0.94))
    fillRect(x: 650, y: 0, width: 16, height: 2048, color: orange)

    drawText("CHARME ENVOÛTANT", x: 92, y: 118, width: 500, height: 36, size: 23, weight: .bold, color: orange)
    drawText("WHO\nIT FITS", x: 92, y: 178, width: 500, height: 190, size: 74, weight: .bold, color: white, lineHeight: 75)
    fillRect(x: 92, y: 404, width: 176, height: 6, color: orange)

    drawText(
        "For someone drawn to warm depth, expressive style, and an indulgent finishing touch.",
        x: 92,
        y: 492,
        width: 500,
        height: 540,
        size: 41,
        weight: .semibold,
        color: white,
        lineHeight: 54
    )

    drawText("EXPRESSIVE\nWARM\nPOLISHED", x: 92, y: 1165, width: 500, height: 220, size: 26, weight: .bold, color: orange, lineHeight: 50)
}
