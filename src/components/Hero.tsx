import { useEffect, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { MapPin, MessageCircle, Phone, Star, ArrowRight } from "lucide-react";
import { Logo, PaperButton, PaperText, useOpenStatus } from "./ui";
import { useData } from "../context/DataContext";

const DEFAULT_START = 2.35; // after preloader

function Shape({
  mx,
  my,
  depth,
  className,
  style,
  scrollRange,
  start = DEFAULT_START,
}: {
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
  depth: number;
  className: string;
  style?: React.CSSProperties;
  scrollRange: ReturnType<typeof useTransform<number, number>>;
  start?: number;
}) {
  const x = useTransform(mx, [-1, 1], [-depth, depth]);
  const y = useTransform(my, [-1, 1], [-depth, depth]);
  return (
    <motion.div style={{ x, y }} className="absolute">
      <motion.div style={{ y: scrollRange }}>
        <motion.div
          initial={{ scale: 0, rotate: -60 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: start + 0.2, type: "spring", stiffness: 100, damping: 12 }}
        >
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5 + depth / 10, repeat: Infinity, ease: "easeInOut" }}
            className={className}
            style={style}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function CircuitBg({ start = DEFAULT_START }: { start?: number }) {
  const paths = [
    "M1200 120 H980 L930 170 H760 L710 220 H520",
    "M1200 260 H1060 L1010 310 H880 L840 350 H700",
    "M1200 420 H1100 L1050 470 H900",
    "M1200 560 H1020 L970 610 H820 L770 660 H600",
    "M1200 700 H1120 L1080 740 H960",
  ];
  const nodes = [
    [520, 220],
    [700, 350],
    [900, 470],
    [600, 660],
    [960, 740],
  ];
  return (
    <svg viewBox="0 0 1200 800" className="absolute right-0 top-0 h-full w-[85%] opacity-[0.16]" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="#0e1c4a"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: start + 0.3 + i * 0.2, duration: 2.2, ease: "easeInOut" }}
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="9"
          fill="#d9283a"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          transition={{ delay: start + 1.5 + i * 0.2, type: "spring" }}
        />
      ))}
    </svg>
  );
}

function SpinBadge({ start = DEFAULT_START }: { start?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: start + 0.5, type: "spring", stiffness: 70, damping: 11 }}
      className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36 lg:h-48 lg:w-48"
    >
      <div className="drop-sm absolute inset-0 rounded-full bg-brand" />
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circ" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text fill="#fffcf5" fontFamily="JetBrains Mono, monospace" fontSize="15.5" fontWeight="700" letterSpacing="3.2">
          <textPath href="#circ">NEW • REFURBISHED • REPAIRS • UPGRADES •</textPath>
        </text>
      </svg>
      <div className="absolute inset-[27%] grid place-items-center rounded-full bg-paper-light shadow-inner">
        <Logo className="h-3/5 w-3/5" />
      </div>
    </motion.div>
  );
}

