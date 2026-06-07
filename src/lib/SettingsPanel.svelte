<script lang="ts">
  import { get } from 'svelte/store';
  import {
    clockSettings, defaultSettings,
    customPalettes, PRESET_PALETTES, paletteToSettings,
  } from '../stores';
  import type { Palette } from '../stores';

  let open = $state(false);

  const fonts = ['Georgia', 'Arial', 'Verdana', 'Trebuchet MS', 'Courier New', 'monospace', 'serif', 'sans-serif'];

  function reset() {
    clockSettings.set({ ...defaultSettings });
  }

  // Sections collapsed state
  let collapsed = $state<Record<string, boolean>>({
    palette: false,
    font: true,
    face: true,
    rings: true,
    numbers: true,
    daynight: true,
    weather: true,
  });

  function toggle(section: string) {
    collapsed[section] = !collapsed[section];
  }

  // Palette management
  let activePaletteId = $state<string | null>('default');
  let savingName = $state('');
  let showSaveInput = $state(false);

  function applyPalette(p: Palette) {
    clockSettings.update(cfg => ({ ...cfg, ...paletteToSettings(p) }));
    activePaletteId = p.id;
  }

  function saveCustomPalette() {
    const name = savingName.trim();
    if (!name) return;
    const cfg = get(clockSettings);
    const newPalette: Palette = {
      id: `custom_${Date.now()}`,
      name,
      faceColor: cfg.faceColor,
      hourColor: cfg.hourColor,
      hourTrackOpacity: cfg.hourTrackOpacity,
      hourHandColor: cfg.hourHandColor,
      minuteColor: cfg.minuteColor,
      minuteTrackOpacity: cfg.minuteTrackOpacity,
      minuteHandColor: cfg.minuteHandColor,
      secondColor: cfg.secondColor,
      secondTrackOpacity: cfg.secondTrackOpacity,
      secondHandColor: cfg.secondHandColor,
      numberColor: cfg.numberColor,
      numberOpacity: cfg.numberOpacity,
      currentNumberColor: cfg.currentNumberColor,
      dayColor: cfg.dayColor,
      dayOpacity: cfg.dayOpacity,
      nightColor: cfg.nightColor,
      nightOpacity: cfg.nightOpacity,
      sunriseColor: cfg.sunriseColor,
      sunsetColor: cfg.sunsetColor,
    };
    customPalettes.update(ps => [...ps, newPalette]);
    activePaletteId = newPalette.id;
    savingName = '';
    showSaveInput = false;
  }

  function deleteCustomPalette(id: string) {
    customPalettes.update(ps => ps.filter(p => p.id !== id));
    if (activePaletteId === id) activePaletteId = null;
  }
</script>

