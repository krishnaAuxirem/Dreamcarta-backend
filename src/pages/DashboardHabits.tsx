import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Bell, Trash2, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_HABITS, HABIT_CATEGORIES } from '@/constants';
import { Habit } from '@/types';
import { generateId } from '@/lib/utils';

const COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function DashboardHabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(DEMO_HABITS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Mindfulness', frequency: 'daily' as 'daily' | 'weekly', reminderTime: '08:00' });

  const toggle = (id: string) => setHabits(habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));
  const remove = (id: string) => setHabits(habits.filter(h => h.id !== id));

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    setHabits([{
      id: generateId(), ...form, streak: 0, completedToday: false,
      completedDates: [], createdAt: new Date().toISOString().split('T')[0],
      color: COLORS[habits.length % COLORS.length],
    }, ...habits]);
    setShowForm(false);
    setForm({ title: '', description: '', category: 'Mindfulness', frequency: 'daily', reminderTime: '08:00' });
  };

  const done = habits.filter(h => h.completedToday).length;

  return (
    <DashboardLayout title="Habit Tracker">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 flex-1 mr-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Today's Progress — {done}/{habits.length} done</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${habits.length > 0 ? (done / habits.length) * 100 : 0}%` }} transition={{ duration: 1 }} />
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-amber-500 flex items-center justify-center"><Flame className="w-6 h-6" /></div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </div>

        {/* Week view */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4">This Week</h3>
          <div className="grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((d, i) => {
              const past = i < new Date().getDay();
              const today = i === new Date().getDay() - 1;
              return (
                <div key={i} className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">{d}</p>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${today ? 'bg-primary text-white ring-2 ring-primary/40' : past ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {today ? <span className="text-xs">•</span> : past ? <span className="text-xs">✓</span> : <span className="text-xs">—</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Habits */}
        <div className="space-y-3">
          <AnimatePresence>
            {habits.map((h, i) => (
              <motion.div key={h.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: i * 0.04 }}
                className={`bg-card border rounded-2xl p-4 transition-all ${h.completedToday ? 'border-green-200 dark:border-green-900/50' : 'border-border'}`}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => toggle(h.id)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shrink-0 transition-all active:scale-95 ${h.completedToday ? 'bg-green-500' : h.color}`}>
                    {h.completedToday ? '✓' : h.title[0]}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-semibold text-sm ${h.completedToday ? 'line-through text-muted-foreground' : ''}`}>{h.title}</h4>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{h.category}</span>
                    </div>
                    {h.description && <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>}
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-amber-500"><Flame className="w-3 h-3" />{h.streak} day streak</span>
                      {h.reminderTime && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Bell className="w-3 h-3" />{h.reminderTime}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${h.frequency === 'daily' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>{h.frequency}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {h.completedToday && <CheckCircle className="w-5 h-5 text-green-500" />}
                    <button onClick={() => remove(h.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl p-6 w-full max-w-md border border-border">
              <h2 className="font-display text-xl font-bold mb-5">New Habit</h2>
              <form onSubmit={addHabit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Habit name..." className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      {HABIT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value as 'daily' | 'weekly' })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reminder</label>
                  <input type="time" value={form.reminderTime} onChange={e => setForm({ ...form, reminderTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm border border-border rounded-lg hover:bg-muted">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm py-2.5">Add Habit</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
