import React, { useState } from 'react';
import { DriverContact, City } from '../types/travel';
import { TICKET_INFOS } from '../data/initialData';
import { 
  MessageSquare, 
  Phone, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Car,
  Ticket,
  Languages,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Edit3,
  Trash2
} from 'lucide-react';
import { convertAmount, DEFAULT_RATES } from '../services/currency';

interface QuickInfoCardsProps {
  drivers: DriverContact[];
  selectedCity: City;
  onUpdateDrivers: (drivers: DriverContact[]) => void;
}

interface ArabicPhrase {
  id: string;
  pronunciation: string;
  category: string;
  meaning: string;
  tip: string;
  accent: 'rose' | 'amber' | 'blue' | 'emerald' | 'purple' | 'slate';
}

const ARABIC_PHRASES: ArabicPhrase[] = [
  {
    id: 'ar_1',
    pronunciation: '라, 슈크란!',
    category: '호객 퇴치 No.1',
    meaning: '"아니요, 괜찮습니다 (No, thank you)"',
    tip: '낙타, 마차, 기념품 삐끼가 다가올 때 눈을 마주치지 말고 단호하고 정중하게 "라, 슈크란"을 말하며 지나가세요.',
    accent: 'rose',
  },
  {
    id: 'ar_2',
    pronunciation: '마피 플루스!',
    category: '비장의 삐끼 퇴치',
    meaning: '"돈 없어요! (No money!)"',
    tip: '끝까지 쫓아오는 호객꾼에게 웃으며 "마피 플루스!"라고 외치면 상인도 웃으며 단번에 포기합니다.',
    accent: 'rose',
  },
  {
    id: 'ar_3',
    pronunciation: '비캄 다?',
    category: '가격 흥정',
    meaning: '"이거 얼마예요? (How much?)"',
    tip: '시장이나 가게에서 물건 가격을 물어볼 때 사용합니다. 아랍어로 물어보면 관광객 바가지를 덜 부릅니다.',
    accent: 'amber',
  },
  {
    id: 'ar_4',
    pronunciation: '갈리 아위!',
    category: '가격 깎기',
    meaning: '"너무 비싸요! (Too expensive!)"',
    tip: '상인이 높은 가격을 부를 때 고개를 흔들며 "갈리 아위!"라고 외치면 가격을 즉시 깎아주기 시작합니다.',
    accent: 'amber',
  },
  {
    id: 'ar_5',
    pronunciation: '샤갈 엘 아다드!',
    category: '택시 필수',
    meaning: '"미터기 켜주세요 (Turn on meter)"',
    tip: '카이로 흰색 일반 택시에 탈 때 바로 "샤갈 엘 아다드!"라고 말하면 바가지 흥정을 방지할 수 있습니다.',
    accent: 'blue',
  },
  {
    id: 'ar_6',
    pronunciation: '알라 툴 / 쉐말 / 야민',
    category: '택시 방향 지시',
    meaning: '"직진 / 좌회전 / 우회전"',
    tip: '택시 기사에게 길을 알려줄 때: 알라 툴(직진), 쉐말(왼쪽), 야민(오른쪽), 헤나(여기서 스톱).',
    accent: 'blue',
  },
  {
    id: 'ar_7',
    pronunciation: '헤사브 멘 파들락',
    category: '식당/카페',
    meaning: '"계산서 부탁합니다 (Check, please)"',
    tip: '식사 후 자리에 앉은 채 손을 가볍게 들고 "헤사브 멘 파들락" 하면 영수증을 자리로 가져다줍니다.',
    accent: 'emerald',
  },
  {
    id: 'ar_8',
    pronunciation: '마이야 마다니야',
    category: '물 구매 필수',
    meaning: '"생수(미네랄워터) 주세요"',
    tip: '이집트 수돗물은 석회질이 많아 배탈이 나므로 식당/가게에서 항상 밀봉된 "마이야 마다니야"를 주문하세요.',
    accent: 'emerald',
  },
  {
    id: 'ar_9',
    pronunciation: '안나 민 꾸리야',
    category: '호감도 200%',
    meaning: '"한국에서 왔어요 (I\'m from Korea)"',
    tip: '현지인이 "China? Japan?" 물을 때 "안나 민 꾸리야!" 하면 K-드라마와 K-POP 이야기로 아주 반갑게 맞아줍니다.',
    accent: 'purple',
  },
  {
    id: 'ar_10',
    pronunciation: '알함두릴라!',
    category: '현지인 최고 인사',
    meaning: '"신께 감사드립니다 / 덕분에 잘 지내요"',
    tip: '기사나 호텔 직원이 "에즈 자약? (잘 지내?)" 안부를 물을 때 "알함두릴라!"라고 답하면 최고의 답변입니다.',
    accent: 'purple',
  },
  {
    id: 'ar_11',
    pronunciation: '페인 엘 함맘?',
    category: '급할 때',
    meaning: '"화장실이 어디예요? (Where is the restroom?)"',
    tip: '유적지, 박물관, 식당 등에서 화장실 위치를 물을 때 급하게 사용할 수 있는 필수 표현입니다.',
    accent: 'slate',
  },
  {
    id: 'ar_12',
    pronunciation: '아이와 / 라',
    category: '기본 소통',
    meaning: '"네 (Yes) / 아니오 (No)"',
    tip: '이집트 구어체로 긍정은 "아이와(Aywa)", 부정은 "라(La)"입니다. 가장 짧고 확실한 의사 표현입니다.',
    accent: 'slate',
  },
  {
    id: 'ar_13',
    pronunciation: '임쉬!',
    category: '단호한 거절',
    meaning: '"저리 가세요 / 비키세요 (Go away)"',
    tip: '"라, 슈크란"에도 끈질기게 몸을 잡거나 길을 막는 악성 호객꾼에게 정색하고 외치는 단호한 경고 표현.',
    accent: 'rose',
  },
  {
    id: 'ar_14',
    pronunciation: '슈크란 자질란',
    category: '감사 인사',
    meaning: '"정말 대단히 감사합니다 (Thank you very much)"',
    tip: '식당, 호텔, 픽업 기사에게 팁을 건네며 말하면 아주 환한 미소로 감사를 표합니다.',
    accent: 'emerald',
  },
  {
    id: 'ar_15',
    pronunciation: '민 파들락',
    category: '정중한 부탁',
    meaning: '"부탁합니다 / 실례합니다 (Please)"',
    tip: '물건을 요청하거나 길을 물어볼 때 앞에 붙이면 예의 바른 여행자로 대우받습니다 (여성에게는 \'민 파들릭\').',
    accent: 'amber',
  },
  {
    id: 'ar_16',
    pronunciation: '사바흐 엘 케이르',
    category: '아침 첫인사',
    meaning: '"좋은 아침입니다 (Good morning)"',
    tip: '아침 투어 출발 시 기사나 호텔 직원에게 먼저 건네보세요. 상대방은 "사바흐 안 누르(빛의 아침)"로 화답합니다.',
    accent: 'blue',
  },
];

