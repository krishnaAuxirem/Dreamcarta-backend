import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import VisionBoard from "./pages/VisionBoard";
import Goals from "./pages/Goals";
import Habits from "./pages/Habits";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import DashboardGoals from "./pages/DashboardGoals";
import DashboardHabits from "./pages/DashboardHabits";
import DashboardDreamTracker from "./pages/DashboardDreamTracker";
import DashboardMotivation from "./pages/DashboardMotivation";
import DashboardAICoach from "./pages/DashboardAICoach";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardHistory from "./pages/DashboardHistory";
import DashboardCommunity from "./pages/DashboardCommunity";
import DashboardVisionBoard from "./pages/DashboardVisionBoard";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

// Footer Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Help from "./pages/Help";
import Support from "./pages/Support";
import Careers from "./pages/Careers";

// 404
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
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

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes (Protected) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/vision-board" element={<DashboardVisionBoard />} />
          <Route path="/dashboard/goals" element={<DashboardGoals />} />
          <Route path="/dashboard/habits" element={<DashboardHabits />} />
          <Route path="/dashboard/dreams" element={<DashboardDreamTracker />} />
          <Route path="/dashboard/motivation" element={<DashboardMotivation />} />
          <Route path="/dashboard/ai-coach" element={<DashboardAICoach />} />
          <Route path="/dashboard/community" element={<DashboardCommunity />} />
          <Route path="/dashboard/history" element={<DashboardHistory />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Footer Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} />
          <Route path="/support" element={<Support />} />
          <Route path="/careers" element={<Careers />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
