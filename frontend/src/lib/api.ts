import axios from 'axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  OnboardingData, 
  DashboardData,
  Feedback,
  User,
  UserPreferences
} from '@crypto-dashboard/shared';
import { useAuthStore } from './auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Get token from Zustand store instead of localStorage
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 errors for authenticated requests (not login attempts)
    if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
    useAuthStore.getState().logout();
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data.data.user;
  },
};

// Onboarding API
export const onboardingAPI = {
  savePreferences: async (data: OnboardingData): Promise<UserPreferences> => {
    const response = await api.post('/api/onboarding/preferences', data);
    return response.data.data.preferences;
  },

  getPreferences: async (): Promise<UserPreferences | null> => {
    const response = await api.get('/api/onboarding/preferences');
    return response.data.data.preferences;
  },

  checkStatus: async (): Promise<{ hasCompletedOnboarding: boolean }> => {
    const response = await api.get('/api/onboarding/status');
    return response.data.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getData: async (): Promise<DashboardData> => {
    const response = await api.get('/api/dashboard');
    return response.data.data;
  },

  submitFeedback: async (data: Feedback): Promise<void> => {
    await api.post('/api/dashboard/feedback', data);
  },



  getChartData: async (coinId: string, days: number): Promise<any> => {
    const response = await api.get(`/api/dashboard/chart-data/${coinId}?days=${days}`);
    return response.data.data;
  },

  getMeme: async (category?: string, tags?: string[]): Promise<any> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (tags && tags.length > 0) params.append('tags', tags.join(','));
    
    const response = await api.get(`/api/dashboard/meme?${params.toString()}`);
    return response.data.data;
  },

  getRedditStatus: async (): Promise<any> => {
    const response = await api.get('/api/dashboard/reddit-status');
    return response.data.data;
  },
};

export default api;
