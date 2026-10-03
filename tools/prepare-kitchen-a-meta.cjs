const fs = require('node:fs');
const path = require('node:path');

const directory = path.resolve(__dirname, '../assets/resources/texture/chufang/A');
const dimensions = {
  'npg_bg1.png': [720, 469],
  'img_xiaoxiongbg.png': [345, 160],
  'npg_bg2.png': [720, 353],
  'img_taibu.png': [424, 136],
  'img_zhubu.png': [247, 90],
  'img_zhuangshi.png': [86, 86],
  'img_bg3_img.png': [203, 202],
};

for (const [filename, [width, height]] of Object.entries(dimensions)) {
  const image = fs.readFileSync(path.join(directory, filename));
  if (image.subarray(1, 4).toString() !== 'PNG') throw new Error(`${filename}: invalid PNG`);
  if (image.readUInt32BE(16) !== width || image.readUInt32BE(20) !== height) {
    throw new Error(`${filename}: unexpected image size`);
  }

  const metaPath = path.join(directory, `${filename}.meta`);
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const frame = meta.subMetas.f9941.userData;
  Object.assign(frame, {
    offsetX: 0,
    offsetY: 0,
    trimX: 0,
    trimY: 0,
    width,
    height,
    rawWidth: width,
    rawHeight: height,
    vertices: {
      rawPosition: [-width / 2, -height / 2, 0, width / 2, -height / 2, 0,
        -width / 2, height / 2, 0, width / 2, height / 2, 0],
      indexes: [0, 1, 2, 2, 1, 3],
      uv: [0, height, width, height, 0, 0, width, 0],
      nuv: [0, 0, 1, 0, 0, 1, 1, 1],
      minPos: [-width / 2, -height / 2, 0],
      maxPos: [width / 2, height / 2, 0],
    },
  });
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  process.stdout.write(`${filename}: ${width}x${height}, uuid ${meta.uuid}\n`);
}
