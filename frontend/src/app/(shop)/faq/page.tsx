import Link from 'next/link';
import type { Metadata } from 'next';
import FAQClient from './faq-client';

export const metadata: Metadata = {
  title: 'FAQ - WALLSCAPE BANGLADESH',
  description: 'Frequently asked questions about wallpaper ordering, delivery, installation, and returns.',
};

interface FAQItem { q: string; a: string; }
interface FAQGroup { category: string; items: FAQItem[]; }

const faqs: FAQGroup[] = [
  { category: 'Orders & Payment', items: [
    { q: 'How do I place an order?', a: 'Browse our catalogue, select your desired wallpaper or wall panel, choose the size/quantity, and click "Add to Cart." Proceed to checkout, enter your shipping details, and complete payment via bKash, Nagad, Rocket, or card.' },
    { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, Rocket, all major credit/debit cards (Visa, Mastercard, American Express), and Cash on Delivery (selected areas within Dhaka).' },
    { q: 'Is Cash on Delivery (COD) available?', a: 'COD is available for selected areas within Dhaka city. Orders outside Dhaka require advance payment via bKash, Nagad, or card.' },
    { q: 'Can I change my order after placing it?', a: 'You can make changes within 2 hours of placing the order as long as it has not been processed. Contact our support team immediately to request changes.' },
    { q: 'Can I cancel my order?', a: 'Yes, cancellations are accepted within 2 hours of placing the order. Once the order is packed or shipped, cancellation is not possible — you may return it after delivery as per our return policy.' },
  ]},
  { category: 'Delivery', items: [
    { q: 'How long does delivery take?', a: 'Dhaka: 1–3 business days. Divisional cities: 3–5 days. Other districts: 5–8 days. Remote areas: 7–12 days.' },
    { q: 'How much is delivery?', a: 'Orders above BDT 2,000 qualify for free standard delivery. Standard delivery within Dhaka: BDT 100–200. Outside Dhaka: BDT 150–350.' },
    { q: 'Do you ship outside Bangladesh?', a: 'Currently, we only ship within Bangladesh.' },
    { q: 'How can I track my order?', a: 'Once your order is dispatched, you will receive an email and SMS with a tracking number.' },
  ]},
  { category: 'Installation', items: [
    { q: 'Do you offer installation services?', a: 'Yes, we provide professional installation services in Dhaka at an additional charge.' },
    { q: 'Can I install the wallpaper myself?', a: 'Absolutely! Many of our customers install wallpaper themselves. We provide step-by-step instructions with every order.' },
    { q: 'What tools do I need for installation?', a: 'You will need a measuring tape, level, utility knife, smoothing tool, wallpaper adhesive, and a clean cloth.' },
  ]},
  { category: 'Products & Quality', items: [
    { q: 'What types of wallpaper do you sell?', a: 'We offer PVC wallpaper, vinyl wallpaper, non-woven wallpaper, 3D wall panels, Korean luxury wallpaper, and fabric-backed wallpaper.' },
    { q: 'Are your wallpapers water-resistant?', a: 'Our PVC and vinyl wallpapers are water-resistant and suitable for kitchens and bathrooms.' },
    { q: 'How do I choose the right wallpaper?', a: 'Consider the room type, lighting, and desired mood. Contact us for a free consultation!' },
    { q: 'Do you have physical samples?', a: 'Yes, we offer physical sample swatches for most of our premium wallpapers.' },
  ]},
  { category: 'Returns & Refunds', items: [
    { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unused, uninstalled products in original packaging.' },
    { q: 'I received a damaged product. What should I do?', a: 'Please contact us within 48 hours of delivery with photos of the damaged product and packaging. We will arrange a free replacement or full refund.' },
    { q: 'How long do refunds take?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item.' },
  ]},
];

export default function FAQPage() {
  return (
    <div className="container-custom py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">FAQ</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gradient text-center">Frequently Asked Questions</h1>
      <p className="text-muted text-center mb-6">Find answers to the most common questions about our products and services.</p>

      <FAQClient faqs={faqs} />

      <div className="card-modern p-6 text-center max-w-3xl mx-auto mt-8">
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-sm text-muted mb-4">Our support team is happy to help.</p>
        <Link href="/contact" className="btn-primary">Contact Us</Link>
      </div>
    </div>
  );
}
