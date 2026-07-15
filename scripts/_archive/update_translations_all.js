const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const defaults = {
  chat_greeting_msg: "Hello! I am the Kompas Migracji AI assistant 👋",
  chat_error: "Something went wrong. Please try again.",
  chat_online: "Online",
  ai_placeholder: "Type a message..."
};

for (const file of files) {
  const filePath = path.join(messagesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;
    for (const [key, val] of Object.entries(defaults)) {
      if (!data[key]) {
        data[key] = val;
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated missing keys in ${file}`);
    }
  } catch (e) {
    console.error(`Error updating ${file}`, e);
  }
}
