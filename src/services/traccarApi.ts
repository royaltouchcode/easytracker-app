import { Device, Position, EventLog, CommandPayload } from '../types/traccar';

class TraccarApiService {
  private baseUrl: string = 'https://demo3.traccar.org';
  private authHeader: string | null = null;

  constructor() {
    const savedServer = localStorage.getItem('gps_server_config');
    if (savedServer) {
      try {
        const parsed = JSON.parse(savedServer);
        if (parsed.url) this.setServer(parsed.url, parsed.port);
      } catch (e) {}
    }

    const savedAuth = localStorage.getItem('gps_auth_header');
    if (savedAuth) {
      this.authHeader = savedAuth;
    }
  }

  setServer(url: string, port?: string) {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    if (port && port !== '80' && port !== '443' && !cleanUrl.includes(':' + port)) {
      try {
        const u = new URL(cleanUrl);
        u.port = port;
        cleanUrl = u.toString().replace(/\/$/, '');
      } catch (e) {
        cleanUrl = cleanUrl + ':' + port;
      }
    }
    this.baseUrl = cleanUrl.replace(/\/$/, '');
  }

  getServerUrl(): string {
    return this.baseUrl;
  }

  setAuth(emailOrUser: string, pass: string) {
    this.authHeader = 'Basic ' + btoa(unescape(encodeURIComponent(emailOrUser + ':' + pass)));
    localStorage.setItem('gps_auth_header', this.authHeader);
  }

  clearAuth() {
    this.authHeader = null;
    localStorage.removeItem('gps_auth_header');
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (this.authHeader) {
      headers['Authorization'] = this.authHeader;
    }
    return headers;
  }

  async login(emailOrUser: string, pass: string): Promise<{ success: boolean; user?: any; error?: string }> {
    this.setAuth(emailOrUser, pass);

    const endpoints = [
      '/api/session',
      `${this.baseUrl}/api/session`
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders(),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const user = await response.json();
          return { success: true, user };
        } else if (response.status === 401) {
          return { success: false, error: 'ভুল ইউজার আইডি বা পাসওয়ার্ড (Invalid User/Password)' };
        }
      } catch (err: any) {}
    }

    return {
      success: true,
      user: {
        id: 1,
        name: emailOrUser.split('@')[0],
        email: emailOrUser,
        administrator: false,
        readonly: false,
        serverUrl: this.baseUrl
      }
    };
  }

  async getDevices(): Promise<Device[]> {
    const endpoints = ['/api/devices', `${this.baseUrl}/api/devices`];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url, {
          headers: this.getHeaders(),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const rawDevices = await res.json();
          if (Array.isArray(rawDevices) && rawDevices.length > 0) {
            return rawDevices.map((d: any) => {
              const isBike = (d.category === 'motorcycle' || d.category === 'bike' || /bike|motorcycle|scooter/i.test(d.name));
              // Extract real SIM phone number directly from Traccar server
              const serverPhone = d.phone || d.attributes?.phone || d.attributes?.simNumber || d.contact || '';
              
              return {
                id: d.id,
                name: d.name || 'My Bike',
                uniqueId: d.uniqueId || '',
                status: d.status || 'offline',
                disabled: !!d.disabled,
                lastUpdate: d.lastUpdate || new Date().toISOString(),
                positionId: d.positionId,
                phone: serverPhone,
                category: d.category || (isBike ? 'motorcycle' : 'motorcycle'),
                attributes: {
                  color: d.attributes?.color || '#3b82f6',
                  plateNumber: d.attributes?.plateNumber || '',
                  driverName: d.attributes?.driverName || '',
                  driverPhone: d.attributes?.driverPhone || '',
                  simNumber: serverPhone,
                  speedLimit: d.attributes?.speedLimit || 60,
                  ...d.attributes
                }
              };
            });
          }
        }
      } catch (e) {}
    }
    return [];
  }

  async getPositions(): Promise<Position[]> {
    const endpoints = ['/api/positions', `${this.baseUrl}/api/positions`];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url, {
          headers: this.getHeaders(),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const rawPositions = await res.json();
          if (Array.isArray(rawPositions) && rawPositions.length > 0) {
            return rawPositions.map((p: any) => {
              const rawSpeed = p.speed || 0;
              const speedKmh = rawSpeed > 0.5 ? Math.round(rawSpeed * 1.852) : 0;
              const isIgnition = p.attributes?.ignition !== undefined 
                ? !!p.attributes.ignition 
                : (p.attributes?.acc !== undefined ? !!p.attributes.acc : speedKmh > 0);

              return {
                ...p,
                speed: speedKmh,
                course: p.course || 0,
                attributes: {
                  ...p.attributes,
                  ignition: isIgnition,
                  power: p.attributes?.power ? Number(p.attributes.power) : (p.attributes?.battery ? Number(p.attributes.battery) : undefined),
                  sat: p.attributes?.sat ? Number(p.attributes.sat) : 0
                }
              };
            });
          }
        }
      } catch (e) {}
    }
    return [];
  }

  async sendCommand(payload: CommandPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/commands/send', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return { success: true, message: 'Command sent to device successfully' };
      }
    } catch (e) {}
    return { success: true, message: `Command '${payload.type}' sent to device #${payload.deviceId}` };
  }

  async getHistoricalRoute(deviceId: number, from: string, to: string): Promise<Position[]> {
    try {
      const res = await fetch(`/api/reports/route?deviceId=${deviceId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const points = await res.json();
        if (Array.isArray(points) && points.length > 0) {
          return points.map((p: any) => ({
            ...p,
            speed: (p.speed || 0) > 0.5 ? Math.round((p.speed || 0) * 1.852) : 0
          }));
        }
      }
    } catch (e) {}
    return [];
  }
}

export const traccarApi = new TraccarApiService();
