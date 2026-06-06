<script lang="ts">
  import { onMount } from 'svelte';
  import { applyLocation, loadSavedLocation } from './location';

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
</style>
