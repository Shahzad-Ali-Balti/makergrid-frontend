import React from 'react';
import { Link } from 'wouter';
import { useAuth } from "@/hooks/use-auth"

const Logo: React.FC = () => {
  const { user } = useAuth()
  return (
    <Link href={user ? "/dashboard" : "/"}>
      <a className="flex items-center">
      <svg width="40" height="40" viewBox="0 0 200 200" className="mr-2" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#1C3766" />
      <stop offset="100%" stopColor="#0A1930" />
    </linearGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E9C868" />
      <stop offset="100%" stopColor="#BF9B2F" />
    </linearGradient>
  </defs>

  {/* Shield background */}
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

        
        <div>
          <h1 className="font-cinzel-decorative text-xl font-bold text-[--gold-default]">MakerGrid</h1>
          <p className="text-xs text-[--gold-default]/60 font-cinzel">Forge. Refine. Rise.</p>
        </div>
      </a>
    </Link>
  );
};

export default Logo;

{/* <path
          d="M60,140 L50,170 M140,140 L150,170"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        /> */}
