import type { Metadata } from 'next';
import ReviewsClient from './reviews-client';

export const metadata: Metadata = {
  title: 'Customer Reviews - WALLSCAPE BANGLADESH',
  description: 'Read verified customer reviews and testimonials for WALLSCAPE BANGLADESH wallpapers and interior solutions.',
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
