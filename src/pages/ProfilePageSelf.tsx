import React, { useState } from 'react';
import { useParams, Link,useLocation  } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ShieldButton from '@/components/ShieldButton';
// import { Model, Badge, UserBadge } from '@shared/schema';
import { getMockUser } from "@/lib/mock/mockUser"
import {Badge,UserModels} from "@/types/UserProfile"
import {getMockModels} from "@/lib/mock/getMockUserModels"
import {getMockUserBadge} from "@/lib/mock/getMockUserBadge"
import { createConversation } from "@/services/chatapi";
import NotFound from "@/pages/not-found"
// import {Link} from "wouter"
// import {UserSchema} from "@/lib/zodUserProfile"
// import { getMockUserModels } from '@/lib/mock/getMockUserModels';



interface BadgeDisplayProps {
  badge: Badge & { earnedAt?: Date };
  isLocked?: boolean;
}


const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, isLocked = false }) => {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto bg-[--royal-dark] rounded-full flex items-center justify-center border-2 ${isLocked ? 'border-[--royal-default]/50' : 'border-[--gold-default]'} mb-2`}>
        <i className={`${badge.iconName} text-2xl ${isLocked ? 'text-gray-500' : 'text-[--gold-default]'}`}></i>
      </div>
      <h4 className={`font-cinzel text-sm font-bold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
        {badge.name}
      </h4>
      <p className={`text-xs ${isLocked ? 'text-gray-500' : 'text-gray-400'}`}>
        {badge.description}
      </p>
    </div>
  );
};



