import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Flame, Star, Activity, Users, Bot, Image, BookOpen, Rocket, Plane } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { getUserActivityApi, type ActivityRecord } from '@/lib/api/activityApi';

const HISTORY_ICON_MAP: Record<string, { Icon: any; color: string; title: string }> = {
  habit_created: { Icon: Activity, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', title: 'Habit Updated' },
  habit_completed: { Icon: Activity, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', title: 'Habit Completed' },
  goal_created: { Icon: Target, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', title: 'Goal Created' },
  goal_updated: { Icon: Target, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', title: 'Goal Updated' },
  dream_created: { Icon: Star, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', title: 'Dream Updated' },
  dream_updated: { Icon: Star, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', title: 'Dream Updated' },
  post_created: { Icon: Users, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', title: 'Community Post' },
  community_post_created: { Icon: Users, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', title: 'Community Post' },
  ai_chat: { Icon: Bot, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', title: 'AI Coach Session' },
  vision_board_updated: { Icon: Image, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', title: 'Vision Board Updated' },
  journal_saved: { Icon: BookOpen, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', title: 'Journal Saved' },
  travel_goal_added: { Icon: Plane, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', title: 'Travel Goal Added' },
};

const FALLBACK_MONTHLY_STATS = [
  { label: 'Habits Completed', value: 0, icon: Flame, color: 'text-orange-500' },
  { label: 'Goals Updated', value: 0, icon: Target, color: 'text-primary' },
  { label: 'Streak Days', value: 0, icon: Star, color: 'text-amber-500' },
  { label: 'Active Days', value: 0, icon: Calendar, color: 'text-green-500' },
];

const MENTOR_ACTIVITY_PATTERN = /(mentor|advice|guidance|coach|session|check[-_ ]?in|review)/i;

const extractGuidedUserName = (activity: ActivityRecord): string | null => {
  const metadata = activity.metadata as Record<string, any> | undefined;
  const candidates = [
    metadata?.targetUserName,
    metadata?.targetUser?.name,
    metadata?.studentName,
    metadata?.recipientName,
    metadata?.userName,
    metadata?.guidedUserName,
    metadata?.memberName,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  if (typeof activity.description === 'string') {
    const matched = activity.description.match(/(?:for|to|with)\s+([A-Z][A-Za-z0-9_.'-]*(?:\s+[A-Z][A-Za-z0-9_.'-]*)*)/);
    if (matched?.[1]) {
      return matched[1].trim();
    }
  }

  return null;
};

export default function DashboardHistoryPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError('');
      if (!user?.id) {
        setActivities([]);
        return;
      }

      const data = await getUserActivityApi(user.id, 200);
      setActivities(data);
    } catch {
      setError('Failed to load activity history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActivities();
  }, [user?.id]);

  const visibleActivities = useMemo(() => {
    const filteredActivities = filter ? activities.filter((activity) => activity.type === filter) : activities;
    return [...filteredActivities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activities, filter]);

  const mentorGuidanceActivities = useMemo(
    () => visibleActivities.filter((activity) => MENTOR_ACTIVITY_PATTERN.test(activity.type) || MENTOR_ACTIVITY_PATTERN.test(activity.description)),
    [visibleActivities]
  );

  const guidedMembers = useMemo(() => {
    const seen = new Map<string, { name: string; description: string; createdAt: string }>();

    mentorGuidanceActivities.forEach((activity) => {
      const targetName = extractGuidedUserName(activity);
      if (!targetName || seen.has(targetName)) {
        return;
      }

      seen.set(targetName, {
        name: targetName,
        description: activity.description,
        createdAt: activity.createdAt,
      });
    });

    return [...seen.values()];
  }, [mentorGuidanceActivities]);

  const monthlyStats = useMemo(() => {
    const uniqueDays = new Set(visibleActivities.map((activity) => activity.createdAt.slice(0, 10)));
    return [
      { label: 'Habits Completed', value: visibleActivities.filter((activity) => activity.type.includes('habit')).length, icon: Flame, color: 'text-orange-500' },
      { label: 'Goals Updated', value: visibleActivities.filter((activity) => activity.type.includes('goal')).length, icon: Target, color: 'text-primary' },
      { label: 'Streak Days', value: Math.max(uniqueDays.size, 0), icon: Star, color: 'text-amber-500' },
      { label: 'Active Days', value: uniqueDays.size, icon: Calendar, color: 'text-green-500' },
    ];
  }, [visibleActivities]);

  const activityTypes = [
    { value: '', label: 'All Activities' },
    { value: 'goal_created', label: 'Goal Created' },
    { value: 'goal_updated', label: 'Goal Updated' },
    { value: 'habit_created', label: 'Habit Created' },
    { value: 'vision_board_updated', label: 'Vision Board Updated' },
    { value: 'post_created', label: 'Post Created' },
    { value: 'ai_chat', label: 'AI Chat' },
    { value: 'journal_saved', label: 'Journal Saved' },
    { value: 'mentor_update', label: 'Mentor Update' },
    { value: 'mentor_session', label: 'Mentor Session' },
    { value: 'advice_given', label: 'Advice Given' },
  ];

  const pageTitle = user?.role === 'mentor' || user?.role === 'admin' ? 'Activity History' : 'Activity History';

  return (
    <DashboardLayout title={pageTitle}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(loading ? FALLBACK_MONTHLY_STATS : monthlyStats).map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-border rounded-xl p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label} this month</div>
            </motion.div>
          ))}
        </div>

        {(user?.role === 'mentor' || user?.role === 'admin') && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-base">Guided Members</h3>
                <p className="text-xs text-muted-foreground">People you guided, reviewed, or coached.</p>
              </div>
              <span className="text-xs text-muted-foreground">{guidedMembers.length} total</span>
            </div>

            {guidedMembers.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                No mentor guidance records found yet.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {guidedMembers.map((member) => (
                  <div key={member.name} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(member.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Guided
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{member.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-semibold text-muted-foreground">Filter by Activity Type</label>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-5">Activity Timeline</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}
            </div>
          ) : error ? (
            <div className="text-center text-muted-foreground py-12 space-y-3">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{error}</p>
              <button onClick={() => void loadActivities()} className="btn-primary text-sm px-4 py-2">
                Retry
              </button>
            </div>
          ) : visibleActivities.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              No activities found
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-5">
                {visibleActivities.map((item, i) => {
                  const mapped = HISTORY_ICON_MAP[item.type] ?? { Icon: Activity, color: 'bg-muted text-muted-foreground', title: item.type.replace(/_/g, ' ') };
                  const guidedUserName = extractGuidedUserName(item);
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-5 relative">
                      <div className="w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center z-10 shrink-0">
                        <mapped.Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{mapped.title}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.user.name} · {item.user.email}</p>
                            {guidedUserName && (user?.role === 'mentor' || user?.role === 'admin') && (
                              <p className="text-xs text-primary mt-1">Guided member: {guidedUserName}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mapped.color}`}>{item.type.replace(/_/g, ' ')}</span>
                            <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
