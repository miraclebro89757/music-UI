import React, { useRef } from 'react';
import { X, Upload, Music, Disc3, Sparkles } from 'lucide-react';
import { AudioTrack } from '../types';

interface SetlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: AudioTrack[];
  currentTrackId: string;
  onSelectTrack: (track: AudioTrack) => void;
  onImportFile: (file: File) => void;
  isPlaying: boolean;
}

function formatDuration(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remaining = Math.floor(secs % 60);
  return `${mins}:${remaining.toString().padStart(2, '0')}`;
}

export const SetlistDrawer: React.FC<SetlistDrawerProps> = ({
  isOpen,
  onClose,
  tracks,
  currentTrackId,
  onSelectTrack,
  onImportFile,
  isPlaying,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || /\.(mp3|wav|flac|aac|m4a|ogg)$/i.test(file.name)) {
        onImportFile(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#0d0917]/95 backdrop-blur-2xl border-l border-white/[0.1] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Disc3 className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white">现场歌单与录音</h2>
              <p className="text-xs text-purple-300/70">共 {tracks.length} 首现场曲目</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="p-4 border-b border-white/[0.06]">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-3 rounded-2xl border border-dashed border-purple-500/30 hover:border-purple-400/60 bg-purple-950/20 hover:bg-purple-900/30 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <Upload className="w-5 h-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-purple-200">拖拽或点击导入本地演唱会录音</p>
            <p className="text-[10px] text-white/40 mt-0.5">支持 MP3, WAV, FLAC, M4A, OGG</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.flac,.m4a,.ogg"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tracks.map((track, idx) => {
            const isCurrent = track.id === currentTrackId;

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-medium shrink-0 ${
                      isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/[0.05] text-white/60'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end space-x-0.5 h-3">
                        <span className="w-0.5 h-2.5 bg-white animate-pulse" />
                        <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
                      </div>
                    ) : (
                      <span>{(idx + 1).toString().padStart(2, '0')}</span>
                    )}
                  </div>

                  <div className="min-w-0 text-left">
                    <p
                      className={`text-xs sm:text-sm font-medium truncate ${
                        isCurrent ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[11px] text-purple-300/70 truncate flex items-center gap-1">
                      <span>{track.artist}</span>
                      <span className="text-white/30">·</span>
                      <span>{track.memory.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-[11px] font-mono text-white/40">
                    {formatDuration(track.duration)}
                  </span>
                  {track.isLocalFile && (
                    <span className="block text-[9px] text-purple-400">本地文件</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
