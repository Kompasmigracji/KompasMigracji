const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      files.push(filePath);
    }
  }
  return files;
}

const targetDir = path.join(__dirname, '../app/admin/(panel)');
console.log(`Scanning directory: ${targetDir}`);
const files = getFiles(targetDir);
console.log(`Found ${files.length} JS/JSX files to audit.\n`);

let totalErrors = 0;
for (const file of files) {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  try {
    const cmd = `npx eslint "${file}" --rule "no-undef: error" --format json`;
    const result = execSync(cmd, { stdio: 'pipe' }).toString();
  } catch (err) {
    if (err.stdout) {
      try {
        const json = JSON.parse(err.stdout.toString());
        const fileResult = json[0];
        if (fileResult && fileResult.messages && fileResult.messages.length > 0) {
          const errors = fileResult.messages.filter(m => m.severity === 2);
          if (errors.length > 0) {
            console.log(`❌ ${relativePath}:`);
            errors.forEach(msg => {
              console.log(`  Line ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            });
            totalErrors += errors.length;
          }
        }
      } catch (parseErr) {
        console.log(`⚠️ Failed to parse output for ${relativePath}: ${err.message}`);
      }
    } else {
      console.log(`⚠️ Error running eslint on ${relativePath}: ${err.message}`);
    }
  }
}

console.log(`\nAudit complete. Total undefined variable errors: ${totalErrors}`);
process.exit(totalErrors > 0 ? 1 : 0);
