"use client"

import { Button } from '@/components/ui/button';
import { MapPin, LocateFixed } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const LocationPicker = ({ 
  onLocationSelect,
  initialAddress = ''
}: {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode using browser APIs (no server needed)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const displayName = data.display_name || "Selected Location";
          setAddress(displayName);
          onLocationSelect(displayName, latitude, longitude);
        } catch (error) {
          setAddress(`Near coordinates: ${latitude}, ${longitude}`);
          onLocationSelect(`Near coordinates: ${latitude}, ${longitude}`, latitude, longitude);
        }
        setIsLocating(false);
      },
      (error) => {
        alert("Error getting location: " + error.message);
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address or click to locate"
        />
        <Button
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          variant="outline"
          size="icon"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {isLocating 
          ? "Getting your location..." 
          : "We'll never store your exact location after checkout"}
      </p>
    </div>
  );
};

export default LocationPicker;