interface ModelCardProps {
  model: UserModels;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <div className="model-card bg-[--navy-default] rounded-lg overflow-hidden border border-[--royal-default]/30 hover:border-[--gold-default]/30">
      <div className="aspect-square relative overflow-hidden">
        <div className="w-full h-full bg-[--navy-dark] grid-pattern">
          {model.thumbnailUrl ? (
            <img 
              src={model.thumbnailUrl} 
              alt={model.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ri-cube-line text-5xl text-[--gold-default]/50"></i>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[--navy-default]/90 via-transparent to-transparent"></div>
        <div className="absolute top-3 right-3 flex space-x-1">
          <span className="bg-[--royal-default]/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
            {model.fileFormat}
          </span>
          {model.featured && (
            <span className="bg-[--gold-default]/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-[--navy-default] font-semibold">
              Featured
            </span>
          )}
          {model.price === 0 && (
            <span className="bg-emerald-600/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
              Free
            </span>
          )}
        </div>
        <h3 className="absolute bottom-3 left-3 right-3 font-cinzel font-bold text-white text-lg">
          {model.title}
        </h3>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-400">
            <i className="ri-eye-line mr-1"></i>
            <span>{model.views}</span>
            <span className="mx-2">•</span>
            <i className="ri-download-line mr-1"></i>
            <span>{model.downloads}</span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(model.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {model.price > 0 ? (
            <span className="text-[--gold-default] font-bold">
              {(model.price / 100).toFixed(2)} <span className="text-sm font-normal text-gray-400">USD</span>
            </span>
          ) : (
            <span className="text-emerald-500 font-bold">Free</span>
          )}
          <Link href={`/model/${model.id}`}>
            <ShieldButton variant="secondary" size="sm">View</ShieldButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProfilePageSelf: React.FC = () => {
  const { id } = useParams();
  const userId = parseInt(id || '0');
  const [activeTab, setActiveTab] = useState('models');
  const params = useParams<{ username: string }>();
  const profile_username = params.username;



  const [, setLocation] = useLocation();

  if (!profile_username) {
    console.error("Username param is missing.");
    return(
      <NotFound/>
    )
  }
  
  // Get user data
  // const { data: user, isLoading: userLoading, error: userError } = useQuery({
  //   queryKey: [`/api/users/${userId}`],
  //   enabled: !isNaN(userId) && userId > 0,
  // });

  const handleMessageClick = async () => {
    try {
      const res = await createConversation(profile_username); // user = profile owner
      const conversationId = res.id;
      setLocation(`/inbox/${conversationId}`);
    } catch (err) {
      console.error("Failed to start conversation", err);
      alert("Unable to start conversation.");
    }
  };

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['mock-user'],
    enabled: !isNaN(userId) && userId > 0,
    queryFn: getMockUser,
      staleTime: 60000,
  });
  
  // Get user's models
  // const { data: userModels, isLoading: modelsLoading } = useQuery({
  //   queryKey: [`/api/users/${userId}/models`],
  //   enabled: !isNaN(userId) && userId > 0,
  // });
  const { data: userModels, isLoading: modelsLoading } = useQuery({
    queryKey: ['mock-user-models'],
    enabled: !isNaN(userId) && userId > 0,
    queryFn: getMockModels
  });
  
  // Get user's badges
  // const { data: userBadges, isLoading: badgesLoading } = useQuery({
  //   queryKey: [`/api/users/${userId}/badges`],
  //   enabled: !isNaN(userId) && userId > 0,
  // });

  const { data: userBadges, isLoading: badgesLoading } = useQuery({
    queryKey: ['mock-user-models'],
    enabled: !isNaN(userId) && userId > 0,
    queryFn: getMockUserBadge
  });
  
  // Get all badges for comparison
  // const { data: allBadges } = useQuery({
  //   queryKey: ['/api/badges'],
  //   staleTime: 600000, // 10 minutes
  // });

  const { data: allBadges } = useQuery({
    // queryKey: ['/api/badges'],
    // staleTime: 600000, // 10 minutes
    queryKey: ['mock-user-models'],
    enabled: !isNaN(userId) && userId > 0,
    queryFn: getMockUserBadge
  });
  
  // Calculate which badges the user has vs. doesn't have
  const earnedBadges = userBadges || [];
  const lockedBadges = allBadges 
    ? allBadges.filter((badge: Badge) => 
        !earnedBadges.find((earnedBadge: any) => earnedBadge.id === badge.id)
      )
    : [];
  
  // if (isNaN(userId) || userId <= 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-16">
  //       <div className="text-center">
  //         <h1 className="font-cinzel-decorative text-2xl text-[--gold-default] mb-4">Invalid User ID</h1>
  //         <p className="text-gray-300 mb-6">The user ID provided is not valid.</p>
  //         <Link href="/">
  //           <ShieldButton variant="secondary">Return Home</ShieldButton>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }
  
  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-16 h-16 border-4 border-[--gold-default] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // if (userError || !user) {
  //   return (
  //     <div className="container mx-auto px-4 py-16">
  //       <div className="text-center">
  //         <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
  //           <i className="ri-error-warning-fill text-4xl text-red-500"></i>
  //         </div>
  //         <h1 className="font-cinzel-decorative text-2xl text-[--gold-default] mb-4">User Not Found</h1>
  //         <p className="text-gray-300 mb-6">The requested user could not be found or an error occurred.</p>
  //         <Link href="/">
  //           <ShieldButton variant="secondary">Return Home</ShieldButton>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        {/* Profile header */}
        <div className="bg-[--navy-light] rounded-lg overflow-hidden gold-border shield-container">
          <div className="h-48 bg-[--royal-light] relative grid-pattern">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[--royal-dark] opacity-40"></div>
          </div>
          
          <div className="px-8 pb-8 relative pt-5">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6 gap-6">
              <div className="w-32 h-32 mx-auto md:mx-0 rounded-full bg-[--navy-default] border-4 border-[--navy-default] overflow-hidden">
                <div className="w-full h-full bg-[--royal-dark] flex items-center justify-center">
                  <i className="ri-user-3-line text-5xl text-[--gold-default]/50"></i>
                </div>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h1 className="font-cinzel-decorative text-3xl font-bold text-[--gold-default]">
                  {profile_username}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <span className="bg-[--royal-dark] px-2 py-1 rounded-full text-xs text-gray-300">
                    {user?.creatorLevel}
                  </span>
                  <span className="bg-[--royal-dark] px-2 py-1 rounded-full text-xs text-gray-300">
                    Model Creator
                  </span>
                </div>
              </div>
              
              {/* <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                <ShieldButton 
                  variant="secondary"
                  leftIcon={<i className="ri-message-3-line"></i>}
                  onClick={handleMessageClick}
                >
                  Message
                </ShieldButton>
                <ShieldButton
                  leftIcon={<i className="ri-user-add-line"></i>}
                >
                  Follow
                </ShieldButton>
              </div> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-[--royal-default]/30 pb-8 mb-6">
              <div className="md:col-span-2">
                <h2 className="font-cinzel text-xl font-bold mb-3 text-white">About</h2>
                <p className="text-gray-300">
                  {user?.bio || 'This creator has not added a bio yet.'}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[--navy-default] rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{userModels?.length || 0}</div>
                  <div className="text-sm text-gray-400">Models</div>
                </div>
                <div className="bg-[--navy-default] rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="bg-[--navy-default] rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
              </div>
            </div>
            
            {/* Tabs navigation */}
            <div className="flex border-b border-[--royal-default]/30">
              <button
                className={`px-4 py-2 font-cinzel ${activeTab === 'models' ? 'text-[--gold-default] border-b-2 border-[--gold-default]' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('models')}
              >
                Models
              </button>
              <button
                className={`px-4 py-2 font-cinzel ${activeTab === 'badges' ? 'text-[--gold-default] border-b-2 border-[--gold-default]' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('badges')}
              >
                Badges & Achievements
              </button>
              <button
                className={`px-4 py-2 font-cinzel ${activeTab === 'sales' ? 'text-[--gold-default] border-b-2 border-[--gold-default]' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('sales')}
              >
                Sales & Statistics
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="mt-8">
          {/* Models tab */}
          {activeTab === 'models' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-cinzel text-2xl font-bold">
                  <span className="text-[--gold-default]">Models</span> Created
                </h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <select 
                      className="appearance-none bg-[--navy-default] border border-[--royal-default] rounded-full pl-4 pr-10 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-[--gold-default]"
                    >
                      <option>All Models</option>
                      <option>Free Models</option>
                      <option>Paid Models</option>
                      <option>Featured</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[--gold-default]">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      className="appearance-none bg-[--navy-default] border border-[--royal-default] rounded-full pl-4 pr-10 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-[--gold-default]"
                    >
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Most Popular</option>
                      <option>Most Downloads</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[--gold-default]">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {modelsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[--gold-default] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userModels && userModels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userModels.map((model: UserModels) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-[--navy-default] rounded-lg border border-[--royal-default]/30">
                  <div className="w-20 h-20 rounded-full bg-[--royal-default]/30 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-inbox-line text-4xl text-[--gold-default]/70"></i>
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Models Yet</h3>
                  <p className="text-gray-300 max-w-md mx-auto">
                    This creator hasn't uploaded any models yet.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Badges tab */}
          {activeTab === 'badges' && (
            <div>
              <h2 className="font-cinzel text-2xl font-bold mb-6">
                <span className="text-[--gold-default]">Badges</span> & Achievements
              </h2>
              
              {badgesLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[--gold-default] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Earned badges */}
                  <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
                    <h3 className="font-cinzel text-xl font-bold mb-6 text-[--gold-default]">Earned Achievements</h3>
                    
                    {earnedBadges.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {earnedBadges.map((badge: any) => (
                          <BadgeDisplay key={badge.id} badge={badge} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-[--royal-default]/30 mx-auto flex items-center justify-center mb-3">
                          <i className="ri-award-line text-2xl text-[--gold-default]/50"></i>
                        </div>
                        <p className="text-gray-300">No badges earned yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Complete challenges to earn badges.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Locked badges */}
                  <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
                    <h3 className="font-cinzel text-xl font-bold mb-6 text-gray-400">Locked Achievements</h3>
                    
                    {lockedBadges.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {lockedBadges.map((badge: Badge) => (
                          <BadgeDisplay key={badge.id} badge={badge} isLocked={true} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-[--royal-default]/10 mx-auto flex items-center justify-center mb-3">
                          <i className="ri-trophy-line text-2xl text-[--gold-default]/30"></i>
                        </div>
                        <p className="text-gray-300">All badges have been earned!</p>
                        <p className="text-sm text-gray-400 mt-1">Legendary status achieved.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Current challenge */}
                  <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
                    <h3 className="font-cinzel text-xl font-bold mb-6 text-[--gold-default]">Current Challenge</h3>
                    
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
                      
                      <div className="mt-4 text-right">
                        <ShieldButton variant="secondary" size="sm">
                          View Challenge
                        </ShieldButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Sales tab */}
          {activeTab === 'sales' && (
            <div>
              <h2 className="font-cinzel text-2xl font-bold mb-6">
                <span className="text-[--gold-default]">Sales</span> & Statistics
              </h2>
              
              <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[--navy-dark] p-4 rounded-lg border border-[--royal-default]/30">
                    <h3 className="text-sm text-gray-400 mb-2">Total Sales</h3>
                    <div className="text-2xl font-bold text-[--gold-default]">$0.00</div>
                    <div className="text-xs text-gray-400 mt-1">0 sales</div>
                  </div>
                  
                  <div className="bg-[--navy-dark] p-4 rounded-lg border border-[--royal-default]/30">
                    <h3 className="text-sm text-gray-400 mb-2">Total Downloads</h3>
                    <div className="text-2xl font-bold text-white">
                      {userModels ? userModels.reduce((sum: number, model: UserModels) => sum + model.downloads, 0) : 0}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Across all models</div>
                  </div>
                  
                  <div className="bg-[--navy-dark] p-4 rounded-lg border border-[--royal-default]/30">
                    <h3 className="text-sm text-gray-400 mb-2">Total Views</h3>
                    <div className="text-2xl font-bold text-white">
                      {userModels ? userModels.reduce((sum: number, model: UserModels) => sum + model.views, 0) : 0}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Across all models</div>
                  </div>
                  
                  <div className="bg-[--navy-dark] p-4 rounded-lg border border-[--royal-default]/30">
                    <h3 className="text-sm text-gray-400 mb-2">Member Since</h3>
                    <div className="text-xl font-bold text-white">
                      {/* {new Date(user?.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} */}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {/* {Math.floor((Date.now() - new Date(user?.joinedAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} months */}
                    </div>
                  </div>
                </div>
                
                <div className="h-64 bg-[--navy-dark] rounded-lg border border-[--royal-default]/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[--royal-default]/20 mx-auto flex items-center justify-center mb-3">
                      <i className="ri-line-chart-line text-2xl text-[--gold-default]/60"></i>
                    </div>
                    <p className="text-gray-300">No sales data available yet</p>
                    <p className="text-sm text-gray-400 mt-1">Sales statistics will appear once you have completed orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
                <h3 className="font-cinzel text-xl font-bold mb-6 text-white">Popular Models</h3>
                
                {userModels && userModels.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[--royal-default]/30">
                          <th className="text-left py-2 px-4 text-gray-400 font-medium">Model</th>
                          <th className="text-center py-2 px-4 text-gray-400 font-medium">Price</th>
                          <th className="text-center py-2 px-4 text-gray-400 font-medium">Views</th>
                          <th className="text-center py-2 px-4 text-gray-400 font-medium">Downloads</th>
                          <th className="text-center py-2 px-4 text-gray-400 font-medium">Created</th>
                          <th className="text-right py-2 px-4 text-gray-400 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userModels
                          .sort((a: UserModels, b: UserModels) => b.views - a.views)
                          .slice(0, 5)
                          .map((model: UserModels) => (
                            <tr key={model.id} className="border-b border-[--royal-default]/10 hover:bg-[--navy-dark]/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-[--royal-dark] rounded flex items-center justify-center mr-3">
                                    <i className="ri-cube-line text-[--gold-default]"></i>
                                  </div>
                                  <span className="font-medium">{model.title}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {model.price > 0 ? (
                                  <span className="text-[--gold-default]">
                                    ${(model.price / 100).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-emerald-500">Free</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">{model.views}</td>
                              <td className="py-3 px-4 text-center">{model.downloads}</td>
                              <td className="py-3 px-4 text-center text-gray-400 text-sm">
                                {new Date(model.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Link href={`/model/${model.id}`}>
                                  <ShieldButton variant="secondary" size="sm">View</ShieldButton>
                                </Link>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[--royal-default]/20 mx-auto flex items-center justify-center mb-3">
                      <i className="ri-inbox-line text-2xl text-[--gold-default]/60"></i>
                    </div>
                    <p className="text-gray-300">No models available</p>
                    <p className="text-sm text-gray-400 mt-1">Create models to see statistics</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSelf;
