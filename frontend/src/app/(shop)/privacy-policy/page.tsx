import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'WALLSCAPE BANGLADESH privacy policy explains how we collect, use, and protect your personal information when you shop with us.',
  openGraph: {
    title: 'Privacy Policy | WALLSCAPE BANGLADESH',
    description:
      'WALLSCAPE BANGLADESH privacy policy explains how we collect, use, and protect your personal information when you shop with us.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Privacy Policy</span>
      </div>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-8">Last updated: January 1, 2025</p>

        <div className="card-modern p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              WALLSCAPE BANGLADESH (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
              protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and
              safeguard your personal information when you visit our website, make a purchase, or engage
              with our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p className="text-muted leading-relaxed mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li><strong>Personal Identification:</strong> Name, email address, phone number, shipping and billing address.</li>
              <li><strong>Payment Information:</strong> Credit/debit card details, bKash, Nagad, or other mobile financial service information (processed securely through third-party gateways).</li>
              <li><strong>Order History:</strong> Products purchased, order dates, delivery preferences, and transaction records.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing behaviour on our website.</li>
              <li><strong>Communication:</strong> Any messages, enquiries, or feedback you send to us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-3">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li>To process and fulfil your orders, including delivery and payment confirmation.</li>
              <li>To communicate with you about your orders, account, or enquiries.</li>
              <li>To improve our website, products, and customer service.</li>
              <li>To send promotional offers, newsletters, and updates (only with your consent).</li>
              <li>To comply with legal obligations and prevent fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Information Sharing</h2>
            <p className="text-muted leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your data only with trusted third-party service providers who assist us in operating our
              website, processing payments, or delivering orders — and only under strict confidentiality
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
            <p className="text-muted leading-relaxed">
              We implement industry-standard security measures, including SSL encryption, to protect
              your personal information. However, no method of transmission over the internet is 100%
              secure. We strive to protect your data but cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Cookies</h2>
            <p className="text-muted leading-relaxed">
              Our website uses cookies to enhance your browsing experience, analyse site traffic, and
              personalise content. You can control cookie preferences through your browser settings.
              Disabling cookies may affect certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
            <p className="text-muted leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted space-y-1">
              <li>Access, update, or delete your personal information.</li>
              <li>Withdraw consent for marketing communications at any time.</li>
              <li>Request a copy of the data we hold about you.</li>
              <li>Lodge a complaint regarding data handling practices.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Contact</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@wallscape.com.bd" className="text-primary hover:underline">privacy@wallscape.com.bd</a>{' '}
              or call <a href="tel:+8801700000000" className="text-primary hover:underline">+880 1700-000000</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
