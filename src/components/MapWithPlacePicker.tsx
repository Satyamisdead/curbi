
"use client";

import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';

// Define types for the custom elements to satisfy TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-api-loader': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { key: string; 'solution-channel': string };
      'gmp-map': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { center: string; zoom: string; 'map-id': string; };
      'gmpx-place-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { placeholder: string; };
      'gmp-advanced-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}


interface MapWithPlacePickerProps {
    apiKey: string;
}

export function MapWithPlacePicker({ apiKey }: MapWithPlacePickerProps) {
    const mapRef = useRef<HTMLElement>(null);
    const markerRef = useRef<HTMLElement>(null);
    const placePickerRef = useRef<any>(null); // Using any because the type for value is complex
    const isInitialized = useRef(false);

    useEffect(() => {
        const initMap = async () => {
            if (isInitialized.current || !window.google || !window.google.maps) {
                return;
            }

            // Ensure custom elements are defined
            await customElements.whenDefined('gmp-map');
            
            const map = mapRef.current;
            const marker = markerRef.current;
            const placePicker = placePickerRef.current;
            
            if (!map || !marker || !placePicker) return;

            // The library might not expose innerMap directly, so we need to be careful.
            // Let's assume the component library handles the map instance internally.
            const mapInstance = (map as any).innerMap;
            if (!mapInstance) {
                console.error("Could not get map instance.");
                return;
            }

            mapInstance.setOptions({
              mapTypeControl: false
            });
            
            const infowindow = new google.maps.InfoWindow();

            placePicker.addEventListener('gmpx-placechange', () => {
                const place = placePicker.value;

                if (!place || !place.location) {
                    window.alert("No details available for input: '" + (place?.name || 'this location') + "'");
                    infowindow.close();
                    if(marker) (marker as any).position = null;
                    return;
                }

                if (place.viewport) {
                    mapInstance.fitBounds(place.viewport);
                } else {
                    mapInstance.setCenter(place.location);
                    mapInstance.setZoom(17);
                }

                if(marker) (marker as any).position = place.location;

                infowindow.setContent(
                    `<strong>${place.displayName}</strong><br>
                     <span>${place.formattedAddress}</span>`
                );
                infowindow.open(mapInstance, marker);
            });

            isInitialized.current = true;
        };
        
        // The script is loaded in page.tsx, we just need to wait for it.
        const interval = setInterval(() => {
            if (window.google && window.google.maps && customElements.get('gmp-map')) {
                clearInterval(interval);
                initMap();
            }
        }, 100);

        return () => clearInterval(interval);

    }, []);

    return (
        <Card className="overflow-hidden rounded-3xl shadow-lg h-96">
            <CardContent className="p-0 h-full">
                <div className="relative h-full">
                    <gmpx-api-loader key={apiKey} solution-channel="GMP_GE_mapsandplacesautocomplete_v2" />
                    <gmp-map ref={mapRef} center="37.7749,-122.4194" zoom="13" map-id="DEMO_MAP_ID" style={{height: '100%'}}>
                        <div slot="control-block-start-inline-start" style={{padding: '10px'}}>
                            <gmpx-place-picker ref={placePickerRef} placeholder="Enter a location" />
                        </div>
                        <gmp-advanced-marker ref={markerRef} />
                    </gmp-map>
                </div>
            </CardContent>
        </Card>
    );
}