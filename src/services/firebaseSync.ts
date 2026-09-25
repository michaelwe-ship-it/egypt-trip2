import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  update, 
  onDisconnect, 
  serverTimestamp,
  Database,
  Unsubscribe 
} from 'firebase/database';
import { AppState, ItineraryItem, BudgetItem, DriverContact } from '../types/travel';
import { INITIAL_ITINERARY, INITIAL_BUDGET, INITIAL_DRIVERS } from '../data/initialData';
import { ConnectionStatus, SyncHandlers } from './websocket';

// User-provided Firebase Realtime Database Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCd8dNbrNKRKD-pqZXaFE30fA3gHpKPPgM",
  authDomain: "egypt-db-e89da.firebaseapp.com",
  databaseURL: "https://egypt-db-e89da-default-rtdb.firebaseio.com",
  projectId: "egypt-db-e89da",
  storageBucket: "egypt-db-e89da.firebasestorage.app",
  messagingSenderId: "655156366702",
  appId: "1:655156366702:web:aeb9bbf7aecedde4f7c57f"
};

// Initialize Firebase App singleton safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseDb: Database = getDatabase(firebaseApp);

export class FirebaseSyncService {
  private db: Database;
  private roomId: string = 'egypt-10th-anniversary';
  private userId: string = '';
  private userName: string = '남편';
  private handlers: Partial<SyncHandlers> = {};
  private isDestroyed = false;
  private unsubscribers: Unsubscribe[] = [];
  public status: ConnectionStatus = 'CONNECTING';
  private hasInitializedData = false;

