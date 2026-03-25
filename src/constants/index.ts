import { Goal, Habit, Dream, BlogPost, CommunityPost, Testimonial, PricingPlan } from '@/types';

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Vision Board', path: '/vision-board' },
  { label: 'Goals', path: '/goals' },
  { label: 'Habits', path: '/habits' },
  { label: 'Community', path: '/community' },
  { label: 'Blog', path: '/blog' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export const MOTIVATIONAL_QUOTES = [
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Dreams don't work unless you do.", author: "John C. Maxwell" },
  { quote: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
];

export const FEATURES = [
  { icon: 'target', title: 'Smart Goal Setting', desc: 'Define clear, structured life goals with actionable steps and intelligent deadline tracking.', color: 'from-purple-500 to-violet-600' },
  { icon: 'layout-template', title: 'Vision Board Creator', desc: 'Drag-and-drop visual boards to manifest your dreams with images and affirmations.', color: 'from-pink-500 to-rose-600' },
  { icon: 'flame', title: 'Habit Streak Tracker', desc: 'Build powerful habits with streak tracking, reminders, and consistency analytics.', color: 'from-orange-500 to-amber-600' },
  { icon: 'bot', title: 'AI Dream Coach', desc: 'Get personalized AI coaching to plan your path and stay accountable to your goals.', color: 'from-blue-500 to-cyan-600' },
  { icon: 'trending-up', title: 'Dream Progress Tracker', desc: 'Visualize your journey with milestone tracking and completion analytics.', color: 'from-green-500 to-emerald-600' },
  { icon: 'sun', title: 'Daily Motivation', desc: 'Start each day with personalized quotes, affirmations, and morning prompts.', color: 'from-yellow-500 to-gold-600' },
  { icon: 'users', title: 'Community Support', desc: 'Share your journey, inspire others, and celebrate achievements together.', color: 'from-teal-500 to-cyan-600' },
  { icon: 'bell', title: 'Smart Notifications', desc: 'Get timely reminders for goals, habit streaks, and daily motivations.', color: 'from-indigo-500 to-purple-600' },
];

export const DEMO_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Launch My Startup',
    description: 'Build and launch my SaaS product in the productivity space',
    category: 'career',
    type: 'long-term',
    deadline: '2026-12-31',
    progress: 35,
    steps: ['Validate idea', 'Build MVP', 'Get first 10 customers', 'Reach ₹1L MRR'],
    status: 'active',
    createdAt: '2025-01-01',
  },
  {
    id: 'g2',
    title: 'Achieve Financial Freedom',
    description: 'Build multiple income streams and invest wisely',
    category: 'finance',
    type: 'long-term',
    deadline: '2027-06-30',
    progress: 20,
    steps: ['Save ₹5L emergency fund', 'Start SIP investments', 'Build side income', 'Reach ₹10L/year passive income'],
    status: 'active',
    createdAt: '2025-01-15',
  },
  {
    id: 'g3',
    title: 'Run a Half Marathon',
    description: 'Train consistently and complete a 21km race',
    category: 'health',
    type: 'short-term',
    deadline: '2026-03-15',
    progress: 60,
    steps: ['Run 5km without stopping', 'Build to 10km', 'Train 5 days/week', 'Complete race'],
    status: 'active',
    createdAt: '2025-02-01',
  },
  {
    id: 'g4',
    title: 'Learn Spanish',
    description: 'Achieve conversational fluency in Spanish',
    category: 'education',
    type: 'short-term',
    deadline: '2025-12-31',
    progress: 45,
    steps: ['Complete Duolingo basics', 'Practice daily 30min', 'Find conversation partner', 'Pass B1 test'],
    status: 'active',
    createdAt: '2025-03-01',
  },
  {
    id: 'g5',
    title: 'Travel to Japan',
    description: 'Experience Japanese culture and language',
    category: 'travel',
    type: 'short-term',
    deadline: '2025-10-01',
    progress: 80,
    steps: ['Save ₹2L travel fund', 'Plan itinerary', 'Book flights', 'Learn basic Japanese'],
    status: 'active',
    createdAt: '2025-01-10',
  },
];

