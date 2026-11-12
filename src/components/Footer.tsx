import { NAV } from "../data";
import { Logo, PaperText, Torn } from "./ui";
import { useData } from "../context/DataContext";
import { Lock, Shield } from "lucide-react";

export default function Footer() {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const biz = data.biz;

  return (
    <footer className="relative bg-navy-deep px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-16 text-paper sm:pt-24 md:px-8 md:pb-12 md:pt-32">
      <Torn fill="#08122f" seed={91} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <PaperText text={biz.name.split(" ")[0]} tone="cream" className="text-[clamp(2.1rem,12vw,14rem)]" />
        <PaperText text={biz.name.split(" ").slice(1).join(" ") || "Computers"} tone="red" delay={0.3} className="text-[clamp(2.1rem,12vw,14rem)]" />

        <div className="mt-10 grid gap-10 border-t border-paper/15 pt-10 sm:mt-16 sm:gap-12 sm:pt-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-paper-light p-1.5">
                <Logo className="h-9 w-9" />
              </span>
              <div>
                <p className="text-xl font-extrabold">{biz.name}</p>
                <p className="font-serif text-lg italic text-paper/70">{biz.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/70">
              Computer store offering hardware sales and prompt, reasonably priced repair services in Kharadi, Pune.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-brand">Explore</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm font-semibold">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-paper/80 transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="flex items-center gap-1.5 text-paper/80 font-bold hover:text-white text-brand"
                >
                  {isAdminAuthenticated ? <Shield size={14} /> : <Lock size={14} />} Admin Studio
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-brand">Reach us</h4>
            <p className="text-sm leading-relaxed text-paper/80">{biz.address}</p>
            <a href={`tel:${biz.phoneTel}`} className="mt-3 block text-xl font-extrabold text-white hover:text-brand sm:text-2xl">
              {biz.phoneDisplay}
            </a>
            <p className="mt-2 text-sm text-paper/60">Mon–Sat 10 am – 9 pm · Sun 10 am – 8:30 pm</p>
          </div>
        </div>

        <p className="mt-14 text-xs leading-relaxed text-paper/40">
          Laptop repair Kharadi · Refurbished laptops Pune · Chip-level repair Pune · Laptop rental Pune · Computer shop Kharadi
        </p>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-paper/40">
          <p>© {new Date().getFullYear()} {biz.name}. All rights reserved.</p>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="mt-2 sm:mt-0 underline hover:text-paper/80"
          >
            Store Owner / Admin Login
          </button>
        </div>
      </div>
    </footer>
  );
}
