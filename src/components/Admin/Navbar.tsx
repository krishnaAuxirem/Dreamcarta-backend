import { Menu, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  title: string;
}

export default function Navbar({ onOpenMobileMenu, title }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Open admin sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="font-display text-xl font-bold leading-none">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Operational overview and management
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <Link
            to="/dashboard/profile"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Profile
          </Link>

          {/* 🔥 BACK TO WEBSITE BUTTON */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500 px-3 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition"
          >
            ← Back to Website
          </button>

          {/* USER INFO */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || 'Admin'
                )}&background=6133B4&color=fff`
              }
              alt={user?.name || 'Admin'}
              className="h-8 w-8 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-semibold leading-none">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.email || 'admin@dreamcarta.com'}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              ADMIN
            </span>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}
