const fs = require('fs');
const file = 'app/api/bot/fb-webhook/route.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'if (body.object !== "page") {',
  'if (body.object !== "page" && body.object !== "instagram") {'
);

content = content.replace(
  'for (const entry of body.entry || []) {',
  'const source = body.object === "instagram" ? "instagram" : "facebook";\n    const srcPrefix = source === "instagram" ? "IG" : "FB";\n\n    for (const entry of body.entry || []) {'
);

content = content.replace(
  /FB PSID \$\{senderId\}/g,
  '\$\{srcPrefix} Sender ID \$\{senderId}'
);

content = content.replace(
  /findOrCreateChat\("facebook",/g,
  'findOrCreateChat(source,'
);

content = content.replace(
  /\FB User \$\{senderId\.slice\(-4\)\}\/g,
  '\\$\{srcPrefix} User \$\{senderId.slice(-4)}\'
);

content = content.replace(
  /AND source = 'facebook'/g,
  'AND source = $2'
);

content = content.replace(
  /\[senderId\]\s*\)\)/g,
  '[senderId, source]))'
);

content = content.replace(
  /'facebook', $2, $3/g,
  '$2, $3, $4'
);

content = content.replace(
  /\[senderId, \FB User \$\{senderId/g,
  '[senderId, source, \\$\{srcPrefix} User \$\{senderId'
);

content = content.replace(
  /source: "facebook"/g,
  'source: source'
);

content = content.replace(
  /FB Messenger ID:/g,
  '\$\{srcPrefix} ID:'
);

fs.writeFileSync(file, content);
