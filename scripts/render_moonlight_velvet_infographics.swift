import AppKit
import Foundation

let canvas = CGSize(width: 2048, height: 2048)
let cream = NSColor(calibratedRed: 248 / 255, green: 241 / 255, blue: 230 / 255, alpha: 1)
let ink = NSColor(calibratedRed: 23 / 255, green: 22 / 255, blue: 25 / 255, alpha: 1)
let coral = NSColor(calibratedRed: 222 / 255, green: 89 / 255, blue: 68 / 255, alpha: 1)
let lilac = NSColor(calibratedRed: 195 / 255, green: 184 / 255, blue: 232 / 255, alpha: 1)

enum RenderError: Error {
    case missingImage(String)
    case encode(String)
}

func topRect(_ x: CGFloat, _ y: CGFloat, _ width: CGFloat, _ height: CGFloat) -> NSRect {
    NSRect(x: x, y: canvas.height - y - height, width: width, height: height)
}

func load(_ path: String) throws -> NSImage {
    guard let image = NSImage(contentsOfFile: path) else { throw RenderError.missingImage(path) }
    return image
}

func font(_ size: CGFloat, bold: Bool = false) -> NSFont {
    NSFont(name: bold ? "HelveticaNeue-Bold" : "HelveticaNeue", size: size)
        ?? NSFont.systemFont(ofSize: size, weight: bold ? .bold : .regular)
}

func text(
    _ value: String,
    x: CGFloat,
    y: CGFloat,
    width: CGFloat,
    height: CGFloat,
    size: CGFloat,
    color: NSColor,
    bold: Bool = false,
    lineHeight: CGFloat? = nil,
    kern: CGFloat = 0
) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.lineBreakMode = .byWordWrapping
    if let lineHeight {
        paragraph.minimumLineHeight = lineHeight
        paragraph.maximumLineHeight = lineHeight
    }
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font(size, bold: bold),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
        .kern: kern
    ]
    (value as NSString).draw(in: topRect(x, y, width, height), withAttributes: attributes)
}

func line(x: CGFloat, y: CGFloat, width: CGFloat, color: NSColor, height: CGFloat = 7) {
    color.setFill()
    NSBezierPath(rect: topRect(x, y, width, height)).fill()
}

func shadow(_ rect: NSRect) {
    NSGraphicsContext.saveGraphicsState()
    let value = NSShadow()
    value.shadowColor = NSColor.black.withAlphaComponent(0.28)
    value.shadowBlurRadius = 26
    value.shadowOffset = CGSize(width: 0, height: -8)
    value.set()
    NSColor.black.withAlphaComponent(0.14).setFill()
    NSBezierPath(ovalIn: rect).fill()
    NSGraphicsContext.restoreGraphicsState()
}

func save(_ image: NSImage, path: String) throws {
    guard let tiff = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let data = bitmap.representation(using: .png, properties: [:]) else {
        throw RenderError.encode(path)
    }
    try data.write(to: URL(fileURLWithPath: path))
}

func render(base: NSImage, output: String, overlay: () -> Void) throws {
    let image = NSImage(size: canvas)
    image.lockFocus()
    NSGraphicsContext.current?.imageInterpolation = .high
    base.draw(in: NSRect(origin: .zero, size: canvas), from: .zero, operation: .copy, fraction: 1)
    overlay()
    image.unlockFocus()
    try save(image, path: output)
}

let root = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : FileManager.default.currentDirectoryPath
let working = "\(root)/output/product-listing/moonlight-velvet/generated-v01/working"
let final = "\(root)/output/product-listing/moonlight-velvet/generated-v01/final"

let profileBase = try load("\(working)/08-product-profile-base.png")
let ingredientsBase = try load("\(working)/09-ingredients-base.png")
let closingBase = try load("\(working)/10-closing-base.png")
let bottle = try load("\(working)/moonlight-velvet-bottle-cutout.png")

