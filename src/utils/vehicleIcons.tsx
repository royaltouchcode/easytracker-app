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
