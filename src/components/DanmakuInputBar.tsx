import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface DanmakuInputBarProps {
  onSendDanmaku: (text: string) => void;
  disabled?: boolean;
}

const QUICK_REACTIONS = [
  '💜 紫海大合唱',
  '✨ 鸡皮疙瘩起来了',
  '🔥 现场音浪太震撼',
  '🎵 泪目安可',
];

export const DanmakuInputBar: React.FC<DanmakuInputBarProps> = ({
  onSendDanmaku,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendDanmaku(inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (tag: string) => {
    onSendDanmaku(tag);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 z-30">
      <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* Quick Reaction Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
          {QUICK_REACTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickSend(tag)}
              className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 hover:border-purple-400/40 text-purple-200 transition-all cursor-pointer active:scale-95"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Input & Send Form */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
          <div className="relative flex-1">
            <input
              id="danmaku-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="发条弹幕，记录演唱会此刻的心动..."
              disabled={disabled}
              maxLength={60}
              className="w-full bg-black/40 text-white placeholder-white/40 text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <button
            id="send-danmaku-btn"
            type="submit"
            disabled={!inputText.trim() || disabled}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.35)] shrink-0 active:scale-95"
          >
            <Send className="w-3 h-3" />
            <span>发送</span>
          </button>
        </form>
      </div>
    </div>
  );
};
