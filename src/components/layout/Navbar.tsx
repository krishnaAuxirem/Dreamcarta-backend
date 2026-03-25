import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { NAV_LINKS } from '@/constants';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white dark:bg-[#1E1B2E] shadow-lg border-b border-border/60 backdrop-blur-md'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={cn('font-display font-bold text-xl transition-all duration-300', scrolled ? 'text-gradient' : 'text-white')}>DreamCarta</span>
              <div className={cn('text-[10px] -mt-1 font-body tracking-wider transition-all duration-300', scrolled ? 'text-muted-foreground' : 'text-white/60')}>LIFE BLUEPRINT</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  scrolled
                    ? pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-800 dark:text-white hover:text-primary hover:bg-primary/5'
                    : pathname === link.path
                      ? 'text-white bg-white/20'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-all duration-300',
                scrolled
                  ? 'text-gray-700 dark:text-white hover:text-primary hover:bg-primary/10'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn('flex items-center gap-2 px-3 py-2 rounded-lg transition-all', scrolled ? 'hover:bg-primary/10' : 'hover:bg-white/10')}
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <span className={cn('hidden md:block text-sm font-medium transition-all duration-300', scrolled ? 'text-gray-800 dark:text-white' : 'text-white')}>{user.name.split(' ')[0]}</span>
                  <ChevronDown className={cn('w-4 h-4 transition-all duration-300', scrolled ? 'text-muted-foreground' : 'text-white/70')} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-sm text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>
                        )}
                      </div>
                      <div className="p-2">
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">Dashboard</Link>
                        <Link to="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">Profile</Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">Admin Panel</Link>
                        )}
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className={cn(
                    'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300',
                    scrolled
                      ? 'text-primary border border-primary/30 hover:bg-primary/10'
                      : 'text-white border border-white/40 hover:bg-white/10'
                  )}
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-all duration-300',
                scrolled ? 'text-gray-800 dark:text-white hover:bg-muted' : 'text-white hover:bg-white/10'
              )}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-[#1E1B2E]/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-800 dark:text-white hover:bg-primary/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-center text-primary border border-primary rounded-lg text-sm font-medium">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-primary text-center text-sm">Get Started Free</Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-border">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm hover:bg-muted rounded-lg">Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm hover:bg-muted rounded-lg">Admin Panel</Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
