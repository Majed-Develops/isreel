<script>
  import { onDestroy } from 'svelte';
  import BottomNav from './components/BottomNav.svelte';
  import HomeFeed from './components/HomeFeed.svelte';
  import SearchView from './components/SearchView.svelte';
  import ProfileView from './components/ProfileView.svelte';
  import SettingsView from './components/SettingsView.svelte';
  import ActivityView from './components/ActivityView.svelte';

  let currentTab = 'home';

  const switchTab = (event) => {
    currentTab = event.detail.id;
  };
</script>

<div class="app">
  <main>
    {#if currentTab === 'home'}
      <HomeFeed />
    {:else if currentTab === 'search'}
      <SearchView />
    {:else if currentTab === 'settings'}
      <SettingsView on:navigate={switchTab} />
    {:else if currentTab === 'activity'}
      <ActivityView on:navigate={switchTab} />
    {:else}
      <ProfileView on:navigate={switchTab} />
    {/if}
  </main>
  <footer class="nav-wrap">
    <BottomNav
      active={currentTab}
      on:navigate={switchTab}
    />
  </footer>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text-primary);
  }

  main {
    flex: 1;
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
    /* use variables so inner panes can size precisely */
    --main-pad-top: 1.2rem;
    --main-pad-side: 1rem;
    --main-pad-bottom: 5.5rem;
    padding: var(--main-pad-top) var(--main-pad-side) var(--main-pad-bottom);
  }

  .nav-wrap {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: center;
    background: var(--bg);
  }

  .nav-wrap :global(.bottom-nav) {
    width: min(520px, 100%);
  }

  @media (max-width: 600px) {
    main {
      --main-pad-top: 1rem;
      --main-pad-side: 0.75rem;
      --main-pad-bottom: 5.5rem;
      padding: var(--main-pad-top) var(--main-pad-side) var(--main-pad-bottom);
    }
  }
</style>
