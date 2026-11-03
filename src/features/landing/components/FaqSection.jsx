import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Comment fonctionne le score de matching IA 360° ?',
      a: 'Notre moteur analyse sémantiquement les critères indispensables d’une offre (compétences techniques, niveau d’expérience, responsabilités) et les compare aux éléments extraits du CV. Le score est accompagné d’une décomposition claire : compétences validées, compétences bonus et points de vigilance à explorer en entretien.',
    },
    {
      q: 'L’IA peut-elle refuser automatiquement un candidat ?',
      a: 'Absolument pas. Chez Talent360, nous prônons une IA éthique et assistante. L’algorithme ne prend jamais de décision d’embauche ou de refus automatique : il classe et surligne les informations pour soulager le recruteur, qui garde l’entière maîtrise humaine de son pipeline.',
    },
    {
      q: 'Quels formats de CV sont acceptés sur la plateforme ?',
      a: 'Vous pouvez déposer vos CVs aux formats PDF et DOCX (Microsoft Word), d’une taille maximale de 10 Mo. Notre parseur extrait la structure complète en moins de 2 secondes.',
    },
    {
      q: 'Est-ce gratuit pour les candidats ?',
      a: 'Oui, l’inscription, le dépôt et l’analyse de CV ainsi que la consultation et candidature aux offres d’emploi sont 100% gratuits et sans engagement pour tous les candidats.',
    },
    {
      q: 'Comment assurez-vous la confidentialité et la conformité RGPD ?',
      a: 'Toutes les données sont hébergées dans un environnement sécurisé avec chiffrement en transit et au repos. Nous appliquons strictement les directives du RGPD : vos données et documents ne sont jamais revendus et vous disposez d’un droit d’accès, de modification et de suppression à tout moment.',
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(current => (current === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="container-xl py-4" style={{ maxWidth: '820px' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-badge">Foire Aux Questions</span>
          <h2 className="section-heading">Toutes les réponses à vos questions</h2>
          <p className="section-subheading">
            Vous souhaitez en savoir plus sur le fonctionnement technique ou éthique de Talent360 ? Consultez nos réponses ci-dessous.
          </p>
        </div>

        {/* Accordion list */}
        <div className="faq-list">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="faq-item">
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-primary flex-shrink-0 ms-2" />
                  ) : (
                    <ChevronDown size={18} className="text-muted flex-shrink-0 ms-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p className="mb-0">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

