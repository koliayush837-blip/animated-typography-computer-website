import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface RouterContextValue {
  pathname: string;
  search: string;
  hash: string;
  navigate: (to: string, options?: { replace?: boolean; scroll?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: typeof window !== "undefined" ? window.location.pathname : "/",
  search: typeof window !== "undefined" ? window.location.search : "",
  hash: typeof window !== "undefined" ? window.location.hash : "",
  navigate: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useState(() => ({
    pathname: normalizePath(window.location.pathname),
    search: window.location.search,
    hash: window.location.hash,
  }));

  useEffect(() => {
    const onPopState = () => {
      setLoc({
        pathname: normalizePath(window.location.pathname),
        search: window.location.search,
        hash: window.location.hash,
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean; scroll?: boolean }) => {
    if (!to) return;

    // Handle pure hash links on the same page
    if (to.startsWith("#")) {
      const el = document.querySelector(to);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    const url = new URL(to, window.location.origin);
    const nextPathname = normalizePath(url.pathname);
    const nextSearch = url.search;
    const nextHash = url.hash;

    if (options?.replace) {
      window.history.replaceState({}, "", `${nextPathname}${nextSearch}${nextHash}`);
    } else {
      window.history.pushState({}, "", `${nextPathname}${nextSearch}${nextHash}`);
    }

    setLoc({
      pathname: nextPathname,
      search: nextSearch,
      hash: nextHash,
    });

    if (nextHash) {
      setTimeout(() => {
        const el = document.querySelector(nextHash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 60);
    } else if (options?.scroll !== false) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ ...loc, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function normalizePath(p: string): string {
  if (!p || p === "/") return "/";
  return p.endsWith("/") ? p.slice(0, -1) : p;
}

export function useRouter() {
  return useContext(RouterContext);
}

export function matchProductSlug(pathname: string): string | null {
  const clean = normalizePath(pathname);
  if (clean.startsWith("/products/")) {
    const slug = clean.slice("/products/".length);
    return slug ? decodeURIComponent(slug) : null;
  }
  return null;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      rest.target === "_blank"
    ) {
      return;
    }

    // External or protocol links should behave natively
    if (
      to.startsWith("http://") ||
      to.startsWith("https://") ||
      to.startsWith("tel:") ||
      to.startsWith("mailto:")
    ) {
      return;
    }

    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

