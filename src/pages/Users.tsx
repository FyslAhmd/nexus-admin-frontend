import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { motion, Variants } from 'framer-motion';
import {
  HiSearch,
  HiUserAdd,
  HiRefresh,
  HiClipboardCopy,
  HiUsers,
  HiSparkles,
  HiCheckCircle,
} from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchUsers,
  updateUserRole,
  updateUserStatus,
} from '../features/users/usersSlice';
import { authApi } from '../services';
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Badge,
  LoadingSpinner,
  Pagination,
} from '../components/ui';
import { UserRole, UserStatus, CreateInviteData } from '../types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, pagination, isLoading } = useAppSelector(
    (state) => state.users
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{
    token: string;
    link: string;
  } | null>(null);

  const {
    register: registerInvite,
    handleSubmit: handleInviteSubmit,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<CreateInviteData>();

  const loadUsers = useCallback(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: filterRole ? (filterRole as UserRole) : undefined,
        status: filterStatus ? (filterStatus as UserStatus) : undefined,
      })
    );
  }, [dispatch, currentPage, searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const result = await Swal.fire({
      title: 'Change User Role?',
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Yes, change it!',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      color: '#f1f5f9',
    });

    if (result.isConfirmed) {
      const response = await dispatch(updateUserRole({ id: userId, role: newRole }));
      if (updateUserRole.fulfilled.match(response)) {
        toast.success('User role updated successfully');
      } else {
        toast.error(response.payload as string);
      }
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: UserStatus) => {
    const newStatus =
      currentStatus === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;

    const action = newStatus === UserStatus.ACTIVE ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Are you sure you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === UserStatus.ACTIVE ? '#10b981' : '#f43f5e',
      cancelButtonColor: '#475569',
      confirmButtonText: `Yes, ${action}!`,
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      color: '#f1f5f9',
    });

    if (result.isConfirmed) {
      const response = await dispatch(
        updateUserStatus({ id: userId, status: newStatus })
      );
      if (updateUserStatus.fulfilled.match(response)) {
        toast.success(`User ${action}d successfully`);
      } else {
        toast.error(response.payload as string);
      }
    }
  };

  const handleCreateInvite = async (data: CreateInviteData) => {
    setInviteLoading(true);
    try {
      const response = await authApi.createInvite(data);
      if (response.success && response.data) {
        setGeneratedInvite({
          token: response.data.inviteToken,
          link: response.data.inviteLink,
        });
        toast.success('Invitation created successfully!');
        resetInvite();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to create invitation'
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setGeneratedInvite(null);
    resetInvite();
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.MANAGER, label: 'Manager' },
    { value: UserRole.STAFF, label: 'Staff' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: UserStatus.ACTIVE, label: 'Active' },
    { value: UserStatus.INACTIVE, label: 'Inactive' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HiUsers className="w-8 h-8 text-primary-400" />
            User Management
          </h1>
          <p className="text-dark-400 mt-1">Manage users and send invitations</p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <HiUserAdd className="w-5 h-5 mr-2" />
          Invite User
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                options={roleOptions}
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              />
              <Select
                options={statusOptions}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                <HiSearch className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('');
                  setFilterStatus('');
                  setCurrentPage(1);
                }}
              >
                <HiRefresh className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants}>
        <Card padding="none">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-dark-400">
              <HiSearch className="w-12 h-12 mb-4" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>
                        <div className="flex items-center">
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center mr-4"
                            style={{
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </motion.div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-dark-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value as UserRole)
                          }
                          className="text-sm rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
                        >
                          <option value={UserRole.ADMIN} className="bg-dark-800">Admin</option>
                          <option value={UserRole.MANAGER} className="bg-dark-800">Manager</option>
                          <option value={UserRole.STAFF} className="bg-dark-800">Staff</option>
                        </select>
                      </td>
                      <td>
                        <Badge
                          variant={
                            user.status === UserStatus.ACTIVE ? 'success' : 'danger'
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="text-dark-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        <Button
                          size="sm"
                          variant={
                            user.status === UserStatus.ACTIVE ? 'danger' : 'success'
                          }
                          onClick={() => handleStatusToggle(user._id, user.status)}
                        >
                          {user.status === UserStatus.ACTIVE
                            ? 'Deactivate'
                            : 'Activate'}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/10">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </motion.div>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={closeInviteModal}
        title="Invite New User"
      >
        {generatedInvite ? (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5" />
                Invitation Created Successfully!
              </p>
              <p className="text-sm text-dark-400">
                Share this link with the user to complete their registration.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Invitation Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={generatedInvite.link}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generatedInvite.link)}
                >
                  <HiClipboardCopy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Invitation Token
              </label>
              <div className="flex gap-2">
                <Input
                  value={generatedInvite.token}
                  readOnly
                  className="flex-1 text-xs"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generatedInvite.token)}
                >
                  <HiClipboardCopy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" onClick={closeInviteModal}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setGeneratedInvite(null);
                  resetInvite();
                }}
              >
                <HiSparkles className="w-4 h-4 mr-2" />
                Create Another
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleInviteSubmit(handleCreateInvite)}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter user's email"
              error={inviteErrors.email?.message}
              {...registerInvite('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Select
              label="Role"
              options={[
                { value: UserRole.STAFF, label: 'Staff' },
                { value: UserRole.MANAGER, label: 'Manager' },
                { value: UserRole.ADMIN, label: 'Admin' },
              ]}
              error={inviteErrors.role?.message}
              {...registerInvite('role', {
                required: 'Role is required',
              })}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={closeInviteModal}
              >
                Cancel
              </Button>
              <Button type="submit" loading={inviteLoading}>
                <HiUserAdd className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  );
};

export default Users;
