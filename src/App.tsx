import { useCallback, useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import StickyBar from "./components/StickyBar";
import AdminModal from "./components/AdminModal";
import Why from "./components/Why";
import Reviews from "./components/Reviews";
import Gallery from "./components/Gallery";
import SEOHead from "./components/SEOHead";
import { DataProvider, useData } from "./context/DataContext";
import { RouterProvider, useRouter, matchProductSlug } from "./utils/router";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

function MainContent() {
  const { pathname } = useRouter();
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem("padmashree_preloader_done");
    } catch {
      return true;
    }
  });
  const [preloaderDone, setPreloaderDone] = useState(!loading);

  const done = useCallback(() => {
    setLoading(false);
    setPreloaderDone(true);
    try {
      sessionStorage.setItem("padmashree_preloader_done", "1");
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const { data, setIsAdminOpen } = useData();
  const biz = data.biz;

  // Keyboard shortcut: Ctrl + Shift + A to open Admin Studio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsAdminOpen]);

  const productSlug = matchProductSlug(pathname);

  const renderPage = () => {
    if (productSlug) {
      return <ProductDetailPage slug={productSlug} />;
    }
    switch (pathname) {
      case "/products":
        return <ProductsPage />;
      case "/services":
        return <ServicesPage />;
      case "/why":
        return (
          <div className="pt-20 sm:pt-24">
            <SEOHead
              title={`Why Choose Us | ${biz.name} — 4.8★ Rated Computer Shop in Kharadi`}
              description={`See why customers rate ${biz.name} 4.8 stars on Google and Justdial: expert technicians, transparent pricing, and quick turnaround.`}
            />
            <Why />
          </div>
        );
      case "/reviews":
        return (
          <div className="pt-20 sm:pt-24">
            <SEOHead
              title={`Customer Reviews | ${biz.name} — Kharadi, Pune`}
              description={`Read genuine Google customer reviews for ${biz.name} in Ashoka Nagar, Kharadi, Pune.`}
            />
            <Reviews />
          </div>
        );
      case "/gallery":
        return (
          <div className="pt-20 sm:pt-24">
            <SEOHead
              title={`Shop Gallery | ${biz.name} — Inside Our Kharadi Repair Bench & Store`}
              description={`Take a look inside ${biz.name} in Kharadi, Pune — our laptop repair workbench, inventory shelves, and technicians.`}
            />
            <Gallery />
          </div>
        );
      case "/about":
        return <AboutPage />;
      case "/contact":
        return <ContactPage />;
      case "/":
      default:
        return <HomePage instantHero={preloaderDone} />;
    }
  };

  return (
    <>
      {loading && <Preloader onDone={done} />}
      <Nav />
      <main id="top" key={pathname} className="min-h-[70vh]">
        {renderPage()}
      </main>
      <Footer />
      <StickyBar />
      <AdminModal />
    </>
  );
}

export default function App() {
  return (
    <DataProvider>
      <RouterProvider>
        <MainContent />
      </RouterProvider>
    </DataProvider>
  );
}
