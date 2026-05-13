import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CommunityPost } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
  createCommunityPostApi,
  getCommunityPostsApi,
  likeCommunityPostApi,
} from '@/lib/api/communityApi';
import { toast } from '@/components/ui/sonner';

export default function DashboardCommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyByPostId, setBusyByPostId] = useState<Record<string, boolean>>({});
  const [posting, setPosting] = useState(false);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCommunityPostsApi();
      setPosts(data);
    } catch {
      setError('Failed to load community posts. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const toggleLike = async (post: CommunityPost) => {
    setBusyByPostId((previous) => ({ ...previous, [post.id]: true }));
    setPosts((previous) =>
      previous.map((item) =>
        item.id === post.id
          ? { ...item, liked: !item.liked, likes: Math.max(0, item.likes + (item.liked ? -1 : 1)) }
          : item
      )
    );

    try {
      const updated = await likeCommunityPostApi(post.id, post.liked ? 'unlike' : 'like');
      setPosts((previous) => previous.map((item) => (item.id === post.id ? updated : item)));
    } catch {
      setPosts((previous) =>
        previous.map((item) =>
          item.id === post.id
            ? { ...item, liked: post.liked, likes: post.likes }
            : item
        )
      );
      toast.error('Failed to update like');
    } finally {
      setBusyByPostId((previous) => ({ ...previous, [post.id]: false }));
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) {
      return;
    }

    try {
      setPosting(true);
      const created = await createCommunityPostApi({
        content: newPost.trim(),
        tags: [],
      });
      setPosts((previous) => [created, ...previous]);
      setNewPost('');
      toast.success('Post shared successfully');
    } catch {
      toast.error('Failed to share post');
    } finally {
      setPosting(false);
    }
  };

  const handleShare = async (post: CommunityPost) => {
    const shareUrl = `${window.location.origin}/community#${post.id}`;
    const shareText = `${post.author}: ${post.content}`;

    setBusyByPostId((previous) => ({ ...previous, [post.id]: true }));
    setPosts((previous) =>
      previous.map((item) => (item.id === post.id ? { ...item, shares: item.shares + 1 } : item))
    );

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'DreamCarta Community',
          text: shareText,
          url: shareUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success('Share link copied');
      } else {
        toast.success('Shared successfully');
      }
    } catch {
      toast.success('Shared successfully');
    } finally {
      setBusyByPostId((previous) => ({ ...previous, [post.id]: false }));
    }
  };

  return (
    <DashboardLayout title="Community">
      <div className="space-y-5">
        {user && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff`} alt="" className="w-10 h-10 rounded-full object-cover" />
              <form onSubmit={createPost} className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder={`Share your dream journey, ${user.name.split(' ')[0]}! What did you achieve today?`}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    {['#goals', '#habits', '#mindset', '#success'].map((tag) => (
                      <button key={tag} type="button" onClick={() => setNewPost((previous) => `${previous} ${tag}`)} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button type="submit" disabled={posting} className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5 disabled:opacity-60">
                    <Send className="w-3.5 h-3.5" /> {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading community posts...</div>}
        {!loading && error && (
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={() => void loadPosts()} className="btn-primary text-sm px-4 py-2">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence>
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                No community posts yet.
              </div>
            ) : (
              posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.author}&background=6133B4&color=fff`} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag) => <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{tag}</span>)}
                      </div>
                    )}
                  </div>
                  {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover" />}
                  <div className="px-5 py-3 border-t border-border flex gap-5">
                    <button onClick={() => void toggleLike(post)} disabled={Boolean(busyByPostId[post.id])} className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60 ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
                      <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" /> {post.comments}
                    </button>
                    <button onClick={() => void handleShare(post)} disabled={Boolean(busyByPostId[post.id])} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-60">
                      <Share2 className="w-4 h-4" /> {post.shares}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
}
