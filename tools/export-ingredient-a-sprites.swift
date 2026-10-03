import AppKit
import Foundation
import ImageIO

// Export the already-approved 3x6 review sheet into individual transparent sprites.
// This is a mechanical alpha/crop/resize pass; it does not redesign the artwork.

struct Item {
    let name: String
    let relativePath: String
    let width: Int
    let height: Int
}

let items: [Item] = [
    .init(name: "mianbaoshang", relativePath: "A/mianbaoshang", width: 157, height: 84),
    .init(name: "jiaceng6", relativePath: "A/jiaceng6", width: 149, height: 58),
    .init(name: "jiaceng3", relativePath: "A/jiaceng3", width: 140, height: 52),
    .init(name: "kaiweicai3", relativePath: "A/kaiweicai3", width: 131, height: 147),
    .init(name: "dingcengpeiliao", relativePath: "A/dingcengpeiliao", width: 111, height: 100),
    .init(name: "hong", relativePath: "yinliao/hong", width: 45, height: 81),
    .init(name: "jiaceng2", relativePath: "A/jiaceng2", width: 158, height: 68),
    .init(name: "jiaceng7", relativePath: "A/jiaceng7", width: 148, height: 51),
    .init(name: "jiaceng1", relativePath: "A/jiaceng1", width: 151, height: 72),
    .init(name: "kaiweicai1", relativePath: "A/kaiweicai1", width: 120, height: 146),
    .init(name: "niunai", relativePath: "yinliao/niunai", width: 65, height: 82),
    .init(name: "huang", relativePath: "yinliao/huang", width: 45, height: 81),
    .init(name: "mianbaoxia", relativePath: "A/mianbaoxia", width: 152, height: 65),
    .init(name: "jiaceng5", relativePath: "A/jiaceng5", width: 146, height: 60),
    .init(name: "jiaceng4", relativePath: "A/jiaceng4", width: 158, height: 61),
    .init(name: "kaiweicai2", relativePath: "A/kaiweicai2", width: 137, height: 125),
    .init(name: "chadi", relativePath: "yinliao/chadi", width: 82, height: 80),
    .init(name: "lan", relativePath: "yinliao/lan", width: 45, height: 81),
]

guard CommandLine.arguments.count == 4 else {
    fputs("Usage: swift tools/export-ingredient-a-sprites.swift SHEET.png EGG.png OUTPUT_DIR\n", stderr)
    exit(2)
}

let input = URL(fileURLWithPath: CommandLine.arguments[1])
let eggInput = URL(fileURLWithPath: CommandLine.arguments[2])
let output = URL(fileURLWithPath: CommandLine.arguments[3], isDirectory: true)
guard let source = CGImageSourceCreateWithURL(input as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil),
      image.width == 1774, image.height == 887 else {
    fputs("Expected approved 1774x887 ingredient contact sheet\n", stderr)
    exit(2)
}

let sw = image.width
let sh = image.height
let colorSpace = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue
guard let eggSource = CGImageSourceCreateWithURL(eggInput as CFURL, nil),
      let eggImage = CGImageSourceCreateImageAtIndex(eggSource, 0, nil) else {
    fatalError("Cannot read transparent fried-egg source")
}
var sourcePixels = [UInt8](repeating: 0, count: sw * sh * 4)
guard let sourceContext = CGContext(data: &sourcePixels, width: sw, height: sh,
                                    bitsPerComponent: 8, bytesPerRow: sw * 4,
                                    space: colorSpace, bitmapInfo: bitmapInfo) else {
    fatalError("Cannot read input pixels")
}
sourceContext.draw(image, in: CGRect(x: 0, y: 0, width: sw, height: sh))

let cardLefts = [32, 321, 609, 897, 1185, 1473]
let cardTops = [56, 321, 586]
let cropWidth = 240
let cropHeight = 220
let horizontalPadding = 15
let verticalPadding = 15

func pixel(_ x: Int, _ y: Int) -> (UInt8, UInt8, UInt8) {
    let index = (y * sw + x) * 4
    return (sourcePixels[index], sourcePixels[index + 1], sourcePixels[index + 2])
}

func isBackground(_ x: Int, _ y: Int) -> Bool {
    let (rr, gg, bb) = pixel(x, y)
    let r = Int(rr), g = Int(gg), b = Int(bb)
    // Card interior and its soft cream shadow. Dark outlines and saturated food
    // colors are excluded; the flood fill also protects enclosed white milk/egg.
    return r >= 190 && g >= 172 && b >= 125 && r - g <= 85 && g - b <= 95
}

