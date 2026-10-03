const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const roleDir = path.resolve(__dirname, '../assets/resources/texture/juese/9');
const template = JSON.parse(fs.readFileSync(path.join(roleDir, 'shenti.png.meta'), 'utf8'));

for (const pose of ['idle', 'blink', 'cheer', 'fire']) {
  const name = `pose_${pose}`;
  const metaPath = path.join(roleDir, `${name}.png.meta`);
  if (fs.existsSync(metaPath)) continue;

  const meta = structuredClone(template);
  const uuid = randomUUID();
  meta.uuid = uuid;
  for (const [id, subMeta] of Object.entries(meta.subMetas)) {
    subMeta.uuid = `${uuid}@${id}`;
    subMeta.displayName = name;
    subMeta.userData.imageUuidOrDatabaseUri = id === '6c48a' ? uuid : `${uuid}@6c48a`;
  }
  meta.userData.redirect = `${uuid}@6c48a`;
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  process.stdout.write(`${name}: ${uuid}\n`);
}
