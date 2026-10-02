import { AppState, ItineraryItem, BudgetItem, DriverContact } from '../types/travel';
import { INITIAL_ITINERARY, INITIAL_BUDGET, INITIAL_DRIVERS } from '../data/initialData';
import { ConnectionStatus, SyncHandlers } from './websocket';

/**
 * Unified Server + WebSocket + REST Sync Service
 * Ensures 100% reliable persistence and cross-device sync between PC and Mobile Web.
 */
export class FirebaseSyncService {
  private roomId: string = 'egypt-10th-anniversary';
  private userId: string = '';
  private userName: string = '남편';
  private handlers: Partial<SyncHandlers> = {};
  private isDestroyed = false;
  public status: ConnectionStatus = 'CONNECTING';
  private currentVersion: number = 0;
  private ws: WebSocket | null = null;
  private pollInterval: any = null;
  private reconnectTimer: any = null;
  private pingInterval: any = null;

  constructor(roomId: string = 'egypt-10th-anniversary', userName: string = '남편') {
    this.roomId = this.sanitizeRoomId(roomId);
    this.userName = userName;

    this.userId =
      typeof window !== 'undefined'
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
      .replace(/[.#$[\]]/g, '-');
  }

  public setHandlers(handlers: Partial<SyncHandlers>) {
    this.handlers = handlers;
  }

  public setUserName(name: string) {
    this.userName = name;
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public getUserName(): string {
    return this.userName;
  }

  private sanitizePayload<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  private getLocalCachedData(): {
    itinerary: ItineraryItem[] | null;
    budget: BudgetItem[] | null;
    drivers: DriverContact[] | null;
    hasCustomLocalChanges: boolean;
  } {
    if (typeof window === 'undefined') {
      return { itinerary: null, budget: null, drivers: null, hasCustomLocalChanges: false };
    }
    try {
      const rawItin = localStorage.getItem('egypt_itinerary_cache');
      const rawBudget = localStorage.getItem('egypt_budget_cache');
      const rawDrivers = localStorage.getItem('egypt_drivers_cache');

      const itinerary = rawItin ? (JSON.parse(rawItin) as ItineraryItem[]) : null;
      const budget = rawBudget ? (JSON.parse(rawBudget) as BudgetItem[]) : null;
      const drivers = rawDrivers ? (JSON.parse(rawDrivers) as DriverContact[]) : null;

      const itinChanged =
        itinerary !== null && JSON.stringify(itinerary) !== JSON.stringify(INITIAL_ITINERARY);
      const budgetChanged =
        budget !== null && JSON.stringify(budget) !== JSON.stringify(INITIAL_BUDGET);
      const driversChanged =
        drivers !== null && JSON.stringify(drivers) !== JSON.stringify(INITIAL_DRIVERS);

      return {
        itinerary,
        budget,
        drivers,
        hasCustomLocalChanges: itinChanged || budgetChanged || driversChanged,
      };
    } catch {
      return { itinerary: null, budget: null, drivers: null, hasCustomLocalChanges: false };
    }
  }

  public connect(newRoomId?: string) {
    if (newRoomId) {
      this.roomId = this.sanitizeRoomId(newRoomId);
      this.currentVersion = 0;
    }

    if (this.isDestroyed) return;

    this.cleanupConnections();
    this.updateStatus('CONNECTING');

    // 1. Immediately sync with REST API (/api/state/:roomId)
    this.syncViaRest(true);

    // 2. Connect real-time WebSocket (/ws)
    this.connectWebSocket();

    // 3. Setup periodic lightweight poll & visibility listeners for mobile reliability
    this.pollInterval = setInterval(() => {
      if (!this.isDestroyed) {
        this.syncViaRest(false);
      }
    }, 3000);

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.handleVisibilityOrFocus);
      document.addEventListener('visibilitychange', this.handleVisibilityOrFocus);
    }
  }

  private handleVisibilityOrFocus = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      this.syncViaRest(false);
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.connectWebSocket();
      }
    }
  };

  private async syncViaRest(isInitial: boolean) {
    try {
      const res = await fetch(`/api/state/${encodeURIComponent(this.roomId)}?t=${Date.now()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) return;

      const serverState: AppState & { connectedCount?: number } = await res.json();
      this.updateStatus('CONNECTED');

      if (serverState.connectedCount && this.handlers.onPresenceChange) {
        this.handlers.onPresenceChange(serverState.connectedCount);
      }

      // If the server is still on fresh default state (version 1, updatedBy 'system'),
      // check if this browser (e.g. PC) already has unsynced local edits in localStorage!
      if (isInitial && serverState.version === 1 && serverState.updatedBy === 'system') {
        const localData = this.getLocalCachedData();
        if (localData.hasCustomLocalChanges) {
          await this.pushFullStateToServer({
            itinerary: localData.itinerary || INITIAL_ITINERARY,
            budget: localData.budget || INITIAL_BUDGET,
            drivers: localData.drivers || INITIAL_DRIVERS,
          });
          return;
        }
      }

      // Apply server state if it is newer than our current version
      if (serverState.version > this.currentVersion) {
        const prevVersion = this.currentVersion;
        this.currentVersion = serverState.version;

        if (isInitial || prevVersion === 0) {
          if (this.handlers.onInit) {
            this.handlers.onInit(
              {
                roomId: this.roomId,
                version: serverState.version,
                updatedAt: serverState.updatedAt,
                updatedBy: serverState.updatedBy,
                itinerary:
                  serverState.itinerary && serverState.itinerary.length > 0
                    ? serverState.itinerary
                    : INITIAL_ITINERARY,
                budget:
                  serverState.budget && serverState.budget.length > 0
                    ? serverState.budget
                    : INITIAL_BUDGET,
                drivers:
                  serverState.drivers && serverState.drivers.length > 0
                    ? serverState.drivers
                    : INITIAL_DRIVERS,
              },
              serverState.connectedCount || 1
            );
          }
        } else {
          // Incremental update detected via REST poll
          if (serverState.itinerary && this.handlers.onItineraryUpdate) {
            this.handlers.onItineraryUpdate(
              serverState.itinerary,
              serverState.version,
              serverState.updatedBy
            );
          }
          if (serverState.budget && this.handlers.onBudgetUpdate) {
            this.handlers.onBudgetUpdate(
              serverState.budget,
              serverState.version,
              serverState.updatedBy
            );
          }
          if (serverState.drivers && this.handlers.onDriversUpdate) {
            this.handlers.onDriversUpdate(
              serverState.drivers,
              serverState.version,
              serverState.updatedBy
            );
          }
        }
      }
    } catch (err) {
      console.warn('[Sync] REST sync warning:', err);
    }
  }

  private async pushFullStateToServer(payload: {
    itinerary?: ItineraryItem[];
    budget?: BudgetItem[];
    drivers?: DriverContact[];
    reset?: boolean;
  }) {
    try {
      const res = await fetch(`/api/state/${encodeURIComponent(this.roomId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.sanitizePayload(payload),
          updatedBy: this.userName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.version && data.version > this.currentVersion) {
          this.currentVersion = data.version;
        }
        this.updateStatus('CONNECTED');
      }
    } catch (err) {
      console.error('[Sync] Failed to push state to server:', err);
    }
  }

  private connectWebSocket() {
    if (typeof window === 'undefined' || this.isDestroyed) return;

    try {
      if (
        this.ws &&
        (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
      ) {
        this.ws.close();
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws?room=${encodeURIComponent(
        this.roomId
      )}&userId=${encodeURIComponent(this.userId)}&userName=${encodeURIComponent(this.userName)}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.updateStatus('CONNECTED');
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleWsMessage(msg);
        } catch (err) {
          console.error('[Sync] Error parsing WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.stopPing();
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        // Fallback REST polling remains active even if WS errors
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private handleWsMessage(msg: any) {
    switch (msg.type) {
      case 'INIT':
        if (msg.state) {
          const serverState: AppState = msg.state;
          if (serverState.version === 1 && serverState.updatedBy === 'system') {
            const localData = this.getLocalCachedData();
            if (localData.hasCustomLocalChanges) {
              this.pushFullStateToServer({
                itinerary: localData.itinerary || INITIAL_ITINERARY,
                budget: localData.budget || INITIAL_BUDGET,
                drivers: localData.drivers || INITIAL_DRIVERS,
              });
              return;
            }
          }
          if (serverState.version > this.currentVersion) {
            this.currentVersion = serverState.version;
            if (this.handlers.onInit) {
              this.handlers.onInit(serverState, msg.connectedCount || 1);
            }
          }
        }
        break;

      case 'ITINERARY_UPDATED':
        if (msg.itinerary && msg.version > this.currentVersion) {
          this.currentVersion = msg.version;
          if (this.handlers.onItineraryUpdate) {
            this.handlers.onItineraryUpdate(msg.itinerary, msg.version, msg.updatedBy);
          }
        }
        break;

      case 'BUDGET_UPDATED':
        if (msg.budget && msg.version > this.currentVersion) {
          this.currentVersion = msg.version;
          if (this.handlers.onBudgetUpdate) {
            this.handlers.onBudgetUpdate(msg.budget, msg.version, msg.updatedBy);
          }
        }
        break;

      case 'DRIVERS_UPDATED':
        if (msg.drivers && msg.version > this.currentVersion) {
          this.currentVersion = msg.version;
          if (this.handlers.onDriversUpdate) {
            this.handlers.onDriversUpdate(msg.drivers, msg.version, msg.updatedBy);
          }
        }
        break;

      case 'FULL_STATE_UPDATED':
        if (msg.state && msg.state.version > this.currentVersion) {
          this.currentVersion = msg.state.version;
          if (this.handlers.onInit) {
            this.handlers.onInit(msg.state, 2);
          }
        }
        break;

      case 'PRESENCE_CHANGE':
        if (this.handlers.onPresenceChange) {
          this.handlers.onPresenceChange(msg.connectedCount, msg.userName, msg.action);
        }
        break;

      default:
        break;
    }
  }

  public updateItinerary(itinerary: ItineraryItem[]) {
    this.pushFullStateToServer({ itinerary });
  }

  public updateBudget(budget: BudgetItem[]) {
    this.pushFullStateToServer({ budget });
  }

  public updateDrivers(drivers: DriverContact[]) {
    this.pushFullStateToServer({ drivers });
  }

  public resetToDefault() {
    this.pushFullStateToServer({ reset: true });
  }

  private startPing() {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 20000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.isDestroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isDestroyed) {
        this.connectWebSocket();
      }
    }, 4000);
  }

  private updateStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    if (this.handlers.onStatusChange) {
      this.handlers.onStatusChange(newStatus);
    }
  }

  private cleanupConnections() {
    this.stopPing();
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', this.handleVisibilityOrFocus);
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.cleanupConnections();
  }
}
