import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Heart, MessageCircle, Share2, Send, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DEMO_BLOG_POSTS } from '@/constants';
import { getBlogsApi, type BlogItem } from '@/lib/api/adminApi';

interface BlogComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface BlogViewPost {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: number;
  tags: string[];
  isHtml: boolean;
}

const INITIAL_BLOG_COMMENTS: Record<string, BlogComment[]> = {
  b1: [
    {

const HTML_TAG_PATTERN = /<[^>]+>/;

const estimateReadTime = (content: string) => {
  const words = content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};

const formatPublishedDate = (value: string) => new Date(value).toLocaleDateString('en-IN', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const formatCommentDate = (value: string) => new Date(value).toLocaleString('en-IN', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const toDemoViewPost = (post: (typeof DEMO_BLOG_POSTS)[number]): BlogViewPost => ({
  id: post.id,
  title: post.title,
  content: post.content,
  image: post.image,
  category: post.category,
  author: post.author,
  authorAvatar: post.authorAvatar,
  publishedAt: post.publishedAt,
  readTime: post.readTime,
  likes: post.likes,
  comments: post.comments,
  tags: post.tags,
  isHtml: false,
});

const toLiveViewPost = (post: BlogItem): BlogViewPost => ({
  id: post.id,
  title: post.title,
  content: post.content,
  image: post.image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop',
  category: 'Blog',
  author: 'DreamCarta Editorial',
  authorAvatar: 'https://ui-avatars.com/api/?name=DreamCarta+Editorial&background=6133B4&color=fff',
  publishedAt: post.createdAt || new Date().toISOString(),
  readTime: estimateReadTime(post.content),
  likes: 0,
  comments: 0,
  tags: ['DreamCarta', 'Blog'],
  isHtml: HTML_TAG_PATTERN.test(post.content),
});

const renderBlogBody = (post: BlogViewPost) => {
  if (post.isHtml) {
    return <div className="prose prose-sm md:prose-base max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: post.content }} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-sm md:prose-base max-w-none text-foreground">
      {post.content.split('\n\n').map((block, i) => {
        if (block.startsWith('## ')) {
          return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-4">{block.replace('## ', '')}</h2>;
        }

        if (block.startsWith('**') && block.endsWith('**')) {
          return <p key={i} className="font-bold text-lg my-3">{block.replace(/\*\*/g, '')}</p>;
        }

        if (block.match(/^\d\./)) {
          return (
            <div key={i} className="my-4">
              {block.split('\n').map((line, j) => (
                <p key={j} className="text-sm md:text-base leading-relaxed mb-2">{line}</p>
              ))}
            </div>
          );
        }

        return <p key={i} className="text-sm md:text-base leading-relaxed mb-4 text-muted-foreground">{block}</p>;
      })}
    </motion.div>
  );
};
      id: 'b1-c1',
      author: 'Priya Sharma',
      content: 'The RAS explanation is the clearest I have seen. Very practical.',
  const [livePosts, setLivePosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
    },
    {
      id: 'b1-c2',
      author: 'Arjun Reddy',

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      setLoading(true);

      try {
        const posts = await getBlogsApi();
        if (isMounted) {
          setLivePosts(posts);
        }
      } catch {
        if (isMounted) {
          setLivePosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setComments(id ? INITIAL_BLOG_COMMENTS[id] ?? [] : []);
    setCommentName('');
    setCommentText('');
    setShowComments(true);
  }, [id]);

  const livePost = livePosts.find((post) => post.id === id);
  const demoPost = DEMO_BLOG_POSTS.find((post) => post.id === id);
  const post = livePost ? toLiveViewPost(livePost) : demoPost ? toDemoViewPost(demoPost) : null;

  const relatedPosts = livePost
    ? livePosts
        .filter((postItem) => postItem.id !== id)
        .slice(0, 3)
        .map(toLiveViewPost)
    : DEMO_BLOG_POSTS.filter((postItem) => postItem.id !== id && demoPost && postItem.category === demoPost.category).slice(0, 3).map(toDemoViewPost);
      content: 'The action step at the end matters most. Good breakdown.',
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center text-muted-foreground">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    },
  ],
  b2: [
    {
      id: 'b2-c1',
            <div className="text-6xl mb-4">📄</div>
      content: 'Backward planning changed how I set deadlines. Solid article.',
      createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    },
  ],
  b3: [
    {
      id: 'b3-c1',
      author: 'Rahul Verma',
      content: 'Habit stacking is the only thing that finally made my routines stick.',
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    },
  ],
  b4: [
    {
      id: 'b4-c1',
      author: 'Ananya Singh',
      content: 'Morning routines are underrated. This was a good read.',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
  b5: [
    {
      id: 'b5-c1',
      author: 'Vikram Nair',
      content: 'AI coaching is becoming a real productivity advantage.',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ],
  b6: [
    {
      id: 'b6-c1',
      author: 'Priya Mehta',
      content: 'The roadmap feels realistic, not hype-driven. Nice.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = DEMO_BLOG_POSTS.find((p) => p.id === id);
  const [comments, setComments] = useState<BlogComment[]>(id ? INITIAL_BLOG_COMMENTS[id] ?? [] : []);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);

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

  const addComment = () => {
    const author = commentName.trim() || 'Guest';
    const content = commentText.trim();

    if (!content) {
      return;
    }

    setComments((previous) => [
      {
        id: `comment-${Date.now()}`,
        author,
        content,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
    setCommentText('');
  };

  const deleteComment = (commentId: string) => {
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) {
      return;
    }

    setComments((previous) => previous.filter((comment) => comment.id !== commentId));
  };

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
              <p className="text-sm text-muted-foreground">{formatPublishedDate(post.publishedAt)}</p>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-4 h-4" />{post.readTime} min read</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Heart className="w-4 h-4" />{post.likes}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><MessageCircle className="w-4 h-4" />{comments.length}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-8">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <Heart className="w-4 h-4" /> Like ({post.likes})
            </button>
            <button onClick={() => setShowComments((previous) => !previous)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <MessageCircle className="w-4 h-4" /> Comments ({comments.length})
            </button>
            <button onClick={() => navigator.share?.({ title: post.title, url: window.location.href })} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mb-10 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h3 className="font-display text-xl font-bold">Comments</h3>
                <span className="text-sm text-muted-foreground">{comments.length} total</span>
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="hidden md:block" />
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addComment}
                    className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Add Comment
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet. Add the first one.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm">{comment.author}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCommentDate(comment.createdAt)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteComment(comment.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">#{tag}</span>)}
          </div>

          {/* Content */}
          {renderBlogBody(post)}

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

            {relatedPosts.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-1">{relatedPost.category}</p>
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{relatedPost.title}</h4>
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
