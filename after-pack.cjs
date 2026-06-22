const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build-output', 'win-unpacked');

const filesToDelete = [
  'LICENSES.chromium.html',
  'LICENSE',
  'LICENSE.electron.txt'
];

let totalSaved = 0;

filesToDelete.forEach(file => {
  const filePath = path.join(buildDir, file);
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      totalSaved += stats.size;
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  } catch (error) {
    console.error(`✗ Failed to delete ${file}: ${error.message}`);
  }
});

console.log(`\n✓ Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
