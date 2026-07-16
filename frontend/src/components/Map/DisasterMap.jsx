import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_DEFAULTS, MARKER_COLORS } from '../../utils/constants.js';

// Fix Leaflet default icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createCircleIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 14px; height: 14px;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: 50%;
      box-shadow: 0 0 8px ${color}88;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function DisasterMap({ features = [], onMarkerClick }) {
  const mapRef    = useRef(null);
  const mapObj    = useRef(null);
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (mapObj.current) return;
    mapObj.current = L.map(mapRef.current, {
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · © CARTO',
      maxZoom: 19,
    }).addTo(mapObj.current);

    return () => {
      mapObj.current?.remove();
      mapObj.current = null;
    };
  }, []);

  // Update markers when features change
  useEffect(() => {
    if (!mapObj.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    features.forEach(f => {
      const { id, urgency_score, damage_level, status, created_at } = f.properties;
      const [lng, lat] = f.geometry.coordinates;
      const color = MARKER_COLORS[urgency_score] || MARKER_COLORS.default;

      const marker = L.marker([lat, lng], { icon: createCircleIcon(color) })
        .addTo(mapObj.current)
        .bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 180px;">
            <div style="font-weight: 700; margin-bottom: 6px; color: ${color}; font-size: 13px; text-transform: uppercase;">${urgency_score || 'Unknown'}</div>
            <div style="font-size: 12px; margin-bottom: 4px;">Damage: <strong>${damage_level || 'N/A'}</strong></div>
            <div style="font-size: 12px; margin-bottom: 8px;">Status: <strong>${(status || '').replace(/_/g, ' ')}</strong></div>
            <button
              onclick="window.dispatchEvent(new CustomEvent('reliefiq:select', {detail: '${id}'}))"
              style="font-size: 11px; padding: 4px 10px; background: #3b82f6; color: #fff; border: none; border-radius: 6px; cursor: pointer; width: 100%;"
            >View Details</button>
          </div>
        `, { className: 'dark-popup' });

      markersRef.current.push(marker);
    });
  }, [features]);

  // Listen for popup button clicks
  useEffect(() => {
    const handler = (e) => onMarkerClick?.(e.detail);
    window.addEventListener('reliefiq:select', handler);
    return () => window.removeEventListener('reliefiq:select', handler);
  }, [onMarkerClick]);

  return (
    <>
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #0d1526; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #f1f5f9;
        }
        .dark-popup .leaflet-popup-tip { background: #0d1526; }
      `}</style>
      <div ref={mapRef} className="map-container" style={{ width: '100%', height: '100%' }} />
    </>
  );
}
