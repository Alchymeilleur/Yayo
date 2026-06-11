import api from '@/utils/api';
import { AuthResponse, User } from '@/types';
import Cookies from 'js-cookie';

export const authService = {
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    Cookies.set('authToken', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    Cookies.set('authToken', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    return response.data;
  },

  async logout(): Promise<void> {
    Cookies.remove('authToken');
    Cookies.remove('user');
    await api.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, new_password: newPassword });
  },

  getCurrentUser(): User | null {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return Cookies.get('authToken') || null;
  },
};
