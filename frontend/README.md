# Shamuga Billing System

A clean, modern billing management system built with React, TypeScript, and mock data for demonstration purposes.

## 🚀 Features

- **Authentication System**: Role-based access control (Admin & Operator)
- **Bill Management**: Create, view, edit, and delete bills
- **Operator Management**: Admin can manage operator accounts
- **Filtering**: Advanced filtering for bills by operator, farmer name, and date range
- **Mock Data**: In-memory data storage for easy testing and development
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📦 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build Tool

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Bills/
│   │   ├── BillEditModal.tsx    # Edit bill modal
│   │   ├── BillFilters.tsx      # Filter bills by various criteria
│   │   ├── BillForm.tsx         # Create new bill form
│   │   ├── BillTable.tsx        # Display bills in table format
│   │   └── BillViewModal.tsx    # View bill details modal
│   ├── Layout/
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── ProtectedRoute.tsx   # Route authentication wrapper
│   └── UI/
│       ├── Button.tsx           # Reusable button component
│       ├── Card.tsx             # Reusable card component
│       └── Input.tsx            # Reusable input component
├── contexts/
│   └── AuthContext.tsx          # Authentication context & hooks
├── lib/
│   ├── api.ts                   # Mock API functions
│   └── mockData.ts              # Mock data & types
├── pages/
│   ├── AdminDashboard.tsx       # Admin dashboard view
│   ├── CreateBill.tsx           # Create bill page
│   ├── Login.tsx                # Login page
│   ├── ManageOperators.tsx      # Operator management page
│   └── OperatorDashboard.tsx    # Operator dashboard view
├── App.tsx                      # Main app component
├── main.tsx                     # App entry point
└── index.css                    # Global styles
```

## 🎯 Data Architecture

### Mock Data System

The application uses a clean mock data system with in-memory storage:

- **mockData.ts**: Defines types and initial mock data
- **api.ts**: Provides API-like functions for CRUD operations
- Simulates network delays for realistic UX
- Data persists during session (resets on refresh)

### Types

```typescript
type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'operator' | 'admin';
  created_at: string;
  updated_at: string;
};

type Bill = {
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
```

## 🔐 Authentication

### Demo Credentials

**Admin Account:**
- Email: `admin@shamuga.com`
- Password: `password123`

**Operator Accounts:**
- Email: `operator1@shamuga.com` / Password: `password123`
- Email: `operator2@shamuga.com` / Password: `password123`

### Roles & Permissions

**Admin:**
- View all bills from all operators
- Edit and delete any bill
- Filter bills by operator
- Manage operator accounts

**Operator:**
- View only their own bills
- Create new bills
- Cannot edit or delete bills
- Cannot access operator management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository
```bash
cd shamuga
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Start development server
```bash
npm run dev
# or
pnpm dev
```

4. Open browser to `http://localhost:5173`

## 📝 Usage

### Creating a Bill

1. Login as an operator
2. Click "Create New Bill" button
3. Fill in the form:
   - Farmer Name (required)
   - Archs
   - Time Duration
   - Bill Amount (required)
4. Submit to create bill

### Managing Bills (Admin)

1. Login as admin
2. View all bills in dashboard
3. Use filters to search by:
   - Operator
   - Farmer name
   - Date range
4. Click action buttons to:
   - View bill details (eye icon)
   - Edit bill (pencil icon)
   - Delete bill (trash icon)

### Managing Operators (Admin)

1. Login as admin
2. Navigate to "Manage Operators"
3. Click "Add Operator" button
4. Enter operator details:
   - Full Name
   - Email
5. New operator created with default password

## 🎨 Key Features

### Clean Code Architecture

- **Separation of Concerns**: Components, logic, and data are properly separated
- **Type Safety**: Full TypeScript coverage with strict types
- **Reusable Components**: UI components designed for reusability
- **Mock API Pattern**: API functions simulate real backend behavior

### User Experience

- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first approach
- **Intuitive Navigation**: Clear routing and navigation
- **Confirmation Dialogs**: Safety checks for destructive actions

### Performance

- **Code Splitting**: React lazy loading ready
- **Optimized Renders**: Proper use of React hooks
- **Efficient Filtering**: Client-side filtering with performance in mind

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

### Adding New Features

1. **Add types** in `mockData.ts`
2. **Create API functions** in `api.ts`
3. **Build components** in appropriate folders
4. **Create pages** if needed
5. **Update routing** in `App.tsx`

## 🎯 Future Enhancements

- Export bills to PDF/Excel
- Advanced analytics dashboard
- Real-time notifications
- Multi-language support
- Dark mode
- Bill templates
- Payment tracking

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React and TypeScript
