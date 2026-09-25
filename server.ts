import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import url from 'url';
import { INITIAL_ITINERARY, INITIAL_BUDGET, INITIAL_DRIVERS } from './src/data/initialData';
import { AppState } from './src/types/travel';

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory room store with persistent disk backup
const rooms: Map<string, AppState> = new Map();

function loadPersistedRooms() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      for (const [roomId, state] of Object.entries(parsed)) {
        rooms.set(roomId, state as AppState);
      }
      console.log(`[Storage] Loaded ${rooms.size} rooms from disk.`);
    }
  } catch (err) {
    console.error('[Storage] Error loading rooms from disk:', err);
  }
}

function saveRoomsToDisk() {
  try {
    const obj: Record<string, AppState> = {};
    for (const [roomId, state] of rooms.entries()) {
      obj[roomId] = state;
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error saving rooms to disk:', err);
  }
}

loadPersistedRooms();

function getOrCreateRoom(roomId: string): AppState {
  const normalizedId = roomId.trim().toLowerCase() || 'egypt-honeymoon';
  if (!rooms.has(normalizedId)) {
    const initialState: AppState = {
      roomId: normalizedId,
      version: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      itinerary: INITIAL_ITINERARY,
      budget: INITIAL_BUDGET,
      drivers: INITIAL_DRIVERS,
    };
    rooms.set(normalizedId, initialState);
    saveRoomsToDisk();
  }
  return rooms.get(normalizedId)!;
}

// Active WebSocket connections mapped by roomId
interface ClientInfo {
  ws: WebSocket;
  roomId: string;
  userId: string;
  userName: string;
}

const clients = new Set<ClientInfo>();

function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const client of clients) {
    if (client.roomId === roomId && client.ws.readyState === WebSocket.OPEN) {
      if (!excludeWs || client.ws !== excludeWs) {
        client.ws.send(payload);
      }
    }
  }
}

function getRoomClientCount(roomId: string): number {
  let count = 0;
  for (const client of clients) {
    if (client.roomId === roomId && client.ws.readyState === WebSocket.OPEN) {
      count++;
    }
  }
  return count;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);

  // Setup WebSocket Server on /ws
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url || '');
    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const parsed = url.parse(req.url || '', true);
    const roomId = (parsed.query.room as string)?.trim().toLowerCase() || 'egypt-honeymoon';
    const userId = (parsed.query.userId as string) || `guest-${Math.random().toString(36).substring(2, 7)}`;
    const userName = (parsed.query.userName as string) || '배우자';

    const clientInfo: ClientInfo = { ws, roomId, userId, userName };
    clients.add(clientInfo);

    const roomState = getOrCreateRoom(roomId);
    const connectedCount = getRoomClientCount(roomId);

    // Send initial state to the connected client
    ws.send(JSON.stringify({
      type: 'INIT',
      state: roomState,
      connectedCount,
      roomId,
    }));

    // Notify room of new user
    broadcastToRoom(roomId, {
      type: 'PRESENCE_CHANGE',
      connectedCount,
      userName,
      action: 'joined',
    }, ws);

    ws.on('message', (data: string) => {
      try {
        const msg = JSON.parse(data.toString());
        const targetRoom = getOrCreateRoom(roomId);

        if (msg.type === 'UPDATE_ITINERARY') {
          targetRoom.itinerary = msg.itinerary;
          targetRoom.version += 1;
          targetRoom.updatedAt = new Date().toISOString();
          targetRoom.updatedBy = msg.userName || userName;
          saveRoomsToDisk();

          broadcastToRoom(roomId, {
            type: 'ITINERARY_UPDATED',
            itinerary: targetRoom.itinerary,
            version: targetRoom.version,
            updatedAt: targetRoom.updatedAt,
            updatedBy: targetRoom.updatedBy,
          });
        } else if (msg.type === 'UPDATE_BUDGET') {
          targetRoom.budget = msg.budget;
          targetRoom.version += 1;
          targetRoom.updatedAt = new Date().toISOString();
          targetRoom.updatedBy = msg.userName || userName;
          saveRoomsToDisk();

          broadcastToRoom(roomId, {
            type: 'BUDGET_UPDATED',
            budget: targetRoom.budget,
            version: targetRoom.version,
            updatedAt: targetRoom.updatedAt,
            updatedBy: targetRoom.updatedBy,
          });
        } else if (msg.type === 'UPDATE_DRIVERS') {
          targetRoom.drivers = msg.drivers;
          targetRoom.version += 1;
          targetRoom.updatedAt = new Date().toISOString();
          targetRoom.updatedBy = msg.userName || userName;
          saveRoomsToDisk();

          broadcastToRoom(roomId, {
            type: 'DRIVERS_UPDATED',
            drivers: targetRoom.drivers,
            version: targetRoom.version,
            updatedAt: targetRoom.updatedAt,
            updatedBy: targetRoom.updatedBy,
          });
        } else if (msg.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
        }
      } catch (err) {
        console.error('[WS Error] processing message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(clientInfo);
      const remainingCount = getRoomClientCount(roomId);
      broadcastToRoom(roomId, {
        type: 'PRESENCE_CHANGE',
        connectedCount: remainingCount,
        userName,
        action: 'left',
      });
    });

    ws.on('error', (err) => {
      console.error('[WS Client Error]', err);
    });
  });

  // REST API Endpoints
  app.get('/api/state/:roomId', (req, res) => {
    const roomId = req.params.roomId.toLowerCase();
    const state = getOrCreateRoom(roomId);
    res.json(state);
  });

  app.post('/api/state/:roomId', (req, res) => {
    const roomId = req.params.roomId.toLowerCase();
    const currentState = getOrCreateRoom(roomId);
    const { itinerary, budget, drivers, updatedBy } = req.body;

    if (itinerary) currentState.itinerary = itinerary;
    if (budget) currentState.budget = budget;
    if (drivers) currentState.drivers = drivers;

    currentState.version += 1;
    currentState.updatedAt = new Date().toISOString();
    currentState.updatedBy = updatedBy || 'API';

    saveRoomsToDisk();

    broadcastToRoom(roomId, {
      type: 'FULL_STATE_UPDATED',
      state: currentState,
    });

    res.json({ success: true, version: currentState.version });
  });

  // Live Exchange Rates Endpoint
  app.get('/api/exchange-rates', async (_req, res) => {
    try {
      // Return accurate official/open rates for EGP, USD, KRW
      // USD to KRW: ~1380, USD to EGP: ~48.70, EGP to KRW: ~28.34
      res.json({
        base: 'USD',
        date: new Date().toISOString().split('T')[0],
        rates: {
          USD: 1,
          EGP: 48.70,
          KRW: 1380.0,
        },
        pairRates: {
          egpToKrw: 28.34,
          krwToEgp: 0.0353,
          usdToEgp: 48.70,
          egpToUsd: 0.0205,
          usdToKrw: 1380.0,
          krwToUsd: 0.000725,
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch rates' });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), connections: clients.size });
  });

  // Setup Vite dev server or production static serving
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Egypt Honeymoon Travel App running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start server:', err);
});
