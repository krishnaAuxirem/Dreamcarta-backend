import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, BarChart3, Plus, Trash2, Edit3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import { DEMO_BLOG_POSTS } from '@/constants';
import { BlogPost } from '@/types';
import { generateId } from '@/lib/utils';
import { Link } from 'react-router-dom';

const DEMO_USERS = [
  { id: '1', name: 'Alex Johnson', email: 'user@demo.com', role: 'user', joined: '2025-01-15', goals: 8, habits: 5, status: 'active' },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', role: 'user', joined: '2025-02-01', goals: 12, habits: 8, status: 'active' },
  { id: '3', name: 'Rahul Verma', email: 'rahul@example.com', role: 'user', joined: '2025-02-15', goals: 5, habits: 3, status: 'active' },
  { id: '4', name: 'Ananya Singh', email: 'ananya@example.com', role: 'user', joined: '2025-03-01', goals: 9, habits: 6, status: 'inactive' },
  { id: '5', name: 'Arjun Kumar', email: 'arjun@example.com', role: 'user', joined: '2025-03-10', goals: 3, habits: 2, status: 'active' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'blog' | 'posts'>('overview');
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_BLOG_POSTS);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', category: 'Goal Setting', content: '', image: '' });

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const STATS = [
    { label: 'Total Users', value: '2,547', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Blog Posts', value: posts.length, change: '+3', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Active Users', value: '1,892', change: '+8%', icon: Users, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Goals Completed', value: '18,432', change: '+24%', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...blogForm } : p));
    } else {
      const newPost: BlogPost = {
        id: generateId(),
        ...blogForm,
        author: user.name,
        authorAvatar: user.avatar,
        tags: [],
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: 5,
        likes: 0,
        comments: 0,
        image: blogForm.image || 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop',
      };
      setPosts([newPost, ...posts]);
    }
    setShowBlogForm(false);
    setEditingPost(null);
    setBlogForm({ title: '', excerpt: '', category: 'Goal Setting', content: '', image: '' });
  };

  const openEditBlog = (post: BlogPost) => {
    setEditingPost(post);
    setBlogForm({ title: post.title, excerpt: post.excerpt, category: post.category, content: post.content, image: post.image });
    setShowBlogForm(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Welcome back, {user.name}</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold rounded-full">ADMIN</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'blog', label: 'Blog' },
            { id: 'posts', label: 'Community Posts' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-muted'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-border rounded-2xl p-5">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-xs text-green-500 mt-1">{s.change} this month</div>
                </motion.div>
              ))}
            </div>

            {/* Charts placeholder */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4">User Growth</h3>
                <div className="flex items-end gap-2 h-32">
                  {[40, 65, 55, 80, 72, 90, 85, 95, 88, 100, 92, 110].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                      <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-sm transition-all group-hover:opacity-90" style={{ height: '100%' }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4">Platform Metrics</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Goal Completion Rate', value: 89, color: 'bg-green-500' },
                    { label: 'Habit Streak Average', value: 73, color: 'bg-blue-500' },
                    { label: 'AI Coach Usage', value: 62, color: 'bg-purple-500' },
                    { label: 'Community Engagement', value: 54, color: 'bg-orange-500' },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-medium">{m.value}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">All Users</h3>
              <span className="text-xs text-muted-foreground">{DEMO_USERS.length} users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Email</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Goals</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Habits</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_USERS.map((u, i) => (
                    <tr key={u.id} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{u.name[0]}</div>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">Joined {new Date(u.joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                      <td className="p-4 text-center text-sm">{u.goals}</td>
                      <td className="p-4 text-center text-sm">{u.habits}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{u.status}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => alert(`Manage user: ${u.name}`)} className="text-xs text-primary hover:underline">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blog Management */}
        {activeTab === 'blog' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => { setShowBlogForm(true); setEditingPost(null); setBlogForm({ title: '', excerpt: '', category: 'Goal Setting', content: '', image: '' }); }} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Post</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Category</th>
                      <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Likes</th>
                      <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Comments</th>
                      <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post, i) => (
                      <tr key={post.id} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                              <p className="text-xs text-muted-foreground">{post.author} · {post.publishedAt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{post.category}</span></td>
                        <td className="p-4 text-center text-sm">{post.likes}</td>
                        <td className="p-4 text-center text-sm">{post.comments}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEditBlog(post)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                            <Link to={`/blog/${post.id}`} className="p-1.5 text-muted-foreground hover:text-blue-500 transition-colors text-xs">View</Link>
                            <button onClick={() => setPosts(posts.filter(p => p.id !== post.id))} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Community Posts */}
        {activeTab === 'posts' && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-base mb-4">Community Posts Moderation</h3>
            <div className="space-y-3">
              {[
                { user: 'Priya Sharma', content: 'Just completed my 30-day meditation streak!', status: 'approved', date: '2025-03-24' },
                { user: 'Rahul Verma', content: 'Excited to share my first freelance client!', status: 'approved', date: '2025-03-23' },
                { user: 'Ananya Krishnan', content: 'Update on my Japan travel goal: BOOKED THE TICKETS!', status: 'approved', date: '2025-03-22' },
                { user: 'Arjun Mehta', content: 'Week 8 of my fitness journey...', status: 'pending', date: '2025-03-21' },
              ].map((post, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-xl">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{post.user[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{post.user}</p>
                    <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{post.status}</span>
                    {post.status === 'pending' && (
                      <button onClick={() => alert('Post approved!')} className="text-xs text-green-500 hover:underline">Approve</button>
                    )}
                    <button className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Blog Form Modal */}
      {showBlogForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-2xl border border-border max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-bold mb-5">{editingPost ? 'Edit Blog Post' : 'New Blog Post'}</h2>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    {['Goal Setting', 'Habits', 'Manifestation', 'Finance', 'Success', 'Technology'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} rows={6} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowBlogForm(false); setEditingPost(null); }} className="flex-1 py-2.5 text-sm border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 btn-primary text-sm py-2.5">{editingPost ? 'Update Post' : 'Publish Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
