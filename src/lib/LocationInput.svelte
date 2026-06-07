<script lang="ts">
  import { onMount } from 'svelte';
  import { applyLocation, loadSavedLocation, clearLocation } from './location';

  let value = $state('');

  onMount(async () => {
    const label = await loadSavedLocation();
    if (label) value = label;
  });

  async function handleSet() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const label = await applyLocation(trimmed);
    if (label) value = label;
  }

  function handleClear() {
    clearLocation();
    value = '';
  }
</script>

<div class="ctrl-row">
  <input
    class="location-input"
    type="text"
    placeholder="city or place…"
    autocomplete="off"
    spellcheck="false"
    bind:value
    onkeydown={(e) => e.key === 'Enter' && handleSet()}
  />
  <button onclick={handleSet}>set location</button>
  {#if value}
    <button class="clear-btn" onclick={handleClear} title="Clear location">×</button>
  {/if}
</div>

<style>
  .ctrl-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .location-input {
    flex: 1;
  }

  .clear-btn {
    padding: 0;
    width: 28px;
    height: 28px;
    background: none;
    border: 1px solid #1e2a3a;
    border-radius: 4px;
    color: #475569;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s;
  }
  .clear-btn:hover {
    color: #f87171;
    border-color: #7f1d1d;
  }
</style>
