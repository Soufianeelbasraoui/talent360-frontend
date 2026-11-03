import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'Talent360 nous a fait économiser plus de 15 heures par semaine sur le tri des candidatures. Nos managers techniques adorent la transparence du score qui détaille les compétences réelles.',
      author: 'Sarah Lemarchand',
      role: 'Head of Talent Acquisition',
      company: 'TechScale Group',
      photo:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&h=240&q=80',
    },
    {
      quote:
        'Pour la première fois, je n’ai pas eu à remplir un formulaire interminable de 10 pages. J’ai déposé mon PDF et 48h plus tard, j’étais en entretien pour un poste parfaitement aligné avec ma stack.',
      author: 'Thomas Moreau',
      role: 'Lead Architecte Logiciel',
      company: 'Recruté via Talent360',
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80',
    },
    {
      quote:
        'L’éthique et l’explicabilité de l’IA font toute la différence. Nos recruteurs gardent le contrôle total et les candidats apprécient un processus rapide, transparent et bienveillant.',
      author: 'Amina Kadiri',
      role: 'Directrice des Ressources Humaines',
      company: 'InnovGroup',
      photo:
        'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=240&h=240&q=80',
    },
  ];

  return (
    <section className="py-5 bg-white border-bottom border-light">
      <div className="container-xl py-4">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="section-badge">Témoignages &amp; Confiance</span>
          <h2 className="section-heading">L'expérience humaine au cœur de notre mission</h2>
          <p className="section-subheading">
            Découvrez comment recruteurs et candidats vivent leur transformation avec Talent360 au quotidien.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="row g-4">
          {testimonials.map((item, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="testimonial-card">
                <div>
                  <div className="quote-mark mb-2">&ldquo;</div>
                  <div className="d-flex text-warning mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" stroke="#F59E0B" />
                    ))}
                  </div>
                  <p className="testimonial-text">{item.quote}</p>
                </div>

                <div className="author-info pt-3 border-top border-light">
                  <img src={item.photo} alt={item.author} loading="lazy" />
                  <div>
                    <h4 className="fs-6 fw-bold text-dark mb-0">{item.author}</h4>
                    <span className="small text-muted d-block">{item.role}</span>
                    <span className="small text-primary fw-semibold">{item.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

