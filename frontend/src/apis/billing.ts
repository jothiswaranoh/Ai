import { client } from './client';

export interface BillingResponse {
    _id: string;
    id?: string;
    farmer_id: string;
    farmer_name?: string;
    farmer_number?: string;
    operator_id: string;
    operator_name?: string;
    drone_id: string;
    acres: number;
    time: number;
    amount: number;
    mode_type: 'cash' | 'upi';
    created_at: string;
    updated_at: string | null;
    created_by: string | null;
}

export interface PaginatedBillingResponse {
    items: BillingResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface BillingStatsResponse {
    total_bills: number;
    total_revenue: number;
    total_acres: number;
    total_time: number;
    avg_bill_amount?: number;
    monthly_bills?: number;
    monthly_revenue?: number;
}

export interface BillingCreate {
    farmer_id: string;
    operator_id?: string;
    drone_id?: string;
    acres?: number;
    time?: number | string;
    amount: number;
    mode_type: 'cash' | 'upi';
}

function normalizeBill(bill: any): BillingResponse {
    if (!bill) return bill;
    const resolvedId = bill._id || bill.id;
    return {
        ...bill,
        _id: resolvedId,
        id: resolvedId,
    };
}

export const billsApi = {
    create: async (data: BillingCreate): Promise<BillingResponse> => {
        const response = await client<BillingResponse>('/billing/', { body: data });
        return normalizeBill(response);
    },

    // Get bills with pagination and optional filtering (max 10 per page)
    getAll: async (filters?: {
        farmer_id?: string;
        operator_id?: string;
        drone_id?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedBillingResponse> => {
        const params = new URLSearchParams();
        const page = (filters && filters.page) || 1;
        const safeLimit = Math.min((filters && filters.limit) || 10, 10);
        params.append('page', page.toString());
        params.append('limit', safeLimit.toString());

        if (filters) {
            if (filters.farmer_id) params.append('farmer_id', filters.farmer_id);
            if (filters.operator_id) params.append('operator_id', filters.operator_id);
            if (filters.drone_id) params.append('drone_id', filters.drone_id);
        }
        const queryString = params.toString();
        const response = await client<any>(`/billing/${queryString ? `?${queryString}` : ''}`);

        if (response && Array.isArray(response.items)) {
            return {
                ...response,
                items: response.items.map(normalizeBill),
            };
        }
        const list = Array.isArray(response) ? response : [];
        return {
            items: list.map(normalizeBill),
            total: list.length,
            page: 1,
            limit: 10,
            total_pages: 1,
        };
    },

    getStats: async (operatorId?: string): Promise<BillingStatsResponse> => {
        const query = operatorId ? `?operator_id=${encodeURIComponent(operatorId)}` : '';
        return client<BillingStatsResponse>(`/billing/stats${query}`);
    },

    getById: async (id: string): Promise<BillingResponse> => {
        const response = await client<BillingResponse>(`/billing/${id}`);
        return normalizeBill(response);
    },

    update: (id: string, data: Partial<BillingCreate>) => client(`/billing/${id}`, {
        method: 'PUT',
        body: data
    }),

    delete: (id: string) => client(`/billing/${id}`, { method: 'DELETE' }),
};
