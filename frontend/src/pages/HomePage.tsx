import React, { useState } from 'react';
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
import { BookingSection } from '../components/Landing/BookingSection';
import { Footer } from '../components/Landing/Footer';
import { StickyMobileBar } from '../components/Landing/StickyMobileBar';
import { BookingModal } from '../components/Landing/BookingModal';

export const HomePage: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleOpenBooking = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection onOpenBooking={handleOpenBooking} />

        {/* 2. Problem vs Solution Section */}
        <ProblemSolution onOpenBooking={handleOpenBooking} />

        {/* 3. Drone 3D Showcase with Interactive Tech Callouts */}
        <DroneShowcase onOpenBooking={handleOpenBooking} />

        {/* 4. Before vs After Interactive Crop Health Slider */}
        <BeforeAfterSection onOpenBooking={handleOpenBooking} />

        {/* 5. How It Works (4 Steps) */}
        <HowItWorks onOpenBooking={handleOpenBooking} />

        {/* 6. Farmer Economics & Practical Benefits */}
        <FarmerBenefits onOpenBooking={handleOpenBooking} />

        {/* 7. Crops We Spray (Indian Crops Focus) */}
        <CropsGrid onOpenBooking={handleOpenBooking} />

        {/* 8. Drone in Action / Farmland Deployment */}
        <DroneInAction onOpenBooking={handleOpenBooking} />

        {/* 9. Why Choose Shamuga Farm Service */}
        <WhyChooseUs onOpenBooking={handleOpenBooking} />

        {/* 10. Direct Booking & Contact Form Section */}
        <BookingSection onOpenModal={handleOpenBooking} onOpenBooking={handleOpenBooking} />
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <StickyMobileBar onOpenBooking={handleOpenBooking} />

      {/* Interactive Booking & WhatsApp Scheduling Modal */}
      <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseBooking} />
    </div>
  );
};

export default HomePage;
