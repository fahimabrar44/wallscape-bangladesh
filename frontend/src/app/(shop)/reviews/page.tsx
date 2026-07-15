'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Star, Quote, MapPin, ChevronRight, MessageCircle, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

const staticReviews = [
  { name: 'Rafiq Hasan', location: 'Gulshan, Dhaka', rating: 5, text: 'Exceptional quality! The vinyl wallpaper transformed our living room completely. Installation was smooth and the result is stunning.', initials: 'RH', date: 'March 2025', tags: ['Vinyl Wallpaper', 'Installation'] },
  { name: 'Sadia Islam', location: 'Uttara, Dhaka', rating: 5, text: 'I was skeptical about ordering wallpaper online but the team guided me perfectly. The 3D wallpaper in our bedroom looks magical!', initials: 'SI', date: 'February 2025', tags: ['3D Wallpaper', 'Bedroom'] },
  { name: 'Tariq Ahmed', location: 'Banani, Dhaka', rating: 5, text: 'Professional from start to finish. The consultation helped us pick the perfect design. Highly recommend for anyone renovating.', initials: 'TA', date: 'January 2025', tags: ['Consultation', 'Living Room'] },
  { name: 'Nusrat Jahan', location: 'Mirpur, Dhaka', rating: 5, text: 'The PVC marble sheets look absolutely premium in our office lobby. Received so many compliments from visitors and clients alike.', initials: 'NJ', date: 'December 2024', tags: ['PVC Marble', 'Office'] },
  { name: 'Kamal Hossain', location: 'Dhanmondi, Dhaka', rating: 4, text: 'Good product quality and prompt delivery. The wall panels were easy to install. Would have loved more color options though.', initials: 'KH', date: 'November 2024', tags: ['Wall Panels', 'Delivery'] },
  { name: 'Fariha Tasnim', location: 'Bashundhara, Dhaka', rating: 5, text: 'Our kids absolutely love the new floral wallpaper in their room! The material is durable and easy to clean. Thank you Wallscape!', initials: 'FT', date: 'October 2024', tags: ['Kids Wallpaper', 'Kids Room'] },
  { name: 'Mizanur Rahman', location: 'Mohakhali, Dhaka', rating: 5, text: 'Excellent service from start to finish. The measurement team was punctual and installation was flawless. Highly professional.', initials: 'MR', date: 'September 2024', tags: ['Installation', 'Service'] },
  { name: 'Sharmin Akhter', location: 'Baridhara, Dhaka', rating: 5, text: 'The luxury wallpaper collection is absolutely stunning. We chose a gold-accented design for our master bedroom and it looks like a 5-star hotel!', initials: 'SA', date: 'August 2024', tags: ['Luxury Wallpaper', 'Master Bedroom'] },
  { name: 'Jakir Hossain', location: 'Khilgaon, Dhaka', rating: 4, text: 'Good value for money. The brick wallpaper added a rustic charm to our cafe. Delivery was on time and packaging was secure.', initials: 'JH', date: 'July 2024', tags: ['Brick Wallpaper', 'Commercial'] },
  { name: 'Tahmina Begum', location: 'Motijheel, Dhaka', rating: 5, text: 'I was worried about maintenance but the PVC wallpaper is so easy to clean! Just a damp cloth and it looks brand new. Worth every taka.', initials: 'TB', date: 'June 2024', tags: ['PVC Wallpaper', 'Maintenance'] },
  { name: 'Shahriar Kabir', location: 'Wari, Dhaka', rating: 5, text: 'The Korean wallpaper collection is unmatched in Bangladesh. The patterns are so elegant and unique. My wife is absolutely delighted!', initials: 'SK', date: 'May 2024', tags: ['Korean Wallpaper', 'Elegant'] },
  { name: 'Rokeya Sultana', location: 'Shyamoli, Dhaka', rating: 4, text: 'Great experience overall. The showroom had a fantastic display and the staff was very helpful in matching designs with our interior.', initials: 'RS', date: 'April 2024', tags: ['Showroom', 'Interior Design'] },
];

const allTags = Array.from(new Set(staticReviews.flatMap((r) => r.tags)));

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" className={s <= rating ? '' : 'stars-empty'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 5, review: '' });

  const { data: apiData } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => api.get<{ reviews: any[] }>('/api/reviews?isApproved=true'),
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/reviews', data),
    onSuccess: () => {
      toast.success('Thank you! Your review has been submitted for approval.');
      setShowForm(false);
      setForm({ customerName: '', rating: 5, review: '' });
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to submit review'),
  });

  const apiReviews = (apiData?.reviews || []).map((r: any) => ({
    name: r.customerName,
    location: '',
    rating: r.rating,
    text: r.review,
    initials: r.customerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
    date: new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    tags: [],
  }));

  const all = [...apiReviews, ...staticReviews];

  const filtered = all
    .filter((r) => !filterTag || r.tags.includes(filterTag))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

  const avgRating = (all.reduce((sum, r) => sum + r.rating, 0) / all.length).toFixed(1);
  const totalReviews = all.length;
  const fiveStar = all.filter((r) => r.rating === 5).length;
  const fourStar = all.filter((r) => r.rating === 4).length;
  const threeStar = all.filter((r) => r.rating === 3).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim()) { toast.error('Please enter your name'); return; }
    if (!form.review.trim()) { toast.error('Please write your review'); return; }
    submitMutation.mutate(form);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#051a0e] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-white opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-light/5 rounded-full blur-[120px]" />
        <div className="container-custom relative z-10 py-16 sm:py-20 lg:py-28">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-5">
              <MessageCircle size={14} />
              <span>{totalReviews} Verified Reviews</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">What Our Customers Say</h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto">
              Real stories from real people who transformed their spaces with WALLSCAPE
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-4">
              <StarRating rating={5} size={24} />
              <div>
                <p className="text-2xl font-bold">{avgRating}</p>
                <p className="text-xs text-muted">Average Rating</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-6">
              {[5, 4, 3].map((star) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-muted">{star}</span>
                  <Star size={12} className="text-gold fill-gold" />
                  <div className="w-20 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                      style={{ width: `${(star === 5 ? fiveStar : star === 4 ? fourStar : threeStar) / totalReviews * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted">{star === 5 ? fiveStar : star === 4 ? fourStar : threeStar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Filter size={14} />
              <span>Filter:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterTag('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${!filterTag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filterTag === tag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Review Grid */}
      <section className="py-10 sm:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, idx) => (
              <div key={idx} className="card-modern p-6 lg:p-7">
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-muted">{r.date}</span>
                </div>
                <Quote size={20} className="text-primary/15 mb-2" />
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {r.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{r.name}</p>
                    {r.location && (
                      <p className="text-xs text-muted flex items-center gap-1 truncate">
                        <MapPin size={10} className="shrink-0" />{r.location}
                      </p>
                    )}
                  </div>
                </div>
                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
                    {r.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary rounded-full font-medium hover:bg-primary/10 transition"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-muted">No reviews match this filter.</p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition shadow-md hover:shadow-lg"
            >
              Share Your Experience <MessageCircle size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Submit Review Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Share Your Experience</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name *</label>
                <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="e.g. Md. Rahim" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="p-1 transition hover:scale-110">
                      <svg width={28} height={28} viewBox="0 0 24 24" className={s <= form.rating ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Review *</label>
                <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} rows={4} placeholder="Tell us about your experience..." className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitMutation.isPending} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <section className="border-t border-border">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Customer Reviews</span>
          </nav>
        </div>
      </section>
    </div>
  );
}
