import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { askChatbot } from "../../api/chatService";

const chatbotTranslations = {
  en: {
    greeting: "Hello! I'm Kamet AI 🐫, your personal Egyptian travel assistant. Ask me about tours, souvenirs, hotels, or anything about your trip!",
    placeholder: "Type your message...",
    title: "Kamet AI",
    status: "Online 24/7",
    thinking: "Thinking...",
  },
  ar: {
    greeting: "أهلاً بيك! أنا كامت AI 🐫، المساعد الذكي بتاعك للسياحة في مصر. اسألني عن الرحلات، الهدايا، الفنادق، أو أي حاجة عن رحلتك!",
    placeholder: "اكتب رسالتك هنا...",
    title: "كامت AI",
    status: "متصل 24/7",
    thinking: "بفكر...",
  },
  de: {
    greeting: "Willkommen! Ich bin Kamet AI 🐫, Ihr persönlicher ägyptischer Reiseassistent. Fragen Sie mich zu Touren, Souvenirs, Hotels!",
    placeholder: "Schreiben Sie Ihre Nachricht...",
    title: "Kamet AI",
    status: "Online 24/7",
    thinking: "Denke nach...",
  },
  fr: {
    greeting: "Bonjour ! Je suis Kamet AI 🐫, votre assistant de voyage égyptien personnel. Posez-moi vos questions sur les circuits, souvenirs, hôtels !",
    placeholder: "Tapez votre message...",
    title: "Kamet AI",
    status: "En ligne 24/7",
    thinking: "Réflexion...",
  },
  es: {
    greeting: "¡Hola! Soy Kamet AI 🐫, tu asistente de viaje egipcio personal. ¡Pregúntame sobre tours, souvenirs, hoteles!",
    placeholder: "Escribe tu mensaje...",
    title: "Kamet AI",
    status: "En línea 24/7",
    thinking: "Pensando...",
  },
  it: {
    greeting: "Ciao! Sono Kamet AI 🐫, il tuo assistente di viaggio egiziano personale. Chiedimi di tour, souvenir, hotel!",
    placeholder: "Scrivi il tuo messaggio...",
    title: "Kamet AI",
    status: "Online 24/7",
    thinking: "Sto pensando...",
  }
};

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<keyof typeof chatbotTranslations>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set greeting message on language change
  useEffect(() => {
    const t = chatbotTranslations[lang] || chatbotTranslations['en'];
    setMessages([{ id: 1, text: t.greeting, sender: "bot" }]);
  }, [lang]);

  useEffect(() => {
    const updateLang = () => {
      const code = document.documentElement.lang;
      if (['en', 'ar', 'de', 'fr', 'es', 'it'].includes(code)) {
        setLang(code as keyof typeof chatbotTranslations);
      } else {
        const match = document.cookie.match(/googtrans=\/[a-zA-Z]+\/([a-zA-Z]+)/);
        if (match && match[1]) {
           const c = match[1].toLowerCase();
           if (['en', 'ar', 'de', 'fr', 'es', 'it'].includes(c)) {
             setLang(c as keyof typeof chatbotTranslations);
             return;
           }
        }
        setLang('en');
      }
    };
    
    updateLang();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          updateLang();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessage: Message = { id: Date.now(), text: userText, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await askChatbot(userText);
      const replyMessage: Message = { id: Date.now() + 1, text: reply, sender: "bot" };
      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMsg = lang === 'ar' 
        ? "عذراً، حصل مشكلة في الاتصال. حاول تاني بعد شوية."  
        : "Sorry, there was a connection issue. Please try again shortly.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: errorMsg, sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const t = chatbotTranslations[lang] || chatbotTranslations['en'];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div dir={dir} className="notranslate mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300" translate="no">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#05073C] to-[#1a1d5e] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl">
                <FaRobot />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold leading-none">
                  {t.title}
                  <span className="ml-2 text-[10px] bg-[#EB662B] px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
                </h3>
                <span className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  {t.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                // Reset chat history when closing
                const t = chatbotTranslations[lang] || chatbotTranslations['en'];
                setMessages([{ id: 1, text: t.greeting, sender: "bot" }]);
              }}
              className="text-white/70 hover:text-white transition p-2"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? `bg-[#EB662B] text-white ${lang === 'ar' ? 'rounded-tl-none' : 'rounded-tr-none'}`
                      : `bg-white text-gray-800 border border-gray-100 shadow-sm ${lang === 'ar' ? 'rounded-tr-none' : 'rounded-tl-none'}`
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white text-gray-500 border border-gray-100 shadow-sm p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">{t.thinking}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t border-gray-100 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              dir="auto"
              disabled={isLoading}
              className={`flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B]/30 transition disabled:opacity-50 ${lang === 'ar' ? 'pr-4' : 'pl-4'}`}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-[#EB662B] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d55822] transition shrink-0 shadow-md shadow-orange-500/20"
            >
              <FaPaperPlane className={`text-sm ${lang === 'ar' ? '-scale-x-100' : '-ml-0.5'}`} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          if (isOpen) {
            // Reset chat history when closing via toggle
            const t = chatbotTranslations[lang] || chatbotTranslations['en'];
            setMessages([{ id: 1, text: t.greeting, sender: "bot" }]);
          }
          setIsOpen(!isOpen);
        }}
        className={`${
          isOpen ? "bg-[#05073C]" : "bg-[#EB662B]"
        } w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform duration-300 z-50 group hover:shadow-[#EB662B]/40`}
      >
        {isOpen ? <FaTimes /> : <FaRobot className="group-hover:animate-bounce" />}
      </button>
    </div>
  );
};

export default FloatingChatbot;
