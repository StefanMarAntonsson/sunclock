export interface WeatherInfo {
  emoji: string;
  color: string;
  label: string;
}

export interface WeatherPeriod {
  startH: number; // clock hour 0-24 (exclusive end)
  endH: number;
  code: number;
  info: WeatherInfo;
}

export function wmoToInfo(code: number): WeatherInfo {
  if (code === 0) return { emoji: "☀️", color: "rgba(251,191,36,0.75)", label: "Clear" };
  if (code === 1) return { emoji: "🌤️", color: "rgba(251,191,36,0.5)", label: "Mainly clear" };
  if (code === 2) return { emoji: "⛅", color: "rgba(203,213,225,0.45)", label: "Partly cloudy" };
  if (code === 3) return { emoji: "☁️", color: "rgba(148,163,184,0.5)", label: "Overcast" };
  if (code <= 48) return { emoji: "🌫️", color: "rgba(100,116,139,0.5)", label: "Fog" };
  if (code <= 57) return { emoji: "🌦️", color: "rgba(125,211,252,0.5)", label: "Drizzle" };
  if (code <= 67) return { emoji: "🌧️", color: "rgba(59,130,246,0.65)", label: "Rain" };
  if (code <= 77) return { emoji: "❄️", color: "rgba(186,230,253,0.65)", label: "Snow" };
  if (code <= 82) return { emoji: "🌧️", color: "rgba(37,99,235,0.65)", label: "Showers" };
  if (code <= 86) return { emoji: "🌨️", color: "rgba(186,230,253,0.7)", label: "Snow showers" };
  return { emoji: "⛈️", color: "rgba(139,92,246,0.7)", label: "Thunderstorm" };
}

// Builds 24 weather periods for the NEXT 24 hours, mapped to clock positions 0-23.
// codes48: 48 hourly WMO codes — index 0-23 = today, 24-47 = tomorrow.
// For each clock hour H: if H >= currentHour use today's data, else tomorrow's.
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
