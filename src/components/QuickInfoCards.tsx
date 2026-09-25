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
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('TICKETS')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            subTab === 'TICKETS'
              ? 'bg-white text-blue-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>입장료 & 예약 정보</span>
        </button>
        <button
          onClick={() => setSubTab('DRIVERS')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            subTab === 'DRIVERS'
              ? 'bg-white text-blue-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>택시 / 기사 연락망</span>
        </button>
        <button
          onClick={() => setSubTab('ARABIC')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
            subTab === 'ARABIC'
              ? 'bg-white text-blue-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>생존 아랍어 & 팁</span>
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
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>🗣️</span> 현지 삐끼 퇴치 & 생존 아랍어 치트시트
            </h3>
            <p className="text-xs text-slate-600">
              이집트에서는 이 3마디만 알고 있어도 바가지와 귀찮은 호객의 90%를 피할 수 있습니다!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-rose-800 font-mono">라, 슈크란!</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">호객 퇴치 필수</span>
                </div>
                <p className="text-xs text-rose-950 font-bold mt-1">"아니요, 괜찮습니다 (No, thank you)"</p>
                <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                  낙타, 마차, 기념품 삐끼가 다가올 때 눈을 마주치지 말고 단호하고 정중하게 "라, 슈크란"을 말하며 지나가세요.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-amber-900 font-mono">비캄 다?</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">가격 흥정</span>
                </div>
                <p className="text-xs text-amber-950 font-bold mt-1">"이거 얼마예요? (How much?)"</p>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  시장이나 가게에서 가격을 물을 때 사용합니다. 아랍어로 물어보면 바가지 가격을 덜 부릅니다.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-slate-800 font-mono">갈리 아위!</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">흥정 스킬</span>
                </div>
                <p className="text-xs text-slate-900 font-bold mt-1">"너무 비싸요! (Too expensive!)"</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  상인이 높은 가격을 부를 때 웃으며 "갈리 아위!"라고 외치면 유쾌하게 가격을 깎아줍니다.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-emerald-800 font-mono">슈크란 자질란</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">감사 표현</span>
                </div>
                <p className="text-xs text-emerald-950 font-bold mt-1">"정말 감사합니다 (Thank you very much)"</p>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  식당, 호텔, 택시에서 내릴 때 팁을 건네며 말하면 아주 환한 미소로 화답받습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
