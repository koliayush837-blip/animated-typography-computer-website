import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  BIZ as DEFAULT_BIZ,
  CATALOG as DEFAULT_CATALOG,
  SERVICES as DEFAULT_SERVICES,
  BRANDS as DEFAULT_BRANDS,
  REVIEWS as DEFAULT_REVIEWS,
  HOURS as DEFAULT_HOURS,
  GALLERY as DEFAULT_GALLERY,
  NAV as DEFAULT_NAV,
  type Item,
} from "../data";

export type { Item };

export type CatalogCategory = {
  id: string;
  label: string;
  items: Item[];
};

export type ServiceItem = {
  icon: string;
  title: string;
  text: string;
  tone: "white" | "navy" | "red";
};

export type BizDetails = typeof DEFAULT_BIZ;
export type ReviewItem = (typeof DEFAULT_REVIEWS)[number];
export type HourItem = (typeof DEFAULT_HOURS)[number];

export type StoreData = {
  biz: BizDetails;
  catalog: CatalogCategory[];
  services: ServiceItem[];
  brands: string[];
  reviews: ReviewItem[];
  hours: HourItem[];
};

const DEFAULT_STORE_DATA: StoreData = {
  biz: DEFAULT_BIZ,
  catalog: DEFAULT_CATALOG,
  services: [...DEFAULT_SERVICES],
  brands: [...DEFAULT_BRANDS],
  reviews: [...DEFAULT_REVIEWS],
  hours: [...DEFAULT_HOURS],
};

const STORAGE_KEY = "padmashree_site_store_v1";
const PIN_KEY = "padmashree_admin_pin";
const AUTH_KEY = "padmashree_admin_auth";
const DEFAULT_PIN = "admin123";

interface DataContextType {
  data: StoreData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => void;
  
  // Products / Catalog
  addProduct: (categoryId: string, item: Item) => void;
  updateProduct: (categoryId: string, itemIndex: number, item: Item) => void;
  deleteProduct: (categoryId: string, itemIndex: number) => void;
  addCategory: (label: string) => void;
  deleteCategory: (categoryId: string) => void;
  
  // Services
  addService: (service: ServiceItem) => void;
  updateService: (index: number, service: ServiceItem) => void;
  deleteService: (index: number) => void;
  
  // Store / Biz
  updateBiz: (biz: Partial<BizDetails>) => void;
  
  // Brands
  addBrand: (brand: string) => void;
  deleteBrand: (index: number) => void;
  
  // Reviews
  addReview: (review: ReviewItem) => void;
  deleteReview: (index: number) => void;
  
