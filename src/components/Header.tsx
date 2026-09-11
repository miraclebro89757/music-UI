import React from 'react';
import { Radio, MessageSquare, Ticket, ListMusic, Upload } from 'lucide-react';
import { AudioTrack } from '../types';

interface HeaderProps {
  currentTrack: AudioTrack;
  isDanmakuOpen: boolean;
  onToggleDanmaku: () => void;
  onOpenMemoryModal: () => void;
  onOpenSetlist: () => void;
  onImportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTrack,
  isDanmakuOpen,
  onToggleDanmaku,
  onOpenMemoryModal,
  onOpenSetlist,
  onImportClick,
}) => {
  return (
    <header className="relative z-30 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
      {/* Brand & Live status */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.35)]">
          <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold tracking-wider text-white">CONCERT LIVE</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight bg-purple-500/15 text-purple-300 border border-purple-500/30">
              现场录音
            </span>
          </div>
          <p className="text-xs text-white/50 hidden sm:block">极简毛玻璃 · 演唱会专属声场</p>
        </div>
      </div>

      {/* Center Venue & Memory Badge */}
      <button
        id="concert-venue-badge"
        onClick={onOpenMemoryModal}
        className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs text-white/80 hover:text-white transition-all cursor-pointer group"
        title="查看演唱会记忆手账"
      >
        <Ticket className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium text-white/90">{currentTrack.memory.venue}</span>
        <span className="text-white/30">·</span>
        <span className="text-purple-300/90">{currentTrack.memory.date}</span>
      </button>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Import Local File */}
        <button
          id="import-local-audio-btn"
          onClick={onImportClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-200 text-xs font-medium transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] cursor-pointer"
          title="导入本地录音或歌曲"
        >
          <Upload className="w-3.5 h-3.5 text-purple-300" />
          <span className="hidden sm:inline">导入本地音乐</span>
        </button>

        {/* Danmaku Toggle */}
        <button
          id="toggle-danmaku-btn"
          onClick={onToggleDanmaku}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            isDanmakuOpen
              ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
              : 'bg-white/[0.03] text-white/40 border-white/[0.08] hover:text-white/70'
          }`}
          title={isDanmakuOpen ? '关闭弹幕' : '开启弹幕'}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDanmakuOpen ? '弹幕 ON' : '弹幕 OFF'}</span>
        </button>

        {/* Setlist Drawer */}
        <button
          id="open-setlist-btn"
          onClick={onOpenSetlist}
          className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white transition-all cursor-pointer"
          title="现场歌单"
        >
          <ListMusic className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
