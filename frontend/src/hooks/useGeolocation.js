import { useState, useEffect } from 'react';

/**
 * Detect the user's GPS location via browser Geolocation API.
 * Returns { lat, lng, address, loading, error }.
 */
export function useGeolocation() {
  const [state, setState] = useState({
    lat: null,
    lng: null,
    address: '',
    loading: false,
    error: null,
  });

  const detect = () => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported by your browser.' }));
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Reverse geocode with Nominatim (free, no key)
        let address = '';
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          address = data.display_name || '';
        } catch {
          // address remains empty — not critical
        }
        setState({ lat, lng, address, loading: false, error: null });
      },
      (err) => {
        setState(s => ({
          ...s,
          loading: false,
          error: 'Could not get location. Please enter coordinates manually.',
        }));
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return { ...state, detect };
}
