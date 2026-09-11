import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Maximize2, Smile, Send, Heart } from 'lucide-react';
import { SongItem, DanmakuMessage } from '../types';
import { StatusBar } from './StatusBar';
import { concertLiveBg } from '../data/mockData';

interface LiveDanmakuViewProps {
  currentSong: SongItem;
  danmakus: DanmakuMessage[];
  onBack: () => void;
  onSendDanmaku: (text: string) => void;
  onOpenDanmakuModal: () => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  scale: number;
  duration: number;
}

export const LiveDanmakuView: React.FC<LiveDanmakuViewProps> = ({
  currentSong,
  danmakus,
  onBack,
  onSendDanmaku,
  onOpenDanmakuModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const danmakuContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-spawn ambient floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      spawnHeart();
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Scroll danmaku to bottom on new message
  useEffect(() => {
    if (danmakuContainerRef.current) {
      danmakuContainerRef.current.scrollTop = danmakuContainerRef.current.scrollHeight;
    }
  }, [danmakus]);

  const spawnHeart = (customX?: number) => {
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: customX !== undefined ? customX : Math.random() * 60 + 20, // percentage from right
      scale: 0.8 + Math.random() * 0.5,
      duration: 2.2 + Math.random() * 1.2,
    };
    setHearts((prev) => [...prev.slice(-16), newHeart]);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only spawn heart if clicking empty background
    if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickXFromRight = ((rect.right - e.clientX) / rect.width) * 100;
      spawnHeart(Math.min(80, Math.max(10, clickXFromRight)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendDanmaku(inputText.trim());
    setInputText('');
    spawnHeart(25);
  };

  return (
    <div
      onClick={handleStageClick}
      className="relative w-full h-full flex flex-col justify-between p-5 select-none text-white overflow-hidden bg-black"
    >
      {/* Background Live Concert Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={concertLiveBg}
          alt="Concert Live Stage"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-95"
        />
        {/* Subtle purple gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-purple-900/[0.15] mix-blend-color pointer-events-none" />
      </div>

      {/* Floating Purple Hearts Animation in lower right */}
      <div className="absolute right-6 bottom-20 w-24 h-56 pointer-events-none z-20 overflow-hidden">
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute bottom-0 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] animate-[float-up_3s_ease-out_forwards]"
            style={{
              right: `${h.x}%`,
              transform: `scale(${h.scale})`,
              animationDuration: `${h.duration}s`,
            }}
          >
            <Heart className="w-5 h-5 fill-purple-400 text-purple-300" />
          </div>
        ))}
      </div>

      {/* Top Header Section */}
      <div className="relative z-20 w-full">
        <StatusBar />

        <div className="flex items-center justify-between mt-2 px-1">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95"
            title="返回播放器"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Live Date Pill & Fullscreen */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-medium text-white/90">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Live · 8.16</span>
            <span className="text-white/30">|</span>
            <Maximize2 className="w-3 h-3 text-white/70" />
          </div>
        </div>
      </div>

      {/* Middle & Lower-Left Danmaku Chat Stream */}
      <div className="relative z-20 w-full flex-1 flex flex-col justify-end pb-3 pointer-events-none">
        <div
          ref={danmakuContainerRef}
          className="max-h-[300px] overflow-y-auto space-y-2 pointer-events-auto pr-16 scrollbar-none"
        >
          {danmakus.map((dm) => (
            <div
              key={dm.id}
              className="flex items-center space-x-2 max-w-[92%] animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div
                className="px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center space-x-2 text-xs shadow-lg"
              >
                {/* Avatar Icon / Initials */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: dm.avatarColor }}
                >
                  {dm.badge || dm.user.slice(0, 1)}
                </div>

                {/* User Name */}
                <span className="font-semibold text-white/80 shrink-0">
                  {dm.user}
                </span>

                {/* Danmaku Text */}
                <span className="text-white drop-shadow-sm truncate">
                  {dm.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Danmaku Composer Bar */}
      <div className="relative z-20 w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        >
          {/* Smiley Icon (opens modal) */}
          <button
            type="button"
            onClick={onOpenDanmakuModal}
            className="text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
            title="快捷弹幕表情"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Input text */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="发一条弹幕..."
            className="flex-1 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
          />

          {/* Purple Round Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.6)] active:scale-95"
            title="发送弹幕"
          >
            <Send className="w-3.5 h-3.5 -translate-x-0.5 translate-y-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
