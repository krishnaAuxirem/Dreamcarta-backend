import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { saveMentorGuidance } from '@/lib/mentorGuidance';
import {
  getMentorGoalsApi,
  getMentorUsersApi,
  submitMentorAdviceApi,
  type MentorGoal,
  type MentorUser,
} from '@/lib/api/mentorApi';

export default function MentorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<MentorUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MentorUser | null>(null);
  const [goals, setGoals] = useState<MentorGoal[]>([]);
  const [guidance, setGuidance] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [savingGuidance, setSavingGuidance] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getMentorUsersApi();
        setUsers(data);
      } catch {
        setStatusMessage('Could not load users.');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadGoals = async () => {
      if (!selectedUser) {
        setGoals([]);
        return;
      }

      setLoadingGoals(true);
      setStatusMessage('');

      try {
        const data = await getMentorGoalsApi(selectedUser.id);
        setGoals(data);
      } catch {
        setGoals([]);
        setStatusMessage("Could not load the selected user's goals.");
      } finally {
        setLoadingGoals(false);
      }
    };

    loadGoals();
  }, [selectedUser]);

  const handleUserSelect = (mentorUser: MentorUser) => {
    setSelectedUser(mentorUser);
    setStatusMessage('');
  };

  const handleGuidanceSubmit = async () => {
    if (!selectedUser) {
      setStatusMessage('Please select a user first.');
      return;
    }

    const trimmedGuidance = guidance.trim();
    if (!trimmedGuidance) {
      setStatusMessage('Please write a guidance note.');
      return;
    }

    setSavingGuidance(true);
    setStatusMessage('');

    try {
      await submitMentorAdviceApi({
        userId: selectedUser.id,
        advice: trimmedGuidance,
      });
      saveMentorGuidance({
        mentorName: user?.name || 'Mentor',
        mentorEmail: user?.email || '',
        recipientId: selectedUser.id,
        recipientName: selectedUser.name,
        recipientEmail: selectedUser.email,
        advice: trimmedGuidance,
        createdAt: new Date().toISOString(),
      });
      setGuidance('');
      setStatusMessage(`Guidance sent to ${selectedUser.name}.`);
    } catch {
      setStatusMessage('Could not send guidance right now.');
    } finally {
      setSavingGuidance(false);
    }
  };

  const highlightCards = useMemo(() => {
    const selectedGoalsCount = goals.length;
    const urgentGoalsCount = goals.filter((goal) => {
      const deadline = new Date(goal.deadline).getTime();
      if (Number.isNaN(deadline)) {
        return false;
      }

      const daysUntilDeadline = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= 14;
    }).length;

    return [
      { label: 'Active Users', value: users.length, note: 'Mentor network' },
      { label: 'Selected Goals', value: selectedGoalsCount, note: selectedUser ? selectedUser.name : 'Pick a user' },
      { label: 'Urgent Goals', value: urgentGoalsCount, note: 'Due in 2 weeks' },
    ];
  }, [goals, selectedUser, users.length]);

  const sortedHighlights = useMemo(() => {
    return [...goals].sort((a, b) => {
      const aTime = new Date(a.deadline).getTime();
      const bTime = new Date(b.deadline).getTime();
      return aTime - bTime;
    });
  }, [goals]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading mentor dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'mentor' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout title="Mentor Dashboard">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {highlightCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
              <div className="mt-2 text-3xl font-bold text-primary">{card.value}</div>
              <p className="mt-1 text-sm text-muted-foreground">{card.note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick one user to focus on.</p>

            <div className="mt-4 space-y-3">
              {loadingUsers ? (
                <p className="text-sm text-muted-foreground">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users found.</p>
              ) : (
                users.map((mentorUser) => {
                  const isSelected = selectedUser?.id === mentorUser.id;

                  return (
                    <button
                      key={mentorUser.id}
                      type="button"
                      onClick={() => handleUserSelect(mentorUser)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border bg-muted/20 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-foreground">{mentorUser.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{mentorUser.email}</div>
                        </div>
                        {isSelected ? (
                          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                            Focus
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Highlighted Goals</h2>
              {selectedUser ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedUser.name} · {selectedUser.email}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Select a user to view goals.</p>
              )}

              <div className="mt-4 space-y-3">
                {loadingGoals ? (
                  <p className="text-sm text-muted-foreground">Loading goals...</p>
                ) : sortedHighlights.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No goals found.</p>
                ) : (
                  sortedHighlights.slice(0, 3).map((goal, index) => (
                    <article
                      key={goal.id}
                      className={`rounded-xl border p-4 ${index === 0 ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'}`}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="font-medium text-foreground">{goal.title}</h3>
                        <span className="text-xs text-muted-foreground">Deadline: {goal.deadline}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {goal.description || 'No description available.'}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Quick Focus</h2>
              <p className="mt-1 text-sm text-muted-foreground">Only the important coaching items are kept here.</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Users loaded</span>
                  <span className="text-sm font-semibold text-foreground">{users.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Selected user</span>
                  <span className="text-sm font-semibold text-foreground">{selectedUser ? selectedUser.name : 'None'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Goals in focus</span>
                  <span className="text-sm font-semibold text-foreground">{goals.length}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <h3 className="text-sm font-semibold">Send Guidance</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Write a short action note for the selected user.
                </p>
                <textarea
                  value={guidance}
                  onChange={(event) => setGuidance(event.target.value)}
                  placeholder={selectedUser ? `Advice for ${selectedUser.name}...` : 'Select a user first'}
                  rows={4}
                  disabled={!selectedUser}
                  className="mt-3 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => void handleGuidanceSubmit()}
                  disabled={!selectedUser || savingGuidance}
                  className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingGuidance ? 'Sending...' : 'Send Guidance'}
                </button>
              </div>
            </div>

            {statusMessage ? (
              <p className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                {statusMessage}
              </p>
            ) : null}
          </section>
        </section>
      </div>
    </DashboardLayout>
  );
}
