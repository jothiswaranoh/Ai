import { useState, useEffect } from 'react';
import { UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { MOCK_PASSWORD } from '../lib/mockData';
import { usersApi, UserResponse } from '../apis/users';

export function ManageOperators() {
  const [operators, setOperators] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: MOCK_PASSWORD
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getOperators();
      setOperators(data);
    } catch (error) {
      console.error('Error loading operators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await usersApi.create({
        email: formData.email,
        name: formData.full_name,
        password: formData.password,
        role_id: 2
      });

      setFormData({ email: '', full_name: '', password: MOCK_PASSWORD });
      setShowForm(false);
      loadOperators();
    } catch (err: any) {
      console.error('Error creating operator:', err);
      if (err.response?.status === 400) {
        setError('This email is already registered or invalid data.');
      } else {
        setError('Failed to create operator. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      setDeleteId(null);
      loadOperators();
    } catch (error) {
      console.error('Error deleting operator:', error);
      alert('Failed to delete operator. Ensure they have no active bills.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: 'url(/images/hero-drone.jpg)',
            filter: 'brightness(0.3) saturate(1.2)'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Manage Operators</h1>
              <p className="text-stone-300 text-sm">Add and manage drone pilot accounts</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? 'secondary' : 'primary'}
              className="flex items-center gap-2"
            >
              {showForm ? 'Cancel' : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Add Operator
                </>
              )}
            </Button>
          </div>

          {showForm && (
            <div className="mb-8 p-6 sm:p-8 rounded-3xl backdrop-blur-xl border border-stone-800 bg-stone-900/90 shadow-2xl animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6">Add New Pilot Operator</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="bg-stone-950/80 border border-stone-700/80 text-stone-300 px-4 py-3 rounded-xl text-xs">
                  <strong>Notice:</strong> Default initial password for all created operators is: <code className="font-mono bg-stone-800 text-emerald-400 px-2 py-0.5 rounded mx-1">{MOCK_PASSWORD}</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Anand Raj"
                  />

                  <Input
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anand@shamuga.com"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    variant="primary"
                    className="min-w-[150px]"
                  >
                    {submitting ? 'Creating...' : 'Create Operator'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-2xl backdrop-blur-xl border border-stone-800 bg-stone-900/80 shadow-2xl overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-emerald-400">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium">Loading operators...</p>
              </div>
            ) : operators.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <p className="text-base font-semibold text-white">No operators found</p>
                <p className="text-xs mt-1">Click "Add Operator" above to register a new pilot.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-800">
                  <thead className="bg-stone-950/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-300">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-300">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-300">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-300">Joined</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-sm">
                    {operators.map((op) => (
                      <tr key={op.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{op.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-stone-300 font-mono text-xs">{op.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {op.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-xs">{formatDate(op.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setDeleteId(op.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer"
                            title="Delete Operator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">Delete Operator Account?</h3>
            <p className="text-stone-300 text-sm">
              Are you sure you want to delete this operator? All permissions will be revoked.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 cursor-pointer"
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

export default ManageOperators;
