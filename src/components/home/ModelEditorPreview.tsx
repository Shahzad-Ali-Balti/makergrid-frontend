import React, { useState } from 'react';
import ShieldButton from '../ShieldButton';
const ModelEditorPreview: React.FC = () => {
  const [brushSize, setBrushSize] = useState(45);
  const [hardness, setHardness] = useState(75);
  const [strength, setStrength] = useState(60);
  const [brushPreset, setBrushPreset] = useState('Clay Strips');
  const [showWireframe, setShowWireframe] = useState(true);
  const [selectedSymmetry, setSelectedSymmetry] = useState<string[]>(['X']);

  const toggleSymmetry = (axis: string) => {
    if (selectedSymmetry.includes(axis)) {
      setSelectedSymmetry(selectedSymmetry.filter(a => a !== axis));
    } else {
      setSelectedSymmetry([...selectedSymmetry, axis]);
    }
  };

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-100">
        <div className='flex justify-center items-center py-4'>
        <ShieldButton fullWidth>Coming Soon</ShieldButton>

        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="text-[--gold-default]">In-Browser</span> 3D Editing
          </h2>
          <div className="w-24 h-1 bg-[--gold-default] mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            Refine your creations with professional sculpting tools inspired by ZBrush and Blender — all directly in your browser.
          </p>
        </div>
        
        <div className="bg-[--navy-dark] rounded-lg overflow-hidden border border-[--royal-default] shield-container">
          <div className="p-2 bg-[--navy-default] border-b border-[--royal-default] flex items-center">
            <div className="flex space-x-1 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-400">MakerGrid Editor - Knight_Helmet_v2.obj</span>
          </div>
          
          <div className="grid grid-cols-12 h-[600px]">
            {/* Tools panel */}
            <div className="col-span-1 bg-[--navy-default] border-r border-[--royal-default] p-2">
              <div className="flex flex-col items-center space-y-4">
                <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                  <i className="ri-cursor-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded bg-[--royal-default] text-[--gold-default]">
                  <i className="ri-brush-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                  <i className="ri-eraser-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                  <i className="ri-shape-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                  <i className="ri-scissors-cut-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                  <i className="ri-paint-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                  <i className="ri-contrast-2-fill"></i>
                </button>
                <div className="pt-4 border-t border-[--royal-default] w-full flex justify-center">
                  <button className="w-10 h-10 flex items-center justify-center rounded text-[--gold-default] hover:bg-[--royal-default] transition-colors">
                    <i className="ri-settings-3-fill"></i>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main editor area */}
            <div className="col-span-8 bg-gradient-to-b from-[--navy-dark] to-[--navy-default] relative">
              {/* 3D viewer (would use Three.js in production) */}
              <div className="absolute inset-0 grid-pattern opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-4 border-[--gold-default]/20 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-[--gold-default]/30 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-[--gold-default]/40 flex items-center justify-center">
                      <i className="ri-sword-fill text-5xl text-[--gold-default]/70"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-[--navy-default]/80 backdrop-blur-sm rounded-full px-2 py-1 border border-[--gold-default]/20 scene-controls">
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-focus-3-line"></i>
                </button>
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-drag-move-line"></i>
                </button>
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-zoom-in-line"></i>
                </button>
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-zoom-out-line"></i>
                </button>
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-refresh-line"></i>
                </button>
                <div className="mx-2 h-4 border-r border-[--royal-default]"></div>
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-grid-line"></i>
                </button>
                <button className="p-2 text-[--gold-default] hover:bg-[--royal-default]/50 rounded-full">
                  <i className="ri-contrast-drop-line"></i>
                </button>
              </div>
              
              {/* Top controls */}
              <div className="absolute top-4 right-4 flex items-center bg-[--navy-default]/80 backdrop-blur-sm rounded-full px-3 py-1 border border-[--gold-default]/20">
                <span className="text-sm text-gray-300 mr-2">Wireframe</span>
                <div 
                  className="relative w-10 h-5 bg-[--navy-default] rounded-full cursor-pointer"
                  onClick={() => setShowWireframe(!showWireframe)}
                >
                  <div className={`absolute top-0 w-5 h-5 bg-[--gold-default] rounded-full transition-all ${showWireframe ? 'left-0' : 'left-5'}`}></div>
                </div>
              </div>
            </div>
            
            {/* Properties panel */}
            <div className="col-span-3 bg-[--navy-default] border-l border-[--royal-default] p-4 overflow-y-auto">
              <h3 className="font-cinzel text-xl font-bold mb-4 text-[--gold-default]">Brush Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-200">Brush Size</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full accent-[--gold-default]"
                    />
                    <span className="ml-2 text-sm text-gray-300">{brushSize}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-200">Hardness</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={hardness}
                      onChange={(e) => setHardness(parseInt(e.target.value))}
                      className="w-full accent-[--gold-default]"
                    />
                    <span className="ml-2 text-sm text-gray-300">{hardness}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-200">Strength</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={strength}
                      onChange={(e) => setStrength(parseInt(e.target.value))}
                      className="w-full accent-[--gold-default]"
                    />
                    <span className="ml-2 text-sm text-gray-300">{strength}%</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[--royal-default]">
                  <label className="block mb-2 text-sm font-medium text-gray-200">Brush Preset</label>
                  <select 
                    className="w-full p-2 bg-[--navy-dark] border border-[--royal-default] rounded-md focus:outline-none focus:ring-1 focus:ring-[--gold-default]/50 text-white text-sm"
                    value={brushPreset}
                    onChange={(e) => setBrushPreset(e.target.value)}
                  >
                    <option>Clay Strips</option>
                    <option>Standard</option>
                    <option>Smooth</option>
                    <option>Pinch</option>
                    <option>Flatten</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-[--royal-default]">
                  <label className="block mb-2 text-sm font-medium text-gray-200">Symmetry</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      className={`p-2 ${selectedSymmetry.includes('X') ? 'bg-[--royal-default] text-[--gold-default]' : 'bg-[--navy-dark] hover:bg-[--royal-default] text-gray-300 hover:text-[--gold-default]'} text-sm rounded`}
                      onClick={() => toggleSymmetry('X')}
                    >
                      X
                    </button>
                    <button 
                      className={`p-2 ${selectedSymmetry.includes('Y') ? 'bg-[--royal-default] text-[--gold-default]' : 'bg-[--navy-dark] hover:bg-[--royal-default] text-gray-300 hover:text-[--gold-default]'} text-sm rounded`}
                      onClick={() => toggleSymmetry('Y')}
                    >
                      Y
                    </button>
                    <button 
                      className={`p-2 ${selectedSymmetry.includes('Z') ? 'bg-[--royal-default] text-[--gold-default]' : 'bg-[--navy-dark] hover:bg-[--royal-default] text-gray-300 hover:text-[--gold-default]'} text-sm rounded`}
                      onClick={() => toggleSymmetry('Z')}
                    >
                      Z
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[--royal-default]">
                  <label className="block mb-2 text-sm font-medium text-gray-200">Layers</label>
                  <div className="space-y-2">
                    <div className="p-2 bg-[--navy-dark] rounded flex items-center">
                      <i className="ri-eye-line mr-2 text-[--gold-default]"></i>
                      <span className="text-sm">Base Mesh</span>
                    </div>
                    <div className="p-2 bg-[--navy-dark] rounded flex items-center">
                      <i className="ri-eye-line mr-2 text-[--gold-default]"></i>
                      <span className="text-sm">Details</span>
                    </div>
                    <div className="p-2 bg-[--royal-default] rounded flex items-center">
                      <i className="ri-eye-line mr-2 text-[--gold-default]"></i>
                      <span className="text-sm">Ornaments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom status bar */}
          <div className="p-2 bg-[--navy-default] border-t border-[--royal-default] flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <span>Vertices: 12,458</span>
              <span className="mx-3">|</span>
              <span>Faces: 24,916</span>
            </div>
            <div>
              <button className="px-4 py-1 bg-[--royal-default]/50 hover:bg-[--royal-default] text-[--gold-default] rounded-sm text-xs font-cinzel">
                Export Model
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelEditorPreview;
