import AppKit
import Foundation

let canvasSize = CGSize(width: 2048, height: 2048)
let burgundy = NSColor(calibratedRed: 92.0 / 255.0, green: 0, blue: 6.0 / 255.0, alpha: 1)
let red = NSColor(calibratedRed: 154.0 / 255.0, green: 17.0 / 255.0, blue: 6.0 / 255.0, alpha: 1)
let orange = NSColor(calibratedRed: 212.0 / 255.0, green: 102.0 / 255.0, blue: 1.0 / 255.0, alpha: 1)
let gold = NSColor(calibratedRed: 233.0 / 255.0, green: 162.0 / 255.0, blue: 80.0 / 255.0, alpha: 1)
let cream = NSColor(calibratedRed: 244.0 / 255.0, green: 227.0 / 255.0, blue: 203.0 / 255.0, alpha: 1)
let dark = NSColor(calibratedWhite: 0.10, alpha: 1)

func rectFromTop(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasSize.height - y - height, width: width, height: height)
}

func brandFont(size: CGFloat, bold: Bool = false) -> NSFont {
    // Helvetica Neue is the installed production fallback for Helvetica Now Display.
    let name = bold ? "HelveticaNeue-Bold" : "HelveticaNeue"
    return NSFont(name: name, size: size) ?? NSFont.systemFont(ofSize: size, weight: bold ? .bold : .regular)
}

func drawText(
    _ value: String,
    x: CGFloat,
    y: CGFloat,
    width: CGFloat,
    height: CGFloat,
    size: CGFloat,
    color: NSColor,
    bold: Bool = false,
    lineHeight: CGFloat? = nil,
    alignment: NSTextAlignment = .left,
    kern: CGFloat = 0
) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = alignment
    paragraph.lineBreakMode = .byWordWrapping
    if let lineHeight {
        paragraph.minimumLineHeight = lineHeight
        paragraph.maximumLineHeight = lineHeight
    }

    let attributes: [NSAttributedString.Key: Any] = [
        .font: brandFont(size: size, bold: bold),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
        .kern: kern
    ]
    (value as NSString).draw(in: rectFromTop(x: x, y: y, width: width, height: height), withAttributes: attributes)
}

func drawImage(_ image: NSImage, in rect: NSRect) {
    image.draw(in: rect, from: .zero, operation: .copy, fraction: 1)
}

func drawRule(x: CGFloat, y: CGFloat, width: CGFloat, color: NSColor, height: CGFloat = 8) {
    color.setFill()
    NSBezierPath(rect: rectFromTop(x: x, y: y, width: width, height: height)).fill()
}

func savePNG(_ image: NSImage, to path: String) throws {
    guard let tiff = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff),
          let data = rep.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "CitrusWishInfographic", code: 1)
    }
    try data.write(to: URL(fileURLWithPath: path))
}

