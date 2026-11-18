const fs = require('node:fs');
const path = require('node:path');

const publicFiles = [
  'index.html',
  'about.html',
  'services.html',
  'products.html',
  'contact.html',
  '404.html',
  'style.css',
  'main.js',
  'images/logo  ap herbal care.jpeg',
  'images/WhatsApp Image 2026-06-05 at 16.30.05.jpeg',
  'images/WhatsApp Image 2026-06-05 at 16.30.08.jpeg',
  'images/WhatsApp Image 2026-06-05 at 16.30.10.jpeg',
  'images/WhatsApp Image 2026-06-05 at 16.30.13.jpeg',
  'images/WhatsApp Image 2026-06-05 at 16.30.16.jpeg',
];

function buildSite(sourceDirectory, publishDirectory) {
  const root = fs.realpathSync(sourceDirectory);
  const sources = publicFiles.map(file => {
    const source = path.join(root, file);
    if (!fs.lstatSync(source, { throwIfNoEntry: false })?.isFile() || fs.realpathSync(source) !== source) {
      throw new Error(`Expected a regular site file, without symlinks: ${file}`);
    }
    return { file, source };
  });

  // Refuse an existing destination so stale or unlisted files cannot be deployed.
  fs.mkdirSync(publishDirectory);
  fs.mkdirSync(path.join(publishDirectory, 'images'));
  for (const { file, source } of sources) {
    fs.copyFileSync(source, path.join(publishDirectory, file), fs.constants.COPYFILE_EXCL);
  }
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  try {
    buildSite(root, path.resolve(process.argv[2] ?? path.join(root, 'dist')));
  } catch (error) {
    const detail = error.code === 'EEXIST'
      ? 'Choose a new publish directory.'
      : error.code ? `Filesystem error (${error.code}).` : error.message;
    console.error(`Site build failed: ${detail}`);
    process.exitCode = 1;
  }
}

module.exports = { buildSite };
