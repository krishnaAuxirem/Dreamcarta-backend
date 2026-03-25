import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Star, ArrowRight, Play, CheckCircle2, Sparkles,
  Target, TrendingUp, Flame, Bot, Bell, Sun, Users, LayoutTemplate,
  Activity
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FEATURES, MOTIVATIONAL_QUOTES, TESTIMONIALS, PRICING_PLANS } from '@/constants';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';

const HERO_SLIDES = [
  {
    image: hero1,
    headline: 'Design Your',
    highlight: 'Dream Life',
    sub: 'The most powerful life blueprint platform to turn your biggest dreams into reality with vision boards, goals, and AI coaching.',
  },
  {
    image: hero2,
    headline: 'Visualize Your',
    highlight: 'Future Now',
    sub: 'Create stunning vision boards with your dreams. Every image, every goal, every aspiration — all in one beautiful space.',
  },
  {
    image: hero3,
    headline: 'Achieve the',
    highlight: 'Impossible',
    sub: 'Break down your biggest goals into actionable steps, track your progress, and celebrate every milestone.',
  },
];

const STATS = [
  { value: '2.5M+', label: 'Dreamers Worldwide' },
  { value: '18M+', label: 'Goals Achieved' },
  { value: '4.9', label: 'Average Rating' },
  { value: '89%', label: 'Success Rate' },
];

