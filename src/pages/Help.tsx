import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Rocket, Image, Target, Bot, CreditCard, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const HELP_SECTIONS = [
  {
    category: 'Getting Started',
    Icon: Rocket,
    articles: [
      { title: 'How to create your account', views: 12453 },
      { title: 'Setting up your first vision board', views: 9821 },
      { title: 'Adding your first life goal', views: 8744 },
      { title: 'Understanding the dashboard', views: 7123 },
    ],
  },
  {
    category: 'Vision Board',
    Icon: Image,
    articles: [
      { title: 'How to create and customize vision boards', views: 6543 },
      { title: 'Adding images and affirmations', views: 5432 },
      { title: 'Organizing boards by categories', views: 4321 },
      { title: 'Sharing your vision board', views: 3210 },
    ],
  },
  {
    category: 'Goals & Habits',
    Icon: Target,
    articles: [
      { title: 'Setting SMART goals with DreamCarta', views: 8765 },
      { title: 'Tracking goal progress', views: 7654 },
      { title: 'Building a habit streak', views: 6543 },
      { title: 'Setting habit reminders', views: 5432 },
    ],
  },
  {
    category: 'AI Coach',
    Icon: Bot,
    articles: [
      { title: 'How the AI Coach works', views: 9876 },
      { title: 'Getting personalized goal plans', views: 7654 },
      { title: 'AI Coach usage limits by plan', views: 5432 },
      { title: 'Best prompts for AI coaching', views: 4321 },
    ],
  },
  {
    category: 'Billing & Plans',
    Icon: CreditCard,
    articles: [
      { title: 'Understanding our pricing plans', views: 11234 },
      { title: 'How to upgrade your plan', views: 8765 },
      { title: 'Cancelling your subscription', views: 6543 },
      { title: 'Refund policy', views: 5432 },
    ],
  },
  {
    category: 'Account & Security',
    Icon: Shield,
    articles: [
      { title: 'Resetting your password', views: 9876 },
      { title: 'Enabling two-factor authentication', views: 4321 },
      { title: 'Deleting your account', views: 3210 },
      { title: 'Privacy settings explained', views: 5432 },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-8 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold text-white mb-3">Help Center</h1>
          <p className="text-white/70 mb-6">Find answers to all your questions about DreamCarta</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search help articles..." className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HELP_SECTIONS.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><section.Icon className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-bold text-base">{section.category}</h3>
                </div>
                <ul className="space-y-2">
                  {section.articles.map((article, j) => (
                    <li key={j}>
                      <button onClick={() => alert(`Article: ${article.title}\n\nThis help article would contain detailed guidance on ${article.title.toLowerCase()}. Visit our full documentation for comprehensive guides.`)} className="w-full text-left flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                        <span>{article.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white text-center">
            <h2 className="font-display text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-white/80 mb-5">Our support team is available 24/7 to assist you</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:support@dreamcarta.app" className="px-6 py-2.5 bg-white text-primary rounded-lg font-semibold text-sm hover:bg-white/90 transition-all">Email Support</a>
              <a href="/support" className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-all">Live Chat</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
