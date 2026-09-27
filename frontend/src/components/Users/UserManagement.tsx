import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Trash2, Edit3, Shield, CheckCircle, XCircle, RefreshCw, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { usersApi, UserResponse } from '../../apis/users';
import { DroneIcon } from '../Landing/DroneIcon';
import { Pagination } from '../UI/Pagination';

export function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const PAGE_SIZE = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Password reset state (standalone modal)
  const [resetPasswordUser, setResetPasswordUser] = useState<UserResponse | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [resetErrorMsg, setResetErrorMsg] = useState('');

  // Inline password reset inside Edit modal
  const [editNewPassword, setEditNewPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 2, // Default Operator
    is_active: true, // Default active
  });

  useEffect(() => {
    setPage(1);
    loadUsers(1);
  }, [search]);

  const loadUsers = async (targetPage = page) => {
    try {
      setLoading(true);
      setLoadError('');
      const data = await usersApi.getAll(targetPage, PAGE_SIZE, search);
      setUsers(data.items);
      setTotalUsers(data.total);
      setTotalPages(data.total_pages);
      setPage(data.page);
    } catch (err: any) {
      console.error('Failed to load users', err);
      setLoadError(err.detail || err.message || 'Failed to load users. You may not have admin access yet — try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role_id: 2, is_active: true });
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: UserResponse) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role_id: user.role_id,
      is_active: user.is_active,
    });
    setEditNewPassword('');
    setShowEditPassword(false);
    setError('');
    setShowAddModal(true);
  };

  const handleOpenResetPassword = (user: UserResponse) => {
    setResetPasswordUser(user);
    setNewPassword('');
    setResetErrorMsg('');
    setResetSuccessMsg('');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    if (newPassword.length < 8) {
      setResetErrorMsg('Password must be at least 8 characters long and contain uppercase, lowercase, and a number');
      return;
    }
    setResettingPassword(true);
    setResetErrorMsg('');
    setResetSuccessMsg('');
    try {
      await usersApi.resetPassword(resetPasswordUser.id || resetPasswordUser._id!, newPassword);
      setResetSuccessMsg(`Password successfully reset for ${resetPasswordUser.name}`);
      setTimeout(() => {
        setResetPasswordUser(null);
        setNewPassword('');
        setResetSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setResetErrorMsg(err.detail || err.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate new password if provided in edit mode
    if (editingUser && editNewPassword && editNewPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    // Validate password on create
    if (!editingUser && formData.password) {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
        setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (editingUser) {
        // Send name, role_id, and is_active — NOT email (it's disabled)
        await usersApi.update(editingUser.id || editingUser._id!, {
          name: formData.name,
          role_id: formData.role_id,
          is_active: formData.is_active,
        });
        // Also reset password if admin provided a new one
        if (editNewPassword.trim()) {
          await usersApi.resetPassword(editingUser.id || editingUser._id!, editNewPassword);
        }
      } else {
        // Use Password123 as default if user leaves password blank (meets backend requirements)
        const defaultPassword = 'Password123';
        await usersApi.create({
          name: formData.name,
          email: formData.email,
          password: formData.password || defaultPassword,
          role_id: formData.role_id,
        });
      }
      setShowAddModal(false);
      loadUsers();
    } catch (err: any) {
      setError(err.detail || err.message || 'Failed to save user account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      setDeletingId(null);
      loadUsers();
    } catch (err: any) {
      alert(err.detail || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/85 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-stone-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DroneIcon className="w-5 h-5" />
            </div>
            Drone Pilots & Users
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-0.5">Manage operator crew, flight permissions, and security credentials</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => loadUsers(page)}
            className="p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer"
            title="Refresh Users"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-950/60 hover:scale-[1.02] transition-all cursor-pointer text-xs sm:text-sm"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add New User
          </button>
        </div>
      </div>

      {/* Role Stats Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Total Accounts</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalUsers || users.length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Administrators</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{users.filter((u) => u.role_id === 1).length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 flex items-center justify-between shadow-md col-span-2 sm:col-span-1">
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Flight Pilots (Operators)</p>
            <p className="text-xl font-bold text-teal-400 mt-0.5">{users.filter((u) => u.role_id === 2).length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <DroneIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-stone-900/90 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm text-sm"
        />
      </div>

      {/* Users Container */}
      <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-emerald-400">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading user list...</p>
          </div>
        ) : loadError ? (
          <div className="py-16 text-center text-rose-400 p-6 space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
            <p className="text-sm font-semibold text-rose-300">{loadError}</p>
            <button
              onClick={() => loadUsers(1)}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            No user accounts found.
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-sm">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role_id === 1;
                    return (
                      <tr key={u.id || u._id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                              isAdmin ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {isAdmin ? <Shield className="w-4 h-4 text-amber-400" /> : <DroneIcon className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{u.name}</p>
                              <p className="text-stone-400 text-xs font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isAdmin ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {isAdmin ? (
                              <>
                                <Shield className="w-3.5 h-3.5" />
                                Admin
                              </>
                            ) : (
                              <>
                                <DroneIcon className="w-3.5 h-3.5" />
                                Flight Pilot
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                              <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                              <XCircle className="w-3.5 h-3.5" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenResetPassword(u)}
                              className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                              title="Reset Password"
                              aria-label="Reset Password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                              title="Edit User"
                              aria-label="Edit User"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(u.id || u._id!)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Delete User"
                              aria-label="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< md screens) */}
            <div className="md:hidden divide-y divide-stone-800">
              {filteredUsers.map((u) => {
                const isAdmin = u.role_id === 1;
                return (
                  <div key={u.id || u._id} className="p-4 space-y-3 hover:bg-stone-800/20 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                          isAdmin ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {isAdmin ? <Shield className="w-5 h-5 text-amber-400" /> : <DroneIcon className="w-5 h-5 text-emerald-400" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base leading-snug">{u.name}</h4>
                          <p className="text-xs text-stone-400 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenResetPassword(u)}
                          className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                          title="Reset Password"
                          aria-label="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                          title="Edit User"
                          aria-label="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(u.id || u._id!)}
                          className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete User"
                          aria-label="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isAdmin ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isAdmin ? (
                          <>
                            <Shield className="w-3 h-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <DroneIcon className="w-3 h-3" />
                            Flight Pilot
                          </>
                        )}
                      </span>

                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {totalUsers > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalUsers}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => {
              setPage(p);
              loadUsers(p);
            }}
            itemLabel="users"
          />
        )}
      </div>

      {/* Admin Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Reset User Password</h3>
                <p className="text-stone-400 text-xs mt-0.5">Admin credential override</p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 text-sm font-semibold">{resetPasswordUser.name}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  resetPasswordUser.role_id === 1 ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
                }`}>
                  {resetPasswordUser.role_id === 1 ? 'Admin' : 'Drone Pilot'}
                </span>
              </div>
              <p className="text-stone-400 text-xs font-mono">{resetPasswordUser.email}</p>
            </div>

            {resetSuccessMsg && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            {resetErrorMsg && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new strong password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  User will use this new password immediately to log into the portal.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPassword('');
                    setResetErrorMsg('');
                    setResetSuccessMsg('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPassword}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-950/50 cursor-pointer disabled:opacity-50"
                >
                  {resettingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Set New Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">
              {editingUser ? 'Edit User Account' : 'Add New Portal User'}
            </h3>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Raj"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Email — disabled when editing */}
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                  Email Address *
                  {editingUser && <span className="ml-2 text-stone-500 font-normal normal-case">(cannot be changed)</span>}
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  placeholder="anand@shamuga.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${
                    editingUser
                      ? 'text-stone-500 cursor-not-allowed opacity-60 select-none'
                      : 'text-white placeholder-stone-500'
                  }`}
                />
              </div>

              {/* Password — only on Create */}
              {!editingUser && (
                <div>
                  <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">Password</label>
                  <input
                    type="password"
                    placeholder="Leave empty for default: Password123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Leave empty to use default <span className="font-mono text-stone-300">Password123</span>. Custom passwords must be 8+ chars with uppercase, lowercase &amp; a number.
                  </p>
                </div>
              )}

              {/* Role */}
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">Assign Role *</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={2} className="bg-stone-900 text-white">Operator (Flight Pilot)</option>
                  <option value={1} className="bg-stone-900 text-white">Admin (Full Control)</option>
                </select>
              </div>

              {/* Account Status toggle — visible in both Add and Edit */}
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">Account Status</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: true })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      formData.is_active
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: false })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      !formData.is_active
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                        : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Inactive accounts cannot log into the portal.</p>
              </div>

              {/* New Password (Edit only) */}
              {editingUser && (
                <div className="pt-1">
                  <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                    Set New Password <span className="text-stone-500 font-normal normal-case">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      placeholder="Leave blank to keep current password"
                      value={editNewPassword}
                      onChange={(e) => setEditNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-11 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-400 shrink-0" />
                    Min. 8 characters with uppercase, lowercase &amp; a number. The user will use this immediately.
                  </p>
                </div>
              )}

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
                  {submitting ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
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
            <h4 className="text-lg font-bold text-white">Delete User Account?</h4>
            <p className="text-stone-300 text-sm">
              Are you sure you want to remove this user? Their account access will be revoked immediately.
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

export default UserManagement;
