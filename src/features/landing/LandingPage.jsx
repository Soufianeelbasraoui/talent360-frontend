import { useEffect } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingHero } from './components/LandingHero';
import { TrustBar } from './components/TrustBar';
import { FeaturesSection } from './components/FeaturesSection';
import { RolesSection } from './components/RolesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { LiveJobsPreview } from './components/LiveJobsPreview';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { LandingFooter } from './components/LandingFooter';

export function LandingPage() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }
    // Scroll to top on first render if no hash
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page min-vh-100 d-flex flex-column">
      <LandingNavbar />
      <main className="flex-grow-1">
        <LandingHero />
        <TrustBar />
        <FeaturesSection />
        <RolesSection />
        <HowItWorksSection />
        <LiveJobsPreview />
        <TestimonialsSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}

