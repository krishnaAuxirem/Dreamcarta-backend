import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserSettingsApi, updateUserSettingsApi } from '@/lib/api/userApi';

const ADMIN_SETTINGS_KEY = 'dc_admin_settings';
const ADMIN_PASSWORD_KEY = 'dc_admin_password';

const defaultSettings = {
  darkTheme: false,
  emailAlerts: true,
  twoFactorAuth: true,
};

type AdminSettingsState = typeof defaultSettings;

const readSavedSettings = (): AdminSettingsState => {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) {
      return defaultSettings;
    }

    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AdminSettingsState>) };
  } catch {
    return defaultSettings;
  }
};

const applyTheme = (enabled: boolean) => {
  document.documentElement.classList.toggle('dark', enabled);
  localStorage.setItem('dc_theme', enabled ? 'dark' : 'light');
};

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSettingsState>(() => readSavedSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getUserSettingsApi();
        const nextSettings = {
          ...defaultSettings,
          ...(response?.settings || {}),
        };

        setSettings(nextSettings);
        localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(nextSettings));
        applyTheme(Boolean(nextSettings.darkTheme));
      } catch {
        const stored = readSavedSettings();
        setSettings(stored);
        applyTheme(Boolean(stored.darkTheme));
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const toggleSetting = (key: keyof AdminSettingsState) => {
    setSettings((previous) => {
      const next = { ...previous, [key]: !previous[key] };
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(next));

      if (key === 'darkTheme') {
        applyTheme(Boolean(next.darkTheme));
      }

      return next;
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
      applyTheme(Boolean(settings.darkTheme));

      try {
        await updateUserSettingsApi(settings);
      } catch {
        // Keep local persistence even when the backend settings API is unavailable.
      }

      toast.success('Preferences saved ✅');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password must match');
      return;
    }

    setPasswordSaving(true);
    try {
      const savedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
      if (savedPassword && savedPassword !== currentPassword) {
        toast.error('Current password is incorrect');
        return;
      }

      localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);

      try {
        await updateUserSettingsApi({ passwordUpdatedAt: new Date().toISOString() });
      } catch {
        // local fallback only
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated locally ✅');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section className="xl:col-span-2 space-y-6">
        {loading && (
          <article className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm text-muted-foreground">
            Loading saved preferences...
          </article>
        )}

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-xl font-bold">Admin Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">Personal and account details</p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Name</label>
              <input
                value={user?.name || 'Admin'}
                readOnly
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <input
                value={user?.email || 'admin@dreamcarta.com'}
                readOnly
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Role</label>
              <input
                value="Admin"
                readOnly
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <input
                value="Active"
                readOnly
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-xl font-bold">Change Password</h2>
          <p className="text-sm text-muted-foreground mt-1">Save a new password for this workspace</p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Current password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((previous) => ({ ...previous, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">New password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((previous) => ({ ...previous, newPassword: e.target.value }))}
                placeholder="Enter new password"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Confirm password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((previous) => ({ ...previous, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handlePasswordUpdate()}
            disabled={passwordSaving}
            className="mt-4 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </article>
      </section>

      <section>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-xl font-bold">Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Toggle dashboard experience options</p>

          <div className="mt-5 space-y-4">
            {[
              { key: 'darkTheme', label: 'Enable dark theme' },
              { key: 'emailAlerts', label: 'Email alerts for incidents' },
              { key: 'twoFactorAuth', label: 'Force 2FA for admins' },
            ].map((option) => (
              <label key={option.key} className="flex items-center justify-between rounded-xl border border-border p-3 cursor-pointer">
                <span className="text-sm font-medium">{option.label}</span>
                <button
                  type="button"
                  onClick={() => toggleSetting(option.key as keyof AdminSettingsState)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[option.key as keyof AdminSettingsState] ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      settings[option.key as keyof AdminSettingsState] ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void handleSaveSettings()}
            disabled={saving || loading}
            className="mt-5 w-full rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </article>
      </section>
    </div>
  );
}
