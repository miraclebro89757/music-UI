import React, { useState } from 'react';
import { X, Ticket, Calendar, MapPin, Armchair, Save } from 'lucide-react';
import { AudioTrack, ConcertMemory } from '../types';

interface ConcertMemoryModalProps {
  track: AudioTrack;
  isOpen: boolean;
  onClose: () => void;
  onSaveMemory: (updatedMemory: ConcertMemory) => void;
}

const PURPLE_THEMES = [
  { name: '霓虹紫 (Neon Violet)', hex: '#a855f7' },
  { name: '深晶紫 (Deep Amethyst)', hex: '#9333ea' },
  { name: '柔雾薰衣草 (Soft Lavender)', hex: '#c084fc' },
  { name: '星云暗紫 (Galaxy Purple)', hex: '#7e22ce' },
];

export const ConcertMemoryModal: React.FC<ConcertMemoryModalProps> = ({
  track,
  isOpen,
  onClose,
  onSaveMemory,
}) => {
  const [formData, setFormData] = useState<ConcertMemory>({
    venue: track.memory.venue,
    date: track.memory.date,
    tour: track.memory.tour,
    seat: track.memory.seat,
    notes: track.memory.notes,
    lightstickColor: track.memory.lightstickColor || '#a855f7',
  });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMemory(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#0e0a17]/90 backdrop-blur-2xl border border-white/[0.12] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              演唱会现场纪念手账
            </h2>
            <p className="text-xs text-purple-300/70">{track.title} · Live Memory</p>
          </div>
        </div>

        {/* Ticket Stub Visual Card */}
        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          {/* Tour Name */}
          <div>
            <label className="block text-white/50 text-[11px] mb-1 font-medium">巡演标题 / 主题</label>
            <input
              type="text"
              value={formData.tour}
              onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-purple-500/60 transition-colors"
              placeholder="例如: Music of the Spheres World Tour"
            />
          </div>

          {/* Venue & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-[11px] mb-1 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                <span>场馆地点</span>
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-purple-500/60 transition-colors"
                placeholder="例如: 东京巨蛋"
              />
            </div>

            <div>
              <label className="block text-white/50 text-[11px] mb-1 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>现场日期</span>
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-purple-500/60 transition-colors"
                placeholder="例如: 2024.01.26"
              />
            </div>
          </div>

          {/* Seat Number */}
          <div>
            <label className="block text-white/50 text-[11px] mb-1 font-medium flex items-center gap-1">
              <Armchair className="w-3 h-3 text-purple-400" />
              <span>座位信息 / 票根</span>
            </label>
            <input
              type="text"
              value={formData.seat}
              onChange={(e) => setFormData({ ...formData, seat: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-purple-500/60 transition-colors"
              placeholder="例如: Arena A2 区 12 排 08 号"
            />
          </div>

          {/* Memory Notes */}
          <div>
            <label className="block text-white/50 text-[11px] mb-1 font-medium">
              现场心动时刻 / 专属记忆
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-purple-500/60 transition-colors resize-none text-xs sm:text-sm"
              placeholder="记录下那首歌响起时的心情、大合唱的震撼，或是舞台紫海的光芒..."
            />
          </div>

          {/* Purple Theme Lightstick selection */}
          <div>
            <label className="block text-white/50 text-[11px] mb-1.5 font-medium">现场应援色 (紫色系)</label>
            <div className="grid grid-cols-2 gap-2">
              {PURPLE_THEMES.map((theme) => (
                <button
                  type="button"
                  key={theme.hex}
                  onClick={() => setFormData({ ...formData, lightstickColor: theme.hex })}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    formData.lightstickColor === theme.hex
                      ? 'border-purple-400 bg-purple-600/20 text-white font-medium shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'border-white/[0.06] bg-black/20 text-white/60 hover:text-white/80'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: theme.hex }}
                  />
                  <span className="truncate text-[11px]">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存手账</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
