import { MapPin, Crosshair } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation.js';

export default function LocationPicker({ location, onChange }) {
  const geo = useGeolocation();

  const detectLocation = async () => {
    geo.detect();
  };

  // Sync detected location to parent
  if (geo.lat && geo.lat !== location.lat) {
    onChange({ lat: geo.lat, lng: geo.lng, address: geo.address });
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="flex justify-between items-center mb-4">
        <label className="form-label" style={{ marginBottom: 0 }}>
          <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />
          Location *
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={detectLocation}
          disabled={geo.loading}
        >
          {geo.loading ? <span className="spinner spinner-sm" /> : <Crosshair size={14} />}
          {geo.loading ? 'Detecting…' : 'Auto-detect GPS'}
        </button>
      </div>

      {geo.error && (
        <p style={{ color: 'var(--color-critical)', fontSize: 12, marginBottom: 12 }}>{geo.error}</p>
      )}

      {location.address && (
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, marginBottom: 2 }}>📍 Detected Location</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{location.address}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label" style={{ textTransform: 'none', fontSize: 12 }}>Latitude *</label>
          <input
            className="form-input"
            type="number"
            step="any"
            placeholder="e.g. 23.8103"
            value={location.lat}
            onChange={e => onChange({ ...location, lat: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ textTransform: 'none', fontSize: 12 }}>Longitude *</label>
          <input
            className="form-input"
            type="number"
            step="any"
            placeholder="e.g. 90.4125"
            value={location.lng}
            onChange={e => onChange({ ...location, lng: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );
}
