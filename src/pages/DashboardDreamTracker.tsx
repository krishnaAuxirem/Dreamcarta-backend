import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_DREAMS } from '@/constants';
import { Dream } from '@/types';
import { getProgressColor } from '@/lib/utils';

export default function DashboardDreamTrackerPage() {
  const [dreams, setDreams] = useState<Dream[]>(DEMO_DREAMS);

  const toggleMilestone = (dreamId: string, milestoneId: string) => {
    setDreams(dreams.map(d => {
      if (d.id !== dreamId) return d;
      const updatedMilestones = d.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString().split('T')[0] : undefined } : m
      );
      const progress = Math.round((updatedMilestones.filter(m => m.completed).length / updatedMilestones.length) * 100);
      return { ...d, milestones: updatedMilestones, progress };
    }));
  };

  return (
    <DashboardLayout title="Dream Tracker">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Dreams', value: dreams.length },
            { label: 'Milestones Done', value: dreams.reduce((a, d) => a + d.milestones.filter(m => m.completed).length, 0) },
            { label: 'Avg Progress', value: `${Math.round(dreams.reduce((a, d) => a + d.progress, 0) / dreams.length)}%` },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dreams */}
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
                    <button key={m.id} onClick={() => toggleMilestone(dream.id, m.id)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left">
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
      </div>
    </DashboardLayout>
  );
}
