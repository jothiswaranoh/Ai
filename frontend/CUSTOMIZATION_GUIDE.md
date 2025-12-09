# 🎨 Customizing Mock Data

This guide shows you how to customize the mock data for your needs.

## 📍 Where is the data?

All mock data is in: **`src/lib/mockData.ts`**

## 👥 Customizing Users

### Add a New User

```typescript
export const mockUsers: User[] = [
  // ... existing users
  {
    id: 'operator-003',  // Must be unique
    email: 'newoperator@shamuga.com',
    full_name: 'New Operator Name',
    role: 'operator',  // or 'admin'
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
];
```

### Change Default Password

```typescript
// Change this line:
export const MOCK_PASSWORD = 'password123';

// To your preferred password:
export const MOCK_PASSWORD = 'your_new_password';
```

## 📄 Customizing Bills

### Add More Sample Bills

```typescript
export const mockBills: Bill[] = [
  // ... existing bills
  {
    id: 'bill-006',  // Must be unique
    bill_number: 'BILL-2024-006',
    farmer_name: 'Your Farmer Name',
    archs: '7',
    time_duration: '3.5 hours',
    bill_amount: 1750,
    created_by: 'operator-001',  // Must match a user ID
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
  },
];
```

### Modify Existing Bills

Just edit the values in the mockBills array:

```typescript
{
  id: 'bill-001',
  bill_number: 'BILL-2024-001',
  farmer_name: 'Changed Name',        // ← Edit this
  archs: '10',                        // ← Edit this
  time_duration: '5 hours',           // ← Edit this
  bill_amount: 3000,                  // ← Edit this
  created_by: 'operator-001',
  created_at: '2024-03-15T10:30:00Z',
  updated_at: '2024-03-15T10:30:00Z',
}
```

## 🎯 Common Customizations

### Change Currency

In these files, change the currency code:

**File**: `src/components/Bills/BillTable.tsx`
```typescript
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',  // ← Change this (USD, EUR, GBP, etc.)
  }).format(amount);
};
```

**File**: `src/components/Bills/BillViewModal.tsx`
```typescript
// Same change as above
```

### Add More Fields to Bills

1. **Update the type** in `mockData.ts`:
```typescript
export type Bill = {
  id: string;
  bill_number: string;
  farmer_name: string;
  archs: string;
  time_duration: string;
  bill_amount: number;
  // Add new field:
  payment_status?: 'paid' | 'pending' | 'cancelled';
  notes?: string;
  // ... rest of fields
};
```

2. **Update mock data** to include new fields:
```typescript
export const mockBills: Bill[] = [
  {
    // ... existing fields
    payment_status: 'paid',
    notes: 'Payment received in full',
  },
];
```

3. **Update UI components** to display new fields

## 🔧 Advanced Customizations

### Load Different Data Sets

Create multiple data files:

```typescript
// mockData.test.ts - Test data
export const mockUsers = [/* minimal test users */];
export const mockBills = [/* minimal test bills */];

// mockData.production.ts - Production-like data
export const mockUsers = [/* many users */];
export const mockBills = [/* many bills */];
```

Then import the one you need:
```typescript
import { mockUsers, mockBills } from './mockData.test';
// or
import { mockUsers, mockBills } from './mockData.production';
```

### Generate Random Data

Add a utility function:

```typescript
// In mockData.ts
export function generateRandomBills(count: number, operatorId: string): Bill[] {
  const farmers = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown'];
  const bills: Bill[] = [];
  
  for (let i = 0; i < count; i++) {
    bills.push({
      id: `bill-${Date.now()}-${i}`,
      bill_number: `BILL-2024-${String(i).padStart(4, '0')}`,
      farmer_name: farmers[Math.floor(Math.random() * farmers.length)],
      archs: String(Math.floor(Math.random() * 10) + 1),
      time_duration: `${Math.floor(Math.random() * 5) + 1} hours`,
      bill_amount: Math.floor(Math.random() * 5000) + 500,
      created_by: operatorId,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return bills;
}

// Use it:
export const mockBills: Bill[] = [
  ...generateRandomBills(20, 'operator-001'),
  ...generateRandomBills(15, 'operator-002'),
];
```

### Import Data from JSON

1. **Create** `data.json`:
```json
{
  "users": [
    {
      "id": "user-001",
      "email": "user@example.com",
      ...
    }
  ],
  "bills": [...]
}
```

2. **Import** in mockData.ts:
```typescript
import data from './data.json';

export const mockUsers: User[] = data.users;
export const mockBills: Bill[] = data.bills;
```

## 💾 Persisting Data (Optional)

To save data between page refreshes:

**In** `src/lib/api.ts`:

```typescript
// Save to localStorage after changes
const saveBills = () => {
  localStorage.setItem('shamuga_bills', JSON.stringify(bills));
};

// Load from localStorage on startup
const loadBills = () => {
  const saved = localStorage.getItem('shamuga_bills');
  return saved ? JSON.parse(saved) : [...mockBills];
};

let bills: Bill[] = loadBills();

// Call saveBills() after create/update/delete:
export const billsApi = {
  async create(billData) {
    // ... create logic
    saveBills();
    return newBill;
  },
  // ... same for update/delete
};
```

## 🎓 Tips

1. **IDs must be unique** - Use meaningful prefixes (bill-, user-, operator-)
2. **created_by must match a user ID** - Or the bill won't have a creator
3. **Use ISO date strings** - Format: `2024-03-15T10:30:00Z`
4. **Test your changes** - Refresh the page after editing mockData.ts

## 🔄 Reset to Default

If you mess up, just restore the original mockData.ts from git:

```bash
git checkout src/lib/mockData.ts
```

Or copy from the backup if you made one!

---

Happy customizing! 🎉
