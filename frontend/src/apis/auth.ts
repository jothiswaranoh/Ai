import { client } from './client';
import { User } from '../lib/mockData'; // Using mockData User type for now, or we can define a shared type

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
    user_id: string;
}

export const authApi = {
    login: (data: any) => client('/auth/login', { body: data }),
    register: (data: any) => client('/auth/register', { body: data }),
    getProfile: () => client('/users/me'),
    forgotPassword: (email: string) => client('/auth/forgot-password', { body: { email } }),
    resetPassword: (data: any) => client('/auth/reset-password', { body: data }),
    changePassword: (data: any) => client('/auth/change-password', { body: data }),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('shamuga_user');
    },
};
