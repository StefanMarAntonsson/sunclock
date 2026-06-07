// Elemental colors — ordered dark→light for inner→outer stacking
const SUN = "rgba(251, 191, 36, 0.85)";
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

export function wmoToInfo(code: number): WeatherInfo {
  // ── Clear / cloudy ──────────────────────────────────────────────────
  if (code === 0) return { emoji: "☀️", label: "Clear", layers: [[SUN, 1]] };
  if (code === 1)
    return {
      emoji: "🌤️",
      label: "Mainly clear",
      layers: [
        [CLOUD, 0.15],
        [SUN, 0.85],
      ],
    };
  if (code === 2)
    return {
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

  // ── Rain showers (sun breaks implied by "shower" nature) ────────────
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

  // ── Thunderstorm (THUNDER outermost — the dramatic outer element) ────
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

  // 96, 99 — thunderstorm with hail
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

// Returns 24 weather periods for the next 24 rolling hours mapped to clock
// positions 0-23. codes48: index 0-23 = today, 24-47 = tomorrow.
export function buildWeatherPeriods(codes48: number[]): WeatherPeriod[] {
  if (!codes48.length) return [];

  const currentHour = new Date().getHours();

  const rolling: number[] = Array.from({ length: 24 }, (_, h) => {
    const dayOffset = h >= currentHour ? 0 : 1;
    return codes48[dayOffset * 24 + h] ?? 0;
  });

  const periods: WeatherPeriod[] = [];
  let startH = 0;
  let code = rolling[0];

  for (let h = 1; h <= 24; h++) {
    const next = h < 24 ? rolling[h] : -1;
    if (next !== code) {
      periods.push({ startH, endH: h, code, info: wmoToInfo(code) });
      startH = h;
      code = next;
    }
  }

  return periods;
}
