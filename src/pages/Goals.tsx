import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Target, Calendar, Trash2, Edit3, ChevronRight, Lock, Flame, CheckCircle2, TrendingUp, Rocket, Activity, DollarSign, BookOpen, Plane, Heart, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_GOALS, GOAL_CATEGORIES } from '@/constants';
import { Goal } from '@/types';
import { generateId, getProgressColor } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  career: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  education: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  travel: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  relationships: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  personal: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  career: <Rocket className="w-5 h-5" />,
  health: <Activity className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  education: <BookOpen className="w-5 h-5" />,
  travel: <Plane className="w-5 h-5" />,
  relationships: <Heart className="w-5 h-5" />,
  personal: <Star className="w-5 h-5" />,
};

export default function GoalsPage() {
  const { isAuthenticated } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0 });

  const filtered = filterCategory === 'all' ? goals : goals.filter((g) => g.category === filterCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (editingGoal) {
      setGoals(goals.map((g) => g.id === editingGoal.id ? { ...g, ...form } as Goal : g));
    } else {
      const newGoal: Goal = {
        id: generateId(),
        ...form,
        category: form.category as Goal['category'],
        type: form.type as Goal['type'],
        steps: [],
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setGoals([newGoal, ...goals]);
    }
    setShowForm(false);
    setEditingGoal(null);
    setForm({ title: '', description: '', category: 'career', type: 'short-term', deadline: '', progress: 0 });
  };

  const deleteGoal = (id: string) => setGoals(goals.filter((g) => g.id !== id));

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setForm({ title: goal.title, description: goal.description, category: goal.category, type: goal.type, deadline: goal.deadline, progress: goal.progress });
    setShowForm(true);
  };

  return (
    <div>
      <Navbar />
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl font-bold">
                My <span className="text-gradient">Goals</span>
              </h1>
              <p className="text-muted-foreground mt-2">Define, track, and achieve your life goals</p>
            </div>
            {isAuthenticated ? (
              <button onClick={() => { setShowForm(true); setEditingGoal(null); }} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Goal
              </button>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2">
                <Lock className="w-4 h-4" /> Login to Add Goals
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Goals', value: goals.length, Icon: Target, color: 'text-primary' },
              { label: 'Active', value: goals.filter(g => g.status === 'active').length, Icon: Flame, color: 'text-orange-500' },
              { label: 'Completed', value: goals.filter(g => g.status === 'completed').length, Icon: CheckCircle2, color: 'text-green-500' },
              { label: 'Avg Progress', value: `${Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%`, Icon: TrendingUp, color: 'text-blue-500' },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <s.Icon className={`w-5 h-5 mb-1 ${s.color}`} />
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilterCategory('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterCategory === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>All</button>
          {GOAL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filterCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((goal, i) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {CATEGORY_ICON_MAP[goal.category]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${CATEGORY_COLORS[goal.category]}`}>{goal.category}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${goal.type === 'long-term' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{goal.type}</span>
                </div>

                <h3 className="font-bold text-base mb-1">{goal.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{goal.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${getProgressColor(goal.progress)}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {goal.steps.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Action Steps ({goal.steps.length})</p>
                    <ul className="space-y-1">
                      {goal.steps.slice(0, 2).map((step, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ChevronRight className="w-3 h-3 text-primary" />{step}
                        </li>
                      ))}
                      {goal.steps.length > 2 && <li className="text-xs text-muted-foreground ml-5">+{goal.steps.length - 2} more steps</li>}
                    </ul>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(goal)} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => deleteGoal(goal.id)} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border">
              <h2 className="font-display text-xl font-bold mb-6">{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Goal Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Launch my startup" required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your goal..." rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      {GOAL_CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Deadline *</label>
                    <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Progress ({form.progress}%)</label>
                    <input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="w-full mt-2 accent-primary" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); setEditingGoal(null); }} className="flex-1 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm py-2.5">{editingGoal ? 'Update Goal' : 'Add Goal'}</button>
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
