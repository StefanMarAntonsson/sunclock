<script lang="ts">
  import { customRanges } from '../stores';

  function fmtHour(dh: number): string {
    let h = Math.floor(dh);
    let m = Math.round((dh - h) * 60);
    if (m === 60) { h++; m = 0; }
    return `${String(h % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function remove(id: number) {
    customRanges.update(ranges => ranges.filter(r => r.id !== id));
  }
</script>

<div class="range-list">
  {#each $customRanges as r (r.id)}
    <div class="range-item">
      <div class="range-swatch" style="background: {r.color}"></div>
      <span class="range-name">{r.label}</span>
      <span class="range-times">{fmtHour(r.startH)} – {fmtHour(r.endH)}</span>
      <button class="range-del" onclick={() => remove(r.id)} title="remove">×</button>
    </div>
  {/each}
</div>

<style>
  .range-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-height: 61px; /* 2 items (28px each) + 1 gap (5px) */
    overflow-y: auto;
    padding-right: 16px; /* keeps × clear of scrollbar */
  }

  .range-list::-webkit-scrollbar {
    width: 3px;
  }

  .range-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .range-list::-webkit-scrollbar-thumb {
    background: #2d3748;
    border-radius: 2px;
  }

  .range-list::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }

  .range-item {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .range-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .range-name {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #94a3b8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .range-times {
    font-family: 'Courier New', monospace;
    font-size: 0.78rem;
    color: #475569;
    flex-shrink: 0;
  }

  .range-del {
    background: none !important;
    border: none !important;
    color: #2d3748;
    font-size: 1rem;
    padding: 3px 8px;
    line-height: 1;
    cursor: pointer;
    flex-shrink: 0;
  }

  .range-del:hover {
    color: #f87171 !important;
    border: none !important;
  }
</style>