<!-- Fixed overlay — does not affect page layout -->
<div class="panel-wrap" class:open>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">Settings</span>
      <button class="reset-btn" onclick={reset} title="Reset to defaults">↺</button>
    </div>

    <div class="panel-body">

      <!-- PALETTES -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('palette')}>
          <span>Color Palette</span><span class="caret">{collapsed.palette ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.palette}
          <div class="section-body">
            <p class="sub-head">Presets</p>
            <div class="palette-grid">
              {#each PRESET_PALETTES as p}
                <button
                  class="palette-card"
                  class:active={activePaletteId === p.id}
                  onclick={() => applyPalette(p)}
                  title={p.name}
                >
                  <div class="palette-preview" style="background:{p.faceColor}">
                    <span class="pdot" style="background:{p.hourHandColor}"></span>
                    <span class="pdot" style="background:{p.minuteHandColor}"></span>
                    <span class="pdot" style="background:{p.secondHandColor}"></span>
                  </div>
                  <span class="palette-label">{p.name}</span>
                </button>
              {/each}
            </div>

            {#if $customPalettes.length > 0}
              <p class="sub-head">Custom</p>
              <div class="palette-grid">
                {#each $customPalettes as p}
                  <div class="palette-card-wrap">
                    <button
                      class="palette-card"
                      class:active={activePaletteId === p.id}
                      onclick={() => applyPalette(p)}
                      title={p.name}
                    >
                      <div class="palette-preview" style="background:{p.faceColor}">
                        <span class="pdot" style="background:{p.hourHandColor}"></span>
                        <span class="pdot" style="background:{p.minuteHandColor}"></span>
                        <span class="pdot" style="background:{p.secondHandColor}"></span>
                      </div>
                      <span class="palette-label">{p.name}</span>
                    </button>
                    <button class="del-palette" onclick={() => deleteCustomPalette(p.id)} title="Delete">×</button>
                  </div>
                {/each}
              </div>
            {/if}

            {#if showSaveInput}
              <div class="save-row">
                <input
                  class="save-input"
                  type="text"
                  placeholder="Palette name…"
                  bind:value={savingName}
                  onkeydown={e => { if (e.key === 'Enter') saveCustomPalette(); if (e.key === 'Escape') { showSaveInput = false; savingName = ''; } }}
                  autofocus
                />
                <button class="save-confirm" onclick={saveCustomPalette}>Save</button>
                <button class="save-cancel" onclick={() => { showSaveInput = false; savingName = ''; }}>✕</button>
              </div>
            {:else}
              <button class="add-palette-btn" onclick={() => { showSaveInput = true; }}>+ Save current as palette</button>
            {/if}
          </div>
        {/if}
      </div>

      <!-- FONT -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('font')}>
          <span>Font</span><span class="caret">{collapsed.font ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.font}
          <div class="section-body">
            <label class="row">
              <span>Family</span>
              <select bind:value={$clockSettings.fontFamily}>
                {#each fonts as f}<option value={f}>{f}</option>{/each}
              </select>
            </label>
            <label class="row">
              <span>Size <em>{$clockSettings.numberSize}px</em></span>
              <input type="range" min="8" max="16" step="1" bind:value={$clockSettings.numberSize} />
            </label>
          </div>
        {/if}
      </div>

      <!-- FACE -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('face')}>
          <span>Clock Face</span><span class="caret">{collapsed.face ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.face}
          <div class="section-body">
            <label class="row">
              <span>Background</span>
              <input type="color" bind:value={$clockSettings.faceColor} />
            </label>
          </div>
        {/if}
      </div>

      <!-- RINGS -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('rings')}>
          <span>Rings</span><span class="caret">{collapsed.rings ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.rings}
          <div class="section-body">

            <p class="sub-head">Hour Ring</p>
            <label class="row"><span>Visible</span>
              <input type="checkbox" bind:checked={$clockSettings.showHourRing} /></label>
            <label class="row"><span>Track Color</span>
              <input type="color" bind:value={$clockSettings.hourColor} /></label>
            <label class="row">
              <span>Track Opacity <em>{Math.round($clockSettings.hourTrackOpacity * 100)}%</em></span>
              <input type="range" min="0" max="1" step="0.01" bind:value={$clockSettings.hourTrackOpacity} />
            </label>
            <label class="row"><span>Hand Color</span>
              <input type="color" bind:value={$clockSettings.hourHandColor} /></label>
            <label class="row">
              <span>Width <em>{$clockSettings.hourRingWidth}px</em></span>
              <input type="range" min="16" max="50" step="1" bind:value={$clockSettings.hourRingWidth} />
            </label>

            <p class="sub-head">Minute Ring</p>
            <label class="row"><span>Visible</span>
              <input type="checkbox" bind:checked={$clockSettings.showMinuteRing} /></label>
            <label class="row"><span>Track Color</span>
              <input type="color" bind:value={$clockSettings.minuteColor} /></label>
            <label class="row">
              <span>Track Opacity <em>{Math.round($clockSettings.minuteTrackOpacity * 100)}%</em></span>
              <input type="range" min="0" max="1" step="0.01" bind:value={$clockSettings.minuteTrackOpacity} />
            </label>
            <label class="row"><span>Hand Color</span>
              <input type="color" bind:value={$clockSettings.minuteHandColor} /></label>
            <label class="row">
              <span>Width <em>{$clockSettings.minuteRingWidth}px</em></span>
              <input type="range" min="14" max="46" step="1" bind:value={$clockSettings.minuteRingWidth} />
            </label>

            <p class="sub-head">Second Ring</p>
            <label class="row"><span>Visible</span>
              <input type="checkbox" bind:checked={$clockSettings.showSecondRing} /></label>
            <label class="row"><span>Track Color</span>
              <input type="color" bind:value={$clockSettings.secondColor} /></label>
            <label class="row">
              <span>Track Opacity <em>{Math.round($clockSettings.secondTrackOpacity * 100)}%</em></span>
              <input type="range" min="0" max="1" step="0.01" bind:value={$clockSettings.secondTrackOpacity} />
            </label>
            <label class="row"><span>Hand Color</span>
              <input type="color" bind:value={$clockSettings.secondHandColor} /></label>
            <label class="row">
              <span>Width <em>{$clockSettings.secondRingWidth}px</em></span>
              <input type="range" min="12" max="40" step="1" bind:value={$clockSettings.secondRingWidth} />
            </label>

            <p class="sub-head">Hand Indicator</p>
            <label class="row">
              <span>Thickness <em>{$clockSettings.handWidth}px</em></span>
              <input type="range" min="1" max="6" step="0.5" bind:value={$clockSettings.handWidth} />
            </label>
          </div>
        {/if}
      </div>

      <!-- NUMBERS -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('numbers')}>
          <span>Numbers</span><span class="caret">{collapsed.numbers ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.numbers}
          <div class="section-body">
            <label class="row"><span>Show Numbers</span>
              <input type="checkbox" bind:checked={$clockSettings.showNumbers} /></label>
            <label class="row"><span>Color</span>
              <input type="color" bind:value={$clockSettings.numberColor} /></label>
            <label class="row">
              <span>Opacity <em>{Math.round($clockSettings.numberOpacity * 100)}%</em></span>
              <input type="range" min="0" max="1" step="0.01" bind:value={$clockSettings.numberOpacity} />
            </label>
            <label class="row"><span>Highlight Current</span>
              <input type="checkbox" bind:checked={$clockSettings.highlightCurrent} /></label>
            <label class="row"><span>Highlight Color</span>
              <input type="color" bind:value={$clockSettings.currentNumberColor} /></label>
          </div>
        {/if}
      </div>

      <!-- DAY/NIGHT -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('daynight')}>
          <span>Day / Night Ring</span><span class="caret">{collapsed.daynight ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.daynight}
          <div class="section-body">
            <label class="row"><span>Visible</span>
              <input type="checkbox" bind:checked={$clockSettings.showDayNightRim} /></label>
            <label class="row"><span>Show Hour Hand</span>
              <input type="checkbox" bind:checked={$clockSettings.showDayNightHand} /></label>
            <label class="row"><span>Ring Width <em>{$clockSettings.rimWidth}px</em></span>
              <input type="range" min="6" max="30" step="1" bind:value={$clockSettings.rimWidth} /></label>

            <p class="sub-head">Day Arc</p>
            <label class="row"><span>Color</span>
              <input type="color" bind:value={$clockSettings.dayColor} /></label>
            <label class="row">
              <span>Opacity <em>{Math.round($clockSettings.dayOpacity * 100)}%</em></span>
              <input type="range" min="0" max="1" step="0.01" bind:value={$clockSettings.dayOpacity} />
            </label>

            <p class="sub-head">Night Arc</p>
            <label class="row"><span>Color</span>
              <input type="color" bind:value={$clockSettings.nightColor} /></label>
            <label class="row">
              <span>Opacity <em>{Math.round($clockSettings.nightOpacity * 100)}%</em></span>
              <input type="range" min="0" max="1" step="0.01" bind:value={$clockSettings.nightOpacity} />
            </label>

            <p class="sub-head">Sunrise / Sunset Dots</p>
            <label class="row"><span>Visible</span>
              <input type="checkbox" bind:checked={$clockSettings.showSunriseSunsetDots} /></label>
            <label class="row"><span>Sunrise Color</span>
              <input type="color" bind:value={$clockSettings.sunriseColor} /></label>
            <label class="row"><span>Sunset Color</span>
              <input type="color" bind:value={$clockSettings.sunsetColor} /></label>
          </div>
        {/if}
      </div>

      <!-- WEATHER -->
      <div class="section">
        <button class="section-head" onclick={() => toggle('weather')}>
          <span>Weather Ring</span><span class="caret">{collapsed.weather ? '▸' : '▾'}</span>
        </button>
        {#if !collapsed.weather}
          <div class="section-body">
            <label class="row"><span>Show Ring</span>
              <input type="checkbox" bind:checked={$clockSettings.showWeatherRing} /></label>
            <label class="row"><span>Show Emoji</span>
              <input type="checkbox" bind:checked={$clockSettings.showWeatherEmoji} /></label>
            <label class="row"><span>Show Hour Hand</span>
              <input type="checkbox" bind:checked={$clockSettings.showWeatherHand} /></label>
          </div>
        {/if}
      </div>

      <!-- CUSTOM RANGES -->
      <div class="section">
        <div class="section-head" style="cursor:default">
          <span>Custom Ranges</span>
        </div>
        <div class="section-body">
          <label class="row"><span>Visible</span>
            <input type="checkbox" bind:checked={$clockSettings.showCustomRanges} /></label>
        </div>
      </div>

    </div><!-- /panel-body -->
  </div><!-- /panel -->

  <!-- Tab button — always visible at left edge when collapsed -->
  <button class="tab" onclick={() => open = !open} title={open ? 'Close settings' : 'Open settings'}>
    {open ? '✕' : '⚙'}
  </button>
</div>

<style>
  .panel-wrap {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 280px;
    transform: translateX(-280px);
    transition: transform 0.25s ease;
    z-index: 999;
    display: flex;
  }

  .panel-wrap.open {
    transform: translateX(0);
  }

  .panel {
    width: 280px;
    height: 100%;
    background: #0d1117;
    border-right: 1px solid #1e2a3a;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #1e2a3a;
    flex-shrink: 0;
  }

  .panel-title {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #64748b;
  }

  .reset-btn {
    background: none;
    border: 1px solid #1e2a3a;
    color: #64748b;
    cursor: pointer;
    border-radius: 4px;
    width: 26px;
    height: 26px;
    font-size: 1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, border-color 0.15s;
  }
  .reset-btn:hover { color: #f87171; border-color: #f87171; }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #1e2a3a transparent;
  }

  .section {
    border-bottom: 1px solid #1e2a3a;
  }

  .section-head {
    width: 100%;
    background: none;
    border: none;
    color: #94a3b8;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    text-align: left;
  }
  .section-head:hover { color: #e2e8f0; }

  .caret { font-size: 0.65rem; }

  .section-body {
    padding: 4px 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sub-head {
    margin: 6px 0 2px;
    font-family: 'Courier New', monospace;
    font-size: 0.62rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #475569;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-family: 'Courier New', monospace;
    font-size: 0.72rem;
    color: #64748b;
  }

  .row span {
    flex: 1;
    white-space: nowrap;
  }

  .row em {
    font-style: normal;
    color: #94a3b8;
    margin-left: 4px;
  }

  .row input[type="range"] {
    width: 100px;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .row input[type="color"] {
    width: 36px;
    height: 24px;
    border: 1px solid #1e2a3a;
    border-radius: 4px;
    padding: 2px;
    background: #181e2e;
    cursor: pointer;
  }

  .row input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .row select {
    background: #181e2e;
    border: 1px solid #1e2a3a;
    color: #94a3b8;
    font-family: inherit;
    font-size: 0.72rem;
    padding: 3px 6px;
    border-radius: 4px;
    cursor: pointer;
    width: 140px;
  }

  /* Palette grid */
  .palette-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 4px;
  }

  .palette-card-wrap {
    position: relative;
  }

  .palette-card {
    width: 100%;
    background: none;
    border: 1px solid #1e2a3a;
    border-radius: 6px;
    padding: 6px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    transition: border-color 0.15s;
  }
  .palette-card:hover { border-color: #3b82f6; }
  .palette-card.active { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }

  .palette-preview {
    width: 100%;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .pdot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .palette-label {
    font-family: 'Courier New', monospace;
    font-size: 0.65rem;
    color: #64748b;
    letter-spacing: 1px;
  }

  .del-palette {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1e2a3a;
    border: 1px solid #334155;
    color: #64748b;
    font-size: 0.65rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .del-palette:hover { background: #7f1d1d; color: #fca5a5; border-color: #7f1d1d; }

  .add-palette-btn {
    width: 100%;
    background: none;
    border: 1px dashed #1e2a3a;
    border-radius: 6px;
    color: #475569;
    font-family: 'Courier New', monospace;
    font-size: 0.68rem;
    letter-spacing: 1px;
    padding: 7px;
    cursor: pointer;
    margin-top: 4px;
    transition: border-color 0.15s, color 0.15s;
  }
  .add-palette-btn:hover { border-color: #3b82f6; color: #94a3b8; }

  .save-row {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-top: 4px;
  }

  .save-input {
    flex: 1;
    background: #181e2e;
    border: 1px solid #1e2a3a;
    border-radius: 4px;
    color: #94a3b8;
    font-family: 'Courier New', monospace;
    font-size: 0.72rem;
    padding: 4px 8px;
  }
  .save-input:focus { outline: none; border-color: #3b82f6; }

  .save-confirm {
    background: #1e3a5f;
    border: 1px solid #2563eb;
    border-radius: 4px;
    color: #93c5fd;
    font-family: 'Courier New', monospace;
    font-size: 0.68rem;
    padding: 4px 8px;
    cursor: pointer;
  }
  .save-confirm:hover { background: #2563eb; }

  .save-cancel {
    background: none;
    border: 1px solid #1e2a3a;
    border-radius: 4px;
    color: #475569;
    font-size: 0.75rem;
    padding: 4px 7px;
    cursor: pointer;
  }
  .save-cancel:hover { color: #f87171; border-color: #7f1d1d; }

  /* Tab button — sticks out to the right of the panel */
  .tab {
    position: absolute;
    left: 280px;
    top: 16px;
    width: 36px;
    height: 36px;
    background: #0d1117;
    border: 1px solid #1e2a3a;
    border-left: none;
    border-radius: 0 6px 6px 0;
    color: #64748b;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
  }
  .tab:hover { color: #e2e8f0; background: #1e2a3a; }
</style>
