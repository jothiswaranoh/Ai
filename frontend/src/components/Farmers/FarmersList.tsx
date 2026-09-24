import { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Trash2, Edit3, Phone, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { farmersApi, FarmerResponse } from '../../apis/farmers';
import { theme } from '../../theme';

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
        await farmersApi.update(editingFarmer.id || editingFarmer._id, formData);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-400" />
            Farmers Directory
          </h2>
          <p className="text-cyan-200/80 text-sm">Manage registered farmers and contact details</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadFarmers()}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Farmer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by farmer name or phone number..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm"
        />
      </div>

      {/* Farmers Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-cyan-200">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading farmers directory...
          </div>
        ) : farmers.length === 0 ? (
          <div className="py-16 text-center text-cyan-200/60">
            No farmers found {search ? `matching "${search}"` : ''}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-cyan-200 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Farmer Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm text-white/90">
                {farmers.map((farmer) => (
                  <tr key={farmer.id || farmer._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold">
                          {farmer.name.charAt(0).toUpperCase()}
                        </div>
                        {farmer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-cyan-200/80">
                        <Phone className="w-4 h-4 text-cyan-400" />
                        {farmer.number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-cyan-200/80">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        {farmer.location || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cyan-200/60 text-xs">
                      {farmer.created_at ? new Date(farmer.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(farmer)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-cyan-300 transition-colors"
                          title="Edit Farmer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(farmer.id || farmer._id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
        )}
      </div>

      {/* Add / Edit Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">
              {editingFarmer ? 'Edit Farmer Details' : 'Add New Farmer'}
            </h3>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-cyan-100 block mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-cyan-100 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-cyan-100 block mb-1">Location / Village</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Hyderabad, TS"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Farmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-white/20 rounded-2xl p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Delete Farmer?</h3>
            <p className="text-cyan-200/80 text-sm">Are you sure you want to delete this farmer record?</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
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
