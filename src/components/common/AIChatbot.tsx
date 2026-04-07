import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, sender: "bot", text: "Hello! 👋 I'm your AI Travel Assistant. How can I help you plan your next adventure today?" }
];

const QUICK_REPLIES = [
  "Find me a hotel in Cairo",
  "Suggest a Safari trip",
  "How to book?"
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMsg: Message = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botReply = "That sounds exciting! Let me check our best options for you... Currently, I'm just a demo chatbot but our real agents would love to help you with that!";
      
      if (text.toLowerCase().includes("hotel") && text.toLowerCase().includes("cairo")) {
         botReply = "Cairo is beautiful! I recommend checking 'The St. Regis Cairo' or 'Marriott Mena House' near the Pyramids. Shall I open the Hotels page for you?";
      } else if (text.toLowerCase().includes("safari")) {
         botReply = "We have amazing Safari packages! From the depths of the Sinai desert to the wild plains of Kenya. Check out the 'Kenya vs Tanzania Safari' in our Safari section.";
      } else if (text.toLowerCase().includes("book")) {
         botReply = "Booking is easy! Just navigate to any Hotel or Tour page, select your dates, and click 'Book Now'. The Checkout process takes less than 2 minutes.";
      }

      setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
      >
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#cd4f3c] hover:bg-[#b03c2b] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-orange-500/50 transition-all hover:-translate-y-1 relative group"
        >
          <FaRobot className="text-2xl" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
        }`}
        style={{ height: "600px", maxHeight: "80vh" }}
      >
        {/* Chat Header */}
        <div className="bg-[#cd4f3c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
               <FaRobot className="text-xl" />
             </div>
             <div>
               <h3 className="font-bold leading-tight">AI Travel Assistant</h3>
               <p className="text-xs text-white/80 font-medium flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
               </p>
             </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#fcfbf9] space-y-4">
          {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[80%] p-3 text-sm ${
                    msg.sender === "user" 
                      ? "bg-[#14213d] text-white rounded-2xl rounded-tr-sm" 
                      : "bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
             </div>
          ))}
          
          {isTyping && (
             <div className="flex justify-start">
               <div className="max-w-[80%] p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 pb-2 bg-[#fcfbf9] flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply, i) => (
              <button 
                key={i}
                onClick={() => handleSend(reply)}
                className="text-xs px-3 py-1.5 bg-white border border-[#cd4f3c]/20 text-[#cd4f3c] hover:bg-[#cd4f3c] hover:text-white rounded-full transition-colors font-medium shadow-sm"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100">
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
             className="flex items-center gap-2"
           >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#cd4f3c]"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-[#cd4f3c] hover:bg-[#b03c2b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition flex-shrink-0"
              >
                <FaPaperPlane className="text-sm ml-[-2px]" />
              </button>
           </form>
        </div>

      </div>
    </>
  );
};

export default AIChatbot;
