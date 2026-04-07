import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ARViewerProps {
  modelUrl?: string; // Kept for API compatibility, though we'll force the 360 interior view
  title: string;
  onClose: () => void;
}

const ARViewer: React.FC<ARViewerProps> = ({ title, onClose }) => {
  const [aframeLoaded, setAframeLoaded] = useState(false);

  useEffect(() => {
    // Dynamically inject A-Frame script
    const scriptId = 'aframe-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => setAframeLoaded(true);
      document.head.appendChild(script);
    } else {
      // If already loaded in a previous mount
      setAframeLoaded(true);
    }

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Standard Hotel Room Image (Normal 2D picture, NOT equirectangular)
  const room360ImageUrl = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=4000&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
      
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-[110] flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-[#EB662B] text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full animate-pulse tracking-widest shadow-[0_0_15px_rgba(235,102,43,0.6)]">
            VR 360°
          </div>
          <h2 className="text-white text-lg md:text-2xl font-black tracking-wide drop-shadow-lg">
            {title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Loading state before A-Frame script finishes */}
      {!aframeLoaded && (
        <div className="absolute inset-0 z-[105] bg-black flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#EB662B]/30 border-t-[#EB662B] animate-spin" />
          <p className="text-white/60 text-sm font-bold tracking-widest uppercase">Initializing VR Engine...</p>
        </div>
      )}

      {/* A-Frame 360 Scene rendered via dangerouslySetInnerHTML to prevent React from warning about custom elements */}
      {aframeLoaded && (
        <div 
          className="w-full h-full cursor-grab active:cursor-grabbing"
          dangerouslySetInnerHTML={{
            __html: `
              <a-scene embedded loading-screen="dotsColor: #EB662B; backgroundColor: black" vr-mode-ui="enabled: true">
                <!-- Black background so the empty space looks cinematic -->
                <a-sky color="#05073C"></a-sky>

                <!-- Normal 2D picture placed as a massive curved cinema screen around the user! 
                     This prevents ANY distortion or weird stretching on the top/bottom 
                     because it uses a Cylinder instead of a Sphere. -->
                <a-cylinder src="${room360ImageUrl}" 
                            radius="6" 
                            height="8" 
                            position="0 1.6 0" 
                            side="back" 
                            open-ended="true" 
                            rotation="0 180 0">
                </a-cylinder>
                
                <!-- Camera with normal FOV -->
                <a-entity camera="fov: 80" look-controls="reverseMouseDrag: false; touchEnabled: true" position="0 1.6 0"></a-entity>
              </a-scene>
            `
          }}
        />
      )}

      {/* Instructions overlaid on the bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] pointer-events-none w-full px-4 flex justify-center">
        <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white text-xs md:text-sm font-bold tracking-wider flex items-center gap-2 md:gap-3 text-center">
          <span className="hidden md:inline">🖱️</span>
          <span>DRAG SCREEN TO LOOK AROUND</span>
          <span className="hidden md:inline">📱</span>
        </div>
      </div>
      
    </div>
  );
};

export default ARViewer;
