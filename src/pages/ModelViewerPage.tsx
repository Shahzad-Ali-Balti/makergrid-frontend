import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import ThreeJsViewer from '@/components/ThreeJsViewer';
import ShieldButton from '@/components/ShieldButton';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {getSingelMockModel} from "@/lib/mock/singleModelMock"

const ModelViewerPage: React.FC = () => {
  const { id } = useParams();
  const modelId = parseInt(id || '0');
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // const { data: model, isLoading, error } = useQuery({
  //   queryKey: [`/api/models/${modelId}`],
  //   enabled: !isNaN(modelId) && modelId > 0,
  //   staleTime: 60000, // 1 minute
  // });
  const { data: model, isLoading, error } = useQuery({
    queryKey: ['mock-models'],
      queryFn: getSingelMockModel,
      staleTime: 60000,
  });
  
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const downloadModel = async () => {
    if (!model) return;
    
    setIsDownloading(true);
    
    try {
      const response = await apiRequest('POST', `/api/models/${model.userId}/download`, {});
      const data = await response.json();
      
      // In a real app, we'd initiate a download with the modelUrl
      toast({
        title: "Download Started",
        description: "Your model download has started.",
      });
      
      // Simulate download
      setTimeout(() => {
        toast({
          title: "Download Complete",
          description: `${model.title}.${model.fileFormat.toLowerCase()} has been downloaded.`,
        });
        setIsDownloading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error downloading model:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the model. Please try again.",
        variant: "destructive"
      });
      setIsDownloading(false);
    }
  };
  
  if (isNaN(modelId) || modelId <= 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="font-cinzel-decorative text-2xl text-[--gold-default] mb-4">Invalid Model ID</h1>
          <p className="text-gray-300 mb-6">The model ID provided is not valid.</p>
          <Link href="/marketplace">
            <ShieldButton variant="secondary">Return to Marketplace</ShieldButton>
          </Link>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-16 h-16 border-4 border-[--gold-default] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !model) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-fill text-4xl text-red-500"></i>
          </div>
          <h1 className="font-cinzel-decorative text-2xl text-[--gold-default] mb-4">Model Not Found</h1>
          <p className="text-gray-300 mb-6">The requested model could not be found or an error occurred.</p>
          <Link href="/marketplace">
            <ShieldButton variant="secondary">Return to Marketplace</ShieldButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center">
          <Link href="/community">
            <a className="text-sm text-gray-400 hover:text-[--gold-default] flex items-center">
              <i className="ri-arrow-left-line mr-1"></i> Back to Marketplace
            </a>
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column - 3D model viewer */}
          <div className="lg:w-7/12">
            <div className="bg-[--navy-dark] rounded-lg overflow-hidden relative grid-pattern gold-border">
              <div className="aspect-square lg:aspect-auto lg:h-[600px]">
                <ThreeJsViewer
                  modelUrl="https://threejs.org/examples/models/stl/ascii/slotted_disk.stl" // Use actual model.modelUrl in production
                  modelType={model.fileFormat?.toLowerCase() as 'stl' | 'obj' | 'gltf'}
                  className="h-full"
                />
              </div>
              
              {/* Model controls */}
              <div className="absolute top-4 right-4 flex space-x-2 z-20">
                <button className="bg-[--navy-default]/80 p-2 rounded-full text-[--gold-default] hover:bg-[--navy-default]">
                  <i className="ri-fullscreen-line"></i>
                </button>
                <button className="bg-[--navy-default]/80 p-2 rounded-full text-[--gold-default] hover:bg-[--navy-default]">
                  <i className="ri-restart-line"></i>
                </button>
              </div>
            </div>
            
            {/* Additional images/previews */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="aspect-square bg-[--navy-default] rounded border border-[--royal-default]/30 flex items-center justify-center hover:border-[--gold-default] cursor-pointer">
                  <i className="ri-image-line text-xl text-[--gold-default]/50"></i>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - Model details */}
          <div className="lg:w-5/12">
            <div className="bg-[--navy-light] p-6 rounded-lg gold-border shield-container">
              <h1 className="font-cinzel-decorative text-3xl font-bold mb-2 text-[--gold-default]">{model.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Link href={`/profile/${model.userId}`}>
                    <a className="flex items-center hover:text-[--gold-default]">
                      <div className="w-8 h-8 rounded-full bg-[--royal-default] overflow-hidden border border-[--gold-default]/20 mr-2">
                        <div className="w-full h-full bg-[--royal-dark] flex items-center justify-center">
                          <i className="ri-user-3-line text-[--gold-default]"></i>
                        </div>
                      </div>
                      <span className="text-sm">Creator Name</span>
                    </a>
                  </Link>
                </div>
                
                <span className="text-sm text-gray-400 flex items-center">
                  <i className="ri-eye-line mr-1"></i>
                  {model.views} views
                </span>
                
                <span className="text-sm text-gray-400 flex items-center">
                  <i className="ri-download-line mr-1"></i>
                  {model.downloads} downloads
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-[--royal-default] text-xs px-2 py-1 rounded-full text-white">
                  {model.fileFormat}
                </span>
                
                {model.printReady && (
                  <span className="bg-emerald-700/80 text-xs px-2 py-1 rounded-full text-white">
                    Print Ready
                  </span>
                )}
                
                {model.featured && (
                  <span className="bg-[--gold-default] text-xs px-2 py-1 rounded-full text-[--navy-default] font-semibold">
                    Featured
                  </span>
                )}
                
                {model.category && (
                  <span className="bg-[--royal-default] text-xs px-2 py-1 rounded-full text-white">
                    {model.category}
                  </span>
                )}
                
                {model.tags && model.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-[--navy-default] text-xs px-2 py-1 rounded-full text-gray-300 border border-[--royal-default]/30">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mb-6">
                <h2 className="font-cinzel text-xl font-bold mb-2 text-white">Description</h2>
                <p className="text-gray-300">
                  {model.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="mb-8 border-t border-[--royal-default]/30 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-cinzel text-xl font-bold text-white">Price</h2>
                  {model.price > 0 ? (
                    <span className="text-[--gold-default] text-2xl font-bold">
                      ${(model.price / 100).toFixed(2)} <span className="text-sm font-normal text-gray-400">USD</span>
                    </span>
                  ) : (
                    <span className="bg-emerald-700 text-white px-3 py-1 rounded-md font-bold">
                      Free
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <ShieldButton 
                    variant="secondary" 
                    size="lg"
                    leftIcon={<i className="ri-edit-line"></i>}
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "The model editor feature is coming soon.",
                      });
                    }}
                  >
                    Edit Model
                  </ShieldButton>
                  <ShieldButton 
                    size="lg"
                    leftIcon={<i className="ri-download-line"></i>}
                    onClick={downloadModel}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <span className="mr-2 inline-block w-4 h-4 border-2 border-[--navy-default] border-t-transparent rounded-full animate-spin"></span>
                        Downloading...
                      </>
                    ) : 'Download'}
                  </ShieldButton>
                </div>
              </div>
              
              <div className="border-t border-[--royal-default]/30 pt-4">
                <h2 className="font-cinzel text-lg font-bold mb-3 text-white">Model Details</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Format:</span>
                    <span className="ml-2 text-white">{model.fileFormat}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="ml-2 text-white">{new Date(model.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Print Ready:</span>
                    <span className="ml-2 text-white">{model.printReady ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">License:</span>
                    <span className="ml-2 text-white">Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar models section */}
        {/* <div className="mt-16">
          <h2 className="font-cinzel text-2xl font-bold mb-6">
            Similar <span className="text-[--gold-default]">Models</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="model-card bg-[--navy-default] rounded-lg overflow-hidden border border-[--royal-default]/30 hover:border-[--gold-default]/30">
                <div className="aspect-square relative overflow-hidden">
                  <div className="w-full h-full bg-[--navy-dark] grid-pattern flex items-center justify-center">
                    <i className="ri-sword-fill text-5xl text-[--gold-default]/30"></i>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[--navy-default]/90 via-transparent to-transparent"></div>
                  <h3 className="absolute bottom-3 left-3 right-3 font-cinzel font-bold text-white text-lg">
                    Similar Model {index + 1}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[--gold-default] font-bold">
                      $9.99 <span className="text-sm font-normal text-gray-400">USD</span>
                    </span>
                    <Link href={`/model/${index + 10}`}>
                      <ShieldButton variant="secondary" size="sm">View</ShieldButton>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ModelViewerPage;
