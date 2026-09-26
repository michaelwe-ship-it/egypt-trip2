import React, { useState } from 'react';
import { Currency } from '../types/travel';
import { 
  ExchangeRates, 
  DEFAULT_RATES, 
  convertAmount, 
  LOCAL_PRICE_TIPS,
  fetchExchangeRates 
} from '../services/currency';
import { 
  Coins, 
  Info, 
  RefreshCw,
  UtensilsCrossed,
  Compass,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
} from 'lucide-react';

interface CurrencyTipCalculatorProps {
  rates?: ExchangeRates;
}

export const CurrencyTipCalculator: React.FC<CurrencyTipCalculatorProps> = ({
  rates: propRates,
}) => {
  const [rates, setRates] = useState<ExchangeRates>(propRates || DEFAULT_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Currency Converter states
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('EGP');
  const [amountStr, setAmountStr] = useState<string>('700');

  // Tip Calculator states
  const [billEgpStr, setBillEgpStr] = useState<string>('600');
  const [tipPercent, setTipPercent] = useState<number>(12);
  const [isReceiptNoticeOpen, setIsReceiptNoticeOpen] = useState<boolean>(false);

  // Local Price Reference states
  const [expandedPriceTips, setExpandedPriceTips] = useState<Record<number, boolean>>({});
  const [expandAllPriceTips, setExpandAllPriceTips] = useState<boolean>(false);

  const quickAmountsEgp = [50, 100, 200, 300, 500, 700, 1000, 1500, 3000];

  const refreshRates = async () => {
    setIsLoadingRates(true);
    try {
      const fresh = await fetchExchangeRates();
      setRates(fresh);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  const egpVal = sourceCurrency === 'EGP' ? parsedAmount : convertAmount(parsedAmount, sourceCurrency, 'EGP', rates);
  const usdVal = sourceCurrency === 'USD' ? parsedAmount : convertAmount(parsedAmount, sourceCurrency, 'USD', rates);
  const krwVal = sourceCurrency === 'KRW' ? parsedAmount : convertAmount(parsedAmount, sourceCurrency, 'KRW', rates);

  const billEgp = parseFloat(billEgpStr) || 0;
  const tipAmountEgp = (billEgp * tipPercent) / 100;
  const totalWithTipEgp = billEgp + tipAmountEgp;
  const tipKrw = convertAmount(tipAmountEgp, 'EGP', 'KRW', rates);
  const totalKrw = convertAmount(totalWithTipEgp, 'EGP', 'KRW', rates);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Exchange Rate Status & Refresh Header */}
      <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-500 font-medium">환율:</span>
          <span className="font-mono text-blue-700 font-bold">
            1 EGP ≈ {(rates.pairRates.egpToKrw).toFixed(1)}원
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-slate-700">
            $1 ≈ {rates.pairRates.usdToEgp.toFixed(1)} EGP
          </span>
        </div>

        <button
          onClick={refreshRates}
          disabled={isLoadingRates}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-bold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition shrink-0"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 1. Main 3-Way Instant Currency Converter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              실시간 통화 변환기
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">EGP ↔ USD ↔ KRW</span>
        </div>

        {/* Currency Segmented Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {(['EGP', 'USD', 'KRW'] as Currency[]).map((cur) => (
            <button
              key={cur}
              onClick={() => setSourceCurrency(cur)}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition min-h-[36px] active:scale-95 ${
                sourceCurrency === cur
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cur === 'EGP' ? '🇪🇬 EGP' : cur === 'USD' ? '🇺🇸 USD ($)' : '🇰🇷 KRW (원)'}
            </button>
          ))}
        </div>

        {/* Amount Input Box */}
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-50 border-2 border-blue-600/50 rounded-xl px-3.5 py-2.5 text-xl font-black text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono tracking-tight"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="font-mono text-sm text-blue-700">{sourceCurrency}</span>
            {amountStr && (
              <button
                onClick={() => setAmountStr('')}
                className="px-2 py-1 rounded-md bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[11px] font-bold active:scale-90 transition"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* Fast Conversion Result Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`p-2.5 rounded-xl border transition ${
            sourceCurrency === 'EGP'
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-slate-50 border-slate-200/80'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 block">
              🇪🇬 EGP
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-0.5 truncate">
              {Math.round(egpVal).toLocaleString()}
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border transition ${
            sourceCurrency === 'KRW'
              ? 'bg-blue-50/70 border-blue-300'
              : 'bg-slate-50 border-slate-200/80'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 block">
              🇰🇷 원화 (KRW)
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-blue-900 mt-0.5 truncate">
              {Math.round(krwVal).toLocaleString()}원
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border transition ${
            sourceCurrency === 'USD'
              ? 'bg-emerald-50/70 border-emerald-300'
              : 'bg-slate-50 border-slate-200/80'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 block">
              🇺🇸 달러 (USD)
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-900 mt-0.5 truncate">
              ${usdVal.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {quickAmountsEgp.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSourceCurrency('EGP');
                  setAmountStr(String(amount));
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition active:scale-95 ${
                  sourceCurrency === 'EGP' && amountStr === String(amount)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {amount} EGP
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Restaurant Tip Calculator */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              식당 권장 팁 계산기
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsReceiptNoticeOpen(!isReceiptNoticeOpen)}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>영수증 팁 주의사항</span>
            {isReceiptNoticeOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isReceiptNoticeOpen && (
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900">이집트 영수증 주의사항:</strong> 고급 식당 영수증에는 이미 'Service Charge(12%)'와 'VAT(14%)'가 찍혀 나오는 경우가 많습니다. 이 서비스 차지는 직원에게 가지 않는 경우가 많으므로, 서비스가 훌륭했다면 <strong>5~10% 정도(또는 거스름돈 50~100 EGP)</strong>를 테이블에 직접 팁으로 올려두는 것이 세련된 매너입니다.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={billEgpStr}
              onChange={(e) => setBillEgpStr(e.target.value)}
              placeholder="600"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base font-bold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
              음식값 (EGP)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[10, 12, 15, 20].map((pct) => (
              <button
                key={pct}
                onClick={() => setTipPercent(pct)}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  tipPercent === pct
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 divide-x divide-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">권장 팁 ({tipPercent}%)</span>
            <div className="text-base font-black text-blue-700 font-mono mt-0.5">
              {Math.round(tipAmountEgp).toLocaleString()} EGP
              <span className="text-[11px] text-slate-500 font-normal ml-1">
                (약 {Math.round(tipKrw).toLocaleString()}원)
              </span>
            </div>
          </div>

          <div className="pl-3">
            <span className="text-[11px] text-slate-500 font-medium">팁 포함 총액</span>
            <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
              {Math.round(totalWithTipEgp).toLocaleString()} EGP
              <span className="text-[11px] text-slate-500 font-normal ml-1">
                (약 {Math.round(totalKrw).toLocaleString()}원)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Essential Local Price Reference Cards (Expandable) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                현지 적정 시세 & 박시시(팁) 기준
              </h2>
              <p className="text-[11px] text-slate-500">
                항목을 누르면 상세 바가지 대처 팁이 펼쳐집니다.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setExpandAllPriceTips(!expandAllPriceTips);
              setExpandedPriceTips({});
            }}
            className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{expandAllPriceTips ? '접기' : '모두 펼치기'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LOCAL_PRICE_TIPS.map((tip, idx) => {
            const krwEq = Math.round(convertAmount(tip.egpPrice, 'EGP', 'KRW', rates));
            const isOpen = expandedPriceTips[idx] ?? expandAllPriceTips;

            return (
              <div
                key={idx}
                onClick={() =>
                  setExpandedPriceTips((prev) => ({
                    ...prev,
                    [idx]: !isOpen,
                  }))
                }
                className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      {tip.badge && (
                        <>
                          <span className="font-bold text-blue-600">{tip.badge}</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span className="font-mono font-bold text-slate-800">{tip.egpPrice} EGP</span>
                      <span className="font-mono text-slate-400">(약 {krwEq.toLocaleString()}원)</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                      {tip.title}
                    </h3>
                  </div>

                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>

                {isOpen && (
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-2 pt-2 border-t border-slate-200/70">
                    {tip.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
