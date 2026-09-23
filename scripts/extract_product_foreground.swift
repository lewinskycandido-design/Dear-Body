import AppKit
import CoreImage
import Foundation
import Vision

enum ExtractionError: Error, CustomStringConvertible {
    case usage
    case imageLoad(String)
    case noObservation
    case renderFailure

    var description: String {
        switch self {
        case .usage:
            return "Usage: swift extract_product_foreground.swift <input-image> <output-png>"
        case .imageLoad(let path):
            return "Could not load image at \(path)"
        case .noObservation:
            return "Vision did not find a foreground object"
        case .renderFailure:
            return "Could not render the extracted foreground"
        }
    }
}

func savePNG(_ image: CIImage, to path: String) throws {
    let context = CIContext(options: [.useSoftwareRenderer: false])
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    guard let data = context.pngRepresentation(
        of: image,
        format: .RGBA8,
        colorSpace: colorSpace,
        options: [:]
    ) else {
        throw ExtractionError.renderFailure
    }
    try data.write(to: URL(fileURLWithPath: path))
}

do {
    guard CommandLine.arguments.count == 3 else {
        throw ExtractionError.usage
    }

    let inputPath = CommandLine.arguments[1]
    let outputPath = CommandLine.arguments[2]
    let inputURL = URL(fileURLWithPath: inputPath)

    guard let input = CIImage(
        contentsOf: inputURL,
        options: [.applyOrientationProperty: true]
    ) else {
        throw ExtractionError.imageLoad(inputPath)
    }

    let handler = VNImageRequestHandler(ciImage: input)
    let request = VNGenerateForegroundInstanceMaskRequest()
    request.usesCPUOnly = true
    try handler.perform([request])

    guard let observation = request.results?.first else {
        throw ExtractionError.noObservation
    }

    let maskBuffer = try observation.generateScaledMaskForImage(
        forInstances: observation.allInstances,
        from: handler
    )
    let mask = CIImage(cvPixelBuffer: maskBuffer)
    let transparent = CIImage(color: .clear).cropped(to: input.extent)

    guard let blend = CIFilter(name: "CIBlendWithMask") else {
        throw ExtractionError.renderFailure
    }
    blend.setValue(input, forKey: kCIInputImageKey)
    blend.setValue(transparent, forKey: kCIInputBackgroundImageKey)
    blend.setValue(mask, forKey: kCIInputMaskImageKey)

    guard let output = blend.outputImage?.cropped(to: input.extent) else {
        throw ExtractionError.renderFailure
    }

    try savePNG(output, to: outputPath)
    print("Saved \(outputPath)")
} catch {
    fputs("\(error)\n", stderr)
    exit(1)
}
