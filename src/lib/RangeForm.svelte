<script lang="ts">
  import { customRanges } from '../stores';

  let label     = $state('');
  let startTime = $state('08:00');
  let endTime   = $state('16:00');
  let color     = $state('#22c55e');

  function parseTimeInput(val: string): number | null {
    if (!val) return null;
    const [h, m] = val.split(':').map(Number);
    return h + m / 60;
  }

  function add() {
    const startH = parseTimeInput(startTime);
    const endH   = parseTimeInput(endTime);
    if (startH === null || endH === null) return;

    customRanges.update(ranges => [...ranges, {
      id: Date.now(),
      label: label.trim() || 'Custom',
      startH,
      endH,
      color,
    }]);
    label = '';
  }
</script>

<div class="ctrl-row">
  <input class="range-label" type="text" placeholder="label…"
         bind:value={label} onkeydown={(e) => e.key === 'Enter' && add()} />
  <input class="range-time" type="time" bind:value={startTime} />
  <span class="ctrl-sep">–</span>
  <input class="range-time" type="time" bind:value={endTime} />
  <input type="color" bind:value={color} />
  <button onclick={add}>add</button>
</div>

<style>
  .ctrl-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .range-label {
    flex: 1;
    min-width: 0;
  }

  .range-time {
    width: 96px;
    flex-shrink: 0;
  }

  .ctrl-sep {
    color: #374151;
    font-family: 'Courier New', monospace;
    font-size: 0.82rem;
  }
</style>
