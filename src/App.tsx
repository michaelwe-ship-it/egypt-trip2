import React, { useState, useEffect, useRef } from 'react';
import { 
  ItineraryItem, 
  BudgetItem, 
  DriverContact, 
  City,
  ItineraryStatus
} from './types/travel';
import { 
  INITIAL_ITINERARY, 
  INITIAL_BUDGET, 
  INITIAL_DRIVERS 
} from './data/initialData';
import { 
  FirebaseSyncService 
} from './services/firebaseSync';
import { 
  ConnectionStatus 
} from './services/websocket';
import { 
  DEFAULT_RATES, 
  fetchExchangeRates, 
  ExchangeRates 
} from './services/currency';

// Components
import { Header } from './components/Header';
import { CityFilter } from './components/CityFilter';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { ItineraryDetailed } from './components/ItineraryDetailed';
import { ItineraryModal } from './components/ItineraryModal';
import { CurrencyTipCalculator } from './components/CurrencyTipCalculator';
import { QuickInfoCards } from './components/QuickInfoCards';
import { BudgetDashboard } from './components/BudgetDashboard';
import { HistoryGuideTab } from './components/HistoryGuideTab';
import { SyncModal } from './components/SyncModal';
import { EmergencyModal } from './components/EmergencyModal';

// Icons
import { 
  CalendarDays, 
  Coins, 
  TicketCheck, 
  WalletCards, 
  Sparkles, 
  LayoutList, 
  ListTree, 
  BellRing,
  Users,
  Landmark
} from 'lucide-react';

type MainTab = 'ITINERARY' | 'CALCULATOR' | 'QUICK_INFO' | 'BUDGET' | 'HISTORY_GUIDE';
type ItineraryViewMode = 'TIMELINE' | 'DETAILED';

