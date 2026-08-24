import React from 'react';

export type Alert3DType = 
  | 'parking_violation' 
  | 'traffic_signal' 
  | 'ignition_on' 
  | 'ignition_off' 
  | 'overspeed' 
  | 'geofence_exit' 
  | 'geofence_enter' 
  | 'power_cut' 
  | 'power_restored' 
  | 'vibration' 
  | 'movement' 
  | 'sos' 
  | 'fuel_drop' 
  | 'service_reminder' 
  | 'subscription_reminder' 
  | 'door_open' 
  | 'general';

interface Alert3DIconProps {
  type?: string;
  alarm?: string;
  className?: string;
}

export const Alert3DIcon: React.FC<Alert3DIconProps> = ({ 
  type = '', 
  alarm = '', 
  className = "w-11 h-11" 
}) => {
  // Determine normalized 3D key
  const t = type.toLowerCase();
  const a = alarm.toLowerCase();

  let resolvedType: Alert3DType = 'general';

  if (t.includes('parking') || a.includes('parking') || a.includes('noparking')) {
    resolvedType = 'parking_violation';
  } else if (t.includes('traffic') || a.includes('traffic') || t.includes('signal') || a.includes('signal') || a.includes('redlight')) {
    resolvedType = 'traffic_signal';
  } else if (t.includes('powercut') || a.includes('powercut') || a.includes('tamper')) {
    resolvedType = 'power_cut';
  } else if (t.includes('powerrestored') || a.includes('powerrestored')) {
    resolvedType = 'power_restored';
  } else if (a === 'sos' || t.includes('sos')) {
    resolvedType = 'sos';
  } else if (a === 'overspeed' || t.includes('overspeed') || t.includes('speed')) {
    resolvedType = 'overspeed';
  } else if (a === 'vibration' || a === 'movement' || t.includes('vibration') || t.includes('motion')) {
    resolvedType = 'vibration';
  } else if (a === 'geofenceexit' || t.includes('geofenceexit') || t.includes('zone_exit')) {
    resolvedType = 'geofence_exit';
  } else if (a === 'geofenceenter' || t.includes('geofenceenter') || t.includes('zone_enter')) {
    resolvedType = 'geofence_enter';
  } else if (a.includes('fuel') || t.includes('fuel')) {
    resolvedType = 'fuel_drop';
  } else if (t.includes('service') || t.includes('oil') || t.includes('maintenance')) {
    resolvedType = 'service_reminder';
  } else if (t.includes('subscription') || t.includes('billing') || t.includes('renew')) {
    resolvedType = 'subscription_reminder';
  } else if (t.includes('ignition_on') || t.includes('engine_on') || (t.includes('ignition') && a !== 'off')) {
    resolvedType = 'ignition_on';
  } else if (t.includes('ignition_off') || t.includes('engine_off') || t.includes('lock') || t.includes('cut')) {
    resolvedType = 'ignition_off';
  }

  return (
    <div className={`${className} flex items-center justify-center shrink-0 drop-shadow-md select-none`}>
      {render3DSvg(resolvedType)}
    </div>
  );
};

