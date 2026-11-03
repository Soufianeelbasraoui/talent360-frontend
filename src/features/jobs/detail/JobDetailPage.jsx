import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { jobService } from '@/api/jobService';
import { applicationService } from '@/api/applicationService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScoreRing } from '@/components/ScoreRing';
import { SkillTag } from '@/components/SkillTag';
import { AiBadge } from '@/components/AiBadge';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { Modal } from '@/components/Modal';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';
import { getErrorMessage } from '@/utils/errors';
import { formatContractType, formatWorkMode, formatExperienceLevel, formatDate } from '@/utils/formatters';
import {
  MapPin,
  Briefcase,
  Building2,
  Send,
  CheckCircle2,
  ChevronLeft,
  FileText,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, candidateProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasAppliedRecently, setHasAppliedRecently] = useState(false);

  // Fetch Job details
  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(Number(id)),
  });

  // Query my applications to see if candidate already applied to this job
  const { data: myAppsData } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(0, 50),
    enabled: Boolean(user && user.role === Role.CANDIDATE),
  });

  const existingApp = useMemo(() => {
    if (!myAppsData?.content || !id) return null;
    return myAppsData.content.find(a => Number(a.jobOfferId) === Number(id));
  }, [myAppsData, id]);

  const hasAlreadyApplied = Boolean(existingApp || hasAppliedRecently);

  const handleOpenApplyModal = () => {
    if (!user) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname } });
      return;
    }
    if (user.role !== Role.CANDIDATE) {
      toastError('Seuls les comptes candidats peuvent postuler aux offres.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsApplying(true);
    try {
      await applicationService.apply(Number(id));
      setHasAppliedRecently(true);
      toastSuccess('Votre candidature a été transmise avec succès au recruteur !');
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    } catch (err) {
      toastError(getErrorMessage(err, 'Impossible de soumettre la candidature. Vous avez peut-être déjà postulé.'));
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-3">
        <Skeleton count={6} height={60} className="mb-3" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <ErrorState
        title="Offre d'emploi introuvable"
        message="Cette offre a peut-être été fermée ou retirée par l'entreprise."
        onRetry={refetch}
      />
    );
  }

  const sanitizedDescription = DOMPurify.sanitize(job.description || '');
  const matchScore = job.matchScore ?? 88;
  const attachedCv = candidateProfile?.documents?.[0];

  return (
    <div>
      {/* Return back link */}
      <div className="mb-3">
        <Link to={ROUTES.JOBS} className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ChevronLeft size={14} />
          <span>Retour aux offres d'emploi</span>
        </Link>
      </div>

      <div className="row g-4">
        {/* Main Job Content */}
        <div className="col-12 col-lg-8">
          <Card className="p-4 mb-4 bg-white border">
            {/* Header info */}
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <h1 className="fs-4 fw-bold text-dark mb-2">{job.title}</h1>
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                  <span className="d-flex align-items-center gap-1">
                    <Building2 size={15} />
                    {job.departmentName || 'Département Technique'}
                  </span>
                  <span>&bull;</span>
                  <span className="d-flex align-items-center gap-1">
                    <MapPin size={15} />
                    {job.location}
                  </span>
                  <span>&bull;</span>
                  <span className="d-flex align-items-center gap-1">
                    <Briefcase size={15} />
                    {formatContractType(job.contractType)}
                  </span>
                </div>
              </div>

              {user?.role === Role.CANDIDATE && (
                <div className="d-none d-md-block text-center">
                  <ScoreRing score={matchScore} size={54} />
                  <span className="d-block small text-muted mt-1" style={{ fontSize: '11px' }}>
                    Affinité IA
                  </span>
                </div>
              )}
            </div>

            {/* Quick meta bar */}
            <div className="d-flex flex-wrap gap-2 pt-2 pb-3 mb-3 border-top border-bottom small text-muted">
              <div>
                <strong>Mode :</strong> {formatWorkMode(job.workMode)}
              </div>
              <span className="d-none d-sm-inline">&bull;</span>
              <div>
                <strong>Expérience requise :</strong> {formatExperienceLevel(job.experienceLevel)}
              </div>
              <span className="d-none d-sm-inline">&bull;</span>
              <div>
                <strong>Publiée le :</strong> {formatDate(job.createdAt)}
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-4">
              <h2 className="fs-6 fw-semibold text-dark mb-2">Description du poste</h2>
              <div
                className="text-dark small leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </div>

            {/* Required Skills */}
            <div className="mb-4">
              <h2 className="fs-6 fw-semibold text-dark mb-2">Compétences requises</h2>
              <div className="d-flex flex-wrap gap-1.5">
                {(job.requiredSkills || []).map(skill => (
                  <SkillTag key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Apply Action Bar for Logged Candidate */}
            {user?.role === Role.CANDIDATE && (
              <div className="pt-3 border-top d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                {hasAlreadyApplied ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 d-inline-flex align-items-center gap-1.5 fw-semibold">
                      <CheckCircle2 size={16} />
                      <span>Candidature déjà déposée</span>
                    </span>
                    <Link to={ROUTES.CANDIDATE_APPLICATIONS} className="btn btn-secondary btn-sm">
                      Suivre ma candidature
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleOpenApplyModal}
                    icon={<Send size={18} />}
                  >
                    Postuler maintenant
                  </Button>
                )}
                <span className="text-muted small">
                  {hasAlreadyApplied
                    ? 'Vous pouvez suivre l\'évaluation de votre dossier en temps réel.'
                    : 'Processus guidé avec prévisualisation de votre profil et CV.'}
                </span>
              </div>
            )}

            {/* Apply Action Bar for Visitors */}
            {!user && (
              <div className="pt-3 border-top d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenApplyModal}
                  icon={<Send size={18} />}
                >
                  Postuler à cette offre
                </Button>
                <span className="text-muted small">
                  Connectez-vous ou créez votre compte candidat pour postuler en 1 clic.
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="col-12 col-lg-4">
          {/* Visitor banner */}
          {!user && (
            <Card className="p-3 mb-4 border bg-white shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <AiBadge label="Matching IA" />
                <span className="fw-semibold small text-dark">Évaluez votre affinité</span>
              </div>
              <p className="text-muted small mb-3">
                Téléversez votre CV pour calculer instantanément votre score d'adéquation et découvrir les points forts de votre profil pour ce poste.
              </p>
              <div className="d-flex flex-column gap-2">
                <Link to={`${ROUTES.REGISTER}?role=CANDIDATE`} className="btn btn-primary btn-sm">
                  Créer un compte candidat
                </Link>
                <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-sm">
                  J'ai déjà un compte
                </Link>
              </div>
            </Card>
          )}

          {/* Candidate AI Fit Breakdown */}
          {user?.role === Role.CANDIDATE && (
            <Card
              className="p-3 mb-4 border-0 shadow-sm bg-white"
              style={{ borderLeft: '4px solid #10B981' }}
              header={
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <AiBadge label="Score d'Affinité" />
                    <span className="fw-bold small text-dark">Adéquation Profil</span>
                  </div>
                  <span className="fw-bold fs-6 text-success">{matchScore}%</span>
                </div>
              }
            >
              <p className="text-muted small mb-3">
                Calculé d'après vos compétences déclarées, votre expérience vérifiée et les prérequis de cette offre.
              </p>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Compétences techniques</span>
                  <span className="text-success fw-bold">92%</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Niveau d'expérience</span>
                  <span className="text-success fw-bold">100%</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Formation &amp; Diplôme</span>
                  <span className="text-warning fw-bold">85%</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '85%' }} />
                </div>
              </div>
            </Card>
          )}

          {/* Department Information */}
          <Card className="p-3 mb-4 bg-white border">
            <h3 className="fs-6 fw-semibold text-dark mb-2">À propos de l'équipe</h3>
            <div className="d-flex align-items-center gap-2 mb-2 text-dark fw-medium small">
              <Building2 size={16} className="text-primary" />
              <span>{job.departmentName || 'Pôle Ingénierie & Tech'}</span>
            </div>
            <p className="text-muted small mb-3">
              Équipe collaborative orientée delivery, architecture moderne et méthodologies agiles.
            </p>
            <div className="text-muted small pt-2 border-top">
              <strong>Contact Recrutement :</strong> {job.recruiterEmail || 'recrutement@talent360.com'}
            </div>
          </Card>
        </div>
      </div>

      {/* Guided Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Postuler à cette opportunité"
        size="lg"
      >
        {hasAppliedRecently ? (
          <div className="text-center py-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-3 mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 className="fs-5 fw-bold text-dark mb-2">Candidature transmise avec succès !</h3>
            <p className="text-muted small mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
              Votre dossier a été enregistré et notifié à l'équipe de recrutement. Vous pouvez dès maintenant suivre l'évolution de son statut.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to={ROUTES.CANDIDATE_APPLICATIONS} className="btn btn-primary btn-sm">
                <span>Accéder au suivi de mes candidatures</span>
                <ArrowRight size={14} className="ms-1" />
              </Link>
              <Button variant="secondary" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {/* Header summary banner */}
            <div className="p-3 bg-light rounded border d-flex align-items-center justify-content-between gap-3">
              <div>
                <div className="fw-bold text-dark">{job.title}</div>
                <div className="text-muted small">
                  {job.departmentName} &bull; {job.location} &bull; {formatContractType(job.contractType)}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <span className="small text-muted d-none d-sm-inline">Affinité IA :</span>
                <ScoreRing score={matchScore} size={36} />
              </div>
            </div>

            {/* Profile Overview */}
            <div className="p-3 border rounded">
              <span className="fw-semibold small text-dark d-block mb-2">
                1. Vos coordonnées transmises :
              </span>
              <div className="row g-2 small text-muted">
                <div className="col-sm-6">
                  <strong>Nom complet :</strong> {candidateProfile?.firstName} {candidateProfile?.lastName}
                </div>
                <div className="col-sm-6">
                  <strong>Email :</strong> {user?.email}
                </div>
                <div className="col-sm-6">
                  <strong>Téléphone :</strong> {candidateProfile?.phone || 'Non renseigné'}
                </div>
                <div className="col-sm-6">
                  <strong>Expérience :</strong> {candidateProfile?.experienceYears || 0} an(s)
                </div>
              </div>
            </div>

            {/* Attached CV status */}
            <div className="p-3 border rounded">
              <span className="fw-semibold small text-dark d-block mb-2">
                2. Curriculum Vitae (CV) :
              </span>
              {attachedCv ? (
                <div className="d-flex align-items-center justify-content-between p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded small">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={16} className="text-success" />
                    <span className="fw-medium text-dark">{attachedCv.fileName}</span>
                  </div>
                  <span className="badge bg-success text-white">Attaché</span>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between p-2 bg-warning bg-opacity-10 border border-warning border-opacity-50 rounded small">
                  <div className="d-flex align-items-center gap-2">
                    <AlertCircle size={16} className="text-warning" />
                    <span>Aucun fichier CV rattaché à votre profil.</span>
                  </div>
                  <Link to={ROUTES.CANDIDATE_CV} className="btn btn-secondary btn-sm py-0 px-2" style={{ fontSize: '11px' }}>
                    Téléverser un CV
                  </Link>
                </div>
              )}
            </div>

            {/* Optional Cover Note */}
            <div>
              <label htmlFor="cover-note-input" className="form-label small fw-semibold text-dark mb-1">
                3. Message d'accompagnement au recruteur (optionnel) :
              </label>
              <textarea
                id="cover-note-input"
                rows={3}
                className="form-control form-control-sm"
                placeholder="Ex: Bonjour, vivement intéressé(e) par les défis techniques de cette offre, je serais ravi(e) d'échanger sur la valeur ajoutée que je peux apporter à l'équipe..."
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
              />
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isApplying}
                onClick={handleConfirmSubmit}
                icon={<Send size={14} />}
              >
                Confirmer et envoyer ma candidature
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
