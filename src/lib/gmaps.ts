import { useEffect, useRef, useState } from "react";

const SRC = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY}&libraries=places&loading=async&callback=__initGmaps&channel=${import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID}`;

let loadingPromise: Promise<void> | null = null;

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.maps) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve) => {
    (window as any).__initGmaps = () => resolve();
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
  return loadingPromise;
}

export function useGoogleMaps() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadMaps().then(() => setReady(true));
  }, []);
  return ready;
}

export const TASHKENT = { lat: 41.3111, lng: 69.2797 };
