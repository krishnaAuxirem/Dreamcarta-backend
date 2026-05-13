import { useEffect, useMemo, useState } from 'react';
import UserTable from '@/components/Admin/UserTable';
import { type AdminUserRow } from './mockData';
import {
  createAdminUserApi,
  deleteAdminUserApi,
  getAdminUsersApi,
  updateAdminUserApi,
  updateAdminUserStatusApi,
  type AdminUserListItem,
} from '@/lib/api/adminApi';
import toast from 'react-hot-toast';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [actionBusyById, setActionBusyById] = useState<Record<string, boolean>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createRole, setCreateRole] = useState<'admin' | 'mentor' | 'user'>('user');
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [formError, setFormError] = useState('');

  const mapApiUserToRow = (apiUser: AdminUserListItem): AdminUserRow => {
    const joinedText = apiUser.joined ? `Joined ${new Date(apiUser.joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : 'Recently joined';

    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      status: apiUser.status,
      lastSeen: joinedText,
    };
  };

  const usersForTable = useMemo(() => users, [users]);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      setApiError('');
      try {
        const apiUsers = await getAdminUsersApi({ page: 1, limit: 100 });
        if (!active) {
          return;
        }
        setUsers(apiUsers.map(mapApiUserToRow));
      } catch (error: any) {
        if (active) {
          const message = getApiErrorMessage(error, 'Admin users API unavailable.');
          setApiError(message);
          setUsers([]);
          toast.error(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const setBusy = (userId: string, busy: boolean) => {
    setActionBusyById((prev) => ({ ...prev, [userId]: busy }));
  };

  const handleDelete = async (userId: string) => {
    const existing = users.find((user) => user.id === userId);
    if (!existing) {
      return;
    }

    const confirmed = window.confirm(`Delete user ${existing.name}?`);
    if (!confirmed) {
      return;
    }

    setBusy(userId, true);
    try {
      await deleteAdminUserApi(userId);
      setUsers((previous) => previous.filter((user) => user.id !== userId));
      toast.success('User deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'User delete failed.'));
    } finally {
      setBusy(userId, false);
    }
  };

  const handleRoleChange = async (userId: string, nextRole: 'admin' | 'mentor' | 'user') => {
    const current = users.find((user) => user.id === userId);
    if (!current) {
      return;
    }
    if (current.role === nextRole) {
      return;
    }
    setBusy(userId, true);
    try {
      await updateAdminUserApi(userId, { role: nextRole });
      setUsers((previous) =>
        previous.map((user) => (user.id === userId ? { ...user, role: nextRole } : user))
      );
      toast.success(`Role updated to ${nextRole}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Role update failed.'));
    } finally {
      setBusy(userId, false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const current = users.find((user) => user.id === userId);
    if (!current) {
      return;
    }

    const nextStatus: 'active' | 'inactive' = current.status === 'active' ? 'inactive' : 'active';
    setBusy(userId, true);
    try {
      await updateAdminUserStatusApi(userId, nextStatus);
      setUsers((previous) =>
        previous.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user))
      );
      toast.success(`Status changed to ${nextStatus}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Status update failed.'));
    } finally {
      setBusy(userId, false);
    }
  };

  const openCreateModal = (role: 'admin' | 'mentor' | 'user') => {
    setCreateRole(role);
    setCreateForm({ name: '', email: '', password: '', status: 'active' });
    setFormError('');
    setShowCreateModal(true);
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const name = createForm.name.trim();
    const email = createForm.email.trim().toLowerCase();
    const password = createForm.password.trim();

    if (!name || !email || !password) {
      setFormError('Name, Email, and Password are required.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const emailAlreadyExists = users.some((user) => user.email.toLowerCase() === email);
    if (emailAlreadyExists) {
      setFormError('A user with this email already exists.');
      return;
    }

    setCreatingUser(true);
    try {
      const created = await createAdminUserApi({
        name,
        email,
        password,
        role: createRole,
        status: createForm.status,
      });

      const newUser = mapApiUserToRow(created);
      setUsers((previous) => [newUser, ...previous]);
      setShowCreateModal(false);
      toast.success(
        `${createRole === 'admin' ? 'Admin' : createRole === 'mentor' ? 'Mentor' : 'User'} created successfully.`
      );
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Create API failed. Please verify the backend endpoint.'));
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Users Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Search, filter, and manage user roles/status from one place.
          </p>
          {loading && <p className="text-xs text-muted-foreground mt-1">Loading users...</p>}
          {!loading && apiError && <p className="text-xs text-red-500 mt-1">{apiError}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openCreateModal('user')}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Create User
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('mentor')}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Create Mentor
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('admin')}
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90"
          >
            Create Admin
          </button>
        </div>
      </div>

      <UserTable
        users={usersForTable}
        busyById={actionBusyById}
        onDelete={(userId) => {
          if (actionBusyById[userId]) {
            return;
          }
          void handleDelete(userId);
        }}
        onChangeRole={(userId, nextRole) => {
          if (actionBusyById[userId]) {
            return;
          }
          void handleRoleChange(userId, nextRole);
        }}
        onToggleStatus={(userId) => {
          if (actionBusyById[userId]) {
            return;
          }
          void handleToggleStatus(userId);
        }}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
            <h3 className="font-display text-xl font-bold">
              {createRole === 'admin'
                ? 'Create New Admin'
                : createRole === 'mentor'
                  ? 'Create New Mentor'
                  : 'Create New User'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              This will create a real account using admin API.
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleCreateUser}>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, name: event.target.value }))}
                  placeholder="Enter full name"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, email: event.target.value }))}
                  placeholder="name@company.com"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, password: event.target.value }))}
                  placeholder="Min 6 characters"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Role</label>
                  <input
                    value={createRole === 'admin' ? 'Admin' : createRole === 'mentor' ? 'Mentor' : 'User'}
                    readOnly
                    className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(event) =>
                      setCreateForm((previous) => ({
                        ...previous,
                        status: event.target.value as 'active' | 'inactive',
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formError && (
                <p className="text-xs font-medium text-red-500">{formError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                  {creatingUser
                    ? 'Creating...'
                    : createRole === 'admin'
                    ? 'Create Admin'
                    : createRole === 'mentor'
                      ? 'Create Mentor'
                      : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
