import { useEffect, useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import {
  CommunityPostItem,
  getAdminCommunityPostsApi,
  deleteAdminCommunityPostApi,
  highlightCommunityPostApi,
} from '@/lib/api/adminApi';
import toast from 'react-hot-toast';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

const DEMO_COMMUNITY_POSTS: CommunityPostItem[] = [
  {
    id: 'demo-community-1',
    author: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    content: 'Launched my startup roadmap today. Small steps, daily focus, and consistent execution are finally turning dreams into action.',
    likes: 124,
    comments: 18,
    shares: 7,
    liked: false,
    tags: ['manifestation', 'goalsetting'],
    isHighlighted: false,
    isModerated: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-community-2',
    author: 'Arjun Reddy',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    content: '90-day streak completed. The habit tracker is the first thing that actually kept me accountable every single day.',
    likes: 98,
    comments: 12,
    shares: 4,
    liked: true,
    tags: ['habits', 'morningroutine'],
    isHighlighted: true,
    isModerated: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-community-3',
    author: 'Meera Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    content: 'Built my weekly reset system around DreamCarta. Mindset + planning + consistency = real progress.',
    likes: 156,
    comments: 24,
    shares: 11,
    liked: false,
    tags: ['mindset', 'fitness'],
    isHighlighted: false,
    isModerated: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-community-4',
    author: 'Ravi Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop',
    content: 'Shared my study setup and the accountability response was amazing. This community really pushes me forward.',
    likes: 83,
    comments: 9,
    shares: 3,
    liked: false,
    tags: ['goalsetting', 'financialfreedom'],
    isHighlighted: false,
    isModerated: false,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminCommunity() {
  const [posts, setPosts] = useState<CommunityPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyById, setBusyById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getAdminCommunityPostsApi();
        setPosts(data);
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, 'Failed to load community posts'));
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) {
      return;
    }

    setBusyById((prev) => ({ ...prev, [postId]: true }));
    try {
      await deleteAdminCommunityPostApi(postId);
      setPosts((previous) => previous.filter((item) => item.id !== postId));
      toast.success('Post removed successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete post'));
    } finally {
      setBusyById((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleHighlight = async (postId: string) => {
    setBusyById((prev) => ({ ...prev, [postId]: true }));
    try {
      const updated = await highlightCommunityPostApi(postId);
      setPosts((previous) =>
        previous.map((item) => (item.id === postId ? { ...item, isHighlighted: updated.isHighlighted } : item))
      );
      toast.success(updated.isHighlighted ? 'Post highlighted' : 'Highlight removed');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update highlight'));
    } finally {
      setBusyById((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold">Community Moderation</h2>
        <p className="text-sm text-muted-foreground mt-1">Review posts, highlight quality content, and remove abuse.</p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading posts...</div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground space-y-3">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="btn-primary text-sm px-4 py-2">
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No community posts yet.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleHighlight(post.id)}
                    disabled={Boolean(busyById[post.id])}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs ${
                      post.isHighlighted
                        ? 'border-amber-500 text-amber-600 bg-amber-50'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    } disabled:opacity-60`}
                  >
                    <Star className={`h-3.5 w-3.5 ${post.isHighlighted ? 'fill-amber-500' : ''}`} />
                    {post.isHighlighted ? 'Highlighted' : 'Highlight'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(post.id)}
                    disabled={Boolean(busyById[post.id])}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed">{post.content}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
