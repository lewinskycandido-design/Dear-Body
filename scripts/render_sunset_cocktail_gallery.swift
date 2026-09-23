import AppKit
import Foundation

let canvasSize = CGSize(width: 2048, height: 2048)
let burgundy = NSColor(calibratedRed: 92.0 / 255.0, green: 0, blue: 6.0 / 255.0, alpha: 1)
let red = NSColor(calibratedRed: 154.0 / 255.0, green: 17.0 / 255.0, blue: 6.0 / 255.0, alpha: 1)
let orange = NSColor(calibratedRed: 212.0 / 255.0, green: 102.0 / 255.0, blue: 1.0 / 255.0, alpha: 1)
let gold = NSColor(calibratedRed: 233.0 / 255.0, green: 162.0 / 255.0, blue: 80.0 / 255.0, alpha: 1)
let cream = NSColor(calibratedRed: 244.0 / 255.0, green: 227.0 / 255.0, blue: 203.0 / 255.0, alpha: 1)
let dark = NSColor(calibratedWhite: 0.09, alpha: 1)

enum RenderError: Error, CustomStringConvertible {
    case missingImage(String)
    case encodingFailure(String)

    var description: String {
        switch self {
        case .missingImage(let path):
            return "Could not load image: \(path)"
        case .encodingFailure(let path):
            return "Could not encode image: \(path)"
        }
    }
}

func rectFromTop(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasSize.height - y - height, width: width, height: height)
}

func sourceRectFromTop(
    x: CGFloat,
    y: CGFloat,
    width: CGFloat,
    height: CGFloat,
    imageHeight: CGFloat = 4080
) -> NSRect {
    NSRect(x: x, y: imageHeight - y - height, width: width, height: height)
}

func brandFont(size: CGFloat, bold: Bool = false) -> NSFont {
    let name = bold ? "HelveticaNeue-Bold" : "HelveticaNeue"
    return NSFont(name: name, size: size)
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

    let attributes: [NSAttributedString.Key: Any] = [
        .font: brandFont(size: size, bold: bold),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
        .kern: kern
    ]
    (value as NSString).draw(
        in: rectFromTop(x: x, y: y, width: width, height: height),
        withAttributes: attributes
    )
}

func drawRule(x: CGFloat, y: CGFloat, width: CGFloat, color: NSColor, height: CGFloat = 8) {
    color.setFill()
    NSBezierPath(rect: rectFromTop(x: x, y: y, width: width, height: height)).fill()
}

func loadImage(_ path: String) throws -> NSImage {
    guard let image = NSImage(contentsOfFile: path) else {
        throw RenderError.missingImage(path)
    }
    return image
}

func drawBackground(_ image: NSImage) {
    image.draw(
        in: NSRect(origin: .zero, size: canvasSize),
        from: .zero,
        operation: .copy,
        fraction: 1
    )
}

func drawSoftShadow(in rect: NSRect, opacity: CGFloat = 0.20, blur: CGFloat = 32) {
    NSGraphicsContext.saveGraphicsState()
    let shadow = NSShadow()
    shadow.shadowColor = NSColor.black.withAlphaComponent(opacity)
    shadow.shadowBlurRadius = blur
    shadow.shadowOffset = CGSize(width: 0, height: -8)
    shadow.set()
    NSColor.black.withAlphaComponent(opacity * 0.65).setFill()
    NSBezierPath(ovalIn: rect).fill()
    NSGraphicsContext.restoreGraphicsState()
}

