import { Edit2, Trash2, Eye } from 'lucide-react';
import { BillingResponse } from '../../apis/billing';
import { useAuth } from '../../hooks/useAuth';

interface BillTableProps {
  bills: BillingResponse[];
  onEdit?: (bill: BillingResponse) => void;
  onDelete?: (bill: BillingResponse) => void;
  onView?: (bill: BillingResponse) => void;
}

export function BillTable({ bills, onEdit, onDelete, onView }: BillTableProps) {
  const { isAdmin } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (bills.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <p className="text-white/60">No bills found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto backdrop-blur-sm rounded-xl border border-white/20">
        <table className="min-w-full">
          <thead className="bg-white/10 border-b border-white/20">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                Farmer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                Acres
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                Duration (Hrs)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                Mode
              </th>
              {isAdmin && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Operator ID
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                Date
              </th>
              {isAdmin && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {bills.map((bill) => (
              <tr
                key={bill._id}
                className="hover:bg-white/5 transition-all duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-white">
                    {bill.farmer_id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-white">
                    {bill.acres}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-white/80">
                    {bill.time || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-cyan-400">
                    {formatAmount(bill.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-white/80 uppercase">
                    {bill.mode_type}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white/80">
                      {bill.operator_id}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-white/70">
                    {formatDate(bill.created_at)}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(bill)}
                          className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 transition-all duration-200 hover:scale-105"
                          title="View Bill"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(bill)}
                          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 border border-blue-400/30 transition-all duration-200 hover:scale-105"
                          title="Edit Bill"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(bill)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-400/30 transition-all duration-200 hover:scale-105"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">
                  {bill.farmer_id}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {formatDate(bill.created_at)}
                </p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-lg font-bold text-cyan-400">
                  {formatAmount(bill.amount)}
                </p>
                {bill.time && (
                  <p className="text-xs text-white/50 mt-1">
                    {bill.time} hrs
                  </p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                  Acres
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {bill.acres}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                  Mode
                </p>
                <p className="text-sm font-medium text-white truncate uppercase">
                  {bill.mode_type}
                </p>
              </div>
              {isAdmin && (
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                    Operator ID
                  </p>
                  <p className="text-sm text-white/80 truncate">
                    {bill.operator_id}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            {isAdmin && (
              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                {onView && (
                  <button
                    onClick={() => onView(bill)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/30 text-cyan-400 transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(bill)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 text-blue-400 transition-all duration-200 hover:scale-105"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(bill)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/30 text-red-400 transition-all duration-200 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
