import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import HowItWorks from '../components/HowItWorks';
import GoalsSection from '../components/GoalsSection';
import KitchenSection from '../components/KitchenSection';
import FoodLoggingSection from '../components/FoodLoggingSection';
import WeeklyInsights from '../components/WeeklyInsights';
import DietaryPreferences from '../components/DietaryPreferences';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-warmBg">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <GoalsSection />
        <KitchenSection />
        <FoodLoggingSection />
        <WeeklyInsights />
        <DietaryPreferences />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