func render(basePath: String, outputPath: String, overlay: () -> Void) throws {
    guard let base = NSImage(contentsOfFile: basePath) else {
        throw NSError(domain: "CitrusWishInfographic", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not load base image: \(basePath)"])
    }

    let canvas = NSImage(size: canvasSize)
    canvas.lockFocus()
    cream.setFill()
    NSBezierPath(rect: NSRect(origin: .zero, size: canvasSize)).fill()
    drawImage(base, in: NSRect(origin: .zero, size: canvasSize))
    overlay()
    canvas.unlockFocus()
    try savePNG(canvas, to: outputPath)
}

let root = "/Users/wetrade/Documents/ChatGPT/Dear Body"
let generated = "/Users/wetrade/.codex/generated_images/01a0c703-acdf-7561-9dc9-1fbb41fd3545"
let output = "\(root)/output/product-listing/citrus-wish/recreated-v2"

try FileManager.default.createDirectory(atPath: output, withIntermediateDirectories: true)

try render(
    basePath: "\(generated)/exec-04b6d347-55f1-488d-ac86-5cec5198d659.png",
    outputPath: "\(output)/08-citrus-wish-product-profile-infographic-2048-v2.png"
) {
    drawText("DEAR BODY", x: 150, y: 155, width: 710, height: 56, size: 34, color: gold, bold: true, kern: 5)
    drawText("CITRUS WISH", x: 150, y: 250, width: 760, height: 90, size: 62, color: cream, bold: true)
    drawText("PRODUCT\nPROFILE", x: 150, y: 345, width: 780, height: 255, size: 108, color: cream, bold: true, lineHeight: 116)
    drawRule(x: 150, y: 625, width: 540, color: orange, height: 10)

    drawText("50 ML  /  EAU DE PARFUM", x: 150, y: 710, width: 760, height: 72, size: 42, color: gold, bold: true)
    drawText("MEN'S LINE", x: 150, y: 805, width: 760, height: 70, size: 42, color: cream, bold: true)

    drawText("SCENT DIRECTION", x: 150, y: 965, width: 760, height: 52, size: 28, color: gold, bold: true, kern: 2)
    drawText("BRIGHT CITRUS\nFRESH ENERGY", x: 150, y: 1025, width: 760, height: 170, size: 58, color: cream, bold: true, lineHeight: 68)

    drawText("STYLE MATCH", x: 150, y: 1285, width: 760, height: 52, size: 28, color: gold, bold: true, kern: 2)
    drawText("For the upbeat, confident man who likes a fresh, easygoing presence.", x: 150, y: 1345, width: 720, height: 240, size: 40, color: cream, lineHeight: 54)
    drawText("Scent direction based on the current retailer description; exact note pyramid pending brand confirmation.", x: 150, y: 1735, width: 720, height: 130, size: 24, color: cream, lineHeight: 34)
}

try render(
    basePath: "\(generated)/exec-dfdfc8c5-f87a-4d3d-9db6-ee2e7788b51f.png",
    outputPath: "\(output)/09-citrus-wish-ingredients-and-use-infographic-2048-v2.png"
) {
    drawText("CITRUS WISH", x: 120, y: 120, width: 980, height: 62, size: 38, color: orange, bold: true, kern: 2)
    drawText("INGREDIENTS\n& HOW TO USE", x: 120, y: 205, width: 1020, height: 190, size: 78, color: burgundy, bold: true, lineHeight: 86)
    drawRule(x: 120, y: 430, width: 660, color: red, height: 8)

    drawText("AS PRINTED ON THE PACKAGE", x: 120, y: 490, width: 980, height: 52, size: 26, color: orange, bold: true, kern: 1.5)
    drawText("Alcohol, Water (Aqua), Fragrance (Parfum), PEG-40 Hydrogenated Castor Oil, Propylene Glycol, Linalool, Limonene, Hydroxycitronellal, Citral, Cinnamal, Geraniol.", x: 120, y: 550, width: 980, height: 320, size: 34, color: dark, lineHeight: 46)

    drawText("HOW TO USE", x: 120, y: 940, width: 980, height: 54, size: 30, color: burgundy, bold: true, kern: 1.5)
    drawText("1  Mist lightly onto pulse points.\n2  Let the fragrance dry naturally; do not rub.\n3  Avoid the eyes and broken or irritated skin.", x: 120, y: 1010, width: 980, height: 270, size: 33, color: dark, lineHeight: 56)

    drawText("CARE", x: 120, y: 1355, width: 980, height: 50, size: 28, color: burgundy, bold: true, kern: 1.5)
    drawText("For external use only. Flammable: keep away from heat and open flame. Keep out of reach of children.", x: 120, y: 1415, width: 980, height: 190, size: 32, color: dark, lineHeight: 46)

    drawText("50 ML  /  1.69 FL. OZ.  /  EAU DE PARFUM", x: 120, y: 1775, width: 1020, height: 70, size: 30, color: orange, bold: true)
}

try render(
    basePath: "\(generated)/exec-9f617791-f777-4435-b914-85b1f01b4c5b.png",
    outputPath: "\(output)/10-citrus-wish-closing-hero-2048-v2.png"
) {
    drawText("DEAR BODY", x: 150, y: 250, width: 760, height: 70, size: 38, color: gold, bold: true, kern: 5)
    drawText("A SCENT\nJOURNEY", x: 150, y: 360, width: 760, height: 290, size: 116, color: cream, bold: true, lineHeight: 124)
    drawRule(x: 150, y: 700, width: 490, color: orange, height: 10)
    drawText("CITRUS WISH", x: 150, y: 760, width: 760, height: 80, size: 46, color: gold, bold: true, kern: 1)
}
