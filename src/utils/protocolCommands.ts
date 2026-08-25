/**
 * Universal Multi-Protocol GPS Command & Preset Resolver
 * Supports 100+ GPS Tracker Protocols in Traccar:
 * - Concox / Jimi / GT06 / WanWay (gt06, jt600, etc.)
 * - Coban / GPS103 (gps103, tk103, etc.)
 * - Sinotrack (sinotrack, h02, etc.)
 * - Micodus / LKGPS (micodus, tk905, etc.)
 * - Teltonika (teltonika)
 * - Queclink, Suntech, Topfly, Meitrack, Concox 4G
 */

import { Device, Position } from '../types/traccar';

export interface ProtocolCommandConfig {
  protocolName: string;
  gprsCommand: string;
  smsCommand: string;
  traccarCommandType: string;
  description: string;
}

export interface ProtocolPresetCommand {
  id: string;
  title: string;
  titleBn: string;
  category: 'status' | 'security' | 'network' | 'engine' | 'ussd';
  operator?: 'gp' | 'robi' | 'banglalink' | 'teletalk' | 'all';
  gprsCommand: string;
  smsCommand: string;
  traccarType: string;
  description: string;
  descriptionBn: string;
  isDangerous?: boolean;
}

export function resolveWakeupCommand(device: Device, position?: Position): ProtocolCommandConfig {
  if (device.attributes?.wakeupCommand) {
    return {
      protocolName: 'Custom (Server Configured)',
      gprsCommand: device.attributes.wakeupCommand,
      smsCommand: device.attributes.wakeupSms || device.attributes.wakeupCommand,
      traccarCommandType: 'custom',
      description: 'Server defined custom wakeup command'
    };
  }

  const rawProtocol = (position?.protocol || device.attributes?.protocol || device.model || '').toLowerCase();

  if (rawProtocol.includes('gt06') || rawProtocol.includes('concox') || rawProtocol.includes('jimi') || rawProtocol.includes('wanway') || rawProtocol.includes('v680') || rawProtocol.includes('jt600')) {
    return {
      protocolName: 'Concox / GT06 Protocol',
      gprsCommand: 'WHERE#',
      smsCommand: 'WHERE#',
      traccarCommandType: 'positionSingle',
      description: 'Forces GPS chipset wakeup and requests instant coordinate telemetry.'
    };
  }

  if (rawProtocol.includes('gps103') || rawProtocol.includes('tk103') || rawProtocol.includes('coban')) {
    const pin = device.attributes?.commandPin || '123456';
    return {
      protocolName: 'Coban / GPS103 Protocol',
      gprsCommand: `fix030s001n${pin}`,
      smsCommand: `fix030s001n${pin}`,
      traccarCommandType: 'positionSingle',
      description: 'Wakes up GPS module and polls single fix packet.'
    };
  }

  if (rawProtocol.includes('sinotrack') || rawProtocol.includes('h02') || rawProtocol.includes('st-901')) {
    return {
      protocolName: 'SinoTrack Protocol',
      gprsCommand: '6690000',
      smsCommand: '6690000',
      traccarCommandType: 'positionSingle',
      description: 'SinoTrack standard location wakeup code.'
    };
  }

  if (rawProtocol.includes('micodus') || rawProtocol.includes('tk905') || rawProtocol.includes('lkgps')) {
    return {
      protocolName: 'Micodus / LKGPS Protocol',
      gprsCommand: 'G123456#',
      smsCommand: 'G123456#',
      traccarCommandType: 'positionSingle',
      description: 'Micodus Google Map & instant GPS fix query.'
    };
  }

  if (rawProtocol.includes('teltonika')) {
    return {
      protocolName: 'Teltonika Protocol',
      gprsCommand: 'getver',
      smsCommand: '  getver',
      traccarCommandType: 'positionSingle',
      description: 'Teltonika GPRS instant ping and position packet trigger.'
    };
  }

  return {
    protocolName: rawProtocol ? `${rawProtocol.toUpperCase()} (Universal)` : 'Universal Traccar Protocol',
    gprsCommand: 'WHERE#',
    smsCommand: 'WHERE#',
    traccarCommandType: 'positionSingle',
    description: 'Traccar native positionSingle protocol command.'
  };
}

