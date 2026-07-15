import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the terms and conditions of WALLSCAPE BANGLADESH. Understand your rights and obligations when purchasing from our online store.',
  openGraph: {
    title: 'Terms & Conditions | WALLSCAPE BANGLADESH',
    description:
      'Read the terms and conditions of WALLSCAPE BANGLADESH. Understand your rights and obligations when purchasing from our online store.',
  },
};

export default function TermsPage() {
  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Terms &amp; Conditions</span>
      </div>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted mb-8">Last updated: January 1, 2025</p>

        <div className="card-modern p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted leading-relaxed">
              By accessing or using the WALLSCAPE BANGLADESH website and purchasing our products, you
              agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these
              terms, you must refrain from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Eligibility</h2>
            <p className="text-muted leading-relaxed">
              You must be at least 18 years of age to make a purchase. By placing an order, you represent
              that the information you provide is accurate, complete, and current.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Products &amp; Pricing</h2>
            <p className="text-muted leading-relaxed mb-3">
              All product prices are listed in Bangladeshi Taka (BDT) and include applicable VAT unless
              stated otherwise. We reserve the right to modify prices at any time without prior notice.
              Product images are for illustration purposes; actual colours and textures may vary slightly.
            </p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li>We strive to display accurate product descriptions and specifications.</li>
              <li>In the event of a pricing error, we reserve the right to cancel or adjust the order.</li>
              <li>Promotional discounts cannot be combined unless explicitly stated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Orders &amp; Payment</h2>
            <p className="text-muted leading-relaxed mb-3">
              By placing an order, you agree to purchase the selected products at the listed price.
            </p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li>Orders are confirmed once payment is successfully processed.</li>
              <li>We accept bKash, Nagad, Rocket, credit/debit cards, and cash on delivery (select areas).</li>
              <li>We reserve the right to refuse or cancel any order for any reason, including stock unavailability or suspected fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Delivery</h2>
            <p className="text-muted leading-relaxed">
              Delivery timelines are estimated and not guaranteed. While we make every effort to deliver
              within the promised timeframe, delays may occur due to unforeseen circumstances beyond our
              control. Delivery charges vary based on location and order value.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Returns &amp; Refunds</h2>
            <p className="text-muted leading-relaxed">
              Please refer to our{' '}
              <Link href="/shipping-policy" className="text-primary hover:underline">Shipping &amp; Return Policy</Link>{' '}
              for detailed information on returns, exchanges, and refunds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              All content on this website — including text, images, logos, product designs, and code —
              is the intellectual property of WALLSCAPE BANGLADESH unless otherwise credited. You may
              not reproduce, distribute, or use any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              WALLSCAPE BANGLADESH shall not be liable for any indirect, incidental, or consequential
              damages arising from the use of our products or website. Our total liability for any claim
              shall not exceed the amount paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Governing Law</h2>
            <p className="text-muted leading-relaxed">
              These terms are governed by the laws of the People&apos;s Republic of Bangladesh. Any
              disputes arising from these terms shall be resolved in the courts of Dhaka, Bangladesh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Contact</h2>
            <p className="text-muted leading-relaxed">
              For questions about these Terms &amp; Conditions, contact us at{' '}
              <a href="mailto:legal@wallscape.com.bd" className="text-primary hover:underline">legal@wallscape.com.bd</a>{' '}
              or call <a href="tel:+8801700000000" className="text-primary hover:underline">+880 1700-000000</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
