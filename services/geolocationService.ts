// PawTag India - Geolocation Service
// Handles capturing finder's location when they scan a tag

import { GeoLocation } from '../types';

// Reverse geocoding API (using free OpenStreetMap Nominatim)
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

export const GeolocationService = {
  /**
   * Check if geolocation is available in the browser
   */
  isAvailable: (): boolean => {
    return 'geolocation' in navigator;
  },

  /**
   * Request location permission and get current position
   */
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!GeolocationService.isAvailable()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // Cache for 1 minute
        }
      );
    });
  },

  /**
   * Get location with reverse geocoding (address lookup)
   */
  getLocationWithAddress: async (): Promise<GeoLocation> => {
    try {
      const position = await GeolocationService.getCurrentPosition();
      const { latitude, longitude, accuracy } = position.coords;

      const geoLocation: GeoLocation = {
        latitude,
        longitude,
        accuracy
      };

      // Try to get address from coordinates
      try {
        const address = await GeolocationService.reverseGeocode(latitude, longitude);
        return { ...geoLocation, ...address };
      } catch {
        // Return location without address if reverse geocoding fails
        return geoLocation;
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reverse geocode coordinates to get address
   */
  reverseGeocode: async (latitude: number, longitude: number): Promise<Partial<GeoLocation>> => {
    try {
      const response = await fetch(
        `${NOMINATIM_API}?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'PawTagIndia/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      // Extract address components
      const address = data.address || {};

      return {
        address: data.display_name?.split(',').slice(0, 3).join(', '),
        city: address.city || address.town || address.village || address.suburb,
        state: address.state,
        country: address.country
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {};
    }
  },

  /**
   * Generate Google Maps link
   */
  getGoogleMapsLink: (latitude: number, longitude: number): string => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  },

  /**
   * Generate Google Maps embed URL
   */
  getGoogleMapsEmbed: (latitude: number, longitude: number): string => {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  },

  /**
   * Calculate distance between two coordinates (in km)
   */
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = GeolocationService.toRad(lat2 - lat1);
    const dLon = GeolocationService.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(GeolocationService.toRad(lat1)) *
        Math.cos(GeolocationService.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Convert degrees to radians
   */
  toRad: (deg: number): number => {
    return deg * (Math.PI / 180);
  },

  /**
   * Format distance for display
   */
  formatDistance: (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  },

  /**
   * Watch position for continuous updates
   */
  watchPosition: (
    onSuccess: (location: GeoLocation) => void,
    onError: (error: Error) => void
  ): number | null => {
    if (!GeolocationService.isAvailable()) {
      onError(new Error('Geolocation not supported'));
      return null;
    }

    return navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const geoLocation: GeoLocation = {
          latitude,
          longitude,
          accuracy
        };

        try {
          const address = await GeolocationService.reverseGeocode(latitude, longitude);
          onSuccess({ ...geoLocation, ...address });
        } catch {
          onSuccess(geoLocation);
        }
      },
      (error) => {
        onError(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  },

  /**
   * Stop watching position
   */
  clearWatch: (watchId: number): void => {
    navigator.geolocation.clearWatch(watchId);
  }
};
