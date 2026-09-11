import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
} from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: boolean;
  volume: number;
  isStadiumEffect: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onChangeVolume: (vol: number) => void;
  onToggleStadiumEffect: () => void;
}

function formatTime(secs: number): string {
  if (isNaN(secs) || secs < 0) return '00:00';
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.floor(secs % 60);
  return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  isShuffle,
  isRepeat,
  volume,
  isStadiumEffect,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onChangeVolume,
  onToggleStadiumEffect,
}) => {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number>(0);

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickRatio * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverTime(ratio * duration);
    setHoverPos(moveX);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  return (
    <div className="relative z-30 w-full px-4 sm:px-8 py-3 bg-black/50 backdrop-blur-2xl border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto flex flex-col space-y-2.5">
        {/* Progress Scrubber */}
        <div className="w-full flex items-center space-x-3 text-[11px] font-mono text-white/50 select-none">
          <span>{formatTime(currentTime)}</span>

          <div
            id="audio-progress-bar"
            onClick={handleSeekClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex-1 h-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-full cursor-pointer group flex items-center transition-all"
          >
            {/* Timestamp hover tooltip */}
            {hoverTime !== null && (
              <div
                className="absolute -top-7 px-1.5 py-0.5 rounded bg-purple-950/90 border border-purple-400/40 text-[10px] text-purple-200 font-mono pointer-events-none transform -translate-x-1/2 shadow-lg"
                style={{ left: `${hoverPos}px` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}

            {/* Filled track with purple glow */}
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-full relative transition-all"
              style={{ width: `${percent}%` }}
            >
              {/* Scrub thumb */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>

          <span>{formatTime(duration)}</span>
        </div>

        {/* Buttons and Soundstage Mode Bar */}
        <div className="flex items-center justify-between">
          {/* Left: Stadium Acoustic Hall Toggle */}
          <div className="flex items-center space-x-2">
            <button
              id="stadium-reverb-btn"
              onClick={onToggleStadiumEffect}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                isStadiumEffect
                  ? 'bg-purple-600/25 border-purple-400/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-white/40 hover:text-white/70'
              }`}
              title="切换体育场现场混响声场模式"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="hidden sm:inline">现场混响声场</span>
              <span className="sm:hidden">现场声场</span>
              <span className="text-[10px] opacity-75">{isStadiumEffect ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              id="shuffle-btn"
              onClick={onToggleShuffle}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isShuffle ? 'text-purple-400' : 'text-white/40 hover:text-white/80'
              }`}
              title="随机播放"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              id="prev-track-btn"
              onClick={onPrev}
              className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer active:scale-95"
              title="上一首"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause Button */}
            <button
              id="play-pause-btn"
              onClick={onTogglePlay}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black hover:bg-purple-100 flex items-center justify-center transition-all transform active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              id="next-track-btn"
              onClick={onNext}
              className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer active:scale-95"
              title="下一首"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              id="repeat-btn"
              onClick={onToggleRepeat}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isRepeat ? 'text-purple-400' : 'text-white/40 hover:text-white/80'
              }`}
              title="单曲循环"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Volume Slider */}
          <div className="flex items-center space-x-2">
            <button
              id="mute-volume-btn"
              onClick={() => onChangeVolume(volume === 0 ? 0.8 : 0)}
              className="text-white/50 hover:text-white transition-colors cursor-pointer"
              title={volume === 0 ? '取消静音' : '静音'}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-purple-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-white/[0.15] accent-purple-500 rounded-lg cursor-pointer"
              title={`音量: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
