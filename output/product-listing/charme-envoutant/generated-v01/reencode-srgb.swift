import AppKit
import Foundation

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
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
    throw NSError(domain: "Reencode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot load \(inputURL.path)"])
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
    throw NSError(domain: "Reencode", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot encode \(inputURL.path)"])
}
try data.write(to: inputURL)
