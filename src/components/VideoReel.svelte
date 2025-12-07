<script>
  import { onMount } from 'svelte';

  export let sources = [
    '/src/videos/video1.mp4',
    '/src/videos/video2.mp4',
    '/src/videos/video3.mp4',
    '/src/videos/video4.mp4',
    '/src/videos/video5.mp4'
  ];

  let currentIndex = 0;
  let videoEl;

  function next() {
    currentIndex = (currentIndex + 1) % sources.length;
    if (videoEl) {
      videoEl.src = sources[currentIndex];
      videoEl.muted = true;
      videoEl.play();
    }
  }

  onMount(() => {
    if (videoEl) {
      videoEl.src = sources[currentIndex];
      videoEl.muted = true;
      videoEl.play();
    }
  });
</script>

<div class="wrap">
  <video
    bind:this={videoEl}
    src={sources[currentIndex]}
    on:ended={next}
    playsinline
    autoplay
    muted
    controls
  />
</div>

<style>
  .wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
  }

  video {
    width: 100%;
    height: auto;
    max-height: 100vh;
    background: black;
  }
</style>

