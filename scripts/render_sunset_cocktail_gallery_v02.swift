import AppKit
import Foundation

let canvasSize = CGSize(width: 2048, height: 2048)
let cream = NSColor(calibratedRed: 246.0 / 255.0, green: 236.0 / 255.0, blue: 222.0 / 255.0, alpha: 1)
let paper = NSColor(calibratedRed: 252.0 / 255.0, green: 248.0 / 255.0, blue: 242.0 / 255.0, alpha: 1)
let peach = NSColor(calibratedRed: 235.0 / 255.0, green: 143.0 / 255.0, blue: 120.0 / 255.0, alpha: 1)
let coral = NSColor(calibratedRed: 211.0 / 255.0, green: 83.0 / 255.0, blue: 61.0 / 255.0, alpha: 1)
let burgundy = NSColor(calibratedRed: 92.0 / 255.0, green: 11.0 / 255.0, blue: 24.0 / 255.0, alpha: 1)
let oxblood = NSColor(calibratedRed: 63.0 / 255.0, green: 8.0 / 255.0, blue: 17.0 / 255.0, alpha: 1)
let ink = NSColor(calibratedRed: 25.0 / 255.0, green: 24.0 / 255.0, blue: 22.0 / 255.0, alpha: 1)

enum RenderError: Error, CustomStringConvertible {
    case missingImage(String)
    case encodingFailure(String)

    var description: String {
        switch self {
        case .missingImage(let path): return "Could not load image: \(path)"
        case .encodingFailure(let path): return "Could not encode image: \(path)"
        }
    }
}

func rectFromTop(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasSize.height - y - height, width: width, height: height)
}

func font(_ size: CGFloat, bold: Bool = false) -> NSFont {
    NSFont(name: bold ? "HelveticaNeue-Bold" : "HelveticaNeue", size: size)
        ?? NSFont.systemFont(ofSize: size, weight: bold ? .bold : .regular)
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
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font(size, bold: bold),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
        .kern: kern
    ]
    (value as NSString).draw(in: rectFromTop(x: x, y: y, width: width, height: height), withAttributes: attrs)
}

func fill(_ rect: NSRect, color: NSColor) {
    color.setFill()
    NSBezierPath(rect: rect).fill()
}

func fillTop(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, color: NSColor) {
    fill(rectFromTop(x: x, y: y, width: width, height: height), color: color)
}

func lineTop(x: CGFloat, y: CGFloat, width: CGFloat, color: NSColor, height: CGFloat = 6) {
    fillTop(x: x, y: y, width: width, height: height, color: color)
}

func load(_ path: String) throws -> NSImage {
    guard let image = NSImage(contentsOfFile: path) else { throw RenderError.missingImage(path) }
    return image
}

func drawBackground(_ image: NSImage) {
    image.draw(in: NSRect(origin: .zero, size: canvasSize), from: .zero, operation: .copy, fraction: 1)
}

func drawCrop(_ image: NSImage, source: NSRect, destination: NSRect, fraction: CGFloat = 1) {
    image.draw(
        in: destination,
        from: source,
        operation: .sourceOver,
        fraction: fraction,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
}

func drawShadow(_ rect: NSRect, opacity: CGFloat = 0.22, blur: CGFloat = 26) {
    NSGraphicsContext.saveGraphicsState()
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(opacity)
    shadow.shadowBlurRadius = blur
    shadow.shadowOffset = CGSize(width: 0, height: -7)
    shadow.set()
    NSColor.black.withAlphaComponent(opacity * 0.5).setFill()
    NSBezierPath(ovalIn: rect).fill()
    NSGraphicsContext.restoreGraphicsState()
}

func save(_ image: NSImage, to path: String, jpeg: Bool) throws {
    guard let tiff = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff) else { throw RenderError.encodingFailure(path) }
    let data = jpeg
        ? rep.representation(using: .jpeg, properties: [.compressionFactor: 0.95])
        : rep.representation(using: .png, properties: [:])
    guard let data else { throw RenderError.encodingFailure(path) }
    try data.write(to: URL(fileURLWithPath: path))
}