function useIsMd() {
  const [md, setMd] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setMd(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return md;
}

function Note({
  children,
  className,
  delay,
  rotate,
  float = 6,
  start = DEFAULT_START,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  rotate: number;
  float?: number;
  start?: number;
}) {
  const md = useIsMd();
  const tilt = md ? rotate : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: -80, rotate: tilt * 4 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ delay: start + delay, type: "spring", stiffness: 80, damping: 12 }}
    >
      <motion.div
        animate={{ y: [0, -float, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero({ instant = false }: { instant?: boolean }) {
  const START = instant ? 0.05 : DEFAULT_START;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 15 });
  const smy = useSpring(my, { stiffness: 50, damping: 15 });
  const { scrollY } = useScroll();
  const s1 = useTransform(scrollY, [0, 700], [0, -140]);
  const s2 = useTransform(scrollY, [0, 700], [0, 90]);
  const textY = useTransform(scrollY, [0, 700], [0, 60]);
  const status = useOpenStatus();
  const { data } = useData();
  const BIZ = data.biz;
  const WA_LINK = `https://wa.me/${BIZ.whatsapp}?text=${encodeURIComponent(
    "Hello " + BIZ.name + ", I'd like to know more about your products and services.",
  )}`;

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-24 sm:min-h-screen sm:pb-24 sm:pt-28 md:pt-36">
      <CircuitBg start={START} />

      {/* floating paper shapes */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute right-[8%] top-[20%]">
          <Shape start={START} mx={smx} my={smy} depth={30} scrollRange={s1} className="drop-sm h-24 w-24 rounded-full bg-brand" />
        </div>
        <div className="absolute left-[44%] top-[11%]">
          <Shape start={START} mx={smx} my={smy} depth={50} scrollRange={s2} className="drop-sm h-14 w-14 rotate-12 rounded-md bg-navy" />
        </div>
        <div className="absolute bottom-[14%] right-[30%]">
          <Shape
            start={START}
            mx={smx}
            my={smy}
            depth={40}
            scrollRange={s1}
            className="drop-sm h-20 w-20 bg-brand"
            style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
          />
        </div>
        <div className="absolute bottom-[26%] left-[3%]">
          <Shape start={START} mx={smx} my={smy} depth={25} scrollRange={s2} className="drop-sm h-12 w-12 rounded-full border-[10px] border-navy bg-transparent" />
        </div>
      </div>

      <motion.div style={{ y: textY }} className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: START }}
          className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 sm:mb-6 sm:gap-3"
        >
          <span className="rounded-sm bg-navy px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[3px_3px_0_#d9283a] sm:px-3 sm:text-[11px] sm:tracking-[0.25em]">
            {BIZ.heroEyebrow || "Computer store · Kharadi, Pune"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm bg-paper-light px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-navy shadow-[3px_3px_0_rgba(14,28,74,.25)] sm:px-3 sm:text-[11px]">
            <span className={`h-2 w-2 rounded-full ${status.open ? "pulse-dot bg-green-500" : "bg-brand"}`} />
            {status.label}
          </span>
        </motion.div>

        <h1 className="sr-only">
          {BIZ.heroTitle1 || "Your"} {BIZ.heroTitle2 || "Technology"} {BIZ.heroTitle3 || "Partner"} {BIZ.heroLocation || "in Kharadi, Pune"}
        </h1>

        <div aria-hidden="true" className="flex items-end justify-between gap-4">
          <PaperText text={BIZ.heroTitle1 || "Your"} tone="navy" delay={START} className="text-[clamp(2.15rem,11.5vw,12rem)]" />
          <div className="mb-2 hidden sm:block">
            <SpinBadge start={START} />
          </div>
        </div>
        <PaperText text={BIZ.heroTitle2 || "Technology"} tone="red" delay={START + 0.25} className="text-[clamp(1.75rem,10.2vw,11.5rem)]" />
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <PaperText text={BIZ.heroTitle3 || "Partner"} tone="navy" delay={START + 0.75} className="text-[clamp(2.05rem,11.5vw,12rem)]" />
          <motion.span
            initial={{ opacity: 0, x: -40, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ delay: START + 1.5, type: "spring", stiffness: 70 }}
            className="relative mb-2 font-serif text-[clamp(1.35rem,4.8vw,4.2rem)] italic leading-none text-navy"
          >
            {BIZ.heroLocation || "in Kharadi, Pune"}
            <motion.svg
              viewBox="0 0 300 14"
              className="absolute -bottom-3 left-0 w-full"
              fill="none"
              stroke="#d9283a"
              strokeWidth="5"
              strokeLinecap="round"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M3 9 C60 2, 110 14, 170 6 S270 4, 297 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: START + 2, duration: 0.9 }}
              />
            </motion.svg>
          </motion.span>
        </div>

        <div className="mt-7 grid items-end gap-7 sm:mt-12 md:gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + 1.2, duration: 0.7 }}
              className="max-w-xl text-base font-medium leading-relaxed text-navy/80 sm:text-lg md:text-xl"
            >
              {BIZ.heroDescription ||
                "New and refurbished laptops, expert repairs, upgrades and accessories, all under one roof."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + 1.4, type: "spring", stiffness: 80 }}
              className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mt-8 sm:flex sm:flex-row sm:flex-wrap sm:gap-4"
            >
              <PaperButton href="/products" tone="navy" icon={<ArrowRight size={20} />} className="w-full sm:w-auto">
                Explore Products
              </PaperButton>
              <PaperButton href={`tel:${BIZ.phoneTel}`} tone="red" icon={<Phone size={20} />} className="w-full sm:w-auto">
                Call Now
              </PaperButton>
              <PaperButton href={WA_LINK} tone="green" external icon={<MessageCircle size={20} />} className="w-full sm:w-auto">
                WhatsApp
              </PaperButton>
              <PaperButton href={BIZ.directions} tone="white" external icon={<MapPin size={20} />} className="w-full sm:w-auto">
                Get Directions
              </PaperButton>
            </motion.div>
          </div>

          {/* paper notes: stacked and readable on phones, collage on tablet+ */}
          <div className="relative mx-auto flex w-full max-w-[520px] flex-col gap-4 md:h-[270px] md:items-center md:justify-center">
            <Note start={START} delay={1.0} rotate={-5} className="drop-sm relative w-full rounded-sm paper-bg p-5 md:absolute md:left-0 md:top-2 md:w-[62%]">
              <span className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg]" />
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="cut cut-red text-5xl sm:text-6xl">4.8</span>
                <div className="flex text-brand">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-3 font-mono text-[11px] font-bold uppercase leading-snug tracking-wide text-navy/70">
                148 Google reviews
                <br />
                4.8/5 · 144 votes on Justdial
              </p>
            </Note>
            <Note start={START} delay={1.2} rotate={4} float={9} className="drop-sm relative w-full rounded-sm paper-navy-bg p-5 text-white md:absolute md:right-0 md:top-14 md:w-[48%]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Specialists in</p>
              <p className="mt-1 text-xl font-extrabold leading-tight sm:text-2xl">Chip-level repair</p>
              <p className="mt-2 text-sm text-white/70">Laptops &amp; desktops</p>
            </Note>
            <Note start={START} delay={1.4} rotate={-2} float={7} className="drop-sm relative w-full rounded-sm paper-red-bg p-4 text-white md:absolute md:bottom-0 md:left-[16%] md:w-[58%]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Walk in or call</p>
              <a href={`tel:${BIZ.phoneTel}`} className="mt-1 block text-xl font-extrabold tracking-tight sm:text-2xl">
                {BIZ.phoneDisplay}
              </a>
            </Note>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
