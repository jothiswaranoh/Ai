import { client } from './client';

export interface FarmerResponse {
    _id: string;
    id?: string;
    name: string;
    number: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

export interface FarmerCreate {
    name: string;
    number: string;
    location?: string;
}

export interface FarmerUpdate {
    name?: string;
    number?: string;
    location?: string;
}

export const farmersApi = {
    getAll: async (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const response = await client.get<FarmerResponse[]>(`/farmers/${query}`);
        return response.map(f => ({ ...f, id: f._id || f.id }));
    },

    getById: async (id: string) => {
        const response = await client.get<FarmerResponse>(`/farmers/${id}`);
        return { ...response, id: response._id || response.id };
    },

    create: async (data: FarmerCreate) => {
        return client.post<FarmerResponse>('/farmers/', data);
    },

    update: async (id: string, data: FarmerUpdate) => {
        return client.put(`/farmers/${id}`, data);
    },

    delete: async (id: string) => {
        return client.delete(`/farmers/${id}`);
    }
};
