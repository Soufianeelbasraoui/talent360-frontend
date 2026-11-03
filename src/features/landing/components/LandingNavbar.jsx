import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Target, Menu, X, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, candidateProfile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Compute 2-letter uppercase initials from user details
  const getUserInitials = () => {
    if (!user) return 'U';
    if (candidateProfile?.firstName && candidateProfile?.lastName) {
      return `${candidateProfile.firstName[0]}${candidateProfile.lastName[0]}`.toUpperCase();
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      const prefix = user.email.split('@')[0];
      const parts = prefix.split(/[._-]/).filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      if (prefix.length >= 2) {
        return prefix.substring(0, 2).toUpperCase();
      }
      return prefix.toUpperCase();
    }
    if (user.role && user.role.length >= 2) {
      return user.role.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const userInitials = getUserInitials();

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  const getDashboardRoute = () => {
    if (!user) return ROUTES.LOGIN;
    if (user.role === Role.ADMIN) return ROUTES.ADMIN_DASHBOARD;
    if (user.role === Role.RECRUITER) return ROUTES.RECRUITER_DASHBOARD;
    return ROUTES.CANDIDATE_DASHBOARD;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.ROOT);
    } catch {
      // logout gracefully
    }
  };

  const handleNavClick = (sectionId, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === ROUTES.ROOT) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="landing-navbar py-2 py-md-3">
      <div className="container-xl d-flex align-items-center justify-content-between gap-3">
        
        {/* Brand Logo */}
        <Link to={ROUTES.ROOT} className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
          <div className="navbar-brand-logo">
            <Target size={20} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-5 fw-bold text-dark tracking-tight">Talent360</span>
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 small fw-semibold d-none d-sm-inline">
              AI-Powered
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Centered with balanced gaps */}
        <nav className="d-none d-lg-flex align-items-center gap-1 gap-xl-2 mx-auto">
          <a
            href="/#features"
            onClick={(e) => handleNavClick('features', e)}
            className="nav-link-custom"
          >
            Fonctionnalités
          </a>
          <a
            href="/#recruteurs"
            onClick={(e) => handleNavClick('recruteurs', e)}
            className="nav-link-custom"
          >
            Pour Recruteurs
          </a>
          <a
            href="/#candidats"
            onClick={(e) => handleNavClick('candidats', e)}
            className="nav-link-custom"
          >
            Pour Candidats
          </a>
          <Link to={ROUTES.JOBS} className="nav-link-custom">
            Offres d'emploi
          </Link>
          <a
            href="/#how-it-works"
            onClick={(e) => handleNavClick('how-it-works', e)}
            className="nav-link-custom"
          >
            Comment ça marche
          </a>
          <a
            href="/#faq"
            onClick={(e) => handleNavClick('faq', e)}
            className="nav-link-custom"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Action Buttons - User Profile Icon with Dropdown when logged in */}
        <div className="d-none d-lg-flex align-items-center gap-2 flex-shrink-0">
          {isAuthenticated && user ? (
            <div className="position-relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                className={`navbar-user-btn ${userDropdownOpen ? 'is-open' : ''}`}
                title={user.email}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="Menu profil utilisateur"
              >
                <span className="user-initials">{userInitials}</span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="dropdown-menu show shadow-lg position-absolute end-0 mt-2 py-2 border"
                  style={{
                    minWidth: '220px',
                    borderRadius: '5px',
                    borderColor: '#E5E7EB',
                    zIndex: 1050,
                    backgroundColor: '#FFFFFF',
                    animation: 'fadeInDown 0.15s ease-out'
                  }}
                >
                  {/* User Profile Header */}
                  <div className="px-3 py-2 border-bottom border-light mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold rounded border"
                        style={{ width: '32px', height: '32px', fontSize: '12px', flexShrink: 0 }}
                      >
                        {userInitials}
                      </div>
                      <div className="text-truncate">
                        <div className="fw-semibold text-dark text-truncate small" title={user.email}>
                          {user.email}
                        </div>
                        <span
                          className="badge bg-primary bg-opacity-10 text-primary px-1.5 py-0.5 text-uppercase fw-semibold"
                          style={{ fontSize: '9px' }}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Route */}
                  <Link
                    to={getDashboardRoute()}
                    className="dropdown-item dropdown-item-custom d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark small"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} className="text-primary" />
                    <span className="fw-medium">Dashboard</span>
                  </Link>

                  {/* Divider */}
                  <div className="dropdown-divider my-1 border-light"></div>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="dropdown-item dropdown-item-custom d-flex align-items-center gap-2 px-3 py-2 text-danger small w-100 border-0 bg-transparent text-start"
                  >
                    <LogOut size={16} />
                    <span className="fw-medium">Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-sm">
                Se connecter
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
                <span>Commencer</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="d-flex d-lg-none">
          <button
            type="button"
            className="btn btn-secondary p-2"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu d-lg-none p-3 mt-2">
          <div className="d-flex flex-column gap-2 mb-3">
            <a
              href="/#features"
              className="nav-link-custom py-2"
              onClick={(e) => handleNavClick('features', e)}
            >
              Fonctionnalités
            </a>
            <a
              href="/#recruteurs"
              className="nav-link-custom py-2"
              onClick={(e) => handleNavClick('recruteurs', e)}
            >
              Pour Recruteurs
            </a>
            <a
              href="/#candidats"
              className="nav-link-custom py-2"
              onClick={(e) => handleNavClick('candidats', e)}
            >
              Pour Candidats
            </a>
            <Link
              to={ROUTES.JOBS}
              className="nav-link-custom py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Offres d'emploi
            </Link>
            <a
              href="/#how-it-works"
              className="nav-link-custom py-2"
              onClick={(e) => handleNavClick('how-it-works', e)}
            >
              Comment ça marche
            </a>
            <a
              href="/#faq"
              className="nav-link-custom py-2"
              onClick={(e) => handleNavClick('faq', e)}
            >
              FAQ
            </a>
          </div>

          <div className="pt-2 border-top border-light d-flex flex-column gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="small text-muted mb-1">
                  Connecté en tant que <strong className="text-dark">{user.email}</strong> ({user.role})
                </div>
                <Link
                  to={getDashboardRoute()}
                  className="btn btn-primary w-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  <span>Accéder à mon Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn btn-secondary w-100"
                >
                  <LogOut size={16} />
                  <span>Se déconnecter</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="btn btn-secondary w-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="btn btn-primary w-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
