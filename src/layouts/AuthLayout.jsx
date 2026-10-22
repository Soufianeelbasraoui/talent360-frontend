import { Outlet, Link } from 'react-router-dom';
import { Target, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Split-screen layout for authentication pages.
 */
export function AuthLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row bg-white">
      {/* Left Branded Panel */}
      <div
        className="col-12 col-lg-5 p-4 p-xl-5 d-flex flex-column justify-content-between text-white"
        style={{
          backgroundColor: '#1E1B4B',
          minHeight: '280px',
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-4">
            <div
              className="d-flex align-items-center justify-content-center bg-white text-primary rounded"
              style={{ width: '36px', height: '36px' }}
            >
              <Target size={22} className="text-primary" />
            </div>
            <span className="fs-5 fw-bold tracking-tight text-white">Talent360</span>
            <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 ms-1">
              AI-Powered
            </span>
          </div>

          <h1 className="fs-3 fw-bold text-white mb-3" style={{ lineHeight: 1.25 }}>
            Match the right talent with the right opportunity.
          </h1>
          <p className="text-light text-opacity-75 small mb-4" style={{ maxWidth: '420px' }}>
            Talent360 combines intelligent CV analysis, transparent skill scoring, and dynamic recruitment workflows designed for modern hiring teams.
          </p>

          <div className="d-none d-lg-block mt-4 pt-3 border-top border-white border-opacity-10">
            <div className="d-flex align-items-center gap-2 mb-2 text-white-50 small">
              <CheckCircle2 size={16} className="text-success" />
              <span>Automated CV parsing &amp; skill extraction</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2 text-white-50 small">
              <CheckCircle2 size={16} className="text-success" />
              <span>Transparent AI match scores with skill gap analysis</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-white-50 small">
              <CheckCircle2 size={16} className="text-success" />
              <span>Drag-and-drop recruiter Kanban pipeline</span>
            </div>
          </div>
        </div>

        {/* Abstract Human + AI Network Graphic */}
        <div className="d-none d-lg-flex justify-content-center my-4 py-2 opacity-75">
          <svg width="240" height="110" viewBox="0 0 240 110" fill="none">
            <line x1="30" y1="55" x2="90" y2="25" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="30" y1="55" x2="90" y2="85" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="90" y1="25" x2="150" y2="55" stroke="#10B981" strokeWidth="2" />
            <line x1="90" y1="85" x2="150" y2="55" stroke="#10B981" strokeWidth="2" />
            <line x1="150" y1="55" x2="210" y2="55" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="30" cy="55" r="14" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
            <circle cx="90" cy="25" r="12" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
            <circle cx="90" cy="85" r="12" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
            <circle cx="150" cy="55" r="18" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
            <circle cx="210" cy="55" r="14" fill="#312E81" stroke="#6366F1" strokeWidth="2" />
          </svg>
        </div>

        <div className="text-white-50 small">
          &copy; {new Date().getFullYear()} Talent360. Human-centered recruitment platform.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="col-12 col-lg-7 d-flex align-items-center justify-content-center p-4 p-md-5">
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
