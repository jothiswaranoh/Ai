# 🚀 Quick Start Guide - Shamuga Billing System

## ⚡ Get Started in 2 Minutes

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

### 4. Login with Demo Credentials

**Admin Account** (Full Access):
```
Email: admin@shamuga.com
Password: password123
```

**Operator Account** (Limited Access):
```
Email: operator1@shamuga.com
Password: password123
```

## 🎮 What Can You Do?

### As Admin 👨‍💼
- ✅ View ALL bills from all operators
- ✅ Edit any bill
- ✅ Delete any bill  
- ✅ Filter bills by operator/farmer/date
- ✅ Create new operators
- ✅ View operator list

### As Operator 👷
- ✅ View only YOUR bills
- ✅ Create new bills
- ❌ Cannot edit or delete bills
- ❌ Cannot manage operators

## 📝 Quick Actions

### Create a Bill
1. Login as operator
2. Click "Create New Bill"
3. Fill form:
   - Farmer Name: John Doe
   - Archs: 5
   - Time Duration: 2 hours
   - Bill Amount: 1500
4. Click "Create Bill"

### Filter Bills (Admin Only)
1. Login as admin
2. Use filter boxes:
   - Select an operator
   - Type farmer name
   - Pick date range
3. Bills auto-filter!

### Add Operator (Admin Only)
1. Login as admin
2. Go to "Manage Operators"
3. Click "Add Operator"
4. Enter:
   - Full Name: Jane Smith
   - Email: jane@shamuga.com
5. Click "Create Operator"
6. Default password: `password123`

## 🎯 Project Features

✨ **Mock Data System**
- No backend needed
- Data in memory
- Resets on refresh

✨ **Clean Code**
- TypeScript types
- Organized structure
- Easy to understand

✨ **Modern UI**
- Responsive design
- Loading states
- Error messages

## 📂 Key Files

```
src/
├── lib/
│   ├── mockData.ts    ← Mock users & bills
│   └── api.ts         ← Mock API functions
├── pages/
│   ├── Login.tsx              ← Login page
│   ├── AdminDashboard.tsx     ← Admin view
│   ├── OperatorDashboard.tsx  ← Operator view
│   ├── CreateBill.tsx         ← Create bill
│   └── ManageOperators.tsx    ← Manage operators
└── contexts/
    └── AuthContext.tsx ← Authentication
```

## 🔧 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check code quality
npm run typecheck    # Check TypeScript
```

## 💡 Tips

1. **Data resets on refresh** - This is intentional!
2. **All passwords** are `password123` for demo
3. **Admin sees everything**, operators see only their bills
4. **Check the console** for API call logs

## 🐛 Troubleshooting

**Can't login?**
- Make sure you're using correct email format
- Password is: `password123`

**No bills showing?**
- Operators only see their own bills
- Try creating a new bill

**Changes not persisting?**
- Data is in-memory only
- Reloads will reset data

## 📚 Learn More

- Check `README.md` for detailed documentation
- See `REFACTORING_SUMMARY.md` for technical details
- Explore `src/lib/mockData.ts` to modify mock data

## 🎉 You're Ready!

Now go ahead and explore the application. Have fun! 🚀

---

Need help? Check the console logs or review the component files.
