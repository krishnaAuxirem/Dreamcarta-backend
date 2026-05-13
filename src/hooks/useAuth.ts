import { useEffect, useState } from 'react';
import axios from 'axios';
import { getIdToken, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import type { User } from '@/types';
import { firebaseLoginApi, loginApi, registerApi } from '@/lib/api/authApi';
import { deleteProfileApi, getProfileApi, updateProfileApi } from '@/lib/api/userApi';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import {
	AUTH_UNAUTHORIZED_EVENT_NAME,
	AUTH_CHANGED_EVENT_NAME,
	clearSession,
	emitAuthChanged,
	getAuthToken,
	getStoredUser,
	mapBackendUserToFrontend,
	saveSession,
	setStoredUser,
} from '@/lib/auth/session';

interface ApiUserResponse {
	id?: string | number;
	uid?: string;
	name?: string;
	email?: string;
	role?: 'user' | 'mentor' | 'admin' | string;
	profilePic?: string;
	avatar?: string;
	profession?: string;
	bio?: string;
	createdAt?: string;
	goals?: number;
	habits?: number;
	streak?: number;
}

interface LoginApiResponse {
	token: string;
	user: ApiUserResponse;
}

interface AuthActionResult {
	success: boolean;
	role?: 'user' | 'mentor' | 'admin';
	error?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null;
};

const isValidApiUser = (value: unknown): value is ApiUserResponse => {
	if (!isObject(value)) {
		return false;
	}
	const hasId = typeof value.id === 'string' || typeof value.id === 'number' || typeof value.uid === 'string';
	const hasName = typeof value.name === 'string';
	const hasEmail = typeof value.email === 'string';
	return hasId && hasName && hasEmail;
};

const isValidLoginResponse = (value: unknown): value is LoginApiResponse => {
	if (!isObject(value)) {
		return false;
	}
	return typeof value.token === 'string' && isValidApiUser(value.user);
};

const unwrapLoginResponse = (value: unknown): unknown => {
	if (!isObject(value)) {
		return value;
	}
	if (isObject(value.data)) {
		return value.data;
	}
	return value;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
	if (
		isObject(error) &&
		typeof error.code === 'string' &&
		error.code.startsWith('auth/')
	) {
		switch (error.code) {
			case 'auth/configuration-not-found':
				return 'Firebase Authentication configuration not found for this API key/project. Verify Firebase project config and enabled sign-in providers.';
			case 'auth/invalid-credential':
			case 'auth/wrong-password':
			case 'auth/user-not-found':
				return 'Invalid email or password';
			case 'auth/too-many-requests':
				return 'Too many login attempts. Try again in a few minutes.';
			case 'auth/popup-closed-by-user':
				return 'Google sign-in popup was closed before completion.';
			case 'auth/popup-blocked':
				return 'Popup was blocked by browser. Allow popups and try again.';
			case 'auth/unauthorized-domain':
				return 'This domain is not authorized in Firebase Auth settings.';
			case 'auth/operation-not-allowed':
				return 'Requested sign-in method is not enabled in Firebase Authentication.';
			case 'auth/account-exists-with-different-credential':
				return 'Account exists with a different sign-in method.';
			default:
				return `${fallback} (${error.code})`;
		}
	}

	if (axios.isAxiosError(error)) {
		if (!error.response) {
			return 'Cannot connect to server. Please check backend/API URL.';
		}

		const responseData = error.response.data;
		if (isObject(responseData)) {
			const message = responseData.message;
			if (typeof message === 'string' && message.trim()) {
				return message;
			}
		}
	}

	if (error instanceof Error && error.message.trim()) {
		return error.message;
	}

	return fallback;
};

const hasValidProfileResponse = (value: unknown): value is { user: ApiUserResponse } => {
	if (!isObject(value)) {
		return false;
	}
	return isValidApiUser(value.user);
};

interface UseAuthResult {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string, role?: 'user' | 'mentor' | 'admin') => Promise<AuthActionResult>;
	loginWithGoogle: () => Promise<AuthActionResult>;
	register: (
		name: string,
		email: string,
		password: string,
		options?: { role?: 'user' | 'mentor' | 'admin' }
	) => Promise<AuthActionResult>;
	logout: () => void;
	isAuthenticated: boolean;
	isAdmin: boolean;
	setUser?: (user: User) => void;
	updateProfile?: (updates: {
		name?: string;
		email?: string;
		profilePic?: string;
		profession?: string;
		bio?: string;
	}) => Promise<boolean>;
	deleteProfile?: () => Promise<boolean>;
}

