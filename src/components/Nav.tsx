import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, Phone, X, Shield, Lock, MessageCircle } from "lucide-react";
import { PAGE_NAV } from "../data";
import { Logo } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";
import { Link, useRouter } from "../utils/router";

export default function Nav() {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const { pathname } = useRouter();
  const biz = data.biz;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    "Hello " + biz.name + ", I'd like to know more about your products and services.",
  )}`;

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [navDelay] = useState(() => {
    try {
      return sessionStorage.getItem("padmashree_preloader_done") ? 0.05 : 2.4;
    } catch {
      return 0.1;
    }
  });

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Automatically close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Backdrop when mobile menu is open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[95] bg-navy-deep/45 backdrop-blur-[2px] lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: navDelay, type: "spring", stiffness: 90, damping: 16 }}
        className="fixed inset-x-0 top-0 z-[100]"
      >
        <div
          className={cn(
            "mx-auto transition-all duration-500",
            scrolled || open || pathname !== "/"
              ? "mt-0 max-w-full bg-paper-light/95 shadow-[0_6px_20px_rgba(8,18,47,.18)] backdrop-blur"
              : "mt-2 max-w-[1400px] bg-paper-light/85 shadow-[0_4px_14px_rgba(8,18,47,.1)] backdrop-blur-sm sm:mt-3 sm:bg-transparent sm:shadow-none sm:backdrop-blur-none md:mt-5",
          )}
        >
          <nav
            aria-label="Main navigation"
            className="flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-8"
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex min-w-0 items-center gap-2 sm:gap-3"
              aria-label="Padmashree Computers home"
            >
              <Logo className="h-9 w-9 shrink-0 drop-shadow-md sm:h-10 sm:w-10" />
              <span className="min-w-0 leading-none">
                <span className="block truncate text-base font-extrabold tracking-tight text-navy min-[360px]:text-lg sm:text-xl">
                  {biz.name.split(" ")[0]}
                </span>
                <span className="block truncate font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-brand min-[360px]:text-[10px] sm:tracking-[0.3em]">
                  {biz.name.split(" ").slice(1).join(" ") || "Computers"}
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
              {PAGE_NAV.map((n) => {
                const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <li key={n.href}>
                    <Link
                      to={n.href}
                      className={cn(
                        "group relative inline-flex min-h-[44px] items-center rounded-md px-2.5 py-2 text-xs font-semibold transition-colors hover:text-brand xl:px-3.5 xl:text-sm",
                        isActive ? "text-brand font-extrabold" : "text-navy",
                      )}
                    >
                      {n.label}
                      <span
                        className={cn(
                          "absolute inset-x-2.5 bottom-1.5 h-[3px] origin-left rounded-full bg-brand transition-transform duration-300 xl:inset-x-3.5",
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Admin Access Button */}
              <motion.button
                onClick={() => {
                  setOpen(false);
                  setIsAdminOpen(true);
                }}
                whileHover={{ y: -2 }}
                whileTap={{ y: 2 }}
                title="Open Admin Studio"
                aria-label="Open Store Admin Studio"
                className={cn(
                  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold tracking-tight shadow-sm transition-all sm:px-3 sm:text-sm",
                  isAdminAuthenticated
                    ? "bg-navy text-white shadow-[0_3px_0_#050b22]"
                    : "border border-navy/20 bg-paper-light text-navy hover:bg-navy hover:text-white",
                )}
              >
                {isAdminAuthenticated ? <Shield size={16} /> : <Lock size={16} />}
                <span className="hidden min-[380px]:inline">Admin</span>
              </motion.button>

              <motion.a
                href={`tel:${biz.phoneTel}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 2 }}
                className="hidden min-h-[44px] items-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-bold text-white shadow-[0_4px_0_#8f1020] md:inline-flex lg:px-4"
              >
                <Phone size={16} /> {biz.phoneDisplay}
              </motion.a>

              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="mobile-nav-drawer"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy text-white shadow-[0_4px_0_#050b22] transition-transform active:translate-y-0.5 lg:hidden"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-nav-drawer"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mx-3 mb-3 max-h-[calc(100dvh-5.2rem)] overflow-y-auto rounded-xl border-2 border-navy/15 bg-paper-light p-3 shadow-2xl sm:mx-4 sm:mb-4 lg:hidden"
              >
                <ul className="space-y-1">
                  {PAGE_NAV.map((n, i) => {
                    const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                    return (
                      <motion.li
                        key={n.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          to={n.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex min-h-[48px] items-center justify-between rounded-lg px-4 py-3 text-base font-extrabold transition-colors sm:text-lg",
                            isActive
                              ? "bg-navy text-white shadow-[0_3px_0_#050b22]"
                              : "text-navy hover:bg-brand hover:text-white",
                          )}
                        >
                          <span>{n.label}</span>
                          {isActive && (
                            <span className="rounded bg-brand px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                              Current
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Direct Call & WhatsApp Shortcuts inside Mobile Drawer */}
                <div className="mt-3 grid grid-cols-1 gap-2 border-t border-dashed border-navy/20 pt-3 min-[360px]:grid-cols-2">
                  <a
                    href={`tel:${biz.phoneTel}`}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020] active:translate-y-0.5"
                  >
                    <Phone size={16} /> Call {biz.phoneDisplay}
                  </a>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#1f9d55] px-3 py-3 text-sm font-extrabold text-white shadow-[0_3px_0_#0f6b37] active:translate-y-0.5"
                  >
                    <MessageCircle size={16} /> WhatsApp Us
                  </a>
                </div>

                {/* Admin Studio Shortcut */}
                <div className="mt-2 border-t border-navy/10 pt-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="flex min-h-[48px] w-full items-center justify-between rounded-lg bg-navy/10 px-4 py-2.5 text-sm font-extrabold text-navy transition-colors hover:bg-navy hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Shield size={16} className="text-brand" /> Store Admin Studio
                    </span>
                    <span className="rounded bg-navy px-2 py-0.5 font-mono text-[10px] uppercase text-white">
                      {isAdminAuthenticated ? "Logged in" : "Unlock"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-[4px] origin-left bg-brand" />
      </motion.header>
    </>
  );
}
