import AppKit
import Foundation

// Mechanical export only: crops transparent margins and fits the approved
// image-generated masters into the SpriteFrame canvases used by game.scene.
guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: swift export-kitchen-a-layers.swift <master-dir> <output-dir>")
}

let masterDirectory = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let outputDirectory = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

struct Layer {
    let master: String
    let filename: String
    let width: Int
    let height: Int
    let cropAlpha: Bool
}

let layers = [
    Layer(master: "wall", filename: "npg_bg1.png", width: 720, height: 469, cropAlpha: false),
    Layer(master: "window", filename: "img_xiaoxiongbg.png", width: 345, height: 160, cropAlpha: true),
    Layer(master: "counter", filename: "npg_bg2.png", width: 720, height: 353, cropAlpha: false),
    Layer(master: "cloth", filename: "img_taibu.png", width: 424, height: 136, cropAlpha: true),
    Layer(master: "prep_cloth", filename: "img_zhubu.png", width: 247, height: 90, cropAlpha: true),
    Layer(master: "jars", filename: "img_zhuangshi.png", width: 86, height: 86, cropAlpha: true),
    Layer(master: "door", filename: "img_bg3_img.png", width: 203, height: 202, cropAlpha: true),
]

for layer in layers {
    let sourceURL = masterDirectory.appendingPathComponent("\(layer.master).png")
    let destinationURL = outputDirectory.appendingPathComponent(layer.filename)
    guard let data = try? Data(contentsOf: sourceURL),
          let bitmap = NSBitmapImageRep(data: data),
          let cgImage = bitmap.cgImage,
          let canvas = NSBitmapImageRep(
            bitmapDataPlanes: nil,
            pixelsWide: layer.width,
            pixelsHigh: layer.height,
            bitsPerSample: 8,
            samplesPerPixel: 4,
            hasAlpha: true,
            isPlanar: false,
            colorSpaceName: .deviceRGB,
            bytesPerRow: 0,
            bitsPerPixel: 0
          ),
          let context = NSGraphicsContext(bitmapImageRep: canvas) else {
        fatalError("Cannot read or render \(sourceURL.path)")
    }

    var cropX = 0
    var cropY = 0
    var cropWidth = bitmap.pixelsWide
    var cropHeight = bitmap.pixelsHigh
    if layer.cropAlpha {
        var minX = bitmap.pixelsWide
        var minY = bitmap.pixelsHigh
        var maxX = -1
        var maxY = -1
        for y in 0..<bitmap.pixelsHigh {
            for x in 0..<bitmap.pixelsWide {
                guard let color = bitmap.colorAt(x: x, y: y) else { continue }
                if color.alphaComponent > 0.08 {
                    minX = min(minX, x)
                    minY = min(minY, y)
                    maxX = max(maxX, x)
                    maxY = max(maxY, y)
                }
            }
        }
        guard maxX >= minX, maxY >= minY else { fatalError("Empty alpha: \(sourceURL.path)") }
        cropX = max(0, minX - 2)
        cropY = max(0, minY - 2)
        cropWidth = min(bitmap.pixelsWide - cropX, maxX - cropX + 3)
        cropHeight = min(bitmap.pixelsHigh - cropY, maxY - cropY + 3)
    }

    guard let cropped = cgImage.cropping(to: CGRect(x: cropX, y: cropY, width: cropWidth, height: cropHeight)) else {
        fatalError("Cannot crop \(sourceURL.path)")
    }
    let image = NSImage(cgImage: cropped, size: NSSize(width: cropWidth, height: cropHeight))
    let scale = min(Double(layer.width) / Double(cropWidth), Double(layer.height) / Double(cropHeight))
    let drawnWidth = Double(cropWidth) * scale
    let drawnHeight = Double(cropHeight) * scale
    let drawRect = NSRect(x: (Double(layer.width) - drawnWidth) / 2,
                          y: (Double(layer.height) - drawnHeight) / 2,
                          width: drawnWidth,
                          height: drawnHeight)

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    NSColor.clear.setFill()
    NSRect(x: 0, y: 0, width: layer.width, height: layer.height).fill()
    image.draw(in: drawRect, from: .zero, operation: .sourceOver, fraction: 1)
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()
    guard let png = canvas.representation(using: .png, properties: [:]) else {
        fatalError("Cannot encode \(layer.filename)")
    }
    try png.write(to: destinationURL, options: .atomic)
    print("\(layer.master): \(bitmap.pixelsWide)x\(bitmap.pixelsHigh), alpha crop \(cropWidth)x\(cropHeight) -> \(layer.width)x\(layer.height)")
}
