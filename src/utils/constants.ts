export const EV_COLORS = {
  green: '#03cd8c',
  orange: '#f77f00',
  grey: '#a6a6a6',
  light: '#f2f2f2',
} as const;

export type EVColor = typeof EV_COLORS[keyof typeof EV_COLORS];

