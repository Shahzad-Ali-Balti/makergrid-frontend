import React, { useState } from 'react';

const VideoSection = () => {
  const [leftVideoReady, setLeftVideoReady] = useState(false);
  const [rightVideoReady, setRightVideoReady] = useState(false);

  return (
    <section className="py-16 grid-pattern relative">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold mb-4">
            {/* Craft with <span className="text-[--gold-default]">Precision</span>, Style, and Purpose */}
          </h2>
          {/* <div className="w-24 h-1 bg-[--gold-default] mx-auto mb-6"></div> */}
          <p className="max-w-2xl mx-auto text-gray-300">
            {/* MakerGrid gives you the tools to dominate the grid and bring your 3D creations to life. */}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* Left Video */}
          <div id="left-video" className="md:w-1/2 relative w-full h-[600px]">
            <div className="relative w-full h-full rounded-lg overflow-hidden gold-border grid-pattern">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[--navy-default]/80 z-10 rounded-lg"></div>

              <video
                src="/assets/video/video_2.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onCanPlayThrough={() => setLeftVideoReady(true)}
                className={`absolute inset-0 w-full h-full object-cover rounded-lg z-0 transition-opacity duration-1000 ${leftVideoReady ? "opacity-100" : "opacity-0"
                  }`}
              />
            </div>
          </div>

          {/* Right Video */}
          <div id="right-video" className="md:w-1/2 relative w-full h-[600px]">
            <div className="relative w-full h-full rounded-lg overflow-hidden gold-border grid-pattern">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[--navy-default]/80 z-10 rounded-lg"></div>

              <video
                src="/assets/video/video_1.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onCanPlayThrough={() => setRightVideoReady(true)}
                className={`absolute inset-0 w-full h-full object-cover rounded-lg z-0 transition-opacity duration-1000 ${rightVideoReady ? "opacity-100" : "opacity-0"
                  }`}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VideoSection;
