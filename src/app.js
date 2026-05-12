import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize, connectDB } from "./config/db.js";
import User from "./models/User.js";
import CommunityPost from './models/CommunityPost.js';
import Activity from './models/Activity.js';
import Dream from './models/Dream.js';

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import goalsRoutes from "./routes/goalsRoutes.js";
import habitsRoutes from "./routes/habitsRoutes.js";
import visionBoardRoutes from "./routes/visionBoardRoutes.js";
import dreamsRoutes from "./routes/dreamsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import adminCommunityRoutes from "./routes/adminCommunityRoutes.js";
import adminPlanRoutes from "./routes/adminPlanRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";
import adminMentorRoutes from "./routes/adminMentorRoutes.js";
import adminContactRoutes from "./routes/adminContactRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import Plan from "./models/Plan.js";

import './models/Goal.js';
import './models/Habit.js';
import './models/MentorAdvice.js';
import './models/VisionBoardItem.js';
import './models/Dream.js';
import './models/Contact.js';
import './models/UserSetting.js';
import './models/CommunityPost.js';
import './models/Plan.js';
import './models/Blog.js';
import './models/Subscription.js';
import './models/Review.js';
import './models/Activity.js';
import './models/Mention.js';
import contentRoutes from "./routes/contentRoutes.js";
import Review from './models/Review.js';
import Blog from './models/Blog.js';

import createAdmin from "./utils/createAdmin.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 🔧 Ensure columns
const ensureUserAuthColumns = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable("Users");

  if (!tableDefinition.role) {
    await queryInterface.addColumn("Users", "role", {
      type: DataTypes.ENUM('user', 'admin', 'mentor'),
      allowNull: false,
      defaultValue: "user",
    });
    console.log("Added Users.role ✅");
  }

  if (!tableDefinition.isActive) {
    await queryInterface.addColumn("Users", "isActive", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    console.log("Added Users.isActive ✅");
  }

  if (tableDefinition.role) {
    const roleType = String(tableDefinition.role.type || "").toLowerCase();
    if (!roleType.includes("mentor")) {
      await queryInterface.changeColumn("Users", "role", {
        type: DataTypes.ENUM('user', 'admin', 'mentor'),
        allowNull: false,
        defaultValue: "user",
      });
      console.log("Updated Users.role ENUM to include mentor ✅");
    }
  }
};

const ensureSeedUser = async () => {
  const seedEmail = "test@gmail.com";
  const existingSeedUser = await User.findOne({ where: { email: seedEmail } });
  const seedPassword = await bcrypt.hash("User@123", 10);

  if (!existingSeedUser) {
    await User.create({
      name: "Test User",
      email: seedEmail,
      password: seedPassword,
      role: "user",
      isActive: true,
    });
    console.log("Seeded default test user ✅");
    return;
  }

  let needsSave = false;

  const passwordMatches = existingSeedUser.password
    ? await bcrypt.compare('User@123', existingSeedUser.password)
    : false;

  if (!passwordMatches) {
    existingSeedUser.password = seedPassword;
    needsSave = true;
  }

  if (existingSeedUser.role !== "user" || existingSeedUser.isActive === false) {
    existingSeedUser.role = "user";
    existingSeedUser.isActive = true;
    needsSave = true;
  }

  if (needsSave) {
    await existingSeedUser.save();
    console.log("Normalized test user credentials/role/status ✅");
  }
};

const ensureDemoUserAccount = async () => {
  const demoEmail = 'user@dreamcarta.in';
  const demoPasswordHash = await bcrypt.hash('User@123', 10);
  const existing = await User.findOne({ where: { email: demoEmail } });

  if (!existing) {
    await User.create({
      name: 'Demo User',
      email: demoEmail,
      password: demoPasswordHash,
      role: 'user',
      isActive: true,
    });
    console.log('Seeded demo user account ✅');
    return;
  }

  let needsSave = false;

  const passwordMatches = existing.password
    ? await bcrypt.compare('User@123', existing.password)
    : false;

  if (!passwordMatches) {
    existing.password = demoPasswordHash;
    needsSave = true;
  }
  if (existing.role !== 'user' || existing.isActive === false) {
    existing.role = 'user';
    existing.isActive = true;
    needsSave = true;
  }

  if (needsSave) {
    await existing.save();
    console.log('Normalized demo user account ✅');
  }
};

