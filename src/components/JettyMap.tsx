'use client';

import { useEffect, useState, useRef } from 'react';
import { Jetty } from '@/data/jetties';
import Link from 'next/link';
import type { Map as LeafletMap } from 'leaflet';

interface JettyMapProps {
  jetties: Jetty[];
  selectedJetty?: Jetty | null;
  onMarkerClick?: (jetty: Jetty) => void;
}

export default function JettyMap({ jetties, selectedJetty, onMarkerClick }: JettyMapProps) {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || map) return;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Calculate center and bounds
      const bounds = L.latLngBounds(
        jetties.map((j) => [j.coordinates.lat, j.coordinates.lng] as [number, number])
      );

      // Create map
      const mapInstance = L.map('jetty-map', {
        center: bounds.getCenter(),
        zoom: 5,
        scrollWheelZoom: true,
      });

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // Fit to bounds with padding
      mapInstance.fitBounds(bounds, { padding: [50, 50] });

      // Add markers
      jetties.forEach((jetty) => {
        const marker = L.marker([jetty.coordinates.lat, jetty.coordinates.lng])
          .addTo(mapInstance);

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${jetty.title}</div>
            <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${jetty.location}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: #0077b6;">$${jetty.pricePerNight}/night</span>
              <span style="font-size: 12px;">
                <span style="color: #fbbf24;">★</span> ${jetty.rating} (${jetty.reviewCount})
              </span>
            </div>
            <a href="/jetty/${jetty.id}"
               style="display: block; text-align: center; margin-top: 8px; padding: 8px;
                      background: #0077b6; color: white; border-radius: 6px;
                      text-decoration: none; font-size: 13px; font-weight: 500;">
              View Details
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(jetty);
          }
        });
      });

      mapRef.current = mapInstance;
      setMap(mapInstance);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, jetties, onMarkerClick]);

  // Center map on selected jetty
  useEffect(() => {
    if (map && selectedJetty) {
      map.setView([selectedJetty.coordinates.lat, selectedJetty.coordinates.lng], 12);
    }
  }, [map, selectedJetty]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div id="jetty-map" className="w-full h-full rounded-xl" />
    </>
  );
}
