import { useState, useEffect } from 'react';
import { User } from '../../lib/mockData';
import { usersApi } from '../../lib/api';
import { Filter, User as UserIcon, Calendar, Search } from 'lucide-react';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

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

  const handleOperatorChange = (value: string) => {
    setFilters((prev) => ({ ...prev, operator: value }));
  };

  const handleFarmerNameChange = (value: string) => {
    setFilters((prev) => ({ ...prev, farmerName: value }));
  };

  const handleStartDateChange = (value: string) => {
    setFilters((prev) => ({ ...prev, startDate: value }));
  };

  const handleEndDateChange = (value: string) => {
    setFilters((prev) => ({ ...prev, endDate: value }));
  };

  return (
    <div className="backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-stone-800 bg-stone-900/90 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Filter Records
            </h3>
            <p className="text-xs text-stone-400">
              Filter bills by operator, farmer, or flight date
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operator Filter */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
            Operator
          </label>
          <select
            value={filters.operator}
            onChange={(e) => handleOperatorChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="" className="bg-stone-900 text-white">All Operators</option>
            {operators.map((op) => (
              <option key={op.id} value={op.name} className="bg-stone-900 text-white">
                {op.name}
              </option>
            ))}
          </select>
        </div>

        {/* Farmer Name Filter */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            Farmer Name
          </label>
          <input
            type="text"
            value={filters.farmerName}
            onChange={(e) => handleFarmerNameChange(e.target.value)}
            placeholder="Search by farmer name..."
            className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  );
}

export default BillFilters;