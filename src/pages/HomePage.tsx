import Hero from "../components/Hero";
import Brands from "../components/Brands";
import SEOHead from "../components/SEOHead";
import { useData } from "../context/DataContext";

export default function HomePage({ instantHero = false }: { instantHero?: boolean }) {
  const { data } = useData();
  const biz = data.biz;

  return (
    <>
      <SEOHead
        title={`${biz.name} | Laptop Repair, Refurbished Laptops & Accessories in Kharadi, Pune`}
        description="Padmashree Computers, Kharadi, Pune: new and refurbished laptops, chip-level repair, screen and battery replacement, RAM/SSD upgrades, laptop rental, custom PCs and accessories. Rated 4.8 on Google."
      />
      <Hero instant={instantHero} />
      <Brands />
    </>
  );
}

