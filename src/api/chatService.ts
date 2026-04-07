import axios from "axios";

// Accessing the Groq API Key securely via environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "fallback_key_or_error";

export const askChatbot = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", 
        messages: [
          {
            role: "system",
            content: "أنت مساعد ذكي لشركة سياحة وبيع منتجات فرعونية وفنادق ومواصلات في مصر اسمها Kamet Tours. قم بالرد باللغة العربية بأسلوب ودود ومختصر لمساعدة العملاء في استفساراتهم وفي تصفح المنصة."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    return "عذراً، لم أتمكن من استيعاب طلبك. الرجاء المحاولة مرة أخرى.";
  } catch (error: any) {
    console.error("Groq API Error:", error.response ? error.response.data : error.message);
    const details = error.response?.data?.error?.message || error.message;
    return `عذراً، حدث خطأ في الاتصال: ${details}`;
  }
};
