import React, { useState } from 'react';
import { DriverContact, TicketInfo, City } from '../types/travel';
import { TICKET_INFOS } from '../data/initialData';
import { 
  CreditCard, 
  MessageSquare, 
  Phone, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Plus, 
  Sparkles,
  MapPin,
  Car,
  Ticket,
  Languages,
  Check
} from 'lucide-react';
import { formatCurrency, convertAmount, DEFAULT_RATES } from '../services/currency';

interface QuickInfoCardsProps {
  drivers: DriverContact[];
  selectedCity: City;
  onUpdateDrivers: (drivers: DriverContact[]) => void;
}

export const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({
  drivers,
  selectedCity,
  onUpdateDrivers,
}) => {
  const [subTab, setSubTab] = useState<'TICKETS' | 'DRIVERS' | 'ARABIC'>('TICKETS');
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverCity, setNewDriverCity] = useState('카이로 / 룩소르');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverWhatsApp, setNewDriverWhatsApp] = useState('');
  const [newDriverRoute, setNewDriverRoute] = useState('');
  const [newDriverPrice, setNewDriverPrice] = useState('');
  const [newDriverNotes, setNewDriverNotes] = useState('');

  // Filter tickets by selected city
  const filteredTickets = TICKET_INFOS.filter((t) => {
    if (selectedCity === 'ALL') return true;
    return t.city === selectedCity;
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverPhone.trim()) {
      alert('기사님 이름과 연락처를 입력해주세요.');
      return;
    }

    const cleanWa = newDriverWhatsApp.replace(/[^0-9]/g, '') || newDriverPhone.replace(/[^0-9]/g, '');

    const newDriver: DriverContact = {
      id: `driver_${Date.now()}`,
      name: newDriverName.trim(),
      city: newDriverCity.trim(),
      phone: newDriverPhone.trim(),
      whatsapp: cleanWa,
      recommendedRoute: newDriverRoute.trim() || '시내 투어 및 공항 픽업',
      estimatedPrice: newDriverPrice.trim() || '상호 협의',
      notes: newDriverNotes.trim() || '추천 기사',
    };

    onUpdateDrivers([...drivers, newDriver]);
    setIsAddDriverOpen(false);
    setNewDriverName('');
    setNewDriverPhone('');
    setNewDriverWhatsApp('');
    setNewDriverRoute('');
    setNewDriverPrice('');
    setNewDriverNotes('');
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('이 기사 연락처를 삭제하시겠습니까?')) {
      onUpdateDrivers(drivers.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('TICKETS')}
          className={`py-2.5 px-1 rounded-xl flex items-center justify-center gap-1 transition min-h-[40px] active:scale-95 ${
            subTab === 'TICKETS'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">입장료·예약</span>
        </button>
        <button
          onClick={() => setSubTab('DRIVERS')}
          className={`py-2.5 px-1 rounded-xl flex items-center justify-center gap-1 transition min-h-[40px] active:scale-95 ${
            subTab === 'DRIVERS'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">기사 연락처</span>
        </button>
        <button
          onClick={() => setSubTab('ARABIC')}
          className={`py-2.5 px-1 rounded-xl flex items-center justify-center gap-1 transition min-h-[40px] active:scale-95 ${
            subTab === 'ARABIC'
              ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/20'
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
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-bold">★ 이집트 유적지 결제 필수 정책:</strong>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                2023년부터 카이로 성채, GEM 대박물관, 피라미드, 룩소르 신전 등 대부분의 주요 유적지는 <strong>현금 결제가 전면 금지</strong>되었으며, <strong>해외 결제 가능 신용카드(비자/마스터)</strong>만 받습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTickets.map((ticket) => {
              const krwAmount = Math.round(convertAmount(ticket.priceEgp, 'EGP', 'KRW', DEFAULT_RATES));

              return (
                <div
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-blue-700 font-bold border border-slate-200">
                          {ticket.city === 'CAIRO' ? '카이로' : ticket.city === 'LUXOR' ? '룩소르' : ticket.city}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                          {ticket.name}
                        </h3>
                      </div>

                      {/* Payment Method Badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                        ticket.paymentMethod === 'ONLINE_REQUIRED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {ticket.paymentMethod === 'ONLINE_REQUIRED' ? '사전 온라인 필수' : '신용카드 전용'}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-semibold">기본 입장료</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          {ticket.priceEgp} EGP
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1.5 font-mono">
                          (약 {krwAmount.toLocaleString()}원)
                        </span>
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>추천 방문: <strong className="text-slate-800">{ticket.bestTime}</strong></span>
                    </div>

                    {/* Tips list */}
                    <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                      {ticket.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
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
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 font-medium">
              검증된 기사 목록 (원터치 WhatsApp 대화 및 전화 지원)
            </p>
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              기사 추가
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {driver.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {driver.city}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        {driver.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-slate-400 hover:text-rose-600 text-xs p-1"
                      title="삭제"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 font-semibold">추천 코스:</span>{' '}
                      <span className="text-slate-900 font-medium">{driver.recommendedRoute}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">예상 요금:</span>{' '}
                      <span className="text-blue-700 font-bold">{driver.estimatedPrice}</span>
                    </div>
                    {driver.notes && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        {driver.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp & Call Action Buttons */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${driver.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp 채팅</span>
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
            ))}
          </div>

          {/* Add Driver Modal */}
          {isAddDriverOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900">
                <h3 className="text-sm font-bold text-slate-900 mb-3">새 기사 / 택시 연락처 등록</h3>
                <form onSubmit={handleAddDriver} className="space-y-3 text-xs">
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
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">WhatsApp 번호 (숫자만, 국가코드 포함)</label>
                    <input
                      type="text"
                      value={newDriverWhatsApp}
                      onChange={(e) => setNewDriverWhatsApp(e.target.value)}
                      placeholder="201001234567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">추천 코스 및 예상 요금</label>
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
                      onClick={() => setIsAddDriverOpen(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      저장하기
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
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🗣️</span> 현지 삐끼 퇴치 & 생존 이집트 아랍어 16종 치트시트
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  현지 발음대로 따라 읽으면 바가지와 삐끼를 완벽 퇴치하고 호감을 얻을 수 있습니다!
                </p>
              </div>
              <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2.5 py-1 rounded-full border border-blue-200">
                실전 필수 표현
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* 1 */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-rose-800 font-mono">라, 슈크란!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">호객 퇴치 No.1</span>
                </div>
                <p className="text-xs text-rose-950 font-bold mt-1">"아니요, 괜찮습니다 (No, thank you)"</p>
                <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                  낙타, 마차, 기념품 삐끼가 다가올 때 눈을 마주치지 말고 단호하고 정중하게 "라, 슈크란"을 말하며 지나가세요.
                </p>
              </div>

              {/* 2 */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-rose-800 font-mono">마피 플루스!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">비장의 삐끼 퇴치</span>
                </div>
                <p className="text-xs text-rose-950 font-bold mt-1">"돈 없어요! (No money!)"</p>
                <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                  끝까지 쫓아오는 호객꾼에게 웃으며 "마피 플루스!"라고 외치면 상인도 웃으며 단번에 포기합니다.
                </p>
              </div>

              {/* 3 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-amber-900 font-mono">비캄 다?</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">가격 흥정</span>
                </div>
                <p className="text-xs text-amber-950 font-bold mt-1">"이거 얼마예요? (How much?)"</p>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  시장이나 가게에서 물건 가격을 물어볼 때 사용합니다. 아랍어로 물어보면 관광객 바가지를 덜 부릅니다.
                </p>
              </div>

              {/* 4 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-amber-900 font-mono">갈리 아위!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">가격 깎기</span>
                </div>
                <p className="text-xs text-amber-950 font-bold mt-1">"너무 비싸요! (Too expensive!)"</p>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  상인이 높은 가격을 부를 때 고개를 흔들며 "갈리 아위!"라고 외치면 가격을 즉시 깎아주기 시작합니다.
                </p>
              </div>

              {/* 5 */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-blue-900 font-mono">샤갈 엘 아다드!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">택시 필수</span>
                </div>
                <p className="text-xs text-blue-950 font-bold mt-1">"미터기 켜주세요 (Turn on meter)"</p>
                <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                  카이로 흰색 일반 택시에 탈 때 바로 "샤갈 엘 아다드!"라고 말하면 바가지 흥정을 방지할 수 있습니다.
                </p>
              </div>

              {/* 6 */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-blue-900 font-mono">알라 툴 / 쉐말 / 야민</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">택시 방향 지시</span>
                </div>
                <p className="text-xs text-blue-950 font-bold mt-1">"직진 / 좌회전 / 우회전"</p>
                <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                  택시 기사에게 길을 알려줄 때: 알라 툴(직진), 쉐말(왼쪽), 야민(오른쪽), 헤나(여기서 스톱).
                </p>
              </div>

              {/* 7 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-emerald-800 font-mono">헤사브 멘 파들락</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">식당/카페</span>
                </div>
                <p className="text-xs text-emerald-950 font-bold mt-1">"계산서 부탁합니다 (Check, please)"</p>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  식사 후 자리에 앉은 채 손을 가볍게 들고 "헤사브 멘 파들락" 하면 영수증을 자리로 가져다줍니다.
                </p>
              </div>

              {/* 8 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-emerald-800 font-mono">마이야 마다니야</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">물 구매 필수</span>
                </div>
                <p className="text-xs text-emerald-950 font-bold mt-1">"생수(미네랄워터) 주세요"</p>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  이집트 수돗물은 석회질이 많아 배탈이 나므로 식당/가게에서 항상 밀봉된 "마이야 마다니야"를 주문하세요.
                </p>
              </div>

              {/* 9 */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-purple-900 font-mono">안나 민 꾸리야</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">호감도 200%</span>
                </div>
                <p className="text-xs text-purple-950 font-bold mt-1">"한국에서 왔어요 (I'm from Korea)"</p>
                <p className="text-[11px] text-purple-800 mt-1 leading-relaxed">
                  현지인이 "China? Japan?" 물을 때 "안나 민 꾸리야!" 하면 K-드라마와 K-POP 이야기로 아주 반갑게 맞아줍니다.
                </p>
              </div>

              {/* 10 */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-purple-900 font-mono">알함두릴라!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">현지인 최고 인사</span>
                </div>
                <p className="text-xs text-purple-950 font-bold mt-1">"신께 감사드립니다 / 덕분에 잘 지내요"</p>
                <p className="text-[11px] text-purple-800 mt-1 leading-relaxed">
                  기사나 호텔 직원이 "에즈 자약? (잘 지내?)" 안부를 물을 때 "알함두릴라!"라고 답하면 최고의 답변입니다.
                </p>
              </div>

              {/* 11 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-slate-800 font-mono">페인 엘 함맘?</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">급할 때</span>
                </div>
                <p className="text-xs text-slate-900 font-bold mt-1">"화장실이 어디예요? (Where is the restroom?)"</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  유적지, 박물관, 식당 등에서 화장실 위치를 물을 때 급하게 사용할 수 있는 필수 표현입니다.
                </p>
              </div>

              {/* 12 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-slate-800 font-mono">아이와 / 라</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">기본 소통</span>
                </div>
                <p className="text-xs text-slate-900 font-bold mt-1">"네 (Yes) / 아니오 (No)"</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  이집트 구어체로 긍정은 "아이와(Aywa)", 부정은 "라(La)"입니다. 가장 짧고 확실한 의사 표현입니다.
                </p>
              </div>

              {/* 13 */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-rose-800 font-mono">임쉬!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-bold">단호한 거절</span>
                </div>
                <p className="text-xs text-rose-950 font-bold mt-1">"저리 가세요 / 비키세요 (Go away)"</p>
                <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                  "라, 슈크란"에도 끈질기게 몸을 잡거나 길을 막는 악성 호객꾼에게 정색하고 외치는 단호한 경고 표현.
                </p>
              </div>

              {/* 14 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-emerald-800 font-mono">슈크란 자질란</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">감사 인사</span>
                </div>
                <p className="text-xs text-emerald-950 font-bold mt-1">"정말 대단히 감사합니다 (Thank you very much)"</p>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  식당, 호텔, 픽업 기사에게 팁을 건네며 말하면 아주 환한 미소로 감사를 표합니다.
                </p>
              </div>

              {/* 15 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-amber-900 font-mono">민 파들락</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">정중한 부탁</span>
                </div>
                <p className="text-xs text-amber-950 font-bold mt-1">"부탁합니다 / 실례합니다 (Please)"</p>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  물건을 요청하거나 길을 물어볼 때 앞에 붙이면 예의 바른 여행자로 대우받습니다 (여성에게는 '민 파들릭').
                </p>
              </div>

              {/* 16 */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-blue-900 font-mono">사바흐 엘 케이르</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">아침 첫인사</span>
                </div>
                <p className="text-xs text-blue-950 font-bold mt-1">"좋은 아침입니다 (Good morning)"</p>
                <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                  아침 투어 출발 시 기사나 호텔 직원에게 먼저 건네보세요. 상대방은 "사바흐 안 누르(빛의 아침)"로 화답합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
