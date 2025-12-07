<script>
  import { createEventDispatcher } from 'svelte';
  import { theme } from '../stores/theme.js';

  const profile = {
    username: '@knowSeeker',
    name: 'Majed Bashir',
    email: 'majed@example.com'
  };

  const dispatch = createEventDispatcher();

  
</script>

<section class="profile">
  <header class="top-bar">
    <div class="username">
      <span>{profile.username}</span>
      <button aria-label="Edit username">
        <svg viewBox="0 0 24 24">
          <path
            d="M6 15.5v2.5h2.5l8-8a1.8 1.8 0 0 0-2.5-2.5z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="m15 7 2 2"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
    <div class="top-actions">
      <button
        class="icon-btn activity"
        aria-label="Open activity"
        type="button"
        on:click={() => dispatch('navigate', { id: 'activity' })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h4l2.5-6 5 12 2.5-6H21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        class="icon-btn settings"
        aria-label="Open settings"
        type="button"
        on:click={() => dispatch('navigate', { id: 'settings' })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7m7.5 3.5a2.1 2.1 0 0 0-.05-.42l2.14-1.67-2-3.46-2.6.56a2 2 0 0 0-.72-.42l-.39-2.64H8.12l-.39 2.64a2 2 0 0 0-.72.42l-2.6-.56-2 3.46 2.14 1.67a2 2 0 0 0 0 .84L2.41 14.6l2 3.46 2.6-.56a2 2 0 0 0 .72.42l.39 2.64h5.56l.39-2.64a2 2 0 0 0 .72-.42l2.6.56 2-3.46-2.14-1.67a2.1 2.1 0 0 0 .05-.42"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </header>

  <div class="card highlight">
    <div class="info">
      <h1 contenteditable="true">{profile.name}</h1>
      <p contenteditable="true">{profile.email}</p>
    </div>
  </div>

  <div class="details">
    <div>
      <span class="label">Name</span>
      <span class="value">{profile.name}</span>
    </div>
    <div>
      <span class="label">Username</span>
      <span class="value">{profile.username}</span>
    </div>
    <div>
      <span class="label">Email</span>
      <span class="value">{profile.email}</span>
    </div>
  </div>


  

  <div class="card contributor">
    <div>
      <h2>Become a Contributor</h2>
      <p>Share authentic reels and notes with the community.</p>
    </div>
    <button aria-label="Apply to become a contributor">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M3 12h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      Apply
    </button>
  </div>
</section>

<style>
  .profile {
    padding-bottom: 5.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .top-bar {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .top-actions {
    display: flex;
    gap: 0.4rem;
  }

  .username {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .username button {
    border: none;
    background: var(--accent-soft);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
  }

  .username svg {
    width: 16px;
    height: 16px;
  }

  .icon-btn {
    border: none;
    background: var(--accent-soft);
    color: var(--accent);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .icon-btn.active {
    background: var(--accent);
    color: #f1fbf6;
  }
  .icon-btn svg { width: 18px; height: 18px; }

  .card {
    background: transparent;
    border-radius: 24px;
    padding: 0;
    box-shadow: none;
    border: none;
  }

  .highlight {
    display: block;
    padding: 0.25rem 0.15rem;
  }

  /* avatar removed per request */

  .avatar svg {
    width: 40px;
    height: 40px;
  }

  .info h1 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  .info p {
    margin: 0.4rem 0 0;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.5rem 0 0.6rem;
  }

  .details div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 600;
  }

  .value {
    font-size: 0.88rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .settings-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem 1.1rem;
    border-radius: 20px;
    background: var(--surface);
    border: 1px solid var(--stroke);
  }

  .segmented {
    display: inline-flex;
    gap: 0.5rem;
    background: var(--surface-elevated);
    border: 1px solid var(--stroke);
    padding: 0.25rem 0.35rem;
    border-radius: 999px;
  }
  .segmented label {
    font-size: 0.78rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    cursor: pointer;
  }
  .segmented input { display: none; }

  .activity-panel {
    padding: 1.2rem 1.1rem;
    border-radius: 20px;
    background: var(--surface);
    border: 1px solid var(--stroke);
  }
  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.6rem;
  }
  .panel-header h2 { margin: 0; font-size: 1rem; }
  .back-btn {
    width: 36px; height: 36px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--surface-elevated);
    color: var(--text-primary);
    border: 1px solid var(--stroke);
  }
  .back-btn svg { width: 18px; height: 18px; }
  .activity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .activity-box {
    background: var(--surface-elevated);
    border: 1px solid var(--stroke);
    border-radius: 16px;
    padding: 0.8rem;
  }
  .activity-box h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
  }
  .thumbs.empty { color: var(--text-muted); font-size: 0.85rem; }

  .settings-panel h2 {
    margin: 0;
    font-size: 0.98rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .setting-title {
    display: block;
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .setting-subtitle {
    display: block;
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }

  /* simplified settings styling retained */

  .contributor {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    background: var(--accent-soft);
    border-radius: 20px;
    padding: 1.1rem 1.2rem;
  }

  .contributor h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .contributor p {
    margin: 0.45rem 0 0;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .contributor button {
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #ffffff;
    padding: 0.7rem 1.1rem;
    border-radius: 14px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(22, 163, 74, 0.35);
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  }
  .contributor button:hover { filter: brightness(1.05); }
  .contributor button:active { transform: translateY(1px) scale(0.99); }
</style>
