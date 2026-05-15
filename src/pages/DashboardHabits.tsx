import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Bell, Trash2, CheckCircle, Zap, Shield, TrendingUp, Award } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { HABIT_CATEGORIES } from '@/constants';
import { Habit } from '@/types';
import { createHabitApi, deleteHabitApi, getHabitsApi, checkInHabitApi } from '@/lib/api/habitsApi';
import { toast } from '@/components/ui/sonner';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const FREEZE_STORAGE_KEY = 'dc_habit_freeze_state';
const BEST_STREAK_STORAGE_KEY = 'dc_habit_best_streak';

interface FreezeState {
  [habitId: string]: {
    used: boolean;
    usedDate: string;
  };
}

interface BestStreakRecord {
  [habitId: string]: number;
}

const getStreakMilestone = (streak: number): { next: number; label: string } | null => {
  if (streak < 7) return { next: 7, label: '1 Week' };
  if (streak < 30) return { next: 30, label: '1 Month' };
  if (streak < 100) return { next: 100, label: '100 Days' };
  if (streak < 365) return { next: 365, label: '1 Year' };
  return null;
};

const isMilestone = (streak: number): boolean => [7, 30, 100, 365].includes(streak);

const saveFreezState = (state: FreezeState) => {
  localStorage.setItem(FREEZE_STORAGE_KEY, JSON.stringify(state));
};

