import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { register, socialLogin } from "../api/authService";
import { useGoogleLogin } from '@react-oauth/google';

const SignUpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useApp();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [oAuthLoading, setOAuthLoading] = useState<{
        google: boolean;
        facebook: boolean;
    }>({ google: false, facebook: false });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 50);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({}); // reset top level error if using a general one, but we map to input errors here
        if (!validate()) return;

        setIsLoading(true);
        try {
            const response = await register(formData);
            localStorage.setItem("token", response.token);
            setFormData({ name: "", email: "", password: "" }); 
            login({ id: String(response.user.id), name: response.user.name, email: response.user.email });
            const from = location.state?.from || "/";
            navigate(from, { state: location.state?.routeState, replace: true });
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.response?.data?.errors?.email?.[0] || "Registration failed. Please try again.";
            setErrors(prev => ({ ...prev, email: errorMessage })); // Set it to email field or a general error
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: "google" | "facebook") => {
        setOAuthLoading((prev) => ({ ...prev, [provider]: true }));
        try {
            const fakeSocialData = {
                name: provider === "google" ? "Google Guest" : "Facebook Guest",
                email: `guest_${Date.now()}@${provider}.com`,
                provider: provider
            };
            const response = await socialLogin(fakeSocialData);
            localStorage.setItem("token", response.token);
            login({ id: String(response.user.id), name: response.user.name, email: response.user.email });
            const from = location.state?.from || "/";
            navigate(from, { state: location.state?.routeState, replace: true });
        } catch (error) {
            console.error(error);
        } finally {
            setOAuthLoading((prev) => ({ ...prev, [provider]: false }));
        }
    };

    const LOGIN_HERO = "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2000&auto=format&fit=crop";

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
                                Create
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className={`text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#e8c84a] tracking-tight transition-transform duration-1000 delay-[400ms] ${mounted ? 'translate-y-0' : 'translate-y-[110%]'}`}>
                                Account.
                            </h1>
                        </div>
                        <div className="overflow-hidden pt-1">
                            <p className={`text-gray-400 text-xs font-medium transition-transform duration-1000 delay-[500ms] ${mounted ? 'translate-y-0' : 'translate-y-[100%]'}`}>
                                Start your journey with us today
                            </p>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-4 mb-4">
                        <div className={`flex-1 overflow-hidden`}>
                            <button 
                                type="button"
                                onClick={() => handleOAuthLogin("google")}
                                disabled={oAuthLoading.google || isLoading}
                                className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold transition-all duration-700 delay-[600ms] hover:-translate-y-1 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${(oAuthLoading.google || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {oAuthLoading.google ? "..." : (
                                    <>
                                        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg> Google
                                    </>
                                )}
                            </button>
                        </div>
                        <div className={`flex-1 overflow-hidden`}>
                            <button 
                                type="button"
                                onClick={() => handleOAuthLogin("facebook")}
                                disabled={oAuthLoading.facebook || isLoading}
                                className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold transition-all duration-700 delay-[700ms] hover:-translate-y-1 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${(oAuthLoading.facebook || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {oAuthLoading.facebook ? "..." : (
                                    <>
                                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg> Facebook
                                    </>
                                )}
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
                        {errors.email && errors.email !== "Email is required" && errors.email !== "Invalid email" && (
                            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs animate-fade-in">
                                {errors.email}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className={`space-y-1 transition-all duration-1000 delay-[850ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37] transition-all placeholder-slate-400 font-medium"
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
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
                            {errors.email && (errors.email === "Email is required" || errors.email === "Invalid email") && (
                                <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className={`space-y-1 transition-all duration-1000 delay-[1000ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37] transition-all placeholder-slate-400 font-medium tracking-widest"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group w-full relative h-11 mt-1 bg-[#05073C] text-white rounded-xl overflow-hidden transition-all duration-1000 delay-[1200ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] z-10 transition-transform group-hover:scale-105">
                                {isLoading ? "Processing..." : "Sign Up"}
                                {!isLoading && (
                                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </form>

                    <p className={`mt-5 text-center text-gray-500 font-medium text-xs transition-all duration-1000 delay-[1200ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        Already have an account? <Link to="/login" state={{ from: location.state?.from, routeState: location.state?.routeState }} className="text-[#05073C] hover:text-[#D4AF37] font-bold border-b border-[#05073C] hover:border-[#D4AF37] pb-0.5 transition-all">Sign In</Link>
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

export default SignUpPage;
