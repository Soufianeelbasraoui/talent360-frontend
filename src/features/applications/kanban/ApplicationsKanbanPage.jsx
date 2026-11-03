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
import { Button } from '@/components/Button';
import { ScoreRing } from '@/components/ScoreRing';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
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
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  XCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import clsx from 'clsx';

const COLUMNS = [
  { id: ApplicationStatus.NEW, label: 'Nouveaux', color: 'border-primary', badgeBg: 'bg-primary' },
  { id: ApplicationStatus.SCREENING, label: 'Évaluation / Screening', color: 'border-warning', badgeBg: 'bg-warning' },
  { id: ApplicationStatus.OFFER, label: 'Offre d\'emploi', color: 'border-info', badgeBg: 'bg-info' },
  { id: ApplicationStatus.HIRED, label: 'Embauchés', color: 'border-success', badgeBg: 'bg-success' },
  { id: ApplicationStatus.REJECTED, label: 'Archivés / Rejetés', color: 'border-secondary', badgeBg: 'bg-secondary' },
];

function KanbanCard({ app, isOverlay = false, onSelectCandidate, onMoveStage }) {
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
    opacity: isDragging ? 0.35 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'card p-3 mb-2 bg-white border shadow-sm transition hover-shadow',
        isOverlay && 'shadow-lg rotate-1 border-primary'
      )}
    >
      {/* Card Header */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div
          className="d-flex align-items-center gap-2 cursor-pointer flex-grow-1"
          onClick={() => onSelectCandidate && onSelectCandidate(app)}
        >
          <div
            className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold rounded"
            style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}
          >
            {app.candidateName ? app.candidateName.substring(0, 2).toUpperCase() : 'CA'}
          </div>
          <div className="text-truncate" style={{ maxWidth: '140px' }}>
            <div className="fw-semibold text-dark small text-truncate" style={{ lineHeight: 1.2 }}>
              {app.candidateName || `Candidat #${app.candidateId}`}
            </div>
            <div className="text-muted" style={{ fontSize: '0.6875rem' }}>
              {formatDate(app.appliedAt)}
            </div>
          </div>
        </div>

        <div {...attributes} {...listeners} className="text-muted cursor-grab p-1" title="Glisser pour déplacer">
          <GripVertical size={14} />
        </div>
      </div>

      {/* Card Meta & Actions */}
      <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-1">
        <div className="d-flex align-items-center gap-1.5">
          <ScoreRing score={app.matchingScore ?? 84} size={30} />
          <span className="small text-muted fw-semibold" style={{ fontSize: '11px' }}>
            {app.matchingScore ?? 84}%
          </span>
        </div>

        <div className="d-flex align-items-center gap-1">
          {/* Quick stage selector */}
          <select
            value={app.status}
            onChange={(e) => onMoveStage && onMoveStage(app.id, e.target.value)}
            className="form-select form-select-sm py-0 px-1 border-light text-muted"
            style={{ fontSize: '10px', height: '24px', width: 'auto' }}
            title="Changer d'étape rapidement"
            onClick={(e) => e.stopPropagation()}
          >
            <option value={ApplicationStatus.NEW}>Nouveau</option>
            <option value={ApplicationStatus.SCREENING}>Screening</option>
            <option value={ApplicationStatus.OFFER}>Offre</option>
            <option value={ApplicationStatus.HIRED}>Embauché</option>
            <option value={ApplicationStatus.REJECTED}>Rejeté</option>
          </select>

          <Link
            to={`/recruiter/candidates/${app.candidateId}`}
            className="btn btn-secondary btn-sm p-1 border text-muted d-inline-flex align-items-center"
            style={{ width: '24px', height: '24px' }}
            title="Consulter le profil complet"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ApplicationsKanbanPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [aiRankingEnabled, setAiRankingEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0); // 0 = all, 70, 80
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { data: job } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(Number(id)),
  });

  const {
    data: applicationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['job-applications', id],
    queryFn: () => applicationService.getJobApplications(Number(id), 0, 100),
  });

  const [appsList, setAppsList] = useState([]);

  useEffect(() => {
    if (applicationsData?.content) {
      setAppsList(applicationsData.content);
    }
  }, [applicationsData]);

  // Mutation to update application status
  const mutation = useMutation({
    mutationFn: ({ appId, newStatus }) =>
      applicationService.updateApplicationStatus(appId, newStatus),
    onMutate: async ({ appId, newStatus }) => {
      const previousList = appsList;
      setAppsList(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      if (selectedCandidate && selectedCandidate.id === appId) {
        setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
      }
      return { previousList };
    },
    onError: (err, variables, context) => {
      if (context?.previousList) {
        setAppsList(context.previousList);
      }
      toastError(getErrorMessage(err, 'Échec de la mise à jour de l\'étape. Rétablissement de l\'état précédent.'));
    },
    onSuccess: (updatedApp) => {
      toastSuccess(`Candidat déplacé vers l'étape ${updatedApp.status}.`);
      queryClient.invalidateQueries({ queryKey: ['job-applications', id] });
    },
  });

  const handleMoveStage = (appId, newStatus) => {
    mutation.mutate({ appId: Number(appId), newStatus });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Filtered and grouped applications per column
  const columnData = useMemo(() => {
    let list = [...appsList];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        a =>
          (a.candidateName && a.candidateName.toLowerCase().includes(q)) ||
          (a.candidateEmail && a.candidateEmail.toLowerCase().includes(q))
      );
    }

    // Filter by minimum score
    if (minScoreFilter > 0) {
      list = list.filter(a => (a.matchingScore ?? 0) >= minScoreFilter);
    }

    // AI Ranking order
    if (aiRankingEnabled) {
      list.sort((a, b) => (b.matchingScore ?? 0) - (a.matchingScore ?? 0));
    }

    const grouped = {};
    COLUMNS.forEach(col => {
      grouped[col.id] = list.filter(item => item.status === col.id);
    });
    return grouped;
  }, [appsList, searchQuery, minScoreFilter, aiRankingEnabled]);

  // Overall pipeline metrics
  const metrics = useMemo(() => {
    const total = appsList.length;
    const newCount = appsList.filter(a => a.status === ApplicationStatus.NEW).length;
    const screeningCount = appsList.filter(a => a.status === ApplicationStatus.SCREENING).length;
    const offerCount = appsList.filter(a => a.status === ApplicationStatus.OFFER).length;
    const hiredCount = appsList.filter(a => a.status === ApplicationStatus.HIRED).length;
    const scores = appsList.map(a => a.matchingScore).filter(Boolean);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 84;
    return { total, newCount, screeningCount, offerCount, hiredCount, avgScore };
  }, [appsList]);

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
      mutation.mutate({ appId: activeId, newStatus: targetColumn });
    }
  };

  return (
    <div>
      {/* Return back button */}
      <div className="mb-3">
        <Link to={ROUTES.RECRUITER_JOBS} className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ChevronLeft size={14} />
          <span>Retour à la gestion des offres</span>
        </Link>
      </div>

      {/* Title & Actions Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h1 className="fs-4 fw-bold text-dark mb-0">
              {job?.title || `Pipeline de Recrutement #${id}`}
            </h1>
            <span className="badge bg-light text-dark border">
              {appsList.length} candidat{appsList.length !== 1 ? 's' : ''} au total
            </span>
          </div>
          <p className="text-muted small mb-0 mt-1">
            Gérez vos étapes de sélection par glisser-déposer ou via les actions rapides.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* AI Ranking Toggle */}
          <button
            type="button"
            className={clsx(
              'btn btn-sm d-flex align-items-center gap-1.5 border',
              aiRankingEnabled ? 'btn-ai' : 'btn-secondary'
            )}
            onClick={() => setAiRankingEnabled(!aiRankingEnabled)}
          >
            <Sparkles size={14} />
            <span>Classement IA {aiRankingEnabled ? 'Activé' : 'Désactivé'}</span>
          </button>

          {/* AI Ranked View Link */}
          <Link to={`/recruiter/jobs/${id}/ranking`}>
            <Button variant="secondary" size="sm" icon={<Award size={14} />}>
              Vue Classée IA
            </Button>
          </Link>
        </div>
      </div>

      {/* Pipeline Metrics Summary Card */}
      <div className="row g-2 mb-4">
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white border rounded text-center">
            <div className="text-muted small" style={{ fontSize: '11px' }}>Total Candidats</div>
            <div className="fs-5 fw-bold text-dark">{metrics.total}</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white border rounded text-center">
            <div className="text-primary small" style={{ fontSize: '11px' }}>Nouveaux</div>
            <div className="fs-5 fw-bold text-primary">{metrics.newCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white border rounded text-center">
            <div className="text-warning small" style={{ fontSize: '11px' }}>En Screening</div>
            <div className="fs-5 fw-bold text-warning">{metrics.screeningCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white border rounded text-center">
            <div className="text-info small" style={{ fontSize: '11px' }}>Offres formulées</div>
            <div className="fs-5 fw-bold text-info">{metrics.offerCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white border rounded text-center">
            <div className="text-success small" style={{ fontSize: '11px' }}>Recrutés</div>
            <div className="fs-5 fw-bold text-success">{metrics.hiredCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white border rounded text-center">
            <div className="text-muted small" style={{ fontSize: '11px' }}>Score Moyen IA</div>
            <div className="fs-5 fw-bold text-dark">{metrics.avgScore}%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3 bg-white p-3 rounded border">
        {/* Search */}
        <div className="position-relative flex-grow-1" style={{ maxWidth: '360px' }}>
          <input
            type="text"
            className="form-control form-control-sm ps-4"
            placeholder="Rechercher par nom ou email de candidat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search size={14} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
        </div>

        {/* Score filter pills */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small d-none d-sm-inline">Filtrer par Score :</span>
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              onClick={() => setMinScoreFilter(0)}
              className={clsx('btn btn-sm', minScoreFilter === 0 ? 'btn-primary' : 'btn-secondary text-muted')}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setMinScoreFilter(75)}
              className={clsx('btn btn-sm', minScoreFilter === 75 ? 'btn-primary' : 'btn-secondary text-muted')}
            >
              &ge; 75%
            </button>
            <button
              type="button"
              onClick={() => setMinScoreFilter(85)}
              className={clsx('btn btn-sm', minScoreFilter === 85 ? 'btn-primary' : 'btn-secondary text-muted')}
            >
              &ge; 85% (Top)
            </button>
          </div>
        </div>
      </div>

      {isLoading && <Skeleton count={3} height={140} className="mb-3" />}

      {isError && (
        <ErrorState
          title="Impossible de charger les candidatures du pipeline"
          message="Veuillez vérifier votre connexion et réessayer."
          onRetry={refetch}
        />
      )}

      {/* Kanban Board Columns */}
      {!isLoading && !isError && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="row g-3 overflow-auto flex-nowrap pb-4" style={{ minHeight: '620px' }}>
            {COLUMNS.map(column => {
              const columnApps = columnData[column.id] || [];

              return (
                <div key={column.id} className="col-12 col-sm-6 col-md-4 col-xl" style={{ minWidth: '250px' }}>
                  <div className="p-2 bg-light border rounded h-100 d-flex flex-column">
                    {/* Column Header */}
                    <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold small text-dark">{column.label}</span>
                        <span className="badge bg-white text-dark border fw-bold" style={{ fontSize: '0.6875rem' }}>
                          {columnApps.length}
                        </span>
                      </div>
                    </div>

                    {/* Column Items */}
                    <SortableContext
                      items={columnApps.map(a => String(a.id))}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex-grow-1" style={{ minHeight: '120px' }}>
                        {columnApps.map(app => (
                          <KanbanCard
                            key={app.id}
                            app={app}
                            onSelectCandidate={setSelectedCandidate}
                            onMoveStage={handleMoveStage}
                          />
                        ))}
                        {columnApps.length === 0 && (
                          <div className="text-center py-4 text-muted small border border-dashed rounded bg-white bg-opacity-50 my-2">
                            Déposez un candidat ici
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

      {/* Candidate Quick Preview Modal */}
      <Modal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title="Détails du Candidat &amp; Actions de Sélection"
        size="md"
      >
        {selectedCandidate && (
          <div className="d-flex flex-column gap-3">
            {/* Header info */}
            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded border">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary text-white fw-bold rounded"
                  style={{ width: '42px', height: '42px', fontSize: '1rem' }}
                >
                  {selectedCandidate.candidateName ? selectedCandidate.candidateName.substring(0, 2).toUpperCase() : 'CA'}
                </div>
                <div>
                  <h3 className="fs-6 fw-bold text-dark mb-0">{selectedCandidate.candidateName}</h3>
                  <div className="text-muted small">{selectedCandidate.candidateEmail}</div>
                  <div className="text-muted small" style={{ fontSize: '11px' }}>
                    Candidaté le {formatDate(selectedCandidate.appliedAt)} &bull; Réf #{selectedCandidate.id}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <ScoreRing score={selectedCandidate.matchingScore ?? 85} size={44} />
                <span className="small text-muted d-block mt-1" style={{ fontSize: '10px' }}>Score IA</span>
              </div>
            </div>

            {/* Current Stage */}
            <div className="d-flex align-items-center justify-content-between p-2.5 border rounded">
              <span className="small text-muted fw-semibold">Étape actuelle du processus :</span>
              <StatusBadge status={selectedCandidate.status} />
            </div>

            {/* Quick Change Stage Actions */}
            <div>
              <span className="form-label small fw-semibold text-dark d-block mb-2">
                Faire évoluer le candidat vers :
              </span>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  disabled={selectedCandidate.status === ApplicationStatus.SCREENING}
                  onClick={() => handleMoveStage(selectedCandidate.id, ApplicationStatus.SCREENING)}
                  className="btn btn-warning btn-sm d-flex align-items-center justify-content-between text-dark"
                >
                  <span>Passer en Évaluation / Screening</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  disabled={selectedCandidate.status === ApplicationStatus.OFFER}
                  onClick={() => handleMoveStage(selectedCandidate.id, ApplicationStatus.OFFER)}
                  className="btn btn-info btn-sm d-flex align-items-center justify-content-between text-dark"
                >
                  <span>Formuler une Offre d'emploi</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  disabled={selectedCandidate.status === ApplicationStatus.HIRED}
                  onClick={() => handleMoveStage(selectedCandidate.id, ApplicationStatus.HIRED)}
                  className="btn btn-success btn-sm d-flex align-items-center justify-content-between text-white"
                >
                  <span>Confirmer le Recrutement (Embauché)</span>
                  <CheckCircle2 size={14} />
                </button>

                <button
                  type="button"
                  disabled={selectedCandidate.status === ApplicationStatus.REJECTED}
                  onClick={() => handleMoveStage(selectedCandidate.id, ApplicationStatus.REJECTED)}
                  className="btn btn-secondary btn-sm d-flex align-items-center justify-content-between text-danger"
                >
                  <span>Archiver / Candidature non retenue</span>
                  <XCircle size={14} />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
              <Link
                to={`/recruiter/candidates/${selectedCandidate.candidateId}`}
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
              >
                <span>Voir le profil détaillé</span>
                <ExternalLink size={13} />
              </Link>
              <Button variant="secondary" size="sm" onClick={() => setSelectedCandidate(null)}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
