import AppKit
import Foundation

guard CommandLine.arguments.count == 3 else {
    fputs("Usage: apply_magnetic_cap_badge.swift INPUT OUTPUT\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let size = NSSize(width: 2048, height: 2048)

guard let source = NSImage(contentsOf: inputURL),
      let bitmap = NSBitmapImageRep(
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
      ),
      let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
    fputs("Unable to prepare image.\n", stderr)
    exit(1)
}

bitmap.size = size
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context
context.imageInterpolation = NSImageInterpolation.high
source.draw(in: NSRect(origin: .zero, size: size), from: .zero, operation: .copy, fraction: 1)

let panel = NSBezierPath(roundedRect: NSRect(x: 106, y: 2048 - 106 - 164, width: 590, height: 164), xRadius: 8, yRadius: 8)
NSColor(calibratedWhite: 0.035, alpha: 0.86).setFill()
panel.fill()

let accent = NSBezierPath(rect: NSRect(x: 106, y: 2048 - 106 - 164, width: 12, height: 164))
NSColor(calibratedRed: 0.93, green: 0.39, blue: 0.26, alpha: 1).setFill()
accent.fill()

let titleStyle = NSMutableParagraphStyle()
titleStyle.alignment = .left
let titleAttributes: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: 42, weight: .bold),
    .foregroundColor: NSColor.white,
    .paragraphStyle: titleStyle,
    .kern: 0
]
("MAGNETIC CAP" as NSString).draw(
    with: NSRect(x: 148, y: 2048 - 153 - 54, width: 500, height: 58),
    options: [.usesLineFragmentOrigin, .usesFontLeading],
    attributes: titleAttributes
)

let detailAttributes: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: 25, weight: .medium),
    .foregroundColor: NSColor(calibratedWhite: 0.93, alpha: 1),
    .paragraphStyle: titleStyle,
    .kern: 0
]
("SECURE SNAP-ON CLOSURE" as NSString).draw(
    with: NSRect(x: 148, y: 2048 - 217 - 38, width: 500, height: 40),
    options: [.usesLineFragmentOrigin, .usesFontLeading],
    attributes: detailAttributes
)

context.flushGraphics()
NSGraphicsContext.restoreGraphicsState()

guard let data = bitmap.representation(using: NSBitmapImageRep.FileType.png, properties: [:]) else {
    fputs("Unable to encode PNG.\n", stderr)
    exit(1)
}

try data.write(to: outputURL)
