import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Ticket } from 'lucide-react';
import { AudioTrack, DanmakuItem } from '../types';
import { audioEngine } from '../utils/audio';

interface DanmakuStageProps {
  currentTrack: AudioTrack;
  isPlaying: boolean;
  danmakus: DanmakuItem[];
  isDanmakuOpen: boolean;
  onOpenMemoryModal: () => void;
  onCheer: () => void;
  cheerCount: number;
}

export const DanmakuStage: React.FC<DanmakuStageProps> = ({
  currentTrack,
  isPlaying,
  danmakus,
  isDanmakuOpen,
  onOpenMemoryModal,
  onCheer,
  cheerCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lyricsIndex, setLyricsIndex] = useState(0);

  // Cycle through lyrics preview smoothly
  useEffect(() => {
    if (!currentTrack.lyricsPreview || currentTrack.lyricsPreview.length === 0) return;
    const interval = setInterval(() => {
      setLyricsIndex((prev) => (prev + 1) % (currentTrack.lyricsPreview?.length || 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [currentTrack]);

  // Audio Visualizer spectrum rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const freqData = audioEngine.getFrequencyData();
      const barCount = 48;
      const barWidth = (width / barCount) * 0.55;
      const gap = (width / barCount) * 0.45;

      for (let i = 0; i < barCount; i++) {
        // Read sample or subtle idle breathing when paused
        const rawValue = isPlaying ? freqData[i * 2] || 0 : Math.sin(Date.now() / 600 + i * 0.2) * 6 + 10;
        const normalized = Math.min(1, Math.max(0.08, rawValue / 255));
        const barHeight = normalized * (height * 0.85);

        const x = i * (barWidth + gap) + gap / 2;
        const y = height - barHeight;

        // Gradient from White at top to Theme Purple at bottom
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, '#c084fc');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="relative flex-1 w-full flex flex-col items-center justify-center overflow-hidden px-4 select-none">
      {/* Ambient Stage Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full bg-purple-600/[0.12] blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/3 w-[250px] h-[250px] rounded-full bg-purple-900/[0.15] blur-[90px] pointer-events-none -z-10" />

      {/* Floating Danmaku Layer */}
      {isDanmakuOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {danmakus.map((item) => (
            <div
              key={item.id}
              className="danmaku-item absolute whitespace-nowrap flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-md transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
              style={{
                top: `${item.topPercent}%`,
                animationDuration: `${item.duration}s`,
                backgroundColor: item.isSelf
                  ? 'rgba(168, 85, 247, 0.25)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: item.isSelf
                  ? '1px solid rgba(192, 132, 252, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: item.color || '#ffffff',
                textShadow: item.isSelf ? '0 0 10px rgba(168, 85, 247, 0.8)' : '0 1px 4px rgba(0,0,0,0.8)',
              }}
            >
              {item.isSelf && <span className="text-purple-300 text-xs">💜 我：</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Center Stage Core */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
        {/* Floating Vinyl Record Stage */}
        <div className="relative mb-6 sm:mb-8 group">
          {/* Pulsing purple rim */}
          <div
            className={`absolute -inset-3 rounded-full bg-gradient-to-r from-purple-600/30 via-purple-400/20 to-purple-600/30 blur-md transition-opacity duration-1000 ${
              isPlaying ? 'opacity-90 animate-pulse' : 'opacity-20'
            }`}
          />

          {/* Frosted Glass Outer Ring */}
          <div
            className={`relative w-48 h-48 sm:w-60 sm:h-60 rounded-full p-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'scale-95'
            }`}
          >
            {/* Spinning Vinyl Texture */}
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br from-[#120f1c] via-[#09070f] to-[#171124] border border-white/[0.08] flex items-center justify-center relative overflow-hidden shadow-inner ${
                isPlaying ? 'animate-[spin_18s_linear_infinite]' : ''
              }`}
            >
              {/* Concentric Grooves */}
              <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-16 rounded-full border border-white/[0.05]" />

              {/* Center Tour Core Label */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/30 border border-purple-400/50 backdrop-blur-md flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <div className="w-4 h-4 rounded-full bg-black/90 border border-white/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
                <span className="text-[9px] font-semibold text-purple-200 tracking-wider mt-1 truncate max-w-[55px]">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Cheer Lightstick Floating Action */}
          <button
            id="cheer-lightstick-btn"
            onClick={onCheer}
            className="absolute -bottom-2 -right-2 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 backdrop-blur-lg text-purple-200 text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer transition-all active:scale-95 group-hover:scale-105"
            title="摇晃紫色荧光棒应援"
          >
            <Heart className="w-3.5 h-3.5 text-purple-300 fill-purple-400 animate-bounce" />
            <span>应援 {cheerCount > 0 ? cheerCount : '紫海'}</span>
          </button>
        </div>

        {/* Track & Concert Information */}
        <div className="text-center space-y-2 mb-4 px-4 w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white line-clamp-1 drop-shadow-sm">
            {currentTrack.title}
          </h1>

          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
            <span className="font-semibold text-purple-300">{currentTrack.artist}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/60 truncate max-w-[200px] sm:max-w-[300px]">
              {currentTrack.album}
            </span>
          </div>
        </div>

        {/* Live Lyrics / Concert Note Snippet */}
        <div className="h-9 flex items-center justify-center mb-5 text-center px-6">
          {currentTrack.lyricsPreview && currentTrack.lyricsPreview.length > 0 ? (
            <p
              key={lyricsIndex}
              className="text-xs sm:text-sm text-white/70 italic font-normal tracking-wide transition-opacity duration-700 animate-in fade-in max-w-md line-clamp-1"
            >
              &ldquo;{currentTrack.lyricsPreview[lyricsIndex]}&rdquo;
            </p>
          ) : (
            <p className="text-xs text-white/40 italic">现场音频已就绪，享受沉浸声场</p>
          )}
        </div>

        {/* Real-time Waveform Canvas */}
        <div className="w-full max-w-sm sm:max-w-md h-12 flex items-center justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={380}
            height={48}
            className="w-full h-full opacity-90"
          />
        </div>

        {/* Compact Concert Memory Stub Tag */}
        <button
          onClick={onOpenMemoryModal}
          className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-[11px] sm:text-xs text-white/60 hover:text-white/90 transition-all cursor-pointer"
        >
          <Ticket className="w-3 h-3 text-purple-400" />
          <span className="line-clamp-1 max-w-[280px] sm:max-w-[400px]">
            {currentTrack.memory.notes}
          </span>
          <span className="text-purple-400 text-[10px]">&gt;</span>
        </button>
      </div>
    </div>
  );
};
