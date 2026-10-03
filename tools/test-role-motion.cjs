const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const uuids = new Set();
for (let roleID = 1; roleID <= 10; roleID++) {
  const poseDir = path.join(root, 'assets/resources/texture/juese', String(roleID));
  const body = fs.readFileSync(path.join(poseDir, 'shenti.png'));
  const width = body.readUInt32BE(16);
  const height = body.readUInt32BE(20);
  for (const pose of ['idle', 'blink', 'cheer', 'fire']) {
    const name = `pose_${pose}`;
    const png = fs.readFileSync(path.join(poseDir, `${name}.png`));
    assert.equal(png.subarray(1, 4).toString(), 'PNG', `${roleID}/${name}: invalid PNG`);
    assert.equal(png.readUInt32BE(16), width, `${roleID}/${name}: width`);
    assert.equal(png.readUInt32BE(20), height, `${roleID}/${name}: height`);
    assert.equal(png[25], 6, `${roleID}/${name}: expected RGBA PNG`);

    const meta = JSON.parse(fs.readFileSync(path.join(poseDir, `${name}.png.meta`), 'utf8'));
    assert.equal(meta.subMetas.f9941.displayName, name);
    assert.equal(meta.subMetas.f9941.userData.rawWidth, width);
    assert.equal(meta.subMetas.f9941.userData.rawHeight, height);
    assert(!uuids.has(meta.uuid), `${roleID}/${name}: duplicate UUID`);
    uuids.add(meta.uuid);
  }
}
console.log('10 位营业员动作：40 帧 PNG／SpriteFrame metadata 验证通过');
