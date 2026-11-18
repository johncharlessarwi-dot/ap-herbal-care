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

function checkPublishDirectory(directory, prefix = '') {
  const stats = fs.lstatSync(directory, { throwIfNoEntry: false });
  if (!stats) return;
  if (!stats.isDirectory()) throw new Error('The publish path must be a regular directory.');

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${prefix}${entry.name}`;
    if (file === 'images' && entry.isDirectory()) {
      checkPublishDirectory(path.join(directory, entry.name), 'images/');
    } else if (!entry.isFile() || !publicFiles.includes(file)) {
      throw new Error('The publish directory contains unlisted items. Use a clean output directory.');
    }
  }
}

function buildSite(sourceDirectory, publishDirectory) {
  const root = fs.realpathSync(sourceDirectory);
  const parent = fs.realpathSync(path.dirname(publishDirectory));
  const destination = path.join(parent, path.basename(publishDirectory));
  if (destination === root) throw new Error('Do not publish into the source directory.');
  checkPublishDirectory(destination);

  const sources = publicFiles.map(file => {
    const source = path.join(root, file);
    if (!fs.lstatSync(source, { throwIfNoEntry: false })?.isFile() || fs.realpathSync(source) !== source) {
      throw new Error(`Expected a regular site file, without symlinks: ${file}`);
    }
    return { file, source };
  });

  const staging = fs.mkdtempSync(path.join(parent, '.site-build-'));
  try {
    fs.mkdirSync(path.join(staging, 'images'));
    for (const { file, source } of sources) {
      fs.copyFileSync(source, path.join(staging, file), fs.constants.COPYFILE_EXCL);
    }
    fs.mkdirSync(path.join(destination, 'images'), { recursive: true });
    // Replace directory entries, not file contents: an existing file may be a hard link.
    for (const { file } of sources) {
      fs.renameSync(path.join(staging, file), path.join(destination, file));
    }
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  try {
    buildSite(root, path.resolve(process.argv[2] ?? path.join(root, 'dist')));
  } catch (error) {
    const detail = error.code ? `Filesystem error (${error.code}).` : error.message;
    console.error(`Site build failed: ${detail}`);
    process.exitCode = 1;
  }
}

module.exports = { buildSite };
