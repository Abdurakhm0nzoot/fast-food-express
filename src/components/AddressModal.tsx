import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useGoogleMaps, TASHKENT } from "@/lib/gmaps";
import { useServerFn } from "@tanstack/react-start";
import { reverseGeocode } from "@/lib/geocode.functions";
import { useEffect, useRef, useState } from "react";
import { MapPin, Locate, Pencil, Check } from "lucide-react";

export function AddressModal() {
  const { t, lang } = useI18n();
  const { addressOpen, setAddressOpen, address, setAddress } = useApp();
  const ready = useGoogleMaps();
  const geocode = useServerFn(reverseGeocode);

  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapInst = useRef<any>(null);
  const markerInst = useRef<any>(null);
  const autocompleteEl = useRef<HTMLInputElement | null>(null);

  const [pos, setPos] = useState<{ lat: number; lng: number }>(() =>
    address ? { lat: address.lat, lng: address.lng } : TASHKENT,
  );
  const [text, setText] = useState(address?.formatted ?? "");
  const [entrance, setEntrance] = useState(address?.entrance ?? "");
  const [editing, setEditing] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  // initialize map
  useEffect(() => {
    if (!ready || !addressOpen || !mapEl.current) return;
    const g = (window as any).google;
    if (!mapInst.current) {
      mapInst.current = new g.maps.Map(mapEl.current, {
        center: pos,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      });
      markerInst.current = new g.maps.Marker({
        position: pos,
        map: mapInst.current,
        draggable: true,
        animation: g.maps.Animation.DROP,
      });
      markerInst.current.addListener("dragend", () => {
        const p = markerInst.current.getPosition();
        const np = { lat: p.lat(), lng: p.lng() };
        setPos(np);
        fetchAddress(np);
      });
      mapInst.current.addListener("click", (e: any) => {
        const np = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        markerInst.current.setPosition(np);
        setPos(np);
        fetchAddress(np);
      });
      if (!text) fetchAddress(pos);
    }
    // resize fix when modal opens
    setTimeout(() => {
      if (mapInst.current) {
        (window as any).google.maps.event.trigger(mapInst.current, "resize");
        mapInst.current.setCenter(pos);
      }
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, addressOpen]);

  // suggestion search via Places API New
  const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string }>>([]);
  const sessionTokenRef = useRef<any>(null);

  useEffect(() => {
    if (!ready) return;
    const g = (window as any).google;
    g.maps.importLibrary("places").then((places: any) => {
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    });
  }, [ready]);

  const onSearchChange = async (q: string) => {
    setText(q);
    setEditing(true);
    if (q.length < 3 || !ready) {
      setSuggestions([]);
      return;
    }
    const g = (window as any).google;
    try {
      const places = await g.maps.importLibrary("places");
      const { suggestions: sug } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: q,
        sessionToken: sessionTokenRef.current,
        includedRegionCodes: ["uz"],
        language: lang === "uz" ? "uz" : lang === "ru" ? "ru" : "en",
      });
      setSuggestions(
        (sug || []).slice(0, 5).map((s: any) => ({
          id: s.placePrediction?.placeId ?? Math.random().toString(),
          text: s.placePrediction?.text?.toString?.() ?? "",
        })),
      );
    } catch {
      setSuggestions([]);
    }
  };

  const pickSuggestion = async (placeId: string, label: string) => {
    setText(label);
    setSuggestions([]);
    setEditing(false);
    const g = (window as any).google;
    try {
      const places = await g.maps.importLibrary("places");
      const place = new places.Place({ id: placeId });
      await place.fetchFields({ fields: ["location", "formattedAddress"] });
      if (place.location) {
        const np = { lat: place.location.lat(), lng: place.location.lng() };
        setPos(np);
        markerInst.current?.setPosition(np);
        mapInst.current?.panTo(np);
        mapInst.current?.setZoom(16);
        if (place.formattedAddress) setText(place.formattedAddress);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAddress = async (np: { lat: number; lng: number }) => {
    setLoadingText(true);
    try {
      const r = await geocode({ data: { lat: np.lat, lng: np.lng, lang } });
      if (r.formatted) setText(r.formatted);
    } finally {
      setLoadingText(false);
    }
  };

  const detect = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p) => {
      const np = { lat: p.coords.latitude, lng: p.coords.longitude };
      setPos(np);
      markerInst.current?.setPosition(np);
      mapInst.current?.panTo(np);
      mapInst.current?.setZoom(16);
      fetchAddress(np);
    });
  };

  const confirm = () => {
    if (!text.trim()) return;
    setAddress({ formatted: text.trim(), lat: pos.lat, lng: pos.lng, entrance: entrance.trim() || undefined });
    setAddressOpen(false);
  };

  return (
    <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="font-display text-2xl">{t("addr.title")}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
            <Input
              ref={autocompleteEl}
              value={text}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("addr.search.placeholder")}
              className="pl-10 pr-10 h-12 text-base border-2 focus-visible:border-primary"
            />
            {loadingText && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">…</span>}
            {suggestions.length > 0 && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pickSuggestion(s.id, s.text)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-start gap-2"
                  >
                    <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={detect} className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
            <Locate className="size-3" /> {t("addr.detect")}
          </button>
        </div>

        <div className="px-6 py-3">
          <div ref={mapEl} className="w-full h-64 sm:h-80 rounded-xl bg-muted overflow-hidden" />
          <p className="text-xs text-muted-foreground mt-2">
            {ready ? "📍 " + (text || t("addr.set")) : "Loading map…"}
          </p>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <Input
            placeholder={t("addr.entrance")}
            value={entrance}
            onChange={(e) => setEntrance(e.target.value)}
            className="h-11"
          />
          <Button
            onClick={confirm}
            disabled={!text.trim()}
            size="lg"
            className="w-full brand-gradient text-brand-foreground hover:opacity-90"
          >
            <Check className="size-4 mr-1" /> {t("addr.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
