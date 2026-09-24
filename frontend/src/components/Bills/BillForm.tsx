import { useState, useEffect, FormEvent } from 'react';
import { Plus, User, Clock, DollarSign, FileText, CreditCard, Search, UserPlus, Check, Phone } from 'lucide-react';
import { Button } from '../UI/Button';
import { billsApi } from '../../apis/billing';
import { farmersApi, FarmerResponse } from '../../apis/farmers';
import { useAuth } from '../../hooks/useAuth';

interface BillFormProps {
  onSuccess?: () => void;
}

export function BillForm({ onSuccess }: BillFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [farmers, setFarmers] = useState<FarmerResponse[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerResponse | null>(null);
  const [farmerSearch, setFarmerSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Quick Add Farmer modal state inside bill form
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
  const [newFarmerData, setNewFarmerData] = useState({ name: '', number: '', location: '' });
  const [addFarmerError, setAddFarmerError] = useState('');
  const [addFarmerSubmitting, setAddFarmerSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    archs: '', // Used for acres
    time_duration: '', // Used for time
    bill_amount: '',
    mode_type: 'cash' as 'cash' | 'upi',
  });

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const data = await farmersApi.getAll();
      setFarmers(data);
    } catch {
      // Ignore background error
    }
  };

  const handleSelectFarmer = (farmer: FarmerResponse) => {
    setSelectedFarmer(farmer);
    setFarmerSearch(`${farmer.name} (${farmer.number})`);
    setIsDropdownOpen(false);
    setError('');
  };

  const handleQuickAddFarmer = async (e: FormEvent) => {
    e.preventDefault();
    setAddFarmerError('');
    setAddFarmerSubmitting(true);

    try {
      const created = await farmersApi.create(newFarmerData);
      const newFarmer = { ...created, id: created.id || created._id };
      await loadFarmers();
      handleSelectFarmer(newFarmer);
      setShowAddFarmerModal(false);
      setNewFarmerData({ name: '', number: '', location: '' });
    } catch (err: any) {
      const msg = typeof err?.detail === 'string' ? err.detail : (err?.message || 'Failed to add farmer');
      setAddFarmerError(msg);
    } finally {
      setAddFarmerSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!selectedFarmer) {
      setError('Please select or add a farmer first');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const acres = parseFloat(formData.archs) || 0;
      const time = parseFloat(formData.time_duration) || 0;
      const amount = parseFloat(formData.bill_amount) || 0;

      const farmerIdToSave = selectedFarmer.id || selectedFarmer._id || selectedFarmer.name;

      await billsApi.create({
        farmer_id: farmerIdToSave,
        operator_id: user.id || (user as any)._id || 'operator',
        drone_id: "default-drone",
        acres: acres,
        time: time,
        amount: amount,
        mode_type: formData.mode_type
      });

      setFormData({
        archs: '',
        time_duration: '',
        bill_amount: '',
        mode_type: 'cash',
      });
      setSelectedFarmer(null);
      setFarmerSearch('');

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error creating bill:', err);
      const errMsg = typeof err?.detail === 'string' ? err.detail : (err?.message || 'Failed to create bill. Please try again.');
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.number.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 relative">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            Create New Bill
          </h2>
          <p className="text-cyan-100/80 text-sm sm:text-base">
            Select a farmer and enter billing details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Farmer Selector */}
        <div className="space-y-2 relative">
          <label className="flex items-center justify-between text-sm font-medium text-cyan-100">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Select Farmer (Search by Name or Number)
              <span className="text-red-400">*</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setAddFarmerError('');
                setShowAddFarmerModal(true);
              }}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Add Farmer
            </button>
          </label>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              required
              value={farmerSearch}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setFarmerSearch(e.target.value);
                setSelectedFarmer(null);
                setIsDropdownOpen(true);
              }}
              placeholder="Search by farmer name or phone number..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
            />
          </div>

          {/* Search Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl divide-y divide-white/10">
              {filteredFarmers.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-white/60 mb-2">No farmer found matching "{farmerSearch}"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setNewFarmerData({ name: farmerSearch, number: '', location: '' });
                      setShowAddFarmerModal(true);
                    }}
                    className="text-xs text-cyan-400 hover:underline font-semibold"
                  >
                    + Click here to add "{farmerSearch}" as new farmer
                  </button>
                </div>
              ) : (
                filteredFarmers.map((f) => (
                  <button
                    key={f.id || f._id}
                    type="button"
                    onClick={() => handleSelectFarmer(f)}
                    className="w-full text-left p-3 hover:bg-cyan-500/20 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{f.name}</p>
                      <p className="text-xs text-cyan-200/70 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        {f.number} {f.location ? `• ${f.location}` : ''}
                      </p>
                    </div>
                    {selectedFarmer && (selectedFarmer.id === f.id || selectedFarmer._id === f._id) && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Farmer Badge */}
        {selectedFarmer && (
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-3 flex items-center justify-between text-cyan-200 text-xs">
            <div>
              <span className="font-bold text-white text-sm block">{selectedFarmer.name}</span>
              <span>Phone: {selectedFarmer.number}</span>
            </div>
            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-semibold">Selected</span>
          </div>
        )}

        {/* Archs / Acres */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <FileText className="w-4 h-4 text-cyan-400" />
            Acres / Archs
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.archs}
            onChange={(e) => setFormData({ ...formData, archs: e.target.value })}
            placeholder="Enter acres (e.g., 5.5)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
          />
        </div>

        {/* Time Duration */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <Clock className="w-4 h-4 text-cyan-400" />
            Time Duration (Hours)
          </label>
          <input
            type="number"
            step="0.5"
            value={formData.time_duration}
            onChange={(e) => setFormData({ ...formData, time_duration: e.target.value })}
            placeholder="Enter hours (e.g., 2.5)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
          />
        </div>

        {/* Bill Amount */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            Bill Amount (₹)
            <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.bill_amount}
            onChange={(e) => setFormData({ ...formData, bill_amount: e.target.value })}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
          />
        </div>

        {/* Payment Mode */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-cyan-100">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Payment Mode
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.mode_type === 'cash' ? 'border-cyan-400' : 'border-white/30'}`}>
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
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.mode_type === 'upi' ? 'border-cyan-400' : 'border-white/30'}`}>
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
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 mt-4"
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
      </form>

      {/* Quick Add Farmer Modal */}
      {showAddFarmerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              Add New Farmer
            </h3>

            {addFarmerError && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 p-3 rounded-xl text-sm">
                {addFarmerError}
              </div>
            )}

            <form onSubmit={handleQuickAddFarmer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-cyan-100 block mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFarmerData.name}
                  onChange={(e) => setNewFarmerData({ ...newFarmerData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-cyan-100 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newFarmerData.number}
                  onChange={(e) => setNewFarmerData({ ...newFarmerData, number: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-cyan-100 block mb-1">Location / Village</label>
                <input
                  type="text"
                  value={newFarmerData.location}
                  onChange={(e) => setNewFarmerData({ ...newFarmerData, location: e.target.value })}
                  placeholder="e.g. Hyderabad, TS"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFarmerModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addFarmerSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {addFarmerSubmitting ? 'Saving...' : 'Save & Select'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
