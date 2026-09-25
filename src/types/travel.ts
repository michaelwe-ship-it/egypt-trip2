export type City = 'ALL' | 'CAIRO' | 'LUXOR' | 'ASWAN' | 'HURGHADA';

export type TransportType = 'FLIGHT' | 'TAXI' | 'WALK' | 'FELUCCA' | 'TOUR_BUS' | 'OTHER';

export type ItineraryStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export type Currency = 'EGP' | 'USD' | 'KRW';

export interface ItineraryItem {
  id: string;
  dayNumber: number; // 1 to 6+
  dateStr: string; // e.g., "10/28 (수)"
  city: 'CAIRO' | 'LUXOR' | 'ASWAN' | 'HURGHADA';
  time: string; // e.g., "14:30"
  title: string;
  location: string;
  transport?: TransportType;
  transportNote?: string;
  memo?: string;
  tips?: string;
  status: ItineraryStatus;
  cost?: {
    amount: number;
    currency: Currency;
    description?: string;
  };
  highlight?: boolean;
}

export type BudgetCategory = 
  | 'FLIGHT' 
  | 'HOTEL' 
  | 'TOUR_ENTRY' 
  | 'FOOD' 
  | 'TRANSPORT' 
  | 'TIPS_MISC' 
  | 'SHOPPING';

export type PaymentTiming = 'PREPAID' | 'ONSITE';

export interface BudgetItem {
  id: string;
  title: string;
  category: BudgetCategory;
  timing: PaymentTiming;
  currency: Currency;
  amount: number;
  paidAmount?: number;
  isPaid: boolean;
  city: 'CAIRO' | 'LUXOR' | 'ASWAN' | 'HURGHADA' | 'COMMON';
  memo?: string;
  date?: string;
}

export interface DriverContact {
  id: string;
  name: string;
  city: string;
  phone: string;
  whatsapp: string;
  recommendedRoute: string;
  estimatedPrice: string;
  notes: string;
}

export interface TicketInfo {
  id: string;
  name: string;
  city: 'CAIRO' | 'LUXOR' | 'ASWAN' | 'HURGHADA';
  priceEgp: number;
  priceNote?: string;
  paymentMethod: 'CARD_ONLY' | 'CASH_CARD' | 'ONLINE_REQUIRED';
  bestTime: string;
  tips: string[];
}

export interface AppState {
  roomId: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
  itinerary: ItineraryItem[];
  budget: BudgetItem[];
  drivers: DriverContact[];
  userRole?: 'HUSBAND' | 'WIFE' | 'GUEST';
}