const FAQ_ITEMS = [
  {
    q: 'What is DreamCarta?',
    a: 'DreamCarta is a personal life blueprint platform that helps you define, visualize, and achieve your life goals through vision boards, goal tracking, habit building, and AI-powered coaching.',
  },
  {
    q: 'Is there a free plan available?',
    a: 'Yes! Our Starter plan is completely free and includes 3 vision boards, 5 active goals, and 3 habit trackers. You can upgrade anytime to unlock unlimited features.',
  },
  {
    q: 'How does the AI Coach work?',
    a: 'Our AI Coach analyzes your goals and habits to provide personalized guidance, action plans, and motivational support. It learns from your progress and adapts its advice to help you stay on track.',
  },
  {
    q: 'Can I access DreamCarta on mobile?',
    a: 'Yes, DreamCarta is fully responsive and works beautifully on all devices. We also have dedicated mobile apps coming soon for iOS and Android.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use enterprise-grade encryption and follow strict data privacy standards. Your personal goals and dreams are completely private and secure.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel your subscription at any time with no questions asked. Your data will remain accessible on the free plan.',
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div key={i} className="hero-slide" style={{ opacity: i === current ? 1 : 0 }}>
          <img src={slide.image} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-40 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Trusted by 2.5M+ dreamers worldwide
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                {HERO_SLIDES[current].headline}
                <br />
                <span className="text-gradient-gold">{HERO_SLIDES[current].highlight}</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                {HERO_SLIDES[current].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register" className="btn-gold flex items-center justify-center gap-2 text-base">
              Start Free Today <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/25 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              <Play className="w-4 h-4" /> Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {[
                '1535713875002-d1d0cf377fde',
                '1438761681033-6461ffad8d80',
                '1507003211169-0a1dd7228f2d',
                '1580489944761-15a19d654956',
              ].map((id, i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/photo-${id}?w=40&h=40&fit=crop`}
                  alt="user"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-white text-sm">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                <span className="ml-1 font-semibold">4.9/5</span>
              </div>
              <p className="text-white/70 text-xs">from 50,000+ reviews</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-amber-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-1 text-white/60"
      >
        <span className="text-xs">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section ref={ref} className="py-16 bg-gradient-to-r from-primary via-accent to-primary/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="font-display text-4xl md:text-5xl font-bold mb-1">{s.value}</div>
              <div className="text-white/80 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const iconMap: Record<string, React.ReactNode> = {
    'target': <Target className="w-6 h-6 text-white" />,
    'layout-template': <LayoutTemplate className="w-6 h-6 text-white" />,
    'flame': <Flame className="w-6 h-6 text-white" />,
    'bot': <Bot className="w-6 h-6 text-white" />,
    'trending-up': <TrendingUp className="w-6 h-6 text-white" />,
    'sun': <Sun className="w-6 h-6 text-white" />,
    'users': <Users className="w-6 h-6 text-white" />,
    'bell': <Bell className="w-6 h-6 text-white" />,
  };

  return (
    <section id="features" ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Everything You Need</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
            Your Complete <span className="text-gradient">Dream System</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            DreamCarta combines the best tools for goal-setting, visualization, habit building, and AI coaching into one beautiful platform.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group p-6 bg-card rounded-2xl border border-border card-hover cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {iconMap[f.icon]}
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionBoardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const images = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=200&fit=crop',
  ];

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Vision Board</span>
            <h2 className="font-display text-4xl font-bold mt-2 mb-4">
              See It. Feel It. <span className="text-gradient">Achieve It.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Create stunning visual boards with your dreams. Upload your own images or browse thousands of curated visuals organized by your life goals — career, travel, health, and more.
            </p>
            <ul className="space-y-3 mb-8">
              {['Drag-and-drop interface', 'Unlimited image uploads', 'Text affirmations & quotes', 'Organized by life categories', 'Share with your community'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/vision-board" className="btn-primary inline-flex items-center gap-2">
              Create Your Board <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            className="grid grid-cols-3 gap-3"
          >
            {images.map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="rounded-xl overflow-hidden shadow-card aspect-[4/3]"
              >
                <img src={src} alt="vision" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function GoalTrackingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const goals = [
    { title: 'Launch My Startup', progress: 35, category: 'Career', color: 'bg-purple-500', days: 245 },
    { title: 'Financial Freedom', progress: 20, category: 'Finance', color: 'bg-green-500', days: 730 },
    { title: 'Run Half Marathon', progress: 60, category: 'Health', color: 'bg-blue-500', days: 45 },
    { title: 'Travel to Japan', progress: 80, category: 'Travel', color: 'bg-pink-500', days: 15 },
  ];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="bg-card rounded-2xl border border-border p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg">My Active Goals</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">4 Active</span>
            </div>
            <div className="space-y-5">
              {goals.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{g.title}</p>
                      <p className="text-xs text-muted-foreground">{g.category} · {g.days} days left</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{g.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${g.progress}%` } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${g.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Goal Setting</span>
            <h2 className="font-display text-4xl font-bold mt-2 mb-4">
              Set Goals That <span className="text-gradient">Actually Stick</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Break down your biggest dreams into structured, actionable goals with deadlines, steps, and real-time progress tracking.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { Icon: Target, label: 'SMART Goals', desc: 'Structured goal framework' },
                { Icon: TrendingUp, label: 'Progress Tracking', desc: 'Visual progress bars' },
                { Icon: Bell, label: 'Deadline Manager', desc: 'Never miss a milestone' },
                { Icon: CheckCircle2, label: 'Action Steps', desc: 'Break into small tasks' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-xl">
                  <item.Icon className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/goals" className="btn-primary inline-flex items-center gap-2">
              Set Your Goals <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HabitSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const habits = [
    { name: 'Meditation', streak: 21, days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], done: [true, true, true, true, true, true, false] },
    { name: 'Read 20 Pages', streak: 14, days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], done: [true, true, true, true, true, false, false] },
    { name: 'Exercise', streak: 7, days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], done: [true, true, true, true, false, false, false] },
    { name: 'Learn Code', streak: 30, days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], done: [true, true, true, true, true, true, true] },
  ];

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Habit Builder</span>
            <h2 className="font-display text-4xl font-bold mt-2 mb-4">
              Build Habits That <span className="text-gradient">Transform You</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Small consistent actions create massive results. Track your habits daily, maintain winning streaks, and build the lifestyle that drives your goals.
            </p>
            <ul className="space-y-3 mb-8">
              {['Daily streak tracking', 'Habit reminders & notifications', 'Weekly & monthly analytics', 'Habit library with 100+ templates', 'Link habits to goals'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/habits" className="btn-primary inline-flex items-center gap-2">
              Build Habits <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="space-y-4">
            {habits.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{h.name}</p>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Flame className="w-3 h-3" /> {h.streak} days
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {h.days.map((d, j) => (
                      <div key={j} className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium ${h.done[j] ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>{d}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AICoachSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const messages = [
    { role: 'user', text: 'How do I achieve financial freedom in 5 years?' },
    { role: 'ai', text: 'Great goal! Here is your personalized 5-year plan: 1) Build emergency fund, 2) Invest 30% of income in SIPs, 3) Develop a side income stream, 4) Upskill for higher salary, 5) Automate investments. Want me to break down each step further?' },
    { role: 'user', text: 'Yes! Tell me more about building side income.' },
    { role: 'ai', text: 'Based on your profile as a software engineer, here are your best options: Freelancing, creating digital courses, building a SaaS product, or technical writing. I recommend starting with freelancing — quickest path to results!' },
  ];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
          >
            <div className="p-4 bg-gradient-to-r from-primary to-accent flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">DreamCarta AI Coach</p>
                <p className="text-white/70 text-xs">Always here to guide you</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/70 text-xs">Online</span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input placeholder="Ask your AI coach anything..." className="flex-1 text-sm bg-muted px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              <button className="btn-primary text-sm px-4 py-2">Send</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">AI Dream Coach</span>
            <h2 className="font-display text-4xl font-bold mt-2 mb-4">
              Your Personal <span className="text-gradient">AI Life Coach</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Get personalized guidance 24/7. Our AI coach understands your goals, tracks your progress, and provides actionable advice tailored to your unique journey.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['Goal Planning', 'Habit Coaching', 'Financial Advice', 'Career Guidance', 'Mindset Shifts', 'Daily Check-ins'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Try AI Coach Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function QuotesSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="text-5xl mb-6 text-amber-400 font-serif leading-none">&ldquo;</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-display text-2xl md:text-4xl text-white font-medium mb-6 leading-relaxed">
              {MOTIVATIONAL_QUOTES[current].quote}
            </p>
            <p className="text-white/60 text-lg">— {MOTIVATIONAL_QUOTES[current].author}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-8">
          {MOTIVATIONAL_QUOTES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`transition-all rounded-full ${i === current ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Success Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
            Real Dreams, <span className="text-gradient">Real Results</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Join thousands who have transformed their lives with DreamCarta.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 card-hover"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.profession}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t.achievement}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Community</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
            You Are Not <span className="text-gradient">Alone</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">Join a thriving community of dreamers, goal-setters, and achievers from across India and the world.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&h=300&fit=crop',
          ].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden aspect-square"
            >
              <img src={src} alt="community" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
        <Link to="/community" className="btn-primary inline-flex items-center gap-2">
          Join the Community <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
            Invest in Your <span className="text-gradient">Dreams</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Start free, upgrade when you need more. No hidden fees, cancel anytime.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 ${plan.highlighted ? 'bg-primary text-white border-primary shadow-glow scale-105' : 'bg-card border-border'}`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.highlighted ? 'bg-amber-400 text-amber-900' : 'bg-primary text-white'}`}>
                  {plan.badge}
                </span>
              )}
              <h3 className={`font-bold text-lg mb-1 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                {plan.price === 0 ? (
                  <span className={`text-3xl font-display font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>Free</span>
                ) : (
                  <>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>₹</span>
                    <span className={`text-3xl font-display font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>/mo</span>
                  </>
                )}
              </div>
              <p className={`text-xs mb-5 ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.description}</p>
              <Link to="/register" className={`block text-center py-2.5 rounded-lg text-sm font-semibold mb-5 transition-all ${plan.highlighted ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90'}`}>
                {plan.price === 0 ? 'Get Started Free' : 'Start Plan'}
              </Link>
              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-xs ${plan.highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.highlighted ? 'text-white' : 'text-green-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/pricing" className="text-primary hover:underline text-sm font-medium">
            View full comparison →
          </Link>
        </div>
      </div>
    </section>
  );
}

function AppPreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding gradient-hero relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">App Preview</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4 text-white">
              Your Dreams In Your <span className="text-gradient-gold">Pocket</span>
            </h2>
            <p className="text-white/70 text-lg mb-8">Access your vision board, goals, and AI coach anytime, anywhere. Mobile apps for iOS and Android coming soon.</p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-white/60">Coming to</div>
                  <div className="font-semibold text-sm">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-white/60">Coming to</div>
                  <div className="font-semibold text-sm">Google Play</div>
                </div>
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="relative h-80 flex items-center justify-center">
            <div className="w-48 bg-card rounded-[32px] border-4 border-white/30 shadow-2xl overflow-hidden float-anim">
              <div className="h-6 bg-muted flex items-center justify-center">
                <div className="w-16 h-1.5 bg-foreground/20 rounded-full" />
              </div>
              <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=350&fit=crop" alt="app" className="w-full h-56 object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="font-display text-4xl font-bold mt-2 mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
        </motion.div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-sm pr-4">{item.q}</span>
                <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          className="bg-gradient-to-br from-primary via-accent to-primary/80 rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Map Your Dreams?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 2.5 million dreamers who are using DreamCarta to design and live their best lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-gold flex items-center justify-center gap-2">
                Start Free Today <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/15 border border-white/25 text-white rounded-lg font-semibold hover:bg-white/25 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-4">No credit card required — Free forever plan available</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <VisionBoardPreview />
      <GoalTrackingSection />
      <HabitSection />
      <AICoachSection />
      <QuotesSlider />
      <TestimonialsSection />
      <CommunityPreview />
      <PricingSection />
      <AppPreviewSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
