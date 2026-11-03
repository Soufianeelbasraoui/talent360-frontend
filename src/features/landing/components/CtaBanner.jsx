import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function CtaBanner() {
  return (
    <section className="py-5 bg-white">
      <div className="container-xl py-3">
        <div className="landing-cta-banner text-center position-relative">
          <div className="cta-glow" />
          <div className="cta-glow-2" />

          <div className="position-relative z-1" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25 px-3 py-1 mb-3 small fw-semibold">
              <Sparkles size={13} className="me-1" />
              Rejoignez l'ère du recrutement augmenté
            </span>

            <h2 className="fs-1 fw-bold text-white mb-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Prêt à connecter les meilleurs talents à vos opportunités ?
            </h2>

            <p className="text-light text-opacity-80 fs-6 mb-4" style={{ lineHeight: 1.6 }}>
              Créez votre compte en moins de 2 minutes. Que vous soyez une entreprise en pleine croissance ou un candidat en quête de son prochain défi, Talent360 est conçu pour vous.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4">
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg px-4">
                <span>Créer un compte gratuit</span>
                <ArrowRight size={17} />
              </Link>
              <Link to={ROUTES.JOBS} className="btn btn-secondary btn-lg px-4">
                <span>Explorer les opportunités</span>
              </Link>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-4 text-white-50 small">
              <span className="d-flex align-items-center gap-1">
                <CheckCircle2 size={15} className="text-success" />
                Sans carte bancaire requise
              </span>
              <span className="d-flex align-items-center gap-1">
                <CheckCircle2 size={15} className="text-success" />
                Mise en route en 2 minutes
              </span>
              <span className="d-flex align-items-center gap-1">
                <CheckCircle2 size={15} className="text-success" />
                Conforme RGPD &amp; Données sécurisées
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

