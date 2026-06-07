import { writable } from "svelte/store";

// ─── Palette ─────────────────────────────────────────────────────────────────

export interface Palette {
  id: string;
  name: string;
  faceColor: string;
  hourColor: string;
  hourTrackOpacity: number;
  hourHandColor: string;
  minuteColor: string;
  minuteTrackOpacity: number;
  minuteHandColor: string;
  secondColor: string;
  secondTrackOpacity: number;
  secondHandColor: string;
  numberColor: string;
  numberOpacity: number;
  currentNumberColor: string;
  dayColor: string;
  dayOpacity: number;
  nightColor: string;
  nightOpacity: number;
  sunriseColor: string;
  sunsetColor: string;
}

export const PRESET_PALETTES: Palette[] = [
  {
    id: "default",
    name: "Default",
    faceColor: "#181e2e",
    hourColor: "#60a5fa",
    hourTrackOpacity: 0.12,
    hourHandColor: "#93c5fd",
    minuteColor: "#94a3b8",
    minuteTrackOpacity: 0.12,
    minuteHandColor: "#e2e8f0",
    secondColor: "#f87171",
    secondTrackOpacity: 0.12,
    secondHandColor: "#fca5a5",
    numberColor: "#cbd5e1",
    numberOpacity: 0.75,
    currentNumberColor: "#ffffff",
    dayColor: "#fbbf24",
    dayOpacity: 0.55,
    nightColor: "#3b82f6",
    nightOpacity: 0.55,
    sunriseColor: "#fde68a",
    sunsetColor: "#f97316",
  },
  {
    id: "midnight",
    name: "Midnight",
    faceColor: "#05070d",
    hourColor: "#1e40af",
    hourTrackOpacity: 0.25,
    hourHandColor: "#3b82f6",
    minuteColor: "#065f46",
    minuteTrackOpacity: 0.2,
    minuteHandColor: "#10b981",
    secondColor: "#7f1d1d",
    secondTrackOpacity: 0.2,
    secondHandColor: "#ef4444",
    numberColor: "#334155",
    numberOpacity: 0.9,
    currentNumberColor: "#64748b",
    dayColor: "#92400e",
    dayOpacity: 0.5,
    nightColor: "#1e3a8a",
    nightOpacity: 0.5,
    sunriseColor: "#92400e",
    sunsetColor: "#7c2d12",
  },
  {
    id: "parchment",
    name: "Parchment",
    faceColor: "#fefce8",
    hourColor: "#1d4ed8",
    hourTrackOpacity: 0.18,
    hourHandColor: "#1e40af",
    minuteColor: "#374151",
    minuteTrackOpacity: 0.15,
    minuteHandColor: "#111827",
    secondColor: "#b91c1c",
    secondTrackOpacity: 0.15,
    secondHandColor: "#991b1b",
    numberColor: "#1e293b",
    numberOpacity: 0.85,
    currentNumberColor: "#0f172a",
    dayColor: "#d97706",
    dayOpacity: 0.6,
    nightColor: "#2563eb",
    nightOpacity: 0.4,
    sunriseColor: "#d97706",
    sunsetColor: "#b45309",
  },
  {
    id: "aurora",
    name: "Aurora",
    faceColor: "#071a14",
    hourColor: "#059669",
    hourTrackOpacity: 0.2,
    hourHandColor: "#34d399",
    minuteColor: "#7c3aed",
    minuteTrackOpacity: 0.15,
    minuteHandColor: "#a78bfa",
    secondColor: "#db2777",
    secondTrackOpacity: 0.15,
    secondHandColor: "#f472b6",
    numberColor: "#6ee7b7",
    numberOpacity: 0.7,
    currentNumberColor: "#d1fae5",
    dayColor: "#10b981",
    dayOpacity: 0.5,
    nightColor: "#6d28d9",
    nightOpacity: 0.5,
    sunriseColor: "#34d399",
    sunsetColor: "#a78bfa",
  },
];

export function paletteToSettings(p: Palette): Partial<ClockSettings> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, name, ...colors } = p;
  return colors;
}

const CUSTOM_PALETTES_KEY = "sunclock_custom_palettes";

function loadCustomPalettes(): Palette[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_PALETTES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export const customPalettes = writable<Palette[]>(loadCustomPalettes());
customPalettes.subscribe((ps) => localStorage.setItem(CUSTOM_PALETTES_KEY, JSON.stringify(ps)));

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
