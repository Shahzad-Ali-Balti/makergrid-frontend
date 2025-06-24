
import { BoxesIcon, ImageIcon, PaintbrushIcon } from "lucide-react";
import { motion } from "motion/react"
import { Link, useLocation } from 'wouter';
import { useAuth } from "@/hooks/use-auth";
import ModelCard from "@/components/ModelCard";
import { getMockModels } from "@/lib/mock/mockData"
import { useQuery } from '@tanstack/react-query';
import { Model } from "@/types/modelTypes"



const CommunityPage: React.FC = () => {
    const [, setLocation] = useLocation();
    const { user } = useAuth()

    const { data: models, isLoading, error } = useQuery({
        queryKey: ['mock-models'],
        queryFn: getMockModels,
        staleTime: 60000,
    })

    return (
        <div className="px-5 py-4 pb-2">
            <div style={{ backgroundImage: `` }}
                className="h-80 bg-center bg-cover rounded-xl overflow-hidden">
                <div
                    className="flex flex-col items-center justify-center gap-4 bg-black/25 backdrop-blur-sm h-full w-full rounded-xl overflow-hidden">
                    <div
                        className='flex flex-col gap-1 justify-center items-center'>
                        <p className="text-white text-xl font-semibold">
                            Welcome {user?.username}
                        </p>
                        <p className="text-gray-300 text-sm">
                            How can makergrid help you today?
                        </p>
                    </div>
                    <motion.div
                        transition={{ duration: 0.75, ease: "anticipate" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            background: "linear-gradient(90deg, oklch(0.623 0.214 259.815) 0%, oklch(0.789 0.154 211.53) 100%)",
                            scale: 1,
                            opacity: 1
                        }}
                        whileHover={{ background: "linear-gradient(270deg, oklch(0.623 0.214 259.815) 0%, oklch(0.789 0.154 211.53) 100%)" }}
                        className='flex flex-col sm:flex-row rounded-xl px-1 lg:px-3 py-1'>
                        <button
                            onClick={() => setLocation('/create')}
                            className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-gray-200">
                            <BoxesIcon />
                            Text to 3D
                        </button>
                        {/*<Separator orientation="vertical"/>*/}
                        <button
                            onClick={() => setLocation('/create')}
                            className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-gray-200">
                            <ImageIcon />
                            Image to 3D
                        </button>
                        {/*<Separator orientation="vertical"/>*/}
                        <button
                            onClick={() => setLocation('/create')}
                            className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-gray-200">
                            <PaintbrushIcon />
                            AI Texturing
                        </button>
                    </motion.div>
                </div>
            </div>
            <h2 className="px-5 py-2 text-xl font-semibold">
                Community
            </h2>
            <div
                className='px-5 py-4 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 flex-wrap'>
                {models?.map((model: Model) => (
                    <ModelCard key={model.id} model={model} />
                ))}

            </div>
        </div>
    )
}

export default CommunityPage;