export const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({
  drivers,
  selectedCity,
  onUpdateDrivers,
}) => {
  const [subTab, setSubTab] = useState<'TICKETS' | 'DRIVERS' | 'ARABIC'>('TICKETS');
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverContact | null>(null);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverCity, setNewDriverCity] = useState('카이로 / 룩소르');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverWhatsApp, setNewDriverWhatsApp] = useState('');
  const [newDriverRoute, setNewDriverRoute] = useState('');
  const [newDriverPrice, setNewDriverPrice] = useState('');
  const [newDriverNotes, setNewDriverNotes] = useState('');

  // Progressive disclosure states
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>({});
  const [expandAllTickets, setExpandAllTickets] = useState(false);

  const [expandedDrivers, setExpandedDrivers] = useState<Record<string, boolean>>({});
  const [expandAllDrivers, setExpandAllDrivers] = useState(false);

  const [expandedArabic, setExpandedArabic] = useState<Record<string, boolean>>({});
  const [expandAllArabic, setExpandAllArabic] = useState(false);

  const filteredTickets = TICKET_INFOS.filter((t) => {
    if (selectedCity === 'ALL') return true;
    return t.city === selectedCity;
  });

  const handleOpenAddDriver = () => {
    setEditingDriver(null);
    setNewDriverName('');
    setNewDriverCity('카이로 / 룩소르');
    setNewDriverPhone('');
    setNewDriverWhatsApp('');
    setNewDriverRoute('');
    setNewDriverPrice('');
    setNewDriverNotes('');
    setIsAddDriverOpen(true);
  };

  const handleOpenEditDriver = (driver: DriverContact) => {
    setEditingDriver(driver);
    setNewDriverName(driver.name);
    setNewDriverCity(driver.city);
    setNewDriverPhone(driver.phone);
    setNewDriverWhatsApp(driver.whatsapp);
    setNewDriverRoute(driver.recommendedRoute);
    setNewDriverPrice(driver.estimatedPrice);
    setNewDriverNotes(driver.notes || '');
    setIsAddDriverOpen(true);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverPhone.trim()) return;

    const cleanWa = newDriverWhatsApp.replace(/[^0-9]/g, '') || newDriverPhone.replace(/[^0-9]/g, '');

    if (editingDriver) {
      const updated = drivers.map((d) =>
        d.id === editingDriver.id
          ? {
              ...d,
              name: newDriverName.trim(),
              city: newDriverCity.trim() || '카이로 / 룩소르',
              phone: newDriverPhone.trim(),
              whatsapp: cleanWa,
              recommendedRoute: newDriverRoute.trim() || '시내 투어 및 공항 픽업',
              estimatedPrice: newDriverPrice.trim() || '상호 협의',
              notes: newDriverNotes.trim() || '추천 기사',
            }
          : d
      );
      onUpdateDrivers(updated);
    } else {
      const newDriver: DriverContact = {
        id: `driver_${Date.now()}`,
        name: newDriverName.trim(),
        city: newDriverCity.trim() || '카이로 / 룩소르',
        phone: newDriverPhone.trim(),
        whatsapp: cleanWa,
        recommendedRoute: newDriverRoute.trim() || '시내 투어 및 공항 픽업',
        estimatedPrice: newDriverPrice.trim() || '상호 협의',
        notes: newDriverNotes.trim() || '추천 기사',
      };
      onUpdateDrivers([...drivers, newDriver]);
    }

    setIsAddDriverOpen(false);
    setEditingDriver(null);
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('이 기사 연락처를 삭제하시겠습니까?')) {
      onUpdateDrivers(drivers.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-3.5 max-w-4xl mx-auto">
      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('TICKETS')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition min-h-[38px] active:scale-95 ${
            subTab === 'TICKETS'
              ? 'bg-white text-blue-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">입장료·예약</span>
        </button>
        <button
          onClick={() => setSubTab('DRIVERS')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition min-h-[38px] active:scale-95 ${
            subTab === 'DRIVERS'
              ? 'bg-white text-blue-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">기사 연락처</span>
        </button>
        <button
          onClick={() => setSubTab('ARABIC')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition min-h-[38px] active:scale-95 ${
            subTab === 'ARABIC'
              ? 'bg-white text-blue-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Languages className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">생존 아랍어</span>
        </button>
      </div>

      {/* 1. TICKETS TAB */}
      {subTab === 'TICKETS' && (
        <div className="space-y-3">
          {/* Top Bar: Collapsible Policy Banner + Expand All Toggle */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsPolicyOpen(!isPolicyOpen)}
              className="flex-1 px-3 py-2 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-900 text-left transition hover:bg-amber-100/70"
            >
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold truncate">
                  유적지 결제 필수 정책: 현금 불가 · 신용카드 전용
                </span>
              </div>
              {isPolicyOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              )}
            </button>

            <button
              onClick={() => {
                setExpandAllTickets(!expandAllTickets);
                setExpandedTickets({});
              }}
              className="shrink-0 px-2.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition"
            >
              <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span>{expandAllTickets ? '모두 접기' : '팁 모두 보기'}</span>
            </button>
          </div>

          {isPolicyOpen && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
              2023년부터 카이로 성채, GEM 대박물관, 피라미드, 룩소르 신전 등 대부분의 주요 유적지는 <strong>현금 결제가 전면 금지</strong>되었으며, <strong>해외 결제 가능 신용카드(비자/마스터)</strong>만 받습니다.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredTickets.map((ticket) => {
              const krwAmount = Math.round(convertAmount(ticket.priceEgp, 'EGP', 'KRW', DEFAULT_RATES));
              const isOpen = expandedTickets[ticket.id] ?? expandAllTickets;

              return (
                <div
                  key={ticket.id}
                  onClick={() =>
                    setExpandedTickets((prev) => ({
                      ...prev,
                      [ticket.id]: !isOpen,
                    }))
                  }
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition shadow-2xs cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Compact Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-bold text-blue-600">
                            {ticket.city === 'CAIRO' ? '카이로' : ticket.city === 'LUXOR' ? '룩소르' : ticket.city}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className={ticket.paymentMethod === 'ONLINE_REQUIRED' ? 'text-rose-600 font-bold' : 'text-slate-600 font-medium'}>
                            {ticket.paymentMethod === 'ONLINE_REQUIRED' ? '사전 온라인 예약 필수' : '현장 신용카드 전용'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                          {ticket.name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-slate-900 font-mono">
                          {ticket.priceEgp} EGP
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          약 {krwAmount.toLocaleString()}원
                        </div>
                      </div>
                    </div>

                    {/* Expand Trigger Row */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>추천: {ticket.bestTime}</span>
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-blue-600 font-semibold shrink-0 ml-2">
                        <span>{isOpen ? '팁 접기' : `관람 팁 (${ticket.tips.length})`}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </div>

                    {/* Expandable Tips List */}
                    {isOpen && (
                      <ul
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl"
                      >
                        {ticket.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-blue-600 font-bold mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DRIVERS TAB */}
      {subTab === 'DRIVERS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500 font-medium">
              검증된 기사 목록 · 원터치 WhatsApp 및 통화
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setExpandAllDrivers(!expandAllDrivers);
                  setExpandedDrivers({});
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
                <span>{expandAllDrivers ? '접기' : '상세 펼치기'}</span>
              </button>
              <button
                onClick={handleOpenAddDriver}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-2xs hover:bg-blue-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>기사 추가</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {drivers.map((driver) => {
              const isOpen = expandedDrivers[driver.id] ?? expandAllDrivers;
              return (
                <div
                  key={driver.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="font-bold text-blue-600">{driver.city}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{driver.phone}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                          {driver.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditDriver(driver)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                          title="기사 정보 수정"
                          aria-label="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="기사 연락처 삭제"
                          aria-label="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Key Price Summary + Expand Trigger */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDrivers((prev) => ({
                          ...prev,
                          [driver.id]: !isOpen,
                        }))
                      }
                      className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-left"
                    >
                      <span className="text-slate-600 truncate">
                        예상 요금: <strong className="text-blue-700 font-mono">{driver.estimatedPrice}</strong>
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 font-semibold shrink-0 ml-2">
                        <span>{isOpen ? '접기' : '코스·메모'}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-2 space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <div>
                          <span className="text-slate-500 font-semibold">추천 코스:</span>{' '}
                          <span className="text-slate-900 font-medium">{driver.recommendedRoute}</span>
                        </div>
                        {driver.notes && (
                          <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/70 leading-relaxed">
                            {driver.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* WhatsApp & Call Action Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${driver.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${driver.phone}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>전화</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add / Edit Driver Modal */}
          {isAddDriverOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  {editingDriver ? '기사 연락처 수정' : '새 기사 / 택시 연락처 등록'}
                </h3>
                <form onSubmit={handleSaveDriver} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">기사님 성함 *</label>
                    <input
                      type="text"
                      value={newDriverName}
                      onChange={(e) => setNewDriverName(e.target.value)}
                      placeholder="예: 마이클, 무스타파"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">활동 지역</label>
                      <input
                        type="text"
                        value={newDriverCity}
                        onChange={(e) => setNewDriverCity(e.target.value)}
                        placeholder="카이로 / 룩소르"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">전화번호 *</label>
                      <input
                        type="text"
                        value={newDriverPhone}
                        onChange={(e) => setNewDriverPhone(e.target.value)}
                        placeholder="+20 100 123 4567"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">WhatsApp 번호 (숫자만)</label>
                      <input
                        type="text"
                        value={newDriverWhatsApp}
                        onChange={(e) => setNewDriverWhatsApp(e.target.value)}
                        placeholder="201001234567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">예상 요금</label>
                      <input
                        type="text"
                        value={newDriverPrice}
                        onChange={(e) => setNewDriverPrice(e.target.value)}
                        placeholder="예: $25~35 / 1,000 EGP"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">추천 코스</label>
                    <input
                      type="text"
                      value={newDriverRoute}
                      onChange={(e) => setNewDriverRoute(e.target.value)}
                      placeholder="예: 카이로 공항 픽업, 룩소르 서안 투어"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">특이사항 / 메모</label>
                    <input
                      type="text"
                      value={newDriverNotes}
                      onChange={(e) => setNewDriverNotes(e.target.value)}
                      placeholder="예: 에어컨 좋음, 영어 능통"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddDriverOpen(false);
                        setEditingDriver(null);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      {editingDriver ? '수정 완료' : '저장하기'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ARABIC & SURVIVAL TIPS */}
      {subTab === 'ARABIC' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                🗣️ 생존 이집트 아랍어 16선
              </h3>
              <p className="text-[11px] text-slate-500">
                표현을 누르면 현지 사용 팁과 바가지 대처법이 펼쳐집니다.
              </p>
            </div>
            <button
              onClick={() => {
                setExpandAllArabic(!expandAllArabic);
                setExpandedArabic({});
              }}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition"
            >
              <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span>{expandAllArabic ? '설명 접기' : '설명 모두 펼치기'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ARABIC_PHRASES.map((phrase) => {
              const isOpen = expandedArabic[phrase.id] ?? expandAllArabic;
              const accentColor =
                phrase.accent === 'rose'
                  ? 'text-rose-700'
                  : phrase.accent === 'amber'
                  ? 'text-amber-800'
                  : phrase.accent === 'emerald'
                  ? 'text-emerald-800'
                  : phrase.accent === 'purple'
                  ? 'text-purple-800'
                  : phrase.accent === 'blue'
                  ? 'text-blue-800'
                  : 'text-slate-800';

              return (
                <div
                  key={phrase.id}
                  onClick={() =>
                    setExpandedArabic((prev) => ({
                      ...prev,
                      [phrase.id]: !isOpen,
                    }))
                  }
                  className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-base font-black font-mono ${accentColor}`}>
                          {phrase.pronunciation}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {phrase.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold mt-0.5 truncate">
                        {phrase.meaning}
                      </p>
                    </div>

                    <span className="text-slate-400 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </div>

                  {isOpen && (
                    <p className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-100 leading-relaxed">
                      {phrase.tip}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
