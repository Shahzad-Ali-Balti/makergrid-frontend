"use client"

import React, { useState } from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';
import ModelViewer from '../model-viewer';

const HeroSection: React.FC = () => {
  // const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>("/assets/model_5ze912.glb");
  const [videoReady, setVideoReady] = useState(false);
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="font-cinzel-decorative text-4xl md:text-6xl font-bold text-[--gold-default] mb-4">
              Forge Your World
            </h1>
            <p className="text-lg mb-8 max-w-xl mx-auto md:mx-0 text-gray-300">
              The AI-powered platform for 3D creators, builders, and digital craftsmen.
              Design, sculpt, collaborate, and sell — all within one immersive creative ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/create">
                <ShieldButton size="lg">Get Started</ShieldButton>
              </Link>
              <Link href="/tutorials">
                <ShieldButton variant="secondary" size="lg">Watch Tutorial</ShieldButton>
              </Link>
            </div>
          </div>

          {/* Right 3D Viewer */}
          {/* <div className="md:w-1/2 relative w-full h-96">
            <div className="w-full h-full rounded-lg overflow-hidden gold-border relative grid-pattern">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[--navy-default]/80 z-10"></div> */}

          {/* <ModelViewer
                modelUrl={generatedModelUrl || undefined}
                className="h-full"
                isPage={true}
              /> */}

          {/* Optional Floating Buttons */}
          {/* <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                <button className="bg-[--navy-default]/80 p-2 rounded-full text-[--gold-default] hover:bg-[--navy-default]">
                  <i className="ri-fullscreen-line"></i>
                </button>
                <button className="bg-[--navy-default]/80 p-2 rounded-full text-[--gold-default] hover:bg-[--navy-default]">
                  <i className="ri-restart-line"></i>
                </button>
              </div> */}
          {/* </div>
          </div> */}

          <div className="md:w-1/2 relative w-full h-[600px]">
            <div className="relative w-full h-full rounded-lg overflow-hidden gold-border grid-pattern">
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[--navy-default]/80 z-10 rounded-lg"></div>

              {/* Video */}
              <video
                src="/assets/video/hero_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onCanPlayThrough={() => setVideoReady(true)}
                className={`absolute inset-0 w-full h-full object-cover rounded-lg z-0 transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"
                  }`}
              />
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default HeroSection;
