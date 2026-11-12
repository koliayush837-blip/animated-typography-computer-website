import Why from "../components/Why";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import Brands from "../components/Brands";
import SEOHead from "../components/SEOHead";
import { PaperButton, Reveal, SectionHead } from "../components/ui";
import { MapPin, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";

export default function AboutPage() {
  const { data } = useData();
  const biz = data.biz;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    `Hello ${biz.name}, I'd like to know more about your store and services.`,
  )}`;

  return (
    <div className="pt-14 sm:pt-20">
      <SEOHead
        title={`About Us | ${biz.name} — Your Technology Partner in Kharadi, Pune`}
        description={`Learn about ${biz.name} in Ashoka Nagar, Kharadi, Pune. Rated 4.8 stars on Google and Justdial for expert laptop repair, refurbished laptops, custom desktops, and genuine computer accessories.`}
      />

      {/* Business Introduction Section */}
      <section className="relative px-4 pb-20 pt-16 sm:pb-28 sm:pt-24 md:px-8 md:pt-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead
            no="01"
            eyebrow="About Padmashree Computers"
            title="Our Story"
            tone="navy"
            sub={`${biz.name} is Kharadi's dedicated computer store and repair centre—built on honest diagnostics, fair pricing, and bench-level craftsmanship.`}
          />

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <Reveal rotate={-0.8} y={50}>
              <div className="drop h-full">
                <div className="fold-clip paper-bg relative flex h-full flex-col justify-between p-6 sm:p-8 md:p-12">
                  <span className="tape absolute -top-3 left-12 h-7 w-28 -rotate-2" />
                  <div className="space-y-5 text-base leading-relaxed text-navy/85 sm:text-lg">
                    <p className="font-extrabold text-xl text-navy sm:text-2xl">
                      Your neighborhood technology partner in Ashoka Nagar, Kharadi, Pune.
                    </p>
                    <p>
                      Whether you need a dependable business laptop, a custom-assembled desktop PC, a quick screen or battery replacement, or chip-level motherboard diagnostics when others say a machine is beyond repair—our technicians handle it directly on our shop bench.
                    </p>
                    <p>
                      We stock new and refurbished laptops, desktops, monitors, printers, UPS systems, networking tools, genuine spare parts, and everyday computer peripherals under one roof, alongside flexible laptop and desktop rental options.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 border-t-2 border-dashed border-navy/20 pt-6 sm:grid-cols-2">
                    {[
                      "Chip-level laptop & desktop repair bench",
                      "Curated new & refurbished laptops",
                      "Genuine screens, batteries & spares",
                      "Transparent upfront quotes before work starts",
                    ].map((point) => (
                      <div key={point} className="flex items-center gap-2.5 text-sm font-bold text-navy">
                        <CheckCircle2 size={18} className="shrink-0 text-brand" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal rotate={1.2} y={60} delay={0.12}>
              <div className="drop h-full">
                <div className="fold-clip paper-navy-bg fold-dark relative flex h-full flex-col justify-between p-6 text-white sm:p-8 md:p-10">
                  <div>
                    <span className="rounded-sm bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                      Verified Store Details
                    </span>
                    <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {biz.name}
                    </h3>
                    <p className="mt-1 font-serif text-xl italic text-white/75">{biz.tagline}</p>

                    <div className="mt-6 space-y-4 border-t border-white/15 pt-6 text-sm text-white/80">
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-brand">Address</span>
                        <p className="mt-1 font-bold text-white">{biz.address}</p>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-brand">Working Hours</span>
                        <p className="mt-1 font-bold text-white">Mon – Sat: 10:00 am – 9:00 pm</p>
                        <p className="font-bold text-white">Sunday: 10:00 am – 8:30 pm</p>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-brand">Direct Contact</span>
                        <p className="mt-1 font-bold text-white">
                          {biz.phoneDisplay} {biz.altPhoneDisplay ? `· ${biz.altPhoneDisplay}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3 pt-4">
                    <PaperButton href={`tel:${biz.phoneTel}`} tone="red" icon={<Phone size={18} />}>
                      Call Store
                    </PaperButton>
                    <PaperButton href={waLink} external tone="green" icon={<MessageCircle size={18} />}>
                      WhatsApp
                    </PaperButton>
                    <PaperButton href={biz.directions} external tone="white" icon={<MapPin size={18} />}>
                      Directions
                    </PaperButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Brands />
      <Why />
      <Gallery />
      <Reviews />
    </div>
  );
}

