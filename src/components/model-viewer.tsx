"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import {
  Bounds,
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  useGLTF
} from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { Leva, useControls } from "leva"
import { cn } from "@/lib/utils"
import * as THREE from "three"
import {
  downloadSTL,
  downloadGLB,
  getGLBFilename,
  getSTLFilename,
} from "@/lib/downloadSTL"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"

interface ThreeJsViewerProps {
  modelUrl?: string
  className?: string
  showControls?: boolean
  height?: string
  isPage?: boolean
  onError?: (error: any) => void;
}

function getModelTypeFromUrl(url: string): "gltf" | "obj" | "stl" | "glb" {
  const ext = url.split(".").pop()?.toLowerCase()
  if (ext === "gltf" || ext === "glb") return "gltf"
  if (ext === "obj") return "obj"
  if (ext === "stl") return "stl"
  if (ext === "glb") return "glb"
  return "gltf"
}

const isDraggingRef = { current: false }

function Model({
  modelPath,
  onLoad,
}: {
  modelPath: string
  onLoad: (model: THREE.Object3D) => void
}) {
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    if (scene) {
      onLoad(scene)
    }
  }, [scene, onLoad])

  return <primitive object={scene} />
}

// function Model({
//   modelUrl,
//   modelType,
//   onLoad,
// }: {
//   modelUrl: string
//   modelType: "gltf" | "obj" | "stl" | "glb"
//   onLoad: (model: THREE.Object3D) => void
// }) {
//   const [model, setModel] = useState<THREE.Object3D | null>(null)
//   const modelRef = useRef<THREE.Object3D>(null)

//   useFrame(() => {
//     if (modelRef.current && isDraggingRef.current) {
//       modelRef.current.rotation.y += 0.01
//     }
//   })

//   useEffect(() => {
//     let isMounted = true
//     const load = async () => {
//       try {
//         let loaded: THREE.Object3D | null = null

//         if (modelType === "gltf") {
//           const gltf = await new GLTFLoader().loadAsync(modelUrl)
//           loaded = gltf.scene
//         } else if (modelType === "obj") {
//           loaded = await new OBJLoader().loadAsync(modelUrl)
//         } else if (modelType === "stl") {
//           const geometry = await new STLLoader().loadAsync(modelUrl)
//           const material = new THREE.MeshStandardMaterial({
//             color: 0xD4AF37,
//             metalness: 0.8,
//             roughness: 0.2,
//           })
//           loaded = new THREE.Mesh(geometry, material)
//         }else if (modelType === "glb"){
//           const {scene} = useGLTF(modelUrl)

//         }

//         if (loaded && isMounted) {
//           onLoad(loaded)
//           setModel(loaded)
//         }
//       } catch (err) {
//         console.error("Error loading model:", err)

//       }
//     }

//     load()
//     return () => {
//       isMounted = false
//     }
//   }, [modelUrl, modelType, onLoad])

//   if (!model) return null
//   return <primitive ref={modelRef} object={model} />
// }

