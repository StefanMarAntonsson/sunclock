<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { sunriseH, sunsetH, customRanges } from '../stores';

  const SIZE  = 660;
  const C     = SIZE / 2;
  const R     = C - 28;
  const RIM_R = R - 12;
  const RIM_W = 16;
  const CUS_R = R - 35;
  const CUS_W = 12;

  let canvas: HTMLCanvasElement = $state() as HTMLCanvasElement;

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

  function drawHand(ctx: CanvasRenderingContext2D, angle: number, length: number,
                    width: number, color: string, hasTail = false) {
    const tail = hasTail ? length * 0.2 : 0;
    ctx.beginPath();
    ctx.moveTo(C - tail * Math.cos(angle), C - tail * Math.sin(angle));
    ctx.lineTo(C + length * Math.cos(angle), C + length * Math.sin(angle));
    ctx.strokeStyle = color;
    ctx.lineWidth   = width;
    ctx.lineCap     = 'round';
    ctx.stroke();
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const now    = new Date();
    const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const sr     = get(sunriseH);
    const ss     = get(sunsetH);
    const ranges = get(customRanges);

    ctx.clearRect(0, 0, SIZE, SIZE);

    const srA = decimalToAngle(sr);
    const ssA = decimalToAngle(ss);

    // Face
    ctx.beginPath();
    ctx.arc(C, C, R, 0, 2 * Math.PI);
    ctx.fillStyle = '#181e2e';
    ctx.fill();

    // Night tint (full circle)
    ctx.beginPath();
    ctx.arc(C, C, R, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(37, 99, 235, 0.09)';
    ctx.fill();

    // Day tint (sunrise → sunset pie sector)
    ctx.beginPath();
    ctx.moveTo(C, C);
    ctx.arc(C, C, R, srA, ssA, false);
    ctx.closePath();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.09)';
    ctx.fill();

    // Outer rim — night
    ctx.beginPath();
    ctx.arc(C, C, RIM_R, ssA, srA, false);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.55)';
    ctx.lineWidth   = RIM_W;
    ctx.stroke();

    // Outer rim — day
    ctx.beginPath();
    ctx.arc(C, C, RIM_R, srA, ssA, false);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.lineWidth   = RIM_W;
    ctx.stroke();

    // Inner band — custom ranges
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

    // Outer border
    ctx.beginPath();
    ctx.arc(C, C, R, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Sunrise / sunset dots
    ([
      [srA, '#fde68a'],
      [ssA, '#f97316'],
    ] as [number, string][]).forEach(([angle, color]) => {
      ctx.beginPath();
      ctx.arc(C + RIM_R * Math.cos(angle), C + RIM_R * Math.sin(angle), 5.5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Tick marks + 24-hour labels
    for (let i = 0; i < 24; i++) {
      const angle   = hourToAngle(i);
      const isMajor = i % 6 === 0;
      const isMed   = i % 3 === 0;
      const outer   = R - 2;
      const inner   = isMajor ? R - 22 : isMed ? R - 14 : R - 8;

      ctx.beginPath();
      ctx.moveTo(C + outer * Math.cos(angle), C + outer * Math.sin(angle));
      ctx.lineTo(C + inner * Math.cos(angle), C + inner * Math.sin(angle));
      ctx.strokeStyle = isMajor ? '#f1f5f9' : isMed ? '#4b5563' : '#2d3748';
      ctx.lineWidth   = isMajor ? 2.5 : 1.5;
      ctx.stroke();

      const lx = C + (R - 52) * Math.cos(angle);
      const ly = C + (R - 52) * Math.sin(angle);
      ctx.fillStyle    = isMajor ? '#f1f5f9' : isMed ? '#94a3b8' : '#475569';
      ctx.font         = isMajor ? 'bold 15px Georgia' : '12px Georgia';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), lx, ly);
    }

    // Hands
    drawHand(ctx, hourToAngle(h, m, s), R * 0.50, 5.5, '#60a5fa');
    drawHand(ctx, minuteToAngle(m, s),  R * 0.70, 3.5, '#cbd5e1');
    drawHand(ctx, secondToAngle(s),     R * 0.80, 1.5, '#f87171', true);

    // Centre cap
    ctx.beginPath();
    ctx.arc(C, C, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#f87171';
    ctx.fill();
  }

  onMount(() => {
    const ctx = canvas.getContext('2d')!;

    // Subscribe to store changes for immediate redraws; each subscribe also fires once now.
    const unsubs = [
      sunriseH.subscribe(() => draw(ctx)),
      sunsetH.subscribe(() => draw(ctx)),
      customRanges.subscribe(() => draw(ctx)),
    ];

    const interval = setInterval(() => draw(ctx), 1000);

    return () => {
      clearInterval(interval);
      unsubs.forEach(u => u());
    };
  });
</script>

<canvas bind:this={canvas} width={SIZE} height={SIZE}></canvas>
