import { FileText, Target, Sparkles, Kanban, BarChart3 } from 'lucide-react';
import { ScoreRing } from '@/components/ScoreRing';

export function FeaturesSection() {
  return (
    <section id="features" className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container-xl py-4">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="section-badge ai-badge-style">
            <Sparkles size={13} />
            <span>Technologies de pointe</span>
          </span>
          <h2 className="section-heading">
            L'intelligence artificielle au service de l'intuition humaine
          </h2>
          <p className="section-subheading">
            Talent360 ne remplace pas vos recruteurs : il élimine la répétition administrative pour leur permettre de se concentrer sur l'essentiel : l'échange humain.
          </p>
        </div>

        {/* 3 Main Pillars Grid */}
        <div className="row g-4 mb-4">
          
          {/* Card 1: CV Parser */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-icon-box primary">
                <FileText size={24} />
              </div>
              <h3 className="feature-title">Parsing de CV automatique</h3>
              <p className="feature-description">
                Déposez un CV au format PDF ou DOCX. L'algorithme extrait instantanément les compétences, l'historique de carrière, les diplômes et les certifications avec une précision remarquable.
              </p>
              
              <div className="feature-mock-ui">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold text-dark">Extraction terminée</span>
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '10px' }}>
                    1.2s
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge bg-white text-dark border">TypeScript</span>
                  <span className="badge bg-white text-dark border">Spring Boot</span>
                  <span className="badge bg-white text-dark border">MySQL</span>
                  <span className="badge bg-white text-dark border">5 ans exp.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Match Scoring */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-icon-box ai">
                <Target size={24} />
              </div>
              <h3 className="feature-title">Matching prédictif 360°</h3>
              <p className="feature-description">
                Fini le tri au hasard. Chaque profil est évalué par rapport à vos exigences avec une décomposition transparente : compétences maîtrisées, lacunes éventuelles et potentiel d'évolution.
              </p>
              
              <div className="feature-mock-ui">
                <div className="d-flex align-items-center gap-3">
                  <ScoreRing score={0.92} size={42} strokeWidth={3.5} />
                  <div>
                    <div className="fw-semibold text-dark">Score d'adéquation : 92%</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>Explication : 4/4 critères validés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Job Description Generator */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-icon-box navy">
                <Sparkles size={24} />
              </div>
              <h3 className="feature-title">Générateur de fiches de poste</h3>
              <p className="feature-description">
                Rédigez des descriptions de poste claires, attractives et inclusives en quelques secondes. Saisissez quelques mots-clés, l'IA génère les missions, les compétences et les avantages.
              </p>
              
              <div className="feature-mock-ui">
                <div className="text-muted mb-1" style={{ fontSize: '11px' }}>Prompt : "Lead DevOps AWS Kubernetes"</div>
                <div className="p-2 bg-white rounded border text-dark" style={{ fontSize: '11px' }}>
                  &ldquo;Nous recherchons un(e) Lead DevOps passionné(e) pour concevoir nos architectures cloud...&rdquo;
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 2 Additional Secondary Features */}
        <div className="row g-4">
          
          <div className="col-12 col-md-6">
            <div className="p-4 bg-light rounded border d-flex gap-3 align-items-start">
              <div className="rounded p-2 bg-white border text-primary flex-shrink-0">
                <Kanban size={22} />
              </div>
              <div>
                <h4 className="fs-6 fw-bold text-dark mb-1">Pipeline Kanban collaboratif</h4>
                <p className="small text-muted mb-0">
                  Déplacez facilement vos candidats d'une étape à l'autre en glisser-déposer. Synchronisation en temps réel pour toute votre équipe recrutement.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-4 bg-light rounded border d-flex gap-3 align-items-start">
              <div className="rounded p-2 bg-white border text-success flex-shrink-0">
                <BarChart3 size={22} />
              </div>
              <div>
                <h4 className="fs-6 fw-bold text-dark mb-1">Analytique &amp; KPIs de recrutement</h4>
                <p className="small text-muted mb-0">
                  Suivez vos métriques clés : temps d'embauche moyen, taux de conversion par canal et efficacité par département en un clin d'œil.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

