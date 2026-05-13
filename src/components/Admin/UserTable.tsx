import { useMemo, useState } from 'react';
import { Search, Trash2, ShieldCheck, Shield } from 'lucide-react';
import type { AdminUserRow } from '@/pages/Admin/mockData';

interface UserTableProps {
  users: AdminUserRow[];
  busyById?: Record<string, boolean>;
  onDelete: (userId: string) => void;
  onChangeRole: (userId: string, role: 'admin' | 'mentor' | 'user') => void;
  onToggleStatus: (userId: string) => void;
}

type FilterType = 'all' | 'admin' | 'mentor' | 'user';

export default function UserTable({ users, busyById = {}, onDelete, onChangeRole, onToggleStatus }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByRole, setFilterByRole] = useState<FilterType>('all');

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = filterByRole === 'all' ? true : user.role === filterByRole;
      const matchesSearch =
        !normalizedQuery ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);

      return matchesRole && matchesSearch;
    });
  }, [users, searchTerm, filterByRole]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="inline-flex rounded-xl border border-border bg-card p-1">
          {(['all', 'admin', 'mentor', 'user'] as const).map((filterOption) => (
            <button
              key={filterOption}
              type="button"
              onClick={() => setFilterByRole(filterOption)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filterByRole === filterOption
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filterOption === 'all'
                ? 'All'
                : filterOption === 'admin'
                  ? 'Admin'
                  : filterOption === 'mentor'
                    ? 'Mentors'
                    : 'Users'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Last seen {user.lastSeen}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                        : user.role === 'mentor'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                    }`}
                  >
                    {user.role === 'admin' ? <ShieldCheck className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      disabled={Boolean(busyById[user.id])}
                      value={user.role}
                      onChange={(event) => onChangeRole(user.id, event.target.value as 'admin' | 'mentor' | 'user')}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium bg-card disabled:opacity-60"
                    >
                      <option value="user">User</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="button"
                      disabled={Boolean(busyById[user.id])}
                      onClick={() => onToggleStatus(user.id)}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
                    >
                      {busyById[user.id]
                        ? 'Processing...'
                        : `Mark ${user.status === 'active' ? 'Inactive' : 'Active'}`}
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(busyById[user.id])}
                      onClick={() => onDelete(user.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30 disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {busyById[user.id] ? 'Processing...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
