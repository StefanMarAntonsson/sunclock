<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { sunriseH, sunsetH, customRanges, weatherCodes, clockSettings, locationTimezone } from '../stores';
  import type { ClockSettings } from '../stores';
  import { buildWeatherPeriods } from './weather';

  const SIZE = 760;
  const C    = SIZE / 2;
  const R    = 302;
  const RIM_R = R - 12;
  const CUS_R = R - 35;
  const CUS_W = 12;
  const WX_R       = R + 24;
  const WX_W       = 20;
  const WX_EMOJI_R = WX_R + WX_W / 2 + 14;

  // Fixed ring center radii — widths are settable but centers stay put
  const HR_R = 235;
  const MN_R = 195;
  const SC_R = 159;

  let canvas: HTMLCanvasElement = $state() as HTMLCanvasElement;

  function nowInTz(tz: string | null): { h: number; m: number; s: number } {
    const now = new Date();
    if (!tz) return { h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() };
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).formatToParts(now);
    const v = (type: string) => parseInt(parts.find(p => p.type === type)?.value ?? '0');
    return { h: v('hour'), m: v('minute'), s: v('second') };
  }

  function hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }

  function hourToAngle(h: number, m = 0, s = 0) {
    return (((h - 12 + 24) % 24 + m / 60 + s / 3600) / 24) * 2 * Math.PI - Math.PI / 2;
  }
  function decimalToAngle(dh: number) {
    return (((dh - 12) % 24 + 24) % 24 / 24) * 2 * Math.PI - Math.PI / 2;
  }
  function minuteToAngle(m: number, s = 0) {
    return ((m + s / 60) / 60) * 2 * Math.PI - Math.PI / 2;
  }
  function secondToAngle(s: number) {
    return (s / 60) * 2 * Math.PI - Math.PI / 2;
  }

  function drawWeatherRing(
    ctx: CanvasRenderingContext2D,
    cfg: ClockSettings,
    sr: number,
    ss: number,
    tz: string,
  ) {
    const codes = get(weatherCodes);
    if (!codes.length) return;

    const periods = buildWeatherPeriods(codes, sr, ss, tz);
    const ringInner = WX_R - WX_W / 2;
    const isFullCircle = (startH: number, endH: number) => startH === 0 && endH === 24;

    periods.forEach(({ startH, endH, info }) => {
      const sA = decimalToAngle(startH);
      const eA = decimalToAngle(endH);

      let offset = 0;
      info.layers.forEach(([color, fraction]) => {
        const thickness = fraction * WX_W;
        const layerR    = ringInner + offset + thickness / 2;
        offset += thickness;

        ctx.beginPath();
        if (isFullCircle(startH, endH)) {
          ctx.arc(C, C, layerR, 0, 2 * Math.PI);
        } else {
          ctx.arc(C, C, layerR, sA, eA, false);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth   = thickness;
        ctx.lineCap     = 'butt';
        ctx.stroke();
      });

      if (cfg.showWeatherEmoji) {
        const midA = decimalToAngle((startH + endH) / 2);
        ctx.font         = '16px sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(info.emoji, C + WX_EMOJI_R * Math.cos(midA), C + WX_EMOJI_R * Math.sin(midA));
      }
    });
  }

  function drawRingHand(
    ctx: CanvasRenderingContext2D,
    ringR: number, ringW: number,
    angle: number, cfg: ClockSettings
  ) {
    const inner = ringR - ringW / 2 - 3;
    const outer = ringR + ringW / 2 + 3;
    ctx.beginPath();
    ctx.moveTo(C + inner * Math.cos(angle), C + inner * Math.sin(angle));
    ctx.lineTo(C + outer * Math.cos(angle), C + outer * Math.sin(angle));
    ctx.strokeStyle = cfg.hourHandColor;
    ctx.lineWidth = cfg.handWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function drawRing(
    ctx: CanvasRenderingContext2D,
    ringR: number, ringW: number,
    currA: number,
    trackColor: string, indicatorColor: string,
    labels: [number, number][],
    currentLabel: number,
    cfg: ClockSettings
  ) {
    // Track
    ctx.beginPath();
    ctx.arc(C, C, ringR, 0, 2 * Math.PI);
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = ringW;
    ctx.lineCap = 'butt';
    ctx.stroke();

    // Dividers
    labels.forEach(([, angle]) => {
      const inner = ringR - ringW / 2;
      const outer = ringR + ringW / 2;
      ctx.beginPath();
      ctx.moveTo(C + inner * Math.cos(angle), C + inner * Math.sin(angle));
      ctx.lineTo(C + outer * Math.cos(angle), C + outer * Math.sin(angle));
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'butt';
      ctx.stroke();
    });

    // Numbers with circular background matching the ring track color
    if (cfg.showNumbers) {
      const bgR = cfg.numberSize * 0.9;
      labels.forEach(([value, angle]) => {
        const x = C + ringR * Math.cos(angle);
        const y = C + ringR * Math.sin(angle);

        // Face color first — erases the divider line behind the number
        ctx.beginPath();
        ctx.arc(x, y, bgR, 0, 2 * Math.PI);
        ctx.fillStyle = cfg.faceColor;
        ctx.fill();

        // Track color tint — matches the ring's apparent background
        ctx.beginPath();
        ctx.arc(x, y, bgR, 0, 2 * Math.PI);
        ctx.fillStyle = trackColor;
        ctx.fill();

        const isCurrent = cfg.highlightCurrent && value === currentLabel;
        ctx.font = `${isCurrent ? 'bold ' : ''}${cfg.numberSize}px ${cfg.fontFamily}`;
        ctx.fillStyle = isCurrent
          ? cfg.currentNumberColor
          : hexToRgba(cfg.numberColor, cfg.numberOpacity);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value.toString(), x, y);
      });
    }

    // Hand indicator
    const inner = ringR - ringW / 2 - 3;
    const outer = ringR + ringW / 2 + 3;
    ctx.beginPath();
    ctx.moveTo(C + inner * Math.cos(currA), C + inner * Math.sin(currA));
    ctx.lineTo(C + outer * Math.cos(currA), C + outer * Math.sin(currA));
    ctx.strokeStyle = indicatorColor;
    ctx.lineWidth = cfg.handWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const { h, m, s } = nowInTz(get(locationTimezone));
    const sr     = get(sunriseH);
    const ss     = get(sunsetH);
    const ranges = get(customRanges);
    const cfg    = get(clockSettings);

    ctx.clearRect(0, 0, SIZE, SIZE);

    const srA = decimalToAngle(sr);
    const ssA = decimalToAngle(ss);

    // Weather ring
    const tz = get(locationTimezone);
    if (cfg.showWeatherRing && tz !== null) {
      drawWeatherRing(ctx, cfg, sr, ss, tz);
      if (cfg.showWeatherHand) drawRingHand(ctx, WX_R, WX_W, hourToAngle(h, m, s), cfg);
    }

    // Face
    ctx.beginPath();
    ctx.arc(C, C, R, 0, 2 * Math.PI);
    ctx.fillStyle = cfg.faceColor;
    ctx.fill();

    // Day/Night rim
    if (cfg.showDayNightRim) {
      ctx.beginPath();
      ctx.arc(C, C, RIM_R, ssA, srA, false);
      ctx.strokeStyle = hexToRgba(cfg.nightColor, cfg.nightOpacity);
      ctx.lineWidth   = cfg.rimWidth;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(C, C, RIM_R, srA, ssA, false);
      ctx.strokeStyle = hexToRgba(cfg.dayColor, cfg.dayOpacity);
      ctx.lineWidth   = cfg.rimWidth;
      ctx.stroke();
    }

    // Day/Night hand
    if (cfg.showDayNightRim && cfg.showDayNightHand)
      drawRingHand(ctx, RIM_R, cfg.rimWidth, hourToAngle(h, m, s), cfg);

    // Custom ranges band
    if (cfg.showCustomRanges) {
      ranges.forEach(r => {
        const sA = decimalToAngle(r.startH);
        const eA = decimalToAngle(r.endH);
        if (Math.abs(sA - eA) < 1e-9) return;
        ctx.beginPath();
        ctx.arc(C, C, CUS_R, sA, eA, false);
        ctx.strokeStyle = r.color;
        ctx.lineWidth   = CUS_W;
        ctx.lineCap     = 'butt';
        ctx.stroke();
      });
    }

    // Outer border
    ctx.beginPath();
    ctx.arc(C, C, R, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Sunrise / sunset dots
    if (cfg.showSunriseSunsetDots && cfg.showDayNightRim) {
      ([
        [srA, cfg.sunriseColor],
        [ssA, cfg.sunsetColor],
      ] as [number, string][]).forEach(([angle, color]) => {
        ctx.beginPath();
        ctx.arc(C + RIM_R * Math.cos(angle), C + RIM_R * Math.sin(angle), 5.5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }

    // Hour ring
    if (cfg.showHourRing) {
      const hourLabels: [number, number][] = Array.from({ length: 24 }, (_, i) => [i, hourToAngle(i)]);
      drawRing(ctx, HR_R, cfg.hourRingWidth, hourToAngle(h, m, s),
        hexToRgba(cfg.hourColor, cfg.hourTrackOpacity), cfg.hourHandColor,
        hourLabels, h, cfg);
    }

    // Minute ring
    if (cfg.showMinuteRing) {
      const minLabels: [number, number][] = Array.from({ length: 12 }, (_, i) => [i * 5, minuteToAngle(i * 5)]);
      const nearestMin5 = Math.round(m / 5) * 5 % 60;
      drawRing(ctx, MN_R, cfg.minuteRingWidth, minuteToAngle(m, s),
        hexToRgba(cfg.minuteColor, cfg.minuteTrackOpacity), cfg.minuteHandColor,
        minLabels, nearestMin5, cfg);
    }

    // Second ring
    if (cfg.showSecondRing) {
      const secLabels: [number, number][] = Array.from({ length: 12 }, (_, i) => [i * 5, secondToAngle(i * 5)]);
      const nearestSec5 = Math.round(s / 5) * 5 % 60;
      drawRing(ctx, SC_R, cfg.secondRingWidth, secondToAngle(s),
        hexToRgba(cfg.secondColor, cfg.secondTrackOpacity), cfg.secondHandColor,
        secLabels, nearestSec5, cfg);
    }
  }

  onMount(() => {
    const ctx = canvas.getContext('2d')!;

    const unsubs = [
      sunriseH.subscribe(() => draw(ctx)),
      sunsetH.subscribe(() => draw(ctx)),
      customRanges.subscribe(() => draw(ctx)),
      weatherCodes.subscribe(() => draw(ctx)),
      clockSettings.subscribe(() => draw(ctx)),
      locationTimezone.subscribe(() => draw(ctx)),
    ];

    const interval = setInterval(() => draw(ctx), 1000);

    return () => {
      clearInterval(interval);
      unsubs.forEach(u => u());
    };
  });
</script>

<canvas bind:this={canvas} width={SIZE} height={SIZE}></canvas>
