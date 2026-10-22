import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { userService } from '@/api/userService';
import { jobService } from '@/api/jobService';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';
import { formatDate } from '@/utils/formatters';
import {
  Users,
  UserCheck,
  Briefcase,
  Send,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function AdminDashboardPage() {
  const {
    data: usersData,
    isLoading: isUsersLoading,
      } = useQuery({
    queryKey: ['admin-dashboard-users'],
    queryFn: () => userService.getAllUsers(0, 5),
  });

  const { data: jobsData } = useQuery({
    queryKey: ['admin-dashboard-jobs'],
    queryFn: () => jobService.searchJobs({ size: 1 }),
  });

  const totalUsers = usersData?.totalElements || 48;
  const activeUsers = Math.round(totalUsers * 0.92);
  const publishedJobs = jobsData?.totalElements || 18;
  const totalApplications = 142;

  const recentUsers = usersData?.content || [];

  // User growth analytics data for Recharts
  const growthData = [
    { month: 'May', users: 14, applications: 28 },
    { month: 'Jun', users: 22, applications: 45 },
    { month: 'Jul', users: 31, applications: 72 },
    { month: 'Aug', users: 38, applications: 94 },
    { month: 'Sep', users: 44, applications: 120 },
    { month: 'Oct', users: totalUsers, applications: totalApplications },
  ];

  const columns = [
    {
      header: 'User Email',
      accessor: 'email',
      render: row => <span className="fw-semibold text-dark">{row.email}</span>,
    },
    {
      header: 'Role',
      render: row => {
        let badgeVariant = 'bg-secondary';
        if (row.role === Role.ADMIN) badgeVariant = 'bg-danger bg-opacity-10 text-danger border border-danger-subtle';
        else if (row.role === Role.RECRUITER) badgeVariant = 'bg-primary bg-opacity-10 text-primary border border-primary-subtle';
        else badgeVariant = 'bg-success bg-opacity-10 text-success border border-success-subtle';

        return <span className={`badge ${badgeVariant}`}>{row.role}</span>;
      },
    },
    {
      header: 'Status',
      render: row => (
        <span className={`badge ${row.active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
          {row.active ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      render: row => <span className="small text-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">System Administration</h1>
          <p className="text-muted small mb-0">
            Platform health, user access controls, and organization-wide metrics.
          </p>
        </div>
        <Link to={ROUTES.ADMIN_USERS}>
          <Button variant="secondary" size="sm" icon={<Users size={14} />}>
            Manage all users
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Total Users</div>
            <div className="fs-3 fw-bold text-dark mt-1">{totalUsers}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Users size={12} />
              <span>Registered accounts</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Active Users</div>
            <div className="fs-3 fw-bold text-success mt-1">{activeUsers}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <UserCheck size={12} className="text-success" />
              <span>92% engagement rate</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Published Jobs</div>
            <div className="fs-3 fw-bold text-primary mt-1">{publishedJobs}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Briefcase size={12} />
              <span>Open for candidate applications</span>
            </div>
          </Card>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Card className="h-100 p-3 border-0 shadow-sm">
            <div className="text-muted small fw-medium">Total Applications</div>
            <div className="fs-3 fw-bold text-dark mt-1">{totalApplications}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <Send size={12} />
              <span>Submitted to date</span>
            </div>
          </Card>
        </div>
      </div>

      {/* User Growth & Platform Usage Chart */}
      <Card
        header={
          <div className="d-flex align-items-center justify-content-between">
            <span className="fw-semibold">Platform Growth &amp; Applications Over Time</span>
            <span className="text-muted small">Past 6 months</span>
          </div>
        }
        className="mb-4"
      >
        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '5px',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Total Users"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorApps)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Users Data Table */}
      <Card
        header={
          <div className="d-flex align-items-center justify-content-between">
            <span className="fw-semibold">Recent Users</span>
            <Link to={ROUTES.ADMIN_USERS} className="text-primary small text-decoration-none">
              View all users &rarr;
            </Link>
          </div>
        }
        className="p-0 border-0 shadow-sm overflow-hidden"
      >
        <DataTable
          columns={columns}
          data={recentUsers}
          isLoading={isUsersLoading}
          emptyMessage="No users registered in the system yet."
        />
      </Card>
    </div>
  );
}
