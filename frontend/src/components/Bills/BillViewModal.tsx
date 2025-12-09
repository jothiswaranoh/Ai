import { X, FileText, User, Clock, Calendar, DollarSign, Edit } from 'lucide-react';
import { BillingResponse } from '../../apis/billing';
import { theme } from '../../theme';

interface BillViewModalProps {
  bill: BillingResponse;
  onClose: () => void;
  onEdit?: (bill: BillingResponse) => void;
}

export function BillViewModal({ bill, onClose, onEdit }: BillViewModalProps) {
  const formatDate = (dateString: string) => {
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
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-50"
      style={{ zIndex: theme.zIndex.modal }}
    >
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Bill Details
                </h2>
                <p className="text-sm text-cyan-200">
                  Complete bill information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6 space-y-5">
          {/* Bill ID Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <label className="text-sm font-semibold text-cyan-200 uppercase tracking-wider">
                Bill ID
              </label>
            </div>
            <p className="text-sm font-mono font-bold text-white truncate">
              {bill.id}
            </p>
          </div>

          {/* Farmer Information Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-blue-400/30 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-400" />
              <label className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
                Farmer ID
              </label>
            </div>
            <p className="text-lg font-semibold text-white">
              {bill.farmer_id}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Acres */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
              <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2 block">
                Acres
              </label>
              <p className="text-base font-medium text-white">
                {bill.acres}
              </p>
            </div>

            {/* Time Duration */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-pink-400/30 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <label className="text-xs font-semibold text-pink-200 uppercase tracking-wider">
                  Duration
                </label>
              </div>
              <p className="text-base font-medium text-white">
                {bill.time} hours
              </p>
            </div>
          </div>

          {/* Amount Highlight Card */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
              <label className="text-sm font-semibold text-cyan-200 uppercase tracking-wider">
                Bill Amount
              </label>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatAmount(bill.amount)}
            </p>
            <p className="text-sm text-cyan-200 mt-2 uppercase">
              Mode: {bill.mode_type}
            </p>
          </div>

          {/* Metadata Section */}
          <div className="space-y-4 pt-5 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Additional Information
            </h3>

            <div className="space-y-3">
              {/* Created By */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <label className="text-sm font-medium text-white/70">
                    Created By
                  </label>
                </div>
                <p className="text-sm font-semibold text-white">
                  {bill.operator_id}
                </p>
              </div>

              {/* Created At */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <label className="text-sm font-medium text-white/70">
                    Created At
                  </label>
                </div>
                <p className="text-xs text-right text-white/90 font-medium">
                  {formatDate(bill.created_at)}
                </p>
              </div>

              {/* Last Updated */}
              {bill.updated_at !== bill.created_at && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-purple-400" />
                    <label className="text-sm font-medium text-white/70">
                      Last Updated
                    </label>
                  </div>
                  <p className="text-xs text-right text-white/90 font-medium">
                    {formatDate(bill.updated_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/20 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all duration-200 hover:scale-[1.02]"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(bill)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-200 hover:scale-[1.02]"
              >
                <span className="flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Bill
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
