import AppKit
import Foundation

let canvas = CGSize(width: 2048, height: 2048)
let cream = NSColor(calibratedRed: 248 / 255, green: 241 / 255, blue: 230 / 255, alpha: 1)
let ink = NSColor(calibratedRed: 23 / 255, green: 22 / 255, blue: 25 / 255, alpha: 1)
let lilac = NSColor(calibratedRed: 139 / 255, green: 111 / 255, blue: 202 / 255, alpha: 1)
let oxblood = NSColor(calibratedRed: 106 / 255, green: 24 / 255, blue: 30 / 255, alpha: 1)

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
let working = "\(root)/output/product-listing/moonlight-velvet/standardized-v01/working"
let final = "\(root)/output/product-listing/moonlight-velvet/standardized-v01/final"

let profileBase = try load("\(working)/08-product-profile-base.png")
let ingredientsBase = try load("\(working)/09-ingredients-care-base.png")
let closingBase = try load("\(working)/10-closing-hero-base.png")

try render(base: profileBase, output: "\(final)/08-product-profile-infographic.png") {
    text("MOONLIGHT VELVET", x: 110, y: 105, width: 860, height: 44, size: 25, color: oxblood, bold: true, kern: 3)
    text("PRODUCT\nPROFILE", x: 110, y: 175, width: 820, height: 220, size: 78, color: ink, bold: true, lineHeight: 84)
    line(x: 110, y: 438, width: 285, color: lilac)

    text("50 ML / 1.69 FL. OZ.", x: 110, y: 525, width: 790, height: 58, size: 38, color: ink, bold: true)
    text("MEN'S LINE", x: 110, y: 625, width: 790, height: 58, size: 38, color: ink, bold: true)

    text("VERIFIED DETAILS", x: 110, y: 805, width: 790, height: 42, size: 23, color: oxblood, bold: true, kern: 2)
    text(
        "CLEAR GLASS BOTTLE\nCOLORLESS LIQUID\nGLOSSY BLACK CAP\nPALE-LILAC CANISTER",
        x: 110, y: 875, width: 815, height: 330, size: 34, color: ink, bold: true, lineHeight: 58
    )

    text("PRODUCT CODE  P10338", x: 110, y: 1695, width: 800, height: 52, size: 29, color: cream, bold: true, kern: 0.5)
    line(x: 110, y: 1775, width: 205, color: lilac, height: 6)
}

try render(base: ingredientsBase, output: "\(final)/09-ingredients-and-care-infographic.png") {
    text("MOONLIGHT VELVET", x: 965, y: 100, width: 940, height: 42, size: 24, color: oxblood, bold: true, kern: 3)
    text("INGREDIENTS", x: 965, y: 170, width: 940, height: 78, size: 61, color: ink, bold: true)
    line(x: 965, y: 274, width: 310, color: lilac)
    text("AS PRINTED ON THE PACKAGE", x: 965, y: 320, width: 940, height: 38, size: 20, color: oxblood, bold: true, kern: 1)

    text(
        "Alcohol\nWater (Aqua)\nFragrance (Parfum)\nPEG-40 Hydrogenated Castor Oil\nPropylene Glycol\nCoumarin\nCitronellol",
        x: 965, y: 405, width: 430, height: 460, size: 22, color: ink, lineHeight: 45
    )
    text(
        "Limonene\nEugenol\nAlpha-Isomethyl Ionone\nLinalool\nGeraniol\nBenzyl Benzoate\nCinnamyl Alcohol\nCitral",
        x: 1445, y: 405, width: 420, height: 460, size: 22, color: ink, lineHeight: 45
    )

    line(x: 965, y: 990, width: 900, color: NSColor.black.withAlphaComponent(0.16), height: 2)
    text("PACK DETAILS", x: 965, y: 1040, width: 900, height: 40, size: 22, color: ink, bold: true, kern: 2)
    text(
        "50 ML / 1.69 FL. OZ.\nPRODUCT CODE  P10338\nBARCODE  5056795407260",
        x: 965, y: 1110, width: 900, height: 195, size: 28, color: ink, bold: true, lineHeight: 56
    )

    oxblood.setFill()
    NSBezierPath(rect: topRect(965, 1538, 235, 52)).fill()
    text("FLAMMABLE", x: 986, y: 1547, width: 210, height: 38, size: 23, color: cream, bold: true, kern: 1.5)
    text("Keep away from heat and open flame.", x: 965, y: 1625, width: 890, height: 82, size: 29, color: ink, bold: true)
}

try render(base: closingBase, output: "\(final)/10-closing-hero.png") {
    text("A SCENT JOURNEY", x: 105, y: 105, width: 900, height: 90, size: 69, color: cream, bold: true)
    text("MOONLIGHT VELVET", x: 110, y: 220, width: 800, height: 46, size: 27, color: lilac, bold: true, kern: 3)
    line(x: 110, y: 292, width: 250, color: lilac, height: 6)
}

print("Rendered Moonlight Velvet standardized frames 08-10")
