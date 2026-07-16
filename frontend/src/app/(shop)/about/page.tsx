import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Eye, Shield, Paintbrush, Ruler, ShoppingCart, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Discover the story behind WALLSCAPE BANGLADESH — the premier destination for premium wallpaper, PVC panels, and interior solutions across Bangladesh.',
  openGraph: {
    title: 'About Us | WALLSCAPE BANGLADESH',
    description:
      'Discover the story behind WALLSCAPE BANGLADESH — the premier destination for premium wallpaper, PVC panels, and interior solutions across Bangladesh.',
  },
};

const teamMembers = [
  { name: 'Rafiq Hasan', role: 'Founder & CEO', initials: 'RH' },
  { name: 'Sadia Islam', role: 'Head of Design', initials: 'SI' },
  { name: 'Tanvir Ahmed', role: 'Operations Manager', initials: 'TA' },
  { name: 'Nusrat Jahan', role: 'Customer Experience Lead', initials: 'NJ' },
];

const milestones = [
  { year: '2018', title: 'The Beginning', desc: 'Founded with a vision to transform Bangladeshi interior spaces with premium wallpapers.' },
  { year: '2020', title: 'Online Launch', desc: 'Launched our e-commerce platform, making wallpapers accessible nationwide.' },
  { year: '2022', title: '100+ Partners', desc: 'Expanded network to 100+ interior designers, architects, and retail partners.' },
  { year: '2024', title: 'Nationwide Coverage', desc: 'Delivered to all 64 districts, becoming the largest wallpaper retailer in Bangladesh.' },
];

export default function AboutPage() {
  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">About Us</span>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-primary-light/5 rounded-2xl border border-border p-8 lg:p-12 mb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-light/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-2xl">
          <h1 className="text-gradient text-3xl lg:text-4xl font-bold mb-4">
            We Bring Walls to Life
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            WALLSCAPE BANGLADESH is the country&apos;s premium destination for high-quality
            wallpaper, wall panels, and interior solutions. From luxurious vinyl and PVC
            wallpapers to modern 3D wall panels, we curate products that transform ordinary
            spaces into extraordinary experiences.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <div className="w-12 h-1 bg-primary rounded mb-6" />
            <p className="text-muted leading-relaxed mb-4">
              WALLSCAPE BANGLADESH was founded in 2018 with a simple yet bold vision — to make
              premium interior design accessible to every Bangladeshi home and office. What
              started as a small curated collection has grown into the nation&apos;s largest
              wallpaper marketplace, serving thousands of happy customers across all 64 districts.
            </p>
            <p className="text-muted leading-relaxed">
              We partner with leading international manufacturers and local artisans to bring a
              diverse range of styles — from subtle textures to bold patterns, from traditional
              motifs to ultra-modern 3D designs. Every product in our collection is chosen for
              its quality, durability, and aesthetic appeal.
            </p>
          </div>
          <div className="card-modern p-8 lg:p-10">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-primary">5000+</p>
                <p className="text-sm text-muted mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-primary">1000+</p>
                <p className="text-sm text-muted mt-1">Products</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-primary">64</p>
                <p className="text-sm text-muted mt-1">Districts Covered</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-primary">4.9</p>
                <p className="text-sm text-muted mt-1">Avg. Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 card-modern p-8 lg:p-12">
        <div className="text-center mb-10 sm:mb-14">
          <span className="section-label">Simple Process</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 sm:mt-2 mb-2 sm:mb-3">How It Works</h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">From inspiration to installation — we make it effortless</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

          {[
            { icon: Paintbrush, step: '01', title: 'Choose Design', desc: 'Browse our vast collection and find your perfect style' },
            { icon: Ruler, step: '02', title: 'Calculate & Plan', desc: 'Use our tools to measure and estimate exactly what you need' },
            { icon: ShoppingCart, step: '03', title: 'Order Easy', desc: 'Quick guest checkout with secure payment options' },
            { icon: Truck, step: '04', title: 'Delivered & Done', desc: 'Fast delivery with optional professional installation' },
          ].map((item) => (
            <div key={item.step} className="relative text-center group">
              <div className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-5 bg-white rounded-2xl shadow-lg border border-border/50 flex items-center justify-center group-hover:shadow-xl group-hover:border-primary/30 group-hover:-translate-y-1 transition-all duration-300">
                <item.icon size={32} className="text-primary" />
              </div>
              <span className="text-5xl lg:text-6xl font-black text-primary/5 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none">{item.step}</span>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-modern p-6 lg:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Target size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-3">Our Mission</h3>
            <p className="text-muted text-sm leading-relaxed">
              To empower every Bangladeshi to create beautiful, inspiring interiors by
              providing access to premium-quality wallpapers and wall solutions at
              affordable prices, with exceptional customer service.
            </p>
          </div>
          <div className="card-modern p-6 lg:p-8">
            <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center mb-4">
              <Eye size={24} className="text-primary-light" />
            </div>
            <h3 className="text-lg font-bold mb-3">Our Vision</h3>
            <p className="text-muted text-sm leading-relaxed">
              To be the most trusted and innovative interior solutions brand in Bangladesh,
              setting the standard for quality, design, and customer satisfaction in the home
              improvement industry.
            </p>
          </div>
          <div className="card-modern p-6 lg:p-8">
            <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center mb-4">
              <Shield size={24} className="text-primary-light" />
            </div>
            <h3 className="text-lg font-bold mb-3">Our Values</h3>
            <p className="text-muted text-sm leading-relaxed">
              Quality without compromise, integrity in every transaction, innovation in
              design, and a relentless focus on customer delight. We believe every wall
              tells a story.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block w-1/2" />
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow md:-translate-x-2 z-10 mt-1" />
                <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                  <span className="badge-primary">{m.year}</span>
                  <h3 className="font-bold text-lg mt-2">{m.title}</h3>
                  <p className="text-muted text-sm mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Meet Our Team</h2>
          <p className="text-muted mt-2">The passionate people behind WALLSCAPE BANGLADESH</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="card-premium p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{member.initials}</span>
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
