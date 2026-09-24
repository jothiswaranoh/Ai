import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  Download,
  RefreshCw,
  Search,
  Filter,
  Plus,
  UserCheck,
  Users
} from 'lucide-react';
import { Sidebar, AdminTab } from '../components/Layout/Sidebar';
import { BillTable } from '../components/Bills/BillTable';
import { BillFilters } from '../components/Bills/BillFilters';
import { BillEditModal } from '../components/Bills/BillEditModal';
import { BillViewModal } from '../components/Bills/BillViewModal';
import { BillForm } from '../components/Bills/BillForm';
import { FarmersList } from '../components/Farmers/FarmersList';
import { UserManagement } from '../components/Users/UserManagement';
import { BillingResponse, billsApi } from '../apis/billing';
import { theme } from '../theme';

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current URL path
  const activeTab: AdminTab = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.startsWith('/farmers')) return 'farmers';
    if (path.startsWith('/users') || path.startsWith('/operators')) return 'users';
    if (path.startsWith('/bills')) return 'bills';
    return 'dashboard';
  }, [location.pathname]);

  const handleTabChange = (tab: AdminTab) => {
    switch (tab) {
      case 'farmers':
        navigate('/farmers');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'bills':
        navigate('/bills');
        break;
      case 'dashboard':
      default:
        navigate('/admin');
        break;
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bills, setBills] = useState<BillingResponse[]>([]);
  const [filteredBills, setFilteredBills] = useState<BillingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingBill, setEditingBill] = useState<BillingResponse | null>(null);
  const [viewingBill, setViewingBill] = useState<BillingResponse | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<BillingResponse | null>(null);
  const [createBillModalOpen, setCreateBillModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await billsApi.getAll();
      setBills(data);
      setFilteredBills(data);
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = useMemo(() => (filters: {
    operator: string;
    farmerName: string;
    startDate: string;
    endDate: string;
  }) => {
    let filtered = [...bills];

    if (filters.operator) {
      filtered = filtered.filter((bill) => bill.operator_id === filters.operator);
    }

    if (filters.farmerName) {
      filtered = filtered.filter((bill) =>
        bill.farmer_id.toLowerCase().includes(filters.farmerName.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (bill) => new Date(bill.created_at) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((bill) => new Date(bill.created_at) <= endDate);
    }

    setFilteredBills(filtered);
    setSearchQuery('');
  }, [bills]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredBills(bills);
      return;
    }

    const filtered = bills.filter((bill) =>
      bill.farmer_id.toLowerCase().includes(query) ||
      bill._id.toLowerCase().includes(query) ||
      bill.amount.toString().includes(query)
    );
    setFilteredBills(filtered);
  };

  const handleEdit = (bill: BillingResponse) => {
    setEditingBill(bill);
  };

  const handleView = (bill: BillingResponse) => {
    setViewingBill(bill);
  };

  const handleDelete = async (bill: BillingResponse) => {
    setBillToDelete(bill);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!billToDelete) return;

    try {
      await billsApi.delete(billToDelete._id);
      await loadBills(true);
      setDeleteModalOpen(false);
      setBillToDelete(null);
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill. Please try again.');
    }
  };

  const handleUpdateSuccess = () => {
    setEditingBill(null);
    loadBills(true);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Farmer ID', 'Amount', 'Operator ID', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredBills.map(bill => [
        bill._id,
        bill.farmer_id,
        bill.amount,
        bill.operator_id,
        new Date(bill.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Stats calculation
  const { totalBills, totalAmount, avgAmount, monthlyIncome, monthlyBillCount, currentMonthName } = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    const monthlyBills = bills.filter(bill => {
      const billDate = new Date(bill.created_at);
      return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyBills.reduce((sum, bill) => sum + bill.amount, 0);
    const monthlyBillCount = monthlyBills.length;

    return {
      totalBills: filteredBills.length,
      totalAmount: filteredBills.reduce((sum, bill) => sum + bill.amount, 0),
      avgAmount: filteredBills.length > 0 ? filteredBills.reduce((sum, bill) => sum + bill.amount, 0) / filteredBills.length : 0,
      monthlyIncome,
      monthlyBillCount,
      currentMonthName: monthNames[currentMonth]
    };
  }, [filteredBills, bills]);

  const stats = [
    {
      icon: FileText,
      label: 'Total Bills',
      value: totalBills.toLocaleString('en-IN'),
      sublabel: `${bills.length} total records`,
      color: theme.colors.primary.cyan[400],
      bgColor: 'rgba(6, 182, 212, 0.15)',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `₹${totalAmount.toLocaleString('en-IN')}`,
      sublabel: 'Lifetime earnings',
      color: theme.colors.primary.blue[400],
      bgColor: 'rgba(59, 130, 246, 0.15)',
    },
    {
      icon: Calendar,
      label: `${currentMonthName} Revenue`,
      value: `₹${monthlyIncome.toLocaleString('en-IN')}`,
      sublabel: `${monthlyBillCount} bills this month`,
      color: theme.colors.primary.indigo[400],
      bgColor: 'rgba(99, 102, 241, 0.15)',
    },
    {
      icon: TrendingUp,
      label: 'Average Bill',
      value: `₹${avgAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sublabel: 'Per transaction',
      color: theme.colors.accent.teal[400],
      bgColor: 'rgba(20, 184, 166, 0.15)',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex">
      {/* Background Graphic */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070)',
            filter: 'brightness(0.4) saturate(1.5)'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 relative z-10 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Banner */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent mb-2">
                      Admin Command Center
                    </h1>
                    <p className="text-cyan-100/80 text-sm sm:text-base">
                      Overview of operations, billings, farmers, and user metrics
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setCreateBillModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Create Bill
                    </button>
                    <button
                      onClick={() => loadBills(true)}
                      disabled={refreshing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/15 shadow-xl hover:border-cyan-400/40 hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: stat.bgColor }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                      <span className="text-xs text-cyan-200/60 font-medium">{stat.sublabel}</span>
                    </div>
                    <p className="text-cyan-200/80 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => handleTabChange('bills')}
                  className="cursor-pointer bg-gradient-to-br from-cyan-950/60 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all shadow-xl group"
                >
                  <FileText className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-1">Manage All Bills</h3>
                  <p className="text-cyan-200/70 text-sm mb-4">View, edit, filter, or export complete billing transactions.</p>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Bills &rarr;
                  </span>
                </div>

                <div
                  onClick={() => handleTabChange('farmers')}
                  className="cursor-pointer bg-gradient-to-br from-blue-950/60 to-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400 transition-all shadow-xl group"
                >
                  <UserCheck className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-1">Farmers Directory</h3>
                  <p className="text-cyan-200/70 text-sm mb-4">Browse farmer contacts, add new farmers, and track records.</p>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Farmers &rarr;
                  </span>
                </div>

                <div
                  onClick={() => handleTabChange('users')}
                  className="cursor-pointer bg-gradient-to-br from-indigo-950/60 to-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 hover:border-indigo-400 transition-all shadow-xl group"
                >
                  <Users className="w-8 h-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-1">User Management</h3>
                  <p className="text-cyan-200/70 text-sm mb-4">Add new operators, manage user roles, and control access.</p>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Manage Users &rarr;
                  </span>
                </div>
              </div>

              {/* Recent Bills Preview Table */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Recent Billing Transactions</h3>
                  <button
                    onClick={() => handleTabChange('bills')}
                    className="text-cyan-400 text-sm font-semibold hover:underline"
                  >
                    View All Bills ({bills.length}) &rarr;
                  </button>
                </div>
                <BillTable
                  bills={bills.slice(0, 5)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </div>
            </div>
          )}

          {/* TAB 2: ALL BILLS LIST */}
          {activeTab === 'bills' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-7 h-7 text-cyan-400" />
                    All Billing Records
                  </h2>
                  <p className="text-cyan-200/80 text-sm">Comprehensive list of all drone operation bills</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCreateBillModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Bill
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Hide Filters' : 'Filters'}
                  </button>
                </div>
              </div>

              {/* Quick Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search bills by farmer, amount, or ID..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
                />
              </div>

              {showFilters && (
                <div className="animate-slide-down">
                  <BillFilters onFilterChange={handleFilterChange} />
                </div>
              )}

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                {loading ? (
                  <div className="py-20 text-center text-cyan-200">
                    <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading bills...
                  </div>
                ) : filteredBills.length === 0 ? (
                  <div className="py-20 text-center text-cyan-200/60">
                    No bills found.
                  </div>
                ) : (
                  <BillTable
                    bills={filteredBills}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FARMERS LIST */}
          {activeTab === 'farmers' && (
            <div className="animate-fade-in">
              <FarmersList />
            </div>
          )}

          {/* TAB 4: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="animate-fade-in">
              <UserManagement />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {editingBill && (
        <BillEditModal
          bill={editingBill}
          onClose={() => setEditingBill(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {viewingBill && (
        <BillViewModal bill={viewingBill} onClose={() => setViewingBill(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && billToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Delete Bill Record?</h3>
            <p className="text-cyan-200/80 text-sm">
              Are you sure you want to delete bill for <strong>{billToDelete.farmer_id}</strong>? Action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {createBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl my-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setCreateBillModalOpen(false)}
                className="text-white/70 hover:text-white bg-white/10 px-3 py-1 rounded-lg text-sm"
              >
                Close
              </button>
            </div>
            <BillForm
              onSuccess={() => {
                setCreateBillModalOpen(false);
                loadBills(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}