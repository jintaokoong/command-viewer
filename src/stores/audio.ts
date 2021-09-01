import { writable } from 'svelte/store'

export const audios = writable<string[]>([]);
