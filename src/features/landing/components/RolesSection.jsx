import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function RolesSection() {
  const [activeTab, setActiveTab] = useState('recruiter');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#recruteurs') {
        setActiveTab('recruiter');
      } else if (hash === '#candidats') {
        setActiveTab('candidate');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const selectTab = (tabName, hashId) => {
    setActiveTab(tabName);
    window.history.replaceState(null, '', `#${hashId}`);
  };

  return (
    <section id="roles" className="roles-section" style={{ scrollMarginTop: '80px' }}>
      <div id="recruteurs" style={{ scrollMarginTop: '90px' }} />
      <div id="candidats" style={{ scrollMarginTop: '90px' }} />
      <div className="container-xl">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="section-badge">Expérience Sur-Mesure</span>
          <h2 className="section-heading">Une plateforme, deux expériences pensées pour réussir</h2>
          <p className="section-subheading">
            Que vous cherchiez à recruter la perle rare ou à donner un nouvel élan à votre carrière, Talent360 s'adapte à vos besoins.
          </p>

          {/* Interactive Toggle */}
          <div className="d-inline-flex p-1 bg-white rounded border mt-3 shadow-sm" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'recruiter'}
              className={`role-tab-btn ${activeTab === 'recruiter' ? 'active' : ''}`}
              onClick={() => selectTab('recruiter', 'recruteurs')}
            >
              <Briefcase size={16} className="me-2" />
              Pour Recruteurs &amp; RH
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'candidate'}
              className={`role-tab-btn ${activeTab === 'candidate' ? 'active' : ''}`}
              onClick={() => selectTab('candidate', 'candidats')}
            >
              <UserCheck size={16} className="me-2" />
              Pour Candidats
            </button>
          </div>
        </div>

        {/* Tab Content: Recruiter */}
        {activeTab === 'recruiter' && (
          <div className="row align-items-center g-5 animate-fade-in">
            <div className="col-12 col-lg-6">
              <span className="badge bg-primary bg-opacity-10 text-primary mb-2 fw-semibold">
                Espace Recruteur &amp; Talent Acquisition
              </span>
              <h3 className="fs-2 fw-bold text-dark mb-3">
                Recrutez plus vite, plus justement, sans surcharge mentale.
              </h3>
              <p className="text-muted mb-4">
                Passez moins de temps dans les tâches administratives et consacrez votre énergie à créer des relations authentiques avec les meilleurs candidats.
              </p>

              <div className="mb-4">
                <div className="role-bullet-item">
                  <div className="bullet-icon">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong className="text-dark">Génération d'offres assistée par IA :</strong>
                    <p className="text-muted small mb-0">Créez des fiches de poste captivantes et structurées en un clic à partir de vos critères essentiels.</p>
                  </div>
                </div>

                <div className="role-bullet-item">
                  <div className="bullet-icon">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong className="text-dark">Ranking intelligent des candidats :</strong>
                    <p className="text-muted small mb-0">Visualisez instantanément les profils les plus pertinents avec une note explicative détaillée des compétences.</p>
                  </div>
                </div>

                <div className="role-bullet-item">
                  <div className="bullet-icon">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong className="text-dark">Pipeline Kanban intuitif :</strong>
                    <p className="text-muted small mb-0">Pilotez le cycle complet de sélection par glisser-déposer sans aucune friction.</p>
                  </div>
                </div>
              </div>

              <Link to={`${ROUTES.REGISTER}?role=RECRUITER`} className="btn btn-primary">
                <span>Créer mon espace entreprise</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="col-12 col-lg-6">
              <div className="role-visual-container">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                  alt="Recruteuse souriante et concentrée dans son bureau moderne"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Candidate */}
        {activeTab === 'candidate' && (
          <div className="row align-items-center g-5 animate-fade-in">
            <div className="col-12 col-lg-6">
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-2 fw-semibold">
                Espace Candidat &amp; Chercheur d'Opportunités
              </span>
              <h3 className="fs-2 fw-bold text-dark mb-3">
                Trouvez le poste idéal grâce à vos vraies compétences.
              </h3>
              <p className="text-muted mb-4">
                Ne perdez plus votre temps avec des formulaires interminables. Déposez votre CV, découvrez votre niveau de correspondance et accédez à des offres sur-mesure.
              </p>

              <div className="mb-4">
                <div className="role-bullet-item">
                  <div className="bullet-icon bg-success bg-opacity-10 text-success">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong className="text-dark">Dépôt de CV en un instant :</strong>
                    <p className="text-muted small mb-0">Uploadez votre CV en PDF ou Word, notre IA se charge d'extraire et structurer vos forces.</p>
                  </div>
                </div>

                <div className="role-bullet-item">
                  <div className="bullet-icon bg-success bg-opacity-10 text-success">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong className="text-dark">Recommandations sur-mesure :</strong>
                    <p className="text-muted small mb-0">Accédez aux opportunités les plus adaptées avec un score de matching transparent et compréhensible.</p>
                  </div>
                </div>

                <div className="role-bullet-item">
                  <div className="bullet-icon bg-success bg-opacity-10 text-success">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong className="text-dark">Visibilité et suivi en temps réel :</strong>
                    <p className="text-muted small mb-0">Suivez l'avancée de vos candidatures à chaque étape du processus en toute transparence.</p>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <Link to={`${ROUTES.REGISTER}?role=CANDIDATE`} className="btn btn-primary">
                  <span>Créer mon profil candidat</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to={ROUTES.JOBS} className="btn btn-secondary">
                  <span>Voir les offres</span>
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="role-visual-container">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Jeune talent motivé et souriant devant son ordinateur portable"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

