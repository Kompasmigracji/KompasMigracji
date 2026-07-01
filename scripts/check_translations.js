const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');

function hasCyrillic(text) {
  return /[а-яА-ЯЁё]/.test(text);
}

function hasLatin(text) {
  return /[a-zA-Z]/.test(text);
}

function checkFiles() {
  const plPath = path.join(messagesDir, 'pl.json');
  const enPath = path.join(messagesDir, 'en.json');
  const ruPath = path.join(messagesDir, 'ru.json');
  const ukPath = path.join(messagesDir, 'uk.json');
  
  const files = [
    { name: 'pl.json', path: plPath, check: hasCyrillic, issue: 'Cyrillic' },
    { name: 'en.json', path: enPath, check: hasCyrillic, issue: 'Cyrillic' },
    { name: 'ru.json', path: ruPath, check: hasLatin, issue: 'Latin' },
    { name: 'uk.json', path: ukPath, check: hasLatin, issue: 'Latin' }
  ];

  let foundIssues = false;

  for (const file of files) {
    if (fs.existsSync(file.path)) {
      const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
      console.log(`Checking ${file.name}...`);
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && file.check(value)) {
          // Exclude URLs and technical terms if necessary, but we'll log all first
          if (value.includes('http') || value.includes('WhatsApp') || value.includes('Viber')) continue;
          
          console.log(`[WARNING] ${file.issue} found in ${file.name} - Key: ${key} | Value: ${value}`);
          foundIssues = true;
        }
      }
    }
  }

  if (!foundIssues) {
    console.log("No mixed languages found.");
  }
}

checkFiles();
