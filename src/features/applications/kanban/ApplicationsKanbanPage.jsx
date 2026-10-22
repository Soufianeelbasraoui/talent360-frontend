import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { applicationService } from '@/api/applicationService';
import { jobService } from '@/api/jobService';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScoreRing } from '@/components/ScoreRing';
import { SkillTag } from '@/components/SkillTag';
import { AiBadge } from '@/components/AiBadge';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { ApplicationStatus } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import {
  Sparkles,
  Award,
  ChevronLeft,
  User,
  GripVertical,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';

// 5 Columns
const COLUMNS = [
  { id: ApplicationStatus.NEW, label: 'New', color: 'border-primary' },
  { id: ApplicationStatus.SCREENING, label: 'Screening', color: 'border-warning' },
  { id: ApplicationStatus.OFFER, label: 'Offer', color: 'border-info' },
  { id: ApplicationStatus.HIRED, label: 'Hired', color: 'border-success' },
  { id: ApplicationStatus.REJECTED, label: 'Rejected', color: 'border-secondary' },
];

function KanbanCard({ app, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(app.id), data: { app } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'card p-3 mb-2 bg-white border shadow-sm',
        isOverlay && 'shadow-lg rotate-1'
      )}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-light text-primary rounded-circle"
            style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
          >
            <User size={14} />
          </div>
          <div>
            <div className="fw-semibold text-dark small" style={{ lineHeight: 1.2 }}>
              {app.candidateName || `Candidate #${app.candidateId}`}
            </div>
            <div className="text-muted" style={{ fontSize: '0.6875rem' }}>
              {formatDate(app.appliedAt)}
            </div>
          </div>
        </div>

        <div {...attributes} {...listeners} className="text-muted cursor-grab p-1">
          <GripVertical size={14} />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-1">
        <div className="d-flex align-items-center gap-1">
          <ScoreRing score={app.matchingScore ?? 84} size={32} />
        </div>

        <Link
          to={`/recruiter/candidates/${app.candidateId}`}
          className="small text-primary text-decoration-none d-flex align-items-center gap-1"
        >
          <span>Profile</span>
          <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}

export function ApplicationsKanbanPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [aiRankingEnabled, setAiRankingEnabled] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState(null);

  // Load Job info
  const { data: job } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(Number(id)),
  });

  // Load Applications
  const {
    data: applicationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['job-applications', id],
    queryFn: () => applicationService.getJobApplications(Number(id), 0, 100),
  });

  // Local state for optimistic updates
  const [appsList, setAppsList] = useState([]);

  useEffect(() => {
    if (applicationsData?.content) {
      setAppsList(applicationsData.content);
    }
  }, [applicationsData]);

  // Mutation to update application status with rollback on failure
  const mutation = useMutation({
    mutationFn: ({ appId, newStatus }) =>
      applicationService.updateApplicationStatus(appId, newStatus),
    onError: (err, variables, context) => {
      if (context?.previousList) {
        setAppsList(context.previousList);
      }
      toastError(getErrorMessage(err, 'Failed to update application status. Rolling back.'));
    },
    onSuccess: (updatedApp) => {
      toastSuccess(`Moved ${updatedApp.candidateName || 'candidate'} to ${updatedApp.status}.`);
      queryClient.invalidateQueries({ queryKey: ['job-applications', id] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Group applications by status column
  const columnData = useMemo(() => {
    let list = [...appsList];
    if (aiRankingEnabled) {
      list.sort((a, b) => (b.matchingScore ?? 0) - (a.matchingScore ?? 0));
    }

    const grouped = {};
    COLUMNS.forEach(col => {
      grouped[col.id] = list.filter(item => item.status === col.id);
    });
    return grouped;
  }, [appsList, aiRankingEnabled]);

  const handleDragStart = (event) => {
    const { active } = event;
    const found = appsList.find(a => String(a.id) === String(active.id));
    setActiveDragItem(found || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    const activeId = Number(active.id);
    const activeApp = appsList.find(a => a.id === activeId);
    if (!activeApp) return;

    // Determine target column
    let targetColumn = null;
    if (COLUMNS.some(c => c.id === over.id)) {
      targetColumn = over.id;
    } else {
      const overApp = appsList.find(a => String(a.id) === String(over.id));
      if (overApp) {
        targetColumn = overApp.status;
      }
    }

    if (targetColumn && targetColumn !== activeApp.status) {
      // Optimistic update
      const previousList = [...appsList];
      setAppsList(prev =>
        prev.map(app => (app.id === activeId ? { ...app, status: targetColumn } : app))
      );

      mutation.mutate({ appId: activeId, newStatus: targetColumn }, { context: { previousList } });
    }
  };

  return (
    <div>
      {/* Header with back navigation & AI sort toggle */}
      <div className="mb-3">
        <Link to={ROUTES.RECRUITER_JOBS} className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ChevronLeft size={14} />
          <span>Back to job offers</span>
        </Link>
      </div>

      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="fs-4 fw-bold text-dark mb-0">
              {job?.title || `Hiring Pipeline #${id}`}
            </h1>
            <span className="badge bg-light text-dark border">
              {appsList.length} applicant{appsList.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-muted small mb-0 mt-1">
            Drag candidates across columns to update their recruitment stage.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* AI Ranking Toggle */}
          <button
            type="button"
            className={clsx(
              'btn btn-sm d-flex align-items-center gap-2 border',
              aiRankingEnabled ? 'btn-ai' : 'btn-secondary'
            )}
            onClick={() => setAiRankingEnabled(!aiRankingEnabled)}
          >
            <Sparkles size={14} />
            <span>AI Ranking {aiRankingEnabled ? 'Active' : 'Off'}</span>
          </button>

          <Link to={`/recruiter/jobs/${id}/ranking`}>
            <Button variant="secondary" size="sm" icon={<Award size={14} />}>
              Ranked View
            </Button>
          </Link>
        </div>
      </div>

      {isLoading && <Skeleton count={3} height={140} className="mb-3" />}

      {isError && (
        <ErrorState
          title="Could not load pipeline applications"
          message="Check your connection and try again."
          onRetry={refetch}
        />
      )}

      {/* Kanban Columns */}
      {!isLoading && !isError && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="row g-3 overflow-auto flex-nowrap pb-4" style={{ minHeight: '600px' }}>
            {COLUMNS.map(column => {
              const columnApps = columnData[column.id] || [];

              return (
                <div key={column.id} className="col-12 col-sm-6 col-md-4 col-xl" style={{ minWidth: '240px' }}>
                  <div className="p-2 bg-light border rounded h-100 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold small text-dark">{column.label}</span>
                        <span className="badge bg-white text-muted border" style={{ fontSize: '0.6875rem' }}>
                          {columnApps.length}
                        </span>
                      </div>
                    </div>

                    <SortableContext
                      items={columnApps.map(a => String(a.id))}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex-grow-1" style={{ minHeight: '120px' }}>
                        {columnApps.map(app => (
                          <KanbanCard key={app.id} app={app} />
                        ))}
                        {columnApps.length === 0 && (
                          <div className="text-center py-4 text-muted small">
                            Drop candidate here
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeDragItem ? <KanbanCard app={activeDragItem} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
