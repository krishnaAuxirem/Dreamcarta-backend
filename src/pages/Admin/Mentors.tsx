import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';
import {
  getAdminMentorsApi,
  updateAdminMentorDashboardApi,
  type AdminMentorItem,
} from '@/lib/api/adminApi';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  dashboardMessage?: string;
  dashboardMessageUpdatedAt?: string;
}

const DEMO_MENTORS: Mentor[] = [
  {
    id: 'demo-mentor-1',
    name: 'DreamCarta Mentor',
    email: 'mentor@dreamcarta.in',
    avatar: 'https://ui-avatars.com/api/?name=DreamCarta+Mentor&background=0F172A&color=fff',
    isActive: true,
    dashboardMessage: 'Focus on the one goal that moves your week forward.',
    dashboardMessageUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadMentors = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getAdminMentorsApi();
        const mapped = data.map((mentor: AdminMentorItem) => ({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          avatar: mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=0F172A&color=fff`,
          isActive: mentor.isActive,
          dashboardMessage: mentor.dashboardMessage,
          dashboardMessageUpdatedAt: mentor.dashboardMessageUpdatedAt,
        }));

        setMentors(mapped);
        setSelectedMentor((current) => {
          if (!current && mapped.length > 0) {
            return mapped[0];
          }
          return mapped.find((mentor) => mentor.id === current?.id) || mapped[0] || null;
        });
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, 'Failed to load mentors'));
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    void loadMentors();
  }, []);

  useEffect(() => {
    if (selectedMentor) {
      setMessage(selectedMentor.dashboardMessage || '');
    }
  }, [selectedMentor]);

  const handleUpdateMessage = async () => {
    if (!selectedMentor) return;

    setUpdating(true);
    try {
      const response = await updateAdminMentorDashboardApi(selectedMentor.id, message);
      const updatedMentor = response?.mentor
        ? {
            id: String(response.mentor.id),
            name: String(response.mentor.name),
            email: String(response.mentor.email),
            avatar: String(response.mentor.avatar || ''),
            isActive: Boolean(response.mentor.isActive),
            dashboardMessage: String(response.mentor.dashboardMessage || ''),
            dashboardMessageUpdatedAt: response.mentor.dashboardMessageUpdatedAt,
          }
        : {
            ...selectedMentor,
            dashboardMessage: message,
            dashboardMessageUpdatedAt: new Date().toISOString(),
          };

      setMentors((prev) => prev.map((mentor) => (mentor.id === selectedMentor.id ? updatedMentor : mentor)));
      setSelectedMentor(updatedMentor);
      toast.success('Mentor dashboard updated ✅');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mentors List */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display text-lg font-bold mb-4">Mentors</h2>

          {loading ? (
            <div className="space-y-3">
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
            </div>
          ) : error ? (
            <div className="text-center text-sm text-muted-foreground py-8 space-y-3">
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="btn-primary text-sm px-4 py-2">
                Retry
              </button>
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No mentors found</div>
          ) : (
            <div className="space-y-2">
              {mentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => setSelectedMentor(mentor)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedMentor?.id === mentor.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-semibold text-sm">{mentor.name}</p>
                  <p className="text-xs text-muted-foreground">{mentor.email}</p>
                  {mentor.dashboardMessage && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Message set
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Editor */}
      <div className="lg:col-span-2">
        {selectedMentor ? (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold">Dashboard Message for {selectedMentor.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This message will appear on {selectedMentor.name}'s mentor dashboard
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter dashboard message for this mentor..."
                rows={8}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {selectedMentor.dashboardMessageUpdatedAt && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(selectedMentor.dashboardMessageUpdatedAt).toLocaleString()}
              </p>
            )}

            <button
              onClick={() => void handleUpdateMessage()}
              disabled={updating || !message.trim()}
              className="btn-primary w-full py-2 disabled:opacity-60"
            >
              {updating ? 'Updating...' : 'Update Dashboard Message'}
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
            Select a mentor to update their dashboard message
          </div>
        )}
      </div>
    </div>
  );
}
