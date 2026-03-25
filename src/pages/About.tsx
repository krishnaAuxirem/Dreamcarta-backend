import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Heart, Globe, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TEAM = [
  { name: 'Aryan Gupta', role: 'CEO & Co-founder', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', desc: 'Ex-Google, IIT Bombay alum passionate about personal development.' },
  { name: 'Priya Kapoor', role: 'CTO & Co-founder', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', desc: 'Full-stack engineer with 10+ years building consumer products.' },
  { name: 'Rahul Sharma', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', desc: 'Product designer who believes design can change lives.' },
  { name: 'Ananya Patel', role: 'Head of AI', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop', desc: 'AI researcher specializing in behavioral psychology and NLP.' },
];

const VALUES = [
  { icon: Heart, title: 'Dream Big', desc: 'We believe everyone deserves to live their biggest, most authentic life.' },
  { icon: CheckCircle2, title: 'Take Action', desc: 'Dreams only become reality through consistent, purposeful action.' },
  { icon: Globe, title: 'Stay Connected', desc: 'We grow faster together. Community is at the heart of everything we build.' },
  { icon: Award, title: 'Celebrate Progress', desc: 'Every milestone, however small, deserves recognition and celebration.' },
  { icon: Sparkles, title: 'Stay Curious', desc: 'We constantly explore new ways to help you grow and achieve more.' },
  { icon: CheckCircle2, title: 'Trust the Process', desc: 'Transformation takes time. We are with you every step of the journey.' },
];

const MILESTONES = [
  { year: '2022', event: 'DreamCarta founded in Bangalore with a simple vision: make personal growth accessible to everyone.' },
  { year: '2023', event: 'Launched beta with 10,000 early users. Raised ₹5Cr seed funding.' },
  { year: '2024', event: 'Reached 500,000 users. Launched AI Coach feature. Expanded to 12 countries.' },
  { year: '2025', event: 'Crossed 2.5 million users worldwide. Launched community features and mentor marketplace.' },
  { year: '2026', event: 'Vision: 10 million dreamers achieving their goals with DreamCarta.' },
];

export default function AboutPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const inView1 = useInView(ref1, { once: true });
  const inView2 = useInView(ref2, { once: true });
  const inView3 = useInView(ref3, { once: true });

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Our Story</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-3 mb-6">
              We Believe in Your <span className="text-gradient">Unlimited Potential</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto mb-8">
              DreamCarta was born from a simple belief: everyone has the potential to achieve extraordinary things — they just need the right system, support, and community.
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Join Our Mission <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=450&fit=crop" alt="mission" className="rounded-2xl shadow-2xl w-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Our Mission</span>
            <h2 className="font-display text-4xl font-bold mt-2 mb-4">
              A Map For Every <span className="text-gradient">Dream</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
              The name "Carta" means map in Latin. We see DreamCarta as a map — your personal life blueprint — that guides you from where you are today to where you dream of being tomorrow.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We combine the proven science of goal-setting, the emotional power of visualization, the consistency of habit building, and the intelligence of AI to create the most comprehensive personal achievement platform available.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[['2.5M+', 'Users'], ['18M+', 'Goals Set'], ['89%', 'Success Rate']].map(([val, lab]) => (
                <div key={lab} className="text-center p-4 bg-card rounded-xl border border-border">
                  <div className="font-display text-2xl font-bold text-primary">{val}</div>
                  <div className="text-xs text-muted-foreground mt-1">{lab}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={ref1} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView1 ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold">Our Core <span className="text-gradient">Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="p-6 bg-card border border-border rounded-2xl card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={ref2} className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView2 ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold">Our <span className="text-gradient">Journey</span></h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView2 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 relative"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 z-10">{m.year}</div>
                  <div className="flex-1 bg-card border border-border rounded-xl p-4">
                    <p className="text-sm leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={ref3} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView3 ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold">Meet the <span className="text-gradient">Team</span></h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">A passionate team of dreamers, builders, and believers committed to making your growth journey extraordinary.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-32 h-32 rounded-2xl mx-auto mb-4 overflow-hidden ring-4 ring-transparent group-hover:ring-primary/30 transition-all">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 gradient-hero">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/70 text-lg mb-8">Join 2.5M+ dreamers who are building their best lives with DreamCarta.</p>
          <Link to="/register" className="btn-gold inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
