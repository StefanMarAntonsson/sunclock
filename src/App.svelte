<script lang="ts">
  import Clock from './lib/Clock.svelte';
  import LocationInput from './lib/LocationInput.svelte';
  import RangeForm from './lib/RangeForm.svelte';
  import RangeList from './lib/RangeList.svelte';
  import SettingsPanel from './lib/SettingsPanel.svelte';
  import { get } from 'svelte/store';
  import { sunInfo, locationTimezone } from './stores';

  let timeStr = $state('00:00:00');

  $effect(() => {
    function tick() {
      const tz = get(locationTimezone);
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      if (tz) {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
        }).formatToParts(now);
        const v = (type: string) => parts.find(p => p.type === type)?.value ?? '00';
        timeStr = `${v('hour')}:${v('minute')}:${v('second')}`;
      } else {
        timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });
</script>

<SettingsPanel />

<div class="clock-container">
  <Clock />
  <div class="time-display">{timeStr}</div>
  <div class="sun-info" class:live={$sunInfo.cls === 'live'} class:error={$sunInfo.cls === 'error'}>
    {$sunInfo.msg}
  </div>

  <div class="controls">
    <LocationInput />
    <hr class="ctrl-divider" />
    <span class="ctrl-label">custom ranges</span>
    <RangeForm />
    <RangeList />
  </div>
</div>

<style>
  .clock-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .time-display {
    color: #94a3b8;
    font-size: 1.2rem;
    letter-spacing: 5px;
    font-family: 'Courier New', monospace;
  }

  .sun-info {
    color: #475569;
    font-size: 0.78rem;
    letter-spacing: 1.5px;
    font-family: 'Courier New', monospace;
    min-height: 1em;
  }
  .sun-info.live  { color: #fbbf24; }
  .sun-info.error { color: #f87171; }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 500px;
  }

  .ctrl-divider {
    border: none;
    border-top: 1px solid #1e2130;
    margin: 2px 0;
  }

  .ctrl-label {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: #374151;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>
