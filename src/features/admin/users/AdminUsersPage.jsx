import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/api/userService';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { DataTable } from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ErrorState } from '@/components/ErrorState';
import { Role } from '@/constants/enums';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { Search, UserCheck, UserX, Trash2, Shield, Users } from 'lucide-react';

export function AdminUsersPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin-users-list', page],
    queryFn: () => userService.getAllUsers(page, 15),
  });

  const allUsers = usersData?.content || [];
  const totalPages = usersData?.totalPages || 0;
  const totalElements = usersData?.totalElements || 0;

  // Filter client-side by search term
  const filteredUsers = allUsers.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleToggleStatus = async (user) => {
    try {
      const nextStatus = !user.active;
      await userService.updateUserStatus(user.id, nextStatus);
      toastSuccess(`User account ${nextStatus ? 'activated' : 'disabled'}.`);
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to update user status.'));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deleteTarget.id);
      toastSuccess(`User ${deleteTarget.email} deleted.`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete user.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Email / Username',
      accessor: 'email',
      render: row => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-light text-primary rounded-circle"
            style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
          >
            {row.email[0].toUpperCase()}
          </div>
          <span className="fw-semibold text-dark">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'System Role',
      render: row => {
        let badgeClass = 'bg-secondary';
        if (row.role === Role.ADMIN) badgeClass = 'bg-danger bg-opacity-10 text-danger border border-danger-subtle';
        else if (row.role === Role.RECRUITER) badgeClass = 'bg-primary bg-opacity-10 text-primary border border-primary-subtle';
        else badgeClass = 'bg-success bg-opacity-10 text-success border border-success-subtle';

        return <span className={`badge ${badgeClass}`}>{row.role}</span>;
      },
    },
    {
      header: 'Status',
      render: row => (
        <span className={`badge ${row.active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
          {row.active ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Created Date',
      render: row => <span className="small text-muted">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Actions',
      render: row => (
        <div className="d-flex align-items-center gap-1 justify-content-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleToggleStatus(row)}
            title={row.active ? 'Disable user' : 'Activate user'}
            icon={
              row.active ? (
                <UserX size={14} className="text-warning" />
              ) : (
                <UserCheck size={14} className="text-success" />
              )
            }
          >
            {row.active ? 'Disable' : 'Enable'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteTarget(row)}
            title="Delete user"
            className="text-danger"
            icon={<Trash2 size={14} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">User Management</h1>
          <p className="text-muted small mb-0">
            Search, inspect roles, and enable or disable system users.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-3" style={{ maxWidth: '360px' }}>
        <Input
          placeholder="Filter by email address..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
          className="mb-0"
        />
      </div>

      {isError && (
        <ErrorState
          title="Could not load users"
          message="Check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isError && (
        <Card className="p-0 border-0 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredUsers}
            isLoading={isLoading}
            emptyMessage="No users matching your criteria."
          />
          <div className="p-3 border-top">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={setPage}
            />
          </div>
        </Card>
      )}

      {/* Delete User Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete User Account?"
        message={`Are you sure you want to delete ${deleteTarget?.email}? This action is irreversible.`}
        confirmLabel="Delete account"
      />
    </div>
  );
}
