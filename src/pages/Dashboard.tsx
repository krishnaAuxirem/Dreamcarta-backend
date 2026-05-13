import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Flame, Star, TrendingUp, Bot, Sparkles } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { MOTIVATIONAL_QUOTES } from '@/constants';
import { getProgressColor } from '@/lib/utils';
import { Goal, Habit, Dream } from '@/types';
import { getGoalsApi } from '@/lib/api/goalsApi';
import { getHabitsApi } from '@/lib/api/habitsApi';
import { getDreamsApi } from '@/lib/api/dreamsApi';
import { getMentorGuidanceForUser, type MentorGuidanceEntry } from '@/lib/mentorGuidance';

export default function DashboardPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [mentorGuidance, setMentorGuidance] = useState<MentorGuidanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [goalsData, habitsData, dreamsData] = await Promise.all([
        getGoalsApi(),
        getHabitsApi(),
        getDreamsApi(),
      ]);
      setGoals(goalsData);
      setHabits(habitsData);
      setDreams(dreamsData);
      setMentorGuidance(getMentorGuidanceForUser({ id: user?.id, email: user?.email, name: user?.name }));
    } catch {
      setError('Failed to load dashboard stats. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const quote = MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length];
  const activeGoals = goals.filter((g) => g.status === 'active');
  const todayHabits = habits.filter((h) => h.completedToday);
  const maxStreak = habits.length ? Math.max(...habits.map((h) => h.streak)) : 0;
  const overallProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((a, g) => a + g.progress, 0) / activeGoals.length)
    : 0;
  const habitCompletionPercent = habits.length ? (todayHabits.length / habits.length) * 100 : 0;

  const QUICK_STATS = [
    { label: 'Active Goals', value: activeGoals.length, icon: Target, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Habit Streak', value: `${maxStreak}d`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: 'Habits Done Today', value: `${todayHabits.length}/${habits.length}`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 float-anim"><Sparkles className="w-28 h-28 text-white" /></div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</p>
            <h2 className="font-display text-3xl font-bold mt-0.5">Hello, {user?.name?.split(' ')[0]}</h2>
            <p className="text-white/80 text-sm mt-2 max-w-lg italic">"{quote.quote}"</p>
            <p className="text-white/50 text-xs mt-1">— {quote.author}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/dashboard/goals" className="btn-gold text-sm px-4 py-2 flex items-center gap-1">
                View Goals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/dashboard/ai-coach" className="flex items-center gap-1 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-all">
                <Bot className="w-3.5 h-3.5" /> Ask AI Coach
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {loading && <div className="bg-card border border-border rounded-2xl p-5 text-center text-sm text-muted-foreground">Loading dashboard stats...</div>}
        {!loading && error && (
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-5 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={() => void loadDashboardData()} className="btn-primary text-sm px-4 py-2">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-display text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Goals */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base">Active Goals</h3>
              <Link to="/dashboard/goals" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {activeGoals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active goals yet.</p>
              ) : (
                activeGoals.slice(0, 4).map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-sm font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{goal.category} · Due {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${getProgressColor(goal.progress)}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/dashboard/goals" className="mt-4 block w-full py-2.5 text-center text-sm text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors">
              + Add New Goal
            </Link>
          </div>

          {/* Habits today */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base">Today's Habits</h3>
              <Link to="/dashboard/habits" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground">No habits yet.</p>
              ) : (
                habits.slice(0, 6).map((habit) => (
                  <div key={habit.id} className={`flex items-center gap-3 p-3 rounded-xl ${habit.completedToday ? 'bg-green-50 dark:bg-green-950/20' : 'bg-muted/30'}`}>
                    <div className={`w-8 h-8 rounded-lg ${habit.completedToday ? 'bg-green-500' : habit.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {habit.completedToday ? <Star className="w-4 h-4" /> : habit.title[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${habit.completedToday ? 'line-through text-muted-foreground' : ''}`}>{habit.title}</p>
                      <p className="flex items-center gap-1 text-xs text-amber-500"><Flame className="w-3 h-3" /> {habit.streak} days</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">{todayHabits.length}/{habits.length} completed today</p>
              <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${habitCompletionPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Advice */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base">Mentor Advice</h3>
            <span className="text-xs text-muted-foreground">{mentorGuidance.length} notes</span>
          </div>

          {mentorGuidance.length === 0 ? (
            <p className="text-sm text-muted-foreground">No mentor advice received yet.</p>
          ) : (
            <div className="space-y-3">
              {mentorGuidance.slice(0, 3).map((entry) => (
                <div key={entry.id} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">From {entry.mentorName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Mentor
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{entry.advice}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dreams overview */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base">Dream Tracker</h3>
            <Link to="/dashboard/dreams" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dreams.length === 0 ? (
              <p className="text-sm text-muted-foreground">No dreams tracked yet.</p>
            ) : (
              dreams.slice(0, 3).map((dream) => (
                <div key={dream.id} className="relative rounded-xl overflow-hidden">
                  <img src={dream.image || 'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?w=800&h=400&fit=crop'} alt={dream.title} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-bold truncate">{dream.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${dream.progress}%` }} />
                      </div>
                      <span className="text-white text-xs font-bold">{dream.progress}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
