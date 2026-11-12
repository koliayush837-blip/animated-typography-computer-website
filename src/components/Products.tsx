import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  Plus,
  Settings,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  ArrowRight,
  X,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { PaperButton, Reveal, SectionHead, Torn } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";
import { getProductSlug, type Item } from "../data";
import { Link } from "../utils/router";

interface ProductsProps {
  mode?: "catalog" | "featured";
  sectionNo?: string;
}

export default function Products({ mode = "catalog", sectionNo = "02" }: ProductsProps) {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const catalog = data.catalog;
  const biz = data.biz;

  const [active, setActive] = useState<string>(() => "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Flatten all products with their category info
  const allProducts = useMemo(() => {
    const list: { item: Item; categoryId: string; categoryLabel: string; index: number }[] = [];
    for (const cat of catalog) {
      cat.items.forEach((item, index) => {
        list.push({
          item,
          categoryId: cat.id,
          categoryLabel: cat.label,
          index,
        });
      });
    }
    return list;
  }, [catalog]);

  // Featured products for homepage mode
  const featuredProducts = useMemo(() => {
    const explicitFeatured = allProducts.filter((p) => p.item.featured);
    if (explicitFeatured.length > 0) {
      return explicitFeatured.slice(0, 6);
    }
    const picks: typeof allProducts = [];
    for (const cat of catalog) {
      if (cat.items.length > 0 && picks.length < 6) {
        picks.push({
          item: cat.items[0],
          categoryId: cat.id,
          categoryLabel: cat.label,
          index: 0,
        });
      }
    }
    return picks.slice(0, 6);
  }, [allProducts, catalog]);

  // Filtered products for catalog mode
  const currentActive =
    active === "all" || catalog.some((c) => c.id === active)
      ? active
      : catalog[0]?.id || "all";

  const filteredProducts = useMemo(() => {
    if (mode === "featured") return featuredProducts;

    let base =
      currentActive === "all"
        ? allProducts
        : allProducts.filter((p) => p.categoryId === currentActive);

    if (stockFilter !== "all") {
      base = base.filter((p) => (p.item.stockStatus || "in_stock") === stockFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      base = base.filter(
        (p) =>
          p.item.name.toLowerCase().includes(q) ||
          (p.item.tag && p.item.tag.toLowerCase().includes(q)) ||
          (p.item.description && p.item.description.toLowerCase().includes(q)) ||
          p.categoryLabel.toLowerCase().includes(q),
      );
    }

    return base;
  }, [mode, featuredProducts, currentActive, allProducts, stockFilter, searchQuery]);

  return (
    <section id="products" className="relative bg-paper-dark px-4 pb-24 pt-12 sm:pb-28 sm:pt-16 md:px-8 md:pt-20">
      <Torn fill="#ebe2cf" seed={31} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <SectionHead
            no={sectionNo}
            eyebrow={mode === "featured" ? "Featured on the shelf" : "What's on the shelf"}
            title={mode === "featured" ? "Featured Products" : "Products"}
            tone="red"
            sub={
              mode === "featured"
                ? "Top picks across laptops, monitors, printers and accessories. Tap any product for full specifications."
                : "Prices as listed. Anything marked 'Call for price' changes with stock, so ring us for today's best rate."
            }
            className="mb-4 md:mb-6"
          />

          <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-navy/20 bg-paper-light px-4 py-2.5 text-xs font-bold text-navy shadow-sm transition-all hover:bg-navy hover:text-white"
            >
              <Settings size={15} />
              {isAdminAuthenticated ? "Manage Products & Pricing" : "Store Admin"}
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls (Catalog Mode) */}
        {mode === "catalog" && (
          <Reveal y={25}>
            <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="relative flex min-h-[48px] items-center rounded-xl border-2 border-navy/20 bg-paper-light px-3.5 py-2 shadow-[0_3px_0_rgba(14,28,74,.12)] focus-within:border-brand sm:px-4">
                <Search size={18} className="mr-2.5 shrink-0 text-navy/50 sm:mr-3" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, monitors, printers, accessories..."
                  aria-label="Search products"
                  className="w-full min-w-0 bg-transparent text-sm font-bold text-navy placeholder:font-medium placeholder:text-navy/45 focus:outline-none sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-navy/50 hover:bg-navy/10 hover:text-navy"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {[
                  { id: "all", label: "All Stock" },
                  { id: "in_stock", label: "In Stock" },
                  { id: "low_stock", label: "Low Stock" },
                  { id: "on_order", label: "On Order" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStockFilter(s.id)}
                    className={cn(
                      "min-h-[44px] shrink-0 rounded-xl px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all",
                      stockFilter === s.id
                        ? "bg-brand text-white shadow-[0_3px_0_#8f1020]"
                        : "bg-paper-light/80 text-navy/75 hover:bg-paper-light hover:text-navy",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Product categories"
              className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-5 pt-1 snap-x snap-mandatory md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:snap-none"
            >
              <button
                role="tab"
                aria-selected={currentActive === "all"}
                onClick={() => setActive("all")}
                className={cn(
                  "relative min-h-[44px] shrink-0 snap-start rounded-t-lg px-4 py-2.5 text-sm font-bold tracking-tight transition-colors sm:px-5 md:text-base",
                  currentActive === "all" ? "text-white" : "text-navy hover:text-brand",
                )}
              >
                {currentActive === "all" && (
                  <motion.span
                    layoutId="tab-paper"
                    className="absolute inset-0 rounded-lg bg-navy shadow-[0_5px_0_#050b22,0_12px_18px_rgba(5,11,34,.3)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {currentActive !== "all" && (
                  <span className="absolute inset-0 -z-0 rounded-lg bg-paper-light/70 shadow-[0_2px_0_rgba(14,28,74,.15)]" />
                )}
                <span className="relative">All ({allProducts.length})</span>
              </button>

              {catalog.map((c) => {
                const on = c.id === currentActive;
                return (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(c.id)}
                    className={cn(
                      "relative min-h-[44px] shrink-0 snap-start rounded-t-lg px-4 py-2.5 text-sm font-bold tracking-tight transition-colors sm:px-5 md:text-base",
                      on ? "text-white" : "text-navy hover:text-brand",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="tab-paper"
                        className="absolute inset-0 rounded-lg bg-navy shadow-[0_5px_0_#050b22,0_12px_18px_rgba(5,11,34,.3)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {!on && (
                      <span className="absolute inset-0 -z-0 rounded-lg bg-paper-light/70 shadow-[0_2px_0_rgba(14,28,74,.15)]" />
                    )}
                    <span className="relative">
                      {c.label} ({c.items.length})
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${currentActive}-${stockFilter}-${searchQuery}`}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
              exit: { transition: { staggerChildren: 0.02 } },
            }}
            className="mt-5 grid grid-cols-1 gap-x-5 gap-y-7 min-[520px]:grid-cols-2 sm:gap-x-7 sm:gap-y-9 lg:grid-cols-3"
          >
            {filteredProducts.map(({ item: it, categoryId, categoryLabel }, i) => {
              const priced = Boolean(it.price);
              const slug = getProductSlug(it, categoryId);
              const detailUrl = `/products/${encodeURIComponent(slug)}`;
              const waItemUrl = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
                `Hello ${biz.name}, I'm interested in "${it.name}" (${categoryLabel})${
                  it.price ? ` listed at ₹${it.price}` : ""
                }. Is it available?`,
              )}`;

              return (
                <motion.div
                  key={`${categoryId}-${it.name}-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: -30, rotate: (i % 2 ? 1 : -1) * 3 },
                    show: {
                      opacity: 1,
                      y: 0,
                      rotate: [-1.1, 0.8, -0.5][i % 3],
                      transition: { type: "spring", stiffness: 120, damping: 14 },
                    },
                    exit: { opacity: 0, y: 20, transition: { duration: 0.15 } },
                  }}
                  className="min-w-0"
                >
                  <div className="drop group flex h-full flex-col transition-transform duration-500 hover:-translate-y-2 hover:rotate-0">
                    <div className="relative flex flex-1 flex-col overflow-hidden rounded-md paper-bg md:flex-row">
                      {/* Ticket stub spine on tablet/desktop */}
                      <div
                        className={cn(
                          "relative hidden w-14 shrink-0 items-center justify-center md:flex",
                          priced ? "bg-brand" : "bg-navy",
                        )}
                      >
                        <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-paper-dark" />
                        <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-paper-dark" />
                        <span className="-rotate-90 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
                          {categoryLabel}
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between border-t-2 border-dashed border-navy/20 p-4 sm:p-5 md:border-l-2 md:border-t-0">
                        <div>
                          {/* Consistent 4:3 Product Image if present */}
                          {it.image && (
                            <Link
                              to={detailUrl}
                              className="mb-3.5 block aspect-[4/3] w-full overflow-hidden rounded-lg border border-navy/10 bg-navy/5"
                            >
                              <img
                                src={it.image}
                                alt={it.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </Link>
                          )}

                          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                            <span className="inline-block rounded-sm bg-navy px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white md:hidden">
                              {categoryLabel}
                            </span>

                            {it.featured && (
                              <span className="inline-flex items-center gap-1 rounded-sm bg-brand/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
                                <Sparkles size={10} /> Featured
                              </span>
                            )}

                            {it.tag && (
                              <span className="inline-block rounded-sm bg-navy/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">
                                {it.tag}
                              </span>
                            )}

                            {(!it.stockStatus || it.stockStatus === "in_stock") && (
                              <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-800">
                                <CheckCircle2 size={10} /> In Stock
                              </span>
                            )}
                            {it.stockStatus === "low_stock" && (
                              <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-900">
                                <AlertTriangle size={10} /> Low Stock
                              </span>
                            )}
                            {it.stockStatus === "out_of_stock" && (
                              <span className="inline-flex items-center gap-1 rounded-sm bg-red-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-red-800">
                                <XCircle size={10} /> Out of Stock
                              </span>
                            )}
                            {it.stockStatus === "on_order" && (
                              <span className="inline-flex items-center gap-1 rounded-sm bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-blue-900">
                                <Clock size={10} /> On Order
                              </span>
                            )}
                          </div>

                          <Link
                            to={detailUrl}
                            className="block break-words text-lg font-extrabold leading-snug tracking-tight text-navy transition-colors hover:text-brand sm:min-h-[2.8rem] sm:text-xl"
                          >
                            {it.name}
                          </Link>

                          {it.description && (
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-navy/65">
                              {it.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy/10 pt-3">
                          {priced ? (
                            <p className="flex items-start font-extrabold text-brand">
                              <span className="mr-1 mt-1 text-base sm:text-lg">₹</span>
                              <span className="text-2xl tracking-tight sm:text-3xl md:text-4xl">{it.price}</span>
                            </p>
                          ) : (
                            <a
                              href={`tel:${biz.phoneTel}`}
                              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-navy/10 px-3.5 py-2 text-xs font-extrabold text-navy transition-colors hover:bg-brand hover:text-white sm:text-sm"
                            >
                              <Phone size={14} /> Call for price
                            </a>
                          )}

                          <div className="flex items-center gap-1.5">
                            <a
                              href={waItemUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={`Enquire about ${it.name} on WhatsApp`}
                              aria-label={`Enquire about ${it.name} on WhatsApp`}
                              className="grid h-11 w-11 place-items-center rounded-lg bg-[#1f9d55]/15 text-[#1f9d55] transition-colors hover:bg-[#1f9d55] hover:text-white"
                            >
                              <MessageCircle size={17} />
                            </a>
                            <Link
                              to={detailUrl}
                              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg bg-navy/5 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-navy transition-colors hover:bg-navy hover:text-white"
                            >
                              Details <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full rounded-2xl border-2 border-dashed border-navy/25 bg-paper-light/50 p-8 text-center sm:p-12">
                <p className="text-lg font-extrabold text-navy">
                  {searchQuery || stockFilter !== "all"
                    ? "No matching products found for your filter."
                    : "No products added in this category yet."}
                </p>
                {searchQuery || stockFilter !== "all" ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStockFilter("all");
                      setActive("all");
                    }}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#050b22]"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#8f1020]"
                  >
                    <Plus size={16} /> Add First Product
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {mode === "featured" ? (
          <Reveal y={30} delay={0.1}>
            <div className="mt-12 flex flex-col items-stretch justify-between gap-4 border-t-2 border-dashed border-navy/15 pt-8 sm:flex-row sm:items-center">
              <p className="font-mono text-xs uppercase tracking-widest text-navy/70">
                Showing {filteredProducts.length} of {allProducts.length} available products across {catalog.length} categories.
              </p>
              <PaperButton href="/products" tone="red" icon={<ArrowRight size={18} />} className="w-full sm:w-auto">
                View All Products ({allProducts.length})
              </PaperButton>
            </div>
          </Reveal>
        ) : (
          <Reveal y={30} delay={0.1}>
            <p className="mt-12 font-mono text-xs uppercase tracking-widest text-navy/60 sm:mt-16">
              Can't see what you need? Call {biz.phoneDisplay} and ask, or walk in and see the full range.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
