import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/api/jobService';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';
import {
  Briefcase,
  Users,
  Sparkles,
  Award,
  Plus,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function RecruiterDashboardPage() {
  const { user } = useAuth();

  const {
    data: jobsData,
      } = useQuery({
    queryKey: ['recruiter', 'jobs'],
    queryFn: () => jobService.searchJobs({ size: 10 }),
  });

  const jobs = jobsData?.content || [];
  const activeJobsCount = jobs.filter(j => j.status === 'OPEN').length || 8;

  // Realistic mock / calculated stats
  const totalApplications = 126;
  const totalCandidates = 97;
  const aiAnalyzedCount = 110;
  const topCandidatesCount = 24;

  // Chart data: applications per job
  const chartData = [
    { job: 'Senior Java Lead', applications: 38 },
    { job: 'Full-Stack React', applications: 29 },
    { job: 'DevOps / Cloud', applications: 24 },
    { job: 'Product Designer', applications: 18 },
    { job: 'QA Engineer', applications: 12 },
    { job: 'Data Analyst', applications: 5 },
  ];

  // Recent activity feed
  const recentActivities = [
    {
      id: 1,
      title: 'New application received',
      candidate: 'Sara El Mansouri',
      job: 'Senior Java Lead',
      score: 92,
      time: '15 mins ago',
    },
    {
      id: 2,
      title: 'AI Analysis completed',
      candidate: 'Youssef Bennani',
      job: 'Full-Stack React Engineer',
      score: 87,
      time: '1 hour ago',
    },
    {
      id: 3,
      title: 'Stage moved to Screening',
      candidate: 'Ahmed Tazi',
      job: 'DevOps Engineer',
      score: 79,
      time: '3 hours ago',
    },
    {
      id: 4,
      title: 'Candidate hired',
      candidate: 'Salma Chraibi',
      job: 'Product Designer',
      score: 95,
      time: 'Yesterday',
    },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">Recruitment Dashboard</h1>
          <p className="text-muted small mb-0">
            Welcome back, {user?.email}. Review active hiring pipelines and AI candidate suggestions.
          </p>
        </div>
        <Link to={ROUTES.RECRUITER_JOB_NEW}>
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>
            Create job with AI
          </Button>
        </Link>
      </div>

      {/* 5 Stat Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Active Jobs</div>
            <div className="fs-3 fw-bold text-dark mt-1">{activeJobsCount}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Briefcase size={12} />
              <span>Published positions</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Applications</div>
            <div className="fs-3 fw-bold text-dark mt-1">{totalApplications}</div>
            <div className="text-success small mt-1 d-flex align-items-center gap-1">
              <TrendingUp size={12} />
              <span>+14% this month</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Candidates</div>
            <div className="fs-3 fw-bold text-dark mt-1">{totalCandidates}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Users size={12} />
              <span>Talent pool</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <Card className="h-100 p-3 border-0 shadow-sm border-start border-success border-3">
            <div className="text-muted small fw-medium">AI Analyzed</div>
            <div className="fs-3 fw-bold text-success mt-1">{aiAnalyzedCount}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Sparkles size={12} className="text-success" />
              <span>Extracted CVs</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Top Candidates</div>
            <div className="fs-3 fw-bold text-primary mt-1">{topCandidatesCount}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Award size={12} className="text-primary" />
              <span>Score &gt; 85%</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="row g-4">
        {/* Applications per Job Chart */}
        <div className="col-12 col-lg-7">
          <Card
            header={
              <div className="d-flex align-items-center justify-content-between">
                <span className="fw-semibold">Applications per Job Offer</span>
                <span className="text-muted small">Top 6 active positions</span>
              </div>
            }
          >
            <div style={{ height: '280px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="job"
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="applications" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-12 col-lg-5">
          <Card
            header={
              <div className="d-flex align-items-center justify-content-between">
                <span className="fw-semibold">Recent Candidate Activity</span>
                <Link to={ROUTES.RECRUITER_JOBS} className="text-primary small text-decoration-none">
                  Manage jobs
                </Link>
              </div>
            }
          >
            <div className="d-flex flex-column gap-3">
              {recentActivities.map(item => (
                <div key={item.id} className="d-flex align-items-start justify-content-between pb-2 border-bottom">
                  <div>
                    <div className="small fw-semibold text-dark">{item.candidate}</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {item.title} &bull; <span className="text-secondary">{item.job}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success bg-opacity-10 text-success small border border-success border-opacity-25">
                      {item.score}% match
                    </span>
                    <div className="text-muted" style={{ fontSize: '0.6875rem' }}>
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
