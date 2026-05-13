import apiClient from './client';

export interface AdminUserListItem {
	id: string;
	name: string;
	email: string;
	role: 'user' | 'mentor' | 'admin';
	joined: string;
	goals: number;
	habits: number;
	status: 'active' | 'inactive';
}

interface RawAdminUser {
	id?: string | number;
	_id?: string;
	uid?: string;
	name?: string;
	email?: string;
	role?: string;
	createdAt?: string;
	joinedAt?: string;
	goals?: number;
	habits?: number;
	status?: string;
	isActive?: boolean;
}

interface GetAdminUsersParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface CreateAdminUserPayload {
	name: string;
	email: string;
	password: string;
	role: 'user' | 'mentor' | 'admin';
	status?: 'active' | 'inactive';
}

export interface UpdateAdminUserPayload {
	name?: string;
	role?: 'user' | 'mentor' | 'admin';
	status?: 'active' | 'inactive';
}

export interface BlogItem {
	id: string;
	title: string;
	content: string;
	image?: string;
	isPublished?: boolean;
	createdAt?: string;
}

export interface CreateBlogPayload {
	title: string;
	content: string;
	image?: string;
	isPublished?: boolean;
}

export interface CommunityPostItem {
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
	isHighlighted?: boolean;
	isModerated?: boolean;
	createdAt: string;
}

export interface ReviewItem {
	id: string;
	author: string;
	title: string;
	content: string;
	rating: number;
	image?: string;
	isPublished?: boolean;
	createdAt?: string;
}

export interface ContactItem {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	createdAt: string;
}

export interface CreateReviewPayload {
	author: string;
	title: string;
	content: string;
	rating: number;
	image?: string;
	isPublished?: boolean;
}

export interface CreatePlanPayload {
	name: string;
	price: number;
	period: string;
	description: string;
	features: string[];
	highlighted?: boolean;
	badge?: string;
	isEnabled?: boolean;
}

export interface PlanItem {
	id: string;
	name: string;
	price: number;
	period: string;
	description: string;
	features: string[];
	highlighted: boolean;
	badge?: string;
	isEnabled: boolean;
	createdAt?: string;
}

export interface MentorAnalytics {
	totalUsers: number;
	activeUsers: number;
	mentors: number;
	engagement: number;
}

export interface AdminMentorItem {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	isActive: boolean;
	createdAt?: string;
	dashboardMessage: string;
	dashboardMessageUpdatedAt?: string;
	dashboardMessageUpdatedBy?: string;
}

const today = () => new Date().toISOString().split('T')[0];

const asString = (value: unknown, fallback = ''): string =>
	typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
	typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const unwrapList = (data: any): any[] => {
	if (Array.isArray(data)) {
		return data;
	}
	if (Array.isArray(data?.users)) {
		return data.users;
	}
	if (Array.isArray(data?.data)) {
		return data.data;
	}
	return [];
};

const unwrapOne = (data: any): any => data?.user ?? data?.data ?? data;

const mapBlogItem = (raw: any): BlogItem => ({
	id: String(raw?.id ?? raw?._id ?? ''),
	title: asString(raw?.title),
	content: asString(raw?.content),
	image: asString(raw?.image),
	isPublished: Boolean(raw?.isPublished ?? true),
	createdAt: asString(raw?.createdAt),
});

const mapBackendAdminUser = (raw: RawAdminUser): AdminUserListItem => {
	const statusFromText = asString(raw.status).toLowerCase();
	const computedStatus: 'active' | 'inactive' =
		raw.isActive === false || statusFromText === 'inactive' ? 'inactive' : 'active';

	return {
		id: String(raw.id ?? raw._id ?? raw.uid ?? ''),
		name: asString(raw.name, 'Unknown User'),
		email: asString(raw.email),
		role: raw.role === 'admin' ? 'admin' : raw.role === 'mentor' ? 'mentor' : 'user',
		joined: asString(raw.joinedAt ?? raw.createdAt, today()),
		goals: asNumber(raw.goals, 0),
		habits: asNumber(raw.habits, 0),
		status: computedStatus,
	};
};

