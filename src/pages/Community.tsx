import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Search, Send, TrendingUp, Star, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DEMO_COMMUNITY_POSTS } from '@/constants';
import { CommunityPost } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(DEMO_COMMUNITY_POSTS);
  const [newPost, setNewPost] = useState('');
  const [search, setSearch] = useState('');

  const filteredPosts = search
    ? posts.filter((p) => p.content.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()))
    : posts;

  const toggleLike = (id: string) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const createPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;
    const post: CommunityPost = {
      id: Date.now().toString(),
      author: user.name,
      authorAvatar: user.avatar,
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setNewPost('');
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
                      <button type="submit" className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Posts */}
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
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} /> {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" /> {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" /> {post.shares}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Trending Topics</h3>
              <div className="space-y-2">
                {['#manifestation', '#morningroutine', '#goalsetting', '#mindset', '#habits', '#financialfreedom', '#fitness'].map((tag) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm text-primary cursor-pointer hover:underline">{tag}</span>
                    <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 500) + 50} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active members */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Active Members</h3>
              <div className="space-y-3">
                {[
                  { name: 'Priya Sharma', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', posts: 47 },
                  { name: 'Rahul Verma', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', posts: 38 },
                  { name: 'Ananya Singh', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop', posts: 29 },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <img src={m.img} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.posts} posts this month</p>
                    </div>
                    <button className="text-xs text-primary hover:underline">Follow</button>
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
