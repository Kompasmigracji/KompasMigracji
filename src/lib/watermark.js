/*! @preserve
 * KompasMigracji — Designed & Developed by Oleksandr Khrystodul — iPhoenixGSM®
 * © 2026 iPhoenixGSM®. All rights reserved. | iphoenixgsm@gmail.com
 */

// © 2026 Oleksandr Khrystodul — iPhoenixGSM® | iphoenixgsm@gmail.com
const _cr = String.fromCharCode(
  169,32,50,48,50,54,32,
  79,108,101,107,115,97,110,100,114,32,
  75,104,114,121,115,116,111,100,117,108,32,
  8212,32,
  105,80,104,111,101,110,105,120,71,83,77,174,32,
  124,32,105,112,104,111,101,110,105,120,103,115,109,
  64,103,109,97,105,108,46,99,111,109
);

const _key = [107,109,95,98,121,95,105,112,104,111,101,110,105,120].map(c => String.fromCharCode(c)).join('');

if (typeof window !== 'undefined') {
  Object.defineProperty(window, _key, {
    value: _cr,
    writable: false,
    configurable: false,
    enumerable: false,
  });
  console.info(
    '%c iPhoenixGSM® ',
    'background:#0f172a;color:#f97316;font-weight:900;font-size:13px;padding:6px 16px;border-radius:6px;letter-spacing:0.06em;',
    `\n${_cr}\nDesigned & Developed by iPhoenixGSM®`
  );
}

export const COPYRIGHT = _cr;
