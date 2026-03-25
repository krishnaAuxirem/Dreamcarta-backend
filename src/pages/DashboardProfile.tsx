import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User, Mail, Briefcase, Edit3, Target, Flame, Zap, Image, Bot, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { updateUser } from '@/lib/auth';
import { DEMO_GOALS, DEMO_HABITS } from '@/constants';

export default function DashboardProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', profession: user?.profession || '', bio: user?.bio || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = updateUser(form);
    if (updated && setUser) setUser(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <DashboardLayout title="My Profile">
      <div className="space-y-6 max-w-2xl">
        {saved && (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 rounded-xl text-sm">
            Profile updated successfully!
          </div>
        )}

        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-28 gradient-hero relative" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-4">
              <div className="relative">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff&size=120`} alt="" className="w-24 h-24 rounded-2xl border-4 border-card object-cover" />
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 pb-2">
                <h2 className="font-display text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.profession || 'DreamCarta Member'}</p>
                {user.role === 'admin' && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>}
              </div>
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Display Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Profession</label>
                  <input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} placeholder="e.g., Software Engineer" className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell your story..." className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" />
                </div>
                <button onClick={handleSave} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            ) : (
              <div>
                {user.bio && <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" /> <span>Member since {new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" /> <span>{user.email}</span>
                  </div>
                  {user.profession && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" /> <span>{user.profession}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-4">Your Journey Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Goals Set', value: DEMO_GOALS.length, Icon: Target },
              { label: 'Habits Built', value: DEMO_HABITS.length, Icon: Flame },
              { label: 'Day Streak', value: user.streak, Icon: Zap },
              { label: 'Vision Boards', value: 3, Icon: Image },
              { label: 'AI Chats', value: 47, Icon: Bot },
              { label: 'Community Posts', value: 12, Icon: Users },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-muted/30 rounded-xl">
                <s.Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="font-display text-xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Completed meditation habit', time: '2 hours ago', Icon: Zap },
              { action: 'Updated goal: Run Half Marathon (60%)', time: '1 day ago', Icon: Target },
              { action: 'Added Japan travel goal', time: '2 days ago', Icon: Target },
              { action: 'Shared achievement in Community', time: '3 days ago', Icon: Users },
              { action: 'Created new vision board', time: '1 week ago', Icon: Image },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <a.Icon className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
