import { Layers, ShieldCheck, Zap, Users2 } from 'lucide-react';

export function TrustBar() {
  const stats = [
    {
      number: 'x3.5',
      label: 'Vitesse de présélection des candidatures',
      accent: 'primary-accent',
      icon: <Zap size={18} className="text-primary mb-2" />,
    },
    {
      number: '94%',
      label: 'Précision du matching basé sur les compétences',
      accent: 'ai-accent',
      icon: <Layers size={18} className="text-success mb-2" />,
    },
    {
      number: '25k+',
      label: 'CVs analysés et qualifiés sans friction',
      accent: 'primary-accent',
      icon: <Users2 size={18} className="text-primary mb-2" />,
    },
    {
      number: '100%',
      label: 'L\'humain garde la décision finale à chaque étape',
      accent: 'ai-accent',
      icon: <ShieldCheck size={18} className="text-success mb-2" />,
    },
  ];

  const partners = [
    'TechScale',
    'InnovaCorp',
    'CloudSphere',
    'DataPulse AI',
    'NextGen Studio',
    'Horizon Health',
  ];

  return (
    <section className="trust-bar">
      <div className="container-xl">
        
        {/* Key Metrics Grid */}
        <div className="row g-4 text-center justify-content-center mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-6 col-lg-3">
              <div className="stat-card">
                <div>{stat.icon}</div>
                <div className={`stat-number ${stat.accent}`}>{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners strip */}
        <div className="pt-4 border-top border-light text-center">
          <p className="text-uppercase small fw-bold text-muted mb-3" style={{ letterSpacing: '0.08em', fontSize: '11px' }}>
            Ils accélèrent leurs recrutements avec Talent360
          </p>
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 gap-md-4">
            {partners.map((partner, idx) => (
              <span key={idx} className="partner-logo-pill">
                <span className="text-primary">&bull;</span>
                <span>{partner}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

