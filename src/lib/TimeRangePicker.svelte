<script lang="ts">
  import WheelPicker from './WheelPicker.svelte';

  let {
    startTime = $bindable('08:00'),
    endTime   = $bindable('16:00'),
  }: {
    startTime?: string;
    endTime?: string;
  } = $props();

  // Hours 00-23, minutes in 5-min steps 00-55
  const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const MINS  = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  let open = $state(false);
  let shi  = $state(8);   // start hour index  (0-23)
  let smi  = $state(0);   // start minute index (0-11 → :00-:55)
  let ehi  = $state(16);  // end hour index
  let emi  = $state(0);   // end minute index

  function parseToIdx(t: string): [number, number] {
    const [h, m] = (t || '00:00').split(':').map(Number);
    const hour   = isNaN(h) ? 0 : Math.max(0, Math.min(23, h));
    const minIdx = Math.min(11, Math.round((isNaN(m) ? 0 : m) / 5));
    return [hour, minIdx];
  }

  function toggle() {
    if (!open) {
      [shi, smi] = parseToIdx(startTime);
      [ehi, emi] = parseToIdx(endTime);
    }
    open = !open;
  }

  function commit() {
    startTime = `${HOURS[shi]}:${MINS[smi]}`;
    endTime   = `${HOURS[ehi]}:${MINS[emi]}`;
    open = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
  }
</script>

<div class="picker-wrap">
  <button type="button" class="trigger" onclick={toggle}>
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
    {startTime} – {endTime}
  </button>

  {#if open}
    <div class="backdrop" role="presentation" onclick={() => (open = false)}></div>
    <div class="panel" onkeydown={onKeydown}>
      <div class="slots">
        <div class="slot">
          <span class="slot-label">start</span>
          <div class="hm">
            <WheelPicker items={HOURS} bind:selectedIndex={shi} />
            <span class="colon">:</span>
            <WheelPicker items={MINS}  bind:selectedIndex={smi} />
          </div>
        </div>

        <span class="arrow">→</span>

        <div class="slot">
          <span class="slot-label">end</span>
          <div class="hm">
            <WheelPicker items={HOURS} bind:selectedIndex={ehi} />
            <span class="colon">:</span>
            <WheelPicker items={MINS}  bind:selectedIndex={emi} />
          </div>
        </div>
      </div>

      <button type="button" class="set-btn" onclick={commit}>set</button>
    </div>
  {/if}
</div>

<style>
  .picker-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .trigger {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .icon {
    width: 13px;
    height: 13px;
    opacity: 0.45;
    flex-shrink: 0;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .panel {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: #1a1f2e;
    border: 1px solid #2d3748;
    border-radius: 6px;
    padding: 14px 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 100;
    min-width: 260px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }

  .slots {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }

  .slot {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .slot-label {
    font-family: 'Courier New', monospace;
    font-size: 0.65rem;
    color: #374151;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .hm {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .colon {
    color: #475569;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    margin-bottom: 1px;
  }

  .arrow {
    color: #374151;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    padding-bottom: 2px;
    flex-shrink: 0;
  }

  .set-btn {
    align-self: flex-end;
  }
</style>
