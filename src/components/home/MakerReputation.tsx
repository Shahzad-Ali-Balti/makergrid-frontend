import React from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';

interface BadgeProps {
  icon: string;
  name: string;
  description: string;
  isLocked?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ icon, name, description, isLocked = false }) => {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto bg-[--royal-dark] rounded-full flex items-center justify-center border-2 ${isLocked ? 'border-[--royal-default]/50' : 'border-[--gold-default]'} mb-2`}>
        <i className={`${icon} text-2xl ${isLocked ? 'text-gray-500' : 'text-[--gold-default]'}`}></i>
      </div>
      <h4 className={`font-cinzel text-sm font-bold ${isLocked ? 'text-gray-500' : 'text-white'}`}>{name}</h4>
      <p className={`text-xs ${isLocked ? 'text-gray-500' : 'text-gray-400'}`}>{description}</p>
    </div>
  );
};

const MakerReputation: React.FC = () => {
  const badges = [
    { icon: "ri-sword-fill", name: "Master Craftsman", description: "Created 25+ models" },
    { icon: "ri-funds-box-fill", name: "Top Seller", description: "100+ sales" },
    { icon: "ri-brush-fill", name: "Detail Master", description: "High-detail models" },
    { icon: "ri-award-fill", name: "Legendary Status", description: "Locked: 500+ sales", isLocked: true },
    { icon: "ri-team-fill", name: "Collaborator", description: "10+ team projects" },
    { icon: "ri-rocket-fill", name: "Early Adopter", description: "Day one user" },
    { icon: "ri-fire-fill", name: "Trending Creator", description: "Locked: Top charts", isLocked: true },
    { icon: "ri-vip-crown-fill", name: "Elite Creator", description: "Locked: Invitation only", isLocked: true }
  ];

  return (
    <section className="bg-[--navy-light] py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold mb-4">
            Advance Your <span className="text-[--gold-default]">Maker Reputation</span>
          </h2>
          <div className="w-24 h-1 bg-[--gold-default] mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            Track your journey as a digital craftsman. Earn badges for achievements, sales, contributions, and challenges.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Maker profile card */}
          <div className="bg-[--navy-default] rounded-lg border border-[--royal-default]/50 overflow-hidden shield-container col-span-1">
            <div className="h-32 bg-[--royal-light] relative grid-pattern">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[--royal-dark] opacity-40"></div>
            </div>
            <div className="px-6 pt-0 pb-6 -mt-16 relative">
              <div className="w-32 h-32 mx-auto rounded-full bg-[--navy-default] border-4 border-[--navy-default] overflow-hidden">
                <div className="w-full h-full bg-[--royal-dark] flex items-center justify-center">
                  <i className="ri-user-3-line text-5xl text-[--gold-default]/50"></i>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="font-cinzel-decorative text-2xl font-bold text-[--gold-default]">LegendCrafter</h3>
                <p className="text-gray-400 mb-3">Joined April 2023</p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-[--royal-dark] px-2 py-1 rounded-full text-xs text-gray-300">Master Modeler</span>
                  <span className="bg-[--royal-dark] px-2 py-1 rounded-full text-xs text-gray-300">Model Seller</span>
                </div>
                <div className="flex justify-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">48</div>
                    <div className="text-xs text-gray-400">Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">325</div>
                    <div className="text-xs text-gray-400">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">9.6</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                </div>
                
                <Link href="/profile/1">
                  <ShieldButton variant="secondary" fullWidth={true}>
                    View Full Profile
                  </ShieldButton>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Badges collection */}
          <div className="bg-[--navy-default] rounded-lg border border-[--royal-default]/50 overflow-hidden col-span-1 lg:col-span-2 p-6 shield-container">
            <h3 className="font-cinzel text-xl font-bold mb-6 text-[--gold-default]">Earned Achievements</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <Badge 
                  key={index}
                  icon={badge.icon}
                  name={badge.name}
                  description={badge.description}
                  isLocked={badge.isLocked}
                />
              ))}
            </div>
            
            <div className="mt-8 border-t border-[--royal-default] pt-6">
              <h3 className="font-cinzel text-lg font-bold mb-3 text-[--gold-default]">Current Challenge</h3>
              <div className="bg-[--navy-dark] p-4 rounded-lg border border-[--royal-default]/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-cinzel font-bold">Medieval Architecture Challenge</h4>
                  <span className="text-xs bg-[--gold-default]/80 text-[--navy-default] px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">Create your best medieval building, castle, or structure. Community voting ends in 3 days.</p>
                <div className="w-full bg-[--navy-default] rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-[--gold-dark] to-[--gold-default] h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>8 of 10 submissions</span>
                  <span>Prize: Gold Tier Badge + 100 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakerReputation;