export default function ModelViewer({
  modelUrl,
  className = "",
  showControls = true,
  isPage = false,
  height = "h-full",
  onError
}: ThreeJsViewerProps) {
  const [showGrid, setShowGrid] = useState(false)
  const [loadedModel, setLoadedModel] = useState<THREE.Object3D | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // const cameraRef = useRef<THREE.Camera | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null)


  const { bgColor, intensity, showShadow } = useControls({
    bgColor: { value: "#0xD4AF37" },
    intensity: { value: 1.2, min: 0, max: 3, step: 0.1 },
    showShadow: true,
  })
  useEffect(() => {
    if (!modelUrl) return;

    const checkUrl = async () => {
      try {
        const res = await fetch(modelUrl, { method: 'HEAD' });
        if (!res.ok) throw new Error("Model file not found");
      } catch (err) {
        setIsLoading(false)
        setError("Failed to fetch model file.");
      }
    };

    checkUrl();
  }, [modelUrl]);


  useEffect(() => {
    if (modelUrl) {
      setIsLoading(true)
      setError(null)
    }
  }, [modelUrl])

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z -= 0.5;
      controlsRef.current?.update();  // 👈 important: sync controls after move
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z += 0.5;
      controlsRef.current?.update();
    }
  };

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 3, 10);
      controlsRef.current?.update();
    }
  };

  



  return (
    <div className={cn("w-full h-full rounded-lg relative overflow-hidden", height)}>
      {/* UI States */}
      {!modelUrl && !isLoading && !isPage && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-auto">
          <div className="w-20 h-20 rounded-full bg-[--royal-default] flex items-center justify-center mb-4 border border-[--gold-default]/30">
            <i className="ri-cube-line text-4xl text-[--gold-default]"></i>
          </div>
          <h4 className="font-cinzel text-xl font-bold text-[--gold-default] mb-2">Your Model Will Appear Here</h4>
          <p className="text-gray-300 max-w-md mx-auto">Generate or select a model to view it in 3D.</p>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-navy-dark pointer-events-auto">
          <div className="w-16 h-16 border-4 border-gold-light border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-dark/80 z-10 pointer-events-auto">
          <div className="text-center max-w-xs mx-auto p-4">
            <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-fill text-3xl text-red-500"></i>
            </div>
            <h4 className="font-cinzel text-lg font-bold text-white mb-2">Error Loading Model</h4>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      )}

      {modelUrl && (
        <>
          {/* <Canvas
            camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
            style={{ background: bgColor, pointerEvents: "none" }}
            shadows
            onCreated={({ camera }) => {
              cameraRef.current = camera
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={intensity} castShadow />
              {showShadow && <ContactShadows opacity={0.4} blur={1} scale={10} />}

              <Bounds fit clip observe margin={1.5}>
                <Model
                  modelUrl={modelUrl}
                  modelType={getModelTypeFromUrl(modelUrl)}
                  onLoad={(model) => {
                    setLoadedModel(model)
                    setIsLoading(false)
                  }}

                />
              </Bounds>

              <OrbitControls
                makeDefault
                enableZoom
                enablePan
                enableRotate
                enableDamping
                dampingFactor={0.05}
                minDistance={1}
                maxDistance={20}
                ref={controlsRef}
                onStart={() => (isDraggingRef.current = true)}
                onEnd={() => (isDraggingRef.current = false)}
              />

              {showGrid && <Grid args={[100, 100]} position={[0, 0, 0]} cellColor="white" />}
              <Environment preset="studio" />
            </Suspense>
          </Canvas> */}
          <Leva hidden collapsed />
          <Canvas
            camera={{ position: [0, 3, 10], fov: 50, near: 0.1, far: 100 }}
            style={{ width: "100%", height: "100%", background: bgColor }}
            shadows
            onCreated={({ camera }) => {
              cameraRef.current = camera as THREE.PerspectiveCamera; // 👈 force tell TypeScript it's a PerspectiveCamera
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={intensity}
                castShadow
              />

              {showShadow && <ContactShadows opacity={0.4} blur={1} scale={10} />}

              {/* Automatically adjust camera to fit model */}
              <Bounds fit clip observe margin={1.5}>
                <Model modelPath={modelUrl} onLoad={(model) => {
                  setLoadedModel(model);
                  setIsLoading(false);
                }} />
              </Bounds>

              <OrbitControls
                makeDefault
                enableZoom={true}
                enablePan={true}
                minDistance={1}
                maxDistance={20}
                dampingFactor={0.05}
                ref={controlsRef}
              />

              {showGrid && (
                <Grid args={[100, 100]} position={[0, 0, 0]} cellColor="white" />
              )}
              <Environment files="/assets/hdr/venice_sunset_1k.hdr" background={false} />
            </Suspense>
          </Canvas>
          {loadedModel && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 p-2 rounded-md shadow-md pointer-events-auto">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className="px-3 py-1 text-sm font-medium bg-gray-800 text-white rounded"
              >
                {showGrid ? "Hide Grid" : "Show Grid"}
              </button>
              <button
                onClick={() => loadedModel ? downloadSTL(loadedModel, getSTLFilename()) : alert("Model not loaded yet.")}
                className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded"
              >
                Download STL
              </button>
              <button
                onClick={() => loadedModel && modelUrl ? downloadGLB(modelUrl, getGLBFilename()) : alert("Model not loaded yet.")}
                className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded"
              >
                Download GLB
              </button>
            </div>
          )}

        </>
      )}

      {showControls && modelUrl && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-[--navy-default]/80 backdrop-blur-sm rounded-full px-2 py-1 border border-[--gold-default]/20 z-30 scene-controls pointer-events-auto">
          <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full" onClick={resetView}>
            <i className="ri-focus-3-line"></i>
          </button>
          <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
            <i className="ri-drag-move-line"></i>
          </button>
          <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full" onClick={zoomIn}>
            <i className="ri-zoom-in-line"></i>
          </button>
          <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full" onClick={zoomOut}>
            <i className="ri-zoom-out-line"></i>
          </button>
          <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full" onClick={resetView}>
            <i className="ri-refresh-line"></i>
          </button>
        </div>
      )}

      {showControls && <Leva hidden collapsed />}
    </div>
  )
}