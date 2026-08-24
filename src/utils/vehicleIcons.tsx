import React from 'react';
import { VehicleType } from '../types/traccar';

// High-Definition, Ultra-Modern SVG Vector Strings for Leaflet Map Markers
export const getVehicleMarkerSvg = (type?: VehicleType, color: string = '#3b82f6'): string => {
  switch (type) {
    case 'motorcycle':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M7 23a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm18 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-9.5-6h-3l-2.5-4h4.5l1 4zm3.8-3.2L18 10h3l1.5 3.5-3.2.3zm-5.3-3.8h4l1.5 3h-5l-.5-3zm-1.8 13L15 15h3.5l1.5 7h-7.8zM19 7h3v2h-3V7z"/>
      </svg>`;

    case 'scooter':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M8 23a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1.8a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zm16 1.8a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1.8a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zm-14.5-5.5h4l2.5-5.5H19v2h-2.3l-1.8 4h3.6l1.5-6.5h3.5v2h-2.2L19.5 21h-8.5l-1.5-3.5zM22 6h3v2h-3V6z"/>
      </svg>`;

    case 'ambulance':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M3 10h18v11H3V10zm18 3h5l3 3.5V21h-8v-8zM8 24a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM10.5 12h3v2.5H16v3h-2.5V20h-3v-2.5H8v-3h2.5V12z" fill="white"/>
        <path d="M12 13.5h1.5v2.5H16v1.5h-2.5V20H12v-2.5H9.5V16H12v-2.5z" fill="#ef4444"/>
        <circle cx="11" cy="7" r="1.8" fill="#ef4444"/>
      </svg>`;

    case 'cng':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M6 24a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm20 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-17-7V9l6-4h8l5 5v7H9zm3-6v4h5v-4h-5zm7 0v4h4.5l-2-4H19zm-8 8h17v2H11v-2z"/>
      </svg>`;

    case 'pickup':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M3 14l2.5-6h11L18 14H29v7H3v-7zm13.5-4h-9l-1.7 4h10.7V10zM8 24a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>`;

    case 'truck':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M2 7h17v14H2V7zm17 5h5l4 4v5h-9v-9zm-11 12a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm15 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-6 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>`;

    case 'bus':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M4 6h24v14H4V6zm3 3v4h4V9H7zm6 0v4h6V9h-6zm8 0v4h4V9h-4zM8 23a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>`;

    case 'bicycle':
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M7 23a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm18 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-14-6l4-7h5l3 7h-2.5l-2-5h-3l-2.5 5H11zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-2-9h4v2h-4V8z"/>
      </svg>`;

    case 'car':
    default:
      return `<svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M5 15l2.5-6h17L27 15v6H5v-6zm3-4.5L6.3 14h19.4L24 10.5H8zM8 24a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm16 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
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
            {/* Front & Rear Wheels */}
            <circle cx="15" cy="44" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="15" cy="44" r="5" fill="#334155" />
            <circle cx="49" cy="44" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="49" cy="44" r="5" fill="#334155" />
            {/* Engine & Exhaust */}
            <rect x="22" y="38" width="14" height="8" rx="2" fill="#475569" />
            <path d="M26 44 L48 46" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            {/* Frame & Tank */}
            <path d="M15 44 L25 32 L38 32 L49 44" stroke="#0f172a" strokeWidth="3" fill="none" />
            <path d="M25 32 Q32 24 38 32 Z" fill="url(#bikeBody)" />
            {/* Seat */}
            <path d="M36 32 Q42 30 46 34" stroke="#020617" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Handlebar & Headlight */}
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
            {/* Wheels */}
            <circle cx="16" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="48" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            {/* Body */}
            <path d="M12 40 L16 26 L30 18 L52 20 L54 42 L12 40 Z" fill="url(#cngGreen)" />
            <path d="M28 18 L54 20 L54 26 L26 24 Z" fill="url(#cngHood)" />
            {/* Windshield & Cabin Window */}
            <path d="M18 27 L28 20 L30 32 L16 33 Z" fill="#38bdf8" opacity="0.85" />
            <rect x="34" y="24" width="16" height="10" rx="1.5" fill="#38bdf8" opacity="0.7" />
            {/* Headlight */}
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
            {/* Wheels */}
            <circle cx="16" cy="44" r="7.5" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="48" cy="44" r="7.5" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            {/* Car Body */}
            <path d="M8 38 L14 26 L30 20 L46 22 L54 32 L58 38 L58 42 L8 42 Z" fill="url(#carRed)" />
            {/* Windows */}
            <path d="M17 27 L28 22 L29 32 L14 33 Z" fill="#38bdf8" opacity="0.8" />
            <path d="M31 22 L44 24 L48 32 L31 32 Z" fill="#38bdf8" opacity="0.8" />
            {/* Headlight & Taillight */}
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
            {/* Wheels */}
            <circle cx="15" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="42" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="53" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            {/* Cabin */}
            <path d="M8 42 L8 28 L18 20 L24 20 L24 42 Z" fill="#3b82f6" />
            <path d="M12 28 L18 22 L22 22 L22 28 Z" fill="#bae6fd" />
            {/* Cargo Box */}
            <rect x="25" y="16" width="34" height="26" rx="2" fill="url(#truckBox)" stroke="#b45309" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'ambulance':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            {/* Wheels */}
            <circle cx="17" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="47" cy="46" r="7" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            {/* Body */}
            <path d="M9 42 L9 26 L22 20 L55 20 L55 42 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M14 26 L20 22 L24 22 L24 28 Z" fill="#38bdf8" opacity="0.8" />
            {/* Red Cross */}
            <rect x="36" y="27" width="10" height="4" fill="#ef4444" rx="1" />
            <rect x="39" y="24" width="4" height="10" fill="#ef4444" rx="1" />
            {/* Siren */}
            <ellipse cx="26" cy="18" rx="3" ry="2" fill="#ef4444" className="animate-pulse" />
          </svg>
        </div>
      );

    default:
      return <VehicleIcon type={type} className={className} />;
  }
};
