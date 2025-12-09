export type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'operator' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Bill = {
  id: string;
  bill_number: string;
  farmer_name: string;
  archs: string;
  time_duration: string;
  bill_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator?: User;
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-001',
    email: 'admin@shamuga.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'operator-001',
    email: 'operator1@shamuga.com',
    full_name: 'Operator One',
    role: 'operator',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'operator-002',
    email: 'operator2@shamuga.com',
    full_name: 'Operator Two',
    role: 'operator',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

// Mock Bills
export const mockBills: Bill[] = [
  {
    id: 'bill-001',
    bill_number: 'BILL-2024-001',
    farmer_name: 'Rajesh Kumar',
    archs: '5',
    time_duration: '2.5 hours',
    bill_amount: 1250,
    created_by: 'operator-001',
    created_at: '2024-03-15T10:30:00Z',
    updated_at: '2024-03-15T10:30:00Z',
  },
  {
    id: 'bill-002',
    bill_number: 'BILL-2024-002',
    farmer_name: 'Suresh Patel',
    archs: '8',
    time_duration: '4 hours',
    bill_amount: 2000,
    created_by: 'operator-001',
    created_at: '2024-03-16T14:20:00Z',
    updated_at: '2024-03-16T14:20:00Z',
  },
  {
    id: 'bill-003',
    bill_number: 'BILL-2024-003',
    farmer_name: 'Amit Singh',
    archs: '3',
    time_duration: '1.5 hours',
    bill_amount: 750,
    created_by: 'operator-002',
    created_at: '2024-03-17T09:15:00Z',
    updated_at: '2024-03-17T09:15:00Z',
  },
  {
    id: 'bill-004',
    bill_number: 'BILL-2024-004',
    farmer_name: 'Priya Sharma',
    archs: '10',
    time_duration: '5 hours',
    bill_amount: 2500,
    created_by: 'operator-002',
    created_at: '2024-03-18T11:45:00Z',
    updated_at: '2024-03-18T11:45:00Z',
  },
  {
    id: 'bill-005',
    bill_number: 'BILL-2024-005',
    farmer_name: 'Vijay Reddy',
    archs: '6',
    time_duration: '3 hours',
    bill_amount: 1500,
    created_by: 'operator-001',
    created_at: '2024-03-19T16:00:00Z',
    updated_at: '2024-03-19T16:00:00Z',
  },
];

// Default password for all mock users
export const MOCK_PASSWORD = 'password123';
