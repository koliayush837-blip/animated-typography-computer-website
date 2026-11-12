import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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

export type GalleryItem = {
  src: string;
  cap: string;
  alt: string;
};

export type ActivityItem = {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  ip: string;
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
  gallery: GalleryItem[];
};

const DEFAULT_STORE_DATA: StoreData = {
  biz: DEFAULT_BIZ,
  catalog: DEFAULT_CATALOG,
  services: [...DEFAULT_SERVICES],
  brands: [...DEFAULT_BRANDS],
  reviews: [...DEFAULT_REVIEWS],
  hours: [...DEFAULT_HOURS],
  gallery: [...DEFAULT_GALLERY],
};

const STORAGE_KEY = "padmashree_offline_cache_v2";

export type AuthResult = {
  success: boolean;
  error?: string;
  remainingAttempts?: number;
  retryAfter?: number;
};

interface DataContextType {
  data: StoreData;
  isLoading: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => Promise<AuthResult>;
  logoutAdmin: () => Promise<void>;
  changeAdminPin: (currentPin: string, newPin: string) => Promise<{ success: boolean; error?: string }>;
  
  // Products / Catalog
  addProduct: (categoryId: string, item: Item) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (categoryId: string, itemIndex: number, item: Item) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (categoryId: string, itemIndex: number) => Promise<{ success: boolean; error?: string }>;
  addCategory: (label: string) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (categoryId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Services
  addService: (service: ServiceItem) => Promise<{ success: boolean; error?: string }>;
  updateService: (index: number, service: ServiceItem) => Promise<{ success: boolean; error?: string }>;
  deleteService: (index: number) => Promise<{ success: boolean; error?: string }>;
  
  // Gallery
  addGalleryPhoto: (photo: GalleryItem) => Promise<{ success: boolean; error?: string }>;
  deleteGalleryPhoto: (index: number) => Promise<{ success: boolean; error?: string }>;
  
  // Store / Biz
  updateBiz: (biz: Partial<BizDetails>) => Promise<{ success: boolean; error?: string }>;
  
  // Brands
  addBrand: (brand: string) => Promise<{ success: boolean; error?: string }>;
  deleteBrand: (index: number) => Promise<{ success: boolean; error?: string }>;
  
  // Reviews
  addReview: (review: ReviewItem) => Promise<{ success: boolean; error?: string }>;
  deleteReview: (index: number) => Promise<{ success: boolean; error?: string }>;
  
  // Uploads
  uploadImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  
  // Activity
  activities: ActivityItem[];
  fetchActivities: () => Promise<void>;
  
  // Backup & Reset
  resetToDefaults: () => Promise<{ success: boolean; error?: string }>;
  restoreBackup: (backupData: any) => Promise<{ success: boolean; error?: string }>;
  exportJSON: () => string;
  generateTypeScriptCode: () => string;
  refreshData: () => Promise<void>;
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
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_STORE_DATA.gallery,
        };
      }
    } catch {
      // Ignore cache parse error
    }
    return DEFAULT_STORE_DATA;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Fetch initial store data from server
  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          } catch {
            // LocalStorage quota or disabled
          }
        }
      }
    } catch (err) {
      console.warn("Using offline cached data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check existing session status on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setIsAdminAuthenticated(Boolean(json.authenticated));
      }
    } catch {
      setIsAdminAuthenticated(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/activity?limit=30", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.logs)) {
          setActivities(json.logs);
        }
      }
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    }
  }, []);

  useEffect(() => {
    refreshData();
    checkAuthStatus();
  }, [refreshData, checkAuthStatus]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchActivities();
    }
  }, [isAdminAuthenticated, fetchActivities]);

  // Secure Server-Side Login
  const loginAdmin = async (pin: string): Promise<AuthResult> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsAdminAuthenticated(true);
        fetchActivities();
        return { success: true };
      }
      return {
        success: false,
        error: json.error || "Authentication failed",
        remainingAttempts: json.remainingAttempts,
        retryAfter: json.retryAfter,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during authentication" };
    }
  };

  const logoutAdmin = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore
    } finally {
      setIsAdminAuthenticated(false);
    }
  };

  const changeAdminPin = async (currentPin: string, newPin: string) => {
    try {
      const res = await fetch("/api/auth/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPin, newPin }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to update PIN" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Products CRUD
  const addProduct = async (categoryId: string, item: Item) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ categoryId, ...item }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to add product" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (categoryId: string, itemIndex: number, item: Item) => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(categoryId)}/${itemIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to update product" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (categoryId: string, itemIndex: number) => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(categoryId)}/${itemIndex}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to delete product" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addCategory = async (label: string) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to add category" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to delete category" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Services CRUD
  const addService = async (service: ServiceItem) => {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(service),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to add service" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateService = async (index: number, service: ServiceItem) => {
    try {
      const res = await fetch(`/api/services/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(service),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to update service" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteService = async (index: number) => {
    try {
      const res = await fetch(`/api/services/${index}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to delete service" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Gallery CRUD
  const addGalleryPhoto = async (photo: GalleryItem) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(photo),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to add gallery photo" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteGalleryPhoto = async (index: number) => {
    try {
      const res = await fetch(`/api/gallery/${index}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to delete photo" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Store / Biz Info
  const updateBiz = async (bizUpdates: Partial<BizDetails>) => {
    try {
      const res = await fetch("/api/biz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bizUpdates),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to update store info" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Brands
  const addBrand = async (brand: string) => {
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brand }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to add brand" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteBrand = async (index: number) => {
    try {
      const res = await fetch(`/api/brands/${index}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to delete brand" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Reviews
  const addReview = async (review: ReviewItem) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(review),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to add review" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteReview = async (index: number) => {
    try {
      const res = await fetch(`/api/reviews/${index}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to delete review" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Image Upload
  const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, url: json.url };
      }
      return { success: false, error: json.error || "Upload failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during upload" };
    }
  };

  // Backup & Reset
  const resetToDefaults = async () => {
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ confirm: true }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Failed to reset" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const restoreBackup = async (backupData: any) => {
    try {
      const res = await fetch("/api/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ backupData, confirm: true }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        fetchActivities();
        return { success: true };
      }
      return { success: false, error: json.error || "Restore failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const generateTypeScriptCode = () => {
    return `// Updated data generated from Admin Studio on ${new Date().toLocaleString()}
export const BIZ = ${JSON.stringify(data.biz, null, 2)};

export const WA_LINK = \`https://wa.me/\${BIZ.whatsapp}?text=\${encodeURIComponent(
  "Hello " + BIZ.name + ", I'd like to know more about your products and services.",
)}\`;

export const HOURS = ${JSON.stringify(data.hours, null, 2)};

export const BRANDS = ${JSON.stringify(data.brands, null, 2)};

export const SERVICES = ${JSON.stringify(data.services, null, 2)} as const;

export type Item = {
  name: string;
  price?: string;
  tag?: string;
  image?: string;
  inStock?: boolean;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "on_order";
};

export const CATALOG: { id: string; label: string; items: Item[] }[] = ${JSON.stringify(data.catalog, null, 2)};

export const REVIEWS = ${JSON.stringify(data.reviews, null, 2)};

export const GALLERY = ${JSON.stringify(data.gallery || DEFAULT_GALLERY, null, 2)};

export const NAV = ${JSON.stringify(DEFAULT_NAV, null, 2)};
`;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addService,
        updateService,
        deleteService,
        addGalleryPhoto,
        deleteGalleryPhoto,
        updateBiz,
        addBrand,
        deleteBrand,
        addReview,
        deleteReview,
        uploadImage,
        activities,
        fetchActivities,
        resetToDefaults,
        restoreBackup,
        exportJSON,
        generateTypeScriptCode,
        refreshData,
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