for (index, item) in items.enumerated() {
    if item.name == "jiaceng4" {
        let destination = output.appendingPathComponent(item.relativePath + ".png")
        try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(),
                                                withIntermediateDirectories: true)
        guard let context = CGContext(data: nil, width: item.width, height: item.height,
                                      bitsPerComponent: 8, bytesPerRow: item.width * 4,
                                      space: colorSpace, bitmapInfo: bitmapInfo),
              let encoder = CGImageDestinationCreateWithURL(destination as CFURL, "public.png" as CFString, 1, nil) else {
            fatalError("Cannot prepare fried-egg export")
        }
        context.interpolationQuality = .high
        context.draw(eggImage, in: CGRect(x: 0, y: 0, width: item.width, height: item.height))
        guard let result = context.makeImage() else { fatalError("Cannot render fried egg") }
        CGImageDestinationAddImage(encoder, result, nil)
        guard CGImageDestinationFinalize(encoder) else { fatalError("Cannot save fried egg") }
        print("\(item.relativePath): \(item.width)x\(item.height), dedicated transparent source")
        continue
    }
    let col = index % 6
    let row = index / 6
    let x0 = cardLefts[col] + horizontalPadding
    let y0 = cardTops[row] + verticalPadding
    let count = cropWidth * cropHeight
    var outside = [Bool](repeating: false, count: count)
    var queue = [Int]()
    queue.reserveCapacity(count)

    func enqueue(_ x: Int, _ y: Int) {
        guard x >= 0, y >= 0, x < cropWidth, y < cropHeight else { return }
        let p = y * cropWidth + x
        guard !outside[p], isBackground(x0 + x, y0 + y) else { return }
        outside[p] = true
        queue.append(p)
    }

    for x in 0..<cropWidth { enqueue(x, 0); enqueue(x, cropHeight - 1) }
    for y in 0..<cropHeight { enqueue(0, y); enqueue(cropWidth - 1, y) }
    var head = 0
    while head < queue.count {
        let p = queue[head]
        head += 1
        let x = p % cropWidth, y = p / cropWidth
        enqueue(x - 1, y)
        enqueue(x + 1, y)
        enqueue(x, y - 1)
        enqueue(x, y + 1)
    }

    // Keep only the main foreground component (object and connected details).
    var component = [Int](repeating: -1, count: count)
    var components: [[Int]] = []
    for p in 0..<count where !outside[p] && component[p] == -1 {
        let id = components.count
        var members = [p]
        component[p] = id
        var h = 0
        while h < members.count {
            let q = members[h]
            h += 1
            let x = q % cropWidth, y = q / cropWidth
            for (nx, ny) in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)] {
                guard nx >= 0, ny >= 0, nx < cropWidth, ny < cropHeight else { continue }
                let n = ny * cropWidth + nx
                if !outside[n] && component[n] == -1 {
                    component[n] = id
                    members.append(n)
                }
            }
        }
        components.append(members)
    }
    guard let largest = components.enumerated().max(by: { $0.element.count < $1.element.count }) else {
        fatalError("No foreground for \(item.name)")
    }

    let foreground = largest.element
    let minX = max(0, foreground.map { $0 % cropWidth }.min()! - 1)
    let maxX = min(cropWidth - 1, foreground.map { $0 % cropWidth }.max()! + 1)
    let minY = max(0, foreground.map { $0 / cropWidth }.min()! - 1)
    let maxY = min(cropHeight - 1, foreground.map { $0 / cropWidth }.max()! + 1)
    let contentWidth = maxX - minX + 1
    let contentHeight = maxY - minY + 1

    var spritePixels = [UInt8](repeating: 0, count: item.width * item.height * 4)
    // Existing Cocos sprite-frame dimensions are retained exactly, so scene node
    // sizes and .meta UUID/pivots remain valid. Stretch is necessary for layered
    // ingredients whose gameplay silhouette is deliberately flatter than the card.
    let padding = 2
    for dy in padding..<(item.height - padding) {
        let sy = minY + Int(Double(dy - padding) * Double(contentHeight) / Double(item.height - 2 * padding))
        for dx in padding..<(item.width - padding) {
            let sx = minX + Int(Double(dx - padding) * Double(contentWidth) / Double(item.width - 2 * padding))
            let p = sy * cropWidth + sx
            guard component[p] == largest.offset else { continue }
            let from = ((y0 + sy) * sw + x0 + sx) * 4
            let to = (dy * item.width + dx) * 4
            spritePixels[to] = sourcePixels[from]
            spritePixels[to + 1] = sourcePixels[from + 1]
            spritePixels[to + 2] = sourcePixels[from + 2]
            spritePixels[to + 3] = 255
        }
    }

    let destination = output.appendingPathComponent(item.relativePath + ".png")
    try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(),
                                            withIntermediateDirectories: true)
    let destinationResult = spritePixels.withUnsafeMutableBytes { bytes -> Bool in
        guard let context = CGContext(data: bytes.baseAddress, width: item.width, height: item.height,
                                      bitsPerComponent: 8, bytesPerRow: item.width * 4,
                                      space: colorSpace, bitmapInfo: bitmapInfo),
              let result = context.makeImage(),
              let encoder = CGImageDestinationCreateWithURL(destination as CFURL, "public.png" as CFString, 1, nil) else {
            return false
        }
        CGImageDestinationAddImage(encoder, result, nil)
        return CGImageDestinationFinalize(encoder)
    }
    guard destinationResult else { fatalError("Could not save \(destination.path)") }
    print("\(item.relativePath): \(item.width)x\(item.height), source \(contentWidth)x\(contentHeight)")
}