func drawClippedImage(
    _ image: NSImage,
    source: NSRect,
    destination: NSRect,
    clip: NSBezierPath,
    fraction: CGFloat = 1
) {
    NSGraphicsContext.saveGraphicsState()
    clip.addClip()
    image.draw(
        in: destination,
        from: source,
        operation: .sourceOver,
        fraction: fraction,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
    NSGraphicsContext.restoreGraphicsState()
}

func drawTransparentImage(_ image: NSImage, in rect: NSRect) {
    image.draw(
        in: rect,
        from: .zero,
        operation: .sourceOver,
        fraction: 1,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
}

func drawCroppedImage(_ image: NSImage, source: NSRect, destination: NSRect) {
    image.draw(
        in: destination,
        from: source,
        operation: .sourceOver,
        fraction: 1,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
}

func bottleClip(in rect: NSRect) -> NSBezierPath {
    let path = NSBezierPath()
    path.appendRoundedRect(
        NSRect(
            x: rect.minX + rect.width * 0.19,
            y: rect.minY + rect.height * 0.70,
            width: rect.width * 0.62,
            height: rect.height * 0.255
        ),
        xRadius: rect.width * 0.05,
        yRadius: rect.width * 0.05
    )
    path.appendRoundedRect(
        NSRect(
            x: rect.minX + rect.width * 0.055,
            y: rect.minY + rect.height * 0.025,
            width: rect.width * 0.89,
            height: rect.height * 0.70
        ),
        xRadius: rect.width * 0.15,
        yRadius: rect.width * 0.12
    )
    return path
}

func canisterClip(in rect: NSRect) -> NSBezierPath {
    NSBezierPath(
        roundedRect: NSRect(
            x: rect.minX + rect.width * 0.025,
            y: rect.minY + rect.height * 0.025,
            width: rect.width * 0.95,
            height: rect.height * 0.94
        ),
        xRadius: rect.width * 0.10,
        yRadius: rect.width * 0.07
    )
}

func openSetClip(in rect: NSRect) -> NSBezierPath {
    let path = NSBezierPath()
    path.appendRoundedRect(
        NSRect(
            x: rect.minX,
            y: rect.minY + rect.height * 0.01,
            width: rect.width * 0.53,
            height: rect.height * 0.38
        ),
        xRadius: rect.width * 0.08,
        yRadius: rect.width * 0.06
    )
    path.appendRoundedRect(
        NSRect(
            x: rect.minX + rect.width * 0.055,
            y: rect.minY + rect.height * 0.24,
            width: rect.width * 0.44,
            height: rect.height * 0.53
        ),
        xRadius: rect.width * 0.06,
        yRadius: rect.width * 0.05
    )
    path.appendRoundedRect(
        NSRect(
            x: rect.minX + rect.width * 0.12,
            y: rect.minY + rect.height * 0.68,
            width: rect.width * 0.27,
            height: rect.height * 0.29
        ),
        xRadius: rect.width * 0.025,
        yRadius: rect.width * 0.025
    )
    path.appendRoundedRect(
        NSRect(
            x: rect.minX + rect.width * 0.47,
            y: rect.minY + rect.height * 0.025,
            width: rect.width * 0.53,
            height: rect.height * 0.86
        ),
        xRadius: rect.width * 0.065,
        yRadius: rect.width * 0.045
    )
    return path
}

func capClip(in rect: NSRect) -> NSBezierPath {
    let path = NSBezierPath()
    path.appendOval(
        in: NSRect(
            x: rect.minX + rect.width * 0.15,
            y: rect.minY + rect.height * 0.43,
            width: rect.width * 0.70,
            height: rect.height * 0.54
        )
    )
    path.appendOval(
        in: NSRect(
            x: rect.minX + rect.width * 0.04,
            y: rect.minY + rect.height * 0.04,
            width: rect.width * 0.92,
            height: rect.height * 0.66
        )
    )
    return path
}

func save(_ image: NSImage, to path: String, jpeg: Bool) throws {
    guard let tiff = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff) else {
        throw RenderError.encodingFailure(path)
    }

    let data: Data?
    if jpeg {
        data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.94])
    } else {
        data = rep.representation(using: .png, properties: [:])
    }

    guard let data else {
        throw RenderError.encodingFailure(path)
    }
    try data.write(to: URL(fileURLWithPath: path))
}

func render(
    background: NSImage,
    outputPath: String,
    jpeg: Bool,
    overlay: () -> Void
) throws {
    let canvas = NSImage(size: canvasSize)
    canvas.lockFocus()
    NSGraphicsContext.current?.imageInterpolation = .high
    cream.setFill()
    NSBezierPath(rect: NSRect(origin: .zero, size: canvasSize)).fill()
    drawBackground(background)
    overlay()
    canvas.unlockFocus()
    try save(canvas, to: outputPath, jpeg: jpeg)
}

