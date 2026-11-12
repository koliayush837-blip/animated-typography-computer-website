// Business details. NOTE: confirm WhatsApp number with the client.
export const BIZ = {
  name: "Padmashree Computers",
  tagline: "Your Technology Partner",
  phoneDisplay: "088884 94624",
  phoneTel: "+918888494624",
  altPhoneDisplay: "98603 53118",
  altPhoneTel: "+919860353118",
  whatsapp: "919860353118",
  address: "Shop No. 2, Downtown Rd, Pathare-Thube Nagar, Ashoka Nagar, Kharadi, Pune, Maharashtra 411014",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Padmashree+Computers+Ashoka+Nagar+Kharadi+Pune",
  mapEmbed:
    "https://www.google.com/maps?q=Padmashree+Computers,+Ashoka+Nagar,+Kharadi,+Pune+411014&output=embed",
  heroEyebrow: "Computer store · Kharadi, Pune",
  heroTitle1: "Your",
  heroTitle2: "Technology",
  heroTitle3: "Partner",
  heroLocation: "in Kharadi, Pune",
  heroDescription:
    "New and refurbished laptops, expert repairs, upgrades and accessories, all under one roof.",
};

export const WA_LINK = `https://wa.me/${BIZ.whatsapp}?text=${encodeURIComponent(
  "Hello Padmashree Computers, I'd like to know more about your products and services.",
)}`;

export const HOURS = [
  { days: "Monday – Saturday", short: "Mon – Sat", open: "10:00 am", close: "9:00 pm" },
  { days: "Sunday", short: "Sun", open: "10:00 am", close: "8:30 pm" },
];

export const BRANDS = ["Lenovo", "Apple", "HP", "Dell", "Asus", "Acer", "MSI"];

export const SERVICES = [
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
] as const;

export type Item = {
  name: string;
  price?: string;
  tag?: string;
  image?: string;
  inStock?: boolean;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "on_order";
  slug?: string;
  description?: string;
  specs?: string[];
  featured?: boolean;
};

export function getProductSlug(item: { name: string; slug?: string }, categoryId?: string): string {
  if (item.slug && item.slug.trim()) return item.slug.trim();
  const cleanName = item.name
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (cleanName) return cleanName;
  return categoryId ? `${categoryId}-item` : "product";
}

export function findProductBySlug(
  catalog: { id: string; label: string; items: Item[] }[],
  slug: string,
): { item: Item; category: { id: string; label: string; items: Item[] }; index: number } | null {
  const normalized = slug.toLowerCase().trim();
  for (const category of catalog) {
    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];
      const itemSlug = getProductSlug(item, category.id);
      const prefixedSlug = `${category.id}-${itemSlug}`;
      if (itemSlug === normalized || prefixedSlug === normalized) {
        return { item, category, index: i };
      }
    }
  }
  return null;
}

export const CATALOG: { id: string; label: string; items: Item[] }[] = [
  {
    id: "laptops",
    label: "Laptops",
    items: [
      { name: "Dell Latitude 5300 2-in-1", tag: "Business" },
      { name: 'Dell Latitude 3470 14"', tag: "Business" },
      { name: "Dell Latitude 7410", tag: "Business" },
      { name: "Refurbished laptops", tag: "Refurbished" },
      { name: "New laptops, all brands", tag: "New" },
    ],
  },
  {
    id: "desktops",
    label: "Desktops",
    items: [
      { name: "Refurbished desktops", tag: "Refurbished" },
      { name: "Custom-built desktop PC", tag: "Built to order" },
    ],
  },
  {
    id: "monitors",
    label: "Monitors",
    items: [
      { name: 'Lenovo 27"', price: "11,999", tag: "27 inch" },
      { name: 'Fingers 21.5"', price: "5,500", tag: "21.5 inch" },
      { name: 'Frontech 22"', tag: "22 inch" },
    ],
  },
  {
    id: "printers",
    label: "Printers",
    items: [
      { name: "Epson EcoTank L3250", price: "16,500", tag: "Ink tank" },
      { name: "Epson Printer L3215", price: "13,750", tag: "Ink tank" },
      { name: "Epson M1120 EcoTank", tag: "Ink tank" },
      { name: "HP 1108 Plus", tag: "Laser" },
    ],
  },
  {
    id: "ups",
    label: "UPS",
    items: [
      { name: "Artis 600VA UPS", price: "2,600", tag: "600VA" },
      { name: "Standard UPS", tag: "Backup" },
      { name: "Router UPS", tag: "Backup" },
    ],
  },
  {
    id: "mice",
    label: "Mice",
    items: [
      { name: "HP S500 Wireless", price: "799", tag: "Wireless" },
      { name: "Logitech M170 Wireless", tag: "Wireless" },
      { name: "Dell MS116 Wired", tag: "Wired" },
      { name: "HP M10 Wired", tag: "Wired" },
      { name: "Lenovo 130 Wireless", tag: "Wireless" },
      { name: "Protouch Wireless (RGB)", tag: "Wireless" },
      { name: "WM118 Wireless", tag: "Wireless" },
    ],
  },
  {
    id: "audio",
    label: "Headphones",
    items: [{ name: "Zebronics Supreme USB Headphone with Mic", price: "750", tag: "USB" }],
  },
  {
    id: "accessories",
    label: "Accessories",
    items: [
      { name: "Type-C to HDMI 3-in-1 adapter", price: "650", tag: "Adapter" },
      { name: "Micro-USB data cable", price: "145", tag: "Cable" },
      { name: "Type-C data cable", price: "145", tag: "Cable" },
      { name: "Network cable tester", tag: "Tool" },
    ],
  },
  {
    id: "software",
    label: "Software",
    items: [
      { name: "Quick Heal Total Security", tag: "Antivirus" },
      { name: "Net Protector Total Security", tag: "Antivirus" },
    ],
  },
  {
    id: "spares",
    label: "Laptop Spares",
    items: ["Screens", "Batteries", "Keyboards", "Processor fans", "Hinges", "Speakers", "Motherboards"].map(
      (name) => ({ name, tag: "Spare part" }),
    ),
  },
];

export const REVIEWS = [
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
];

// Placeholder stock photography. Replace with the shop's own photos.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900`;

export const GALLERY = [
  { src: px(10558598), cap: "Chip-level repair", alt: "Technician repairing the internals of a laptop" },
  { src: px(7500056), cap: "Laptops, ready to go", alt: "Row of laptops on a table" },
  { src: px(10558600), cap: "Cooling & thermal service", alt: "Applying thermal paste to a laptop chip" },
  { src: px(7639355), cap: "Motherboard diagnostics", alt: "Hand over a computer motherboard" },
  { src: px(12741849), cap: "Expert technicians", alt: "Technicians working on laptops" },
  { src: px(1010487), cap: "Desktops & components", alt: "Stack of computer processing units" },
];

export const NAV = [
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#why", label: "Why us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export const PAGE_NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/why", label: "Why Us" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
