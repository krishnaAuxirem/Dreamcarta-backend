import { useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Admin/Sidebar';
import Navbar from '@/components/Admin/Navbar';
import { useAuth } from '@/hooks/useAuth';

const titleMap: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Users Management',
  '/admin/blogs': 'Blog Management',
  '/admin/community': 'Community Moderation',
  '/admin/plans': 'Plan Management',
  '/admin/reviews': 'Reviews Management',
  '/admin/mentors': 'Mentors Dashboard',
  '/admin/activity': 'User Activity Monitor',
  '/admin/settings': 'Admin Settings',
  '/admin/contacts': 'Contact Inbox',
};

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  const pageTitle = useMemo(() => titleMap[location.pathname] || 'Admin Panel', [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading admin workspace...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role is already checked by ProtectedRoute, but keep this as extra safety
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1 flex flex-col">
        <Navbar onOpenMobileMenu={() => setMobileOpen(true)} title={pageTitle} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
