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
  ChevronsUpDown,
  BedDouble,
  ExternalLink,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency, convertAmount, DEFAULT_RATES } from '../services/currency';

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  selectedCity: City;
  onAddItem: (dayNumber: number) => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onReorderItems?: (items: ItineraryItem[]) => void;
}

export interface DayInfo {
  day: number;
  dateStr: string;
  title: string;
  hotelName: string;
  hotelQuery: string;
  hotelBadge: string;
  hotelNote: string;
}

export const DAYS_INFO: DayInfo[] = [
  {
    day: 1,
    dateStr: '10/28 (수)',
    title: '인천 출발(00:20 QR859) → 카이로 도착(12:05 QR1303) · 메나하우스 체크인',
    hotelName: 'Marriott Mena House, Cairo (메리어트 메나 하우스)',
    hotelQuery: 'Marriott Mena House, Cairo',
    hotelBadge: '카이로 · 1박차 체크인',
    hotelNote: '기자 피라미드 바로 앞 5성급 역사적 궁전 호텔 (해피아워 & 139 파빌리온 디너)',
  },
  {
    day: 2,
    dateStr: '10/29 (목)',
    title: '기자 피라미드(셔틀) · 점심(피자헛) · 대박물관(GEM 13시) · 칸 엘 칼릴리 시장',
    hotelName: 'Marriott Mena House, Cairo (메리어트 메나 하우스)',
    hotelQuery: 'Marriott Mena House, Cairo',
    hotelBadge: '카이로 · 2박 연박',
    hotelNote: '피라미드 뷰 조식 및 무휘투어/자유 투어 후 복귀 휴식',
  },
  {
    day: 3,
    dateStr: '10/30 (금)',
    title: '메나하우스 호캉스 → 룩소르 이동(MS074 14:45) · 힐튼 룩소르 · 카르나크 야경',
    hotelName: 'Hilton Luxor Resort & Spa (힐튼 룩소르 리조트)',
    hotelQuery: 'Hilton Luxor Resort & Spa',
    hotelBadge: '룩소르 · 1박차 체크인',
    hotelNote: '나일강 동안 인피니티풀 5성급 럭셔리 리조트 (Fish House 디너 & 지성투어 야경)',
  },
  {
    day: 4,
    dateStr: '10/31 (토)',
    title: '새벽 열기구(06:00) · 서안투어(왕가의 계곡) · 펠루카 일몰 · 룩소르 시장',
    hotelName: 'Hilton Luxor Resort & Spa (힐튼 룩소르 리조트)',
    hotelQuery: 'Hilton Luxor Resort & Spa',
    hotelBadge: '룩소르 · 2박 연박',
    hotelNote: '서안 투어 후 나일강 펠루카(300~400 EGP) 세일링 & 룩소르 수크 쇼핑',
  },
  {
    day: 5,
    dateStr: '11/1 (일)',
    title: '힐튼 룩소르 호캉스 → 카이로 복귀(MS075 16:50) · 르 메르디앙 공항',
    hotelName: 'Le Méridien Cairo Airport (르 메르디앙 카이로 공항)',
    hotelQuery: 'Le Méridien Cairo Airport',
    hotelBadge: '카이로 공항 · 1박 체크인',
    hotelNote: '카이로 국제공항 제3터미널 전용 다리로 직결된 5성급 호텔 (뉴카이로 디너)',
  },
  {
    day: 6,
    dateStr: '11/2 (월)',
    title: '시몬 동굴 교회 · 카이로 시타델 · 올드 카이로 → 출국(QR1302 19:45)',
    hotelName: '기내 숙박 / 출국 (거점: Le Méridien Cairo Airport)',
    hotelQuery: 'Le Méridien Cairo Airport',
    hotelBadge: '출국일 · 호텔 짐 보관 후 공항 이동',
    hotelNote: '르 메르디앙 짐 보관 후 카이로 시내 투어 → 저녁 19:45 출국 수속',
  },
  {
    day: 7,
    dateStr: '11/3 (화)',
    title: '도하 경유 → 인천국제공항 도착(17:15 QR858) · 귀국 완료',
    hotelName: '인천국제공항 도착 (귀국)',
    hotelQuery: 'Incheon International Airport',
    hotelBadge: '인천 도착 (17:15 QR858)',
    hotelNote: '도하 경유 후 인천공항 17:15 도착, 10주년 여행 완료',
  },
];

