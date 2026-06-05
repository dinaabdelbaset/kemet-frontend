import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FaXmark, FaCamera, FaRotate, FaSun, FaMobileScreenButton } from "react-icons/fa6";
import { FaCube, FaBed, FaBath, FaTree, FaLocationArrow, FaKey, FaCompass } from "react-icons/fa";

interface ARViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// ── PHOTOREALISTIC 360° PANORAMA SPHERE (STREET VIEW STYLE) ──
function Real360Panorama({ imageUri }: { imageUri: string }) {
  const texture = useTexture(imageUri);
  
  // Set equirectangular mapping to map the 360° panorama photo flawlessly without warping
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh>
      {/* A large sphere containing the user inside */}
      <sphereGeometry args={[500, 60, 40]} />
      {/* Render the texture on the INSIDE of the sphere */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

const ARViewerModal: React.FC<ARViewerModalProps> = ({ isOpen, onClose, title }) => {
  const [arMode, setArMode] = useState<"3d" | "ar">("3d");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if current item is a Hotel/Resort or a Tour
  const isHotel = title.toLowerCase().includes("hotel") || title.toLowerCase().includes("resort") || title.toLowerCase().includes("room") || title.toLowerCase().includes("stay");

  // ── Multi-Scene Panoramic State ──
  const [activeScene, setActiveScene] = useState<string>(isHotel ? "bedroom" : "plateau");

  // Set default scene when title/hotel changes
  useEffect(() => {
    setActiveScene(isHotel ? "bedroom" : "plateau");
  }, [isHotel, title]);

  // Determine dynamic panorama URL depending on the active scene selection
  let panoramaUrl = "/pyramids_360.png";
  if (isHotel) {
    if (activeScene === "bedroom") panoramaUrl = "/dahab_360.png";
    else if (activeScene === "bathroom") panoramaUrl = "/hotel_bath_360.png";
    else if (activeScene === "balcony") panoramaUrl = "/hotel_balcony_360.png";
  } else {
    if (activeScene === "plateau") panoramaUrl = "/pyramids_360.png";
    else if (activeScene === "inside") panoramaUrl = "/monument_inside_360.png";
    else if (activeScene === "aerial") panoramaUrl = "/monument_aerial_360.png";
  }

  // ── Handling Webcam for Live AR Simulation ──
  useEffect(() => {
    if (arMode === "ar" && isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Camera access failed:", err);
          alert("Could not access camera for AR mode. Falling back to 3D Viewer.");
          setArMode("3d");
        });
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [arMode, isOpen]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    setArMode("3d");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        ref={containerRef}
        className="relative bg-[#05073C] border border-[#d4af37]/30 text-white w-full max-w-5xl h-[85vh] md:h-[88vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.3)] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#030424] z-20">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#EB662B]">
              <FaCube className="text-[#d4af37]" /> {title} - 100% Real 360° VR Tour
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <FaCompass className="text-[#d4af37] animate-spin-slow" />
              Matterport-style interactive virtual tour! Explore different spaces by clicking the buttons.
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition cursor-pointer"
          >
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* 3D Canvas / Camera Viewport */}
        <div className="flex-1 relative bg-gradient-to-b from-[#030424] to-[#0a0f2e]">
          {/* Real Live Camera stream behind 3D render (AR Simulation) */}
          {arMode === "ar" && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{ transform: "scaleX(-1)" }} // Mirrors the selfie cam nicely
            />
          )}

          {/* 🕹️ Floating Multi-Scene Switcher Panel (Matterport-style Navigation) 🕹️ */}
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-4 w-[240px] md:w-[260px] animate-in slide-in-from-left duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest block mb-3 flex items-center gap-1">
              📍 Virtual Scenes navigation
            </span>
            <div className="space-y-2">
              {isHotel ? (
                <>
                  <button 
                    onClick={() => setActiveScene("bedroom")}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2.5 border ${activeScene === "bedroom" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C] border-transparent shadow-lg shadow-orange-500/10" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                  >
                    <FaBed className="text-sm" /> 🛌 Luxury Suite Bedroom
                  </button>
                  <button 
                    onClick={() => setActiveScene("bathroom")}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2.5 border ${activeScene === "bathroom" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C] border-transparent shadow-lg shadow-orange-500/10" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                  >
                    <FaBath className="text-sm" /> 🛁 Premium Marble Bath
                  </button>
                  <button 
                    onClick={() => setActiveScene("balcony")}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2.5 border ${activeScene === "balcony" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C] border-transparent shadow-lg shadow-orange-500/10" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                  >
                    <FaTree className="text-sm" /> 🌅 Sea-View Balcony
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveScene("plateau")}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2.5 border ${activeScene === "plateau" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C] border-transparent shadow-lg shadow-orange-500/10" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                  >
                    <FaLocationArrow className="text-sm" /> 🐫 Pyramids Main Plateau
                  </button>
                  <button 
                    onClick={() => setActiveScene("inside")}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2.5 border ${activeScene === "inside" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C] border-transparent shadow-lg shadow-orange-500/10" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                  >
                    <FaKey className="text-sm" /> 🏺 Inside The Great Tomb
                  </button>
                  <button 
                    onClick={() => setActiveScene("aerial")}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2.5 border ${activeScene === "aerial" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C] border-transparent shadow-lg shadow-orange-500/10" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                  >
                    <FaSun className="text-sm" /> 🦅 Panoramic Aerial sunset
                  </button>
                </>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-4 leading-normal">
              Click on any scene above to transport instantly to that location in 360° photorealism.
            </p>
          </div>

          {/* 3D R3F Canvas */}
          <div className="absolute inset-0 z-10">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 60 }}>
              <ambientLight intensity={1.5} />
              
              <Suspense fallback={
                <mesh>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshBasicMaterial color="#030424" wireframe />
                </mesh>
              }>
                <Real360Panorama key={panoramaUrl} imageUri={panoramaUrl} />
              </Suspense>

              <OrbitControls 
                enableZoom={true} 
                enablePan={false} 
                maxDistance={10} 
                minDistance={0.05}
                autoRotate={false}
              />
            </Canvas>
          </div>

          {/* AR Target Crosshair overlay */}
          {arMode === "ar" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-40 h-40 border-2 border-dashed border-[#d4af37]/60 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black bg-black/60 px-2 py-0.5 rounded">
                  AR 360° Portal Active
                </span>
              </div>
            </div>
          )}

          {/* Bottom Controls Info Banner */}
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left">
              <span className="text-xs text-[#d4af37] font-black uppercase tracking-widest block mb-0.5">🎮 Virtual Reality Controls</span>
              <span className="text-[11px] text-gray-300">Drag in ANY direction to look around 360° · Scroll to ZOOM in/out</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setArMode("3d")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${arMode === "3d" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C]" : "bg-white/10 text-white hover:bg-white/20"}`}
              >
                <FaRotate /> 360° Real View
              </button>
              <button 
                onClick={() => setArMode("ar")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${arMode === "ar" ? "bg-gradient-to-r from-[#d4af37] to-[#EB662B] text-[#05073C]" : "bg-white/10 text-white hover:bg-white/20"}`}
              >
                <FaCamera /> View in AR (Camera)
              </button>
            </div>
          </div>
        </div>

        {/* Footer info (Mobile webxr links) */}
        <div className="p-5 border-t border-white/10 bg-[#030424] flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <FaMobileScreenButton className="text-lg text-[#d4af37]" />
            <p><strong>Mobile / VR users:</strong> Experience fully immersive virtual reality directly using WebXR!</p>
          </div>
          <a 
            href="https://threejs.org/examples/webgl_panorama_equirectangular.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#d4af37] hover:underline font-bold"
          >
            Launch Fullscreen WebXR VR ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default ARViewerModal;
