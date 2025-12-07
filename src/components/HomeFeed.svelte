<script>
import { createEventDispatcher, onDestroy } from 'svelte';

  // Import MP4 assets so Vite serves them correctly
  import v1 from '../videos/video1.mp4';
  import v2 from '../videos/video2.mp4';
  import v3 from '../videos/video3.mp4';

  import weekOneThumb from '../images/week-one-video.png';
  let longQuery = '';

  const videos = [
    { id: 1, caption: 'Be thankful = Get More', src: v1 },
    { id: 2, caption: "Never forget that you're blessed", src: v2 },
    { id: 3, caption: 'Remembrance of Allah', src: v3 }
  ];

  const dispatch = createEventDispatcher();
  let liked = new Set();
  let shareOpenFor = null; // id of reel with share sheet open
  let menuOpenFor = null; // id of reel with 3-dots open
  // horizontal navigation is native scroll-snap

  const toggleValue = (collection, id) => {
    const next = new Set(collection);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  };

  const toggleLike = (id) => {
    liked = toggleValue(liked, id);
  };

  const likeVideo = (id) => {
    if (!liked.has(id)) {
      const next = new Set(liked);
      next.add(id);
      liked = next;
    }
  };

  const isLiked = (id) => liked.has(id);
  const openShare = (id) => { shareOpenFor = id; };
  const closeShare = () => { shareOpenFor = null; };

  // video play/pause + error handling
  let errorVideos = new Set();
  const markVideoError = (id) => {
    const next = new Set(errorVideos);
    next.add(id);
    errorVideos = next;
  };

  // Per-video mute state: odd index unmuted, even index muted
  const unmutedIdsInit = new Set([1, 3]);
  let unmutedIds = unmutedIdsInit;
  const isMuted = (id) => !unmutedIds.has(id);
  const toggleMute = (id) => {
    const next = new Set(unmutedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    unmutedIds = next;
  };

  // Long-press to pause; click to mute/unmute; double-click to like
  const LONG_PRESS_MS = 300;
  const longPressTimers = new Map(); // id -> timer
  const longPressActiveIds = new Set();
  const suppressNextClickIds = new Set();

  const onPointerDown = (e, id) => {
    const vid = e.currentTarget.querySelector('video');
    if (!vid) return;
    // start long press timer
    const t = setTimeout(() => {
      longPressActiveIds.add(id);
      pauseVideo(vid);
    }, LONG_PRESS_MS);
    longPressTimers.set(id, t);
  };
  const clearLongPress = (id) => {
    const t = longPressTimers.get(id);
    if (t) {
      clearTimeout(t);
      longPressTimers.delete(id);
    }
  };
  const onPointerEnd = (e, id) => {
    const vid = e.currentTarget.querySelector('video');
    clearLongPress(id);
    if (longPressActiveIds.has(id)) {
      if (vid) playVideo(vid);
      longPressActiveIds.delete(id);
      // prevent the ensuing click from toggling mute
      suppressNextClickIds.add(id);
      setTimeout(() => suppressNextClickIds.delete(id), 250);
    }
  };

  // Click to toggle mute instantly; dblclick still likes
  const onClickToggleMute = (e, id) => {
    if (suppressNextClickIds.has(id) || longPressActiveIds.has(id)) return;
    toggleMute(id);
    const vid = e.currentTarget.querySelector('video');
    if (vid) vid.muted = isMuted(id);
  };
  const onDoubleClick = (id) => {
    likeVideo(id);
  };

  // Auto play/pause videos as they enter/leave view
  const playVideo = (vid) => {
    if (!vid || !vid.isConnected) return;
    if (vid.paused) {
      const p = vid.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  };
  const pauseVideo = (vid) => {
    if (!vid || !vid.isConnected) return;
    try { vid.pause(); } catch {}
  };
  const autoPlayOnView = (node, id) => {
    // Create an observer scoped to the nearest vertical scroll container
    const rootEl = node.closest('.pane-main') || null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (entry.intersectionRatio >= 0.4) {
            playVideo(vid);
          } else {
            pauseVideo(vid);
            try { vid.currentTime = 0; } catch {}
          }
        });
      },
      { root: rootEl, threshold: [0, 0.4, 0.8] }
    );
    observer.observe(node);
    // kickstart on mount safely
    requestAnimationFrame(() => playVideo(node));
    return {
      destroy() {
        observer.unobserve(node);
        observer.disconnect();
      }
    };
  };
  onDestroy(() => {
    longPressTimers.forEach((t) => clearTimeout(t));
    longPressTimers.clear();
    longPressActiveIds.clear();
    suppressNextClickIds.clear();
  });

  // no JS for horizontal nav needed; CSS scroll-snap handles paging
