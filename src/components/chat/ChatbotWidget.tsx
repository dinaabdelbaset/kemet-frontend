import React, { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaGlobe } from "react-icons/fa";
import { askChatbot, resetChatHistory } from "../../api/chatService";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const greetingsMap: Record<string, string> = {
  auto: "أهلاً بيك في Kemet Tours! 🐫 أنا المساعد الذكي بتاعك، أقدر أساعدك تحجز رحلات، تشوف فنادق، أو تشتري هدايا من المتجر. إزاي أقدر أساعدك النهاردة؟",
  ar: "أهلاً بك في Kemet Tours! 🐫 أنا مساعدك الذكي الخاص بالسياحة المصرية. أستطيع مساعدتك في التخطيط لرحلتك، حجز الفنادق، الأنشطة، وزيارة المتاحف. كيف يمكنني مساعدتك اليوم؟",
  en: "Welcome to Kemet Tours! 🐫 I am your AI travel assistant. I can help you plan your trip, book hotels, activities, and purchase souvenirs. How can I assist you today?",
  fr: "Bienvenue chez Kemet Tours ! 🐫 Je suis votre assistant de voyage IA. Je peux vous aider à planifier votre voyage, réserver des hôtels, des activités et acheter des souvenirs. Comment puis-je vous aider aujourd'hui ?",
  de: "Willkommen bei Kemet Tours! 🐫 Ich bin Ihr KI-Reiseassistent. Ich kann Ihnen helfen, Ihre Reise zu planen, Hotels, Aktivitäten zu buchen und Souvenirs zu kaufen. Wie kann ich Ihnen heute helfen?",
  it: "Benvenuto in Kemet Tours! 🐫 Sono il tuo assistente di viaggio AI. Posso aiutarti a pianificare il tuo viaggio, prenotare hotel, attività e acquistare souvenir. Come posso aiutarti oggi?"
};

const placeholders: Record<string, string> = {
  auto: "اكتب سؤالك بأي لغة / Type in any language...",
  ar: "اكتب سؤالك هنا...",
  en: "Type your message here...",
  fr: "Écrivez votre message ici...",
  de: "Geben Sie Ihre Nachricht hier ein...",
  it: "Scrivi qui il tuo messaggio..."
};

