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
import { Briefcase, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import clsx from 'clsx';

export function MyApplicationsPage() {
  const {
    data: applicationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(0, 50),
  });

  const applications = applicationsData?.content || [];

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

  const steps = ['Applied (New)', 'Screening', 'Offer', 'Hired'];

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">My Applications</h1>
          <p className="text-muted small mb-0">
            Monitor the status of your submitted applications and hiring pipeline stages.
          </p>
        </div>
        <Link to={ROUTES.JOBS}>
          <Button variant="secondary" size="sm" icon={<Briefcase size={14} />}>
            Explore more jobs
          </Button>
        </Link>
      </div>

      {isLoading && <Skeleton count={4} height={100} className="mb-3" />}

      {isError && (
        <ErrorState
          title="Could not load applications"
          message="Check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <Card>
          <EmptyState
            title="No applications yet"
            description="Browse open job offers and apply to get your recruitment journey started."
            action={
              <Link to={ROUTES.JOBS}>
                <Button variant="primary" size="sm">
                  Browse jobs
                </Button>
              </Link>
            }
          />
        </Card>
      )}

      {!isLoading && !isError && applications.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {applications.map(app => {
            const currentStep = getStepIndex(app.status);
            const isRejected = app.status === ApplicationStatus.REJECTED;

            return (
              <Card key={app.id} className="p-3 mb-0">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h2 className="fs-6 fw-bold text-dark mb-0">
                        {app.jobOfferTitle || `Job #${app.jobOfferId}`}
                      </h2>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="text-muted small">
                      Applied on {formatDate(app.appliedAt)} &bull; Reference #{app.id}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {app.matchingScore && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Match:</span>
                        <ScoreRing score={app.matchingScore} size={36} />
                      </div>
                    )}
                    <Link to={`/jobs/${app.jobOfferId}`}>
                      <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                        Job Offer
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Horizontal Progress Stepper */}
                <div className="pt-3 border-top">
                  {isRejected ? (
                    <div className="alert alert-secondary py-2 px-3 mb-0 small text-muted d-flex align-items-center gap-2">
                      <Clock size={16} />
                      <span>This application was reviewed and not moved forward to the next stage.</span>
                    </div>
                  ) : (
                    <div className="position-relative">
                      {/* Step track line */}
                      <div
                        className="position-absolute top-50 start-0 translate-middle-y w-100 bg-light"
                        style={{ height: '3px', zIndex: 1 }}
                      />
                      <div
                        className="position-absolute top-50 start-0 translate-middle-y bg-primary"
                        style={{
                          height: '3px',
                          zIndex: 1,
                          width: `${(currentStep / (steps.length - 1)) * 100}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />

                      <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                        {steps.map((stepName, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={idx} className="text-center" style={{ minWidth: '70px' }}>
                              <div
                                className={clsx(
                                  'd-inline-flex align-items-center justify-content-center rounded-circle small mb-1',
                                  isDone
                                    ? 'bg-primary text-white'
                                    : 'bg-white border text-muted'
                                )}
                                style={{ width: '22px', height: '22px', fontSize: '0.6875rem' }}
                              >
                                {isDone ? <CheckCircle2 size={12} /> : idx + 1}
                              </div>
                              <div
                                className={clsx(
                                  'small',
                                  isCurrent ? 'fw-bold text-primary' : isDone ? 'text-dark' : 'text-muted'
                                )}
                                style={{ fontSize: '0.6875rem' }}
                              >
                                {stepName}
                              </div>
                            </div>
                          );
                        })}
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
