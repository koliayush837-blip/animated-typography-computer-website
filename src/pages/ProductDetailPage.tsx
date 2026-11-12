import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Cpu,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Settings,
} from "lucide-react";
import { PaperButton, PaperText, Reveal, Torn } from "../components/ui";
import { useData } from "../context/DataContext";
import { findProductBySlug, getProductSlug } from "../data";
import { Link } from "../utils/router";
import SEOHead from "../components/SEOHead";
import { cn } from "../utils/cn";

export default function ProductDetailPage({ slug }: { slug: string }) {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const biz = data.biz;
  const match = findProductBySlug(data.catalog, slug);

  if (!match) {
    return (
      <section className="relative min-h-[75vh] px-4 pb-24 pt-32 md:px-8 md:pt-40">
        <SEOHead title={`Product Not Found | ${biz.name}`} description="Product catalog at Padmashree Computers, Kharadi, Pune." />
        <div className="mx-auto max-w-2xl text-center">
          <div className="drop">
            <div className="fold-clip paper-bg relative p-8 sm:p-12">
              <span className="tape absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-2" />
              <span className="rounded-sm bg-brand px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white">
                404 · Item Not Found
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
                Product Not on This Shelf
              </h1>
              <p className="mt-3 font-serif text-xl italic text-navy/70">
                This item may have been sold or moved. Browse our full product catalog or ring us directly for availability.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <PaperButton href="/products" tone="navy" icon={<ArrowLeft size={18} />}>
                  Back to All Products
                </PaperButton>
                <PaperButton href={`tel:${biz.phoneTel}`} tone="red" icon={<Phone size={18} />}>
                  Call {biz.phoneDisplay}
                </PaperButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { item, category } = match;
  const priced = Boolean(item.price);
  const stockStatus = item.stockStatus || "in_stock";

  const defaultDescription = `Available at ${biz.name}, Kharadi, Pune under our ${category.label} department. Thoroughly tested and backed by our in-store technical support bench.`;

  const defaultSpecs =
    item.specs && item.specs.length > 0
      ? item.specs
      : [
          `Category: ${category.label}`,
          item.tag ? `Classification: ${item.tag}` : "Genuine quality hardware & components",
          "Inspected & verified by Padmashree Computers technicians",
          "In-store pickup & demonstration available at Ashoka Nagar, Kharadi",
        ];

  const waProductText = `Hello ${biz.name}, I'm interested in *${item.name}* (${category.label})${
    item.price ? ` listed at ₹${item.price}` : ""
  }. Is it currently available in store?`;
  const waProductUrl = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(waProductText)}`;

  const related = category.items
    .filter((i) => i.name !== item.name)
    .slice(0, 3);

  return (
    <div className="pt-24 sm:pt-28 md:pt-36">
      <SEOHead
        title={`${item.name} — ${category.label} | ${biz.name}, Kharadi Pune`}
        description={item.description || `${item.name} (${category.label}) available at ${biz.name}, Kharadi, Pune. ${item.price ? `Price: ₹${item.price}.` : "Call for today's best price."}`}
      />

      <section className="relative px-4 pb-20 sm:pb-28 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          {/* Breadcrumb & Back link */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-navy/65">
              <Link to="/" className="hover:text-brand">
                Home
              </Link>
              <span>/</span>
              <Link to="/products" className="hover:text-brand">
                Products
              </Link>
              <span>/</span>
              <span className="text-navy/80">{category.label}</span>
              <span>/</span>
              <span className="text-brand">{item.name}</span>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-paper-light px-3.5 py-2 text-xs font-bold text-navy shadow-sm transition-colors hover:bg-navy hover:text-white"
              >
                <ArrowLeft size={14} /> All Products
              </Link>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-paper-light px-3.5 py-2 text-xs font-bold text-navy shadow-sm transition-colors hover:bg-brand hover:text-white"
              >
                <Settings size={14} />
                {isAdminAuthenticated ? "Edit Product" : "Admin"}
              </button>
            </div>
          </div>

          {/* Main Product Detail Sheet */}
          <Reveal y={40} rotate={-0.4}>
            <div className="drop">
              <div className="fold-clip paper-bg relative grid gap-8 p-5 sm:p-8 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
                <span className="tape absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-2" />

                {/* Left Column: Polaroid / Paper Framed Product Visual */}
                <div className="flex flex-col justify-between rounded-md border-2 border-dashed border-navy/20 bg-paper-light p-5 sm:p-8">
                  {item.image ? (
                    <div className="overflow-hidden rounded-lg border border-navy/10 bg-white shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="paper-navy-bg relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-lg p-6 text-center text-white">
                      <div className="mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-brand text-white shadow-[0_5px_0_#8f1020]">
                        <Cpu size={40} />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                        {category.label}
                      </span>
                      <p className="mt-2 max-w-xs text-lg font-extrabold leading-tight text-white">
                        {item.name}
                      </p>
                      <span className="mt-4 rounded-sm bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80">
                        {biz.name} · Kharadi Bench
                      </span>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-navy/10 pt-5 font-mono text-xs">
                    <div className="rounded-lg bg-paper p-3">
                      <span className="block text-[10px] uppercase tracking-wider text-navy/60">Store Location</span>
                      <span className="mt-0.5 block font-bold text-navy">Ashoka Nagar, Kharadi</span>
                    </div>
                    <div className="rounded-lg bg-paper p-3">
                      <span className="block text-[10px] uppercase tracking-wider text-navy/60">Support & Setup</span>
                      <span className="mt-0.5 block font-bold text-navy">In-Store Bench Tested</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Details, Specs, Price & Conversion CTAs */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-sm bg-navy px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white">
                        {category.label}
                      </span>
                      {item.tag && (
                        <span className="rounded-sm bg-brand/15 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-brand">
                          {item.tag}
                        </span>
                      )}
                      {item.featured && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-navy/10 px-2.5 py-1 font-mono text-xs font-bold uppercase text-navy">
                          <Sparkles size={12} /> Featured
                        </span>
                      )}
                      {stockStatus === "in_stock" && (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-100 px-2.5 py-1 font-mono text-xs font-bold uppercase text-emerald-800">
                          <CheckCircle2 size={13} /> In Stock
                        </span>
                      )}
                      {stockStatus === "low_stock" && (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-amber-100 px-2.5 py-1 font-mono text-xs font-bold uppercase text-amber-900">
                          <AlertTriangle size={13} /> Low Stock
                        </span>
                      )}
                      {stockStatus === "out_of_stock" && (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-red-100 px-2.5 py-1 font-mono text-xs font-bold uppercase text-red-800">
                          <XCircle size={13} /> Out of Stock
                        </span>
                      )}
                      {stockStatus === "on_order" && (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-blue-100 px-2.5 py-1 font-mono text-xs font-bold uppercase text-blue-900">
                          <Clock size={13} /> Available on Order
                        </span>
                      )}
                    </div>

                    <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl md:text-5xl">
                      {item.name}
                    </h1>

                    {/* Pricing Box */}
                    <div className="mt-6 rounded-xl border-2 border-dashed border-navy/20 bg-paper-light p-5">
                      <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-navy/60">
                        {priced ? "Store Listed Price" : "Live Market Rate"}
                      </span>
                      {priced ? (
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-brand">₹</span>
                          <span className="cut cut-red text-4xl sm:text-5xl">{item.price}</span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <p className="text-2xl font-extrabold text-brand sm:text-3xl">Call for Today's Best Price</p>
                          <p className="mt-1 font-mono text-xs text-navy/65">
                            Configuration & stock prices update daily — ring {biz.phoneDisplay} for exact quote.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mt-6 text-base leading-relaxed text-navy/80 sm:text-lg">
                      {item.description || defaultDescription}
                    </p>

                    {/* Key Highlights / Specifications */}
                    <div className="mt-6">
                      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">
                        Highlights & Specifications
                      </h2>
                      <ul className="mt-3 space-y-2.5">
                        {defaultSpecs.map((spec, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm font-bold text-navy/85 sm:text-base">
                            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 border-t-2 border-dashed border-navy/20 pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <PaperButton href={waProductUrl} external tone="green" icon={<MessageCircle size={20} />}>
                        Enquire on WhatsApp
                      </PaperButton>
                      <PaperButton href={`tel:${biz.phoneTel}`} tone="red" icon={<Phone size={20} />}>
                        Call {biz.phoneDisplay}
                      </PaperButton>
                      <PaperButton href={biz.directions} external tone="navy" icon={<MapPin size={20} />}>
                        Visit Shop in Kharadi
                      </PaperButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related Products in the same Category */}
      {related.length > 0 && (
        <section className="relative bg-paper-dark px-4 pb-24 pt-16 sm:pb-32 sm:pt-24 md:px-8">
          <Torn fill="#ebe2cf" seed={31} position="top" />
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="rounded-sm bg-brand px-2 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white">
                  More in {category.label}
                </span>
                <PaperText as="h2" text="Related Items" tone="navy" className="mt-3 text-[clamp(2rem,6vw,5rem)]" />
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-brand hover:underline"
              >
                View Full Catalog <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel, i) => {
                const relPriced = Boolean(rel.price);
                const relSlug = getProductSlug(rel, category.id);
                return (
                  <Reveal key={`${rel.name}-${i}`} delay={i * 0.08} rotate={[-1, 0.8, -0.5][i % 3]} y={50}>
                    <div className="drop group transition-transform duration-500 hover:-translate-y-2 hover:rotate-0 h-full flex flex-col">
                      <div className="relative flex flex-1 flex-col overflow-hidden rounded-md paper-bg sm:flex-row">
                        <div className={cn("relative hidden w-14 shrink-0 items-center justify-center sm:flex", relPriced ? "bg-brand" : "bg-navy")}>
                          <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-paper-dark" />
                          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-paper-dark" />
                          <span className="-rotate-90 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
                            {category.label}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-navy/20 p-5 flex flex-col justify-between">
                          <div>
                            {rel.tag && (
                              <span className="mb-2 inline-block rounded-sm bg-navy/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">
                                {rel.tag}
                              </span>
                            )}
                            <Link
                              to={`/products/${encodeURIComponent(relSlug)}`}
                              className="block text-xl font-extrabold leading-tight tracking-tight text-navy hover:text-brand"
                            >
                              {rel.name}
                            </Link>
                          </div>
                          <div className="mt-4 flex items-end justify-between border-t border-navy/10 pt-3">
                            {relPriced ? (
                              <p className="flex items-start font-extrabold text-brand">
                                <span className="mr-1 mt-1 text-lg">₹</span>
                                <span className="text-3xl tracking-tight">{rel.price}</span>
                              </p>
                            ) : (
                              <span className="font-mono text-xs font-bold uppercase text-navy/70">Call for price</span>
                            )}
                            <Link
                              to={`/products/${encodeURIComponent(relSlug)}`}
                              className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-brand"
                            >
                              Details <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

