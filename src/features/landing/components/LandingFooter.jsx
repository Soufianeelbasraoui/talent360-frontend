import { Link } from 'react-router-dom';
import { Target, Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="container-xl">
        <div className="row g-5">
          
          {/* Brand Info */}
          <div className="col-12 col-lg-4">
            <Link to={ROUTES.ROOT} className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div
                className="d-flex align-items-center justify-content-center bg-primary text-white rounded"
                style={{ width: '34px', height: '34px' }}
              >
                <Target size={20} />
              </div>
              <span className="fs-5 fw-bold text-white tracking-tight">Talent360</span>
            </Link>

            <p className="small text-muted mb-4" style={{ lineHeight: 1.6, maxWidth: '320px' }}>
              Plateforme SaaS de recrutement prédictif et humain. Connectez intelligemment les meilleurs talents aux entreprises grâce à une IA éthique et transparente.
            </p>

            <div className="d-flex align-items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted text-hover-white p-2 rounded bg-dark border border-secondary border-opacity-25"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted text-hover-white p-2 rounded bg-dark border border-secondary border-opacity-25"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted text-hover-white p-2 rounded bg-dark border border-secondary border-opacity-25"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Links Column 1: Plateforme */}
          <div className="col-6 col-md-3 col-lg-2">
            <h4 className="footer-title">Plateforme</h4>
            <ul className="footer-links">
              <li>
                <Link to={ROUTES.JOBS}>Offres d'emploi</Link>
              </li>
              <li>
                <a href="#features">Parsing de CV IA</a>
              </li>
              <li>
                <a href="#features">Matching 360°</a>
              </li>
              <li>
                <a href="#features">Générateur d'offres</a>
              </li>
              <li>
                <a href="#how-it-works">Pipeline Kanban</a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Candidats */}
          <div className="col-6 col-md-3 col-lg-2">
            <h4 className="footer-title">Candidats</h4>
            <ul className="footer-links">
              <li>
                <Link to={ROUTES.LOGIN}>Espace Candidat</Link>
              </li>
              <li>
                <Link to={`${ROUTES.REGISTER}?role=CANDIDATE`}>Déposer un CV</Link>
              </li>
              <li>
                <Link to={ROUTES.JOBS}>Rechercher un poste</Link>
              </li>
              <li>
                <a href="#faq">Guide d'entretien</a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Entreprises */}
          <div className="col-6 col-md-3 col-lg-2">
            <h4 className="footer-title">Entreprises</h4>
            <ul className="footer-links">
              <li>
                <Link to={ROUTES.LOGIN}>Espace Recruteur</Link>
              </li>
              <li>
                <Link to={`${ROUTES.REGISTER}?role=RECRUITER`}>Publier une offre</Link>
              </li>
              <li>
                <a href="#recruteurs">Solutions RH</a>
              </li>
              <li>
                <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">
                  API Swagger
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 4: Légal & Sécurité */}
          <div className="col-6 col-md-3 col-lg-2">
            <h4 className="footer-title">Sécurité &amp; Légal</h4>
            <ul className="footer-links">
              <li>
                <a href="#faq">Conformité RGPD</a>
              </li>
              <li>
                <a href="#faq">Protection des données</a>
              </li>
              <li>
                <a href="#faq">Conditions d'utilisation</a>
              </li>
              <li>
                <a href="#faq">Support &amp; Contact</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-muted">
          <div>
            &copy; {currentYear} <strong>Talent360</strong>. Conçu avec rigueur et humanité.
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="system-status-dot" />
            <span className="small text-light">Tous les systèmes opérationnels</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

