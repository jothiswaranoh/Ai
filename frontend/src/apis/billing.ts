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

    // Get all bills (with optional filtering)
    getAll: async (filters?: { farmer_id?: string; operator_id?: string; drone_id?: string }): Promise<BillingResponse[]> => {
        const params = new URLSearchParams();
        if (filters) {
            if (filters.farmer_id) params.append('farmer_id', filters.farmer_id);
            if (filters.operator_id) params.append('operator_id', filters.operator_id);
            if (filters.drone_id) params.append('drone_id', filters.drone_id);
        }
        const queryString = params.toString();
        const response = await client<BillingResponse[]>(`/billing/${queryString ? `?${queryString}` : ''}`);
        return (response || []).map(normalizeBill);
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
