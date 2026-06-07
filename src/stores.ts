import { writable } from "svelte/store";

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
