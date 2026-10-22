import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { jobService } from '@/api/jobService';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { DataTable } from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ErrorState } from '@/components/ErrorState';
import { ROUTES } from '@/constants/routes';
import { JobStatus } from '@/constants/enums';
import { formatDate, formatContractType } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import {
  Plus,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Kanban,
  Award,
} from 'lucide-react';

export function JobManagePage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [page, setPage] = useState(0);

  // Confirm dialog state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: jobsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['recruiter-managed-jobs', page],
    queryFn: () => jobService.searchJobs({ page, size: 10 }),
  });

  const jobs = jobsData?.content || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalElements = jobsData?.totalElements || 0;

  const handlePublish = async (id) => {
    try {
      await jobService.publishJob(id);
      toastSuccess('Job published successfully.');
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to publish job.'));
    }
  };

  const handleClose = async (id) => {
    try {
      await jobService.closeJob(id);
      toastSuccess('Job closed.');
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to close job.'));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await jobService.deleteJob(deleteTargetId);
      toastSuccess('Job offer deleted.');
      setDeleteTargetId(null);
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete job.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Job Title',
      render: row => (
        <div>
          <div className="fw-semibold text-dark">{row.title}</div>
          <div className="text-muted small">
            {row.departmentName || 'Engineering'} &bull; {row.location}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: row => <StatusBadge status={row.status} />,
    },
    {
      header: 'Contract',
      render: row => (
        <span className="small text-muted">{formatContractType(row.contractType)}</span>
      ),
    },
    {
      header: 'Posted Date',
      render: row => <span className="small text-muted">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Hiring Pipeline',
      render: row => (
        <div className="d-flex align-items-center gap-2">
          <Link to={`/recruiter/jobs/${row.id}/applications`}>
            <Button variant="secondary" size="sm" icon={<Kanban size={13} />}>
              Kanban
            </Button>
          </Link>
          <Link to={`/recruiter/jobs/${row.id}/ranking`}>
            <Button variant="secondary" size="sm" icon={<Award size={13} />}>
              AI Ranking
            </Button>
          </Link>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: row => (
        <div className="d-flex align-items-center gap-1 justify-content-end">
          {row.status === JobStatus.DRAFT && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePublish(row.id)}
              title="Publish job"
              icon={<CheckCircle size={14} className="text-success" />}
            >
              Publish
            </Button>
          )}

          {row.status === JobStatus.OPEN && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleClose(row.id)}
              title="Close job"
              icon={<XCircle size={14} className="text-warning" />}
            >
              Close
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteTargetId(row.id)}
            title="Delete job"
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
          <h1 className="fs-4 fw-bold text-dark mb-1">Manage Job Offers</h1>
          <p className="text-muted small mb-0">
            Publish, review pipelines, monitor candidate counts, or edit active listings.
          </p>
        </div>
        <Link to={ROUTES.RECRUITER_JOB_NEW}>
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>
            Create new job
          </Button>
        </Link>
      </div>

      {isError && (
        <ErrorState
          title="Could not load job offers"
          message="Check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isError && (
        <Card className="p-0 border-0 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={jobs}
            isLoading={isLoading}
            emptyMessage="No job offers created yet. Click 'Create new job' to post your first position."
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Job Offer?"
        message="This action will permanently delete this job offer and all associated candidate applications. This cannot be undone."
        confirmLabel="Delete offer"
      />
    </div>
  );
}
