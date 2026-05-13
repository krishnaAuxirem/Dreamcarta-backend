import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Search, Send, Trash2, TrendingUp, Star, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CommunityPost } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import {
  commentCommunityPostApi,
  createCommunityPostApi,
  getCommunityPostsApi,
  likeCommunityPostApi,
} from '@/lib/api/communityApi';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [search, setSearch] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openCommentsByPostId, setOpenCommentsByPostId] = useState<Record<string, boolean>>({});
  const [posting, setPosting] = useState(false);
  const [busyByPostId, setBusyByPostId] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCommunityPostsApi();
      setPosts(data);
    } catch {
      setError('Failed to load community posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const updatePost = (postId: string, updater: (post: CommunityPost) => CommunityPost) => {
    setPosts((previous) => previous.map((post) => (post.id === postId ? updater(post) : post)));
  };

  const toggleComments = (postId: string) => {
    setOpenCommentsByPostId((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  const filteredPosts = search
    ? posts.filter((p) => p.content.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()))
    : posts;

  const trendingTopics = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const activeMembers = useMemo(() => {
    const members = new Map<string, { name: string; img?: string; posts: number }>();
    posts.forEach((post) => {
      const current = members.get(post.author) ?? { name: post.author, img: post.authorAvatar, posts: 0 };
      members.set(post.author, { ...current, posts: current.posts + 1 });
    });

    return [...members.values()].sort((a, b) => b.posts - a.posts).slice(0, 3);
  }, [posts]);

  const toggleLike = async (id: string, liked: boolean) => {
    setBusyByPostId((previous) => ({ ...previous, [id]: true }));
    const nextLiked = !liked;
    updatePost(id, (post) => ({
      ...post,
      liked: nextLiked,
      likes: Math.max(0, post.likes + (nextLiked ? 1 : -1)),
    }));

    try {
      const updated = await likeCommunityPostApi(id, nextLiked ? 'like' : 'unlike');
      updatePost(id, () => updated);
    } catch {
      updatePost(id, (post) => ({
        ...post,
        liked,
        likes: Math.max(0, post.likes + (liked ? 1 : -1)),
      }));
      toast.error('Failed to update like');
    } finally {
      setBusyByPostId((previous) => ({ ...previous, [id]: false }));
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to create a post');
      return;
    }

    if (!newPost.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setPosting(true);
    try {
      const created = await createCommunityPostApi({
        content: newPost.trim(),
        tags: [],
      });
      setPosts((previous) => [created, ...previous]);
      setNewPost('');
      toast.success('Post shared successfully');
    } catch {
      toast.error('Post could not be shared');
    } finally {
      setPosting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    const commentText = commentDrafts[postId]?.trim();
    if (!commentText) {
      toast.error('Comment cannot be empty');
      return;
    }

    setBusyByPostId((previous) => ({ ...previous, [postId]: true }));
    try {
      const updated = await commentCommunityPostApi(postId, commentText);
      updatePost(postId, () => updated);
      setCommentDrafts((previous) => ({ ...previous, [postId]: '' }));
      toast.success('Comment added');
    } catch {
      toast.error('Comment could not be added');
    } finally {
      setBusyByPostId((previous) => ({ ...previous, [postId]: false }));
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!user) {
      toast.error('Please login to manage comments');
      return;
    }

    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) {
      return;
    }

    setBusyByPostId((previous) => ({ ...previous, [postId]: true }));
    updatePost(postId, (post) => {
      const nextComments = (post.commentsList ?? []).filter((comment) => comment.id !== commentId);
      return {
        ...post,
        comments: Math.max(0, post.comments - 1),
        commentsList: nextComments,
      };
    });
    toast.success('Comment deleted');
    setBusyByPostId((previous) => ({ ...previous, [postId]: false }));
  };

  const handleShare = async (post: CommunityPost) => {
    const shareUrl = `${window.location.origin}/community#${post.id}`;
    const shareText = `${post.author}: ${post.content}`;

    setBusyByPostId((previous) => ({ ...previous, [post.id]: true }));
    updatePost(post.id, (current) => ({
      ...current,
      shares: current.shares + 1,
    }));

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
    <div>
      <Navbar />
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold mb-3">
            Dream <span className="text-gradient">Community</span>
          </h1>
          <p className="text-muted-foreground text-lg">Share your journey, inspire others, grow together</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            </div>

            {/* Create post */}
            {user && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff`} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <form onSubmit={createPost} className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your dream journey, achievement, or inspiration..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button disabled={posting} type="submit" className="btn-primary text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-60">
                        <Send className="w-3.5 h-3.5" /> {posting ? 'Posting...' : 'Share'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Posts */}
            {loading ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading community posts...</div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-card p-6 text-sm text-red-500">{error}</div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                No community posts yet.
              </div>
            ) : (
              <AnimatePresence>
                {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.author}&background=6133B4&color=fff`} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.map((tag) => <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{tag}</span>)}
                      </div>
                    )}
                  </div>
                  {post.image && (
                    <img src={post.image} alt="post" className="w-full h-56 object-cover" />
                  )}
                  <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        disabled={Boolean(busyByPostId[post.id])}
                        onClick={() => void toggleLike(post.id, post.liked)}
                        className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60 ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} /> {post.likes}
                      </button>
                      <button
                        disabled={Boolean(busyByPostId[post.id])}
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60 ${
                          openCommentsByPostId[post.id] ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" /> {post.comments}
                      </button>
                      <button onClick={() => void handleShare(post)} disabled={Boolean(busyByPostId[post.id])} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-60">
                        <Share2 className="w-4 h-4" /> {post.shares}
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {openCommentsByPostId[post.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border bg-muted/20 overflow-hidden"
                      >
                        <div className="p-5 space-y-4">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Comments</h4>
                            {(post.commentsList ?? []).length === 0 ? (
                              <p className="text-xs text-muted-foreground">No comments yet. Be the first to reply.</p>
                            ) : (
                              <div className="space-y-3">
                                {(post.commentsList ?? []).map((comment) => (
                                  <div key={comment.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                                    <img
                                      src={comment.authorAvatar || `https://ui-avatars.com/api/?name=${comment.author}&background=6133B4&color=fff`}
                                      alt=""
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <p className="text-sm font-medium leading-none">{comment.author}</p>
                                          <p className="text-[11px] text-muted-foreground mt-1">
                                            {new Date(comment.createdAt).toLocaleString('en-IN', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: 'numeric',
                                              minute: '2-digit',
                                            })}
                                          </p>
                                        </div>
                                        {user && comment.author === user.name && (
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                            disabled={Boolean(busyByPostId[post.id])}
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                          </button>
                                        )}
                                      </div>
                                      <p className="mt-2 text-sm leading-relaxed text-foreground">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {user ? (
                            <div className="flex items-start gap-3">
                              <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff`}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 space-y-2">
                                <textarea
                                  value={commentDrafts[post.id] ?? ''}
                                  onChange={(e) =>
                                    setCommentDrafts((previous) => ({
                                      ...previous,
                                      [post.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Add a comment..."
                                  rows={2}
                                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => void handleAddComment(post.id)}
                                    disabled={Boolean(busyByPostId[post.id])}
                                    className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2 disabled:opacity-60"
                                  >
                                    <Send className="w-3.5 h-3.5" /> Add Comment
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Login to add or delete comments.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Trending Topics</h3>
              <div className="space-y-2">
                {trendingTopics.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No trending topics yet.</p>
                ) : trendingTopics.map(({ tag, count }) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-primary cursor-pointer hover:underline">{tag}</span>
                    <span className="text-xs text-muted-foreground">{count} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active members */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Active Members</h3>
              <div className="space-y-3">
                {activeMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No active members yet.</p>
                ) : activeMembers.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <img src={m.img || `https://ui-avatars.com/api/?name=${m.name}&background=6133B4&color=fff`} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.posts} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community rules */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Community Rules</h3>
              <ul className="space-y-2">
                {['Be supportive and kind', 'Share authentic progress', 'No spam or self-promotion', 'Celebrate others achievements', 'Keep it positive!'].map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">{i + 1}.</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
