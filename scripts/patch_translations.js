const fs = require('fs');

const pl = {
  "first_steps_highlight": "w pierwsze 24 godziny",
  "first_steps_desc": "Jeśli właśnie znalazłeś się w Polsce i nie wiesz co robić — to jest dla Ciebie"
};

const uk = {
  "first_steps_highlight": "в перші 24 години",
  "first_steps_desc": "Якщо ви щойно опинилися в Польщі і не знаєте що робити — це саме для вас"
};

const en = {
  "first_steps_highlight": "in the first 24 hours",
  "first_steps_desc": "If you just arrived in Poland and don't know what to do — this is for you"
};

const ru = {
  "first_steps_highlight": "в первые 24 часа",
  "first_steps_desc": "Если вы только что оказались в Польше и не знаете, что делать — это для вас"
};

const langs = { pl, uk, en, ru };

for (const lang in langs) {
  const filePath = `./messages/${lang}.json`;
  let fileContent = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(fileContent);
  const newKeys = langs[lang];
  for (const key in newKeys) {
    json[key] = newKeys[key];
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
}

console.log("JSON translation files patched successfully!");