  // Backup & Reset
  resetToDefaults: () => void;
  importData: (imported: Partial<StoreData>) => boolean;
  exportJSON: () => string;
  generateTypeScriptCode: () => string;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_DATA,
          ...parsed,
          biz: { ...DEFAULT_STORE_DATA.biz, ...(parsed.biz || {}) },
          catalog: Array.isArray(parsed.catalog) ? parsed.catalog : DEFAULT_STORE_DATA.catalog,
          services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_STORE_DATA.services,
          brands: Array.isArray(parsed.brands) ? parsed.brands : DEFAULT_STORE_DATA.brands,
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_STORE_DATA.reviews,
        };
      }
    } catch (e) {
      console.error("Failed to load store data from localStorage:", e);
    }
    return DEFAULT_STORE_DATA;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist store data:", e);
    }
  }, [data]);

  // Admin Auth
  const loginAdmin = (pin: string) => {
    const savedPin = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
    if (pin.trim() === savedPin.trim()) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const updateAdminPin = (newPin: string) => {
    if (newPin && newPin.trim().length >= 4) {
      localStorage.setItem(PIN_KEY, newPin.trim());
    }
  };

  // Product Actions
  const addProduct = (categoryId: string, item: Item) => {
    setData((prev) => {
      const updatedCatalog = prev.catalog.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: [item, ...cat.items],
          };
        }
        return cat;
      });
      return { ...prev, catalog: updatedCatalog };
    });
  };

  const updateProduct = (categoryId: string, itemIndex: number, item: Item) => {
    setData((prev) => {
      const updatedCatalog = prev.catalog.map((cat) => {
        if (cat.id === categoryId) {
          const nextItems = [...cat.items];
          nextItems[itemIndex] = item;
          return { ...cat, items: nextItems };
        }
        return cat;
      });
      return { ...prev, catalog: updatedCatalog };
    });
  };

  const deleteProduct = (categoryId: string, itemIndex: number) => {
    setData((prev) => {
      const updatedCatalog = prev.catalog.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter((_, i) => i !== itemIndex),
          };
        }
        return cat;
      });
      return { ...prev, catalog: updatedCatalog };
    });
  };

  const addCategory = (label: string) => {
    const cleanLabel = label.trim();
    if (!cleanLabel) return;
    const id = cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setData((prev) => {
      if (prev.catalog.some((c) => c.id === id)) return prev;
      return {
        ...prev,
        catalog: [...prev.catalog, { id, label: cleanLabel, items: [] }],
      };
    });
  };

  const deleteCategory = (categoryId: string) => {
    setData((prev) => {
      if (prev.catalog.length <= 1) return prev; // Keep at least one
      return {
        ...prev,
        catalog: prev.catalog.filter((c) => c.id !== categoryId),
      };
    });
  };

  // Service Actions
  const addService = (service: ServiceItem) => {
    setData((prev) => ({
      ...prev,
      services: [service, ...prev.services],
    }));
  };

  const updateService = (index: number, service: ServiceItem) => {
    setData((prev) => {
      const nextServices = [...prev.services];
      nextServices[index] = service;
      return { ...prev, services: nextServices };
    });
  };

  const deleteService = (index: number) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // Biz Details
  const updateBiz = (bizUpdates: Partial<BizDetails>) => {
    setData((prev) => ({
      ...prev,
      biz: { ...prev.biz, ...bizUpdates },
    }));
  };

  // Brands
  const addBrand = (brand: string) => {
    const b = brand.trim();
    if (!b) return;
    setData((prev) => {
      if (prev.brands.includes(b)) return prev;
      return { ...prev, brands: [...prev.brands, b] };
    });
  };

  const deleteBrand = (index: number) => {
    setData((prev) => ({
      ...prev,
      brands: prev.brands.filter((_, i) => i !== index),
    }));
  };

  // Reviews
  const addReview = (review: ReviewItem) => {
    setData((prev) => ({
      ...prev,
      reviews: [review, ...prev.reviews],
    }));
  };

  const deleteReview = (index: number) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  // Reset & Import/Export
  const resetToDefaults = () => {
    setData(DEFAULT_STORE_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const importData = (imported: Partial<StoreData>) => {
    try {
      setData((prev) => ({
        ...prev,
        ...imported,
        biz: { ...prev.biz, ...(imported.biz || {}) },
        catalog: Array.isArray(imported.catalog) ? imported.catalog : prev.catalog,
        services: Array.isArray(imported.services) ? imported.services : prev.services,
        brands: Array.isArray(imported.brands) ? imported.brands : prev.brands,
        reviews: Array.isArray(imported.reviews) ? imported.reviews : prev.reviews,
      }));
      return true;
    } catch (e) {
      console.error("Failed to import data:", e);
      return false;
    }
  };

  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const generateTypeScriptCode = () => {
    return `// Updated data generated from Admin Panel on ${new Date().toLocaleString()}
export const BIZ = ${JSON.stringify(data.biz, null, 2)};

export const WA_LINK = \`https://wa.me/\${BIZ.whatsapp}?text=\${encodeURIComponent(
  "Hello " + BIZ.name + ", I'd like to know more about your products and services.",
)}\`;

export const HOURS = ${JSON.stringify(data.hours, null, 2)};

export const BRANDS = ${JSON.stringify(data.brands, null, 2)};

export const SERVICES = ${JSON.stringify(data.services, null, 2)} as const;

export type Item = { name: string; price?: string; tag?: string };

export const CATALOG: { id: string; label: string; items: Item[] }[] = ${JSON.stringify(data.catalog, null, 2)};

export const REVIEWS = ${JSON.stringify(data.reviews, null, 2)};

export const GALLERY = ${JSON.stringify(DEFAULT_GALLERY, null, 2)};

export const NAV = ${JSON.stringify(DEFAULT_NAV, null, 2)};
`;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addService,
        updateService,
        deleteService,
        updateBiz,
        addBrand,
        deleteBrand,
        addReview,
        deleteReview,
        resetToDefaults,
        importData,
        exportJSON,
        generateTypeScriptCode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

