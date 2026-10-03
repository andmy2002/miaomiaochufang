const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const customerID = process.argv[2];
if (!/^[1-6]$/.test(customerID || '')) {
  throw new Error('Usage: node prepare-customer-motion-meta.cjs <customer-id>');
}
const customerDir = path.resolve(__dirname, `../assets/resources/texture/guke/${customerID}`);
const template = JSON.parse(fs.readFileSync(path.join(customerDir, 'shenti.png.meta'), 'utf8'));

for (const pose of ['idle', 'blink', 'angry']) {
  const name = `pose_${pose}`;
  const imagePath = path.join(customerDir, `${name}.png`);
  const metaPath = `${imagePath}.meta`;
  if (!fs.existsSync(imagePath)) throw new Error(`Missing image: ${imagePath}`);
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
  process.stdout.write(`customer ${customerID} ${name}: ${uuid}\n`);
}
