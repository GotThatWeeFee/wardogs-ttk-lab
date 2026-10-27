# WARDOGS // Weapon TTK Lab

Standalone, offline-capable, static HTML calculator for sharing with friends.

## Run locally

Double-click `index.html` in Chrome, Edge, Firefox, or Safari. No installation, server, API key, or login required.

## Publish to GitHub Pages (free)

1. Create a **public** repository in GitHub, e.g. `wardogs-ttk-lab`.
2. Upload `index.html` at the **repository root** (using **Add file → Upload files → Commit changes**). Also upload all source files used by the current site: `base-stats.js`, `expanded-attachments.js`, `sight-fits.js`, `barrel-slots.js`, and `builder.js` into the repository root. Keep all linked script files in the repository root.
3. Open **Settings → Pages**, then under **Build and deployment** choose **Deploy from a branch**, **main**, and **/(root)**. Save.
4. GitHub Pages will show the public URL, generally `https://YOUR-USERNAME.github.io/wardogs-ttk-lab/`. Only use the address GitHub actually shows, not the example.
5. Share the URL in Discord. Visitors can use **Share setup** to copy filter combinations into the same link.

> This repository is already published through GitHub Pages and deploys automatically from `main`.

## Interface updates

- The Weapon Builder selection menu groups all 34 available guns under native dropdown headers for Assault Rifles, Submachine Guns, Light Machine Guns, Marksman Rifles, Sniper Rifles, Shotguns, Pistols and Bows. The displayed selection, shared build URL parameters and existing compatibility filtering are unchanged.

- The ranking opens with **All weapon types** and each gun's standard ammunition, sorted by ascending TTK against Level 2 armor.
- The table includes a **sortable MOA (Minute of Angle)** column. Smaller MOA indicates tighter mechanical grouping; base MOA is separate from recoil and shotgun pellet dispersion. Invalid/unavailable values are shown as a dash rather than 0 MOA.
- Each weapon-builder attachment section (Sight, Underbarrel, Magazine) uses a keyboard-accessible, **collapsible disclosure panel**. The Sight panel starts expanded, and the other two begin collapsed; expanded state is retained when switching attachments.
- Section heading numbers were removed for readability.

## October 27 compatibility and filter audit

