import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Heart, Share2, Sparkles, Trophy, BookOpen, Star, Sun } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { MOTIVATIONAL_QUOTES } from '@/constants';

const AFFIRMATIONS = [
  'I am worthy of all my biggest dreams and desires.',
  'Success flows to me naturally and effortlessly.',
  'I attract amazing opportunities every single day.',
  'I have the power to create the life I want.',
  'Every day I am getting closer to my goals.',
  'I am grateful for my journey and all that is coming.',
  'My potential is limitless and my future is bright.',
  'I choose growth, abundance, and joy today.',
];

const MORNING_PROMPTS = [
  { q: 'What is the ONE thing I will accomplish today?', placeholder: 'Write your top priority...' },
  { q: 'What am I grateful for this morning?', placeholder: 'List 3 things you appreciate...' },
  { q: 'How do I want to feel at the end of today?', placeholder: 'Describe your ideal feeling...' },
  { q: 'What belief might hold me back today, and how will I overcome it?', placeholder: 'Identify and reframe...' },
];

export default function DashboardMotivationPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [affirmIndex, setAffirmIndex] = useState(0);
  const [journalAnswers, setJournalAnswers] = useState<string[]>(MORNING_PROMPTS.map(() => ''));
  const [liked, setLiked] = useState(false);

  const nextQuote = () => setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  const nextAffirm = () => setAffirmIndex((prev) => (prev + 1) % AFFIRMATIONS.length);

  return (
    <DashboardLayout title="Daily Motivation">
      <div className="space-y-6">
        {/* Quote of the day */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-hero rounded-2xl p-8 relative overflow-hidden">
          <div className="relative z-10 text-center">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">Quote of the Day</p>
            <AnimatePresence mode="wait">
              <motion.div key={quoteIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-5xl text-amber-400 mb-4 font-serif leading-none">&ldquo;</div>
                <p className="font-display text-2xl md:text-3xl text-white font-medium mb-4 leading-relaxed">
                  {MOTIVATIONAL_QUOTES[quoteIndex].quote}
                </p>
                <p className="text-white/60">— {MOTIVATIONAL_QUOTES[quoteIndex].author}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
                <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} /> {liked ? 'Liked!' : 'Like'}
              </button>
              <button onClick={() => navigator.share?.({ text: MOTIVATIONAL_QUOTES[quoteIndex].quote })} className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button onClick={nextQuote} className="flex items-center gap-2 px-4 py-2 bg-amber-400/20 border border-amber-400/30 text-amber-400 rounded-lg hover:bg-amber-400/30 transition-all">
                <RefreshCw className="w-4 h-4" /> New Quote
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Daily Affirmation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Daily Affirmation
              </h3>
              <button onClick={nextAffirm} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={affirmIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="bg-primary/10 rounded-xl p-5 text-center">
                  <p className="font-display text-lg font-medium text-primary leading-relaxed">{AFFIRMATIONS[affirmIndex]}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="text-xs text-muted-foreground text-center mt-3">Repeat this 3 times with feeling</p>
            <div className="flex justify-center gap-1 mt-3">
              {AFFIRMATIONS.map((_, i) => (
                <button key={i} onClick={() => setAffirmIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === affirmIndex ? 'bg-primary w-4' : 'bg-muted-foreground/30'}`} />
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Your Achievements
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Quotes Read', value: '142', Icon: BookOpen },
                { label: 'Affirmations Done', value: '87', Icon: Sparkles },
                { label: 'Journal Entries', value: '34', Icon: Sun },
                { label: 'Motivation Score', value: '9.2/10', Icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <stat.Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground flex-1">{stat.label}</span>
                  <span className="font-bold text-primary text-sm">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Morning Journal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-5 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" /> Morning Journal
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            {MORNING_PROMPTS.map((prompt, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-2">{prompt.q}</label>
                <textarea
                  value={journalAnswers[i]}
                  onChange={(e) => {
                    const updated = [...journalAnswers];
                    updated[i] = e.target.value;
                    setJournalAnswers(updated);
                  }}
                  placeholder={prompt.placeholder}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                />
              </div>
            ))}
          </div>
          <button onClick={() => alert('Journal saved! Keep up the amazing work!')} className="mt-4 btn-primary text-sm px-6 py-2.5">
            Save Journal Entry
          </button>
        </motion.div>

        {/* All quotes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Quote Library
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {MOTIVATIONAL_QUOTES.map((q, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <p className="text-sm italic text-foreground mb-2">"{q.quote}"</p>
                <p className="text-xs text-muted-foreground">— {q.author}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