const mapPlanItem = (raw: any): PlanItem => ({
	id: String(raw?.id ?? ''),
	name: asString(raw?.name, 'Plan'),
	price: asNumber(raw?.price, 0),
	period: asString(raw?.period, 'month'),
	description: asString(raw?.description),
	features: Array.isArray(raw?.features) ? raw.features.map((item: any) => String(item)) : [],
	highlighted: Boolean(raw?.highlighted),
	badge: asString(raw?.badge),
	isEnabled: Boolean(raw?.isEnabled ?? true),
	createdAt: asString(raw?.createdAt),
});

const mapCommunityPost = (raw: any): CommunityPostItem => ({
	id: String(raw?.id ?? ''),
	author: asString(raw?.author, 'Anonymous'),
	authorAvatar: asString(raw?.authorAvatar),
	content: asString(raw?.content),
	image: asString(raw?.image),
	likes: asNumber(raw?.likes, 0),
	comments: asNumber(raw?.comments, 0),
	shares: asNumber(raw?.shares, 0),
	liked: Boolean(raw?.liked),
	tags: Array.isArray(raw?.tags) ? raw.tags.map((item: any) => String(item)) : [],
	isHighlighted: Boolean(raw?.isHighlighted),
	isModerated: Boolean(raw?.isModerated),
	createdAt: asString(raw?.createdAt, new Date().toISOString()),
});

const mapReviewItem = (raw: any): ReviewItem => ({
	id: String(raw?.id ?? raw?._id ?? ''),
	author: asString(raw?.author, 'Anonymous'),
	title: asString(raw?.title),
	content: asString(raw?.content),
	rating: asNumber(raw?.rating, 5),
	image: asString(raw?.image),
	isPublished: Boolean(raw?.isPublished ?? true),
	createdAt: asString(raw?.createdAt),
});

const DEMO_REVIEWS: ReviewItem[] = [
	{
		id: '1',
		author: 'Priya Sharma',
		title: 'Transformed My Life',
		content: 'DreamCarta completely transformed my approach to goals. Within 6 months of using the platform, I launched my startup and landed my first ₹50L client. The vision board and AI coach are game-changers!',
		rating: 5,
		image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6133B4&color=fff',
		isPublished: true,
		createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '2',
		author: 'Arjun Reddy',
		title: 'Best Goal-Tracking Tool',
		content: 'I had dreams but no direction. DreamCarta gave me clarity and a structured path. The daily motivation feature kept me accountable. Got promoted to Senior Engineer in just 8 months!',
		rating: 5,
		image: 'https://ui-avatars.com/api/?name=Arjun+Reddy&background=6133B4&color=fff',
		isPublished: true,
		createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '3',
		author: 'Meera Patel',
		title: 'Fitness & Mindfulness Game Changer',
		content: 'The habit tracker helped me build a consistent fitness routine. Combined with the AI coach suggestions, I lost 12kg and built a thriving fitness coaching business. Highly recommend!',
		rating: 5,
		image: 'https://ui-avatars.com/api/?name=Meera+Patel&background=6133B4&color=fff',
		isPublished: true,
		createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '4',
		author: 'Ravi Kumar',
		title: 'Exceeded My CA Final Preparation',
		content: 'Used DreamCarta to track study habits and maintain focus during CA Final prep. The community support and mentor guidance were invaluable. Cleared all 4 groups in the first attempt!',
		rating: 5,
		image: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=6133B4&color=fff',
		isPublished: true,
		createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
	},
];

export const getAdminUsersApi = async (
	params: GetAdminUsersParams = {}
): Promise<AdminUserListItem[]> => {
	const response = await apiClient.get('/admin/users', { params });
	return unwrapList(response.data).map((item) => mapBackendAdminUser(item as RawAdminUser));
};

export const updateAdminUserStatusApi = async (
	userId: string,
	status: 'active' | 'inactive'
) => {
	const response = await apiClient.patch(`/admin/users/${userId}/status`, { status });
	return response.data;
};

export const updateAdminUserRoleApi = async (
	userId: string,
	role: 'user' | 'mentor' | 'admin'
) => {
	const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
	return response.data;
};

export const updateAdminUserApi = async (
	userId: string,
	payload: UpdateAdminUserPayload
) => {
	const response = await apiClient.patch(`/admin/users/${userId}`, payload);
	return response.data;
};

export const deleteAdminUserApi = async (userId: string) => {
	const response = await apiClient.delete(`/admin/users/${userId}`);
	return response.data;
};

export const createAdminUserApi = async (
	payload: CreateAdminUserPayload
): Promise<AdminUserListItem> => {
	const response = await apiClient.post('/admin/users', payload);
	return mapBackendAdminUser(unwrapOne(response.data) as RawAdminUser);
};

