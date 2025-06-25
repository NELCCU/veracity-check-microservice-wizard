
// Definiciones de tipos para Google Maps API
declare namespace google {
  namespace maps {
    class Geocoder {
      constructor();
      geocode(
        request: google.maps.GeocoderRequest,
        callback: (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => void
      ): void;
    }

    interface GeocoderRequest {
      address?: string;
      location?: google.maps.LatLng;
      placeId?: string;
      bounds?: google.maps.LatLngBounds;
      componentRestrictions?: google.maps.GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderResult {
      address_components: google.maps.GeocoderAddressComponent[];
      formatted_address: string;
      geometry: google.maps.GeocoderGeometry;
      partial_match?: boolean;
      place_id: string;
      postcode_localities?: string[];
      types: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      bounds?: google.maps.LatLngBounds;
      location: google.maps.LatLng;
      location_type: google.maps.GeocoderLocationType;
      viewport: google.maps.LatLngBounds;
    }

    enum GeocoderStatus {
      OK = 'OK',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      ZERO_RESULTS = 'ZERO_RESULTS',
      ERROR = 'ERROR'
    }

    enum GeocoderLocationType {
      ROOFTOP = 'ROOFTOP',
      RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
      GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
      APPROXIMATE = 'APPROXIMATE'
    }

    interface GeocoderComponentRestrictions {
      administrativeArea?: string;
      country?: string;
      locality?: string;
      postalCode?: string;
      route?: string;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: google.maps.LatLng, ne?: google.maps.LatLng);
    }
  }
}

declare const google: typeof google;