</script>

<section class="home">
  <div class="pane-track" aria-label="Swipe between Reels and Long Videos">
    <div class="pane pane-main" aria-label="Reels">
      <div class="feed reels">
        {#each videos as video}
          <article class="reel-card">
            <div class="reel-top">
              <button class="report" aria-label="More options" on:click={() => (menuOpenFor = menuOpenFor === video.id ? null : video.id)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="5" r="1.6" fill="var(--icon)" />
                  <circle cx="12" cy="12" r="1.6" fill="var(--icon)" />
                  <circle cx="12" cy="19" r="1.6" fill="var(--icon)" />
                </svg>
              </button>
            </div>
            {#if menuOpenFor === video.id}
              <div class="menu-backdrop" on:click={() => (menuOpenFor = null)} />
              <div class="more-menu" role="menu" aria-label="More options">
                <button class="menu-item" role="menuitem" on:click={() => (menuOpenFor = null)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6h12v2H6zm0 5h12v2H6zm0 5h12v2H6z" fill="currentColor" opacity="0"/>
                  </svg>
                  Report
                </button>
              </div>
            {/if}
            <div
              class="video-preview"
              on:pointerdown={(e) => onPointerDown(e, video.id)}
              on:pointerup={(e) => onPointerEnd(e, video.id)}
              on:pointercancel={(e) => onPointerEnd(e, video.id)}
              on:pointerleave={(e) => onPointerEnd(e, video.id)}
              on:click={(e) => onClickToggleMute(e, video.id)}
              on:dblclick={() => onDoubleClick(video.id)}
            >
              <video
                use:autoPlayOnView={video.id}
                muted={isMuted(video.id)}
                playsinline
                autoplay
                loop
                preload="auto"
                on:error={() => markVideoError(video.id)}
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <div class="video-gradient" />
              {#if errorVideos.has(video.id)}
                <div class="video-fallback">Video unavailable</div>
              {/if}
            </div>
            <div class="meta">
              <h2>{video.caption}</h2>
            </div>
            <footer class="actions">
              <div class="primary-actions">
                <button
                  class="like-btn"
                  aria-pressed={isLiked(video.id)}
                  on:click={() => toggleLike(video.id)}
                  aria-label="Like reel"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <!-- Heart icon: filled when liked, outlined when not -->
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.76 0 3.26.81 4.02 2.09C11.28 4.81 12.78 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={isLiked(video.id) ? 'var(--like-fill)' : 'none'}
                      stroke={isLiked(video.id) ? 'var(--like-fill)' : 'var(--text-muted)'}
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button aria-label="Download reel">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 4v10m0 0 3.5-3.5M12 14 8.5 10.5"
                      fill="none"
                      stroke="var(--text-muted)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 15.5v2a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 17.5v-2"
                      fill="none"
                      stroke="var(--text-muted)"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
              <button on:click={() => openShare(video.id)} aria-label="Share options">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 21V3l21 9-21 9v-7l15-2-15-2Z" fill="none" stroke="var(--text-muted)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </footer>

            {#if shareOpenFor === video.id}
              <div class="share-backdrop" on:click={closeShare} />
              <div class="share-sheet" role="dialog" aria-label="Share options">
                <div class="sheet-inner">
                  <div class="share-row">
                  <button class="share-icon" aria-label="Share via WhatsApp">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <!-- chat bubble with three dots -->
                      <path d="M4 6h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-7l-4 3v-3H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" />
                      <circle cx="9" cy="11" r="1" fill="currentColor" />
                      <circle cx="12" cy="11" r="1" fill="currentColor" />
                      <circle cx="15" cy="11" r="1" fill="currentColor" />
                    </svg>
                  </button>
                  <button class="share-icon" aria-label="Share via Messages">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <!-- simple chat bubble with lines -->
                      <path d="M4 5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" />
                      <path d="M7.5 10h9M7.5 12.5h6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
                    </svg>
                  </button>
                  <button class="share-icon" aria-label="Bookmark">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button class="share-icon" aria-label="Copy link">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M10 13a4 4 0 0 1 0-5.7l1.6-1.6a4 4 0 1 1 5.7 5.7l-1.1 1.1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
                      <path d="M14 11a4 4 0 0 1 0 5.7l-1.6 1.6a4 4 0 1 1-5.7-5.7l1.1-1.1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
                    </svg>
                  </button>
                  </div>
                </div>
              </div>
            {/if}
          </article>
        {/each}
      </div>
    </div>
            <aside class="pane pane-long" aria-label="Long videos">
      <div class="long-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--text-muted)" stroke-width="1.6" />
          <path d="m15.5 15.5 3.5 3.5" fill="none" stroke="var(--text-muted)" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <input type="text" bind:value={longQuery} placeholder="Search long videos" />
      </div>
      <ul class="long-list">
        <li>
          <img class="thumb" src={weekOneThumb} alt="The Divine Book Club | Week 1 (al-Fatihah, al-Baqarah) thumbnail" />
          <div class="info">
            <h3>The Divine Book Club | Week 1 (al-Fatihah, al-Baqarah)</h3>
            <p>Quran Reflect</p>
          </div>
        </li>
        <li>
          <div class="thumb"></div>
          <div class="info">
            <h3>Qur'an Reflections: Surah Yasin</h3>
            <p>18:20 • 21k views</p>
          </div>
        </li>
        <li>
          <div class="thumb"></div>
          <div class="info">
            <h3>Fiqh Series: Purification</h3>
            <p>24:02 • 8.2k views</p>
          </div>
        </li>
      </ul>
    </aside> </div>
</section>

<style>
  .home {
    display: flex;
    flex-direction: column;
  }

  /* swipe + panes */
  .pane-track {
    display: flex;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory; /* stronger snap between panes */
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    background: var(--bg);
    /* hide horizontal scrollbar */
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none; /* Firefox */
  }
  .pane-track::-webkit-scrollbar { display: none; }
  .pane {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-width: 100%;
  }
  .pane-main,
  .pane-long {
    height: calc(100dvh - var(--main-pad-top) - var(--main-pad-bottom));
    overflow-y: auto;
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none; /* Firefox */
  }
  .pane-main::-webkit-scrollbar,
  .pane-long::-webkit-scrollbar { display: none; }
  .pane-main {
    overscroll-behavior-y: contain;
    touch-action: pan-y pan-x; /* allow both directions; let pane-track handle horizontal */
    /* match container height precisely to visible area (main padding vars from App.svelte) */
    height: calc(100dvh - var(--main-pad-top) - var(--main-pad-bottom));
    scroll-snap-type: y mandatory;
    scroll-snap-stop: always;
    scroll-padding-top: 0;
    scroll-padding-bottom: 0;
  }
  .pane-long { touch-action: pan-y pan-x; }
.pane-long header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;
  }
  .pane-long h2 {
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary);
  }
  .pane-long .close {
    border: none;
    background: none;
    color: var(--text-primary);
    font-size: 1.4rem;
    line-height: 1;
  }
  .long-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .long-list li {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 0.7rem;
    align-items: center;
  }
.long-list .info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    color: var(--text-primary);
  }
  .long-list .info p {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .feed {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* vertical per-reel snapping: each card fills container */
  .reels { height: 100%; }

  .reels > .reel-card {
    scroll-snap-align: start;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .reel-card {
    gap: 0.65rem;
    position: relative;
  }
  .reel-card > .meta,
  .reel-card > .actions { width: min(100%, 420px); }

  .topic-chip {
    position: absolute;
    top: 1rem;
    left: 1rem;
    align-self: flex-start;
    padding: 0.25rem 0.72rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
  }

  .video-preview {
    position: relative;
    width: min(100%, 420px);
    border-radius: 22px;
    overflow: hidden;
    background: var(--surface);
    box-shadow: 0 24px 54px rgba(0, 0, 0, 0.26);
    aspect-ratio: 9 / 16; /* 1080 x 1920 */
  }
  .video-preview video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .reel-top {
    width: min(100%, 420px);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 0.25rem;
    position: relative;
  }
  .report {
    border: none;
    background: transparent;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .report svg { width: 18px; height: 18px; }

  .video-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0));
    pointer-events: none;
  }

  .video-fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--text-primary);
    background: var(--surface);
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .duration {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    padding: 0.28rem 0.6rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.4);
    color: #f2f8f4;
    font-size: 0.68rem;
    font-weight: 600;
  }

  .meta h2 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .meta p {
    margin: 0.35rem 0 0;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.2rem;
  }

  .primary-actions {
    display: inline-flex;
    gap: 0.85rem;
  }

  .actions button {
    border: none;
    background: none;
    padding: 0;
    display: inline-flex;
    border-radius: 999px;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .actions button:active {
    transform: scale(0.96);
  }

  .actions button.active {
    background: var(--accent-soft);
  }

  svg {
    width: 28px;
    height: 28px;
  }
  /* make like/download icons slightly smaller */
  .primary-actions svg { width: 28px; height: 28px; }
  /* make like icon slightly larger than download */
  .like-btn svg { width: 32px; height: 32px; }

  /* reduce send icon size a bit */
  .actions > button svg { width: 26px; height: 26px; }

  /* Share sheet */
  .share-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 29;
  }
  .share-sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--surface-elevated);
    border-top: 1px solid var(--stroke);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 0.8rem 1rem calc(env(safe-area-inset-bottom) + 1rem);
    box-shadow: 0 -16px 40px var(--shadow-soft);
    z-index: 30;
  }
  .sheet-inner {
    margin: 0 auto;
    width: min(520px, 100%);
  }
  .share-row {
    display: flex;
    gap: 0.75rem;
    justify-content: space-around;
  }
  .share-icon {
    border: none;
    background: transparent;
    color: var(--text-primary);
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
  }
  .share-icon:hover { background: var(--accent-soft); }
  .share-icon svg { width: 28px; height: 28px; }

  /* More (3-dots) dropdown */
  .menu-backdrop {
    position: fixed;
    inset: 0;
    background: transparent;
    z-index: 25;
  }
  .more-menu {
    position: absolute;
    top: calc(var(--main-pad-top));
    right: 0;
    background: var(--surface-elevated);
    border: 1px solid var(--stroke);
    border-radius: 12px;
    box-shadow: 0 8px 28px var(--shadow-soft);
    padding: 0.25rem;
    z-index: 26;
    width: 160px;
  }
  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.6rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.9rem;
    border-radius: 8px;
  }
  .menu-item:hover { background: var(--surface); }

  /* Remove left border line in Long videos pane */
.long-search { display:flex; align-items:center; gap:0.6rem; padding: 0.65rem 0.8rem; border:1px solid var(--stroke); background: var(--surface-elevated); border-radius: 14px; margin: 0 0 0.8rem 0; }
  .long-search svg { width:20px; height:20px; }
  .long-search input { border:none; background:transparent; color:var(--text-primary); font-size:0.92rem; flex:1; }
  .long-search input:focus { outline:none; }
  .long-list .thumb {
    background: var(--surface);
    border: 1px solid var(--stroke);
    border-radius: 12px;
    aspect-ratio: 16 / 9;
  }
  img.thumb {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid var(--stroke);
    display: block;
  }

  .pane-long { border-left: none; padding-left: 0; }
</style>
