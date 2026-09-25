import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Share2, 
  X, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { ConnectionStatus } from '../services/websocket';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ConnectionStatus;
  connectedCount: number;
  roomId: string;
  onChangeRoom: (newRoom: string) => void;
  userRole: 'HUSBAND' | 'WIFE';
  setUserRole: (role: 'HUSBAND' | 'WIFE') => void;
  onResetData: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  status,
  connectedCount,
  roomId,
  onChangeRoom,
  userRole,
  setUserRole,
  onResetData,
}) => {
  const [inputRoom, setInputRoom] = useState(roomId);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomId)}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      onChangeRoom(inputRoom.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                부부 2인 실시간 동기화 설정
              </h3>
              <p className="text-[11px] text-slate-500">
                10주년 여행 일정을 두 기기에서 실시간 공유
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Connection Status Box */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            status === 'CONNECTED'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {status === 'CONNECTED' ? (
                <Wifi className="w-4 h-4 text-emerald-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-rose-600" />
              )}
              <div>
                <span className="font-bold text-sm">
                  {status === 'CONNECTED' ? '실시간 동기화 서버 연결됨' : '연결 확인중'}
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  현재 방 접속 기기: <strong className="text-slate-900 font-bold">{connectedCount}대</strong>
                  {connectedCount >= 2 ? ' (남편 & 아내 모두 연결 완료! 💑)' : ' (배우자 접속 대기 중)'}
                </p>
              </div>
            </div>
          </div>

          {/* Role selector */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="block text-slate-700 font-bold mb-2">내 기기 사용자 역할:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserRole('HUSBAND')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                  userRole === 'HUSBAND'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🤵 남편 (Husband)</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('WIFE')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                  userRole === 'WIFE'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>👰 아내 (Wife)</span>
              </button>
            </div>
          </div>

          {/* Share Link for Spouse */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                배우자 폰으로 링크 공유
              </span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full">카톡/문자 전송</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
              아래 버튼을 눌러 링크를 복사한 후 배우자에게 보내면, 별도 로그인 없이 즉시 같은 일정과 예산이 실시간 동기화됩니다.
            </p>
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>동기화 링크가 복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>배우자 초대 링크 복사하기</span>
                </>
              )}
            </button>
          </div>

          {/* Custom Room Code Form */}
          <form onSubmit={handleSaveRoom} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-slate-700 font-bold">
              동기화 룸 코드 (Room ID):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value)}
                placeholder="egypt-10th"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-blue-600 text-xs"
              />
              <button
                type="submit"
                className="py-2 px-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
              >
                변경
              </button>
            </div>
          </form>

          {/* Reset initial data */}
          <div className="pt-1 flex items-center justify-between text-slate-500 text-[11px]">
            <span>처음 작성된 10주년 기본 일정 복구:</span>
            <button
              onClick={() => {
                if (confirm('기본 일정과 예산 데이터로 초기화하시겠습니까?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>기본값 복원</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
