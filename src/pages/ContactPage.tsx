import Contact from "../components/Contact";
import SEOHead from "../components/SEOHead";
import { useData } from "../context/DataContext";

export default function ContactPage() {
  const { data } = useData();
  const biz = data.biz;

  return (
    <div className="pt-6 sm:pt-10">
      <SEOHead
        title={`Contact Us — Visit or Call ${biz.name} in Kharadi, Pune`}
        description={`Contact ${biz.name} at ${biz.address}. Call ${biz.phoneDisplay} or chat on WhatsApp (+${biz.whatsapp}) for laptop repairs, upgrades, and product enquiries.`}
      />
      <Contact sectionNo="01" showForm={true} />
    </div>
  );
}

