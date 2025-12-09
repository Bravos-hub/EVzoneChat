// Common types used across the application
import type React from 'react';

// Re-export theme types for convenience
export type { ThemeMode, AccentColor } from './theme';

export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}

export interface ConversationItem {
  id: string;
  name: string;
  avatar?: string;
  module: string;
  last: string;
  time: string;
  unread: number;
  typing: boolean;
  promos: PromoItem[];
}

export interface PromoItem {
  id: string;
  type: 'promo-ad' | 'live' | string;
  title: string;
  module: string;
  seen: boolean;
  live?: boolean;
  createdAt?: string;
}

export interface LiveSession {
  id: string;
  module: string;
  title: string;
  subtitle?: string;
  host: string;
  startedAt: string;
  cta: string;
}

export interface SearchResult {
  type: 'person' | 'channel' | 'group' | 'message' | 'thread';
  id: string;
  name?: string;
}

export interface NavigationProps {
  onBack?: () => void;
  onClose?: () => void;
  onNavigate?: (path: string) => void;
  onEnd?: () => void;
  location?: Location;
  onOpen?: (item: ConversationItem) => void;
  onNew?: () => void;
  onRefresh?: () => void;
  onLiveOpen?: (live: LiveSession) => void;
  onModuleChange?: (module: string) => void;
  onStart?: (selected: string[], forwardMessages?: string[]) => void;
  onOpenResult?: (result: SearchResult) => void;
  registry?: ComponentRegistry;
}

export type ComponentRegistry = Record<string, React.ComponentType<any>>;

