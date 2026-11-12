import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "../utils/cn";
import { HOURS } from "../data";
import { useRouter } from "../utils/router";

/* ------------------------------------------------------------------ */
/* Logo: red + navy "P" with a circuit-style look                      */
/* ------------------------------------------------------------------ */
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="5" width="10" height="38" rx="2" fill="#0e1c4a" />
      <path d="M16 5h12a12 12 0 0 1 0 24H16v-8h11a4 4 0 0 0 0-8H16z" fill="#d9283a" />
      <g stroke="#0e1c4a" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M11 43v3M11 46h6" />
        <path d="M40 17h5" />
        <path d="M28 29l5 6h6" />
      </g>
      <g fill="#fffcf5" stroke="#0e1c4a" strokeWidth="1.4">
        <circle cx="18" cy="46" r="1.8" />
        <circle cx="45.5" cy="17" r="1.8" />
        <circle cx="40" cy="35" r="1.8" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* PaperText: letters drop in like cut-out paper pieces                */
/* ------------------------------------------------------------------ */
const letterVariants: Variants = {
  hidden: (i: number) => ({
    y: -110,
    opacity: 0,
    rotate: ((i * 37) % 17) - 8,
    scale: 1.15,
  }),
  show: {
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 160, damping: 13, mass: 0.8 },
  },
};

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, div: motion.div } as const;

export function PaperText({
  text,
  className,
  tone = "navy",
  delay = 0,
  stagger = 0.04,
  as = "div",
  label,
}: {
  text: string;
  className?: string;
  tone?: "navy" | "red" | "white" | "cream";
  delay?: number;
  stagger?: number;
  as?: keyof typeof tags;
  label?: string;
}) {
  const Tag = tags[as];
  const words = useMemo(() => text.split(" "), [text]);
  let idx = 0;
  return (
    <Tag
      aria-label={label ?? text}
      className={cn("cut max-w-full", `cut-${tone}`, className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span aria-hidden="true" className="inline-block whitespace-nowrap">
            {w.split("").map((ch) => {
              const i = idx++;
              return (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  whileHover={{ y: -10, rotate: i % 2 ? 5 : -5, transition: { type: "spring", stiffness: 300 } }}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal: sheets of paper sliding & settling                          */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  rotate = 0,
  y = 70,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
  y?: number;
  x?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, rotate: rotate * 3 + (x ? 3 : 0), scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, x: 0, rotate, scale: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ type: "spring", stiffness: 70, damping: 16, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Torn paper edge                                                     */
/* ------------------------------------------------------------------ */
function tornPath(seed: number, n = 64) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let d = "M0 0 L0 12";
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const y = 6 + rnd() * 12 + (i % 5 === 0 ? 3 : 0);
    d += ` L${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += " L100 0 Z";
  return d;
}

export function Torn({
  fill,
  seed = 7,
  position = "top",
  className,
}: {
  fill: string;
  seed?: number;
  position?: "top" | "bottom";
  className?: string;
}) {
  const d = useMemo(() => tornPath(seed), [seed]);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-0 right-0 z-10 h-[26px] md:h-[34px]",
        position === "top" ? "-top-[25px] md:-top-[33px]" : "-bottom-[25px] md:-bottom-[33px]",
        className,
      )}
      style={{ filter: "drop-shadow(0 -3px 4px rgba(8,18,47,.18))" }}
    >
      <svg
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="h-full w-full"
        style={{ transform: position === "top" ? "scaleY(-1)" : undefined, display: "block" }}
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
export function SectionHead({
  no,
  eyebrow,
  title,
  sub,
  tone = "navy",
  dark = false,
  className,
}: {
  no: string;
  eyebrow: string;
  title: string;
  sub?: string;
  tone?: "navy" | "red" | "white" | "cream";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-20", className)}>
      <Reveal y={20}>
        <div
          className={cn(
            "mb-5 inline-flex max-w-full flex-wrap items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] sm:mb-6 sm:gap-3 sm:text-xs sm:tracking-[0.25em]",
            dark ? "text-paper/80" : "text-navy/70",
          )}
        >
          <span className={cn("rounded-sm px-2 py-1 text-white", dark ? "bg-brand" : "bg-brand")}>{no}</span>
          {eyebrow}
          <span className={cn("h-px w-16", dark ? "bg-paper/40" : "bg-navy/30")} />
        </div>
      </Reveal>
      <PaperText
        as="h2"
        text={title}
        tone={tone}
        className="text-[clamp(2.15rem,8.5vw,8rem)]"
      />
      {sub && (
        <Reveal delay={0.2} y={30}>
          <p
            className={cn(
              "mt-5 max-w-2xl font-serif text-lg italic leading-snug sm:mt-8 sm:text-2xl md:text-3xl",
              dark ? "text-paper/85" : "text-navy/75",
            )}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paper button                                                        */
/* ------------------------------------------------------------------ */
const btnTones = {
  red: "bg-brand text-white shadow-[0_5px_0_#8f1020,0_12px_20px_rgba(143,16,32,.35)] hover:shadow-[0_8px_0_#8f1020,0_20px_28px_rgba(143,16,32,.4)]",
  navy: "bg-navy text-white shadow-[0_5px_0_#050b22,0_12px_20px_rgba(5,11,34,.35)] hover:shadow-[0_8px_0_#050b22,0_20px_28px_rgba(5,11,34,.4)]",
  white:
    "bg-paper-light text-navy shadow-[0_5px_0_#c9bea3,0_12px_20px_rgba(8,18,47,.25)] hover:shadow-[0_8px_0_#c9bea3,0_20px_28px_rgba(8,18,47,.3)]",
  green:
    "bg-[#1f9d55] text-white shadow-[0_5px_0_#0f6b37,0_12px_20px_rgba(15,107,55,.35)] hover:shadow-[0_8px_0_#0f6b37,0_20px_28px_rgba(15,107,55,.4)]",
};

export function PaperButton({
  href,
  tone = "red",
  icon,
  children,
  external,
  className,
}: {
  href: string;
  tone?: keyof typeof btnTones;
  icon?: ReactNode;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      external ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    if (href.startsWith("/") || href.startsWith("#")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      whileHover={{ y: -4, rotate: -1.2 }}
      whileTap={{ y: 3, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-base font-bold tracking-tight transition-shadow sm:px-6 sm:py-4",
        btnTones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Live open/closed status (Asia/Kolkata)                              */
/* ------------------------------------------------------------------ */
function compute() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const isSunday = get("weekday") === "Sun";
  const mins = (parseInt(get("hour")) % 24) * 60 + parseInt(get("minute"));
  const openAt = 10 * 60;
  const closeAt = isSunday ? 20 * 60 + 30 : 21 * 60;
  const open = mins >= openAt && mins < closeAt;
  const h = HOURS[isSunday ? 1 : 0];
  return {
    open,
    isSunday,
    label: open ? `Open now · until ${h.close}` : mins < openAt ? `Closed · opens ${h.open}` : "Closed · opens tomorrow 10:00 am",
  };
}

export function useOpenStatus() {
  const [s, setS] = useState(compute);
  useEffect(() => {
    const t = setInterval(() => setS(compute()), 60000);
    return () => clearInterval(t);
  }, []);
  return s;
}
