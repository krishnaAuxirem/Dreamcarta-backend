import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Home, Heart, BookOpen, Calendar, Coffee, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const OPEN_ROLES = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', type: 'Full-time', location: 'Bangalore (Hybrid)', experience: '5+ years' },
  { title: 'AI/ML Engineer', dept: 'Engineering', type: 'Full-time', location: 'Remote', experience: '3+ years' },
  { title: 'Product Designer (UX/UI)', dept: 'Design', type: 'Full-time', location: 'Bangalore (Hybrid)', experience: '4+ years' },
  { title: 'Growth Marketing Manager', dept: 'Marketing', type: 'Full-time', location: 'Bangalore', experience: '3+ years' },
  { title: 'Content Strategist', dept: 'Content', type: 'Full-time', location: 'Remote', experience: '2+ years' },
  { title: 'Customer Success Manager', dept: 'Operations', type: 'Full-time', location: 'Bangalore', experience: '2+ years' },
];

const PERKS = [
  { Icon: DollarSign, title: 'Competitive Salary', desc: 'Top-of-market compensation with equity' },
  { Icon: Home, title: 'Remote Flexible', desc: 'Work from home or our Bangalore office' },
  { Icon: Heart, title: 'Health Insurance', desc: 'Full family medical coverage' },
  { Icon: BookOpen, title: 'Learning Budget', desc: '₹50,000/year for courses and books' },
  { Icon: Calendar, title: 'Unlimited PTO', desc: 'Take the time you need to recharge' },
  { Icon: Coffee, title: 'Team Events', desc: 'Monthly team dinners and quarterly retreats' },
];

export default function CareersPage() {
  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-12 px-4 gradient-hero relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Join Our Team</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
              Build Dreams,<br />Change Lives
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">Join a passionate team helping 2.5 million people achieve their biggest dreams.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Culture */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-4xl font-bold mb-4">Why DreamCarta?</h2>
              <p className="text-muted-foreground text-lg mb-4 leading-relaxed">We are not just building a product — we are building a movement. Every line of code, every design decision, every support conversation has a direct impact on someone's life journey.</p>
              <p className="text-muted-foreground leading-relaxed">If you are passionate about personal growth, love building products that genuinely help people, and want to be part of a team that moves fast and dreams big, you belong here.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" alt="team" className="rounded-2xl shadow-xl w-full object-cover" />
            </motion.div>
          </div>

          {/* Perks */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-center mb-8">Benefits & Perks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PERKS.map((perk, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-border rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><perk.Icon className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-bold mb-1">{perk.title}</h3>
                  <p className="text-muted-foreground text-sm">{perk.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Open roles */}
          <div>
            <h2 className="font-display text-3xl font-bold text-center mb-8">Open Positions</h2>
            <div className="space-y-3">
              {OPEN_ROLES.map((role, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">{role.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{role.dept}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{role.type}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {role.location}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{role.experience}</span>
                      </div>
                    </div>
                    <button onClick={() => alert(`Apply for ${role.title}\n\nPlease send your resume to careers@dreamcarta.app with subject: "${role.title} Application"`)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5 shrink-0">
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Don't see a role that fits? We are always looking for exceptional people.</p>
              <a href="mailto:careers@dreamcarta.app" className="btn-outline inline-flex items-center gap-2">
                Send us your Resume <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
