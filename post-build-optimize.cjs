const fs = require('fs');
const path = require('path');

// 要保留的语言
const keepLanguages = ['zh-CN', 'en-US', 'zh-TW'];

// 构建后的目录
const localesDir = path.join(__dirname, 'build-output', 'win-unpacked', 'locales');

try {
  if (fs.existsSync(localesDir)) {
    const files = fs.readdirSync(localesDir);

    let deletedCount = 0;
    let savedBytes = 0;

    files.forEach(file => {
      const langCode = file.replace('.pak', '');
      if (!keepLanguages.includes(langCode)) {
        const filePath = path.join(localesDir, file);
        const stats = fs.statSync(filePath);
        savedBytes += stats.size;
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    console.log(`✓ Deleted ${deletedCount} language files`);
    console.log(`✓ Saved ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`✓ Kept languages: ${keepLanguages.join(', ')}`);
  } else {
    console.log('Locales directory not found');
  }
} catch (error) {
  console.error('Error:', error.message);
}
