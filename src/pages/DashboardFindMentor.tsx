import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { getMentorsListApi, type MentorProfile } from '@/lib/api/mentorApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Users, MessageCircle, Check, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function DashboardFindMentor() {
  const { user, loading: authLoading } = useAuth();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [followedMentors, setFollowedMentors] = useState<Set<string>>(new Set());

  // Redirect mentor users
  if (user?.role === 'mentor' || user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const data = await getMentorsListApi();
        setMentors(data);
        setFilteredMentors(data);
      } catch (error) {
        console.error('Failed to load mentors:', error);
        toast({
          title: 'Error',
          description: 'Could not load mentors. Try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

  // Filter mentors based on search
  useEffect(() => {
    const filtered = mentors.filter((mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMentors(filtered);
  }, [searchTerm, mentors]);

  const handleFollowMentor = (mentorId: string) => {
    if (followedMentors.has(mentorId)) {
      setFollowedMentors((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mentorId);
        return newSet;
      });
      toast({
        title: 'Unfollowed',
        description: 'You have unfollowed this mentor.',
      });
    } else {
      setFollowedMentors((prev) => new Set(prev).add(mentorId));
      toast({
        title: 'Following',
        description: 'You are now following this mentor.',
      });
    }
  };

  const handleSendMessage = (mentorId: string, mentorName: string) => {
    toast({
      title: 'Message',
      description: `Message sent to ${mentorName}. They will respond soon!`,
    });
  };

  if (authLoading) {
    return (
      <DashboardLayout title="Find Mentor">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white text-xl">✨</span>
            </div>
            <p className="text-muted-foreground">Loading mentors...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Find Mentor">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Perfect Mentor</h1>
          <p className="text-muted-foreground mb-6">
            Connect with experienced mentors who can guide you on your journey to achieving your dreams.
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, expertise, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background border-border"
            />
          </div>
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-white text-xl">✨</span>
              </div>
              <p className="text-muted-foreground">Loading mentors...</p>
            </div>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 rounded-xl border-2 border-dashed border-border bg-muted/30">
            <Users className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">
              {mentors.length === 0 ? 'No mentors available yet' : 'No mentors match your search'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {mentors.length === 0 ? 'Check back soon!' : 'Try adjusting your search terms'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              >
                {/* Mentor Avatar & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/30"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{mentor.name}</h3>
                      <p className="text-sm text-primary font-medium">{mentor.expertise}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(mentor.rating || 4.5)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({mentor.rating || 4.5})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mentor.bio}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 py-3 px-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{mentor.followers || 0}</span>
                    <span className="text-xs text-muted-foreground">followers</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleFollowMentor(mentor.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      followedMentors.has(mentor.id)
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {followedMentors.has(mentor.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Following
                      </>
                    ) : (
                      'Follow'
                    )}
                  </button>
                  <button
                    onClick={() => handleSendMessage(mentor.id, mentor.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredMentors.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {filteredMentors.length} of {mentors.length} mentor
            {mentors.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
