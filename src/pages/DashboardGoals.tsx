import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, Edit3, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GOAL_CATEGORIES } from '@/constants';
import { Goal } from '@/types';
import { getProgressColor } from '@/lib/utils';
import { createGoalApi, deleteGoalApi, getGoalsApi, updateGoalApi } from '@/lib/api/goalsApi';
import { toast } from '@/components/ui/sonner';

import { Rocket, Activity, DollarSign, BookOpen, Plane, Heart, Star as StarIcon } from 'lucide-react';

const GOAL_PRIORITY_STORAGE_KEY = 'dc_goal_priorities';
const GOAL_STEP_COMPLETION_STORAGE_KEY = 'dc_goal_step_completion';

type GoalPriority = 'high' | 'medium' | 'low';

interface GoalPriorityMap {
  [goalId: string]: GoalPriority;
}

interface StepCompletionMap {
  [goalId: string]: {
    [stepIndex: number]: boolean;
  };
}

const CATEGORY_ICON_COMPONENTS: Record<string, React.ReactNode> = {
  career: <Rocket className="w-5 h-5" />,
  health: <Activity className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  education: <BookOpen className="w-5 h-5" />,
  travel: <Plane className="w-5 h-5" />,
  relationships: <Heart className="w-5 h-5" />,
  personal: <StarIcon className="w-5 h-5" />,
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = CATEGORY_ICON_COMPONENTS;

const PRIORITY_COLORS: Record<GoalPriority, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const PRIORITY_BADGES: Record<GoalPriority, string> = {
  high: '🔴 High',
  medium: '🟡 Medium',
  low: '🟢 Low',
};

const loadGoalPriorities = (): GoalPriorityMap => {
  try {
    const raw = localStorage.getItem(GOAL_PRIORITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveGoalPriorities = (map: GoalPriorityMap) => {
  localStorage.setItem(GOAL_PRIORITY_STORAGE_KEY, JSON.stringify(map));
};

const loadStepCompletion = (): StepCompletionMap => {
  try {
    const raw = localStorage.getItem(GOAL_STEP_COMPLETION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStepCompletion = (map: StepCompletionMap) => {
  localStorage.setItem(GOAL_STEP_COMPLETION_STORAGE_KEY, JSON.stringify(map));
};

const getTodayStr = (): string => new Date().toISOString().split('T')[0];

const getDaysRemaining = (deadline: string): number => {
  const today = new Date(getTodayStr());
  const deadlineDate = new Date(deadline);
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const getPriorityOrder = (priority: GoalPriority): number => {
  const order: Record<GoalPriority, number> = { high: 0, medium: 1, low: 2 };
  return order[priority] ?? 2;
};

export default function DashboardGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [goalPriorities, setGoalPriorities] = useState<GoalPriorityMap>({});
  const [stepCompletion, setStepCompletion] = useState<StepCompletionMap>({});
  const [form, setForm] = useState({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0, steps: '' });

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.category === filter || g.status === filter);
  const sorted = [...filtered].sort((a, b) => {
    const aPriority = goalPriorities[a.id] ?? 'medium';
    const bPriority = goalPriorities[b.id] ?? 'medium';
    return getPriorityOrder(aPriority) - getPriorityOrder(bPriority);
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getGoalsApi();
      setGoals(data);
      setGoalPriorities(loadGoalPriorities());
      setStepCompletion(loadStepCompletion());
    } catch {
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGoals();
  }, []);

  const toggleStepCompletion = (goalId: string, stepIndex: number) => {
    const currentCompletion = stepCompletion[goalId] ?? {};
    const isCompleted = currentCompletion[stepIndex];
    const updated = {
      ...stepCompletion,
      [goalId]: {
        ...currentCompletion,
        [stepIndex]: !isCompleted,
      },
    };
    setStepCompletion(updated);
    saveStepCompletion(updated);
  };

  const changePriority = (goalId: string) => {
    const current = goalPriorities[goalId] ?? 'medium';
    const nextMap: Record<GoalPriority, GoalPriority> = { high: 'medium', medium: 'low', low: 'high' };
    const next = nextMap[current];
    setGoalPriorities({ ...goalPriorities, [goalId]: next });
    saveGoalPriorities({ ...goalPriorities, [goalId]: next });
  };

  const updateProgress = async (goalId: string, newProgress: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      const updated = await updateGoalApi(goalId, { progress: newProgress });
      setGoals(prev => prev.map(g => g.id === goalId ? updated : g));
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const steps = form.steps.split('\n').map((s) => s.trim()).filter(Boolean);

    try {
      setSubmitting(true);

      if (editing) {
        const updated = await updateGoalApi(editing.id, {
          title: form.title,
          description: form.description,
          category: form.category as Goal['category'],
          type: form.type as Goal['type'],
          deadline: form.deadline,
          progress: form.progress,
          steps,
        });
        setGoals((prev) => prev.map((g) => (g.id === editing.id ? updated : g)));
        toast.success('Goal updated');
      } else {
        const created = await createGoalApi({
          title: form.title,
          description: form.description,
          category: form.category as Goal['category'],
          type: form.type as Goal['type'],
          deadline: form.deadline,
          progress: form.progress,
          steps,
        });
        setGoals((prev) => [created, ...prev]);
        toast.success('Goal created');
      }

      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0, steps: '' });
    } catch {
      toast.error(editing ? 'Failed to update goal' : 'Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const deletedGoal = goals.find((goal) => goal.id === id);
    const deletedIndex = goals.findIndex((goal) => goal.id === id);
    if (!deletedGoal || deletedIndex < 0) {
      return;
    }

    setGoals((prev) => prev.filter((g) => g.id !== id));

    try {
      await deleteGoalApi(id);
      toast.success('Goal deleted');
    } catch {
      setGoals((prev) => {
        if (prev.some((goal) => goal.id === id)) {
          return prev;
        }

        const next = [...prev];
        next.splice(Math.min(deletedIndex, next.length), 0, deletedGoal);
        return next;
      });
      toast.error('Failed to delete goal');
    }
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      deadline: goal.deadline,
      progress: goal.progress,
      steps: goal.steps.join('\n'),
    });
    setShowForm(true);
  };

  const avgProgress = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;

  return (
    <DashboardLayout title="My Goals">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', ...GOAL_CATEGORIES, 'completed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0, steps: '' }); }} className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>

        {loading && <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading goals...</div>}
        {!loading && error && (
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={() => void loadGoals()} className="btn-primary text-sm px-4 py-2">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total', value: goals.length, color: 'text-primary' },
                { label: 'Active', value: goals.filter(g => g.status === 'active').length, color: 'text-blue-500' },
                { label: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: 'text-green-500' },
                { label: 'Avg Progress', value: `${avgProgress}%`, color: 'text-amber-500' },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <p className="text-sm text-muted-foreground">No goals found for this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence>
                  {sorted.map((goal, i) => {
                    const priority = goalPriorities[goal.id] ?? 'medium';
                    const daysRemaining = getDaysRemaining(goal.deadline);
                    const isOverdue = daysRemaining < 0;
                    const goalStepCompletion = stepCompletion[goal.id] ?? {};
                    const completedSteps = goal.steps.filter((_, idx) => goalStepCompletion[idx]).length;
                    return (
                      <motion.div key={goal.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}
                        className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-all"
                      >
                        <div className="flex justify-between mb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{CATEGORY_ICONS[goal.category]}</span>
                            <button onClick={() => changePriority(goal.id)} className={`text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity font-medium ${PRIORITY_COLORS[priority]}`}>
                              {PRIORITY_BADGES[priority]}
                            </button>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${goal.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{goal.status}</span>
                        </div>
                        <h3 className="font-bold text-sm mb-1">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{goal.description}</p>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-bold text-primary">{goal.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${getProgressColor(goal.progress)}`} />
                          </div>
                          <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => void updateProgress(goal.id, Number(e.target.value))} className="w-full mt-1 h-1.5 accent-primary cursor-pointer" />
                        </div>

                        <div className="flex items-center gap-1 text-xs mb-3 flex-wrap">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className={isOverdue ? 'text-red-500 font-bold' : 'text-muted-foreground'}>{isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}</span>
                        </div>

                        {goal.steps.length > 0 && (
                          <div className="mb-3 space-y-1 bg-muted/30 rounded-lg p-2">
                            <p className="text-xs font-semibold text-muted-foreground">Steps: {completedSteps}/{goal.steps.length}</p>
                            <div className="space-y-1">
                              {goal.steps.slice(0, 3).map((step, idx) => {
                                const isCompleted = goalStepCompletion[idx];
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => toggleStepCompletion(goal.id, idx)}
                                    className={`w-full text-left text-xs px-2 py-1 rounded flex items-center gap-2 transition-all ${
                                      isCompleted
                                        ? 'bg-green-500/20 text-green-600 dark:text-green-400 line-through'
                                        : 'hover:bg-primary/10'
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle className="w-3 h-3 shrink-0" /> : <div className="w-3 h-3 border rounded-sm shrink-0" />}
                                    <span className="truncate">{step}</span>
                                  </button>
                                );
                              })}
                              {goal.steps.length > 3 && <p className="text-xs text-muted-foreground px-2">+{goal.steps.length - 3} more</p>}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button onClick={() => openEdit(goal)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => void handleDelete(goal.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
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
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto">
              <h2 className="font-display text-xl font-bold mb-5">{editing ? 'Edit Goal' : 'Add New Goal'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Goal title..." className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      {GOAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      <option value="short-term">Short-term</option>
                      <option value="long-term">Long-term</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Deadline *</label>
                    <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Progress ({form.progress}%)</label>
                    <input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="w-full mt-2 accent-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Action Steps (one per line)</label>
                  <textarea value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} rows={3} placeholder="Step 1&#10;Step 2&#10;Step 3" className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 text-sm border border-border rounded-lg hover:bg-muted">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm py-2.5" disabled={submitting}>{submitting ? 'Saving...' : editing ? 'Update' : 'Add Goal'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
