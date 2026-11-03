import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Star, Briefcase, FileText } from 'lucide-react';
import { ScoreRing } from '@/components/ScoreRing';
import { ROUTES } from '@/constants/routes';

export function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="container-xl">
        <div className="row align-items-center g-5">
          
          {/* Left Column: Copy & Value Proposition */}
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <span className="hero-prebadge">
                <Sparkles size={15} className="text-primary" />
                <span>Recrutement augmenté &amp; éthique</span>
              </span>
            </div>

            <h1 className="hero-title mb-4">
              Le recrutement <span className="text-gradient">prédictif &amp; humain</span> qui connecte les vrais talents.
            </h1>

            <p className="hero-lead mb-4">
              Finies les journées passées à trier des centaines de CVs. Talent360 combine le <strong>parsing IA instantané</strong>, un <strong>scoring transparent</strong> sans biais et un <strong>pipeline Kanban fluide</strong> pour des décisions plus rapides et bienveillantes.
            </p>

            {/* CTA Action Buttons */}
            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 mb-4">
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg">
                <span>Créer un compte gratuit</span>
                <ArrowRight size={17} />
              </Link>
              <Link to={ROUTES.JOBS} className="btn btn-secondary btn-lg">
                <Briefcase size={17} className="text-muted" />
                <span>Explorer les offres</span>
              </Link>
            </div>

            {/* Social Proof Bar */}
            <div className="d-flex align-items-center gap-3 pt-3 border-top border-light">
              <div className="avatar-stack">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Utilisatrice Talent360"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Utilisateur Talent360"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Recruteur Talent360"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Candidat Talent360"
                  loading="lazy"
                />
              </div>

              <div>
                <div className="d-flex align-items-center gap-1 text-warning mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                  <span className="ms-1 small fw-bold text-dark">4.9 / 5</span>
                </div>
                <div className="small text-muted">
                  Plus de <strong>1,800 talents</strong> et <strong>250+ entreprises</strong> recrutent ici.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual with Authentic Human Photo & Floating UI Cards */}
          <div className="col-12 col-lg-6">
            <div className="hero-image-wrapper mx-auto">
              
              {/* Authentic Human Image: Collaborative modern recruitment / hiring interview */}
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80"
                alt="Échange humain et bienveillant en entretien de recrutement"
                className="hero-main-photo"
                loading="eager"
              />

              {/* Top Floating Card: AI Match Score Simulation */}
              <div className="floating-card top-floating">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small">
                    <Sparkles size={11} className="me-1" />
                    Affinité IA 360°
                  </span>
                  <span className="text-muted" style={{ fontSize: '11px' }}>Il y a 2 min</span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <ScoreRing score={0.94} size={50} strokeWidth={4} />
                  <div>
                    <h6 className="mb-0 fw-bold fs-6 text-dark">Alexandre M.</h6>
                    <span className="small text-muted">Lead Dev Fullstack</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-1 mt-2">
                  <span className="badge bg-light text-dark border small fw-normal">React 18</span>
                  <span className="badge bg-light text-dark border small fw-normal">Spring Boot</span>
                  <span className="badge bg-light text-dark border small fw-normal">Docker</span>
                </div>
              </div>

              {/* Middle Floating Badge */}
              <div className="floating-card middle-floating d-none d-md-inline-flex">
                <CheckCircle2 size={16} className="text-success" />
                <span className="small fw-semibold">Entretien technique confirmé</span>
              </div>

              {/* Bottom Floating Card: Automated CV Analysis */}
              <div className="floating-card bottom-floating">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="rounded bg-primary bg-opacity-10 text-primary p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark small">CV analysé en 1.4s</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>PDF &bull; 14 compétences détectées</div>
                  </div>
                </div>

                <div className="small text-muted bg-light p-2 rounded border" style={{ fontSize: '12px' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Adéquation technique</span>
                    <strong className="text-success">96%</strong>
                  </div>
                  <div className="progress" style={{ height: '4px' }}>
                    <div className="progress-bar bg-success" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

