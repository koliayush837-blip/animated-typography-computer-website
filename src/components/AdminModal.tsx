import { useState, useMemo } from "react";
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
  Tag,
  Phone,
  Layers,
  Key,
  Star,
  ExternalLink,
  Laptop,
  Cpu,
  BatteryCharging,
  MemoryStick,
  ShieldCheck,
  Keyboard,
  PcCase,
  CalendarClock,
  Monitor,
} from "lucide-react";
import { useData, type Item, type ServiceItem } from "../context/DataContext";
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
  } = useData();

  // Tabs
  const [activeTab, setActiveTab] = useState<"products" | "services" | "biz" | "brands_reviews" | "sync" | "security">("products");

  // Auth form
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // Product form & state
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<{ catId: string; index: number; item: Item } | null>(null);
  const [newProduct, setNewProduct] = useState<Item & { categoryId: string }>({
    name: "",
    price: "",
    tag: "",
    categoryId: data.catalog[0]?.id || "laptops",
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  // Service form & state
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [newService, setNewService] = useState<ServiceItem>({
    title: "",
    text: "",
    icon: "laptop",
    tone: "white",
  });
  const [showAddService, setShowAddService] = useState(false);

  // Biz form state
  const [bizForm, setBizForm] = useState(data.biz);
  const [bizSaved, setBizSaved] = useState(false);

  // Brand input
  const [newBrandInput, setNewBrandInput] = useState("");

  // Review form
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    badge: "5 stars",
    quote: "",
    note: "",
  });

  // Security pin
  const [newPin, setNewPin] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  // Code copy feedback
  const [copiedCode, setCopiedCode] = useState(false);
  const [jsonNotice, setJsonNotice] = useState("");

  // Handle Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setAuthError(false);
      setPinInput("");
    } else {
      setAuthError(true);
    }
  };

  // Filtered Products
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

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    addProduct(newProduct.categoryId, {
      name: newProduct.name.trim(),
      price: newProduct.price.trim() || undefined,
      tag: newProduct.tag.trim() || undefined,
    });
    setNewProduct({
      name: "",
      price: "",
      tag: "",
      categoryId: newProduct.categoryId,
    });
    setShowAddProductModal(false);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.item.name.trim()) return;
    updateProduct(editingProduct.catId, editingProduct.index, {
      name: editingProduct.item.name.trim(),
      price: editingProduct.item.price?.trim() || undefined,
      tag: editingProduct.item.tag?.trim() || undefined,
    });
    setEditingProduct(null);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim()) return;
    addService({
      ...newService,
      title: newService.title.trim(),
      text: newService.text.trim(),
    });
    setNewService({ title: "", text: "", icon: "laptop", tone: "white" });
    setShowAddService(false);
  };

  const handleUpdateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceIndex === null || !newService.title.trim()) return;
    updateService(editingServiceIndex, newService);
    setEditingServiceIndex(null);
    setNewService({ title: "", text: "", icon: "laptop", tone: "white" });
    setShowAddService(false);
  };

  const handleSaveBiz = (e: React.FormEvent) => {
    e.preventDefault();
    updateBiz(bizForm);
    setBizSaved(true);
    setTimeout(() => setBizSaved(false), 2500);
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    addBrand(newBrandInput.trim());
    setNewBrandInput("");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.quote.trim()) return;
    addReview(newReview);
    setNewReview({ name: "", badge: "5 stars", quote: "", note: "" });
    setShowAddReview(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateTypeScriptCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `padmashree-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (importData(parsed)) {
          setJsonNotice("Data imported successfully!");
          setTimeout(() => setJsonNotice(""), 3000);
        } else {
          setJsonNotice("Failed to import: invalid format");
        }
      } catch {
        setJsonNotice("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 md:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAdminOpen(false)}
        className="fixed inset-0 bg-navy/80 backdrop-blur-md"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-paper-light shadow-[0_20px_50px_rgba(8,18,47,0.45)] border-2 border-navy/20"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-navy/15 bg-paper px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-white shadow-[0_2px_0_#050b22]">
              <Lock size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight text-navy sm:text-xl">Store Admin Studio</h2>
                <span className="rounded bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
                  Live Management
                </span>
              </div>
              <p className="font-mono text-[11px] text-navy/60">Manage products, services, contact &amp; content in real time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="hidden items-center gap-1.5 rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-xs font-bold text-navy hover:bg-navy/5 sm:inline-flex"
                title="Log out"
              >
                <Unlock size={14} /> Log out
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-lg bg-navy/10 text-navy transition-colors hover:bg-brand hover:text-white"
              aria-label="Close Admin Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAdminAuthenticated ? (
          /* Authentication Screen */
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-navy/25 bg-paper p-8 shadow-sm">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-[0_4px_0_#8f1020]">
                <Key size={26} />
              </span>
              <h3 className="text-2xl font-black text-navy">Admin Access Required</h3>
              <p className="mt-2 text-sm text-navy/70">
                Enter your store passkey to unlock the product, service, and settings editor.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Enter PIN (Default: admin123)"
                    className={cn(
                      "w-full rounded-xl border-2 bg-white px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-navy outline-none transition-colors",
                      authError ? "border-brand bg-red-50 text-brand" : "border-navy/20 focus:border-brand",
                    )}
                    autoFocus
                  />
                  {authError && <p className="mt-2 text-xs font-bold text-brand">Incorrect passkey. Please try again.</p>}
                  <p className="mt-2 text-[11px] font-mono text-navy/50">Default owner PIN: <strong className="text-navy">admin123</strong></p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand py-3 text-base font-extrabold text-white shadow-[0_4px_0_#8f1020] transition-transform active:translate-y-1 active:shadow-none hover:brightness-105"
                >
                  Unlock Admin Studio
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Sidebar Navigation */}
            <div className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-navy/15 bg-paper p-2 md:w-56 md:flex-col md:border-b-0 md:border-r-2 md:p-3">
              <button
                onClick={() => setActiveTab("products")}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === "products" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                )}
              >
                <Package size={17} /> Products ({data.catalog.reduce((acc, c) => acc + c.items.length, 0)})
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === "services" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                )}
              >
                <Wrench size={17} /> Services ({data.services.length})
              </button>

              <button
                onClick={() => setActiveTab("biz")}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === "biz" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                )}
              >
                <Building size={17} /> Store &amp; Contact
              </button>

              <button
                onClick={() => setActiveTab("brands_reviews")}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === "brands_reviews" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                )}
              >
                <Star size={17} /> Brands &amp; Reviews
              </button>

              <button
                onClick={() => setActiveTab("sync")}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === "sync" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                )}
              >
                <Copy size={17} /> Code Sync &amp; Backup
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === "security" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "text-navy hover:bg-navy/10",
                )}
              >
                <Key size={17} /> Change PIN
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: PRODUCTS */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  {/* Top bar: Search & Add button */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products by name or tag..."
                        className="w-full rounded-xl border-2 border-navy/20 bg-white py-2 pl-9 pr-3 text-sm font-medium text-navy outline-none focus:border-brand"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewProduct({
                            name: "",
                            price: "",
                            tag: "",
                            categoryId: selectedCatId !== "all" ? selectedCatId : data.catalog[0]?.id || "laptops",
                          });
                          setShowAddProductModal(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020] hover:brightness-105 active:translate-y-0.5 active:shadow-none"
                      >
                        <Plus size={16} /> Add Product
                      </button>

                      <button
                        onClick={() => setShowAddCat(!showAddCat)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm font-bold text-navy hover:bg-navy/5"
                      >
                        <Layers size={15} /> Categories
                      </button>
                    </div>
                  </div>

                  {/* Add Category Section */}
                  {showAddCat && (
                    <div className="rounded-xl border-2 border-dashed border-navy/20 bg-paper p-4">
                      <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-navy/70">
                        Manage Product Categories
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={newCategoryLabel}
                          onChange={(e) => setNewCategoryLabel(e.target.value)}
                          placeholder="New category name (e.g. Graphic Cards)"
                          className="rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-medium text-navy outline-none focus:border-brand"
                        />
                        <button
                          onClick={() => {
                            if (newCategoryLabel.trim()) {
                              addCategory(newCategoryLabel.trim());
                              setNewCategoryLabel("");
                            }
                          }}
                          className="rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                        >
                          Add Category
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-navy/10">
                        {data.catalog.map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-navy border border-navy/15"
                          >
                            {cat.label} ({cat.items.length})
                            {data.catalog.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete category "${cat.label}" and its items?`)) {
                                    deleteCategory(cat.id);
                                    if (selectedCatId === cat.id) setSelectedCatId("all");
                                  }
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

                  {/* Category Filter Tabs */}
                  <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                    <button
                      onClick={() => setSelectedCatId("all")}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap",
                        selectedCatId === "all" ? "bg-navy text-white shadow-[0_2px_0_#050b22]" : "bg-paper text-navy hover:bg-navy/10",
                      )}
                    >
                      All ({data.catalog.reduce((acc, c) => acc + c.items.length, 0)})
                    </button>
                    {data.catalog.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap",
                          selectedCatId === cat.id
                            ? "bg-navy text-white shadow-[0_2px_0_#050b22]"
                            : "bg-paper text-navy hover:bg-navy/10",
                        )}
                      >
                        {cat.label} ({cat.items.length})
                      </button>
                    ))}
                  </div>

                  {/* Product List */}
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map(({ catId, catLabel, item, index }) => (
                      <div
                        key={`${catId}-${index}-${item.name}`}
                        className="group relative flex flex-col justify-between rounded-xl border border-navy/15 bg-white p-3.5 shadow-sm transition-all hover:border-brand/40 hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="rounded bg-navy/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-navy/70">
                              {catLabel}
                            </span>
                            {item.tag && (
                              <span className="rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-brand">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <h4 className="mt-2 text-sm font-extrabold text-navy line-clamp-2">{item.name}</h4>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-navy/10 pt-2.5">
                          <span className="font-mono text-sm font-black text-brand">
                            {item.price ? `₹${item.price}` : "Call for price"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingProduct({ catId, index, item: { ...item } })}
                              className="rounded p-1 text-navy/50 hover:bg-navy/10 hover:text-navy"
                              title="Edit product"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${item.name}"?`)) {
                                  deleteProduct(catId, index);
                                }
                              }}
                              className="rounded p-1 text-navy/50 hover:bg-brand/10 hover:text-brand"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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

              {/* TAB 2: SERVICES */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-navy">Store &amp; Workshop Services</h3>
                      <p className="text-xs text-navy/60">Add and customize repair, upgrade, and rental cards</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingServiceIndex(null);
                        setNewService({ title: "", text: "", icon: "laptop", tone: "white" });
                        setShowAddService(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
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
                        {editingServiceIndex !== null ? "Edit Service" : "Add New Service Card"}
                      </h4>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Service Title</label>
                          <input
                            type="text"
                            required
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            placeholder="e.g. GPU Reballing & Diagnostics"
                            className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Icon</label>
                          <select
                            value={newService.icon}
                            onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
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
                        <div className="mt-1 flex gap-3">
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
                        <label className="block text-xs font-mono font-bold uppercase text-navy/70">Description Text</label>
                        <textarea
                          rows={2}
                          required
                          value={newService.text}
                          onChange={(e) => setNewService({ ...newService, text: e.target.value })}
                          placeholder="Short summary of what is included in this service..."
                          className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                        />
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                        >
                          {editingServiceIndex !== null ? "Save Changes" : "Create Service"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddService(false);
                            setEditingServiceIndex(null);
                          }}
                          className="rounded-lg border border-navy/20 bg-white px-3 py-2 text-xs font-bold text-navy"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Services List */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.services.map((service, index) => {
                      const IconComp = SERVICE_ICONS.find((i) => i.id === service.icon)?.icon || Laptop;
                      return (
                        <div
                          key={`${service.title}-${index}`}
                          className="flex flex-col justify-between rounded-xl border border-navy/15 bg-white p-4 shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy/10 text-navy">
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
                              className="rounded p-1.5 text-navy/60 hover:bg-navy/10 hover:text-navy"
                              title="Edit service"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete service "${service.title}"?`)) {
                                  deleteService(index);
                                }
                              }}
                              className="rounded p-1.5 text-navy/60 hover:bg-brand/10 hover:text-brand"
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

              {/* TAB 3: STORE & CONTACT */}
              {activeTab === "biz" && (
                <form onSubmit={handleSaveBiz} className="max-w-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-navy">Store Details &amp; Contact Numbers</h3>
                      <p className="text-xs text-navy/60">Updates the header, hero, contact section, and footer</p>
                    </div>
                    {bizSaved && (
                      <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                        <Check size={14} /> Saved Live!
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Shop Name</label>
                      <input
                        type="text"
                        value={bizForm.name}
                        onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Tagline</label>
                      <input
                        type="text"
                        value={bizForm.tagline}
                        onChange={(e) => setBizForm({ ...bizForm, tagline: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
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
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">Primary Tel Link</label>
                      <input
                        type="text"
                        value={bizForm.phoneTel}
                        onChange={(e) => setBizForm({ ...bizForm, phoneTel: e.target.value })}
                        placeholder="+918888494624"
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">WhatsApp Number</label>
                      <input
                        type="text"
                        value={bizForm.whatsapp}
                        onChange={(e) => setBizForm({ ...bizForm, whatsapp: e.target.value })}
                        placeholder="919860353118"
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono text-navy outline-none focus:border-brand"
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
                    <label className="block text-xs font-mono font-bold uppercase text-navy/70">Google Maps Direction URL</label>
                    <input
                      type="text"
                      value={bizForm.directions}
                      onChange={(e) => setBizForm({ ...bizForm, directions: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-xs font-mono text-navy outline-none focus:border-brand"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020] hover:brightness-105 active:translate-y-0.5 active:shadow-none"
                  >
                    <Save size={16} /> Save Store Details
                  </button>
                </form>
              )}

              {/* TAB 4: BRANDS & REVIEWS */}
              {activeTab === "brands_reviews" && (
                <div className="space-y-8">
                  {/* Brands */}
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Brands Ticker</h3>
                    <p className="text-xs text-navy/60">Brands displayed in the marquee banner across the homepage</p>

                    <form onSubmit={handleAddBrand} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newBrandInput}
                        onChange={(e) => setNewBrandInput(e.target.value)}
                        placeholder="Brand name (e.g. Acer, Razer, Sony)"
                        className="rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
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
                            onClick={() => deleteBrand(i)}
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
                  <div className="border-t border-navy/15 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-navy">Customer Reviews</h3>
                        <p className="text-xs text-navy/60">Google &amp; customer testimonials shown in section 04</p>
                      </div>

                      <button
                        onClick={() => setShowAddReview(!showAddReview)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#8f1020]"
                      >
                        <Plus size={14} /> Add Review
                      </button>
                    </div>

                    {showAddReview && (
                      <form onSubmit={handleAddReview} className="mt-3 rounded-xl border border-navy/20 bg-paper p-4 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-mono font-bold uppercase text-navy/70">Customer Name</label>
                            <input
                              type="text"
                              required
                              value={newReview.name}
                              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                              placeholder="e.g. Ramesh Patil"
                              className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-bold text-navy outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-bold uppercase text-navy/70">Badge</label>
                            <input
                              type="text"
                              value={newReview.badge}
                              onChange={(e) => setNewReview({ ...newReview, badge: e.target.value })}
                              placeholder="e.g. Local Guide · 5 stars"
                              className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-mono text-navy outline-none"
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
                            className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm font-serif italic text-navy outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-navy/70">Details / Note</label>
                          <textarea
                            rows={2}
                            value={newReview.note}
                            onChange={(e) => setNewReview({ ...newReview, note: e.target.value })}
                            placeholder="Additional context on the repair..."
                            className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-sm text-navy outline-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                          >
                            Save Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddReview(false)}
                            className="rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-xs font-bold text-navy"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                                if (confirm(`Delete review from "${r.name}"?`)) {
                                  deleteReview(i);
                                }
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

              {/* TAB 5: CODE SYNC & BACKUP */}
              {activeTab === "sync" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Data Backup &amp; Code Synchronization</h3>
                    <p className="text-xs text-navy/60">
                      All your edits are automatically saved in your browser's persistent storage. Use this screen to download backups or copy updated TypeScript code directly into your project files.
                    </p>
                  </div>

                  {jsonNotice && (
                    <div className="rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white">
                      {jsonNotice}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Copy TS Code */}
                    <div className="rounded-xl border-2 border-navy/20 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Copy size={18} className="text-brand" />
                        <h4 className="font-extrabold text-navy">Copy Updated data.ts</h4>
                      </div>
                      <p className="mt-1 text-xs text-navy/70">
                        Generates the exact TypeScript code matching all your current products, services, and store details. You can paste it into <code className="bg-paper px-1 py-0.5 rounded text-navy">src/data.ts</code>.
                      </p>
                      <button
                        onClick={handleCopyCode}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22] hover:bg-brand"
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
                        Export your entire database as a standalone JSON backup file to keep safe or transfer to another device.
                      </p>
                      <button
                        onClick={handleDownloadJSON}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-navy/5"
                      >
                        <Download size={14} /> Download JSON
                      </button>
                    </div>

                    {/* Import JSON */}
                    <div className="rounded-xl border-2 border-navy/20 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Upload size={18} className="text-navy" />
                        <h4 className="font-extrabold text-navy">Import Backup JSON</h4>
                      </div>
                      <p className="mt-1 text-xs text-navy/70">
                        Restore products, services, and store data from a previously downloaded JSON backup file.
                      </p>
                      <label className="mt-4 inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-navy/5 cursor-pointer">
                        <Upload size={14} /> Select JSON File
                        <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                      </label>
                    </div>

                    {/* Reset to Factory Defaults */}
                    <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
                      <div className="flex items-center gap-2 text-brand">
                        <RotateCcw size={18} />
                        <h4 className="font-extrabold">Reset to Defaults</h4>
                      </div>
                      <p className="mt-1 text-xs text-red-900/70">
                        Restores the stock default products, services, and information bundled with the template.
                      </p>
                      <button
                        onClick={() => {
                          if (confirm("Reset all products and services back to template defaults? Custom changes will be wiped.")) {
                            resetToDefaults();
                            setJsonNotice("Reset to template stock successfully!");
                            setTimeout(() => setJsonNotice(""), 3000);
                          }
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-brand/30 bg-white px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand hover:text-white"
                      >
                        <RotateCcw size={13} /> Restore Template Defaults
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SECURITY */}
              {activeTab === "security" && (
                <div className="max-w-md space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-navy">Change Admin PIN</h3>
                    <p className="text-xs text-navy/60">Update the passkey used to open and edit the store</p>
                  </div>

                  <div className="rounded-xl border-2 border-navy/20 bg-white p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-navy/70">New Passkey / PIN</label>
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => {
                          setNewPin(e.target.value);
                          setPinSuccess(false);
                        }}
                        placeholder="At least 4 characters"
                        className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                      />
                    </div>

                    {pinSuccess && (
                      <p className="text-xs font-bold text-green-700">PIN updated successfully!</p>
                    )}

                    <button
                      onClick={() => {
                        if (newPin.trim().length >= 4) {
                          updateAdminPin(newPin.trim());
                          setPinSuccess(true);
                          setNewPin("");
                        } else {
                          alert("PIN must be at least 4 characters.");
                        }
                      }}
                      className="rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_#050b22]"
                    >
                      Update Passkey
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal: Add New Product */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddProductModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-2xl border-2 border-navy/20 bg-paper-light p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-navy/15 pb-3">
                <h3 className="text-lg font-extrabold text-navy">Add New Product</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="rounded p-1 text-navy/50 hover:bg-navy/10"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
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
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Price in ₹ (Optional — leave blank for 'Call for price')
                  </label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g. 24,999"
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Tag / Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    placeholder="e.g. Refurbished, Business, Gaming, New"
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                  />
                </div>

                <div className="mt-5 flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-brand py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#8f1020]"
                  >
                    Add Product Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-bold text-navy"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Product */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setEditingProduct(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-2xl border-2 border-navy/20 bg-paper-light p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-navy/15 pb-3">
                <h3 className="text-lg font-extrabold text-navy">Edit Product</h3>
                <button onClick={() => setEditingProduct(null)} className="rounded p-1 text-navy/50 hover:bg-navy/10">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateProductSubmit} className="mt-4 space-y-3">
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
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Price in ₹ (Leave blank for 'Call for price')
                  </label>
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
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-mono font-bold text-navy outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-navy/70">
                    Tag / Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.item.tag || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        item: { ...editingProduct.item, tag: e.target.value },
                      })
                    }
                    placeholder="e.g. Refurbished, Ink tank, Laser"
                    className="mt-1 w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand"
                  />
                </div>

                <div className="mt-5 flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-navy py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#050b22]"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-bold text-navy"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

