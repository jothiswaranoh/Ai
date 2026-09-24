import { useState, useEffect, FormEvent } from 'react';
import { Plus, User, Clock, DollarSign, FileText, CreditCard, Search, UserPlus, Check, Phone } from 'lucide-react';
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
      setFarmers((prev) => [created, ...prev]);
      handleSelectFarmer(created);
      setShowAddFarmerModal(false);
      setNewFarmerData({ name: '', number: '', location: '' });
    } catch (err: any) {
      setAddFarmerError(err.detail || err.message || 'Failed to add farmer');
    } finally {
      setAddFarmerSubmitting(false);
    }
  };

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.number.includes(farmerSearch)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFarmer) {
      setError('Please select or add a farmer first.');
      return;
    }

    if (!formData.bill_amount) {
      setError('Please enter bill amount.');
      return;
    }

    setLoading(true);

    try {
      await billsApi.create({
        farmer_id: selectedFarmer.id || selectedFarmer._id || selectedFarmer.name,
        acres: formData.archs ? parseFloat(formData.archs) : 0,
        time: formData.time_duration || undefined,
        amount: parseFloat(formData.bill_amount),
        mode_type: formData.mode_type,
        operator_id: user?.id,
      });

      // Reset form
      setFormData({
        archs: '',
        time_duration: '',
        bill_amount: '',
        mode_type: 'cash',
      });
      setSelectedFarmer(null);
      setFarmerSearch('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error creating bill:', err);
      setError(err.detail || err.message || 'Failed to create bill. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-stone-800 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 pb-6 border-b border-stone-800">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Create New Bill</h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
            Select a farmer and enter flight and billing details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        {/* Farmer Selector */}
        <div className="space-y-1.5 relative">
          <label className="flex items-center justify-between text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Select Farmer (Name or Phone) *
            </span>
            <button
              type="button"
              onClick={() => {
                setAddFarmerError('');
                setShowAddFarmerModal(true);
              }}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Add Farmer
            </button>
          </label>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
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
              className="w-full pl-10 pr-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Search Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-stone-900 border border-emerald-500/40 rounded-xl shadow-2xl divide-y divide-stone-800">
              {filteredFarmers.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-stone-400 mb-2">No farmer found matching "{farmerSearch}"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setNewFarmerData({ name: farmerSearch, number: '', location: '' });
                      setShowAddFarmerModal(true);
                    }}
                    className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
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
                    className="w-full text-left p-3 hover:bg-emerald-500/15 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{f.name}</p>
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {f.number} {f.location ? `• ${f.location}` : ''}
                      </p>
                    </div>
                    {selectedFarmer && (selectedFarmer.id === f.id || selectedFarmer._id === f._id) && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Farmer Badge */}
        {selectedFarmer && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white text-sm block">{selectedFarmer.name}</span>
              <span className="text-emerald-300 font-mono">Phone: {selectedFarmer.number}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Selected
            </span>
          </div>
        )}

        {/* Archs / Acres */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Total Spray Area (Acres)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.archs}
            onChange={(e) => setFormData({ ...formData, archs: e.target.value })}
            placeholder="e.g. 5.5"
            className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
          />
        </div>

        {/* Time Duration */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Flight Duration (Hours / Min)
          </label>
          <input
            type="text"
            value={formData.time_duration}
            onChange={(e) => setFormData({ ...formData, time_duration: e.target.value })}
            placeholder="e.g. 45 Mins or 1.5 Hrs"
            className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
          />
        </div>

        {/* Bill Amount */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Bill Amount (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.bill_amount}
            onChange={(e) => setFormData({ ...formData, bill_amount: e.target.value })}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono font-bold text-emerald-400"
          />
        </div>

        {/* Payment Mode */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            Payment Mode
          </label>
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.mode_type === 'cash' ? 'border-emerald-400' : 'border-stone-700'}`}>
                {formData.mode_type === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
              </div>
              <input
                type="radio"
                name="mode_type"
                value="cash"
                checked={formData.mode_type === 'cash'}
                onChange={() => setFormData({ ...formData, mode_type: 'cash' })}
                className="hidden"
              />
              <span className={`text-sm font-medium ${formData.mode_type === 'cash' ? 'text-white' : 'text-stone-400'}`}>Cash</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.mode_type === 'upi' ? 'border-emerald-400' : 'border-stone-700'}`}>
                {formData.mode_type === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
              </div>
              <input
                type="radio"
                name="mode_type"
                value="upi"
                checked={formData.mode_type === 'upi'}
                onChange={() => setFormData({ ...formData, mode_type: 'upi' })}
                className="hidden"
              />
              <span className={`text-sm font-medium ${formData.mode_type === 'upi' ? 'text-white' : 'text-stone-400'}`}>UPI / Online</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Bill...</span>
            </>
          ) : (
            'Generate & Save Bill'
          )}
        </button>
      </form>

      {/* Quick Add Farmer Modal inside Bill Form */}
      {showAddFarmerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Add New Farmer</h3>
            <p className="text-xs text-stone-400">Quickly register this farmer to proceed with billing.</p>

            {addFarmerError && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-200 p-3 rounded-xl text-xs">
                {addFarmerError}
              </div>
            )}

            <form onSubmit={handleQuickAddFarmer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1">Farmer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newFarmerData.name}
                  onChange={(e) => setNewFarmerData({ ...newFarmerData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={newFarmerData.number}
                  onChange={(e) => setNewFarmerData({ ...newFarmerData, number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1">Village Location</label>
                <input
                  type="text"
                  placeholder="e.g. Thanjavur"
                  value={newFarmerData.location}
                  onChange={(e) => setNewFarmerData({ ...newFarmerData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddFarmerModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addFarmerSubmitting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xs shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                >
                  {addFarmerSubmitting ? 'Saving...' : 'Add Farmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillForm;
