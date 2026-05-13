import { useEffect, useMemo, useState } from 'react';
import { Activity, Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import { getAdminStatsApi } from '@/lib/api/adminApi';
import toast from 'react-hot-toast';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

const statIcons = [Users, UserCheck, UserPlus, TrendingUp];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    conversionRate: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const data = await getAdminStatsApi();
        setStats({
          totalUsers: Number(data?.totalUsers || 0),
          activeUsers: Number(data?.activeUsers || 0),
          newUsers: Number(data?.newUsers || 0),
          conversionRate: Number(data?.conversionRate || 0),
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load admin stats'));
      } finally {
        setLoadingStats(false);
      }
    };

    void loadStats();
  }, []);

  const adminStats = useMemo(
    () => [
      { label: 'Total Users', value: String(stats.totalUsers), change: 'live' },
      { label: 'Active Users', value: String(stats.activeUsers), change: 'live' },
      { label: 'New Signups (7d)', value: String(stats.newUsers), change: 'live' },
      { label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: 'live' },
    ],
    [stats]
  );

  const recentActivity = useMemo(
    () => [
      { id: 'a1', actor: 'System', action: `total users synced: ${stats.totalUsers}`, time: 'just now' },
      { id: 'a2', actor: 'System', action: `active users: ${stats.activeUsers}`, time: 'just now' },
      { id: 'a3', actor: 'System', action: `new users in 7 days: ${stats.newUsers}`, time: 'just now' },
    ],
    [stats]
  );

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => {
          const Icon = statIcons[index] || Activity;

          return (
            <article key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold">{loadingStats ? '...' : stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{loadingStats ? 'loading' : `${stat.change} vs last month`}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Recent Activity</h2>
            <span className="text-xs text-muted-foreground">Live feed</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-border/70 bg-background p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{activity.actor}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-xl font-bold mb-4">Quick Analytics</h2>
          <div className="space-y-4">
            {[
              { label: 'Daily active sessions', value: 74 },
              { label: 'Retention health', value: 86 },
              { label: 'Support response SLA', value: 93 },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-semibold">{metric.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
