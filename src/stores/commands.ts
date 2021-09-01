import { writable } from 'svelte/store'
import { Command } from 'interfaces/entities/command'

export interface State {
  isLoading: boolean;
  isError: boolean;
  data: Command[];
  error: string;
}

export const commands = writable<State>({
  isLoading: false,
  isError: false,
  data: [],
  error: '',
});
