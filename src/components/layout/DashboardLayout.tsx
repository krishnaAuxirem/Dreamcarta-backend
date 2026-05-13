import { useEffect, useMemo, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import DashboardSidebar from './DashboardSidebar';
import { Sun, Moon, Bell, Menu, ArrowLeft, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMentorGuidanceForUser, MENTOR_GUIDANCE_UPDATED_EVENT_NAME, type MentorGuidanceEntry } from '@/lib/mentorGuidance';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mentorNotifications, setMentorNotifications] = useState<MentorGuidanceEntry[]>([]);

  const loadMentorNotifications = () => {
    setMentorNotifications(getMentorGuidanceForUser({ id: user?.id, email: user?.email, name: user?.name }));
  };

  useEffect(() => {
    loadMentorNotifications();
  }, [user?.id, user?.email, user?.name]);

  useEffect(() => {
    const handleGuidanceUpdate = () => {
      loadMentorNotifications();
    };

    window.addEventListener(MENTOR_GUIDANCE_UPDATED_EVENT_NAME, handleGuidanceUpdate);
    return () => {
      window.removeEventListener(MENTOR_GUIDANCE_UPDATED_EVENT_NAME, handleGuidanceUpdate);
    };
  }, [user?.id, user?.email, user?.name]);

  const unreadCount = useMemo(() => mentorNotifications.length, [mentorNotifications]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-xl">✨</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
          <div className="relative w-64">
            <DashboardSidebar collapsed={false} onToggle={() => setMobileSidebar(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: `${sidebarWidth}px` }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen hidden lg:flex"
      >
        {/* Top bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            {title && <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary border border-border hover:border-primary/40 hover:bg-primary/5 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((previous) => !previous)}
                className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground relative"
                aria-label="Mentor notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[10px] leading-4 text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-semibold">Mentor Advice</p>
                      <p className="text-xs text-muted-foreground">Guidance sent for your account</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {unreadCount}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {mentorNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-muted-foreground">
                        No mentor advice yet.
                      </div>
                    ) : (
                      mentorNotifications.slice(0, 5).map((note) => (
                        <div key={note.id} className="px-4 py-3 border-b border-border last:border-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">From {note.mentorName}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(note.createdAt).toLocaleString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 rotate-[-90deg]" />
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground line-clamp-3">{note.advice}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {user && (
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
              />
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </motion.div>

      {/* Mobile main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:hidden">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-30">
          <button onClick={() => setMobileSidebar(true)} className="p-2 rounded-lg hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          {title && <h1 className="font-display text-lg font-bold">{title}</h1>}
          <div className="flex items-center gap-1">
            <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-primary" title="Back to Website">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((previous) => !previous)}
                className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground relative"
                aria-label="Mentor notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[10px] leading-4 text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-semibold">Mentor Advice</p>
                      <p className="text-xs text-muted-foreground">Guidance sent for your account</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {unreadCount}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {mentorNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-muted-foreground">
                        No mentor advice yet.
                      </div>
                    ) : (
                      mentorNotifications.slice(0, 5).map((note) => (
                        <div key={note.id} className="px-4 py-3 border-b border-border last:border-0">
                          <p className="text-sm font-medium text-foreground">From {note.mentorName}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(note.createdAt).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground line-clamp-3">{note.advice}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
