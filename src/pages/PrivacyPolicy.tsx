import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, build a vision board, set goals, or communicate with us. This includes: name, email address, profile information, goal and habit data, vision board content, chat messages with AI coach, and payment information (processed securely by our payment provider).' },
    { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, respond to your comments and questions, send you marketing communications (with your consent), and monitor and analyze trends and usage.' },
    { title: '3. Data Storage and Security', content: 'Your data is stored on secure servers with enterprise-grade encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is stored in India-based servers compliant with applicable data protection regulations.' },
    { title: '4. Data Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.' },
    { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal information. You can update your account information at any time through your profile settings. To request deletion of your data, contact us at privacy@dreamcarta.app. We will respond within 30 days.' },
    { title: '6. Cookies', content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.' },
    { title: '7. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and sending you an email notification.' },
  ];

  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-8 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70">Last updated: March 25, 2026</p>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <p className="text-muted-foreground leading-relaxed">At DreamCarta, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.</p>
          </div>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-xl font-bold mb-3">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <p className="text-sm text-muted-foreground">Questions about our Privacy Policy? Contact us at <a href="mailto:privacy@dreamcarta.app" className="text-primary hover:underline">privacy@dreamcarta.app</a></p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 
