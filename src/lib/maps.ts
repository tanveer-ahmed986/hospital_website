/**
 * Google Maps Integration
 *
 * Utilities for Google Maps embedding and directions
 * Task: T124 [US3]
 */

/**
 * Hospital location configuration
 */
export interface HospitalLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  emergency: string;
}

/**
 * Generate Google Maps embed URL
 */
export function getGoogleMapsEmbedUrl(location: HospitalLocation): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Encode address for URL
  const encodedAddress = encodeURIComponent(location.address);

  // Use coordinates for more precise location
  const coordinates = `${location.lat},${location.lng}`;

  // Build embed URL
  // https://developers.google.com/maps/documentation/embed/embedding-map
  const url = new URL('https://www.google.com/maps/embed/v1/place');
  url.searchParams.append('key', apiKey);
  url.searchParams.append('q', `${location.name},${encodedAddress}`);
  url.searchParams.append('center', coordinates);
  url.searchParams.append('zoom', '15');

  return url.toString();
}

/**
 * Generate Google Maps directions URL (opens in new tab)
 */
export function getGoogleMapsDirectionsUrl(
  destination: HospitalLocation,
  origin?: string
): string {
  const url = new URL('https://www.google.com/maps/dir/');

  // If origin provided, add it
  if (origin) {
    url.searchParams.append('saddr', origin);
  }

  // Add destination
  url.searchParams.append('daddr', `${destination.lat},${destination.lng}`);

  return url.toString();
}

/**
 * Generate Google Maps search URL for nearby hospitals
 */
export function getNearbyHospitalsUrl(location: HospitalLocation): string {
  const url = new URL('https://www.google.com/maps/search/');

  // Search for hospitals near the location
  url.searchParams.append('api', '1');
  url.searchParams.append('query', 'hospitals');
  url.searchParams.append('query_place_id', ''); // Optional: add place ID if available

  return url.toString();
}

/**
 * Format address for display
 */
export function formatAddress(location: HospitalLocation): string {
  return location.address;
}

/**
 * Generate WhatsApp location sharing URL
 */
export function getWhatsAppLocationUrl(location: HospitalLocation): string {
  const message = encodeURIComponent(
    `${location.name}\n${location.address}\nView on map: https://maps.google.com/?q=${location.lat},${location.lng}`
  );

  return `https://wa.me/?text=${message}`;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get user's current location (requires browser permission)
 */
export async function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
  if (!navigator.geolocation) {
    console.warn('Geolocation is not supported by this browser');
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Error getting user location:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