const loadFreezeState = (): FreezeState => {
  try {
    const raw = localStorage.getItem(FREEZE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveBestStreaks = (records: BestStreakRecord) => {
  localStorage.setItem(BEST_STREAK_STORAGE_KEY, JSON.stringify(records));
};

const loadBestStreaks = (): BestStreakRecord => {
  try {
    const raw = localStorage.getItem(BEST_STREAK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const getTodayDateStr = (): string => new Date().toISOString().split('T')[0];

const canUseFreeze = (freezeState: FreezeState, habitId: string): boolean => {
  const state = freezeState[habitId];
  if (!state || !state.used) return true;
  const usedDate = state.usedDate;
  const today = getTodayDateStr();
  const usedDateTime = new Date(usedDate).getTime();
  const todayTime = new Date(today).getTime();
  const daysDiff = (todayTime - usedDateTime) / (1000 * 60 * 60 * 24);
  return daysDiff >= 7;
};

export default function DashboardHabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [freezeState, setFreezeState] = useState<FreezeState>({});
  const [bestStreaks, setBestStreaks] = useState<BestStreakRecord>({});
  const [form, setForm] = useState({ title: '', description: '', category: 'Mindfulness', frequency: 'daily' as 'daily' | 'weekly', reminderTime: '08:00' });

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getHabitsApi();
      setHabits(data);
      setFreezeState(loadFreezeState());
      setBestStreaks(loadBestStreaks());
    } catch {
      setError('Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHabits();
  }, []);

  const useFreeze = (habitId: string) => {
    if (!canUseFreeze(freezeState, habitId)) {
      toast.error('Freeze already used this week');
      return;
    }

    const newState = {
      ...freezeState,
      [habitId]: { used: true, usedDate: getTodayDateStr() },
    };
    setFreezeState(newState);
    saveFreezState(newState);
    toast.success('Streak freeze activated! Come back tomorrow.');
  };

  const updateBestStreaks = (habitId: string, currentStreak: number) => {
    const currentBest = bestStreaks[habitId] ?? 0;
    if (currentStreak > currentBest) {
      const newRecords = { ...bestStreaks, [habitId]: currentStreak };
      setBestStreaks(newRecords);
      saveBestStreaks(newRecords);
    }
  };

  const toggle = async (id: string) => {
    const previousHabit = habits.find((habit) => habit.id === id);
    if (!previousHabit) {
      return;
    }

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) {
          return habit;
        }

        const nextCompleted = !habit.completedToday;
        const newStreak = nextCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        updateBestStreaks(id, newStreak);
        if (isMilestone(newStreak)) {
          toast.success(`🎉 Milestone reached: ${newStreak} day streak!`);
        }
        return {
          ...habit,
          completedToday: nextCompleted,
          streak: newStreak,
        };
      })
    );

    try {
      const updated = await checkInHabitApi(id);
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      toast.success('Habit check-in updated');
    } catch {
      setHabits((prev) => prev.map((habit) => (habit.id === id ? previousHabit : habit)));
      toast.error('Failed to update habit check-in');
    }
  };

  const remove = async (id: string) => {
    const deletedHabit = habits.find((habit) => habit.id === id);
    const deletedIndex = habits.findIndex((habit) => habit.id === id);
    if (!deletedHabit || deletedIndex < 0) {
      return;
    }

    setHabits((prev) => prev.filter((h) => h.id !== id));

    try {
      await deleteHabitApi(id);
      toast.success('Habit deleted');
    } catch {
      setHabits((prev) => {
        if (prev.some((habit) => habit.id === id)) {
          return prev;
        }

        const next = [...prev];
        next.splice(Math.min(deletedIndex, next.length), 0, deletedHabit);
        return next;
      });
      toast.error('Failed to delete habit');
    }
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await createHabitApi({
        title: form.title,
        description: form.description,
        category: form.category,
        frequency: form.frequency,
        reminderTime: form.reminderTime,
      });
      setHabits((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', category: 'Mindfulness', frequency: 'daily', reminderTime: '08:00' });
      toast.success('Habit created');
    } catch {
      toast.error('Failed to create habit');
    } finally {
      setSubmitting(false);
    }
  };

  const done = habits.filter((h) => h.completedToday).length;

  return (
    <DashboardLayout title="Habit Tracker">
      <div className="space-y-6">
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

        {loading && <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading habits...</div>}
        {!loading && error && (
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={() => void loadHabits()} className="btn-primary text-sm px-4 py-2">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="text-amber-500 flex items-center mb-1"><Flame className="w-4 h-4 mr-1" /></div>
                <div className="text-2xl font-bold">{Math.max(...habits.map(h => h.streak), 0)}</div>
                <div className="text-xs text-muted-foreground">Max Streak Today</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="text-purple-500 flex items-center mb-1"><Award className="w-4 h-4 mr-1" /></div>
                <div className="text-2xl font-bold">{habits.filter(h => h.completedToday).length}/{habits.length}</div>
                <div className="text-xs text-muted-foreground">Completed Today</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="text-green-500 flex items-center mb-1"><TrendingUp className="w-4 h-4 mr-1" /></div>
                <div className="text-2xl font-bold">{habits.length}</div>
                <div className="text-xs text-muted-foreground">Total Habits</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="text-blue-500 flex items-center mb-1"><Shield className="w-4 h-4 mr-1" /></div>
                <div className="text-2xl font-bold">{habits.filter(h => canUseFreeze(freezeState, h.id) && !h.completedToday).length}</div>
                <div className="text-xs text-muted-foreground">Freezes Available</div>
              </div>
            </div>

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

            {habits.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <p className="text-sm text-muted-foreground">No habits yet. Add your first habit.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {habits.map((h, i) => {
                    const bestStreak = bestStreaks[h.id] ?? 0;
                    const milestone = getStreakMilestone(h.streak);
                    const freezeAvailable = canUseFreeze(freezeState, h.id);
                    return (
                      <motion.div key={h.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: i * 0.04 }}
                        className={`bg-card border rounded-2xl p-4 transition-all ${h.completedToday ? 'border-green-200 dark:border-green-900/50' : 'border-border'}`}
                      >
                        <div className="flex items-start gap-4">
                          <button onClick={() => void toggle(h.id)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shrink-0 transition-all active:scale-95 ${h.completedToday ? 'bg-green-500' : h.color}`}>
                            {h.completedToday ? '✓' : h.title[0]}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`font-semibold text-sm ${h.completedToday ? 'line-through text-muted-foreground' : ''}`}>{h.title}</h4>
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{h.category}</span>
                            </div>
                            {h.description && <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <span className="flex items-center gap-1 text-xs text-amber-500"><Flame className="w-3.5 h-3.5" />{h.streak}d</span>
                                {bestStreak > 0 && bestStreak !== h.streak && <span className="text-xs text-muted-foreground">best: {bestStreak}d</span>}
                              </div>
                              {milestone && (
                                <div className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary">
                                  <TrendingUp className="w-3 h-3" />
                                  {milestone.next - h.streak} to {milestone.label}
                                </div>
                              )}
                              {h.reminderTime && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Bell className="w-3 h-3" />{h.reminderTime}</span>}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${h.frequency === 'daily' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>{h.frequency}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            {h.completedToday && <CheckCircle className="w-5 h-5 text-green-500" />}
                            <button
                              onClick={() => useFreeze(h.id)}
                              disabled={!freezeAvailable || h.completedToday}
                              className={`p-1.5 flex items-center justify-center rounded-lg transition-colors ${
                                freezeAvailable && !h.completedToday
                                  ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                  : 'text-muted-foreground opacity-50 cursor-not-allowed'
                              }`}
                              title={freezeAvailable ? 'Use once per week to maintain streak' : 'Already used or not needed'}
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button onClick={() => void remove(h.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
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
                  <button type="submit" className="flex-1 btn-primary text-sm py-2.5" disabled={submitting}>{submitting ? 'Saving...' : 'Add Habit'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
