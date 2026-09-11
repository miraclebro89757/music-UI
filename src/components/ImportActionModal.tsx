import React from 'react';
import { X, HardDrive, Wifi, Sparkles, ChevronRight } from 'lucide-react';

interface ImportActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocal: () => void;
  onSelectWifi: () => void;
}

export const ImportActionModal: React.FC<ImportActionModalProps> = ({
  isOpen,
  onClose,
  onSelectLocal,
  onSelectWifi,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-[#171026]/95 backdrop-blur-2xl border border-white/[0.12] p-5 text-white shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(168,85,247,0.15)] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              导入演唱会音频
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-white/50 mb-4 pl-0.5">
          选择导入方式，将现场录音加入你的 Live 歌单中：
        </p>

        {/* Options List */}
        <div className="space-y-3">
          {/* Option 1: Local Upload */}
          <button
            onClick={() => {
              onClose();
              onSelectLocal();
            }}
            className="w-full p-3.5 rounded-2xl bg-white/[0.04] hover:bg-purple-600/[0.15] border border-white/[0.08] hover:border-purple-500/40 text-left transition-all duration-200 group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 group-hover:bg-purple-600/30 transition-all shadow-[0_0_15px_rgba(168,85,247,0.25)] shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                    本地上传
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/70">
                    直接选择
                  </span>
                </div>
                <p className="text-[11px] text-white/50 truncate mt-0.5">
                  从本机相册或文件库选择 MP3 / FLAC / WAV
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Option 2: Wi-Fi Transfer */}
          <button
            onClick={() => {
              onClose();
              onSelectWifi();
            }}
            className="w-full p-3.5 rounded-2xl bg-white/[0.04] hover:bg-purple-600/[0.15] border border-white/[0.08] hover:border-purple-500/40 text-left transition-all duration-200 group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-105 group-hover:bg-purple-500/30 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] shrink-0">
                <Wifi className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                    Wi-Fi 导入
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                    网页端同步
                  </span>
                </div>
                <p className="text-[11px] text-white/50 truncate mt-0.5">
                  电脑浏览器打开传输页面，拖拽无线传输
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>

        {/* Footer cancel button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          取消
        </button>
      </div>
    </div>
  );
};
