import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((data: { lat: number; lng: number; lang?: string }) => {
    if (typeof data?.lat !== "number" || typeof data?.lng !== "number") {
      throw new Error("Invalid coordinates");
    }
    return { lat: data.lat, lng: data.lng, lang: data.lang ?? "ru" };
  })
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!GOOGLE_MAPS_API_KEY) throw new Error("GOOGLE_MAPS_API_KEY missing");

    const url = `${GATEWAY}/maps/api/geocode/json?latlng=${data.lat},${data.lng}&language=${encodeURIComponent(data.lang)}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
      },
    });
    const json = (await res.json()) as { results?: Array<{ formatted_address: string }>; status?: string };
    const formatted = json.results?.[0]?.formatted_address ?? "";
    return { formatted };
  });