export const DEMO_HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness every morning',
    category: 'Mindfulness',
    frequency: 'daily',
    streak: 21,
    completedToday: true,
    completedDates: [],
    reminderTime: '07:00',
    createdAt: '2025-01-01',
    color: 'bg-purple-500',
  },
  {
    id: 'h2',
    title: 'Read 20 Pages',
    description: 'Read at least 20 pages of a book daily',
    category: 'Learning',
    frequency: 'daily',
    streak: 14,
    completedToday: false,
    completedDates: [],
    reminderTime: '21:00',
    createdAt: '2025-01-15',
    color: 'bg-blue-500',
  },
  {
    id: 'h3',
    title: 'Exercise',
    description: '45 minutes of exercise or gym',
    category: 'Health',
    frequency: 'daily',
    streak: 7,
    completedToday: true,
    completedDates: [],
    reminderTime: '06:30',
    createdAt: '2025-02-01',
    color: 'bg-green-500',
  },
  {
    id: 'h4',
    title: 'Journaling',
    description: 'Write in journal for 10 minutes',
    category: 'Mindfulness',
    frequency: 'daily',
    streak: 5,
    completedToday: false,
    completedDates: [],
    reminderTime: '22:00',
    createdAt: '2025-02-15',
    color: 'bg-amber-500',
  },
  {
    id: 'h5',
    title: 'Learn Code',
    description: 'Practice coding for 1 hour',
    category: 'Learning',
    frequency: 'daily',
    streak: 30,
    completedToday: true,
    completedDates: [],
    reminderTime: '20:00',
    createdAt: '2024-12-01',
    color: 'bg-indigo-500',
  },
];

export const DEMO_DREAMS: Dream[] = [
  {
    id: 'd1',
    title: 'Build a Successful Business',
    category: 'career',
    progress: 35,
    deadline: '2027-12-31',
    milestones: [
      { id: 'm1', title: 'Validate Business Idea', completed: true, completedAt: '2025-01-15' },
      { id: 'm2', title: 'Build MVP Product', completed: true, completedAt: '2025-03-01' },
      { id: 'm3', title: 'Get First 10 Customers', completed: false },
      { id: 'm4', title: 'Reach ₹10L Revenue', completed: false },
      { id: 'm5', title: 'Hire First Employee', completed: false },
    ],
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop',
  },
  {
    id: 'd2',
    title: 'Buy My Dream House',
    category: 'lifestyle',
    progress: 55,
    deadline: '2028-06-30',
    milestones: [
      { id: 'm1', title: 'Save ₹10L Down Payment', completed: true, completedAt: '2025-02-01' },
      { id: 'm2', title: 'Improve Credit Score', completed: true, completedAt: '2025-01-01' },
      { id: 'm3', title: 'Get Home Loan Pre-approved', completed: false },
      { id: 'm4', title: 'Find Dream Location', completed: false },
      { id: 'm5', title: 'Close the Deal', completed: false },
    ],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop',
  },
  {
    id: 'd3',
    title: 'Travel All 7 Continents',
    category: 'travel',
    progress: 42,
    deadline: '2030-12-31',
    milestones: [
      { id: 'm1', title: 'Visit Asia (Japan, Thailand)', completed: true, completedAt: '2024-11-01' },
      { id: 'm2', title: 'Explore Europe', completed: true, completedAt: '2024-07-15' },
      { id: 'm3', title: 'Travel to Americas', completed: false },
      { id: 'm4', title: 'Africa Safari', completed: false },
      { id: 'm5', title: 'Antarctica Expedition', completed: false },
    ],
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=250&fit=crop',
  },
];

