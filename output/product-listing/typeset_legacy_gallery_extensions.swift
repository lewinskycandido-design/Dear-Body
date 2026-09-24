import AppKit
import Foundation

struct ExtensionConfig {
    let scent: String
    let accent: NSColor
    let dark: NSColor
    let cream: NSColor
    let description: String
    let fit: String
    let traits: [String]
    let lifestyleFile: String
}

let configs: [String: ExtensionConfig] = [
    "citrus-wish": ExtensionConfig(
        scent: "CITRUS WISH",
        accent: NSColor(calibratedRed: 0.88, green: 0.25, blue: 0.18, alpha: 1),
        dark: NSColor(calibratedRed: 0.05, green: 0.11, blue: 0.18, alpha: 1),
        cream: NSColor(calibratedRed: 0.98, green: 0.94, blue: 0.84, alpha: 1),
        description: "Citrus Wish is simple, modern, and effortlessly wearable, balancing vivid fruit with gentle florals and refined woods.",
        fit: "For someone drawn to bright energy, modern ease, and a polished finish.",
        traits: ["BRIGHT", "MODERN", "EFFORTLESS"],
        lifestyleFile: "07-basketball-court-lifestyle.png"
    ),
    "ivory-reverie": ExtensionConfig(
        scent: "IVORY REVERIE",
        accent: NSColor(calibratedRed: 0.02, green: 0.56, blue: 0.58, alpha: 1),
        dark: NSColor(calibratedRed: 0.04, green: 0.13, blue: 0.18, alpha: 1),
        cream: NSColor(calibratedRed: 0.97, green: 0.93, blue: 0.84, alpha: 1),
        description: "Ivory Reverie is minimalist yet memorable, with a serene balance of rose, dew, and clean musk.",
        fit: "For someone drawn to quiet elegance, clean softness, and serene detail.",
        traits: ["SERENE", "REFINED", "GENTLE"],
        lifestyleFile: "07-bowling-social-lifestyle.png"
    ),
    "moonlight-velvet": ExtensionConfig(
        scent: "MOONLIGHT VELVET",
        accent: NSColor(calibratedRed: 0.70, green: 0.18, blue: 0.22, alpha: 1),
        dark: NSColor(calibratedRed: 0.11, green: 0.06, blue: 0.13, alpha: 1),
        cream: NSColor(calibratedRed: 0.97, green: 0.92, blue: 0.86, alpha: 1),
        description: "Moonlight Velvet is sophisticated, sensual, and beautifully balanced, moving from luminous spice to dark florals and soft woods.",
        fit: "For someone drawn to luminous spice, graceful depth, and an enveloping sense of style.",
        traits: ["LUMINOUS", "GRACEFUL", "DEEP"],
        lifestyleFile: "07-record-cafe-bag-still-life.png"
    ),
    "sunset-cocktail": ExtensionConfig(
        scent: "SUNSET COCKTAIL",
        accent: NSColor(calibratedRed: 0.89, green: 0.28, blue: 0.20, alpha: 1),
        dark: NSColor(calibratedRed: 0.17, green: 0.05, blue: 0.08, alpha: 1),
        cream: NSColor(calibratedRed: 0.98, green: 0.92, blue: 0.84, alpha: 1),
        description: "Sunset Cocktail moves beautifully from fresh spice to sophisticated florals and warm chypre notes.",
        fit: "For someone drawn to radiant polish, graceful warmth, and memorable style.",
        traits: ["POLISHED", "GRACEFUL", "MEMORABLE"],
        lifestyleFile: "07-waterfront-picnic-lifestyle.png"
    )
]

guard CommandLine.arguments.count == 2 else {
    fputs("Usage: typeset_legacy_gallery_extensions.swift /path/to/gallery\n", stderr)
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

func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, color: NSColor) {
    color.setFill()
    NSBezierPath(rect: rectFromTop(x: x, y: y, width: width, height: height)).fill()
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

func render(sourceURL: URL, output: String, drawSource: (NSImage) -> Void, overlay: () -> Void) throws {
    guard let source = NSImage(contentsOf: sourceURL) else {
        throw NSError(domain: "GalleryExtension", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot load \(sourceURL.path)"])
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
        throw NSError(domain: "GalleryExtension", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot create bitmap context"])
    }

    bitmap.size = canvasSize
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    drawSource(source)
    overlay()
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "GalleryExtension", code: 3, userInfo: [NSLocalizedDescriptionKey: "Cannot encode PNG"])
    }
    try data.write(to: root.appendingPathComponent("final").appendingPathComponent(output))
}

let finalDirectory = root.appendingPathComponent("final")
let packshot = finalDirectory.appendingPathComponent("01-featured-packshot.png")
let lifestyle = finalDirectory.appendingPathComponent(config.lifestyleFile)

try render(sourceURL: packshot, output: "11-scent-description-infographic.png", drawSource: { source in
    source.draw(
        in: NSRect(x: 760, y: 0, width: 1288, height: 2048),
        from: NSRect(x: 320, y: 0, width: 1408, height: 2048),
        operation: .copy,
        fraction: 1
    )
}) {
    fillRect(x: 0, y: 0, width: 760, height: 2048, color: config.cream)
    fillRect(x: 760, y: 0, width: 16, height: 2048, color: config.accent)
    drawText(config.scent, x: 100, y: 118, width: 570, height: 38, size: 22, weight: .bold, color: config.accent)
    drawText("SCENT\nDESCRIPTION", x: 100, y: 184, width: 570, height: 190, size: 62, weight: .bold, color: config.dark, lineHeight: 65)
    fillRect(x: 100, y: 410, width: 176, height: 6, color: config.accent)
    drawText("APPROVED BRAND DESCRIPTION", x: 100, y: 478, width: 570, height: 32, size: 17, weight: .bold, color: config.accent)
    drawText(config.description, x: 100, y: 550, width: 560, height: 720, size: 43, weight: .semibold, color: config.dark, lineHeight: 57)
    drawText("SOURCE", x: 100, y: 1450, width: 220, height: 28, size: 17, weight: .bold, color: config.accent)
    drawText("DEARBODY OFFICIAL SCENT PAGE", x: 100, y: 1490, width: 540, height: 100, size: 22, weight: .bold, color: config.dark, lineHeight: 33)
}

try render(sourceURL: lifestyle, output: "12-who-it-fits-infographic.png", drawSource: { source in
    source.draw(in: NSRect(origin: .zero, size: canvasSize), from: .zero, operation: .copy, fraction: 1)
}) {
    let panelX: CGFloat = 1360
    fillRect(x: panelX, y: 0, width: 688, height: 2048, color: config.dark.withAlphaComponent(0.96))
    fillRect(x: panelX, y: 0, width: 16, height: 2048, color: config.accent)
    let x: CGFloat = 1434
    drawText(config.scent, x: x, y: 118, width: 530, height: 70, size: 21, weight: .bold, color: config.accent)
    drawText("WHO\nIT FITS", x: x, y: 202, width: 520, height: 190, size: 67, weight: .bold, color: .white, lineHeight: 69)
    fillRect(x: x, y: 420, width: 176, height: 6, color: config.accent)
    drawText(config.fit, x: x, y: 500, width: 500, height: 560, size: 38, weight: .semibold, color: .white, lineHeight: 51)
    drawText(config.traits.joined(separator: "\n"), x: x, y: 1180, width: 500, height: 260, size: 24, weight: .bold, color: config.accent, lineHeight: 48)
}

print("Wrote frames 11 and 12 for \(config.scent)")
