import { User, Bill, mockUsers, mockBills, MOCK_PASSWORD } from './mockData';

// In-memory storage for runtime data
let users: User[] = [...mockUsers];
let bills: Bill[] = mockBills.map(bill => ({
  ...bill,
  creator: users.find(u => u.id === bill.created_by)
}));

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await delay();
    
    const user = users.find(u => u.email === email);
    
    if (!user || password !== MOCK_PASSWORD) {
      return { user: null, error: 'Invalid email or password' };
    }
    
    return { user, error: null };
  },
};

// Bills API
export const billsApi = {
  async getAll(): Promise<Bill[]> {
    await delay();
    return bills.map(bill => ({
      ...bill,
      creator: users.find(u => u.id === bill.created_by)
    }));
  },

  async getByOperator(operatorId: string): Promise<Bill[]> {
    await delay();
    return bills
      .filter(bill => bill.created_by === operatorId)
      .map(bill => ({
        ...bill,
        creator: users.find(u => u.id === bill.created_by)
      }));
  },

  async create(billData: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'creator'>): Promise<Bill> {
    await delay();
    
    const newBill: Bill = {
      ...billData,
      id: generateId('bill'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator: users.find(u => u.id === billData.created_by)
    };
    
    bills.push(newBill);
    return newBill;
  },

  async update(id: string, updates: Partial<Bill>): Promise<Bill | null> {
    await delay();
    
    const index = bills.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    bills[index] = {
      ...bills[index],
      ...updates,
      updated_at: new Date().toISOString(),
      creator: users.find(u => u.id === bills[index].created_by)
    };
    
    return bills[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    
    const index = bills.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    bills.splice(index, 1);
    return true;
  },
};

// Users/Operators API
export const usersApi = {
  async getAll(): Promise<User[]> {
    await delay();
    return [...users];
  },

  async getOperators(): Promise<User[]> {
    await delay();
    return users.filter(u => u.role === 'operator');
  },

  async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    await delay();
    
    const newUser: User = {
      ...userData,
      id: generateId('user'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    users.push(newUser);
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    await delay();
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return users[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    // Don't allow deleting users who have bills
    const hasBills = bills.some(b => b.created_by === id);
    if (hasBills) return false;
    
    users.splice(index, 1);
    return true;
  },
};
