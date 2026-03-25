import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle, Bell, Flame, Trash2, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_HABITS, HABIT_CATEGORIES } from '@/constants';
import { Habit } from '@/types';
import { generateId } from '@/lib/utils';

const HABIT_COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitsPage() {
  const { isAuthenticated } = useAuth();
  const [habits, setHabits] = useState<Habit[]>(DEMO_HABITS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Mindfulness', frequency: 'daily' as 'daily' | 'weekly', reminderTime: '08:00' });

  const toggleHabit = (id: string) => {
    setHabits(habits.map((h) => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));
  };

  const deleteHabit = (id: string) => setHabits(habits.filter((h) => h.id !== id));

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHabit: Habit = {
      id: generateId(),
      ...form,
      streak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
      color: HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
    };
    setHabits([newHabit, ...habits]);
    setShowForm(false);
    setForm({ title: '', description: '', category: 'Mindfulness', frequency: 'daily', reminderTime: '08:00' });
  };

  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalStreak = habits.reduce((a, h) => a + h.streak, 0);
  const longestStreak = Math.max(...habits.map((h) => h.streak));

  return (
    <div>
      <Navbar />
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl font-bold">
                Habit <span className="text-gradient">Tracker</span>
              </h1>
              <p className="text-muted-foreground mt-2">Build the habits that fuel your dreams</p>
            </div>
            {isAuthenticated ? (
              <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Habit
              </button>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2">
                <Lock className="w-4 h-4" /> Login to Track
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Habits', value: habits.length, icon: 'list' },
              { label: 'Done Today', value: `${completedToday}/${habits.length}`, icon: 'check' },
              { label: 'Total Streak Days', value: totalStreak, icon: 'flame' },
              { label: 'Longest Streak', value: `${longestStreak} days`, icon: 'trophy' },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="w-6 h-6 mb-1 text-primary flex items-center"><Flame className="w-5 h-5" /></div>
                <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress bar for today */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-sm">Today's Progress</p>
            <p className="text-sm font-bold text-primary">{completedToday}/{habits.length} completed</p>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Weekly calendar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <p className="font-medium text-sm mb-3">This Week</p>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day, i) => {
              const past = i < 5;
              const today = i === 5;
              return (
                <div key={day} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{day}</p>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${today ? 'bg-primary text-white ring-2 ring-primary/30' : past ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {today ? '🎯' : past ? '✓' : '·'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Habits list */}
        <div className="space-y-4">
          <AnimatePresence>
            {habits.map((habit, i) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card border rounded-2xl p-5 transition-all ${habit.completedToday ? 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/10' : 'border-border'}`}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => isAuthenticated && toggleHabit(habit.id)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all ${habit.completedToday ? 'bg-green-500 scale-110' : habit.color + ' opacity-80 hover:opacity-100'}`}>
                    {habit.completedToday ? '✓' : habit.title[0]}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`font-semibold text-sm ${habit.completedToday ? 'line-through text-muted-foreground' : ''}`}>{habit.title}</h3>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{habit.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{habit.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{habit.streak} day streak</span>
                      </div>
                      {habit.reminderTime && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Bell className="w-3.5 h-3.5" />
                          <span className="text-xs">{habit.reminderTime}</span>
                        </div>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${habit.frequency === 'daily' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>{habit.frequency}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {habit.completedToday && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {isAuthenticated && (
                      <button onClick={() => deleteHabit(habit.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isAuthenticated && (
          <div className="mt-8 bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white text-center">
            <h3 className="font-display text-2xl font-bold mb-2">Track Your Habits</h3>
            <p className="text-white/80 mb-5">Sign up free to add your own habits and track your progress</p>
            <Link to="/register" className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-all">Get Started Free</Link>
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl p-6 w-full max-w-md border border-border">
              <h2 className="font-display text-xl font-bold mb-5">Add New Habit</h2>
              <form onSubmit={addHabit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Habit Name *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Morning Meditation" required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      {HABIT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as 'daily' | 'weekly' })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reminder Time</label>
                  <input type="time" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm py-2.5">Add Habit</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
