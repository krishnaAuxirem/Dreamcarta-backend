import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Linkedin, Twitter, Github, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Vision Board', path: '/vision-board' },
    { label: 'Goal Tracker', path: '/goals' },
    { label: 'Habit Builder', path: '/habits' },
    { label: 'AI Coach', path: '/dashboard/ai-coach' },
    { label: 'Community', path: '/community' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact', path: '/contact' },
  ],
  Support: [
    { label: 'Help Center', path: '/help' },
    { label: 'Support', path: '/support' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
};

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:text-pink-500' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:text-blue-500' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:text-sky-400' },
  { icon: Github, label: 'GitHub', href: 'https://github.com', color: 'hover:text-foreground' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@dreamcarta.app', color: 'hover:text-primary' },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold mb-2">Stay Inspired Daily</h3>
            <p className="text-muted-foreground mb-6">Get weekly manifestation tips, success stories, and goal-setting strategies straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
              <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-gradient">DreamCarta</span>
                <div className="text-[10px] text-muted-foreground -mt-1 tracking-wider">LIFE BLUEPRINT</div>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Your personal life blueprint platform. Turn your dreams into reality with vision boards, smart goal tracking, and AI-powered coaching.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary/5 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm text-foreground mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DreamCarta. All rights reserved. Made with ♥ in India.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/help" className="text-xs text-muted-foreground hover:text-primary transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
