import React, { useState } from 'react';
import { ItineraryItem, City } from '../types/travel';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { getTransportIcon, getTransportLabel } from './ItineraryTimeline';
import { formatCurrency, convertAmount, DEFAULT_RATES } from '../services/currency';

interface ItineraryDetailedProps {
  items: ItineraryItem[];
  selectedCity: City;
  onAddItem: (dayNumber: number) => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const ItineraryDetailed: React.FC<ItineraryDetailedProps> = ({
  items,
  selectedCity,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  const toggleDayExpand = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleCopyLocation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Group items by day
  const days = [1, 2, 3, 4, 5, 6];

  const daySummaries: Record<number, { title: string; date: string; city: string }> = {
    1: { title: '인천 출발 → 카이로 도착 & 메나 하우스 체크인', date: '10/28 (수)', city: '카이로' },
    2: { title: '기자 피라미드 & 대박물관(GEM) & 칸 엘 칼릴리 시장', date: '10/29 (목)', city: '카이로' },
    3: { title: '룩소르 이동(MS074) & 힐튼 체크인 & 카르나크 신전 야경', date: '10/30 (금)', city: '룩소르' },
    4: { title: '룩소르 서안 투어 (왕가의 계곡) & 나일강 펠루카 일몰', date: '10/31 (토)', city: '룩소르' },
    5: { title: '룩소르 시장 & 카이로 복귀(MS075) & 르메르디안 체크인', date: '11/1 (일)', city: '카이로/룩소르' },
    6: { title: '시몬 동굴 교회 & 카이로 성채(시타델) & 귀국(QR1302)', date: '11/2 (월)', city: '카이로' },
  };

  return (
    <div className="space-y-4">
      {days.map((dayNum) => {
        const dayItems = items
          .filter(it => it.dayNumber === dayNum)
          .filter(it => selectedCity === 'ALL' || it.city === selectedCity)
          .sort((a, b) => a.time.localeCompare(b.time));

        if (dayItems.length === 0 && selectedCity !== 'ALL') {
          return null; // hide days with 0 items for filtered city
        }

        const isExpanded = expandedDays[dayNum] ?? true;
        const summary = daySummaries[dayNum];

        // Calculate day's total estimated costs in KRW
        const dayTotalKrw = dayItems.reduce((acc, it) => {
          if (!it.cost || !it.cost.amount) return acc;
          return acc + convertAmount(it.cost.amount, it.cost.currency, 'KRW', DEFAULT_RATES);
        }, 0);

        const completedCount = dayItems.filter(i => i.status === 'COMPLETED').length;

        return (
          <div
            key={dayNum}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Day Header Accordion */}
            <div
              onClick={() => toggleDayExpand(dayNum)}
              className="p-4 bg-slate-50/80 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/80 transition border-b border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                  <span className="text-[10px] font-bold text-blue-600">DAY</span>
                  <span className="text-lg font-black leading-none">{dayNum}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700">
                      {summary?.date}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 font-medium">
                      {summary?.city}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[11px] text-slate-500">
                        ({completedCount}/{dayItems.length} 완료)
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                    {summary?.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {dayTotalKrw > 0 && (
                  <span className="hidden sm:inline-block text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    약 {Math.round(dayTotalKrw).toLocaleString()}원
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {/* Day Content */}
            {isExpanded && (
              <div className="p-4 space-y-3.5 divide-y divide-slate-100">
                {dayItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    이 날짜에 등록된 일정이 없습니다.
                  </div>
                ) : (
                  dayItems.map((item) => {
                    const isCompleted = item.status === 'COMPLETED';
                    const krwVal = item.cost
                      ? convertAmount(item.cost.amount, item.cost.currency, 'KRW', DEFAULT_RATES)
                      : 0;

                    return (
                      <div
                        key={item.id}
                        className={`pt-3.5 first:pt-0 ${isCompleted ? 'opacity-65' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            {/* Complete toggle checkbox */}
                            <button
                              onClick={() => onToggleStatus(item.id)}
                              className={`mt-0.5 p-0.5 rounded-md transition ${
                                isCompleted
                                  ? 'text-emerald-600'
                                  : 'text-slate-400 hover:text-blue-600'
                              }`}
                              title={isCompleted ? '완료 취소' : '일정 완료'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                  {item.time}
                                </span>

                                {item.transport && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    {getTransportIcon(item.transport)}
                                    {getTransportLabel(item.transport)}
                                    {item.transportNote && ` · ${item.transportNote}`}
                                  </span>
                                )}

                                {item.highlight && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                    하이라이트
                                  </span>
                                )}
                              </div>

                              <h4 className={`text-sm font-bold mt-1 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {item.title}
                              </h4>

                              {/* Location with quick copy */}
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>{item.location}</span>
                                </div>
                                <button
                                  onClick={() => handleCopyLocation(item.id, item.location)}
                                  className="text-[10px] text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                                  title="장소명 복사 (Uber/구글맵 검색용)"
                                >
                                  {copiedId === item.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-700">복사됨</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>복사</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Action icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onEditItem(item)}
                              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Full Memo Description */}
                        {item.memo && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                            {item.memo}
                          </div>
                        )}

                        {/* Tips & Precautions */}
                        {item.tips && (
                          <div className="mt-2 flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-800">팁/주의:</span>{' '}
                              {item.tips}
                            </div>
                          </div>
                        )}

                        {/* Cost Row */}
                        {item.cost && item.cost.amount > 0 && (
                          <div className="mt-2 flex items-center justify-between text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-bold text-slate-900">
                                {formatCurrency(item.cost.amount, item.cost.currency)}
                              </span>
                              {item.cost.currency !== 'KRW' && (
                                <span className="text-[11px] text-slate-500">
                                  (약 {Math.round(krwVal).toLocaleString()}원)
                                </span>
                              )}
                            </div>
                            {item.cost.description && (
                              <span className="text-[11px] text-slate-500">
                                {item.cost.description}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Quick Add button for this specific day */}
                <div className="pt-2 text-right">
                  <button
                    onClick={() => onAddItem(dayNum)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
                  >
                    + DAY {dayNum}에 새 항목 추가
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
