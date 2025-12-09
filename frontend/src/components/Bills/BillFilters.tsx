import { useState, useEffect, useCallback } from 'react';
import { User } from '../../lib/mockData';
import { usersApi } from '../../lib/api';
import { Filter, User as UserIcon, Calendar, Search } from 'lucide-react';
import { theme } from '../../theme';

interface BillFiltersProps {
  onFilterChange: (filters: {
    operator: string;
    farmerName: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export function BillFilters({ onFilterChange }: BillFiltersProps) {
  const [operators, setOperators] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    operator: '',
    farmerName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadOperators();
  }, []);

  // Use useCallback to memoize filter updates
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [onFilterChange]);

  // Or alternatively, separate the filter state update from the callback
  useEffect(() => {
    // Debounce or throttle the filter changes if needed
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300); // Add a small delay for performance

    return () => clearTimeout(timer);
  }, [filters]); // Only depend on filters, not onFilterChange

  const loadOperators = async () => {
    try {
      const data = await usersApi.getOperators();
      setOperators(data);
    } catch (error) {
      console.error('Error loading operators:', error);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      operator: '',
      farmerName: '',
      startDate: '',
      endDate: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.operator || filters.farmerName || filters.startDate || filters.endDate;

  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: theme.colors.neutral.white,
  };

  // Update individual filter handlers
  const handleOperatorChange = (value: string) => {
    const newFilters = { ...filters, operator: value };
    setFilters(newFilters);
  };

  const handleFarmerNameChange = (value: string) => {
    const newFilters = { ...filters, farmerName: value };
    setFilters(newFilters);
  };

  const handleStartDateChange = (value: string) => {
    const newFilters = { ...filters, startDate: value };
    setFilters(newFilters);
  };

  const handleEndDateChange = (value: string) => {
    const newFilters = { ...filters, endDate: value };
    setFilters(newFilters);
  };

  return (
    <div
      className="backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          >
            <Filter className="w-5 h-5" style={{ color: theme.colors.primary.cyan[400] }} />
          </div>
          <div className="min-w-0">
            <h3
              className="text-base sm:text-lg font-semibold"
              style={{ color: theme.colors.neutral.white }}
            >
              Filters
            </h3>
            <p
              className="text-xs sm:text-sm truncate"
              style={{ color: 'rgba(207, 250, 254, 0.8)' }}
            >
              Filter bills by different criteria
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border whitespace-nowrap"
            style={{
              color: theme.colors.primary.cyan[300],
              borderColor: 'rgba(6, 182, 212, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Operator Filter */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: theme.colors.primary.cyan[100] }}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Operator</span>
          </label>
          <select
            value={filters.operator}
            onChange={(e) => handleOperatorChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all backdrop-blur-sm text-sm"
            style={{
              ...inputStyle,
              focusRing: `0 0 0 2px ${theme.colors.primary.cyan[400]}`
            }}
          >
            <option value="" className="bg-slate-800 text-white">All Operators</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id} className="bg-slate-800 text-white">
                {operator.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Farmer Name Filter */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: theme.colors.primary.cyan[100] }}
          >
            <Search className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Farmer Name</span>
          </label>
          <input
            type="text"
            value={filters.farmerName}
            onChange={(e) => handleFarmerNameChange(e.target.value)}
            placeholder="Search farmer..."
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all backdrop-blur-sm text-sm"
            style={inputStyle}
          />
        </div>

        {/* Start Date Filter */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: theme.colors.primary.cyan[100] }}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Start Date</span>
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all backdrop-blur-sm [color-scheme:dark] text-sm"
            style={inputStyle}
          />
        </div>

        {/* End Date Filter */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: theme.colors.primary.cyan[100] }}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-xs sm:text-sm">End Date</span>
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all backdrop-blur-sm [color-scheme:dark] text-sm"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div
          className="mt-4 flex items-center gap-2 text-xs sm:text-sm"
          style={{ color: theme.colors.primary.cyan[300] }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.colors.primary.cyan[400] }}
          />
          <span>Filters active - {Object.values(filters).filter(Boolean).length} applied</span>
        </div>
      )}
    </div>
  );
}