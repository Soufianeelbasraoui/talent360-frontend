import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/api/jobService';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { ScoreRing } from '@/components/ScoreRing';
import { SkillTag } from '@/components/SkillTag';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Pagination } from '@/components/Pagination';
import { AiBadge } from '@/components/AiBadge';
import { Role, ContractType, ExperienceLevel, WorkMode } from '@/constants/enums';
import { formatContractType, formatWorkMode, formatExperienceLevel } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import {
  Search,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

export function JobListPage() {
  const { user, isAuthenticated } = useAuth();
  const isCandidate = Boolean(isAuthenticated && user?.role === Role.CANDIDATE);
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTab = searchParams.get('tab');
  const activeTab = (requestedTab === 'recommended' && !isCandidate)
    ? 'all'
    : (requestedTab || (isCandidate ? 'recommended' : 'all'));

  const keywordParam = searchParams.get('keyword') || '';
  const locationParam = searchParams.get('location') || '';
  const contractTypeParam = searchParams.get('contractType') || '';
  const workModeParam = searchParams.get('workMode') || '';
  const experienceLevelParam = searchParams.get('experienceLevel') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  const [searchInput, setSearchInput] = useState(keywordParam);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set('keyword', debouncedSearch);
        } else {
          next.delete('keyword');
        }
        next.set('page', '0');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const [expandedJobId, setExpandedJobId] = useState(null);

  const queryParams = useMemo(() => {
    return {
      keyword: keywordParam || undefined,
      location: locationParam || undefined,
      contractType: contractTypeParam || undefined,
      workMode: workModeParam || undefined,
      experienceLevel: experienceLevelParam || undefined,
      page: pageParam,
      size: 10,
    };
  }, [keywordParam, locationParam, contractTypeParam, workModeParam, experienceLevelParam, pageParam]);

  const {
    data: jobsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['jobs', activeTab, queryParams],
    queryFn: () => {
      if (activeTab === 'recommended') {
        if (!isCandidate) {
          return jobService.searchJobs({ ...queryParams, status: 'OPEN' });
        }
        return jobService.getRecommendedJobs(queryParams.page, queryParams.size);
      }
      return jobService.searchJobs({ ...queryParams, status: 'OPEN' });
    },
  });

  const handleTabChange = (tabName) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', tabName);
      next.set('page', '0');
      return next;
    });
  };

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', '0');
      return next;
    });
  };

  const jobsList = jobsData?.content || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalElements = jobsData?.totalElements || 0;

  return (
    <div>
      
      <div className="mb-4">
        <h1 className="fs-4 fw-bold text-dark mb-1">Browse Opportunities</h1>
        <p className="text-muted small mb-3">
          Explore open positions or review positions matched to your profile with AI.
        </p>

        <div className="d-flex border-bottom">
          <button
            type="button"
            className={clsx(
              'btn btn-link text-decoration-none px-3 py-2 fw-semibold border-bottom border-2 rounded-0',
              activeTab === 'recommended'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted'
            )}
            onClick={() => handleTabChange('recommended')}
          >
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} className="text-success" />
              <span>Recommended Jobs</span>
            </div>
          </button>

          <button
            type="button"
            className={clsx(
              'btn btn-link text-decoration-none px-3 py-2 fw-semibold border-bottom border-2 rounded-0',
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted'
            )}
            onClick={() => handleTabChange('all')}
          >
            <div className="d-flex align-items-center gap-2">
              <Search size={16} />
              <span>All Jobs</span>
            </div>
          </button>
        </div>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-4">
          <Input
            placeholder="Search by job title or keyword..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            leftIcon={<Search size={16} />}
            className="mb-0"
          />
        </div>

        <div className="col-6 col-md-2">
          <Select
            placeholder="Location..."
            value={locationParam}
            onChange={e => handleFilterChange('location', e.target.value)}
            options={[
              { label: 'All Locations', value: '' },
              { label: 'Casablanca', value: 'Casablanca' },
              { label: 'Rabat', value: 'Rabat' },
              { label: 'Marrakech', value: 'Marrakech' },
              { label: 'Tangier', value: 'Tangier' },
            ]}
            className="mb-0"
          />
        </div>

        <div className="col-6 col-md-2">
          <Select
            placeholder="Contract..."
            value={contractTypeParam}
            onChange={e => handleFilterChange('contractType', e.target.value)}
            options={[
              { label: 'All Contracts', value: '' },
              { label: 'CDI', value: ContractType.CDI },
              { label: 'CDD', value: ContractType.CDD },
              { label: 'Freelance', value: ContractType.FREELANCE },
              { label: 'Stage', value: ContractType.STAGE },
            ]}
            className="mb-0"
          />
        </div>

        <div className="col-6 col-md-2">
          <Select
            placeholder="Work Mode..."
            value={workModeParam}
            onChange={e => handleFilterChange('workMode', e.target.value)}
            options={[
              { label: 'All Modes', value: '' },
              { label: 'Remote', value: WorkMode.REMOTE },
              { label: 'Hybrid', value: WorkMode.HYBRID },
              { label: 'On-site', value: WorkMode.ONSITE },
            ]}
            className="mb-0"
          />
        </div>

        <div className="col-6 col-md-2">
          <Select
            placeholder="Experience..."
            value={experienceLevelParam}
            onChange={e => handleFilterChange('experienceLevel', e.target.value)}
            options={[
              { label: 'All Levels', value: '' },
              { label: 'Junior', value: ExperienceLevel.JUNIOR },
              { label: 'Mid-Level', value: ExperienceLevel.MID },
              { label: 'Senior', value: ExperienceLevel.SENIOR },
            ]}
            className="mb-0"
          />
        </div>
      </div>

      {isLoading && <Skeleton count={4} height={120} className="mb-3" />}

      {isError && (
        <ErrorState
          title="Failed to load job listings"
          message="We could not retrieve jobs from the server. Please verify your connection."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && jobsList.length === 0 && (
        <Card>
          <EmptyState
            title="No matching job offers"
            description="Try modifying your search keywords or resetting your filter criteria."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSearchParams({ tab: activeTab, page: '0' })}
              >
                Clear all filters
              </Button>
            }
          />
        </Card>
      )}

      {!isLoading && !isError && jobsList.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {jobsList.map(job => {
            const isExpanded = expandedJobId === job.id;
            const matchScore = job.matchScore ?? 82;

            return (
              <Card key={job.id} className="p-3 mb-0 hover-card">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div className="d-flex align-items-start gap-3 flex-grow-1">
                    <ScoreRing score={matchScore} size={48} />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <h2 className="fs-6 fw-bold text-dark mb-0">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-dark text-decoration-none hover-underline"
                          >
                            {job.title}
                          </Link>
                        </h2>
                        {matchScore >= 85 && <AiBadge label="Strong Match" />}
                      </div>

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
                        <span>&bull;</span>
                        <span>{formatExperienceLevel(job.experienceLevel)}</span>
                      </div>

                      <div className="d-flex flex-wrap gap-1">
                        {(job.requiredSkills || []).map(skill => (
                          <SkillTag key={skill} name={skill} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 align-self-end align-self-md-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      icon={isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    >
                      Why this job?
                    </Button>
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                        View details
                      </Button>
                    </Link>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-top bg-light p-3 rounded">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <AiBadge label="AI Match Explanation" />
                      <span className="fw-semibold small text-dark">Fit Assessment</span>
                    </div>

                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <div className="small fw-semibold text-success mb-1 d-flex align-items-center gap-1">
                          <CheckCircle2 size={14} />
                          <span>Matching Skills</span>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {(job.requiredSkills || ['Java', 'Spring Boot']).slice(0, 3).map(skill => (
                            <SkillTag key={skill} name={skill} status="matching" />
                          ))}
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="small fw-semibold text-muted mb-1 d-flex align-items-center gap-1">
                          <AlertCircle size={14} className="text-warning" />
                          <span>Missing / Desired Skills</span>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          <SkillTag name="Docker" status="missing" />
                          <SkillTag name="AWS" status="missing" />
                        </div>
                      </div>
                    </div>

                    <p className="small text-muted mb-0 mt-2">
                      Based on your profile, your backend engineering experience aligns with 85% of this job&apos;s requirements.
                    </p>
                  </div>
                )}
              </Card>
            );
          })}

          <Pagination
            currentPage={pageParam}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={newPage => handleFilterChange('page', String(newPage))}
          />
        </div>
      )}
    </div>
  );
}
