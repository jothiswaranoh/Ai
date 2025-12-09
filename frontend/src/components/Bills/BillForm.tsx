import { useState, FormEvent } from 'react';
import { Plus, User, Clock, DollarSign, FileText, CreditCard } from 'lucide-react';
import { Button } from '../UI/Button';
import { billsApi } from '../../apis/billing';
import { useAuth } from '../../hooks/useAuth';

interface BillFormProps {
  onSuccess?: () => void;
}

export function BillForm({ onSuccess }: BillFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    farmer_name: '',
    archs: '', // Used for acres
    time_duration: '', // Used for time
    bill_amount: '',
    mode_type: 'cash' as 'cash' | 'upi',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      // Parse numeric values
      const acres = parseFloat(formData.archs) || 0;
      const time = parseFloat(formData.time_duration) || 0;
      const amount = parseFloat(formData.bill_amount);

      await billsApi.create({
        farmer_id: formData.farmer_name, // Using name as ID for now
        operator_id: user.id,
        drone_id: "default-drone", // Placeholder
        acres: acres,
        time: time,
        amount: amount,
        mode_type: formData.mode_type
      });

      setFormData({
        farmer_name: '',
        archs: '',
        time_duration: '',
        bill_amount: '',
        mode_type: 'cash',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error creating bill:', err);
      setError(err.detail || 'Failed to create bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center">
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            Create New Bill
          </h2>
          <p className="text-cyan-100/80 text-sm sm:text-base">
            Fill in the details to create a new billing record
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Farmer Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <User className="w-4 h-4" />
            Farmer Name
            <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.farmer_name}
            onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
            placeholder="Enter farmer name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
          />
        </div>

        {/* Archs */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <FileText className="w-4 h-4" />
            Archs
          </label>
          <input
            type="text"
            value={formData.archs}
            onChange={(e) => setFormData({ ...formData, archs: e.target.value })}
            placeholder="Enter archs (optional)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
          />
        </div>

        {/* Time Duration */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <Clock className="w-4 h-4" />
            Time Duration
          </label>
          <input
            type="text"
            value={formData.time_duration}
            onChange={(e) => setFormData({ ...formData, time_duration: e.target.value })}
            placeholder="e.g., 2 hours (optional)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
          />
        </div>

        {/* Bill Amount */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <DollarSign className="w-4 h-4" />
            Bill Amount
            <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.bill_amount}
            onChange={(e) => setFormData({ ...formData, bill_amount: e.target.value })}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
          />
        </div>

        {/* Payment Mode */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <CreditCard className="w-4 h-4" />
            Payment Mode
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.mode_type === 'cash' ? 'border-cyan-400' : 'border-white/30 group-hover:border-white/50'}`}>
                {formData.mode_type === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
              </div>
              <input
                type="radio"
                name="mode_type"
                value="cash"
                checked={formData.mode_type === 'cash'}
                onChange={() => setFormData({ ...formData, mode_type: 'cash' })}
                className="hidden"
              />
              <span className={`text-sm ${formData.mode_type === 'cash' ? 'text-white' : 'text-white/60'}`}>Cash</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.mode_type === 'upi' ? 'border-cyan-400' : 'border-white/30 group-hover:border-white/50'}`}>
                {formData.mode_type === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
              </div>
              <input
                type="radio"
                name="mode_type"
                value="upi"
                checked={formData.mode_type === 'upi'}
                onChange={() => setFormData({ ...formData, mode_type: 'upi' })}
                className="hidden"
              />
              <span className={`text-sm ${formData.mode_type === 'upi' ? 'text-white' : 'text-white/60'}`}>UPI</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4 sm:mt-6"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Bill...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Create Bill
            </span>
          )}
        </Button>

        {/* Form Note */}
        <div className="text-center">
          <p className="text-cyan-200/60 text-xs sm:text-sm">
            Fields marked with <span className="text-red-400">*</span> are required
          </p>
        </div>
      </form>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-2xl opacity-50" />
    </div>
  );
}
