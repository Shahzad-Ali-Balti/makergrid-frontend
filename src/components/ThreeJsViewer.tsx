import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface ThreeJsViewerProps {
  modelUrl?: string;
  modelType?: 'gltf' | 'obj' | 'stl';
  className?: string;
  showControls?: boolean;
}

const ThreeJsViewer: React.FC<ThreeJsViewerProps> = ({
  modelUrl,
  modelType = 'stl',
  className = '',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(); // Navy dark
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xD4AF37, 0.3); // Gold color for backlight
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);
    
    // Setup grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0xD4AF37, 0x1C3766);
    scene.add(gridHelper);
    
    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
      
      rendererRef.current?.dispose();
    };
  }, []);
  
  // Load model when URL changes
  useEffect(() => {
    if (!modelUrl || !sceneRef.current) {
      // No model to load, show placeholder
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Remove previous model if exists
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Load model based on type
    const loadModel = async () => {
      try {
        let object: THREE.Object3D | THREE.Group;
        
        switch (modelType) {
          case 'gltf': {
            const loader = new GLTFLoader();
            const gltf = await new Promise<any>((resolve, reject) => {
              loader.load(modelUrl, resolve, undefined, reject);
            });
            object = gltf.scene;
            break;
          }
          case 'obj': {
            const loader = new OBJLoader();
            object = await new Promise<THREE.Group>((resolve, reject) => {
              loader.load(modelUrl, resolve, undefined, reject);
            });
            break;
          }
          case 'stl':
          default: {
            const loader = new STLLoader();
            const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
              loader.load(modelUrl, resolve, undefined, reject);
            });
            
            const material = new THREE.MeshStandardMaterial({
              color: 0xD4AF37, // Gold color
              metalness: 0.8,
              roughness: 0.2,
            });
            
            object = new THREE.Mesh(geometry, material);
            break;
          }
        }
        
        // Center model
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        object.position.set(-center.x, -center.y, -center.z);
        
        // Scale model to fit view
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 4 / maxDim;
          object.scale.set(scale, scale, scale);
        }
        
        if (sceneRef.current) {
          sceneRef.current.add(object);
          modelRef.current = object;
        }
        
        // Reset camera position for best view
        if (cameraRef.current && controlsRef.current) {
          cameraRef.current.position.set(0, 0, 5);
          controlsRef.current.reset();
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load 3D model');
        setIsLoading(false);
      }
    };
    
    loadModel();
  }, [modelUrl, modelType]);
  
  // Reset or zoom functions
  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.reset();
    }
  };
  
  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z -= 0.5;
    }
  };
  
  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z += 0.5;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className={`w-full h-full aspect-square md:aspect-auto rounded-lg overflow-hidden grid-pattern`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-dark z-10">
            <div className="w-16 h-16 border-4 border-gold-light border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {!modelUrl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[--royal-default] flex items-center justify-center mx-auto mb-4 border border-[--gold-default]/30">
                <i className="ri-cube-line text-4xl text-[--gold-default]"></i>
              </div>
              <h4 className="font-cinzel text-xl font-bold text-[--gold-default] mb-2">Your Model Will Appear Here</h4>
              <p className="text-gray-300 max-w-md mx-auto">Generate or select a model to view it in 3D.</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-dark/80 z-10">
            <div className="text-center max-w-xs mx-auto p-4">
              <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-fill text-3xl text-red-500"></i>
              </div>
              <h4 className="font-cinzel text-lg font-bold text-white mb-2">Error Loading Model</h4>
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
        )}
      </div>
      
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-[--navy-default]/80 backdrop-blur-sm rounded-full px-2 py-1 border border-[--gold-default]/20 z-30 scene-controls">
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
    </div>
  );
};

export default ThreeJsViewer;
