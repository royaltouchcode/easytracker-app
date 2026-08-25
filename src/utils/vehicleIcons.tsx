import React from 'react';
import { VehicleType } from '../types/traccar';

// Ultra-Realistic 3D Top-Down Vector Models for EasyTracker Pro
export const getVehicleMarkerSvg = (type?: VehicleType, color: string = '#ef4444'): string => {
  const c = color || '#ef4444';
  const cId = c.replace(/[^a-zA-Z0-9]/g, '');

  switch (type) {
    case 'motorcycle':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="bike_tank_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
            <stop offset="20%" stop-color="${c}" />
            <stop offset="80%" stop-color="${c}" />
            <stop offset="100%" stop-color="#050811" />
          </linearGradient>
          <linearGradient id="chrome_pipe_${cId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b" />
            <stop offset="50%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
          <radialGradient id="headlight_beam_${cId}" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#fef08a" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </radialGradient>
          <filter id="glow_blur_${cId}">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Forward Xenon Headlight Projection Cone -->
        <polygon points="50,14 15,-18 85,-18" fill="url(#headlight_beam_${cId})" opacity="0.65" />

        <!-- Rear Wide Tire with Tread Grooves -->
        <rect x="44" y="66" width="12" height="30" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <line x1="46" y1="74" x2="54" y2="74" stroke="#475569" stroke-width="2" />
        <line x1="46" y1="82" x2="54" y2="82" stroke="#475569" stroke-width="2" />
        <line x1="46" y1="90" x2="54" y2="90" stroke="#475569" stroke-width="2" />

        <!-- Dual Chrome Sports Exhaust Cannisters -->
        <path d="M57 52 L66 84" stroke="url(#chrome_pipe_${cId})" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="66" cy="84" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1" />
        <path d="M43 52 L34 84" stroke="url(#chrome_pipe_${cId})" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="34" cy="84" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1" />

        <!-- Rear Swingarm & Mono-Shock Suspension -->
        <rect x="42" y="56" width="16" height="15" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1" />
        <circle cx="50" cy="62" r="3" fill="#eab308" stroke="#713f12" stroke-width="1" />

        <!-- Tail Section & Dual Red LED Taillights -->
        <path d="M40 50 Q50 46 60 50 L58 66 Q50 70 42 66 Z" fill="url(#bike_tank_${cId})" stroke="#ffffff" stroke-width="1.2" />
        <rect x="44" y="65" width="12" height="3" rx="1.5" fill="#ef4444" filter="url(#glow_blur_${cId})" />

        <!-- Ergonomic Rider & Pillion Seat with Contrast Stitching -->
        <path d="M41 36 Q50 32 59 36 L57 54 Q50 58 43 54 Z" fill="#020617" stroke="#334155" stroke-width="1.5" />
        <line x1="42" y1="45" x2="58" y2="45" stroke="#475569" stroke-width="1.2" stroke-dasharray="2,2" />

        <!-- Sculpted Aerodynamic Metallic Fuel Tank -->
        <path d="M37 20 Q50 10 63 20 L60 40 Q50 45 40 40 Z" fill="url(#bike_tank_${cId})" stroke="#ffffff" stroke-width="1.8" />
        <!-- Fuel Filler Cap & Gloss Highlight Ribbon -->
        <ellipse cx="50" cy="22" rx="4" ry="3" fill="#94a3b8" stroke="#ffffff" stroke-width="1" />
        <circle cx="50" cy="22" r="1.5" fill="#020617" />
        <path d="M42 22 Q50 16 58 22" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.8" />

        <!-- Clip-on Handlebars with Bar-End Mirrors -->
        <path d="M22 22 L78 22" stroke="url(#chrome_pipe_${cId})" stroke-width="5" stroke-linecap="round" />
        <!-- Rubber Grips & Brake Levers -->
        <rect x="20" y="19" width="12" height="6" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <rect x="68" y="19" width="12" height="6" rx="2" fill="#020617" stroke="#334155" stroke-width="1" />
        <circle cx="18" cy="22" r="4.5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="82" cy="22" r="4.5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />

        <!-- Digital Instrument Cockpit TFT Screen -->
        <rect x="44" y="19" width="12" height="7" rx="2" fill="#020617" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="50" cy="22.5" r="1.5" fill="#38bdf8" />

        <!-- Front Fork & Front Tire with Disc Calipers -->
        <rect x="45" y="4" width="10" height="24" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <!-- Front Aerodynamic Windscreen / Fairing -->
        <path d="M41 12 Q50 4 59 12 L56 22 Q50 24 44 22 Z" fill="#0284c7" opacity="0.9" stroke="#ffffff" stroke-width="1.5" />

        <!-- Twin Xenon Projector Headlights (Glowing) -->
        <circle cx="45" cy="7" r="3.5" fill="#fef08a" filter="url(#glow_blur_${cId})" />
        <circle cx="55" cy="7" r="3.5" fill="#fef08a" filter="url(#glow_blur_${cId})" />
        <circle cx="45" cy="7" r="1.5" fill="#ffffff" />
        <circle cx="55" cy="7" r="1.5" fill="#ffffff" />
      </svg>`;

    case 'scooter':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="scoot_body_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
            <stop offset="25%" stop-color="${c}" />
            <stop offset="85%" stop-color="${c}" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
          <radialGradient id="scoot_beam_${cId}" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#fef08a" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Light Cone -->
        <polygon points="50,14 20,-16 80,-16" fill="url(#scoot_beam_${cId})" opacity="0.6" />

        <!-- Rear Wheel -->
        <rect x="45" y="70" width="10" height="24" rx="5" fill="#090d16" stroke="#334155" stroke-width="1.5" />

        <!-- Wide Curvaceous Rear Side Panels (Metallic Body) -->
        <path d="M30 40 Q50 34 70 40 L72 74 Q50 82 28 74 Z" fill="url(#scoot_body_${cId})" stroke="#ffffff" stroke-width="1.8" />

        <!-- Wide 2-Tier Comfort Leather Seat -->
        <rect x="38" y="40" width="24" height="30" rx="8" fill="#020617" stroke="#334155" stroke-width="1.5" />
        <line x1="40" y1="52" x2="60" y2="52" stroke="#1e293b" stroke-width="1.8" />

        <!-- Wide Ribbed Floorboard Footrest -->
        <rect x="34" y="27" width="32" height="15" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <line x1="40" y1="29" x2="40" y2="40" stroke="#0f172a" stroke-width="1.5" />
        <line x1="50" y1="29" x2="50" y2="40" stroke="#0f172a" stroke-width="1.5" />
        <line x1="60" y1="29" x2="60" y2="40" stroke="#0f172a" stroke-width="1.5" />

        <!-- Front Apron & Leg Shield -->
        <path d="M35 15 L65 15 L60 30 L40 30 Z" fill="${c}" stroke="#ffffff" stroke-width="1.8" />

        <!-- Handlebars & Mirrors -->
        <path d="M24 18 L76 18" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
        <circle cx="20" cy="18" r="4" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2" />
        <circle cx="80" cy="18" r="4" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2" />

        <!-- Amber Turn Indicators -->
        <circle cx="34" cy="17" r="3" fill="#f59e0b" />
        <circle cx="66" cy="17" r="3" fill="#f59e0b" />

        <!-- Front Mudguard & Wheel -->
        <rect x="46" y="5" width="8" height="20" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />

        <!-- Diamond LED Headlamp -->
        <polygon points="50,6 56,12 50,18 44,12" fill="#fef08a" stroke="#ffffff" stroke-width="1" />
        <circle cx="50" cy="12" r="2" fill="#ffffff" />
      </svg>`;

    case 'cng':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="cng_canopy_${cId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#15803d" />
            <stop offset="100%" stop-color="#052e16" />
          </linearGradient>
        </defs>
        <!-- 2 Rear Wheels -->
        <rect x="20" y="60" width="10" height="26" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="70" y="60" width="10" height="26" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />

        <!-- Front Steering Wheel & Fork -->
        <rect x="46" y="6" width="8" height="22" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <circle cx="50" cy="9" r="4" fill="#fef08a" stroke="#ffffff" stroke-width="1.2" />

        <!-- Main Steel Cabin Chassis -->
        <path d="M26 28 L74 28 L77 82 L23 82 Z" fill="url(#cng_canopy_${cId})" stroke="#ffffff" stroke-width="2.5" />

        <!-- Front Orange Hood Bonnet -->
        <path d="M30 28 L70 28 L58 10 L42 10 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.8" />

        <!-- Canvas Soft Top Roof with Seams -->
        <rect x="30" y="32" width="40" height="38" rx="6" fill="#022c22" stroke="#4ade80" stroke-width="1.8" />
        <line x1="30" y1="44" x2="70" y2="44" stroke="#16a34a" stroke-width="1.5" />
        <line x1="30" y1="58" x2="70" y2="58" stroke="#16a34a" stroke-width="1.5" />

        <!-- Passenger Rear Seat -->
        <rect x="32" y="62" width="36" height="16" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1" />

        <!-- Safety Side Grilles -->
        <line x1="26" y1="40" x2="26" y2="70" stroke="#cbd5e1" stroke-width="2" />
        <line x1="74" y1="40" x2="74" y2="70" stroke="#cbd5e1" stroke-width="2" />
      </svg>`;

    case 'auto':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <rect x="20" y="60" width="10" height="26" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="70" y="60" width="10" height="26" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <rect x="46" y="6" width="8" height="22" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
        <circle cx="50" cy="9" r="4" fill="#fef08a" stroke="#ffffff" stroke-width="1.2" />

        <!-- Yellow Body -->
        <path d="M26 28 L74 28 L77 82 L23 82 Z" fill="#eab308" stroke="#ffffff" stroke-width="2.5" />
        <path d="M30 28 L70 28 L58 10 L42 10 Z" fill="#16a34a" />
        <rect x="30" y="32" width="40" height="38" rx="6" fill="#713f12" stroke="#facc15" stroke-width="1.8" />
        <rect x="32" y="62" width="36" height="16" rx="3" fill="#0f172a" />
      </svg>`;

    case 'ambulance':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <filter id="amb_flash_beam_${cId}">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- 4 Wheels -->
        <rect x="18" y="16" width="9" height="22" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <rect x="73" y="16" width="9" height="22" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <rect x="18" y="62" width="9" height="22" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <rect x="73" y="62" width="9" height="22" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />

        <!-- High-Gloss White Van Body -->
        <rect x="25" y="8" width="50" height="84" rx="10" fill="#f8fafc" stroke="#ef4444" stroke-width="3" />

        <!-- Front Cockpit Windshield -->
        <path d="M30 20 Q50 14 70 20 L66 34 Q50 36 34 34 Z" fill="#38bdf8" opacity="0.95" stroke="#ffffff" stroke-width="1.5" />

        <!-- Flashing Strobe Emergency Lightbar (Blue & Red) -->
        <rect x="34" y="12" width="14" height="6" rx="2" fill="#3b82f6" filter="url(#amb_flash_beam_${cId})" />
        <rect x="52" y="12" width="14" height="6" rx="2" fill="#ef4444" filter="url(#amb_flash_beam_${cId})" />
        <circle cx="41" cy="15" r="2" fill="#ffffff" />
        <circle cx="59" cy="15" r="2" fill="#ffffff" />

        <!-- Reflective Medical Red Cross -->
        <rect x="38" y="52" width="24" height="8" fill="#ef4444" rx="2" />
        <rect x="46" y="44" width="8" height="24" fill="#ef4444" rx="2" />

        <!-- Side Emergency Warning Chevrons -->
        <path d="M26 40 L30 46 L26 52" stroke="#ef4444" stroke-width="2.5" fill="none" />
        <path d="M74 40 L70 46 L74 52" stroke="#ef4444" stroke-width="2.5" fill="none" />

        <!-- Rear Double Doors -->
        <line x1="50" y1="78" x2="50" y2="92" stroke="#94a3b8" stroke-width="2" />
      </svg>`;

    case 'pickup':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="suv_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
            <stop offset="30%" stop-color="${c}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>
        <!-- 4 Wide All-Terrain Knobby Tires -->
        <rect x="16" y="14" width="11" height="24" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />
        <rect x="73" y="14" width="11" height="24" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />
        <rect x="16" y="62" width="11" height="24" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />
        <rect x="73" y="62" width="11" height="24" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />

        <!-- 4x4 Rugged Chassis -->
        <rect x="24" y="8" width="52" height="84" rx="9" fill="url(#suv_paint_${cId})" stroke="#ffffff" stroke-width="2.5" />

        <!-- Front Bullbar & Spotlights -->
        <path d="M28 8 L72 8" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" />
        <circle cx="34" cy="7" r="3" fill="#fef08a" />
        <circle cx="66" cy="7" r="3" fill="#fef08a" />

        <!-- Front Windshield -->
        <path d="M30 22 Q50 16 70 22 L66 38 Q50 40 34 38 Z" fill="#38bdf8" opacity="0.95" stroke="#ffffff" stroke-width="1.5" />

        <!-- Double Cab Roof & Rails -->
        <rect x="34" y="38" width="32" height="12" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
        <line x1="30" y1="26" x2="30" y2="48" stroke="#cbd5e1" stroke-width="2" />
        <line x1="70" y1="26" x2="70" y2="48" stroke="#cbd5e1" stroke-width="2" />

        <!-- Deep Cargo Bed with Liner -->
        <rect x="30" y="52" width="40" height="36" rx="4" fill="#020617" stroke="#334155" stroke-width="2" />
        <line x1="38" y1="54" x2="38" y2="86" stroke="#334155" stroke-width="2" />
        <line x1="50" y1="54" x2="50" y2="86" stroke="#334155" stroke-width="2" />
        <line x1="62" y1="54" x2="62" y2="86" stroke="#334155" stroke-width="2" />
      </svg>`;

    case 'truck':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="truck_paint_${cId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${c}" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
        </defs>
        <!-- 6 Wheels -->
        <rect x="16" y="12" width="9" height="22" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="75" y="12" width="9" height="22" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="16" y="52" width="9" height="20" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="75" y="52" width="9" height="20" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="16" y="74" width="9" height="20" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="75" y="74" width="9" height="20" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />

        <!-- Heavy Cab Unit -->
        <rect x="23" y="6" width="54" height="26" rx="6" fill="url(#truck_paint_${cId})" stroke="#ffffff" stroke-width="2.5" />
        <path d="M28 12 L72 12 L68 22 L32 22 Z" fill="#38bdf8" opacity="0.95" />
        <circle cx="30" cy="7" r="3" fill="#fef08a" />
        <circle cx="70" cy="7" r="3" fill="#fef08a" />

        <!-- Vertical Exhaust Stacks -->
        <circle cx="21" cy="30" r="3" fill="#94a3b8" stroke="#475569" stroke-width="1" />
        <circle cx="79" cy="30" r="3" fill="#94a3b8" stroke="#475569" stroke-width="1" />

        <!-- Large Cargo Container Body -->
        <rect x="23" y="34" width="54" height="60" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2.5" />
        <!-- Reflective Hazard Stripes -->
        <line x1="23" y1="44" x2="77" y2="44" stroke="#fef08a" stroke-width="3" />
        <line x1="23" y1="62" x2="77" y2="62" stroke="#fef08a" stroke-width="3" />
        <line x1="23" y1="80" x2="77" y2="80" stroke="#fef08a" stroke-width="3" />
      </svg>`;

    case 'bus':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="bus_paint_${cId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
            <stop offset="30%" stop-color="${c}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>
        <!-- 6 Wheels -->
        <rect x="17" y="16" width="8" height="20" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <rect x="75" y="16" width="8" height="20" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <rect x="17" y="66" width="8" height="20" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />
        <rect x="75" y="66" width="8" height="20" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.8" />

        <!-- Long Luxury Coach Chassis -->
        <rect x="23" y="4" width="54" height="92" rx="10" fill="url(#bus_paint_${cId})" stroke="#ffffff" stroke-width="2.5" />

        <!-- Front Panoramic Windshield -->
        <path d="M28 8 L72 8 L69 18 L31 18 Z" fill="#38bdf8" opacity="0.95" />
        <circle cx="30" cy="6" r="3" fill="#fef08a" />
        <circle cx="70" cy="6" r="3" fill="#fef08a" />

        <!-- Twin Rooftop AC Pods -->
        <rect x="34" y="28" width="32" height="18" rx="5" fill="#cbd5e1" stroke="#475569" stroke-width="1.8" />
        <rect x="34" y="56" width="32" height="18" rx="5" fill="#cbd5e1" stroke="#475569" stroke-width="1.8" />

        <!-- Side Panoramic Glass Ribbons -->
        <rect x="25" y="20" width="3" height="66" fill="#38bdf8" opacity="0.85" rx="1" />
        <rect x="72" y="20" width="3" height="66" fill="#38bdf8" opacity="0.85" rx="1" />
      </svg>`;

    case 'bicycle':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <!-- Spoke Wheels -->
        <rect x="47" y="68" width="6" height="28" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <rect x="47" y="4" width="6" height="28" rx="3" fill="#090d16" stroke="#475569" stroke-width="1.8" />
        <!-- Backbone Tube -->
        <line x1="50" y1="20" x2="50" y2="80" stroke="${c}" stroke-width="6" stroke-linecap="round" />
        <!-- Drop Handlebars -->
        <line x1="28" y1="22" x2="72" y2="22" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
        <circle cx="27" cy="22" r="4" fill="#ffffff" />
        <circle cx="73" cy="22" r="4" fill="#ffffff" />
        <!-- Leather Saddle -->
        <ellipse cx="50" cy="55" rx="8" ry="11" fill="#0f172a" stroke="#ffffff" stroke-width="2" />
      </svg>`;

    case 'car':
    default:
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" class="drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="car_body_gloss_${cId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
            <stop offset="25%" stop-color="${c}" />
            <stop offset="85%" stop-color="${c}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
          <radialGradient id="car_beam_${cId}" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.85" />
            <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </radialGradient>
          <filter id="car_glow_${cId}">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Forward Headlight Cones -->
        <polygon points="50,14 10,-20 90,-20" fill="url(#car_beam_${cId})" opacity="0.6" />

        <!-- 4 Wide Alloy Tires -->
        <rect x="16" y="14" width="9" height="22" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />
        <rect x="75" y="14" width="9" height="22" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />
        <rect x="16" y="62" width="9" height="22" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />
        <rect x="75" y="62" width="9" height="22" rx="4" fill="#090d16" stroke="#475569" stroke-width="2" />

        <!-- Sleek Metallic Sedan Body Chassis -->
        <path d="M26 16 Q50 6 74 16 L77 80 Q50 90 23 80 Z" fill="url(#car_body_gloss_${cId})" stroke="#ffffff" stroke-width="2.5" />

        <!-- Front Curved Windshield with Glare -->
        <path d="M31 24 Q50 16 69 24 L65 38 Q50 41 35 38 Z" fill="#38bdf8" opacity="0.95" stroke="#ffffff" stroke-width="1.5" />

        <!-- Panoramic Glass Sunroof -->
        <rect x="36" y="44" width="28" height="18" rx="5" fill="#020617" stroke="#38bdf8" stroke-width="1.2" opacity="0.9" />

        <!-- Rear Window -->
        <path d="M35 66 L65 66 L67 75 L33 75 Z" fill="#38bdf8" opacity="0.9" />

        <!-- Color-Matched Side Mirrors with Indicators -->
        <circle cx="24" cy="28" r="3.5" fill="${c}" stroke="#ffffff" stroke-width="1.2" />
        <circle cx="76" cy="28" r="3.5" fill="${c}" stroke="#ffffff" stroke-width="1.2" />

        <!-- Twin High-Intensity Xenon Headlights (Glowing) -->
        <circle cx="31" cy="11" r="4.5" fill="#fef08a" filter="url(#car_glow_${cId})" />
        <circle cx="69" cy="11" r="4.5" fill="#fef08a" filter="url(#car_glow_${cId})" />
        <circle cx="31" cy="11" r="2" fill="#ffffff" />
        <circle cx="69" cy="11" r="2" fill="#ffffff" />

        <!-- Dual Red LED Tail Light Bars -->
        <rect x="29" y="81" width="10" height="4" rx="2" fill="#ef4444" filter="url(#car_glow_${cId})" />
        <rect x="61" y="81" width="10" height="4" rx="2" fill="#ef4444" filter="url(#car_glow_${cId})" />
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
