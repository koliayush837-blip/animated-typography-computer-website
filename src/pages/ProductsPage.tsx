import Products from "../components/Products";
import Brands from "../components/Brands";
import SEOHead from "../components/SEOHead";
import { PaperButton, Reveal } from "../components/ui";
import { MessageCircle, Phone } from "lucide-react";
import { useData } from "../context/DataContext";

export default function ProductsPage() {
  const { data } = useData();
  const biz = data.biz;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    `Hello ${biz.name}, I am browsing your product catalog and would like to check availability and pricing.`,
  )}`;

  return (
    <div className="pt-6 sm:pt-10">
      <SEOHead
        title={`Products & Pricing | ${biz.name} — Laptops, Monitors, Printers & Accessories`}
        description={`Browse new and refurbished laptops, desktops, monitors, printers, UPS, mice, headphones, software and laptop spares at ${biz.name} in Kharadi, Pune.`}
      />
      <Products mode="catalog" sectionNo="01" />
      <Brands />

      <section className="relative bg-paper px-4 py-16 sm:py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal y={40}>
            <div className="drop">
              <div className="fold-clip paper-navy-bg fold-dark relative flex flex-col items-start justify-between gap-6 p-6 text-white sm:p-10 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <span className="rounded-sm bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                    Custom Orders & Bulk Stock
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                    Looking for a specific laptop configuration or spare part?
                  </h2>
                  <p className="mt-2 text-base text-white/75 sm:text-lg">
                    Our Kharadi shelf stock updates daily. Call or message us on WhatsApp for today's live rate and instant availability check.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <PaperButton href={`tel:${biz.phoneTel}`} tone="red" icon={<Phone size={18} />}>
                    Call {biz.phoneDisplay}
                  </PaperButton>
                  <PaperButton href={waLink} external tone="green" icon={<MessageCircle size={18} />}>
                    Ask on WhatsApp
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

