import { Command } from 'interfaces/entities/command'
import { ApiCommand } from 'interfaces/api/api-command'

const transform = (from: ApiCommand): Command => {
  return {
    _id: from._id,
    name: from.name,
    description: from.description,
    enabled: from.enabled,
    identifier: from.bot.identifier,
    cooldown: {
      user: from.cooldown.user,
      global: from.cooldown.global,
    },
    cost: from.cost,
    audio: {
      volume: from.alert.audio.volume,
      src: from.alert.audio.src,
    },
    quantity: {
      total: from.quantity.total,
      current: from.quantity.current,
    },
  }
}

const transformer = {
  transform,
}

export default transformer;
