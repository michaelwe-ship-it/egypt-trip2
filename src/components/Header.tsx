import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wifi, 
  WifiOff, 
  Clock, 
  ShieldAlert, 
  Heart, 
  Share2, 
  SlidersHorizontal 
} from 'lucide-react';
import { ConnectionStatus } from '../services/websocket';

interface HeaderProps {
  status: ConnectionStatus;
  connectedCount: number;
  userRole: 'HUSBAND' | 'WIFE';
  setUserRole: (role: 'HUSBAND' | 'WIFE') => void;
  roomId: string;
  onOpenSyncModal: () => void;
  onOpenEmergencyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  connectedCount,
  userRole,
  setUserRole,
  roomId,
  onOpenSyncModal,
  onOpenEmergencyModal,
}) => {
  const [cairoTime, setCairoTime] = useState<string>('');
  const [seoulTime, setSeoulTime] = useState<string>('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // Cairo is UTC+3 (or UTC+2 depending on DST, Cairo standard is GMT+3 currently)
      const cairoStr = now.toLocaleTimeString('ko-KR', {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const seoulStr = now.toLocaleTimeString('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCairoTime(cairoStr);
      setSeoulTime(seoulStr);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5">
        {/* Top Row: App Title & Sync Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xs text-white font-bold text-base">
              <span>𓂀</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900">
                  EGYPT 10주년 여행
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/70">
                  결혼 10주년
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                카이로 · 룩소르 · 10/28(수) ~ 11/3(화)
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Sync & Share button */}
            <button
              onClick={onOpenSyncModal}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition border border-slate-200 flex items-center justify-center shrink-0 shadow-xs relative"
              title="실시간 동기화 & 공유"
              aria-label="실시간 동기화"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              {connectedCount > 1 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </button>

            {/* Emergency button */}
            <button
              onClick={onOpenEmergencyModal}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200 flex items-center justify-center shrink-0 shadow-xs"
              title="긴급 연락망 & 대사관"
              aria-label="긴급 연락망"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-row: Dual Time & Role Toggle */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          {/* Dual Digital Clocks */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[12px]">🇪🇬</span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">카이로</span>
              <span className="font-mono text-slate-900 font-bold text-xs tracking-wider">
                {cairoTime || '--:--'}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[12px]">🇰🇷</span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">서울</span>
              <span className="font-mono text-slate-700 font-semibold text-xs tracking-wider">
                {seoulTime || '--:--'}
              </span>
            </div>
          </div>

          {/* Role selector pill */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setUserRole('HUSBAND')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition min-h-[28px] ${
                userRole === 'HUSBAND'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🤵 남편
            </button>
            <button
              onClick={() => setUserRole('WIFE')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition min-h-[28px] ${
                userRole === 'WIFE'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👰 아내
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
