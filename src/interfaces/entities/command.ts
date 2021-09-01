import { Audio } from 'interfaces/entities/audio'
import { Cooldown } from 'interfaces/entities/cooldown'
import { Quantity } from 'interfaces/entities/quantity'

export interface Command {
  _id: string;
  name: string;
  description: string;
  enabled: boolean;
  cost: number;
  identifier: string;
  audio: Audio;
  cooldown: Cooldown;
  quantity: Quantity;
}
