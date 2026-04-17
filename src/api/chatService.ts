const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// =============================================================================
//  DYNAMIC SYSTEM PROMPT — pulls live prices from the database every session
// =============================================================================

const BASE_PROMPT = `أنت "KEMET AI" مساعد كيميت الذكي - مستشار سفر محترف لمنصة KEMET للسياحة المصرية.

🎯 شخصيتك: ودود, خبير سفر مصري, بتمزج عربي وإنجليزي. مش AI. بتفكر وتقترح وتساعد في الحجز.

🧠 مهاراتك:
1. TRIP PLANNER: لما حد يقول "عايز رحلة X يوم" → جدول يوم بيوم (مواعيد+أسعار+تنقلات+فنادق+مطاعم) من البيانات الحقيقية. احسب الميزانية.
2. RECOMMENDATIONS: اسأل (ميزانية/اهتمامات/مدة/مع مين) ورشح من البيانات. Budget→أرخص, Luxury→5 نجوم, تاريخ→متاحف, مغامرة→سفاري.
3. SMART SEARCH: "مطعم رومانسي"→Naguib Mahfouz. "حاجة رخيصة"→Felfela. "سمك"→Farhat. اشرح ليه.
4. BOOKING: قارن خيارات, اعطي أسعار, وجه للصفحة: "روح /hotels → Book Now → ادفع". إلغاء مجاني 48 ساعة.
5. LIVE HELP: رد فوراً بالأسعار/المواعيد/الأماكن من البيانات.
6. PERSONALIZATION: افتكر تفضيلات المستخدم واقترح بناءً عليها.
7. EVENTS: اذكر الفعاليات المناسبة. Sound & Light 500 ج.م, Dervishes مجاناً.
8. NAVIGATION: كل وسائل المواصلات بالأسعار. Uber/Careem للتنقل الداخلي.
9. REVIEWS: استخدم التقييمات. 4.5+=ممتاز. 5000+ عميل بتقييم 4.9⭐.
10. DEALS: اذكر العروض بذكاء. قارن الخيارات. اقترح bundles.

📋 الصفحات: /flights /transportation /hotels /tours /packages /activities /safari /restaurants /events /museums /bazaars /shop /ai-planner /search /wishlist /bookings /checkout /explore/:city /reviews /contact /support
💰 كل الأسعار بالجنيه المصري (ج.م). حوّل بأسعار الصرف لما يُطلب.
💳 دفع: جنيه كاش, فيزا/ماستركارد, PayPal, كاش عند الوصول.
🗣️ رد بنفس لغة المستخدم.
🏆 افهم→اسأل→رشح→قارن→ساعد في الحجز→تابع!`;



// ---------------------------------------------------------------------------
//  Fetch live data from backend (cached per browser session)
// ---------------------------------------------------------------------------
let cachedContext: string | null = null;
let contextFetchPromise: Promise<string> | null = null;

