import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-auth-modal', handleOpen);
    return () => window.removeEventListener('open-auth-modal', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!email || !password) return;
      login({ id: Date.now().toString(), name: "Traveler", email });
    } else {
      if (!email || !password || !name) return;
      login({ id: Date.now().toString(), name, email });
    }
    setIsOpen(false);
    // Optional: Reset form
    setEmail("");
    setPassword("");
    setName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
        >
          <FaTimes />
        </button>
        
        <h2 className="text-2xl font-bold text-[#05073C] mb-2">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isLogin ? "Log in to view your wishlist and bookings." : "Sign up to start saving your favorite adventures."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#EB662B]" 
                 placeholder="John Doe" 
                 required 
               />
             </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#EB662B]" 
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#EB662B]" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#EB662B] text-white py-2.5 rounded-lg font-bold hover:bg-[#d55822] transition mt-2"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#EB662B] font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
