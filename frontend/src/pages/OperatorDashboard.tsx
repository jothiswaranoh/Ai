import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { BillTable } from '../components/Bills/BillTable';
import { BillingResponse, billsApi } from '../apis/billing';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';

export function OperatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState<BillingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, [user]);

  const loadBills = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Backend handles permission check. If operator, they only get their own bills anyway.
      // But we can explicitely filter if we want to be safe or if the API requires it.
      // The updated backend router logic handles "if not admin -> restrict to self".
      // But passing operator_id is fine too.
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
      color: theme.colors.primary.cyan[400],
      bgColor: 'rgba(6, 182, 212, 0.2)',
      badgeColor: theme.colors.primary.cyan[300],
      badgeBg: 'rgba(6, 182, 212, 0.2)',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      sublabel: 'Lifetime earnings',
      badge: 'Revenue',
      color: theme.colors.primary.blue[400],
      bgColor: 'rgba(59, 130, 246, 0.2)',
      badgeColor: theme.colors.primary.blue[300],
      badgeBg: 'rgba(59, 130, 246, 0.2)',
    },
    {
      icon: Calendar,
      label: 'This Month',
      value: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
      sublabel: `${monthlyBillCount} bills this month`,
      badge: currentMonthName,
      color: theme.colors.primary.indigo[400],
      bgColor: 'rgba(99, 102, 241, 0.2)',
      badgeColor: theme.colors.primary.indigo[300],
      badgeBg: 'rgba(99, 102, 241, 0.2)',
    },
    {
      icon: TrendingUp,
      label: 'Avg Bill Amount',
      value: `₹${avgBillAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sublabel: 'Per transaction',
      badge: 'Average',
      color: theme.colors.accent.teal[400],
      bgColor: 'rgba(20, 184, 166, 0.2)',
      badgeColor: theme.colors.accent.teal[300],
      badgeBg: 'rgba(20, 184, 166, 0.2)',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070)',
            filter: 'brightness(0.4)'
          }}
        />
        <div
          className="absolute inset-0"
        />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              animationDelay: '700ms'
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              animationDelay: '1000ms'
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Hero Section */}
          <div className="mb-6 sm:mb-8">
            <div
              className="relative overflow-hidden backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
                  >
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: theme.colors.primary.cyan[400] }} />
                  </div>
                  <div className="min-w-0">
                    <h1
                      className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2"
                      style={{ color: theme.colors.neutral.white }}
                    >
                      My Bills
                    </h1>
                    <p
                      className="text-sm sm:text-base lg:text-lg truncate"
                      style={{ color: theme.colors.primary.cyan[100] }}
                    >
                      Welcome back, <span className="font-semibold">{user?.full_name || 'Operator'}</span>!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/bills/new')}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 w-full lg:w-auto whitespace-nowrap"
                  style={{
                    background: theme.gradients.primary,
                    color: theme.colors.neutral.white
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Create New Bill</span>
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      color: stat.badgeColor,
                      backgroundColor: stat.badgeBg
                    }}
                  >
                    {stat.badge}
                  </span>
                </div>
                <h3
                  className="text-xs sm:text-sm font-medium mb-1"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  {stat.label}
                </h3>
                <p
                  className="text-xl sm:text-2xl lg:text-3xl font-bold"
                  style={{ color: theme.colors.neutral.white }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs mt-1 sm:mt-2"
                  style={{ color: 'rgba(207, 250, 254, 0.8)' }}
                >
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>

          {/* Bills Table Section */}
          <div
            className="backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Header */}
            <div
              className="px-4 sm:px-6 py-4 border-b"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.primary.cyan[400] }} />
                </div>
                <div>
                  <h2
                    className="text-base sm:text-lg lg:text-xl font-bold"
                    style={{ color: theme.colors.neutral.white }}
                  >
                    Recent Bills
                  </h2>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: 'rgba(207, 250, 254, 0.8)' }}
                  >
                    View and manage all your created bills
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="py-12 sm:py-16 text-center">
                <div className="relative inline-flex">
                  <div
                    className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                  <div
                    className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-transparent absolute top-0 left-0"
                    style={{ borderColor: theme.colors.primary.cyan[400] }}
                  />
                </div>
                <p
                  className="mt-4 sm:mt-6 font-medium"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  Loading bills...
                </p>
              </div>
            ) : bills.length === 0 ? (
              <div className="py-12 sm:py-16 text-center px-4">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
                >
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: theme.colors.primary.cyan[400] }} />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: theme.colors.neutral.white }}
                >
                  No bills yet
                </h3>
                <p
                  className="mb-6 text-sm sm:text-base"
                  style={{ color: 'rgba(207, 250, 254, 0.8)' }}
                >
                  Create your first bill to get started with billing
                </p>
                <button
                  onClick={() => navigate('/bills/new')}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
                  style={{
                    background: theme.gradients.primary,
                    color: theme.colors.neutral.white
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Your First Bill
                </button>
              </div>
            ) : (
              <BillTable bills={bills} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
