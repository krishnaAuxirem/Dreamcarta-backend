import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Shield, Palette, Globe } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/hooks/useTheme';

export default function DashboardSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    goalReminders: true,
    habitReminders: true,
    weeklyReport: true,
    communityUpdates: false,
    marketingEmails: false,
    twoFactor: false,
    publicProfile: true,
    showGoals: true,
    showHabits: false,
    language: 'en',
    timezone: 'Asia/Kolkata',
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) => setSettings({ ...settings, [key]: !settings[key] });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 max-w-2xl">
        {saved && (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 rounded-xl text-sm">
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: 'Purple', color: 'bg-purple-500' }, { label: 'Blue', color: 'bg-blue-500' }, { label: 'Green', color: 'bg-green-500' }].map((c) => (
                <button key={c.label} className={`p-3 rounded-xl border-2 border-transparent hover:border-primary transition-all text-sm`}>
                  <div className={`w-6 h-6 ${c.color} rounded-full mx-auto mb-1`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get important updates via email' },
              { key: 'goalReminders', label: 'Goal Reminders', desc: 'Reminders for upcoming deadlines' },
              { key: 'habitReminders', label: 'Habit Reminders', desc: 'Daily reminders for your habits' },
              { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Summary of your weekly achievements' },
              { key: 'communityUpdates', label: 'Community Updates', desc: 'New posts and comments in community' },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'News, features, and promotions' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch checked={settings[key as keyof typeof settings] as boolean} onChange={() => toggle(key as keyof typeof settings)} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base">Privacy & Security</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Extra layer of account security' },
              { key: 'publicProfile', label: 'Public Profile', desc: 'Allow others to see your profile' },
              { key: 'showGoals', label: 'Show Goals Publicly', desc: 'Display your goals in community' },
              { key: 'showHabits', label: 'Show Habits Publicly', desc: 'Display your habits in community' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch checked={settings[key as keyof typeof settings] as boolean} onChange={() => toggle(key as keyof typeof settings)} />
              </div>
            ))}
          </div>
          <button onClick={() => alert('Password reset email sent!')} className="mt-4 w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            Change Password
          </button>
        </motion.div>

        {/* Regional */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base">Regional Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="Asia/Kolkata">IST (India)</option>
                <option value="Asia/Dubai">GST (Dubai)</option>
                <option value="America/New_York">EST (New York)</option>
                <option value="Europe/London">GMT (London)</option>
              </select>
            </div>
          </div>
        </motion.div>

        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 py-3">
          <Save className="w-4 h-4" /> Save All Settings
        </button>

        {/* Danger zone */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6">
          <h3 className="font-bold text-base text-red-700 dark:text-red-400 mb-4">⚠️ Danger Zone</h3>
          <div className="space-y-3">
            <button onClick={() => alert('Account deletion requires email confirmation.')} className="w-full py-2.5 border border-red-300 text-red-600 dark:text-red-400 rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
              Delete All Data
            </button>
            <button onClick={() => alert('Account deletion requires email confirmation.')} className="w-full py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
