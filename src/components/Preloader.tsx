import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo, PaperText } from "./ui";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setLeave(true), 1900);
    const t2 = setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const ease = [0.76, 0, 0.24, 1] as const;
  const panels = ["#d9283a", "#0e1c4a", "#f5efe3"];

  return (
    <div className="fixed inset-0 z-[200]" aria-hidden="true">
      {panels.map((c, i) => (
        <motion.div
          key={c}
          className="absolute inset-0"
          style={{ background: c, filter: "drop-shadow(0 10px 20px rgba(0,0,0,.3))" }}
          initial={{ y: 0 }}
          animate={{ y: leave ? "-110%" : 0 }}
          transition={{ duration: 0.95, ease, delay: leave ? (2 - i) * 0.12 : 0 }}
        />
      ))}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-4"
        animate={{ y: leave ? "-120%" : 0, opacity: leave ? 0 : 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="drop-sm rounded-2xl bg-paper-light p-4"
        >
          <Logo className="h-16 w-16" />
        </motion.div>
        <PaperText text="Padmashree" tone="navy" stagger={0.05} delay={0.3} className="text-[clamp(2.5rem,12vw,7rem)]" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="px-4 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-navy/70 sm:text-xs sm:tracking-[0.35em]"
        >
          Computers · Your Technology Partner
        </motion.p>
      </motion.div>
    </div>
  );
}
