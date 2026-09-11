import React from 'react';
import { Plus, MoreHorizontal, Pause, Play, Music, Sparkles } from 'lucide-react';
import { SongItem } from '../types';

interface PlaylistViewProps {
  songs: SongItem[];
  currentSongId: string;
  isPlaying: boolean;
  onSelectSong: (song: SongItem) => void;
  onTogglePlay: () => void;
  onAddSong?: () => void;
  className?: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  songs,
  currentSongId,
  isPlaying,
  onSelectSong,
  onTogglePlay,
  onAddSong,
  className = '',
}) => {
  return (
    <div
      className={`w-full rounded-3xl bg-[#140e22]/90 backdrop-blur-2xl border border-white/[0.08] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">我的歌单</h2>
          <p className="text-[11px] text-white/40">Concert · {songs.length}</p>
        </div>

        <button
          onClick={onAddSong}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95"
          title="添加演唱会音乐"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Songs List */}
      <div className="space-y-2.5">
        {songs.map((song) => {
          const isCurrent = song.id === currentSongId;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className={`w-full p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                isCurrent
                  ? 'bg-purple-600/20 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06]'
              }`}
            >
              {/* Left Cover & Info */}
              <div className="flex items-center space-x-3 min-w-0">
                {/* Album Art with State Overlay */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-purple-950/40">
                  <img
                    src={song.coverImg}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Playing State Overlay */}
                  {isCurrent && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay();
                      }}
                      className="absolute inset-0 bg-purple-900/60 backdrop-blur-[2px] flex items-center justify-center text-white"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </div>
                  )}
                </div>

                {/* Title & Artist */}
                <div className="min-w-0 text-left">
                  <p
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isCurrent ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* Right Duration & Menu */}
              <div className="flex items-center space-x-2 shrink-0 pl-2">
                <span className="text-xs font-mono text-white/40">
                  {song.durationStr}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
