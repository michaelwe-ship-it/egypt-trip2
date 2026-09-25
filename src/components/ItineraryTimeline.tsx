import React, { useState } from 'react';
import { 
  ItineraryItem, 
  City, 
  TransportType, 
  ItineraryStatus 
} from '../types/travel';
import { 
  Clock, 
  MapPin, 
  Plane, 
  Car, 
  Footprints, 
  Sailboat, 
  Bus, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  AlertCircle, 
  DollarSign, 
  CreditCard,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, convertAmount, DEFAULT_RATES } from '../services/currency';

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  selectedCity: City;
  onAddItem: (dayNumber: number) => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const DAYS_INFO = [
  { day: 1, dateStr: '10/28 (수)', title: '인천 출발 → 카이로 도착 · 메나하우스' },
  { day: 2, dateStr: '10/29 (목)', title: '기자 피라미드 · 대박물관(GEM) · 시장' },
  { day: 3, dateStr: '10/30 (금)', title: '룩소르 이동(MS074) · 힐튼 · 카르나크 신전' },
  { day: 4, dateStr: '10/31 (토)', title: '룩소르 서안투어 · 왕가의 계곡 · 펠루카' },
  { day: 5, dateStr: '11/1 (일)', title: '룩소르 시장 · 카이로 복귀(MS075) · 르메르디안' },
  { day: 6, dateStr: '11/2 (월)', title: '동굴교회 · 시타델 · 올드카이로 · 귀국(QR1302)' },
];

export const getTransportIcon = (type?: TransportType) => {
  switch (type) {
    case 'FLIGHT':
      return <Plane className="w-3.5 h-3.5 text-sky-400" />;
    case 'TAXI':
      return <Car className="w-3.5 h-3.5 text-amber-400" />;
    case 'WALK':
      return <Footprints className="w-3.5 h-3.5 text-emerald-400" />;
    case 'FELUCCA':
      return <Sailboat className="w-3.5 h-3.5 text-cyan-400" />;
    case 'TOUR_BUS':
      return <Bus className="w-3.5 h-3.5 text-indigo-400" />;
    default:
      return <MapPin className="w-3.5 h-3.5 text-stone-400" />;
  }
};

export const getTransportLabel = (type?: TransportType) => {
  switch (type) {
    case 'FLIGHT': return '항공';
    case 'TAXI': return '택시/차량';
    case 'WALK': return '도보';
    case 'FELUCCA': return '펠루카';
    case 'TOUR_BUS': return '투어차량';
    default: return '이동';
  }
};

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  items,
  selectedCity,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
}) => {
  const [activeDay, setActiveDay] = useState<number>(0); // 0 = All days

  // Filter items by city and active day
  const filteredItems = items.filter((item) => {
    if (selectedCity !== 'ALL' && item.city !== selectedCity) return false;
    if (activeDay !== 0 && item.dayNumber !== activeDay) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Day Selector Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveDay(0)}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDay === 0
              ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-600'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          전체 일정 (6일)
        </button>

        {DAYS_INFO.map((d) => {
          const isSelected = activeDay === d.day;
          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`px-3 py-1.5 rounded-2xl text-xs whitespace-nowrap transition-all flex flex-col items-start ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-xs ring-1 ring-blue-600'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>DAY {d.day}</span>
                <span className={`text-[10px] ${isSelected ? 'text-blue-100 font-semibold' : 'text-slate-400'}`}>
                  {d.dateStr.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Title Summary if single day selected */}
      {activeDay > 0 && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold">
                DAY {activeDay}
              </span>
              <span className="text-xs font-bold text-blue-900">
                {DAYS_INFO.find((d) => d.day === activeDay)?.dateStr}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {DAYS_INFO.find((d) => d.day === activeDay)?.title}
            </p>
          </div>
          <button
            onClick={() => onAddItem(activeDay)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            일정 추가
          </button>
        </div>
      )}

      {/* Timeline Stream */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 text-sm">해당 조건의 일정이 없습니다.</p>
          <button
            onClick={() => onAddItem(activeDay || 1)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />새 일정 만들기
          </button>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredItems.map((item, idx) => {
            const isCompleted = item.status === 'COMPLETED';
            const convertedKrw = item.cost 
              ? convertAmount(item.cost.amount, item.cost.currency, 'KRW', DEFAULT_RATES)
              : 0;

            return (
              <div 
                key={item.id} 
                className="relative group transition-all"
              >
                {/* Timeline node icon */}
                <button
                  onClick={() => onToggleStatus(item.id)}
                  className={`absolute -left-6 top-3.5 w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : item.highlight
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-white border-2 border-blue-600 ring-4 ring-blue-50 text-blue-600'
                  }`}
                  title={isCompleted ? '완료 취소' : '일정 완료 체크'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>

                {/* Card Container */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50/80 border-slate-200 opacity-70'
                      : item.highlight
                      ? 'bg-white border-amber-300 ring-2 ring-amber-100 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Top Bar: Day & Time & Transport */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeDay === 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                          DAY {item.dayNumber} ({item.dateStr.split(' ')[0]})
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-blue-600" />
                        {item.time}
                      </span>

                      {item.transport && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-700 border border-slate-200">
                          {getTransportIcon(item.transport)}
                          <span>{getTransportLabel(item.transport)}</span>
                          {item.transportNote && (
                            <span className="text-[10px] text-slate-500 max-w-[120px] truncate">
                              ({item.transportNote})
                            </span>
                          )}
                        </span>
                      )}

                      {item.highlight && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          하이라이트
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                        title="일정 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="일정 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className={`text-sm font-bold tracking-tight ${
                    isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Memo text if any */}
                  {item.memo && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                      {item.memo}
                    </p>
                  )}

                  {/* Travel Tips callout */}
                  {item.tips && (
                    <div className="mt-2 flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-800 mr-1">현지 Tip:</span>
                        {item.tips}
                      </div>
                    </div>
                  )}

                  {/* Cost & Quick Converter Preview */}
                  {item.cost && item.cost.amount > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.cost.amount, item.cost.currency)}
                        </span>
                        {item.cost.currency !== 'KRW' && (
                          <span className="text-[11px] text-slate-500">
                            (약 {Math.round(convertedKrw).toLocaleString()}원)
                          </span>
                        )}
                      </div>
                      {item.cost.description && (
                        <span className="text-[10px] text-slate-500 max-w-[140px] truncate">
                          {item.cost.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Add Item for Mobile */}
      <div className="pt-2 text-center">
        <button
          onClick={() => onAddItem(activeDay || 1)}
          className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>DAY {activeDay || 1} 새로운 일정 항목 추가</span>
        </button>
      </div>
    </div>
  );
};