try render(base: profileBase, output: "\(final)/08-moonlight-velvet-product-profile.png") {
    text("MOONLIGHT VELVET", x: 120, y: 120, width: 760, height: 44, size: 25, color: coral, bold: true, kern: 3)
    text("PRODUCT\nPROFILE", x: 120, y: 190, width: 780, height: 210, size: 78, color: ink, bold: true, lineHeight: 84)
    line(x: 120, y: 445, width: 285, color: coral)

    text("50 ML / 1.69 FL. OZ.", x: 120, y: 555, width: 720, height: 58, size: 38, color: ink, bold: true)
    text("MEN'S LINE", x: 120, y: 670, width: 720, height: 58, size: 38, color: ink, bold: true)

    text("VERIFIED DETAILS", x: 120, y: 855, width: 720, height: 42, size: 23, color: coral, bold: true, kern: 2)
    text(
        "CLEAR GLASS BOTTLE\nCOLORLESS LIQUID\nGLOSSY BLACK CAP\nPALE-LILAC CANISTER",
        x: 120, y: 925, width: 760, height: 310, size: 35, color: ink, bold: true, lineHeight: 58
    )

    text("PRODUCT CODE  P10338", x: 120, y: 1580, width: 760, height: 48, size: 27, color: ink, bold: true)
}

try render(base: ingredientsBase, output: "\(final)/09-moonlight-velvet-ingredients-and-care.png") {
    let destination = topRect(95, 245, 610, 1420)
    let bottleSource = NSRect(x: 390, y: 65, width: 470, height: 1120)
    shadow(NSRect(x: 175, y: 345, width: 455, height: 42))
    bottle.draw(in: destination, from: bottleSource, operation: .sourceOver, fraction: 1)

    text("MOONLIGHT VELVET", x: 1045, y: 105, width: 850, height: 42, size: 24, color: coral, bold: true, kern: 3)
    text("INGREDIENTS", x: 1045, y: 175, width: 850, height: 80, size: 64, color: ink, bold: true)
    line(x: 1045, y: 285, width: 320, color: coral)
    text("AS PRINTED ON THE PACKAGE", x: 1045, y: 330, width: 850, height: 40, size: 21, color: coral, bold: true, kern: 1)

    text(
        "Alcohol\nWater (Aqua)\nFragrance (Parfum)\nPEG-40 Hydrogenated Castor Oil\nPropylene Glycol\nCoumarin\nCitronellol\nLimonene",
        x: 1045, y: 420, width: 395, height: 505, size: 26, color: ink, lineHeight: 49
    )
    text(
        "Eugenol\nAlpha-Isomethyl Ionone\nLinalool\nGeraniol\nBenzyl Benzoate\nCinnamyl Alcohol\nCitral",
        x: 1490, y: 420, width: 420, height: 505, size: 26, color: ink, lineHeight: 49
    )

    text("PACK DETAILS", x: 1045, y: 1090, width: 850, height: 42, size: 23, color: ink, bold: true, kern: 2)
    text(
        "50 ML / 1.69 FL. OZ.\nPRODUCT CODE  P10338\nBARCODE  5056795407260",
        x: 1045, y: 1160, width: 850, height: 190, size: 29, color: ink, bold: true, lineHeight: 54
    )

    text("FLAMMABLE", x: 1045, y: 1540, width: 850, height: 48, size: 30, color: coral, bold: true, kern: 2)
    text("Keep away from heat and open flame.", x: 1045, y: 1605, width: 850, height: 68, size: 29, color: ink)
}

try render(base: closingBase, output: "\(final)/10-moonlight-velvet-closing-hero.png") {
    text("A SCENT JOURNEY", x: 105, y: 110, width: 850, height: 90, size: 69, color: cream, bold: true)
    text("MOONLIGHT VELVET", x: 110, y: 220, width: 720, height: 46, size: 27, color: lilac, bold: true, kern: 3)
    line(x: 110, y: 292, width: 250, color: coral, height: 6)
}

print("Rendered Moonlight Velvet frames 08-10")
