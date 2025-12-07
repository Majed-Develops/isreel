<script>
  import { createEventDispatcher } from 'svelte';
  import { theme } from '../stores/theme.js';
  const dispatch = createEventDispatcher();
</script>

<section class="settings">
  <header class="heading">
    <button class="back-btn" aria-label="Back" type="button" on:click={() => dispatch('navigate', { id: 'profile' })}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <h1>Settings</h1>
  </header>

  <div class="panel">
    <div class="row">
      <div>
        <span class="title">Appearance</span>
        <span class="subtitle">Theme preference</span>
      </div>
      <div class="segmented">
        <label><input type="radio" name="theme" value="system" bind:group={$theme} on:change={() => theme.set('system')} checked={$theme==='system'}> System</label>
        <label><input type="radio" name="theme" value="light" bind:group={$theme} on:change={() => theme.set('light')} checked={$theme==='light'}> Light</label>
        <label><input type="radio" name="theme" value="dark" bind:group={$theme} on:change={() => theme.set('dark')} checked={$theme==='dark'}> Dark</label>
      </div>
    </div>
  </div>
</section>

<style>
  .settings { padding-bottom: 5.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .heading { display: flex; align-items: center; gap: 0.6rem; }
  .heading h1 { margin: 0; font-size: 1.2rem; }
  .panel {
    display: flex; flex-direction: column; gap: 1rem;
    padding: 1.2rem 1.1rem; border-radius: 20px; background: var(--surface); border: 1px solid var(--stroke);
  }
  .back-btn { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--surface-elevated); color: var(--text-primary); border: 1px solid var(--stroke); }
  .back-btn svg { width: 18px; height: 18px; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .title { display: block; font-size: 0.95rem; font-weight: 600; }
  .subtitle { display: block; margin-top: 0.25rem; font-size: 0.78rem; color: var(--text-muted); }
  .segmented { display: inline-flex; gap: 0.5rem; background: var(--surface-elevated); border: 1px solid var(--stroke); padding: 0.25rem 0.35rem; border-radius: 999px; }
  .segmented label { font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 999px; cursor: pointer; }
  .segmented input { display: none; }
</style>
