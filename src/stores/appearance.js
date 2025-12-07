import { writable } from 'svelte/store';

export const appearance = writable({
  holdEnabled: false,
  defaultMode: 'watch',
  currentMode: 'watch'
});
