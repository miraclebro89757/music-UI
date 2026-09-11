import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Trash2,
  Plus,
  Sparkles,
  Calendar,
  MapPin,
  User,
  Music,
  Save,
  RotateCcw,
  Check,
} from 'lucide-react';
import { SongItem } from '../types';
import { PRESET_CONCERT_PHOTOS } from '../data/mockData';

interface SongEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: SongItem;
  onSave: (updatedSong: SongItem) => void;
}

export const SongEditModal: React.FC<SongEditModalProps> = ({
  isOpen,
  onClose,
  song,
  onSave,
}) => {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [venue, setVenue] = useState(song.venue);
  const [date, setDate] = useState(song.date);
  const [images, setImages] = useState<string[]>(
    song.images && song.images.length > 0 ? [...song.images] : [song.coverImg]
  );
  const [activeTab, setActiveTab] = useState<'info' | 'photos'>('info');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const remainingSlots = 20 - images.length;
    if (remainingSlots <= 0) {
      showFeedback('最多只能添加20张轮播图片');
      return;
    }

    const filesArray = (Array.from(e.target.files) as File[]).slice(0, remainingSlots);
    const newUrls = filesArray.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newUrls].slice(0, 20));
    showFeedback(`成功添加了 ${filesArray.length} 张图片`);
    e.target.value = '';
  };

  const handleAddPresetPhoto = (url: string) => {
    if (images.length >= 20) {
      showFeedback('已达到最多20张图片限制');
      return;
    }
    setImages((prev) => [...prev, url]);
    showFeedback('已添加现场精选图');
  };

  const handleRemovePhoto = (index: number) => {
    if (images.length <= 1) {
      showFeedback('至少保留一张现场展示图片');
      return;
    }
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetPrimary = (index: number) => {
    const selected = images[index];
    setImages((prev) => [selected, ...prev.filter((_, idx) => idx !== index)]);
    showFeedback('已设为首张封面展示');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSong: SongItem = {
      ...song,
      title: title.trim() || song.title,
      artist: artist.trim() || song.artist,
      venue: venue.trim() || song.venue,
      date: date.trim() || song.date,
      coverImg: images[0] || song.coverImg,
      images: images.length > 0 ? images : [song.coverImg],
    };

    onSave(updatedSong);
    onClose();
  };

  const handleResetToDefault = () => {
    setTitle(song.title);
    setArtist(song.artist);
    setVenue(song.venue);
    setDate(song.date);
    setImages(song.images && song.images.length > 0 ? [...song.images] : [song.coverImg]);
    showFeedback('已重置为当前默认信息');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      {/* Hidden Multiple Image File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleAddPhotos}
        className="hidden"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#150e26]/95 backdrop-blur-2xl border border-white/[0.14] text-white shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-black/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                编辑现场信息与轮播相册
              </h3>
              <p className="text-[10px] text-white/50">
                支持自定义演唱会地点、时间、歌手与最多20张轮播图
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: [ 📝 基本信息 | 🖼️ 现场轮播相册 (X/20) ] */}
        <div className="px-5 pt-3 pb-1">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer font-medium ${
                activeTab === 'info'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>现场基本信息</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer font-medium ${
                activeTab === 'photos'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>轮播相册 ({images.length}/20)</span>
            </button>
          </div>
        </div>

        {/* Transient Feedback Banner */}
        {feedback && (
          <div className="mx-5 mt-2 py-1.5 px-3 rounded-xl bg-purple-600/30 border border-purple-400/40 text-xs text-purple-200 flex items-center justify-between animate-in fade-in">
            <span>{feedback}</span>
            <Check className="w-3.5 h-3.5 text-purple-300" />
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'info' ? (
            /* TAB 1: Song Info Fields */
            <div className="space-y-3.5">
              {/* Concert Theme / Song Title */}
              <div>
                <label className="text-xs text-white/70 font-medium flex items-center gap-1.5 mb-1.5">
                  <Music className="w-3.5 h-3.5 text-purple-400" />
                  <span>演唱会主题</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={song.title}
                  className="w-full bg-white/[0.06] focus:bg-white/[0.1] border border-white/10 focus:border-purple-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Artist Name */}
              <div>
                <label className="text-xs text-white/70 font-medium flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>歌手名字</span>
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder={song.artist}
                  className="w-full bg-white/[0.06] focus:bg-white/[0.1] border border-white/10 focus:border-purple-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="text-xs text-white/70 font-medium flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>演唱会地点 (Venue)</span>
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder={song.venue}
                  className="w-full bg-white/[0.06] focus:bg-white/[0.1] border border-white/10 focus:border-purple-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-white/70 font-medium flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>演出时间 / 日期</span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder={song.date}
                  className="w-full bg-white/[0.06] focus:bg-white/[0.1] border border-white/10 focus:border-purple-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none transition-all"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  如：2025.08.16 或 2025年夏末巡演
                </p>
              </div>

              {/* Default Preview hint */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-white/70 space-y-1">
                <span className="font-semibold text-purple-300">💡 提示：</span>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  若留空不设置，系统将自动采用默认歌单信息与现场手账数据。
                </p>
              </div>
            </div>
          ) : (
            /* TAB 2: Image Carousel Manager (up to 20 images) */
            <div className="space-y-4">
              {/* Actions Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">
                    现场轮播图片集
                  </span>
                  <p className="text-[10px] text-white/50">
                    播放时按序轮播展示，当前已选 {images.length} / 20 张
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= 20}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer shadow-[0_0_12px_rgba(147,51,234,0.4)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>上传照片</span>
                  </button>
                </div>
              </div>

              {/* Image Thumbnail Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1 scrollbar-none">
                {images.map((img, idx) => (
                  <div
                    key={`${img}-${idx}`}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-black/40"
                  >
                    <img
                      src={img}
                      alt={`Live ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {/* Badge Number */}
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/90">
                      #{idx + 1}
                    </div>

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded-md bg-purple-600 text-[9px] font-bold text-white shadow-sm">
                        封面
                      </div>
                    )}

                    {/* Hover Actions: Set as Primary, Delete */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-purple-600 text-white transition-colors"
                          title="设为首张封面"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                        title="删除此图片"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Plus Placeholder Card */}
                {images.length < 20 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border border-dashed border-white/20 hover:border-purple-400/60 bg-white/[0.02] hover:bg-purple-900/15 transition-colors cursor-pointer flex flex-col items-center justify-center text-white/40 hover:text-purple-300"
                  >
                    <Plus className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px]">添加图片</span>
                  </div>
                )}
              </div>

              {/* Fast Add Preset Concert Photos */}
              <div className="pt-2 border-t border-white/[0.08]">
                <div className="flex items-center space-x-1.5 text-xs text-white/60 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>快速添加现场摄影大片 (点击即可加入)：</span>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_CONCERT_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetPhoto(preset.url)}
                      disabled={images.length >= 20}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 hover:scale-105 transition-transform disabled:opacity-40 cursor-pointer group"
                      title={`添加「${preset.name}」`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-purple-600/30 transition-colors flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white opacity-80 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Save & Reset Buttons */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white/60 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复默认</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-white/80 transition-colors cursor-pointer"
              >
                取消
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-xs font-semibold text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.6)] flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存设置</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
