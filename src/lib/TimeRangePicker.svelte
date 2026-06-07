<script lang="ts">
  let {
    startTime = $bindable('08:00'),
    endTime = $bindable('16:00'),
  }: {
    startTime?: string;
    endTime?: string;
  } = $props();

  let open = $state(false);

  // Draft values while the panel is open
  let sh = $state(8), sm = $state(0);
  let eh = $state(16), em = $state(0);

  function parseHM(t: string): [number, number] {
    const [h, m] = (t || '00:00').split(':').map(Number);
    return [isNaN(h) ? 0 : h, isNaN(m) ? 0 : m];
  }

  function fmt(h: number, m: number) {
    return (
      String(Math.max(0, Math.min(23, h || 0))).padStart(2, '0') +
      ':' +
      String(Math.max(0, Math.min(59, m || 0))).padStart(2, '0')
    );
  }

  function toggle() {
    if (!open) {
      [sh, sm] = parseHM(startTime);
      [eh, em] = parseHM(endTime);
    }
    open = !open;
  }

  function commit() {
    startTime = fmt(sh, sm);
    endTime = fmt(eh, em);
    open = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
    if (e.key === 'Enter') commit();
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
    <div class="panel" onkeydown={onKeydown}>
      <div class="slots">
        <div class="slot">
          <span class="slot-label">start</span>
          <div class="hm">
            <input type="number" min="0" max="23" bind:value={sh} />
            <span class="colon">:</span>
            <input type="number" min="0" max="59" bind:value={sm} />
          </div>
        </div>

        <span class="arrow">→</span>

        <div class="slot">
          <span class="slot-label">end</span>
          <div class="hm">
            <input type="number" min="0" max="23" bind:value={eh} />
            <span class="colon">:</span>
            <input type="number" min="0" max="59" bind:value={em} />
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

  /* Trigger inherits the global button styles; just add the icon layout */
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

  /* Panel floats above the trigger */
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
    min-width: 240px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  }

  .slots {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }

  .slot {
    display: flex;
    flex-direction: column;
    gap: 5px;
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
    gap: 3px;
  }

  /* Number inputs — styled like the app's text inputs */
  .hm input[type='number'] {
    width: 42px;
    text-align: center;
    background: #0f1117;
    border: 1px solid #2d3748;
    color: #cbd5e1;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    padding: 5px 0;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.15s;
  }

  .hm input[type='number']:focus {
    border-color: #475569;
  }

  /* Hide native spin buttons */
  .hm input[type='number']::-webkit-outer-spin-button,
  .hm input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .hm input[type='number'] {
    -moz-appearance: textfield;
  }

  .colon {
    color: #475569;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
  }

  .arrow {
    color: #374151;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .set-btn {
    align-self: flex-end;
  }
</style>
