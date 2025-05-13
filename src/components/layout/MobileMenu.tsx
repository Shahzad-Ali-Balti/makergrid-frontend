import React, { useEffect } from 'react';
import { Link } from 'wouter';
import Logo from '@/components/Logo';
import ShieldButton from '@/components/ShieldButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Prevent body scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-[--navy-dark]/95 z-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          
          <button 
            className="text-[--gold-default]"
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <nav className="space-y-6">
          <Link href="/marketplace">
            <a className="block font-cinzel text-xl text-white hover:text-[--gold-default]" onClick={onClose}>
              Discover
            </a>
          </Link>
          <Link href="/marketplace">
            <a className="block font-cinzel text-xl text-white hover:text-[--gold-default]" onClick={onClose}>
              Marketplace
            </a>
          </Link>
          <Link href="/pricing">
            <a className="block font-cinzel text-xl text-white hover:text-[--gold-default]" onClick={onClose}>
              Pricing
            </a>
          </Link>
          <Link href="/learn">
            <a className="block font-cinzel text-xl text-white hover:text-[--gold-default]" onClick={onClose}>
              Learn
            </a>
          </Link>
          <Link href="/community">
            <a className="block font-cinzel text-xl text-white hover:text-[--gold-default]" onClick={onClose}>
              Community
            </a>
          </Link>
          
          <div className="pt-4 border-t border-[--royal-default]/30">
            <Link href="/create">
              <ShieldButton variant="default" fullWidth={true} size="lg" onClick={onClose}>
                Create Model
              </ShieldButton>
            </Link>
          </div>
          
          <div className="pt-4">
            <Link href="/login">
              <ShieldButton variant="secondary" fullWidth={true} size="lg" onClick={onClose}>
                Sign In
              </ShieldButton>
            </Link>
          </div>
        </nav>
      </div>
      
      <div className="container mx-auto px-4 py-4 border-t border-[--royal-default]/30">
        <div className="flex justify-center space-x-6 text-lg">
          <a href="#" className="text-gray-400 hover:text-[--gold-default]">
            <i className="ri-twitter-x-fill"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[--gold-default]">
            <i className="ri-instagram-fill"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[--gold-default]">
            <i className="ri-discord-fill"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[--gold-default]">
            <i className="ri-youtube-fill"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
