export interface AdminStat {
  label: string;
  value: string;
  change: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  time: string;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mentor' | 'user';
  status: 'active' | 'inactive';
  lastSeen: string;
}

export const ADMIN_STATS: AdminStat[] = [
  { label: 'Total Users', value: '2,847', change: '+8.2%' },
  { label: 'Active Users', value: '2,109', change: '+4.6%' },
  { label: 'New Signups', value: '193', change: '+12.1%' },
  { label: 'Conversion Rate', value: '7.8%', change: '+1.4%' },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: '1', actor: 'Ananya Sharma', action: 'updated profile details', time: '2 min ago' },
  { id: '2', actor: 'Ravi Patel', action: 'completed onboarding flow', time: '14 min ago' },
  { id: '3', actor: 'Admin Team', action: 'published a policy update', time: '38 min ago' },
  { id: '4', actor: 'Sana Khan', action: 'upgraded subscription plan', time: '1 hr ago' },
  { id: '5', actor: 'System', action: 'generated daily analytics report', time: '2 hr ago' },
];

export const DUMMY_USERS: AdminUserRow[] = [
  {
    id: 'u1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    role: 'admin',
    status: 'active',
    lastSeen: '1 min ago',
  },
  {
    id: 'u2',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@example.com',
    role: 'user',
    status: 'active',
    lastSeen: '7 min ago',
  },
  {
    id: 'u3',
    name: 'Dev Nair',
    email: 'dev.nair@example.com',
    role: 'user',
    status: 'inactive',
    lastSeen: '2 days ago',
  },
  {
    id: 'u4',
    name: 'Mira Joshi',
    email: 'mira.joshi@example.com',
    role: 'user',
    status: 'active',
    lastSeen: '30 min ago',
  },
  {
    id: 'u5',
    name: 'Kabir Singh',
    email: 'kabir.singh@example.com',
    role: 'admin',
    status: 'active',
    lastSeen: '12 min ago',
  },
  {
    id: 'u6',
    name: 'Ira Verma',
    email: 'ira.verma@example.com',
    role: 'user',
    status: 'inactive',
    lastSeen: '5 days ago',
  },
];
