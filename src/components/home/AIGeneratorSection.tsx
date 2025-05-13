import React, { useState } from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';
import ThreeJsViewer from '@/components/ThreeJsViewer';
import { useToast } from '@/hooks/use-toast';
// import { generateModel, checkGenerationStatus } from '@/lib/makerAPI';
import ModelViewer from '../model-viewer';
import { LockKeyhole } from "lucide-react"


const AIGeneratorSection: React.FC = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [complexity, setComplexity] = useState('medium');
  const [optimizePrinting, setOptimizePrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  // const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>("/assets/model_5ze912.glb");
  // const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(!isModalOpen)
    console.log("openmodal", isModalOpen)
  }


  const handleGenerate = async () => {
    // if (!prompt.trim()) {
    //   toast({
    //     title: "Error",
    //     description: "Please enter a description for your model",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    // setIsGenerating(true);

    // try {
    //   // Start the generation process
    //   const { id } = await generateModel(
    //     prompt,
    //     style,
    //     complexity,
    //     optimizePrinting
    //   );

    //   toast({
    //     title: "Generation Started",
    //     description: "Your 3D model is being generated. This may take a few moments.",
    //   });

    //   // Poll for completion
    //   const checkInterval = setInterval(async () => {
    //     try {
    //       const status = await checkGenerationStatus(id);

    //       if (status.status === 'completed' && status.generatedModelId) {
    //         clearInterval(checkInterval);
    //         setIsGenerating(false);

    //         // In a real app, we would fetch the actual model URL
    //         setGeneratedModelUrl("https://threejs.org/examples/models/stl/ascii/slotted_disk.stl");

    //         toast({
    //           title: "Model Generated",
    //           description: "Your 3D model has been successfully created!",
    //           variant: "default"
    //         });
    //       } else if (status.status === 'failed') {
    //         clearInterval(checkInterval);
    //         setIsGenerating(false);

    //         toast({
    //           title: "Generation Failed",
    //           description: "There was an error generating your model. Please try again.",
    //           variant: "destructive"
    //         });
    //       }
    //     } catch (error) {
    //       console.error('Error checking generation status:', error);
    //     }
    //   }, 2000);

    //   // Cleanup interval after 2 minutes if not cleared already
    //   setTimeout(() => {
    //     clearInterval(checkInterval);
    //     if (isGenerating) {
    //       setIsGenerating(false);
    //       toast({
    //         title: "Generation Timeout",
    //         description: "The model generation is taking longer than expected. Check back later.",
    //         variant: "destructive"
    //       });
    //     }
    //   }, 120000);

    // } catch (error) {
    //   console.error('Error generating model:', error);
    //   setIsGenerating(false);
    //   toast({
    //     title: "Error",
    //     description: "Failed to generate model. Please try again.",
    //     variant: "destructive"
    //   });
    // }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="bg-[--navy-light] p-6 rounded-lg gold-border shield-container">
              <h3 className="font-cinzel text-2xl font-bold mb-4 text-[--gold-default]">AI-Powered Model Generator</h3>
              <p className="mb-6 text-gray-300">Describe what you want to create, and our AI will generate a 3D model for you to refine and customize.</p>

              {/* Input form */}
              <form className="mb-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                <div className="mb-4">
                  <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-200">Your Description</label>
                  <textarea
                    id="prompt"
                    rows={3}
                    className="w-full p-3 bg-[--navy-default] border border-[--royal-default] rounded-md focus:outline-none focus:ring-2 focus:ring-[--gold-default]/50 text-white"
                    placeholder="A medieval castle with tall towers and a moat..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    </select>
                  </div>
                  <div>
                    <label htmlFor="complexity" className="block mb-2 text-sm font-medium text-gray-200">Complexity</label>
                    <select
                      id="complexity"
                      className="w-full p-3 bg-[--navy-default] border border-[--royal-default] rounded-md focus:outline-none focus:ring-2 focus:ring-[--gold-default]/50 text-white"
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                      disabled={isGenerating}
                    >
                      <option value="simple">Simple</option>
                      <option value="medium">Medium</option>
                      <option value="complex">Complex</option>
                      <option value="very-complex">Very Complex</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="optimize-printing"
                      className="mr-2 accent-[--gold-default] w-4 h-4"
                      checked={optimizePrinting}
                      onChange={(e) => setOptimizePrinting(e.target.checked)}
                      disabled={isGenerating}
                    />
                    <label htmlFor="optimize-printing" className="text-sm text-gray-200">Optimize for 3D printing</label>
                  </div>
                  <ShieldButton

                    variant="secondary"
                    onClick={() => {
                      console.log('clicked!')
                      openModal()
                    }}
                  >
                    <p className="pr-2">Generate Model</p>
                    <LockKeyhole className='text-[--gold-default]' />
                  </ShieldButton>

                </div>
              </form>
              {isModalOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40 bg-black/50" onClick={openModal}></div>

                  {/* Modal Content */}
                  <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[--navy-default] p-6 shadow-lg text-white">

                    {/* Close (X) Button */}
                    <p
                      onClick={openModal}
                      className="absolute right-4 top-4 cursor-pointer text-xl font-bold text-[--gold-default] hover:text-[--gold-light] transition-colors"
                    >
                      ×
                    </p>

                    {/* Modal Content */}
                    <h2 className="text-lg font-cinzel mb-6 text-center">
                      Please sign in to your account to access MakerGrid’s features.
                    </h2>

                    <div className="flex justify-center">
                      <ShieldButton variant="secondary" onClick={() => window.location.href = '/login'}>
                        Login
                      </ShieldButton>
                    </div>

                  </div>
                </>
              )}



              <div className="flex items-center justify-between text-sm text-gray-400 border-t border-[--royal-default] pt-4">
                <span>Generation credits: 15/20 remaining</span>
                <Link href="/pricing">
                  <a className="text-[--gold-default] hover:underline">Upgrade for unlimited</a>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            {/* 3D viewer for generated model */}
            <div className="aspect-square lg:aspect-auto lg:h-[500px] bg-[--navy-dark] rounded-lg overflow-hidden relative grid-pattern">
              {/* <ThreeJsViewer
                modelUrl={generatedModelUrl || undefined}
                className="h-full"
              /> */}
              <ModelViewer
                height="h-full"
                modelUrl={generatedModelUrl || undefined}

              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIGeneratorSection;
