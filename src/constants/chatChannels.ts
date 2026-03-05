export const CHAT_CHANNELS = [
  "E-Commerce",
  "EV Charging",
  "Rides & Logistics",
  "School & E-Learning",
  "Medical & Health Care",
  "Travel & Tourism",
  "Green Investments",
  "Faith Hub",
  "Social Networking",
  "Virtual Workspace",
  "Wallet & Payments",
  "AI Chatbot",
] as const;

export type ChatChannel = (typeof CHAT_CHANNELS)[number];

export function isValidChatChannel(module: string): module is ChatChannel {
  return CHAT_CHANNELS.includes(module as ChatChannel);
}
