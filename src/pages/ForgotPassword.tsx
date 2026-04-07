import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Ui/Input";
import Button from "../components/Ui/Button";
import ErrorMessage from "../components/Ui/ErrorMessage";
import { forgotPassword } from "../api/authService";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
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
            setSuccess(true);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900 font-serif">
                        Forgot Password
                    </h2>
                    <p className="mt-4 text-sm text-gray-600 font-medium">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {success ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center shadow-sm">
                        <p className="font-bold text-lg mb-2">Check your email</p>
                        <p className="text-sm">We sent a password reset link to <span className="font-semibold text-gray-900">{email}</span></p>
                        
                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full gap-2 font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                <FaArrowLeft /> Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {error && <ErrorMessage message={error} />}

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
                            <div className="space-y-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    disabled={isLoading}
                                    autoComplete="email"
                                    error={error && !email ? "Email is required" : undefined}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#05073C] hover:bg-[#1A365D] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)] transition-all duration-300 text-white py-3.5 rounded-xl border border-transparent hover:border-[#D4AF37] font-bold text-sm tracking-wide"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Reset Password
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <Link
                                to="/login"
                                className="inline-flex flex-row items-center gap-2 font-bold text-gray-500 hover:text-[#05073C] transition-colors"
                            >
                                <FaArrowLeft className="text-xs" /> Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
