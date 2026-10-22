import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(Number(id)),
  });

  const handleApply = async () => {
    if (!user) {
      navigate(ROUTES.LOGIN, { state: { from: `/jobs/${id}` } });
      return;
    }
    setIsApplying(true);
    try {
      await applicationService.apply(Number(id));
      setHasApplied(true);
      toastSuccess('Your application has been submitted successfully.');
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to submit application. You may have already applied.'));
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
        title="Job offer not found"
        message="This job offer may have been closed or removed."
        onRetry={refetch}
      />
    );
  }

  const sanitizedDescription = DOMPurify.sanitize(job.description || '');
  const matchScore = job.matchScore ?? 88;

  return (
    <div>
      
      <div className="mb-3">
        <Link to={ROUTES.JOBS} className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
          <ChevronLeft size={14} />
          <span>Back to job listings</span>
        </Link>
      </div>

      <div className="row g-4">
        
        <div className="col-12 col-lg-8">
          <Card className="p-4 mb-4">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <h1 className="fs-4 fw-bold text-dark mb-2">{job.title}</h1>
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                  <span className="d-flex align-items-center gap-1">
                    <Building2 size={15} />
                    {job.departmentName || 'Engineering'}
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
                <div className="d-none d-md-block">
                  <ScoreRing score={matchScore} size={54} />
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2 pt-2 pb-3 mb-3 border-top border-bottom small text-muted">
              <div>
                <strong>Work Mode:</strong> {formatWorkMode(job.workMode)}
              </div>
              <span className="d-none d-sm-inline">&bull;</span>
              <div>
                <strong>Experience:</strong> {formatExperienceLevel(job.experienceLevel)}
              </div>
              <span className="d-none d-sm-inline">&bull;</span>
              <div>
                <strong>Posted:</strong> {formatDate(job.createdAt)}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="fs-6 fw-semibold text-dark mb-2">Job Description</h2>
              <div
                className="text-dark small leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </div>

            <div className="mb-4">
              <h2 className="fs-6 fw-semibold text-dark mb-2">Required Skills</h2>
              <div className="d-flex flex-wrap gap-1">
                {(job.requiredSkills || []).map(skill => (
                  <SkillTag key={skill} name={skill} />
                ))}
              </div>
            </div>

            {user?.role === Role.CANDIDATE && (
              <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isApplying}
                  disabled={hasApplied}
                  onClick={handleApply}
                  icon={hasApplied ? <CheckCircle2 size={18} /> : <Send size={18} />}
                >
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </Button>
                <span className="text-muted small">Instant application with your active CV</span>
              </div>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          
          {user?.role === Role.CANDIDATE && (
            <Card
              className="p-3 mb-4 border-success ai-container bg-white"
              header={
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <AiBadge label="AI Match Score" />
                    <span className="fw-semibold small">Fit Breakdown</span>
                  </div>
                  <span className="fw-bold fs-6 text-success">{matchScore}%</span>
                </div>
              }
            >
              <p className="text-muted small mb-3">
                Calculated by analyzing your registered skills, verified experience, and work preferences against this position.
              </p>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Skills Match</span>
                  <span className="text-muted">55 / 60 pts</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${(55 / 60) * 100}%` }} />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Experience Level</span>
                  <span className="text-muted">25 / 25 pts</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Education Fit</span>
                  <span className="text-muted">8 / 10 pts</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '80%' }} />
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-medium text-dark">Preferences &amp; Location</span>
                  <span className="text-muted">4 / 5 pts</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '80%' }} />
                </div>
              </div>
            </Card>
          )}

          <Card className="p-3 mb-4">
            <h3 className="fs-6 fw-semibold text-dark mb-2">About the Department</h3>
            <div className="d-flex align-items-center gap-2 mb-2 text-dark fw-medium small">
              <Building2 size={16} className="text-primary" />
              <span>{job.departmentName || 'Engineering & Technology'}</span>
            </div>
            <p className="text-muted small mb-3">
              This department focuses on building high-reliability distributed systems, modern web architectures, and cloud services.
            </p>
            <div className="text-muted small">
              <strong>Recruiter Contact:</strong> {job.recruiterEmail || 'recruitment@talent360.ma'}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