let root = CommandLine.arguments.count > 1
    ? CommandLine.arguments[1]
    : FileManager.default.currentDirectoryPath
let working = "\(root)/output/product-listing/sunset-cocktail/working"
let backgrounds = "\(working)/backgrounds"
let cutouts = "\(working)/cutouts"
let masters = "\(working)/masters"
let output = "\(root)/output/product-listing/sunset-cocktail/final"

try FileManager.default.createDirectory(atPath: masters, withIntermediateDirectories: true)
try FileManager.default.createDirectory(atPath: output, withIntermediateDirectories: true)

let bottle = try loadImage("\(cutouts)/sunset-cocktail-bottle-front-clean-cutout.png")
let canister = try loadImage("\(cutouts)/sunset-cocktail-canister-photo-cutout.png")
let openSet = try loadImage("\(cutouts)/sunset-cocktail-open-set-photo-cutout.png")
let cap = try loadImage("\(cutouts)/sunset-cocktail-cap-photo-cutout.png")
let cleanCanister = try loadImage("\(cutouts)/sunset-cocktail-canister-transparent-v1.png")
let cleanOpenSet = try loadImage("\(cutouts)/sunset-cocktail-open-set-transparent-v1.png")
let cleanCap = try loadImage("\(cutouts)/sunset-cocktail-cap-top-transparent-v1.png")

let bottleSource = NSRect(x: 250, y: 91, width: 525, height: 1310)
let canisterSource = sourceRectFromTop(x: 420, y: 1570, width: 1000, height: 1900)
let openSetSource = sourceRectFromTop(x: 80, y: 1740, width: 1630, height: 1650)
let capSource = sourceRectFromTop(x: 400, y: 1650, width: 1050, height: 1450)

let background01 = try loadImage("\(backgrounds)/01-packshot-environment.png")
try render(
    background: background01,
    outputPath: "\(output)/01-sunset-cocktail-featured-packshot-shopify-v01.jpg",
    jpeg: true
) {
    let product = NSRect(x: 684, y: 70, width: 680, height: 1698)
    drawSoftShadow(in: NSRect(x: 760, y: 58, width: 530, height: 52), opacity: 0.16, blur: 20)
    drawCroppedImage(bottle, source: bottleSource, destination: product)
}

let background02 = try loadImage("\(backgrounds)/02-brand-hero-environment.png")
try render(
    background: background02,
    outputPath: "\(output)/02-sunset-cocktail-brand-hero-shopify-v01.jpg",
    jpeg: true
) {
    drawText("DEAR BODY", x: 140, y: 155, width: 760, height: 60, size: 34, color: gold, bold: true, kern: 5)
    drawText("SUNSET\nCOCKTAIL", x: 140, y: 250, width: 830, height: 265, size: 106, color: cream, bold: true, lineHeight: 112)
    drawRule(x: 140, y: 560, width: 440, color: orange, height: 10)

    let canisterRect = NSRect(x: 1135, y: 205, width: 720, height: 1180)
    let bottleRect = NSRect(x: 925, y: 155, width: 560, height: 1390)
    drawSoftShadow(in: NSRect(x: 990, y: 142, width: 690, height: 58), opacity: 0.22, blur: 24)
    drawTransparentImage(cleanCanister, in: canisterRect)
    drawCroppedImage(bottle, source: bottleSource, destination: bottleRect)
}

let background03 = try loadImage("\(backgrounds)/03-packaging-environment.png")
try render(
    background: background03,
    outputPath: "\(output)/03-sunset-cocktail-packaging-reveal-shopify-v01.jpg",
    jpeg: true
) {
    let product = NSRect(x: 205, y: 130, width: 1640, height: 1367)
    drawSoftShadow(in: NSRect(x: 365, y: 180, width: 1320, height: 64), opacity: 0.18, blur: 26)
    drawTransparentImage(cleanOpenSet, in: product)
    let exactBottle = NSRect(x: 440, y: 500, width: 470, height: 1175)
    drawCroppedImage(bottle, source: bottleSource, destination: exactBottle)
}

