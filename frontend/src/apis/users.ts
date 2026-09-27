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

function normalizeUser(user: any): UserResponse {
    if (!user) return user;
    const resolvedId = user._id || user.id;
    let roleId = user.role_id;
    if (typeof roleId === 'string') {
        const lower = roleId.toLowerCase();
        roleId = (lower === '1' || lower === 'admin' || lower === 'administrator') ? 1 : 2;
    } else if (typeof roleId !== 'number') {
        const roleStr = String(user.role || '').toLowerCase();
        roleId = (roleStr === 'admin' || roleStr === '1') ? 1 : 2;
    }
    return {
        ...user,
        _id: resolvedId,
        id: resolvedId,
        name: user.name || user.full_name || (user.email ? user.email.split('@')[0] : 'User'),
        role_id: roleId,
        is_active: user.is_active !== undefined ? Boolean(user.is_active) : true,
    };
}

export interface PaginatedUsersResponse {
    items: UserResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export const usersApi = {
    getAll: async (page: number = 1, limit: number = 10, search?: string, role_id?: number): Promise<PaginatedUsersResponse> => {
        const params = new URLSearchParams();
        const safeLimit = Math.min(limit || 10, 10);
        params.append('page', (page || 1).toString());
        params.append('limit', safeLimit.toString());
        if (search && search.trim()) params.append('search', search.trim());
        if (role_id !== undefined && role_id !== null) params.append('role_id', role_id.toString());
        const queryString = params.toString();
        const response = await client.get<any>(`/users/${queryString ? `?${queryString}` : ''}`);

        if (response && Array.isArray(response.items)) {
            return {
                ...response,
                items: response.items.map(normalizeUser),
            };
        }
        const list = Array.isArray(response) ? response : [];
        return {
            items: list.map(normalizeUser),
            total: list.length,
            page: 1,
            limit: 10,
            total_pages: 1,
        };
    },

    getAllList: async (): Promise<UserResponse[]> => {
        const res = await usersApi.getAll(1, 10);
        return res.items;
    },

    getById: async (id: string): Promise<UserResponse> => {
        const response = await client.get<UserResponse>(`/users/${id}`);
        return normalizeUser(response);
    },

    create: async (data: UserCreate): Promise<UserResponse> => {
        const response = await client.post('/users/', data);
        return normalizeUser(response);
    },

    update: async (id: string, data: UserUpdate) => {
        return client.put(`/users/${id}`, data);
    },

    delete: async (id: string) => {
        return client.delete(`/users/${id}`);
    },

    resetPassword: async (id: string, newPassword: string) => {
        return client.post(`/users/${id}/reset-password`, { new_password: newPassword });
    },

    getOperators: async (): Promise<UserResponse[]> => {
        try {
            const res = await usersApi.getAll(1, 10, undefined, 2);
            return res.items;
        } catch (e) {
            // Fallback: try fetching page 1 and filter role_id === 2
            try {
                const res = await usersApi.getAll(1, 10);
                return res.items.filter((user: UserResponse) => user.role_id === 2);
            } catch {
                return [];
            }
        }
    }
};
