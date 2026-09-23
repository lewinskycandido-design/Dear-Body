import AppKit
import Foundation

let directory = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let names = [
    "01-featured-packshot.png",
    "02-brand-hero.png",
    "03-packaging-reveal.png",
    "04-material-cap-detail.png",
    "05-architect-plaza-lifestyle.png",
    "06-drafting-table-handheld.png",
    "07-model-studio-social.png"
]

for name in names {
    let url = directory.appendingPathComponent(name)
    guard let source = NSImage(contentsOf: url),
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
        throw NSError(domain: "Reencode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot load \(name)"])
    }

    bitmap.size = NSSize(width: 2048, height: 2048)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    source.draw(
        in: NSRect(x: 0, y: 0, width: 2048, height: 2048),
        from: .zero,
        operation: .copy,
        fraction: 1
    )
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "Reencode", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot encode \(name)"])
    }
    try data.write(to: url)
}
