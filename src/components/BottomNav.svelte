<script>
  import { createEventDispatcher } from 'svelte';

  export let active = 'home';

  const dispatch = createEventDispatcher();

  const items = [
    { id: 'home', label: 'Home', type: 'default' },
    { id: 'search', label: 'Search', type: 'search' },
    { id: 'profile', label: 'Profile', type: 'default' }
  ];

  const handleClick = (id) => {
    dispatch('navigate', { id });
  };
</script>

<nav class="bottom-nav">
  {#each items as item}
    <button
      class:active={item.id === active}
      on:click={() => handleClick(item.id)}
      aria-label={`Go to ${item.label}`}
      type="button"
    >
      {#if item.id === 'home'}
        <span class="icon-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 20v-4c0-3.9 2.7-7 6-7s6 3.1 6 7v4H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 6.5v-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M5 20h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
      {:else if item.id === 'search'}
        <span class="icon-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path d="m15.5 15.5 3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
      {:else}
        <span class="icon-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="8"
              r="4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M6 19.5c1.2-3 3.6-4.5 6-4.5s4.8 1.5 6 4.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </span>
      {/if}
    </button>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between; /* fixed positions per slot */
    align-items: center;
    gap: 0;
    padding: 0.65rem 1rem calc(env(safe-area-inset-bottom) + 0.75rem);
    min-height: 64px;
    background: var(--bg);
    border-top: 1px solid var(--stroke);
    z-index: 10;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    padding: 0.6rem 0.5rem;
    color: var(--icon);
    transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
    position: relative;
    flex: 1 1 0;          /* equal widths so spacing doesn't shift */
    min-width: 0;         /* avoid overflow creeping */
    line-height: 0;       /* avoid baseline/text affecting centering */
    box-sizing: border-box;
  }

  button.active {
    /* Removed translateY to avoid position shift when toggling */
    color: var(--active-icon);
  }

  svg {
    width: 26px;
    height: 26px;
    transition: stroke 0.2s ease, fill 0.2s ease;
    position: relative;
    z-index: 1;
    display: block;        /* remove baseline alignment jitter */
    margin: 0 auto;        /* ensure centered within flex cell */
  }

  .icon-wrap {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* active circle */
  button.active::before {
    content: '';
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--active-circle-bg);
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
  /* Dark mode relies on root variables from app.css */
</style>
