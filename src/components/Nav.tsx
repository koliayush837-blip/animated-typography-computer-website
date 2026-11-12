import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, Phone, X, Shield, Lock } from "lucide-react";
import { PAGE_NAV } from "../data";
import { Logo } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";
import { Link, useRouter } from "../utils/router";

export default function Nav() {
  const { data, setIsAdminOpen, isAdminAuthenticated } = useData();
  const { pathname } = useRouter();
  const biz = data.biz;

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.4, type: "spring", stiffness: 90, damping: 16 }}
      className="fixed inset-x-0 top-0 z-[100]"
    >
      <div
        className={cn(
          "mx-auto transition-all duration-500",
          scrolled
            ? "mt-0 max-w-full bg-paper-light/95 shadow-[0_6px_20px_rgba(8,18,47,.18)] backdrop-blur"
            : "mt-3 max-w-[1400px] bg-transparent md:mt-5",
        )}
      >
        <nav className="flex items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Padmashree Computers home">
            <Logo className="h-9 w-9 shrink-0 drop-shadow-md sm:h-10 sm:w-10" />
            <span className="min-w-0 leading-none">
              <span className="block truncate text-lg font-extrabold tracking-tight text-navy sm:text-xl">{biz.name.split(" ")[0]}</span>
              <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-brand">
                {biz.name.split(" ").slice(1).join(" ") || "Computers"}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {PAGE_NAV.map((n) => {
              const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link
                    to={n.href}
                    className={cn(
                      "group relative rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:text-brand",
                      isActive ? "text-brand font-extrabold" : "text-navy",
                    )}
                  >
                    {n.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 bottom-1 h-[3px] origin-left rounded-full bg-brand transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* Admin Access Button */}
            <motion.button
              onClick={() => setIsAdminOpen(true)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              title="Open Admin Studio"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold tracking-tight shadow-sm transition-all sm:text-sm",
                isAdminAuthenticated
                  ? "bg-navy text-white shadow-[0_3px_0_#050b22]"
                  : "border border-navy/20 bg-paper-light text-navy hover:bg-navy hover:text-white",
              )}
            >
              {isAdminAuthenticated ? <Shield size={15} /> : <Lock size={15} />}
              <span className="hidden sm:inline">Admin</span>
            </motion.button>

            <motion.a
              href={`tel:${biz.phoneTel}`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              className="hidden items-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-bold text-white shadow-[0_4px_0_#8f1020] md:inline-flex lg:px-4"
            >
              <Phone size={16} /> {biz.phoneDisplay}
            </motion.a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy text-white shadow-[0_4px_0_#050b22] lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -20, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 mb-4 overflow-hidden rounded-xl bg-paper-light p-3 shadow-xl lg:hidden"
            >
              <motion.li
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="sm:hidden"
              >
                <a
                  href={`tel:${biz.phoneTel}`}
                  onClick={() => setOpen(false)}
                  className="mb-1 flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-lg font-bold text-white"
                >
                  <Phone size={18} /> Call {biz.phoneDisplay}
                </a>
              </motion.li>

              {PAGE_NAV.map((n, i) => {
                const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={n.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-lg font-bold transition-colors",
                        isActive ? "bg-navy text-white" : "text-navy hover:bg-brand hover:text-white",
                      )}
                    >
                      {n.label}
                    </Link>
                  </motion.li>
                );
              })}

              <motion.li
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-navy/15 pt-2 mt-2"
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-navy px-4 py-3 text-base font-bold text-white shadow-[0_3px_0_#050b22]"
                >
                  <span className="flex items-center gap-2">
                    <Shield size={18} /> Store Admin Studio
                  </span>
                  <span className="text-xs bg-brand px-2 py-0.5 rounded font-mono">
                    {isAdminAuthenticated ? "Logged in" : "Unlock"}
                  </span>
                </button>
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <motion.div style={{ scaleX: progress }} className="h-[4px] origin-left bg-brand" />
    </motion.header>
  );
}
