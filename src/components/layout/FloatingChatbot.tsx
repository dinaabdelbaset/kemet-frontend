import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaMicrophone, FaCamera, FaPhone, FaPhoneSlash, FaMicrophoneSlash, FaHeadset, FaVolumeUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { askChatbot, resetChatHistory, fetchChatHistory } from "../../api/chatService";
import axiosClient from "../../api/axiosClient";

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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const renderMessageContent = (text: string, isBot: boolean, langCode: string) => {
  if (!isBot || typeof text !== "string") return text;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  if (!linkRegex.test(text)) {
    return text;
  }

  linkRegex.lastIndex = 0;

  const parts = [];
  let lastIndex = 0;
  let match;
  let keyOffset = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${keyOffset++}`}>{text.substring(lastIndex, match.index)}</span>);
    }

    const linkText = match[1];
    const linkUrl = match[2];
    const isExternal = linkUrl.startsWith('http');

    const btnClass = `inline-flex items-center justify-center mt-2 mb-1 px-4 py-1.5 bg-gradient-to-r from-[#05073C] to-[#1a1d5e] hover:from-[#EB662B] hover:to-[#d55822] text-white text-xs font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105 mx-1 decoration-transparent no-underline`;

    if (isExternal) {
      parts.push(
        <a key={`link-${keyOffset++}`} href={linkUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
          {linkText}
        </a>
      );
    } else {
      parts.push(
        <Link key={`link-${keyOffset++}`} to={linkUrl} className={btnClass}>
          {linkText}
        </Link>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${keyOffset++}`}>{text.substring(lastIndex)}</span>);
  }

  return <>{parts}</>;
};

// Smart utility function to filter out bot's own voice echo/feedback
const isSelfFeedback = (transcript: string, botText: string): boolean => {
  if (!botText) return false;

  const clean = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1); // Ignore single letter noises
  };

  const tWords = clean(transcript);
  const bWords = clean(botText);

  if (tWords.length === 0) return true; // Empty transcripts or punctuation only

  let matches = 0;
  for (const word of tWords) {
    if (bWords.includes(word)) {
      matches++;
    }
  }

  const ratio = matches / tWords.length;
  console.log(`Self-feedback check ratio: ${ratio} (matches: ${matches}/${tWords.length})`);
  return ratio >= 0.6; // If 60%+ words overlap, it is highly likely echo
};

const getBookingGuideResponse = (text: string): string | null => {
  const cleanText = text.toLowerCase().trim();

  // 1. Intercept Generic Greetings
  const greetings = [
    "هاي", "هاى", "hi", "hello", "hey", "أهلاً", "اهلاً", "أهلا", "اهلا", 
    "سلام", "السلام عليكم", "سلام عليكم", "صباح الخير", "مساء الخير", 
    "good morning", "good evening", "صباح الورد", "مساء الورد"
  ];
  if (greetings.includes(cleanText)) {
    const hasEnglish = /[a-zA-Z]/.test(cleanText);
    if (hasEnglish) {
      return `Hello! Welcome to Kemet Egypt Tourism. 🌸 I am absolutely delighted to assist you today in planning your perfect trip to Egypt. Would you like to explore our hotels 🏨, custom tour programs 🏛️, or safari adventures 🏜️?`;
    } else {
      return `أهلاً بحضرتك يا فندم في كيميت مصر للسياحة! 🌸 يسعدني جداً أن أكون كونسيرج السفر الخاص بك اليوم. هل تحب أن نبدأ باستكشاف الفنادق الفاخرة 🏨، برامج الرحلات الممتعة 🏛️، أم رحلات السفاري المشوقة 🏜️؟`;
    }
  }

  // 2. Intercept How-to-book questions
  const isBookingQuestion =
    (cleanText.includes("احجز") && (cleanText.includes("ازاي") || cleanText.includes("ازى") || cleanText.includes("طريقة") || cleanText.includes("طريقه") || cleanText.includes("كيف") || cleanText.includes("عايز") || cleanText.includes("عاوز") || cleanText.includes("بدء") || cleanText.includes("خطوات"))) ||
    cleanText.includes("how to book") ||
    cleanText.includes("how do i book") ||
    cleanText.includes("how can i book");

  if (isBookingQuestion) {
    const hasEnglish = /[a-zA-Z]/.test(cleanText);
    if (hasEnglish) {
      return `To book on Kemet, just follow these simple steps:
1. Choose the service you want to book (Hotels 🏨, Tours 🏛️, Safaris Desert 🏜️, Museums 🎭, Events 🎪, or Transportation 🚗).
2. Go to its page and click on the booking button ("Book Now") to proceed to checkout.
3. Pay using your preferred payment method (we accept EGP cash, Visa/Mastercard, PayPal, or cash on arrival).
4. As soon as payment is successful, you will instantly receive a confirmation SMS and email with all booking details. You can always track your bookings under your [My Bookings](/bookings) page!`;
    } else {
      return `يا فندم، الحجز على كيميت سهل جداً وبسيط! كل اللي عليك تتبع الخطوات دي:
1. **اختار الحاجة اللي عاوز تحجزها** من الموقع (سواء فنادق 🏨، رحلات سياحية 🏛️، سفاري 🏜️، متاحف 🎭، فعاليات 🎪، أو مواصلات 🚗).
2. **ادخل على صفحة الخدمة** دي واضغط على زر الحجز (**Book Now**) أو إتمام الحجز عشان تنتقل لصفحة الدفع.
3. **ادفع بالطريقة المناسبة ليك** من الطرق المتاحة على كيميت (عندنا دفع بالجنيه كاش، فيزا/ماستركارد، PayPal، أو كاش عند الوصول).
4. **أول ما تدفع**، هيجيلك رسالة تأكيد (SMS وإيميل) فوراً بتفاصيل الحجز، وكمان تقدر تتابع حجزك وتشوف كل التفاصيل في أي وقت من صفحة [حجوزاتي](/bookings) 😊.`;
    }
  }
  return null;
};

const FloatingChatbot = () => {
  const [sessionToken] = useState(() => {
    let token = sessionStorage.getItem("kemet_chat_session");
    if (!token) {
      token = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem("kemet_chat_session", token);
    }
    return token;
  });
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem("kemet_chatbot_isOpen") === "true";
  });
  const [lang, setLang] = useState<keyof typeof chatbotTranslations>('en');
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("kemet_chatbot_messages");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [showTimeoutOptions, setShowTimeoutOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Call-related States
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'ai' | 'human' | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(20);
  const visualizerTimerRef = useRef<any>(null);

  // WebRTC & Audio Refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const processedSignalingMsgs = useRef<Set<number>>(new Set());
  const recognitionRef = useRef<any>(null);
  const synthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortActiveTTS = useRef<(() => void) | null>(null);
  const watchdogTimerRef = useRef<any>(null);

  const isCallActiveRef = useRef(isCallActive);
  const callTypeRef = useRef(callType);
  const isMutedRef = useRef(isMuted);
  const messagesRef = useRef(messages);
  const isBotSpeakingRef = useRef(isBotSpeaking);
  const isLoadingRef = useRef(isLoading);
  const isListeningRef = useRef(isListening);
  const botSpokenTextRef = useRef<string>("");
  const lastTimeBotSpokeRef = useRef<number>(0);
  const lastBotSpokenTextRef = useRef<string>("");

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    callTypeRef.current = callType;
  }, [callType]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isBotSpeakingRef.current = isBotSpeaking;
  }, [isBotSpeaking]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Stop calls on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = "";
        } catch (e) { }
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (visualizerTimerRef.current) {
        clearInterval(visualizerTimerRef.current);
      }
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
      }
    };
  }, []);

  const startVoiceVisualizer = (active: boolean) => {
    if (visualizerTimerRef.current) clearInterval(visualizerTimerRef.current);
    if (!active) {
      setVoiceVolume(20);
      return;
    }
    visualizerTimerRef.current = setInterval(() => {
      setVoiceVolume(Math.floor(Math.random() * 65) + 25);
    }, 120);
  };

  const speakText = (text: string, overrideLang?: keyof typeof chatbotTranslations) => {
    // Prevent voice synthesis if the user has already hung up or closed the call!
    if (!isCallActiveRef.current) {
      console.log("speakText aborted because the call is no longer active.");
      return;
    }

    // Cancel any active native speech synthesis
    window.speechSynthesis.cancel();

    // Abort any active Google TTS playback
    if (abortActiveTTS.current) {
      abortActiveTTS.current();
      abortActiveTTS.current = null;
    }

    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }

    // Set speaking state synchronously to prevent race conditions in event loop
    setIsBotSpeaking(true);
    isBotSpeakingRef.current = true;

    // Strip markdown links, codes, asterisks, hashes, backticks, and bullet points
    const cleanText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/\[SAVE_REVIEW:[^\]]+\]/g, '')
      .replace(/[\*\#\`\_\-\+\•]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    botSpokenTextRef.current = cleanText;

    const activeLang = overrideLang || lang;

    // Split text into manageable chunks (under 180 characters each) to play smoothly via Google Translate TTS
    const chunks: string[] = [];
    const rawChunks = cleanText.split(/([\.!\?،\n]+)/);

    let currentChunk = "";
    for (const part of rawChunks) {
      if ((currentChunk + part).length > 180) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = part;
      } else {
        currentChunk += part;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    if (chunks.length === 0) {
      setIsBotSpeaking(false);
      isBotSpeakingRef.current = false;
      return;
    }

    let currentIdx = 0;
    let isAborted = false;

    const playNextChunk = () => {
      if (isAborted || !isCallActiveRef.current) {
        handlePlaybackEnded();
        return;
      }

      if (currentIdx >= chunks.length) {
        handlePlaybackEnded();
        return;
      }

      const chunkText = chunks[currentIdx];
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${activeLang === 'ar' ? 'ar' : 'en'}&client=tw-ob&q=${encodeURIComponent(chunkText)}`;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsBotSpeaking(true);
        isBotSpeakingRef.current = true;
        startVoiceVisualizer(true);

        // Start listening concurrently for hands-free interruption
        setTimeout(() => {
          if (isCallActiveRef.current && callTypeRef.current === 'ai' && !isMutedRef.current && !isLoadingRef.current && !isListeningRef.current) {
            startListeningAICall(activeLang);
          }
        }, 50);
      };

      audio.onended = () => {
        currentIdx++;
        playNextChunk();
      };

      audio.onerror = (e) => {
        console.warn("Google TTS chunk error, trying fallback to native synthesis", e);
        fallbackToNative(chunks.slice(currentIdx).join(" "), activeLang);
      };

      audio.play().catch((err) => {
        console.warn("Audio playback blocked or failed, falling back to native synthesis:", err);
        fallbackToNative(chunks.slice(currentIdx).join(" "), activeLang);
      });
    };

    const fallbackToNative = (fallbackText: string, fallbackLang: keyof typeof chatbotTranslations) => {
      if (!('speechSynthesis' in window)) {
        handlePlaybackEnded();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fallbackText);
      synthesisUtteranceRef.current = utterance;
      utterance.lang = fallbackLang === 'ar' ? 'ar-EG' : 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(fallbackLang === 'ar' ? 'ar' : 'en'));
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsBotSpeaking(true);
        isBotSpeakingRef.current = true;
        startVoiceVisualizer(true);

        setTimeout(() => {
          if (isCallActiveRef.current && callTypeRef.current === 'ai' && !isMutedRef.current && !isLoadingRef.current && !isListeningRef.current) {
            startListeningAICall(fallbackLang);
          }
        }, 50);
      };

      utterance.onend = () => {
        handlePlaybackEnded();
      };

      utterance.onerror = (err) => {
        console.error("Native synthesis fallback error:", err);
        handlePlaybackEnded();
      };

      window.speechSynthesis.speak(utterance);
    };

    const handlePlaybackEnded = () => {
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }

      setIsBotSpeaking(false);
      isBotSpeakingRef.current = false;
      lastTimeBotSpokeRef.current = Date.now();
      lastBotSpokenTextRef.current = botSpokenTextRef.current;
      botSpokenTextRef.current = "";
      startVoiceVisualizer(false);

      setTimeout(() => {
        if (isCallActiveRef.current && callTypeRef.current === 'ai' && !isMutedRef.current && !isLoadingRef.current && !isListeningRef.current) {
          startListeningAICall(activeLang);
        }
      }, 300);
    };

    // Start playing first chunk
    playNextChunk();

    // Register abort function for active playback
    abortActiveTTS.current = () => {
      isAborted = true;
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = "";
        } catch (e) { }
      }
    };

    // Safety Watchdog Timer: if the bot is stuck in "speaking" state for over 35 seconds, force-reset it to prevent lockups.
    watchdogTimerRef.current = setTimeout(() => {
      if (isBotSpeakingRef.current && activeLang === (overrideLang || lang)) {
        console.warn("TTS Watchdog triggered: Bot has been in speaking state for >35s. Forcing reset.");
        handlePlaybackEnded();
      }
    }, 35000);
  };

  const startListeningAICall = (overrideLang?: keyof typeof chatbotTranslations) => {
    // Critical Guard: Absolutely never start listening if the call is not active or not AI!
    if (!isCallActiveRef.current || callTypeRef.current !== 'ai') {
      console.log("startListeningAICall aborted: call is not active or not AI.");
      return;
    }

    if (isMutedRef.current) return;
    if (isListeningRef.current) {
      console.log("Speech recognition is already running.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }

    const activeLang = overrideLang || lang;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = activeLang === 'ar' ? 'ar-EG' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      startVoiceVisualizer(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
      startVoiceVisualizer(false);

      // Auto-restart continuous loop if call active and not muted/loading
      setTimeout(() => {
        if (
          isCallActiveRef.current &&
          callTypeRef.current === 'ai' &&
          !isMutedRef.current &&
          !isLoadingRef.current &&
          !isListeningRef.current
        ) {
          startListeningAICall(activeLang);
        }
      }, 300);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error in call:", event.error);
      setIsListening(false);
      isListeningRef.current = false;
      startVoiceVisualizer(false);

      if (event.error === 'not-allowed') {
        const errMsg = activeLang === 'ar'
          ? "⚠️ عذراً يا فندم، المساعد الصوتي يحتاج إذن الوصول للميكروفون. يرجى السماح بالوصول من إعدادات المتصفح (جنب رابط الموقع فوق 🔒) وإعادة المحاولة."
          : "⚠️ Sorry, the voice assistant needs microphone access. Please allow microphone access in your browser address bar/settings and try again.";

        setMessages((prev) => [...prev, {
          id: Date.now(),
          text: errMsg,
          sender: "bot"
        }]);
        endCall();
      } else if (event.error === 'audio-capture') {
        const errMsg = activeLang === 'ar'
          ? "⚠️ عذراً، لم يتم العثور على مايكروفون نشط على جهازك. لو بتستخدم كمبيوتر مكتبي (PC)، يرجى توصيل سماعة تليفون أو هيدفون بها مايكروفون، أو تأكد من تفعيل المايكروفون من إعدادات الصوت بالويندوز (Sound Settings) ثم أعد المحاولة."
          : "⚠️ Sorry, no active microphone was detected on your device. If you are using a desktop PC, please connect a headset with a microphone, or make sure it is enabled in your Windows Sound Settings and try again.";

        setMessages((prev) => [...prev, {
          id: Date.now(),
          text: errMsg,
          sender: "bot"
        }]);
        endCall();
      }
    };

    recognition.onresult = async (event: any) => {
      const resultIndex = event.resultIndex;
      const result = event.results[resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;

      if (!transcript.trim()) return;

      // Auto-detect language of the spoken text dynamically!
      const hasArabic = /[\u0600-\u06FF]/.test(transcript);
      const detectedSpeechLang: keyof typeof chatbotTranslations = hasArabic ? 'ar' : 'en';

      // Check if user is interrupting the bot's speech (even with interim results!)
      if (isBotSpeakingRef.current) {
        if (isSelfFeedback(transcript, botSpokenTextRef.current)) {
          console.log("Ignored active speech echo:", transcript);
          return;
        }

        // Genuine voice interruption by user!
        console.log("Speech synthesis interrupted by user voice (interim/final):", transcript);
        window.speechSynthesis.cancel();
        setIsBotSpeaking(false);
        isBotSpeakingRef.current = false;
        lastTimeBotSpokeRef.current = Date.now();
        lastBotSpokenTextRef.current = botSpokenTextRef.current;
        botSpokenTextRef.current = "";
        startVoiceVisualizer(false);
      }

      // If this is an interim result, we do not call the API yet.
      // We only stop the bot's speaking (handled above) and wait for the final transcript.
      if (!isFinal) {
        return;
      }

      // Residual room echo protection (for 1.2s post bot speech):
      if (Date.now() - lastTimeBotSpokeRef.current < 1200) {
        if (isSelfFeedback(transcript, lastBotSpokenTextRef.current)) {
          console.log("Ignored residual speech echo:", transcript);
          return;
        }
      }

      if (detectedSpeechLang !== lang) {
        setLang(detectedSpeechLang);
      }

      const newUserMessage: Message = { id: Date.now(), text: transcript, sender: "user" };
      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      isLoadingRef.current = true;
      setIsListening(false);
      isListeningRef.current = false;

      try {
        const currentHistory = [...messagesRef.current, newUserMessage];
        const localResponse = getBookingGuideResponse(transcript);
        let replyData;

        if (localResponse) {
          replyData = { answer: localResponse, is_human_mode: false };
        } else {
          replyData = await askChatbot(currentHistory, sessionToken);
        }

        // Immediately abort voice output if the user hung up while the bot was generating the response!
        if (!isCallActiveRef.current) {
          console.log("Chatbot answer received, but the call was hung up in the meantime.");
          return;
        }

        if (replyData.answer && replyData.answer.trim() !== "") {
          const replyMessage: Message = { id: Date.now() + 1, text: replyData.answer, sender: "bot" };
          setMessages((prev) => [...prev, replyMessage]);
          if (isCallActiveRef.current && callTypeRef.current === 'ai') {
            speakText(replyData.answer, detectedSpeechLang);
          }
        }
      } catch (err) {
        console.error("AI call chatbot error:", err);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;

        // Auto-restart continuous loop
        setTimeout(() => {
          if (
            isCallActiveRef.current &&
            callTypeRef.current === 'ai' &&
            !isMutedRef.current &&
            !isListeningRef.current
          ) {
            startListeningAICall(detectedSpeechLang);
          }
        }, 300);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition", err);
      setIsListening(false);
      isListeningRef.current = false;
      startVoiceVisualizer(false);
    }
  };

  const startAICall = () => {
    // Auto-detect language
    let detectedLang: keyof typeof chatbotTranslations = 'en';

    // 1. Check document language
    const docLang = document.documentElement.lang;
    if (docLang && docLang.startsWith('ar')) {
      detectedLang = 'ar';
    } else {
      // 2. Check cookie/navigator languages
      const browserIsArabic = navigator.language.startsWith('ar') ||
        (navigator.languages && navigator.languages.some(l => l.startsWith('ar')));
      if (browserIsArabic) {
        detectedLang = 'ar';
      }
    }

    // 3. Check recent messages for Arabic characters (strongest signal of user preference)
    const hasArabicInHistory = messages.some(m => /[\u0600-\u06FF]/.test(m.text));
    if (hasArabicInHistory) {
      detectedLang = 'ar';
    }

    setLang(detectedLang);

    setIsCallActive(true);
    setCallType('ai');
    setCallStatus('connected');

    // Synchronously set refs to bypass React state latency on initial start
    isCallActiveRef.current = true;
    callTypeRef.current = 'ai';

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }

    const greetingText = detectedLang === 'ar'
      ? "أهلاً بك في دعم كيميت الصوتي الذكي. أنا هنا لمساعدتك بالكامل من خلال التحدث. تفضل بالاستفسار عن أي شيء تريده في رحلتك!"
      : "Welcome to Kemet AI Voice Support. I am here to help you using interactive speech. Feel free to ask me anything about your trip!";
    speakText(greetingText, detectedLang);
  };

  const sendSignalingMessage = async (content: string) => {
    try {
      const token = localStorage.getItem("token");
      const fetchHeaders: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json"
      };
      if (token) fetchHeaders["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: fetchHeaders,
        body: JSON.stringify({
          message: content,
          session_token: sessionToken,
          history: []
        }),
      });
    } catch (e) {
      console.error("Failed to send signaling message", e);
    }
  };

  const startHumanCall = async () => {
    setIsCallActive(true);
    setCallType('human');
    setCallStatus('calling');
    setIsHumanMode(true);

    // Synchronously set refs to bypass React state latency
    isCallActiveRef.current = true;
    callTypeRef.current = 'human';

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }
    window.speechSynthesis.cancel();

    const triggerMsg = lang === 'ar'
      ? "طلب اتصال صوتي مباشر مع الدعم الفني"
      : "Requested a live voice support call";

    await handleSendText(triggerMsg);

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });
      pcRef.current = pc;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && isCallActiveRef.current) {
          sendSignalingMessage(`[RTC_ICE]:${JSON.stringify(event.candidate)}`);
        }
      };

      pc.ontrack = (event) => {
        console.log("Client received remote track");
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        } else {
          const audio = new Audio();
          audio.srcObject = event.streams[0];
          audio.autoplay = true;
          (remoteAudioRef as any).current = audio;
        }
        setCallStatus('connected');
        startVoiceVisualizer(true);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setCallStatus('connected');
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          endCall();
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const offerMsg = `[RTC_OFFER]:${JSON.stringify(offer)}`;
      await sendSignalingMessage(offerMsg);

    } catch (err) {
      console.error("WebRTC connection setup failed:", err);
      alert(lang === 'ar' ? "فشل الاتصال بالمايكروفون." : "Failed to access microphone.");
      endCall();
    }
  };

  const handleIncomingSignaling = async (text: string) => {
    if (!pcRef.current) return;

    if (text.startsWith("[RTC_ANSWER]:")) {
      try {
        const answerStr = text.replace("[RTC_ANSWER]:", "");
        const answer = JSON.parse(answerStr);
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus('connected');
      } catch (e) {
        console.error("Error setting remote description:", e);
      }
    } else if (text.startsWith("[RTC_ICE]:")) {
      try {
        const candStr = text.replace("[RTC_ICE]:", "");
        const candidate = JSON.parse(candStr);
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding remote ICE candidate:", e);
      }
    } else if (text.startsWith("[RTC_HANGUP]")) {
      endCall();
    }
  };

  const endCall = () => {
    if (callType === 'human') {
      sendSignalingMessage("[RTC_HANGUP]");
    }

    // Immediately update refs to prevent race conditions in asynchronous callbacks
    isCallActiveRef.current = false;
    callTypeRef.current = null;
    isBotSpeakingRef.current = false;
    isListeningRef.current = false;

    window.speechSynthesis.cancel();
    if (abortActiveTTS.current) {
      try { abortActiveTTS.current(); } catch (e) { }
      abortActiveTTS.current = null;
    }
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    setIsCallActive(false);
    setCallType(null);
    setCallStatus('idle');
    setIsMuted(false);
    setIsBotSpeaking(false);
    startVoiceVisualizer(false);

    if (callType === 'human') {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text: lang === 'ar' ? "تم إنهاء المكالمة الصوتية." : "Voice call ended.",
        sender: "bot"
      }]);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (callType === 'ai') {
      if (nextMuted) {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch (e) { }
        }
        setIsListening(false);
      } else {
        startListeningAICall();
      }
    } else if (callType === 'human' && localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
  };

  const handleInterruptClick = () => {
    if (callTypeRef.current !== 'ai') return;

    if (isBotSpeakingRef.current) {
      console.log("Interrupting bot speech synthesis...");
      window.speechSynthesis.cancel();
      if (abortActiveTTS.current) {
        try { abortActiveTTS.current(); } catch (e) { }
        abortActiveTTS.current = null;
      }
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
      setIsBotSpeaking(false);
      isBotSpeakingRef.current = false;
      startVoiceVisualizer(false);
      setTimeout(() => {
        if (isCallActiveRef.current && !isMutedRef.current) {
          startListeningAICall();
        }
      }, 100);
    }
  };

  const processMessagesList = (rawMessages: any[]) => {
    const filtered: Message[] = [];

    for (const msg of rawMessages) {
      const msgText = msg.text || msg.content || "";
      const msgId = msg.id;

      if (typeof msgText === "string" && msgText.startsWith("[RTC_")) {
        if (!processedSignalingMsgs.current.has(msgId)) {
          processedSignalingMsgs.current.add(msgId);
          handleIncomingSignaling(msgText);
        }
        continue;
      }

      const sender = (msg.sender === "admin" || msg.sender === "bot" || msg.role === "admin" || msg.role === "assistant") ? "bot" : "user";
      filtered.push({
        id: msgId || Date.now() + Math.random(),
        text: msgText,
        sender: sender
      });
    }

    setMessages(filtered);
  };

  // Initialize chat history from backend or session storage
  const loadHistory = async () => {
    const data = await fetchChatHistory(sessionToken);

    if (data && data.is_human_mode) {
      setIsHumanMode(true);
    } else {
      setIsHumanMode(false);
    }

    if (data && data.messages && data.messages.length > 0) {
      processMessagesList(data.messages);
    } else {
      const saved = sessionStorage.getItem("kemet_chatbot_messages");
      let hasSessionData = false;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            processMessagesList(parsed);
            hasSessionData = true;
          }
        } catch (e) { }
      }
      if (!hasSessionData) {
        const t = chatbotTranslations[lang] || chatbotTranslations['en'];
        setMessages([{ id: 1, text: t.greeting, sender: "bot" }]);
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Live Chat Polling if Open (dynamic interval based on active voice calls - ONLY poll if in live human support mode!)
  useEffect(() => {
    if (!isOpen || !isHumanMode) return;

    const pollInterval = (isCallActive && callType === 'human') ? 1500 : 4000;

    const interval = setInterval(() => {
      loadHistory();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [isOpen, isHumanMode, sessionToken, isCallActive, callType]);

  // المؤقت الذكي 1: إنهاء المحادثة بعد 30 ثانية من عدم رد العميل
  useEffect(() => {
    if (!isHumanMode || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender === "bot") {
      const inactivityTimer = setTimeout(async () => {
        try {
          await axiosClient.post(`/livechat/sessions/${sessionToken}/close`);
          loadHistory();
        } catch (e) {
          console.error("Failed to close session automatically");
        }
      }, 30000);

      return () => clearTimeout(inactivityTimer);
    }
  }, [messages.length, isHumanMode]);

  // المؤقت الذكي 2: العميل في انتظار الرد من الموظف لمدة 10 ثواني
  useEffect(() => {
    if (!isHumanMode || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender === "user") {
      const waitTimer = setTimeout(() => {
        // بدلاً من التحويل المباشر، نعرض الخيارات للعميل
        setShowTimeoutOptions(true);
      }, 10000);

      return () => clearTimeout(waitTimer);
    } else {
      setShowTimeoutOptions(false); // إخفاء الخيارات إذا رد الموظف
    }
  }, [messages.length, isHumanMode]);

  const handleWaitAdmin = () => {
    setShowTimeoutOptions(false);
  };

  const handleFallbackToAI = async () => {
    setShowTimeoutOptions(false);
    try {
      setIsLoading(true);
      await axiosClient.post(`/livechat/sessions/${sessionToken}/close`);

      const replyData = await askChatbot(messages, sessionToken, true);

      if (replyData.answer && replyData.answer.trim() !== "") {
        const replyMessage: Message = { id: Date.now() + 1, text: replyData.answer, sender: "bot" };
        setMessages((prev) => [...prev, replyMessage]);
      }

      setIsHumanMode(false);
    } catch (e) {
      console.error("Failed to fallback to AI");
    } finally {
      setIsLoading(false);
      loadHistory();
    }
  };

  // Save state to session storage when things change
  useEffect(() => {
    sessionStorage.setItem("kemet_chatbot_isOpen", isOpen.toString());
    if (!isOpen) {
      // If the chatbot window is closed, immediately terminate speech, recognition, and calls!
      window.speechSynthesis.cancel();
      if (abortActiveTTS.current) {
        try { abortActiveTTS.current(); } catch (e) { }
        abortActiveTTS.current = null;
      }
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      if (isCallActiveRef.current) {
        endCall();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("kemet_chatbot_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Update greeting only if no real history when lang changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        const t = chatbotTranslations[lang] || chatbotTranslations['en'];
        return [{ id: 1, text: t.greeting, sender: "bot" }];
      }
      return prev;
    });
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
  }, [messages.length, isOpen, isLoading]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const handleSendText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    const newMessage: Message = { id: Date.now(), text: userText, sender: "user" };
    const currentHistory = [...messages, newMessage];

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const localResponse = getBookingGuideResponse(userText);
      let replyData;

      if (localResponse) {
        replyData = { answer: localResponse, is_human_mode: false };
      } else {
        replyData = await askChatbot(currentHistory, sessionToken);
      }

      if (replyData.is_human_mode) {
        setIsHumanMode(true);
      }

      if (replyData.answer && replyData.answer.trim() !== "") {
        const replyMessage: Message = { id: Date.now() + 1, text: replyData.answer, sender: "bot" };
        setMessages((prev) => [...prev, replyMessage]);
      }
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

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await handleSendText(input);
  };

  const handleVoiceInput = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'ar' ? "متصفحك لا يدعم الإدخال الصوتي." : "Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert(lang === 'ar' ? "يرجى السماح باستخدام الميكروفون من إعدادات المتصفح." : "Please allow microphone access in your browser settings.");
      } else if (event.error !== 'no-speech') {
        alert(lang === 'ar' ? "حدث خطأ في الميكروفون: " + event.error : "Microphone error: " + event.error);
      }
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? prev + " " + transcript : transcript);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Could not start recognition", e);
      setIsListening(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await axiosClient.post('/vision/analyze', { image: base64String });
        if (res.data.destination) {
          const newDest = res.data.destination;
          const msg = lang === 'ar'
            ? `أنا رفعت صورة لـ ${newDest} (${res.data.monument || ''}). تقدر ترشحلي جدول رحلة للمكان ده؟`
            : `I uploaded an image of ${newDest} (${res.data.monument || ''}). Can you plan a trip for me there?`;
          handleSendText(msg);
        }
      } catch (err: any) {
        const errorMsg = lang === 'ar' ? "لم أتمكن من التعرف على الصورة." : "Could not analyze image.";
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: errorMsg, sender: "bot" }]);
      } finally {
        setIsAnalyzingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
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
                <h3 className="font-bold leading-none flex items-center gap-2">
                  {t.title}
                  {!isHumanMode && (
                    <span className="text-[10px] bg-[#EB662B] px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
                  )}
                  {isHumanMode && (
                    <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Support</span>
                  )}
                </h3>
                <span className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  {isHumanMode ? "Live Agent" : t.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isCallActive && (
                <button
                  onClick={startAICall}
                  title={lang === 'ar' ? 'اتصال صوتی' : 'Voice Call'}
                  className="text-white/70 hover:text-[#D4AF37] hover:scale-110 transition p-2 text-lg mr-1"
                >
                  <FaPhone />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition p-2"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {isCallActive ? (
            <div className="flex-1 bg-gradient-to-b from-[#05073C] via-[#121661] to-[#02031F] flex flex-col items-center justify-between p-6 text-white relative overflow-hidden">
              {/* Decorative Pharaoh/Golden Rings Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#D4AF37]/10 animate-ping duration-10000 opacity-20 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-[#D4AF37]/5 animate-pulse opacity-15 pointer-events-none"></div>

              {/* Call Details */}
              <div className="text-center mt-6 z-10">
                <div className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                  {callType === 'ai' ? (lang === 'ar' ? 'مساعد كيميت الصوتي الذكي' : 'Kemet AI Voice Support') : (lang === 'ar' ? 'اتصال مباشر مع الدعم' : 'Live Agent Voice Support')}
                </div>
                <h4 className="text-2xl font-bold tracking-wide mt-1 text-white">
                  {callType === 'ai' ? 'Kemet AI Assistant' : (lang === 'ar' ? 'ممثلي خدمة العملاء' : 'Live Customer Agent')}
                </h4>
                <p className="text-xs text-white/60 mt-2 font-medium">
                  {callStatus === 'calling' && (lang === 'ar' ? 'جاري الاتصال...' : 'Calling...')}
                  {callStatus === 'connected' && (lang === 'ar' ? 'متصل - تحدث الآن' : 'Connected - Speak Now')}
                  {callStatus === 'ended' && (lang === 'ar' ? 'تم إنهاء المكالمة' : 'Call ended')}
                </p>

                {/* Call Language Selector Pill */}
                {callType === 'ai' && (
                  <div className="flex justify-center gap-2 mt-3.5 select-none relative z-20">
                    <button
                      onClick={() => {
                        if (lang === 'ar') return;
                        window.speechSynthesis.cancel();
                        setIsBotSpeaking(false);
                        isBotSpeakingRef.current = false;
                        if (recognitionRef.current) {
                          try { recognitionRef.current.stop(); } catch (e) { }
                        }
                        setLang('ar');
                        setTimeout(() => {
                          startListeningAICall('ar');
                        }, 400);
                      }}
                      className={`px-3 py-1 text-[10px] sm:text-xs rounded-full border transition-all duration-300 transform active:scale-95 ${lang === 'ar' ? 'bg-[#D4AF37] text-[#05073C] border-[#D4AF37] font-extrabold shadow-lg shadow-[#D4AF37]/20 scale-105' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'}`}
                    >
                      العربية 🇪🇬
                    </button>
                    <button
                      onClick={() => {
                        if (lang === 'en') return;
                        window.speechSynthesis.cancel();
                        setIsBotSpeaking(false);
                        isBotSpeakingRef.current = false;
                        if (recognitionRef.current) {
                          try { recognitionRef.current.stop(); } catch (e) { }
                        }
                        setLang('en');
                        setTimeout(() => {
                          startListeningAICall('en');
                        }, 400);
                      }}
                      className={`px-3 py-1 text-[10px] sm:text-xs rounded-full border transition-all duration-300 transform active:scale-95 ${lang === 'en' ? 'bg-[#D4AF37] text-[#05073C] border-[#D4AF37] font-extrabold shadow-lg shadow-[#D4AF37]/20 scale-105' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'}`}
                    >
                      English 🇺🇸
                    </button>
                  </div>
                )}
              </div>

              {/* Glowing Concentric Wave Visualizer */}
              <div
                onClick={handleInterruptClick}
                className={`flex items-center justify-center relative my-auto z-10 ${callType === 'ai' && isBotSpeaking ? 'cursor-pointer' : ''}`}
                title={callType === 'ai' && isBotSpeaking ? (lang === 'ar' ? 'اضغط لمقاطعة المساعد' : 'Click to interrupt assistant') : ''}
              >
                {/* Concentric pulsing rings */}
                <div
                  className="absolute w-36 h-36 rounded-full bg-[#EB662B]/10 border border-[#EB662B]/30 transition-all duration-300"
                  style={{ transform: `scale(${1 + voiceVolume / 100})`, opacity: isListening || isBotSpeaking ? 0.8 : 0.2 }}
                ></div>
                <div
                  className="absolute w-44 h-44 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 transition-all duration-300 delay-75"
                  style={{ transform: `scale(${1 + (voiceVolume * 0.8) / 100})`, opacity: isListening || isBotSpeaking ? 0.6 : 0.1 }}
                ></div>

                {/* Central Microphone / Speaker Circle */}
                <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#EB662B] to-[#D4AF37] p-1 shadow-2xl flex items-center justify-center shadow-[#EB662B]/40 relative transition-transform duration-300 ${callType === 'ai' && isBotSpeaking ? 'hover:scale-110 active:scale-95' : ''}`}>
                  <div className="w-full h-full rounded-full bg-[#05073C] flex items-center justify-center text-white relative overflow-hidden">
                    {(isListening || isBotSpeaking) && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#EB662B]/20 to-[#D4AF37]/20 animate-pulse"></div>
                    )}
                    {callType === 'ai' ? (
                      <FaRobot className={`text-3xl text-[#D4AF37] ${isBotSpeaking ? 'animate-bounce' : ''}`} />
                    ) : (
                      <FaHeadset className="text-3xl text-[#D4AF37]" />
                    )}
                  </div>
                </div>

                {/* Animated Spectrum Bars */}
                {(isListening || isBotSpeaking) && (
                  <div className="absolute -bottom-14 flex items-center gap-1 h-8">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
                      <span
                        key={idx}
                        className="w-1 bg-gradient-to-t from-[#EB662B] to-[#D4AF37] rounded-full transition-all duration-150"
                        style={{
                          height: `${Math.min(100, Math.max(10, val * (voiceVolume / 7)))}%`,
                          animationDelay: `${idx * 0.05}s`
                        }}
                      ></span>
                    ))}
                  </div>
                )}
              </div>

              {/* Call Controls Panel */}
              <div className="w-full flex flex-col gap-4 mt-auto mb-4 z-10">
                <div className="flex justify-center items-center gap-6">
                  {/* Mute button */}
                  <button
                    onClick={toggleMute}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
                  >
                    {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  </button>

                  {/* Hang Up button */}
                  <button
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-105 transition-all shadow-red-600/30"
                  >
                    <FaPhoneSlash />
                  </button>

                  {/* Mode switcher to live human agent */}
                  {callType === 'ai' ? (
                    <button
                      onClick={startHumanCall}
                      title={lang === 'ar' ? 'تحدث لموظف حقيقي' : 'Switch to Human Agent'}
                      className="w-12 h-12 rounded-full bg-white/10 text-[#D4AF37] hover:bg-white/20 border border-[#D4AF37]/30 flex items-center justify-center text-lg transition-all"
                    >
                      <FaHeadset />
                    </button>
                  ) : (
                    <div className="w-12 h-12"></div>
                  )}
                </div>

                {/* Subtitle / User Voice Text Translation */}
                {callStatus === 'connected' && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center mx-2 text-xs text-white/80 min-h-[48px] flex items-center justify-center">
                    {isBotSpeaking ? (
                      <span className="text-[#D4AF37] flex items-center justify-center gap-1.5 animate-pulse font-medium">
                        {lang === 'ar' ? 'جاري التحدث... (اضغط لمقاطعتي 🤫)' : 'Speaking... (Click to interrupt 🤫)'}
                      </span>
                    ) : isListening ? (
                      <span className="text-[#D4AF37] flex items-center justify-center gap-1.5 animate-pulse font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block animate-ping"></span>
                        {lang === 'ar' ? 'جاري الاستماع...' : 'Listening...'}
                      </span>
                    ) : isLoading ? (
                      <span className="text-[#D4AF37] animate-pulse">{lang === 'ar' ? 'جاري التفكير...' : 'Thinking...'}</span>
                    ) : (
                      <span className="text-[#D4AF37] font-medium">{lang === 'ar' ? 'جاهز لاستقبال كلامك' : 'Ready to listen'}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                      } animate-in fade-in slide-in-from-bottom-2 duration-200`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                          ? `bg-[#EB662B] text-white ${lang === 'ar' ? 'rounded-tl-none' : 'rounded-tr-none'}`
                          : `bg-white text-gray-800 border border-gray-100 shadow-sm ${lang === 'ar' ? 'rounded-tr-none' : 'rounded-tl-none'}`
                        }`}
                      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                    >
                      {renderMessageContent(msg.text, msg.sender === "bot", lang)}
                    </div>
                  </div>
                ))}

                {messages.length <= 1 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FFF9EE] to-[#FFF3DC] border border-[#F2D091] shadow-md flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 my-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EB662B] to-[#D4AF37] flex items-center justify-center text-white text-xl shadow-lg shadow-[#EB662B]/20 animate-bounce">
                      <FaHeadset />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm text-[#05073C]">
                        {lang === 'ar' ? 'الوضع الصوتي التفاعلي الجديد!' : 'New Interactive Voice Mode!'}
                      </h4>
                      <p className="text-xs text-gray-600 px-2 leading-relaxed">
                        {lang === 'ar'
                          ? 'تحدث معي مباشرة بصوتك بدون كتابة! ميزة المقاطعة الصوتية التلقائية تتيح لك التحدث فوق صوتي لأقاطع كلامي فوراً وأسمعك كالبشر تماماً.'
                          : 'Talk to me hands-free! True Voice Interruption allows you to speak over me anytime and I will instantly stop to listen.'}
                      </p>
                    </div>
                    <button
                      onClick={startAICall}
                      className="mt-1 px-5 py-2 bg-gradient-to-r from-[#05073C] to-[#1a1d5e] hover:from-[#EB662B] hover:to-[#d55822] text-white text-xs font-bold rounded-full shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <FaPhone className="animate-pulse" />
                      {lang === 'ar' ? 'ابدأ محادثة صوتية الآن' : 'Start Voice Call Now'}
                    </button>
                  </div>
                )}

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

                {/* Timeout Options */}
                {showTimeoutOptions && (
                  <div className="flex flex-col gap-2 p-3 bg-orange-50 rounded-2xl border border-orange-200 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-xs text-gray-800 font-semibold text-center">الموظف مشغول حالياً، هل تود الانتظار أم التحدث مع المساعد الذكي?</p>
                    <div className="flex gap-2 justify-center mt-1">
                      <button onClick={handleWaitAdmin} className="px-4 py-1.5 bg-[#05073C] text-[#ffffff] text-[11px] font-bold rounded-full shadow-sm hover:bg-blue-900 transition">الانتظار قليلاً</button>
                      <button onClick={handleFallbackToAI} className="px-4 py-1.5 bg-[#EB662B] text-[#ffffff] text-[11px] font-bold rounded-full shadow-sm hover:bg-[#d55822] transition">المساعد الذكي (AI)</button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 h-8 rounded-full flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold uppercase tracking-wider ${isAnalyzingImage ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 animate-pulse' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    <FaCamera /> {lang === 'ar' ? 'صورة' : 'Snap'}
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
                <form
                  onSubmit={handleSend}
                  className="flex gap-2 w-full"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    dir="auto"
                    disabled={isLoading}
                    className={`flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B]/30 transition disabled:opacity-50 ${lang === 'ar' ? 'pr-4' : 'pl-4'}`}
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
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "bg-[#05073C]" : "bg-[#EB662B]"
          } w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform duration-300 z-50 group hover:shadow-[#EB662B]/40`}
      >
        {isOpen ? <FaTimes /> : <FaRobot className="group-hover:animate-bounce" />}
      </button>
    </div>
  );
};

export default FloatingChatbot;
