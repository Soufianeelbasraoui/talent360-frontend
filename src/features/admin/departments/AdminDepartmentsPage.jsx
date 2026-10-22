import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { departmentService } from '@/api/departmentService';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { DataTable } from '@/components/DataTable';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ErrorState } from '@/components/ErrorState';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { Building2, Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

export function AdminDepartmentsPage() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { name: '', description: '' },
  });

  const {
    data: departments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => departmentService.getAllDepartments(),
  });

  const openCreateModal = () => {
    setEditingDept(null);
    reset({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setValue('name', dept.name);
    setValue('description', dept.description || '');
    setModalOpen(true);
  };

  const onSubmitForm = async (values) => {
    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept.id, values);
        toastSuccess('Department updated successfully.');
      } else {
        await departmentService.createDepartment(values);
        toastSuccess('Department created successfully.');
      }
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['departments-list'] });
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save department.'));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await departmentService.deleteDepartment(deleteTarget.id);
      toastSuccess(`Department '${deleteTarget.name}' deleted.`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['departments-list'] });
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete department.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Department Name',
      accessor: 'name',
      render: row => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-light text-primary rounded p-1"
            style={{ width: '32px', height: '32px' }}
          >
            <Building2 size={16} />
          </div>
          <div>
            <div className="fw-semibold text-dark">{row.name}</div>
            <div className="text-muted small">{row.description || 'No description provided'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Active Job Offers',
      render: row => (
        <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1">
          <Briefcase size={12} className="text-muted" />
          <span>{row.jobOfferCount ?? 0} jobs</span>
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
            onClick={() => openEditModal(row)}
            title="Edit department"
            icon={<Edit2 size={14} />}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteTarget(row)}
            title="Delete department"
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
          <h1 className="fs-4 fw-bold text-dark mb-1">Department Management</h1>
          <p className="text-muted small mb-0">
            Organize company units and assign department scopes for job postings.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus size={16} />}>
          Add Department
        </Button>
      </div>

      {isError && (
        <ErrorState
          title="Could not load departments"
          message="Check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isError && (
        <Card className="p-0 border-0 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={departments}
            isLoading={isLoading}
            emptyMessage="No departments created yet. Click '+ Add Department' to create one."
          />
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create New Department'}
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitForm)}>
              {editingDept ? 'Save changes' : 'Create department'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Input
            label="Department Name"
            placeholder="e.g. Engineering, Product, Marketing"
            required
            {...register('name', { required: true })}
          />

          <div className="mb-3 text-start">
            <label htmlFor="dept-description" className="form-label">Description (Optional)</label>
            <textarea
              id="dept-description"
              rows={3}
              className="form-control"
              placeholder="Brief description of department scope..."
              {...register('description')}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Department?"
        message={`Are you sure you want to delete '${deleteTarget?.name}'? Jobs associated with this department may be impacted.`}
        confirmLabel="Delete department"
      />
    </div>
  );
}
