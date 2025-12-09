import { useState, useEffect, useMemo } from 'react';
import { FileText, DollarSign, TrendingUp, Calendar, AlertCircle, Download, RefreshCw, Search, Filter } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { BillTable } from '../components/Bills/BillTable';
import { BillFilters } from '../components/Bills/BillFilters';
import { BillEditModal } from '../components/Bills/BillEditModal';
import { BillViewModal } from '../components/Bills/BillViewModal';
import { BillingResponse, billsApi } from '../apis/billing';
import { theme } from '../theme';

export function AdminDashboard() {
  const [bills, setBills] = useState<BillingResponse[]>([]);
  const [filteredBills, setFilteredBills] = useState<BillingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingBill, setEditingBill] = useState<BillingResponse | null>(null);
  const [viewingBill, setViewingBill] = useState<BillingResponse | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<BillingResponse | null>(null);
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
      await loadBills(true); // Refresh with loading state
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

  // Calculate stats
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
      label: 'Total Amount',
      value: `₹${totalAmount.toLocaleString('en-IN')}`,
      sublabel: 'Lifetime earnings',
      color: theme.colors.primary.blue[400],
      bgColor: 'rgba(59, 130, 246, 0.15)',
    },
    {
      icon: Calendar,
      label: `${currentMonthName} Income`,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070)',
            filter: 'brightness(0.4) saturate(1.5)'
          }}
        />
        {/* Animated Particles */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-50 animate-float"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-50 animate-float"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              animationDelay: '700ms'
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-50 animate-float"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              animationDelay: '1000ms'
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div
              className="relative overflow-hidden backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border animate-fade-in"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                    >
                      Admin Dashboard
                    </h1>
                    <p
                      className="text-base sm:text-lg"
                      style={{ color: theme.colors.primary.cyan[100] }}
                    >
                      Manage all bills and operators efficiently
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadBills(true)}
                      disabled={refreshing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: theme.colors.neutral.white,
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(59, 130, 246, 0.9))',
                        color: theme.colors.neutral.white
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Quick Search */}
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search bills by farmer ID, amount, or ID..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: theme.colors.neutral.white,
                      focusRing: `0 0 0 2px ${theme.colors.primary.cyan[400]}`
                    }}
                  />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 group animate-slide-up"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium mb-1"
                      style={{ color: theme.colors.primary.cyan[100] }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 group-hover:text-cyan-300 transition-colors duration-300"
                      style={{ color: theme.colors.neutral.white }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(207, 250, 254, 0.6)' }}
                    >
                      {stat.sublabel}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: stat.bgColor,
                      boxShadow: `0 0 20px ${stat.color}40`
                    }}
                  >
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: theme.colors.neutral.white,
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
                {filteredBills.length} bills
              </span>
            </button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mb-6 animate-slide-down">
              <BillFilters onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Bills Table */}
          <div
            className="backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border animate-fade-in"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.15)'
            }}
          >
            {loading ? (
              <div className="py-16 sm:py-20 text-center">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0">
                    <div className="w-16 h-16 rounded-full animate-ping bg-cyan-500/30"></div>
                  </div>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                    style={{
                      borderColor: 'rgba(6, 182, 212, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <FileText className="w-8 h-8 animate-pulse"
                      style={{ color: theme.colors.primary.cyan[400] }} />
                  </div>
                </div>
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  Loading bills...
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'rgba(207, 250, 254, 0.6)' }}
                >
                  Please wait while we fetch your data
                </p>
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="py-16 sm:py-20 text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Search className="w-10 h-10" style={{ color: 'rgba(207, 250, 254, 0.4)' }} />
                </div>
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  No bills found
                </p>
                <p
                  className="text-sm max-w-md mx-auto mb-6"
                  style={{ color: 'rgba(207, 250, 254, 0.6)' }}
                >
                  {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters or search query'}
                </p>
                {(searchQuery || showFilters) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowFilters(false);
                      setFilteredBills(bills);
                    }}
                    className="px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: theme.colors.neutral.white,
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    Clear & Show All Bills
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="px-4 sm:px-6 py-4 border-b"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold" style={{ color: theme.colors.neutral.white }}>
                        Bills Overview
                      </h3>
                      <p className="text-sm mt-1" style={{ color: 'rgba(207, 250, 254, 0.6)' }}>
                        Showing {filteredBills.length} of {bills.length} bills
                        {searchQuery && ` for "${searchQuery}"`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300">
                        ₹{totalAmount.toLocaleString('en-IN')} total
                      </span>
                    </div>
                  </div>
                </div>
                <BillTable
                  bills={filteredBills}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </>
            )}
          </div>
        </div>

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div
              className="absolute inset-0 backdrop-blur-sm transition-opacity duration-300"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
              onClick={() => setDeleteModalOpen(false)}
            />

            <div
              className="relative backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border w-full max-w-md mx-auto animate-scale-in"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="p-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <AlertCircle className="w-6 h-6" style={{ color: theme.colors.semantic.error }} />
                </div>
                <h3
                  className="text-lg sm:text-xl font-bold text-center mb-2"
                  style={{ color: theme.colors.neutral.white }}
                >
                  Delete Bill
                </h3>
                <p
                  className="text-center text-sm mb-6"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  Are you sure you want to delete bill for <strong>{billToDelete.farmer_id}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: theme.colors.neutral.white,
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: theme.colors.neutral.white,
                      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add these CSS animations to your global styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}