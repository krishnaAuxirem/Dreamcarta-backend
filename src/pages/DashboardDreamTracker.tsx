import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Dream, DreamMilestone, VisionBoardItem } from '@/types';
import { getProgressColor } from '@/lib/utils';
import { getDreamsApi, toggleDreamMilestoneApi } from '@/lib/api/dreamsApi';
import { getVisionBoardItemsApi } from '@/lib/api/visionBoardApi';
import { toast } from '@/components/ui/sonner';

const VISION_DREAM_ID_PREFIX = 'vision-item-';
const VISION_SYNC_STORAGE_KEY = 'dc_vision_dream_tracker_state';

type VisionDreamMilestoneState = {
  completed: boolean;
  completedAt?: string;
};

type VisionDreamState = Record<string, Record<string, VisionDreamMilestoneState>>;

const VISION_MILESTONE_TEMPLATE: DreamMilestone[] = [
  { id: 'added-to-board', title: 'Added to Vision Board', completed: true },
  { id: 'define-action-plan', title: 'Define action plan', completed: false },
  { id: 'complete-first-step', title: 'Complete first step', completed: false },
];

const loadVisionDreamState = (): VisionDreamState => {
  try {
    const raw = localStorage.getItem(VISION_SYNC_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed as VisionDreamState : {};
  } catch {
    return {};
  }
};

const saveVisionDreamState = (state: VisionDreamState) => {
  localStorage.setItem(VISION_SYNC_STORAGE_KEY, JSON.stringify(state));
};

const normalizeSignature = (value: string): string => value.trim().toLowerCase();

const computeProgress = (milestones: DreamMilestone[]) => {
  if (milestones.length === 0) {
    return 0;
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  return Math.round((completedCount / milestones.length) * 100);
};

const applyVisionMilestoneState = (
  template: DreamMilestone[],
  stored: Record<string, VisionDreamMilestoneState> | undefined
): DreamMilestone[] => {
  return template.map((milestone) => {
    const saved = stored?.[milestone.id];
    if (!saved) {
      return milestone;
    }

    return {
      ...milestone,
      completed: saved.completed,
      completedAt: saved.completedAt,
    };
  });
};

const toVisionDream = (
  item: VisionBoardItem,
  index: number,
  storedState: VisionDreamState
): Dream => {
  const fallbackTitle = `${item.category || 'Vision'} Dream ${index + 1}`;
  const milestones = applyVisionMilestoneState(
    VISION_MILESTONE_TEMPLATE,
    storedState[item.id]
  );

  return {
    id: `${VISION_DREAM_ID_PREFIX}${item.id}`,
    title: fallbackTitle,
    category: item.category || 'vision',
    progress: computeProgress(milestones),
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    milestones,
    image: item.content,
  };
};

const isVisionSyncedDream = (dreamId: string) => dreamId.startsWith(VISION_DREAM_ID_PREFIX);

const extractVisionItemId = (dreamId: string) => dreamId.replace(VISION_DREAM_ID_PREFIX, '');

export default function DashboardDreamTrackerPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMilestoneText, setNewMilestoneText] = useState<Record<string, string>>({});

  const loadDreams = async () => {
    try {
      setLoading(true);
      setError('');
      const [dreamsData, visionItemsData] = await Promise.all([
        getDreamsApi(),
        getVisionBoardItemsApi(),
      ]);

      const storedState = loadVisionDreamState();
      const visionImageItems = visionItemsData.filter((item) => item.type === 'image');
      const existingDreamSignatures = new Set(
        dreamsData
          .map((dream) => dream.image)
          .filter((image): image is string => Boolean(image))
          .map((image) => normalizeSignature(image))
      );

      const syncedVisionDreams = visionImageItems
        .filter((item) => !existingDreamSignatures.has(normalizeSignature(item.content)))
        .map((item, index) => toVisionDream(item, index, storedState));

      // merge extras from local storage (user-added milestones)
      const extrasRaw = localStorage.getItem('dc_dream_extras');
      let extras: Record<string, DreamMilestone[]> = {};
      try {
        extras = extrasRaw ? JSON.parse(extrasRaw) : {};
      } catch {
        extras = {};
      }

      const merged = [...dreamsData, ...syncedVisionDreams].map((d) => {
        const extra = extras[d.id];
        if (!extra || extra.length === 0) return d;
        const mergedMilestones = [...d.milestones, ...extra];
        return { ...d, milestones: mergedMilestones, progress: computeProgress(mergedMilestones) };
      });

      setDreams(merged);
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

    if (isVisionSyncedDream(dreamId)) {
      const itemId = extractVisionItemId(dreamId);
      const updatedDream = dreams
        .map((dream) => {
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

          return {
            ...dream,
            milestones: updatedMilestones,
            progress: computeProgress(updatedMilestones),
          };
        })
        .find((dream) => dream.id === dreamId);

      if (updatedDream) {
        const currentState = loadVisionDreamState();
        currentState[itemId] = updatedDream.milestones.reduce<Record<string, VisionDreamMilestoneState>>((accumulator, milestone) => {
          accumulator[milestone.id] = {
            completed: milestone.completed,
            completedAt: milestone.completedAt,
          };
          return accumulator;
        }, {});
        saveVisionDreamState(currentState);
      }

      toast.success('Vision dream milestone updated');
      return;
    }

    try {
      const updated = await toggleDreamMilestoneApi(dreamId, milestoneId);
      setDreams((prev) => prev.map((d) => (d.id === dreamId ? updated : d)));
      toast.success('Milestone updated');
    } catch {
      setDreams((prev) => prev.map((dream) => (dream.id === dreamId ? previousDream : dream)));
      toast.error('Failed to update milestone');
    }
  };

  const saveExtraMilestones = (state: Record<string, DreamMilestone[]>) => {
    try {
      localStorage.setItem('dc_dream_extras', JSON.stringify(state));
    } catch {}
  };

  const addMilestone = (dreamId: string) => {
    const text = (newMilestoneText[dreamId] || '').trim();
    if (!text) return;

    const newMs: DreamMilestone = { id: `ms-${Date.now()}`, title: text, completed: false };

    setDreams((prev) => {
      const next = prev.map((d) => (d.id === dreamId ? { ...d, milestones: [...d.milestones, newMs], progress: computeProgress([...d.milestones, newMs]) } : d));
      // persist extras separately
      const extrasRaw = localStorage.getItem('dc_dream_extras');
      let extras: Record<string, DreamMilestone[]> = {};
      try {
        extras = extrasRaw ? JSON.parse(extrasRaw) : {};
      } catch {
        extras = {};
      }

      extras[dreamId] = [...(extras[dreamId] || []), newMs];
      saveExtraMilestones(extras);

      return next;
    });

    setNewMilestoneText((prev) => ({ ...prev, [dreamId]: '' }));
    toast.success('Milestone added');
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
                  <div className="mt-3 flex gap-2">
                    <input value={newMilestoneText[dream.id] || ''} onChange={(e) => setNewMilestoneText(prev => ({ ...prev, [dream.id]: e.target.value }))} placeholder="Add checklist item..." className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-background focus:outline-none" />
                    <button onClick={() => addMilestone(dream.id)} className="btn-primary text-sm px-3 py-2">Add</button>
                  </div>
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
