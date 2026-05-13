import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Activity, Filter, Download } from 'lucide-react';
import { getAllActivityApi } from '@/lib/api/adminApi';

interface ActivityRecord {
  id: string;
  userId: number;
  type: string;
  description: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  metadata: any;
}

const ACTIVITY_TYPES = [
  { value: '', label: 'All Activities' },
  { value: 'goal_created', label: 'Goal Created' },
  { value: 'goal_updated', label: 'Goal Updated' },
  { value: 'habit_created', label: 'Habit Created' },
  { value: 'vision_board_updated', label: 'Vision Board Updated' },
  { value: 'post_created', label: 'Post Created' },
  { value: 'mentor_update', label: 'Mentor Update' },
  { value: 'admin_update', label: 'Admin Update' },
  { value: 'image_uploaded', label: 'Image Uploaded' },
];

export default function AdminActivity() {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getAllActivityApi(filter || undefined, 200);
        const rawItems = Array.isArray(response)
          ? response
          : Array.isArray(response?.activities)
            ? response.activities
            : Array.isArray(response?.data)
              ? response.data
              : [];

        const normalized = rawItems.map((item: any) => ({
          id: String(item?.id ?? item?._id ?? `${item?.type ?? 'activity'}-${Date.now()}`),
          userId: Number(item?.userId ?? item?.user?.id ?? 0),
          type: String(item?.type ?? 'activity'),
          description: String(item?.description ?? item?.action ?? 'Activity event'),
          user: {
            id: Number(item?.user?.id ?? item?.userId ?? 0),
            name: String(item?.user?.name ?? item?.name ?? 'Unknown User'),
            email: String(item?.user?.email ?? item?.email ?? ''),
            role: String(item?.user?.role ?? item?.role ?? 'user'),
          },
          createdAt: String(item?.createdAt ?? item?.timestamp ?? new Date().toISOString()),
          metadata: item?.metadata ?? item ?? {},
        })) as ActivityRecord[];

        const sorted = normalized.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setActivities(sorted);
      } catch (activityError) {
        const status = (activityError as any)?.response?.status;
        if (status === 403) {
          setError('You do not have permission to view activity history.');
        } else if (status === 401) {
          setError('Your session expired. Please sign in again.');
        } else {
          setError('Failed to load real activity data from backend.');
        }
        setActivities([]);
        toast.error(status === 403 ? 'Permission denied' : 'Activity API unavailable');
      } finally {
        setLoading(false);
      }
    };

    void loadActivities();
  }, [filter, reloadKey]);

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Email', 'Role', 'Activity', 'Description'],
      ...activities.map((a) => [
        new Date(a.createdAt).toLocaleString(),
        a.user.name,
        a.user.email,
        a.user.role,
        a.type,
        a.description,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Activity data exported ✅');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">User Activity Monitor</h1>
        <button
          onClick={() => void handleExport()}
          disabled={activities.length === 0}
          className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2 disabled:opacity-60"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <label className="text-sm font-semibold text-muted-foreground">Filter by Activity Type</label>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {ACTIVITY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity List */}
      <div className="bg-card border border-border rounded-2xl p-5">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground py-12 space-y-3">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{error}</p>
            <button onClick={handleRetry} className="btn-primary text-sm px-4 py-2">
              Retry
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            No activities found
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border border-border rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary shrink-0" />
                    <p className="font-semibold text-sm">{activity.user.name}</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {activity.user.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{activity.user.email}</span>
                    <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                      {activity.type.replace(/_/g, ' ').charAt(0).toUpperCase() +
                        activity.type.replace(/_/g, ' ').slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right shrink-0">
                  {new Date(activity.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
