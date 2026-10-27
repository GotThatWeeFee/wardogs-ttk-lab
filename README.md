# WARDOGS // Weapon TTK Lab

Standalone, offline-capable, static HTML calculator for sharing with friends.

## Run locally

Double-click `index.html` in Chrome, Edge, Firefox, or Safari. No installation, server, API key, or login required.

## Publish to GitHub Pages (free)

1. Create a **public** repository in GitHub, e.g. `wardogs-ttk-lab`.
2. Upload `index.html` at the **repository root** (using **Add file → Upload files → Commit changes**). The `weapons.json` file is optional and is included for auditing.
3. Open **Settings → Pages**, then under **Build and deployment** choose **Deploy from a branch**, **main**, and **/(root)**. Save.
4. GitHub Pages will show the public URL, generally `https://YOUR-USERNAME.github.io/wardogs-ttk-lab/`. Only use the address GitHub actually shows, not the example.
5. Share the URL in Discord. Visitors can use **Share setup** to copy filter combinations into the same link.

> GitHub Pages deployment is not performed automatically by this package. Publishing the repository makes its contents public.

## Filters & features

- Weapon type (8 categories or all)
- Ammo: FMJ, AP, HP; shotguns use buckshot or rifled slug, bow uses broadhead
- Body armor: none, Level 1–4
- Name/caliber search, sortable ranking, weapon details showing all ammo at once
- CSV export and URL filter sharing
- Works offline, and all CSS/JS/data are embedded in `index.html`

## Data sources & interpretation

- Weapon stats/prices and standard-round matrices transcribed from https://wardo.gs/weapons/ and https://wardo.gs/ballistics/ (retrieved 2026-10-26, build CL-516586 extracted 2026-10-16).
- Armor, class hit zones: https://wardo.gs/damage/
- AP/HP experimental assumptions based on older community firing-range tests: https://wardogslab.com/en/guides/wardogs-damage-armor
- Second independent live ballistics resource: https://wardogs.tools/ballistics

**Important:** "Source model" does not mean proven in live multiplayer. It means published calculations from game-data values. "Experimental" means a locally computed estimate using uncertain ammunition behavior; do not claim those results are controlled gameplay tests. The underlying calculator estimates 100 HP and includes bullet flight, which differs from common first-hit TTK conventions.

Buckshot source TTK assumes **all 8 pellets hit at 50 meters**. This is not a realistic practical shotgun outcome. MP43 reload time is unknown and rows requiring a third shot deliberately show no TTK.

The weapon `TCX-SPR` appears in **DMR** in the source catalog, even though it unlocks in the Assault progression track. The source has no usable rate-of-fire data for `PKM` or `GGX 17`, so TTK is not reported for these entries.

Version: 2026-10-26. Unofficial community project; not affiliated with BULKHEAD.