import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { PaperButton, Reveal, SectionHead, Torn, useOpenStatus } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";

export default function Contact() {
  const { data } = useData();
  const biz = data.biz;
  const hours = data.hours;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    "Hello " + biz.name + ", I'd like to know more about your products and services.",
  )}`;

  const status = useOpenStatus();
  const todayIdx = status.isSunday ? 1 : 0;

  return (
    <section id="contact" className="relative px-4 pb-36 pt-16 sm:pt-24 md:px-8 md:pt-32">
      <Torn fill="#f5efe3" seed={79} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          no="06"
          eyebrow="Find us"
          title="Visit us"
          tone="red"
          sub="Drop in at Ashoka Nagar, Kharadi, or call ahead and we'll have the bench ready."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal rotate={-1} x={-60} y={40}>
            <div className="drop">
              <div className="fold-clip paper-bg relative space-y-8 p-5 sm:p-7 md:p-10">
                <span className="tape absolute top-0 left-10 h-7 w-24 -rotate-3" />

                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-navy text-white shadow-[0_4px_0_#050b22]">
                    <MapPin size={22} />
                  </span>
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">Address</h3>
                    <address className="mt-1 text-base font-bold not-italic leading-snug text-navy sm:text-lg">
                      {biz.name}
                      <br />
                      {biz.address}
                    </address>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand text-white shadow-[0_4px_0_#8f1020]">
                    <Phone size={22} />
                  </span>
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">Call</h3>
                    <a href={`tel:${biz.phoneTel}`} className="mt-1 block text-2xl font-extrabold tracking-tight text-navy transition-colors hover:text-brand sm:text-3xl">
                      {biz.phoneDisplay}
                    </a>
                    {biz.altPhoneDisplay && (
                      <a href={`tel:${biz.altPhoneTel}`} className="mt-1 block font-mono text-sm text-navy/70 hover:text-brand">
                        Alt: {biz.altPhoneDisplay}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#1f9d55] text-white shadow-[0_4px_0_#0f6b37]">
                    <MessageCircle size={22} />
                  </span>
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">WhatsApp</h3>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xl font-extrabold text-navy transition-colors hover:text-brand sm:text-2xl"
                    >
                      +{biz.whatsapp}
                    </a>
                    <p className="mt-1 font-mono text-xs text-navy/60">Typical reply within an hour</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-paper-dark text-navy shadow-[0_4px_0_#c9bea3]">
                    <Clock size={22} />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">Opening hours</h3>
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-navy">
                        <span className={cn("h-2.5 w-2.5 rounded-full", status.open ? "bg-[#1f9d55] pulse-dot" : "bg-brand")} />
                        {status.label}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 border-t border-dashed border-navy/20 pt-3 text-sm">
                      {hours.map((h, i) => (
                        <li key={h.days} className={cn("flex justify-between font-bold", i === todayIdx ? "text-brand" : "text-navy/75")}>
                          <span>{h.days}</span>
                          <span className="font-mono">
                            {h.open} – {h.close}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <PaperButton href={biz.directions} external tone="navy" icon={<Navigation size={18} />}>
                    Get directions
                  </PaperButton>
                  <PaperButton href={waLink} external tone="green" icon={<MessageCircle size={18} />}>
                    Chat on WhatsApp
                  </PaperButton>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal rotate={1} x={60} y={40} delay={0.15}>
            <div className="drop h-full">
              <div className="paper-bg relative flex h-full flex-col overflow-hidden rounded-md border-4 border-white p-3 shadow-inner sm:p-4">
                <span className="tape absolute -top-1 right-12 z-10 h-7 w-28 rotate-6" />
                <div className="relative min-h-[360px] flex-1 overflow-hidden rounded">
                  <iframe
                    title="Map of Padmashree Computers"
                    src={biz.mapEmbed}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-navy/70">
                  <span>Downtown Rd, Kharadi, Pune 411014</span>
                  <a href={biz.directions} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
