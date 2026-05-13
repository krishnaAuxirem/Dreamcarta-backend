import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, Flame, Star, TrendingUp, Zap, Bot, User, Settings,
  History, Users, LogOut, ChevronLeft, ChevronRight, Sparkles, Image, UserCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Vision Board', path: '/dashboard/vision-board', icon: Image },
  { label: 'My Goals', path: '/dashboard/goals', icon: Target },
  { label: 'Habit Tracker', path: '/dashboard/habits', icon: Flame },
  { label: 'Dream Tracker', path: '/dashboard/dreams', icon: Star },
  { label: 'Daily Motivation', path: '/dashboard/motivation', icon: Zap },
  { label: 'AI Coach', path: '/dashboard/ai-coach', icon: Bot },
  { label: 'Find Mentor', path: '/dashboard/find-mentor', icon: UserCheck },
  { label: 'Community', path: '/dashboard/community', icon: Users },
  { label: 'History', path: '/dashboard/history', icon: History },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const MENTOR_SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/mentor', icon: LayoutDashboard },
  { label: 'Community', path: '/dashboard/community', icon: Users },
  { label: 'History', path: '/dashboard/history', icon: History },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: Props) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarLinks = useMemo(
    () => (user?.role === 'mentor' ? MENTOR_SIDEBAR_LINKS : SIDEBAR_LINKS),
    [user?.role]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-gradient">DreamCarta</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md z-50"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      )}

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6133B4&color=fff`}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {sidebarLinks.map(({ label, path, icon: Icon }) => {
          const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', !collapsed && 'mr-3')} />
              {!collapsed && label}
            </Link>
          );
        })}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={cn(
              'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Admin Panel' : undefined}
          >
            <TrendingUp className={cn('w-5 h-5 shrink-0', !collapsed && 'mr-3')} />
            {!collapsed && 'Admin Panel'}
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className={cn('w-5 h-5 shrink-0', !collapsed && 'mr-3')} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </motion.aside>
  );
}
