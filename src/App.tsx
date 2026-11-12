import { useCallback, useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Brands from "./components/Brands";
import Services from "./components/Services";
import Products from "./components/Products";
import Why from "./components/Why";
import Reviews from "./components/Reviews";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StickyBar from "./components/StickyBar";
import AdminModal from "./components/AdminModal";
import { DataProvider, useData } from "./context/DataContext";

function MainContent() {
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);
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

  return (
    <>
      {loading && <Preloader onDone={done} />}
      <Nav />
      <main>
        <Hero />
        <Brands />
        <Services />
        <Products />
        <Why />
        <Reviews />
        <Gallery />
        <Contact />
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
      <MainContent />
    </DataProvider>
  );
}
