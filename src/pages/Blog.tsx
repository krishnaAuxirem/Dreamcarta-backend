import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Heart, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DEMO_BLOG_POSTS, BLOG_CATEGORIES } from '@/constants';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = DEMO_BLOG_POSTS.filter((post) => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      <Navbar />
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl font-bold mb-3">
              Dream <span className="text-gradient">Journal</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Insights, strategies, and stories to fuel your journey to greatness
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Featured post */}
        {featured && (
          <Link to={`/blog/${featured.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-card border border-border rounded-2xl overflow-hidden mb-8 hover:shadow-xl transition-shadow"
            >
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-full overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Featured</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit mb-3">{featured.category}</span>
                  <h2 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <img src={featured.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{featured.author}</p>
                      <p className="text-xs text-muted-foreground">{new Date(featured.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime} min</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{featured.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{featured.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Rest of posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <Link to={`/blog/${post.id}`} key={post.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden card-hover"
              >
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{post.category}</span>
                  <h3 className="font-bold text-base mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <img src={post.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <p className="text-xs text-muted-foreground flex-1">{post.author}</p>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{post.readTime}m</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Heart className="w-3 h-3" />{post.likes}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="mb-3"><Search className="w-10 h-10 mx-auto text-muted-foreground" /></div>
            <p>No articles found. Try a different search or category.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
