import { Position, Device, EventLog } from '../types/traccar';

type Listener = (data: { positions?: Position[]; devices?: Device[]; events?: EventLog[] }) => void;

class TraccarSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private reconnectTimeout: any = null;

  connect(serverUrl: string) {
    this.disconnect();

    try {
      const authHeader = localStorage.getItem('gps_auth_header');
      let wsUrl = serverUrl
        .replace(/^http:\/\//i, 'ws://')
        .replace(/^https:\/\//i, 'wss://')
        + '/api/socket';

      // Connect to real Traccar WebSocket
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to real Traccar WebSocket:', wsUrl);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notify(data);
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('Traccar WS error, will retry on reconnection');
      };

      this.ws.onclose = () => {
        this.reconnectTimeout = setTimeout(() => {
          this.connect(serverUrl);
        }, 5000);
      };
    } catch (err) {
      console.warn('WS Init failed:', err);
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(data: any) {
    this.listeners.forEach((listener) => listener(data));
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }
}

export const traccarSocket = new TraccarSocketService();
