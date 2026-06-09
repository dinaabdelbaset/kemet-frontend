import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getHajjUmrahPackages, 
  type HajjUmrahPackage 
} from "../api/hajjUmrahService";
import { 
  FaStar, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaSuitcase, 
  FaPrayingHands, 
  FaBookOpen, 
  FaQrcode, 
  FaPhoneAlt, 
  FaChevronRight, 
  FaChevronLeft 
} from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const HajjUmrahPage = () => {
  const navigate = useNavigate();
  useDocumentTitle("Hajj Portal | Kemet");

  const [packages, setPackages] = useState<HajjUmrahPackage[]>([]);
  const [activeMainTab, setActiveMainTab] = useState<"guide" | "packages">("guide");
  const [activeRitual, setActiveRitual] = useState<"umrah" | "hajj">("umrah");
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Simulation State
  const [selectedPackage, setSelectedPackage] = useState<HajjUmrahPackage | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    passengers: 1,
    travelDate: "",
    notes: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Translation detection (Arab vs English)
  const [isArabic, setIsArabic] = useState(() => {
    return document.documentElement.dir === "rtl" || localStorage.getItem("kemet_lang") === "ar";
  });

  useEffect(() => {
    const handleLangChange = () => {
      setIsArabic(document.documentElement.dir === "rtl" || localStorage.getItem("kemet_lang") === "ar");
    };
    window.addEventListener("languagechange", handleLangChange);
    return () => window.removeEventListener("languagechange", handleLangChange);
  }, []);

  // Fetch Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await getHajjUmrahPackages();
        setPackages(data);
      } catch (err) {
        console.error("Error fetching Hajj & Umrah packages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Reset step when ritual changes
  useEffect(() => {
    setSelectedStepIndex(0);
  }, [activeRitual]);

  // Hajj & Umrah Steps Guide Data
  const umrahSteps = [
    {
      title_en: "1. Ihram & Niyyah",
      title_ar: "١. الإحرام والنية",
      desc_en: "Enter the state of consecration (Ihram) at the designated station (Miqat), perform prayers, and declare your intention (Niyyah) for Umrah.",
      desc_ar: "الدخول في الإحرام من الميقات المحدد، وارتداء ملابس الإحرام، وصلاة ركعتين ثم إعلان نية العمرة والبدء بالتلبية.",
      dua_ar: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً. لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لا شَرِيكَ لَكَ.",
      dua_en: "Labbayk Allahumma Umrah. Labbayk Allahumma Labbayk, Labbayka la sharika laka Labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      tip_en: "Keep repeating the Talbiyah out loud (for men) or quietly (for women) until you reach Makkah.",
      tip_ar: "أكثر من التلبية بصوت مرتفع (للرجال) أو منخفض (للنساء) حتى الوصول إلى المسجد الحرام."
    },
    {
      title_en: "2. Tawaf (Holy Kaaba)",
      title_ar: "٢. الطواف حول الكعبة",
      desc_en: "Circumambulate the Holy Kaaba seven times counter-clockwise, starting from the Black Stone (Hajar al-Aswad) with praise and supplication.",
      desc_ar: "الطواف حول الكعبة المشرفة 7 أشواط بدءاً من الحجر الأسود وانتهاءً به، مع الإكثار من الدعاء والذكر والاستغفار.",
      dua_ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. (بين الركن اليماني والحجر الأسود)",
      dua_en: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar.",
      tip_en: "Uncover your right shoulder (Idtiba) for men during all seven circuits and walk briskly for the first three.",
      tip_ar: "الاضطباع للرجال (كشف الكتف الأيمن) في جميع الأشواط، والرمل (المشي السريع) في الأشواط الثلاثة الأولى فقط."
    },
    {
      title_en: "3. Sa'i (Safa & Marwah)",
      title_ar: "٣. السعي بين الصفا والمروة",
      desc_en: "Walk seven times between the hills of Safa and Marwah, tracing the steps of Hagar (Hajar) seeking water for her son Ismail.",
      desc_ar: "السعي بين صخرتي الصفا والمروة 7 أشواط كاملة (الذهاب شوط والعودة شوط) بدءاً من الصفا.",
      dua_ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ... أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ. رَبِّ اغْفِرْ وَارْحَمْ إِنَّكَ أَنْتَ الأَعَزُّ الأَكْرَمُ.",
      dua_en: "Innas-safa wal-marwata min sha'a'irillah... Nabda'u bima bada'Allahu bih. Rabbighfir warham innaka antal-a'azzul-akram.",
      tip_en: "Men should jog speed-walk between the green lit pillars (Milayn al-Akhdarayn).",
      tip_ar: "يُسن للرجال الهرولة الخفيفة بين العلمين الأخضرين في المسعى."
    },
    {
      title_en: "4. Halq or Taqseer",
      title_ar: "٤. الحلق أو التقصير",
      desc_en: "Shave your head (Halq, recommended for men) or trim your hair (Taqseer, for men and women) to signify the completion of Umrah and exit Ihram.",
      desc_ar: "حلق الرأس بالكامل (للرجال وهو الأفضل) أو تقصير جزء من الشعر (للرجال والنساء) للتحلل الكامل من الإحرام.",
      dua_ar: "الْحَمْدُ للهِ الَّذِي قَضَى عَنَّا مَنَاسِكَنَا. اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ.",
      dua_en: "Alhamdulillahil-ladhi qada 'anna manasikana. Allahummagh-fir lil-muhalliqina wal-muqassirin.",
      tip_en: "Women only need to cut a fingertip's length of their hair. You are now free to dress normally.",
      tip_ar: "النساء يقصرن من أطراف شعرهن قدر أنملة فقط. هنيئاً لك، تمت عمرتك وبإمكانك التحلل الكامل."
    }
  ];

  const hajjSteps = [
    {
      title_en: "1. Day of Tarwiyah (8th Dhul-Hijjah)",
      title_ar: "١. يوم التروية (٨ ذو الحجة)",
      desc_en: "Put on Ihram from Makkah, declare Hajj intention, and travel to Mina. Spend the day and night praying the five daily prayers.",
      desc_ar: "الإحرام للحج من مقر الإقامة بمكة المكرمة، والتوجه إلى مشعر منى لقضاء يوم التروية والمبيت بها وصلاة الصلوات قصراً دون جمع.",
      dua_ar: "لَبَّيْكَ اللَّهُمَّ حَجًّا. لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ...",
      dua_en: "Labbayk Allahumma Hajjan. Labbayk Allahumma Labbayk...",
      tip_en: "Rest well tonight as tomorrow is the most important day of Hajj.",
      tip_ar: "احرص على الراحة والنوم مبكراً الليلة استعداداً ليوم عرفة العظيم."
    },
    {
      title_en: "2. Day of Arafah (9th Dhul-Hijjah)",
      title_ar: "٢. يوم عرفة (٩ ذو الحجة)",
      desc_en: "Travel to Arafat after sunrise. Stand in prayer and make intensive supplications until sunset. This is the peak ritual of Hajj.",
      desc_ar: "الذهاب إلى عرفات بعد شروق الشمس. الوقوف بعرفة والاجتهاد في الدعاء والتضرع لله عز وجل حتى غروب الشمس.",
      dua_ar: "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
      dua_en: "La ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.",
      tip_en: "Spend every moment in Dua. Face the Qiblah, raise your hands, and pray for your loved ones.",
      tip_ar: "أفضل الدعاء دعاء يوم عرفة. استقبل القبلة وارفع يديك وأكثر من الاستغفار والدعاء لنفسك وأهلك."
    },
    {
      title_en: "3. Muzdalifah (Night of 9th)",
      title_ar: "٣. المزدلفة (ليلة ١٠ ذو الحجة)",
      desc_en: "Travel to Muzdalifah after sunset. Pray Maghrib and Isha combined, sleep under the stars, and collect pebbles for stoning.",
      desc_ar: "النفرة من عرفات إلى مزدلفة بعد الغروب. صلاة المغرب والعشاء جمعاً وقصراً، والمبيت بها وجمع الحصيات لرمي الجمرات.",
      dua_ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي. (الذكر عند المشعر الحرام)",
      dua_en: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
      tip_en: "Collect 49 or 70 small pebbles (size of a chickpea) for the upcoming days of stoning.",
      tip_ar: "التقط حصيات رمي الجمرات (بحجم حبة الحمص) حوالي 49 أو 70 حصاة."
    },
    {
      title_en: "4. Day of Nahr (10th Dhul-Hijjah)",
      title_ar: "٤. يوم النحر (١٠ ذو الحجة - العيد)",
      desc_en: "Return to Mina to stone Jamarat al-Aqabah (7 pebbles). Perform the sacrifice (Udhiyah), shave head/trim, and do Tawaf al-Ifadah in Makkah.",
      desc_ar: "العودة لمنى لرمي جمرة العقبة الكبرى بـ 7 حصيات، ثم ذبح الهدي، ثم الحلق أو التقصير والتحلل الأصغر، ثم الذهاب للحرم لطواف الإفاضة.",
      dua_ar: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، لا إِلهَ إِلا اللهُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، وَللهِ الْحَمْدُ.",
      dua_en: "Allahu Akbar, Allahu Akbar, La ilaha illallah, Allahu Akbar, Allahu Akbar, walillahil-hamd.",
      tip_en: "After Tawaf al-Ifadah and Sa'i, you are in complete Tahlul (all restrictions are lifted).",
      tip_ar: "بعد طواف الإفاضة والسعي بين الصفا والمروة، يتحلل الحاج تحللاً كاملاً ويباح له كل شيء."
    },
    {
      title_en: "5. Tashreeq Days (11th-13th)",
      title_ar: "٥. أيام التشريق (١١-١٣ ذو الحجة)",
      desc_en: "Spend 2-3 days in Mina. Stone all three pillars (Jamarat) daily after noon. Complete Hajj with Tawaf al-Wada (Farewell Tawaf).",
      desc_ar: "الإقامة في منى لرمي الجمرات الثلاث (الصغرى والوسطى والكبرى) كل يوم بعد الزوال. ثم طواف الوداع قبل مغادرة مكة.",
      dua_ar: "ربَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً.",
      dua_en: "Rabbana taqabbal minna innaka antas-sami'ul-'alim. Rabbana atina fid-dunya hasanatan...",
      tip_en: "Stoning should be done in order: Small (Sugra), Medium (Wusta), and Large (Kobra), reciting Allahu Akbar with each pebble.",
      tip_ar: "يجب الرمي بالترتيب بدءاً بالصغرى ثم الوسطى ثم الكبرى، والتكبير مع كل حصاة."
    }
  ];

  const activeSteps = activeRitual === "umrah" ? umrahSteps : hajjSteps;
  const currentStep = activeSteps[selectedStepIndex];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    navigate("/checkout", {
      state: {
        id: selectedPackage.id,
        type: "hajj_umrah_package",
        title: isArabic ? selectedPackage.name_ar : selectedPackage.name_en,
        price: selectedPackage.price,
        image: selectedPackage.image,
        date: bookingForm.travelDate,
        guests: bookingForm.passengers,
        tickets: { adult: bookingForm.passengers, child: 0, infant: 0 }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* Hero Header */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=1920"
            alt="Kaaba Makkah"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#05073C]/90" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mt-10">
          <span className="text-[#D4AF37] font-black uppercase tracking-widest text-xs sm:text-sm bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-3 inline-block border border-[#D4AF37]/30">
            {isArabic ? "بوابة مناسك الحج" : "Islamic Hajj Portal"}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 font-serif drop-shadow-md">
            {isArabic ? "الحج" : "Hajj"}
          </h1>
          <p className="text-xs md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {isArabic 
              ? "دليلك الشامل لتأدية فريضة الحج بسهولة ويسر، مع استعراض وحجز أفضل باقات الإقامة والرحلات الروحانية." 
              : "Your comprehensive spiritual guide to Hajj rituals. Browse and reserve premium packages for Makkah & Madinah."}
          </p>
        </div>
      </section>

      {/* Main Tab Controls */}
      <div className="max-w-6xl mx-auto px-4 mt-8 relative z-20">
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 shadow-md max-w-md mx-auto flex gap-2">
          <button
            onClick={() => setActiveMainTab("guide")}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeMainTab === "guide"
                ? "bg-[#05073C] text-white dark:bg-[#D4AF37] dark:text-[#05073C] shadow-sm"
                : "bg-gray-50 text-gray-500 hover:text-gray-800 dark:bg-gray-850 dark:text-gray-400"
            }`}
          >
            🕌 {isArabic ? "دليل المناسك التفاعلي" : "Rituals Guide"}
          </button>
          <button
            onClick={() => setActiveMainTab("packages")}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeMainTab === "packages"
                ? "bg-[#05073C] text-white dark:bg-[#D4AF37] dark:text-[#05073C] shadow-sm"
                : "bg-gray-50 text-gray-500 hover:text-gray-800 dark:bg-gray-850 dark:text-gray-400"
            }`}
          >
            🕋 {isArabic ? "باقات الحج" : "Hajj Packages"}
          </button>
        </div>
      </div>

      {/* ───── TAB 1: RITUALS GUIDE ───── */}
      {activeMainTab === "guide" && (
        <SectionWrapper className="max-w-5xl mx-auto px-4 py-12">
          
          {/* Ritual Switcher */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveRitual("umrah")}
              className={`px-6 py-2.5 rounded-full text-xs font-black border transition ${
                activeRitual === "umrah"
                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]"
                  : "bg-white border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-800"
              }`}
            >
              {isArabic ? "مناسك العمرة" : "Umrah Rituals"}
            </button>
            <button
              onClick={() => setActiveRitual("hajj")}
              className={`px-6 py-2.5 rounded-full text-xs font-black border transition ${
                activeRitual === "hajj"
                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]"
                  : "bg-white border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-800"
              }`}
            >
              {isArabic ? "مناسك الحج" : "Hajj Rituals"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Steps Left List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-extrabold text-xs text-[#D4AF37] uppercase tracking-widest mb-4">
                {isArabic ? "خطوات النسك بالترتيب" : "Ritual Steps in order"}
              </h3>
              
              <div className="space-y-2.5">
                {activeSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`w-full text-right p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                      selectedStepIndex === idx
                        ? "bg-[#05073C] text-white border-[#05073C] dark:bg-gray-850 dark:border-gray-700 shadow-md translate-x-1"
                        : "bg-white border-gray-150 text-gray-600 hover:border-[#D4AF37] dark:bg-gray-900 dark:border-gray-800/80 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-xs font-black text-right">
                      {isArabic ? step.title_ar : step.title_en}
                    </span>
                    {selectedStepIndex === idx ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-750"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Detail Card */}
            {currentStep && (
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[400px] animate-in fade-in duration-300">
                <div className="space-y-6">
                  {/* Title and Progress */}
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h2 className="text-xl md:text-2xl font-black text-[#05073C] dark:text-white font-serif">
                      {isArabic ? currentStep.title_ar : currentStep.title_en}
                    </h2>
                    <span className="px-3.5 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-black uppercase">
                      {isArabic ? `الخطوة ${selectedStepIndex + 1} من ${activeSteps.length}` : `Step ${selectedStepIndex + 1} of ${activeSteps.length}`}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{isArabic ? "ماذا يفعل الحاج/المعتمر؟" : "What to do:"}</h4>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                      {isArabic ? currentStep.desc_ar : currentStep.desc_en}
                    </p>
                  </div>

                  {/* Supplication (Dua) */}
                  {currentStep.dua_ar && (
                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-600 dark:text-amber-500">
                        <FaPrayingHands size={14} /> {isArabic ? "الدعاء المأثور والذكر" : "Supplication (Dua):"}
                      </div>
                      <p className="text-base md:text-lg font-bold text-gray-800 dark:text-white leading-loose text-center font-serif">
                        {currentStep.dua_ar}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed pt-1 border-t border-amber-500/5">
                        {isArabic ? currentStep.dua_en : `Translation/Transliteration: "${currentStep.dua_en}"`}
                      </p>
                    </div>
                  )}

                  {/* Advice & Tips */}
                  {currentStep.tip_en && (
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 flex gap-3 items-start">
                      <span className="text-lg">💡</span>
                      <div className="text-xs">
                        <span className="font-black text-[#D4AF37] uppercase block mb-0.5">{isArabic ? "توجيهات ونصائح" : "PILGRIM TIPS & GUIDES"}</span>
                        <p className="text-gray-550 dark:text-gray-400 font-semibold leading-relaxed">
                          {isArabic ? currentStep.tip_ar : currentStep.tip_en}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setSelectedStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={selectedStepIndex === 0}
                    className="px-4 py-2 border border-gray-250 dark:border-gray-800 hover:border-[#D4AF37] rounded-xl text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    <FaChevronLeft className="rtl:rotate-180" /> {isArabic ? "السابق" : "Prev"}
                  </button>
                  
                  <button
                    onClick={() => setSelectedStepIndex(prev => Math.min(activeSteps.length - 1, prev + 1))}
                    disabled={selectedStepIndex === activeSteps.length - 1}
                    className="px-5 py-2 bg-[#05073C] text-white dark:bg-[#D4AF37] dark:text-[#05073C] rounded-xl text-xs font-black flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    {isArabic ? "التالي" : "Next"} <FaChevronRight className="rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      )}

      {/* ───── TAB 2: PACKAGES LIST ───── */}
      {activeMainTab === "packages" && (
        <SectionWrapper className="max-w-6xl mx-auto px-4 py-12">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-[#05073C] dark:text-white font-serif mb-2">
              {isArabic ? "باقات الحج المتاحة" : "Hajj Flight & Hotel Packages"}
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              {isArabic ? "اختر باقة السفر المناسبة لك ولعائلتك شاملة التذاكر، الفنادق، والإرشاد" : "Compare luxury and economy spiritual tours to Makkah & Madinah"}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border p-8 shadow-sm">
              <span className="text-6xl mb-4 block">🕋</span>
              <h3 className="text-lg font-bold text-[#05073C] dark:text-white mb-1">
                {isArabic ? "لا توجد باقات حج مفعلة حالياً" : "No Hajj packages found"}
              </h3>
              <p className="text-gray-400 text-xs">
                {isArabic ? "يرجى معاودة التحقق لاحقاً أو الاتصال بالإدارة." : "Please check back later or contact customer support."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col justify-between h-full group"
                >
                  {/* Image & Price */}
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img
                      src={pkg.image || "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=800"}
                      alt={pkg.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    
                    <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end text-white">
                      <span className="bg-[#D4AF37] text-[#05073C] text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                        {pkg.duration_days} {isArabic ? "أيام" : "Days"}
                      </span>
                      
                      <span className="text-xl font-black text-[#D4AF37]">
                        ${pkg.price}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-[#05073C] dark:text-white group-hover:text-[#D4AF37] transition-colors mb-2.5">
                        {isArabic ? pkg.name_ar : pkg.name_en}
                      </h3>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4">
                        {isArabic ? pkg.description_ar : pkg.description_en}
                      </p>

                      {/* Accommodation Details */}
                      <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2.5 mb-4">
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-450 dark:text-gray-500">
                          <span>🕋 {isArabic ? "فندق مكة" : "Makkah Hotel"}</span>
                          <span className="font-extrabold text-gray-700 dark:text-white">
                            {pkg.hotel_makkah ? (pkg.hotel_makkah.title || pkg.hotel_makkah.name) : (isArabic ? pkg.hotel_makkah_ar : pkg.hotel_makkah_en)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-450 dark:text-gray-500 border-t border-gray-150/40 dark:border-gray-800/40 pt-2">
                          <span>🕌 {isArabic ? "فندق المدينة" : "Madinah Hotel"}</span>
                          <span className="font-extrabold text-gray-700 dark:text-white">
                            {pkg.hotel_madinah ? (pkg.hotel_madinah.title || pkg.hotel_madinah.name) : (isArabic ? pkg.hotel_madinah_ar : pkg.hotel_madinah_en)}
                          </span>
                        </div>
                        {pkg.flight && (
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-450 dark:text-gray-500 border-t border-gray-150/40 dark:border-gray-800/40 pt-2">
                            <span>✈️ {isArabic ? "طيران" : "Flight"}</span>
                            <span className="font-extrabold text-gray-700 dark:text-white">
                              {pkg.flight.airline} ({pkg.flight.flight_number})
                            </span>
                          </div>
                        )}
                        {pkg.transportation && (
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-450 dark:text-gray-500 border-t border-gray-150/40 dark:border-gray-800/40 pt-2">
                            <span>🚌 {isArabic ? "انتقالات" : "Transfers"}</span>
                            <span className="font-extrabold text-gray-700 dark:text-white">
                              {pkg.transportation.company} ({pkg.transportation.type})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features Bullet List */}
                      <div className="space-y-1.5 mb-6">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider block">
                          {isArabic ? "الخدمات المشمولة" : "INCLUDED FEATURES"}
                        </span>
                        
                        {((isArabic ? pkg.features_ar : pkg.features_en) || []).map((feat, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-xs text-gray-500 dark:text-gray-400 font-bold">
                            <FaCheckCircle className="text-green-500 shrink-0" size={12} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="w-full py-3 bg-[#05073C] hover:bg-[#D4AF37] dark:bg-gray-800 dark:hover:bg-[#D4AF37] text-white dark:hover:text-[#05073C] rounded-2xl font-black text-xs transition shadow-sm uppercase tracking-wider"
                    >
                      {isArabic ? "احجز الآن 🕋" : "Book Package Now 🕋"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionWrapper>
      )}

      {/* Checklist & Essential Advice */}
      <SectionWrapper className="bg-white dark:bg-gray-900 border-t border-gray-150 dark:border-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#05073C] dark:text-white font-serif flex items-center gap-2">
              <FaSuitcase className="text-[#D4AF37]" /> {isArabic ? "حقيبة المعتمر والحاج" : "Pilgrim Luggage Checklist"}
            </h3>
            <ul className="space-y-2 text-xs font-bold text-gray-500 dark:text-gray-400">
              <li className="flex gap-2 items-center">✓ {isArabic ? "ملابس الإحرام البيضاء النظيفة للرجال" : "White Ihram clothes (for men)"}</li>
              <li className="flex gap-2 items-center">✓ {isArabic ? "حذاء مريح وسهل الخلع للمشي الطويل" : "Comfortable walking footwear"}</li>
              <li className="flex gap-2 items-center">✓ {isArabic ? "سجادة صلاة جيب خفيفة الوزن" : "Lightweight travel prayer mat"}</li>
              <li className="flex gap-2 items-center">✓ {isArabic ? "مصحف جيب أو تطبيقات القرآن والأدعية" : "Dua book or smartphone app equivalents"}</li>
              <li className="flex gap-2 items-center">✓ {isArabic ? "مرطبات جلدية غير معطرة للوقاية من التسلخات" : "Unscented body lotion (for protection during Ihram)"}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#05073C] dark:text-white font-serif flex items-center gap-2">
              <FaBookOpen className="text-[#D4AF37]" /> {isArabic ? "توجيهات صحية وتنظيمية" : "Health & Safety Travel Tips"}
            </h3>
            <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-semibold">
              {isArabic 
                ? "احرص على شرب كميات كافية من المياه الباردة لتجنب الجفاف، وتجنب التعرض لأشعة الشمس المباشرة في أوقات الظهيرة. احتفظ ببطاقة الفندق وسوار التعريف الخاص بك طوال فترة إقامتك في مكة والمدينة."
                : "Ensure you stay hydrated by drinking plenty of water, and avoid direct midday sun exposure. Keep your hotel card and identification wristband on you at all times during your stay in Makkah & Madinah."}
            </p>
            <div className="pt-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-black mb-1">
                {isArabic ? "طوارئ الحرمين" : "EMERGENCY PHONE HOTLINES"}
              </span>
              <a href="tel:911" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#EB662B] bg-orange-50 dark:bg-orange-950/20 px-3.5 py-1.5 rounded-xl border border-orange-500/20 hover:scale-105 transition">
                <FaPhoneAlt size={11} /> 911 {isArabic ? "(رقم طوارئ الموحد)" : "(Unified Emergency Number)"}
              </a>
            </div>
          </div>
          
        </div>
      </SectionWrapper>

      {/* ── Booking Simulation Modal ── */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 p-6">
            
            <h3 className="text-lg font-black text-[#05073C] dark:text-white font-serif border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
              {isArabic ? "طلب حجز رحلة حج" : "Request Hajj Booking"}
            </h3>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
                <span className="text-5xl block animate-bounce">🕋</span>
                <h4 className="text-lg font-black text-green-600 dark:text-green-500">
                  {isArabic ? "تم تسجيل طلبك بنجاح!" : "Booking Request Received!"}
                </h4>
                <p className="text-xs text-gray-550 dark:text-gray-400 font-medium">
                  {isArabic 
                    ? "سيتواصل معك مستشار الحج الخاص بنا خلال 24 ساعة لاستكمال الأوراق والتأشيرة." 
                    : "Our Hajj coordinator will contact you via email/phone within 24 hours to finalize details."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Package Preview Banner */}
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-2xl p-4 text-xs">
                  <div className="flex justify-between items-start font-black text-gray-800 dark:text-white mb-1">
                    <span>{isArabic ? selectedPackage.name_ar : selectedPackage.name_en}</span>
                    <span className="text-[#EB662B] font-extrabold">${selectedPackage.price}</span>
                  </div>
                  <div className="text-gray-450 dark:text-gray-400 font-bold">
                    🏨 Makkah: {isArabic ? selectedPackage.hotel_makkah_ar : selectedPackage.hotel_makkah_en}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{isArabic ? "الاسم الكامل" : "Your Name"}</label>
                    <input
                      type="text" required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{isArabic ? "الهاتف" : "Phone"}</label>
                      <input
                        type="tel" required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{isArabic ? "البريد الإلكتروني" : "Email"}</label>
                      <input
                        type="email" required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{isArabic ? "تاريخ السفر المفضل" : "Travel Date"}</label>
                      <input
                        type="date" required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        value={bookingForm.travelDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{isArabic ? "عدد المسافرين" : "Passengers"}</label>
                      <input
                        type="number" min={1} required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        value={bookingForm.passengers}
                        onChange={(e) => setBookingForm({ ...bookingForm, passengers: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{isArabic ? "ملاحظات إضافية" : "Special Requests"}</label>
                    <textarea
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-16 resize-none"
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-500 rounded-2xl font-black text-xs transition"
                  >
                    {isArabic ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#05073C] text-white dark:bg-[#D4AF37] dark:text-[#05073C] rounded-2xl font-black text-xs transition"
                  >
                    {isArabic ? "تأكيد الطلب" : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default HajjUmrahPage;
