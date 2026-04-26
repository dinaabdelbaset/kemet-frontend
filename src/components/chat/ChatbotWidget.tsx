import React, { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import { askChatbot, resetChatHistory } from "../../api/chatService";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      sender: "bot",
      text: "أهلاً بيك في Kamet Tours! 🐫 أنا المساعد الذكي بتاعك، أقدر أساعدك تحجز رحلات، تشوف فنادق، أو تشتري هدايا من المتجر. إزاي أقدر أساعدك النهاردة؟",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      
      const replyObj = await askChatbot(userText, sessionToken);
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
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[350px] max-w-[90vw] h-[500px] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#05073C] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Kamet Assistant
                <span className="ml-2 text-[10px] bg-[#EB662B] px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
                </h3>
                <p className="text-xs text-white/70">متصل الآن لمساعدتك</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 text-sm scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-[#EB662B] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none"
                  }`}
                  style={{ whiteSpace: "pre-wrap", direction: msg.text.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr' }}
                >
                    {msg.text}
                </div>
              </div>
            ))}
            
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
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EB662B]/50 transition text-sm"
                dir="auto"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition
                  ${isLoading || !inputMessage.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#EB662B] text-white hover:bg-[#d55822] shadow-md"}
                `}
              >
                <FaPaperPlane className="text-sm -ml-1" />
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
