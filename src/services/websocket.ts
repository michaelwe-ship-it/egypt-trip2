import { AppState, ItineraryItem, BudgetItem, DriverContact } from '../types/travel';

export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'OFFLINE';

export interface SyncHandlers {
  onInit: (state: AppState, connectedCount: number) => void;
  onItineraryUpdate: (itinerary: ItineraryItem[], version: number, updatedBy: string) => void;
  onBudgetUpdate: (budget: BudgetItem[], version: number, updatedBy: string) => void;
  onDriversUpdate: (drivers: DriverContact[], version: number, updatedBy: string) => void;
  onPresenceChange: (count: number, userName?: string, action?: 'joined' | 'left') => void;
  onStatusChange: (status: ConnectionStatus) => void;
}

export class SyncService {
  private ws: WebSocket | null = null;
  private roomId: string = 'egypt-honeymoon';
  private userId: string = '';
  private userName: string = '신랑';
  private handlers: Partial<SyncHandlers> = {};
  private reconnectTimer: any = null;
  private pingInterval: any = null;
  private isDestroyed = false;
  public status: ConnectionStatus = 'DISCONNECTED';

  constructor(roomId: string = 'egypt-honeymoon', userName: string = '신랑') {
    this.roomId = roomId;
    this.userName = userName;
    this.userId = typeof window !== 'undefined' 
      ? localStorage.getItem('egypt_user_id') || `user_${Math.random().toString(36).substring(2, 8)}`
      : 'user_default';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('egypt_user_id', this.userId);
    }
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

  public connect(newRoomId?: string) {
    if (newRoomId) {
      this.roomId = newRoomId.trim().toLowerCase();
    }

    if (this.isDestroyed) return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.ws.close();
    }

    this.updateStatus('CONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?room=${encodeURIComponent(this.roomId)}&userId=${encodeURIComponent(this.userId)}&userName=${encodeURIComponent(this.userName)}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.updateStatus('CONNECTED');
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleMessage(msg);
        } catch (err) {
          console.error('[Sync] Error parsing message:', err);
        }
      };

      this.ws.onclose = () => {
        this.stopPing();
        this.updateStatus('DISCONNECTED');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[Sync] WebSocket error:', err);
        this.updateStatus('DISCONNECTED');
      };
    } catch (err) {
      console.error('[Sync] WebSocket setup failed:', err);
      this.updateStatus('OFFLINE');
      this.scheduleReconnect();
    }
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case 'INIT':
        if (this.handlers.onInit && msg.state) {
          this.handlers.onInit(msg.state, msg.connectedCount || 1);
        }
        break;

      case 'ITINERARY_UPDATED':
        if (this.handlers.onItineraryUpdate && msg.itinerary) {
          this.handlers.onItineraryUpdate(msg.itinerary, msg.version, msg.updatedBy);
        }
        break;

      case 'BUDGET_UPDATED':
        if (this.handlers.onBudgetUpdate && msg.budget) {
          this.handlers.onBudgetUpdate(msg.budget, msg.version, msg.updatedBy);
        }
        break;

      case 'DRIVERS_UPDATED':
        if (this.handlers.onDriversUpdate && msg.drivers) {
          this.handlers.onDriversUpdate(msg.drivers, msg.version, msg.updatedBy);
        }
        break;

      case 'FULL_STATE_UPDATED':
        if (this.handlers.onInit && msg.state) {
          this.handlers.onInit(msg.state, 2);
        }
        break;

      case 'PRESENCE_CHANGE':
        if (this.handlers.onPresenceChange) {
          this.handlers.onPresenceChange(msg.connectedCount, msg.userName, msg.action);
        }
        break;

      case 'PONG':
        break;

      default:
        break;
    }
  }

  public updateItinerary(itinerary: ItineraryItem[]) {
    this.send({
      type: 'UPDATE_ITINERARY',
      itinerary,
      userName: this.userName,
    });
  }

  public updateBudget(budget: BudgetItem[]) {
    this.send({
      type: 'UPDATE_BUDGET',
      budget,
      userName: this.userName,
    });
  }

  public updateDrivers(drivers: DriverContact[]) {
    this.send({
      type: 'UPDATE_DRIVERS',
      drivers,
      userName: this.userName,
    });
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[Sync] Cannot send, socket not open. Will retry on reconnect.');
    }
  }

  private updateStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    if (this.handlers.onStatusChange) {
      this.handlers.onStatusChange(newStatus);
    }
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
        this.connect();
      }
    }, 3000);
  }

  public destroy() {
    this.isDestroyed = true;
    this.stopPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}
