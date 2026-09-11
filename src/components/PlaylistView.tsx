import React from 'react';
import { Plus, Edit3, Pause, Play, Camera } from 'lucide-react';
import { SongItem } from '../types';

interface PlaylistViewProps {
  songs: SongItem[];
  currentSongId: string;
  isPlaying: boolean;
  onSelectSong: (song: SongItem) => void;
  onTogglePlay: () => void;
  onAddSong?: () => void;
  onEditSong?: (song: SongItem) => void;
  className?: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  songs,
  currentSongId,
  isPlaying,
  onSelectSong,
  onTogglePlay,
  onAddSong,
  onEditSong,
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
          <p className="text-[11px] text-white/40">Concert · {songs.length} 首现场音轨</p>
        </div>

        <button
          onClick={onAddSong}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95"
          title="添加演唱会音乐 (本地上传 / Wi-Fi 导入)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Songs List */}
      <div className="space-y-2.5">
        {songs.map((song) => {
          const isCurrent = song.id === currentSongId;
          const photoCount = song.images?.length || 1;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className={`w-full p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border group ${
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

                {/* Title, Artist, & Photo badge */}
                <div className="min-w-0 text-left">
                  <div className="flex items-center space-x-1.5">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isCurrent ? 'text-white' : 'text-white/90'
                      }`}
                    >
                      {song.title}
                    </p>
                    {photoCount > 1 && (
                      <span className="px-1.5 py-0.2 rounded-md bg-purple-500/20 border border-purple-500/30 text-[9px] text-purple-300 font-mono flex items-center gap-0.5 shrink-0">
                        <Camera className="w-2.5 h-2.5" />
                        {photoCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">
                    {song.artist} · <span className="text-white/40">{song.venue}</span>
                  </p>
                </div>
              </div>

              {/* Right Duration & Edit Action */}
              <div className="flex items-center space-x-2 shrink-0 pl-2">
                <span className="text-xs font-mono text-white/40">
                  {song.durationStr}
                </span>

                {onEditSong && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSong(song);
                    }}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-600/30 text-white/40 hover:text-purple-200 border border-white/[0.06] hover:border-purple-500/40 transition-colors"
                    title="编辑此曲现场信息与轮播相册"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
