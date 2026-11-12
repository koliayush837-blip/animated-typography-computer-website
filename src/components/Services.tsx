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
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { PaperButton, Reveal, SectionHead } from "./ui";
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
  white: {
    bg: "paper-bg text-navy",
    fold: "",
    num: "text-brand/15",
    icon: "bg-navy text-white",
    p: "text-navy/70",
    link: "text-brand hover:text-navy",
  },
  navy: {
    bg: "paper-navy-bg text-white",
    fold: "fold-dark",
    num: "text-white/10",
    icon: "bg-brand text-white",
    p: "text-white/75",
    link: "text-paper-light/90 hover:text-white",
  },
  red: {
    bg: "paper-red-bg text-white",
    fold: "fold-red",
    num: "text-white/15",
    icon: "bg-paper-light text-brand",
    p: "text-white/85",
    link: "text-white hover:underline",
  },
};

interface ServicesProps {
  limit?: number;
  showEnquireLink?: boolean;
  sectionNo?: string;
}

export default function Services({ limit, showEnquireLink = false, sectionNo = "01" }: ServicesProps) {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const allServices = data.services;
  const biz = data.biz;
  const services = limit ? allServices.slice(0, limit) : allServices;

  return (
    <section id="services" className="relative px-4 pb-20 pt-20 sm:pb-24 sm:pt-24 md:px-8 md:pt-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <SectionHead
            no={sectionNo}
            eyebrow="What we do"
            title="Services"
            tone="navy"
            sub="From a cracked screen to a custom-built desktop, our technicians handle it on the bench, not in a back room."
            className="mb-4 md:mb-6"
          />

          <div className="mb-5 flex items-center gap-2 md:mb-6">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-navy/20 bg-paper px-4 py-2.5 text-xs font-bold text-navy shadow-sm transition-all hover:bg-navy hover:text-white"
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
            const waServiceUrl = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
              `Hello ${biz.name}, I would like to enquire about your "${s.title}" service.`,
            )}`;

            return (
              <Reveal key={`${s.title}-${i}`} delay={(i % 3) * 0.1} rotate={rot} y={90}>
                <div className="group drop transition-transform duration-500 hover:-translate-y-3 hover:rotate-0 h-full">
                  <div className={cn("fold-clip flex h-full min-h-0 flex-col justify-between p-6 sm:min-h-[290px] sm:p-7 md:p-8", t.bg, t.fold)}>
                    <div>
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

                    {showEnquireLink && (
                      <div className="relative mt-6 border-t border-current/15 pt-3">
                        <a
                          href={waServiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={cn("inline-flex min-h-[44px] items-center gap-1.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors", t.link)}
                        >
                          <MessageCircle size={14} /> Book / Enquire on WhatsApp <ArrowRight size={13} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {limit && allServices.length > limit && (
          <Reveal y={30} delay={0.1}>
            <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t-2 border-dashed border-navy/15 pt-8 sm:flex-row sm:items-center">
              <p className="font-mono text-xs uppercase tracking-widest text-navy/70">
                Need chip-level repair, laptop rental, or custom PC assembly?
              </p>
              <PaperButton href="/services" tone="navy" icon={<ArrowRight size={18} />}>
                Explore All {allServices.length} Services
              </PaperButton>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
