import React from 'react';
import { VehicleType } from '../types/traccar';

// Ultra-High-Definition, Top-Down 3D Vector Models for Leaflet Live Map Markers & Settings (MyGPS / Tracksolid Pro Inspired)
export const getVehicleMarkerSvg = (type?: VehicleType, color: string = '#3b82f6'): string => {
  switch (type) {
    case 'motorcycle':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="m_tank_${color.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
            <stop offset="20%" stop-color="${color}" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
          <filter id="glow_m">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Shadow & Treads -->
        <rect x="27" y="42" width="6" height="15" rx="3" fill="#020617" stroke="#334155" stroke-width="1.5" />
        <rect x="27.5" y="3" width="5" height="14" rx="2.5" fill="#020617" stroke="#334155" stroke-width="1.5" />
        <!-- Dual Chrome Exhaust Mufflers -->
        <path d="M33 34 L38 48" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" />
        <path d="M27 34 L22 48" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" />
        <!-- Frame & Leather Saddle -->
        <path d="M25 24 Q30 20 35 24 L34 40 Q30 42 26 40 Z" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
        <!-- Aerodynamic Fuel Tank (Vibrant Glossy) -->
        <path d="M23 15 Q30 8 37 15 L35 26 Q30 29 25 26 Z" fill="url(#m_tank_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.2" />
        <!-- Handlebars & Chrome Side Mirrors -->
        <path d="M15 15 L45 15" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="14" cy="15" r="2.5" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8" />
        <circle cx="46" cy="15" r="2.5" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8" />
        <circle cx="30" cy="15" r="3" fill="#020617" stroke="#38bdf8" stroke-width="1" />
        <!-- Dual Xenon Projector Headlights with Light Flare -->
        <path d="M26 3 Q30 -1 34 3 Z" fill="#fef08a" filter="url(#glow_m)" />
        <circle cx="28" cy="4" r="1.5" fill="#ffffff" />
        <circle cx="32" cy="4" r="1.5" fill="#ffffff" />
        <!-- Rear Brake Light -->
        <rect x="27" y="41" width="6" height="2" rx="1" fill="#ef4444" filter="url(#glow_m)" />
      </svg>`;

    case 'scooter':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="sc_body_${color.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
            <stop offset="30%" stop-color="${color}" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
        </defs>
        <!-- Wheels -->
        <rect x="27" y="44" width="6" height="12" rx="3" fill="#020617" stroke="#475569" stroke-width="1" />
        <rect x="27.5" y="4" width="5" height="11" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1" />
        <!-- Wide Rear Body Shell & Tail Fairing -->
        <path d="M20 26 Q30 22 40 26 L41 44 Q30 48 19 44 Z" fill="url(#sc_body_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.2" />
        <!-- Long Comfort Seat -->
        <rect x="24.5" y="27" width="11" height="15" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1" />
        <!-- Wide Floorboard Footrest -->
        <rect x="21" y="20" width="18" height="8" rx="2" fill="#1e293b" />
        <!-- Front Apron & Shield -->
        <path d="M23 11 L37 11 L35 22 L25 22 Z" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <!-- Curved Handlebar with Turn Indicators -->
        <path d="M17 14 L43 14" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
        <circle cx="16" cy="14" r="2" fill="#f59e0b" />
        <circle cx="44" cy="14" r="2" fill="#f59e0b" />
        <!-- Diamond LED Headlight -->
        <circle cx="30" cy="5" r="3" fill="#fef08a" />
      </svg>`;

    case 'cng':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="cng_body_${color.replace('#','')}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#16a34a" />
            <stop offset="100%" stop-color="#064e3b" />
          </linearGradient>
        </defs>
        <!-- 3-Wheels Delta Stance -->
        <rect x="13" y="40" width="5.5" height="14" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="41.5" y="40" width="5.5" height="14" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="27.5" y="4" width="5" height="11" rx="2.5" fill="#020617" stroke="#334155" stroke-width="1" />
        <!-- Body Shell (Classic Auto Body) -->
        <path d="M17 19 L43 19 L44 48 L16 48 Z" fill="url(#cng_body_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.2" />
        <!-- Orange/Black Passenger Safety Grille Canopy -->
        <path d="M18 18 L42 18 L34 7 L26 7 Z" fill="#f97316" stroke="#ea580c" stroke-width="1" />
        <!-- Canvas Soft Top Roof -->
        <rect x="19" y="21" width="22" height="20" rx="3" fill="#022c22" stroke="#10b981" stroke-width="1.2" />
        <!-- Passenger Bench -->
        <rect x="21" y="36" width="18" height="8" rx="2" fill="#0f172a" />
        <circle cx="30" cy="6" r="3" fill="#fef08a" />
      </svg>`;

    case 'auto':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <rect x="13" y="40" width="5.5" height="14" rx="2" fill="#020617" />
        <rect x="41.5" y="40" width="5.5" height="14" rx="2" fill="#020617" />
        <rect x="27.5" y="4" width="5" height="11" rx="2.5" fill="#020617" />
        <!-- Yellow Auto Chassis -->
        <path d="M17 19 L43 19 L44 48 L16 48 Z" fill="#eab308" stroke="#ffffff" stroke-width="1.2" />
        <!-- Hood & Canopy -->
        <path d="M18 18 L42 18 L33 7 L27 7 Z" fill="#16a34a" />
        <rect x="19" y="21" width="22" height="21" rx="3" fill="#713f12" stroke="#fbbf24" stroke-width="1.2" />
        <rect x="21" y="24" width="18" height="6" rx="1.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="30" cy="6" r="3" fill="#fef08a" />
      </svg>`;

    case 'ambulance':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <filter id="beacon_glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- 4 Wheels -->
        <rect x="12" y="10" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="43" y="10" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="12" y="38" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="43" y="38" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <!-- Van Body (Pristine White) -->
        <rect x="16" y="5" width="28" height="50" rx="6" fill="#f8fafc" stroke="#ef4444" stroke-width="2" />
        <!-- Front Windshield -->
        <path d="M19 12 Q30 9 41 12 L39 19 Q30 20 21 19 Z" fill="#38bdf8" opacity="0.95" />
        <!-- Side Red Paramedic Stripes -->
        <rect x="16" y="23" width="2.5" height="28" fill="#ef4444" />
        <rect x="41.5" y="23" width="2.5" height="28" fill="#ef4444" />
        <!-- Glowing Red Medical Cross on Roof -->
        <rect x="23" y="33" width="14" height="4" fill="#ef4444" rx="1" />
        <rect x="28" y="28" width="4" height="14" fill="#ef4444" rx="1" />
        <!-- Emergency Flashing Lightbars (Blue & Red) -->
        <circle cx="23" cy="8" r="3" fill="#3b82f6" filter="url(#beacon_glow)" />
        <circle cx="37" cy="8" r="3" fill="#ef4444" filter="url(#beacon_glow)" />
      </svg>`;

    case 'pickup':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="suv_body_${color.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
            <stop offset="30%" stop-color="${color}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>
        <!-- Chunky All-Terrain Wheels -->
        <rect x="11" y="9" width="6" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.5" />
        <rect x="43" y="9" width="6" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.5" />
        <rect x="11" y="38" width="6" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.5" />
        <rect x="43" y="38" width="6" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.5" />
        <!-- Wide 4x4 Offroad Body -->
        <rect x="15" y="6" width="30" height="48" rx="5" fill="url(#suv_body_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.5" />
        <!-- Front Hood & Windshield -->
        <path d="M19 13 Q30 10 41 13 L39 22 Q30 23 21 22 Z" fill="#38bdf8" opacity="0.9" />
        <!-- Roof Crossbars / Cargo Bed -->
        <rect x="19" y="27" width="22" height="23" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <line x1="24" y1="29" x2="24" y2="48" stroke="#475569" stroke-width="1.5" />
        <line x1="30" y1="29" x2="30" y2="48" stroke="#475569" stroke-width="1.5" />
        <line x1="36" y1="29" x2="36" y2="48" stroke="#475569" stroke-width="1.5" />
        <!-- High-Beam Spotlights on Roof -->
        <circle cx="21" cy="5" r="2.2" fill="#fef08a" />
        <circle cx="39" cy="5" r="2.2" fill="#fef08a" />
      </svg>`;

    case 'truck':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="truck_cab_${color.replace('#','')}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
        </defs>
        <!-- 6 Wheels -->
        <rect x="11" y="8" width="5.5" height="12" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="43.5" y="8" width="5.5" height="12" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="11" y="32" width="5.5" height="11" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="43.5" y="32" width="5.5" height="11" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="11" y="44" width="5.5" height="11" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="43.5" y="44" width="5.5" height="11" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <!-- Heavy Cab Block -->
        <rect x="15" y="5" width="30" height="16" rx="4" fill="url(#truck_cab_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.5" />
        <path d="M18 9 L42 9 L40 15 L20 15 Z" fill="#38bdf8" opacity="0.9" />
        <!-- Big Cargo Container / Lorry Bed -->
        <rect x="15" y="22" width="30" height="34" rx="2" fill="#d97706" stroke="#78350f" stroke-width="1.5" />
        <!-- Tie-Down Straps & Warning Stripes -->
        <line x1="15" y1="28" x2="45" y2="28" stroke="#fef08a" stroke-width="2" />
        <line x1="15" y1="39" x2="45" y2="39" stroke="#fef08a" stroke-width="2" />
        <line x1="15" y1="50" x2="45" y2="50" stroke="#fef08a" stroke-width="2" />
        <circle cx="18" cy="4" r="2.5" fill="#fef08a" />
        <circle cx="42" cy="4" r="2.5" fill="#fef08a" />
      </svg>`;

    case 'bus':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="bus_body_${color.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
            <stop offset="30%" stop-color="${color}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>
        <!-- 6 Wheels -->
        <rect x="11" y="10" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="44" y="10" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="11" y="38" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="44" y="38" width="5" height="12" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <!-- Long Luxury Coach Chassis -->
        <rect x="15" y="3" width="30" height="54" rx="6" fill="url(#bus_body_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.5" />
        <!-- Panoramic Windshield -->
        <path d="M18 6 L42 6 L40 12 L20 12 Z" fill="#38bdf8" opacity="0.95" />
        <!-- Dual Rooftop AC Pods -->
        <rect x="22" y="18" width="16" height="10" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
        <rect x="22" y="33" width="16" height="10" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
        <!-- Side Glass Ribbon -->
        <rect x="16" y="13" width="2" height="38" fill="#38bdf8" opacity="0.7" />
        <rect x="42" y="13" width="2" height="38" fill="#38bdf8" opacity="0.7" />
        <circle cx="18" cy="4" r="2.5" fill="#fef08a" />
        <circle cx="42" cy="4" r="2.5" fill="#fef08a" />
      </svg>`;

    case 'bicycle':
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <!-- Thin Front & Rear Road Wheels -->
        <rect x="28.5" y="41" width="3" height="16" rx="1.5" fill="#020617" stroke="#475569" stroke-width="1" />
        <rect x="28.5" y="3" width="3" height="16" rx="1.5" fill="#020617" stroke="#475569" stroke-width="1" />
        <!-- Alloy Frame Backbone -->
        <line x1="30" y1="12" x2="30" y2="48" stroke="${color}" stroke-width="4" stroke-linecap="round" />
        <!-- Handlebars -->
        <line x1="16" y1="14" x2="44" y2="14" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="15" cy="14" r="2.5" fill="#ffffff" />
        <circle cx="45" cy="14" r="2.5" fill="#ffffff" />
        <!-- Ergonomic Saddle -->
        <ellipse cx="30" cy="33" rx="4.5" ry="6" fill="#0f172a" stroke="#ffffff" stroke-width="1" />
      </svg>`;

    case 'car':
    default:
      return `<svg viewBox="0 0 60 60" width="48" height="48" class="drop-shadow-xl">
        <defs>
          <linearGradient id="car_body_${color.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
            <stop offset="25%" stop-color="${color}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
          <filter id="car_glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- 4 Wide Alloy Tires -->
        <rect x="11" y="9" width="5.5" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="43.5" y="9" width="5.5" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="11" y="37" width="5.5" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <rect x="43.5" y="37" width="5.5" height="13" rx="2.5" fill="#020617" stroke="#475569" stroke-width="1.2" />
        <!-- Sleek Metallic Sedan Body Silhouette -->
        <path d="M17 11 Q30 5 43 11 L44 48 Q30 54 16 48 Z" fill="url(#car_body_${color.replace('#','')})" stroke="#ffffff" stroke-width="1.5" />
        <!-- Aerodynamic Front Windshield with Blue Glare -->
        <path d="M20 15 Q30 11 40 15 L38 24 Q30 26 22 24 Z" fill="#38bdf8" opacity="0.95" />
        <!-- Panoramic Glass Sunroof / Cabin -->
        <rect x="22" y="27" width="16" height="10" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8" opacity="0.9" />
        <!-- Rear Tinted Windshield -->
        <path d="M22 39 L38 39 L39 44 L21 44 Z" fill="#38bdf8" opacity="0.85" />
        <!-- Side View Mirrors -->
        <circle cx="16" cy="18" r="2" fill="${color}" stroke="#ffffff" stroke-width="0.8" />
        <circle cx="44" cy="18" r="2" fill="${color}" stroke="#ffffff" stroke-width="0.8" />
        <!-- Twin High-Intensity Xenon Headlights -->
        <circle cx="20" cy="8" r="2.5" fill="#fef08a" filter="url(#car_glow)" />
        <circle cx="40" cy="8" r="2.5" fill="#fef08a" filter="url(#car_glow)" />
        <!-- Red LED Tail Light Clusters -->
        <rect x="18" y="49" width="6" height="2.5" rx="1" fill="#ef4444" filter="url(#car_glow)" />
        <rect x="36" y="49" width="6" height="2.5" rx="1" fill="#ef4444" filter="url(#car_glow)" />
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
