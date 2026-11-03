import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/api/jobService';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/constants/enums';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { ScoreRing } from '@/components/ScoreRing';
import { Skeleton } from '@/components/Skeleton';
import { formatContractType, formatWorkMode, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';

export function LiveJobsPreview() {
  const { user, isAuthenticated } = useAuth();
  const isCandidate = Boolean(isAuthenticated && user?.role === Role.CANDIDATE);

  // Fetch real job offers from the backend API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['landing-live-jobs'],
    queryFn: () => jobService.searchJobs({ status: 'OPEN', page: 0, size: 6 }),
  });

  const jobs = data?.content || [];

  return (
    <section className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="container-xl py-4">
        
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end justify-content-between mb-4 gap-3">
          <div>
            <span className="section-badge">Opportunités en Direct</span>
            <h2 className="section-heading mb-1">Offres récemment publiées</h2>
            <p className="text-muted small mb-0">
              Découvrez les postes ouverts en temps réel et testez le matching avec votre profil.
            </p>
          </div>

          <Link to={ROUTES.JOBS} className="btn btn-secondary">
            <span>Toutes les offres</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="row g-3 mb-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="col-12 col-lg-4">
                <Skeleton height={200} className="rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error or Empty State */}
        {!isLoading && (isError || jobs.length === 0) && (
          <div className="bg-white border rounded p-4 text-center mb-4">
            <p className="text-muted mb-3">
              {isError
                ? "Impossible de charger les offres pour le moment."
                : "Aucune offre n'est actuellement publiée."}
            </p>
            <Link to={ROUTES.JOBS} className="btn btn-primary btn-sm">
              Consulter le catalogue des offres
            </Link>
          </div>
        )}

        {/* Real Jobs Grid from Backend */}
        {!isLoading && jobs.length > 0 && (
          <div className="row g-3 mb-4">
            {jobs.slice(0, 3).map(job => {
              // Match score is displayed ONLY for logged-in accounts (candidates) with a valid score
              const hasScore = Boolean(isCandidate && job.matchScore != null);

              return (
                <div key={job.id} className="col-12 col-lg-4">
                  <div className="card h-100 border p-3 bg-white hover-card" style={{ borderRadius: '5px' }}>
                    
                    {/* Header: Department + Score or Status Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-primary border small fw-medium">
                        {job.departmentName || 'Ingénierie'}
                      </span>

                      {hasScore ? (
                        <div className="d-flex align-items-center gap-1" title="Votre score d'affinité IA">
                          <Sparkles size={13} className="text-success" />
                          <ScoreRing score={job.matchScore} size={36} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small fw-normal">
                          Poste ouvert
                        </span>
                      )}
                    </div>

                    {/* Job Title */}
                    <h3 className="fs-6 fw-bold text-dark mb-2" style={{ lineHeight: 1.3 }}>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-dark text-decoration-none hover-underline"
                      >
                        {job.title}
                      </Link>
                    </h3>

                    {/* Metadatas */}
                    <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-3">
                      <span className="d-flex align-items-center gap-1">
                        <MapPin size={13} className="text-secondary" />
                        {job.location}
                      </span>
                      <span>&bull;</span>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-0 fw-normal">
                        {formatContractType(job.contractType)}
                      </span>
                      <span>&bull;</span>
                      <span>{formatWorkMode(job.workMode)}</span>
                    </div>

                    {/* Required Skills */}
                    <div className="d-flex flex-wrap gap-1 mt-auto pt-2 border-top border-light mb-3">
                      {(job.requiredSkills || []).slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="badge bg-light text-muted border fw-normal"
                          style={{ fontSize: '11px' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action Link & Score Status Hint */}
                    <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light">
                      {!isAuthenticated ? (
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          <Sparkles size={11} className="text-success me-1" />
                          Score IA sur connexion
                        </span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          {job.createdAt ? formatDate(job.createdAt) : 'Récemment publié'}
                        </span>
                      )}

                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-primary fw-semibold small text-decoration-none d-inline-flex align-items-center gap-1"
                      >
                        <span>Voir l&apos;offre</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
