import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { GALLERY } from "../data";
import { Reveal, SectionHead, Torn } from "./ui";

export default function Gallery() {
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    if (sel === null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [sel]);

  return (
    <section id="gallery" className="relative bg-brand px-4 pb-24 pt-16 sm:pb-32 sm:pt-24 md:px-8 md:pt-32">
      <Torn fill="#d9283a" seed={67} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          no="05"
          eyebrow="Inside the shop"
          title="Gallery"
          tone="white"
          dark
          sub="A look at the bench, the shelves and the people who keep your machines running."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 min-[480px]:gap-y-10 md:grid-cols-3 md:gap-x-10 md:gap-y-14">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={(i % 3) * 0.1} rotate={[-3, 2, -1.5, 2.5, -2, 1.5][i]} y={80}>
              <motion.button
                onClick={() => setSel(i)}
                whileHover={{ rotate: 0, scale: 1.05, y: -8, zIndex: 20 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="drop-sm relative block w-full cursor-zoom-in bg-paper-light p-2.5 pb-4 text-left sm:p-3.5 sm:pb-5"
                aria-label={`Open photo: ${g.cap}`}
              >
                <span className="tape absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[3deg]" />
                <div className="aspect-[4/3] overflow-hidden bg-navy/10">
                  <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
                <p className="mt-3 font-serif text-lg italic text-navy sm:text-2xl">{g.cap}</p>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {sel !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
            className="fixed inset-0 z-[180] grid place-items-center overflow-y-auto bg-navy-deep/90 p-3 backdrop-blur-sm sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8, y: 80 }}
              animate={{ scale: 1, rotate: -1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 6 }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 w-full max-w-3xl bg-paper-light p-3 pb-6 shadow-2xl sm:p-5 sm:pb-8"
            >
              <img src={GALLERY[sel].src} alt={GALLERY[sel].alt} className="max-h-[70vh] w-full object-cover" />
              <p className="mt-4 pr-8 font-serif text-xl italic text-navy sm:text-3xl">{GALLERY[sel].cap}</p>
              <button
                onClick={() => setSel(null)}
                aria-label="Close"
                className="absolute right-1 top-1 grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-[0_4px_0_#8f1020] sm:-right-3 sm:-top-3"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
