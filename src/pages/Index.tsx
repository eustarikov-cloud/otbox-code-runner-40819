import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { WhyUs } from "@/components/WhyUs";
import { Samples } from "@/components/Samples";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section from navigation state
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
    // Handle hash in URL
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);
  return (
    <div className="min-h-screen">
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <WhyUs />
        <Samples />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
