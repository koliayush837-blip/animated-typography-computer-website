import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
const ACTIVITY_FILE = path.join(DATA_DIR, "activity.json");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");
export const UPLOADS_DIR = path.join(ROOT_DIR, "public", "uploads");

// Ensure directories exist
for (const dir of [DATA_DIR, BACKUPS_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initial stock photography helper
const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900`;

export const DEFAULT_STORE = {
  biz: {
    name: "Padmashree Computers",
    tagline: "Your Technology Partner",
    phoneDisplay: "088884 94624",
    phoneTel: "+918888494624",
    altPhoneDisplay: "98603 53118",
    altPhoneTel: "+919860353118",
    whatsapp: "919860353118",
    address: "Shop No. 2, Downtown Rd, Pathare-Thube Nagar, Ashoka Nagar, Kharadi, Pune, Maharashtra 411014",
    directions: "https://www.google.com/maps/dir/?api=1&destination=Padmashree+Computers+Ashoka+Nagar+Kharadi+Pune",
    mapEmbed: "https://www.google.com/maps?q=Padmashree+Computers,+Ashoka+Nagar,+Kharadi,+Pune+411014&output=embed",
  },
  hours: [
    { days: "Monday – Saturday", short: "Mon – Sat", open: "10:00 am", close: "9:00 pm" },
    { days: "Sunday", short: "Sun", open: "10:00 am", close: "8:30 pm" },
  ],
  brands: ["Lenovo", "Apple", "HP", "Dell", "Asus", "Acer", "MSI"],
  services: [
    {
      icon: "laptop",
      title: "Laptops & Desktops",
      text: "New and refurbished laptops and desktops from top brands, picked for best value.",
      tone: "white",
    },
    {
      icon: "rental",
      title: "Laptop & Desktop Rental",
      text: "Need a machine for a project, event or office? Rent one. Call us for rates and terms.",
      tone: "navy",
    },
    {
      icon: "chip",
      title: "Chip-Level Repair",
      text: "Board-level diagnosis and repair for laptops and desktops when others say 'beyond repair'.",
      tone: "red",
    },
    {
      icon: "battery",
      title: "Screen & Battery Replacement",
      text: "Cracked screen or tired battery? Replaced with genuine parts, often within the hour.",
      tone: "white",
    },
    {
      icon: "memory",
      title: "RAM & SSD Upgrades",
      text: "Give your old machine a second life with faster storage and more memory.",
      tone: "navy",
    },
    {
      icon: "shield",
      title: "OS, Data Recovery & Virus Removal",
      text: "Clean OS installs, rescue of lost files and thorough malware clean-up.",
      tone: "white",
    },
    {
      icon: "keyboard",
      title: "Accessories & Peripherals",
      text: "Printers, keyboards, mice, adapters, cables and more, all under one roof.",
      tone: "red",
    },
    {
      icon: "pc",
      title: "Custom PC Assembly",
      text: "A desktop built around your budget and your work, from gaming to accounts.",
      tone: "white",
    },
    {
      icon: "monitor",
      title: "Desktop Repairing Centre",
      text: "Dedicated bench for desktop faults: power, display, boot, noise and more.",
      tone: "navy",
    },
  ],
  catalog: [
    {
      id: "laptops",
      label: "Laptops",
      items: [
        { name: "Dell Latitude 5300 2-in-1", tag: "Business", inStock: true, stockStatus: "in_stock" },
        { name: 'Dell Latitude 3470 14"', tag: "Business", inStock: true, stockStatus: "in_stock" },
        { name: "Dell Latitude 7410", tag: "Business", inStock: true, stockStatus: "in_stock" },
        { name: "Refurbished laptops", tag: "Refurbished", inStock: true, stockStatus: "in_stock" },
        { name: "New laptops, all brands", tag: "New", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "desktops",
      label: "Desktops",
      items: [
        { name: "Refurbished desktops", tag: "Refurbished", inStock: true, stockStatus: "in_stock" },
        { name: "Custom-built desktop PC", tag: "Built to order", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "monitors",
      label: "Monitors",
      items: [
        { name: 'Lenovo 27"', price: "11,999", tag: "27 inch", inStock: true, stockStatus: "in_stock" },
        { name: 'Fingers 21.5"', price: "5,500", tag: "21.5 inch", inStock: true, stockStatus: "in_stock" },
        { name: 'Frontech 22"', tag: "22 inch", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "printers",
      label: "Printers",
      items: [
        { name: "Epson EcoTank L3250", price: "16,500", tag: "Ink tank", inStock: true, stockStatus: "in_stock" },
        { name: "Epson Printer L3215", price: "13,750", tag: "Ink tank", inStock: true, stockStatus: "in_stock" },
        { name: "Epson M1120 EcoTank", tag: "Ink tank", inStock: true, stockStatus: "in_stock" },
        { name: "HP 1108 Plus", tag: "Laser", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "ups",
      label: "UPS",
      items: [
        { name: "Artis 600VA UPS", price: "2,600", tag: "600VA", inStock: true, stockStatus: "in_stock" },
        { name: "Standard UPS", tag: "Backup", inStock: true, stockStatus: "in_stock" },
        { name: "Router UPS", tag: "Backup", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "mice",
      label: "Mice",
      items: [
        { name: "HP S500 Wireless", price: "799", tag: "Wireless", inStock: true, stockStatus: "in_stock" },
        { name: "Logitech M170 Wireless", tag: "Wireless", inStock: true, stockStatus: "in_stock" },
        { name: "Dell MS116 Wired", tag: "Wired", inStock: true, stockStatus: "in_stock" },
        { name: "HP M10 Wired", tag: "Wired", inStock: true, stockStatus: "in_stock" },
        { name: "Lenovo 130 Wireless", tag: "Wireless", inStock: true, stockStatus: "in_stock" },
        { name: "Protouch Wireless (RGB)", tag: "Wireless", inStock: true, stockStatus: "in_stock" },
        { name: "WM118 Wireless", tag: "Wireless", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "audio",
      label: "Headphones",
      items: [{ name: "Zebronics Supreme USB Headphone with Mic", price: "750", tag: "USB", inStock: true, stockStatus: "in_stock" }],
    },
    {
      id: "accessories",
      label: "Accessories",
      items: [
        { name: "Type-C to HDMI 3-in-1 adapter", price: "650", tag: "Adapter", inStock: true, stockStatus: "in_stock" },
        { name: "Micro-USB data cable", price: "145", tag: "Cable", inStock: true, stockStatus: "in_stock" },
        { name: "Type-C data cable", price: "145", tag: "Cable", inStock: true, stockStatus: "in_stock" },
        { name: "Network cable tester", tag: "Tool", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "software",
      label: "Software",
      items: [
        { name: "Quick Heal Total Security", tag: "Antivirus", inStock: true, stockStatus: "in_stock" },
        { name: "Net Protector Total Security", tag: "Antivirus", inStock: true, stockStatus: "in_stock" },
      ],
    },
    {
      id: "spares",
      label: "Laptop Spares",
      items: ["Screens", "Batteries", "Keyboards", "Processor fans", "Hinges", "Speakers", "Motherboards"].map(
        (name) => ({ name, tag: "Spare part", inStock: true, stockStatus: "in_stock" }),
      ),
    },
  ],
  reviews: [
    {
      name: "Sahas Balbudhe",
      badge: "5 stars",
      quote: "The service is reliable, the staff is helpful.",
      note: "Customer for components, repairs and servicing.",
    },
    {
      name: "Vishwamber Kale",
      badge: "Local Guide · 5 stars",
      quote: "Replaced it within an hour.",
      note: "A cracked laptop screen sorted in no time, and the staff explained everything clearly.",
    },
    {
      name: "Usman Shaik",
      badge: "5 stars",
      quote: "Very polite and friendly.",
      note: "Exchanged an old laptop for another one and loved the staff.",
    },
  ],
  gallery: [
    { src: px(10558598), cap: "Chip-level repair", alt: "Technician repairing the internals of a laptop" },
    { src: px(7500056), cap: "Laptops, ready to go", alt: "Row of laptops on a table" },
    { src: px(10558600), cap: "Cooling & thermal service", alt: "Applying thermal paste to a laptop chip" },
    { src: px(7639355), cap: "Motherboard diagnostics", alt: "Hand over a computer motherboard" },
    { src: px(12741849), cap: "Expert technicians", alt: "Technicians working on laptops" },
    { src: px(1010487), cap: "Desktops & components", alt: "Stack of computer processing units" },
  ],
};

// Thread-safe / Atomic write helper
function atomicWriteJson(filePath, data) {
  const tmpPath = `${filePath}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}

// Store Database Operations
export function getStoreData() {
  if (!fs.existsSync(STORE_FILE)) {
    atomicWriteJson(STORE_FILE, DEFAULT_STORE);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    const data = JSON.parse(raw);
    // Ensure gallery and other arrays exist for backwards compatibility
    if (!Array.isArray(data.gallery)) {
      data.gallery = DEFAULT_STORE.gallery;
    }
    return data;
  } catch (err) {
    console.error("Error reading store.json, restoring defaults:", err);
    return DEFAULT_STORE;
  }
}

export function saveStoreData(data) {
  atomicWriteJson(STORE_FILE, data);
}

// Activity Logging
export function logActivity(action, details, ip = "127.0.0.1") {
  let logs = [];
  try {
    if (fs.existsSync(ACTIVITY_FILE)) {
      logs = JSON.parse(fs.readFileSync(ACTIVITY_FILE, "utf-8"));
    }
  } catch {
    logs = [];
  }

  const entry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    ip: ip.replace("::ffff:", ""),
  };

  logs.unshift(entry);
  if (logs.length > 200) {
    logs = logs.slice(0, 200);
  }

  atomicWriteJson(ACTIVITY_FILE, logs);
  return entry;
}

