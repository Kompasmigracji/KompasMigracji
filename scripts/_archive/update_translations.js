const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const updates = {
  'uk.json': 'В мережі',
  'ru.json': 'В сети',
  'pl.json': 'Online',
  'en.json': 'Online',
  'rom.json': 'Online'
};

for (const file of files) {
  const filePath = path.join(messagesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data['chat_online'] = updates[file] || 'Online';
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  } catch (e) {
    console.error(`Error updating ${file}`, e);
  }
}
