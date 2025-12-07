<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<section class="activity">
  <header class="panel-header">
    <button class="back-btn" aria-label="Back" type="button" on:click={() => dispatch('navigate', { id: 'profile' })}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <h2>Activity</h2>
  </header>

  <div class="activity-grid">
    <div class="activity-box">
      <h3>Liked Videos</h3>
      <div class="thumbs empty">No liked videos yet</div>
    </div>
    <div class="activity-box">
      <h3>Bookmarked</h3>
      <div class="thumbs empty">No bookmarks yet</div>
    </div>
  </div>
</section>

<style>
  .activity { padding-bottom: 5.5rem; display: flex; flex-direction: column; gap: 0.8rem; }
  .panel-header { display: flex; align-items: center; gap: 0.6rem; }
  .panel-header h2 { margin: 0; font-size: 1rem; }
  .back-btn {
    width: 36px; height: 36px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--surface-elevated);
    color: var(--text-primary);
    border: 1px solid var(--stroke);
  }
  .back-btn svg { width: 18px; height: 18px; }

  .activity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .activity-box {
    background: var(--surface-elevated);
    border: 1px solid var(--stroke);
    border-radius: 16px;
    padding: 0.8rem;
  }
  .activity-box h3 { margin: 0 0 0.5rem 0; font-size: 0.95rem; }
  .thumbs.empty { color: var(--text-muted); font-size: 0.85rem; }
</style>

