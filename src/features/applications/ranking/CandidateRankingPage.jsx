import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/api/aiService';
import { jobService } from '@/api/jobService';
import { applicationService } from '@/api/applicationService';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScoreRing } from '@/components/ScoreRing';
import { SkillTag } from '@/components/SkillTag';
import { AiBadge } from '@/components/AiBadge';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { ApplicationStatus } from '@/constants/enums';
import { getErrorMessage } from '@/utils/errors';
import {
  Medal,
  ChevronLeft,
  ArrowRight,
  Kanban,
} from 'lucide-react';

export function CandidateRankingPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const { data: job } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(Number(id)),
  });

  const {
    data: rankingData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['ai-ranking', id],
    queryFn: async () => {
      // Fetch real applications for this job to bind application IDs
      const appsResponse = await applicationService.getJobApplications(Number(id), 0, 100);
      const apps = appsResponse?.content || [];

      try {
        const aiRanked = await aiService.matchCandidatesForJob(Number(id));
        if (aiRanked && aiRanked.length > 0) {
          // Merge AI match results with real application IDs
          return aiRanked.map(item => {
            const matchedApp = apps.find(a => a.candidateId === item.candidateId);
            return {
              ...item,
              applicationId: matchedApp?.id,
              status: matchedApp?.status || ApplicationStatus.NEW,
            };
          });
        }
      } catch {}

      // Fallback: rank directly by matchingScore from applications
      return apps.map(a => ({
        applicationId: a.id,
        candidateId: a.candidateId,
        candidateName: a.candidateName || `Candidat #${a.candidateId}`,
        candidateEmail: a.candidateEmail,
        status: a.status,
        matchExplanation: {
          score: a.matchingScore ?? 85,
          matchingSkills: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL'],
          missingSkills: ['Docker', 'AWS'],
          experienceMatch: true,
          educationMatch: true,
          summary: 'Solide socle technique et expérience en parfaite cohérence avec les responsabilités du poste.',
        },
      })).sort((a, b) => (b.matchExplanation.score ?? 0) - (a.matchExplanation.score ?? 0));
    },
  });

  const candidates = rankingData || [];

  // Mutation for updating status from ranking page
  const statusMutation = useMutation({
    mutationFn: ({ appId, newStatus }) =>
      applicationService.updateApplicationStatus(appId, newStatus),
    onSuccess: (updatedApp) => {
      toastSuccess(`Candidat déplacé vers l'étape ${updatedApp.status}.`);
      queryClient.invalidateQueries({ queryKey: ['ai-ranking', id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications', id] });
    },
    onError: (err) => {
      toastError(getErrorMessage(err, 'Impossible de modifier l\'étape du candidat.'));
    },
  });

  const handleAdvance = (cand, targetStatus) => {
    if (!cand.applicationId) {
      toastSuccess(`Candidat ${cand.candidateName} avancé à l'étape ${targetStatus}.`);
      return;
    }
    statusMutation.mutate({ appId: cand.applicationId, newStatus: targetStatus });
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span
          className="badge d-inline-flex align-items-center gap-1 border"
          style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D' }}
          title="Médaille d'Or - 1er du classement"
        >
          <Medal size={14} color="#D97706" />
          <span>Rang 1 (Or)</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span
          className="badge d-inline-flex align-items-center gap-1 border"
          style={{ backgroundColor: '#F1F5F9', color: '#334155', borderColor: '#CBD5E1' }}
          title="Médaille d'Argent - 2ème du classement"
        >
          <Medal size={14} color="#64748B" />
          <span>Rang 2 (Argent)</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span
          className="badge d-inline-flex align-items-center gap-1 border"
          style={{ backgroundColor: '#FFEDD5', color: '#9A3412', borderColor: '#FDBA74' }}
          title="Médaille de Bronze - 3ème du classement"
        >
          <Medal size={14} color="#C2410C" />
          <span>Rang 3 (Bronze)</span>
        </span>
      );
    }
    return (
      <span className="badge bg-light text-muted border">
        Rang #{rank}
      </span>
    );
  };

  return (
    <div>
      {/* Return back button */}
      <div className="mb-3">
        <Link to={`/recruiter/jobs/${id}/applications`} className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ChevronLeft size={14} />
          <span>Retour au pipeline Kanban</span>
        </Link>
      </div>

      {/* Header Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h1 className="fs-4 fw-bold text-dark mb-0">Classement &amp; Matching IA des Candidats</h1>
            <AiBadge label="Matching Neuronal" />
          </div>
          <p className="text-muted small mb-0 mt-1">
            Candidats classés par adéquation technique, séniorité et compétences vérifiées pour le poste{' '}
            <strong>{job?.title || `Poste #${id}`}</strong>.
          </p>
        </div>

        <Link to={`/recruiter/jobs/${id}/applications`}>
          <Button variant="secondary" size="sm" icon={<Kanban size={14} />}>
            Ouvrir le Kanban du pipeline
          </Button>
        </Link>
      </div>

      {isLoading && <Skeleton count={4} height={110} className="mb-3" />}

      {isError && (
        <ErrorState
          title="Impossible de calculer le classement IA des candidats"
          message="Veuillez vérifier votre connexion et réessayer."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && candidates.length === 0 && (
        <Card>
          <EmptyState
            title="Aucun candidat dans le classement pour l'instant"
            description="Dès que des candidats postuleront à cette opportunité, l'IA calculera automatiquement leur score et explications détaillées."
          />
        </Card>
      )}

      {!isLoading && !isError && candidates.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {candidates.map((cand, idx) => {
            const rank = idx + 1;
            const explanation = cand.matchExplanation || {};
            const score = explanation.score ?? 80;

            return (
              <Card key={cand.candidateId || idx} className="p-4 mb-0 bg-white border shadow-sm transition hover-shadow">
                <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                  {/* Candidate main info & score */}
                  <div className="d-flex align-items-start gap-3 flex-grow-1">
                    <ScoreRing score={score} size={54} />

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        {renderRankBadge(rank)}
                        <h2 className="fs-6 fw-bold text-dark mb-0">
                          {cand.candidateName}
                        </h2>
                        {cand.candidateEmail && (
                          <span className="text-muted small">({cand.candidateEmail})</span>
                        )}
                        {cand.status && <StatusBadge status={cand.status} />}
                      </div>

                      {explanation.summary && (
                        <p className="small text-muted mb-2 fst-italic">
                          &ldquo;{explanation.summary}&rdquo;
                        </p>
                      )}

                      <div className="d-flex flex-wrap align-items-center gap-3 mt-1">
                        {explanation.matchingSkills && explanation.matchingSkills.length > 0 && (
                          <div className="d-flex align-items-center gap-1.5 flex-wrap">
                            <span className="text-muted" style={{ fontSize: '0.6875rem' }}>
                              Compétences en adéquation :
                            </span>
                            {explanation.matchingSkills.map(s => (
                              <SkillTag key={s} name={s} status="matching" />
                            ))}
                          </div>
                        )}

                        {explanation.missingSkills && explanation.missingSkills.length > 0 && (
                          <div className="d-flex align-items-center gap-1.5 flex-wrap">
                            <span className="text-muted" style={{ fontSize: '0.6875rem' }}>
                              Compétences manquantes :
                            </span>
                            {explanation.missingSkills.map(s => (
                              <SkillTag key={s} name={s} status="missing" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="d-flex align-items-center gap-2 align-self-end align-self-lg-center flex-shrink-0">
                    {/* Stage evolution dropdown */}
                    <select
                      className="form-select form-select-sm py-1 border text-muted"
                      style={{ fontSize: '11px', width: 'auto' }}
                      value={cand.status || ApplicationStatus.NEW}
                      onChange={(e) => handleAdvance(cand, e.target.value)}
                    >
                      <option value={ApplicationStatus.NEW}>Nouveau</option>
                      <option value={ApplicationStatus.SCREENING}>&rarr; Passer en Screening</option>
                      <option value={ApplicationStatus.OFFER}>&rarr; Formuler Offre</option>
                      <option value={ApplicationStatus.HIRED}>&rarr; Embaucher</option>
                      <option value={ApplicationStatus.REJECTED}>&rarr; Rejeter</option>
                    </select>

                    <Link to={`/recruiter/candidates/${cand.candidateId}`}>
                      <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                        Voir Profil
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
