
import { BoxesIcon, ImageIcon, PaintbrushIcon } from "lucide-react";
import { useState } from "react"
import { motion } from "motion/react"
import { Link, useLocation } from 'wouter';
import { useAuth } from "@/hooks/use-auth";
import ModelCard from "@/components/ModelCard";
import { getMockModels } from "@/lib/mock/mockData"
import { useQuery } from '@tanstack/react-query';
import { Model } from "@/types/modelTypes"
import { fetchAssets } from "@/utils/apiCalls/fetchassets"
import ShieldButton from '@/components/ShieldButton';
import ModelViewerMini from '@/components/model-viewer-mini';
import { BACKEND_PUBLIC_URL } from '@/lib/mock/env';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselDot
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"


const DashboardPage: React.FC = () => {
    const [, setLocation] = useLocation();
    // const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
    const { user } = useAuth()
    const [page, setPage] = useState(1)
    const pageSize = 4

    const { data: models, isLoading, error } = useQuery({
        queryKey: ['mock-models'],
        queryFn: getMockModels,
        staleTime: 60000,
    })

    const { data: userGenerations = [], isLoading: loadingGenerations, isError } = useQuery({
        queryKey: ['assets', page, pageSize],
        queryFn: () => fetchAssets(page, pageSize),
        staleTime: 60000,
    });


    return (
        <div className="px-5 py-4 pb-2">
            <div style={{ backgroundImage: `` }}
                className="h-80 bg-center bg-cover rounded-xl overflow-hidden">
                <div
                    className="font-cinzel flex flex-col items-center justify-center gap-4 bg-black/25 backdrop-blur-sm h-full w-full rounded-xl overflow-hidden">
                    <div
                        className='flex flex-col gap-1 justify-center items-center'>
                        <p className="text-white text-xl font-semibold">
                            Welcome <span className="text-[--gold-default]">{user?.username}</span>
                        </p>
                        <p className="text-gray-300 text-sm">
                            How can <span className="text-[--gold-default]">makergrid</span> help you today?
                        </p>
                    </div>
                    <motion.div
                        transition={{
                            duration: 0.75,
                            ease: "anticipate",
                            background: { duration: 0.4 },
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        whileHover={{
                            background: "linear-gradient(90deg, var(--royal-dark) 0%, var(--royal-light) 100%)",
                        }}
                        className="flex flex-col sm:flex-row rounded-xl px-1 lg:px-3 py-1 bg-gradient-to-r from-[--navy-light] to-[--royal-light]"
                    >


                        <Link
                            href="/create"
                            className="flex flex-col items-center justify-center gap-2 px-4 py-2 hover:text-[--gold-default] hover:rounded hover:bg-[rgba(255,215,0,0.08)]">
                            <BoxesIcon className="" />
                            <span className="">Text to 3D</span>
                        </Link>
                        {/*<Separator orientation="vertical"/>*/}
                        <Link
                            href="/image-to-model"
                            className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-gray-200 hover:text-[--gold-default] hover:rounded hover:bg-[rgba(255,215,0,0.08)]">
                            <ImageIcon />
                            Image to 3D
                        </Link>
                        {/*<Separator orientation="vertical"/>*/}
                        {/* <Link
                            href="/create"
                            className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-gray-200 hover:text-[--gold-default] hover:rounded hover:bg-[rgba(255,215,0,0.08)]">
                            <PaintbrushIcon />
                            AI Texturing
                        </Link> */}
                    </motion.div>
                </div>
            </div>
            <h2 className="font-cinzel px-5 py-2 text-xl font-semibold">
                All Assets
            </h2>
            <div className="text-center px-5 py-4 pt-2 border border-[--gold-default] rounded min-h-[120px]">
                {loadingGenerations ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-[--gold-default] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : userGenerations.length > 0 ? (
                    <>
                        <div className="relative w-full px-6 py-4">
                            <Carousel
                                opts={{
                                    align: 'start',
                                    dragFree: true,
                                    watchDrag: false,
                                  }}
                                className="w-full select-none"
                            >
                                <CarouselContent>
                                    {userGenerations.map((gen: any) => (
                                        <CarouselItem
                                            key={gen.id}
                                            className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                        >
                                            <div className="bg-[--navy-default] p-4 rounded-md border border-[--gold-default] hover:shadow-lg transition-all min-w-[200px] h-full flex flex-col justify-between">
                                                <ModelViewerMini
                                                    modelUrl={`${BACKEND_PUBLIC_URL}${gen.model_file || ""}`}
                                                    className="w-full h-40"
                                                    isPage={true}
                                                />
                                                {gen.prompt ? (
                                                    <div className="flex justify-between items-start mt-4">
                                                        <div>
                                                            <p className="font-medium text-white line-clamp-1">
                                                                {gen.prompt?.substring(0, 40) || "..."}...
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Style: {gen.style} • Complexity: {gen.complexity}
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-end mt-2">
                                                            <Link href={`/model/${gen.id}`}>
                                                                <ShieldButton variant="secondary" size="sm">
                                                                    View Model
                                                                </ShieldButton>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end mt-2">
                                                        <Link href={`/model/${gen.id}`}>
                                                            <ShieldButton variant="secondary" size="sm">
                                                                View Model
                                                            </ShieldButton>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>


                            {/* Pagination */}
                            <div className="flex justify-center items-center mt-6 gap-4">
                                <ShieldButton
                                    variant="secondary"
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                >
                                    Prev Page
                                </ShieldButton>
                                <ShieldButton
                                    variant="secondary"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={userGenerations.length < pageSize}
                                >
                                    Next Page
                                </ShieldButton>
                            </div>
                        </div>
                    </>
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
    )
}

export default DashboardPage;