- **Native optic compatibility:** the builder now resolves compatible sights from extracted slot filters in [Kiyogitpy's cooked game-file dataset](https://github.com/Kiyogitpy/wardogs-data-docs/blob/main/assets/data/weapon-loadouts.json), including shared optics and weapon-specific exceptions. This yields **25 M14 sight records** (21 priced and four unpriced), rather than the narrower five-item curated list in some databases. These are *game-file fit candidates*, not proof that every item is purchasable or currently unlocked in the in-game vendor. The user's vendor screenshots corroborate the wider selection, including 6–10× Scope MOA.
- **Optic filters:** every weapon's sight section offers All / Short / Medium / Long filter buttons. Extracted sight tag category takes precedence; when absent, filter classification uses the listed base zoom as an approximation.
- **Barrel section:** a collapsible Barrel panel displays the weapon's factory-fitted barrel ID/name from extracted weapon slots when available. These stock parts have no verified vendor price or gameplay modifiers and cannot be purchased, swapped, or counted as an attachment upgrade. The bow has no stock barrel slot. The other barrel alternatives are not automatically considered selectable.
- **Weapon table filters:** alongside the original weapon-class, ammunition, armor and search controls, an expandable panel filters by max MOA, max theoretical TTK, and max base-weapon price. Filtered share links persist these parameters; Reset clears all of them. Missing MOA/TTK does not qualify for a maximum cutoff.
- **Evidence conflict:** [wardo.gs M14](https://wardo.gs/items/m14/) lists five optics for the October 16 build, while the cooked native sight-category rule admits 25 distinct sight items. Our builder labels the expanded coverage as game-file compatibility. Confirm vendor stock and unlock in-game before purchasing.

## Weapon builder (new)

Open the **Weapon Builder** link in the website header or jump to `#builder`.

- Choose from the existing weapon catalog and install **curated, directly sourced compatible** sights, underbarrel foregrips and magazines.
- All compatible choices appear as **side-by-side selectable cards**, showing vertical/horizontal recoil, general weapon spread, ADS modifiers, price, weight, magazine capacity (when applicable) and per-part source links without cycling through choices.
- The **Base weapon stats** panel lists damage, fire rate, effective range, accuracy (MOA), weight, caliber, fire modes and ADS time where individually confirmed. Extraction coverage for range may be blank and ADS time is presently curated for the M4, M500 and MP43; missing data is not guessed.
- Compare extracted **individual** recoil, spread and ADS modifiers with a clearly labeled unverified arithmetic stacking preview.
- See cumulative weapon-plus-attachment cost and total weight for the 34 weapons in our source dataset.
- Select ammunition and target armor for an independent **base-weapon** 50 m ballistics reference; attachment handling is **not** applied to STK/TTK.
- Share a build URL or copy a text parts list. The build state is encoded in URL parameters; no tracking or accounts.

**Coverage limitation:** The builder now includes **84 attachment catalogue records**: 27 optics (some unpriced, view-only), 11 foregrips/bipods, and 46 magazines. These cover the confirmed **Galil 16 sights and 2 magazines**, along with three purchasable marksman/sniper optics with confirmed fit relationships from the published weapon page. Some other weapon-specific magazine mappings follow uniquely named game-file entries and should be cross-checked against individual compatible-weapon lists before treating them as definitively proven. Muzzles, chokes, and several internal non-purchasable parts are not modeled. A missing attachment does not prove incompatibility. Records with no listed price are disabled, not represented as free.

Cards use a dash for modifiers not present in the current curated record; that does **not** assert zero gameplay effect. Some magazine and underbarrel effects are not yet transcribed. Stacked build stats are indicative comparisons, not measured values.

**M14 verified subset (CL-516586):** 5 source-listed sights (4 priced, 1 unpriced), 1 underbarrel M14 Bipod ($1,480), and 3 magazines. When a user changes weapons, sights and any single-purpose underbarrel automatically expand to avoid hiding compatible choices; users can still collapse either section. The bipod's static modifiers are all 0% in extracted item data and do not model its deployed support effect. [M14 weapon source](https://wardo.gs/items/m14/), [bipod source](https://wardo.gs/items/m14-bipod/), [Leatherwood sight](https://wardo.gs/items/leatherwood-art-ii/).

Part names/prices/compatibility and individual handling modifiers: [wardo.gs attachments](https://wardo.gs/attachments/) and per-weapon [source pages](https://wardo.gs/weapons/) (CL-516586, extracted October 16, 2026).

## Filters & features

- Weapon type (8 categories or all)
- Ammo: FMJ, AP, HP; shotguns use buckshot or rifled slug, bow uses broadhead
- Body armor: none, Level 1–4
- Name/caliber search, sortable ranking, weapon details showing all ammo at once
- CSV export and URL filter sharing
- Works offline when `index.html` and all five referenced JS files are kept together

## Data sources & interpretation

- Weapon stats/prices and standard-round matrices transcribed from https://wardo.gs/weapons/ and https://wardo.gs/ballistics/ (retrieved 2026-10-26, build CL-516586 extracted 2026-10-16).
- Armor, class hit zones: https://wardo.gs/damage/
- AP/HP experimental assumptions based on older community firing-range tests: https://wardogslab.com/en/guides/wardogs-damage-armor
- Second independent live ballistics resource: https://wardogs.tools/ballistics

**Important:** "Source model" does not mean proven in live multiplayer. It means published calculations from game-data values. "Experimental" means a locally computed estimate using uncertain ammunition behavior; do not claim those results are controlled gameplay tests. The underlying calculator estimates 100 HP and includes bullet flight, which differs from common first-hit TTK conventions.

Buckshot source TTK assumes **all 8 pellets hit at 50 meters**. This is not a realistic practical shotgun outcome. MP43 reload time is unknown and rows requiring a third shot deliberately show no TTK.

The weapon `TCX-SPR` appears in **DMR** in the source catalog, even though it unlocks in the Assault progression track. The source has no usable rate-of-fire data for `PKM` or `GGX 17`, so TTK is not reported for these entries.

Version: 2026-10-26. Unofficial community project; not affiliated with BULKHEAD.