'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfoItem {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}

interface BusinessHoursItem {
  day: string;
  hours: string;
}

const contactInfo: ContactInfoItem[] = [
  { icon: Phone, label: 'Phone', value: '+880 1700-000000', href: 'tel:+8801700000000' },
  { icon: Mail, label: 'Email', value: 'hello@wallscape.com.bd', href: 'mailto:hello@wallscape.com.bd' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+880 1700-000000', href: 'https://wa.me/8801700000000' },
  { icon: MapPin, label: 'Address', value: 'House 12, Road 5, Gulshan 1, Dhaka 1212, Bangladesh' },
];

const businessHours: BusinessHoursItem[] = [
  { day: 'Saturday – Thursday', hours: '9:00 AM – 8:00 PM' },
  { day: 'Friday', hours: '2:00 PM – 8:00 PM' },
  { day: 'Public Holidays', hours: '10:00 AM – 6:00 PM' },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Contact Us</span>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">Contact Us</h1>
      <p className="text-muted mb-10">We&apos;d love to hear from you. Get in touch with our team.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card-modern p-8">
            <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
                <p className="text-muted text-sm">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 btn-ghost text-sm">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-modern w-full"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-modern w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-modern w-full"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input-modern w-full"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-modern w-full resize-y"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again or email us directly.</p>
                )}
                <button type="submit" disabled={status === 'loading'} className="btn-primary">
                  {status === 'loading' ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 card-modern overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2"><MapPin size={16} className="text-primary" /> Our Location</h3>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.835551105032!2d90.4125!3d23.7800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzQ4LjAiTiA5MMKwMjQnNDUuMCJF!5e0!3m2!1sen!2sbd!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="WALLSCAPE BANGLADESH Location"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-modern p-6">
            <h3 className="font-bold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium hover:text-primary transition" target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-modern p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={16} className="text-primary" /> Business Hours</h3>
            <div className="space-y-2">
              {businessHours.map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-muted">{item.day}</span>
                  <span className="font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-modern p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><MessageCircle size={16} className="text-primary" /> Facebook Messenger</h3>
            <p className="text-sm text-muted mb-4">Chat with us on Messenger for quick replies.</p>
            <a
              href="https://m.me/wallscapebangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={16} />
              Message Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
