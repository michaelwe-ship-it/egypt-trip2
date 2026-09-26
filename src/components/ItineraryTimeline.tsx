import React, { useState } from 'react';
import { 
  ItineraryItem, 
  City, 
  TransportType
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
  Sparkles, 
  AlertCircle, 
  CreditCard,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
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
      return <Plane className="w-3.5 h-3.5 text-sky-500" />;
    case 'TAXI':
      return <Car className="w-3.5 h-3.5 text-amber-500" />;
    case 'WALK':
      return <Footprints className="w-3.5 h-3.5 text-emerald-500" />;
    case 'FELUCCA':
      return <Sailboat className="w-3.5 h-3.5 text-cyan-500" />;
    case 'TOUR_BUS':
      return <Bus className="w-3.5 h-3.5 text-indigo-500" />;
    default:
      return <MapPin className="w-3.5 h-3.5 text-slate-400" />;
  }
};

export const getTransportLabel = (type?: TransportType) => {
  switch (type) {
    case 'FLIGHT': return '항공';
    case 'TAXI': return '차량';
    case 'WALK': return '도보';
    case 'FELUCCA': return '펠루카';
    case 'TOUR_BUS': return '투어';
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
  const [activeDay, setActiveDay] = useState<number>(1); // Default to DAY 1 for clean focus
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState<boolean>(false);

  const handleCopyLocation = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleItemExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? expandAll),
    }));
  };

  const handleToggleExpandAll = () => {
    const next = !expandAll;
    setExpandAll(next);
    setExpandedIds({});
  };

  // Filter items by city and active day
  const filteredItems = items.filter((item) => {
    if (selectedCity !== 'ALL' && item.city !== selectedCity) return false;
    if (activeDay !== 0 && item.dayNumber !== activeDay) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Day Selector Bar + Expand All Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveDay(0)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] flex items-center justify-center active:scale-95 ${
              activeDay === 0
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            전체
          </button>

          {DAYS_INFO.map((d) => {
            const isSelected = activeDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all min-h-[38px] flex flex-col items-center justify-center active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="font-bold leading-tight">DAY {d.day}</span>
                <span className={`text-[10px] leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {d.dateStr.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleToggleExpandAll}
          className="shrink-0 px-2.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition active:scale-95 min-h-[38px]"
          title={expandAll ? '상세 내용 모두 접기' : '상세 내용 모두 펼치기'}
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">{expandAll ? '모두 접기' : '모두 펼치기'}</span>
          <span className="sm:hidden">{expandAll ? '접기' : '펼치기'}</span>
        </button>
      </div>

      {/* Day Title Summary if single day selected */}
      {activeDay > 0 && (
        <div className="px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-extrabold text-blue-600">DAY {activeDay}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-700">
                {DAYS_INFO.find((d) => d.day === activeDay)?.dateStr}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
              {DAYS_INFO.find((d) => d.day === activeDay)?.title}
            </p>
          </div>
          <button
            onClick={() => onAddItem(activeDay)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-2xs transition shrink-0 min-h-[34px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>추가</span>
          </button>
        </div>
      )}

      {/* Timeline Stream */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 text-sm">해당 조건의 일정이 없습니다.</p>
          <button
            onClick={() => onAddItem(activeDay || 1)}
            className="mt-3 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 hover:bg-blue-700 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />새 일정 만들기
          </button>
        </div>
      ) : (
        <div className="relative pl-6 space-y-2.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredItems.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const hasDetails = Boolean(item.memo || item.tips || (item.cost && item.cost.amount > 0) || item.transportNote);
            const isExpanded = expandedIds[item.id] ?? expandAll;
            const convertedKrw = item.cost 
              ? convertAmount(item.cost.amount, item.cost.currency, 'KRW', DEFAULT_RATES)
              : 0;

            return (
              <div 
                key={item.id} 
                className="relative group transition-all"
              >
                {/* Timeline node icon with thumb touch area */}
                <button
                  onClick={() => onToggleStatus(item.id)}
                  className="absolute -left-6 top-2.5 w-6 h-6 flex items-center justify-center active:scale-90 transition z-10"
                  title={isCompleted ? '완료 취소' : '일정 완료 체크'}
                  aria-label="완료 토글"
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-3 ring-emerald-100'
                      : item.highlight
                      ? 'bg-amber-500 text-white ring-3 ring-amber-100'
                      : 'bg-white border-2 border-blue-600 ring-3 ring-blue-50 text-blue-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </span>
                </button>

                {/* Card Container */}
                <div
                  onClick={() => hasDetails && toggleItemExpand(item.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
                    hasDetails ? 'cursor-pointer' : ''
                  } ${
                    isCompleted
                      ? 'bg-slate-50/70 border-slate-200 opacity-65'
                      : item.highlight
                      ? 'bg-white border-amber-300/90 shadow-2xs hover:border-amber-400'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Top Bar: Clean Unboxed Metadata + Right Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 min-w-0">
                      {activeDay === 0 && (
                        <>
                          <span className="font-bold text-slate-700">
                            DAY {item.dayNumber}
                          </span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}

                      <span className="flex items-center gap-1 font-mono font-bold text-blue-600">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>

                      {item.transport && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                            {getTransportIcon(item.transport)}
                            <span>{getTransportLabel(item.transport)}</span>
                          </span>
                        </>
                      )}

                      {item.highlight && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-600 font-bold text-[11px]">
                            <Sparkles className="w-3 h-3" />
                            <span>핵심</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div
                      className="flex items-center gap-0.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEditItem(item)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition flex items-center justify-center"
                        title="일정 수정"
                        aria-label="수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition flex items-center justify-center"
                        title="일정 삭제"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-sm font-bold tracking-tight mt-1 ${
                    isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>

                  {/* Compact Footer Row: Location + Copy + Expand Indicator */}
                  <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 min-w-0 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <button
                        onClick={(e) => handleCopyLocation(e, item.id, item.location)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-100 flex items-center gap-0.5 shrink-0 transition"
                        title="주소 복사"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    {hasDetails && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemExpand(item.id);
                        }}
                        className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 py-0.5 px-1.5 rounded-lg hover:bg-blue-50/60 transition"
                      >
                        {!isExpanded && item.cost && item.cost.amount > 0 && (
                          <span className="text-slate-500 font-mono mr-0.5">
                            {formatCurrency(item.cost.amount, item.cost.currency)} ·
                          </span>
                        )}
                        <span>{isExpanded ? '접기' : '상세'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expandable Details Section */}
                  {hasDetails && isExpanded && (
                    <div
                      className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.transportNote && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">이동 참고:</span>
                          <span>{item.transportNote}</span>
                        </div>
                      )}

                      {item.memo && (
                        <p className="text-xs text-slate-600 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                          {item.memo}
                        </p>
                      )}

                      {item.tips && (
                        <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-800 mr-1">현지 Tip:</span>
                            {item.tips}
                          </div>
                        </div>
                      )}

                      {item.cost && item.cost.amount > 0 && (
                        <div className="flex items-center justify-between text-xs bg-slate-50/90 px-3 py-2 rounded-xl border border-slate-200/60">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-bold text-slate-900 font-mono">
                              {formatCurrency(item.cost.amount, item.cost.currency)}
                            </span>
                            {item.cost.currency !== 'KRW' && (
                              <span className="text-[11px] text-slate-500 font-mono">
                                (약 {Math.round(convertedKrw).toLocaleString()}원)
                              </span>
                            )}
                          </div>
                          {item.cost.description && (
                            <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                              {item.cost.description}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Item Button */}
      <div className="pt-1">
        <button
          onClick={() => onAddItem(activeDay || 1)}
          className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs min-h-[42px]"
        >
          <Plus className="w-4 h-4" />
          <span>DAY {activeDay || 1} 일정 추가</span>
        </button>
      </div>
    </div>
  );
};
