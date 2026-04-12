import axiosClient from "./axiosClient";

export const askChatbot = async (chatHistory: {sender: string, text: string}[]): Promise<string> => {
  try {
    // Send the entire conversation history context to the powerful backend RAG endpoint (Gemini)
    const conversationContext = chatHistory
      .map(msg => `${msg.sender === 'bot' ? 'Assistant' : 'User'}: ${msg.text}`)
      .join('\n');

    const response = await axiosClient.post("/chat", {
      message: conversationContext
    });

    if (response.data && response.data.answer) {
      return response.data.answer;
    }
    
    return "عذراً، لم أتمكن من استيعاب طلبك. الرجاء المحاولة مرة أخرى.";
  } catch (error: any) {
    console.error("Chatbot Backend API Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالخادم. حاول مجدداً.";
  }
};
