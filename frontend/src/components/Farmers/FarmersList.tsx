import { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Trash2, Edit3, Phone, MapPin, AlertCircle, RefreshCw, Sprout } from 'lucide-react';
import { farmersApi, FarmerResponse } from '../../apis/farmers';

export function FarmersList() {
  const [farmers, setFarmers] = useState<FarmerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<FarmerResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    location: '',
  });

  useEffect(() => {
    loadFarmers();
  }, [search]);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      const data = await farmersApi.getAll(search);
      setFarmers(data);
    } catch (err) {
      console.error('Failed to load farmers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingFarmer(null);
    setFormData({ name: '', number: '', location: '' });
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (farmer: FarmerResponse) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      number: farmer.number,
      location: farmer.location || '',
    });
    setError('');
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingFarmer) {
        await farmersApi.update(editingFarmer.id || editingFarmer._id!, formData);
      } else {
        await farmersApi.create(formData);
      }
      setShowAddModal(false);
      loadFarmers();
    } catch (err: any) {
      setError(err.detail || err.message || 'Failed to save farmer details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await farmersApi.delete(id);
      setDeletingId(null);
      loadFarmers();
    } catch (err) {
      console.error('Failed to delete farmer', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/85 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-stone-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            Farmers Directory
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-0.5">Manage registered farmers, field locations, and contact details</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => loadFarmers()}
            className="p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-950/60 hover:scale-[1.02] transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Farmer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by farmer name or phone number..."
          className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-stone-900/90 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm text-sm"
        />
      </div>

      {/* Farmers Container */}
      <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-emerald-400">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading farmers directory...</p>
          </div>
        ) : farmers.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            No farmers found {search ? `matching "${search}"` : ''}.
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Farmer</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-sm">
                  {farmers.map((farmer) => (
                    <tr key={farmer.id || farmer._id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30 shrink-0">
                            <Sprout className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{farmer.name}</span>
                            <span className="text-[11px] text-emerald-400 font-medium">Registered Farmer</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`tel:${farmer.number}`}
                          className="inline-flex items-center gap-2 text-stone-200 hover:text-emerald-400 font-mono text-xs transition-colors"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          {farmer.number}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-stone-300">
                          <MapPin className="w-4 h-4 text-amber-400" />
                          {farmer.location || 'Tamil Nadu'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-400 text-xs">
                        {farmer.created_at ? new Date(farmer.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(farmer)}
                            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                            title="Edit Farmer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(farmer.id || farmer._id!)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Farmer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< md screens) */}
            <div className="md:hidden divide-y divide-stone-800">
              {farmers.map((farmer) => (
                <div key={farmer.id || farmer._id} className="p-4 space-y-3 hover:bg-stone-800/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Sprout className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base leading-snug">{farmer.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{farmer.location || 'Tamil Nadu'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(farmer)}
                        className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                        title="Edit Farmer"
                        aria-label="Edit Farmer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(farmer.id || farmer._id!)}
                        className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete Farmer"
                        aria-label="Delete Farmer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                    <a
                      href={`tel:${farmer.number}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-mono font-medium transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {farmer.number}
                    </a>

                    <span className="text-stone-500 text-[11px]">
                      {farmer.created_at ? new Date(farmer.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">
              {editingFarmer ? 'Edit Farmer Details' : 'Add New Farmer'}
            </h3>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">Village / District Location</label>
                <input
                  type="text"
                  placeholder="e.g. Thanjavur / Pollachi"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingFarmer ? 'Save Changes' : 'Add Farmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h4 className="text-lg font-bold text-white">Delete Farmer?</h4>
            <p className="text-stone-300 text-sm">
              Are you sure you want to remove this farmer? Associated bills will retain historical records.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmersList;
