import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Sparkles, MessageSquare, CreditCard, Star, Activity, Users2, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/mentors', label: 'Mentors', icon: Users2 },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/community', label: 'Community', icon: MessageSquare },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail },
  { to: '/admin/plans', label: 'Plans', icon: CreditCard },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/activity', label: 'User Activity', icon: Activity },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex lg:shrink-0 border-r border-border bg-card transition-all duration-300 ease-in-out',
          collapsed ? 'lg:w-20' : 'lg:w-72'
        )}
      >
        <div className={cn('w-full p-4 space-y-6 transition-all duration-300', collapsed && 'px-3')}>
          <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3 px-2 py-1')}> 
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-display text-lg font-bold">DreamCarta</p>
                <p className="text-xs text-muted-foreground">Admin Console</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'flex items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-all',
              collapsed ? 'mx-auto h-10 w-10' : 'ml-auto h-10 w-10'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    cn(
                        'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        collapsed ? 'justify-center px-2' : 'gap-3'
                    )
                  }
                    title={collapsed ? item.label : undefined}
                >
                    <Icon className={cn('h-4 w-4 shrink-0', !collapsed && 'mr-0')} />
                    {!collapsed && item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/45 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />

        <aside
          className={cn(
            'absolute left-0 top-0 h-full w-72 border-r border-border bg-card p-4 transition-transform',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center gap-3 px-2 py-1 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold">DreamCarta</p>
              <p className="text-xs text-muted-foreground">Admin Console</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}