const ensureDemoMentorAccount = async () => {
  const demoEmail = 'mentor@dreamcarta.in';
  const demoPasswordHash = await bcrypt.hash('Mentor@123', 10);
  const existing = await User.findOne({ where: { email: demoEmail } });

  if (!existing) {
    await User.create({
      name: 'Demo Mentor',
      email: demoEmail,
      password: demoPasswordHash,
      role: 'mentor',
      isActive: true,
    });
    console.log('Seeded demo mentor account ✅');
    return;
  }

  let needsSave = false;

  const passwordMatches = existing.password
    ? await bcrypt.compare('Mentor@123', existing.password)
    : false;

  if (!passwordMatches) {
    existing.password = demoPasswordHash;
    needsSave = true;
  }
  if (existing.role !== 'mentor' || existing.isActive === false) {
    existing.role = 'mentor';
    existing.isActive = true;
    needsSave = true;
  }

  if (needsSave) {
    await existing.save();
    console.log('Normalized demo mentor account ✅');
  }
};

const ensureDefaultPlans = async () => {
  const defaultPlans = [
    {
      name: "Free",
      price: 0,
      period: "month",
      description: "Get started with basic dream tracking",
      features: ["3 Vision Boards", "5 Goals", "Community Access"],
      isEnabled: true,
      highlighted: false,
      badge: null,
    },
    {
      name: "Pro",
      price: 499,
      period: "month",
      description: "Best for focused achievers",
      features: ["Unlimited Goals", "AI Coach", "Advanced Analytics"],
      isEnabled: true,
      highlighted: true,
      badge: "Popular",
    },
  ];

  for (const plan of defaultPlans) {
    const existing = await Plan.findOne({ where: { name: plan.name } });
    if (!existing) {
      await Plan.create(plan);
      console.log(`Seeded plan ${plan.name} ✅`);
    }
  }
};

const ensureDefaultReviews = async () => {
  const existingCount = await Review.count();
  if (existingCount > 0) {
    return;
  }

  await Review.bulkCreate([
    {
      author: 'Priya Sharma',
      title: 'Transformed My Life',
      content: 'DreamCarta completely transformed my approach to goals. Within 6 months of using the platform, I launched my startup and landed my first ₹50L client. The vision board and AI coach are game-changers!',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6133B4&color=fff',
      isPublished: true,
    },
    {
      author: 'Arjun Reddy',
      title: 'Best Goal-Tracking Tool',
      content: 'I had dreams but no direction. DreamCarta gave me clarity and a structured path. The daily motivation feature kept me accountable. Got promoted to Senior Engineer in just 8 months!',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Arjun+Reddy&background=6133B4&color=fff',
      isPublished: true,
    },
    {
      author: 'Meera Patel',
      title: 'Fitness & Mindfulness Game Changer',
      content: 'The habit tracker helped me build a consistent fitness routine. Combined with the AI coach suggestions, I lost 12kg and built a thriving fitness coaching business. Highly recommend!',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Meera+Patel&background=6133B4&color=fff',
      isPublished: true,
    },
    {
      author: 'Ravi Kumar',
      title: 'Exceeded My CA Final Preparation',
      content: 'Used DreamCarta to track study habits and maintain focus during CA Final prep. The community support and mentor guidance were invaluable. Cleared all 4 groups in the first attempt!',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=6133B4&color=fff',
      isPublished: true,
    },
  ]);

  console.log('Seeded default reviews ✅');
};

