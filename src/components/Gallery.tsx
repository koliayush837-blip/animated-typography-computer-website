import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Image as ImageIcon, Plus } from "lucide-react";
import { Reveal, SectionHead, Torn } from "./ui";
import { useData } from "../context/DataContext";
import { GALLERY } from "../data";

export default function Gallery() {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const rawGallery = data.gallery && data.gallery.length > 0 ? data.gallery : GALLERY;
  const gallery = rawGallery.filter((g) => g.src && !g.src.includes("img_1794481317103_6be9a83ede6a.png"));
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    if (sel === null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [sel]);

  return (
    <section id="gallery" className="relative bg-brand px-4 pb-24 pt-8 sm:pb-28 sm:pt-10 md:px-8 md:pt-12">
      <Torn fill="#d9283a" seed={67} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <SectionHead
            no="05"
            eyebrow="Inside the shop"
            title="Gallery"
            tone="white"
            dark
            sub="A look at the bench, the shelves and the people who keep your machines running."
            className="mb-4 md:mb-5"
          />

          <div className="mb-4 flex items-center gap-2 md:mb-5">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/30 bg-paper-light/10 px-4 py-2.5 text-xs font-bold text-white shadow-sm backdrop-blur transition-all hover:bg-white hover:text-navy"
            >
              <ImageIcon size={14} />
              {isAdminAuthenticated ? "Manage Gallery Photos" : "Gallery Admin"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-7 min-[480px]:grid-cols-2 min-[480px]:gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-10">
          {gallery.map((g, i) => (
            <Reveal key={`${g.src}-${i}`} delay={(i % 3) * 0.08} rotate={[-2.2, 1.6, -1.2, 1.8, -1.5, 1.2][i % 6]} y={30}>
              <motion.button
                onClick={() => setSel(i)}
                whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 20 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="drop-sm relative block w-full cursor-zoom-in bg-paper-light p-2.5 pb-3.5 text-left sm:p-3 sm:pb-4"
                aria-label={`Open photo: ${g.cap}`}
              >
                <span className="tape absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[3deg]" />
                <div className="aspect-[16/10] overflow-hidden bg-navy/10">
                  <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
                <p className="mt-2.5 font-serif text-lg italic text-navy sm:text-xl">{g.cap}</p>
              </motion.button>
            </Reveal>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-white/40 p-12 text-center text-white">
            <p className="text-lg font-extrabold">No gallery photos added yet.</p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-navy shadow-lg"
            >
              <Plus size={16} /> Add First Photo
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {sel !== null && gallery[sel] && (
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
              <img src={gallery[sel].src} alt={gallery[sel].alt} className="max-h-[70vh] w-full object-cover" />
              <p className="mt-4 pr-8 font-serif text-xl italic text-navy sm:text-3xl">{gallery[sel].cap}</p>
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
