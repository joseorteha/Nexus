import NavBar from "../components/modules/landing/NavBar";
import HeroSection from "../components/modules/landing/HeroSection";
import Features from "../components/modules/landing/Features";
import Footer from "../components/modules/landing/Footer";
import ProblemSection from "../components/modules/landing/problem";
import SolutionSection from "../components/modules/landing/Solution";
import whoWeAre from "../components/modules/landing/WhoIsFor";
import Beneficios from "../components/modules/landing/BenefitsSection";
import CTA from "../components/modules/landing/CTASection";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <Features />
      {whoWeAre()}
      <Beneficios />
      <CTA />
      <Footer />
    </main>
  );
}
