const fs = require('fs');
const path = require('path');

function hasCyrillic(text) {
  return /[а-яА-ЯЁё]/.test(text);
}

function hasPolish(text) {
  return /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(text);
}

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next') {
        walk(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

console.log("Scanning .tsx/.ts files for mixed Cyrillic and Polish on the same line...");

walk(path.join(__dirname, '../app'), (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (hasCyrillic(line) && hasPolish(line)) {
      console.log(`[MIXED] ${filePath}:${index + 1}`);
      console.log(`> ${line.trim()}`);
    }
  });
});

walk(path.join(__dirname, '../components'), (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (hasCyrillic(line) && hasPolish(line)) {
        console.log(`[MIXED] ${filePath}:${index + 1}`);
        console.log(`> ${line.trim()}`);
      }
    });
  });

console.log("Done.");