export const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Science Behind Vision Boards: Why They Actually Work',
    excerpt: 'Discover the neuroscience and psychology that makes vision boarding a powerful manifestation tool.',
    content: `Vision boards have been around for decades, but recent neuroscience research is finally explaining why they work so effectively. When you create a vision board and look at it daily, you're engaging several powerful mental processes...

## The Reticular Activating System

Your brain has a filter called the Reticular Activating System (RAS) that determines what information you pay attention to. When you consistently visualize your goals through a vision board, you're essentially programming your RAS to notice opportunities related to those goals.

## Neuroplasticity and Visualization

Modern neuroscience has shown that the brain doesn't easily distinguish between vividly imagined events and real ones. When you visualize achieving your goals, your brain fires the same neural pathways as if you were actually accomplishing them.

## How to Create an Effective Vision Board

1. **Be Specific**: Use images that closely represent your actual goals
2. **Include All Life Areas**: Career, relationships, health, finances
3. **Add Emotion**: Choose images that genuinely excite you
4. **Review Daily**: Look at your board every morning and evening
5. **Take Action**: Use your board as inspiration, not a substitute for action

The key insight is that vision boards work not through magic, but through psychology and consistent daily attention to your goals.`,
    author: 'Dr. Maya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    category: 'Manifestation',
    tags: ['Vision Board', 'Psychology', 'Goal Setting', 'Mindset'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    publishedAt: '2025-03-01',
    readTime: 7,
    likes: 342,
    comments: 28,
  },
  {
    id: 'b2',
    title: '5 Goal-Setting Frameworks Used by World-Class Achievers',
    excerpt: 'From SMART goals to OKRs, learn the frameworks that drive extraordinary achievement.',
    content: `Goal setting is an art and a science. The most successful people in the world don't just wish for results—they systematically engineer their achievement...

## 1. SMART Goals
Specific, Measurable, Achievable, Relevant, Time-bound

## 2. OKRs (Objectives and Key Results)
Used by Google, Intel, and top startups. Set ambitious objectives with 3-5 measurable key results.

## 3. The 12-Week Year
Treat each quarter as a full year, creating urgency and focus.

## 4. The ONE Thing
Identify the single most important task that makes everything else easier.

## 5. Backward Planning
Start with your end goal and work backward to today.`,
    author: 'Rahul Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    category: 'Goal Setting',
    tags: ['Goals', 'Productivity', 'Success', 'Planning'],
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop',
    publishedAt: '2025-02-20',
    readTime: 9,
    likes: 521,
    comments: 47,
  },
  {
    id: 'b3',
    title: 'How to Build Habits That Actually Stick: A Complete Guide',
    excerpt: 'Using atomic habits principles and behavioral science to create lasting positive change.',
    content: `Most people fail at building new habits not because of lack of motivation, but because of poor system design. Here's how to build habits that stick for life...

## The Habit Loop
Every habit consists of: Cue → Routine → Reward

## The 2-Minute Rule
If a new habit takes less than 2 minutes, do it now. Build small.

## Habit Stacking
Attach new habits to existing ones: "After I [CURRENT HABIT], I will [NEW HABIT]."

## Environment Design
Make good habits obvious and easy, bad habits invisible and difficult.`,
    author: 'Priya Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    category: 'Habits',
    tags: ['Habits', 'Behavior Change', 'Psychology', 'Atomic Habits'],
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=450&fit=crop',
    publishedAt: '2025-02-10',
    readTime: 11,
    likes: 876,
    comments: 93,
  },
  {
    id: 'b4',
    title: 'Morning Routines of Billionaires: What They Do in Their First Hour',
    excerpt: 'Analyze the morning habits of Elon Musk, Tim Cook, and other ultra-successful people.',
    content: `The first hour of your day sets the tone for everything that follows. Here's what the world's most successful people do before 9 AM...`,
    author: 'Arjun Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    category: 'Success',
    tags: ['Morning Routine', 'Success', 'Productivity', 'Habits'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    publishedAt: '2025-01-28',
    readTime: 8,
    likes: 1243,
    comments: 156,
  },
  {
    id: 'b5',
    title: 'The Power of AI Coaching: How Technology Is Transforming Personal Growth',
    excerpt: 'Explore how AI-powered coaching is making world-class guidance accessible to everyone.',
    content: `Artificial intelligence is revolutionizing personal development. What once required expensive human coaches is now available at your fingertips...`,
    author: 'Dr. Ananya Singh',
    authorAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop',
    category: 'Technology',
    tags: ['AI', 'Coaching', 'Technology', 'Personal Growth'],
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop',
    publishedAt: '2025-01-15',
    readTime: 6,
    likes: 654,
    comments: 71,
  },
  {
    id: 'b6',
    title: 'Financial Freedom at 35: A Practical Roadmap for Indians',
    excerpt: 'Step-by-step guide to achieving financial independence with realistic Indian salary figures.',
    content: `Financial freedom is achievable for most Indians by 35-40 if you start early and stay consistent. Here is the complete roadmap...`,
    author: 'Vikram Nair',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    category: 'Finance',
    tags: ['Finance', 'Investment', 'Financial Freedom', 'India'],
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450&fit=crop',
    publishedAt: '2025-01-05',
    readTime: 13,
    likes: 2341,
    comments: 289,
  },
];