const ensureDefaultDreams = async () => {
  const defaultDreamTemplates = [
    {
      title: 'Launch My First Startup',
      category: 'career',
      progress: 40,
      deadlineOffsetMonths: 12,
      milestones: [
        { id: 'milestone-1', title: 'Complete market research', completed: true, completedAtOffsetDays: 30 },
        { id: 'milestone-2', title: 'Build MVP prototype', completed: true, completedAtOffsetDays: 15 },
        { id: 'milestone-3', title: 'Pitch to investors', completed: false },
        { id: 'milestone-4', title: 'Launch beta version', completed: false },
      ],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    },
    {
      title: 'Get Fit & Healthy',
      category: 'health',
      progress: 60,
      deadlineOffsetMonths: 6,
      milestones: [
        { id: 'fitness-1', title: 'Join gym and create routine', completed: true, completedAtOffsetDays: 60 },
        { id: 'fitness-2', title: 'Maintain 4x/week workout habit', completed: true, completedAtOffsetDays: 10 },
        { id: 'fitness-3', title: 'Lose 5kg', completed: false },
        { id: 'fitness-4', title: 'Complete half marathon', completed: false },
      ],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
    },
    {
      title: 'Master a New Skill',
      category: 'learning',
      progress: 25,
      deadlineOffsetMonths: 9,
      milestones: [
        { id: 'skill-1', title: 'Enroll in online course', completed: true, completedAtOffsetDays: 20 },
        { id: 'skill-2', title: 'Complete 50% of course', completed: false },
        { id: 'skill-3', title: 'Build portfolio project', completed: false },
        { id: 'skill-4', title: 'Get certification', completed: false },
      ],
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop',
    },
  ];

  const userAccounts = await User.findAll({
    where: { role: 'user' },
    attributes: ['id', 'name'],
  });

  let createdCount = 0;

  for (const account of userAccounts) {
    const existingDreamCount = await Dream.count({ where: { userId: account.id } });
    if (existingDreamCount > 0) {
      continue;
    }

    const baseDate = new Date();
    const seededDreams = defaultDreamTemplates.map((template, index) => {
      const deadline = new Date(baseDate);
      deadline.setMonth(deadline.getMonth() + template.deadlineOffsetMonths);

      return {
        userId: account.id,
        title: template.title,
        category: template.category,
        progress: template.progress,
        deadline: deadline.toISOString().split('T')[0],
        milestones: template.milestones.map((milestone, milestoneIndex) => {
          const completedAt = milestone.completedAtOffsetDays
            ? new Date(Date.now() - milestone.completedAtOffsetDays * 24 * 60 * 60 * 1000)
            : null;

          return {
            id: `${account.id}-${index}-${milestoneIndex}`,
            title: milestone.title,
            completed: milestone.completed,
            ...(completedAt ? { completedAt: completedAt.toISOString().split('T')[0] } : {}),
          };
        }),
        image: template.image,
      };
    });

    await Dream.bulkCreate(seededDreams);
    createdCount += seededDreams.length;
  }

  if (createdCount > 0) {
    console.log(`Seeded ${createdCount} default dreams ✅`);
  }
};

const ensureDefaultBlogs = async () => {
  const existingCount = await Blog.count();
  if (existingCount > 0) {
    return;
  }

  await Blog.bulkCreate([
    {
      title: 'The Science Behind Vision Boards: Why They Actually Work',
      content: 'Vision boards work because they keep your goals visible, reinforce attention, and make your next step easier to notice every day.\n\nA strong board is specific, emotional, and tied to action. Use it as a daily reminder, not a replacement for effort.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      isPublished: true,
    },
    {
      title: '5 Goal-Setting Frameworks Used by High Performers',
      content: 'Clear goals need structure. SMART goals, OKRs, backward planning, habit loops, and milestone reviews all help turn intention into execution.\n\nPick one framework and use it consistently for 30 days before switching.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
      isPublished: true,
    },
    {
      title: 'How Small Daily Habits Create Big Long-Term Results',
      content: 'Small habits compound. A 10-minute routine done consistently beats a perfect routine done occasionally.\n\nThe key is to make the habit obvious, easy, and rewarding so your future self keeps going.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop',
      isPublished: true,
    },
    {
      title: 'A Practical Morning Routine for Focus and Momentum',
      content: 'A good morning routine should reduce decision fatigue and create momentum early. Hydrate, move, review priorities, and complete one meaningful task before distractions begin.\n\nKeep it simple enough that you can repeat it on busy days.',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop',
      isPublished: true,
    },
  ]);

  console.log('Seeded default blogs ✅');
};

const ensureDefaultMentor = async () => {
  const mentorEmail = 'mentor@dreamcarta.in';
  const existingMentor = await User.findOne({ where: { email: mentorEmail } });

  if (!existingMentor) {
    await User.create({
      name: 'DreamCarta Mentor',
      email: mentorEmail,
      role: 'mentor',
      isActive: true,
    });
    console.log('Seeded default mentor ✅');
    return;
  }

  if (existingMentor.role !== 'mentor' || existingMentor.isActive === false) {
    existingMentor.role = 'mentor';
    existingMentor.isActive = true;
    await existingMentor.save();
    console.log('Normalized default mentor role/status ✅');
  }
};

