import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Loader2, Navigation, Search } from 'lucide-react';

// Default center position (can be changed based on user's location)
const defaultCenter = {
  lat: -3.6305,  // Kilifi, Kenya coordinates
  lng: 39.8499
};

// Libraries to load with Google Maps
const libraries = ['places', 'geometry'] as ("places" | "geometry")[];

interface LocationPickerProps {
  onLocationSelect: (placeName: string, address: string, lat: number, lng: number) => void;
  initialAddress?: string;
  initialCoordinates?: { lat: number; lng: number };
  apiKey?: string;
}

// Define the map container style
const mapContainerStyle = {
  width: '100%',
  height: '350px'
};

// Default Google Maps API Key
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialAddress,
  initialCoordinates,
  apiKey
}) => {
  const [placeName, setPlaceName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [markerPosition, setMarkerPosition] = useState(initialCoordinates || defaultCenter);
  const [isAddressSearching, setIsAddressSearching] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const autoCompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  
  const { toast } = useToast();

  // Load Google Maps JS API with necessary libraries
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Initialize map and services
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();
    
    // Initialize Places service if map is available
    if (map) {
      placesServiceRef.current = new google.maps.places.PlacesService(map);
      autoCompleteRef.current = new google.maps.places.AutocompleteService();
    }
    
    setMapLoaded(true);
    
    // If we have initial coordinates, ensure the map is centered on them
    if (initialCoordinates) {
      map.panTo(initialCoordinates);
      map.setZoom(16);
    }
  }, [initialCoordinates]);

  // Get user's current location with improved error handling and timeout
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (placesServiceRef.current) {
      const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: 50 // smaller radius for more precise place
      };
        
      placesServiceRef.current.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          // Prefer the first result (closest)
          const placeId = results[0].place_id;
          placesServiceRef.current!.getDetails({ placeId }, (place, placeStatus) => {
            if (placeStatus === google.maps.places.PlacesServiceStatus.OK && place) {
              setPlaceName(place.name || "");
              setAddress(place.formatted_address || "");
              onLocationSelect(place.name || "", place.formatted_address || "", lat, lng);
              toast({
                title: "Location Updated",
                description: "Precise delivery address selected.",
              });
            } else {
              // Fallback to geocoder
              fallbackGeocode(lat, lng);
            }
          });
        } else {
          // Fallback to geocoder
          fallbackGeocode(lat, lng);
        }
      });
    } else {
      fallbackGeocode(lat, lng);
    }
  }, [onLocationSelect, toast]);

  const fallbackGeocode = (lat: number, lng: number) => {
    if (!geocoderRef.current) return;
    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const formattedAddress = results[0].formatted_address;
        setPlaceName("Unnamed Location");
        setAddress(formattedAddress);
        onLocationSelect("Unnamed Location", formattedAddress, lat, lng);
        toast({
          title: "Location Updated",
          description: "Fallback geocoding used.",
        });
      } else {
        toast({
          title: "Address Lookup Failed",
          description: "Could not determine a specific address.",
          variant: "destructive"
        });
        onLocationSelect("Unknown Address", "Unknown Address", lat, lng);
      }
    });
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation",
        variant: "destructive"
      });
      return;
    }
    
    setIsGettingCurrentLocation(true);
    
    // Set a timeout for the geolocation request
    const timeoutId = setTimeout(() => {
      setIsGettingCurrentLocation(false);
      toast({
        title: "Location Request Timeout",
        description: "Getting your location is taking too long. Please try again or enter your address manually.",
        variant: "destructive"
      });
    }, 10000); // 10 seconds timeout
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setMarkerPosition({ lat, lng });
        
        // Pan to the new location and zoom in
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(16);
        }
        
        // Use Places service for better reverse geocoding if available
        if (placesServiceRef.current) {
          const request = {
            location: new google.maps.LatLng(lat, lng),
            radius: 100
          };
          
          placesServiceRef.current.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
              // Get detailed information about the first place
              placesServiceRef.current?.getDetails(
                { placeId: results[0].place_id as string },
                (placeResult, placeStatus) => {
                  setIsGettingCurrentLocation(false);
                  
                  if (placeStatus === google.maps.places.PlacesServiceStatus.OK && placeResult) {
                    const formattedAddress = placeResult.formatted_address || '';
                    setAddress(formattedAddress);
                    onLocationSelect("Current Location", formattedAddress, lat, lng);
                    
                    toast({
                      title: "Location Updated",
                      description: "Using your current location for delivery",
                    });
                  } else {
                    // Fall back to geocoder
                    reverseGeocode(lat, lng);
                  }
                }
              );
            } else {
              // Fall back to geocoder
              reverseGeocode(lat, lng);
            }
          });
        } else if (geocoderRef.current) {
          // Fall back to geocoder if Places service isn't available
          reverseGeocode(lat, lng);
        } else {
          setIsGettingCurrentLocation(false);
          toast({
            title: "Location Found",
            description: "We found your coordinates but couldn't determine the address.",
          });
          onLocationSelect("Unknown Place", "Unknown Address", lat, lng);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        setIsGettingCurrentLocation(false);
        let message = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "You denied the request for geolocation. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable. Please try again or enter your address manually.";
            break;
          case error.TIMEOUT:
            message = "The request to get your location timed out. Please check your connection and try again.";
            break;
        }
        
        toast({
          title: "Geolocation Error",
          description: message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  }, [onLocationSelect, reverseGeocode, toast]);

  // Try to get user location on initial load, but only if no initial data is provided
  useEffect(() => {
    if (isLoaded && mapLoaded && !initialAddress && !initialCoordinates) {
      // Short delay to ensure the map is fully rendered
      const timer = setTimeout(() => {
        getCurrentLocation();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, mapLoaded, initialAddress, initialCoordinates, getCurrentLocation]);

  // Handle map click to set marker
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);


  // Search for address and position map - with improved error handling
  const searchAddress = useCallback(() => {
    if (!address.trim()) {
      toast({
        title: "Empty Address",
        description: "Please enter an address to search",
        variant: "destructive"
      });
      return;
    }
    
    setIsAddressSearching(true);
    
    if (geocoderRef.current) {
      // Set a timeout for the geocoding request
      const timeoutId = setTimeout(() => {
        setIsAddressSearching(false);
        toast({
          title: "Address Search Timeout",
          description: "The search is taking too long. Please check your connection and try again.",
          variant: "destructive"
        });
      }, 10000); // 10 seconds timeout
      
      geocoderRef.current.geocode(
        { address },
        (results, status) => {
          clearTimeout(timeoutId);
          setIsAddressSearching(false);
          
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            const formattedAddress = results[0].formatted_address;
            
            // Update marker position and center map with zoom animation
            setMarkerPosition({ lat, lng });
            mapRef.current?.panTo({ lat, lng });
            mapRef.current?.setZoom(16);
            setAddress(formattedAddress);
            onLocationSelect("Searched Address", formattedAddress, lat, lng);
            
            toast({
              title: "Location Found",
              description: "The map has been updated to your searched location",
            });
          } else {
            let errorMessage = "Could not locate the address you entered. Please try again.";
            
            if (status === "ZERO_RESULTS") {
              errorMessage = "No results found for this address. Please try a different address.";
            } else if (status === "OVER_QUERY_LIMIT") {
              errorMessage = "Too many requests. Please try again later.";
            }
            
            toast({
              title: "Address not found",
              description: errorMessage,
              variant: "destructive"
            });
          }
        }
      );
    } else {
      setIsAddressSearching(false);
      toast({
        title: "Geocoding Error",
        description: "The geocoding service is not available. Please try refreshing the page.",
        variant: "destructive"
      });
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
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        <h3 className="font-medium mb-1">Error loading Google Maps</h3>
        <p className="text-sm">Please check your internet connection and API key.</p>
      </div>
    );
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
            disabled={isAddressSearching || isGettingCurrentLocation}
          />
          {isAddressSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
          )}
        </div>
        <Button 
          onClick={searchAddress}
          disabled={!isLoaded || isAddressSearching || !address.trim() || isGettingCurrentLocation}
          type="button"
          variant="outline"
          className="px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button 
          onClick={getCurrentLocation} 
          disabled={!isLoaded || isGettingCurrentLocation || isAddressSearching} 
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
        <div className="border rounded-md overflow-hidden shadow-md relative">
          {!mapLoaded && (
            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="mt-2 text-sm text-muted-foreground">Loading map...</span>
              </div>
            </div>
          )}
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
              gestureHandling: 'greedy', // Makes the map more mobile-friendly
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }}
          >
            <Marker 
              position={markerPosition} 
              animation={google.maps.Animation.DROP}
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setMarkerPosition({ lat, lng });
                  reverseGeocode(lat, lng);
                }
              }}
            />
          </GoogleMap>
        </div>
      ) : (
        <div className="h-[350px] flex items-center justify-center bg-muted/20 rounded-md border">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-2 text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Click on the map to set your delivery location, drag the marker to fine-tune, or use the "My Location" button for automatic detection
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;