const getBookingGuideResponse = (text: string, lang: string): string | null => {
  const cleanText = text.toLowerCase().trim();
  const selectedLang = lang.toLowerCase();

  // 1. Intercept Generic Greetings
  const greetings = [
    "هاي", "هاى", "hi", "hello", "hey", "أهلاً", "اهلاً", "أهلا", "اهلا", 
    "سلام", "السلام عليكم", "سلام عليكم", "صباح الخير", "مساء الخير", 
    "good morning", "good evening", "صباح الورد", "مساء الورد"
  ];
  
  if (greetings.includes(cleanText)) {
    if (selectedLang === 'ar') {
      return `أهلاً بحضرتك يا فندم في كيميت مصر للسياحة! 🌸 يسعدني جداً أن أكون كونسيرج السفر الخاص بك اليوم. هل تحب أن نبدأ باستكشاف الفنادق الفاخرة 🏨، برامج الرحلات الممتعة 🏛️، أم رحلات السفاري المشوقة 🏜️؟`;
    } else if (selectedLang === 'en') {
      return `Hello! Welcome to Kemet Egypt Tourism. 🌸 I am absolutely delighted to assist you today in planning your perfect trip to Egypt. Would you like to explore our hotels 🏨, custom tour programs 🏛️, or safari adventures 🏜️?`;
    } else if (selectedLang === 'fr') {
      return `Bonjour ! Bienvenue chez Kemet Égypte Tourisme. 🌸 Je suis ravi de vous aider aujourd'hui à planifier votre voyage idéal en Égypte. Souhaitez-vous explorer nos hôtels 🏨, nos programmes de visites personnalisés 🏛️ ou nos aventures de safari 🏜️ ?`;
    } else if (selectedLang === 'de') {
      return `Hallo! Willkommen bei Kemet Ägypten Tourismus. 🌸 Ich freue mich sehr, Ihnen heute bei der Planung Ihrer perfekten Reise nach Ägypten zu helfen. Möchten Sie unsere Hotels 🏨, maßgeschneiderten Tourenprogramme 🏛️ oder Safari-Abenteuer 🏜️ erkunden?`;
    } else if (selectedLang === 'it') {
      return `Ciao! Benvenuto a Kemet Egitto Turismo. 🌸 Sono assolutamente felice di assisterti oggi nella pianificazione del tuo viaggio perfetto in Egitto. Vorresti esplorare i nostri hotel 🏨, programmi di tour personalizzati 🏛️ o avventure safari 🏜️ ?`;
    } else {
      const hasEnglish = /[a-zA-Z]/.test(cleanText);
      if (hasEnglish) {
        return `Hello! Welcome to Kemet Egypt Tourism. 🌸 I am absolutely delighted to assist you today in planning your perfect trip to Egypt. Would you like to explore our hotels 🏨, custom tour programs 🏛️, or safari adventures 🏜️?`;
      } else {
        return `أهلاً بحضرتك يا فندم في كيميت مصر للسياحة! 🌸 يسعدني جداً أن أكون كونسيرج السفر الخاص بك اليوم. هل تحب أن نبدأ باستكشاف الفنادق الفاخرة 🏨، برامج الرحلات الممتعة 🏛️، أم رحلات السفاري المشوقة 🏜️؟`;
      }
    }
  }

  // 2. Intercept How-to-book questions
  const isBookingQuestion = 
    (cleanText.includes("احجز") && (cleanText.includes("ازاي") || cleanText.includes("ازى") || cleanText.includes("طريقة") || cleanText.includes("طريقه") || cleanText.includes("كيف") || cleanText.includes("عايز") || cleanText.includes("عاوز") || cleanText.includes("بدء") || cleanText.includes("خطوات"))) ||
    cleanText.includes("how to book") || 
    cleanText.includes("how do i book") ||
    cleanText.includes("how can i book") ||
    cleanText.includes("comment réserver") ||
    cleanText.includes("wie buche ich") ||
    cleanText.includes("come prenotare");

  if (isBookingQuestion) {
    if (selectedLang === 'ar') {
      return `يا فندم، الحجز على كيميت سهل جداً وبسيط! كل اللي عليك تتبع الخطوات دي:
1. **اختار الحاجة اللي عاوز تحجزها** من الموقع (سواء فنادق 🏨، رحلات سياحية 🏛️، سفاري 🏜️، متاحف 🎭، فعاليات 🎪، أو مواصلات 🚗).
2. **ادخل على صفحة الخدمة** دي واضغط على زر الحجز (**Book Now**) أو إتمام الحجز عشان تنتقل لصفحة الدفع.
3. **ادفع بالطريقة المناسبة ليك** من الطرق المتاحة على كيميت (عندنا دفع بالجنيه كاش، فيزا/ماستركارد، PayPal، أو كاش عند الوصول).
4. **أول ما تدفع**، هيجيلك رسالة تأكيد (SMS وإيميل) فوراً بتفاصيل الحجز، وكمان تقدر تتابع حجزك وتشوف كل التفاصيل في أي وقت من صفحة [حجوزاتي](/bookings) 😊.`;
    } else if (selectedLang === 'en' || selectedLang === 'auto') {
      return `To book on Kemet, just follow these simple steps:
1. Choose the service you want to book (Hotels 🏨, Tours 🏛️, Safaris Desert 🏜️, Museums 🎭, Events 🎪, or Transportation 🚗).
2. Go to its page and click on the booking button ("Book Now") to proceed to checkout.
3. Pay using your preferred payment method (we accept EGP cash, Visa/Mastercard, PayPal, or cash on arrival).
4. As soon as payment is successful, you will instantly receive a confirmation SMS and email with all booking details. You can always track your bookings under your [My Bookings](/bookings) page!`;
    } else if (selectedLang === 'fr') {
      return `Pour réserver sur Kemet, suivez simplement ces étapes :
1. Choisissez le service (Hôtels 🏨, Excursions 🏛️, Safaris 🏜️, Musées 🎭, Événements 🎪, ou Transports 🚗).
2. Allez sur sa page et cliquez sur le bouton de réservation ("Book Now") pour passer à la caisse.
3. Payez via votre méthode préférée (espèces EGP, Visa/Mastercard, PayPal, ou paiement à l'arrivée).
4. Dès la validation du paiement, vous recevrez un SMS et un e-mail de confirmation. Vous pouvez suivre vos réservations sur votre page [Mes Réservations](/bookings) !`;
    } else if (selectedLang === 'de') {
      return `So buchen Sie auf Kemet:
1. Wählen Sie den gewünschten Service (Hotels 🏨, Touren 🏛️, Safaris 🏜️, Museen 🎭, Events 🎪 oder Transport 🚗).
2. Gehen Sie auf die entsprechende Seite und klicken Sie auf die Schaltfläche "Book Now", um zur Kasse zu gelangen.
3. Bezahlen Sie mit Ihrer bevorzugten Methode (EGP bar, Visa/Mastercard, PayPal oder Barzahlung bei Ankunft).
4. Sobald die Zahlung erfolgreich war, erhalten Sie sofort eine SMS und eine E-Mail-Bestätigung. Sie können Ihre Buchungen jederzeit auf der Seite [Meine Buchungen](/bookings) einsehen!`;
    } else if (selectedLang === 'it') {
      return `Per prenotare su Kemet, segui questi passaggi :
1. Scegli il servizio desiderato (Hotel 🏨, Tour 🏛️, Safari 🏜️, Musei 🎭, Eventi 🎪 o Trasporti 🚗).
2. Vai alla pagina relativa e clicca su "Book Now" per procedere al pagamento.
3. Paga con il metodo preferito (contanti EGP, Visa/Mastercard, PayPal o contanti all'arrivo).
4. Non appena il pagamento andrà a buon fine, riceverai un SMS e un'e-mail di conferma. Puoi monitorare la tua prenotazione nella pagina [Le Mie Prenotazioni](/bookings) !`;
    }
  }
  return null;
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<string>(() => localStorage.getItem("kemet_chat_lang") || "auto");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize intro message based on current language
  useEffect(() => {
    setMessages([
      {
        id: "intro-1",
        sender: "bot",
        text: greetingsMap[chatLanguage] || greetingsMap.auto,
      },
    ]);
  }, []);

  // Handle language switch
  const handleLanguageChange = (newLang: string) => {
    setChatLanguage(newLang);
    localStorage.setItem("kemet_chat_lang", newLang);

    // If conversation is fresh, replace intro. Otherwise append system notice.
    if (messages.length <= 1) {
      setMessages([
        {
          id: "intro-1",
          sender: "bot",
          text: greetingsMap[newLang] || greetingsMap.auto
        }
      ]);
    } else {
      const switchNotices: Record<string, string> = {
        auto: "🔄 Chatbot set to Auto-Detect. The AI will translate and reply in your input language.",
        ar: "🇪🇬 تم تحويل لغة الشات بوت إلى العربية. سأجيبك بالعربية الآن.",
        en: "🇺🇸 Chat language updated to English.",
        fr: "🇫🇷 Langue du chatbot changée en Français.",
        de: "🇩🇪 Chatbot-Sprache auf Deutsch aktualisiert.",
        it: "🇮🇹 Lingua del chatbot aggiornata in Italiano."
      };
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "bot",
          text: switchNotices[newLang] || `Language updated.`
        }
      ]);
    }
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newUserMsg: Message = { id: Date.now().toString(), sender: "user", text: userText };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let sessionToken = localStorage.getItem('kemet_chat_session');
      if (!sessionToken) {
        sessionToken = Math.random().toString(36).substring(7);
        localStorage.setItem('kemet_chat_session', sessionToken);
      }
      
      const localResponse = getBookingGuideResponse(userText, chatLanguage);
      let replyObj;
      if (localResponse) {
        replyObj = { answer: localResponse };
      } else {
        replyObj = await askChatbot(userText, sessionToken, false, chatLanguage);
      }
      const newBotMsg: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: replyObj.answer };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: "عذراً، هناك مشكلة في الاتصال بالخادم الآن." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[360px] max-w-[90vw] h-[520px] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#05073C] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Kemet Assistant
                <span className="ml-2 text-[9px] bg-[#EB662B] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">AI</span>
                </h3>
                <p className="text-[10px] text-white/70">متصل الآن لمساعدتك</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Sleek Language Switcher */}
              <div className="flex items-center bg-white/10 hover:bg-white/20 rounded-xl px-2.5 py-1 text-xs border border-white/10 transition">
                <FaGlobe className="text-white/80 mr-1 text-[11px]" />
                <select
                  value={chatLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer font-bold text-[10px] pr-1 border-none appearance-none outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="auto" className="bg-[#05073C] text-white">🌐 Auto</option>
                  <option value="ar" className="bg-[#05073C] text-white">🇪🇬 عربي</option>
                  <option value="en" className="bg-[#05073C] text-white">🇺🇸 EN</option>
                  <option value="fr" className="bg-[#05073C] text-white">🇫🇷 FR</option>
                  <option value="de" className="bg-[#05073C] text-white">🇩🇪 DE</option>
                  <option value="it" className="bg-[#05073C] text-white">🇮🇹 IT</option>
                </select>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition p-1"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 text-sm scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((msg) => {
              const isSystem = msg.id.startsWith("sys-");
              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center py-1 select-none animate-in fade-in">
                    <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium italic border border-gray-200/50">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-[#EB662B] text-white rounded-tr-none shadow-md"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none"
                    }`}
                    style={{ whiteSpace: "pre-wrap", direction: msg.text.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr' }}
                  >
                      {msg.text}
                  </div>
                </div>
              );
            })}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white text-gray-800 border border-gray-200 shadow-sm p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={placeholders[chatLanguage] || placeholders.auto}
                className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EB662B]/50 transition text-xs font-bold"
                dir="auto"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0
                  ${isLoading || !inputMessage.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#EB662B] text-white hover:bg-[#d55822] shadow-md"}
                `}
              >
                <FaPaperPlane className="text-xs -ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isOpen ? "bg-white text-gray-800" : "bg-[#05073C] text-white"}
        `}
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaCommentDots className="text-2xl" />}
      </button>
    </div>
  );
};

export default ChatbotWidget;
