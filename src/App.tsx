import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster as HotToaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';

const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const VisionBoard = lazy(() => import('./pages/VisionBoard'));
const Goals = lazy(() => import('./pages/Goals'));
const Habits = lazy(() => import('./pages/Habits'));
const Community = lazy(() => import('./pages/Community'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardGoals = lazy(() => import('./pages/DashboardGoals'));
const DashboardHabits = lazy(() => import('./pages/DashboardHabits'));
const DashboardDreamTracker = lazy(() => import('./pages/DashboardDreamTracker'));
const DashboardMotivation = lazy(() => import('./pages/DashboardMotivation'));
const DashboardAICoach = lazy(() => import('./pages/DashboardAICoach'));
const DashboardProfile = lazy(() => import('./pages/DashboardProfile'));
const DashboardSettings = lazy(() => import('./pages/DashboardSettings'));
const DashboardHistory = lazy(() => import('./pages/DashboardHistory'));
const DashboardCommunity = lazy(() => import('./pages/DashboardCommunity'));
const DashboardVisionBoard = lazy(() => import('./pages/DashboardVisionBoard'));
const DashboardFindMentor = lazy(() => import('./pages/DashboardFindMentor'));
const MentorDashboard = lazy(() => import('./pages/mentordashboard'));

const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminBlogs = lazy(() => import('./pages/Admin/Blogs'));
const AdminCommunity = lazy(() => import('./pages/Admin/Community'));
const AdminPlans = lazy(() => import('./pages/Admin/Plans'));
const AdminReviews = lazy(() => import('./pages/Admin/Reviews'));
const AdminMentors = lazy(() => import('./pages/Admin/Mentors'));
const AdminActivity = lazy(() => import('./pages/Admin/Activity'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));
const AdminContacts = lazy(() => import('./pages/Admin/Contacts'));

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Help = lazy(() => import('./pages/Help'));
const Support = lazy(() => import('./pages/Support'));
const Careers = lazy(() => import('./pages/Careers'));

const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground bg-background">
    Loading...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/vision-board" element={<VisionBoard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/vision-board" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardVisionBoard /></ProtectedRoute>} />
            <Route path="/dashboard/goals" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardGoals /></ProtectedRoute>} />
            <Route path="/dashboard/habits" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardHabits /></ProtectedRoute>} />
            <Route path="/dashboard/dreams" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardDreamTracker /></ProtectedRoute>} />
            <Route path="/dashboard/motivation" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardMotivation /></ProtectedRoute>} />
            <Route path="/dashboard/ai-coach" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardAICoach /></ProtectedRoute>} />
            <Route path="/dashboard/find-mentor" element={<ProtectedRoute allowedRoles={['user']} fallbackPath="/login"><DashboardFindMentor /></ProtectedRoute>} />
            <Route path="/dashboard/community" element={<ProtectedRoute allowedRoles={['user', 'mentor']} fallbackPath="/login"><DashboardCommunity /></ProtectedRoute>} />
            <Route path="/dashboard/history" element={<ProtectedRoute allowedRoles={['user', 'mentor']} fallbackPath="/login"><DashboardHistory /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={['user', 'mentor']} fallbackPath="/login"><DashboardProfile /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={['user', 'mentor']} fallbackPath="/login"><DashboardSettings /></ProtectedRoute>} />

            <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor', 'admin']} fallbackPath="/login"><MentorDashboard /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} fallbackPath="/login"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="community" element={<AdminCommunity />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="mentors" element={<AdminMentors />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
            </Route>

            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<Help />} />
            <Route path="/support" element={<Support />} />
            <Route path="/careers" element={<Careers />} />

            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
