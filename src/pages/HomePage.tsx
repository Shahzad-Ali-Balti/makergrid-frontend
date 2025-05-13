import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AIGeneratorSection from '@/components/home/AIGeneratorSection';
import ModelGallery from '@/components/home/ModelGallery';
import ModelEditorPreview from '@/components/home/ModelEditorPreview';
import MakerReputation from '@/components/home/MakerReputation';
import CallToAction from '@/components/home/CallToAction';
import VideoSection from "@/components/home/VideoSection"
const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <VideoSection/>
      <AIGeneratorSection />
      <ModelGallery />
      <ModelEditorPreview />
      <MakerReputation />
      <CallToAction />
    </div>
  );
};

export default HomePage;
