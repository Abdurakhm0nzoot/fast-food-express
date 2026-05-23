import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [{ title: "Aloqa — OlovFood" }, { name: "description", content: "OlovFood bilan bog'lanish." }] }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="font-display text-5xl text-brand-dark mb-8">Aloqa</h1>
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-card p-4 rounded-xl shadow-[var(--shadow-card)]"><Phone className="size-5 text-primary" /> +998 71 200-00-00</div>
          <div className="flex items-center gap-3 bg-card p-4 rounded-xl shadow-[var(--shadow-card)]"><Mail className="size-5 text-primary" /> info@fastbite.uz</div>
          <div className="flex items-center gap-3 bg-card p-4 rounded-xl shadow-[var(--shadow-card)]"><MapPin className="size-5 text-primary" /> Toshkent, Amir Temur ko'chasi, 1</div>
        </div>
      </main>
      <Footer />
    </div>
  ),
});
