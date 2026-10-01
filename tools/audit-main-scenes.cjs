const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
        ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const assets = new Set();
function collect(meta) {
    if (meta.uuid) assets.add(meta.uuid);
    for (const child of Object.values(meta.subMetas || {})) collect(child);
}
for (const dir of [path.join(root, 'assets'), '/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/editor/assets']) {
    for (const file of walk(dir).filter(f => f.endsWith('.meta'))) collect(JSON.parse(fs.readFileSync(file)));
}
const failures = [];
for (const scene of ['game', 'loadScene']) {
    const data = JSON.parse(fs.readFileSync(path.join(root, 'assets/scene', scene + '.scene')));
    let references = 0;
    for (const item of data) {
        for (const field of ['_spriteFrame', '_font', '_customMaterial']) {
            const uuid = item[field]?.__uuid__;
            if (uuid) {
                references++;
                if (!assets.has(uuid)) failures.push({ scene, field, uuid });
            }
        }
        if (item.__type__ === 'cc.Canvas' && data[item._cameraComponent?.__id__]?.__type__ !== 'cc.Camera') {
            failures.push({ scene, reason: 'Canvas camera missing' });
        }
        if (['cc.Sprite', 'cc.Label'].includes(item.__type__)) {
            const node = data[item.node?.__id__];
            if (!node?._components?.some(ref => data[ref.__id__]?.__type__ === 'cc.UITransform')) {
                failures.push({ scene, reason: 'UITransform missing', node: node?._name });
            }
        }
    }
    console.log(`${scene}: ${references} visual asset references checked`);
}
console.log(JSON.stringify({ failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;