async function fetchLiveContext(): Promise<string> {
  // Return cached if we already have it
  if (cachedContext) return cachedContext;

  // If a fetch is in progress, wait for it
  if (contextFetchPromise) return contextFetchPromise;

  contextFetchPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE}/chatbot-context`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Build context string from live data
      const sections: string[] = [];

      if (data.destinations) {
        sections.push(`📍 DESTINATIONS: ${data.destinations}`);
      }
      if (data.hotels) {
        sections.push(`🏨 HOTELS (with live prices):\n${data.hotels}`);
      }
      if (data.tours) {
        sections.push(`🏛️ TOURS & PACKAGES (with prices):\n${data.tours}`);
      }
      if (data.restaurants) {
        sections.push(`🍽️ RESTAURANTS (with price ranges):\n${data.restaurants}`);
      }
      if (data.safaris) {
        sections.push(`🏜️ SAFARIS & ACTIVITIES (with prices):\n${data.safaris}`);
      }
      if (data.museums) {
        sections.push(`🎭 MUSEUMS & LANDMARKS (with ticket prices):\n${data.museums}`);
      }
      if (data.products) {
        sections.push(`🛍️ SOUVENIR SHOP (with prices):\n${data.products}`);
      }
      if (data.deals) {
        sections.push(`🔥 CURRENT DEALS & OFFERS:\n${data.deals}`);
      }
      if (data.bazaars) {
        sections.push(`🛒 BAZAARS & MARKETS:\n${data.bazaars}`);
      }
      if (data.events) {
        sections.push(`🎪 EVENTS & FESTIVALS (with prices):\n${data.events}`);
      }
      if (data.transportation) {
        sections.push(`🚗 TRANSPORTATION OPTIONS (with prices in EGP):\n${data.transportation}`);
      }
      if (data.exchange_rates) {
        sections.push(`💱 LIVE EXCHANGE RATES (updated today - use for currency conversion):\n${data.exchange_rates}`);
      }

      cachedContext = sections.join("\n\n");
      return cachedContext;
    } catch (err) {
      console.warn("Could not fetch chatbot context:", err);
      cachedContext = ""; // Empty - chatbot will work with base knowledge only
      return cachedContext;
    } finally {
      contextFetchPromise = null;
    }
  })();

  return contextFetchPromise;
}

// Build the full system prompt with live data
async function getFullSystemPrompt(): Promise<string> {
  const liveData = await fetchLiveContext();
  if (liveData) {
    return `${BASE_PROMPT}\n\n--- LIVE DATABASE PRICES (use these exact numbers when users ask) ---\n${liveData}`;
  }
  return BASE_PROMPT;
}

// ---------------------------------------------------------------------------
//  Conversation history management
// ---------------------------------------------------------------------------
const MAX_HISTORY = 30;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

let conversationHistory: ChatMessage[] = [];

// ---------------------------------------------------------------------------
//  Main chat function
// ---------------------------------------------------------------------------

/**
 * Send a message to Groq and get a response.
 * Accepts either a string (single message) or the full chat history array.
 */
export const askChatbot = async (
  input: string | { sender: string; text: string }[]
): Promise<string> => {
  try {
    // Extract the user message and compute chat history
    let userMessage: string;
    let history: {role: string, content: string}[] = [];

    if (typeof input === "string") {
      userMessage = input;
    } else {
      const lastUserMsg = [...input].reverse().find((m) => m.sender === "user");
      userMessage = lastUserMsg?.text || "";

      // Convert prior messages to standard AI format
      // filter out the last user message so it's not duplicated
      const previousMessages = input.slice(0, input.length - 1);
      history = previousMessages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));
    }

    if (!userMessage.trim()) {
      return "لم أفهم رسالتك، ممكن تعيد تاني؟ 😊";
    }

    const token = localStorage.getItem("token");
    const fetchHeaders: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    // Attach token if user is logged in so backend can save to their account
    if (token) {
      fetchHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({
        message: userMessage,
        history: history
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("AI Output:", data); 
      
      if (data && data.answer) {
        return data.answer;
      }
      
      return `عذراً، مقدرتش أرد دلوقتي. الرد اللي رجع: ${JSON.stringify(data)}`;
    }

    return "حصل خطأ في الاتصال بالسيرفر، جرب تاني 🔄";
  } catch (error: any) {
    if (error.name === "AbortError") {
      return "تم إلغاء الاتصال. حاول مرة تانية ❌";
    }
    console.error("Error asking Chatbot :", error);
    return "حصل مشكلة في الاتصال، تأكد من الإنترنت وجرب تاني 🔄";
  }
};

/**
 * Fetch prior chat history securely from database for the logged-in user.
 */
export const fetchChatHistory = async (): Promise<{sender: string, text: string}[]> => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE}/chat/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error("Failed to load chat history:", e);
  }
  return [];
};

/** Reset conversation history and clear cached context */
export const resetChatHistory = () => {
  conversationHistory = [];
};

/** Force refresh prices from the database (call after admin updates) */
export const refreshPrices = () => {
  cachedContext = null;
  contextFetchPromise = null;
};
