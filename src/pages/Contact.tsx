import { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Instagram, Linkedin, Twitter, Github } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:text-pink-500 hover:border-pink-500' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:text-blue-500 hover:border-blue-500' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://twitter.com', color: 'hover:text-sky-400 hover:border-sky-400' },
  { icon: Github, label: 'GitHub', href: 'https://github.com', color: 'hover:text-foreground hover:border-foreground' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@dreamcarta.app', color: 'hover:text-primary hover:border-primary' },
];

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((previous) => ({
        ...previous,
        name: previous.name || user.name || '',
        email: previous.email || user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/contact`, form);
      alert('Message sent successfully ✅');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      alert('Failed to send ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-12 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-white/70 text-xl">Have a question? We would love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-3xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              {user && (
                <p className="text-xs text-muted-foreground">
                  Signed in as {user.name}. This message will be visible in admin contact inbox.
                </p>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  <option value="">Select a subject</option>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing & Pricing</option>
                  <option>Feature Request</option>
                  <option>Partnership</option>
                  <option>Press & Media</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help..." rows={5} required className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Address', value: '12th Floor, Prestige Tower\nBannerghatta Road, Bengaluru\nKarnataka 560076, India' },
                  { icon: Phone, label: 'Phone', value: '+91 80 4567 8900' },
                  { icon: Mail, label: 'Email', value: 'hello@dreamcarta.app' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                      <p className="text-sm whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 border border-border rounded-xl text-muted-foreground transition-all ${color}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-border h-48 bg-muted relative">
              <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=300&fit=crop" alt="map" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card border border-border rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> DreamCarta HQ, Bengaluru</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
