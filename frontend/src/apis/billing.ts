import { client } from './client';

export interface BillingResponse {
    _id: string;
    farmer_id: string; // Storing farmer name here for now since we don't have a farmers collection
    operator_id: string;
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
    operator_id: string;
    drone_id: string;
    acres: number;
    time: number;
    amount: number;
    mode_type: 'cash' | 'upi';
}

export const billsApi = {
    create: (data: BillingCreate) => client('/billing/', { body: data }),

    // Get all bills (with optional filtering)
    getAll: (filters?: { farmer_id?: string; operator_id?: string; drone_id?: string }) => {
        const params = new URLSearchParams();
        if (filters) {
            if (filters.farmer_id) params.append('farmer_id', filters.farmer_id);
            if (filters.operator_id) params.append('operator_id', filters.operator_id);
            if (filters.drone_id) params.append('drone_id', filters.drone_id);
        }
        const queryString = params.toString();
        return client(`/billing/${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id: string) => client(`/billing/${id}`),

    update: (id: string, data: Partial<BillingCreate>) => client(`/billing/${id}`, {
        method: 'PUT',
        body: data
    }),

    delete: (id: string) => client(`/billing/${id}`, { method: 'DELETE' }),
};
