import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/api/jobService';
import { applicationService } from '@/api/applicationService';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScoreRing } from '@/components/ScoreRing';
import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { SkillTag } from '@/components/SkillTag';
import { ROUTES } from '@/constants/routes';
import { ApplicationStatus } from '@/constants/enums';
import { formatWorkMode, formatContractType } from '@/utils/formatters';
import { Sparkles, Briefcase, Send, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

export function CandidateDashboardPage() {
  const { user, candidateProfile } = useAuth();

  const {
    data: recommendedData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['candidate', 'recommended-jobs'],
    queryFn: () => jobService.getRecommendedJobs(0, 4),
  });

  const {
    data: applicationsData,
      } = useQuery({
    queryKey: ['candidate', 'applications'],
    queryFn: () => applicationService.getMyApplications(0, 100),
  });

  const candidateName = candidateProfile
    ? `${candidateProfile.firstName} ${candidateProfile.lastName}`
    : user?.email?.split('@')[0] || 'Candidate';

  const apps = applicationsData?.content || [];
  const totalApps = applicationsData?.totalElements ?? apps.length;
  const acceptedApps = apps.filter(a => a.status === ApplicationStatus.HIRED).length;
  const inProgressApps = apps.filter(
    a => a.status === ApplicationStatus.SCREENING || a.status === ApplicationStatus.OFFER
  ).length;
  const recommendedCount = recommendedData?.totalElements ?? recommendedData?.content?.length ?? 0;

  const topJobs = recommendedData?.content?.slice(0, 3) || [];

  return (
    <div>
      {/* Welcome Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">Welcome back, {candidateName}</h1>
          <p className="text-muted small mb-0">
            Track your applications and explore AI-matched opportunities tailored to your profile.
          </p>
        </div>
        <Link to={`${ROUTES.JOBS}?tab=all`}>
          <Button variant="secondary" size="sm" icon={<Briefcase size={14} />}>
            Browse all jobs
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-medium">Recommended Jobs</div>
                <div className="fs-3 fw-bold text-dark mt-1">{recommendedCount}</div>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded bg-primary-subtle text-primary"
                style={{ width: '42px', height: '42px' }}
              >
                <Sparkles size={20} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-medium">Applications</div>
                <div className="fs-3 fw-bold text-dark mt-1">{totalApps}</div>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded bg-light text-muted"
                style={{ width: '42px', height: '42px' }}
              >
                <Send size={20} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-medium">Accepted (Hired)</div>
                <div className="fs-3 fw-bold text-success mt-1">{acceptedApps}</div>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded bg-success-subtle text-success"
                style={{ width: '42px', height: '42px' }}
              >
                <CheckCircle2 size={20} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small fw-medium">In Progress</div>
                <div className="fs-3 fw-bold text-warning mt-1">{inProgressApps}</div>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded bg-warning-subtle text-warning"
                style={{ width: '42px', height: '42px' }}
              >
                <Clock size={20} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended for You Section */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={18} className="text-success" />
          <h2 className="fs-5 fw-semibold text-dark mb-0">Recommended for You</h2>
        </div>
        <Link to={`${ROUTES.JOBS}?tab=recommended`} className="small fw-medium text-primary text-decoration-none">
          View all recommendations &rarr;
        </Link>
      </div>

      {isJobsLoading && <Skeleton count={3} height={90} className="mb-3" />}

      {isJobsError && (
        <ErrorState
          title="Could not load recommended jobs"
          message="Check your connection and try again."
          onRetry={refetchJobs}
        />
      )}

      {!isJobsLoading && !isJobsError && topJobs.length === 0 && (
        <Card>
          <EmptyState
            title="No recommended jobs yet"
            description="Complete your skills profile or upload your CV to receive tailored AI job recommendations."
            action={
              <Link to={ROUTES.CANDIDATE_PROFILE}>
                <Button size="sm" variant="primary">
                  Complete profile
                </Button>
              </Link>
            }
          />
        </Card>
      )}

      {!isJobsLoading && !isJobsError && topJobs.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {topJobs.map(job => (
            <Card key={job.id} className="p-3 mb-0 hover-card">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <ScoreRing score={job.matchScore ?? 85} size={48} />
                  <div>
                    <h3 className="fs-6 fw-bold text-dark mb-1">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-dark text-decoration-none hover-underline"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-2">
                      <span className="fw-medium text-secondary">{job.departmentName || 'Engineering'}</span>
                      <span>&bull;</span>
                      <span className="d-flex align-items-center gap-1">
                        <MapPin size={13} />
                        {job.location}
                      </span>
                      <span>&bull;</span>
                      <span>{formatContractType(job.contractType)}</span>
                      <span>&bull;</span>
                      <span>{formatWorkMode(job.workMode)}</span>
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      {(job.requiredSkills || []).slice(0, 4).map(skill => (
                        <SkillTag key={skill} name={skill} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 align-self-end align-self-md-center">
                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
