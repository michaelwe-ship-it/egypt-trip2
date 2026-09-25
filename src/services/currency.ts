import { Currency } from '../types/travel';

export interface ExchangeRates {
  USD: number;
  EGP: number;
  KRW: number;
  pairRates: {
    egpToKrw: number;
    krwToEgp: number;
    usdToEgp: number;
    egpToUsd: number;
    usdToKrw: number;
    krwToUsd: number;
  };
  lastUpdated?: string;
}

export const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  EGP: 48.70,
  KRW: 1380.0,
  pairRates: {
    egpToKrw: 28.34,
    krwToEgp: 0.0353,
    usdToEgp: 48.70,
    egpToUsd: 0.02053,
    usdToKrw: 1380.0,
    krwToUsd: 0.000725,
  },
  lastUpdated: '최신 기준 (1 USD ≈ 48.7 EGP ≈ 1,380 KRW)',
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch('/api/exchange-rates');
    if (!res.ok) throw new Error('API network error');
    const data = await res.json();
    return {
      ...data,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (e) {
    console.warn('Using default exchange rates due to error:', e);
    return DEFAULT_RATES;
  }
}

export function convertAmount(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRates = DEFAULT_RATES
): number {
  if (from === to || !amount) return amount || 0;

  // Normalize to USD first
  let inUsd = 0;
  if (from === 'USD') inUsd = amount;
  else if (from === 'EGP') inUsd = amount / rates.pairRates.usdToEgp;
  else if (from === 'KRW') inUsd = amount / rates.pairRates.usdToKrw;

  // Convert USD to target currency
  if (to === 'USD') return inUsd;
  if (to === 'EGP') return inUsd * rates.pairRates.usdToEgp;
  if (to === 'KRW') return inUsd * rates.pairRates.usdToKrw;

  return amount;
}

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  }
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  }
  // EGP
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(amount)} EGP`;
}

export function formatCompactKRW(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억 원`;
  }
  if (amount >= 10000) {
    return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만 원`;
  }
  return `${Math.round(amount).toLocaleString('ko-KR')}원`;
}

// Local benchmark tips in Egypt
export interface LocalPriceTip {
  title: string;
  category: string;
  egpPrice: number;
  description: string;
  badge?: string;
}

export const LOCAL_PRICE_TIPS: LocalPriceTip[] = [
  {
    title: '화장실 이용 팁 (Baksheesh)',
    category: 'TIP',
    egpPrice: 10,
    description: '관광지 공용 화장실 입구 관리인에게 지불 (10~20 EGP 잔돈 필수)',
    badge: '필수 잔돈',
  },
  {
    title: '호텔 포터 / 캐리어 짐 운반',
    category: 'TIP',
    egpPrice: 50,
    description: '가방 1~2개당 50~100 EGP 또는 $1~2 달러 전달',
  },
  {
    title: '호텔 객실 룸 메이드 팁',
    category: 'TIP',
    egpPrice: 50,
    description: '침대 베개 위에 50 EGP 또는 $1 지불 (연박 시)',
  },
  {
    title: '피라미드 내부 전동 셔틀 버스',
    category: 'TRANSPORT',
    egpPrice: 700,
    description: '넓은 피라미드 단지를 카트로 쾌적하게 이동하는 공식 셔틀 티켓',
    badge: '추천',
  },
  {
    title: '나일강 펠루카 (1시간 프라이빗)',
    category: 'TOUR',
    egpPrice: 350,
    description: '1시간 기준 300~400 EGP가 현지 적정가 (선장 팁 50 EGP 별도)',
    badge: '흥정 기준',
  },
  {
    title: '생수 1.5L 대형 (마트 기준)',
    category: 'FOOD',
    egpPrice: 15,
    description: '동네 슈퍼 10~15 EGP. 유적지 앞에서는 30~50 EGP 부르므로 흥정',
  },
  {
    title: '사탕수수 생과일 주스 (아쌉)',
    category: 'FOOD',
    egpPrice: 15,
    description: '현지 로컬 주스 가게에서 즉석 착즙 10~20 EGP로 피로 회복',
    badge: '별미',
  },
  {
    title: '전용 차량 투어 기사 1일 팁',
    category: 'TIP',
    egpPrice: 200,
    description: '하루 종일 안전하게 운전해 준 기사님께 150~250 EGP 권장',
  },
];
