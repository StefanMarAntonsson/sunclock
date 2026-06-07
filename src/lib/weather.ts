// Elemental colors — ordered dark→light for inner→outer stacking
const SUN = "rgba(251, 191, 36, 0.85)";
const NIGHT = "rgba(186, 230, 253, 0.22)"; // pale blue-silver for clear night
const CLOUD = "rgba(148, 163, 184, 0.7)";
const RAIN = "rgba(59, 130, 246, 0.8)";
const SNOW = "rgba(186, 230, 253, 0.88)";
const FOG = "rgba(100, 116, 139, 0.6)";
const THUNDER = "rgba(139, 92, 246, 0.88)";

// [color, fraction] pairs, inner → outer, fractions must sum to 1
type Layer = [string, number];

export interface WeatherInfo {
  emoji: string;
  label: string;
  layers: Layer[]; // stacked inner → outer
}

export interface WeatherPeriod {
  startH: number;
  endH: number;
  code: number;
  info: WeatherInfo;
}

export function wmoToInfo(code: number, night = false): WeatherInfo {
  // ── Clear / cloudy — night variants swap SUN for NIGHT ───────────────
  if (code === 0)
    return night
      ? { emoji: "🌙", label: "Clear night", layers: [[NIGHT, 1]] }
      : { emoji: "☀️", label: "Clear", layers: [[SUN, 1]] };
  if (code === 1)
    return night
      ? {
          emoji: "🌙",
          label: "Mainly clear",
          layers: [
            [CLOUD, 0.1],
            [NIGHT, 0.9],
          ],
        }
      : {
          emoji: "🌤️",
          label: "Mainly clear",
          layers: [
            [CLOUD, 0.15],
            [SUN, 0.85],
          ],
        };
  if (code === 2)
    return night
      ? {
          emoji: "🌥️",
          label: "Partly cloudy",
          layers: [
            [CLOUD, 0.5],
            [NIGHT, 0.5],
          ],
        }
      : {
          emoji: "⛅",
          label: "Partly cloudy",
          layers: [
            [CLOUD, 0.5],
            [SUN, 0.5],
          ],
        };
  if (code === 3) return { emoji: "☁️", label: "Overcast", layers: [[CLOUD, 1]] };

  // ── Fog ─────────────────────────────────────────────────────────────
  if (code <= 48) return { emoji: "🌫️", label: "Fog", layers: [[FOG, 1]] };

  // ── Drizzle (51 light → 55 dense; 56–57 freezing) ───────────────────
  if (code === 51)
    return {
      emoji: "🌦️",
      label: "Light drizzle",
      layers: [
        [CLOUD, 0.65],
        [RAIN, 0.35],
      ],
    };
  if (code === 53)
    return {
      emoji: "🌦️",
      label: "Drizzle",
      layers: [
        [CLOUD, 0.45],
        [RAIN, 0.55],
      ],
    };
  if (code === 55)
    return {
      emoji: "🌧️",
      label: "Dense drizzle",
      layers: [
        [CLOUD, 0.25],
        [RAIN, 0.75],
      ],
    };
  if (code <= 57)
    return {
      emoji: "🌧️",
      label: "Freezing drizzle",
      layers: [
        [CLOUD, 0.4],
        [RAIN, 0.4],
        [SNOW, 0.2],
      ],
    };

  // ── Rain (61 slight → 65 heavy; 66–67 freezing) ─────────────────────
  if (code === 61)
    return {
      emoji: "🌧️",
      label: "Light rain",
      layers: [
        [CLOUD, 0.5],
        [RAIN, 0.5],
      ],
    };
  if (code === 63)
    return {
      emoji: "🌧️",
      label: "Moderate rain",
      layers: [
        [CLOUD, 0.3],
        [RAIN, 0.7],
      ],
    };
  if (code === 65)
    return {
      emoji: "🌧️",
      label: "Heavy rain",
      layers: [
        [CLOUD, 0.1],
        [RAIN, 0.9],
      ],
    };
  if (code <= 67)
    return {
      emoji: "🌧️",
      label: "Freezing rain",
      layers: [
        [CLOUD, 0.3],
        [RAIN, 0.5],
        [SNOW, 0.2],
      ],
    };

  // ── Snow (71 slight → 75 heavy; 77 grains) ──────────────────────────
  if (code === 71)
    return {
      emoji: "❄️",
      label: "Light snow",
      layers: [
        [CLOUD, 0.5],
        [SNOW, 0.5],
      ],
    };
  if (code === 73)
    return {
      emoji: "❄️",
      label: "Moderate snow",
      layers: [
        [CLOUD, 0.3],
        [SNOW, 0.7],
      ],
    };
  if (code === 75)
    return {
      emoji: "❄️",
      label: "Heavy snow",
      layers: [
        [CLOUD, 0.1],
        [SNOW, 0.9],
      ],
    };
  if (code === 77)
    return {
      emoji: "❄️",
      label: "Snow grains",
      layers: [
        [CLOUD, 0.4],
        [SNOW, 0.6],
      ],
    };

  // ── Rain showers ────────────────────────────────────────────────────
  if (code === 80)
    return {
      emoji: "🌦️",
      label: "Slight showers",
      layers: [
        [RAIN, 0.3],
        [CLOUD, 0.3],
        [SUN, 0.4],
      ],
    };
  if (code === 81)
    return {
      emoji: "🌧️",
      label: "Showers",
      layers: [
        [RAIN, 0.5],
        [CLOUD, 0.35],
        [SUN, 0.15],
      ],
    };
  if (code === 82)
    return {
      emoji: "🌧️",
      label: "Heavy showers",
      layers: [
        [RAIN, 0.75],
        [CLOUD, 0.25],
      ],
    };

  // ── Snow showers ─────────────────────────────────────────────────────
  if (code === 85)
    return {
      emoji: "🌨️",
      label: "Slight snow showers",
      layers: [
        [CLOUD, 0.3],
        [SNOW, 0.3],
        [SUN, 0.4],
      ],
    };
  if (code === 86)
    return {
      emoji: "🌨️",
      label: "Heavy snow showers",
      layers: [
        [CLOUD, 0.35],
        [SNOW, 0.5],
        [SUN, 0.15],
      ],
    };

  // ── Thunderstorm ─────────────────────────────────────────────────────
  if (code === 95)
    return {
      emoji: "⛈️",
      label: "Thunderstorm",
      layers: [
        [CLOUD, 0.3],
        [RAIN, 0.4],
        [THUNDER, 0.3],
      ],
    };

  return {
    emoji: "⛈️",
    label: "Thunderstorm + hail",
    layers: [
      [CLOUD, 0.2],
      [RAIN, 0.4],
      [THUNDER, 0.4],
    ],
  };
}

