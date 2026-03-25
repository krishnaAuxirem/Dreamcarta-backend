import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', priority: 'medium', type: 'General', subject: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', priority: 'medium', type: 'General', subject: '', description: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-8 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold text-white mb-3">Support Center</h1>
          <p className="text-white/70">We are here to help you every step of the way</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { iconName: 'zap', title: 'Live Chat', desc: 'Chat with our team in real-time', time: 'Available 9AM - 9PM IST', action: 'Start Chat' },
              { iconName: 'mail', title: 'Email Support', desc: 'Detailed help via email', time: 'Response within 24 hours', action: 'Send Email' },
              { iconName: 'book', title: 'Help Center', desc: 'Browse articles and guides', time: 'Available 24/7', action: 'Browse Articles' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"><MessageSquare className="w-5 h-5 text-primary" /></div>
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">{s.desc}</p>
                <p className="text-xs text-green-500 mb-4">{s.time}</p>
                <button onClick={() => s.title === 'Email Support' ? window.open('mailto:support@dreamcarta.app') : alert(`${s.title} coming soon!`)} className="w-full btn-primary text-sm py-2">{s.action}</button>
              </motion.div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Submit a Support Ticket</h2>
            </div>
            {submitted && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 rounded-xl text-sm">
                Ticket submitted! Your ticket ID is #{Math.floor(Math.random() * 90000) + 10000}. We will respond within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Issue Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    {['General', 'Technical', 'Billing', 'Feature Request', 'Bug Report'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} placeholder="Please describe your issue in detail..." className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-3">
                <Send className="w-4 h-4" /> Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
