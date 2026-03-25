import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, Trash2, Edit3 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_GOALS, GOAL_CATEGORIES } from '@/constants';
import { Goal } from '@/types';
import { generateId, getProgressColor } from '@/lib/utils';

import { Rocket, Activity, DollarSign, BookOpen, Plane, Heart, Star as StarIcon } from 'lucide-react';

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

export default function DashboardGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0, steps: '' });

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.category === filter || g.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const steps = form.steps.split('\n').filter(Boolean);
    if (editing) {
      setGoals(goals.map((g) => g.id === editing.id ? { ...g, ...form, steps, category: form.category as Goal['category'], type: form.type as Goal['type'] } : g));
    } else {
      const newGoal: Goal = { id: generateId(), ...form, steps, category: form.category as Goal['category'], type: form.type as Goal['type'], status: 'active', createdAt: new Date().toISOString().split('T')[0] };
      setGoals([newGoal, ...goals]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0, steps: '' });
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setForm({ title: goal.title, description: goal.description, category: goal.category, type: goal.type, deadline: goal.deadline, progress: goal.progress, steps: goal.steps.join('\n') });
    setShowForm(true);
  };

  return (
    <DashboardLayout title="My Goals">
      <div className="space-y-6">
        {/* Header */}
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total', value: goals.length, color: 'text-primary' },
            { label: 'Active', value: goals.filter(g => g.status === 'active').length, color: 'text-blue-500' },
            { label: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: 'text-green-500' },
            { label: 'Avg Progress', value: `${Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%`, color: 'text-amber-500' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Goals grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((goal, i) => (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{CATEGORY_ICONS[goal.category]}</span>
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
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {goal.steps.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {goal.steps.slice(0, 2).map((step, j) => <p key={j} className="text-xs text-muted-foreground flex gap-1"><span className="text-primary">›</span>{step}</p>)}
                    {goal.steps.length > 2 && <p className="text-xs text-muted-foreground">+{goal.steps.length - 2} more</p>}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(goal)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setGoals(goals.filter(g => g.id !== goal.id))} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
                  <button type="submit" className="flex-1 btn-primary text-sm py-2.5">{editing ? 'Update' : 'Add Goal'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