export function useAuth(): UseAuthResult {
	const [user, setUserState] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			const storedUser = getStoredUser();
			setUserState(storedUser);

			const token = getAuthToken();
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const response = await getProfileApi();
				if (!hasValidProfileResponse(response)) {
					throw new Error('Malformed profile response');
				}
				const mappedUser = mapBackendUserToFrontend(response.user);
				setStoredUser(mappedUser);
				setUserState(mappedUser);
			} catch {
				clearSession();
				setUserState(null);
			} finally {
				setLoading(false);
			}
		};

		const syncAuthState = () => {
			setUserState(getStoredUser());
		};

		const handleUnauthorized = () => {
			setUserState(null);
			const currentPath = window.location.pathname;
			if (currentPath !== '/login' && currentPath !== '/register') {
				window.location.assign('/login');
			}
		};

		void initAuth();
		window.addEventListener(AUTH_CHANGED_EVENT_NAME, syncAuthState);
		window.addEventListener(AUTH_UNAUTHORIZED_EVENT_NAME, handleUnauthorized);

		return () => {
			window.removeEventListener(AUTH_CHANGED_EVENT_NAME, syncAuthState);
			window.removeEventListener(AUTH_UNAUTHORIZED_EVENT_NAME, handleUnauthorized);
		};
	}, []);

	const login = async (
		email: string,
		password: string,
		role?: 'user' | 'mentor' | 'admin'
	): Promise<AuthActionResult> => {
		try {
			const response = unwrapLoginResponse(await loginApi({ email, password, role }));

			if (!isValidLoginResponse(response)) {
				return {
					success: false,
					error: 'Unexpected login response from server.',
				};
			}

			const mappedUser = mapBackendUserToFrontend(response.user);
			saveSession(response.token, mappedUser);
			setUserState(mappedUser);
			return { success: true, role: mappedUser.role };
		} catch (error) {
			return {
				success: false,
				error: getErrorMessage(error, 'Invalid email or password'),
			};
		}
	};

	const loginWithGoogle = async (): Promise<AuthActionResult> => {
		if (!isFirebaseConfigured()) {
			return {
				success: false,
				error: 'Firebase auth is not configured properly.',
			};
		}

		try {
			const auth = getFirebaseAuth();
			if (!auth) {
				return {
					success: false,
					error: 'Firebase auth is not configured properly.',
				};
			}

			const provider = new GoogleAuthProvider();
			const credential = await signInWithPopup(auth, provider);
			const firebaseIdToken = await getIdToken(credential.user, true);
			const response = unwrapLoginResponse(await firebaseLoginApi(firebaseIdToken));

			if (!isValidLoginResponse(response)) {
				return {
					success: false,
					error: 'Unexpected login response from server.',
				};
			}

			const mappedUser = mapBackendUserToFrontend(response.user);
			saveSession(response.token, mappedUser);
			setUserState(mappedUser);
			return { success: true, role: mappedUser.role };
		} catch (error) {
			return {
				success: false,
				error: getErrorMessage(error, 'Google sign-in failed. Please try again.'),
			};
		}
	};

	const register = async (
		name: string,
		email: string,
		password: string,
		options?: { role?: 'user' | 'mentor' | 'admin' }
	): Promise<AuthActionResult> => {
		try {
			await registerApi({
				name,
				email,
				password,
				role: options?.role,
			});
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: getErrorMessage(error, 'Registration failed. Please try again.'),
			};
		}
	};

	const logout = () => {
		clearSession();
		setUserState(null);
	};

	const setUser = (updated: User) => {
		setStoredUser(updated);
		emitAuthChanged();
		setUserState(updated);
	};

	const updateProfile = async (updates: {
		name?: string;
		email?: string;
		profilePic?: string;
		profession?: string;
		bio?: string;
	}): Promise<boolean> => {
		try {
			const response = await updateProfileApi(updates);
			if (!hasValidProfileResponse(response)) {
				return false;
			}
			const mappedUser = mapBackendUserToFrontend(response.user);
			const current = getStoredUser();
			if (current) {
				mappedUser.name = updates.name ?? response.user.name ?? current.name;
				mappedUser.email = updates.email ?? response.user.email ?? current.email;
				mappedUser.avatar = updates.profilePic ?? response.user.profilePic ?? response.user.avatar ?? current.avatar;
				mappedUser.profession = updates.profession ?? response.user.profession ?? current.profession;
				mappedUser.bio = updates.bio ?? response.user.bio ?? current.bio;
			}
			setStoredUser(mappedUser);
			emitAuthChanged();
			setUserState(mappedUser);
			return true;
		} catch {
			return false;
		}
	};

	const deleteProfile = async (): Promise<boolean> => {
		try {
			await deleteProfileApi();
			clearSession();
			setUserState(null);
			return true;
		} catch {
			return false;
		}
	};

	return {
		user,
		loading,
		login,
		loginWithGoogle,
		register,
		logout,
		isAuthenticated: !!user,
		isAdmin: user?.role === 'admin',
		setUser,
		updateProfile,
		deleteProfile,
	};
}