import React from 'react';
import { Link } from 'wouter';
import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[--navy-dark] border-t border-[--royal-default]/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 mb-4">The AI-powered platform for 3D creators, builders, and digital craftsmen.</p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-[--gold-default]">
                <i className="ri-twitter-x-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[--gold-default]">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[--gold-default]">
                <i className="ri-discord-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[--gold-default]">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-cinzel text-lg font-bold text-[--gold-default] mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/marketplace"><a className="text-gray-400 hover:text-[--gold-default]">Marketplace</a></Link></li>
              <li><Link href="/pricing"><a className="text-gray-400 hover:text-[--gold-default]">Pricing Plans</a></Link></li>
              <li><Link href="/featured"><a className="text-gray-400 hover:text-[--gold-default]">Featured Models</a></Link></li>
              <li><Link href="/creators"><a className="text-gray-400 hover:text-[--gold-default]">Creator Profiles</a></Link></li>
              <li><Link href="/challenges"><a className="text-gray-400 hover:text-[--gold-default]">Challenges</a></Link></li>
              <li><Link href="/print-services"><a className="text-gray-400 hover:text-[--gold-default]">Print Services</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-cinzel text-lg font-bold text-[--gold-default] mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/tutorials"><a className="text-gray-400 hover:text-[--gold-default]">Tutorials</a></Link></li>
              <li><Link href="/docs"><a className="text-gray-400 hover:text-[--gold-default]">Documentation</a></Link></li>
              <li><Link href="/forum"><a className="text-gray-400 hover:text-[--gold-default]">Community Forum</a></Link></li>
              <li><Link href="/help"><a className="text-gray-400 hover:text-[--gold-default]">Help Center</a></Link></li>
              <li><Link href="/api"><a className="text-gray-400 hover:text-[--gold-default]">API Reference</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-cinzel text-lg font-bold text-[--gold-default] mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="text-gray-400 hover:text-[--gold-default]">About Us</a></Link></li>
              <li><Link href="/careers"><a className="text-gray-400 hover:text-[--gold-default]">Careers</a></Link></li>
              <li><Link href="/blog"><a className="text-gray-400 hover:text-[--gold-default]">Blog</a></Link></li>
              <li><Link href="/press"><a className="text-gray-400 hover:text-[--gold-default]">Press Kit</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-[--gold-default]">Contact</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[--royal-default]/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MakerGrid. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <Link href="/terms"><a className="text-gray-400 hover:text-[--gold-default]">Terms of Service</a></Link>
            <Link href="/privacy"><a className="text-gray-400 hover:text-[--gold-default]">Privacy Policy</a></Link>
            <Link href="/cookies"><a className="text-gray-400 hover:text-[--gold-default]">Cookie Settings</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