export const DEMO_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp1',
    author: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    content: 'Just completed my 30-day meditation streak! What started as a 5-minute daily practice has completely transformed my focus and mental clarity. The DreamCarta habit tracker made it so easy to stay consistent. Who else is building mindfulness habits?',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    likes: 247,
    comments: 34,
    shares: 12,
    liked: false,
    tags: ['meditation', 'mindfulness', 'streak', 'habits'],
    createdAt: '2025-03-24T10:30:00Z',
  },
  {
    id: 'cp2',
    author: 'Rahul Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    content: 'Excited to share that I just got my first freelance client! This has been on my vision board for 6 months. I used the goal tracker to break it down: improve portfolio then apply to 5 jobs/week then network at events. Taking it one step at a time!',
    likes: 189,
    comments: 28,
    shares: 8,
    liked: false,
    tags: ['freelancing', 'career', 'goals', 'success'],
    createdAt: '2025-03-23T14:15:00Z',
  },
  {
    id: 'cp3',
    author: 'Ananya Krishnan',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop',
    content: 'Update on my Japan travel goal: BOOKED THE TICKETS! I had this on my vision board since January. The AI Coach helped me break down the savings plan and the goal tracker kept me accountable. Dreams DO come true when you have a system!',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop',
    likes: 412,
    comments: 67,
    shares: 31,
    liked: false,
    tags: ['travel', 'Japan', 'manifestation', 'dreams'],
    createdAt: '2025-03-22T09:00:00Z',
  },
  {
    id: 'cp4',
    author: 'Arjun Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    content: 'Week 8 of my fitness journey. Down 8kg and feeling incredible! My vision board with the fit body reference image motivates me every single morning. Combined with the habit tracker for gym and diet, the results speak for themselves. Never giving up!',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    likes: 334,
    comments: 45,
    shares: 19,
    liked: false,
    tags: ['fitness', 'health', 'transformation', 'habits'],
    createdAt: '2025-03-21T18:30:00Z',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sharma',
    profession: 'Entrepreneur, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    quote: 'DreamCarta completely transformed how I approach my goals. Within 6 months of using the platform, I launched my startup and landed my first ₹50L client. The vision board and AI coach are game-changers!',
    achievement: 'Launched startup, ₹50L client',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Arjun Reddy',
    profession: 'Software Engineer, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    quote: 'I had dreams but no direction. DreamCarta gave me the system I needed. The habit tracker helped me maintain a 90-day coding streak, and I got promoted to Senior Engineer in just 8 months!',
    achievement: 'Promoted to Senior Engineer',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Meera Patel',
    profession: 'Fitness Coach, Delhi',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=120&h=120&fit=crop',
    quote: 'The vision board feature is absolutely beautiful. I put my dream body, dream business, and dream lifestyle on it. 1 year later—I have all three! The daily motivation feature kept me going even on hard days.',
    achievement: 'Built fitness business, ₹3L/month',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Ravi Kumar',
    profession: 'CA Student, Pune',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    quote: 'As a CA student, managing study goals seemed impossible. DreamCarta broke it down perfectly. The AI coach suggested a study plan that helped me clear my CA Final on the first attempt!',
    achievement: 'CA Final cleared in first attempt',
    rating: 5,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with your dream journey',
    features: [
      '3 Vision Boards',
      '5 Active Goals',
      '3 Habit Trackers',
      'Daily Motivational Quotes',
      'Basic Dream Tracker',
      'Community Access',
      'Email Support',
    ],
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 199,
    period: 'month',
    description: 'For serious dreamers ready to accelerate their journey',
    features: [
      'Unlimited Vision Boards',
      'Unlimited Goals',
      'Unlimited Habits',
      'AI Dream Coach (20 chats/month)',
      'Advanced Analytics',
      'Priority Community Access',
      'Blog Publishing',
      'Goal Sharing',
      'Priority Email Support',
    ],
    highlighted: false,
    badge: 'Popular',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    period: 'month',
    description: 'Everything you need to manifest your biggest dreams',
    features: [
      'Everything in Growth',
      'Unlimited AI Coach',
      'Vision Board AI Generator',
      'Advanced Habit Analytics',
      'Custom Reminders',
      'Export & Download',
      'Mentor Matching',
      'Live Group Sessions',
      'Dedicated Success Coach',
    ],
    highlighted: true,
    badge: 'Best Value',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 499,
    period: 'month',
    description: 'The ultimate manifestation ecosystem for achievers',
    features: [
      'Everything in Pro',
      '1-on-1 Personal Coaching',
      'AR Vision Boards (Beta)',
      'Voice Journaling',
      'Custom Success Certification',
      'Mastermind Group Access',
      'White-glove Onboarding',
      'API Access',
      '24/7 Priority Support',
    ],
    highlighted: false,
    badge: 'Premium',
  },
];

export const GOAL_CATEGORIES = ['career', 'health', 'finance', 'education', 'travel', 'relationships', 'personal'];
export const HABIT_CATEGORIES = ['Mindfulness', 'Health', 'Learning', 'Career', 'Social', 'Creative', 'Spiritual'];
export const BLOG_CATEGORIES = ['All', 'Manifestation', 'Goal Setting', 'Habits', 'Success', 'Finance', 'Technology'];
