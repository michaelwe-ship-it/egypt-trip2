import React, { useState } from 'react';
import { ItineraryItem, City } from '../types/travel';
import { 
  MapPin, 
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
  Circle,
  ChevronsUpDown,
  BedDouble,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { getTransportIcon, getTransportLabel, DAYS_INFO, getGoogleMapsUrl } from './ItineraryTimeline';
import { formatCurrency, convertAmount, DEFAULT_RATES } from '../services/currency';

interface ItineraryDetailedProps {
  items: ItineraryItem[];
  selectedCity: City;
  onAddItem: (dayNumber: number) => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onReorderItems?: (items: ItineraryItem[]) => void;
}

export const ItineraryDetailed: React.FC<ItineraryDetailedProps> = ({
  items,
  selectedCity,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
  onReorderItems,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [expandAllDetails, setExpandAllDetails] = useState<boolean>(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const toggleDayExpand = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleItemExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !(prev[id] ?? expandAllDetails),
    }));
  };

  const handleToggleAll = () => {
    const next = !expandAllDetails;
    setExpandAllDetails(next);
    setExpandedDays({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
    setExpandedItems({});
  };

  const handleCopyLocation = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleMoveInDay = (e: React.MouseEvent, dayNum: number, itemId: string, direction: 'UP' | 'DOWN') => {
    e.stopPropagation();
    if (!onReorderItems) return;

    const dayList = items
      .filter(it => it.dayNumber === dayNum)
      .filter(it => selectedCity === 'ALL' || it.city === selectedCity);

    const idx = dayList.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= dayList.length) return;

    const sourceItem = dayList[idx];
    const targetItem = dayList[targetIdx];

    const nextItems = [...items];
    const mSource = nextItems.findIndex(i => i.id === sourceItem.id);
    const mTarget = nextItems.findIndex(i => i.id === targetItem.id);
    if (mSource === -1 || mTarget === -1) return;

    nextItems[mSource] = targetItem;
    nextItems[mTarget] = sourceItem;
    onReorderItems(nextItems);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedItemId || e.dataTransfer.getData('text/plain');
    setDraggedItemId(null);

    if (!sourceId || sourceId === targetId || !onReorderItems) return;

    const sourceIdx = items.findIndex((i) => i.id === sourceId);
    const targetIdx = items.findIndex((i) => i.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const nextItems = [...items];
    const [moved] = nextItems.splice(sourceIdx, 1);
    const targetItem = items[targetIdx];

    if (moved.dayNumber !== targetItem.dayNumber) {
      moved.dayNumber = targetItem.dayNumber;
      moved.dateStr = targetItem.dateStr;
    }

    const newTargetIdx = nextItems.findIndex((i) => i.id === targetId);
    const insertAt = sourceIdx < targetIdx ? newTargetIdx + 1 : newTargetIdx;
    nextItems.splice(insertAt, 0, moved);
    onReorderItems(nextItems);
  };

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
    <div className="space-y-3">
      {/* Global Expand/Collapse Control */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>날짜를 눌러 일정을 열거나, 개별 항목을 눌러 상세 팁을 확인하세요.</span>
        <button
          onClick={handleToggleAll}
          className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
          <span>{expandAllDetails ? '상세 모두 접기' : '상세 모두 펼치기'}</span>
        </button>
      </div>

      {days.map((dayNum) => {
        const dayItems = items
          .filter(it => it.dayNumber === dayNum)
          .filter(it => selectedCity === 'ALL' || it.city === selectedCity);

        if (dayItems.length === 0 && selectedCity !== 'ALL') {
          return null;
        }

        const isExpanded = expandedDays[dayNum] ?? false;
        const summary = daySummaries[dayNum];
        const dayInfo = DAYS_INFO.find(d => d.day === dayNum);

        const dayTotalKrw = dayItems.reduce((acc, it) => {
          if (!it.cost || !it.cost.amount) return acc;
          return acc + convertAmount(it.cost.amount, it.cost.currency, 'KRW', DEFAULT_RATES);
        }, 0);

        const completedCount = dayItems.filter(i => i.status === 'COMPLETED').length;

        return (
          <div
            key={dayNum}
            className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs"
          >
            {/* Day Header Accordion */}
            <div
              onClick={() => toggleDayExpand(dayNum)}
              className="p-3.5 sm:p-4 bg-slate-50/70 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/70 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-blue-600 text-white shrink-0">
                  <span className="text-[9px] font-bold text-blue-100 leading-none">DAY</span>
                  <span className="text-base font-black leading-tight">{dayNum}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-bold text-blue-700">{summary?.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-600">{summary?.city}</span>
                    {dayItems.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[11px] text-slate-500">
                          {completedCount}/{dayItems.length} 완료
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {summary?.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {dayTotalKrw > 0 && (
                  <span className="hidden sm:inline-block text-xs font-mono font-semibold text-slate-600">
                    약 {Math.round(dayTotalKrw).toLocaleString()}원
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* Day Content */}
            {isExpanded && (
              <div className="p-3.5 sm:p-4 space-y-2.5 border-t border-slate-200/70">
                {/* Dedicated Day Accommodation Section */}
                {dayInfo && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <BedDouble className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-bold">
                          <span>오늘의 숙소</span>
                          <span>·</span>
                          <span>{dayInfo.hotelBadge}</span>
                        </div>
                        <a
                          href={getGoogleMapsUrl(dayInfo.hotelQuery)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-900 hover:text-blue-600 hover:underline inline-flex items-center gap-1 max-w-full"
                        >
                          <span className="truncate">{dayInfo.hotelName}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleCopyLocation(e, `det_hotel_${dayNum}`, dayInfo.hotelQuery)}
                      className="px-2 py-1 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center gap-1 shrink-0 transition"
                    >
                      {copiedId === `det_hotel_${dayNum}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>복사</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="divide-y divide-slate-100 space-y-2.5">
                  {dayItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      이 날짜에 등록된 일정이 없습니다.
                    </div>
                  ) : (
                    dayItems.map((item, idx) => {
                      const isCompleted = item.status === 'COMPLETED';
                      const hasDetails = Boolean(item.memo || item.tips || (item.cost && item.cost.amount > 0));
                      const isItemOpen = expandedItems[item.id] ?? expandAllDetails;
                      const krwVal = item.cost
                        ? convertAmount(item.cost.amount, item.cost.currency, 'KRW', DEFAULT_RATES)
                        : 0;

                      return (
                        <div
                          key={item.id}
                          draggable={Boolean(onReorderItems)}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item.id)}
                          onClick={() => hasDetails && toggleItemExpand(item.id)}
                          className={`pt-2.5 first:pt-0 ${hasDetails ? 'cursor-pointer' : ''} ${
                            isCompleted ? 'opacity-65' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              {onReorderItems && (
                                <span
                                  className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0"
                                  title="드래그하여 순서 변경"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </span>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleStatus(item.id);
                                }}
                                className={`mt-0.5 p-0.5 rounded-md transition shrink-0 ${
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

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                                  <span className="font-mono font-bold text-blue-600">
                                    {item.time}
                                  </span>

                                  {item.transport && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="inline-flex items-center gap-1 text-slate-600">
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

                                <h4 className={`text-sm font-bold mt-0.5 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {item.title}
                                </h4>

                                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                                  <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                                  <a
                                    href={getGoogleMapsUrl(item.location)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="truncate text-slate-700 hover:text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                                    title="구글 맵스에서 위치 열기"
                                  >
                                    <span className="truncate">{item.location}</span>
                                    <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                  </a>
                                  <button
                                    onClick={(e) => handleCopyLocation(e, item.id, item.location)}
                                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-slate-100 shrink-0 transition"
                                  >
                                    {copiedId === item.id ? (
                                      <>
                                        <Check className="w-2.5 h-2.5 text-emerald-600" />
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
                              </div>
                            </div>

                            <div
                              className="flex items-center gap-0.5 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {onReorderItems && (
                                <>
                                  <button
                                    onClick={(e) => handleMoveInDay(e, dayNum, item.id, 'UP')}
                                    disabled={idx === 0}
                                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition"
                                    title="위로 이동"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => handleMoveInDay(e, dayNum, item.id, 'DOWN')}
                                    disabled={idx === dayItems.length - 1}
                                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition"
                                    title="아래로 이동"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                              {hasDetails && (
                                <button
                                  onClick={() => toggleItemExpand(item.id)}
                                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-0.5 transition"
                                >
                                  <span>{isItemOpen ? '접기' : '상세'}</span>
                                  {isItemOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => onEditItem(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          {hasDetails && isItemOpen && (
                            <div
                              className="mt-2 ml-6 space-y-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.memo && (
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                                  {item.memo}
                                </div>
                              )}

                              {item.tips && (
                                <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-amber-800">팁/주의:</span>{' '}
                                    {item.tips}
                                  </div>
                                </div>
                              )}

                              {item.cost && item.cost.amount > 0 && (
                                <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                                  <div className="flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="font-bold text-slate-900 font-mono">
                                      {formatCurrency(item.cost.amount, item.cost.currency)}
                                    </span>
                                    {item.cost.currency !== 'KRW' && (
                                      <span className="text-[11px] text-slate-500 font-mono">
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
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

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
