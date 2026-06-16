# Intro Videos — Kompas Migracji & KompasCRM

## Файли

| Файл | Опис |
|------|------|
| `kompas-migracji-intro.mp4` | 1080p + озвучка + оркестр (~104 с) |
| `kompascrm-intro.mp4` | 1080p + озвучка + оркестр (~112 с) |
| `kompas-migracji-intro-4k.mp4` | **4K UHD** + озвучка + оркестр |
| `kompascrm-intro-4k.mp4` | **4K UHD** + озвучка + оркестр |

## Генерація

```bash
# Озвучка + музика (edge-tts + ffmpeg)
pnpm video:narration

# 1080p відео з аудіо
pnpm video:intro

# 4K відео з аудіо
pnpm video:intro:4k
```

## Озвучка

- Голос: **uk-UA-OstapNeural** (Microsoft Edge TTS)
- Сценарій: `narration.json`
- Епічний темп: rate +12%, pitch -3Hz

## Музика

- Синтезований оркестровий pad (ffmpeg: струни + реверб + echo)
- Фонова гучність: 20%, голос: 100%

## Залежності

```bash
pip3 install edge-tts
npx playwright install chromium
```
