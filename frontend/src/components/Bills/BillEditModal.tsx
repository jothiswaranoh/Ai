import { useState, FormEvent } from 'react';
import { X, Edit, FileText, User, Clock, DollarSign } from 'lucide-react';
import { BillingResponse, billsApi } from '../../apis/billing';

interface BillEditModalProps {
  bill: BillingResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function BillEditModal({ bill, onClose, onSuccess }: BillEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    farmer_id: bill.farmer_name || bill.farmer_id,
    acres: bill.acres.toString(),
    time: (bill.time || '').toString(),
    amount: bill.amount.toString(),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await billsApi.update(bill._id, {
        farmer_id: formData.farmer_id,
        acres: parseFloat(formData.acres),
        time: formData.time ? parseFloat(formData.time) : undefined,
        amount: parseFloat(formData.amount),
      });

      onSuccess();
    } catch (err) {
      console.error('Error updating bill:', err);
      setError('Failed to update bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Edit Flight Bill
              </h2>
              <p className="text-xs text-stone-400">
                Update record entries and amounts
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

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-200 px-4 py-3 rounded-xl text-xs font-medium animate-shake">
                {error}
              </div>
            )}

            {/* Bill Info Header */}
            <div className="rounded-xl p-3.5 bg-stone-950/60 border border-stone-800/80 text-xs">
              <div className="flex items-center gap-2 mb-2 text-stone-400">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Reference Info</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-300">
                <div>
                  <span className="text-[10px] text-stone-500 block">ID</span>
                  <span className="font-mono text-emerald-400 truncate block text-[11px]">{bill._id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Created</span>
                  <span className="text-stone-300 text-[11px]">{formatDate(bill.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Farmer ID */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Farmer Customer *
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmer_id}
                  onChange={(e) => setFormData({ ...formData, farmer_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Farmer name or ID"
                />
              </div>

              {/* Acres */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                  Sprayed Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.acres}
                  onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="e.g. 5.5"
                />
              </div>

              {/* Time Duration */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Flight Duration (Hours / Mins)
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="e.g. 45 Mins or 1.5"
                />
              </div>

              {/* Bill Amount */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Bill Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-emerald-400 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xs shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BillEditModal;