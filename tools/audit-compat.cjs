const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../assets');
const engineAssets = '/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/editor/assets';
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(filename) : [filename];
});
const files = walk(root);
const metadataFiles = [...files.filter(file => file.endsWith('.meta')), ...walk(engineAssets).filter(file => file.endsWith('.meta'))];
const known = new Map();
for (const filename of metadataFiles) {
    const meta = JSON.parse(fs.readFileSync(filename, 'utf8'));
    if (meta.uuid) known.set(meta.uuid, filename);
    const collect = value => {
        if (!value || typeof value !== 'object') return;
        if (typeof value.uuid === 'string') known.set(value.uuid, filename);
        for (const child of Object.values(value)) collect(child);
    };
    collect(meta.subMetas);
}

const missingAssets = [];
const invalidIds = [];
const nullBindings = [];
const scriptTypes = new Map();
for (const filename of files.filter(file => /\.(scene|prefab)$/.test(file))) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const items = Array.isArray(data) ? data : [data];
    const seen = new Set();
    const visit = (value, itemIndex, property = '') => {
        if (!value || typeof value !== 'object') return;
        if (typeof value.__uuid__ === 'string' && !seen.has(value.__uuid__)) {
            seen.add(value.__uuid__);
            if (!known.has(value.__uuid__.split('@')[0])) missingAssets.push({ file: path.relative(root, filename), uuid: value.__uuid__ });
        }
        if (Number.isInteger(value.__id__) && (value.__id__ < 0 || value.__id__ >= items.length)) {
            invalidIds.push({ file: path.relative(root, filename), itemIndex, property, id: value.__id__ });
        }
        for (const [key, child] of Object.entries(value)) {
            if (child === null && !key.startsWith('_') && key !== '__prefab' && !['node', 'target', 'spriteFrame', 'material'].includes(key)) {
                nullBindings.push({ file: path.relative(root, filename), itemIndex, type: value.__type__, property: key });
            } else if (child && typeof child === 'object') visit(child, itemIndex, key);
        }
    };
    items.forEach((item, index) => {
        if (item?.__type__ && !item.__type__.startsWith('cc.')) {
            scriptTypes.set(item.__type__, (scriptTypes.get(item.__type__) || 0) + 1);
        }
        visit(item, index);
    });
}
const report = {
    scanned: { metas: files.filter(f => f.endsWith('.meta')).length, serialized: files.filter(f => /\.(scene|prefab)$/.test(f)).length, knownUuids: known.size },
    missingAssets, invalidIds, nullBindings, scriptTypes: [...scriptTypes.entries()].sort((a, b) => b[1] - a[1]),
};
const output = path.resolve(__dirname, '../temp/compat-audit.json');
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ scanned: report.scanned, missingAssets: missingAssets.length, invalidIds: invalidIds.length,
    nullBindings: nullBindings.length, scriptTypes: scriptTypes.size, output }, null, 2));
