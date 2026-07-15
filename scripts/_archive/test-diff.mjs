import fs from 'fs';
import { parse } from 'node-html-parser';

const s = parse(fs.readFileSync('server.html', 'utf8'));
const c = parse(fs.readFileSync('client.html', 'utf8'));

// Extract all text nodes
function extractText(node) {
  let texts = [];
  if (node.nodeType === 3) {
    const raw = node.rawText.trim();
    if (raw && !raw.toLowerCase().includes('<!doctype html>')) texts.push(raw);
  } else if (node.childNodes) {
    for (const child of node.childNodes) {
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        texts = texts.concat(extractText(child));
      }
    }
  }
  return texts;
}

const sTexts = extractText(s);
const cTexts = extractText(c);

console.log('Server texts:', sTexts);
console.log('Client texts:', cTexts);
