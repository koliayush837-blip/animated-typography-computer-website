import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { HeartHandshake, IndianRupee, Star, Wrench, Zap } from "lucide-react";
import { Reveal, SectionHead, Torn } from "./ui";

const STATEMENT =
  "Expert technicians. Transparent pricing. Quick service. Customer satisfaction. That is how a Kharadi computer shop earned a 4.8 rating, one repair at a time.";

function ScrollWords() {
  const words = STATEMENT.split(" ");
  return (
    <p className="max-w-4xl text-[clamp(1.15rem,2.2vw,1.9rem)] font-extrabold leading-[1.22] tracking-tight text-paper-light">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.2, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 + i * 0.02, duration: 0.35 }}
          className="mr-[0.25em] inline-block"
        >
          {w}
        </motion.span>
      ))}
    </p>
  );
}

function Counter() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, 4.8, { duration: 1.4, ease: "easeOut", onUpdate: (n) => setV(n) });
    return () => c.stop();
  }, []);
  return (
    <span className="cut cut-red text-[clamp(3.8rem,12vw,8.5rem)]">
      {v.toFixed(1)}
    </span>
  );
}

const pillars = [
  { icon: Wrench, title: "Expert technicians", text: "Hands-on engineers who diagnose properly, and explain what they find in plain language." },
  { icon: IndianRupee, title: "Transparent pricing", text: "You know the cost before we start. No surprise add-ons at the counter." },
  { icon: Zap, title: "Quick turnaround", text: "Many repairs, like screen replacement, are done within the hour." },
  { icon: HeartHandshake, title: "Customer satisfaction", text: "Polite, friendly, helpful. It's what our customers say first." },
];

export default function Why() {
  return (
    <section id="why" className="relative bg-navy px-4 pb-20 pt-8 text-white sm:pb-24 sm:pt-10 md:px-8 md:pt-12">
      <Torn fill="#0e1c4a" seed={41} position="top" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]" aria-hidden="true">
        <svg className="h-full w-full">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="#fff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <SectionHead no="03" eyebrow="Why choose us" title="Trust, repaired" tone="white" dark className="mb-4 md:mb-5" />

        <ScrollWords />

        <div className="mt-6 grid items-center gap-6 sm:mt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <Reveal rotate={-2} y={30}>
            <div className="drop-sm relative mx-auto max-w-sm">
              <div className="paper-bg relative rounded-md p-5 text-center text-navy sm:p-6">
                <span className="tape absolute -top-3.5 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2" />
                <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-navy/60">Google rating</p>
                <Counter />
                <div className="mt-1.5 flex justify-center gap-1.5 text-brand">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.25 + i * 0.1, type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <Star size={26} fill="currentColor" />
                    </motion.span>
                  ))}
                </div>
                <p className="mt-3 text-base font-bold sm:text-lg">148 Google reviews</p>
                <p className="mt-0.5 text-xs font-medium text-navy/60 sm:text-sm">Also 4.8/5 from 144 votes on Justdial</p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} rotate={[1, -1, -0.6, 0.8][i]} y={30}>
                <div className="drop-sm h-full transition-transform duration-500 hover:-translate-y-2 hover:rotate-0">
                  <div className="paper-bg h-full rounded-md p-5 text-navy">
                    <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-brand text-white shadow-[0_4px_0_#8f1020]">
                      <p.icon size={22} />
                    </div>
                    <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy/70">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
