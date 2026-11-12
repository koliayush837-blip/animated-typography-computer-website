import { useCallback, useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import StickyBar from "./components/StickyBar";
import AdminModal from "./components/AdminModal";
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

  const { setIsAdminOpen } = useData();

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
      <main id="top" className="min-h-[70vh]">
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
