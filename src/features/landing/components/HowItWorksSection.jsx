import { UploadCloud, Cpu, Award } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: <UploadCloud size={22} className="text-primary" />,
      title: 'Dépôt & Publication',
      description:
        'Le recruteur publie son besoin assisté par le générateur IA, ou le candidat dépose son CV sans questionnaire interminable.',
    },
    {
      step: '02',
      icon: <Cpu size={22} className="text-success" />,
      title: 'Scoring IA Transparent',
      description:
        'L\'algorithme analyse les compétences clés, l\'expérience et calcule un indice d\'affinité objectif et explicable point par point.',
    },
    {
      step: '03',
      icon: <Award size={22} className="text-primary" />,
      title: 'Échange Humain & Embauche',
      description:
        'Passez au Kanban, planifiez vos entretiens et concrétisez les embauches sur la base de critères justes et partagés.',
    },
  ];

  return (
    <section id="how-it-works" className="py-5 bg-white border-bottom border-light">
      <div className="container-xl py-4">
        
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-badge">Simplicité &amp; Efficacité</span>
          <h2 className="section-heading">Comment fonctionne Talent360 ?</h2>
          <p className="section-subheading">
            Un processus en 3 étapes simples pour éliminer la friction et accélérer les rencontres professionnelles enrichissantes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="row g-4">
          {steps.map((item, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="step-card">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="step-number-badge">{item.step}</div>
                  <div className="p-2 rounded bg-light border">{item.icon}</div>
                </div>
                <h3 className="fs-5 fw-bold text-dark mb-2">{item.title}</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

