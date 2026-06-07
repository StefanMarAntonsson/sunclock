<script lang="ts">
  let {
    items,
    selectedIndex = $bindable(0),
  }: {
    items: readonly string[];
    selectedIndex: number;
  } = $props();

  const VISIBLE  = 5;
  const HALF     = Math.floor(VISIBLE / 2); // 2
  const ITEM_H   = 30;                      // px per row

  function wrap(i: number) {
    const n = items.length;
    return ((i % n) + n) % n;
  }

  function shift(delta: number) {
    selectedIndex = wrap(selectedIndex + delta);
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    shift(e.deltaY > 0 ? 1 : -1);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); shift(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); shift(-1); }
  }

  let rows = $derived(
    Array.from({ length: VISIBLE }, (_, i) => {
      const offset = i - HALF;
      return { label: items[wrap(selectedIndex + offset)], offset };
    }),
  );
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="wp"
  tabindex="0"
  style:height="{VISIBLE * ITEM_H}px"
  role="listbox"
  onwheel={onWheel}
  onkeydown={onKeydown}
>
  {#each rows as row}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="row"
      class:sel={row.offset === 0}
      class:far={Math.abs(row.offset) === HALF}
      style:height="{ITEM_H}px"
      onclick={() => shift(row.offset)}
    >
      {row.label}
    </div>
  {/each}
</div>

<style>
  .wp {
    width: 46px;
    overflow: hidden;
    border: 1px solid #2d3748;
    border-radius: 4px;
    background: #0f1117;
    outline: none;
    user-select: none;
    cursor: default;
    flex-shrink: 0;
    position: relative;
  }

  .wp:focus-within {
    border-color: #475569;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    color: #374151;
    cursor: pointer;
    transition: color 0.1s;
  }

  .row:hover:not(.sel) {
    color: #64748b;
  }

  .row.far {
    color: #1f2937;
  }

  .row.sel {
    color: #e2e8f0;
    background: #1a1f2e;
    font-weight: 600;
    border-top: 1px solid #2d3748;
    border-bottom: 1px solid #2d3748;
  }
</style>
