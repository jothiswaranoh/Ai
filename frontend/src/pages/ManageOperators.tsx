import { useState, useEffect } from 'react';
import { UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { MOCK_PASSWORD } from '../lib/mockData';
import { usersApi, UserResponse } from '../apis/users';
import { theme } from '../theme';

export function ManageOperators() {
  const [operators, setOperators] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: MOCK_PASSWORD // Default password for now
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
      // Create new operator (role_id: 2)
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
      // Backend returns 400 for duplicate email
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

  const tableHeaderStyle = "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[rgba(207,250,254,0.8)]";
  const tableCellStyle = "px-6 py-4 whitespace-nowrap text-sm text-[rgba(255,255,255,0.9)]";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664)',
            filter: 'brightness(0.3)'
          }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(6, 182, 212, 0.4))'
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Operators</h1>
              <p className="text-cyan-100">Add and manage operator accounts</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              style={{
                background: showForm
                  ? 'rgba(255, 255, 255, 0.1)'
                  : `linear-gradient(135deg, ${theme.colors.primary.cyan[500]}, ${theme.colors.primary.blue[600]})`,
                border: showForm ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
              }}
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
            <div
              className="mb-8 p-6 rounded-2xl backdrop-blur-xl border shadow-xl animate-fade-in"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Add New Operator</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-200 px-4 py-3 rounded-xl text-sm">
                  <strong>Note:</strong> Default password for all operators is: <code className="font-mono bg-blue-500/30 px-2 py-1 rounded mx-1">{MOCK_PASSWORD}</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />

                  <Input
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary.cyan[500]}, ${theme.colors.primary.cyan[600]})`,
                      minWidth: '150px'
                    }}
                  >
                    {submitting ? 'Creating...' : 'Create Operator'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div
            className="rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: theme.colors.primary.cyan[400] }}></div>
                <p className="text-cyan-100">Loading operators...</p>
              </div>
            ) : operators.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-cyan-100/60 text-lg">No operators found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className={tableHeaderStyle}>Name</th>
                      <th className={tableHeaderStyle}>Email</th>
                      <th className={tableHeaderStyle}>Created</th>
                      <th className={tableHeaderStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {operators.map((operator) => (
                      <tr key={operator.id} className="hover:bg-white/5 transition-colors">
                        <td className={tableCellStyle}>
                          <div className="font-semibold">{operator.name}</div>
                        </td>
                        <td className={tableCellStyle}>
                          {operator.email}
                        </td>
                        <td className={tableCellStyle}>
                          {formatDate(operator.created_at)}
                        </td>
                        <td className={tableCellStyle}>
                          <button
                            onClick={() => setDeleteId(operator.id!)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                            title="Delete Operator"
                          >
                            <Trash2 className="w-5 h-5" />
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/60"
            onClick={() => setDeleteId(null)}
          />

          <div
            className="relative backdrop-blur-xl rounded-2xl shadow-2xl border w-full max-w-md p-6 bg-white/10 border-white/20"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Operator</h3>
              <p className="text-cyan-100/80 mb-6">
                Are you sure you want to delete this operator? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-white border border-white/20 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
