import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Ui/Input";
import Button from "../components/Ui/Button";
import ErrorMessage from "../components/Ui/ErrorMessage";
import { forgotPassword, verifyOTP, resetPassword } from "../api/authService";
import { FaArrowLeft, FaCheckCircle, FaLock, FaEnvelope, FaKey } from "react-icons/fa";

type Step = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email) {
            setError("Email is required");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email is invalid");
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword(email);
            setStep('OTP');
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP code");
            return;
        }

        setIsLoading(true);
        try {
            await verifyOTP({ email, otp });
            setStep('PASSWORD');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.otp?.[0] || "Invalid OTP code");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({ email, otp, password, password_confirmation: passwordConfirmation });
            setStep('SUCCESS');
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password. The session may have expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative z-10 pt-24 bg-[url('https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&q=80')] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#05073C]/95 before:to-[#1A365D]/90 before:-z-10">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 hover:shadow-[0_20px_50px_rgba(5,7,60,0.15)] transition-all duration-300">
                
                {/* Headers per Step */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-4 text-[#D4AF37] shadow-inner">
                        {step === 'EMAIL' && <FaEnvelope className="text-2xl" />}
                        {step === 'OTP' && <FaKey className="text-2xl" />}
                        {step === 'PASSWORD' && <FaLock className="text-2xl" />}
                        {step === 'SUCCESS' && <FaCheckCircle className="text-3xl text-green-500" />}
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#05073C] font-serif">
                        {step === 'EMAIL' && 'Forgot Password'}
                        {step === 'OTP' && 'Verify OTP'}
                        {step === 'PASSWORD' && 'New Password'}
                        {step === 'SUCCESS' && 'Password Reset'}
                    </h2>
                    
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                        {step === 'EMAIL' && "Enter your email address and we'll send you a recovery code."}
                        {step === 'OTP' && `We've sent a 6-digit code to ${email}.`}
                        {step === 'PASSWORD' && "Enter your new desired password."}
                        {step === 'SUCCESS' && "Your password has been changed successfully!"}
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Forms per Step */}
                <div className="mt-8 space-y-6">
                    {step === 'EMAIL' && (
                        <form className="space-y-6" onSubmit={handleEmailSubmit}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                disabled={isLoading}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full bg-[#05073C] text-white hover:bg-[#D4AF37] py-3.5 rounded-xl font-bold tracking-wide shadow-md transition-colors"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Send Recovery Code
                            </Button>
                        </form>
                    )}

                    {step === 'OTP' && (
                        <form className="space-y-6" onSubmit={handleOtpSubmit}>
                            <Input
                                label="6-Digit OTP Code"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value); setError(""); }}
                                disabled={isLoading}
                                className="text-center text-lg tracking-[0.5em] font-bold"
                                maxLength={6}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full bg-[#05073C] text-white hover:bg-[#D4AF37] py-3.5 rounded-xl font-bold tracking-wide shadow-md transition-colors"
                                isLoading={isLoading}
                                disabled={isLoading || otp.length !== 6}
                            >
                                Verify Code
                            </Button>
                            <div className="text-center text-sm">
                                <button type="button" onClick={handleEmailSubmit} className="text-[#D4AF37] hover:underline font-semibold" disabled={isLoading}>
                                    Resend Code
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'PASSWORD' && (
                        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                disabled={isLoading}
                                required
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="••••••••"
                                value={passwordConfirmation}
                                onChange={(e) => { setPasswordConfirmation(e.target.value); setError(""); }}
                                disabled={isLoading}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full bg-[#05073C] text-white hover:bg-[#D4AF37] py-3.5 rounded-xl font-bold tracking-wide shadow-md transition-colors"
                                isLoading={isLoading}
                                disabled={isLoading || !password || !passwordConfirmation}
                            >
                                Update Password
                            </Button>
                        </form>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="mt-6 flex justify-center">
                            <Button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold tracking-wide shadow-md transition-all"
                            >
                                Go to Login
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Link */}
                {step !== 'SUCCESS' && (
                    <div className="mt-8 text-center text-sm border-t border-gray-100 pt-6">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 font-bold text-gray-400 hover:text-[#05073C] transition-colors"
                        >
                            <FaArrowLeft className="text-xs" /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
