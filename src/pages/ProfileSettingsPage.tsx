import SectionWrapper from "@/components/sections/SectionWrapper";
import { useApp } from "@/context/AppContext";
import { useState, useRef } from "react";
import { FaUserEdit, FaLock, FaBell, FaGlobe, FaSpinner, FaCamera } from "react-icons/fa";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { updateProfile } from "@/api/authService";

const ProfileSettingsPage = () => {
  const { user, updateUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState("personal");

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (email) formData.append("email", email);
      if (phone) formData.append("phone", phone);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await updateProfile(formData);
      
      if (res.success) {
        showToast("Personal information updated successfully!", false);
        // Map the backend updates to our global specific user context
        updateUser({
          name: res.user.name,
          email: res.user.email,
          phone: res.phone || phone,
          avatar: res.avatar_url || avatarPreview || user?.avatar
        });
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update profile", true);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match!", true);
      return;
    }
    
    setIsSavingPassword(true);
    try {
      const payload = {
        current_password: currentPassword,
        new_password: newPassword
      };
      
      const res = await updateProfile(payload); // updateProfile endpoint handles password too
      
      if (res.success) {
        showToast("Password changed successfully!", false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update password", true);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen overflow-hidden">
      
      {/* Animated Slim Header Banner */}
      <div className="relative pt-[100px] pb-8 overflow-hidden bg-gradient-to-b from-white to-[#fcfbf9] dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-[#EB662B]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDirection: 'alternate' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4">
           <div className="inline-flex items-center gap-3 mb-2 animate-fade-in-up">
              <div className="p-2.5 bg-[#EB662B]/10 rounded-xl border border-[#EB662B]/20 shadow-sm">
                <FaUserEdit className="text-[#EB662B] text-xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#14213d] dark:text-white drop-shadow-sm">
                Account Settings
              </h1>
           </div>
           <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
             Manage your personal information, security, and preferences.
           </p>
        </div>
      </div>

      <SectionWrapper className="pb-16 pt-8 relative z-20">
        <div className="max-w-5xl mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {/* Navigation Sidebar */}
             <div className="md:col-span-1 space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button 
                  onClick={() => setActiveTab("personal")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${
                    activeTab === "personal" ? "bg-[#14213d] dark:bg-[#EB662B] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <FaUserEdit className="text-lg" /> Personal Info
                </button>
                <button 
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${
                    activeTab === "security" ? "bg-[#14213d] dark:bg-[#EB662B] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <FaLock className="text-lg" /> Security
                </button>
             </div>

             {/* Content Area */}
             <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: '0.3s' }}>
                {activeTab === "personal" && (
                  <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-[#14213d] dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">Personal Information</h2>
                    
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                      <div className="relative w-24 h-24 rounded-full flex items-center justify-center font-bold text-white shadow-inner bg-gray-100 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg group">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="User Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#f4a261] to-[#EB662B] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <FaCamera className="text-2xl text-white" />
                        </button>
                      </div>
                      <div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-5 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-[#14213d] dark:text-gray-200 rounded-xl font-bold text-sm transition shadow-sm">
                          Change Avatar
                        </button>
                        <p className="text-xs text-gray-400 mt-2 font-medium">JPG, JPEG or PNG. Max size 2MB.</p>
                      </div>
                      <div className="ml-auto bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] shadow-sm">
                        <span className="text-xs font-bold text-[#EB662B] uppercase tracking-wider mb-1">Your Points</span>
                        <span className="text-3xl font-black text-[#14213d] dark:text-white">{user?.points || 0}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition text-gray-900 dark:text-white" />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition text-gray-900 dark:text-white" />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Phone Number</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 123 456 7890" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition text-gray-900 dark:text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <DateTimePicker compact showTime={false} initialDate={{ day: 1, month: 1, year: 1990 }} accentColor="#EB662B" />
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                      <button type="submit" disabled={isSavingProfile} className="bg-[#EB662B] hover:bg-[#d55822] hover:-translate-y-1 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
                        {isSavingProfile ? <FaSpinner className="animate-spin text-lg" /> : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "security" && (
                  <form onSubmit={handleSavePassword} className="space-y-6 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-[#14213d] dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">Security Settings</h2>
                    <div className="space-y-4 max-w-md">
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition text-gray-900 dark:text-white" />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition text-gray-900 dark:text-white" />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
                      <button type="submit" disabled={isSavingPassword} className="bg-[#14213d] dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 hover:-translate-y-1 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2">
                        {isSavingPassword ? <FaSpinner className="animate-spin text-lg" /> : "Update Password"}
                      </button>
                    </div>
                  </form>
                )}
             </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ProfileSettingsPage;
