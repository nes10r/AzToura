'use client';

import { useEffect, useState } from 'react';
import { Star, Send, Loader2, LogIn } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; avatar?: string };
}

interface Props {
  destinationId?: string;
  tourId?: string;
  hotelId?: string;
  restaurantId?: string;
  eventId?: string;
  initialReviews?: Review[];
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ destinationId, tourId, hotelId, restaurantId, eventId, initialReviews }: Props) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));

    // Load reviews from API if not provided
    if (!initialReviews) {
      const params = new URLSearchParams({ limit: '50' });
      if (destinationId) params.set('destinationId', destinationId);
      if (tourId) params.set('tourId', tourId);
      if (hotelId) params.set('hotelId', hotelId);
      if (restaurantId) params.set('restaurantId', restaurantId);
      if (eventId) params.set('eventId', eventId);

      fetch(`/api/reviews?${params}`)
        .then(r => r.json())
        .then(d => { if (d.data) setReviews(d.data); });
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) { setError('Please write a comment.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment, destinationId, tourId, hotelId, restaurantId, eventId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to submit'); return; }
      setReviews(prev => [data.data, ...prev]);
      setComment('');
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Traveller Reviews</h2>
          {avg && (
            <div className="flex items-center gap-2 mt-1">
              <Stars value={Math.round(parseFloat(avg))} />
              <span className="text-sm font-semibold text-text">{avg}</span>
              <span className="text-sm text-text-muted">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
      </div>

      {/* Write a review */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-text mb-3">Write a Review</h3>
        {isLoggedIn ? (
          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Your rating:</span>
              <Stars value={rating} onChange={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none bg-background text-text placeholder:text-text-muted"
            />
            {error && <p className="text-rose-500 text-xs">{error}</p>}
            {success && <p className="text-emerald-600 text-xs font-medium">Review submitted successfully!</p>}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3 py-2">
            <p className="text-sm text-text-secondary">Sign in to leave a review.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-center text-text-muted py-8 text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {r.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text text-sm truncate">{r.user?.name || 'Anonymous'}</p>
                  <p className="text-xs text-text-muted">{formatDate(r.createdAt)}</p>
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
