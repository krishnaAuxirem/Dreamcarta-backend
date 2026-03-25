import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  const terms = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using DreamCarta, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.' },
    { title: '2. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.' },
    { title: '3. Acceptable Use', content: 'You agree not to use DreamCarta for any unlawful purpose or in any way that could harm, disable, overburden, or impair our platform. You may not attempt to gain unauthorized access to any part of the platform.' },
    { title: '4. Content', content: 'You retain ownership of content you create on DreamCarta. By posting content, you grant us a non-exclusive license to use, display, and distribute that content in connection with our services.' },
    { title: '5. Subscription and Payments', content: 'Premium subscriptions are billed monthly or annually. All payments are processed securely. Refunds are available within 7 days of initial purchase. Cancelled subscriptions retain access until the end of the billing period.' },
    { title: '6. Limitation of Liability', content: 'DreamCarta is not liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use our platform. Our total liability shall not exceed the amount paid by you in the past 12 months.' },
    { title: '7. Termination', content: 'We reserve the right to terminate or suspend your account at any time for violation of these terms. Upon termination, your right to use the platform will cease immediately.' },
    { title: '8. Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Bengaluru, Karnataka, India.' },
  ];

  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-8 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-white/70">Last updated: March 25, 2026</p>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-5">
            {terms.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-xl font-bold mb-3">{t.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.content}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Questions? Contact <a href="mailto:legal@dreamcarta.app" className="text-primary hover:underline">legal@dreamcarta.app</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