  constructor(roomId: string = 'egypt-10th-anniversary', userName: string = '남편') {
    this.db = firebaseDb;
    this.roomId = this.sanitizeRoomId(roomId);
    this.userName = userName;

    this.userId = typeof window !== 'undefined' 
      ? localStorage.getItem('egypt_user_id') || `user_${Math.random().toString(36).substring(2, 9)}`
      : 'user_default';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('egypt_user_id', this.userId);
    }
  }

  private sanitizeRoomId(rawId: string): string {
    return (rawId || 'egypt-10th-anniversary')
      .trim()
      .toLowerCase()
      .replace(/[.#$[\]]/g, '-'); // Firebase key safe
  }

  public setHandlers(handlers: Partial<SyncHandlers>) {
    this.handlers = handlers;
  }

  public setUserName(name: string) {
    this.userName = name;
    // Update presence with new name if connected
    if (this.status === 'CONNECTED' && this.userId) {
      const userPresRef = ref(this.db, `rooms/${this.roomId}/presence/${this.userId}`);
      set(userPresRef, {
        name: this.userName,
        userId: this.userId,
        online: true,
        lastActive: serverTimestamp(),
      }).catch(console.warn);
    }
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public getUserName(): string {
    return this.userName;
  }

  public connect(newRoomId?: string) {
    if (newRoomId) {
      this.roomId = this.sanitizeRoomId(newRoomId);
      this.hasInitializedData = false;
    }

    if (this.isDestroyed) return;

    this.cleanupListeners();
    this.updateStatus('CONNECTING');

    try {
      // 1. Monitor Firebase RTDB connection status
      const connectedRef = ref(this.db, '.info/connected');
      const unsubConnected = onValue(connectedRef, (snap) => {
        const isOnline = snap.val() === true;
        if (isOnline) {
          this.updateStatus('CONNECTED');
          this.setupPresence();
        } else {
          this.updateStatus('DISCONNECTED');
        }
      }, (err) => {
        console.warn('[FirebaseSync] Connection status error:', err);
        this.updateStatus('OFFLINE');
      });
      this.unsubscribers.push(unsubConnected);

      // 2. Monitor Room Presence (Active connected devices & spouses)
      const presenceRef = ref(this.db, `rooms/${this.roomId}/presence`);
      const unsubPresence = onValue(presenceRef, (snap) => {
        const data = snap.val() || {};
        const count = Object.keys(data).length;
        if (this.handlers.onPresenceChange) {
          this.handlers.onPresenceChange(Math.max(count, 1));
        }
      });
      this.unsubscribers.push(unsubPresence);

      // 3. Monitor Room Data (Itinerary, Budget, Drivers, Checklist status)
      const dataRef = ref(this.db, `rooms/${this.roomId}/data`);
      const unsubData = onValue(dataRef, (snap) => {
        const remoteData = snap.val();

        if (!remoteData) {
          // If room doesn't exist yet on Firebase, seed with default 10th anniversary data
          if (!this.hasInitializedData) {
            this.hasInitializedData = true;
            this.seedInitialRoomData();
          }
          return;
        }

        const itineraryList: ItineraryItem[] = remoteData.itinerary || [];
        const budgetList: BudgetItem[] = remoteData.budget || [];
        const driversList: DriverContact[] = remoteData.drivers || [];
        const updatedBy = remoteData.updatedBy || '';
        const version = remoteData.version || 1;

        if (!this.hasInitializedData) {
          this.hasInitializedData = true;
          // Initial full load
          if (this.handlers.onInit) {
            this.handlers.onInit({
              roomId: this.roomId,
              version,
              updatedAt: remoteData.updatedAt || new Date().toISOString(),
              updatedBy,
              itinerary: itineraryList.length > 0 ? itineraryList : INITIAL_ITINERARY,
              budget: budgetList.length > 0 ? budgetList : INITIAL_BUDGET,
              drivers: driversList.length > 0 ? driversList : INITIAL_DRIVERS,
            }, 1);
          }
        } else {
          // Live sync updates from other phones/browsers
          if (itineraryList && this.handlers.onItineraryUpdate) {
            this.handlers.onItineraryUpdate(itineraryList, version, updatedBy);
          }
          if (budgetList && this.handlers.onBudgetUpdate) {
            this.handlers.onBudgetUpdate(budgetList, version, updatedBy);
          }
          if (driversList && this.handlers.onDriversUpdate) {
            this.handlers.onDriversUpdate(driversList, version, updatedBy);
          }
        }
      }, (err) => {
        console.error('[FirebaseSync] Error listening to room data:', err);
      });
      this.unsubscribers.push(unsubData);

    } catch (err) {
      console.error('[FirebaseSync] Setup failed:', err);
      this.updateStatus('OFFLINE');
    }
  }

  private setupPresence() {
    if (!this.userId) return;
    const userPresRef = ref(this.db, `rooms/${this.roomId}/presence/${this.userId}`);
    
    // Automatically remove presence on disconnect
    onDisconnect(userPresRef).remove().catch(console.warn);

    // Set online status
    set(userPresRef, {
      name: this.userName,
      userId: this.userId,
      online: true,
      lastActive: serverTimestamp(),
    }).catch(console.warn);
  }

  private seedInitialRoomData() {
    const dataRef = ref(this.db, `rooms/${this.roomId}/data`);
    const initialPayload = {
      itinerary: INITIAL_ITINERARY,
      budget: INITIAL_BUDGET,
      drivers: INITIAL_DRIVERS,
      updatedBy: '초기 세팅',
      updatedAt: serverTimestamp(),
      version: 1,
    };

    set(dataRef, initialPayload)
      .then(() => {
        if (this.handlers.onInit) {
          this.handlers.onInit({
            roomId: this.roomId,
            version: 1,
            updatedAt: new Date().toISOString(),
            updatedBy: '초기 세팅',
            itinerary: INITIAL_ITINERARY,
            budget: INITIAL_BUDGET,
            drivers: INITIAL_DRIVERS,
          }, 1);
        }
      })
      .catch(console.warn);
  }

  public updateItinerary(itinerary: ItineraryItem[]) {
    const dataRef = ref(this.db, `rooms/${this.roomId}/data`);
    update(dataRef, {
      itinerary,
      updatedBy: this.userName,
      updatedAt: serverTimestamp(),
    }).catch((err) => {
      console.error('[FirebaseSync] Error updating itinerary:', err);
    });
  }

  public updateBudget(budget: BudgetItem[]) {
    const dataRef = ref(this.db, `rooms/${this.roomId}/data`);
    update(dataRef, {
      budget,
      updatedBy: this.userName,
      updatedAt: serverTimestamp(),
    }).catch((err) => {
      console.error('[FirebaseSync] Error updating budget:', err);
    });
  }

  public updateDrivers(drivers: DriverContact[]) {
    const dataRef = ref(this.db, `rooms/${this.roomId}/data`);
    update(dataRef, {
      drivers,
      updatedBy: this.userName,
      updatedAt: serverTimestamp(),
    }).catch((err) => {
      console.error('[FirebaseSync] Error updating drivers:', err);
    });
  }

  public resetToDefault() {
    const dataRef = ref(this.db, `rooms/${this.roomId}/data`);
    set(dataRef, {
      itinerary: INITIAL_ITINERARY,
      budget: INITIAL_BUDGET,
      drivers: INITIAL_DRIVERS,
      updatedBy: `${this.userName} (초기화)`,
      updatedAt: serverTimestamp(),
      version: 1,
    }).catch(console.warn);
  }

  private updateStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    if (this.handlers.onStatusChange) {
      this.handlers.onStatusChange(newStatus);
    }
  }

  private cleanupListeners() {
    this.unsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        // ignore
      }
    });
    this.unsubscribers = [];
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.userId) {
      const userPresRef = ref(this.db, `rooms/${this.roomId}/presence/${this.userId}`);
      set(userPresRef, null).catch(() => {});
    }
    this.cleanupListeners();
  }
}
