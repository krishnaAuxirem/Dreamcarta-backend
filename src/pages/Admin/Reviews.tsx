import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Star } from 'lucide-react';
import { createReviewApi, deleteReviewApi, getAdminReviewsApi, updateReviewApi, type ReviewItem } from '@/lib/api/adminApi';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

const EMPTY_FORM = {
  author: '',
  title: '',
  content: '',
  rating: 5,
  image: '',
  isPublished: true,
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingById, setDeletingById] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [editReview, setEditReview] = useState<ReviewItem | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await getAdminReviewsApi();
        setReviews(data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load reviews'));
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    void loadReviews();
  }, []);

  useEffect(() => {
    if (!editReview) {
      return;
    }

    setForm({
      author: editReview.author,
      title: editReview.title,
      content: editReview.content,
      rating: editReview.rating ?? 5,
      image: editReview.image ?? '',
      isPublished: Boolean(editReview.isPublished ?? true),
    });
    setShowForm(true);
  }, [editReview]);

  const handleSaveReview = async () => {
    if (!form.author.trim() || !form.title.trim() || !form.content.trim()) {
      toast.error('Author, title, and content are required');
      return;
    }

    if (form.rating < 1 || form.rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    setSaving(true);
    try {
      if (editReview) {
        const updated = await updateReviewApi(editReview.id, {
          author: form.author,
          title: form.title,
          content: form.content,
          rating: form.rating,
          image: form.image,
          isPublished: form.isPublished,
        });
        setReviews((prev) =>
          prev.map((review) => (review.id === editReview.id ? updated : review))
        );
        toast.success('Review updated ✅');
      } else {
        const created = await createReviewApi({
          author: form.author,
          title: form.title,
          content: form.content,
          rating: form.rating,
          image: form.image,
          isPublished: form.isPublished,
        });
        setReviews((prev) => [created, ...prev]);
        toast.success('Review created ✅');
      }

      setForm(EMPTY_FORM);
      setEditReview(null);
      setShowForm(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, editReview ? 'Review update failed' : 'Review create failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this review?');
    if (!confirmDelete) {
      return;
    }

    setDeletingById((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteReviewApi(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review deleted ✅');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Review delete failed'));
    } finally {
      setDeletingById((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Reviews</h1>
        <button
          disabled={saving}
          onClick={() => {
            setEditReview(null);
            setForm(EMPTY_FORM);
            setShowForm(true);
          }}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-60"
        >
          + New Review
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <input
            placeholder="Author name"
            value={form.author}
            onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
          />
          <input
            placeholder="Review title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
          />
          <textarea
            placeholder="Review content"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
          />

          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Rating:</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                  type="button"
                  className={`text-xl transition-colors ${
                    star <= form.rating ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
            <span className="text-sm font-semibold">{form.rating}/5</span>
          </div>

          <input
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
          />

          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
            />
            Publish now
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditReview(null);
                setForm(EMPTY_FORM);
              }}
              type="button"
              className="px-4 py-2 rounded-lg border border-border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSaveReview()}
              disabled={saving}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
            >
              {saving ? (editReview ? 'Saving...' : 'Creating...') : editReview ? 'Save Review' : 'Create Review'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">No reviews available.</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-border rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base truncate">{review.title}</h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">By {review.author}</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Status: {review.isPublished ? 'Published' : 'Draft'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{review.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditReview(review)}
                    disabled={saving || Boolean(deletingById[review.id])}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-60"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void handleDelete(review.id)}
                    disabled={Boolean(deletingById[review.id])}
                    className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingById[review.id] ? (
                      'Deleting...'
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
