# Sunclock

A 24-hour canvas clock that overlays weather, daylight, and custom time ranges on a single ring-based face.

## Features

- **24-hour ring clock** — hour, minute, and second rings with embedded numbers and line hands
- **Daylight ring** — day/night arc reflects real sunrise and sunset times for the set location
- **Weather ring** — hourly WMO weather codes shown as colored bands with day/night-aware emojis
- **Custom ranges** — add labeled, colored time bands (e.g. work hours, sleep)
- **Location support** — set any city to get local time, sunrise/sunset, and weather; clears back to system time when removed
- **Settings panel** — collapsible left overlay to control colors, fonts, visibility, and ring widths
- **Color palettes** — four built-in palettes (Default, Midnight, Parchment, Aurora) plus custom palette saving

## Stack

Svelte 5 · TypeScript · Vite Plus · HTML Canvas

Weather and sun data from [Open-Meteo](https://open-meteo.com/).

## Running locally

```bash
vp dev
```

---

*Built with assistance from [Claude](https://claude.ai) (Anthropic).*
