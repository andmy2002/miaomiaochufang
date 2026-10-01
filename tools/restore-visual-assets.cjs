// Restore imported visual metadata from the archived 2.x project; never edit the archive.
// Dry run by default. Pass --apply to write mechanically converted metadata/references.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const source = process.env.CHEF_LEGACY_PROJECT || '/Volumes/home/DS224work/cocos creator 3/2.x_源码_厨师游戏_2.4.13ts';
const apply = process.argv.includes('--apply');
function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
        ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const changes = new Map();
function stage(file, data) {
    if (JSON.stringify(read(file)) !== JSON.stringify(data)) changes.set(file, JSON.stringify(data, null, 2) + '\n');
}
const frames = new Map();
let imageCount = 0;
for (const file of walk(path.join(root, 'assets')).filter(f => /\.(png|jpg|jpeg)\.meta$/i.test(f))) {
    const rel = path.relative(root, file);
    const oldFile = path.join(source, rel);
    if (!fs.existsSync(oldFile)) continue;
    const old = read(oldFile), meta = read(file);
    const entries = Object.values(old.subMetas || {}).filter(s => s.importer === 'sprite-frame');
    if (entries.length !== 1) throw new Error('Expected one legacy sprite frame: ' + rel);
    if (meta.uuid !== old.uuid || digest(file.slice(0, -5)) !== digest(oldFile.slice(0, -5))) {
        throw new Error('Archive image differs; refusing to guess: ' + rel);
    }
    const s = entries[0], uuid = meta.uuid, name = path.basename(file).replace(/\.[^.]+\.meta$/, '');
    frames.set(s.uuid, uuid + '@f9941');
    meta.userData = { ...meta.userData, type: 'sprite-frame', redirect: uuid + '@6c48a' };
    const frameData = {};
    for (const key of ['trimType', 'trimThreshold', 'rotated', 'offsetX', 'offsetY', 'trimX', 'trimY', 'width', 'height', 'rawWidth', 'rawHeight', 'borderTop', 'borderBottom', 'borderLeft', 'borderRight']) {
        if (s[key] !== undefined) frameData[key] = s[key];
    }
    meta.subMetas = {
        '6c48a': {
            importer: 'texture', uuid: uuid + '@6c48a', displayName: name, id: '6c48a', name: 'texture',
            ver: '1.0.22', imported: true, files: ['.json'], subMetas: {},
            userData: { wrapModeS: 'clamp-to-edge', wrapModeT: 'clamp-to-edge',
                imageUuidOrDatabaseUri: uuid, isUuid: true, visible: false,
                minfilter: old.filterMode === 'point' ? 'nearest' : 'linear',
                magfilter: old.filterMode === 'point' ? 'nearest' : 'linear', mipfilter: 'none', anisotropy: 0 }
        },
        f9941: {
            importer: 'sprite-frame', uuid: uuid + '@f9941', displayName: name, id: 'f9941', name: 'spriteFrame',
            ver: '1.0.12', imported: true, files: ['.json'], subMetas: {},
            userData: { ...frameData, packable: old.packable !== false, pixelsToUnit: 100,
                pivotX: 0.5, pivotY: 0.5, meshType: 0, isUuid: true,
                imageUuidOrDatabaseUri: uuid + '@6c48a', atlasUuid: '' }
        }
    };
    stage(file, meta);
    imageCount++;
}
// Repair the numeric font using its original image UUID and cell dimensions.
const atlasFile = path.join(root, 'assets/texture/font/num1.labelatlas.meta');
const atlas = read(atlasFile), oldAtlas = read(path.join(source, 'assets/texture/font/num1.labelatlas.meta'));
atlas.userData = { ...atlas.userData, spriteFrameUuid: oldAtlas.rawTextureUuid + '@f9941',
    itemWidth: oldAtlas.itemWidth, itemHeight: oldAtlas.itemHeight, startChar: oldAtlas.startChar, fontSize: oldAtlas.fontSize };
stage(atlasFile, atlas);
let references = 0, materials = 0;
function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.__uuid__ === 'string') {
        const replacement = frames.get(value.__uuid__.split('@')[0]);
        if (replacement && value.__uuid__ !== replacement) { value.__uuid__ = replacement; references++; }
    }
    // The 2.x built-in sprite material is not a project material in 3.x.
    if (value._customMaterial?.__uuid__ === 'fda095cb-831d-4601-ad94-846013963de8') {
        value._customMaterial = null; materials++;
    }
    for (const child of Object.values(value)) visit(child);
}
for (const file of walk(path.join(root, 'assets')).filter(f => /\.(scene|prefab)$/.test(f))) {
    const data = read(file);
    visit(data);
    stage(file, data);
}
if (apply) for (const [file, data] of changes) fs.writeFileSync(file, data);
console.log(JSON.stringify({ apply, checkedImages: imageCount, remappedReferences: references,
    removedLegacyMaterials: materials, changedFiles: changes.size }, null, 2));