export function formatUssdByProtocol(rawUssdCode: string, rawProtocol: string = '', pin: string = '123456'): { gprsCommand: string; smsCommand: string } {
  const cleanUssd = rawUssdCode.trim();
  const p = rawProtocol.toLowerCase();

  if (p.includes('teltonika')) {
    return {
      gprsCommand: `readussd ${cleanUssd}`,
      smsCommand: `  readussd ${cleanUssd}`
    };
  }

  if (p.includes('gps103') || p.includes('tk103') || p.includes('coban')) {
    return {
      gprsCommand: `ussd${pin}${cleanUssd}`,
      smsCommand: `ussd${pin}${cleanUssd}`
    };
  }

  if (p.includes('sinotrack') || p.includes('h02') || p.includes('st-901')) {
    return {
      gprsCommand: `USSD,${cleanUssd}`,
      smsCommand: `USSD,${cleanUssd}`
    };
  }

  if (p.includes('micodus') || p.includes('tk905') || p.includes('lkgps')) {
    return {
      gprsCommand: `USSD,${cleanUssd}#`,
      smsCommand: `USSD,${cleanUssd}#`
    };
  }

  // Default: Concox / Jimi / GT06 / Universal: USSD,1,*566##
  return {
    gprsCommand: `USSD,1,${cleanUssd}#`,
    smsCommand: `USSD,1,${cleanUssd}#`
  };
}

export function detectOperatorFromPhone(phone?: string): 'gp' | 'robi' | 'banglalink' | 'teletalk' | 'unknown' {
  if (!phone) return 'unknown';
  // Strip all non-digit characters
  let clean = phone.replace(/[^0-9]/g, '');

  // Strip country code if present (880 or +880)
  if (clean.startsWith('880')) {
    clean = clean.slice(2); // '88018...' -> '018...'
  } else if (clean.startsWith('88') && clean.length >= 13) {
    clean = clean.slice(2);
  }

  // Prepend 0 if length is 10 and starts with 1
  if (!clean.startsWith('0') && clean.length === 10 && clean.startsWith('1')) {
    clean = '0' + clean;
  }

  const prefix3 = clean.slice(0, 3); // 3-digit operator prefix

  // 1. Grameenphone: 017, 013
  if (prefix3 === '017' || prefix3 === '013') return 'gp';

  // 2. Robi & Airtel: 018 (Robi), 016 (Airtel)
  if (prefix3 === '018' || prefix3 === '016') return 'robi';

  // 3. Banglalink: 019, 014
  if (prefix3 === '019' || prefix3 === '014') return 'banglalink';

  // 4. Teletalk: 015
  if (prefix3 === '015') return 'teletalk';

  return 'unknown';
}

export function getOperatorLabelBn(operator: 'gp' | 'robi' | 'banglalink' | 'teletalk' | 'unknown'): string {
  switch (operator) {
    case 'gp': return '🟢 গ্রামীনফোন (GP - 017/013)';
    case 'robi': return '🔴 রবি / এয়ারটেল (Robi/Airtel - 018/016)';
    case 'banglalink': return '🟠 বাংলালিংক (Banglalink - 019/014)';
    case 'teletalk': return '🔵 টেলিটক (Teletalk - 015)';
    default: return '📶 সকল অপারেটর';
  }
}

