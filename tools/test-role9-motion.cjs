const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const poseDir = path.resolve(__dirname, '../assets/resources/texture/juese/9');
const uuids = new Set();
for (const pose of ['idle', 'blink', 'cheer', 'fire']) {
  const name = `pose_${pose}`;
  const png = fs.readFileSync(path.join(poseDir, `${name}.png`));
  assert.equal(png.subarray(1, 4).toString(), 'PNG', `${name}: invalid PNG`);
  assert.equal(png.readUInt32BE(16), 245, `${name}: width`);
  assert.equal(png.readUInt32BE(20), 311, `${name}: height`);
  assert.equal(png[25], 6, `${name}: expected RGBA PNG`);

  const meta = JSON.parse(fs.readFileSync(path.join(poseDir, `${name}.png.meta`), 'utf8'));
  assert.equal(meta.subMetas.f9941.displayName, name);
  assert.equal(meta.subMetas.f9941.userData.rawWidth, 245);
  assert.equal(meta.subMetas.f9941.userData.rawHeight, 311);
  assert(!uuids.has(meta.uuid), `${name}: duplicate UUID`);
  uuids.add(meta.uuid);
}
console.log('第 9 位角色动作：4 帧 PNG／SpriteFrame metadata 验证通过');
