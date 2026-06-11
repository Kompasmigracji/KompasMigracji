const fs = require('fs');
const file = 'C:\\Users\\user\\Documents\\GitHub\\KompasMigracji\\components\\SocialProof.tsx';
let content = fs.readFileSync(file, 'utf8');

// Section background
content = content.replace(/background: '#060c18'/g, "background: 'var(--bg-main)'");

// Top glow - reduce opacity for light theme compatibility
content = content.replace(/rgba\(37,99,235,0\.18\)/g, "rgba(37,99,235,0.08)");

// Bottom fade
content = content.replace(/rgba\(6,12,24,0\.6\)/g, "var(--bg-main)");
content = content.replace(/linear-gradient\(to top, var\(--bg-main\) 0%, transparent 100%\)/g, "linear-gradient(to top, var(--bg-main) 0%, transparent 100%)"); // Actually, it's easier to just make it transparent if it's the same color. But let's just use CSS. Wait, if it fades to transparent, we need rgba... let's just remove the fade.
content = content.replace(/<div aria-hidden style={{\s*position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, pointerEvents: 'none',\s*background: 'linear-gradient\\(to top, rgba\\(6,12,24,0\\.6\\) 0%, transparent 100%\\)',\s*}} \/>/g, "");

// Header text color
content = content.replace(/color: '#e8edf5'/g, "color: 'var(--text-main)'");

// StatCard background and borders
content = content.replace(/background: hovered \? 'rgba\\(37,99,235,0\\.08\\)' : 'rgba\\(255,255,255,0\\.03\\)'/g, "background: hovered ? 'var(--bg-soft)' : 'transparent'");
content = content.replace(/border: `1px solid \\${hovered \? 'rgba\\(37,99,235,0\\.4\\)' : 'rgba\\(255,255,255,0\\.07\\)'}`/g, "border: `1px solid ${hovered ? 'var(--border)' : 'var(--border)'}`");
content = content.replace(/boxShadow: hovered\s*\? '0 0 32px rgba\\(37,99,235,0\\.15\\), inset 0 1px 0 rgba\\(255,255,255,0\\.06\\)'\s*: 'inset 0 1px 0 rgba\\(255,255,255,0\\.04\\)'/g, "boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.05)' : 'none'");

// Label text color
content = content.replace(/color: '#6b7f96'/g, "color: 'var(--text-muted)'");

// Number text color (gradient) -> We can keep the gradient, it looks good in light mode too, or maybe just var(--text-main)
// "linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)"
// Actually, this gradient is fine on light mode.

fs.writeFileSync(file, content);
