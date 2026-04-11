import { useState, type FormEvent, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useApp } from "../context/AppContext";
import { login as loginApi, socialLogin } from "../api/authService";
import { useGoogleLogin } from '@react-oauth/google';

const LOGIN_HERO = "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2000&auto=format&fit=crop";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const location = useLocation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 50);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        if (!validate()) return;
        setIsLoading(true);
        try {
            const response = await loginApi(formData);
            localStorage.setItem("token", response.token);
            setFormData({ email: "", password: "" });
            login({ id: String(response.user.id), name: response.user.name, email: response.user.email });
            const from = location.state?.from || "/";
            navigate(from, { state: location.state?.routeState, replace: true });
        } catch (error: any) {
            setGeneralError(error.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

    const handleSocial = async (provider: string) => {
        setIsSocialLoading(provider);
        setGeneralError("");
        try {
            const data = { name: provider + " User", email: `user@${provider}.com`, provider };
            const response = await socialLogin(data);
            localStorage.setItem("token", response.token);
            login({ id: String(response.user.id), name: response.user.name, email: response.user.email });
            const from = location.state?.from || "/";
            navigate(from, { state: location.state?.routeState, replace: true });
        } catch (error: any) {
            console.error(error);
            setGeneralError(error.response?.data?.message || "Failed to authenticate with " + provider);
        } finally {
            setIsSocialLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50 font-sans">
            
            {/* ====== LEFT PANEL (FORM) ====== */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 md:px-12 relative z-20 h-[100dvh] overflow-hidden">
                
                {/* Ambient Blurs for depth */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-sm xl:max-w-md relative z-10 box-border">
                    
                    {/* Brand */}
                    <div className={`overflow-hidden mb-5`}>
                        <div className={`flex items-center gap-3 transition-transform duration-1000 delay-[200ms] ${mounted ? 'translate-y-0' : 'translate-y-[100%]'}`}>
                            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#EB662B] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                <span className="text-white font-black text-base leading-none font-serif">K</span>
                            </div>
                            <span className="text-[#05073C] text-base font-bold tracking-widest uppercase">Kamet</span>
                        </div>
                    </div>

                    {/* Headings - Staggered Reveal */}
                    <div className="mb-5 space-y-1">
                        <div className="overflow-hidden">
                            <h1 className={`text-3xl lg:text-4xl font-extrabold text-[#05073C] tracking-tight transition-transform duration-1000 delay-[300ms] ${mounted ? 'translate-y-0' : 'translate-y-[110%]'}`}>
                                Welcome 
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className={`text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#e8c84a] tracking-tight transition-transform duration-1000 delay-[400ms] ${mounted ? 'translate-y-0' : 'translate-y-[110%]'}`}>
                                Back.
                            </h1>
                        </div>
                        <div className="overflow-hidden pt-1">
                            <p className={`text-gray-400 text-xs font-medium transition-transform duration-1000 delay-[500ms] ${mounted ? 'translate-y-0' : 'translate-y-[100%]'}`}>
                                Step into a world of timeless ancient wonders.
                            </p>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-4 mb-4">
                        <div className={`flex-1 overflow-hidden`}>
                            <button 
                                type="button"
                                disabled={isSocialLoading !== null}
                                onClick={() => handleSocial("google")}
                                className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold transition-all duration-700 delay-[600ms] hover:-translate-y-1 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isSocialLoading !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isSocialLoading === "google" ? "..." : <><FaGoogle className="text-red-400" /> Google</>}
                            </button>
                        </div>
                        <div className={`flex-1 overflow-hidden`}>
                            <button 
                                type="button"
                                disabled={isSocialLoading !== null}
                                onClick={() => handleSocial("facebook")}
                                className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold transition-all duration-700 delay-[700ms] hover:-translate-y-1 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isSocialLoading !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isSocialLoading === "facebook" ? "..." : <><FaFacebookF className="text-blue-500" /> Facebook</>}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={`relative flex items-center justify-center gap-4 mb-4 transition-all duration-1000 delay-[800ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-200"></div>
                        <span className="relative bg-slate-50 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">or</span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {generalError && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs animate-fade-in">
                                {generalError}
                            </div>
                        )}

                        <div className={`space-y-1 transition-all duration-1000 delay-[900ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37] transition-all placeholder-slate-400 font-medium"
                                placeholder="name@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                        </div>

                        <div className={`space-y-1 transition-all duration-1000 delay-[1000ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" className="text-[10px] font-semibold text-[#EB662B] hover:text-[#D4AF37] transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37] transition-all placeholder-slate-400 font-medium tracking-widest"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group w-full relative h-11 mt-1 bg-[#05073C] text-white rounded-xl overflow-hidden transition-all duration-1000 delay-[1100ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] z-10 transition-transform group-hover:scale-105">
                                {isLoading ? "Processing..." : "Sign In"}
                                {!isLoading && <FaArrowRight className="group-hover:translate-x-1 transition-transform" />}
                            </div>
                        </button>
                    </form>

                    <p className={`mt-5 text-center text-slate-500 font-medium text-xs transition-all duration-1000 delay-[1200ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        New to Kamet? <Link to="/sign-up" state={{ from: location.state?.from, routeState: location.state?.routeState }} className="text-[#05073C] hover:text-[#D4AF37] font-bold border-b border-[#05073C] hover:border-[#D4AF37] pb-0.5 transition-all">Create an account</Link>
                    </p>
                </div>
            </div>

            {/* ====== RIGHT PANEL (IMAGE WITH MOVING TICKER & EFFECTS) ====== */}
            <div className={`hidden lg:block lg:w-[55%] relative h-screen bg-black overflow-hidden transition-all duration-1000 ease-out delay-[300ms] ${mounted ? 'clip-path-full' : 'clip-path-zero'}`}>
                
                {/* 1. The Image with Ken Burns / Parallax Zoom */}
                <div className="absolute inset-0 w-full h-full transform scale-110 pointer-events-none animate-[kenBurns_30s_linear_infinite_alternate]">
                    <img 
                        src={LOGIN_HERO}
                        alt="Egypt Luxor"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>

                {/* 2. Advanced Multi-Layer Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#030614] via-transparent to-transparent z-10 w-1/3" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030614] via-[#030614]/20 to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#EB662B]/30 to-transparent mix-blend-overlay z-10" />

                {/* 3. The Animated Moving Marquee Ticker Tape (Diagonal) */}
                <div className="absolute top-[40%] -right-10 w-[150%] h-16 bg-[#D4AF37] rotate-[-5deg] z-20 flex items-center overflow-hidden shadow-2xl mix-blend-luminosity opacity-90 border-y-4 border-[#030614]">
                    <div className="flex w-max animate-[ticker_20s_linear_infinite]">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 px-4">
                                <span className="text-[#030614] font-black text-2xl uppercase tracking-[0.3em] font-serif">DISCOVER EGYPT</span>
                                <span className="text-[#030614] text-xl">✦</span>
                                <span className="text-[#030614] font-black text-2xl uppercase tracking-[0.3em] font-serif">NILE CRUISE</span>
                                <span className="text-[#030614] text-xl">✦</span>
                                <span className="text-[#030614] font-black text-2xl uppercase tracking-[0.3em] font-serif">LUXURY</span>
                                <span className="text-[#030614] text-xl">✦</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Another tape for depth */}
                <div className="absolute top-[45%] -right-10 w-[150%] h-12 bg-[#030614] rotate-[-5deg] z-10 flex items-center overflow-hidden shadow-2xl border-y border-white/10">
                    <div className="flex w-max animate-[ticker_25s_linear_infinite_reverse]">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 px-4">
                                <span className="text-gray-500 font-bold text-lg uppercase tracking-[0.4em]">Ancient History</span>
                                <span className="text-gray-700 text-sm">/</span>
                                <span className="text-gray-500 font-bold text-lg uppercase tracking-[0.4em]">Adventure</span>
                                <span className="text-gray-700 text-sm">/</span>
                                <span className="text-gray-500 font-bold text-lg uppercase tracking-[0.4em]">Culture</span>
                                <span className="text-gray-700 text-sm">/</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Glassmorphism Info Card Floating */}
                <div className={`absolute bottom-16 right-16 z-30 max-w-sm backdrop-blur-2xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-1000 delay-[1200ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path></svg>
                    </div>
                    <p className="text-white text-xl font-light leading-relaxed mb-6 font-serif italic">
                        "The perfect platform to book the most luxurious experiences along the Nile."
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20" />
                        <div>
                            <p className="text-white font-bold text-sm">Ahmed El-Masry</p>
                            <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-widest mt-0.5">Premium Explorer</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Global CSS keyframes missing from Tailwind defaults */}
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes kenBurns {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.15) translate(-2%, 2%); }
                }
                .clip-path-zero {
                    clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
                }
                .clip-path-full {
                    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
