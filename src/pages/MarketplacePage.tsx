import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';
import { getMockModels } from "@/lib/mock/mockData"
import {Model} from "@/types/modelTypes"

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

const MarketplacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  
//   const { data: models, isLoading, error } = useQuery({
//   queryKey: ['/api/models'],
//   queryFn: () =>
//     fetch('/api/models')
//       .then(res => res.json()),
//   staleTime: 60000,
// });

const { data: featuredModels } = useQuery({
  queryKey: ['/api/models/featured'],
  queryFn: () =>
    fetch('/api/models/featured')
      .then(res => res.json()),
  staleTime: 60000,
});

const { data: models, isLoading ,error} = useQuery({
  queryKey: ['mock-models'],
  queryFn: getMockModels,
  staleTime: 60000,
})



  
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
    } else if (selectedType !== 'all') {
      result = result.filter((model: Model) => model.fileFormat.toLowerCase() === selectedType.toLowerCase());
    }
    
    // Price filter - values are in cents
    result = result.filter((model: Model) => 
      model.price >= priceRange[0] && model.price <= priceRange[1]
    );
    
    return result;
  };
  
  useEffect(() => {
    // Reset scroll position when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedCategory, selectedType]);

  return (
    <div className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-cinzel-decorative text-4xl font-bold mb-4">
            The <span className="text-[--gold-default]">Marketplace</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300">
            Discover and download high-quality 3D models created by our community of digital craftsmen.
          </p>
        </div>
        
        {/* Mobile search and filter toggle */}
        <div className="md:hidden mb-6">
          <div className="relative w-full mb-3">
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
          
          <button 
            className="w-full bg-[--navy-default] border border-[--royal-default] rounded-full py-2 px-4 flex items-center justify-center text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className={`ri-filter-3-line mr-2 text-[--gold-default]`}></i>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-[--navy-default] rounded-lg border border-[--royal-default]/30 p-5 sticky top-24">
              <h2 className="font-cinzel text-xl font-bold mb-4 text-[--gold-default]">Filters</h2>
              
              <div className="space-y-6">
                {/* Category filter */}
                <div>
                  <h3 className="font-cinzel font-bold mb-3 text-white">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                      />
                      <span className="text-gray-300">All Categories</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedCategory === 'Architecture'}
                        onChange={() => setSelectedCategory('Architecture')}
                      />
                      <span className="text-gray-300">Architecture</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedCategory === 'Characters'}
                        onChange={() => setSelectedCategory('Characters')}
                      />
                      <span className="text-gray-300">Characters</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedCategory === 'Props'}
                        onChange={() => setSelectedCategory('Props')}
                      />
                      <span className="text-gray-300">Props</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedCategory === 'Vehicles'}
                        onChange={() => setSelectedCategory('Vehicles')}
                      />
                      <span className="text-gray-300">Vehicles</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedCategory === 'Nature'}
                        onChange={() => setSelectedCategory('Nature')}
                      />
                      <span className="text-gray-300">Nature</span>
                    </label>
                  </div>
                </div>
                
                {/* File format */}
                <div>
                  <h3 className="font-cinzel font-bold mb-3 text-white">File Format</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedType === 'all'}
                        onChange={() => setSelectedType('all')}
                      />
                      <span className="text-gray-300">All Formats</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedType === 'STL'}
                        onChange={() => setSelectedType('STL')}
                      />
                      <span className="text-gray-300">STL</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedType === 'OBJ'}
                        onChange={() => setSelectedType('OBJ')}
                      />
                      <span className="text-gray-300">OBJ</span>
                    </label>
                    {/* <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedType === 'FBX'}
                        onChange={() => setSelectedType('FBX')}
                      />
                      <span className="text-gray-300">FBX</span>
                    </label> */}
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        className="accent-[--gold-default] mr-2" 
                        checked={selectedType === 'print-ready'}
                        onChange={() => setSelectedType('print-ready')}
                      />
                      <span className="text-gray-300">Print Ready</span>
                    </label>
                  </div>
                </div>
                
                {/* Price range */}
                <div>
                  <h3 className="font-cinzel font-bold mb-3 text-white">Price</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="accent-[--gold-default] mr-2" 
                        checked={priceRange[0] === 0 && priceRange[1] === 10000}
                        onChange={() => setPriceRange([0, 10000])}
                      />
                      <span className="text-gray-300">All Prices</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="accent-[--gold-default] mr-2" 
                        checked={priceRange[0] === 0 && priceRange[1] === 0}
                        onChange={() => setPriceRange([0, 0])}
                      />
                      <span className="text-gray-300">Free</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="accent-[--gold-default] mr-2" 
                        checked={priceRange[0] === 1 && priceRange[1] === 500}
                        onChange={() => setPriceRange([1, 500])}
                      />
                      <span className="text-gray-300">Under $5</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="accent-[--gold-default] mr-2" 
                        checked={priceRange[0] === 501 && priceRange[1] === 1500}
                        onChange={() => setPriceRange([501, 1500])}
                      />
                      <span className="text-gray-300">$5 - $15</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="accent-[--gold-default] mr-2" 
                        checked={priceRange[0] === 1501 && priceRange[1] === 10000}
                        onChange={() => setPriceRange([1501, 10000])}
                      />
                      <span className="text-gray-300">$15+</span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[--royal-default]/30">
                  <ShieldButton 
                    variant="secondary" 
                    fullWidth
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedType('all');
                      setPriceRange([0, 10000]);
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </ShieldButton>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center bg-[--navy-default] rounded-full p-1 border border-[--royal-default]/50 mb-4 md:mb-0">
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
                  className={`px-4 py-2 rounded-full ${activeTab === 'popular' ? 'bg-[--royal-default] text-white' : 'text-gray-300 hover:text-white'} font-cinzel text-sm`}
                  onClick={() => setActiveTab('popular')}
                >
                  Popular
                </button>
              </div>
              
              <div className="hidden md:block relative">
                <input 
                  type="text" 
                  placeholder="Search models..." 
                  className="w-64 bg-[--navy-default] border border-[--royal-default] rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-[--gold-default]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[--gold-default]">
                  <i className="ri-search-line"></i>
                </div>
              </div>
            </div>
            
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
                {
                // filteredModels().length === 0 ? (
                  filteredModels().length === 0 ? (
                  <div className="text-center py-16 bg-[--navy-default] rounded-lg border border-[--royal-default]/30">
                    <div className="w-20 h-20 rounded-full bg-[--royal-default] flex items-center justify-center mx-auto mb-4 border border-[--gold-default]/30">
                      <i className="ri-file-search-line text-4xl text-[--gold-default]"></i>
                    </div>
                    <h3 className="font-cinzel text-xl font-bold text-[--gold-default] mb-2">No Models Found</h3>
                    <p className="text-gray-300 max-w-md mx-auto">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <div className="mt-6">
                      <ShieldButton 
                        variant="secondary"
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedType('all');
                          setPriceRange([0, 10000]);
                          setSearchQuery('');
                        }}
                      >
                        Reset Filters
                      </ShieldButton>
                    </div>
                  </div>
                ) 
                : (
                  <>                  
                    <div className="mb-4 text-gray-400">
                      Showing {filteredModels().length} results
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredModels().map((model: Model) => (
                        <ModelCard key={model.id} model={model} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            
            {/* Pagination - Simple version */}
            <div className="mt-10 flex justify-center">
              <div className="flex space-x-2">
                <button className="bg-[--navy-default] border border-[--royal-default] rounded-full w-10 h-10 flex items-center justify-center text-gray-300 hover:text-[--gold-default]">
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <button className="bg-[--royal-default] rounded-full w-10 h-10 flex items-center justify-center text-white">1</button>
                <button className="bg-[--navy-default] border border-[--royal-default] rounded-full w-10 h-10 flex items-center justify-center text-[--gold-default]">2</button>
                <button className="bg-[--navy-default] border border-[--royal-default] rounded-full w-10 h-10 flex items-center justify-center text-[--gold-default]">3</button>
                <button className="bg-[--navy-default] border border-[--royal-default] rounded-full w-10 h-10 flex items-center justify-center text-[--gold-default]">
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
