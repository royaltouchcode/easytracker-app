import React from 'react';
import { VehicleType } from '../types/traccar';

// High-Definition, Top-Down & 3D Vector Models for Leaflet Live Map Markers (MyGPS / Xeekar Inspired)
export const getVehicleMarkerSvg = (type?: VehicleType, color: string = '#ef4444'): string => {
  switch (type) {
    case 'motorcycle':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <!-- Rear Wheel & Fender -->
        <rect x="18" y="27" width="4" height="10" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1" />
        <!-- Exhaust Pipes -->
        <path d="M22 24 L24 33" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
        <!-- Chassis & Seat -->
        <rect x="17" y="16" width="6" height="12" rx="3" fill="#1e293b" />
        <!-- Fuel Tank (Colored Metallic) -->
        <path d="M16 11 Q20 7 24 11 L23 17 Q20 18 17 17 Z" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <!-- Handlebars & Mirrors -->
        <path d="M11 11 L29 11" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="11" cy="11" r="1.5" fill="#e2e8f0" />
        <circle cx="29" cy="11" r="1.5" fill="#e2e8f0" />
        <!-- Front Fork & Wheel -->
        <rect x="18.5" y="3" width="3" height="9" rx="1.5" fill="#0f172a" stroke="#64748b" stroke-width="0.8" />
        <!-- Front Headlight Beam Indicator -->
        <path d="M17 3 Q20 0 23 3 Z" fill="#fef08a" opacity="0.95" />
      </svg>`;

    case 'scooter':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <rect x="18" y="28" width="4" height="8" rx="2" fill="#0f172a" />
        <!-- Wide Floorboard -->
        <rect x="14" y="18" width="12" height="11" rx="4" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <rect x="17" y="20" width="6" height="8" rx="2" fill="#0f172a" />
        <!-- Apron & Handlebar -->
        <path d="M12 11 L28 11" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
        <path d="M16 9 L24 9 L22 17 L18 17 Z" fill="${color}" />
        <rect x="18.5" y="3" width="3" height="7" rx="1.5" fill="#0f172a" />
        <circle cx="20" cy="4" r="2" fill="#fef08a" />
      </svg>`;

    case 'cng':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <!-- 3 Wheels -->
        <rect x="10" y="28" width="3" height="8" rx="1.5" fill="#0f172a" />
        <rect x="27" y="28" width="3" height="8" rx="1.5" fill="#0f172a" />
        <rect x="18.5" y="4" width="3" height="7" rx="1.5" fill="#0f172a" />
        <!-- Body Shell (Green/Orange Auto) -->
        <path d="M12 15 L28 15 L29 32 L11 32 Z" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <path d="M13 14 L27 14 L20 6 Z" fill="#f97316" />
        <!-- Roof Soft Top -->
        <rect x="14" y="17" width="12" height="12" rx="2" fill="#065f46" stroke="#34d399" stroke-width="0.8" />
        <circle cx="20" cy="5" r="2" fill="#fef08a" />
      </svg>`;

    case 'auto':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <!-- 3 Wheels -->
        <rect x="9" y="29" width="3.5" height="8" rx="1.5" fill="#0f172a" />
        <rect x="27.5" y="29" width="3.5" height="8" rx="1.5" fill="#0f172a" />
        <rect x="18" y="3" width="4" height="8" rx="2" fill="#0f172a" />
        <!-- Body Canopy Shell (Yellow/Amber Auto Rickshaw) -->
        <path d="M11 17 L29 17 L30 33 L10 33 Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="1" />
        <!-- Striped Green Hood -->
        <path d="M12 16 L28 16 L20 7 Z" fill="#16a34a" />
        <!-- Canopy Roof Stripe -->
        <rect x="13" y="18" width="14" height="3" rx="1" fill="#78350f" opacity="0.7" />
        <!-- Passenger Window -->
        <rect x="13" y="21" width="14" height="8" rx="1.5" fill="#38bdf8" opacity="0.6" />
        <!-- Front Light -->
        <circle cx="20" cy="6" r="2" fill="#fef08a" />
      </svg>`;

    case 'ambulance':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <rect x="11" y="5" width="18" height="31" rx="4" fill="#f8fafc" stroke="#ef4444" stroke-width="1.5" />
        <!-- Windshield -->
        <path d="M13 10 L27 10 L25 15 L15 15 Z" fill="#38bdf8" />
        <!-- Flashing Red Cross -->
        <rect x="16" y="21" width="8" height="3" fill="#ef4444" rx="0.5" />
        <rect x="18.5" y="18.5" width="3" height="8" fill="#ef4444" rx="0.5" />
        <!-- Blue & Red Emergency Beacons -->
        <circle cx="16" cy="7" r="1.5" fill="#3b82f6" />
        <circle cx="24" cy="7" r="1.5" fill="#ef4444" />
      </svg>`;

    case 'truck':
    case 'pickup':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <!-- Wheels -->
        <rect x="9" y="8" width="3" height="7" rx="1" fill="#0f172a" />
        <rect x="28" y="8" width="3" height="7" rx="1" fill="#0f172a" />
        <rect x="9" y="27" width="3" height="8" rx="1" fill="#0f172a" />
        <rect x="28" y="27" width="3" height="8" rx="1" fill="#0f172a" />
        <!-- Cabin -->
        <rect x="12" y="5" width="16" height="11" rx="2" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <path d="M14 8 L26 8 L25 12 L15 12 Z" fill="#38bdf8" opacity="0.8" />
        <!-- Cargo Bed -->
        <rect x="11" y="17" width="18" height="19" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1" />
      </svg>`;

    case 'bus':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <rect x="8" y="7" width="3" height="8" rx="1" fill="#0f172a" />
        <rect x="29" y="7" width="3" height="8" rx="1" fill="#0f172a" />
        <rect x="8" y="26" width="3" height="8" rx="1" fill="#0f172a" />
        <rect x="29" y="26" width="3" height="8" rx="1" fill="#0f172a" />
        <!-- Long Coach Body -->
        <rect x="10" y="3" width="20" height="34" rx="3" fill="${color}" stroke="#ffffff" stroke-width="1.2" />
        <path d="M12 5 L28 5 L27 9 L13 9 Z" fill="#38bdf8" opacity="0.9" />
        <!-- Passenger Windows & AC Roof -->
        <rect x="12" y="11" width="16" height="19" rx="1" fill="#0f172a" opacity="0.6" />
        <rect x="15" y="14" width="10" height="12" rx="1" fill="#cbd5e1" opacity="0.8" />
        <circle cx="12" cy="4" r="1.5" fill="#fef08a" />
        <circle cx="28" cy="4" r="1.5" fill="#fef08a" />
      </svg>`;

    case 'tractor':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <!-- Giant Rear Tread Wheels -->
        <rect x="7" y="22" width="5.5" height="15" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
        <rect x="27.5" y="22" width="5.5" height="15" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
        <!-- Small Front Wheels -->
        <rect x="10" y="5" width="3.5" height="7" rx="1" fill="#0f172a" stroke="#64748b" stroke-width="1" />
        <rect x="26.5" y="5" width="3.5" height="7" rx="1" fill="#0f172a" stroke="#64748b" stroke-width="1" />
        <!-- Bonnet / Engine Block -->
        <rect x="14" y="4" width="12" height="18" rx="2" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <!-- Exhaust Silencer Chimney -->
        <circle cx="16" cy="10" r="1.8" fill="#0f172a" stroke="#94a3b8" stroke-width="0.8" />
        <!-- Driver Seat & Roll Cage -->
        <rect x="13" y="23" width="14" height="9" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
        <circle cx="15" cy="5" r="1.5" fill="#fef08a" />
        <circle cx="25" cy="5" r="1.5" fill="#fef08a" />
      </svg>`;

    case 'bicycle':
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <rect x="19" y="29" width="2" height="9" rx="1" fill="#0f172a" />
        <rect x="19" y="2" width="2" height="9" rx="1" fill="#0f172a" />
        <line x1="20" y1="8" x2="20" y2="32" stroke="${color}" stroke-width="2.5" stroke-linecap="round" />
        <!-- Handlebar -->
        <line x1="12" y1="9" x2="28" y2="9" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
        <!-- Saddle -->
        <ellipse cx="20" cy="22" rx="3" ry="4" fill="#0f172a" stroke="#ffffff" stroke-width="0.8" />
      </svg>`;

    case 'car':
    default:
      return `<svg viewBox="0 0 40 40" width="34" height="34" class="drop-shadow-md">
        <!-- 4 Wheels -->
        <rect x="9" y="8" width="3" height="7" rx="1" fill="#0f172a" />
        <rect x="28" y="8" width="3" height="7" rx="1" fill="#0f172a" />
        <rect x="9" y="25" width="3" height="7" rx="1" fill="#0f172a" />
        <rect x="28" y="25" width="3" height="7" rx="1" fill="#0f172a" />
        <!-- Car Body Chassis -->
        <path d="M12 8 Q20 4 28 8 L29 32 Q20 35 11 32 Z" fill="${color}" stroke="#ffffff" stroke-width="1.2" />
        <!-- Front Windshield -->
        <path d="M14 11 Q20 9 26 11 L25 17 Q20 18 15 17 Z" fill="#38bdf8" opacity="0.9" />
        <!-- Roof / Sunroof -->
        <rect x="15" y="18" width="10" height="7" rx="1.5" fill="#0f172a" opacity="0.8" />
        <!-- Rear Windshield -->
        <path d="M15 26 L25 26 L26 29 L14 29 Z" fill="#38bdf8" opacity="0.8" />
        <!-- Headlights -->
        <circle cx="14" cy="6" r="1.5" fill="#fef08a" />
        <circle cx="26" cy="6" r="1.5" fill="#fef08a" />
      </svg>`;
  }
};

// React Component for Header, Settings, and Dashboard Grid
export const VehicleIcon: React.FC<{ type?: VehicleType; className?: string }> = ({ 
  type = 'car', 
  className = "w-4 h-4" 
}) => {
  switch (type) {
    case 'motorcycle':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M7 23a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm18 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-9.5-6h-3l-2.5-4h4.5l1 4zm3.8-3.2L18 10h3l1.5 3.5-3.2.3zm-5.3-3.8h4l1.5 3h-5l-.5-3zm-1.8 13L15 15h3.5l1.5 7h-7.8zM19 7h3v2h-3V7z"/>
        </svg>
      );

    case 'scooter':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M8 23a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1.8a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zm16 1.8a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1.8a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zm-14.5-5.5h4l2.5-5.5H19v2h-2.3l-1.8 4h3.6l1.5-6.5h3.5v2h-2.2L19.5 21h-8.5l-1.5-3.5zM22 6h3v2h-3V6z"/>
        </svg>
      );

    case 'ambulance':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M3 10h18v11H3V10zm18 3h5l3 3.5V21h-8v-8zM8 24a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM10.5 12h3v2.5H16v3h-2.5V20h-3v-2.5H8v-3h2.5V12z"/>
          <circle cx="11" cy="7" r="1.8" fill="#ef4444"/>
        </svg>
      );

    case 'cng':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M6 24a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm20 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-17-7V9l6-4h8l5 5v7H9zm3-6v4h5v-4h-5zm7 0v4h4.5l-2-4H19zm-8 8h17v2H11v-2z"/>
        </svg>
      );

    case 'auto':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          {/* Auto Rickshaw 3-Wheeler Icon */}
          <path d="M5 23a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm22 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-19-6V11l5-5h12l3 3.5V17H8zm4-5v3h4v-3h-4zm6 0v3h5l-1.5-3H18zm-7 7h16v2H11v-2z"/>
          <circle cx="16" cy="5" r="1.5"/>
        </svg>
      );


    case 'pickup':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M3 14l2.5-6h11L18 14H29v7H3v-7zm13.5-4h-9l-1.7 4h10.7V10zM8 24a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      );

    case 'truck':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M2 7h17v14H2V7zm17 5h5l4 4v5h-9v-9zm-11 12a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm15 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-6 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      );

    case 'bus':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M4 6h24v14H4V6zm3 3v4h4V9H7zm6 0v4h6V9h-6zm8 0v4h4V9h-4zM8 23a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      );

    case 'bicycle':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M7 23a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm18 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-14-6l4-7h5l3 7h-2.5l-2-5h-3l-2.5 5H11zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-2-9h4v2h-4V8z"/>
        </svg>
      );

    case 'car':
    default:
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M5 15l2.5-6h17L27 15v6H5v-6zm3-4.5L6.3 14h19.4L24 10.5H8zM8 24a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      );
  }
};

// 3D Realistic Colored Isometric Vehicle Renders (MyGPS & Xeekar Inspired)
export const Vehicle3DRender: React.FC<{ type?: VehicleType; className?: string }> = ({
  type = 'motorcycle',
  className = "w-14 h-14"
}) => {
  switch (type) {
    case 'motorcycle':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="bikeBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <circle cx="15" cy="44" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="15" cy="44" r="5" fill="#334155" />
            <circle cx="49" cy="44" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="49" cy="44" r="5" fill="#334155" />
            <rect x="22" y="38" width="14" height="8" rx="2" fill="#475569" />
            <path d="M26 44 L48 46" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <path d="M15 44 L25 32 L38 32 L49 44" stroke="#0f172a" strokeWidth="3" fill="none" />
            <path d="M25 32 Q32 24 38 32 Z" fill="url(#bikeBody)" />
            <path d="M36 32 Q42 30 46 34" stroke="#020617" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M23 23 L25 32" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="21" cy="22" r="3" fill="#facc15" />
          </svg>
        </div>
      );

    case 'cng':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cngGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="cngHood" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="48" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <path d="M12 40 L16 26 L30 18 L52 20 L54 42 L12 40 Z" fill="url(#cngGreen)" />
            <path d="M28 18 L54 20 L54 26 L26 24 Z" fill="url(#cngHood)" />
            <path d="M18 27 L28 20 L30 32 L16 33 Z" fill="#38bdf8" opacity="0.85" />
            <rect x="34" y="24" width="16" height="10" rx="1.5" fill="#38bdf8" opacity="0.7" />
            <circle cx="12" cy="38" r="2.5" fill="#fef08a" />
          </svg>
        </div>
      );

    case 'car':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="carRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="44" r="7.5" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="48" cy="44" r="7.5" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <path d="M8 38 L14 26 L30 20 L46 22 L54 32 L58 38 L58 42 L8 42 Z" fill="url(#carRed)" />
            <path d="M17 27 L28 22 L29 32 L14 33 Z" fill="#38bdf8" opacity="0.8" />
            <path d="M31 22 L44 24 L48 32 L31 32 Z" fill="#38bdf8" opacity="0.8" />
            <circle cx="10" cy="37" r="2" fill="#fef08a" />
            <circle cx="56" cy="36" r="2" fill="#fca5a5" />
          </svg>
        </div>
      );

    case 'truck':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="truckBox" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <circle cx="15" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="42" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="53" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <path d="M8 42 L8 28 L18 20 L24 20 L24 42 Z" fill="#3b82f6" />
            <path d="M12 28 L18 22 L22 22 L22 28 Z" fill="#bae6fd" />
            <rect x="25" y="16" width="34" height="26" rx="2" fill="url(#truckBox)" stroke="#b45309" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'ambulance':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <circle cx="17" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="47" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <path d="M9 42 L9 26 L22 20 L55 20 L55 42 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M14 26 L20 22 L24 22 L24 28 Z" fill="#38bdf8" opacity="0.8" />
            <rect x="36" y="27" width="10" height="4" fill="#ef4444" rx="1" />
            <rect x="39" y="24" width="4" height="10" fill="#ef4444" rx="1" />
            <ellipse cx="26" cy="18" rx="3" ry="2" fill="#ef4444" className="animate-pulse" />
          </svg>
        </div>
      );

    default:
      return <VehicleIcon type={type} className={className} />;
  }
};
