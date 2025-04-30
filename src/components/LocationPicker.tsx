import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Loader2, Navigation } from 'lucide-react';

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
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
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

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsGettingCurrentLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setMarkerPosition({ lat, lng });
          
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(16);
          }
          
          // Reverse geocode to get address
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: { lat, lng } },
              (results, status) => {
                setIsGettingCurrentLocation(false);
                
                if (status === "OK" && results && results[0]) {
                  const formattedAddress = results[0].formatted_address;
                  setAddress(formattedAddress);
                  onLocationSelect(formattedAddress, lat, lng);
                  
                  toast({
                    title: "Location Updated",
                    description: "Using your current location for delivery",
                  });
                } else {
                  toast({
                    title: "Location Found",
                    description: "Your location was found but the address could not be determined.",
                    variant: "destructive"
                  });
                }
              }
            );
          } else {
            setIsGettingCurrentLocation(false);
          }
        },
        (error) => {
          setIsGettingCurrentLocation(false);
          let message = "Unable to get your location";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "You denied the request for geolocation";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              message = "The request to get your location timed out";
              break;
          }
          
          toast({
            title: "Geolocation Error",
            description: message,
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation",
        variant: "destructive"
      });
    }
  }, [onLocationSelect, toast]);

  // Try to get user location on initial load
  useEffect(() => {
    if (isLoaded && geocoderRef.current && !initialAddress) {
      getCurrentLocation();
    }
  }, [isLoaded, initialAddress, getCurrentLocation]);

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
          onClick={getCurrentLocation} 
          disabled={!isLoaded || isGettingCurrentLocation} 
          type="button"
          variant="default"
          className="bg-primary text-white"
        >
          {isGettingCurrentLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              My Location
            </>
          )}
        </Button>
      </div>

      {isLoaded ? (
        <div className="border rounded-md overflow-hidden shadow-md">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition}
            zoom={14}
            onClick={onMapClick}
            onLoad={onMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true,
              fullscreenControl: false,
            }}
          >
            <Marker position={markerPosition} animation={google.maps.Animation.DROP} />
          </GoogleMap>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Click on the map to set your delivery location or use the "My Location" button
      </p>
    </div>
  );
};

export default LocationPicker;
