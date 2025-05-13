import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';
import { useQuery } from '@tanstack/react-query';
import { Model } from "@/types/modelTypes"
import { getMockModels } from "@/lib/mock/mockData"


// import { Model } from '@shared/schema';

// interface ModelCardProps {
//   model: Model;
// }



const ModelCard: React.FC<{ model: Model }> = ({ model }) => {
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
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[--royal-default] overflow-hidden border border-[--gold-default]/20">
              <div className="w-full h-full bg-[--royal-dark] flex items-center justify-center">
                <i className="ri-user-3-line text-[--gold-default]"></i>
              </div>
            </div>
            <span className="ml-2 text-sm text-gray-300">
              by <Link href={`/profile/${model.userId}`}><a className="text-[--gold-default] hover:underline">{model.creatorName}</a></Link>
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <i className="ri-eye-line mr-1"></i>
            <span>{model.views}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {model.price > 0 ? (
            <div className="flex flex-col items-start text-[--gold-default] font-bold leading-tight">
              <span className="text-lg">{(model.price / 100).toFixed(2)}</span>
              <span className="text-sm font-normal text-gray-400">USD</span>
            </div>
          ) : (
            <span className="text-emerald-500 font-bold">Free</span>
          )}
          <Link href={`/model/${model.id}`}>
            <ShieldButton variant="secondary" size="sm" leftIcon={<i className="ri-download-line"></i>}>
              Download
            </ShieldButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ModelGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [rightVideoReady, setRightVideoReady] = useState(false);

  // const { data: models, isLoading, error } = useQuery({
  //   queryKey: ['/api/models'],
  //   staleTime: 60000, // 1 minute
  // });
  const { data: models, isLoading, error } = useQuery({
    queryKey: ['mock-models'],
    queryFn: getMockModels,
    staleTime: 60000,
  })

  // const { data: featuredModels } = useQuery({
  //   queryKey: ['/api/models/featured'],
  //   staleTime: 60000, // 1 minute
  // });

  const { data: featuredModels } = useQuery({
    queryKey: ['/api/models/featured'],
    queryFn: () =>
      fetch('/api/models/featured')
        .then(res => res.json()),
    staleTime: 60000,
  });

  const filteredModels = () => {
    let result = activeTab === 'featured' && featuredModels ? featuredModels : models || [];

    if (searchQuery) {
      result = result.filter((model: Model) =>
        model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((model: Model) => model.category === selectedCategory);
    }

    if (selectedType === 'print-ready') {
      result = result.filter((model: Model) => model.printReady);
    }

    return result;
  };

  return (
    <section className="bg-[--navy-light] py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h2 className="font-cinzel text-3xl font-bold mb-2">
              Explore <span className="text-[--gold-default]">The Grid</span>
            </h2>
            <p className="text-gray-300">Discover trending models created by our community of digital craftsmen.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center bg-[--navy-default] rounded-full p-1 border border-[--royal-default]/50">
              <button
                className={`px-4 py-2 rounded-full ${activeTab === 'all' ? 'bg-[--royal-default] text-white' : 'text-gray-300 hover:text-white'} font-cinzel text-sm`}
                onClick={() => setActiveTab('all')}
              >
                All Models
              </button>
              <button
                className={`px-4 py-2 rounded-full ${activeTab === 'featured' ? 'bg-[--royal-default] text-white' : 'text-gray-300 hover:text-white'} font-cinzel text-sm`}
                onClick={() => setActiveTab('featured')}
              >
                Featured
              </button>
              <button
                className={`px-4 py-2 rounded-full ${activeTab === 'trending' ? 'bg-[--royal-default] text-white' : 'text-gray-300 hover:text-white'} font-cinzel text-sm`}
                onClick={() => setActiveTab('trending')}
              >
                Trending
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative">
            <select
              className="appearance-none bg-[--navy-default] border border-[--royal-default] rounded-full pl-4 pr-10 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-[--gold-default]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Architecture">Architecture</option>
              <option value="Characters">Characters</option>
              <option value="Props">Props</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Nature">Nature</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[--gold-default]">
              <i className="ri-arrow-down-s-line"></i>
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-[--navy-default] border border-[--royal-default] rounded-full pl-4 pr-10 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-[--gold-default]"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Models</option>
              <option value="print-ready">Print Ready</option>
              <option value="stl">STL Files</option>
              <option value="obj">OBJ Files</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[--gold-default]">
              <i className="ri-arrow-down-s-line"></i>
            </div>
          </div>

          <div className="relative flex-grow md:max-w-xs">
            <input
              type="text"
              placeholder="Search models..."
              className="w-full bg-[--navy-default] border border-[--royal-default] rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-[--gold-default]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[--gold-default]">
              <i className="ri-search-line"></i>
            </div>
          </div>
        </div>
        <div className='flex flex-col md:flex-row items-center gap-10'>
          <div id="left-side">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-[--gold-default] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <div className="text-red-500 mb-2">Failed to load models</div>
                <ShieldButton
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </ShieldButton>
              </div>
            ) : (
              <>
                {filteredModels().length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-[--royal-default] flex items-center justify-center mx-auto mb-4 border border-[--gold-default]/30">
                      <i className="ri-file-search-line text-4xl text-[--gold-default]"></i>
                    </div>
                    <h3 className="font-cinzel text-xl font-bold text-[--gold-default] mb-2">No Models Found</h3>
                    <p className="text-gray-300 max-w-md mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredModels().slice(0, 8).map((model: Model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
            <div id="right-video" className="md:w-1/2 relative w-full h-[700px]">
              <div className="relative w-full h-full rounded-lg overflow-hidden gold-border grid-pattern">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[--navy-default]/80 z-10 rounded-lg"></div>

                <video
                  src="/assets/video/video_3.mp4"
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
        {/* Grid of models */}


        <div className="mt-12 text-center">
          <Link href="/community">
            <ShieldButton variant="secondary" size="lg">
              View All Models
            </ShieldButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ModelGallery;
