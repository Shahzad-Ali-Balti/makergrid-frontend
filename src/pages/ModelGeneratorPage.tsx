import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ShieldButton from '@/components/ShieldButton';
import ThreeJsViewer from '@/components/ThreeJsViewer';
import { generateModel, checkTaskStatus } from '@/lib/makerAPI';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ModelViewer from '@/components/model-viewer';
import { fetcher } from "@/lib/fetcher"
import { Generation } from '@/types/GenerationType';
import { BACKEND_PUBLIC_URL } from '@/lib/mock/env';
import { getMockGen } from '@/lib/mock/MockGen';
import { fetchAssets } from "@/utils/apiCalls/fetchassets"
import { useAuth } from "@/hooks/use-auth";


const ModelGeneratorPage: React.FC = () => {
  const { toast } = useToast();
  const { creditsCount ,credits,totalCredits } = useAuth();
  
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [complexity, setComplexity] = useState('Very Complex');
  const [optimizePrinting, setOptimizePrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const[upgradedPlan,setUpgradedPlan] = useState(false)
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const baseURL = BACKEND_PUBLIC_URL || 'http://localhost:8000'; // Fallback to local URL if not set
  // const [totalCredits, setTotalCredits] = useState<string | number>('0'); // State to hold total credits

  const page = 1; // First page
  const pageSize = 10; // Default page size

  // if (credits === "Unlimited") {
  //   setTotalCredits("unlimited")
  // }else {
  //   setTotalCredits('500')
  //  } // Convert

  useEffect(()=>{
    if (totalCredits === 'Unlimited'){
      setUpgradedPlan(true)
    }
  })
  const { data: userGenerations = [], isLoading: loadingGenerations, isError } = useQuery({
    queryKey: ['assets', page, pageSize, generatedModelUrl],
    queryFn: () => fetchAssets(page, pageSize),
    staleTime: 60000,
  });




  // Generate the model, triggers the Celery task
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your model",
        variant: "destructive",
      });
      return;
    }

    if (prompt.length > 1000) {
      toast({
        title: "Error",
        description: "Prompt must be less than 1000 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedModelUrl(null);

    try {
      // Trigger the model generation and get the task ID
      const data = await generateModel(prompt, style, complexity, optimizePrinting);
      const taskId = data.task_id;  // Get task ID from response

      // Polling loop for task status
      const pollTaskStatus = async () => {
        try {
          // Poll the task status using the task ID
          const statusData = await checkTaskStatus(taskId, prompt, style, complexity, optimizePrinting);

          // Check the status of the task
          const status = statusData.status;

          if (status === 'completed') {
            // Task succeeded, show the model output and stop polling
            // Extract model path and create the full URL
            const modelPath = statusData.stored_path; // This is the model path from the response
            console.log("Model Path:", modelPath);
            const modelFileUrl = `${baseURL}/media/${modelPath}`; // Assuming `baseURL` is the base URL for your server

            // Extracting additional fields like preview image URL, color video, gaussian ply, if available
            const previewImageUrl = statusData.preview_image_url;
            const colorVideo = statusData.color_video;
            const gaussianPly = statusData.gaussian_ply;

            // Update the generated model URL with the model path
            setGeneratedModelUrl(modelFileUrl);

            // Log or store other URLs (preview image, color video, gaussian ply) if needed
            // console.log("Preview Image URL:", previewImageUrl);
            // console.log("Color Video URL:", colorVideo);
            // console.log("Gaussian PLY URL:", gaussianPly);


            creditsCount()
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


  return (
    <div className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-cinzel-decorative text-4xl font-bold mb-4">
            <span className="text-[--gold-default]">AI-Powered</span> Model Generator
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300">
            Describe what you want to create, and our AI will generate a 3D model for you to refine and customize.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="w-full lg:w-1/2 order-1 lg:order-none">
            <div className="bg-[--navy-light] p-6 rounded-lg gold-border shield-container">
              <h2 className="font-cinzel text-2xl font-bold mb-4 text-[--gold-default]">Create Your Model</h2>
              <form className="mb-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                <div className="mb-6">
                  <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-200">Your Description</label>
                  <textarea
                    id="prompt"
                    rows={5}
                    className="w-full p-3 bg-[--navy-default] border border-[--royal-default] rounded-md focus:outline-none focus:ring-2 focus:ring-[--gold-default]/50 text-white"
                    placeholder="Describe your model in detail. For example: A medieval castle with tall towers, stone walls, a moat with a drawbridge, and small windows for archers. Include defensive walls and battlements."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="style" className="block mb-2 text-sm font-medium text-gray-200">Style</label>
                    <select
                      id="style"
                      className="w-full p-3 bg-[--navy-default] border border-[--royal-default] rounded-md focus:outline-none focus:ring-2 focus:ring-[--gold-default]/50 text-white"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      disabled={isGenerating}
                    >
                      <option value="realistic">Realistic</option>
                      <option value="stylized">Stylized</option>
                      <option value="low-poly">Low-Poly</option>
                      <option value="sci-fi">Sci-Fi</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="miniature">Miniature/Tabletop</option>
                      <option value="cartoon">Cartoon</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-400">Select a style that matches your vision for the model</p>
                  </div>
                </div>

                <div className="mb-8 bg-[--navy-default] p-4 rounded-md border border-[--royal-default]/50">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="optimize-printing"
                      className="mr-2 accent-[--gold-default] w-4 h-4"
                      checked={optimizePrinting}
                      onChange={(e) => setOptimizePrinting(e.target.checked)}
                      disabled={isGenerating}
                    />
                    <label htmlFor="optimize-printing" className="text-sm text-gray-200 font-medium">Optimize for 3D printing</label>
                  </div>
                  <p className="text-xs text-gray-400">
                    This will ensure your model has proper wall thickness, no non-manifold edges,
                    and is suitable for slicing and printing on standard 3D printers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-400 flex items-center">
                    <i className="ri-coins-line text-[--gold-default] mr-2"></i>
                    Generation credits: <span className="font-bold ml-1 mr-1 text-[--gold-default]">{credits}/{totalCredits}</span> remaining
                    {!upgradedPlan && (
                      <Link href="/pricing" className="ml-2 text-[--gold-default] hover:underline">
                      <a>Upgrade for unlimited</a>
                    </Link>
                    )}
                    
                  </div>
                  <ShieldButton
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    size="lg"
                    variant="secondary"
                  >
                    {isGenerating ? (
                      <>Generating 3D Model</>
                    ) : 'Generate 3D Model'}
                  </ShieldButton>
                </div>
              </form>

              <div className="border-t border-[--royal-default]/50 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-cinzel text-lg font-bold text-[--gold-default]">Generation Tips</h3>
                  <Link href="/tutorials/generation-tips">
                    <a className="text-sm text-[--gold-default] hover:underline">Learn more</a>
                  </Link>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-[--gold-default] mr-2 mt-0.5"></i>
                    <span>Be specific about dimensions, scale, and details</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-[--gold-default] mr-2 mt-0.5"></i>
                    <span>Include references to materials (stone, wood, metal, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-[--gold-default] mr-2 mt-0.5"></i>
                    <span>Mention if the model should be hollow or solid</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 order-2 lg:order-none lg:sticky lg:top-24">
            <div className="aspect-square sm:aspect-auto lg:aspect-auto lg:h-[600px] bg-[--navy-dark] rounded-lg overflow-hidden relative grid-pattern gold-border">
              <ModelViewer
                modelUrl={generatedModelUrl || undefined}
                className="h-full"
                isPage={true}
              />

              {!isGenerating && !generatedModelUrl && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-[--navy-dark]/70">
                  <div className="text-center max-w-md px-4">
                    <div className="w-20 h-20 mx-auto bg-[--royal-default]/30 rounded-full flex items-center justify-center mb-4 border border-[--gold-default]/20">
                      <i className="ri-sword-fill text-4xl text-[--gold-default]/70"></i>
                    </div>
                    <h3 className="font-cinzel text-xl text-[--gold-default] mb-2">Ready to Forge</h3>
                    <p className="text-gray-300">
                      Describe your model in detail using the form on the left, and watch as AI transforms your words into a 3D masterpiece.
                    </p>
                  </div>
                </div>
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

  );
};

export default ModelGeneratorPage;
