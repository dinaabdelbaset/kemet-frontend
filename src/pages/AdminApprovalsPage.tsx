import { useState, useEffect } from "react";
import axiosClient from "../api/axios";
import { FaCheck, FaTimes, FaBuilding, FaExclamationTriangle } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function AdminApprovalsPage() {
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useApp();

  const fetchPendingItems = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get("/admin/approvals/pending");
      setPendingItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch pending items", true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const handleModerate = async (id: number, type: string, action: "approve" | "reject") => {
    let reason = "";
    if (action === "reject") {
      reason = window.prompt("برجاء كتابة سبب الرفض:") || "";
      if (!reason) return; // cancel
    }

    try {
      await axiosClient.post(`/admin/approvals/${type}/${id}`, { action, reason });
      showToast(`تم ${action === 'approve' ? 'القبول' : 'الرفض'} بنجاح`);
      setPendingItems((prev) => prev.filter((item) => item.id !== id || item.type !== type));
    } catch (err) {
      console.error(err);
      showToast("Operation failed", true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#05073C] mb-2 flex items-center gap-3">
            <FaExclamationTriangle className="text-[#EB662B]" />
            طلبات الشركات المعلقة
          </h1>
          <p className="text-gray-500">راجع الطلبات المقدمة من الشركات للنشر على الموقع</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">جاري التحميل...</div>
      ) : pendingItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات معلقة</h3>
          <p className="text-gray-500">لقد قمت بمراجعة جميع طلبات الشركات بنجاح!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-48">
                <img src={item.image || "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600"} alt={item.title} className="w-full h-full object-cover" />
                <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full shadow ${item.action_type === 'delete' ? 'bg-red-500' : item.action_type === 'update' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                  {item.action_type === 'delete' ? 'طلب حذف' : item.action_type === 'update' ? 'طلب تعديل' : 'طلب إضافة'}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 text-[#05073C] text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1 uppercase">
                  <FaBuilding /> {item.type}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                  الموقع: {item.location}
                </p>
                <div className="flex items-center justify-between font-bold text-[#05073C] mb-6">
                  <span>السعر:</span>
                  <span>${item.price || 0}</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleModerate(item.id, item.type, 'approve')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-bold transition flex justify-center items-center gap-2"
                  >
                    <FaCheck /> قبول
                  </button>
                  <button 
                    onClick={() => handleModerate(item.id, item.type, 'reject')}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-xl font-bold transition flex justify-center items-center gap-2"
                  >
                    <FaTimes /> رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
