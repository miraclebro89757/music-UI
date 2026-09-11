import React, { useState, useEffect, useRef } from 'react';
import { SongItem, DanmakuMessage, MobileTab } from './types';
import { SONGS, INITIAL_DANMAKUS } from './data/mockData';
import { audioEngine } from './utils/audio';
import { MobileFrame } from './components/MobileFrame';
import { OverviewShowcase } from './components/OverviewShowcase';
import { ImportActionModal } from './components/ImportActionModal';
import { WifiTransferModal } from './components/WifiTransferModal';
import { SongEditModal } from './components/SongEditModal';
import {
  Smartphone,
  LayoutGrid,
  Upload,
  Sparkles,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

export default function App() {
  const [songs, setSongs] = useState<SongItem[]>(SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(154); // 2:34 to match screenshot!
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [danmakus, setDanmakus] = useState<DanmakuMessage[]>(INITIAL_DANMAKUS);
  const [isDanmakuModalOpen, setIsDanmakuModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSong, setEditingSong] = useState<SongItem | null>(null);
  const [viewMode, setViewMode] = useState<'phone' | 'showcase'>('phone');
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('player');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentSong = songs[currentSongIndex] || songs[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Playback timer simulation when audio element is not loaded with external file
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSong.duration]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      await audioEngine.play();
      setIsPlaying(true);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 5) {
      setCurrentTime(0);
      audioEngine.seek(0);
      return;
    }
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
    setCurrentTime(0);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIdx);
    setCurrentTime(0);
  };

  const handleSeek = (secs: number) => {
    setCurrentTime(secs);
    audioEngine.seek(secs);
  };

  const handleSelectSong = (song: SongItem) => {
    const idx = songs.findIndex((s) => s.id === song.id);
    if (idx !== -1) {
      setCurrentSongIndex(idx);
      setCurrentTime(0);
      setIsPlaying(true);
      audioEngine.play();
    }
  };

  const handleSendDanmaku = (text: string) => {
    const userColors = ['#a855f7', '#ec4899', '#38bdf8', '#fb923c', '#c084fc', '#f43f5e'];
    const randomColor = userColors[Math.floor(Math.random() * userColors.length)];
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    const newDanmaku: DanmakuMessage = {
      id: `dm-${Date.now()}-${Math.random()}`,
      user: '我',
      avatarColor: randomColor,
      text,
      isSelf: true,
      timeStr,
    };

    setDanmakus((prev) => [...prev, newDanmaku]);
  };

  // Handles real file upload from both local file picker and Wi-Fi web console
  const handleImportLocalAudio = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, '');

    const newSong: SongItem = {
      id: `song-${Date.now()}`,
      title: fileName,
      artist: '本地现场音轨录音',
      album: '我的现场回忆',
      duration: 240,
      durationStr: '4:00',
      venue: '现场音乐厅',
      date: new Date().toLocaleDateString().replace(/\//g, '.'),
      coverImg: currentSong.coverImg,
      images: currentSong.images && currentSong.images.length > 0 ? [...currentSong.images] : [currentSong.coverImg],
      notes: '用户导入的本地独家现场录音',
    };

    const audio = new Audio(objectUrl);
    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const d = Math.round(audio.duration);
        const m = Math.floor(d / 60);
        const s = d % 60;
        newSong.duration = d;
        newSong.durationStr = `${m}:${s.toString().padStart(2, '0')}`;
      }
    };

    audioEngine.loadAudio(
      objectUrl,
      () => handleNextTrack(),
      (curr) => {
        setCurrentTime(curr);
      }
    );

    setSongs((prev) => [newSong, ...prev]);
    setCurrentSongIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.play();
    showToast(`🎵 已成功导入《${fileName}》并加入播放列表！`);
  };

  // Handles Wi-Fi transfer (accepts either real File or preset demo concert track)
  const handleWifiTransfer = (
    item: File | { title: string; artist: string; venue: string; duration: number }
  ) => {
    if (item instanceof File) {
      handleImportLocalAudio(item);
    } else {
      const m = Math.floor(item.duration / 60);
      const s = item.duration % 60;
      const durationStr = `${m}:${s.toString().padStart(2, '0')}`;

      const newSong: SongItem = {
        id: `song-wifi-${Date.now()}`,
        title: item.title,
        artist: item.artist,
        album: `${item.venue} Live`,
        duration: item.duration,
        durationStr,
        venue: item.venue,
        date: new Date().toLocaleDateString().replace(/\//g, '.'),
        coverImg: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
        ],
        notes: `通过 Wi-Fi 网页端无线同步至设备 · ${item.venue}`,
      };

      setSongs((prev) => [newSong, ...prev]);
      setCurrentSongIndex(0);
      setCurrentTime(0);
      setIsPlaying(true);
      audioEngine.play();
      showToast(`⚡ Wi-Fi 网页端同步成功：《${item.title}》已就绪！`);
    }
  };

  const handleOpenAddMenu = () => {
    setIsImportModalOpen(true);
  };

  const handleOpenEditCurrentSong = () => {
    setEditingSong(currentSong);
    setIsEditModalOpen(true);
  };

  const handleEditSpecificSong = (song: SongItem) => {
    setEditingSong(song);
    setIsEditModalOpen(true);
  };

  const handleSaveSong = (updatedSong: SongItem) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === updatedSong.id ? updatedSong : s))
    );
    showToast(`✨ 《${updatedSong.title}》现场信息与轮播相册已成功更新！`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#09060f] text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Hidden File Input for Native Local File Picking */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.flac,.m4a"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleImportLocalAudio(e.target.files[0]);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-purple-950/90 border border-purple-500/50 backdrop-blur-xl text-white text-xs font-medium shadow-[0_10px_30px_rgba(168,85,247,0.4)] flex items-center space-x-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Atmospheric Ambient Purple Lighting in Background */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/[0.12] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/[0.08] blur-[140px] pointer-events-none" />

      {/* Top Navigation & Mode Switcher Bar */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-3.5 border-b border-white/[0.07] bg-black/40 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Theme Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Live Concert Player
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                毛玻璃 · 极简
              </span>
            </span>
            <p className="text-[10px] text-white/40 hidden sm:block">
              纯粹三色系：黑 (底色) · 紫 (主题色) · 白 (文本/高光)
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center p-1 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md text-xs">
          <button
            onClick={() => setViewMode('phone')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              viewMode === 'phone'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.6)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>移动端单机交互</span>
          </button>

          <button
            onClick={() => setViewMode('showcase')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              viewMode === 'showcase'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.6)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>全景设计画板 (3屏同览)</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenEditCurrentSong}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-medium text-purple-200 transition-colors cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.25)]"
            title="编辑当前歌曲现场信息、地点与轮播相册"
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-300" />
            <span>编辑手账相册</span>
          </button>

          <button
            onClick={handleOpenAddMenu}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white/90 transition-colors cursor-pointer"
            title="导入演唱会音频 (本地文件 / Wi-Fi 网页端)"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>添加音乐</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {viewMode === 'phone' ? (
          <MobileFrame
            activeTab={activeMobileTab}
            onChangeTab={setActiveMobileTab}
            currentSong={currentSong}
            songs={songs}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={currentSong.duration}
            isLiked={isLiked}
            danmakus={danmakus}
            isDanmakuModalOpen={isDanmakuModalOpen}
            onTogglePlay={handleTogglePlay}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            onToggleLike={() => setIsLiked(!isLiked)}
            onSeek={handleSeek}
            onSelectSong={handleSelectSong}
            onSendDanmaku={handleSendDanmaku}
            onOpenDanmakuModal={() => setIsDanmakuModalOpen(true)}
            onCloseDanmakuModal={() => setIsDanmakuModalOpen(false)}
            onAddSong={handleOpenAddMenu}
            onOpenEdit={handleOpenEditCurrentSong}
            onEditSong={handleEditSpecificSong}
          />
        ) : (
          <OverviewShowcase
            currentSong={currentSong}
            songs={songs}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={currentSong.duration}
            isLiked={isLiked}
            danmakus={danmakus}
            onTogglePlay={handleTogglePlay}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            onToggleLike={() => setIsLiked(!isLiked)}
            onSeek={handleSeek}
            onSelectSong={handleSelectSong}
            onSendDanmaku={handleSendDanmaku}
            onSwitchToMobilePhone={(tab) => {
              setActiveMobileTab(tab);
              setViewMode('phone');
            }}
            onAddSong={handleOpenAddMenu}
            onOpenEdit={handleOpenEditCurrentSong}
            onEditSong={handleEditSpecificSong}
          />
        )}
      </main>

      {/* Modal 1: Import Action Selection Modal (本地上传 vs Wi-Fi 导入) */}
      <ImportActionModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSelectLocal={() => {
          fileInputRef.current?.click();
        }}
        onSelectWifi={() => {
          setIsWifiModalOpen(true);
        }}
      />

      {/* Modal 2: Wi-Fi Transfer & Web Console Modal */}
      <WifiTransferModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        onImportSong={handleWifiTransfer}
        currentSongTitle={currentSong.title}
      />

      {/* Modal 3: Song Information & Photo Carousel Editor (Up to 20 Photos) */}
      <SongEditModal
        key={editingSong?.id || currentSong.id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        song={editingSong || currentSong}
        onSave={handleSaveSong}
      />

      {/* Subtle Bottom Design Footer */}
      <footer className="relative z-20 py-2.5 px-6 border-t border-white/[0.05] bg-black/40 text-center text-[11px] text-white/40 flex items-center justify-between">
        <span>Concert Memory Player · 极简黑紫白三色系毛玻璃规范</span>
        <div className="flex items-center space-x-3">
          <span>📷 现场轮播相册已支持 (最多20张)</span>
          <span>✏️ 自定义时间/地点/歌手</span>
        </div>
      </footer>
    </div>
  );
}
