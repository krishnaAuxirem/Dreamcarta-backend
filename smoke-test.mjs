import { Op } from 'sequelize';

const base = 'http://localhost:5000/api';
const ts = Date.now();

const loadModels = async () => {
  const [userModule, blogModule, communityModule, subscriptionModule, settingsModule] = await Promise.all([
    import('./src/models/User.js'),
    import('./src/models/Blog.js'),
    import('./src/models/CommunityPost.js'),
    import('./src/models/Subscription.js'),
    import('./src/models/UserSetting.js'),
  ]);

  return {
    User: userModule.default,
    Blog: blogModule.default,
    CommunityPost: communityModule.default,
    Subscription: subscriptionModule.default,
    UserSetting: settingsModule.default,
  };
};

const settingsPatch = {
  emailNotifications: false,
  goalReminders: false,
  habitReminders: true,
  weeklyReport: false,
  communityUpdates: true,
  marketingEmails: false,
  twoFactor: true,
  publicProfile: true,
  showGoals: false,
  showHabits: true,
  language: 'mr',
  timezone: 'Asia/Dubai',
  darkTheme: true,
  emailAlerts: false,
  twoFactorAuth: false,
};

const mentor = {
  name: 'Mentor QA',
  email: `mentor${ts}@test.com`,
  password: 'Mentor@123',
  role: 'mentor',
};

const user = {
  name: 'User QA',
  email: `user${ts}@test.com`,
  password: 'User@123',
  role: 'user',
};

const jsonHeaders = { 'Content-Type': 'application/json' };

