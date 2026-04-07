import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { FaTimes } from 'react-icons/fa';

interface VRViewerProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const Scene = ({ imageUrl }: { imageUrl: string }) => {
  const texture = useTexture(imageUrl);

  return (
    <>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
        rotateSpeed={-0.5} // Negative value to make dragging feel natural inside a sphere
      />
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        {/* Scale the X axis by -1 to flip the texture so it renders correctly from inside out */}
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </>
  );
};

const VRViewer: React.FC<VRViewerProps> = ({ imageUrl, title, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setMounted(true);
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-500">
      
      {/* VR HUD UI */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-10 z-10 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full animate-pulse tracking-widest border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            VR Live
          </div>
          <h2 className="text-white text-xl md:text-3xl font-display font-black tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none">
            {title}
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Tutorial overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-bounce">
        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/90 text-sm font-medium flex items-center gap-3 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Drag to look around
        </div>
      </div>

      {/* Canvas Layer */}
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={null}>
          <Scene imageUrl={imageUrl} />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#05073C' }}
        innerStyles={{ background: '#1A365D', width: '300px', height: '6px' }}
        barStyles={{ background: '#D4AF37', height: '6px' }}
        dataInterpolation={(p) => `Loading Virtual Reality ${p.toFixed(0)}%`}
      />
    </div>
  );
};

export default VRViewer;