const ensureDefaultCommunityPosts = async () => {
  const existingCount = await CommunityPost.count({ where: { isDeleted: false } });
  if (existingCount > 0) {
    return;
  }

  const authorUser = await User.findOne({ where: { email: 'test@gmail.com' } });

  await CommunityPost.bulkCreate([
    {
      userId: authorUser?.id || null,
      authorName: 'Priya Sharma',
      authorAvatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6133B4&color=fff',
      content: 'Launched my startup roadmap today. Small steps, daily focus, and consistent execution are finally turning dreams into action.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop',
      tags: ['manifestation', 'goalsetting'],
      likes: 124,
      comments: 18,
      shares: 7,
      isHighlighted: true,
      isModerated: true,
      isDeleted: false,
    },
    {
      userId: authorUser?.id || null,
      authorName: 'Arjun Reddy',
      authorAvatar: 'https://ui-avatars.com/api/?name=Arjun+Reddy&background=6133B4&color=fff',
      content: '90-day streak completed. The habit tracker is the first thing that actually kept me accountable every single day.',
      image: '',
      tags: ['habits', 'morningroutine'],
      likes: 98,
      comments: 12,
      shares: 4,
      isHighlighted: true,
      isModerated: true,
      isDeleted: false,
    },
    {
      userId: authorUser?.id || null,
      authorName: 'Meera Patel',
      authorAvatar: 'https://ui-avatars.com/api/?name=Meera+Patel&background=6133B4&color=fff',
      content: 'Built my weekly reset system around DreamCarta. Mindset + planning + consistency = real progress.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop',
      tags: ['mindset', 'fitness'],
      likes: 156,
      comments: 24,
      shares: 11,
      isHighlighted: false,
      isModerated: true,
      isDeleted: false,
    },
  ]);

  console.log('Seeded default community posts ✅');
};

const ensureDefaultActivities = async () => {
  const existingCount = await Activity.count();
  if (existingCount > 0) {
    return;
  }

  const testUser = await User.findOne({ where: { email: 'test@gmail.com' } });
  const adminUser = await User.findOne({ where: { email: 'admin@dreamcarta.in' } });
  const mentorUser = await User.findOne({ where: { role: 'mentor' } });

  const activitySeed = [];

  if (testUser) {
    activitySeed.push(
      {
        userId: testUser.id,
        type: 'goal_created',
        description: 'Created a new growth goal',
        metadata: { source: 'seed' },
      },
      {
        userId: testUser.id,
        type: 'habit_created',
        description: 'Added a morning meditation habit',
        metadata: { source: 'seed' },
      }
    );
  }

  if (mentorUser) {
    activitySeed.push({
      userId: mentorUser.id,
      type: 'mentor_update',
      description: 'Updated mentor dashboard message',
      metadata: { source: 'seed' },
    });
  }

  if (adminUser) {
    activitySeed.push({
      userId: adminUser.id,
      type: 'admin_update',
      description: 'Reviewed admin dashboard content',
      metadata: { source: 'seed' },
    });
  }

  if (activitySeed.length > 0) {
    await Activity.bulkCreate(activitySeed);
    console.log('Seeded default activities ✅');
  }
};


// ================== 🔥 MIDDLEWARE ==================

// ✅ CORS FIX (FINAL)
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dreamcarta.co.in',
  'https://www.dreamcarta.co.in'
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 🔥 IMPORTANT — handle preflight


// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// ================== 🔥 ROUTES ==================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/vision-board", visionBoardRoutes);
app.use("/api/dreams", dreamsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/admin/community", adminCommunityRoutes);
app.use("/api/admin/plans", adminPlanRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/mentors", adminMentorRoutes);
app.use("/api/admin/contacts", adminContactRoutes);
app.use("/api/activity", activityRoutes);


// ================== 🔥 ERROR HANDLER ==================

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON body ❌" });
  }
  next(err);
});


// ================== 🔥 DB INIT ==================

await connectDB();
await sequelize.sync();
await ensureUserAuthColumns();

console.log("Tables synced ✅");

// Create admin if not exists
await createAdmin();
await ensureSeedUser();
await ensureDemoUserAccount();
await ensureDemoMentorAccount();
await ensureDefaultPlans();
await ensureDefaultDreams();
await ensureDefaultReviews();
await ensureDefaultBlogs();
await ensureDefaultMentor();
await ensureDefaultCommunityPosts();
await ensureDefaultActivities();


// ================== 🔥 TEST ROUTE ==================

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});


// ================== 🔥 START SERVER ==================

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});