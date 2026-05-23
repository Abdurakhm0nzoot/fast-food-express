import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Clock } from "lucide-react";

const branches = [
  { name: "Amir Temur", addr: "Amir Temur ko'chasi, 1", time: "10:00 — 23:00" },
  { name: "Chilonzor", addr: "Bunyodkor shoh ko'chasi, 23", time: "10:00 — 24:00" },
  { name: "Yunusobod", addr: "Bog'ishamol, 12", time: "10:00 — 23:00" },
  { name: "Mirobod", addr: "Shota Rustaveli, 45", time: "10:00 — 23:00" },
];

export const Route = createFileRoute("/branches")({
  head: () => ({ meta: [{ title: "Filiallar — OlovFood" }, { name: "description", content: "OlovFood filiallari Toshkent bo'ylab." }] }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-5xl text-brand-dark mb-8">Filiallar</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div key={b.name} className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-2xl mb-2">{b.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="size-4 text-primary" /> {b.addr}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Clock className="size-4 text-primary" /> {b.time}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  ),
});