export const getAdminStatsApi = async () => {
  const response = await apiClient.get("/admin/stats");
  return response.data;
};

export const getContentApi = async () => {
  const res = await apiClient.get("/content");
  return res.data;
};

export const updateContentApi = async (data: any) => {
  const res = await apiClient.put("/content", data);
  return res.data;
};

export const getBlogsApi = async (): Promise<BlogItem[]> => {
	const response = await apiClient.get('/blogs');
	return unwrapList(response.data).map((item) => mapBlogItem(item));
};

export const getAdminBlogsApi = async (): Promise<BlogItem[]> => {
	const response = await apiClient.get('/admin/blogs');
	return unwrapList(response.data).map((item) => mapBlogItem(item));
};

export const createBlogApi = async (data: CreateBlogPayload): Promise<BlogItem> => {
	const response = await apiClient.post('/admin/blogs', data);
	return mapBlogItem(unwrapOne(response.data));
};

export const updateBlogApi = async (id: string, data: any) => {
	const res = await apiClient.put(`/admin/blogs/${id}`, data);
	return res.data;
};

export const deleteBlogApi = async (id: string) => {
	const response = await apiClient.delete(`/admin/blogs/${id}`);
	return response.data;
};

export const getCommunityPostsApi = async (): Promise<CommunityPostItem[]> => {
	const response = await apiClient.get('/community');
	return unwrapList(response.data?.posts ?? response.data).map((item) => mapCommunityPost(item));
};

export const createCommunityPostApi = async (payload: {
	content: string;
	image?: string;
	tags?: string[];
}) => {
	const response = await apiClient.post('/community', payload);
	return mapCommunityPost(response.data?.post ?? response.data);
};

export const likeCommunityPostApi = async (postId: string, action: 'like' | 'unlike' = 'like') => {
	const response = await apiClient.patch(`/community/${postId}/like`, { action });
	return mapCommunityPost(response.data?.post ?? response.data);
};

export const commentCommunityPostApi = async (postId: string, content: string) => {
	const response = await apiClient.post(`/community/${postId}/comments`, { content });
	return mapCommunityPost(response.data?.post ?? response.data);
};

export const getAdminCommunityPostsApi = async (): Promise<CommunityPostItem[]> => {
	const response = await apiClient.get('/admin/community');
	return unwrapList(response.data?.posts ?? response.data).map((item) => mapCommunityPost(item));
};

export const deleteAdminCommunityPostApi = async (postId: string) => {
	const response = await apiClient.delete(`/admin/community/${postId}`);
	return response.data;
};

export const highlightCommunityPostApi = async (postId: string) => {
	const response = await apiClient.patch(`/mentor/community/${postId}/highlight`);
	return mapCommunityPost(response.data?.post ?? response.data);
};

export const getPlansApi = async (): Promise<PlanItem[]> => {
	const response = await apiClient.get('/plans');
	return unwrapList(response.data?.plans ?? response.data).map((item) => mapPlanItem(item));
};

export const getAdminPlansApi = async (): Promise<PlanItem[]> => {
	const response = await apiClient.get('/admin/plans');
	return unwrapList(response.data?.plans ?? response.data).map((item) => mapPlanItem(item));
};

export const createPlanApi = async (payload: CreatePlanPayload): Promise<PlanItem> => {
	const response = await apiClient.post('/admin/plans', payload);
	return mapPlanItem(response.data?.plan ?? response.data);
};

export const updatePlanApi = async (planId: string, payload: Partial<CreatePlanPayload>) => {
	const response = await apiClient.put(`/admin/plans/${planId}`, payload);
	return mapPlanItem(response.data?.plan ?? response.data);
};

export const subscribePlanApi = async (planId: string) => {
	const response = await apiClient.post('/plans/subscribe', { planId });
	return response.data;
};

export const getMentorUsersApi = async (): Promise<AdminUserListItem[]> => {
	const response = await apiClient.get('/mentor/users');
	return unwrapList(response.data?.users ?? response.data).map((item) => mapBackendAdminUser(item));
};

