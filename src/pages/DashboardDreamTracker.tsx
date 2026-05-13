import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Dream } from '@/types';
import { getProgressColor } from '@/lib/utils';
import { getDreamsApi, toggleDreamMilestoneApi } from '@/lib/api/dreamsApi';
import { toast } from '@/components/ui/sonner';

export default function DashboardDreamTrackerPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDreams = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDreamsApi();
      setDreams(data);
    } catch {
      setError('Failed to load dreams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDreams();
  }, []);

  const toggleMilestone = async (dreamId: string, milestoneId: string) => {
    const previousDream = dreams.find((dream) => dream.id === dreamId);
    if (!previousDream) {
      return;
    }

    setDreams((prev) =>
      prev.map((dream) => {
        if (dream.id !== dreamId) {
          return dream;
        }

        const updatedMilestones = dream.milestones.map((milestone) => {
          if (milestone.id !== milestoneId) {
            return milestone;
          }

          const completed = !milestone.completed;
          return {
            ...milestone,
            completed,
            completedAt: completed ? new Date().toISOString().split('T')[0] : undefined,
          };
        });

        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = updatedMilestones.length
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : 0;

        return {
          ...dream,
          milestones: updatedMilestones,
          progress,
        };
      })
    );

    try {
      const updated = await toggleDreamMilestoneApi(dreamId, milestoneId);
      setDreams((prev) => prev.map((d) => (d.id === dreamId ? updated : d)));
      toast.success('Milestone updated');
    } catch {
      setDreams((prev) => prev.map((dream) => (dream.id === dreamId ? previousDream : dream)));
      toast.error('Failed to update milestone');
    }
  };

  const avgProgress = dreams.length ? Math.round(dreams.reduce((a, d) => a + d.progress, 0) / dreams.length) : 0;

  return (
    <DashboardLayout title="Dream Tracker">
      <div className="space-y-6">
        {loading && <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading dreams...</div>}
        {!loading && error && (
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={() => void loadDreams()} className="btn-primary text-sm px-4 py-2">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Dreams', value: dreams.length },
            { label: 'Milestones Done', value: dreams.reduce((a, d) => a + d.milestones.filter(m => m.completed).length, 0) },
            { label: 'Avg Progress', value: `${avgProgress}%` },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dreams */}
        {dreams.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No dreams found yet.
          </div>
        ) : (
        <div className="space-y-6">
          {dreams.map((dream, i) => (
            <motion.div key={dream.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="relative h-40">
                <img src={dream.image} alt={dream.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-xs text-white/70 capitalize">{dream.category}</span>
                  <h3 className="font-display text-xl font-bold text-white">{dream.title}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                  {dream.progress}%
                </div>
              </div>

              <div className="p-5">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Overall Progress</span>
                    <span>Due: {new Date(dream.deadline).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${dream.progress}%` }} transition={{ duration: 1, delay: i * 0.2 }} className={`h-full rounded-full ${getProgressColor(dream.progress)}`} />
                  </div>
                </div>

                {/* Milestones */}
                <h4 className="font-semibold text-sm mb-3">Milestones ({dream.milestones.filter(m => m.completed).length}/{dream.milestones.length})</h4>
                <div className="space-y-2">
                  {dream.milestones.map((m) => (
                    <button key={m.id} onClick={() => void toggleMilestone(dream.id, m.id)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left">
                      {m.completed ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                      <span className={`text-sm ${m.completed ? 'line-through text-muted-foreground' : ''}`}>{m.title}</span>
                      {m.completedAt && <span className="text-xs text-muted-foreground ml-auto">{m.completedAt}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
