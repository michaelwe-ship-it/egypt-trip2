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
                카이로 · 룩소르 · 10/28(수) ~ 11/2(월)
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Real-time couple sync button */}
            <button
              onClick={onOpenSyncModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs ${
                status === 'CONNECTED'
                  ? connectedCount > 1
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100'
                  : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
              }`}
              title="부부 실시간 동기화 설정"
            >
              {status === 'CONNECTED' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{connectedCount > 1 ? '부부 2인 동기화' : '실시간 연결됨'}</span>
                  <Users className="w-3.5 h-3.5 opacity-80" />
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>연결 시도중</span>
                </>
              )}
            </button>

            {/* Emergency button */}
            <button
              onClick={onOpenEmergencyModal}
              className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200"
              title="긴급 연락망 & 대사관"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-row: Dual Time & Role Toggle */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          {/* Dual Digital Clocks */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px]">🇪🇬</span>
              <span className="text-[11px] text-slate-500 font-medium">카이로</span>
              <span className="font-mono text-slate-900 font-bold text-xs tracking-wider">
                {cairoTime || '--:--'}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px]">🇰🇷</span>
              <span className="text-[11px] text-slate-500 font-medium">서울</span>
              <span className="font-mono text-slate-700 font-semibold text-xs tracking-wider">
                {seoulTime || '--:--'}
              </span>
            </div>
          </div>

          {/* Role selector pill */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setUserRole('HUSBAND')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition ${
                userRole === 'HUSBAND'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🤵 남편
            </button>
            <button
              onClick={() => setUserRole('WIFE')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition ${
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
