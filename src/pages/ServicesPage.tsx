import Services from "../components/Services";
import SEOHead from "../components/SEOHead";
import { PaperButton, Reveal, SectionHead, Torn } from "../components/ui";
import { Cpu, HardDrive, Laptop, Monitor, ShieldCheck, Wrench, Phone, MessageCircle } from "lucide-react";
import { useData } from "../context/DataContext";

const SERVICE_PILLARS = [
  {
    icon: Laptop,
    title: "Laptop Repair & Chip-Level Diagnostics",
    text: "Motherboard fault tracing, IC replacement, hinge rework, broken screen replacement, keyboard swaps, and battery replacements with genuine parts.",
  },
  {
    icon: Monitor,
    title: "Computer & Desktop Repair Bench",
    text: "Power supply issues, no-display boot failures, overheating, cabinet upgrades, and custom PC builds tailored for home, office, or gaming.",
  },
  {
    icon: HardDrive,
    title: "Hardware Upgrades (RAM & NVMe SSD)",
    text: "Make slow laptops and desktops boot in seconds with high-speed SSD upgrades, memory expansion, and thermal paste servicing.",
  },
  {
    icon: ShieldCheck,
    title: "Software Installation & Virus Removal",
    text: "Clean OS installation, driver setup, Quick Heal & Net Protector antivirus protection, data recovery, and malware cleanup.",
  },
  {
    icon: Cpu,
    title: "Technical Support & Peripherals",
    text: "Printer servicing (Epson EcoTank & HP Laser), UPS battery backup solutions, networking accessories, and laptop rentals.",
  },
  {
    icon: Wrench,
    title: "Same-Day Walk-In Bench Service",
    text: "Many common repairs—including laptop screen and battery replacements—are completed within the hour right on our Kharadi bench.",
  },
];

export default function ServicesPage() {
  const { data } = useData();
  const biz = data.biz;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    `Hello ${biz.name}, I need assistance with a computer/laptop repair or upgrade.`,
  )}`;

  return (
    <div>
      <SEOHead
        title={`Services — Laptop Repair, Chip-Level Repair & Upgrades | ${biz.name}`}
        description={`Expert computer repair, laptop chip-level repair, screen & battery replacement, RAM/SSD hardware upgrades, OS installation and laptop rental at ${biz.name}, Kharadi, Pune.`}
      />

      <Services showEnquireLink sectionNo="01" />

      {/* Detailed Service Capabilities Breakdown */}
      <section className="relative bg-navy px-4 pb-24 pt-16 text-white sm:pb-32 sm:pt-24 md:px-8">
        <Torn fill="#0e1c4a" seed={41} position="top" />
        <div className="mx-auto max-w-[1400px]">
          <SectionHead
            no="02"
            eyebrow="On the workbench"
            title="How We Help"
            tone="white"
            dark
            sub="Transparent diagnostics before any work begins. You know the exact issue and cost up front."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.08} rotate={[-1, 0.8, -0.6][i % 3]} y={60}>
                <div className="drop-sm h-full transition-transform duration-500 hover:-translate-y-2 hover:rotate-0">
                  <div className="paper-bg flex h-full flex-col justify-between rounded-md p-6 text-navy sm:p-7">
                    <div>
                      <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-brand text-white shadow-[0_4px_0_#8f1020]">
                        <p.icon size={24} />
                      </div>
                      <h3 className="text-xl font-extrabold tracking-tight">{p.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-navy/75">{p.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal y={40} delay={0.2} className="mt-14">
            <div className="drop">
              <div className="fold-clip paper-red-bg fold-red flex flex-col items-start justify-between gap-6 p-6 text-white sm:p-10 lg:flex-row lg:items-center">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                    Walk-In or Call Ahead
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
                    Ready to get your machine checked?
                  </h3>
                  <p className="mt-2 text-base text-white/85">
                    Drop in at Shop No. 2, Downtown Rd, Ashoka Nagar, Kharadi, or call our technicians now.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <PaperButton href={`tel:${biz.phoneTel}`} tone="navy" icon={<Phone size={18} />}>
                    Call {biz.phoneDisplay}
                  </PaperButton>
                  <PaperButton href={waLink} external tone="green" icon={<MessageCircle size={18} />}>
                    WhatsApp Support
                  </PaperButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

