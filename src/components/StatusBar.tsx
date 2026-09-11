import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time = '9:41',
  className = '',
}) => {
  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-2 select-none text-white text-xs font-medium z-30 ${className}`}>
      {/* Time */}
      <span className="font-semibold tracking-tight">{time}</span>

      {/* Dynamic Island / Notch spacer placeholder on modern phones */}
      <div className="w-20 h-4 rounded-full bg-black/40 border border-white/5 mx-auto -mt-1 hidden sm:block opacity-60" />

      {/* Signal, WiFi, Battery */}
      <div className="flex items-center space-x-1.5 text-white/90">
        <Signal className="w-3.5 h-3.5 fill-current" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-current" />
      </div>
    </div>
  );
};