let background04 = try loadImage("\(backgrounds)/04-material-detail-environment.png")
try render(
    background: background04,
    outputPath: "\(output)/04-sunset-cocktail-cap-detail-shopify-v01.jpg",
    jpeg: true
) {
    drawText("SIGNATURE", x: 130, y: 290, width: 610, height: 60, size: 34, color: gold, bold: true, kern: 4)
    drawText("CAP", x: 130, y: 380, width: 630, height: 110, size: 96, color: burgundy, bold: true)
    drawText("DETAIL", x: 130, y: 482, width: 630, height: 110, size: 96, color: cream, bold: true)
    drawRule(x: 130, y: 675, width: 390, color: orange, height: 10)
    drawText("EMBOSSED MONOGRAM\nGLOSSY BLACK FINISH", x: 130, y: 745, width: 620, height: 155, size: 32, color: cream, bold: true, lineHeight: 48)

    let detail = NSRect(x: 815, y: 405, width: 1090, height: 1193)
    drawSoftShadow(in: NSRect(x: 1000, y: 445, width: 770, height: 125), opacity: 0.20, blur: 30)
    drawTransparentImage(cleanCap, in: detail)
}

let background05 = try loadImage("\(backgrounds)/05-lifestyle-red-vehicle-environment.png")
try render(
    background: background05,
    outputPath: "\(output)/05-sunset-cocktail-lifestyle-red-vehicle-shopify-v01.jpg",
    jpeg: true
) {
    let product = NSRect(x: 895, y: 60, width: 430, height: 1075)
    drawSoftShadow(in: NSRect(x: 935, y: 50, width: 350, height: 45), opacity: 0.20, blur: 16)
    drawCroppedImage(bottle, source: bottleSource, destination: product)
}

let background06 = try loadImage("\(backgrounds)/06-lifestyle-tropical-sky-environment.png")
try render(
    background: background06,
    outputPath: "\(output)/06-sunset-cocktail-lifestyle-tropical-sky-shopify-v01.jpg",
    jpeg: true
) {
    let product = NSRect(x: 815, y: 890, width: 420, height: 1048)
    drawSoftShadow(in: NSRect(x: 855, y: 880, width: 340, height: 48), opacity: 0.16, blur: 18)
    drawCroppedImage(bottle, source: bottleSource, destination: product)
}

let background07 = try loadImage("\(backgrounds)/07-lifestyle-streetwear-environment.png")
try render(
    background: background07,
    outputPath: "\(output)/07-sunset-cocktail-lifestyle-streetwear-shopify-v01.jpg",
    jpeg: true
) {
    let product = NSRect(x: 175, y: 90, width: 465, height: 1160)
    drawSoftShadow(in: NSRect(x: 215, y: 80, width: 385, height: 45), opacity: 0.22, blur: 18)
    drawCroppedImage(bottle, source: bottleSource, destination: product)
}

let background08 = try loadImage("\(backgrounds)/08-product-profile-environment.png")
let master08 = "\(masters)/08-sunset-cocktail-product-profile-text-free-master.png"
try render(background: background08, outputPath: master08, jpeg: false) {
    let product = NSRect(x: 1255, y: 270, width: 550, height: 1370)
    drawSoftShadow(in: NSRect(x: 1305, y: 260, width: 450, height: 48), opacity: 0.18, blur: 20)
    drawCroppedImage(bottle, source: bottleSource, destination: product)
}

let profileMaster = try loadImage(master08)
try render(
    background: profileMaster,
    outputPath: "\(output)/08-sunset-cocktail-product-profile-shopify-v01.png",
    jpeg: false
) {
    drawText("SUNSET COCKTAIL", x: 145, y: 150, width: 850, height: 58, size: 34, color: orange, bold: true, kern: 2)
    drawText("PRODUCT\nPROFILE", x: 145, y: 245, width: 820, height: 250, size: 98, color: burgundy, bold: true, lineHeight: 106)
    drawRule(x: 145, y: 540, width: 510, color: red, height: 9)

    drawText("50 ML / 1.69 FL. OZ.", x: 145, y: 635, width: 820, height: 70, size: 43, color: dark, bold: true)
    drawText("MEN'S LINE", x: 145, y: 755, width: 820, height: 68, size: 43, color: burgundy, bold: true)

    drawText("VERIFIED DETAILS", x: 145, y: 930, width: 820, height: 50, size: 27, color: orange, bold: true, kern: 2)
    drawText("CLEAR GLASS BOTTLE\nGLOSSY BLACK CAP\nPEACH-CORAL CANISTER", x: 145, y: 1000, width: 840, height: 260, size: 42, color: dark, bold: true, lineHeight: 68)

    drawText("PRODUCT CODE  P10538", x: 145, y: 1550, width: 820, height: 60, size: 29, color: burgundy, bold: true, kern: 1)
}

