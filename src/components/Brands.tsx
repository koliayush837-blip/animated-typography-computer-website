import { Torn } from "./ui";
import { useData } from "../context/DataContext";

export default function Brands() {
  const { data } = useData();
  const brands = data.brands.length > 0 ? data.brands : ["Lenovo", "Apple", "HP", "Dell", "Asus", "Acer"];
  const row = [...brands, ...brands, ...brands, ...brands];

  return (
    <section aria-label="Brands we deal in" className="relative z-20 bg-navy py-10 md:py-14">
      <Torn fill="#0e1c4a" seed={11} position="top" />
      <div className="mx-auto mb-6 flex max-w-[1400px] items-center gap-3 px-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70 sm:text-xs sm:tracking-[0.3em] md:px-8">
        <span className="h-px flex-1 bg-paper/25" />
        Brands we sell &amp; service
        <span className="h-px flex-1 bg-paper/25" />
      </div>
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex items-center">
          {row.map((b, i) => (
            <div key={`${b}-${i}`} className="flex items-center">
              <span className="cut cut-white px-5 text-[clamp(2.2rem,8vw,6.5rem)] md:px-10">{b}</span>
              <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-brand" aria-hidden="true">
                <path fill="currentColor" d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <Torn fill="#0e1c4a" seed={23} position="bottom" />
    </section>
  );
}
