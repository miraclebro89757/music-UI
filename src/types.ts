export interface DanmakuMessage {
  id: string;
  user: string;
  avatarColor: string;
  badge?: string; // e.g. "👑"
  text: string;
  isSelf?: boolean;
  timeStr?: string;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  durationStr: string; // e.g. "5:12"
  venue: string;
  date: string;
  coverImg: string;
  notes?: string;
}

export type MobileTab = 'player' | 'live' | 'playlist';

// Backward compatibility types for legacy components
export interface ConcertMemory {
  venue: string;
  date: string;
  tour?: string;
  seat?: string;
  notes?: string;
  lightstickColor?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url?: string;
  isLocalFile?: boolean;
  file?: File;
  memory?: ConcertMemory;
  lyricsPreview?: string[];
}

export interface DanmakuItem {
  id: string;
  text: string;
  timestamp: number;
  isSelf?: boolean;
  color?: string;
  topPercent: number;
  duration: number;
  createdAt: number;
}