export function getActivityLog(limit = 30) {
  try {
    if (fs.existsSync(ACTIVITY_FILE)) {
      const logs = JSON.parse(fs.readFileSync(ACTIVITY_FILE, "utf-8"));
      return logs.slice(0, limit);
    }
  } catch (err) {
    console.error("Error reading activity log:", err);
  }
  return [];
}

// Auth Record Management
export function getAuthRecord() {
  if (!fs.existsSync(AUTH_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export function saveAuthRecord(record) {
  atomicWriteJson(AUTH_FILE, record);
}

// Backup & Restoration
export function createBackup() {
  const data = getStoreData();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUPS_DIR, `backup-${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), "utf-8");
  return { file: path.basename(backupFile), timestamp, size: fs.statSync(backupFile).size };
}

export function listBackups() {
  if (!fs.existsSync(BACKUPS_DIR)) return [];
  const files = fs.readdirSync(BACKUPS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const stat = fs.statSync(path.join(BACKUPS_DIR, f));
    return { name: f, size: stat.size, createdAt: stat.mtime.toISOString() };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function restoreBackup(backupData) {
  // Validate schema
  if (!backupData || typeof backupData !== "object") {
    throw new Error("Invalid backup format: root must be an object");
  }
  if (!backupData.biz || !Array.isArray(backupData.catalog) || !Array.isArray(backupData.services)) {
    throw new Error("Invalid backup format: missing required biz, catalog, or services fields");
  }

  // Create an automatic safety backup of current state first
  createBackup();

  // Apply restore
  saveStoreData(backupData);
}

export function resetToDefaults() {
  createBackup();
  atomicWriteJson(STORE_FILE, DEFAULT_STORE);
  return DEFAULT_STORE;
}

