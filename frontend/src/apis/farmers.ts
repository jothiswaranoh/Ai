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

export interface PaginatedFarmersResponse {
    items: FarmerResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
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
    getAll: async (search?: string, page: number = 1, limit: number = 10): Promise<PaginatedFarmersResponse> => {
        const params = new URLSearchParams();
        const safeLimit = Math.min(limit || 10, 10);
        params.append('page', (page || 1).toString());
        params.append('limit', safeLimit.toString());
        if (search && search.trim()) params.append('search', search.trim());
        const queryString = params.toString();
        const response = await client.get<any>(`/farmers/${queryString ? `?${queryString}` : ''}`);

        if (response && Array.isArray(response.items)) {
            return {
                ...response,
                items: response.items.map(normalizeFarmer),
            };
        }
        const list = Array.isArray(response) ? response : [];
        return {
            items: list.map(normalizeFarmer),
            total: list.length,
            page: 1,
            limit: 10,
            total_pages: 1,
        };
    },

    getAllList: async (search?: string): Promise<FarmerResponse[]> => {
        const result = await farmersApi.getAll(search, 1, 10);
        return result.items;
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
