import AppKit
import Foundation

// Export the approved high-resolution cat portraits into the legacy role-card
// canvas. Keep the originals under branding/roles/masters for future rigging.
guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: swift export-role-portraits.swift <master-dir> <output-dir>")
}

let sourceDirectory = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let outputDirectory = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
let width = 116
let height = 142

for role in 1...10 {
    let source = sourceDirectory.appendingPathComponent("\(role).png")
    let destination = outputDirectory.appendingPathComponent("\(role).png")
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
        fatalError("Cannot read or render role \(role): \(source.path)")
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
        fatalError("Cannot encode role \(role)")
    }
    try png.write(to: destination, options: .atomic)
    print("role \(role): \(sourceBitmap.pixelsWide)x\(sourceBitmap.pixelsHigh) -> \(width)x\(height)")
}
