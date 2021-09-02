import { writable } from 'svelte/store'
import { Command } from 'interfaces/entities/command'

export interface State {
  isInitialized: boolean;
  isLoading: boolean;
  isError: boolean;
  data: Command[];
  error: string;
}

export const commands = writable<State>({
  isInitialized: false,
  isLoading: false,
  isError: false,
  data: [],
  error: '',
});
