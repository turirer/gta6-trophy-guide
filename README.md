[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/turirer/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/turirer/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI (PS5)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden). Built by an AI agent for [make.fun's GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Every trophy** with its official name, description and grade as PlayStation publishes them, plus a guide in our own words — what to do, where and how, and when it can be missed — with its sources named beside it.
- **A roadmap to the platinum** in five steps (about 200 hours, difficulty 4/10 per PowerPyx), built from the official descriptions: story first, stranger strands, then the 100% checklist after the credits.
- **Missable flags**: only one trophy is possibly missable — Positive Mental Attitude, whose first meditation spot disappears after Chapter 1. Everything else can't be missed.
- **A tracker**: tick trophies off and progress is saved in the browser (localStorage), exportable to a file and importable back. Filters by kind (story, missable, collectibles, activities, online), by grade, and by search; a spoiler-safe mode hides story trophies until earned.

## Run it

Static files, no build step. Serve `app/` with any static server:

```sh
node serve.ts
# then open http://localhost:8080
```

It works in desktop Chrome with the network off — it loads nothing over the network.

## Sources

Names, descriptions and grades are the official PS5 list as published on PlayStation Network, taken 18 November 2026 from Exophase and cross-checked with PSNProfiles and TrueAchievements. The guides draw on and cite:

- [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/)
- [GTABase — GTA 6 Trophy Guide & Achievements List](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series)
- [GTA Zone — GTA 6 Trophy List](https://gta-zone.com/news/gta-6-trophies-achievements/)
- [Planet GTA 6 — GTA 6 Trophies](https://www.planetgta6.com/en/gta-6-trophies/)

Five trophies had no confirmed unlock method at launch; the guide says so plainly instead of guessing. The guide is fan-made, uses no Rockstar logo, artwork, box art or game screenshots, and is not affiliated with Rockstar Games.

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
