export interface GeoResult {
  lat: number;
  lng: number;
  timezone: string;
  label: string;
}

export interface SunTimes {
  sunrise: number;
  sunset: number;
}

export async function geocode(query: string): Promise<GeoResult> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) throw new Error("No results");
  const r = data.results[0];
  return {
    lat: r.latitude,
    lng: r.longitude,
    timezone: r.timezone,
    label: `${r.name}, ${r.country}`,
  };
}

function parseIsoTime(isoStr: string): number {
  const [h, m] = isoStr.split("T")[1].split(":").map(Number);
  return h + m / 60;
}

export async function fetchSunTimes(lat: number, lng: number, timezone: string): Promise<SunTimes> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&daily=sunrise,sunset` +
    `&timezone=${encodeURIComponent(timezone)}` +
    `&forecast_days=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.daily?.sunrise?.[0] || !data.daily?.sunset?.[0])
    throw new Error("Sun data unavailable");
  return {
    sunrise: parseIsoTime(data.daily.sunrise[0]),
    sunset: parseIsoTime(data.daily.sunset[0]),
  };
}

// Returns 48 WMO weather codes: index 0-23 = today, 24-47 = tomorrow.
export async function fetchWeather(lat: number, lng: number, timezone: string): Promise<number[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&hourly=weather_code` +
    `&timezone=${encodeURIComponent(timezone)}` +
    `&forecast_days=2`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.hourly?.weather_code) throw new Error("Weather data unavailable");
  return data.hourly.weather_code as number[];
}
