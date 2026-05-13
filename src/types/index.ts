export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'mentor' | 'admin';
  avatar?: string;
  profession?: string;
  bio?: string;
  joinedAt: string;
  goals: number;
  habits: number;
  streak: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'health' | 'finance' | 'education' | 'travel' | 'relationships' | 'personal';
  type: 'short-term' | 'long-term';
  deadline: string;
  progress: number;
  steps: string[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  reminderTime?: string;
  createdAt: string;
  color: string;
}

export interface VisionBoardItem {
  id: string;
  type: 'image' | 'text';
  content: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  tags: string[];
  commentsList?: CommunityComment[];
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface DreamMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Dream {
  id: string;
  title: string;
  category: string;
  progress: number;
  deadline: string;
  milestones: DreamMilestone[];
  image?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  quote: string;
  achievement: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

export type Theme = 'light' | 'dark';
