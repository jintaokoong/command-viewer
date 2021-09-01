export interface Bot {
  sendResponse: boolean;
  identifier: string;
}

export interface Cooldown {
  user: number;
  global: number;
  category: number;
}

export interface Quantity {
  total: number;
  current: number;
}

export interface Graphic {
  duration: number;
  type: string;
}

export interface Audio {
  volume: number;
  src: string;
}

export interface Alert {
  graphics: Graphic;
  audio: Audio;
  enabled: boolean;
}


export interface ApiCommand {
  bot: Bot;
  cooldown: Cooldown;
  quantity: Quantity;
  alert: Alert;
  subscriberOnly: boolean;
  sources: string[];
  userInput: any[];
  order: number;
  _id: string;
  enabled: boolean;
  featured: boolean;
  name: string;
  description: string;
  type: string;
  cost: number;
  allowMessages: boolean;
  categoryName: string;
  public: boolean;
  channel: string;
  createdAt: string;
  updatedAt: string;
}