func render(background: NSImage? = nil, output: String, jpeg: Bool, overlay: () -> Void) throws {
    let image = NSImage(size: canvasSize)
    image.lockFocus()
    NSGraphicsContext.current?.imageInterpolation = .high
    fill(NSRect(origin: .zero, size: canvasSize), color: paper)
    if let background { drawBackground(background) }
    overlay()
    image.unlockFocus()
    try save(image, to: output, jpeg: jpeg)
}

let root = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : FileManager.default.currentDirectoryPath
let work = "\(root)/output/product-listing/sunset-cocktail/recreated-v02/working"
let backgrounds = "\(work)/backgrounds"
let cutouts = "\(work)/cutouts"
let output = "\(root)/output/product-listing/sunset-cocktail/recreated-v02/final"
try FileManager.default.createDirectory(atPath: output, withIntermediateDirectories: true)

let bottle = try load("\(cutouts)/bottle-master.png")
let canister = try load("\(cutouts)/canister-master.png")
let cap = try load("\(cutouts)/cap-master.png")

let bottleSource = NSRect(x: 250, y: 91, width: 525, height: 1310)
let canisterSource = NSRect(x: 155, y: 90, width: 715, height: 1345)
let capSource = NSRect(x: 115, y: 55, width: 970, height: 1195)

// 1. Primary packshot
try render(
    background: try load("\(backgrounds)/01-primary-studio.png"),
    output: "\(output)/01-sunset-cocktail-primary-packshot-v02.jpg",
    jpeg: true
) {
    let product = NSRect(x: 688, y: 155, width: 672, height: 1676)
    drawShadow(NSRect(x: 745, y: 142, width: 560, height: 48), opacity: 0.16, blur: 24)
    drawCrop(bottle, source: bottleSource, destination: product)
}

// 2. Brand hero
try render(
    background: try load("\(backgrounds)/02-brand-hero.png"),
    output: "\(output)/02-sunset-cocktail-brand-hero-v02.jpg",
    jpeg: true
) {
    drawText("DEAR BODY", x: 130, y: 145, width: 700, height: 48, size: 30, color: burgundy, bold: true, kern: 5)
    drawText("SUNSET\nCOCKTAIL", x: 130, y: 225, width: 820, height: 240, size: 92, color: oxblood, bold: true, lineHeight: 98)
    lineTop(x: 130, y: 510, width: 290, color: coral, height: 8)

    let canisterRect = NSRect(x: 1450, y: 750, width: 430, height: 808)
    let bottleRect = NSRect(x: 1040, y: 750, width: 395, height: 986)
    drawShadow(NSRect(x: 1060, y: 734, width: 760, height: 46), opacity: 0.22, blur: 22)
    drawCrop(canister, source: canisterSource, destination: canisterRect)
    drawCrop(bottle, source: bottleSource, destination: bottleRect)
}

// 3. Bottle and presentation canister
try render(
    background: try load("\(backgrounds)/03-packaging.png"),
    output: "\(output)/03-sunset-cocktail-bottle-and-canister-v02.jpg",
    jpeg: true
) {
    drawText("THE PRESENTATION", x: 125, y: 125, width: 720, height: 50, size: 28, color: burgundy, bold: true, kern: 3)
    drawText("BOTTLE + CANISTER", x: 125, y: 190, width: 920, height: 80, size: 56, color: ink, bold: true)

    let bottleRect = NSRect(x: 255, y: 615, width: 390, height: 974)
    let canisterRect = NSRect(x: 1260, y: 540, width: 480, height: 903)
    drawShadow(NSRect(x: 270, y: 602, width: 360, height: 42), opacity: 0.17, blur: 18)
    drawShadow(NSRect(x: 1300, y: 526, width: 400, height: 42), opacity: 0.17, blur: 18)
    drawCrop(bottle, source: bottleSource, destination: bottleRect)
    drawCrop(canister, source: canisterSource, destination: canisterRect)
}