const render3DSvg = (type: Alert3DType) => {
  switch (type) {
    // 🚫🅿️ 1. No-Parking Violation 3D Icon
    case 'parking_violation':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="poleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="signBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="redRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.6"/>
            </filter>
          </defs>
          {/* Base Pole */}
          <rect x="29" y="40" width="6" height="22" rx="2" fill="url(#poleGrad)" />
          <ellipse cx="32" cy="61" rx="10" ry="3" fill="#0f172a" opacity="0.6" />
          
          {/* Circular Sign Disc */}
          <circle cx="32" cy="26" r="23" fill="url(#signBg)" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Glowing Red Prohibition Ring */}
          <circle cx="32" cy="26" r="21" fill="none" stroke="url(#redRing)" strokeWidth="4.5" filter="url(#glowRed)" />
          
          {/* White 'P' Parking Letter */}
          <path d="M26 15 L33 15 Q39 15 39 21 Q39 27 33 27 L26 27 Z M26 27 L26 37" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* Bold Red 3D Slash Across */}
          <line x1="16" y1="11" x2="48" y2="41" stroke="url(#redRing)" strokeWidth="4.5" strokeLinecap="round" filter="url(#glowRed)" />
          
          {/* AI Chip Badge at Corner */}
          <rect x="42" y="4" width="18" height="13" rx="4" fill="#7c3aed" stroke="#c084fc" strokeWidth="1" />
          <text x="51" y="13" fill="#ffffff" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">AI</text>
        </svg>
      );

    // 🚦🚨 2. Traffic Signal Violation 3D Icon
    case 'traffic_signal':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="lightBox" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <filter id="trafficGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.9"/>
            </filter>
          </defs>
          {/* Pole */}
          <rect x="29" y="44" width="6" height="18" rx="2" fill="#475569" />
          {/* Housing Body */}
          <rect x="18" y="4" width="28" height="42" rx="8" fill="url(#lightBox)" stroke="#64748b" strokeWidth="1.5" />
          
          {/* Red Signal (Glowing & Flashing) */}
          <circle cx="32" cy="14" r="6" fill="url(#redGlow)" stroke="#fecaca" strokeWidth="1" filter="url(#trafficGlow)" />
          <circle cx="32" cy="14" r="2.5" fill="#ffffff" opacity="0.8" />
          
          {/* Yellow Amber Signal (Dimmed) */}
          <circle cx="32" cy="25" r="5" fill="#78350f" stroke="#b45309" strokeWidth="0.8" opacity="0.6" />
          
          {/* Green Signal (Dimmed) */}
          <circle cx="32" cy="36" r="5" fill="#064e3b" stroke="#047857" strokeWidth="0.8" opacity="0.6" />

          {/* 360° AI Camera Lens Mini Badge */}
          <circle cx="48" cy="10" r="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="48" cy="10" r="3.5" fill="#0f172a" />
          <circle cx="46.5" cy="8.5" r="1.5" fill="#38bdf8" />
        </svg>
      );

    // 🚗⚡ 3. Ignition ON 3D Icon
    case 'ignition_on':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="keyGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.7"/>
            </filter>
          </defs>
          {/* Rotating Key Ring */}
          <circle cx="24" cy="24" r="14" fill="url(#keyGreen)" stroke="#6ee7b7" strokeWidth="2" filter="url(#glowGreen)" />
          <circle cx="24" cy="24" r="6" fill="#0f172a" />
          {/* Key Blade */}
          <path d="M36 21 L56 21 L56 29 L51 29 L51 34 L46 34 L46 29 L36 27 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          {/* Electric Lightning Spark */}
          <path d="M46 10 L39 22 L45 22 L41 34 L54 18 L47 18 Z" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" filter="url(#glowGreen)" />
        </svg>
      );

    // 🛑🔑 4. Ignition OFF 3D Icon
    case 'ignition_off':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="keyRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <filter id="glowRedSmall" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#ef4444" floodOpacity="0.6"/>
            </filter>
          </defs>
          {/* Padlock Shackle */}
          <path d="M22 26 L22 17 Q22 7 32 7 Q42 7 42 17 L42 26" fill="none" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
          {/* Lock Body */}
          <rect x="16" y="24" width="32" height="28" rx="7" fill="url(#keyRed)" stroke="#fca5a5" strokeWidth="1.5" filter="url(#glowRedSmall)" />
          {/* Keyhole */}
          <circle cx="32" cy="35" r="3.5" fill="#0f172a" />
          <polygon points="30.5,35 33.5,35 34,44 30,44" fill="#0f172a" />
        </svg>
      );

    // ⚡🚨 5. Over-Speed 3D Icon
    case 'overspeed':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="speedDial" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="needleRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <filter id="speedGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f97316" floodOpacity="0.8"/>
            </filter>
          </defs>
          {/* Gauge Outer Bezel */}
          <circle cx="32" cy="32" r="26" fill="url(#speedDial)" stroke="#475569" strokeWidth="2.5" />
          {/* Danger Red Arc */}
          <path d="M32 10 A22 22 0 0 1 54 32" fill="none" stroke="url(#needleRed)" strokeWidth="4.5" strokeLinecap="round" filter="url(#speedGlow)" />
          {/* Safe Green Arc */}
          <path d="M10 32 A22 22 0 0 1 32 10" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          {/* Graduation Ticks */}
          <circle cx="32" cy="14" r="1.5" fill="#f8fafc" />
          <circle cx="44" cy="18" r="1.5" fill="#f8fafc" />
          <circle cx="50" cy="32" r="1.5" fill="#ef4444" />
          {/* Center Hub */}
          <circle cx="32" cy="36" r="5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          {/* Speed Needle Pegged at Danger */}
          <line x1="32" y1="36" x2="48" y2="20" stroke="url(#needleRed)" strokeWidth="3.5" strokeLinecap="round" filter="url(#speedGlow)" />
          <circle cx="32" cy="36" r="2.5" fill="#f8fafc" />
        </svg>
      );

    // 🚷⚡ 6. Geofence Exit / Breach 3D Icon
    case 'geofence_exit':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="fenceRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>
          {/* Hexagonal Laser Boundary */}
          <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" fill="none" stroke="url(#fenceRed)" strokeWidth="3" strokeDasharray="6 3" />
          {/* Breach Flash Rays */}
          <line x1="50" y1="16" x2="62" y2="8" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="24" x2="62" y2="24" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          {/* Exiting Arrow */}
          <path d="M22 34 L38 34 M32 26 L42 34 L32 42" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 🛡️📍 7. Geofence Safe Entry 3D Icon
    case 'geofence_enter':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="shieldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          {/* Shield Body */}
          <path d="M32 6 L50 14 L50 32 Q50 48 32 58 Q14 48 14 32 L14 14 Z" fill="url(#shieldCyan)" stroke="#67e8f9" strokeWidth="2" />
          {/* Safe Checkmark inside */}
          <path d="M24 32 L29 38 L40 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 🪫🔌 8. Power Cut / Battery Wire Tamper 3D Icon
    case 'power_cut':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="batBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* 12V Battery Box */}
          <rect x="12" y="18" width="40" height="34" rx="4" fill="url(#batBody)" stroke="#64748b" strokeWidth="1.5" />
          {/* Terminals */}
          <rect x="18" y="12" width="8" height="6" rx="1" fill="#ef4444" />
          <rect x="38" y="12" width="8" height="6" rx="1" fill="#3b82f6" />
          {/* Severed Sparks */}
          <path d="M22 12 L22 4 L28 7 L24 2" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Danger Cut Mark */}
          <line x1="20" y1="26" x2="44" y2="44" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="44" y1="26" x2="20" y2="44" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    // 📳⚠️ 9. Vibration / Shock / Towing 3D Icon
    case 'vibration':
    case 'movement':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="sensorGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Sensor Center Sphere */}
          <circle cx="32" cy="32" r="12" fill="url(#sensorGold)" stroke="#fde68a" strokeWidth="2" />
          {/* Vibration Wave Arcs Left */}
          <path d="M15 18 Q8 32 15 46" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M9 12 Q0 32 9 52" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          {/* Vibration Wave Arcs Right */}
          <path d="M49 18 Q56 32 49 46" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M55 12 Q64 32 55 52" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          {/* Exclamation in Center */}
          <text x="32" y="38" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">!</text>
        </svg>
      );

    // 🆘🚨 10. SOS Emergency Beacon 3D Icon
    case 'sos':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="sirenRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff1744" />
              <stop offset="100%" stopColor="#b71c1c" />
            </linearGradient>
            <filter id="sosGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ef4444" floodOpacity="0.9"/>
            </filter>
          </defs>
          {/* Base */}
          <rect x="14" y="44" width="36" height="12" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          {/* Dome Siren Light */}
          <path d="M18 44 Q18 16 32 14 Q46 16 46 44 Z" fill="url(#sirenRed)" stroke="#fca5a5" strokeWidth="1.5" filter="url(#sosGlow)" />
          {/* Light Reflection */}
          <path d="M24 24 Q32 18 36 24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* SOS Text */}
          <text x="32" y="53" fill="#f8fafc" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SOS</text>
        </svg>
      );

    // ⛽📉 11. Fuel Drop / Theft Alert 3D Icon
    case 'fuel_drop':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="fuelPump" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#5b21b6" />
            </linearGradient>
          </defs>
          {/* Pump Main Unit */}
          <rect x="12" y="16" width="28" height="40" rx="4" fill="url(#fuelPump)" stroke="#c4b5fd" strokeWidth="1.5" />
          <rect x="17" y="22" width="18" height="10" rx="2" fill="#0f172a" />
          <text x="26" y="30" fill="#a78bfa" fontSize="7" fontWeight="bold" textAnchor="middle">FUEL</text>
          {/* Downward Alert Arrow */}
          <path d="M46 18 L46 44 M38 36 L46 44 L54 36" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 🔧⏰ 12. Maintenance / Service Reminder 3D Icon
    case 'service_reminder':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="wrenchGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>
          {/* Crossed Wrench & Screwdriver */}
          <path d="M14 44 L44 14 M42 10 L48 8 L54 14 L52 20 M10 42 L8 48 L14 54 L20 52" stroke="url(#wrenchGold)" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Clock Mini Badge */}
          <circle cx="46" cy="46" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <polyline points="46,38 46,46 51,46" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 💳📅 13. Subscription Expiry Reminder 3D Icon
    case 'subscription_reminder':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="calBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          {/* Calendar Plate */}
          <rect x="12" y="14" width="40" height="42" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <path d="M12 20 L12 26 L52 26 L52 20 Z" fill="url(#calBg)" />
          {/* Pins */}
          <rect x="20" y="8" width="4" height="8" rx="1.5" fill="#f8fafc" />
          <rect x="40" y="8" width="4" height="8" rx="1.5" fill="#f8fafc" />
          {/* Golden Crown / VIP Badge */}
          <polygon points="24,42 27,34 32,38 37,34 40,42" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        </svg>
      );

    // 🔔 Default Bell 3D Icon
    default:
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="bellGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path d="M32 10 Q32 18 20 38 L44 38 Q32 18 32 10 Z" fill="url(#bellGold)" stroke="#7dd3fc" strokeWidth="1.5" />
          <rect x="16" y="38" width="32" height="6" rx="2" fill="#0369a1" />
          <circle cx="32" cy="48" r="4" fill="#38bdf8" />
        </svg>
      );
  }
};
