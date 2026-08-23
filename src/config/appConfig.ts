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
  website: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  logoUrl: string;
  defaultServerUrl: string;
  defaultPort: string;
}

export const APP_CONFIG: AppConfig = {
  appName: 'easytracker',
  appDisplayName: 'EasyTracker',
  version: '1.1.0',
  buildNumber: '2',
  publisher: 'EasysoftSolution',
  publisherDomain: 'easysoftsolution.net',
  packageId: 'net.easysoftsolution.easytracker',
  supportEmail: 'support@easysoftsolution.net',
  supportPhone: '+8801700000000',
  supportWhatsapp: '+8801700000000',
  website: 'https://easysoftsolution.net',
  privacyPolicyUrl: 'https://easysoftsolution.net/privacy',
  termsUrl: 'https://easysoftsolution.net/terms',
  logoUrl: '/logo.svg',
  defaultServerUrl: 'https://demo3.traccar.org',
  defaultPort: '5023'
};

export async function loadRemoteAppConfig(): Promise<AppConfig> {
  try {
    const res = await fetch('/config.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const remote = await res.json();
      return { ...APP_CONFIG, ...remote };
    }
  } catch (e) {
    console.log('Using default app config');
  }
  return APP_CONFIG;
}