// 4. Construction details
try render(output: "\(output)/04-sunset-cocktail-product-details-v02.png", jpeg: false) {
    fill(NSRect(origin: .zero, size: canvasSize), color: cream)
    fill(NSRect(x: 0, y: 0, width: 760, height: 2048), color: burgundy)
    fillTop(x: 760, y: 0, width: 1288, height: 18, color: coral)

    let bottleRect = NSRect(x: 110, y: 105, width: 545, height: 1360)
    drawShadow(NSRect(x: 155, y: 94, width: 455, height: 44), opacity: 0.24, blur: 22)
    drawCrop(bottle, source: bottleSource, destination: bottleRect)

    drawText("SUNSET COCKTAIL", x: 900, y: 145, width: 920, height: 44, size: 26, color: coral, bold: true, kern: 3)
    drawText("PRODUCT\nDETAILS", x: 900, y: 215, width: 900, height: 220, size: 84, color: oxblood, bold: true, lineHeight: 90)
    lineTop(x: 900, y: 475, width: 310, color: coral, height: 8)

    drawText("GLOSSY BLACK CAP", x: 900, y: 560, width: 850, height: 52, size: 34, color: ink, bold: true)
    drawText("Embossed monogram on top", x: 900, y: 618, width: 850, height: 46, size: 28, color: ink)
    drawText("PALE PEACH LIQUID", x: 900, y: 715, width: 850, height: 52, size: 34, color: ink, bold: true)
    drawText("Visible through clear glass", x: 900, y: 773, width: 850, height: 46, size: 28, color: ink)
    drawText("BLACK FRONT LABEL", x: 900, y: 870, width: 850, height: 52, size: 34, color: ink, bold: true)
    drawText("White product and brand lettering", x: 900, y: 928, width: 900, height: 46, size: 28, color: ink)

    let capRect = NSRect(x: 1110, y: 100, width: 760, height: 935)
    drawCrop(cap, source: capSource, destination: capRect)
}

// 5. Red-car getting-ready moment
try render(
    background: try load("\(backgrounds)/05-lifestyle-car.png"),
    output: "\(output)/05-sunset-cocktail-lifestyle-red-car-v02.jpg",
    jpeg: true
) {
    let product = NSRect(x: 1510, y: 315, width: 244, height: 610)
    drawShadow(NSRect(x: 1530, y: 305, width: 205, height: 32), opacity: 0.20, blur: 15)
    drawCrop(bottle, source: bottleSource, destination: product)
}

// 6. Poolside daytime moment
try render(
    background: try load("\(backgrounds)/06-lifestyle-poolside.png"),
    output: "\(output)/06-sunset-cocktail-lifestyle-poolside-v02.jpg",
    jpeg: true
) {
    let product = NSRect(x: 880, y: 545, width: 288, height: 720)
    drawShadow(NSRect(x: 905, y: 534, width: 238, height: 34), opacity: 0.20, blur: 16)
    drawCrop(bottle, source: bottleSource, destination: product)
}

// 7. Street-style moment
try render(
    background: try load("\(backgrounds)/07-lifestyle-streetwear.png"),
    output: "\(output)/07-sunset-cocktail-lifestyle-streetwear-v02.jpg",
    jpeg: true
) {
    let product = NSRect(x: 295, y: 560, width: 272, height: 680)
    drawShadow(NSRect(x: 318, y: 550, width: 225, height: 34), opacity: 0.22, blur: 16)
    drawCrop(bottle, source: bottleSource, destination: product)
}

// 8. Product at a glance
try render(output: "\(output)/08-sunset-cocktail-product-at-a-glance-v02.png", jpeg: false) {
    fill(NSRect(origin: .zero, size: canvasSize), color: paper)
    fill(NSRect(x: 1770, y: 0, width: 278, height: 2048), color: peach)
    fillTop(x: 0, y: 0, width: 2048, height: 20, color: burgundy)

    let product = NSRect(x: 170, y: 210, width: 590, height: 1472)
    drawShadow(NSRect(x: 220, y: 196, width: 490, height: 46), opacity: 0.16, blur: 21)
    drawCrop(bottle, source: bottleSource, destination: product)

    drawText("SUNSET COCKTAIL", x: 900, y: 155, width: 920, height: 48, size: 28, color: coral, bold: true, kern: 3)
    drawText("AT A\nGLANCE", x: 900, y: 240, width: 860, height: 230, size: 90, color: oxblood, bold: true, lineHeight: 96)
    lineTop(x: 900, y: 515, width: 310, color: coral, height: 8)

    drawText("50 ML / 1.69 FL. OZ.", x: 900, y: 630, width: 880, height: 62, size: 40, color: ink, bold: true)
    drawText("MEN'S LINE", x: 900, y: 760, width: 880, height: 62, size: 40, color: burgundy, bold: true)

    drawText("VERIFIED PACK DETAILS", x: 900, y: 955, width: 880, height: 44, size: 24, color: coral, bold: true, kern: 2)
    drawText("CLEAR GLASS BOTTLE\nGLOSSY BLACK CAP\nPEACH-CORAL CANISTER", x: 900, y: 1025, width: 900, height: 250, size: 39, color: ink, bold: true, lineHeight: 66)

    drawText("PRODUCT CODE  P10538", x: 900, y: 1600, width: 880, height: 52, size: 29, color: burgundy, bold: true)
}