const req = async (method, url, body, token) => {
  const headers = { ...jsonHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${base}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
};

const run = async () => {
  let adminToken;
  let userToken;
  let mentorToken;
  let createdPostId;
  let createdBlogId;
  let createdUserId;
  let createdMentorId;
  let createdSubscriptionId;
  let adminSettingsBefore = null;
  let userSettingsBefore = null;
  const { User, Blog, CommunityPost, Subscription, UserSetting } = await loadModels();

  const adminLogin = await req('POST', '/auth/login', {
    email: 'admin@dreamcarta.in',
    password: 'Admin@123',
    role: 'admin',
  });

  if (adminLogin.status !== 200) {
    console.log('admin login failed', adminLogin.status, adminLogin.data?.message);
    return;
  }

  adminToken = adminLogin.data.token;
  console.log('admin login', adminLogin.status);

  adminSettingsBefore = await req('GET', '/user/settings', undefined, adminToken);
  const adminSettingsUpdated = await req('PUT', '/user/settings', settingsPatch, adminToken);
  console.log('admin settings', adminSettingsBefore.status, adminSettingsUpdated.status);

  const adminUsers = await req('GET', '/admin/users', undefined, adminToken);
  console.log('admin users', adminUsers.status, 'count', adminUsers.data?.users?.length ?? 0);

  const adminPlans = await req('GET', '/admin/plans', undefined, adminToken);
  console.log('admin plans', adminPlans.status, 'count', adminPlans.data?.plans?.length ?? 0);

  const adminCommunity = await req('GET', '/admin/community', undefined, adminToken);
  console.log('admin community', adminCommunity.status);

  const mentorRegister = await req('POST', '/auth/register', mentor);
  console.log('mentor register', mentorRegister.status);
  createdMentorId = mentorRegister.data?.user?.id;

  const mentorLogin = await req('POST', '/auth/login', {
    email: mentor.email,
    password: mentor.password,
    role: 'mentor',
  });
  console.log('mentor login', mentorLogin.status);

  if (mentorLogin.status === 200) {
    mentorToken = mentorLogin.data.token;
    const mentorUsers = await req('GET', '/mentor/users', undefined, mentorToken);
    const mentorAnalytics = await req('GET', '/mentor/analytics', undefined, mentorToken);
    console.log('mentor users', mentorUsers.status, 'mentor analytics', mentorAnalytics.status);
  }

  const userRegister = await req('POST', '/auth/register', user);
  console.log('user register', userRegister.status);
  createdUserId = userRegister.data?.user?.id;

  const userLogin = await req('POST', '/auth/login', {
    email: user.email,
    password: user.password,
    role: 'user',
  });
  console.log('user login', userLogin.status);

  if (userLogin.status === 200) {
    userToken = userLogin.data.token;

    userSettingsBefore = await req('GET', '/user/settings', undefined, userToken);
    const userSettingsUpdated = await req('PUT', '/user/settings', settingsPatch, userToken);
    console.log('user settings', userSettingsBefore.status, userSettingsUpdated.status);

    const createdPost = await req('POST', '/community', { content: `QA post ${ts}`, tags: ['qa'] }, userToken);
    console.log('user create post', createdPost.status);

    createdPostId = createdPost.data?.post?.id;
    if (createdPostId) {
      const liked = await req('PATCH', `/community/${createdPostId}/like`, { action: 'like' }, userToken);
      const commented = await req('POST', `/community/${createdPostId}/comments`, { content: 'qa comment' }, userToken);
      console.log('user like/comment', liked.status, commented.status);
    }

    const plansPublic = await req('GET', '/plans');
    const firstPlanId = plansPublic.data?.plans?.[0]?.id;
    if (firstPlanId) {
      const subscribed = await req('POST', '/plans/subscribe', { planId: firstPlanId }, userToken);
      console.log('user subscribe', subscribed.status);
      createdSubscriptionId = subscribed.data?.subscription?.id;
    }
  }

  const createdBlog = await req('POST', '/admin/blogs', {
    title: `QA Blog ${ts}`,
    content: 'qa content',
    isPublished: true,
  }, adminToken);

  console.log('admin create blog', createdBlog.status);

  createdBlogId = createdBlog.data?.id || createdBlog.data?.blog?.id;
  if (createdBlogId) {
    const updatedBlog = await req('PUT', `/admin/blogs/${createdBlogId}`, { title: `QA Blog Updated ${ts}` }, adminToken);
    console.log('admin update blog', updatedBlog.status);
  }

  if (adminSettingsBefore?.status === 200 && adminSettingsBefore.data?.settings) {
    await req('PUT', '/user/settings', adminSettingsBefore.data.settings, adminToken);
  }
  if (userToken && userSettingsBefore?.status === 200 && userSettingsBefore.data?.settings) {
    await req('PUT', '/user/settings', userSettingsBefore.data.settings, userToken);
  }
  if (createdSubscriptionId) {
    await Subscription.destroy({ where: { id: createdSubscriptionId } });
  }

  const qaUsers = await User.findAll({
    where: {
      [Op.and]: [
        { email: { [Op.like]: '%@test.com' } },
        { email: { [Op.ne]: 'test@gmail.com' } },
      ],
    },
  });

  const qaUserIds = qaUsers.map((record) => record.id);
  if (qaUserIds.length > 0) {
    await Promise.all([
      Subscription.destroy({ where: { userId: { [Op.in]: qaUserIds } } }),
      UserSetting.destroy({ where: { userId: { [Op.in]: qaUserIds } } }),
      User.destroy({ where: { id: { [Op.in]: qaUserIds } } }),
    ]);
  }

  await Promise.all([
    Blog.destroy({ where: { title: { [Op.like]: 'QA Blog%' } } }),
    CommunityPost.destroy({ where: { content: { [Op.like]: 'QA post %' } } }),
  ]);

  if (createdMentorId) {
    await User.destroy({ where: { id: createdMentorId } });
  }
  if (createdUserId) {
    await User.destroy({ where: { id: createdUserId } });
  }
  if (createdBlogId) {
    await Blog.destroy({ where: { id: createdBlogId } });
  }
  if (createdPostId) {
    await CommunityPost.destroy({ where: { id: createdPostId } });
  }
  if (createdSubscriptionId) {
    await Subscription.destroy({ where: { id: createdSubscriptionId } });
  }
};

run().catch((error) => {
  console.error('smoke test script failed', error?.message || error);
  process.exitCode = 1;
});