export default function App() {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<MainTab>('ITINERARY');
  const [selectedCity, setSelectedCity] = useState<City>('ALL');
  const [itineraryViewMode, setItineraryViewMode] = useState<ItineraryViewMode>('TIMELINE');

  // Application Data States
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('egypt_itinerary_cache');
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });
  const [budget, setBudget] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('egypt_budget_cache');
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });
  const [drivers, setDrivers] = useState<DriverContact[]>(() => {
    const saved = localStorage.getItem('egypt_drivers_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset to updated verified drivers if old placeholder numbers exist
        if (parsed.some((d: any) => d.phone && d.phone.includes('1234567'))) {
          return INITIAL_DRIVERS;
        }
        return parsed;
      } catch {
        return INITIAL_DRIVERS;
      }
    }
    return INITIAL_DRIVERS;
  });
  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_RATES);

  // Sync & User States
  const [userRole, setUserRole] = useState<'HUSBAND' | 'WIFE'>(() => {
    return (localStorage.getItem('egypt_user_role') as any) || 'HUSBAND';
  });
  const [roomId, setRoomId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const r = urlParams.get('room');
      if (r) return r.trim().toLowerCase();
      const saved = localStorage.getItem('egypt_room_id');
      if (saved) return saved;
    }
    return 'egypt-10th-anniversary';
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('CONNECTING');
  const [connectedCount, setConnectedCount] = useState<number>(1);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Modals
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [targetAddDay, setTargetAddDay] = useState<number>(1);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const syncServiceRef = useRef<FirebaseSyncService | null>(null);

  // Cache changes to localStorage
  useEffect(() => {
    localStorage.setItem('egypt_itinerary_cache', JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem('egypt_budget_cache', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('egypt_drivers_cache', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('egypt_user_role', userRole);
    if (syncServiceRef.current) {
      syncServiceRef.current.setUserName(userRole === 'HUSBAND' ? '남편' : '아내');
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('egypt_room_id', roomId);
  }, [roomId]);

  // Load live exchange rates
  useEffect(() => {
    fetchExchangeRates().then(setRates).catch(console.warn);
  }, []);

  // Show temporary toast notification
  const showToast = (message: string) => {
    setSyncToast(message);
    setTimeout(() => {
      setSyncToast(null);
    }, 3200);
  };

  // Initialize Real-Time Sync Service with Firebase Realtime Database
  useEffect(() => {
    const service = new FirebaseSyncService(roomId, userRole === 'HUSBAND' ? '남편' : '아내');
    syncServiceRef.current = service;

    service.setHandlers({
      onInit: (state, count) => {
        if (state.itinerary && state.itinerary.length > 0) setItinerary(state.itinerary);
        if (state.budget && state.budget.length > 0) setBudget(state.budget);
        if (state.drivers && state.drivers.length > 0) setDrivers(state.drivers);
        setConnectedCount(count);
      },
      onItineraryUpdate: (newItinerary, _v, updatedBy) => {
        setItinerary(newItinerary);
        if (updatedBy) {
          showToast(`✨ ${updatedBy}님이 일정을 수정했습니다`);
        }
      },
      onBudgetUpdate: (newBudget, _v, updatedBy) => {
        setBudget(newBudget);
        if (updatedBy) {
          showToast(`💰 ${updatedBy}님이 예산 내역을 업데이트했습니다`);
        }
      },
      onDriversUpdate: (newDrivers, _v, updatedBy) => {
        setDrivers(newDrivers);
        if (updatedBy) {
          showToast(`🚕 ${updatedBy}님이 기사 연락처를 업데이트했습니다`);
        }
      },
      onPresenceChange: (count, userName, action) => {
        setConnectedCount(count);
        if (action === 'joined' && userName) {
          showToast(`🟢 ${userName}님이 동기화에 접속했습니다!`);
        }
      },
      onStatusChange: (status) => {
        setConnectionStatus(status);
      },
    });

    service.connect();

    return () => {
      service.destroy();
    };
  }, [roomId]);

  // Handler for room change
  const handleChangeRoom = (newRoom: string) => {
    setRoomId(newRoom);
    if (syncServiceRef.current) {
      syncServiceRef.current.connect(newRoom);
    }
  };

  // Handler for resetting data
  const handleResetData = () => {
    setItinerary(INITIAL_ITINERARY);
    setBudget(INITIAL_BUDGET);
    setDrivers(INITIAL_DRIVERS);
    if (syncServiceRef.current) {
      syncServiceRef.current.updateItinerary(INITIAL_ITINERARY);
      syncServiceRef.current.updateBudget(INITIAL_BUDGET);
      syncServiceRef.current.updateDrivers(INITIAL_DRIVERS);
    }
    showToast('기본 일정 및 예산으로 초기화되었습니다.');
  };

  // Itinerary CRUD actions with Real-time Broadcast
  const handleSaveItineraryItem = (item: ItineraryItem) => {
    let updated: ItineraryItem[];
    const exists = itinerary.some(i => i.id === item.id);
    if (exists) {
      updated = itinerary.map(i => i.id === item.id ? item : i);
    } else {
      updated = [...itinerary, item];
    }
    setItinerary(updated);
    if (syncServiceRef.current) {
      syncServiceRef.current.updateItinerary(updated);
    }
  };

  const handleDeleteItineraryItem = (id: string) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      const updated = itinerary.filter(i => i.id !== id);
      setItinerary(updated);
      if (syncServiceRef.current) {
        syncServiceRef.current.updateItinerary(updated);
      }
    }
  };

  const handleToggleItineraryStatus = (id: string) => {
    const updated = itinerary.map((item) => {
      if (item.id === id) {
        const nextStatus: ItineraryStatus = item.status === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setItinerary(updated);
    if (syncServiceRef.current) {
      syncServiceRef.current.updateItinerary(updated);
    }
  };

  // Budget Update with Broadcast
  const handleUpdateBudget = (newBudget: BudgetItem[]) => {
    setBudget(newBudget);
    if (syncServiceRef.current) {
      syncServiceRef.current.updateBudget(newBudget);
    }
  };

  // Drivers Update with Broadcast
  const handleUpdateDrivers = (newDrivers: DriverContact[]) => {
    setDrivers(newDrivers);
    if (syncServiceRef.current) {
      syncServiceRef.current.updateDrivers(newDrivers);
    }
  };

  // Count items per city for filter badge
  const cityCounts: Record<City, number> = {
    ALL: itinerary.length,
    CAIRO: itinerary.filter(i => i.city === 'CAIRO').length,
    LUXOR: itinerary.filter(i => i.city === 'LUXOR').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-24 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header with Dual Clock & Couple Sync Status */}
      <Header
        status={connectionStatus}
        connectedCount={connectedCount}
        userRole={userRole}
        setUserRole={setUserRole}
        roomId={roomId}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Real-time Sync Toast Notification */}
      {syncToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-slate-900 text-white font-semibold text-xs shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* 2. Top City Filter Sub-bar */}
      <CityFilter
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        counts={cityCounts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-4 py-4 space-y-4 pb-28 sm:pb-24">
        {/* Section Title & View Switcher (for Itinerary Tab) */}
        {activeTab === 'ITINERARY' && (
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>🗓️</span> 이집트 10주년 여행 일정
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                10/28(수) ~ 11/2(월) 부부 실시간 동기화 일정표
              </p>
            </div>

            {/* View Mode Toggle: Timeline vs Detailed */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setItineraryViewMode('TIMELINE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  itineraryViewMode === 'TIMELINE'
                    ? 'bg-white text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="일별 타임라인 뷰"
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>타임라인</span>
              </button>
              <button
                onClick={() => setItineraryViewMode('DETAILED')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  itineraryViewMode === 'DETAILED'
                    ? 'bg-white text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="상세 일정 보기 뷰"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>상세보기</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Itinerary (Timeline / Detailed) */}
        {activeTab === 'ITINERARY' && (
          <>
            {itineraryViewMode === 'TIMELINE' ? (
              <ItineraryTimeline
                items={itinerary}
                selectedCity={selectedCity}
                onAddItem={(day) => {
                  setTargetAddDay(day);
                  setEditingItem(null);
                  setIsItineraryModalOpen(true);
                }}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setIsItineraryModalOpen(true);
                }}
                onDeleteItem={handleDeleteItineraryItem}
                onToggleStatus={handleToggleItineraryStatus}
              />
            ) : (
              <ItineraryDetailed
                items={itinerary}
                selectedCity={selectedCity}
                onAddItem={(day) => {
                  setTargetAddDay(day);
                  setEditingItem(null);
                  setIsItineraryModalOpen(true);
                }}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setIsItineraryModalOpen(true);
                }}
                onDeleteItem={handleDeleteItineraryItem}
                onToggleStatus={handleToggleItineraryStatus}
              />
            )}
          </>
        )}

        {/* Tab 2: Currency & Tips Calculator */}
        {activeTab === 'CALCULATOR' && (
          <CurrencyTipCalculator rates={rates} />
        )}

        {/* Tab 3: Essential Tour & Driver Quick Info */}
        {activeTab === 'QUICK_INFO' && (
          <QuickInfoCards
            drivers={drivers}
            selectedCity={selectedCity}
            onUpdateDrivers={handleUpdateDrivers}
          />
        )}

        {/* Tab 4: Budget & Expenses Dashboard */}
        {activeTab === 'BUDGET' && (
          <BudgetDashboard
            budget={budget}
            rates={rates}
            selectedCity={selectedCity}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {/* Tab 5: History & Essential Guides */}
        {activeTab === 'HISTORY_GUIDE' && (
          <HistoryGuideTab />
        )}
      </main>

      {/* 4. Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-area-bottom">
        <div className="max-w-lg mx-auto grid grid-cols-5 px-1.5 py-1.5">
          {/* Tab 1: Itinerary */}
          <button
            onClick={() => setActiveTab('ITINERARY')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeTab === 'ITINERARY'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition ${activeTab === 'ITINERARY' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : ''}`}>
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5">일정</span>
          </button>

          {/* Tab 2: Currency & Tips */}
          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeTab === 'CALCULATOR'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition ${activeTab === 'CALCULATOR' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : ''}`}>
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5">환율·팁</span>
          </button>

          {/* Tab 3: Quick Info & Drivers */}
          <button
            onClick={() => setActiveTab('QUICK_INFO')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeTab === 'QUICK_INFO'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition ${activeTab === 'QUICK_INFO' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : ''}`}>
              <TicketCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5">투어·기사</span>
          </button>

          {/* Tab 4: Budget */}
          <button
            onClick={() => setActiveTab('BUDGET')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeTab === 'BUDGET'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition ${activeTab === 'BUDGET' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : ''}`}>
              <WalletCards className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5">예산</span>
          </button>

          {/* Tab 5: History & Guide */}
          <button
            onClick={() => setActiveTab('HISTORY_GUIDE')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeTab === 'HISTORY_GUIDE'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition ${activeTab === 'HISTORY_GUIDE' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : ''}`}>
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5">역사·가이드</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <ItineraryModal
        isOpen={isItineraryModalOpen}
        onClose={() => {
          setIsItineraryModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItineraryItem}
        initialItem={editingItem}
        defaultDayNumber={targetAddDay}
      />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        status={connectionStatus}
        connectedCount={connectedCount}
        roomId={roomId}
        onChangeRoom={handleChangeRoom}
        userRole={userRole}
        setUserRole={setUserRole}
        onResetData={handleResetData}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
