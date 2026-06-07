import { get } from "svelte/store";
import {
  sunriseH,
  sunsetH,
  sunInfo,
  weatherCodes,
  locationTimezone,
  loadLoc,
  saveLoc,
} from "../stores";
import { geocode, fetchSunTimes, fetchWeather } from "./api";

function fmtHour(dh: number): string {
  let h = Math.floor(dh);
  let m = Math.round((dh - h) * 60);
  if (m === 60) {
    h++;
    m = 0;
  }
  return `${String(h % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function applyLocation(query: string): Promise<string | null> {
  sunInfo.set({ msg: "searching…", cls: "" });
  try {
    const loc = await geocode(query);
    const [times, codes] = await Promise.all([
      fetchSunTimes(loc.lat, loc.lng, loc.timezone),
      fetchWeather(loc.lat, loc.lng, loc.timezone),
    ]);
    sunriseH.set(times.sunrise);
    sunsetH.set(times.sunset);
    weatherCodes.set(codes);
    locationTimezone.set(loc.timezone);
    saveLoc({
      ...loc,
      sunriseH: times.sunrise,
      sunsetH: times.sunset,
      date: new Date().toISOString().split("T")[0],
    });
    sunInfo.set({
      msg: `${loc.label} · rise ${fmtHour(times.sunrise)} · set ${fmtHour(times.sunset)}`,
      cls: "live",
    });
    return loc.label;
  } catch {
    sunInfo.set({ msg: "location not found — check spelling and try again", cls: "error" });
    return null;
  }
}

export async function loadSavedLocation(): Promise<string | null> {
  const saved = loadLoc();
  if (!saved) return null;

  sunInfo.set({ msg: `loading ${saved.label}…`, cls: "" });
  const today = new Date().toISOString().split("T")[0];

  // Weather is non-blocking — ring appears once the fetch resolves.
  fetchWeather(saved.lat, saved.lng, saved.timezone)
    .then((codes) => weatherCodes.set(codes))
    .catch(() => {});

  try {
    if (saved.date === today && saved.sunriseH != null) {
      sunriseH.set(saved.sunriseH);
      sunsetH.set(saved.sunsetH!);
    } else {
      const times = await fetchSunTimes(saved.lat, saved.lng, saved.timezone);
      sunriseH.set(times.sunrise);
      sunsetH.set(times.sunset);
      saveLoc({ ...saved, sunriseH: times.sunrise, sunsetH: times.sunset, date: today });
    }
    const sr = get(sunriseH);
    const ss = get(sunsetH);
    locationTimezone.set(saved.timezone);
    sunInfo.set({
      msg: `${saved.label} · rise ${fmtHour(sr)} · set ${fmtHour(ss)}`,
      cls: "live",
    });
  } catch {
    if (saved.sunriseH != null) {
      sunriseH.set(saved.sunriseH);
      sunsetH.set(saved.sunsetH!);
    }
    sunInfo.set({ msg: "could not refresh — showing cached sun times", cls: "error" });
  }

  return saved.label;
}
