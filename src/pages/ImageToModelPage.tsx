import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ShieldButton from '@/components/ShieldButton';
import ThreeJsViewer from '@/components/ThreeJsViewer';
import { generateImageToModel, checkImageTaskStatus } from '@/lib/makerAPI';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ModelViewer from '@/components/model-viewer';
import { generateModel, checkTaskStatus } from '@/lib/makerAPI';

import { fetcher } from "@/lib/fetcher"
import { Generation } from '@/types/GenerationType';
import { BACKEND_PUBLIC_URL } from '@/lib/mock/env';
import { getMockGen } from '@/lib/mock/MockGen';
import { fetchAssets } from "@/utils/apiCalls/fetchassets"
import axiosInstance from '@/lib/axiosInstance'; // your axios instance
import { useAuth } from "@/hooks/use-auth";

// import promptImagePlaceholder from "../public/assets/placeholder 1.png"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"


const ImageToModelPage: React.FC = () => {
  const { toast } = useToast();
  const { creditsCount ,credits,totalCredits } = useAuth();
  

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const baseURL = BACKEND_PUBLIC_URL || 'http://localhost:8000'; // Fallback to local URL if not set

  // Fetch previous generations for the user
  // const { data: userGenerations=[], isLoading: loadingGenerations } = useQuery<Generation[]>({
  //   queryKey: ['/api/users/1/generations'], // Default user ID for demo
  //   queryFn: () => fetcher<Generation[]>('/api/users/1/generations'),
  //   staleTime: 60000, // 1 minute
  // });

  // const { data: userGenerations=[], isLoading: loadingGenerations } = useQuery<Generation[]>({
  //   queryKey: ['mock-models'],
  //   queryFn: getMockGen,
  //   staleTime: 60000,
  // });

  const promptImagePlaceholder = "/assets/placeholder_1.png"
  const page = 1; // First page
  const pageSize = 10; // Default page size


  const { data: userGenerations = [], isLoading: loadingGenerations, isError } = useQuery({
    queryKey: ['assets', page, pageSize, generatedModelUrl],
    queryFn: () => fetchAssets(page, pageSize),
    staleTime: 60000,
  });

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    setIsGenerating(true);
    setGeneratedModelUrl(null);

    try {


      // Trigger the model generation and get the task ID
      const data = await generateImageToModel(selectedFile);
      const taskId = data.task_id;  // Get task ID from response

      // Polling loop for task status
      const pollTaskStatus = async () => {
        try {
          // Poll the task status using the task ID
          const statusData = await checkImageTaskStatus(taskId);

          // Check the status of the task
          const status = statusData.status;

          if (status === 'completed') {
            // Task succeeded, show the model output and stop polling
            // Extract model path and create the full URL
            const modelPath = statusData.stored_path; // This is the model path from the response
            const modelFileUrl = `${baseURL}/media/${modelPath}`; // Assuming `baseURL` is the base URL for your server

            // Extracting additional fields like preview image URL, color video, gaussian ply, if available
            const previewImageUrl = statusData.preview_image_url;
            const colorVideo = statusData.color_video;
            const gaussianPly = statusData.gaussian_ply;

            // Update the generated model URL with the model path
            setGeneratedModelUrl(modelFileUrl);
            creditsCount()
            // Log or store other URLs (preview image, color video, gaussian ply) if needed
            console.log("Preview Image URL:", previewImageUrl);
            console.log("Color Video URL:", colorVideo);
            console.log("Gaussian PLY URL:", gaussianPly);

            // Show a success toast message
            toast({
              title: "Success",
              description: "Model generation completed successfully!",
              // variant: "success",  // Use variant: "success" for success styling
            });

            // Stop the generating state
            setIsGenerating(false);
          } else if (status === 'failed') {
            // Task failed, show an error and stop polling
            toast({
              title: "Error",
              description: "Model generation failed. Please try again.",
              variant: "destructive",
            });

            // Stop the generating state
            setIsGenerating(false);
          } else if (status === 'starting' || status === 'processing') {
            // Task is still processing, continue polling
            setTimeout(pollTaskStatus, 10000); // Wait for 10 seconds before polling again
          } else {
            // Unexpected status
            toast({
              title: "Error",
              description: "Unexpected task status. Please try again.",
              variant: "destructive",
            });
            setIsGenerating(false);
          }
        } catch (error) {
          console.error("Error checking task status:", error);
          setIsGenerating(false);
          toast({
            title: "Error",
            description: "Failed to check task status. Please try again.",
            variant: "destructive",
          });
        }
      };



      // Start polling the task status
      pollTaskStatus();

    } catch (error) {
      console.error("Error generating model:", error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate model. Please try again.",
        variant: "destructive",
      });
    }
  };




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) setPreviewURL(URL.createObjectURL(file));
  };


  return (
    <>
      <div className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-cinzel-decorative text-4xl font-bold mb-4">
              <span className="text-[--gold-default]">AI-Powered</span> Model Generator
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300">
              Upload your image and our AI will generate a 3D model for you to refine and customize.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/2 order-1 lg:order-none">
              <div className="bg-[--navy-light] p-6 rounded-lg gold-border shield-container">
                <h2 className="font-cinzel text-2xl font-bold mb-4 text-[--gold-default]">Image To Model</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-[--navy-dark] text-[--gold-default] border border-gray-600 p-2 rounded mb-4"
                />
                <div className="w-full h-[250px] border border-gray-600 rounded bg-[#1c2d4f] flex items-center justify-center mb-4 overflow-hidden">
                  {previewURL ? (
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={promptImagePlaceholder}
                      alt="Placeholder"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-400 flex items-center">
                    <i className="ri-coins-line text-[--gold-default] mr-2"></i>
                    Generation credits: <span className="font-bold ml-1 mr-1 text-[--gold-default]">{credits}/{totalCredits}</span> remaining
                    <Link href="/pricing" className="ml-2 text-[--gold-default] hover:underline">
                      <a>Upgrade for unlimited</a>
                    </Link>
                  </div>
                  <ShieldButton
                    type="submit"
                    disabled={isGenerating}
                    size="lg"
                    variant="secondary"
                  >
                    {isGenerating ? (
                      <>Generating 3D Model</>
                    ) : <div onClick={handleGenerate}>Generate 3D Model</div>}
                  </ShieldButton>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 order-2 lg:order-none lg:sticky lg:top-24">
              <div className="h-[480px] w-full bg-[--navy-dark] rounded-lg overflow-hidden relative grid-pattern gold-border flex items-stretch">
                {(!isGenerating && !generatedModelUrl) ? (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-[--navy-dark]/70">
                    <div className="text-center max-w-md px-4">
                      <div className="w-20 h-20 mx-auto bg-[--royal-default]/30 rounded-full flex items-center justify-center mb-4 border border-[--gold-default]/20">
                        <i className="ri-sword-fill text-4xl text-[--gold-default]/70"></i>
                      </div>
                      <h3 className="font-cinzel text-xl text-[--gold-default] mb-2">Ready to Forge</h3>
                      <p className="text-gray-300">
                        Provide your image and watch as AI transforms your image into a 3D masterpiece.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ModelViewer
                    modelUrl={generatedModelUrl || undefined}
                    className="h-full w-full border"
                    isPage={true}
                  />
                )}

                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[--navy-dark]/80">
                    <div className="w-24 h-24 border-4 border-[--gold-default]/20 border-t-[--gold-default] rounded-full animate-spin mb-6"></div>
                    <h3 className="font-cinzel text-xl text-[--gold-default] mb-2">Forging Your Model</h3>
                    <p className="text-center max-w-md px-6 text-gray-300">
                      Our AI is hard at work creating your 3D model. This may take a few moments depending on complexity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[--navy-light] p-6 rounded-lg gold-border shield-container">
            <h2 className="font-cinzel text-xl font-bold mb-4 text-[--gold-default]">Your Recent Generations</h2>
            {loadingGenerations ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[--gold-default] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userGenerations && userGenerations.length > 0 ? (
              <div className="space-y-3">
                {userGenerations.slice(0, 3).map((gen: any) => (
                  <div key={gen.id} className="bg-[--navy-default] p-3 rounded-md border border-[--royal-default]/30 hover:border-[--gold-default]/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white line-clamp-1">{gen.prompt?.substring(0, 40) || ""}...</p>
                        <p className="text-xs text-gray-400 mt-1">Style: {gen.style} • Complexity: {gen.complexity}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-700/80 text-white">
                        completed
                      </span>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Link href={`/model/${gen.id}`}>
                        <ShieldButton variant="secondary" size="sm">View Model</ShieldButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[--royal-default]/50 mx-auto flex items-center justify-center mb-3">
                  <i className="ri-history-line text-2xl text-[--gold-default]/70"></i>
                </div>
                <p className="text-gray-300">You haven't generated any models yet.</p>
                <p className="text-sm text-gray-400 mt-1">Your generations will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default ImageToModelPage;
