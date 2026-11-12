import {
  BatteryCharging,
  CalendarClock,
  Cpu,
  Keyboard,
  Laptop,
  MemoryStick,
  Monitor,
  PcCase,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";

const icons: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  laptop: Laptop,
  rental: CalendarClock,
  chip: Cpu,
  battery: BatteryCharging,
  memory: MemoryStick,
  shield: ShieldCheck,
  keyboard: Keyboard,
  pc: PcCase,
  monitor: Monitor,
};

const tones = {
  white: { bg: "paper-bg text-navy", fold: "", num: "text-brand/15", icon: "bg-navy text-white", p: "text-navy/70" },
  navy: { bg: "paper-navy-bg text-white", fold: "fold-dark", num: "text-white/10", icon: "bg-brand text-white", p: "text-white/75" },
  red: { bg: "paper-red-bg text-white", fold: "fold-red", num: "text-white/15", icon: "bg-paper-light text-brand", p: "text-white/85" },
};

export default function Services() {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const services = data.services;

  return (
    <section id="services" className="relative px-4 pb-20 pt-16 sm:pb-28 sm:pt-24 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <SectionHead
            no="01"
            eyebrow="What we do"
            title="Services"
            tone="navy"
            sub="From a cracked screen to a custom-built desktop, our technicians handle it on the bench, not in a back room."
            className="mb-6 md:mb-12"
          />

          <div className="mb-8 flex items-center gap-2 md:mb-12">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-paper px-3.5 py-2 text-xs font-bold text-navy shadow-sm transition-all hover:bg-navy hover:text-white"
            >
              <Settings size={14} />
              {isAdminAuthenticated ? "Manage Services" : "Edit Services"}
            </button>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon] || Laptop;
            const t = tones[s.tone] || tones.white;
            const rot = [-1.2, 0.8, -0.6, 1, -0.9, 0.7][i % 6];
            return (
              <Reveal key={`${s.title}-${i}`} delay={(i % 3) * 0.1} rotate={rot} y={90}>
                <div className="group drop transition-transform duration-500 hover:-translate-y-3 hover:rotate-0">
                  <div className={cn("fold-clip min-h-0 p-6 sm:min-h-[290px] sm:p-7 md:p-8", t.bg, t.fold)}>
                    <span className={cn("pointer-events-none absolute -right-2 -top-6 select-none text-[6rem] font-extrabold leading-none sm:text-[9rem]", t.num)}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className={cn(
                        "relative mb-8 grid h-14 w-14 place-items-center rounded-xl shadow-[0_4px_0_rgba(0,0,0,.25)] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110",
                        t.icon,
                      )}
                    >
                      <Icon size={26} strokeWidth={2.2} />
                    </div>
                    <h3 className="relative text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">{s.title}</h3>
                    <p className={cn("relative mt-3 text-base leading-relaxed", t.p)}>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
