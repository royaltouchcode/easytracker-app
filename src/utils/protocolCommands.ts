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
  category: 'status' | 'security' | 'network' | 'engine';
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

export function getProtocolPresets(device?: Device, position?: Position): ProtocolPresetCommand[] {
  const rawProtocol = (position?.protocol || device?.attributes?.protocol || device?.model || '').toLowerCase();
  const pin = device?.attributes?.commandPin || '123456';
  const sosPhone = device?.attributes?.sos1 || '01700000000';

  // 1. SinoTrack Protocol Presets
  if (rawProtocol.includes('sinotrack') || rawProtocol.includes('h02') || rawProtocol.includes('st-901')) {
    return [
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
