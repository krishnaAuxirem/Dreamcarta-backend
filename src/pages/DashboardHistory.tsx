import { motion } from 'framer-motion';
import { Calendar, Target, Flame, Star, Activity, Users, Bot, Image, BookOpen, Rocket, Plane } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const HISTORY_ITEMS = [
  { date: '2025-03-24', type: 'habit', title: 'Completed Morning Meditation', desc: '21-day streak achieved!', Icon: Activity, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { date: '2025-03-23', type: 'goal', title: 'Updated Goal Progress', desc: 'Run Half Marathon — 60% complete', Icon: Target, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { date: '2025-03-22', type: 'dream', title: 'Milestone Completed', desc: 'Dream House: Improved Credit Score', Icon: Star, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { date: '2025-03-21', type: 'habit', title: 'Completed Exercise', desc: 'Week 7 of gym routine done', Icon: Activity, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { date: '2025-03-20', type: 'community', title: 'Posted in Community', desc: 'Shared fitness transformation update', Icon: Users, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { date: '2025-03-19', type: 'goal', title: 'New Goal Added', desc: 'Travel to Japan — ₹2L savings target', Icon: Plane, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { date: '2025-03-18', type: 'ai', title: 'AI Coach Session', desc: 'Discussed financial freedom strategy', Icon: Bot, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  { date: '2025-03-17', type: 'board', title: 'Vision Board Updated', desc: 'Added 3 new images to Career board', Icon: Image, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { date: '2025-03-16', type: 'habit', title: 'Completed Read 20 Pages', desc: '14-day reading streak!', Icon: BookOpen, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { date: '2025-03-15', type: 'goal', title: 'Goal Progress Updated', desc: 'Startup Launch — 35% complete', Icon: Rocket, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
];

const MONTHLY_STATS = [
  { label: 'Habits Completed', value: 127, icon: Flame, color: 'text-orange-500' },
  { label: 'Goals Updated', value: 18, icon: Target, color: 'text-primary' },
  { label: 'Streak Days', value: 21, icon: Star, color: 'text-amber-500' },
  { label: 'Active Days', value: 28, icon: Calendar, color: 'text-green-500' },
];

export default function DashboardHistoryPage() {
  return (
    <DashboardLayout title="Activity History">
      <div className="space-y-6">
        {/* Monthly stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MONTHLY_STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label} this month</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-5">Activity Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-5">
              {HISTORY_ITEMS.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex gap-5 relative"
                >
                  <div className="w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center z-10 shrink-0">
                    <item.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color}`}>{item.type}</span>
                        <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
