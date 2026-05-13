import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  BlogItem,
  createBlogApi,
  deleteBlogApi,
  getAdminBlogsApi,
  updateBlogApi,
} from '@/lib/api/adminApi';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

const EMPTY_FORM = {
  title: '',
  content: '',
  image: '',
  isPublished: true,
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingById, setDeletingById] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [editBlog, setEditBlog] = useState<BlogItem | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const data = await getAdminBlogsApi();
        setBlogs(data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load blogs'));
      } finally {
        setLoading(false);
      }
    };

    void loadBlogs();
  }, []);

  useEffect(() => {
    if (!editBlog) {
      return;
    }

    setForm({
      title: editBlog.title,
      content: editBlog.content,
      image: editBlog.image ?? '',
      isPublished: Boolean(editBlog.isPublished ?? true),
    });
    setShowForm(true);
  }, [editBlog]);

  const handleSaveBlog = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      if (editBlog) {
        await updateBlogApi(editBlog.id, form);
        setBlogs((prev) =>
          prev.map((blog) =>
            blog.id === editBlog.id
              ? {
                  ...blog,
                  title: form.title,
                  content: form.content,
                  image: form.image,
                  isPublished: form.isPublished,
                }
              : blog
          )
        );
        toast.success('Blog updated ✅');
      } else {
        const created = await createBlogApi({
          title: form.title,
          content: form.content,
          image: form.image,
          isPublished: form.isPublished,
        });
        setBlogs((prev) => [created, ...prev]);
        toast.success('Blog created ✅');
      }

      setForm(EMPTY_FORM);
      setEditBlog(null);
      setShowForm(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, editBlog ? 'Blog update failed ❌' : 'Blog create failed ❌'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this blog?');
    if (!confirmDelete) {
      return;
    }

    setDeletingById((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteBlogApi(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Blog deleted ✅');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Delete failed ❌'));
    } finally {
      setDeletingById((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Blogs</h1>
        <button
          disabled={saving}
          onClick={() => {
            setEditBlog(null);
            setForm(EMPTY_FORM);
            setShowForm(true);
          }}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-60"
        >
          + New Blog
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background"
          />
          <ReactQuill
            value={form.content}
            onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean'],
              ],
            }}
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background"
          />

          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
            />
            Publish now
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditBlog(null);
                setForm(EMPTY_FORM);
              }}
              type="button"
              className="px-4 py-2 rounded-lg border border-border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSaveBlog()}
              disabled={saving}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
            >
              {saving ? (editBlog ? 'Saving...' : 'Creating...') : editBlog ? 'Save Blog' : 'Create Blog'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">No blogs available.</div>
        ) : (
          <div className="space-y-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="border border-border rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-base truncate">{blog.title}</h3>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Status: {blog.isPublished ? 'Published' : 'Draft'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{blog.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditBlog(blog)}
                    disabled={saving || Boolean(deletingById[blog.id])}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-60"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void handleDelete(blog.id)}
                    disabled={Boolean(deletingById[blog.id])}
                    className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingById[blog.id] ? (
                      'Deleting...'
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
