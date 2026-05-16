function parseMessages(html) {
  const facts = [];
  const marker = 'class="tgme_widget_message_text';
  let pos = 0;

  while (pos < html.length && facts.length < 20) {
    const start = html.indexOf(marker, pos);
    if (start === -1) break;

    const tagEnd = html.indexOf('>', start);
    if (tagEnd === -1) break;

    let depth = 1;
    let i = tagEnd + 1;
    while (i < html.length && depth > 0) {
      if (html[i] === '<') {
        if (html.startsWith('<div', i)) depth++;
        else if (html.startsWith('</div', i)) { depth--; if (depth === 0) break; }
      }
      i++;
    }

    const raw = html.slice(tagEnd + 1, i)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
      .trim();

    pos = i + 1;

    if (raw.length < 30 || raw.length > 700) continue;

    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const tag  = lines.length > 1 && lines[0].length < 70 ? lines[0] : '📢 Новини';
    const text = lines.length > 1 ? lines.slice(1).join(' ').trim() : raw;

    if (text.length > 20) facts.push({ tag, text });
  }

  return facts;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const r = await fetch('https://t.me/s/kompasmigracji', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept-Language': 'uk,pl;q=0.9,en;q=0.8',
      },
    });

    if (!r.ok) {
      return res.status(502).json({ error: `Telegram returned ${r.status}` });
    }

    const html  = await r.text();
    const facts = parseMessages(html);

    if (facts.length === 0) {
      return res.status(204).end();
    }

    res.json({ facts });
  } catch (err) {
    console.error('[facts] fetch error:', err.message);
    res.status(500).json({ error: 'fetch failed' });
  }
}
