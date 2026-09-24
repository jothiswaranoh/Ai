import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, DollarSign, TrendingUp, Calendar, Sprout } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { BillTable } from '../components/Bills/BillTable';
import { BillForm } from '../components/Bills/BillForm';
import { BillingResponse, billsApi } from '../apis/billing';
import { useAuth } from '../hooks/useAuth';

export function OperatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState<BillingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadBills();
  }, [user]);

  const loadBills = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await billsApi.getAll({ operator_id: user.id });
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate operator stats
  const totalBills = bills.length;
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const avgBillAmount = totalBills > 0 ? totalRevenue / totalBills : 0;

  // Get current month stats
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyBills = bills.filter(bill => {
    const billDate = new Date(bill.created_at);
    return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
  });

  const monthlyRevenue = monthlyBills.reduce((sum, bill) => sum + bill.amount, 0);
  const monthlyBillCount = monthlyBills.length;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentMonth];

  const stats = [
    {
      icon: FileText,
      label: 'Total Bills',
      value: totalBills,
      sublabel: 'Bills created by you',
      badge: 'All Time',
      color: '#34d399',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#6ee7b7',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      sublabel: 'Lifetime earnings',
      badge: 'Revenue',
      color: '#4ade80',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      badgeColor: '#86efac',
      badgeBg: 'rgba(34, 197, 94, 0.2)',
    },
    {
      icon: Calendar,
      label: 'This Month',
      value: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
      sublabel: `${monthlyBillCount} bills this month`,
      badge: currentMonthName,
      color: '#fbbf24',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#fde68a',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
    },
    {
      icon: TrendingUp,
      label: 'Avg Bill Amount',
      value: `₹${avgBillAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sublabel: 'Per transaction',
      badge: 'Average',
      color: '#2dd4bf',
      bgColor: 'rgba(20, 184, 166, 0.15)',
      badgeColor: '#99f6e4',
      badgeBg: 'rgba(20, 184, 166, 0.2)',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Graphic */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: 'url(/images/hero-drone.jpg)',
            filter: 'brightness(0.3) saturate(1.2)'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Hero Section */}
          <div className="mb-6 sm:mb-8">
            <div className="relative overflow-hidden backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900/85 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 shadow-md shadow-emerald-950/50">
                    <Sprout className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                      Pilot Flight Records
                    </h1>
                    <p className="text-sm text-stone-300">
                      Welcome back, <span className="font-semibold text-emerald-400">{user?.full_name || 'Drone Pilot'}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3 font-bold rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Bill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-xl rounded-2xl shadow-xl p-5 sm:p-6 border border-stone-800 bg-stone-900/80 hover:border-emerald-500/30 transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border border-white/5"
                    style={{
                      color: stat.badgeColor,
                      backgroundColor: stat.badgeBg
                    }}
                  >
                    {stat.badge}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  {stat.label}
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>

          {/* Bills Table Section */}
          <div className="backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-800 bg-stone-900/80">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Recent Billing Records
                  </h2>
                  <p className="text-xs text-stone-400">
                    Showing your logged agricultural spray jobs
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="py-16 text-center text-emerald-400">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium">Loading bills...</p>
              </div>
            ) : bills.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <FileText className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <p className="text-base font-semibold text-white">No bills created yet</p>
                <p className="text-xs mt-1">Click "Create New Bill" above to record your first farm spray job.</p>
              </div>
            ) : (
              <BillTable bills={bills} />
            )}
          </div>
        </div>
      </div>

      {/* Create Bill Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl my-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-stone-400 hover:text-white bg-stone-800 px-3.5 py-1.5 rounded-xl text-sm border border-stone-700 cursor-pointer"
              >
                Close
              </button>
            </div>
            <BillForm
              onSuccess={() => {
                setCreateModalOpen(false);
                loadBills();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
