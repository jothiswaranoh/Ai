import { client } from './client';

export interface UserResponse {
    _id?: string;
    id?: string; // Handle both _id and id for compatibility
    name: string;
    email: string;
    role_id: number;
    is_active: boolean;
    created_at?: string; // Optional as backend might not return it in all responses yet or needs aggregation
}

export interface UserCreate {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

export interface UserUpdate {
    name?: string;
    email?: string;
    role_id?: number;
    is_active?: boolean;
}

export const usersApi = {
    getAll: async () => {
        const response = await client.get<UserResponse[]>('/users/');
        return response.map(user => ({
            ...user,
            id: user._id || user.id // Normalize ID
        }));
    },

    getById: async (id: string) => {
        const response = await client.get<UserResponse>(`/users/${id}`);
        return {
            ...response,
            id: response._id || response.id
        };
    },

    create: async (data: UserCreate) => {
        // Creating a user (operator) uses the register endpoint
        return client.post('/auth/register', data);
    },

    update: async (id: string, data: UserUpdate) => {
        return client.put(`/users/${id}`, data);
    },

    delete: async (id: string) => {
        return client.delete(`/users/${id}`);
    },

    getOperators: async () => {
        const response = await client.get<UserResponse[]>('/users/');
        const allUsers = response.map(user => ({
            ...user,
            id: user._id || user.id
        }));
        return allUsers.filter(user => user.role_id === 2); // Assuming role_id 2 is Operator
    }
};
