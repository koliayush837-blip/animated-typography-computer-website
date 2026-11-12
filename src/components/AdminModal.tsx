import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Lock,
  Unlock,
  Package,
  Wrench,
  Building,
  Save,
  Trash2,
  Edit3,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  Search,
  Layers,
  Key,
  Star,
  Laptop,
  Cpu,
  BatteryCharging,
  MemoryStick,
  ShieldCheck,
  Keyboard,
  PcCase,
  CalendarClock,
  Monitor,
  Image as ImageIcon,
  Menu,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  useData,
  type Item,
  type ServiceItem,
  type GalleryItem,
} from "../context/DataContext";
import { cn } from "../utils/cn";

const SERVICE_ICONS = [
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "chip", label: "Chip Level", icon: Cpu },
  { id: "battery", label: "Battery/Screen", icon: BatteryCharging },
  { id: "memory", label: "RAM/SSD", icon: MemoryStick },
  { id: "shield", label: "Security/OS", icon: ShieldCheck },
  { id: "keyboard", label: "Peripherals", icon: Keyboard },
  { id: "pc", label: "Custom PC", icon: PcCase },
  { id: "rental", label: "Rental", icon: CalendarClock },
  { id: "monitor", label: "Monitor", icon: Monitor },
];

export default function AdminModal() {
  const {
    data,
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
  } = useData();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "services" | "gallery" | "biz" | "brands_reviews" | "sync" | "security"
  >("overview");

  // Mobile drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Form State
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  // Toast / Notification Banner
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Confirmation Modal State (replaces browser confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    actionLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // Product Tab State
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [editingProduct, setEditingProduct] = useState<{ catId: string; index: number; item: Item } | null>(null);
  const [newProduct, setNewProduct] = useState<Item & { categoryId: string }>({
    name: "",
    price: "",
    tag: "",
    image: "",
    inStock: true,
    stockStatus: "in_stock",
    description: "",
    featured: false,
    categoryId: data.catalog[0]?.id || "laptops",
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);

  // Category Management State
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  // Service Tab State
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [newService, setNewService] = useState<ServiceItem>({
    title: "",
    text: "",
    icon: "laptop",
    tone: "white",
  });
  const [showAddService, setShowAddService] = useState(false);

  // Gallery Tab State
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryPhoto, setNewGalleryPhoto] = useState<GalleryItem>({
    src: "",
    cap: "",
    alt: "",
  });
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);

  // Store & Contact Details State
  const [bizForm, setBizForm] = useState(data.biz);
  useEffect(() => {
    setBizForm(data.biz);
  }, [data.biz]);

  // Brands & Reviews State
  const [newBrandInput, setNewBrandInput] = useState("");
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    badge: "5 stars",
    quote: "",
    note: "",
  });

  // Security / PIN Change State
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [pinChangeError, setPinChangeError] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Code Sync State
  const [copiedCode, setCopiedCode] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutRemaining) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          setAuthError("");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Filtered & Paginated Products
  const filteredProducts = useMemo(() => {
    const list: { catId: string; catLabel: string; item: Item; index: number }[] = [];
    data.catalog.forEach((cat) => {
      if (selectedCatId !== "all" && cat.id !== selectedCatId) return;
      cat.items.forEach((item, index) => {
        if (
          !productSearch ||
          item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
          (item.tag && item.tag.toLowerCase().includes(productSearch.toLowerCase()))
        ) {
          list.push({ catId: cat.id, catLabel: cat.label, item, index });
        }
      });
    });
    return list;
  }, [data.catalog, selectedCatId, productSearch]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Statistics calculation for Dashboard Overview
  const stats = useMemo(() => {
    const totalProducts = data.catalog.reduce((acc, c) => acc + c.items.length, 0);
    const totalServices = data.services.length;
    const totalCategories = data.catalog.length;
    const totalGallery = data.gallery ? data.gallery.length : 0;
    const totalReviews = data.reviews.length;
    return { totalProducts, totalServices, totalCategories, totalGallery, totalReviews };
  }, [data]);

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim() || isSubmittingAuth) return;

    setIsSubmittingAuth(true);
    setAuthError("");

    const result = await loginAdmin(pinInput.trim());
    setIsSubmittingAuth(false);

    if (result.success) {
      setPinInput("");
      setAuthError("");
      showToast("Signed in successfully. Welcome to Store Admin Studio!");
    } else {
      setAuthError(result.error || "Authentication failed");
      if (result.retryAfter) {
        setLockoutRemaining(result.retryAfter);
      }
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProductImage(true);
    const res = await uploadImage(file);
    setIsUploadingProductImage(false);

    if (res.success && res.url) {
      if (isEditing && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          item: { ...editingProduct.item, image: res.url },
        });
      } else {
        setNewProduct({ ...newProduct, image: res.url });
      }
      showToast("Product image uploaded successfully!");
    } else {
      showToast(res.error || "Failed to upload image", "error");
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const res = await addProduct(newProduct.categoryId, {
      name: newProduct.name.trim(),
      price: newProduct.price?.trim() || undefined,
      tag: newProduct.tag?.trim() || undefined,
      image: newProduct.image?.trim() || undefined,
      inStock: newProduct.stockStatus !== "out_of_stock",
      stockStatus: newProduct.stockStatus,
      description: newProduct.description?.trim() || undefined,
      featured: Boolean(newProduct.featured),
    });

    if (res.success) {
      setNewProduct({
        name: "",
        price: "",
        tag: "",
        image: "",
        inStock: true,
        stockStatus: "in_stock",
        description: "",
        featured: false,
        categoryId: newProduct.categoryId,
      });
      setShowAddProductModal(false);
      showToast("Product added to catalog successfully!");
    } else {
      showToast(res.error || "Failed to add product", "error");
    }
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.item.name.trim()) return;

    const res = await updateProduct(editingProduct.catId, editingProduct.index, editingProduct.item);
    if (res.success) {
      setEditingProduct(null);
      showToast("Product updated successfully!");
    } else {
      showToast(res.error || "Failed to update product", "error");
    }
  };

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.text.trim()) return;

    const res = await addService(newService);
    if (res.success) {
      setNewService({ title: "", text: "", icon: "laptop", tone: "white" });
      setShowAddService(false);
      showToast("Service added successfully!");
    } else {
      showToast(res.error || "Failed to add service", "error");
    }
  };

  const handleUpdateServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceIndex === null || !newService.title.trim()) return;

    const res = await updateService(editingServiceIndex, newService);
    if (res.success) {
      setEditingServiceIndex(null);
      setNewService({ title: "", text: "", icon: "laptop", tone: "white" });
      setShowAddService(false);
      showToast("Service updated successfully!");
    } else {
      showToast(res.error || "Failed to update service", "error");
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGalleryImage(true);
    const res = await uploadImage(file);
    setIsUploadingGalleryImage(false);

    if (res.success && res.url) {
      setNewGalleryPhoto({ ...newGalleryPhoto, src: res.url });
      showToast("Gallery photo uploaded successfully!");
    } else {
      showToast(res.error || "Failed to upload photo", "error");
    }
  };

  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryPhoto.src.trim() || !newGalleryPhoto.cap.trim()) return;

    const res = await addGalleryPhoto(newGalleryPhoto);
    if (res.success) {
      setNewGalleryPhoto({ src: "", cap: "", alt: "" });
      setShowAddGalleryModal(false);
      showToast("Gallery photo added successfully!");
    } else {
      showToast(res.error || "Failed to add photo", "error");
    }
  };

  const handleSaveBiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateBiz(bizForm);
    if (res.success) {
      showToast("Store details saved successfully!");
    } else {
      showToast(res.error || "Failed to save details", "error");
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    const res = await addBrand(newBrandInput.trim());
    if (res.success) {
      setNewBrandInput("");
      showToast("Brand added to ticker!");
    } else {
      showToast(res.error || "Failed to add brand", "error");
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.quote.trim()) return;
    const res = await addReview(newReview);
    if (res.success) {
      setNewReview({ name: "", badge: "5 stars", quote: "", note: "" });
      setShowAddReview(false);
      showToast("Review added successfully!");
    } else {
      showToast(res.error || "Failed to add review", "error");
    }
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError("");
    setPinChangeSuccess(false);

    if (newPinInput.length < 4) {
      setPinChangeError("New PIN must be at least 4 characters long.");
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeError("New PIN and confirmation PIN do not match.");
      return;
    }

    const res = await changeAdminPin(currentPinInput, newPinInput);
    if (res.success) {
      setPinChangeSuccess(true);
      setCurrentPinInput("");
      setNewPinInput("");
      setConfirmPinInput("");
      showToast("Passkey updated securely!");
    } else {
      setPinChangeError(res.error || "Failed to update PIN");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateTypeScriptCode());
      setCopiedCode(true);
      showToast("TypeScript code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      showToast("Failed to copy code", "error");
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `padmashree-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Database backup downloaded!");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        setConfirmDialog({
          title: "Restore Store Database from Backup?",
          description:
            "This will restore the products, services, gallery, and store settings from this file. A safety backup of your current database will be archived automatically.",
          actionLabel: "Yes, Restore Backup",
          onConfirm: async () => {
            const res = await restoreBackup(parsed);
            if (res.success) {
              showToast("Database restored successfully!");
            } else {
              showToast(res.error || "Failed to restore backup", "error");
            }
          },
        });
      } catch {
        showToast("Invalid JSON backup file", "error");
      }
    };
    reader.readAsText(file);
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAdminOpen(false)}
        className="fixed inset-0 bg-navy/85 backdrop-blur-md"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative z-10 flex h-full max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-paper-light shadow-[0_25px_60px_rgba(8,18,47,0.5)] border-2 border-navy/20"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-navy/15 bg-paper px-3.5 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Hamburger Drawer Toggle */}
            {isAdminAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy/10 text-navy md:hidden"
                aria-label="Toggle navigation menu"
              >
                <Menu size={20} />
              </button>
            )}

            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-white shadow-[0_2px_0_#050b22]">
              <Lock size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-navy sm:text-xl">Store Admin Studio</h2>
                <span className="rounded bg-brand/10 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand">
                  Live Production
                </span>
              </div>
              <p className="hidden text-[11px] font-mono text-navy/60 sm:block">
                Securely manage products, services, gallery &amp; contact in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  logoutAdmin();
                  showToast("Logged out successfully");
                }}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5"
                title="Log out"
              >
                <Unlock size={14} /> <span className="hidden sm:inline">Log out</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-xl bg-navy/10 text-navy transition-colors hover:bg-brand hover:text-white"
              aria-label="Close Admin Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "absolute top-16 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg",
                toast.type === "success" ? "bg-navy text-white border border-navy/30" : "bg-brand text-white border border-brand-dark",
              )}
            >
              {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        {!isAdminAuthenticated ? (
          /* ----------------------------------------------------------- */
          /* Secure Server-Side Authentication Screen                     */
          /* ----------------------------------------------------------- */
          <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
            <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-navy/25 bg-paper p-6 sm:p-8 shadow-sm">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-[0_4px_0_#8f1020]">
                <Key size={26} />
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-navy">Store Admin Portal</h3>
              <p className="mt-2 text-xs sm:text-sm text-navy/70">
                Enter your administrative passkey to securely access store settings and inventory.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinInput}
                    disabled={Boolean(lockoutRemaining) || isSubmittingAuth}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Enter Store Passkey"
                    className={cn(
                      "w-full min-h-[48px] rounded-xl border-2 bg-white px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-navy outline-none transition-colors",
                      authError ? "border-brand bg-red-50 text-brand" : "border-navy/20 focus:border-brand",
                    )}
                    autoFocus
                  />

                  {authError && (
                    <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-brand">
                      <AlertCircle size={14} />
                      <span>{authError}</span>
                    </div>
                  )}

                  {lockoutRemaining && (
                    <p className="mt-2 font-mono text-xs font-bold text-brand">
                      Lockout active: {lockoutRemaining}s remaining
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={Boolean(lockoutRemaining) || isSubmittingAuth}
                  className="w-full min-h-[48px] rounded-xl bg-brand py-3 text-base font-extrabold text-white shadow-[0_4px_0_#8f1020] transition-transform active:translate-y-1 active:shadow-none hover:brightness-105 disabled:opacity-50"
                >
                  {isSubmittingAuth ? "Verifying..." : "Unlock Admin Studio"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ----------------------------------------------------------- */
          /* Authenticated Dashboard                                      */
          /* ----------------------------------------------------------- */
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Sidebar Navigation (Desktop) & Mobile Drawer */}
            <div
              className={cn(
                "z-30 shrink-0 bg-paper transition-all border-navy/15 md:w-60 md:border-r-2 md:p-3 overflow-y-auto",
                mobileMenuOpen
                  ? "absolute inset-x-0 top-0 bottom-0 p-4 shadow-2xl block md:relative md:shadow-none"
                  : "hidden md:block",
              )}
            >
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy/15 md:hidden">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy/70">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-navy/10 text-navy"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1.5">
                {[
                  { id: "overview", label: "Dashboard Overview", icon: Activity, count: null },
                  { id: "products", label: "Products & Stock", icon: Package, count: stats.totalProducts },
                  { id: "services", label: "Services", icon: Wrench, count: stats.totalServices },
                  { id: "gallery", label: "Gallery Photos", icon: ImageIcon, count: stats.totalGallery },
                  { id: "biz", label: "Store & Contact", icon: Building, count: null },
                  { id: "brands_reviews", label: "Brands & Reviews", icon: Star, count: stats.totalReviews },
                  { id: "sync", label: "Backup & Code Sync", icon: Copy, count: null },
                  { id: "security", label: "Security & PIN", icon: Key, count: null },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition-all",
                        isActive ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                      )}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon size={18} className="shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </span>
                      {tab.count !== null && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-xs font-mono font-bold",
                            isActive ? "bg-white/20 text-white" : "bg-navy/10 text-navy/70",
                          )}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Tab Quick Bar (when drawer is closed) */}
            <div className="flex items-center justify-between border-b border-navy/15 bg-paper-light px-4 py-2 md:hidden">
              <span className="font-mono text-xs font-bold uppercase text-navy/80">
                Viewing: <strong className="text-brand uppercase">{activeTab}</strong>
              </span>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-brand"
              >
                Change View <ChevronRight size={14} />
              </button>
            </div>

            {/* Tab Body Content Area */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 overflow-x-hidden">
              {/* ------------------------------------------------------- */}
              {/* TAB 0: DASHBOARD OVERVIEW                                */}
              {/* ------------------------------------------------------- */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-navy">Store Performance &amp; Inventory</h3>
                    <p className="text-xs text-navy/60">Real-time statistics backed by stored catalog and service data</p>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-2xl border-2 border-navy/15 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-navy/50 mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">Products</span>
                        <Package size={18} className="text-brand" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-navy">{stats.totalProducts}</p>
                      <p className="mt-1 text-[11px] text-navy/60 font-medium">Across {stats.totalCategories} categories</p>
                    </div>

                    <div className="rounded-2xl border-2 border-navy/15 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-navy/50 mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">Services</span>
                        <Wrench size={18} className="text-navy" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-navy">{stats.totalServices}</p>
                      <p className="mt-1 text-[11px] text-navy/60 font-medium">Active workshop cards</p>
                    </div>

                    <div className="rounded-2xl border-2 border-navy/15 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-navy/50 mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">Gallery</span>
                        <ImageIcon size={18} className="text-emerald-700" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-navy">{stats.totalGallery}</p>
                      <p className="mt-1 text-[11px] text-navy/60 font-medium">Showcase photos</p>
                    </div>

                    <div className="rounded-2xl border-2 border-navy/15 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-navy/50 mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy/70">Reviews</span>
                        <Star size={18} className="text-amber-500" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-navy">{stats.totalReviews}</p>
                      <p className="mt-1 text-[11px] text-navy/60 font-medium">Customer ratings</p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="rounded-2xl border-2 border-navy/15 bg-paper p-4 sm:p-5">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-navy/80 mb-3">
                      Quick Management Actions
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          setActiveTab("products");
                          setShowAddProductModal(true);
                        }}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                      >
                        <Plus size={16} /> New Product
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("services");
                          setShowAddService(true);
                        }}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_3px_0_#050b22]"
                      >
                        <Wrench size={16} /> New Service
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("gallery");
                          setShowAddGalleryModal(true);
                        }}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5"
                      >
                        <ImageIcon size={16} /> Add Photo
                      </button>

                      <button
                        onClick={() => setActiveTab("biz")}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5"
                      >
                        <Building size={16} /> Store Info
                      </button>

                      <button
                        onClick={handleDownloadJSON}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5"
                      >
                        <Download size={16} /> Export Backup
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="rounded-2xl border-2 border-navy/15 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-navy/10">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-brand" />
                        <h4 className="font-extrabold text-navy">Recent Administrative Activity</h4>
                      </div>
                      <button
                        onClick={fetchActivities}
                        className="text-xs font-mono font-bold text-brand hover:underline"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="mt-3 divide-y divide-navy/5 max-h-72 overflow-y-auto">
                      {activities.length > 0 ? (
                        activities.map((act) => (
                          <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-navy/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-navy">
                                  {act.action}
                                </span>
                                <span className="font-medium text-navy">{act.details}</span>
                              </div>
                            </div>
                            <span className="shrink-0 font-mono text-[10px] text-navy/50">
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="py-6 text-center text-xs text-navy/50">No recent activity logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 1: PRODUCTS MANAGEMENT                               */}
              {/* ------------------------------------------------------- */}
              {activeTab === "products" && (
                <div className="space-y-5">
                  {/* Action Bar */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search products by name or tag..."
                        className="w-full min-h-[44px] rounded-xl border-2 border-navy/20 bg-white py-2 pl-9 pr-3 text-sm font-medium text-navy outline-none focus:border-brand"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewProduct({
                            name: "",
                            price: "",
                            tag: "",
                            image: "",
                            inStock: true,
                            stockStatus: "in_stock",
                            categoryId: selectedCatId !== "all" ? selectedCatId : data.catalog[0]?.id || "laptops",
                          });
                          setShowAddProductModal(true);
                        }}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                      >
                        <Plus size={16} /> Add Product
                      </button>

                      <button
                        onClick={() => setShowAddCat(!showAddCat)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-navy/20 bg-white px-3 py-2 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5"
                      >
                        <Layers size={15} /> Categories
                      </button>
                    </div>
                  </div>

                  {/* Add / Manage Categories Accordion */}
                  {showAddCat && (
                    <div className="rounded-xl border-2 border-dashed border-navy/20 bg-paper p-4">
                      <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-navy/70">
                        Manage Categories
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={newCategoryLabel}
                          onChange={(e) => setNewCategoryLabel(e.target.value)}
                          placeholder="New category name (e.g. Graphic Cards)"
                          className="min-h-[40px] rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-medium text-navy outline-none focus:border-brand"
                        />
                        <button
                          onClick={async () => {
                            if (newCategoryLabel.trim()) {
                              const res = await addCategory(newCategoryLabel.trim());
                              if (res.success) {
                                setNewCategoryLabel("");
                                showToast("Category added!");
                              } else {
                                showToast(res.error || "Failed", "error");
                              }
                            }
                          }}
                          className="min-h-[40px] rounded-lg bg-navy px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                        >
                          Add Category
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-navy/10">
                        {data.catalog.map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-navy border border-navy/15"
                          >
                            {cat.label} ({cat.items.length})
                            {data.catalog.length > 1 && (
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    title: `Delete category "${cat.label}"?`,
                                    description: `This will remove the category and all ${cat.items.length} items inside it.`,
                                    actionLabel: "Yes, Delete Category",
                                    onConfirm: async () => {
                                      const res = await deleteCategory(cat.id);
                                      if (res.success) {
                                        if (selectedCatId === cat.id) setSelectedCatId("all");
                                        showToast("Category deleted!");
                                      } else {
                                        showToast(res.error || "Failed to delete", "error");
                                      }
                                    },
                                  });
                                }}
                                className="text-navy/40 hover:text-brand"
                                title="Delete Category"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Filter Horizontal Scroll */}
                  <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                    <button
                      onClick={() => {
                        setSelectedCatId("all");
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap",
                        selectedCatId === "all" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "bg-paper text-navy hover:bg-navy/10",
                      )}
                    >
                      All ({stats.totalProducts})
                    </button>
                    {data.catalog.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCatId(cat.id);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap",
                          selectedCatId === cat.id ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "bg-paper text-navy hover:bg-navy/10",
                        )}
                      >
                        {cat.label} ({cat.items.length})
                      </button>
                    ))}
                  </div>

                  {/* Responsive Product Cards (Full-width on small screens) */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedProducts.map(({ catId, catLabel, item, index }) => (
                      <div
                        key={`${catId}-${index}-${item.name}`}
                        className="group relative flex flex-col justify-between rounded-xl border border-navy/15 bg-white p-3.5 shadow-sm transition-all hover:border-brand/40 hover:shadow-md w-full"
                      >
                        <div>
                          {item.image && (
                            <div className="mb-2.5 h-32 w-full overflow-hidden rounded-lg bg-navy/5 border border-navy/10">
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                            <span className="rounded bg-navy/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-navy/70">
                              {catLabel}
                            </span>
                            <div className="flex items-center gap-1">
                              {item.tag && (
                                <span className="rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-brand">
                                  {item.tag}
                                </span>
                              )}
                              {item.stockStatus === "in_stock" && (
                                <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase">
                                  In Stock
                                </span>
                              )}
                              {item.stockStatus === "low_stock" && (
                                <span className="rounded bg-amber-100 text-amber-900 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase">
                                  Low Stock
                                </span>
                              )}
                              {item.stockStatus === "out_of_stock" && (
                                <span className="rounded bg-red-100 text-red-800 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          <h4 className="mt-1 text-sm font-extrabold text-navy line-clamp-2">{item.name}</h4>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-navy/10 pt-2.5">
                          <span className="font-mono text-sm font-black text-brand">
                            {item.price ? `₹${item.price}` : "Call for price"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingProduct({ catId, index, item: { ...item } })}
                              className="min-h-[36px] min-w-[36px] grid place-items-center rounded-lg text-navy/60 hover:bg-navy/10 hover:text-navy"
                              title="Edit product"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  title: `Delete product "${item.name}"?`,
                                  description: `Are you sure you want to remove this product from "${catLabel}"?`,
                                  actionLabel: "Yes, Delete Product",
                                  onConfirm: async () => {
                                    const res = await deleteProduct(catId, index);
                                    if (res.success) {
                                      showToast("Product deleted!");
                                    } else {
                                      showToast(res.error || "Failed to delete", "error");
                                    }
                                  },
                                });
                              }}
                              className="min-h-[36px] min-w-[36px] grid place-items-center rounded-lg text-navy/60 hover:bg-brand/10 hover:text-brand"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {filteredProducts.length > itemsPerPage && (
                    <div className="flex items-center justify-between border-t border-navy/10 pt-3">
                      <p className="font-mono text-xs text-navy/60">
                        Page {currentPage} of {totalPages} ({filteredProducts.length} items)
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="min-h-[38px] px-3 rounded-lg border border-navy/20 bg-white text-xs font-bold text-navy disabled:opacity-40"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          disabled={currentPage >= totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className="min-h-[38px] px-3 rounded-lg border border-navy/20 bg-white text-xs font-bold text-navy disabled:opacity-40"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-navy/20 p-8 text-center">
                      <p className="font-bold text-navy/60">No products match your search or filter.</p>
                      <button
                        onClick={() => {
                          setProductSearch("");
                          setSelectedCatId("all");
                        }}
                        className="mt-2 text-xs font-bold text-brand underline"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 2: SERVICES                                          */}
              {/* ------------------------------------------------------- */}
              {activeTab === "services" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-navy">Workshop &amp; Repair Services</h3>
                      <p className="text-xs text-navy/60">Customize cards shown on the services section</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingServiceIndex(null);
                        setNewService({ title: "", text: "", icon: "laptop", tone: "white" });
                        setShowAddService(true);
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                    >
                      <Plus size={16} /> Add Service
                    </button>
                  </div>

                  {/* Add / Edit Service Form */}
                  {showAddService && (
                    <form
                      onSubmit={editingServiceIndex !== null ? handleUpdateServiceSubmit : handleAddServiceSubmit}
                      className="rounded-xl border-2 border-navy/20 bg-paper p-4 sm:p-5"
                    >
                      <h4 className="text-sm font-extrabold text-navy">
                        {editingServiceIndex !== null ? "Edit Service Card" : "Create New Service Card"}
                      </h4>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Title</label>
                          <input
                            type="text"
                            required
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            placeholder="e.g. GPU Reballing & Diagnostics"
                            className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Icon</label>
                          <select
                            value={newService.icon}
                            onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                            className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                          >
                            {SERVICE_ICONS.map((i) => (
                              <option key={i.id} value={i.id}>
                                {i.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-mono font-bold uppercase text-navy/70">Card Color Tone</label>
                        <div className="mt-1 flex gap-4">
                          {(["white", "navy", "red"] as const).map((tone) => (
                            <label key={tone} className="flex items-center gap-1.5 text-xs font-bold uppercase text-navy cursor-pointer">
                              <input
                                type="radio"
                                name="tone"
                                value={tone}
                                checked={newService.tone === tone}
                                onChange={() => setNewService({ ...newService, tone })}
                                className="accent-brand"
                              />
                              {tone}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-mono font-bold uppercase text-navy/70">Description</label>
                        <textarea
                          rows={2}
                          required
                          value={newService.text}
                          onChange={(e) => setNewService({ ...newService, text: e.target.value })}
                          placeholder="Summary of what the technicians do..."
                          className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                        />
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="submit"
                          className="min-h-[44px] rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                        >
                          {editingServiceIndex !== null ? "Save Changes" : "Create Service"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddService(false);
                            setEditingServiceIndex(null);
                          }}
                          className="min-h-[44px] rounded-xl border border-navy/20 bg-white px-4 py-2 text-xs font-bold text-navy"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Services List */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.services.map((service, index) => {
                      const IconComp = SERVICE_ICONS.find((i) => i.id === service.icon)?.icon || Laptop;
                      return (
                        <div
                          key={`${service.title}-${index}`}
                          className="flex flex-col justify-between rounded-xl border border-navy/15 bg-white p-4 shadow-sm w-full"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy/10 text-navy">
                                <IconComp size={18} />
                              </span>
                              <span
                                className={cn(
                                  "rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase",
                                  service.tone === "red"
                                    ? "bg-brand text-white"
                                    : service.tone === "navy"
                                      ? "bg-navy text-white"
                                      : "bg-paper text-navy border border-navy/20",
                                )}
                              >
                                {service.tone} card
                              </span>
                            </div>
                            <h4 className="mt-2.5 text-base font-extrabold text-navy">{service.title}</h4>
                            <p className="mt-1 text-xs text-navy/70 line-clamp-3">{service.text}</p>
                          </div>

                          <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-navy/10 pt-2.5">
                            <button
                              onClick={() => {
                                setEditingServiceIndex(index);
                                setNewService({ ...service });
                                setShowAddService(true);
                              }}
                              className="min-h-[36px] min-w-[36px] grid place-items-center rounded-lg text-navy/60 hover:bg-navy/10 hover:text-navy"
                              title="Edit service"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  title: `Delete service "${service.title}"?`,
                                  description: "This will remove the service card from the website.",
                                  actionLabel: "Yes, Delete Service",
                                  onConfirm: async () => {
                                    const res = await deleteService(index);
                                    if (res.success) {
                                      showToast("Service deleted!");
                                    } else {
                                      showToast(res.error || "Failed to delete", "error");
                                    }
                                  },
                                });
                              }}
                              className="min-h-[36px] min-w-[36px] grid place-items-center rounded-lg text-navy/60 hover:bg-brand/10 hover:text-brand"
                              title="Delete service"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 3: GALLERY PHOTOS                                    */}
              {/* ------------------------------------------------------- */}
              {activeTab === "gallery" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-navy">Shop &amp; Workshop Gallery</h3>
                      <p className="text-xs text-navy/60">Upload photos of the workshop, bench, and inventory</p>
                    </div>

                    <button
                      onClick={() => {
                        setNewGalleryPhoto({ src: "", cap: "", alt: "" });
                        setShowAddGalleryModal(true);
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                    >
                      <Plus size={16} /> Add Photo
                    </button>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.gallery && data.gallery.length > 0 ? (
                      data.gallery.map((photo, index) => (
                        <div
                          key={`${photo.src}-${index}`}
                          className="flex flex-col justify-between rounded-xl border border-navy/15 bg-white p-3 shadow-sm"
                        >
                          <div>
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-navy/5 border border-navy/10">
                              <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                            </div>
                            <h4 className="mt-2.5 font-serif text-base italic text-navy sm:text-lg">{photo.cap}</h4>
                            <p className="mt-0.5 text-[11px] text-navy/50 truncate">Alt: {photo.alt}</p>
                          </div>

                          <div className="mt-3 flex justify-end border-t border-navy/10 pt-2">
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  title: `Delete photo "${photo.cap}"?`,
                                  description: "This will remove the photo from the shop gallery section.",
                                  actionLabel: "Yes, Delete Photo",
                                  onConfirm: async () => {
                                    const res = await deleteGalleryPhoto(index);
                                    if (res.success) {
                                      showToast("Photo deleted!");
                                    } else {
                                      showToast(res.error || "Failed to delete", "error");
                                    }
                                  },
                                });
                              }}
                              className="min-h-[36px] min-w-[36px] grid place-items-center rounded-lg text-navy/50 hover:bg-brand/10 hover:text-brand"
                              title="Delete photo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full rounded-xl border-2 border-dashed border-navy/20 p-8 text-center">
                        <p className="font-bold text-navy/60">No gallery photos added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 4: STORE & CONTACT                                   */}
              {/* ------------------------------------------------------- */}
              {activeTab === "biz" && (
                <form onSubmit={handleSaveBiz} className="max-w-2xl space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Store &amp; Contact Details</h3>
                    <p className="text-xs text-navy/60">Updates header, hero, contact card, and footer</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Shop Name</label>
                      <input
                        type="text"
                        value={bizForm.name}
                        onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Tagline</label>
                      <input
                        type="text"
                        value={bizForm.tagline}
                        onChange={(e) => setBizForm({ ...bizForm, tagline: e.target.value })}
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Primary Phone</label>
                      <input
                        type="text"
                        value={bizForm.phoneDisplay}
                        onChange={(e) => setBizForm({ ...bizForm, phoneDisplay: e.target.value })}
                        placeholder="088884 94624"
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Primary Tel Link</label>
                      <input
                        type="text"
                        value={bizForm.phoneTel}
                        onChange={(e) => setBizForm({ ...bizForm, phoneTel: e.target.value })}
                        placeholder="+918888494624"
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">WhatsApp Number</label>
                      <input
                        type="text"
                        value={bizForm.whatsapp}
                        onChange={(e) => setBizForm({ ...bizForm, whatsapp: e.target.value })}
                        placeholder="919860353118"
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Store Address</label>
                    <textarea
                      rows={2}
                      value={bizForm.address}
                      onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Google Maps Link</label>
                    <input
                      type="text"
                      value={bizForm.directions}
                      onChange={(e) => setBizForm({ ...bizForm, directions: e.target.value })}
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-xs font-mono text-navy outline-none focus:border-brand"
                    />
                  </div>

                  <div className="border-t border-navy/15 pt-4 mt-4 space-y-3">
                    <h4 className="text-sm font-extrabold text-navy">Homepage Hero Content</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-navy/70">Hero Eyebrow Badge</label>
                        <input
                          type="text"
                          value={bizForm.heroEyebrow || "Computer store · Kharadi, Pune"}
                          onChange={(e) => setBizForm({ ...bizForm, heroEyebrow: e.target.value })}
                          className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-navy/70">Hero Location Text</label>
                        <input
                          type="text"
                          value={bizForm.heroLocation || "in Kharadi, Pune"}
                          onChange={(e) => setBizForm({ ...bizForm, heroLocation: e.target.value })}
                          className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Homepage Description</label>
                      <textarea
                        rows={2}
                        value={
                          bizForm.heroDescription ||
                          "New and refurbished laptops, expert repairs, upgrades and accessories, all under one roof."
                        }
                        onChange={(e) => setBizForm({ ...bizForm, heroDescription: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                  >
                    <Save size={16} /> Save Store &amp; Homepage Details
                  </button>
                </form>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 5: BRANDS & REVIEWS                                  */}
              {/* ------------------------------------------------------- */}
              {activeTab === "brands_reviews" && (
                <div className="space-y-7">
                  {/* Brands */}
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Brand Marquee Ticker</h3>
                    <p className="text-xs text-navy/60">Brands scrolling across the banner on the homepage</p>

                    <form onSubmit={handleAddBrand} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newBrandInput}
                        onChange={(e) => setNewBrandInput(e.target.value)}
                        placeholder="Brand name (e.g. Asus, Apple, Dell)"
                        className="min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                      />
                      <button
                        type="submit"
                        className="min-h-[44px] rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                      >
                        Add Brand
                      </button>
                    </form>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.brands.map((b, i) => (
                        <span
                          key={`${b}-${i}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-extrabold text-navy shadow-sm"
                        >
                          {b}
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                title: `Remove brand "${b}"?`,
                                description: "This will remove the brand logo from the marquee.",
                                actionLabel: "Yes, Remove",
                                onConfirm: async () => {
                                  const res = await deleteBrand(i);
                                  if (res.success) showToast("Brand removed!");
                                },
                              });
                            }}
                            className="text-navy/40 hover:text-brand"
                            title="Remove Brand"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="border-t border-navy/15 pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-navy">Customer Reviews</h3>
                        <p className="text-xs text-navy/60">Google &amp; customer testimonials shown in section 04</p>
                      </div>

                      <button
                        onClick={() => setShowAddReview(!showAddReview)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#8f1020]"
                      >
                        <Plus size={14} /> Add Review
                      </button>
                    </div>

                    {showAddReview && (
                      <form onSubmit={handleAddReview} className="mt-3 rounded-xl border border-navy/20 bg-paper p-4 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-mono font-bold uppercase text-navy/70">Name</label>
                            <input
                              type="text"
                              required
                              value={newReview.name}
                              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                              placeholder="e.g. Ramesh Patil"
                              className="mt-1 w-full min-h-[40px] rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-bold text-navy outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-bold uppercase text-navy/70">Badge</label>
                            <input
                              type="text"
                              value={newReview.badge}
                              onChange={(e) => setNewReview({ ...newReview, badge: e.target.value })}
                              placeholder="e.g. Local Guide · 5 stars"
                              className="mt-1 w-full min-h-[40px] rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-mono text-navy outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Quote</label>
                          <input
                            type="text"
                            required
                            value={newReview.quote}
                            onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                            placeholder="e.g. Fixed my laptop motherboard same day!"
                            className="mt-1 w-full min-h-[40px] rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-serif italic text-navy outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Details / Note</label>
                          <textarea
                            rows={2}
                            value={newReview.note}
                            onChange={(e) => setNewReview({ ...newReview, note: e.target.value })}
                            placeholder="Additional context..."
                            className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm text-navy outline-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="min-h-[40px] rounded-lg bg-navy px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                          >
                            Save Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddReview(false)}
                            className="min-h-[40px] rounded-lg border border-navy/20 bg-white px-3.5 py-1.5 text-xs font-bold text-navy"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {data.reviews.map((r, i) => (
                        <div key={`${r.name}-${i}`} className="flex flex-col justify-between rounded-xl border border-navy/15 bg-white p-3.5 shadow-sm">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-navy">{r.name}</span>
                              <span className="font-mono text-[10px] text-brand font-bold">{r.badge}</span>
                            </div>
                            <p className="mt-2 font-serif text-sm italic text-navy">“{r.quote}”</p>
                            <p className="mt-1 text-xs text-navy/60">{r.note}</p>
                          </div>
                          <div className="mt-3 flex justify-end border-t border-navy/10 pt-2">
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  title: `Delete review from "${r.name}"?`,
                                  description: "This will remove the review from the website.",
                                  actionLabel: "Yes, Delete",
                                  onConfirm: async () => {
                                    const res = await deleteReview(i);
                                    if (res.success) showToast("Review deleted!");
                                  },
                                });
                              }}
                              className="text-navy/40 hover:text-brand"
                              title="Delete review"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 6: BACKUP & CODE SYNC                                */}
              {/* ------------------------------------------------------- */}
              {activeTab === "sync" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Data Safety &amp; Synchronization</h3>
                    <p className="text-xs text-navy/60">
                      All changes are saved to the server database. Download backups or copy code anytime.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Copy TS Code */}
                    <div className="rounded-xl border-2 border-navy/20 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Copy size={18} className="text-brand" />
                        <h4 className="font-extrabold text-navy">Copy Updated data.ts</h4>
                      </div>
                      <p className="mt-1 text-xs text-navy/70">
                        Generates exact TypeScript code for <code className="bg-paper px-1 py-0.5 rounded text-navy">src/data.ts</code>.
                      </p>
                      <button
                        onClick={handleCopyCode}
                        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                      >
                        {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                        {copiedCode ? "Copied to Clipboard!" : "Copy Code to Clipboard"}
                      </button>
                    </div>

                    {/* Download JSON Backup */}
                    <div className="rounded-xl border-2 border-navy/20 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Download size={18} className="text-navy" />
                        <h4 className="font-extrabold text-navy">Download JSON Backup</h4>
                      </div>
                      <p className="mt-1 text-xs text-navy/70">
                        Export complete database as standalone JSON file for safe archiving.
                      </p>
                      <button
                        onClick={handleDownloadJSON}
                        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-navy/5"
                      >
                        <Download size={14} /> Download JSON
                      </button>
                    </div>

                    {/* Import JSON */}
                    <div className="rounded-xl border-2 border-navy/20 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Upload size={18} className="text-navy" />
                        <h4 className="font-extrabold text-navy">Restore from JSON</h4>
                      </div>
                      <p className="mt-1 text-xs text-navy/70">
                        Restore data from a JSON backup file. An automated safety backup is created first.
                      </p>
                      <label className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-navy/5 cursor-pointer">
                        <Upload size={14} /> Select Backup File
                        <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                      </label>
                    </div>

                    {/* Reset to Factory Defaults */}
                    <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
                      <div className="flex items-center gap-2 text-brand">
                        <RotateCcw size={18} />
                        <h4 className="font-extrabold">Reset to Factory Defaults</h4>
                      </div>
                      <p className="mt-1 text-xs text-red-900/70">
                        Restores initial template stock. Existing data is archived automatically before resetting.
                      </p>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            title: "Reset entire store to factory defaults?",
                            description:
                              "This will restore original template products, services, and photos. A backup of current data will be safely archived.",
                            actionLabel: "Yes, Reset to Defaults",
                            onConfirm: async () => {
                              const res = await resetToDefaults();
                              if (res.success) {
                                showToast("Restored template stock successfully!");
                              } else {
                                showToast(res.error || "Failed to reset", "error");
                              }
                            },
                          });
                        }}
                        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-brand/30 bg-white px-3.5 py-1.5 text-xs font-bold text-brand hover:bg-brand hover:text-white"
                      >
                        <RotateCcw size={13} /> Restore Template Defaults
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* TAB 7: SECURITY & PIN                                    */}
              {/* ------------------------------------------------------- */}
              {activeTab === "security" && (
                <div className="max-w-md space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Admin Passkey Management</h3>
                    <p className="text-xs text-navy/60">
                      Credentials are salted and hashed on the server with <code className="font-mono">scrypt</code>.
                    </p>
                  </div>

                  <form onSubmit={handleChangePinSubmit} className="rounded-xl border-2 border-navy/20 bg-white p-5 space-y-3.5">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Current Passkey</label>
                      <input
                        type="password"
                        required
                        value={currentPinInput}
                        onChange={(e) => setCurrentPinInput(e.target.value)}
                        placeholder="Enter current PIN"
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">New Passkey</label>
                      <input
                        type="password"
                        required
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="At least 4 characters"
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Confirm New Passkey</label>
                      <input
                        type="password"
                        required
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Repeat new PIN"
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
                      />
                    </div>

                    {pinChangeError && (
                      <p className="text-xs font-bold text-brand">{pinChangeError}</p>
                    )}
                    {pinChangeSuccess && (
                      <p className="text-xs font-bold text-emerald-700">Passkey updated successfully!</p>
                    )}

                    <button
                      type="submit"
                      className="w-full min-h-[44px] rounded-xl bg-navy px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_2px_0_#050b22]"
                    >
                      Update Passkey
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD PRODUCT                                            */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddProductModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border-2 border-navy/20 bg-paper-light p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-navy/15 pb-3">
                <h3 className="text-lg font-extrabold text-navy">Add New Product</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="rounded-lg p-1.5 text-navy/50 hover:bg-navy/10"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                  >
                    {data.catalog.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Dell Latitude 7490 i7 16GB"
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                    autoFocus
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Price in ₹ (Optional)</label>
                    <input
                      type="text"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="e.g. 24,999"
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Tag / Badge</label>
                    <input
                      type="text"
                      value={newProduct.tag || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                      placeholder="e.g. Refurbished, Gaming, New"
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Stock Availability</label>
                  <select
                    value={newProduct.stockStatus || "in_stock"}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stockStatus: e.target.value as any,
                        inStock: e.target.value !== "out_of_stock",
                      })
                    }
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock (Few Left)</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="on_order">Available on Order</option>
                  </select>
                </div>

                {/* Product Image Upload / URL Preview */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Product Image (Upload or URL)
                  </label>
                  <div className="mt-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newProduct.image || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-xs font-mono text-navy outline-none focus:border-brand"
                    />
                    <label className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-navy/20 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5 cursor-pointer">
                      <Upload size={14} />
                      {isUploadingProductImage ? "Uploading..." : "Upload File"}
                      <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, false)} className="hidden" />
                    </label>
                  </div>
                  {newProduct.image && (
                    <div className="mt-2 h-24 w-32 overflow-hidden rounded-lg border border-navy/20 bg-navy/5">
                      <img src={newProduct.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Description / Key Specifications (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newProduct.description || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Processor, RAM, storage, warranty, or key features..."
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                  />
                </div>

                <label className="flex items-center gap-2.5 rounded-lg border border-navy/15 bg-white p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(newProduct.featured)}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-xs font-bold text-navy">
                    Feature this product on the Homepage showcase
                  </span>
                </label>

                <div className="mt-5 flex gap-2 pt-2 border-t border-navy/10">
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] rounded-xl bg-brand py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                  >
                    Add Product Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="min-h-[44px] rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-bold text-navy"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT PRODUCT                                           */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border-2 border-navy/20 bg-paper-light p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-navy/15 pb-3">
                <h3 className="text-lg font-extrabold text-navy">Edit Product</h3>
                <button onClick={() => setEditingProduct(null)} className="rounded-lg p-1.5 text-navy/50 hover:bg-navy/10">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateProductSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.item.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        item: { ...editingProduct.item, name: e.target.value },
                      })
                    }
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Price in ₹</label>
                    <input
                      type="text"
                      value={editingProduct.item.price || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          item: { ...editingProduct.item, price: e.target.value },
                        })
                      }
                      placeholder="e.g. 19,999"
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Tag / Badge</label>
                    <input
                      type="text"
                      value={editingProduct.item.tag || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          item: { ...editingProduct.item, tag: e.target.value },
                        })
                      }
                      placeholder="e.g. Refurbished, Laser"
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Stock Availability</label>
                  <select
                    value={editingProduct.item.stockStatus || "in_stock"}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        item: {
                          ...editingProduct.item,
                          stockStatus: e.target.value as any,
                          inStock: e.target.value !== "out_of_stock",
                        },
                      })
                    }
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock (Few Left)</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="on_order">Available on Order</option>
                  </select>
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Product Image (Upload or URL)
                  </label>
                  <div className="mt-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editingProduct.item.image || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          item: { ...editingProduct.item, image: e.target.value },
                        })
                      }
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-xs font-mono text-navy outline-none focus:border-brand"
                    />
                    <label className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-navy/20 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5 cursor-pointer">
                      <Upload size={14} />
                      {isUploadingProductImage ? "Uploading..." : "Upload File"}
                      <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, true)} className="hidden" />
                    </label>
                  </div>
                  {editingProduct.item.image && (
                    <div className="mt-2 h-24 w-32 overflow-hidden rounded-lg border border-navy/20 bg-navy/5">
                      <img src={editingProduct.item.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Description / Key Specifications (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.item.description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        item: { ...editingProduct.item, description: e.target.value },
                      })
                    }
                    placeholder="Processor, RAM, storage, warranty, or key features..."
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                  />
                </div>

                <label className="flex items-center gap-2.5 rounded-lg border border-navy/15 bg-white p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.item.featured)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        item: { ...editingProduct.item, featured: e.target.checked },
                      })
                    }
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-xs font-bold text-navy">
                    Feature this product on the Homepage showcase
                  </span>
                </label>

                <div className="mt-5 flex gap-2 pt-2 border-t border-navy/10">
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] rounded-xl bg-navy py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#050b22]"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="min-h-[44px] rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-bold text-navy"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD GALLERY PHOTO                                      */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showAddGalleryModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddGalleryModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border-2 border-navy/20 bg-paper-light p-5 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-navy/15 pb-3">
                <h3 className="text-lg font-extrabold text-navy">Add Gallery Photo</h3>
                <button
                  onClick={() => setShowAddGalleryModal(false)}
                  className="rounded-lg p-1.5 text-navy/50 hover:bg-navy/10"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddGallerySubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Photo Image</label>
                  <div className="mt-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={newGalleryPhoto.src}
                      onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, src: e.target.value })}
                      placeholder="Paste Image URL (https://...)"
                      className="flex-1 min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-xs font-mono text-navy outline-none focus:border-brand"
                    />
                    <label className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-navy/20 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5 cursor-pointer">
                      <Upload size={14} />
                      {isUploadingGalleryImage ? "Uploading..." : "Upload Photo"}
                      <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
                    </label>
                  </div>
                  {newGalleryPhoto.src && (
                    <div className="mt-2 aspect-[4/3] w-40 overflow-hidden rounded-lg border border-navy/20 bg-navy/5">
                      <img src={newGalleryPhoto.src} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Caption</label>
                  <input
                    type="text"
                    required
                    value={newGalleryPhoto.cap}
                    onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, cap: e.target.value })}
                    placeholder="e.g. Chip-level motherboard diagnostic bench"
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Accessibility Alt Text</label>
                  <input
                    type="text"
                    value={newGalleryPhoto.alt}
                    onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, alt: e.target.value })}
                    placeholder="e.g. Technician soldering electronics on a computer board"
                    className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                  />
                </div>

                <div className="mt-5 flex gap-2 pt-2 border-t border-navy/10">
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] rounded-xl bg-brand py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                  >
                    Add to Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddGalleryModal(false)}
                    className="min-h-[44px] rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-bold text-navy"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* CUSTOM CONFIRMATION DIALOG (Data Safety)                      */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 w-full max-w-sm rounded-2xl border-2 border-navy/20 bg-paper-light p-6 shadow-2xl text-center"
            >
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-black text-navy">{confirmDialog.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-navy/70 leading-relaxed">{confirmDialog.description}</p>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => {
                    const action = confirmDialog.onConfirm;
                    setConfirmDialog(null);
                    action();
                  }}
                  className="min-h-[44px] rounded-xl bg-brand py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020] active:translate-y-0.5"
                >
                  {confirmDialog.actionLabel}
                </button>
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="min-h-[44px] rounded-xl border border-navy/20 bg-white py-2.5 text-sm font-bold text-navy hover:bg-navy/5"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
