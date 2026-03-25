import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_COMMUNITY_POSTS } from '@/constants';
import { CommunityPost } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardCommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(DEMO_COMMUNITY_POSTS);
  const [newPost, setNewPost] = useState('');

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
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
    <DashboardLayout title="Community">
      <div className="space-y-5">
        {/* Create Post */}
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
                    {['#goals', '#habits', '#mindset', '#success'].map(tag => (
                      <button key={tag} type="button" onClick={() => setNewPost(prev => prev + ' ' + tag)} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts */}
        <AnimatePresence>
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
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
                    {post.tags.map(t => <span key={t} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{t}</span>)}
                  </div>
                )}
              </div>
              {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover" />}
              <div className="px-5 py-3 border-t border-border flex gap-5">
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
