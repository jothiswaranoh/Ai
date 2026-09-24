import { X, FileText, User, Clock, Calendar, DollarSign, Edit } from 'lucide-react';
import { BillingResponse } from '../../apis/billing';

interface BillViewModalProps {
  bill: BillingResponse;
  onClose: () => void;
  onEdit?: (bill: BillingResponse) => void;
}

export function BillViewModal({ bill, onClose, onEdit }: BillViewModalProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header with Gradient */}
        <div className="bg-stone-950/80 border-b border-stone-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Flight Bill Summary
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Official Drone Operation Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-4">
          {/* Bill ID Card */}
          <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-800/80">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
              Invoice Reference ID
            </span>
            <p className="text-xs font-mono font-bold text-emerald-400 truncate">
              {bill._id || (bill as any).id}
            </p>
          </div>

          {/* Farmer Information Card */}
          <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-800/80">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Farmer Customer
              </span>
            </div>
            <p className="text-lg font-bold text-white">
              {bill.farmer_name || bill.farmer_id}
            </p>
            {bill.farmer_number && (
              <p className="text-xs text-stone-300 font-mono mt-1">
                📞 {bill.farmer_number}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Acres */}
            <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-800/80">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                Sprayed Area
              </span>
              <p className="text-base font-bold text-white">
                {bill.acres} Acres
              </p>
            </div>

            {/* Time Duration */}
            <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-800/80">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Duration
                </span>
              </div>
              <p className="text-base font-bold text-white font-mono">
                {bill.time || 'N/A'}
              </p>
            </div>
          </div>

          {/* Amount Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-950 rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Total Charged
              </span>
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">
              {formatAmount(bill.amount)}
            </p>
            <p className="text-xs text-stone-300 mt-2 uppercase font-medium">
              Payment Mode: <span className="text-emerald-400 font-bold">{bill.mode_type}</span>
            </p>
          </div>

          {/* Metadata Section */}
          <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60 text-stone-400">
              <span>Flight Pilot / Operator:</span>
              <span className="font-semibold text-white">{bill.operator_name || bill.operator_id}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60 text-stone-400">
              <span>Created Timestamp:</span>
              <span className="font-medium text-stone-200">{formatDate(bill.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-stone-950/80 border-t border-stone-800 p-4 sm:p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(bill)}
              className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-950/50 text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Bill
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillViewModal;
