import React from 'react';
import { VehicleType } from '../types/traccar';

// Ultra-Realistic 3D Top-Down Vector Models for EasyTracker Pro (Custom Rendered SVGs)
export const getVehicleMarkerSvg = (type?: VehicleType, color: string = '#3b82f6'): string => {
  const c = color || '#3b82f6';
  const cId = c.replace(/[^a-zA-Z0-9]/g, '');

  switch (type) {
    case 'motorcycle':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="bike_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
            <stop offset="25%" stop-color="${c}" />
            <stop offset="85%" stop-color="${c}" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
          <linearGradient id="chrome_${cId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#94a3b8" />
            <stop offset="50%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <filter id="light_glow_${cId}">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Rear Tire with Treads -->
        <rect x="36" y="52" width="8" height="24" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <line x1="38" y1="58" x2="42" y2="58" stroke="#475569" stroke-width="1.5" />
        <line x1="38" y1="64" x2="42" y2="64" stroke="#475569" stroke-width="1.5" />
        <line x1="38" y1="70" x2="42" y2="70" stroke="#475569" stroke-width="1.5" />

        <!-- Dual Chrome Exhaust Pipes -->
        <path d="M45 42 L52 66" stroke="url(#chrome_${cId})" stroke-width="3.5" stroke-linecap="round" />
        <path d="M35 42 L28 66" stroke="url(#chrome_${cId})" stroke-width="3.5" stroke-linecap="round" />

        <!-- Rear Swingarm & Chain -->
        <rect x="34" y="44" width="12" height="12" rx="2" fill="#1e293b" />

        <!-- Pillion & Rider Leather Seat -->
        <path d="M33 30 Q40 26 47 30 L45 52 Q40 55 35 52 Z" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <line x1="34" y1="41" x2="46" y2="41" stroke="#1e293b" stroke-width="1.5" />

        <!-- Sculpted Metallic Fuel Tank -->
        <path d="M31 18 Q40 10 49 18 L47 34 Q40 38 33 34 Z" fill="url(#bike_paint_${cId})" stroke="#ffffff" stroke-width="1.5" />
        <!-- Tank Center Decal Strip -->
        <line x1="40" y1="14" x2="40" y2="34" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.8" />

        <!-- Handlebars & Chrome Side Mirrors -->
        <path d="M18 18 L62 18" stroke="url(#chrome_${cId})" stroke-width="4.5" stroke-linecap="round" />
        <!-- Rubber Grips -->
        <rect x="16" y="16" width="9" height="4" rx="2" fill="#020617" />
        <rect x="55" y="16" width="9" height="4" rx="2" fill="#020617" />
        <!-- Side Mirrors -->
        <circle cx="16" cy="18" r="3.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2" />
        <circle cx="64" cy="18" r="3.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2" />
        <!-- Instrument Cluster -->
        <circle cx="40" cy="18" r="4" fill="#020617" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="40" cy="18" r="1.5" fill="#38bdf8" />

        <!-- Front Fork & Front Tire -->
        <rect x="37" y="4" width="6" height="20" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- Aerodynamic Front Fairing / Windscreen -->
        <path d="M34 10 Q40 4 46 10 L44 18 Q40 20 36 18 Z" fill="#38bdf8" opacity="0.85" stroke="#ffffff" stroke-width="1" />

        <!-- Dual Xenon High-Beam Projector Headlights (Glowing) -->
        <circle cx="36" cy="6" r="3" fill="#fef08a" filter="url(#light_glow_${cId})" />
        <circle cx="44" cy="6" r="3" fill="#fef08a" filter="url(#light_glow_${cId})" />
        <circle cx="36" cy="6" r="1.2" fill="#ffffff" />
        <circle cx="44" cy="6" r="1.2" fill="#ffffff" />

        <!-- Rear Red LED Brake Light Strip -->
        <rect x="36" y="52" width="8" height="3" rx="1.5" fill="#ef4444" filter="url(#light_glow_${cId})" />
      </svg>`;

    case 'scooter':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="scoot_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7" />
            <stop offset="30%" stop-color="${c}" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
        </defs>
        <!-- Rear Wheel -->
        <rect x="36" y="56" width="8" height="18" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- Wide Rear Body Fairing -->
        <path d="M26 34 Q40 28 54 34 L56 58 Q40 64 24 58 Z" fill="url(#scoot_paint_${cId})" stroke="#ffffff" stroke-width="1.5" />
        <!-- Long Two-Tier Comfort Seat -->
        <rect x="32" y="34" width="16" height="22" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <!-- Floorboard Footrest -->
        <rect x="28" y="24" width="24" height="11" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <!-- Front Apron Leg Shield -->
        <path d="M30 14 L50 14 L46 26 L34 26 Z" fill="${c}" stroke="#ffffff" stroke-width="1.5" />
        <!-- Handlebars & Indicators -->
        <path d="M20 18 L60 18" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="18" cy="18" r="3" fill="#f59e0b" />
        <circle cx="62" cy="18" r="3" fill="#f59e0b" />
        <!-- Front Tire & Mudguard -->
        <rect x="37" y="5" width="6" height="15" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- Diamond LED Headlight -->
        <circle cx="40" cy="8" r="3.5" fill="#fef08a" />
        <circle cx="40" cy="8" r="1.5" fill="#ffffff" />
      </svg>`;

    case 'cng':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="cng_body_${cId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#16a34a" />
            <stop offset="100%" stop-color="#052e16" />
          </linearGradient>
        </defs>
        <!-- 3 Wheels -->
        <rect x="16" y="50" width="8" height="20" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="56" y="50" width="8" height="20" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="37" y="5" width="6" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- Main Cabin Body (Dhaka Green) -->
        <path d="M22 24 L58 24 L60 64 L20 64 Z" fill="url(#cng_body_${cId})" stroke="#ffffff" stroke-width="2" />
        <!-- Orange Safety Bonnet -->
        <path d="M24 23 L56 23 L46 8 L34 8 Z" fill="#f97316" stroke="#ea580c" stroke-width="1.5" />
        <!-- Canopy Soft Roof Top -->
        <rect x="25" y="27" width="30" height="28" rx="4" fill="#022c22" stroke="#34d399" stroke-width="1.5" />
        <!-- Passenger Bench -->
        <rect x="27" y="47" width="26" height="12" rx="2" fill="#0f172a" />
        <!-- Center Headlamp -->
        <circle cx="40" cy="8" r="3.5" fill="#fef08a" />
      </svg>`;

    case 'auto':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <rect x="16" y="50" width="8" height="20" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="56" y="50" width="8" height="20" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="37" y="5" width="6" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- Yellow Auto Body -->
        <path d="M22 24 L58 24 L60 64 L20 64 Z" fill="#eab308" stroke="#ffffff" stroke-width="2" />
        <path d="M24 23 L56 23 L45 8 L35 8 Z" fill="#16a34a" />
        <rect x="25" y="27" width="30" height="28" rx="4" fill="#713f12" stroke="#fbbf24" stroke-width="1.5" />
        <circle cx="40" cy="8" r="3.5" fill="#fef08a" />
      </svg>`;

    case 'ambulance':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <filter id="amb_flash_${cId}">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- 4 Wheels -->
        <rect x="14" y="14" width="7" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="59" y="14" width="7" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="14" y="50" width="7" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="59" y="50" width="7" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- High-Gloss White Van Body -->
        <rect x="20" y="6" width="40" height="68" rx="8" fill="#f8fafc" stroke="#ef4444" stroke-width="2.5" />
        <!-- Front Windshield -->
        <path d="M24 16 Q40 11 56 16 L53 26 Q40 27 27 26 Z" fill="#38bdf8" opacity="0.95" stroke="#ffffff" stroke-width="1" />
        <!-- Red Cross Emergency Badge -->
        <rect x="30" y="44" width="20" height="6" fill="#ef4444" rx="1.5" />
        <rect x="37" y="37" width="6" height="20" fill="#ef4444" rx="1.5" />
        <!-- Flashing Emergency Strobe Beacons (Blue & Red) -->
        <circle cx="30" cy="10" r="4" fill="#3b82f6" filter="url(#amb_flash_${cId})" />
        <circle cx="50" cy="10" r="4" fill="#ef4444" filter="url(#amb_flash_${cId})" />
        <circle cx="30" cy="10" r="1.5" fill="#ffffff" />
        <circle cx="50" cy="10" r="1.5" fill="#ffffff" />
      </svg>`;

    case 'pickup':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="suv_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
            <stop offset="30%" stop-color="${c}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>
        <!-- 4 Wide All-Terrain Tires -->
        <rect x="13" y="12" width="8" height="18" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="59" y="12" width="8" height="18" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="13" y="50" width="8" height="18" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="59" y="50" width="8" height="18" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <!-- 4x4 SUV / Pickup Chassis -->
        <rect x="19" y="7" width="42" height="66" rx="7" fill="url(#suv_paint_${cId})" stroke="#ffffff" stroke-width="2" />
        <!-- Front Hood Grooves & Windshield -->
        <path d="M24 18 Q40 13 56 18 L53 30 Q40 31 27 30 Z" fill="#38bdf8" opacity="0.95" stroke="#ffffff" stroke-width="1" />
        <!-- Cargo Bed with Textured Rails -->
        <rect x="24" y="37" width="32" height="30" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
        <line x1="31" y1="39" x2="31" y2="65" stroke="#475569" stroke-width="2" />
        <line x1="40" y1="39" x2="40" y2="65" stroke="#475569" stroke-width="2" />
        <line x1="49" y1="39" x2="49" y2="65" stroke="#475569" stroke-width="2" />
        <!-- Roof Spotlights -->
        <circle cx="27" cy="6" r="3" fill="#fef08a" />
        <circle cx="53" cy="6" r="3" fill="#fef08a" />
      </svg>`;

    case 'truck':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="truck_paint_${cId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${c}" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
        </defs>
        <!-- 6 Wheels -->
        <rect x="13" y="10" width="7" height="16" rx="2.5" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="60" y="10" width="7" height="16" rx="2.5" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="13" y="42" width="7" height="15" rx="2.5" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="60" y="42" width="7" height="15" rx="2.5" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="13" y="58" width="7" height="15" rx="2.5" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="60" y="58" width="7" height="15" rx="2.5" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <!-- Prime Mover Heavy Cab -->
        <rect x="19" y="6" width="42" height="22" rx="5" fill="url(#truck_paint_${cId})" stroke="#ffffff" stroke-width="2" />
        <path d="M23 11 L57 11 L54 19 L26 19 Z" fill="#38bdf8" opacity="0.9" />
        <!-- Cargo Container Bed -->
        <rect x="19" y="30" width="42" height="46" rx="3" fill="#d97706" stroke="#78350f" stroke-width="2" />
        <line x1="19" y1="38" x2="61" y2="38" stroke="#fef08a" stroke-width="2.5" />
        <line x1="19" y1="52" x2="61" y2="52" stroke="#fef08a" stroke-width="2.5" />
        <line x1="19" y1="66" x2="61" y2="66" stroke="#fef08a" stroke-width="2.5" />
        <circle cx="24" cy="5" r="3" fill="#fef08a" />
        <circle cx="56" cy="5" r="3" fill="#fef08a" />
      </svg>`;

    case 'bus':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="bus_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
            <stop offset="30%" stop-color="${c}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>
        <!-- 6 Wheels -->
        <rect x="14" y="14" width="6.5" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="59.5" y="14" width="6.5" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="14" y="52" width="6.5" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="59.5" y="52" width="6.5" height="16" rx="3" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <!-- Luxury Coach Body -->
        <rect x="19" y="4" width="42" height="72" rx="8" fill="url(#bus_paint_${cId})" stroke="#ffffff" stroke-width="2" />
        <path d="M23 8 L57 8 L55 16 L25 16 Z" fill="#38bdf8" opacity="0.95" />
        <!-- Twin Rooftop AC Units -->
        <rect x="28" y="24" width="24" height="14" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" />
        <rect x="28" y="44" width="24" height="14" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" />
        <!-- Side Glass Ribbons -->
        <rect x="21" y="18" width="2.5" height="50" fill="#38bdf8" opacity="0.8" />
        <rect x="56.5" y="18" width="2.5" height="50" fill="#38bdf8" opacity="0.8" />
        <circle cx="24" cy="5" r="3" fill="#fef08a" />
        <circle cx="56" cy="5" r="3" fill="#fef08a" />
      </svg>`;

    case 'bicycle':
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <!-- Spoke Wheels -->
        <rect x="38" y="54" width="4" height="22" rx="2" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="38" y="4" width="4" height="22" rx="2" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <!-- Alloy Frame Backbone -->
        <line x1="40" y1="16" x2="40" y2="64" stroke="${c}" stroke-width="5" stroke-linecap="round" />
        <!-- Handlebars -->
        <line x1="22" y1="18" x2="58" y2="18" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="21" cy="18" r="3" fill="#ffffff" />
        <circle cx="59" cy="18" r="3" fill="#ffffff" />
        <!-- Saddle -->
        <ellipse cx="40" cy="44" rx="6" ry="8" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
      </svg>`;

    case 'car':
    default:
      return `<svg viewBox="0 0 80 80" width="100%" height="100%" class="drop-shadow-2xl">
        <defs>
          <linearGradient id="car_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75" />
            <stop offset="25%" stop-color="${c}" />
            <stop offset="85%" stop-color="${c}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
          <filter id="headlight_flare_${cId}">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- 4 Wide Alloy Tires -->
        <rect x="14" y="12" width="7" height="17" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="59" y="12" width="7" height="17" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="14" y="49" width="7" height="17" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.5" />
        <rect x="59" y="49" width="7" height="17" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.5" />

        <!-- Sleek Aerodynamic Metallic Body Chassis -->
        <path d="M22 14 Q40 6 58 14 L60 64 Q40 72 20 64 Z" fill="url(#car_paint_${cId})" stroke="#ffffff" stroke-width="2" />

        <!-- Front Windshield with Sky Glare -->
        <path d="M26 20 Q40 14 54 20 L51 32 Q40 34 29 32 Z" fill="#38bdf8" opacity="0.95" stroke="#ffffff" stroke-width="1.2" />

        <!-- Panoramic Glass Sunroof / Roof -->
        <rect x="29" y="36" width="22" height="14" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" opacity="0.9" />

        <!-- Rear Tinted Windshield -->
        <path d="M29 52 L51 52 L52 59 L28 59 Z" fill="#38bdf8" opacity="0.85" />

        <!-- Side Mirrors in Body Color -->
        <circle cx="20" cy="24" r="2.5" fill="${c}" stroke="#ffffff" stroke-width="1" />
        <circle cx="60" cy="24" r="2.5" fill="${c}" stroke="#ffffff" stroke-width="1" />

        <!-- Twin Xenon Headlights (High Beam Glow) -->
        <circle cx="26" cy="10" r="3.5" fill="#fef08a" filter="url(#headlight_flare_${cId})" />
        <circle cx="54" cy="10" r="3.5" fill="#fef08a" filter="url(#headlight_flare_${cId})" />
        <circle cx="26" cy="10" r="1.5" fill="#ffffff" />
        <circle cx="54" cy="10" r="1.5" fill="#ffffff" />

        <!-- Dual Red LED Tail Light Bars -->
        <rect x="24" y="65" width="8" height="3" rx="1.5" fill="#ef4444" filter="url(#headlight_flare_${cId})" />
        <rect x="48" y="65" width="8" height="3" rx="1.5" fill="#ef4444" filter="url(#headlight_flare_${cId})" />
      </svg>`;
  }
};

// React Component for Header, Settings, and Dashboard Grid
export const VehicleIcon: React.FC<{ type?: VehicleType; className?: string }> = ({ 
  type = 'car', 
  className = "w-5 h-5" 
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
    case 'auto':
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
