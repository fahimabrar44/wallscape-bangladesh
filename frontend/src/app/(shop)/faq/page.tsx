'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQGroup {
  category: string;
  items: FAQItem[];
}

const faqs: FAQGroup[] = [
  {
    category: 'Orders & Payment',
    items: [
      { q: 'How do I place an order?', a: 'Browse our catalogue, select your desired wallpaper or wall panel, choose the size/quantity, and click "Add to Cart." Proceed to checkout, enter your shipping details, and complete payment via bKash, Nagad, Rocket, or card.' },
      { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, Rocket, all major credit/debit cards (Visa, Mastercard, American Express), and Cash on Delivery (selected areas within Dhaka).' },
      { q: 'Is Cash on Delivery (COD) available?', a: 'COD is available for selected areas within Dhaka city. Orders outside Dhaka require advance payment via bKash, Nagad, or card.' },
      { q: 'Can I change my order after placing it?', a: 'You can make changes within 2 hours of placing the order as long as it has not been processed. Contact our support team immediately to request changes.' },
      { q: 'Can I cancel my order?', a: 'Yes, cancellations are accepted within 2 hours of placing the order. Once the order is packed or shipped, cancellation is not possible — you may return it after delivery as per our return policy.' },
    ],
  },
  {
    category: 'Delivery',
    items: [
      { q: 'How long does delivery take?', a: 'Dhaka: 1–3 business days. Divisional cities: 3–5 days. Other districts: 5–8 days. Remote areas: 7–12 days. Timelines are estimates and may vary during peak seasons.' },
      { q: 'How much is delivery?', a: 'Orders above BDT 2,000 qualify for free standard delivery. Standard delivery within Dhaka: BDT 100–200. Outside Dhaka: BDT 150–350. Express delivery (Dhaka only): additional BDT 150.' },
      { q: 'Do you ship outside Bangladesh?', a: 'Currently, we only ship within Bangladesh. We do not offer international shipping at this time.' },
      { q: 'How can I track my order?', a: 'Once your order is dispatched, you will receive an email and SMS with a tracking number and a link to track your shipment in real time.' },
    ],
  },
  {
    category: 'Installation',
    items: [
      { q: 'Do you offer installation services?', a: 'Yes, we provide professional installation services in Dhaka at an additional charge. Contact us for a quote. For customers outside Dhaka, we provide detailed installation guides and video tutorials.' },
      { q: 'Can I install the wallpaper myself?', a: 'Absolutely! Many of our customers install wallpaper themselves. We provide step-by-step instructions with every order. For best results, ensure the wall is clean, smooth, and dry before installation.' },
      { q: 'What tools do I need for installation?', a: 'You will need a measuring tape, level, utility knife, smoothing tool or spatula, wallpaper adhesive (if not pre-pasted), and a clean cloth.' },
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      { q: 'What types of wallpaper do you sell?', a: 'We offer PVC wallpaper, vinyl wallpaper, non-woven wallpaper, 3D wall panels, Korean luxury wallpaper, and fabric-backed wallpaper. Each type is suitable for different rooms and conditions.' },
      { q: 'Are your wallpapers water-resistant?', a: 'Our PVC and vinyl wallpapers are water-resistant and suitable for kitchens and bathrooms. However, we recommend avoiding direct water exposure. For high-moisture areas, our 3D PVC wall panels are an excellent choice.' },
      { q: 'How do I choose the right wallpaper?', a: 'Consider the room type, lighting, and desired mood. For small rooms, light-coloured wallpapers with subtle patterns create a spacious feel. For feature walls, bold patterns or 3D panels work well. Contact us for a free consultation!' },
      { q: 'Do you have physical samples?', a: 'Yes, we offer physical sample swatches for most of our premium wallpapers. Samples are delivered within 2–3 business days within Dhaka. Contact us to request samples.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unused, uninstalled products in original packaging. Custom-cut and clearance items are non-returnable unless defective.' },
      { q: 'I received a damaged product. What should I do?', a: 'We are sorry about that! Please contact us within 48 hours of delivery with photos of the damaged product and packaging. We will arrange a free replacement or full refund.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. bKash/Nagad refunds are instant; card refunds may take 7–10 business days depending on your bank.' },
    ],
  },
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const allCategories = ['all', ...faqs.map((g) => g.category)];
  const filteredFaqs = activeTab === 'all' ? faqs : faqs.filter((g) => g.category === activeTab);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">FAQ</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">Frequently Asked Questions</h1>
        <p className="text-muted mb-6">Find answers to the most common questions about our products and services.</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
              className={activeTab === cat ? 'btn-primary' : 'btn-ghost'}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {filteredFaqs.map((group) => (
          <div key={group.category} className="mb-8">
            <h2 className="section-label mb-4">{group.category}</h2>
            <div className="space-y-2">
              {group.items.map((item, idx) => {
                const key = `${group.category}-${idx}`;
                const isOpen = openIndex === key;
                return (
                  <div key={key} className="card-modern overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-sm lg:text-base hover:bg-gray-50/50 transition"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="px-5 pb-4 text-sm text-muted leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="card-modern p-6 text-center">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-muted mb-4">Our support team is happy to help.</p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
