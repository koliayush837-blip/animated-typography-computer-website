import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Plus, Settings } from "lucide-react";
import { Reveal, SectionHead, Torn } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";

export default function Products() {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const catalog = data.catalog;
  const biz = data.biz;

  const [active, setActive] = useState(() => catalog[0]?.id || "laptops");

  // Fallback if active category was deleted
  const currentActive = catalog.some((c) => c.id === active) ? active : catalog[0]?.id || "laptops";
  const cat = catalog.find((c) => c.id === currentActive) || catalog[0];

  return (
    <section id="products" className="relative bg-paper-dark px-4 pb-24 pt-16 sm:pb-32 sm:pt-24 md:px-8 md:pt-32">
      <Torn fill="#ebe2cf" seed={31} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <SectionHead
            no="02"
            eyebrow="What's on the shelf"
            title="Products"
            tone="red"
            sub="Prices as listed. Anything marked 'Call for price' changes with stock, so ring us for today's best rate."
            className="mb-6 md:mb-12"
          />

          <div className="mb-8 flex items-center gap-2 md:mb-12">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-paper-light px-3.5 py-2 text-xs font-bold text-navy shadow-sm transition-all hover:bg-navy hover:text-white"
            >
              <Settings size={14} />
              {isAdminAuthenticated ? "Manage Products & Pricing" : "Store Admin"}
            </button>
          </div>
        </div>

        {/* tabs */}
        <Reveal y={30}>
          <div role="tablist" aria-label="Product categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-6 pt-2 snap-x snap-mandatory md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:snap-none">
            {catalog.map((c) => {
              const on = c.id === currentActive;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(c.id)}
                  className={cn(
                    "relative shrink-0 snap-start rounded-t-lg px-4 py-3 text-sm font-bold tracking-tight transition-colors sm:px-5 md:text-base",
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
                  {!on && <span className="absolute inset-0 -z-0 rounded-lg bg-paper-light/70 shadow-[0_2px_0_rgba(14,28,74,.15)]" />}
                  <span className="relative">
                    {c.label} ({c.items.length})
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {cat && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActive}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
                exit: { transition: { staggerChildren: 0.02 } },
              }}
              className="mt-6 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
            >
              {cat.items.map((it, i) => {
                const priced = Boolean(it.price);
                return (
                  <motion.div
                    key={`${it.name}-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: -40, rotate: (i % 2 ? 1 : -1) * 4 },
                      show: { opacity: 1, y: 0, rotate: [-1.2, 0.8, -0.5][i % 3], transition: { type: "spring", stiffness: 120, damping: 13 } },
                      exit: { opacity: 0, y: 30, transition: { duration: 0.15 } },
                    }}
                  >
                    <div className="drop group transition-transform duration-500 hover:-translate-y-2 hover:rotate-0">
                      <div className="relative flex overflow-hidden rounded-md paper-bg">
                        {/* ticket stub */}
                        <div className={cn("relative hidden w-14 shrink-0 items-center justify-center sm:flex", priced ? "bg-brand" : "bg-navy")}>
                          <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-paper-dark" />
                          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-paper-dark" />
                          <span className="-rotate-90 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
                            {cat.label}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 border-l-2 border-dashed border-navy/20 p-4 sm:p-5">
                          {it.tag && (
                            <span className="mb-3 inline-block rounded-sm bg-navy/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">
                              {it.tag}
                            </span>
                          )}
                          <h3 className="text-lg font-extrabold leading-tight tracking-tight text-navy sm:min-h-[3.2rem] sm:text-xl">{it.name}</h3>
                          <div className="mt-4 flex items-end justify-between">
                            {priced ? (
                              <p className="flex items-start font-extrabold text-brand">
                                <span className="mr-1 mt-1 text-lg">₹</span>
                                <span className="text-3xl tracking-tight sm:text-4xl">{it.price}</span>
                              </p>
                            ) : (
                              <a
                                href={`tel:${biz.phoneTel}`}
                                className="inline-flex items-center gap-2 rounded-md bg-navy/5 px-3 py-2 text-sm font-bold text-navy transition-colors hover:bg-brand hover:text-white"
                              >
                                <Phone size={14} /> Call for price
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {cat.items.length === 0 && (
                <div className="col-span-full rounded-2xl border-2 border-dashed border-navy/25 p-12 text-center bg-paper-light/50">
                  <p className="text-lg font-extrabold text-navy">No products added in "{cat.label}" yet.</p>
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#8f1020]"
                  >
                    <Plus size={16} /> Add First Product
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <Reveal y={30} delay={0.1}>
          <p className="mt-16 font-mono text-xs uppercase tracking-widest text-navy/60">
            Can't see what you need? Call {biz.phoneDisplay} and ask, or walk in and see the full range.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
