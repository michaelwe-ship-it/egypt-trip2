import React from 'react';
import { X, ShieldAlert, Phone, MapPin, ExternalLink, LifeBuoy } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                이집트 긴급 연락망 & 대사관
              </h3>
              <p className="text-[11px] text-slate-500">
                위급 상황 시 원터치 전화 연결
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          {/* Embassy Emergency */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                <span>🇰🇷</span> 주이집트 대한민국 대사관
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 font-bold shadow-xs">
                카이로 소재
              </span>
            </div>

            <div className="space-y-1.5 text-slate-700">
              <div className="flex items-start gap-1 text-[11px] text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>3 Boulos Hanna St., Dokki, Giza, Egypt</span>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-slate-600 font-medium">사건사고 24시간 긴급:</span>
                <a
                  href="tel:+201288722996"
                  className="font-mono font-bold text-rose-700 px-2.5 py-1 rounded-xl bg-white border border-rose-200 shadow-xs hover:bg-rose-100 transition"
                >
                  +20 12-8872-2996
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">대사관 대표전화:</span>
                <a
                  href="tel:+20237611234"
                  className="font-mono text-slate-800 px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition"
                >
                  +20 2-3761-1234
                </a>
              </div>
            </div>
          </div>

          {/* MOFA Seoul 24h Consular Call Center */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="font-bold text-slate-800">외교부 영사콜센터 (한국)</span>
              <p className="text-[10px] text-slate-500">24시간 연중무휴 통역 및 상담</p>
            </div>
            <a
              href="tel:+82232100404"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-mono font-bold text-blue-700 shadow-xs hover:bg-blue-50 transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-blue-600" />
              <span>+82 2-3210-0404</span>
            </a>
          </div>

          {/* Local Egypt Emergency Numbers */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block font-bold text-slate-700 mb-2">이집트 현지 긴급 신고 번호</span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:126"
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] text-slate-500">관광 경찰</span>
                  <div className="font-black text-blue-700 text-sm">126</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-blue-600" />
              </a>

              <a
                href="tel:123"
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] text-slate-500">구급차 (의료)</span>
                  <div className="font-black text-rose-600 text-sm">123</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-rose-600" />
              </a>

              <a
                href="tel:122"
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] text-slate-500">일반 경찰</span>
                  <div className="font-bold text-slate-800 text-sm">122</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-slate-600" />
              </a>

              <a
                href="tel:180"
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] text-slate-500">소방서</span>
                  <div className="font-bold text-amber-700 text-sm">180</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-amber-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
