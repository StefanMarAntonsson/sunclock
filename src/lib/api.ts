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

function parseTime12h(str: string): number {
  const [time, period] = str.split(" ");
  const [h, m, s] = time.split(":").map(Number);
  let hours = h;
  if (period === "PM" && h !== 12) hours += 12;
  if (period === "AM" && h === 12) hours = 0;
  return hours + m / 60 + s / 3600;
}

export async function fetchSunTimes(lat: number, lng: number, timezone: string): Promise<SunTimes> {
  const day = new Date().toISOString().split("T")[0];
  const url =
    `https://api.sunrisesunset.io/json` +
    `?lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(timezone)}&date=${day}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK") throw new Error("Sun API error");
  return {
    sunrise: parseTime12h(data.results.sunrise),
    sunset: parseTime12h(data.results.sunset),
  };
}
