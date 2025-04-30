import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Loader2 } from 'lucide-react';

// Default center position (can be changed based on user's location)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

interface LocationPickerProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
}

// Define the map container style
const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyB-lDSWjVUoIUnW7OqLXkAZAWnzemuGbP4';

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialAddress }) => {
  const [address, setAddress] = useState(initialAddress || '');
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [isAddressSearching, setIsAddressSearching] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const { toast } = useToast();

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Initialize map and geocoder
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  // Handle map click to set marker
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      
      // Reverse geocode to get address from lat/lng
      if (geocoderRef.current) {
        geocoderRef.current.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);
              onLocationSelect(formattedAddress, lat, lng);
            } else {
              toast({
                title: "Geocoding failed",
                description: `Could not find address for this location: ${status}`,
                variant: "destructive"
              });
            }
          }
        );
      }
    }
  }, [onLocationSelect, toast]);

  // Search for address and position map
  const searchAddress = useCallback(() => {
    if (!address.trim()) return;
    
    setIsAddressSearching(true);
    
    if (geocoderRef.current) {
      geocoderRef.current.geocode(
        { address },
        (results, status) => {
          setIsAddressSearching(false);
          
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            const formattedAddress = results[0].formatted_address;
            
            // Update marker position and center map
            setMarkerPosition({ lat, lng });
            mapRef.current?.panTo({ lat, lng });
            mapRef.current?.setZoom(16);
            setAddress(formattedAddress);
            onLocationSelect(formattedAddress, lat, lng);
          } else {
            toast({
              title: "Address not found",
              description: "Could not locate the address you entered. Please try again.",
              variant: "destructive"
            });
          }
        }
      );
    }
  }, [address, onLocationSelect, toast]);

  // Handle input keydown event for Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchAddress();
    }
  };

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading Google Maps</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your address"
            className="pl-10"
          />
        </div>
        <Button 
          onClick={searchAddress} 
          disabled={!isLoaded || isAddressSearching} 
          type="button"
          variant="secondary"
        >
          {isAddressSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {isLoaded ? (
        <div className="border rounded-md overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition}
            zoom={14}
            onClick={onMapClick}
            onLoad={onMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Click on the map to set your delivery location or search for an address above
      </p>
    </div>
  );
};

export default LocationPicker;
