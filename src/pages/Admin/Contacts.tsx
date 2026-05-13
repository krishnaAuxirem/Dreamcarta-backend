import { useEffect, useState } from 'react';
import { Mail, Trash2, ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteAdminContactApi, getAdminContactsApi, type ContactItem } from '@/lib/api/adminApi';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingById, setDeletingById] = useState<Record<string, boolean>>({});

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await getAdminContactsApi();
      setContacts(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to load contact messages'));
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this contact message?');
    if (!confirmed) {
      return;
    }

    setDeletingById((previous) => ({ ...previous, [id]: true }));
    try {
      await deleteAdminContactApi(id);
      setContacts((previous) => previous.filter((item) => item.id !== id));
      toast.success('Contact deleted');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete contact message'));
    } finally {
      setDeletingById((previous) => ({ ...previous, [id]: false }));
    }
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied');
    } catch {
      toast.error('Could not copy email');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Contact Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Messages submitted from the website contact form appear here.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading contact submissions...
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No contact submissions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <article key={contact.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{contact.name}</h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {contact.subject}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{contact.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleString('en-IN')}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {contact.message}
                  </p>
                </div>

                <div className="flex flex-row flex-wrap gap-2 lg:flex-col lg:items-end">
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <Mail className="h-4 w-4" /> Contact User
                  </a>
                  <button
                    type="button"
                    onClick={() => void handleCopyEmail(contact.email)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Copy className="h-4 w-4" /> Copy Email
                  </button>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" /> Open Mail App
                  </a>
                  <button
                    type="button"
                    onClick={() => void handleDelete(contact.id)}
                    disabled={Boolean(deletingById[contact.id])}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingById[contact.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}