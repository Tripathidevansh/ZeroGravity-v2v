import { Hero } from "@/pages/landing/Hero";
import { Features } from "@/pages/landing/Features";
import { HowItWorks } from "@/pages/landing/HowItWorks";
import { About } from "@/pages/landing/About";
import { CallToAction } from "@/pages/landing/CallToAction";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <CallToAction />
    </>
  );
}
