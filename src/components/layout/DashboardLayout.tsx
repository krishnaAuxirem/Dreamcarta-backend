import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import DashboardSidebar from './DashboardSidebar';
import { Sun, Moon, Bell, Menu, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

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
            <button className="p-2 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
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
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
