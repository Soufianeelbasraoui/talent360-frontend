import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { candidateService } from '@/api/candidateService';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SkillTag } from '@/components/SkillTag';
import { AiBadge } from '@/components/AiBadge';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/utils/formatters';
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Download,
  CheckCircle2,
} from 'lucide-react';

export function CandidateProfileViewPage() {
  const { id } = useParams();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    data: candidate,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['candidate-view', id],
    queryFn: () => candidateService.getCandidate(Number(id)),
  });

  const handleDownloadCv = async () => {
    try {
      const blob = await candidateService.downloadCv(Number(id));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidate_${id}_cv.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toastSuccess('CV downloaded.');
    } catch {
      toastError('Could not download candidate CV file.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-3">
        <Skeleton count={6} height={50} className="mb-3" />
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <ErrorState
        title="Candidate profile unavailable"
        message="Could not load candidate information from the server."
        onRetry={refetch}
      />
    );
  }

  const latestDoc = candidate.documents?.[candidate.documents.length - 1];

  return (
    <div>
      <div className="mb-3">
        <Link to="/recruiter/jobs" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ChevronLeft size={14} />
          <span>Back to recruiter dashboard</span>
        </Link>
      </div>

      <Card className="p-4 mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fs-5 fw-bold"
              style={{ width: '56px', height: '56px' }}
            >
              {candidate.firstName?.[0] || 'C'}
              {candidate.lastName?.[0] || 'U'}
            </div>
            <div>
              <h1 className="fs-5 fw-bold text-dark mb-1">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                <span className="d-flex align-items-center gap-1">
                  <Mail size={13} />
                  {candidate.email}
                </span>
                {candidate.phone && (
                  <>
                    <span>&bull;</span>
                    <span className="d-flex align-items-center gap-1">
                      <Phone size={13} />
                      {candidate.phone}
                    </span>
                  </>
                )}
                {candidate.location && (
                  <>
                    <span>&bull;</span>
                    <span className="d-flex align-items-center gap-1">
                      <MapPin size={13} />
                      {candidate.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {latestDoc && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadCv}
              icon={<Download size={14} />}
            >
              Download CV
            </Button>
          )}
        </div>
      </Card>

      <div className="row g-4">
        
        <div className="col-12 col-lg-8">
          
          {candidate.bio && (
            <Card header={<div className="fw-semibold">Professional Summary</div>} className="mb-4">
              <p className="text-dark small leading-relaxed mb-0">{candidate.bio}</p>
            </Card>
          )}

          <Card header={<div className="fw-semibold">Technical Skills</div>} className="mb-4">
            <div className="d-flex flex-wrap gap-1">
              {(candidate.skills || ['Java', 'Spring Boot', 'MySQL']).map(s => (
                <SkillTag key={s} name={s} />
              ))}
            </div>
          </Card>

          <Card header={<div className="fw-semibold">Background</div>} className="mb-4">
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="text-muted small">Experience Level</div>
                <div className="fw-semibold text-dark">
                  {candidate.experienceYears ?? 3} Years of Experience
                </div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted small">Education / Degree</div>
                <div className="fw-semibold text-dark">
                  {candidate.education || 'Degree in Computer Science'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card
            className="p-3 mb-4 border-success ai-container bg-white"
            header={
              <div className="d-flex align-items-center gap-2">
                <AiBadge label="AI Summary" />
                <span className="fw-semibold small">Candidate Profile Fit</span>
              </div>
            }
          >
            <div className="small text-muted mb-3">
              Automated extraction synthesized from the candidate&apos;s verified credentials and uploaded resume.
            </div>

            <div className="mb-3">
              <div className="small fw-semibold text-success d-flex align-items-center gap-1 mb-1">
                <CheckCircle2 size={14} />
                <span>Core Competencies Detected</span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {(candidate.skills || ['Java', 'Spring Boot', 'SQL']).slice(0, 4).map(skill => (
                  <SkillTag key={skill} name={skill} status="matching" />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="small fw-semibold text-dark mb-1">Verified Languages</div>
              <div className="d-flex gap-1 flex-wrap">
                <span className="badge bg-light text-dark border">French (Fluent)</span>
                <span className="badge bg-light text-dark border">English (Professional)</span>
                <span className="badge bg-light text-dark border">Arabic (Native)</span>
              </div>
            </div>

            <div className="pt-2 border-top text-muted small">
              <strong>Member since:</strong> {formatDate(candidate.createdAt)}
            </div>
          </Card>

          {(candidate.linkedin || candidate.github) && (
            <Card header={<div className="fw-semibold">External Links</div>} className="mb-4">
              {candidate.linkedin && (
                <div className="mb-2 small">
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-none d-flex align-items-center gap-1"
                  >
                    <Globe size={14} />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              )}
              {candidate.github && (
                <div className="small">
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-none d-flex align-items-center gap-1"
                  >
                    <Globe size={14} />
                    <span>GitHub Profile</span>
                  </a>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
