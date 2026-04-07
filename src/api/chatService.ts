import axios from "axios";

// Accessing the Groq API Key securely via environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "fallback_key_or_error";

export const askChatbot = async (chatHistory: {sender: string, text: string}[]): Promise<string> => {
  try {
    // Convert our internal message format to Groq's format
    const formattedMessages = chatHistory.map(msg => ({
      role: msg.sender === "bot" ? "assistant" : "user",
      content: msg.text
    }));

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", 
        messages: [
          {
            role: "system",
            content: "أنت موظف مبيعات سياحي محترف، مبدع، ومرح جداً لشركة Kamet Tours. هدفك الأساسي مساعدة العملاء في اختيار رحلاتهم، تقديم اقتراحات ذكية، وإقناعهم بإتمام الحجز بأسلوب جذاب. السلوك المطلوب: 1. استخدم إيموجي مبهجة 🥳✈️ وعبارات تسويقية إبداعية (مثل: تجربة العمر، سحر مصر). 2. تفاعل كالخبير: تخاطب مع العميل واسأله عن تفضيلاته (الهدوء أم المغامرة؟ الميزانية؟ عدد الأفراد؟) لتفصيل رحلة تناسبه تماماً. 3. اقترح بثقة وشجع على الحجز: بعد معرفة التفاصيل، اقترح عليه خيارات محددة وقم بتوجيهه بذكاء لإنهاء الحجز (مثال: 'يلا نرتبلك أجمل رحلة، تحب نبدأ خطوات الحجز دلوقتي في الفندق ده؟'). 4. تذكر دائماً كل تفاصيل المحادثة السابقة. 5. اجعل ردودك قصيرة، دردشة طبيعية، وتنتهي دائماً بسؤال تصعيدي وتوجيه نحو الحجز."
          },
          ...formattedMessages
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