export const getAdminMentorsApi = async (): Promise<AdminMentorItem[]> => {
	const response = await apiClient.get('/admin/mentors');
	return unwrapList(response.data).map((raw: any) => ({
		id: String(raw?.id ?? raw?._id ?? ''),
		name: asString(raw?.name, 'Unknown Mentor'),
		email: asString(raw?.email),
		avatar: asString(raw?.avatar),
		isActive: Boolean(raw?.isActive ?? true),
		createdAt: asString(raw?.createdAt),
		dashboardMessage: asString(raw?.dashboardMessage),
		dashboardMessageUpdatedAt: asString(raw?.dashboardMessageUpdatedAt),
		dashboardMessageUpdatedBy: asString(raw?.dashboardMessageUpdatedBy),
	}));
};

export const updateAdminMentorDashboardApi = async (mentorId: string, message: string) => {
	const response = await apiClient.put(`/admin/mentors/${mentorId}/dashboard`, { message });
	return response.data;
};

export const getAdminMentorDashboardApi = async (mentorId: string) => {
	const response = await apiClient.get(`/admin/mentors/${mentorId}/dashboard`);
	return response.data;
};

export const getMentorAnalyticsApi = async (): Promise<MentorAnalytics> => {
	const response = await apiClient.get('/mentor/analytics');
	return {
		totalUsers: asNumber(response.data?.totalUsers, 0),
		activeUsers: asNumber(response.data?.activeUsers, 0),
		mentors: asNumber(response.data?.mentors, 0),
		engagement: asNumber(response.data?.engagement, 0),
	};
};

export const getAdminReviewsApi = async (): Promise<ReviewItem[]> => {
	try {
		const response = await apiClient.get('/admin/reviews');
		const reviews = unwrapList(response.data).map((item) => mapReviewItem(item));
		return reviews.length > 0 ? reviews : DEMO_REVIEWS;
	} catch {
		// Fallback to demo data if API unavailable
		return DEMO_REVIEWS;
	}
};

export const createReviewApi = async (data: CreateReviewPayload): Promise<ReviewItem> => {
	try {
		const response = await apiClient.post('/admin/reviews', data);
		return mapReviewItem(unwrapOne(response.data));
	} catch {
		// Fallback: simulate review creation with unique ID
		const newReview: ReviewItem = {
			id: `demo_${Date.now()}`,
			author: data.author,
			title: data.title,
			content: data.content,
			rating: data.rating,
			image: data.image,
			isPublished: data.isPublished ?? true,
			createdAt: new Date().toISOString(),
		};
		return newReview;
	}
};

export const updateReviewApi = async (id: string, data: Partial<CreateReviewPayload>) => {
	try {
		const response = await apiClient.put(`/admin/reviews/${id}`, data);
		return mapReviewItem(unwrapOne(response.data));
	} catch {
		// Fallback: return updated review object
		return {
			id,
			author: data.author || 'Anonymous',
			title: data.title || '',
			content: data.content || '',
			rating: data.rating ?? 5,
			image: data.image,
			isPublished: data.isPublished ?? true,
			createdAt: new Date().toISOString(),
		};
	}
};

export const deleteReviewApi = async (id: string) => {
	try {
		const response = await apiClient.delete(`/admin/reviews/${id}`);
		return response.data;
	} catch {
		// Fallback: simulate successful deletion
		return { success: true, id };
	}
};

export const getAllActivityApi = async (type?: string, limit: number = 100) => {
	const params: any = { limit };
	if (type) {
		params.type = type;
	}
	const requestConfig: any = {
		params,
		__noRetry: true,
	};
	const response = await apiClient.get('/activity/all', requestConfig);
	return response.data;
};

export const getUserMentionsApi = async () => {
	const response = await apiClient.get('/activity/mentions/my');
	return response.data;
};

export const markMentionAsReadApi = async (mentionId: string) => {
	const response = await apiClient.patch(`/activity/mentions/${mentionId}/read`);
	return response.data;
};

export const getAdminContactsApi = async (): Promise<ContactItem[]> => {
	const response = await apiClient.get('/admin/contacts');
	return unwrapList(response.data?.contacts ?? response.data).map((item: any) => ({
		id: String(item?.id ?? item?._id ?? ''),
		name: asString(item?.name, 'Unknown'),
		email: asString(item?.email, ''),
		subject: asString(item?.subject, ''),
		message: asString(item?.message, ''),
		createdAt: asString(item?.createdAt, new Date().toISOString()),
	}));
};

export const deleteAdminContactApi = async (id: string) => {
	const response = await apiClient.delete(`/admin/contacts/${id}`);
	return response.data;
};