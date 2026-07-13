import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping & Return Policy',
  description:
    'WALLSCAPE BANGLADESH shipping, delivery, returns, and refund policy. Learn about delivery timelines, charges, and how to return or exchange products.',
  openGraph: {
    title: 'Shipping & Return Policy | WALLSCAPE BANGLADESH',
    description:
      'WALLSCAPE BANGLADESH shipping, delivery, returns, and refund policy. Learn about delivery timelines, charges, and how to return or exchange products.',
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Shipping &amp; Return Policy</span>
      </div>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Shipping &amp; Return Policy</h1>
        <p className="text-sm text-muted mb-8">Last updated: January 1, 2025</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">Shipping Overview</h2>
            <p className="text-muted leading-relaxed">
              WALLSCAPE BANGLADESH offers reliable shipping services across all 64 districts of
              Bangladesh. We partner with trusted courier services to ensure your wallpaper and wall
              panels arrive safely and on time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Delivery Timeline</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Location</th>
                    <th className="text-left py-2 pr-4 font-semibold">Estimated Delivery</th>
                    <th className="text-left py-2 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Dhaka City</td>
                    <td className="py-2 pr-4">1 – 3 business days</td>
                    <td className="py-2">Standard &amp; express available</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Divisional Cities</td>
                    <td className="py-2 pr-4">3 – 5 business days</td>
                    <td className="py-2">Chattogram, Khulna, Rajshahi, Sylhet, Barishal, Rangpur, Mymensingh</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Other Districts</td>
                    <td className="py-2 pr-4">5 – 8 business days</td>
                    <td className="py-2">All remaining districts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Remote / Hill Tracts</td>
                    <td className="py-2 pr-4">7 – 12 business days</td>
                    <td className="py-2">May require additional coordination</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Delivery Charges</h2>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li><strong>Free Delivery:</strong> Orders above BDT 2,000 qualify for free standard delivery anywhere in Bangladesh.</li>
              <li><strong>Standard Delivery:</strong> BDT 100 – BDT 200 within Dhaka; BDT 150 – BDT 350 outside Dhaka, depending on weight and distance.</li>
              <li><strong>Express Delivery:</strong> Available for Dhaka customers at an additional charge of BDT 150.</li>
              <li>Delivery charges are calculated at checkout and will be clearly displayed before you confirm your order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Order Processing</h2>
            <p className="text-muted leading-relaxed">
              Orders are processed within 24 hours of confirmation (excluding Fridays and public
              holidays). During peak seasons (e.g., Eid, Pohela Boishakh), processing may take
              up to 48 hours. You will receive a confirmation email with tracking information once
              your order is dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Returns &amp; Exchanges</h2>
            <p className="text-muted leading-relaxed mb-3">
              We want you to love your wallpaper. If you are not completely satisfied, we accept
              returns and exchanges under the following conditions:
            </p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li><strong>Eligibility:</strong> Items must be returned within 7 days of delivery, unused, uninstalled, and in their original packaging.</li>
              <li><strong>Defective or Damaged:</strong> If you receive a defective or damaged product, notify us within 48 hours of delivery with photographic evidence for a full refund or replacement.</li>
              <li><strong>Custom Orders:</strong> Custom-cut wallpaper, special-order panels, and clearance items are non-returnable unless defective.</li>
              <li><strong>Return Shipping:</strong> Return shipping costs are borne by the customer unless the return is due to our error or a defective product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Refunds</h2>
            <p className="text-muted leading-relaxed mb-3">
              Once we receive and inspect your returned item, we will process your refund within 5 – 7
              business days. Refunds are issued to the original payment method:
            </p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li><strong>bKash / Nagad / Rocket:</strong> Refunded to the same mobile financial service account.</li>
              <li><strong>Card Payments:</strong> Refunded to the original card (may take 7 – 10 business days depending on the bank).</li>
              <li><strong>Cash on Delivery:</strong> Refunded via bKash or bank transfer within 5 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Order Cancellation</h2>
            <p className="text-muted leading-relaxed">
              You may cancel an order within 2 hours of placing it, provided it has not yet been
              processed. To cancel, please contact our support team immediately. Once an order has
              been dispatched, cancellation is no longer possible and the standard return policy applies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Contact for Shipping Issues</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions or concerns about your delivery, please reach out to our
              support team at{' '}
              <a href="mailto:support@wallscape.com.bd" className="text-primary hover:underline">support@wallscape.com.bd</a>{' '}
              or call <a href="tel:+8801700000000" className="text-primary hover:underline">+880 1700-000000</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
