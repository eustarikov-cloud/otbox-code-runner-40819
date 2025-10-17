import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { WhyUs } from "@/components/WhyUs";
import { Samples } from "@/components/Samples";
import { HowItWorks } from "@/components/HowItWorks";
import { OrderForm } from "@/components/OrderForm";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <WhyUs />
      <Samples />
      <HowItWorks />
      <OrderForm />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
