import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getBlogsApi, BlogItem } from '@/lib/api/adminApi';
import { DEMO_BLOG_POSTS } from '@/constants';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogsApi()
      .then((res) => setBlogs(res.length > 0 ? res : DEMO_BLOG_POSTS.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.excerpt,
        image: post.image,
        isPublished: true,
        createdAt: post.publishedAt,
      }))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold mb-3">
            Dream <span className="text-gradient">Journal</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Insights, strategies, and stories to fuel your journey to greatness
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                ) : null}
                <div className="p-5">
                  <h2 className="font-bold text-xl mb-2">{blog.title}</h2>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                    <div className="mt-4">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No blogs published yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
