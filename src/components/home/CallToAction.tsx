import React from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 relative bg-gradient-to-b from-[--navy-default] to-[--navy-dark] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="absolute -right-40 top-1/2 transform -translate-y-1/2 opacity-10 w-[600px]">
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="shieldGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C3766" />
              <stop offset="100%" stopColor="#0A1930" />
            </linearGradient>
            <linearGradient id="goldGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9C868" />
              <stop offset="100%" stopColor="#BF9B2F" />
            </linearGradient>
          </defs>
          
            <path
            d="M100,10 L180,40 L180,120 C180,160 140,180 100,190 C60,180 20,160 20,120 L20,40 L100,10 Z"
            fill="url(#shieldGradient)"
            stroke="#D4AF37"
            strokeWidth="4"
          />

          {/* Grid pattern */}
          <path
            d="M40,40 L160,40 M40,80 L160,80 M40,120 L160,120 M40,160 L160,160 
       M40,40 L40,160 M80,40 L80,160 M120,40 L120,160 M160,40 L160,160"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
          {/* M letter */}
          <image
            href="/assets/Logo MakerGrid PNG.png"
            x="25"
            y="25"
            width="150"
            height="150"
          />
        </svg>

      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold mb-6 text-[--gold-default]">Ready to Forge Your World?</h2>
          <p className="text-lg mb-8">Join thousands of digital craftsmen using MakerGrid to create, sell, and bring their imagination to life. Start your journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <ShieldButton size="xl">Create Free Account</ShieldButton>
            </Link>
            <Link href="/community">
              <ShieldButton variant="secondary" size="xl">Explore Marketplace</ShieldButton>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Already a member? <Link href="/login"><a className="text-[--gold-default] hover:underline">Sign in</a></Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
