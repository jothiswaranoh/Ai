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
      <div className="text-center py-12 bg-stone-900/40 backdrop-blur-sm rounded-2xl border border-stone-800">
        <p className="text-stone-400">No bills found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-stone-800">
        <table className="min-w-full">
          <thead className="bg-stone-950/80 border-b border-stone-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Farmer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Acres
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Duration (Hrs)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Mode
              </th>
              {isAdmin && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Operator ID
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Date
              </th>
              {(isAdmin || onView) && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {bills.map((bill) => (
              <tr
                key={bill._id}
                className="hover:bg-stone-800/40 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {bill.farmer_name || bill.farmer_id}
                    </span>
                    {bill.farmer_number && (
                      <span className="text-xs text-stone-400 font-mono block">
                        {bill.farmer_number}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-stone-200">
                    {bill.acres} Acres
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-stone-300 font-mono">
                    {bill.time || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {formatAmount(bill.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    {bill.mode_type}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-stone-400">
                      {bill.operator_name || bill.operator_id}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs text-stone-400">
                    {formatDate(bill.created_at)}
                  </span>
                </td>
                {(isAdmin || onView) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(bill)}
                          className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                          title="View Bill"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin && onEdit && (
                        <button
                          onClick={() => onEdit(bill)}
                          className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer"
                          title="Edit Bill"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin && onDelete && (
                        <button
                          onClick={() => onDelete(bill)}
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
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
            className="bg-stone-900/90 backdrop-blur-xl rounded-2xl p-5 border border-stone-800 hover:border-emerald-500/30 transition-all shadow-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">
                  {bill.farmer_name || bill.farmer_id}
                </h3>
                {bill.farmer_number && (
                  <p className="text-xs text-stone-400 font-mono">{bill.farmer_number}</p>
                )}
                <p className="text-xs text-stone-500 mt-1">
                  {formatDate(bill.created_at)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-emerald-400 font-mono block">
                  {formatAmount(bill.amount)}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 inline-block mt-1">
                  {bill.mode_type}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-xs">
              <div>
                <span className="text-stone-400 block">Acres</span>
                <span className="text-white font-semibold">{bill.acres} Acres</span>
              </div>
              <div>
                <span className="text-stone-400 block">Flight Duration</span>
                <span className="text-white font-semibold font-mono">{bill.time || '-'}</span>
              </div>
              {isAdmin && (
                <div className="col-span-2 pt-2 border-t border-stone-800">
                  <span className="text-stone-400 block">Pilot Operator</span>
                  <span className="text-stone-200">{bill.operator_name || bill.operator_id}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {(isAdmin || onView) && (
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                {onView && (
                  <button
                    onClick={() => onView(bill)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                )}
                {isAdmin && onEdit && (
                  <button
                    onClick={() => onEdit(bill)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-200 border border-stone-700 text-xs font-medium cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
                {isAdmin && onDelete && (
                  <button
                    onClick={() => onDelete(bill)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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

export default BillTable;
