const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const assetDirectory = path.join(root, 'assets/resources/texture/chufang/A');
const layers = {
  'npg_bg1.png': [720, 469, 'a542b6b1-1f27-4069-ba6b-af922c9d3464'],
  'img_xiaoxiongbg.png': [345, 160, '5af21295-2d1d-4f79-ae7e-4e555a1d8d72'],
  'npg_bg2.png': [720, 353, 'c234e068-84e7-4c27-a617-47088c80c35b'],
  'img_taibu.png': [424, 136, '7e47db2f-940e-46c1-a97f-7ed4e3cbd69e'],
  'img_zhubu.png': [247, 90, 'a86258ac-4084-4a3c-b2d9-6109b3647989'],
  'img_zhuangshi.png': [86, 86, '996313b0-83bf-4e08-8f87-75b6d0457dd7'],
  'img_bg3_img.png': [203, 202, '0f3f65b6-17f0-4da2-8ffa-c9e6e6fa3547'],
};

for (const [filename, [width, height, uuid]] of Object.entries(layers)) {
  const png = fs.readFileSync(path.join(assetDirectory, filename));
  assert.equal(png.subarray(1, 4).toString(), 'PNG', filename);
  assert.equal(png.readUInt32BE(16), width, filename);
  assert.equal(png.readUInt32BE(20), height, filename);
  assert.equal(png[25], 6, `${filename}: RGBA required`);
  const meta = JSON.parse(fs.readFileSync(path.join(assetDirectory, `${filename}.meta`), 'utf8'));
  assert.equal(meta.uuid, uuid, `${filename}: original UUID must be retained`);
  assert.equal(meta.subMetas.f9941.userData.rawWidth, width, filename);
  assert.equal(meta.subMetas.f9941.userData.rawHeight, height, filename);
  assert.equal(meta.subMetas.f9941.uuid, `${uuid}@f9941`, filename);
}

const scene = JSON.parse(fs.readFileSync(path.join(root, 'assets/scene/game.scene'), 'utf8'));
const controller = scene.find(entry => entry.bg1 && entry.chuang && entry.zhuozi && entry.taibu && entry.zhuangshi && entry.guizi);
assert(controller, 'game.scene background controller bindings');
for (const key of ['bg1', 'chuang', 'zhuozi', 'taibu', 'zhuangshi', 'guizi']) {
  assert.notEqual(controller[key], null, `background binding ${key}`);
}
const script = fs.readFileSync(path.join(root, 'assets/Script/bgControl.ts'), 'utf8');
for (const filename of Object.keys(layers)) assert(script.includes(filename.slice(0, -4)), `loader references ${filename}`);
console.log('A 款厨房：7 个分层 PNG、原资源 UUID、场景绑定与换肤路径验证通过');
