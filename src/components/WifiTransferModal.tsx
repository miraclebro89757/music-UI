import React, { useState, useRef } from 'react';
import {
  X,
  Wifi,
  Copy,
  Check,
  Globe,
  UploadCloud,
  FileAudio,
  Smartphone,
  Laptop,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SongItem } from '../types';

interface WifiTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSong: (file: File | { title: string; artist: string; venue: string; duration: number }) => void;
  currentSongTitle: string;
}

export const WifiTransferModal: React.FC<WifiTransferModalProps> = ({
  isOpen,
  onClose,
  onImportSong,
  currentSongTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'server' | 'webpage'>('webpage'); // Default to web console so user immediately sees the interactive webpage!
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('18.6 MB/s');
  const [transferSuccessFile, setTransferSuccessFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ipAddress = 'http://192.168.1.108:8080';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ipAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate file upload with progress bar
  const startUploadSimulation = (fileName: string, onComplete: () => void) => {
    setIsUploading(true);
    setUploadProgress(10);
    setTransferSuccessFile(null);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTransferSuccessFile(fileName);
          onComplete();
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 15;
        return Math.min(100, prev + step);
      });
    }, 280);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      startUploadSimulation(file.name, () => {
        onImportSong(file);
      });
      e.target.value = '';
    }
  };

  // Fast preset live tracks for instant Wi-Fi demo transfer testing
  const handleTransferPreset = (title: string, artist: string, venue: string, duration: number) => {
    startUploadSimulation(`${title} - Live.flac`, () => {
      onImportSong({
        title,
        artist,
        venue,
        duration,
      });
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#140d24]/95 backdrop-blur-2xl border border-white/[0.14] text-white shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Hidden File Input for Web Console File Picking */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.flac,.m4a"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-black/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Wi-Fi 局域网传输
              </h3>
              <p className="text-[10px] text-white/50">
                无线局域网 HTTP 高速传输 · 无损音轨同步
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

        {/* Segmented Switcher: [ 📱 手机端服务 | 💻 网页端上传控制台 ] */}
        <div className="px-5 pt-3 pb-1">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveTab('webpage')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer font-medium ${
                activeTab === 'webpage'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>网页端上传控制台</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('server')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer font-medium ${
                activeTab === 'server'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>手机端服务状态</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'webpage' ? (
            /* TAB 1: Simulated Browser Web Console */
            <div className="space-y-3">
              {/* Browser Address Bar Simulation */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-white/60 min-w-0 flex-1">
                  <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-[11px] font-mono text-purple-200 truncate">
                    {ipAddress}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    已连接
                  </span>
                  <button
                    onClick={() => {
                      setTransferSuccessFile(null);
                      setIsUploading(false);
                    }}
                    className="p-1 rounded-full text-white/40 hover:text-white transition-colors"
                    title="刷新连接"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone Container */}
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative w-full rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isUploading
                    ? 'border-purple-500/60 bg-purple-900/15'
                    : 'border-white/15 hover:border-purple-400/50 bg-white/[0.02] hover:bg-purple-950/20'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <UploadCloud className="w-6 h-6 animate-bounce" />
                </div>

                <h4 className="text-sm font-semibold text-white mb-1">
                  {isUploading ? '正在无损无线传输...' : '点击或拖拽音频文件到网页端'}
                </h4>
                <p className="text-xs text-white/50 mb-3">
                  支持 MP3 · FLAC · WAV · AAC · M4A 格式
                </p>

                {/* Progress Bar while Uploading */}
                {isUploading ? (
                  <div className="w-full max-w-xs space-y-2 mt-2">
                    <div className="flex justify-between text-[11px] font-mono text-purple-300">
                      <span>传输进度</span>
                      <span>{uploadProgress}% ({uploadSpeed})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all cursor-pointer"
                  >
                    选择本地文件导入
                  </button>
                )}
              </div>

              {/* Success Notification Alert */}
              {transferSuccessFile && (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-200">
                        {transferSuccessFile} 传输成功！
                      </p>
                      <p className="text-[10px] text-emerald-400/70">
                        已同步至手机「我的歌单」并自动解析声场
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-medium transition-colors"
                  >
                    去收听
                  </button>
                </div>
              )}

              {/* Fast Preset Live Tracks Demo Buttons */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>或者快速模拟网页端传输热门现场：</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      handleTransferPreset(
                        'Fix You',
                        'Coldplay',
                        'São Paulo Stadium Live',
                        304
                      )
                    }
                    disabled={isUploading}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-purple-600/15 border border-white/[0.08] hover:border-purple-500/30 text-left transition-all flex items-center space-x-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileAudio className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        Fix You (Live in São Paulo)
                      </p>
                      <p className="text-[10px] text-white/40 truncate">
                        Coldplay · 5:04 · FLAC
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      handleTransferPreset(
                        "Don't Look Back In Anger",
                        'Oasis',
                        'Heaton Park Live',
                        298
                      )
                    }
                    disabled={isUploading}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-purple-600/15 border border-white/[0.08] hover:border-purple-500/30 text-left transition-all flex items-center space-x-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileAudio className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        Don't Look Back In Anger
                      </p>
                      <p className="text-[10px] text-white/40 truncate">
                        Oasis · 4:58 · WAV
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Mobile Server Info & Instructions */
            <div className="space-y-4">
              {/* Status Pill Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">当前 Wi-Fi 网络</span>
                  <span className="font-semibold text-purple-300">
                    Concert-Studio-5G
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">手机端服务状态</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    局域网 HTTP 服务运行中
                  </span>
                </div>
              </div>

              {/* IP Address Pill Box */}
              <div>
                <label className="text-[11px] text-white/50 font-medium block mb-1.5">
                  在电脑或同一 Wi-Fi 下的浏览器中输入网址：
                </label>
                <div className="flex items-center space-x-2 p-2.5 rounded-2xl bg-black/50 border border-purple-500/30">
                  <span className="flex-1 font-mono text-sm text-purple-200 font-bold px-2 truncate">
                    {ipAddress}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制地址</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 Step Instruction Guide */}
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2 text-xs">
                <div className="flex items-start space-x-2 text-white/80">
                  <span className="w-4 h-4 rounded-full bg-purple-600/50 text-[10px] flex items-center justify-center font-bold text-white shrink-0 mt-0.5">
                    1
                  </span>
                  <span>确保电脑/平板与手机连接在**同一个 Wi-Fi** 下。</span>
                </div>
                <div className="flex items-start space-x-2 text-white/80">
                  <span className="w-4 h-4 rounded-full bg-purple-600/50 text-[10px] flex items-center justify-center font-bold text-white shrink-0 mt-0.5">
                    2
                  </span>
                  <span>在电脑浏览器访问上面的 IP 地址，打开传输网页。</span>
                </div>
                <div className="flex items-start space-x-2 text-white/80">
                  <span className="w-4 h-4 rounded-full bg-purple-600/50 text-[10px] flex items-center justify-center font-bold text-white shrink-0 mt-0.5">
                    3
                  </span>
                  <span>拖入演唱会录音文件，手机歌单将**秒级自动同步**。</span>
                </div>
              </div>

              {/* Direct Jump to Web Console Button */}
              <button
                onClick={() => setActiveTab('webpage')}
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>直接进入网页端上传交互</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-xs">
          <span className="text-white/40 text-[11px]">
            传输期间请勿关闭应用或离开当前 Wi-Fi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white/80 hover:text-white transition-colors cursor-pointer text-xs"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
