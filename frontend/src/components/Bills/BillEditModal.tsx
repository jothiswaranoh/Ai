import { useState, FormEvent } from 'react';
import { X, Edit, FileText, User, Clock, DollarSign } from 'lucide-react';
import { BillingResponse, billsApi } from '../../apis/billing';
import { theme } from '../../theme';

interface BillEditModalProps {
  bill: BillingResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function BillEditModal({ bill, onClose, onSuccess }: BillEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    farmer_id: bill.farmer_id,
    acres: bill.acres.toString(),
    time: bill.time.toString(),
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
        time: parseFloat(formData.time),
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

  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: theme.colors.neutral.white,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4" style={{ zIndex: theme.zIndex.modal }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border w-full max-w-md mx-auto max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
            >
              <Edit className="w-5 h-5" style={{ color: theme.colors.primary.cyan[400] }} />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: theme.colors.neutral.white }}
              >
                Edit Bill
              </h2>
              <p
                className="text-xs sm:text-sm"
                style={{ color: 'rgba(207, 250, 254, 0.8)' }}
              >
                Update bill information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.neutral.white;
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {error && (
              <div
                className="border px-4 py-3 rounded-xl backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: theme.colors.semantic.error,
                  animation: 'shake 0.5s'
                }}
              >
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Bill Info Header */}
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" style={{ color: theme.colors.primary.cyan[400] }} />
                <label
                  className="text-sm font-medium"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  Bill Information
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: 'rgba(207, 250, 254, 0.8)' }}
                  >
                    Farmer ID
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: theme.colors.neutral.white }}
                  >
                    {bill.farmer_id}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: 'rgba(207, 250, 254, 0.8)' }}
                  >
                    Created
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {formatDate(bill.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Farmer ID */}
              <div className="space-y-2">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  <User className="w-4 h-4" />
                  Farmer ID/Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmer_id}
                  onChange={(e) => setFormData({ ...formData, farmer_id: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all backdrop-blur-sm"
                  style={inputStyle}
                  placeholder="Enter farmer ID or name"
                />
              </div>

              {/* Acres */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  Acres
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.acres}
                  onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all backdrop-blur-sm"
                  style={inputStyle}
                  placeholder="Enter acres"
                />
              </div>

              {/* Time Duration */}
              <div className="space-y-2">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  <Clock className="w-4 h-4" />
                  Time (Hours)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all backdrop-blur-sm"
                  style={inputStyle}
                  placeholder="Enter time in hours"
                />
              </div>

              {/* Bill Amount */}
              <div className="space-y-2">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: theme.colors.primary.cyan[100] }}
                >
                  <DollarSign className="w-4 h-4" />
                  Bill Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all backdrop-blur-sm"
                  style={inputStyle}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="pt-4 mt-4 border-t"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 border"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: theme.colors.neutral.white,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary.cyan[500]}, ${theme.colors.primary.cyan[600]})`,
                    color: theme.colors.neutral.white,
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div
                        className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          borderTopColor: theme.colors.neutral.white
                        }}
                      />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Update Bill
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}