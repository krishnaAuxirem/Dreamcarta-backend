import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Heart, MessageCircle, Share2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DEMO_BLOG_POSTS } from '@/constants';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = DEMO_BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="font-display text-2xl font-bold mb-2">Article Not Found</h2>
            <Link to="/blog" className="btn-primary">Back to Blog</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const related = DEMO_BLOG_POSTS.filter((p) => p.id !== id && p.category === post.category).slice(0, 3);

  return (
    <div>
      <Navbar />
      <article className="pt-24">
        {/* Hero */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <span className="text-xs bg-primary text-white px-3 py-1 rounded-full mb-3 inline-block">{post.category}</span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white">{post.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Meta */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <img src={post.authorAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-sm text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" />{post.readTime} min read</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Heart className="w-4 h-4" />{post.likes}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><MessageCircle className="w-4 h-4" />{post.comments}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-8">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <Heart className="w-4 h-4" /> Like ({post.likes})
            </button>
            <button onClick={() => navigator.share?.({ title: post.title, url: window.location.href })} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">#{tag}</span>)}
          </div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-sm md:prose-base max-w-none text-foreground">
            {post.content.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) {
                return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-4">{block.replace('## ', '')}</h2>;
              } else if (block.startsWith('**') && block.endsWith('**')) {
                return <p key={i} className="font-bold text-lg my-3">{block.replace(/\*\*/g, '')}</p>;
              } else if (block.match(/^\d\./)) {
                return (
                  <div key={i} className="my-4">
                    {block.split('\n').map((line, j) => (
                      <p key={j} className="text-sm md:text-base leading-relaxed mb-2">{line}</p>
                    ))}
                  </div>
                );
              } else {
                return <p key={i} className="text-sm md:text-base leading-relaxed mb-4 text-muted-foreground">{block}</p>;
              }
            })}
          </motion.div>

          {/* Author bio */}
          <div className="mt-12 p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-start gap-4">
              <img src={post.authorAvatar} alt="" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-sm text-muted-foreground mt-1">Expert in personal development, goal-setting, and habit formation. Contributing writer at DreamCarta.</p>
              </div>
            </div>
          </div>

          {/* Back & Related */}
          <div className="mt-8">
            <Link to="/blog" className="flex items-center gap-2 text-primary hover:underline text-sm mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            {related.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link to={`/blog/${r.id}`} key={r.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <img src={r.image} alt={r.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-1">{r.category}</p>
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
