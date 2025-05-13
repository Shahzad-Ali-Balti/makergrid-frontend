import React from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  link: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, link }) => {
  return (
    <div className="bg-[--navy-default] p-6 rounded-lg shield-container hover:border-[--gold-default]/30 hover:bg-[--navy-light] transition-all duration-300 border border-[--royal-default]/50">
      <div className="w-14 h-14 bg-[--royal-default] rounded-full flex items-center justify-center mb-4 text-[--gold-default]">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <Link href={link}>
        <a className="text-[--gold-default] font-cinzel text-sm flex items-center hover:underline">
          Learn more
          <i className="ri-arrow-right-line ml-1"></i>
        </a>
      </Link>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-[--navy-light] py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold mb-4">
            Craft with <span className="text-[--gold-default]">Precision</span>, Style, and Purpose
          </h2>
          <div className="w-24 h-1 bg-[--gold-default] mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            MakerGrid gives you the tools to dominate the grid and bring your 3D creations to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature 
            icon="ri-ai-generate"
            title="AI-Driven 3D Generation"
            description="Input a text prompt, image, or sketch — and let MakerGrid's custom AI models transform your ideas into fully realized 3D forms."
            link="/create"
          />
          
          <Feature 
            icon="ri-tools-fill"
            title="In-Browser Sculpting"
            description="Refine your creations with professional sculpting tools inspired by ZBrush and Blender directly in your browser."
            link="#editor"
          />
          
          <Feature 
            icon="ri-store-2-fill"
            title="Model Marketplace"
            description="Upload, showcase, and sell your models. Choose to keep them private or make them public with monetization options."
            link="/community"
          />
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/">
            <ShieldButton variant="secondary" size="lg">
              Explore All Features
            </ShieldButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