let background09 = try loadImage("\(backgrounds)/09-ingredients-care-environment.png")
let master09 = "\(masters)/09-sunset-cocktail-ingredients-care-text-free-master.png"
try render(background: background09, outputPath: master09, jpeg: false) {
    let product = NSRect(x: 190, y: 250, width: 520, height: 1295)
    drawSoftShadow(in: NSRect(x: 240, y: 240, width: 420, height: 48), opacity: 0.20, blur: 20)
    drawCroppedImage(bottle, source: bottleSource, destination: product)
}

let ingredientsMaster = try loadImage(master09)
try render(
    background: ingredientsMaster,
    outputPath: "\(output)/09-sunset-cocktail-ingredients-pack-details-shopify-v01.png",
    jpeg: false
) {
    drawText("SUNSET COCKTAIL", x: 1190, y: 120, width: 700, height: 52, size: 28, color: orange, bold: true, kern: 2)
    drawText("INGREDIENTS", x: 1190, y: 200, width: 710, height: 78, size: 62, color: burgundy, bold: true)
    drawRule(x: 1190, y: 315, width: 430, color: red, height: 8)

    drawText("AS PRINTED ON THE PACKAGE", x: 1190, y: 365, width: 720, height: 45, size: 22, color: orange, bold: true, kern: 1)
    drawText(
        "Alcohol\nWater (Aqua)\nFragrance (Parfum)\nPEG-40 Hydrogenated Castor Oil\nPropylene Glycol\nAlpha-Isomethyl Ionone\nBenzyl Salicylate\nLinalool\nCitronellol\nGeraniol\nLimonene\nEugenol",
        x: 1190,
        y: 425,
        width: 720,
        height: 720,
        size: 38,
        color: dark,
        lineHeight: 59
    )

    drawText("PACK DETAILS", x: 1190, y: 1240, width: 720, height: 48, size: 25, color: burgundy, bold: true, kern: 1.5)
    drawText("50 ML / 1.69 FL. OZ.\nPRODUCT CODE  P10538\nBARCODE  5056795407284", x: 1190, y: 1300, width: 720, height: 200, size: 32, color: dark, bold: true, lineHeight: 58)

    drawText("FLAMMABLE", x: 1190, y: 1600, width: 720, height: 52, size: 32, color: red, bold: true, kern: 2)
    drawText("Keep away from heat and open flame.", x: 1190, y: 1665, width: 690, height: 110, size: 30, color: dark, lineHeight: 43)
}

let background10 = try loadImage("\(backgrounds)/10-closing-hero-environment.png")
try render(
    background: background10,
    outputPath: "\(output)/10-sunset-cocktail-closing-hero-shopify-v01.jpg",
    jpeg: true
) {
    drawText("A SCENT JOURNEY", x: 250, y: 145, width: 1548, height: 125, size: 92, color: cream, bold: true, alignment: .center, kern: 1)
    drawText("SUNSET COCKTAIL", x: 420, y: 285, width: 1208, height: 70, size: 38, color: burgundy, bold: true, alignment: .center, kern: 2)

    let canisterRect = NSRect(x: 1015, y: 145, width: 715, height: 1170)
    let bottleRect = NSRect(x: 680, y: 125, width: 548, height: 1370)
    drawSoftShadow(in: NSRect(x: 725, y: 114, width: 800, height: 50), opacity: 0.24, blur: 24)
    drawTransparentImage(cleanCanister, in: canisterRect)
    drawCroppedImage(bottle, source: bottleSource, destination: bottleRect)
}

print("Rendered Sunset Cocktail gallery to \(output)")
