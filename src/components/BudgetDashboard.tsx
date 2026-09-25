import React, { useState } from 'react';
import { BudgetItem, BudgetCategory, PaymentTiming, Currency, City } from '../types/travel';
import { 
  CreditCard, 
  Wallet, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  DollarSign, 
  PieChart, 
  Sparkles,
  Plane,
  Building,
  Ticket,
  UtensilsCrossed,
  Car,
  Gift,
  Coins
} from 'lucide-react';
import { formatCurrency, convertAmount, DEFAULT_RATES, ExchangeRates } from '../services/currency';

interface BudgetDashboardProps {
  budget: BudgetItem[];
  rates?: ExchangeRates;
  selectedCity: City;
  onUpdateBudget: (budget: BudgetItem[]) => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  budget,
  rates = DEFAULT_RATES,
  selectedCity,
  onUpdateBudget,
}) => {
  const [timingFilter, setTimingFilter] = useState<'ALL' | 'PREPAID' | 'ONSITE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<BudgetCategory>('TOUR_ENTRY');
  const [formTiming, setFormTiming] = useState<PaymentTiming>('ONSITE');
  const [formCurrency, setFormCurrency] = useState<Currency>('EGP');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formPaidAmount, setFormPaidAmount] = useState<number>(0);
  const [formIsPaid, setFormIsPaid] = useState<boolean>(false);
  const [formCity, setFormCity] = useState<'CAIRO' | 'LUXOR' | 'ASWAN' | 'HURGHADA' | 'COMMON'>('COMMON');
  const [formMemo, setFormMemo] = useState('');

  // Cash in hand tracker settings (USD cash & EGP cash)
  const [totalUsdCash, setTotalUsdCash] = useState<number>(1000); // e.g. brought $1,000 in cash
  const [totalEgpCash, setTotalEgpCash] = useState<number>(5000); // e.g. exchanged 5,000 EGP

  // Filter items
  const filteredBudget = budget.filter((item) => {
    if (timingFilter !== 'ALL' && item.timing !== timingFilter) return false;
    if (selectedCity !== 'ALL' && item.city !== 'COMMON' && item.city !== selectedCity) return false;
    return true;
  });

  // Calculate totals
  let totalKrwAll = 0;
  let prepaidKrw = 0;
  let onsiteKrw = 0;
  let onsiteUsdTotal = 0;
  let onsiteEgpTotal = 0;
  let actualPaidKrw = 0;

  for (const item of budget) {
    const krw = convertAmount(item.amount, item.currency, 'KRW', rates);
    totalKrwAll += krw;

    if (item.timing === 'PREPAID') {
      prepaidKrw += krw;
    } else {
      onsiteKrw += krw;
      if (item.currency === 'USD') onsiteUsdTotal += item.amount;
      if (item.currency === 'EGP') onsiteEgpTotal += item.amount;
      if (item.currency === 'KRW') {
        // also count converted equivalent for estimation
      }
    }

    if (item.isPaid) {
      actualPaidKrw += krw;
    }
  }

  const handleTogglePaid = (id: string) => {
    const updated = budget.map((b) => {
      if (b.id === id) {
        const nextPaid = !b.isPaid;
        return {
          ...b,
          isPaid: nextPaid,
          paidAmount: nextPaid ? b.amount : 0,
        };
      }
      return b;
    });
    onUpdateBudget(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 예산 항목을 삭제하시겠습니까?')) {
      onUpdateBudget(budget.filter(b => b.id !== id));
    }
  };

  const handleOpenEdit = (item: BudgetItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormTiming(item.timing);
    setFormCurrency(item.currency);
    setFormAmount(item.amount);
    setFormPaidAmount(item.paidAmount || 0);
    setFormIsPaid(item.isPaid);
    setFormCity(item.city);
    setFormMemo(item.memo || '');
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('TOUR_ENTRY');
    setFormTiming('ONSITE');
    setFormCurrency('EGP');
    setFormAmount(0);
    setFormPaidAmount(0);
    setFormIsPaid(false);
    setFormCity(selectedCity === 'ALL' ? 'COMMON' : selectedCity);
    setFormMemo('');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || formAmount <= 0) {
      alert('항목명과 유효한 금액을 입력해주세요.');
      return;
    }

    if (editingItem) {
      const updated = budget.map((b) => {
        if (b.id === editingItem.id) {
          return {
            ...b,
            title: formTitle.trim(),
            category: formCategory,
            timing: formTiming,
            currency: formCurrency,
            amount: formAmount,
            paidAmount: formIsPaid ? formAmount : 0,
            isPaid: formIsPaid,
            city: formCity,
            memo: formMemo.trim() || undefined,
          };
        }
        return b;
      });
      onUpdateBudget(updated);
    } else {
      const newItem: BudgetItem = {
        id: `budget_${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        timing: formTiming,
        currency: formCurrency,
        amount: formAmount,
        paidAmount: formIsPaid ? formAmount : 0,
        isPaid: formIsPaid,
        city: formCity,
        memo: formMemo.trim() || undefined,
      };
      onUpdateBudget([...budget, newItem]);
    }

    setIsModalOpen(false);
  };

  const getCategoryBadge = (cat: BudgetCategory) => {
    switch (cat) {
      case 'FLIGHT': return { label: '항공권', icon: <Plane className="w-3 h-3" /> };
      case 'HOTEL': return { label: '호텔숙소', icon: <Building className="w-3 h-3" /> };
      case 'TOUR_ENTRY': return { label: '투어/입장료', icon: <Ticket className="w-3 h-3" /> };
      case 'FOOD': return { label: '식비/카페', icon: <UtensilsCrossed className="w-3 h-3" /> };
      case 'TRANSPORT': return { label: '택시/교통', icon: <Car className="w-3 h-3" /> };
      case 'SHOPPING': return { label: '쇼핑/기념품', icon: <Gift className="w-3 h-3" /> };
      case 'TIPS_MISC': return { label: '팁/기타', icon: <Coins className="w-3 h-3" /> };
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* 1. Summary Cards Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Estimated Budget */}
        <div className="p-4 rounded-3xl bg-blue-600 text-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-100">
            <span className="font-semibold flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-blue-200" />
              총 예상 여행 경비
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
              부부 2인 전체
            </span>
          </div>
          <div className="text-2xl font-black font-mono mt-1 tracking-tight text-white">
            약 {Math.round(totalKrwAll).toLocaleString()}원
          </div>
          <div className="text-[11px] text-blue-100 mt-1 flex items-center justify-between">
            <span>실제 결제 완료:</span>
            <span className="font-bold text-white font-mono">
              {Math.round(actualPaidKrw).toLocaleString()}원 ({Math.round((actualPaidKrw / totalKrwAll) * 100) || 0}%)
            </span>
          </div>
        </div>

        {/* 1. Prepaid Completed */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              1. 사전 결제 완료
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              항공 · 호텔
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono mt-1">
            {Math.round(prepaidKrw).toLocaleString()}원
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            국제선 왕복 + 국내선 2회 + 5성급 호텔
          </p>
        </div>

        {/* 2. Onsite Budget Requirements (USD + EGP combined) */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
              2. 현지 지불 예정 경비
            </span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
              달러 + EGP
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono mt-1">
            약 {Math.round(onsiteKrw).toLocaleString()}원
          </div>
          <div className="text-[11px] text-slate-700 font-mono mt-1 flex items-center gap-2">
            <span className="text-blue-700 font-bold">${onsiteUsdTotal}</span>
            <span className="text-slate-400">+</span>
            <span className="text-amber-800 font-bold">{onsiteEgpTotal.toLocaleString()} EGP</span>
          </div>
        </div>
      </div>

      {/* 2. Timing Filter & Add Button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setTimingFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition ${
              timingFilter === 'ALL'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 ({budget.length})
          </button>
          <button
            onClick={() => setTimingFilter('PREPAID')}
            className={`px-3 py-1.5 rounded-xl transition ${
              timingFilter === 'PREPAID'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            사전 결제 완료 ({budget.filter(b => b.timing === 'PREPAID').length})
          </button>
          <button
            onClick={() => setTimingFilter('ONSITE')}
            className={`px-3 py-1.5 rounded-xl transition ${
              timingFilter === 'ONSITE'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            현지 지불 예정 ({budget.filter(b => b.timing === 'ONSITE').length})
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>지출 항목 추가</span>
        </button>
      </div>

      {/* 3. Budget Items List */}
      <div className="space-y-2.5">
        {filteredBudget.map((item) => {
          const cat = getCategoryBadge(item.category);
          const krwVal = convertAmount(item.amount, item.currency, 'KRW', rates);

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.isPaid
                  ? 'bg-slate-50/80 border-slate-200 opacity-65'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Complete / Paid Toggle */}
                <button
                  onClick={() => handleTogglePaid(item.id)}
                  className={`p-1 rounded-full transition ${
                    item.isPaid
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-slate-400 hover:text-blue-600'
                  }`}
                  title={item.isPaid ? '결제 취소' : '결제 완료 표시'}
                >
                  {item.isPaid ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 font-medium">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      item.timing === 'PREPAID'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {item.timing === 'PREPAID' ? '사전결제' : '현지지불'}
                    </span>

                    {item.city !== 'COMMON' && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        ({item.city === 'CAIRO' ? '카이로' : item.city === 'LUXOR' ? '룩소르' : item.city})
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold mt-1 ${item.isPaid ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>

                  {item.memo && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.memo}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <div className="text-sm font-black text-slate-900">
                    {formatCurrency(item.amount, item.currency)}
                  </div>
                  {item.currency !== 'KRW' && (
                    <div className="text-[11px] text-slate-500">
                      약 {Math.round(krwVal).toLocaleString()}원
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                    title="수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Add/Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              {editingItem ? '지출 항목 수정' : '새 지출 항목 추가'}
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">항목명 *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 룩소르 서안 기사 대절비, 식사비"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">카테고리</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                  >
                    <option value="FLIGHT">항공권 (FLIGHT)</option>
                    <option value="HOTEL">호텔/숙소 (HOTEL)</option>
                    <option value="TOUR_ENTRY">투어/입장료 (TOUR_ENTRY)</option>
                    <option value="FOOD">식비/카페 (FOOD)</option>
                    <option value="TRANSPORT">교통/택시 (TRANSPORT)</option>
                    <option value="SHOPPING">쇼핑/기념품 (SHOPPING)</option>
                    <option value="TIPS_MISC">팁/비상금 (TIPS_MISC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">결제 시점</label>
                  <select
                    value={formTiming}
                    onChange={(e) => setFormTiming(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                  >
                    <option value="ONSITE">현지 지불 예정 (ONSITE)</option>
                    <option value="PREPAID">사전 결제 완료 (PREPAID)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">금액 (숫자) *</label>
                  <input
                    type="number"
                    value={formAmount || ''}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    placeholder="1000"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">통화</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white"
                  >
                    <option value="EGP">EGP</option>
                    <option value="USD">USD ($)</option>
                    <option value="KRW">KRW (원)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={formIsPaid}
                    onChange={(e) => setFormIsPaid(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 bg-white border-slate-300"
                  />
                  <span className="font-bold text-slate-800">이미 결제 완료함 (지불 완료)</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">메모</label>
                <input
                  type="text"
                  value={formMemo}
                  onChange={(e) => setFormMemo(e.target.value)}
                  placeholder="예: 2인 티켓, 카드 결제 전용"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
  );
};
