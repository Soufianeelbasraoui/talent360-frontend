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
import { formatContractType, formatWorkMode, formatExperienceLevel, formatDate } from '@/utils/formatters';
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
  Briefcase,
  Clock,
  RotateCcw,
  UserPlus,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import clsx from 'clsx';

function getJobExcerpt(htmlString, maxLength = 160) {
  if (!htmlString) return '';
  const text = htmlString.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function JobListPage() {
  const { user, isAuthenticated } = useAuth();
  const isCandidate = Boolean(isAuthenticated && user?.role === Role.CANDIDATE);
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTab = searchParams.get('tab');
  const activeTab = requestedTab === 'recommended' && !isCandidate
    ? 'all'
    : requestedTab || (isCandidate ? 'recommended' : 'all');

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

  const resetAllFilters = () => {
    setSearchInput('');
    setSearchParams({ tab: activeTab, page: '0' });
  };

  const hasActiveFilters = Boolean(
    keywordParam || locationParam || contractTypeParam || workModeParam || experienceLevelParam
  );

  const jobsList = jobsData?.content || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalElements = jobsData?.totalElements || 0;

  return (
    <div className="pb-5">
      
      {/* Human Header Banner */}
      <div className="bg-white border rounded p-4 mb-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small fw-semibold">
                <Sparkles size={13} className="me-1" />
                Opportunités &amp; Talents
              </span>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 small fw-semibold">
                Recrutement Transparent
              </span>
            </div>

            <h1 className="fs-3 fw-bold text-dark mb-1">
              Browse Opportunities
            </h1>
            <p className="text-muted small mb-0" style={{ maxWidth: '650px', lineHeight: 1.5 }}>
              Explore open positions or review positions matched to your profile with AI.
              Découvrez toutes les offres d&apos;emploi disponibles, analysez les compétences clés et postulez facilement.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="d-flex flex-column flex-sm-row gap-2 flex-shrink-0">
              <Link to={`${ROUTES.REGISTER}?role=CANDIDATE`} className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Créer mon profil</span>
              </Link>
              <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-sm">
                <span>Se connecter</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Highlights Strip */}
        <div className="d-flex flex-wrap align-items-center gap-3 pt-3 mt-3 border-top border-light small text-muted">
          <div className="d-flex align-items-center gap-1">
            <span className="badge rounded-pill bg-success p-1" />
            <strong className="text-dark">{totalElements}</strong> poste{totalElements > 1 ? 's' : ''} ouvert{totalElements > 1 ? 's' : ''}
          </div>
          <span>&bull;</span>
          <div className="d-flex align-items-center gap-1">
            <MapPin size={14} className="text-primary" />
            <span>Casablanca, Rabat, Marrakech, Hybride &amp; Remote</span>
          </div>
          <span>&bull;</span>
          <div className="d-flex align-items-center gap-1">
            <Sparkles size={14} className="text-success" />
            <span>Matching de compétences assisté par IA</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="d-flex border-bottom bg-white px-3 pt-2 rounded-top border mb-0">
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
            <Briefcase size={16} />
            <span>All Jobs</span>
            <span className="badge bg-light text-muted border ms-1">{totalElements}</span>
          </div>
        </button>

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
            {isCandidate && <AiBadge label="IA" className="ms-1" />}
          </div>
        </button>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white border border-top-0 rounded-bottom p-3 mb-4 shadow-sm">
        <div className="row g-2">
          
          {/* Keyword Search */}
          <div className="col-12 col-md-4">
            <Input
              placeholder="Search by job title or keyword..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              leftIcon={<Search size={16} />}
              className="mb-0"
            />
          </div>

          {/* Location */}
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

          {/* Contract */}
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

          {/* Work Mode */}
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

          {/* Experience */}
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

        {/* Active Filters Clear Row */}
        {hasActiveFilters && (
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top border-light small">
            <div className="text-muted">
              Filtres actifs : {keywordParam && <span className="badge bg-light text-dark border me-1">Mot-clé: {keywordParam}</span>}
              {locationParam && <span className="badge bg-light text-dark border me-1">Lieu: {locationParam}</span>}
              {contractTypeParam && <span className="badge bg-light text-dark border me-1">Contrat: {contractTypeParam}</span>}
              {workModeParam && <span className="badge bg-light text-dark border me-1">Mode: {workModeParam}</span>}
              {experienceLevelParam && <span className="badge bg-light text-dark border me-1">Niveau: {experienceLevelParam}</span>}
            </div>

            <button
              type="button"
              onClick={resetAllFilters}
              className="btn btn-link text-decoration-none p-0 small text-danger d-flex align-items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="d-flex flex-column gap-3">
          <Skeleton count={3} height={140} className="mb-2" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Impossible de charger les offres"
          message="Une erreur est survenue lors de la récupération des offres depuis le serveur. Veuillez vérifier votre connexion."
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && jobsList.length === 0 && (
        <Card className="p-4 text-center bg-white">
          <EmptyState
            title="No matching job offers"
            description="Aucune offre ne correspond à vos critères actuels. Essayez d'élargir vos filtres ou de modifier vos mots-clés."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={resetAllFilters}
              >
                Clear all filters
              </Button>
            }
          />
        </Card>
      )}

      {/* Job Offers List */}
      {!isLoading && !isError && jobsList.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {jobsList.map(job => {
            const isExpanded = expandedJobId === job.id;
            const hasScore = Boolean(isCandidate && job.matchScore != null);
            const matchScore = hasScore ? job.matchScore : null;
            const excerpt = getJobExcerpt(job.description, 170);

            return (
              <Card key={job.id} className="p-3 mb-0 hover-card bg-white border">
                <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3">
                  
                  {/* Left: Score Ring (if logged in with score) OR Briefcase Icon */}
                  <div className="d-flex align-items-start gap-3 flex-grow-1">
                    {hasScore ? (
                      <div className="flex-shrink-0 pt-1" title={`Score d'affinité IA: ${Math.round(matchScore > 1 ? matchScore : matchScore * 100)}%`}>
                        <ScoreRing score={matchScore} size={50} strokeWidth={4} />
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light text-primary rounded border flex-shrink-0"
                        style={{ width: '48px', height: '48px' }}
                      >
                        <Briefcase size={22} />
                      </div>
                    )}

                    <div className="flex-grow-1">
                      
                      {/* Title & Badges */}
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <h2 className="fs-6 fw-bold text-dark mb-0">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-dark text-decoration-none hover-underline"
                          >
                            {job.title}
                          </Link>
                        </h2>
                        {hasScore && (matchScore >= 85 || matchScore >= 0.85) && <AiBadge label="Strong Match" />}
                        {!hasScore && (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small fw-normal">
                            Poste ouvert
                          </span>
                        )}
                        <span className="badge bg-light text-primary border small fw-medium">
                          {job.departmentName || 'Engineering'}
                        </span>
                      </div>

                      {/* Metadatas */}
                      <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-2">
                        <span className="d-flex align-items-center gap-1">
                          <MapPin size={13} className="text-secondary" />
                          <strong>{job.location}</strong>
                        </span>
                        <span>&bull;</span>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-0 fw-normal">
                          {formatContractType(job.contractType)}
                        </span>
                        <span>&bull;</span>
                        <span>{formatWorkMode(job.workMode)}</span>
                        <span>&bull;</span>
                        <span>{formatExperienceLevel(job.experienceLevel)}</span>
                        {job.createdAt && (
                          <>
                            <span>&bull;</span>
                            <span className="d-flex align-items-center gap-1 text-muted">
                              <Clock size={12} />
                              {formatDate(job.createdAt)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Excerpt */}
                      {excerpt && (
                        <p className="text-muted small mb-2" style={{ lineHeight: 1.5 }}>
                          {excerpt}
                        </p>
                      )}

                      {/* Skills Tags */}
                      <div className="d-flex flex-wrap gap-1">
                        {(job.requiredSkills || []).map(skill => (
                          <SkillTag key={skill} name={skill} />
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="d-flex align-items-center gap-2 align-self-end align-self-md-center flex-shrink-0 pt-2 pt-md-0">
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

                {/* Expanded AI Fit Explanation */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-top bg-light p-3 rounded">
                    {hasScore ? (
                      <>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <AiBadge label="AI Match Explanation" />
                            <span className="fw-semibold small text-dark">Fit Assessment &bull; Analyse d&apos;adéquation</span>
                          </div>
                          <span className="small fw-bold text-success">
                            {Math.round(matchScore > 1 ? matchScore : matchScore * 100)}% d&apos;affinité
                          </span>
                        </div>

                        <div className="row g-2">
                          <div className="col-12 col-md-6">
                            <div className="small fw-semibold text-success mb-1 d-flex align-items-center gap-1">
                              <CheckCircle2 size={14} />
                              <span>Matching Skills / Compétences alignées</span>
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
                              <SkillTag name="Cloud AWS" status="missing" />
                            </div>
                          </div>
                        </div>

                        <p className="small text-muted mb-0 mt-2">
                          Based on your profile, your experience aligns with this job&apos;s requirements.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <AiBadge label="Matching IA" />
                          <span className="fw-semibold small text-dark">Affinité &amp; Compétences</span>
                        </div>
                        <p className="small text-muted mb-3">
                          Le calcul du score d&apos;adéquation et la décomposition des compétences sont réservés aux candidats connectés.
                          Connectez-vous ou créez votre compte pour que l&apos;IA compare votre CV à cette offre.
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          <Link to={`${ROUTES.REGISTER}?role=CANDIDATE`} className="btn btn-primary btn-sm">
                            Créer mon compte candidat
                          </Link>
                          <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-sm">
                            Se connecter
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {/* Pagination */}
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
