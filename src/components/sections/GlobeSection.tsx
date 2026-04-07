import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import AirportSelect from "../Ui/AirportSelect";

gsap.registerPlugin(ScrollTrigger);

const R = 2.2;

function latLonToVec3(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ── Realistic Earth with NASA texture ──
function EarthGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const egyptGlowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  const [earthMap, earthSpec, earthNormal, cloudsMap] = useTexture([
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png",
  ]);

  useFrame((_, delta) => {
    // Earth rotation
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.06;
    // Clouds slightly faster
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.08;
    // Egypt glow pulse
    if (egyptGlowRef.current) {
      pulseRef.current += delta * 2;
      const opacity = 0.5 + Math.sin(pulseRef.current) * 0.35;
      const mat = egyptGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity;
      const scale = 1 + Math.sin(pulseRef.current) * 0.15;
      egyptGlowRef.current.scale.setScalar(scale);
    }
  });

  // Egypt marker position
  const egyptPos = latLonToVec3(26.8, 30.8, R + 0.03);

  return (
    <group>
      {/* ── Earth surface ── */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshPhongMaterial
          map={earthMap}
          specularMap={earthSpec}
          normalMap={earthNormal}
          specular={new THREE.Color(0x333333)}
          shininess={18}
        />

        {/* ── Egypt glow spot (child → rotates with globe) ── */}
        <mesh ref={egyptGlowRef} position={egyptPos}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial
            color="#EB662B"
            transparent
            opacity={0.6}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Egypt core dot */}
        <mesh position={latLonToVec3(26.8, 30.8, R + 0.04)}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={3}
          />
        </mesh>

        {/* Cairo dot */}
        <mesh position={latLonToVec3(30.04, 31.24, R + 0.04)}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={4} />
        </mesh>
      </mesh>

      {/* ── Cloud layer ── */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[R + 0.04, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* ── Atmosphere glow (backside) ── */}
      <mesh scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial
          color="#4488ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ── Orbit streak passing the globe ──
function OrbitStreak() {
  const ref = useRef<THREE.Mesh>(null);

  const curve = new THREE.EllipseCurve(0, 0, 3.4, 2.2, 0, Math.PI * 2, false, 0.4);
  const pts = curve.getPoints(120);
  const geo = new THREE.BufferGeometry().setFromPoints(
    pts.map((p) => new THREE.Vector3(p.x, p.y * 0.35, p.y))
  );
  const mat = new THREE.LineBasicMaterial({
    color: "#88ccff",
    transparent: true,
    opacity: 0.35,
  });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  return <primitive ref={ref} object={new THREE.Line(geo, mat)} />;
}

// ── Full scene ──
function GlobeScene() {
  return (
    <>
      {/* Stars removed — white background */}

      {/* Sun-like light from top-right */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 3, 5]} intensity={2.2} color="#ffe4b5" />
      <pointLight position={[-8, -4, -6]} intensity={0.3} color="#3366ff" />

      <Suspense fallback={null}>
        <EarthGlobe />
      </Suspense>

      <OrbitStreak />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.4}
        minPolarAngle={Math.PI / 3.5}
      />
    </>
  );
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const MONTHS = [
  { v: "01", l: "يناير" }, { v: "02", l: "فبراير" }, { v: "03", l: "مارس" },
  { v: "04", l: "أبريل" }, { v: "05", l: "مايو" }, { v: "06", l: "يونيو" },
  { v: "07", l: "يوليو" }, { v: "08", l: "أغسطس" }, { v: "09", l: "سبتمبر" },
  { v: "10", l: "أكتوبر" }, { v: "11", l: "نوفمبر" }, { v: "12", l: "ديسمبر" },
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, i) => String(currentYear + i));

const GlobeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [globeVisible, setGlobeVisible] = useState(false); // 🚀 Lazy load globe

  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [from, setFrom] = useState("القاهرة (CAI)");
  const [to, setTo] = useState("الأقصر (LXR)");
  const [depDay, setDepDay] = useState("01");
  const [depMonth, setDepMonth] = useState("01");
  const [depYear, setDepYear] = useState(String(currentYear));
  const [retDay, setRetDay] = useState("08");
  const [retMonth, setRetMonth] = useState("01");
  const [retYear, setRetYear] = useState(String(currentYear));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleSearch = () => {
    navigate("/flights", {
      state: {
        from, to,
        depDate: `${depYear}-${depMonth}-${depDay}`,
        retDate: tripType === "round" ? `${retYear}-${retMonth}-${retDay}` : null,
        passengers: { adults, children, infants },
        tripType,
      }
    });
  };

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  // 🚀 Only mount the heavy 3D canvas when the section is near the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlobeVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before it enters view
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #04062e 0%, #080e3a 50%, #0a0f2e 100%)" }}
    >
      {/* Stars effect */}
      <div className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />
      {/* Radial glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(68,136,255,0.08) 0%, transparent 60%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04062e] to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">

        {/* ── Left: Flight Booking Form ── */}
        <div ref={contentRef} className="text-white lg:pr-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[2px] w-8 bg-gradient-to-r from-[#D4AF37] to-[#EB662B] rounded-full" />
            <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.25em]">✈️ مصر للطيران</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-5 text-white">
            احجز رحلتك{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#EB662B]">الجوية إلى مصر</span>
          </h2>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-5 space-y-4">

            {/* Trip Type */}
            <div className="flex gap-2">
              {(["round", "oneway"] as const).map((type, i) => (
                <button key={type} onClick={() => setTripType(type)}
                  className="flex-1 py-2 rounded-xl text-xs font-black border transition-all duration-200"
                  style={tripType === type
                    ? { background: "linear-gradient(135deg,#D4AF37,#EB662B)", color: "#04062e", borderColor: "transparent" }
                    : { background: "#f5f5f5", color: "#888", borderColor: "#e0e0e0" }
                  }
                >
                  {i === 0 ? "ذهاب وعودة" : "ذهاب فقط"}
                </button>
              ))}
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-3">
              <AirportSelect label="من" value={from} onChange={setFrom} iconColor="#D4AF37" iconRotate="rotate-45" />
              <AirportSelect label="إلى" value={to} onChange={setTo} iconColor="#EB662B" />
            </div>

            {/* Dates */}
            <div className={`grid gap-3 ${tripType === "round" ? "grid-cols-2" : "grid-cols-1"}`}>
              {/* Departure */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-black block mb-1.5">تاريخ الذهاب</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: depDay, set: setDepDay, opts: DAYS, placeholder: "يوم" },
                    { val: depMonth, set: setDepMonth, opts: MONTHS.map(m => m.v), labels: MONTHS.map(m => m.l), placeholder: "شهر" },
                    { val: depYear, set: setDepYear, opts: YEARS, placeholder: "سنة" },
                  ].map(({ val, set, opts, labels, placeholder }, i) => (
                    <select key={i} value={val} onChange={e => set(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-1.5 py-2 text-white text-[11px] font-semibold focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer text-center"
                      style={{ direction: "rtl" }}
                    >
                      <option value="" className="bg-white">{placeholder}</option>
                      {opts.map((o, j) => (
                        <option key={o} value={o} className="bg-white">{labels ? labels[j] : o}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              {/* Return */}
              {tripType === "round" && (
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-black block mb-1.5">تاريخ العودة</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { val: retDay, set: setRetDay, opts: DAYS, placeholder: "يوم" },
                      { val: retMonth, set: setRetMonth, opts: MONTHS.map(m => m.v), labels: MONTHS.map(m => m.l), placeholder: "شهر" },
                      { val: retYear, set: setRetYear, opts: YEARS, placeholder: "سنة" },
                    ].map(({ val, set, opts, labels, placeholder }, i) => (
                      <select key={i} value={val} onChange={e => set(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-1.5 py-2 text-white text-[11px] font-semibold focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer text-center"
                        style={{ direction: "rtl" }}
                      >
                        <option value="" className="bg-white">{placeholder}</option>
                        {opts.map((o, j) => (
                          <option key={o} value={o} className="bg-white">{labels ? labels[j] : o}</option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Passengers */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-black block mb-1.5">المسافرون</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "بالغ", val: adults, min: 1, set: setAdults },
                  { label: "طفل", val: children, min: 0, set: setChildren },
                  { label: "رضيع", val: infants, min: 0, set: setInfants },
                ].map(({ label, val, min, set }) => (
                  <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-2 py-2 flex items-center justify-between">
                    <span className="text-[10px] text-white/70 font-black">{label}</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => set(Math.max(min, val - 1))}
                        className="w-5 h-5 rounded-full bg-white/20 text-white text-xs font-black hover:bg-[#EB662B]/40 transition">-</button>
                      <span className="text-white text-xs font-black w-4 text-center">{val}</span>
                      <button onClick={() => set(val + 1)}
                        className="w-5 h-5 rounded-full bg-white/20 text-white text-xs font-black hover:bg-[#D4AF37]/40 transition">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <button onClick={handleSearch}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#D4AF37] to-[#EB662B] hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaPlane /> ابحث عن الرحلات المتاحة
            </button>
            <p className="text-center text-white/40 text-[10px]">🔒 حجز آمن · أفضل الأسعار المضمونة · إلغاء مجاني</p>
          </div>
        </div>


        {/* ── Right: 3D Earth ── */}
        <div className="relative h-[420px] md:h-[540px]">
          {/* Ambient outer glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="absolute w-40 h-40 rounded-full bg-[#D4AF37]/8 blur-[60px]" />
          </div>

          {/* 🚀 Only render when in view */}
          {globeVisible ? (
            <Canvas camera={{ position: [0, 0.5, 5.5], fov: 40 }} gl={{ antialias: true }}>
              <GlobeScene />
            </Canvas>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-blue-900/30 animate-pulse" />
            </div>
          )}

          {/* Egypt badge */}
          <div className="absolute bottom-5 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl px-3 py-1.5 pointer-events-none">
            <span className="text-lg">🇪🇬</span>
            <div>
              <p className="text-white text-[11px] font-black leading-tight">Egypt</p>
              <p className="text-[#D4AF37] text-[9px] font-medium">مضيئة على الخريطة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobeSection;
