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

function normalizeFarmer(farmer: any): FarmerResponse {
    if (!farmer) return farmer;
    const resolvedId = farmer._id || farmer.id;
    return {
        ...farmer,
        _id: resolvedId,
        id: resolvedId,
    };
}

export const farmersApi = {
    getAll: async (search?: string): Promise<FarmerResponse[]> => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const response = await client.get<FarmerResponse[]>(`/farmers/${query}`);
        return (response || []).map(normalizeFarmer);
    },

    getById: async (id: string): Promise<FarmerResponse> => {
        const response = await client.get<FarmerResponse>(`/farmers/${id}`);
        return normalizeFarmer(response);
    },

    create: async (data: FarmerCreate): Promise<FarmerResponse> => {
        const response = await client.post<FarmerResponse>('/farmers/', data);
        return normalizeFarmer(response);
    },

    update: async (id: string, data: FarmerUpdate) => {
        return client.put(`/farmers/${id}`, data);
    },

    delete: async (id: string) => {
        return client.delete(`/farmers/${id}`);
    }
};