function hourInTz(timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  return parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
}

function isNightHour(h: number, sunriseH: number, sunsetH: number): boolean {
  return h < sunriseH || h >= sunsetH;
}

// Returns weather periods for the 24-hour clock face, split at sunrise/sunset
// so day and night segments get the correct emojis and colors.
export function buildWeatherPeriods(
  codes48: number[],
  sunriseH: number,
  sunsetH: number,
  timezone: string,
): WeatherPeriod[] {
  if (!codes48.length) return [];

  const currentHour = hourInTz(timezone);

  // Build rolling 24-h array: each index h = weather code for that clock hour
  const rolling: number[] = Array.from({ length: 24 }, (_, h) => {
    const dayOffset = h >= currentHour ? 0 : 1;
    return codes48[dayOffset * 24 + h] ?? 0;
  });

  // Build initial periods by grouping consecutive identical codes
  const raw: Array<{ startH: number; endH: number; code: number }> = [];
  let startH = 0;
  let code = rolling[0];
  for (let h = 1; h <= 24; h++) {
    const next = h < 24 ? rolling[h] : -1;
    if (next !== code) {
      raw.push({ startH, endH: h, code });
      startH = h;
      code = next;
    }
  }

  // Split periods at sunrise and sunset boundaries so each segment is
  // fully day or fully night — avoids a sunny band spanning after sunset
  const boundaries = [Math.round(sunriseH), Math.round(sunsetH)];
  const split: WeatherPeriod[] = [];
  for (const p of raw) {
    const cuts = [p.startH];
    for (const b of boundaries) {
      if (b > p.startH && b < p.endH) cuts.push(b);
    }
    cuts.push(p.endH);
    for (let i = 0; i < cuts.length - 1; i++) {
      const midH = (cuts[i] + cuts[i + 1]) / 2;
      const night = isNightHour(midH, sunriseH, sunsetH);
      split.push({
        startH: cuts[i],
        endH: cuts[i + 1],
        code: p.code,
        info: wmoToInfo(p.code, night),
      });
    }
  }

  return split;
}
