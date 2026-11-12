import { Quote, Star } from "lucide-react";
import { Reveal, SectionHead, Torn } from "./ui";
import { useData } from "../context/DataContext";

export default function Reviews() {
  const { data } = useData();
  const reviews = data.reviews;

  return (
    <section id="reviews" className="relative px-4 pb-24 pt-16 sm:pb-32 sm:pt-24 md:px-8 md:pt-32">
      <Torn fill="#f5efe3" seed={53} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          no="04"
          eyebrow="Word on the street"
          title="Kind words"
          tone="navy"
          sub="Quick and professional service for all kinds of computer needs, including laptop screen replacement. That's the Google summary."
        />

        <div className="grid gap-8 sm:gap-12 md:grid-cols-3 md:gap-8">
          {reviews.map((r, i) => (
            <Reveal key={`${r.name}-${i}`} delay={i * 0.15} rotate={[-2.5, 1.5, -1.2][i % 3]} y={100} className={i === 1 ? "md:mt-14" : i === 2 ? "md:mt-5" : ""}>
              <div className="group drop transition-transform duration-500 hover:-translate-y-3 hover:rotate-0">
                <figure className="fold-clip paper-bg relative p-6 pt-9 sm:p-8 sm:pt-10" style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 31px, rgba(14,28,74,.07) 31px 32px), linear-gradient(180deg,#fffdf7,#fbf5e8)" }}>
                  <span className="tape absolute top-0 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-3" />
                  <Quote className="mb-3 text-brand" size={42} fill="currentColor" strokeWidth={0} />
                  <blockquote className="font-serif text-[1.55rem] italic leading-[1.15] text-navy sm:text-[2rem] sm:leading-[1.1]">“{r.quote}”</blockquote>
                  <p className="mt-5 text-sm leading-relaxed text-navy/70 md:min-h-[4.5rem]">{r.note}</p>
                  <figcaption className="mt-6 flex items-center gap-3 border-t-2 border-dashed border-navy/20 pt-5">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-lg font-extrabold text-white shadow-[0_3px_0_#050b22]">
                      {r.name[0] || "P"}
                    </span>
                    <span className="leading-tight">
                      <span className="block font-extrabold text-navy">{r.name}</span>
                      <span className="mt-1 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
                        <Star size={11} fill="currentColor" /> {r.badge} · Google
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
