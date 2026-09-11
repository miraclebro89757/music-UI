import React, { useState } from 'react';
import { X, Send, Smile, MessageCircle, Keyboard, Sparkles } from 'lucide-react';

interface DanmakuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  className?: string;
  isInline?: boolean; // When rendered inline in the showcase canvas
}

const PRESET_EMOJIS = ['💜', '✨', '🔥', '😭', '🎉', '🎸', '🎤', '🙌'];
const QUICK_TAGS = ['现场封神', '万人大合唱', '这首直接泪目', '永远的经典', '此生无悔'];

export const DanmakuModal: React.FC<DanmakuModalProps> = ({
  isOpen,
  onClose,
  onSend,
  className = '',
  isInline = false,
}) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!isOpen && !isInline) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    if (!isInline) {
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    setText((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => `${prev}${emoji}`);
  };

  const content = (
    <div
      className={`w-full rounded-3xl bg-[#181126]/95 backdrop-blur-2xl border border-white/[0.12] p-4 sm:p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Row: Close Button */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="text-[11px] text-white/40">发弹幕参与现场互动</span>
      </div>

      {/* Middle Row: Avatar + Capsule Input + Purple Send Button */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-3">
        {/* Avatar Ring */}
        <div className="w-8 h-8 rounded-full border border-purple-400/50 bg-purple-900/30 flex items-center justify-center shrink-0 text-xs">
          <span>💜</span>
        </div>

        {/* Capsule Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="发一条弹幕..."
            autoFocus={!isInline}
            className="w-full bg-white/[0.06] text-xs sm:text-sm text-white placeholder-white/40 px-3.5 py-2 rounded-full border border-white/10 focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.09] transition-all"
          />
        </div>

        {/* Purple Send Button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-8 h-8 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.6)] active:scale-95"
          title="发送"
        >
          <Send className="w-3.5 h-3.5 -translate-x-0.5 translate-y-0.5" />
        </button>
      </form>

      {/* Emoji Bar / Quick tags */}
      {showEmojiPicker && (
        <div className="flex items-center justify-between p-2 mb-3 rounded-xl bg-black/40 border border-white/5 text-lg">
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="hover:scale-125 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Quick Tags Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] text-purple-200 whitespace-nowrap transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Bottom Row: Icons */}
      <div className="flex items-center justify-end space-x-3 pt-1 text-white/50 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-1 rounded-full transition-colors cursor-pointer ${
            showEmojiPicker ? 'text-purple-400' : 'hover:text-white'
          }`}
          title="表情"
        >
          <Smile className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTagClick('紫海合唱')}
          className="p-1 rounded-full hover:text-white transition-colors cursor-pointer"
          title="互动语"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(false)}
          className="p-1 rounded-full hover:text-white transition-colors cursor-pointer"
          title="键盘"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm">
        {content}
      </div>
    </div>
  );
};
