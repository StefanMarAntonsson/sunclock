import { writable } from "svelte/store";

export interface ClockSettings {
  // Font
  fontFamily: string;
  numberSize: number;

  // Face
  faceColor: string;

  // Hour ring
  showHourRing: boolean;
  hourColor: string;
  hourTrackOpacity: number;
  hourHandColor: string;
  hourRingWidth: number;

  // Minute ring
  showMinuteRing: boolean;
  minuteColor: string;
  minuteTrackOpacity: number;
  minuteHandColor: string;
  minuteRingWidth: number;

  // Second ring
  showSecondRing: boolean;
  secondColor: string;
  secondTrackOpacity: number;
  secondHandColor: string;
  secondRingWidth: number;

  // Numbers
  showNumbers: boolean;
  numberColor: string;
  numberOpacity: number;
  highlightCurrent: boolean;
  currentNumberColor: string;

  // Hand indicator
  handWidth: number;

  // Day/Night rim
  showDayNightRim: boolean;
  dayColor: string;
  dayOpacity: number;
  nightColor: string;
  nightOpacity: number;
  rimWidth: number;

  // Sunrise/sunset dots
  showSunriseSunsetDots: boolean;
  sunriseColor: string;
  sunsetColor: string;

  // Weather
  showWeatherRing: boolean;
  showWeatherEmoji: boolean;
  showWeatherHand: boolean;

  // Custom ranges
  showCustomRanges: boolean;

  // Outer ring hands
  showDayNightHand: boolean;
}

export const defaultSettings: ClockSettings = {
  fontFamily: "Georgia",
  numberSize: 10,

  faceColor: "#181e2e",

  showHourRing: true,
  hourColor: "#60a5fa",
  hourTrackOpacity: 0.12,
  hourHandColor: "#93c5fd",
  hourRingWidth: 34,

  showMinuteRing: true,
  minuteColor: "#94a3b8",
  minuteTrackOpacity: 0.12,
  minuteHandColor: "#e2e8f0",
  minuteRingWidth: 30,

  showSecondRing: true,
  secondColor: "#f87171",
  secondTrackOpacity: 0.12,
  secondHandColor: "#fca5a5",
  secondRingWidth: 26,

  showNumbers: true,
  numberColor: "#cbd5e1",
  numberOpacity: 0.75,
  highlightCurrent: true,
  currentNumberColor: "#ffffff",

  handWidth: 2.5,

  showDayNightRim: true,
  dayColor: "#fbbf24",
  dayOpacity: 0.55,
  nightColor: "#3b82f6",
  nightOpacity: 0.55,
  rimWidth: 16,

  showSunriseSunsetDots: true,
  sunriseColor: "#fde68a",
  sunsetColor: "#f97316",

  showWeatherRing: true,
  showWeatherEmoji: true,
  showWeatherHand: true,

  showCustomRanges: true,

  showDayNightHand: true,
};

export interface Range {
  id: number;
  label: string;
  startH: number;
  endH: number;
  color: string;
}

export interface LocRecord {
  lat: number;
  lng: number;
  timezone: string;
  label: string;
  sunriseH?: number;
  sunsetH?: number;
  date?: string;
}

const RANGES_KEY = "sunclock_ranges";
const LOC_KEY = "sunclock_location";

function loadRanges(): Range[] {
  try {
    return JSON.parse(localStorage.getItem(RANGES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function loadLoc(): LocRecord | null {
  try {
    return JSON.parse(localStorage.getItem(LOC_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function saveLoc(record: LocRecord) {
  localStorage.setItem(LOC_KEY, JSON.stringify(record));
}

export const sunriseH = writable<number>(6);
export const sunsetH = writable<number>(20);
export const customRanges = writable<Range[]>(loadRanges());
export const weatherCodes = writable<number[]>([]);
export const sunInfo = writable<{ msg: string; cls: string }>({
  msg: "enter a location below",
  cls: "",
});

customRanges.subscribe((r) => localStorage.setItem(RANGES_KEY, JSON.stringify(r)));

const SETTINGS_KEY = "sunclock_settings";

function loadSettings(): ClockSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null");
    return saved ? { ...defaultSettings, ...saved } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export const clockSettings = writable<ClockSettings>(loadSettings());
clockSettings.subscribe((s) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)));

// Timezone of the currently set location; null = use system time
export const locationTimezone = writable<string | null>(loadLoc()?.timezone ?? null);
