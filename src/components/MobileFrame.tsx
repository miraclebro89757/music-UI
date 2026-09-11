import React from 'react';
import { MobileTab, SongItem, DanmakuMessage } from '../types';
import { PlayerView } from './PlayerView';
import { LiveDanmakuView } from './LiveDanmakuView';
import { PlaylistView } from './PlaylistView';
import { DanmakuModal } from './DanmakuModal';
import { Disc3, MessageSquare, ListMusic } from 'lucide-react';

interface MobileFrameProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  currentSong: SongItem;
  songs: SongItem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLiked: boolean;
  danmakus: DanmakuMessage[];
  isDanmakuModalOpen: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onToggleLike: () => void;
  onSeek: (seconds: number) => void;
  onSelectSong: (song: SongItem) => void;
  onSendDanmaku: (text: string) => void;
  onOpenDanmakuModal: () => void;
  onCloseDanmakuModal: () => void;
  onAddSong?: () => void;
  onOpenEdit?: () => void;
  onEditSong?: (song: SongItem) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  activeTab,
  onChangeTab,
  currentSong,
  songs,
  isPlaying,
  currentTime,
  duration,
  isLiked,
  danmakus,
  isDanmakuModalOpen,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onToggleLike,
  onSeek,
  onSelectSong,
  onSendDanmaku,
  onOpenDanmakuModal,
  onCloseDanmakuModal,
  onAddSong,
  onOpenEdit,
  onEditSong,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full my-auto py-2">
      {/* Mobile Device Mockup Frame */}
      <div className="relative w-full max-w-[360px] h-[740px] rounded-[44px] p-3 bg-gradient-to-b from-white/[0.14] via-white/[0.04] to-black/80 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(168,85,247,0.2)] ring-1 ring-white/15 backdrop-blur-3xl overflow-hidden flex flex-col justify-between">
        {/* Device Inner Screen */}
        <div className="relative w-full flex-1 rounded-[34px] overflow-hidden bg-[#0d0918]">
          {activeTab === 'player' && (
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
              onGoToLive={() => onChangeTab('live')}
              onOpenPlaylist={() => onChangeTab('playlist')}
              onOpenEdit={onOpenEdit}
            />
          )}

          {activeTab === 'live' && (
            <LiveDanmakuView
              currentSong={currentSong}
              danmakus={danmakus}
              onBack={() => onChangeTab('player')}
              onSendDanmaku={onSendDanmaku}
              onOpenDanmakuModal={onOpenDanmakuModal}
            />
          )}

          {activeTab === 'playlist' && (
            <div className="w-full h-full flex flex-col justify-between p-5 select-none text-white bg-[#0e0a17]/95 overflow-y-auto">
              <PlaylistView
                songs={songs}
                currentSongId={currentSong.id}
                isPlaying={isPlaying}
                onSelectSong={(s) => {
                  onSelectSong(s);
                  onChangeTab('player');
                }}
                onTogglePlay={onTogglePlay}
                onAddSong={onAddSong}
                onEditSong={onEditSong}
                className="my-auto"
              />

              {/* Back to player button */}
              <button
                onClick={() => onChangeTab('player')}
                className="w-full mt-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-medium text-white/80 transition-colors cursor-pointer"
              >
                返回当前播放
              </button>
            </div>
          )}

          {/* Danmaku Composer Modal Popup */}
          <DanmakuModal
            isOpen={isDanmakuModalOpen}
            onClose={onCloseDanmakuModal}
            onSend={onSendDanmaku}
          />
        </div>

        {/* Mobile Bottom Quick Switch Bar */}
        <div className="w-full pt-2.5 pb-1 px-4 flex items-center justify-around text-xs select-none">
          <button
            onClick={() => onChangeTab('player')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeTab === 'player'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>播放器</span>
          </button>

          <button
            onClick={() => onChangeTab('live')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>现场弹幕</span>
          </button>

          <button
            onClick={() => onChangeTab('playlist')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeTab === 'playlist'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>歌单</span>
          </button>
        </div>
      </div>
    </div>
  );
};