export const getGoogleMapsUrl = (locationText: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;
};

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
  onReorderItems,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState<boolean>(false);

  // Drag and drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

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

  // Sort items by time for active day (or all days)
  const handleSortByTime = () => {
    if (!onReorderItems) return;
    const sorted = [1, 2, 3, 4, 5, 6].flatMap((d) => {
      const dayList = items.filter((i) => i.dayNumber === d);
      if (activeDay === 0 || activeDay === d) {
        return [...dayList].sort((a, b) => a.time.localeCompare(b.time));
      }
      return dayList;
    });
    onReorderItems(sorted);
  };

  // Move item up or down within filtered list
  const handleMoveStep = (e: React.MouseEvent, itemId: string, direction: 'UP' | 'DOWN') => {
    e.stopPropagation();
    if (!onReorderItems) return;

    const currentFiltered = items.filter((item) => {
      if (selectedCity !== 'ALL' && item.city !== selectedCity) return false;
      if (activeDay !== 0 && item.dayNumber !== activeDay) return false;
      return true;
    });

    const idx = currentFiltered.findIndex((i) => i.id === itemId);
    if (idx === -1) return;
    const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentFiltered.length) return;

    const sourceItem = currentFiltered[idx];
    const targetItem = currentFiltered[targetIdx];

    // Swap their positions in the master items array
    const nextItems = [...items];
    const masterSourceIdx = nextItems.findIndex((i) => i.id === sourceItem.id);
    const masterTargetIdx = nextItems.findIndex((i) => i.id === targetItem.id);
    if (masterSourceIdx === -1 || masterTargetIdx === -1) return;

    // If moving across days in "All" view, adopt target day's dayNumber & dateStr
    const updatedSource =
      sourceItem.dayNumber !== targetItem.dayNumber
        ? { ...sourceItem, dayNumber: targetItem.dayNumber, dateStr: targetItem.dateStr }
        : sourceItem;

    nextItems[masterSourceIdx] = targetItem;
    nextItems[masterTargetIdx] = updatedSource;
    onReorderItems(nextItems);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedItemId || e.dataTransfer.getData('text/plain');
    setDraggedItemId(null);
    setDragOverItemId(null);

    if (!sourceId || sourceId === targetId || !onReorderItems) return;

    const sourceIdx = items.findIndex((i) => i.id === sourceId);
    const targetIdx = items.findIndex((i) => i.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const nextItems = [...items];
    const [moved] = nextItems.splice(sourceIdx, 1);
    const targetItem = items[targetIdx];

    // If dropped onto an item of another day, sync dayNumber and dateStr
    if (moved.dayNumber !== targetItem.dayNumber) {
      moved.dayNumber = targetItem.dayNumber;
      moved.dateStr = targetItem.dateStr;
    }

    const newTargetIdx = nextItems.findIndex((i) => i.id === targetId);
    const insertAt = sourceIdx < targetIdx ? newTargetIdx + 1 : newTargetIdx;
    nextItems.splice(insertAt, 0, moved);

    onReorderItems(nextItems);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  // Filter items by city and active day
  const filteredItems = items.filter((item) => {
    if (selectedCity !== 'ALL' && item.city !== selectedCity) return false;
    if (activeDay !== 0 && item.dayNumber !== activeDay) return false;
    return true;
  });

  const currentDayInfo = DAYS_INFO.find((d) => d.day === activeDay);

  return (
    <div className="space-y-3">
      {/* Day Selector Bar + Sort / Expand Controls */}
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

        <div className="flex items-center gap-1 shrink-0">
          {onReorderItems && (
            <button
              onClick={handleSortByTime}
              className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition active:scale-95 min-h-[38px]"
              title="시간순으로 자동 정렬"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">시간순</span>
            </button>
          )}
          <button
            onClick={handleToggleExpandAll}
            className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition active:scale-95 min-h-[38px]"
            title={expandAll ? '상세 내용 모두 접기' : '상세 내용 모두 펼치기'}
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{expandAll ? '접기' : '펼치기'}</span>
          </button>
        </div>
      </div>

      {/* Day Title Headline + Separate Accommodation Section */}
      {activeDay > 0 && currentDayInfo && (
        <div className="space-y-2">
          {/* 1) Day Headline Bar */}
          <div className="px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-extrabold text-blue-600">DAY {activeDay}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-700">
                  {currentDayInfo.dateStr}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                {currentDayInfo.title}
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

          {/* 2) Dedicated Day Accommodation (그날 묵을 숙소) Section */}
          <div className="px-3.5 py-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <BedDouble className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-700">
                  <span className="font-extrabold">오늘의 숙소</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold">{currentDayInfo.hotelBadge}</span>
                </div>
                <a
                  href={getGoogleMapsUrl(currentDayInfo.hotelQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline inline-flex items-center gap-1 mt-0.5 max-w-full"
                  title="구글 맵스에서 숙소 위치 열기"
                >
                  <span className="truncate">{currentDayInfo.hotelName}</span>
                  <ExternalLink className="w-3 h-3 text-indigo-600 shrink-0" />
                </a>
                <p className="text-[11px] text-slate-600 truncate">
                  {currentDayInfo.hotelNote}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => handleCopyLocation(e, `hotel_day_${activeDay}`, currentDayInfo.hotelQuery)}
              className="px-2 py-1 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center gap-1 shrink-0 transition"
              title="숙소명 복사"
            >
              {copiedId === `hotel_day_${activeDay}` ? (
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
          {filteredItems.map((item, idx) => {
            const isCompleted = item.status === 'COMPLETED';
            const hasDetails = Boolean(item.memo || item.tips || (item.cost && item.cost.amount > 0) || item.transportNote);
            const isExpanded = expandedIds[item.id] ?? expandAll;
            const isDragging = draggedItemId === item.id;
            const isDragOver = dragOverItemId === item.id && draggedItemId !== item.id;
            const convertedKrw = item.cost 
              ? convertAmount(item.cost.amount, item.cost.currency, 'KRW', DEFAULT_RATES)
              : 0;

            return (
              <div 
                key={item.id}
                draggable={Boolean(onReorderItems)}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={`relative group transition-all ${
                  isDragging ? 'opacity-40 scale-[0.99]' : ''
                } ${isDragOver ? 'ring-2 ring-blue-500 rounded-2xl' : ''}`}
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
                  {/* Top Bar: Drag Handle + Clean Unboxed Metadata + Right Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 min-w-0">
                      {onReorderItems && (
                        <span
                          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 -ml-1"
                          title="드래그하여 순서 변경"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </span>
                      )}

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

                    {/* Action buttons: Reorder Up/Down + Edit + Delete */}
                    <div
                      className="flex items-center gap-0.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onReorderItems && (
                        <>
                          <button
                            onClick={(e) => handleMoveStep(e, item.id, 'UP')}
                            disabled={idx === 0}
                            className="w-6 h-7 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition flex items-center justify-center"
                            title="위로 이동"
                            aria-label="위로 이동"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleMoveStep(e, item.id, 'DOWN')}
                            disabled={idx === filteredItems.length - 1}
                            className="w-6 h-7 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition flex items-center justify-center"
                            title="아래로 이동"
                            aria-label="아래로 이동"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </>
                      )}
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

                  {/* Compact Footer Row: Clickable Google Maps Location + Copy + Expand Indicator */}
                  <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 min-w-0 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
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
