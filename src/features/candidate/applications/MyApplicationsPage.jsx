import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { applicationService } from '@/api/applicationService';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ScoreRing } from '@/components/ScoreRing';
import { ROUTES } from '@/constants/routes';
import { ApplicationStatus } from '@/constants/enums';
import { formatDate } from '@/utils/formatters';
import {
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Calendar,
} from 'lucide-react';
import clsx from 'clsx';

const PIPELINE_STEPS = [
  { key: ApplicationStatus.NEW, label: 'Candidature Reçue', desc: 'Votre candidature est enregistrée et transmise au recruteur.' },
  { key: ApplicationStatus.SCREENING, label: 'Évaluation & Screening', desc: 'Le recruteur examine votre profil et étudie vos compétences.' },
  { key: ApplicationStatus.OFFER, label: 'Offre d\'emploi', desc: 'Une proposition formelle est en cours de formulation.' },
  { key: ApplicationStatus.HIRED, label: 'Embauché', desc: 'Félicitations ! Vous avez été retenu(e) pour ce poste.' },
];

export function MyApplicationsPage() {
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'HIRED' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: applicationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(0, 50),
  });

  const rawApplications = useMemo(() => applicationsData?.content || [], [applicationsData]);

  // Filtered applications
  const applications = useMemo(() => {
    return rawApplications.filter(app => {
      // Tab filter
      if (filterTab === 'ACTIVE') {
        if (app.status === ApplicationStatus.HIRED || app.status === ApplicationStatus.REJECTED) return false;
      } else if (filterTab === 'HIRED') {
        if (app.status !== ApplicationStatus.HIRED) return false;
      } else if (filterTab === 'REJECTED') {
        if (app.status !== ApplicationStatus.REJECTED) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (app.jobOfferTitle || '').toLowerCase();
        if (!title.includes(query)) return false;
      }

      return true;
    });
  }, [rawApplications, filterTab, searchQuery]);

  const counts = useMemo(() => {
    const total = rawApplications.length;
    const active = rawApplications.filter(
      a => a.status === ApplicationStatus.NEW || a.status === ApplicationStatus.SCREENING || a.status === ApplicationStatus.OFFER
    ).length;
    const hired = rawApplications.filter(a => a.status === ApplicationStatus.HIRED).length;
    const rejected = rawApplications.filter(a => a.status === ApplicationStatus.REJECTED).length;
    return { total, active, hired, rejected };
  }, [rawApplications]);

  const getStepIndex = (status) => {
    switch (status) {
      case ApplicationStatus.NEW:
        return 0;
      case ApplicationStatus.SCREENING:
        return 1;
      case ApplicationStatus.OFFER:
        return 2;
      case ApplicationStatus.HIRED:
        return 3;
      case ApplicationStatus.REJECTED:
        return -1;
      default:
        return 0;
    }
  };

  const getStatusExplanation = (status) => {
    switch (status) {
      case ApplicationStatus.NEW:
        return {
          title: 'Candidature reçue par l\'équipe de recrutement',
          text: 'Votre profil a été automatiquement analysé par le moteur d\'IA. Le recruteur en charge du poste examinera bientôt vos détails.',
          alertClass: 'alert-primary bg-primary bg-opacity-10 text-primary border-primary border-opacity-25',
        };
      case ApplicationStatus.SCREENING:
        return {
          title: 'Profil en cours d\'évaluation technique & RH',
          text: 'Votre candidature a retenu l\'attention du recruteur. Vous êtes actuellement en phase d\'examen approfondi et possiblement contacté pour un entretien.',
          alertClass: 'alert-warning bg-warning bg-opacity-10 text-dark border-warning border-opacity-50',
        };
      case ApplicationStatus.OFFER:
        return {
          title: 'Offre d\'embauche en préparation',
          text: 'Excellente nouvelle ! L\'entreprise prépare une proposition contractuelle pour finaliser votre recrutement.',
          alertClass: 'alert-info bg-info bg-opacity-10 text-dark border-info border-opacity-50',
        };
      case ApplicationStatus.HIRED:
        return {
          title: 'Recrutement confirmé & Finalisé !',
          text: 'Félicitations, vous avez été officiellement embauché pour ce poste ! Bienvenue dans votre nouvelle aventure.',
          alertClass: 'alert-success bg-success bg-opacity-10 text-success border-success border-opacity-25',
        };
      case ApplicationStatus.REJECTED:
        return {
          title: 'Candidature non retenue pour ce poste',
          text: 'Le recruteur a choisi de poursuivre avec d\'autres profils correspondant plus spécifiquement aux besoins du projet. Continuez à explorer les nombreuses autres offres !',
          alertClass: 'alert-secondary bg-light text-muted border',
        };
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">Suivi de mes Candidatures</h1>
          <p className="text-muted small mb-0">
            Suivez l'état d'avancement de vos démarches et les étapes de sélection en temps réel.
          </p>
        </div>
        <Link to={ROUTES.JOBS}>
          <Button variant="primary" size="sm" icon={<Briefcase size={14} />}>
            Explorer d'autres offres
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        {/* Tabs */}
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterTab('ALL')}
            className={clsx(
              'btn btn-sm d-inline-flex align-items-center gap-1.5 border',
              filterTab === 'ALL' ? 'btn-primary' : 'btn-secondary text-muted'
            )}
          >
            <span>Toutes</span>
            <span className="badge bg-white text-dark border ms-1">{counts.total}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('ACTIVE')}
            className={clsx(
              'btn btn-sm d-inline-flex align-items-center gap-1.5 border',
              filterTab === 'ACTIVE' ? 'btn-primary' : 'btn-secondary text-muted'
            )}
          >
            <span>En cours</span>
            <span className="badge bg-warning bg-opacity-25 text-dark border ms-1">{counts.active}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('HIRED')}
            className={clsx(
              'btn btn-sm d-inline-flex align-items-center gap-1.5 border',
              filterTab === 'HIRED' ? 'btn-primary' : 'btn-secondary text-muted'
            )}
          >
            <span>Retenues</span>
            <span className="badge bg-success bg-opacity-25 text-success border ms-1">{counts.hired}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('REJECTED')}
            className={clsx(
              'btn btn-sm d-inline-flex align-items-center gap-1.5 border',
              filterTab === 'REJECTED' ? 'btn-primary' : 'btn-secondary text-muted'
            )}
          >
            <span>Archivées</span>
            <span className="badge bg-light text-muted border ms-1">{counts.rejected}</span>
          </button>
        </div>

        {/* Search */}
        <div className="position-relative" style={{ minWidth: '240px' }}>
          <input
            type="text"
            className="form-control form-control-sm ps-4"
            placeholder="Rechercher par titre de poste..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search size={14} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
        </div>
      </div>

      {isLoading && <Skeleton count={4} height={120} className="mb-3" />}

      {isError && (
        <ErrorState
          title="Impossible de charger vos candidatures"
          message="Veuillez vérifier votre connexion et réessayer."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <Card>
          <EmptyState
            title="Aucune candidature trouvée"
            description={
              searchQuery
                ? 'Aucun résultat ne correspond à votre recherche.'
                : 'Vous n\'avez pas encore déposé de candidature dans cette catégorie.'
            }
            action={
              <Link to={ROUTES.JOBS}>
                <Button variant="primary" size="sm">
                  Consulter les offres ouvertes
                </Button>
              </Link>
            }
          />
        </Card>
      )}

      {/* Applications Cards List */}
      {!isLoading && !isError && applications.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {applications.map(app => {
            const currentStep = getStepIndex(app.status);
            const isRejected = app.status === ApplicationStatus.REJECTED;
            const explanation = getStatusExplanation(app.status);

            return (
              <Card key={app.id} className="p-4 mb-0 bg-white border shadow-sm">
                {/* Header Information */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h2 className="fs-6 fw-bold text-dark mb-0">
                        {app.jobOfferTitle || `Poste #${app.jobOfferId}`}
                      </h2>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="d-flex align-items-center gap-3 text-muted small mt-1">
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={13} />
                        Candidaté le {formatDate(app.appliedAt)}
                      </span>
                      <span>&bull;</span>
                      <span>Réf. #{app.id}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {app.matchingScore && (
                      <div className="d-flex align-items-center gap-2 bg-light px-2.5 py-1 rounded border">
                        <span className="text-muted small fw-medium">Affinité IA :</span>
                        <ScoreRing score={app.matchingScore} size={34} />
                      </div>
                    )}
                    <Link to={`/jobs/${app.jobOfferId}`}>
                      <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                        Voir l'offre
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Status Explanation Banner */}
                {explanation && (
                  <div className={clsx('p-3 rounded mb-3 small border', explanation.alertClass)}>
                    <div className="fw-bold mb-0.5">{explanation.title}</div>
                    <div>{explanation.text}</div>
                  </div>
                )}

                {/* Interactive Stage Stepper */}
                <div className="pt-3 border-top mt-2">
                  {isRejected ? (
                    <div className="d-flex align-items-center gap-2 text-muted small p-2 bg-light rounded border">
                      <Clock size={16} className="text-secondary" />
                      <span>Ce dossier a été traité par l'équipe et archivé pour ce cycle de recrutement.</span>
                    </div>
                  ) : (
                    <div>
                      <div className="d-none d-md-block position-relative my-2">
                        {/* Stepper Progress Bar */}
                        <div
                          className="position-absolute top-50 start-0 translate-middle-y w-100 bg-light"
                          style={{ height: '4px', zIndex: 1 }}
                        />
                        <div
                          className="position-absolute top-50 start-0 translate-middle-y bg-primary"
                          style={{
                            height: '4px',
                            zIndex: 1,
                            width: `${(currentStep / (PIPELINE_STEPS.length - 1)) * 100}%`,
                            transition: 'width 0.4s ease',
                          }}
                        />

                        {/* Stepper Steps */}
                        <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                          {PIPELINE_STEPS.map((step, idx) => {
                            const isDone = idx <= currentStep;
                            const isCurrent = idx === currentStep;

                            return (
                              <div key={idx} className="text-center" style={{ width: '130px' }}>
                                <div
                                  className={clsx(
                                    'd-inline-flex align-items-center justify-content-center rounded-circle small mb-1.5 transition',
                                    isDone
                                      ? 'bg-primary text-white shadow-sm'
                                      : 'bg-white border text-muted'
                                  )}
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    fontSize: '0.75rem',
                                    borderWidth: '2px',
                                  }}
                                >
                                  {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                                </div>
                                <div
                                  className={clsx(
                                    'small line-clamp-1',
                                    isCurrent
                                      ? 'fw-bold text-primary'
                                      : isDone
                                      ? 'fw-medium text-dark'
                                      : 'text-muted'
                                  )}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {step.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mobile Step Indicator */}
                      <div className="d-md-none d-flex align-items-center justify-content-between p-2 bg-light rounded small">
                        <span className="text-muted">Étape actuelle :</span>
                        <span className="fw-bold text-primary">
                          {PIPELINE_STEPS[currentStep]?.label || 'En examen'} ({currentStep + 1}/4)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
