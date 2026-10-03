import AppKit
import Foundation

// Export the approved complete customer portrait and two expression edits to
// the original customer's body SpriteFrame canvas; keep the old layered art.
guard CommandLine.arguments.count == 5 else {
    fatalError("Usage: swift export-customer-motion.swift <customer-id> <body-png> <master-dir> <output-dir>")
}

let customerID = CommandLine.arguments[1]
let bodyURL = URL(fileURLWithPath: CommandLine.arguments[2])
let sourceDirectory = URL(fileURLWithPath: CommandLine.arguments[3], isDirectory: true)
let outputDirectory = URL(fileURLWithPath: CommandLine.arguments[4], isDirectory: true)
guard let bodyData = try? Data(contentsOf: bodyURL),
      let bodyBitmap = NSBitmapImageRep(data: bodyData) else {
    fatalError("Cannot read original customer body: \(bodyURL.path)")
}
let width = bodyBitmap.pixelsWide
let height = bodyBitmap.pixelsHigh
try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

for pose in ["idle", "blink", "angry"] {
    let source = sourceDirectory.appendingPathComponent("\(pose).png")
    let destination = outputDirectory.appendingPathComponent("pose_\(pose).png")
    guard let data = try? Data(contentsOf: source),
          let sourceBitmap = NSBitmapImageRep(data: data),
          let image = NSImage(data: data),
          let canvas = NSBitmapImageRep(
            bitmapDataPlanes: nil,
            pixelsWide: width,
            pixelsHigh: height,
            bitsPerSample: 8,
            samplesPerPixel: 4,
            hasAlpha: true,
            isPlanar: false,
            colorSpaceName: .deviceRGB,
            bytesPerRow: 0,
            bitsPerPixel: 0
          ),
          let context = NSGraphicsContext(bitmapImageRep: canvas) else {
        fatalError("Cannot read or render customer \(customerID) pose \(pose): \(source.path)")
    }

    let scale = min(Double(width) / Double(sourceBitmap.pixelsWide),
                    Double(height) / Double(sourceBitmap.pixelsHigh))
    let drawnWidth = Double(sourceBitmap.pixelsWide) * scale
    let drawnHeight = Double(sourceBitmap.pixelsHigh) * scale
    let drawRect = NSRect(x: (Double(width) - drawnWidth) / 2,
                          y: 0,
                          width: drawnWidth,
                          height: drawnHeight)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    NSColor.clear.setFill()
    NSRect(x: 0, y: 0, width: width, height: height).fill()
    image.draw(in: drawRect, from: .zero, operation: .sourceOver, fraction: 1)
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()

    guard let png = canvas.representation(using: .png, properties: [:]) else {
        fatalError("Cannot encode customer \(customerID) pose \(pose)")
    }
    try png.write(to: destination, options: .atomic)
    print("customer \(customerID) \(pose): \(sourceBitmap.pixelsWide)x\(sourceBitmap.pixelsHigh) -> \(width)x\(height)")
}
