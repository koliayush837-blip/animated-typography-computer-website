import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { useData } from "../context/DataContext";

export default function StickyBar() {
  const { data } = useData();
  const biz = data.biz;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    "Hello " + biz.name + ", I'd like to know more about your products and services.",
  )}`;

  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="fixed inset-x-0 bottom-0 z-[120] grid grid-cols-2 gap-3 bg-paper-light/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(8,18,47,.25)] backdrop-blur md:hidden"
        >
          <a
            href={`tel:${biz.phoneTel}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-bold text-white shadow-[0_4px_0_#8f1020] active:translate-y-1 active:shadow-none"
          >
            <Phone size={18} /> Call
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1f9d55] py-3.5 font-bold text-white shadow-[0_4px_0_#0f6b37] active:translate-y-1 active:shadow-none"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