// 9. Ingredients and pack details
try render(output: "\(output)/09-sunset-cocktail-ingredients-v02.png", jpeg: false) {
    fill(NSRect(origin: .zero, size: canvasSize), color: burgundy)
    fill(NSRect(x: 720, y: 0, width: 1328, height: 2048), color: paper)
    fillTop(x: 720, y: 0, width: 14, height: 2048, color: peach)

    let product = NSRect(x: 155, y: 260, width: 430, height: 1074)
    drawShadow(NSRect(x: 195, y: 247, width: 350, height: 42), opacity: 0.28, blur: 20)
    drawCrop(bottle, source: bottleSource, destination: product)

    drawText("SUNSET COCKTAIL", x: 840, y: 125, width: 1020, height: 44, size: 26, color: coral, bold: true, kern: 3)
    drawText("INGREDIENTS", x: 840, y: 200, width: 1060, height: 82, size: 68, color: oxblood, bold: true)
    lineTop(x: 840, y: 315, width: 340, color: coral, height: 8)
    drawText("AS PRINTED ON THE PACKAGE", x: 840, y: 360, width: 1040, height: 42, size: 22, color: coral, bold: true, kern: 1)

    drawText(
        "Alcohol\nWater (Aqua)\nFragrance (Parfum)\nPEG-40 Hydrogenated Castor Oil\nPropylene Glycol\nAlpha-Isomethyl Ionone",
        x: 840, y: 440, width: 540, height: 430, size: 36, color: ink, lineHeight: 62
    )
    drawText(
        "Benzyl Salicylate\nLinalool\nCitronellol\nGeraniol\nLimonene\nEugenol",
        x: 1425, y: 440, width: 500, height: 430, size: 36, color: ink, lineHeight: 62
    )

    drawText("PACK DETAILS", x: 840, y: 1040, width: 1040, height: 44, size: 24, color: burgundy, bold: true, kern: 2)
    drawText("50 ML / 1.69 FL. OZ.\nPRODUCT CODE  P10538\nBARCODE  5056795407284", x: 840, y: 1115, width: 1040, height: 220, size: 34, color: ink, bold: true, lineHeight: 62)

    drawText("FLAMMABLE", x: 840, y: 1535, width: 1040, height: 48, size: 30, color: coral, bold: true, kern: 2)
    drawText("Keep away from heat and open flame.", x: 840, y: 1600, width: 1040, height: 70, size: 30, color: ink)
}

// 10. Closing campaign image
try render(
    background: try load("\(backgrounds)/10-closing-sunset.png"),
    output: "\(output)/10-sunset-cocktail-closing-hero-v02.jpg",
    jpeg: true
) {
    drawText("A SCENT JOURNEY", x: 115, y: 125, width: 920, height: 100, size: 74, color: paper, bold: true)
    drawText("SUNSET COCKTAIL", x: 120, y: 235, width: 720, height: 48, size: 29, color: oxblood, bold: true, kern: 3)

    let bottleRect = NSRect(x: 1015, y: 720, width: 375, height: 936)
    let canisterRect = NSRect(x: 1380, y: 720, width: 420, height: 790)
    drawShadow(NSRect(x: 1045, y: 707, width: 700, height: 46), opacity: 0.24, blur: 22)
    drawCrop(canister, source: canisterSource, destination: canisterRect)
    drawCrop(bottle, source: bottleSource, destination: bottleRect)
}

print("Rendered redesigned Sunset Cocktail gallery to \(output)")
