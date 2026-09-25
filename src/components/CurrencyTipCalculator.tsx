import React, { useState, useEffect } from 'react';
import { Currency } from '../types/travel';
import { 
  ExchangeRates, 
  DEFAULT_RATES, 
  convertAmount, 
  formatCurrency, 
  LOCAL_PRICE_TIPS,
  fetchExchangeRates 
} from '../services/currency';
import { 
  ArrowRightLeft, 
  Calculator, 
  Coins, 
  HelpCircle, 
  Sparkles, 
  Info, 
  Check, 
  RefreshCw,
  UtensilsCrossed,
  Compass
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
  const [includeServiceChargeNotice, setIncludeServiceChargeNotice] = useState<boolean>(true);

  // Quick preset amounts in EGP
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

  // Calculate reciprocal values
  const egpVal = sourceCurrency === 'EGP' ? parsedAmount : convertAmount(parsedAmount, sourceCurrency, 'EGP', rates);
  const usdVal = sourceCurrency === 'USD' ? parsedAmount : convertAmount(parsedAmount, sourceCurrency, 'USD', rates);
  const krwVal = sourceCurrency === 'KRW' ? parsedAmount : convertAmount(parsedAmount, sourceCurrency, 'KRW', rates);

  // Tip calculation
  const billEgp = parseFloat(billEgpStr) || 0;
  const tipAmountEgp = (billEgp * tipPercent) / 100;
  const totalWithTipEgp = billEgp + tipAmountEgp;
  const tipKrw = convertAmount(tipAmountEgp, 'EGP', 'KRW', rates);
  const totalKrw = convertAmount(totalWithTipEgp, 'EGP', 'KRW', rates);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Exchange Rate Status & Refresh Header */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 font-semibold">
            실시간 환율 기준:
          </span>
          <span className="font-mono text-blue-700 font-bold">
            1 EGP ≈ {(rates.pairRates.egpToKrw).toFixed(1)}원
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-slate-700">
            $1 ≈ {rates.pairRates.usdToEgp.toFixed(1)} EGP
          </span>
        </div>

        <button
          onClick={refreshRates}
          disabled={isLoadingRates}
          className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-800 font-bold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 1. Main 3-Way Instant Currency Converter */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                실시간 통화 변환기
              </h2>
              <p className="text-[11px] text-slate-500">
                이집트 파운드(EGP) ↔ 미 달러($) ↔ 원화(KRW)
              </p>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['EGP', 'USD', 'KRW'] as Currency[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setSourceCurrency(cur)}
                className={`px-3 py-1 rounded-lg transition ${
                  sourceCurrency === cur
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cur === 'EGP' ? 'EGP (파운드)' : cur === 'USD' ? 'USD ($)' : 'KRW (원)'}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input Box */}
        <div className="relative">
          <input
            type="number"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-50 border-2 border-blue-600/70 rounded-2xl px-4 py-3 text-2xl font-black text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono tracking-tight"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm font-bold text-slate-500">
            <span>{sourceCurrency}</span>
            <button
              onClick={() => setAmountStr('')}
              className="text-xs text-slate-500 hover:text-slate-700 ml-1 px-2 py-0.5 rounded bg-slate-200"
            >
              초기화
            </button>
          </div>
        </div>

        {/* Fast Conversion Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* EGP Card */}
          <div className={`p-3.5 rounded-2xl border transition ${
            sourceCurrency === 'EGP'
              ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              🇪🇬 이집트 파운드 (EGP)
            </span>
            <div className="text-xl font-black font-mono text-amber-950 mt-1">
              {Math.round(egpVal).toLocaleString()} <span className="text-xs font-normal text-amber-700">EGP</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              현지 상점 및 유적지 입장
            </p>
          </div>

          {/* KRW Card */}
          <div className={`p-3.5 rounded-2xl border transition ${
            sourceCurrency === 'KRW'
              ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              🇰🇷 대한민국 원화 (KRW)
            </span>
            <div className="text-xl font-black font-mono text-blue-950 mt-1">
              {Math.round(krwVal).toLocaleString()} <span className="text-xs font-normal text-blue-700">원</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              실체감 한국 금액
            </p>
          </div>

          {/* USD Card */}
          <div className={`p-3.5 rounded-2xl border transition ${
            sourceCurrency === 'USD'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
              🇺🇸 미국 달러 (USD)
            </span>
            <div className="text-xl font-black font-mono text-emerald-950 mt-1">
              ${usdVal.toFixed(2)}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              비자 및 투어 기사 지불
            </p>
          </div>
        </div>

        {/* Quick Amount Buttons (시장/투어 빈출 단위) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            ⚡ 현지 빈출 금액 빠른 계산 (EGP):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {quickAmountsEgp.map((amount) => {
              const krwEquivalent = Math.round(convertAmount(amount, 'EGP', 'KRW', rates));
              return (
                <button
                  key={amount}
                  onClick={() => {
                    setSourceCurrency('EGP');
                    setAmountStr(String(amount));
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex flex-col items-center ${
                    sourceCurrency === 'EGP' && parsedAmount === amount
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className="font-bold">{amount} EGP</span>
                  <span className={`text-[10px] ${sourceCurrency === 'EGP' && parsedAmount === amount ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                    약 {krwEquivalent.toLocaleString()}원
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Restaurant Tip & Local Service Calculator */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              식당 권장 팁 & 셔틀 계산기
            </h2>
            <p className="text-[11px] text-slate-500">
              현지 레스토랑 권장 팁(10~15%) 및 총 결제액 자동 계산
            </p>
          </div>
        </div>

        {/* Tip Input & Percentage Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              음식값 결제 금액 (EGP)
            </label>
            <div className="relative">
              <input
                type="number"
                value={billEgpStr}
                onChange={(e) => setBillEgpStr(e.target.value)}
                placeholder="600"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base font-bold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                EGP
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              팁 비율 선택 (Tip %)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[10, 12, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTipPercent(pct)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    tipPercent === pct
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tip Summary Output Card */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
          <div className="grid grid-cols-2 gap-3 divide-x divide-blue-200/60">
            <div>
              <span className="text-[11px] text-slate-600 font-semibold">권장 팁 금액 ({tipPercent}%)</span>
              <div className="text-xl font-black text-blue-900 font-mono mt-0.5">
                {Math.round(tipAmountEgp).toLocaleString()} EGP
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                (약 {Math.round(tipKrw).toLocaleString()}원)
              </div>
            </div>

            <div className="pl-3">
              <span className="text-[11px] text-slate-600 font-semibold">팁 포함 총 합계</span>
              <div className="text-xl font-black text-emerald-800 font-mono mt-0.5">
                {Math.round(totalWithTipEgp).toLocaleString()} EGP
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                (약 {Math.round(totalKrw).toLocaleString()}원)
              </div>
            </div>
          </div>

          {/* Egyptian Service Charge Advice */}
          <div className="mt-3 pt-2.5 border-t border-blue-200/60 text-[11px] text-slate-700 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900">이집트 영수증 주의사항:</strong> 고급 식당 영수증에는 이미 'Service Charge(12%)'와 'VAT(14%)'가 찍혀 나오는 경우가 많습니다. 이 서비스 차지는 직원에게 가지 않는 경우가 많으므로, 서비스가 훌륭했다면 <strong>5~10% 정도(또는 거스름돈 50~100 EGP)</strong>를 테이블에 직접 팁으로 올려두는 것이 세련된 매너입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Essential Local Price Reference Cards */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              이집트 현지 적정 가격 & 팁 기준 가이드
            </h2>
            <p className="text-[11px] text-slate-500">
              현지 바가지 방지용 적정 시세 가이드라인
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {LOCAL_PRICE_TIPS.map((tip, idx) => {
            const krwEq = Math.round(convertAmount(tip.egpPrice, 'EGP', 'KRW', rates));
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="text-xs font-bold text-slate-900">
                      {tip.title}
                    </h3>
                    {tip.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        {tip.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">적정 시세:</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="font-bold text-blue-700">{tip.egpPrice} EGP</span>
                    <span className="text-[11px] text-slate-500">(약 {krwEq.toLocaleString()}원)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
