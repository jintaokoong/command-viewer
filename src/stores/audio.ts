import { writable } from 'svelte/store'

export interface AudioDto {
  id: string;
  audio: HTMLAudioElement;
}

export const audios = writable<AudioDto[]>([]);
