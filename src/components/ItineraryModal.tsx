import React, { useState, useEffect } from 'react';
import { 
  ItineraryItem, 
  City, 
  TransportType, 
  Currency, 
  ItineraryStatus 
} from '../types/travel';
import { X, Sparkles, MapPin, Clock, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { DAYS_INFO } from './ItineraryTimeline';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ItineraryItem) => void;
  initialItem?: ItineraryItem | null;
  defaultDayNumber?: number;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultDayNumber = 1,
}) => {
  const [dayNumber, setDayNumber] = useState<number>(defaultDayNumber);
  const [dateStr, setDateStr] = useState<string>('10/28 (수)');
  const [city, setCity] = useState<'CAIRO' | 'LUXOR'>('CAIRO');
  const [time, setTime] = useState<string>('12:00');
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [transport, setTransport] = useState<TransportType>('TAXI');
  const [transportNote, setTransportNote] = useState<string>('');
  const [status, setStatus] = useState<ItineraryStatus>('PLANNED');
  const [hasCost, setHasCost] = useState<boolean>(false);
  const [costAmount, setCostAmount] = useState<number>(0);
  const [costCurrency, setCostCurrency] = useState<Currency>('EGP');
  const [costDesc, setCostDesc] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [tips, setTips] = useState<string>('');
  const [highlight, setHighlight] = useState<boolean>(false);

  useEffect(() => {
    if (initialItem) {
      setDayNumber(initialItem.dayNumber);
      setDateStr(initialItem.dateStr);
      setCity(initialItem.city);
      setTime(initialItem.time);
      setTitle(initialItem.title);
      setLocation(initialItem.location);
      setTransport(initialItem.transport || 'TAXI');
      setTransportNote(initialItem.transportNote || '');
      setStatus(initialItem.status);
      setHighlight(!!initialItem.highlight);
      setMemo(initialItem.memo || '');
      setTips(initialItem.tips || '');
      if (initialItem.cost) {
        setHasCost(true);
        setCostAmount(initialItem.cost.amount);
        setCostCurrency(initialItem.cost.currency);
        setCostDesc(initialItem.cost.description || '');
      } else {
        setHasCost(false);
        setCostAmount(0);
      }
    } else {
      setDayNumber(defaultDayNumber);
      const dayInfo = DAYS_INFO.find(d => d.day === defaultDayNumber);
      setDateStr(dayInfo ? dayInfo.dateStr : '10/28 (수)');
      setCity(defaultDayNumber >= 3 && defaultDayNumber <= 5 ? 'LUXOR' : 'CAIRO');
      setTime('10:00');
      setTitle('');
      setLocation('');
      setTransport('TAXI');
      setTransportNote('');
      setStatus('PLANNED');
      setHasCost(false);
      setCostAmount(0);
      setCostCurrency('EGP');
      setCostDesc('');
      setMemo('');
      setTips('');
      setHighlight(false);
    }
  }, [initialItem, defaultDayNumber, isOpen]);

  const handleDayChange = (newDay: number) => {
    setDayNumber(newDay);
    const dayInfo = DAYS_INFO.find(d => d.day === newDay);
    if (dayInfo) {
      setDateStr(dayInfo.dateStr);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      alert('일정 제목과 장소를 입력해주세요.');
      return;
    }

    const newItem: ItineraryItem = {
      id: initialItem ? initialItem.id : `itinerary_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dayNumber,
      dateStr,
      city,
      time,
      title: title.trim(),
      location: location.trim(),
      transport,
      transportNote: transportNote.trim() || undefined,
      status,
      memo: memo.trim() || undefined,
      tips: tips.trim() || undefined,
      highlight,
      cost: hasCost && costAmount > 0 ? {
        amount: costAmount,
        currency: costCurrency,
        description: costDesc.trim() || undefined,
      } : undefined,
    };

    onSave(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              {initialItem ? '✎' : '+'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialItem ? '일정 수정하기' : '새 일정 등록하기'}
              </h3>
              <p className="text-[11px] text-slate-500">
                실시간으로 배우자 기기에도 즉시 동기화됩니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Day & Date & City */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">일차 (Day)</label>
              <select
                value={dayNumber}
                onChange={(e) => handleDayChange(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
              >
                {DAYS_INFO.map(d => (
                  <option key={d.day} value={d.day}>
                    DAY {d.day} ({d.dateStr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">도시 (City)</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
              >
                <option value="CAIRO">카이로 (Cairo)</option>
                <option value="LUXOR">룩소르 (Luxor)</option>
              </select>
            </div>
          </div>

          {/* Time & Highlight */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">시간 (HH:mm)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">하이라이트 여부</label>
              <button
                type="button"
                onClick={() => setHighlight(!highlight)}
                className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition ${
                  highlight
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{highlight ? '🌟 주요 명소' : '일반 일정'}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">일정명 (Title) *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 기자 피라미드 투어, 힐튼 체크인, 펠루카 탑승"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white placeholder:text-slate-400 text-sm font-semibold"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">장소 / 위치 (Location) *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: Giza Necropolis, Al Haram / 힐튼 룩소르"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white placeholder:text-slate-400"
            />
          </div>

          {/* Transport */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">이동 수단</label>
              <select
                value={transport}
                onChange={(e) => setTransport(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white font-medium"
              >
                <option value="TAXI">택시 / 차량 (TAXI)</option>
                <option value="FLIGHT">비행기 (FLIGHT)</option>
                <option value="WALK">도보 (WALK)</option>
                <option value="FELUCCA">펠루카 (FELUCCA)</option>
                <option value="TOUR_BUS">투어 버스 (TOUR_BUS)</option>
                <option value="OTHER">기타 (OTHER)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">교통 메모</label>
              <input
                type="text"
                value={transportNote}
                onChange={(e) => setTransportNote(e.target.value)}
                placeholder="예: Sharky 기사 픽업, 도보 5분"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Cost Checkbox & Inputs */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCost}
                  onChange={(e) => setHasCost(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 bg-white border-slate-300"
                />
                <span className="font-bold text-slate-800">예상 비용 입력</span>
              </label>
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>

            {hasCost && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="number"
                    value={costAmount || ''}
                    onChange={(e) => setCostAmount(Number(e.target.value))}
                    placeholder="금액 (숫자만)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <select
                    value={costCurrency}
                    onChange={(e) => setCostCurrency(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="EGP">EGP (파운드)</option>
                    <option value="USD">USD (달러)</option>
                    <option value="KRW">KRW (원화)</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={costDesc}
                    onChange={(e) => setCostDesc(e.target.value)}
                    placeholder="비용 메모 (예: 2인 입장료 + 셔틀)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 text-[11px] focus:outline-hidden focus:border-blue-600 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Detailed Memo */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">상세 일정 메모</label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="필요한 준비물, 체크인 안내, 이동 세부 사항 등"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          {/* Local Tips */}
          <div>
            <label className="block text-amber-800 font-semibold mb-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              현지 바가지 방지 / 꿀팁
            </label>
            <textarea
              rows={2}
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="예: 삐끼는 라 슈크란으로 거절, 물 필수, 카드 전용 결제 등"
              className="w-full bg-amber-50/70 border border-amber-200 rounded-xl px-3 py-2 text-amber-900 focus:outline-hidden focus:border-amber-400 focus:bg-white placeholder:text-amber-700/50 leading-relaxed"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition"
            >
              {initialItem ? '수정 완료' : '일정 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
