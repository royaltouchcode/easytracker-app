export interface AppConfig {
  appName: string;
  appDisplayName: string;
  version: string;
  buildNumber: string;
  publisher: string;
  publisherDomain: string;
  packageId: string;
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  refundPhone: string;
  refundWhatsapp: string;
  officeAddress: string;
  website: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  logoUrl: string;
  defaultServerUrl: string;
  defaultPort: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'easytracker',
  appDisplayName: 'EasyTracker',
  version: '1.0.0',
  buildNumber: '1',
  publisher: 'EasysoftSolution',
  publisherDomain: 'easysoftsolution.net',
  packageId: 'net.easysoftsolution.easytracker',
  supportEmail: 'support@easysoftsolution.net',
  supportPhone: '+880 1700-000000',
  supportWhatsapp: '+8801700000000',
  refundPhone: '+880 1700-000000',
  refundWhatsapp: '+8801700000000',
  officeAddress: 'Dhaka, Bangladesh',
  website: 'https://easysoftsolution.net',
  privacyPolicyUrl: 'https://easysoftsolution.net/privacy',
  termsUrl: 'https://easysoftsolution.net/terms',
  logoUrl: '/logo.svg',
  defaultServerUrl: 'https://demo3.traccar.org',
  defaultPort: '5023'
};

export function getAppConfig(): AppConfig {
  try {
    const saved = localStorage.getItem('gps_remote_app_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_APP_CONFIG, ...parsed };
    }
  } catch (e) {}
  return DEFAULT_APP_CONFIG;
}

export const APP_CONFIG = getAppConfig();

export async function syncRemoteAppConfigFromServer(serverUrl?: string): Promise<AppConfig> {
  try {
    const targetUrl = serverUrl || DEFAULT_APP_CONFIG.defaultServerUrl;
    // Check if remote admin config endpoint exists on server
    const res = await fetch(`${targetUrl}/api/server`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData.attributes?.appConfig) {
        const remoteConf = serverData.attributes.appConfig;
        const merged = { ...DEFAULT_APP_CONFIG, ...remoteConf };
        localStorage.setItem('gps_remote_app_config', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    // Graceful fallback to cached or default
  }
  return getAppConfig();
}
