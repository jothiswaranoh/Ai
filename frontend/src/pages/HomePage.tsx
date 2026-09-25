import React from 'react';
import { Navbar } from '../components/Landing/Navbar';
import { HeroSection } from '../components/Landing/HeroSection';
import { ProblemSolution } from '../components/Landing/ProblemSolution';
import { DroneShowcase } from '../components/Landing/DroneShowcase';
import { BeforeAfterSection } from '../components/Landing/BeforeAfterSection';
import { HowItWorks } from '../components/Landing/HowItWorks';
import { FarmerBenefits } from '../components/Landing/FarmerBenefits';
import { CropsGrid } from '../components/Landing/CropsGrid';
import { DroneInAction } from '../components/Landing/DroneInAction';
import { WhyChooseUs } from '../components/Landing/WhyChooseUs';
import { Footer } from '../components/Landing/Footer';
import { StickyMobileBar } from '../components/Landing/StickyMobileBar';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Problem vs Solution Section */}
        <ProblemSolution />

        {/* 3. Drone 3D Showcase with Interactive Tech Callouts */}
        <DroneShowcase />

        {/* 4. Before vs After Interactive Crop Health Slider */}
        <BeforeAfterSection />

        {/* 5. How It Works (4 Steps) */}
        <HowItWorks />

        {/* 6. Farmer Economics & Practical Benefits */}
        <FarmerBenefits />

        {/* 7. Crops We Spray (Indian Crops Focus) */}
        <CropsGrid />

        {/* 8. Drone in Action / Farmland Deployment */}
        <DroneInAction />

        {/* 9. Why Choose Shamuga Farm Service */}
        <WhyChooseUs />
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <StickyMobileBar />
    </div>
  );
};

export default HomePage;