export function getBangladeshUssdPresets(rawProtocol: string = '', pin: string = '123456', operatorFilter?: 'gp' | 'robi' | 'banglalink' | 'teletalk' | 'all'): ProtocolPresetCommand[] {
  const items: { id: string; operator: 'gp' | 'robi' | 'banglalink' | 'teletalk'; ussdCode: string; title: string; titleBn: string; desc: string; descBn: string }[] = [
    // Grameenphone (GP: 017, 013)
    { id: 'gp-bal', operator: 'gp', ussdCode: '*566#', title: 'GP: Main Balance (*566#)', titleBn: 'গ্রামীনফোন: মেইন ব্যালেন্স ও মেয়াদ (*566#)', desc: 'Check main account balance and validity date via remote USSD', descBn: 'ওটিপি ছাড়া ট্র্যাকারের সিমের মূল ব্যালেন্স ও মেয়াদ রিড করুন।' },
    { id: 'gp-data', operator: 'gp', ussdCode: '*121*1*4#', title: 'GP: Data MB Balance (*121*1*4#)', titleBn: 'গ্রামীনফোন: ডাটা/ইন্টারনেট ব্যালেন্স (*121*1*4#)', desc: 'Check active internet package remaining MB and expiry', descBn: 'সিমের অবশিষ্ট ইন্টারনেট ডাটা এবং মেয়াদ দেখুন।' },
    { id: 'gp-num', operator: 'gp', ussdCode: '*2#', title: 'GP: Query SIM Mobile No (*2#)', titleBn: 'গ্রামীনফোন: সিমের মোবাইল নম্বর চেক (*2#)', desc: 'Queries the actual MSISDN mobile phone number of tracker SIM', descBn: 'ট্র্যাকারে থাকা সিমের মোবাইল নম্বর জানুন।' },
    { id: 'gp-flexi', operator: 'gp', ussdCode: '*121*3#', title: 'GP: Flexiplan & Offers (*121*3#)', titleBn: 'গ্রামীনফোন: রিচার্জ ও ডাটা অফার (*121*3#)', desc: 'Fetch latest recharge pack and telemetry offers', descBn: 'ট্র্যাকার সিমের জন্য বিশেষ ইন্টারনেট অফার দেখুন।' },

    // Robi & Airtel (018, 016)
    { id: 'robi-bal', operator: 'robi', ussdCode: '*222#', title: 'Robi: Main Balance (*222#)', titleBn: 'রবি / এয়ারটেল: মূল ব্যালেন্স ও মেয়াদ (*222#)', desc: 'Check Robi SIM balance and connection validity', descBn: 'রবি সিমের একাউন্ট ব্যালেন্স এবং সক্রিয় মেয়াদ জানুন।' },
    { id: 'robi-data', operator: 'robi', ussdCode: '*3#', title: 'Robi: Internet MB Check (*3#)', titleBn: 'রবি / এয়ারটেল: ডাটা প্যাক চেক (*3#)', desc: 'Check remaining telemetry data MB and duration', descBn: 'ট্র্যাকিং সিমের অবশিষ্ট ইন্টারনেট মেগাবাইট (MB) যাচাই।' },
    { id: 'robi-num', operator: 'robi', ussdCode: '*2#', title: 'Robi: Query SIM Mobile No (*2#)', titleBn: 'রবি / এয়ারটেল: সিম নম্বর চেক (*2#)', desc: 'Fetch tracker SIM mobile phone number', descBn: 'রবি সিমের ১১ ডিজিটের নম্বর দেখুন।' },
    { id: 'robi-loan', operator: 'robi', ussdCode: '*123*007#', title: 'Robi: Jhotpot Emergency Balance (*123*007#)', titleBn: 'রবি: ঝটপট জরুরি ব্যালেন্স লোন (*123*007#)', desc: 'Takes instant emergency airtime loan to prevent tracker disconnect', descBn: 'ব্যালেন্স শেষ হলে ট্র্যাকার সচল রাখতে জরুরি লোন নিন।' },

    // Banglalink (019, 014)
    { id: 'bl-bal', operator: 'banglalink', ussdCode: '*878#', title: 'Banglalink: Main Balance (*878#)', titleBn: 'বাংলালিংক: মেইন ব্যালেন্স ও মেয়াদ (*878#)', desc: 'Check Banglalink SIM balance and active status', descBn: 'বাংলালিংক সিমের বর্তমান ব্যালেন্স ও মেয়াদ চেক।' },
    { id: 'bl-data', operator: 'banglalink', ussdCode: '*5000*500#', title: 'Banglalink: Internet MB Balance (*5000*500#)', titleBn: 'বাংলালিংক: ডাটা ভলিউম চেক (*5000*500#)', desc: 'Check Banglalink remaining GPRS telemetry MB', descBn: 'ইন্টারনেট ডাটা প্যাকের অবশিষ্ট ভলিউম দেখুন।' },
    { id: 'bl-num', operator: 'banglalink', ussdCode: '*511#', title: 'Banglalink: Query SIM Mobile No (*511#)', titleBn: 'বাংলালিংক: সিম নম্বর চেক (*511#)', desc: 'Queries Banglalink SIM phone number', descBn: 'বাংলালিংক সিমের মোবাইল নম্বর জানুন।' },

    // Teletalk (015)
    { id: 'tt-bal', operator: 'teletalk', ussdCode: '*152#', title: 'Teletalk: Balance & Data (*152#)', titleBn: 'টেলিটক: ব্যালেন্স ও ইন্টারনেট প্যাক (*152#)', desc: 'Check Teletalk account balance and data validity', descBn: 'টেলিটক সিমের মূল ব্যালেন্স ও ইন্টারনেট ডাটা চেক।' },
    { id: 'tt-num', operator: 'teletalk', ussdCode: '*551#', title: 'Teletalk: Query SIM Number (*551#)', titleBn: 'টেলিটক: সিম নম্বর চেক (*551#)', desc: 'Queries Teletalk SIM phone number', descBn: 'টেলিটক সিমের ১১ ডিজিটের নম্বর দেখুন।' },
  ];

  const filtered = (operatorFilter && operatorFilter !== 'all') 
    ? items.filter(item => item.operator === operatorFilter)
    : items;

  return filtered.map(item => {
    const cmds = formatUssdByProtocol(item.ussdCode, rawProtocol, pin);
    return {
      id: item.id,
      title: item.title,
      titleBn: item.titleBn,
      category: 'ussd',
      operator: item.operator,
      gprsCommand: cmds.gprsCommand,
      smsCommand: cmds.smsCommand,
      traccarType: 'custom',
      description: item.desc,
      descriptionBn: item.descBn
    };
  });
}

