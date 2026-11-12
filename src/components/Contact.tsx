import { useState } from "react";
import { Clock, MapPin, MessageCircle, Navigation, Phone, Send, CheckCircle2 } from "lucide-react";
import { PaperButton, Reveal, SectionHead, Torn, useOpenStatus } from "./ui";
import { cn } from "../utils/cn";
import { useData } from "../context/DataContext";

interface ContactProps {
  sectionNo?: string;
  showForm?: boolean;
}

export default function Contact({ sectionNo = "06", showForm = true }: ContactProps) {
  const { data } = useData();
  const biz = data.biz;
  const hours = data.hours;
  const waLink = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(
    "Hello " + biz.name + ", I'd like to know more about your products and services.",
  )}`;

  const status = useOpenStatus();
  const todayIdx = status.isSunday ? 1 : 0;

  // Enquiry Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("Laptop / Desktop Repair");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          topic,
          message: message.trim(),
        }),
      });
    } catch {
      // Proceed to WhatsApp even if offline
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }

    const customWaText = `Hello ${biz.name},\n\n*New Website Enquiry*\n• *Name:* ${name.trim()}\n• *Phone:* ${phone.trim()}\n• *Topic:* ${topic}\n• *Message:* ${message.trim()}`;
    const customWaUrl = `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(customWaText)}`;
    window.open(customWaUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="relative px-4 pb-36 pt-12 sm:pt-16 md:px-8 md:pt-20">
      <Torn fill="#f5efe3" seed={79} position="top" />
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          no={sectionNo}
          eyebrow="Find us"
          title="Visit us"
          tone="red"
          sub="Drop in at Ashoka Nagar, Kharadi, or call ahead and we'll have the bench ready."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal rotate={-1} x={-60} y={40}>
            <div className="drop">
              <div className="fold-clip paper-bg relative space-y-8 p-5 sm:p-7 md:p-10">
                <span className="tape absolute top-0 left-10 h-7 w-24 -rotate-3" />

                <div className="flex gap-3.5 sm:gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-navy text-white shadow-[0_4px_0_#050b22]">
                    <MapPin size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">Address</h3>
                    <address className="mt-1 break-words text-base font-bold not-italic leading-snug text-navy sm:text-lg">
                      {biz.name}
                      <br />
                      {biz.address}
                    </address>
                  </div>
                </div>

                <div className="flex gap-3.5 sm:gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand text-white shadow-[0_4px_0_#8f1020]">
                    <Phone size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">Call</h3>
                    <a href={`tel:${biz.phoneTel}`} className="mt-1 block break-words text-xl font-extrabold tracking-tight text-navy transition-colors hover:text-brand sm:text-3xl">
                      {biz.phoneDisplay}
                    </a>
                    {biz.altPhoneDisplay && (
                      <a href={`tel:${biz.altPhoneTel}`} className="mt-1 block font-mono text-sm text-navy/70 hover:text-brand">
                        Alt: {biz.altPhoneDisplay}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-3.5 sm:gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#1f9d55] text-white shadow-[0_4px_0_#0f6b37]">
                    <MessageCircle size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">WhatsApp</h3>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block break-words text-xl font-extrabold text-navy transition-colors hover:text-brand sm:text-2xl"
                    >
                      +{biz.whatsapp}
                    </a>
                    <p className="mt-1 font-mono text-xs text-navy/60">Typical reply within an hour</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-paper-dark text-navy shadow-[0_4px_0_#c9bea3]">
                    <Clock size={22} />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">Opening hours</h3>
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-navy">
                        <span className={cn("h-2.5 w-2.5 rounded-full", status.open ? "bg-[#1f9d55] pulse-dot" : "bg-brand")} />
                        {status.label}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 border-t border-dashed border-navy/20 pt-3 text-sm">
                      {hours.map((h, i) => (
                        <li key={h.days} className={cn("flex justify-between font-bold", i === todayIdx ? "text-brand" : "text-navy/75")}>
                          <span>{h.days}</span>
                          <span className="font-mono">
                            {h.open} – {h.close}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <PaperButton href={biz.directions} external tone="navy" icon={<Navigation size={18} />}>
                    Get directions
                  </PaperButton>
                  <PaperButton href={waLink} external tone="green" icon={<MessageCircle size={18} />}>
                    Chat on WhatsApp
                  </PaperButton>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal rotate={1} x={60} y={40} delay={0.15}>
            <div className="drop h-full">
              <div className="paper-bg relative flex h-full flex-col overflow-hidden rounded-md border-4 border-white p-3 shadow-inner sm:p-4">
                <span className="tape absolute -top-1 right-12 z-10 h-7 w-28 rotate-6" />
                <div className="relative min-h-[280px] flex-1 overflow-hidden rounded sm:min-h-[360px]">
                  <iframe
                    title="Map of Padmashree Computers"
                    src={biz.mapEmbed}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-navy/70">
                  <span>Downtown Rd, Kharadi, Pune 411014</span>
                  <a href={biz.directions} target="_blank" rel="noreferrer" className="inline-flex min-h-[36px] items-center text-brand hover:underline">
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Contact Enquiry Form */}
        {showForm && (
          <Reveal y={50} delay={0.2} className="mt-14 sm:mt-20">
            <div className="drop">
              <div className="fold-clip paper-bg relative p-6 sm:p-8 md:p-12">
                <span className="tape absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2" />
                <div className="max-w-2xl">
                  <span className="rounded-sm bg-navy px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                    Direct Enquiry
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-4xl">
                    Send Us an Enquiry
                  </h3>
                  <p className="mt-2 font-serif text-lg italic text-navy/75 sm:text-xl">
                    Looking for a specific laptop model, spare part, or repair estimate? Fill out the note below and we'll get right back to you.
                  </p>
                </div>

                {submitted && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border-2 border-emerald-600/30 bg-emerald-50 p-4 text-sm font-bold text-emerald-900">
                    <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                    <span>
                      Your enquiry has been logged and opened in WhatsApp for instant response. You can also call us directly at{" "}
                      <a href={`tel:${biz.phoneTel}`} className="underline">
                        {biz.phoneDisplay}
                      </a>
                      .
                    </span>
                  </div>
                )}

                <form onSubmit={handleEnquirySubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enquiry-name" className="block font-mono text-xs font-bold uppercase tracking-wider text-navy">
                      Your Name *
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-2 min-h-[48px] w-full rounded-xl border-2 border-navy/20 bg-paper-light px-4 py-3 text-sm font-bold text-navy placeholder:font-normal placeholder:text-navy/40 focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="enquiry-phone" className="block font-mono text-xs font-bold uppercase tracking-wider text-navy">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="mt-2 min-h-[48px] w-full rounded-xl border-2 border-navy/20 bg-paper-light px-4 py-3 text-sm font-bold text-navy placeholder:font-normal placeholder:text-navy/40 focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-navy">
                      What do you need help with?
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        "Laptop / Desktop Repair",
                        "New / Refurbished Laptop",
                        "RAM / SSD Upgrade",
                        "Screen / Battery Replacement",
                        "Laptop / PC Rental",
                        "Printers & Accessories",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={cn(
                            "min-h-[44px] rounded-lg px-3.5 py-2 text-xs font-bold transition-all",
                            topic === t
                              ? "bg-navy text-white shadow-[0_3px_0_#050b22]"
                              : "border border-navy/20 bg-paper-light text-navy hover:border-brand",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="enquiry-message" className="block font-mono text-xs font-bold uppercase tracking-wider text-navy">
                      Message / Device Details *
                    </label>
                    <textarea
                      id="enquiry-message"
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us your laptop model, issue, or the product you are looking for..."
                      className="mt-2 w-full rounded-xl border-2 border-navy/20 bg-paper-light px-4 py-3 text-sm font-bold text-navy placeholder:font-normal placeholder:text-navy/40 focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-[0_5px_0_#8f1020,0_12px_20px_rgba(143,16,32,.35)] transition-all hover:-translate-y-0.5 active:translate-y-1 disabled:opacity-60 sm:w-auto"
                    >
                      <Send size={18} />
                      {submitting ? "Sending..." : "Send Enquiry & Open WhatsApp"}
                    </button>
                    <span className="font-mono text-xs text-navy/60">
                      Or call directly: <strong className="text-navy">{biz.phoneDisplay}</strong>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
