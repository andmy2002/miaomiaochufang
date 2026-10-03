const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const uuids = new Set();
const idleUuids = [];
for (let customerID = 1; customerID <= 6; customerID++) {
  const poseDir = path.join(root, 'assets/resources/texture/guke', String(customerID));
  const body = fs.readFileSync(path.join(poseDir, 'shenti.png'));
  const width = body.readUInt32BE(16);
  const height = body.readUInt32BE(20);
  for (const pose of ['idle', 'blink', 'angry']) {
    const name = `pose_${pose}`;
    const png = fs.readFileSync(path.join(poseDir, `${name}.png`));
    assert.equal(png.subarray(1, 4).toString(), 'PNG', `${customerID}/${name}: invalid PNG`);
    assert.equal(png.readUInt32BE(16), width, `${customerID}/${name}: width`);
    assert.equal(png.readUInt32BE(20), height, `${customerID}/${name}: height`);
    assert.equal(png[25], 6, `${customerID}/${name}: expected RGBA PNG`);

    const meta = JSON.parse(fs.readFileSync(path.join(poseDir, `${name}.png.meta`), 'utf8'));
    assert.equal(meta.subMetas.f9941.displayName, name);
    assert.equal(meta.subMetas.f9941.userData.rawWidth, width);
    assert.equal(meta.subMetas.f9941.userData.rawHeight, height);
    assert(!uuids.has(meta.uuid), `${customerID}/${name}: duplicate UUID`);
    uuids.add(meta.uuid);
    if (pose === 'idle') idleUuids.push(`${meta.uuid}@f9941`);
  }
}
const scene = JSON.parse(fs.readFileSync(path.join(root, 'assets/scene/game.scene'), 'utf8'));
const customer = scene.find(entry => entry.__type__ === 'cc.Node' && entry._name === 'gukeshenti');
const hands = scene.find(entry => entry.__type__ === 'cc.Node' && entry._name === 'gukeshou');
const player = scene.find(entry => entry.gukeshenti?.__id__ === scene.indexOf(customer));
assert.deepEqual(player.customerIdleFrames.map(frame => frame.__uuid__), idleUuids, 'six scene bindings');
assert.equal(scene[customer._children[0].__id__ + 1]._spriteFrame.__uuid__, idleUuids[0], 'scene preview frame');
assert.equal(hands._active, false, 'old hands hidden');
for (const child of customer._children.slice(1)) assert.equal(scene[child.__id__]._active, false, 'old face part hidden');
console.log('6 位顾客动作：18 帧及 game.scene 的 6 个直接绑定验证通过');