export function getProtocolPresets(device?: Device, position?: Position): ProtocolPresetCommand[] {
  const rawProtocol = (position?.protocol || device?.attributes?.protocol || device?.model || '').toLowerCase();
  const pin = device?.attributes?.commandPin || '123456';
  const sosPhone = device?.attributes?.sos1 || '01700000000';
  
  // Auto-detect SIM operator from device phone attribute
  const devicePhone = device?.phone || device?.attributes?.simNumber || device?.attributes?.phone || '';
  const detectedOp = detectOperatorFromPhone(devicePhone);
  const ussdPresets = getBangladeshUssdPresets(rawProtocol, pin, detectedOp !== 'unknown' ? detectedOp : 'all');

  // 1. SinoTrack Protocol Presets
  if (rawProtocol.includes('sinotrack') || rawProtocol.includes('h02') || rawProtocol.includes('st-901')) {
    return [
      ...ussdPresets,
      {
        id: 'st-status',
        title: 'Query System Status (CXZT)',
        titleBn: 'সিস্টেম ও জিপিএস স্ট্যাটাস (CXZT)',
        category: 'status',
        gprsCommand: 'CXZT',
        smsCommand: 'CXZT',
        traccarType: 'custom',
        description: 'Queries battery voltage, GSM/GPS signal & ignition state.',
        descriptionBn: 'ব্যাটারি ভোল্টেজ, সিগন্যাল ও ইগনিশন স্ট্যাটাস যাচাই।'
      },
      {
        id: 'st-rconf',
        title: 'Check Configuration (RCONF)',
        titleBn: 'ট্র্যাকার কনফিগারেশন চেক (RCONF)',
        category: 'status',
        gprsCommand: 'RCONF',
        smsCommand: 'RCONF',
        traccarType: 'custom',
        description: 'Queries APN, reporting interval and sleep timer.',
        descriptionBn: 'এপিএন এবং ডাটা আপলোড ইন্টারভাল দেখুন।'
      },
      {
        id: 'st-where',
        title: 'Instant GPS Fix (6690000)',
        titleBn: 'তাত্ক্ষণিক জিপিএস লোকেশন (6690000)',
        category: 'status',
        gprsCommand: '6690000',
        smsCommand: '6690000',
        traccarType: 'positionSingle',
        description: 'Requests instant location coordinates & Google Maps link.',
        descriptionBn: 'লাইভ ম্যাপ লোকেশন ও কোঅর্ডিনেট রিকোয়েস্ট।'
      },
      {
        id: 'st-apn',
        title: 'Set SIM APN (8030000 gpinternet)',
        titleBn: 'সিম এপিএন সেটআপ (8030000 gpinternet)',
        category: 'network',
        gprsCommand: '8030000 gpinternet',
        smsCommand: '8030000 gpinternet',
        traccarType: 'custom',
        description: 'Configures SIM GPRS APN for GP, Robi, Banglalink.',
        descriptionBn: 'সিমের ইন্টারনেট চালু করার জন্য এপিএন কনফিগ করুন।'
      },
      {
        id: 'st-sos',
        title: `Set SOS Master Phone (${sosPhone})`,
        titleBn: `মাস্টার SOS নম্বর সেট (${sosPhone})`,
        category: 'security',
        gprsCommand: `param1,${sosPhone}`,
        smsCommand: `param1,${sosPhone}`,
        traccarType: 'custom',
        description: 'Sets primary phone for emergency call on wire cut.',
        descriptionBn: 'তার কাটা বা চুরির চেষ্টায় অটো কলের জন্য মাস্টার ফোন সেট।'
      },
      {
        id: 'st-cut',
        title: '🚨 Cut Engine / Oil (9400000)',
        titleBn: '🚨 ইঞ্জিন লক ও ফুয়েল কাট (9400000)',
        category: 'engine',
        gprsCommand: '9400000',
        smsCommand: '9400000',
        traccarType: 'engineStop',
        description: 'Immobilizes engine ignition and cuts power relay.',
        descriptionBn: 'জ্বালানি সরবরাহ বন্ধ করে ইঞ্জিন সম্পূর্ণ লক করুন।',
        isDangerous: true
      },
      {
        id: 'st-resume',
        title: '⚡ Restore Engine (9410000)',
        titleBn: '⚡ ইঞ্জিন আনলক ও চালু (9410000)',
        category: 'engine',
        gprsCommand: '9410000',
        smsCommand: '9410000',
        traccarType: 'engineResume',
        description: 'Restores power supply to vehicle starter relay.',
        descriptionBn: 'ইঞ্জিনে বিদ্যুৎ সংযোগ সচল করে স্টার্টের অনুমতি দিন।'
      },
      {
        id: 'st-restart',
        title: 'Reboot Device (RESTART)',
        titleBn: 'ট্র্যাকার রিস্টার্ট (RESTART)',
        category: 'status',
        gprsCommand: 'RESTART',
        smsCommand: 'RESTART',
        traccarType: 'deviceReboot',
        description: 'Soft reboots GSM modem and GPS chipset.',
        descriptionBn: 'ট্র্যাকারের হার্ডওয়্যার মডেম রিস্টার্ট করুন।'
      }
    ];
  }

  // 2. Coban / TK103 Protocol Presets
  if (rawProtocol.includes('gps103') || rawProtocol.includes('tk103') || rawProtocol.includes('coban')) {
    return [
      ...ussdPresets,
      {
        id: 'cb-check',
        title: `Check Status (check${pin})`,
        titleBn: `সিস্টেম চেক (check${pin})`,
        category: 'status',
        gprsCommand: `check${pin}`,
        smsCommand: `check${pin}`,
        traccarType: 'custom',
        description: 'Queries GSM, GPS, power, battery, ACC & door status.',
        descriptionBn: 'ব্যাটারি, স্যাটেলাইট ও ইগনিশন চেক করুন।'
      },
      {
        id: 'cb-where',
        title: `Instant Location (fix030s001n${pin})`,
        titleBn: `তাত্ক্ষণিক অবস্থান (fix030s)`,
        category: 'status',
        gprsCommand: `fix030s001n${pin}`,
        smsCommand: `fix030s001n${pin}`,
        traccarType: 'positionSingle',
        description: 'Wakes up tracker and requests single GPS fix.',
        descriptionBn: 'জিপিএস চিপ ওয়েকআপ করে লোকেশন আপডেট করুন।'
      },
      {
        id: 'cb-apn',
        title: `Set SIM APN (apn${pin} gpinternet)`,
        titleBn: `সিম এপিএন সেটআপ (apn${pin})`,
        category: 'network',
        gprsCommand: `apn${pin} gpinternet`,
        smsCommand: `apn${pin} gpinternet`,
        traccarType: 'custom',
        description: 'Configures SIM GPRS APN.',
        descriptionBn: 'সিমের ইন্টারনেট এপিএন কনফিগার করুন।'
      },
      {
        id: 'cb-sos',
        title: `Set Admin Phone (${sosPhone})`,
        titleBn: `অ্যাডমিন ফোন সেট (${sosPhone})`,
        category: 'security',
        gprsCommand: `admin${pin} ${sosPhone}`,
        smsCommand: `admin${pin} ${sosPhone}`,
        traccarType: 'custom',
        description: 'Authorizes master phone for emergency voice calls.',
        descriptionBn: 'জরুরি কলের জন্য মাস্টার ফোন সেট করুন।'
      },
      {
        id: 'cb-cut',
        title: `🚨 Stop Engine (quickstop${pin})`,
        titleBn: `🚨 ইঞ্জিন লক (quickstop)`,
        category: 'engine',
        gprsCommand: `quickstop${pin}`,
        smsCommand: `quickstop${pin}`,
        traccarType: 'engineStop',
        description: 'Cuts fuel ignition relay immediately.',
        descriptionBn: 'ইঞ্জিন সংযোগ বিচ্ছিন্ন করুন।',
        isDangerous: true
      },
      {
        id: 'cb-resume',
        title: `⚡ Resume Engine (resume${pin})`,
        titleBn: `⚡ ইঞ্জিন চালু (resume)`,
        category: 'engine',
        gprsCommand: `resume${pin}`,
        smsCommand: `resume${pin}`,
        traccarType: 'engineResume',
        description: 'Restores ignition power relay.',
        descriptionBn: 'ইঞ্জিন পুনরায় সচল করুন।'
      },
      {
        id: 'cb-reset',
        title: `Reboot Device (reset${pin})`,
        titleBn: `ডিভাইস রিস্টার্ট (reset)`,
        category: 'status',
        gprsCommand: `reset${pin}`,
        smsCommand: `reset${pin}`,
        traccarType: 'deviceReboot',
        description: 'Reboots GPS MCU and GSM processor.',
        descriptionBn: 'ট্র্যাকার রিস্টার্ট করুন।'
      }
    ];
  }

  // 3. Teltonika Protocol Presets
  if (rawProtocol.includes('teltonika')) {
    return [
      ...ussdPresets,
      {
        id: 'tel-status',
        title: 'Get Status (getstatus)',
        titleBn: 'টেলটোনিকা স্ট্যাটাস (getstatus)',
        category: 'status',
        gprsCommand: 'getstatus',
        smsCommand: '  getstatus',
        traccarType: 'custom',
        description: 'Queries modem, GNSS, power & IO peripheral states.',
        descriptionBn: 'মডেম, জিএনএসএস ও পাওয়ার স্ট্যাটাস দেখুন।'
      },
      {
        id: 'tel-ver',
        title: 'Get Version & IMEI (getver)',
        titleBn: 'ফার্মওয়্যার ও আইএমইআই (getver)',
        category: 'status',
        gprsCommand: 'getver',
        smsCommand: '  getver',
        traccarType: 'custom',
        description: 'Queries firmware version and hardware serial number.',
        descriptionBn: 'হার্ডওয়্যার ও ফার্মওয়্যার তথ্য জানুন।'
      },
      {
        id: 'tel-apn',
        title: 'Set SIM APN (setparam 2001 gpinternet)',
        titleBn: 'সিম এপিএন সেটআপ (setparam 2001)',
        category: 'network',
        gprsCommand: 'setparam 2001 gpinternet',
        smsCommand: '  setparam 2001 gpinternet',
        traccarType: 'custom',
        description: 'Configures Teltonika SIM GPRS APN.',
        descriptionBn: 'সিমের ইন্টারনেট এপিএন কনফিগার করুন।'
      },
      {
        id: 'tel-cut',
        title: '🚨 Cut Engine (setdigout 1)',
        titleBn: '🚨 ইঞ্জিন লক (setdigout 1)',
        category: 'engine',
        gprsCommand: 'setdigout 1',
        smsCommand: '  setdigout 1',
        traccarType: 'engineStop',
        description: 'Enables Digital Output 1 to trigger immobilizer relay.',
        descriptionBn: 'ইঞ্জিন ইমোবিলাইজার রিলে অন করুন।',
        isDangerous: true
      },
      {
        id: 'tel-resume',
        title: '⚡ Restore Engine (setdigout 0)',
        titleBn: '⚡ ইঞ্জিন আনলক (setdigout 0)',
        category: 'engine',
        gprsCommand: 'setdigout 0',
        smsCommand: '  setdigout 0',
        traccarType: 'engineResume',
        description: 'Disables Digital Output 1 to restore engine power.',
        descriptionBn: 'ইঞ্জিন আনলক করুন।'
      },
      {
        id: 'tel-reset',
        title: 'CPU Reboot (cpureset)',
        titleBn: 'সিপিইউ রিস্টার্ট (cpureset)',
        category: 'status',
        gprsCommand: 'cpureset',
        smsCommand: '  cpureset',
        traccarType: 'deviceReboot',
        description: 'Reboots Teltonika onboard CPU.',
        descriptionBn: 'টেলটোনিকা প্রসেসর রিস্টার্ট করুন।'
      }
    ];
  }

  // 4. Default: Concox / Jimi / GT06 / Universal Protocols
  return [
    ...ussdPresets,
    {
      id: 'gt-status',
      title: 'Query System Status (STATUS#)',
      titleBn: 'সিস্টেম ও ব্যাটারি স্ট্যাটাস (STATUS#)',
      category: 'status',
      gprsCommand: 'STATUS#',
      smsCommand: 'STATUS#',
      traccarType: 'custom',
      description: 'Checks GSM signal, GPS lock, external power & battery.',
      descriptionBn: 'জিএসএম সিগন্যাল, ব্যাটারি ও পাওয়ার স্ট্যাটাস দেখুন।'
    },
    {
      id: 'gt-param',
      title: 'Check Configuration (PARAM#)',
      titleBn: 'প্যারামিটার ও সেটিংস চেক (PARAM#)',
      category: 'status',
      gprsCommand: 'PARAM#',
      smsCommand: 'PARAM#',
      traccarType: 'custom',
      description: 'Queries APN, SOS slot & heartbeat rate.',
      descriptionBn: 'এপিএন এবং এসওএস নম্বর সেটিংস দেখুন।'
    },
    {
      id: 'gt-where',
      title: 'Wakeup & Coordinate Fix (WHERE#)',
      titleBn: 'জিপিএস ওয়েকআপ ও অবস্থান (WHERE#)',
      category: 'status',
      gprsCommand: 'WHERE#',
      smsCommand: 'WHERE#',
      traccarType: 'positionSingle',
      description: 'Wakes up sleeping tracker chipset and pulls GPS fix.',
      descriptionBn: 'স্লিপিং জিপিএস চিপ জাগিয়ে লাইভ অবস্থান আনুন।'
    },
    {
      id: 'gt-apn',
      title: 'Set SIM APN (APN,gpinternet#)',
      titleBn: 'সিম এপিএন সেটআপ (APN,gpinternet#)',
      category: 'network',
      gprsCommand: 'APN,gpinternet#',
      smsCommand: 'APN,gpinternet#',
      traccarType: 'custom',
      description: 'Configures SIM APN for GP, Robi, Banglalink, Airtel.',
      descriptionBn: 'ইন্টারনেট ডাটার জন্য সিমের এপিএন সেট করুন।'
    },
    {
      id: 'gt-sos',
      title: `Set Master SOS Phone (${sosPhone})`,
      titleBn: `মাস্টার SOS নম্বর সেট (${sosPhone})`,
      category: 'security',
      gprsCommand: `SOS,A,${sosPhone}#`,
      smsCommand: `SOS,A,${sosPhone}#`,
      traccarType: 'custom',
      description: 'Configures primary phone to receive calls on wire cut.',
      descriptionBn: 'তার কাটা বা ব্যাটারি খুললে অটো কলের জন্য মাস্টার ফোন সেট।'
    },
    {
      id: 'gt-relay-cut',
      title: '🚨 Cut Engine / Fuel (RELAY,1#)',
      titleBn: '🚨 ইঞ্জিন লক ও ফুয়েল কাট (RELAY,1#)',
      category: 'engine',
      gprsCommand: 'RELAY,1#',
      smsCommand: 'RELAY,1#',
      traccarType: 'engineStop',
      description: 'Immobilizes engine ignition by triggering relay.',
      descriptionBn: 'তেল সংযোগ বন্ধ করে ইঞ্জিন সম্পূর্ণ লক করুন।',
      isDangerous: true
    },
    {
      id: 'gt-relay-res',
      title: '⚡ Restore Engine Power (RELAY,0#)',
      titleBn: '⚡ ইঞ্জিন আনলক ও চালু (RELAY,0#)',
      category: 'engine',
      gprsCommand: 'RELAY,0#',
      smsCommand: 'RELAY,0#',
      traccarType: 'engineResume',
      description: 'Restores power supply to vehicle ignition.',
      descriptionBn: 'ইঞ্জিন সংযোগ পুনরায় সচল করুন।'
    },
    {
      id: 'gt-timer',
      title: 'Set Upload Rate (TIMER,10,60#)',
      titleBn: 'ডাটা আপলোড রেট (TIMER,10,60#)',
      category: 'network',
      gprsCommand: 'TIMER,10,60#',
      smsCommand: 'TIMER,10,60#',
      traccarType: 'custom',
      description: 'Sets 10s moving / 60s parked report intervals.',
      descriptionBn: 'চলন্ত অবস্থায় ১০ সেকেন্ড এবং পার্কিংয়ে ৬০ সেকেন্ড ডাটা রেট।'
    },
    {
      id: 'gt-reset',
      title: 'Reboot Tracker Hardware (RESET#)',
      titleBn: 'ট্র্যাকার রিস্টার্ট (RESET#)',
      category: 'status',
      gprsCommand: 'RESET#',
      smsCommand: 'RESET#',
      traccarType: 'deviceReboot',
      description: 'Soft reboots GPS microcontroller.',
      descriptionBn: 'ট্র্যাকার চিপ রিস্টার্ট করুন।'
    }
  ];
}
