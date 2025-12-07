<script>
  let query = '';
  const contributors = [
    { id: 1, name: 'Nouman Khan', handle: '@noumankhan' },
    { id: 2, name: 'Quran.com', handle: '@qurancom' }
  ];

  $: results = contributors.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.handle.toLowerCase().includes(query.toLowerCase())
  );
</script>

<section class="search">
  <header>
    <h1>Search Contributors</h1>
  </header>

  <label class="search-field">
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--text-muted)" stroke-width="1.6" />
      <path d="m15.5 15.5 3.5 3.5" fill="none" stroke="var(--text-muted)" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <input type="text" bind:value={query} placeholder="Search by name or handle" />
  </label>

  <div class="people">
    {#each results as person}
      <button class="person" type="button" aria-label={`Open ${person.name}`}>
        <div class="avatar" aria-hidden="true">{person.name.charAt(0)}</div>
        <div class="info">
          <div class="name">{person.name}</div>
          <div class="handle">{person.handle}</div>
        </div>
      </button>
    {/each}
  </div>
</section>

<style>
  .search { padding-bottom: 5.5rem; display: flex; flex-direction: column; gap: 1.8rem; }
  header { padding: 1.2rem 0.4rem 0; }
  h1 { margin: 0; font-size: 1.26rem; font-weight: 600; color: var(--text-primary); }

  .search-field {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 1.1rem; border-radius: 18px; background: var(--surface-elevated);
    border: 1px solid var(--stroke); box-shadow: 0 14px 30px var(--shadow-soft);
  }
  .search-field svg { width: 22px; height: 22px; }
  input { border: none; flex: 1; font-size: 0.92rem; color: var(--text-primary); background: transparent; }
  input::placeholder { color: var(--text-muted); }
  input:focus { outline: none; }

  .people { display: flex; flex-direction: column; gap: 0.9rem; }
  .person {
    display: grid; grid-template-columns: auto 1fr; gap: 1rem;
    padding: 1rem 1.1rem; border-radius: 16px; background: var(--surface-elevated);
    border: 1px solid var(--stroke); text-align: left; color: var(--text-primary);
  }
  .person:active { transform: scale(0.995); }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--accent-soft); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent); }
  .info .name { font-weight: 600; }
  .info .handle { color: var(--text-muted); font-size: 0.86rem; margin-top: 0.15rem; }
</style>
