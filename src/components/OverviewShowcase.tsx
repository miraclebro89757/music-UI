import React from 'react';
import { SongItem, DanmakuMessage } from '../types';
import { PlayerView } from './PlayerView';
import { LiveDanmakuView } from './LiveDanmakuView';
import { PlaylistView } from './PlaylistView';
import { DanmakuModal } from './DanmakuModal';

interface OverviewShowcaseProps {
  currentSong: SongItem;
  songs: SongItem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLiked: boolean;
  danmakus: DanmakuMessage[];
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onToggleLike: () => void;
  onSeek: (seconds: number) => void;
  onSelectSong: (song: SongItem) => void;
  onSendDanmaku: (text: string) => void;
  onSwitchToMobilePhone: (tab: 'player' | 'live' | 'playlist') => void;
  onAddSong?: () => void;
  onOpenEdit?: () => void;
  onEditSong?: (song: SongItem) => void;
}

export const OverviewShowcase: React.FC<OverviewShowcaseProps> = ({
  currentSong,
  songs,
  isPlaying,
  currentTime,
  duration,
  isLiked,
  danmakus,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onToggleLike,
  onSeek,
  onSelectSong,
  onSendDanmaku,
  onSwitchToMobilePhone,
  onAddSong,
  onOpenEdit,
  onEditSong,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* 3-Column Grid Matching the Reference Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start justify-center">
        {/* Column 1: Player Screen */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[340px] h-[680px] rounded-[38px] p-2.5 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-black/60 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(168,85,247,0.15)] ring-1 ring-white/15 backdrop-blur-3xl">
            <div className="w-full h-full rounded-[30px] overflow-hidden relative">
              <PlayerView
                currentSong={currentSong}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                isLiked={isLiked}
                onTogglePlay={onTogglePlay}
                onPrevTrack={onPrevTrack}
                onNextTrack={onNextTrack}
                onToggleLike={onToggleLike}
                onSeek={onSeek}
                onGoToLive={() => onSwitchToMobilePhone('live')}
                onOpenPlaylist={() => onSwitchToMobilePhone('playlist')}
                onOpenEdit={onOpenEdit}
              />
            </div>
          </div>
          <p className="text-xs text-white/50 mt-3 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>主播放器 · 轮播相册与现场手账</span>
          </p>
        </div>

        {/* Column 2: Live Stage & Danmaku Screen */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[340px] h-[680px] rounded-[38px] p-2.5 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-black/60 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(168,85,247,0.15)] ring-1 ring-white/15 backdrop-blur-3xl">
            <div className="w-full h-full rounded-[30px] overflow-hidden relative">
              <LiveDanmakuView
                currentSong={currentSong}
                danmakus={danmakus}
                onBack={() => onSwitchToMobilePhone('player')}
                onSendDanmaku={onSendDanmaku}
                onOpenDanmakuModal={() => {}}
              />
            </div>
          </div>
          <p className="text-xs text-white/50 mt-3 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>现场声场 · 实时弹幕互动</span>
          </p>
        </div>

        {/* Column 3: Stacked Playlist & Danmaku Composer */}
        <div className="flex flex-col items-center space-y-6 w-full max-w-[340px] mx-auto">
          {/* Card 1: 我的歌单 (Playlist) */}
          <div className="w-full">
            <PlaylistView
              songs={songs}
              currentSongId={currentSong.id}
              isPlaying={isPlaying}
              onSelectSong={onSelectSong}
              onTogglePlay={onTogglePlay}
              onAddSong={onAddSong}
              onEditSong={onEditSong}
            />
            <p className="text-xs text-white/50 mt-2 font-medium flex items-center gap-1.5 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>现场歌单列表 (支持逐曲编辑)</span>
            </p>
          </div>

          {/* Card 2: 弹幕交互弹窗 (Danmaku Modal Inline) */}
          <div className="w-full">
            <DanmakuModal
              isOpen={true}
              isInline={true}
              onClose={() => {}}
              onSend={onSendDanmaku}
            />
            <p className="text-xs text-white/50 mt-2 font-medium flex items-center gap-1.5 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>弹幕输入与交互浮窗</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
