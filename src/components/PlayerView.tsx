import React, { useState, useEffect } from 'react';
import {
  MoreVertical,
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  MoreHorizontal,
  Activity,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { SongItem } from '../types';
import { StatusBar } from './StatusBar';

interface PlayerViewProps {
  currentSong: SongItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLiked: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onToggleLike: () => void;
  onSeek: (seconds: number) => void;
  onGoToLive: () => void;
  onOpenPlaylist: () => void;
  onOpenEdit?: () => void;
  onOpenOptions?: () => void;
}

function formatTime(secs: number): string {
  if (isNaN(secs) || secs < 0) return '00:00';
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.floor(secs % 60);
  return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  isLiked,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onToggleLike,
  onSeek,
  onGoToLive,
  onOpenPlaylist,
  onOpenEdit,
}) => {
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Resolve images (defaults to coverImg if no images array provided)
  const images =
    currentSong.images && currentSong.images.length > 0
      ? currentSong.images
      : [currentSong.coverImg];

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Reset image index when song changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentSong.id]);

  // Auto-carousel during playback: rotate every 4.5 seconds
  useEffect(() => {
    let interval: number;
    if (isPlaying && images.length > 1) {
      interval = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const activePhotoUrl = images[currentImageIndex] || currentSong.coverImg;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 select-none text-white bg-[#0e0a17]/95 overflow-hidden">
      {/* Background Ambient Purple Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-purple-600/[0.18] blur-[80px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-purple-900/[0.25] blur-[70px] pointer-events-none" />

      {/* Top Section */}
      <div className="relative z-10 w-full">
        <StatusBar />

        {/* Header */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.9)] animate-pulse" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Live Memory
              </h1>
              <p className="text-[11px] text-white/50 font-normal">
                Concert · {currentSong.date}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Edit Button */}
            {onOpenEdit && (
              <button
                onClick={onOpenEdit}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="编辑现场信息与相册"
              >
                <Edit3 className="w-4 h-4 text-purple-300" />
              </button>
            )}

            <button
              onClick={onOpenPlaylist}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="歌单与更多选项"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Stacked Card Artwork with Image Carousel */}
      <div className="relative z-10 my-auto py-2 flex items-center justify-center">
        <div className="relative w-full max-w-[290px] aspect-[1/1.1] group">
          {/* Layer 2: Underneath Card Peek on the Right */}
          <div className="absolute top-3 -right-3 bottom-3 left-4 rounded-3xl bg-purple-950/40 border border-white/[0.08] backdrop-blur-md -rotate-1 pointer-events-none shadow-[0_15px_35px_rgba(0,0,0,0.6)]" />

          {/* Layer 1: Main Foreground Card */}
          <div
            onClick={onGoToLive}
            className="relative w-full h-full rounded-3xl overflow-hidden border border-white/[0.12] bg-[#161026] shadow-[0_20px_50px_rgba(0,0,0,0.7)] cursor-pointer group-hover:scale-[1.01] transition-all duration-300"
            title="点击切换到现场互动与弹幕模式"
          >
            {/* Carousel Active Image */}
            <img
              key={activePhotoUrl}
              src={activePhotoUrl}
              alt={currentSong.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in zoom-in-95 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Dark Gradient Vignette Overlay at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0918] via-transparent to-black/20 pointer-events-none" />

            {/* Subtle Stage Light Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-transparent pointer-events-none" />

            {/* Carousel Manual Arrows (visible on hover or mobile tap) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  title="上一张照片"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  title="下一张照片"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Top Bar on Card: Photo Counter & Live Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              {/* Photo Carousel Counter Badge */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEdit?.();
                }}
                className="px-2.5 py-0.5 rounded-full bg-black/50 hover:bg-purple-900/60 backdrop-blur-md border border-white/15 text-[10px] text-white/90 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                title="点击管理轮播相册 (最多20张)"
              >
                <Camera className="w-3 h-3 text-purple-300" />
                <span>
                  {currentImageIndex + 1}/{images.length}
                </span>
                {images.length > 1 && isPlaying && (
                  <span className="w-1 h-1 rounded-full bg-purple-400 animate-ping" />
                )}
              </div>

              {/* Tap to Live Hint */}
              <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-purple-200 opacity-80 group-hover:opacity-100 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span>现场实况</span>
              </div>
            </div>

            {/* Dot indicators at the top/middle if multiple photos */}
            {images.length > 1 && (
              <div className="absolute top-9 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-10 pointer-events-none">
                {images.slice(0, 10).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'w-3 bg-purple-400'
                        : 'w-1 bg-white/40'
                    }`}
                  />
                ))}
                {images.length > 10 && (
                  <span className="text-[8px] text-white/50 pl-0.5">
                    +{images.length - 10}
                  </span>
                )}
              </div>
            )}

            {/* Inside Card Bottom Content */}
            <div className="absolute bottom-4 left-4 right-4 text-left z-10">
              {/* Animated Sound Waveform */}
              <div className="flex items-end space-x-0.5 h-4 mb-2">
                <span
                  className={`w-0.5 bg-purple-400 rounded-full ${
                    isPlaying ? 'h-3 animate-pulse' : 'h-1.5'
                  }`}
                />
                <span
                  className={`w-0.5 bg-purple-300 rounded-full ${
                    isPlaying ? 'h-4 animate-pulse delay-75' : 'h-2'
                  }`}
                />
                <span
                  className={`w-0.5 bg-purple-400 rounded-full ${
                    isPlaying ? 'h-2.5 animate-pulse delay-150' : 'h-1'
                  }`}
                />
                <span
                  className={`w-0.5 bg-purple-200 rounded-full ${
                    isPlaying ? 'h-3.5 animate-pulse delay-100' : 'h-2.5'
                  }`}
                />
                <span
                  className={`w-0.5 bg-purple-400 rounded-full ${
                    isPlaying ? 'h-2 animate-pulse delay-200' : 'h-1'
                  }`}
                />
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight drop-shadow truncate">
                {currentSong.title}
              </h2>
              <p className="text-xs text-white/60 font-medium truncate mt-0.5">
                {currentSong.artist}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Venue Section */}
      <div className="relative z-10 w-full space-y-4">
        {/* Progress Bar & Timestamps */}
        <div className="w-full px-1">
          <div className="flex items-center justify-between text-[11px] text-white/45 font-mono mb-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{currentSong.durationStr}</span>
          </div>

          <div
            onClick={handleSliderClick}
            className="relative w-full h-1.5 bg-white/[0.08] hover:bg-white/[0.14] rounded-full cursor-pointer flex items-center group transition-all"
          >
            {/* Active Filled Purple Track */}
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 rounded-full relative"
              style={{ width: `${percent}%` }}
            >
              {/* Scrubber Knob */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(168,85,247,0.9)] transform scale-90 group-hover:scale-125 transition-transform" />
            </div>
          </div>
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between px-2">
          {/* Like Heart */}
          <button
            onClick={onToggleLike}
            className="p-2 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer active:scale-95"
            title="喜欢这首歌"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked
                  ? 'text-purple-400 fill-purple-400 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                  : ''
              }`}
            />
          </button>

          {/* Prev */}
          <button
            onClick={onPrevTrack}
            className="p-2 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer active:scale-90"
            title="上一首"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Center Main Play / Pause Button (Glowing Solid Purple Circle) */}
          <button
            onClick={onTogglePlay}
            className="w-13 h-13 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white flex items-center justify-center transition-all transform active:scale-95 shadow-[0_0_24px_rgba(139,92,246,0.6)] cursor-pointer"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNextTrack}
            className="p-2 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer active:scale-90"
            title="下一首"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* More Options / Edit */}
          <button
            onClick={onOpenEdit || onOpenPlaylist}
            className="p-2 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer active:scale-95"
            title="编辑信息或查看歌单"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Venue Frosted Glass Strip */}
        <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] backdrop-blur-xl transition-all group">
          <div
            onClick={onGoToLive}
            className="flex items-center space-x-2.5 min-w-0 flex-1 cursor-pointer"
            title="点击进入演唱会现场声场与弹幕互动"
          >
            {/* Mini soundwave icon */}
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
            </div>

            <div className="min-w-0 text-left">
              <p className="text-[10px] text-white/45 font-medium leading-none mb-1">
                Live · {currentSong.date}
              </p>
              <p className="text-xs font-semibold text-white/90 truncate group-hover:text-purple-300 transition-colors">
                {currentSong.venue}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {onOpenEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEdit();
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-purple-300 transition-colors"
                title="修改地点与现场信息"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="px-2 py-0.5 rounded-full border border-white/20 text-[10px] font-mono font-medium text-white/70 group-hover:border-purple-400/50 group-hover:text-purple-200 transition-colors">
              HQ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
