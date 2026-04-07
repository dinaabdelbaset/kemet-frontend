import { useState, useRef, useEffect } from "react";
import { FaPlane, FaSearch, FaTimes } from "react-icons/fa";

export const WORLD_AIRPORTS = [
  // 🇪🇬 مصر
  { code: "CAI", city: "القاهرة", country: "مصر", flag: "🇪🇬" },
  { code: "LXR", city: "الأقصر", country: "مصر", flag: "🇪🇬" },
  { code: "ASW", city: "أسوان", country: "مصر", flag: "🇪🇬" },
  { code: "HRG", city: "الغردقة", country: "مصر", flag: "🇪🇬" },
  { code: "SSH", city: "شرم الشيخ", country: "مصر", flag: "🇪🇬" },
  { code: "ALY", city: "الإسكندرية", country: "مصر", flag: "🇪🇬" },
  { code: "HBE", city: "برج العرب", country: "مصر", flag: "🇪🇬" },
  // 🇸🇦 السعودية
  { code: "RUH", city: "الرياض", country: "السعودية", flag: "🇸🇦" },
  { code: "JED", city: "جدة", country: "السعودية", flag: "🇸🇦" },
  { code: "MED", city: "المدينة المنورة", country: "السعودية", flag: "🇸🇦" },
  { code: "DMM", city: "الدمام", country: "السعودية", flag: "🇸🇦" },
  { code: "AHB", city: "أبها", country: "السعودية", flag: "🇸🇦" },
  // 🇦🇪 الإمارات
  { code: "DXB", city: "دبي", country: "الإمارات", flag: "🇦🇪" },
  { code: "AUH", city: "أبوظبي", country: "الإمارات", flag: "🇦🇪" },
  { code: "SHJ", city: "الشارقة", country: "الإمارات", flag: "🇦🇪" },
  // 🇶🇦 قطر
  { code: "DOH", city: "الدوحة", country: "قطر", flag: "🇶🇦" },
  // 🇰🇼 الكويت
  { code: "KWI", city: "الكويت", country: "الكويت", flag: "🇰🇼" },
  // 🇧🇭 البحرين
  { code: "BAH", city: "المنامة", country: "البحرين", flag: "🇧🇭" },
  // 🇴🇲 عُمان
  { code: "MCT", city: "مسقط", country: "عُمان", flag: "🇴🇲" },
  { code: "SLL", city: "صلالة", country: "عُمان", flag: "🇴🇲" },
  // 🇯🇴 الأردن
  { code: "AMM", city: "عمان", country: "الأردن", flag: "🇯🇴" },
  { code: "AQJ", city: "العقبة", country: "الأردن", flag: "🇯🇴" },
  // 🇱🇧 لبنان
  { code: "BEY", city: "بيروت", country: "لبنان", flag: "🇱🇧" },
  // 🇸🇾 سوريا
  { code: "DAM", city: "دمشق", country: "سوريا", flag: "🇸🇾" },
  // 🇮🇶 العراق
  { code: "BGW", city: "بغداد", country: "العراق", flag: "🇮🇶" },
  { code: "BSR", city: "البصرة", country: "العراق", flag: "🇮🇶" },
  { code: "EBL", city: "أربيل", country: "العراق", flag: "🇮🇶" },
  // 🇾🇪 اليمن
  { code: "SAH", city: "صنعاء", country: "اليمن", flag: "🇾🇪" },
  // 🇸🇩 السودان
  { code: "KRT", city: "الخرطوم", country: "السودان", flag: "🇸🇩" },
  // 🇲🇦 المغرب
  { code: "CMN", city: "الدار البيضاء", country: "المغرب", flag: "🇲🇦" },
  { code: "RAK", city: "مراكش", country: "المغرب", flag: "🇲🇦" },
  { code: "FEZ", city: "فاس", country: "المغرب", flag: "🇲🇦" },
  { code: "AGA", city: "أغادير", country: "المغرب", flag: "🇲🇦" },
  // 🇹🇳 تونس
  { code: "TUN", city: "تونس", country: "تونس", flag: "🇹🇳" },
  { code: "SFA", city: "صفاقس", country: "تونس", flag: "🇹🇳" },
  // 🇩🇿 الجزائر
  { code: "ALG", city: "الجزائر", country: "الجزائر", flag: "🇩🇿" },
  { code: "ORN", city: "وهران", country: "الجزائر", flag: "🇩🇿" },
  // 🇱🇾 ليبيا
  { code: "TIP", city: "طرابلس", country: "ليبيا", flag: "🇱🇾" },
  // 🇪🇹 إثيوبيا
  { code: "ADD", city: "أديس أبابا", country: "إثيوبيا", flag: "🇪🇹" },
  // 🇰🇪 كينيا
  { code: "NBO", city: "نيروبي", country: "كينيا", flag: "🇰🇪" },
  { code: "MBA", city: "مومباسا", country: "كينيا", flag: "🇰🇪" },
  // 🇳🇬 نيجيريا
  { code: "LOS", city: "لاغوس", country: "نيجيريا", flag: "🇳🇬" },
  { code: "ABV", city: "ابوجا", country: "نيجيريا", flag: "🇳🇬" },
  // 🇬🇭 غانا
  { code: "ACC", city: "أكرا", country: "غانا", flag: "🇬🇭" },
  // 🇿🇦 جنوب أفريقيا
  { code: "JNB", city: "جوهانسبرغ", country: "جنوب أفريقيا", flag: "🇿🇦" },
  { code: "CPT", city: "كيب تاون", country: "جنوب أفريقيا", flag: "🇿🇦" },
  { code: "DUR", city: "ديربان", country: "جنوب أفريقيا", flag: "🇿🇦" },
  // 🇹🇿 تنزانيا
  { code: "DAR", city: "دار السلام", country: "تنزانيا", flag: "🇹🇿" },
  { code: "ZNZ", city: "زنجبار", country: "تنزانيا", flag: "🇹🇿" },
  // 🇸🇳 السنغال
  { code: "DSS", city: "داكار", country: "السنغال", flag: "🇸🇳" },
  // 🇨🇮 كوت ديفوار
  { code: "ABJ", city: "أبيدجان", country: "كوت ديفوار", flag: "🇨🇮" },
  // 🇨🇲 الكاميرون
  { code: "DLA", city: "دوالا", country: "الكاميرون", flag: "🇨🇲" },
  // 🇬🇧 المملكة المتحدة
  { code: "LHR", city: "لندن هيثرو", country: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "LGW", city: "لندن غاتويك", country: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "STN", city: "لندن ستانستد", country: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "MAN", city: "مانشستر", country: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "BHX", city: "برمنغهام", country: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "EDI", city: "إدنبرة", country: "المملكة المتحدة", flag: "🇬🇧" },
  // 🇫🇷 فرنسا
  { code: "CDG", city: "باريس شارل ديغول", country: "فرنسا", flag: "🇫🇷" },
  { code: "ORY", city: "باريس أورلي", country: "فرنسا", flag: "🇫🇷" },
  { code: "NCE", city: "نيس", country: "فرنسا", flag: "🇫🇷" },
  { code: "LYS", city: "ليون", country: "فرنسا", flag: "🇫🇷" },
  { code: "MRS", city: "مرسيليا", country: "فرنسا", flag: "🇫🇷" },
  // 🇩🇪 ألمانيا
  { code: "FRA", city: "فرانكفورت", country: "ألمانيا", flag: "🇩🇪" },
  { code: "MUC", city: "ميونيخ", country: "ألمانيا", flag: "🇩🇪" },
  { code: "BER", city: "برلين", country: "ألمانيا", flag: "🇩🇪" },
  { code: "HAM", city: "هامبورغ", country: "ألمانيا", flag: "🇩🇪" },
  { code: "DUS", city: "دوسلدورف", country: "ألمانيا", flag: "🇩🇪" },
  { code: "STR", city: "شتوتغارت", country: "ألمانيا", flag: "🇩🇪" },
  // 🇮🇹 إيطاليا
  { code: "FCO", city: "روما", country: "إيطاليا", flag: "🇮🇹" },
  { code: "MXP", city: "ميلانو", country: "إيطاليا", flag: "🇮🇹" },
  { code: "VCE", city: "البندقية", country: "إيطاليا", flag: "🇮🇹" },
  { code: "NAP", city: "نابولي", country: "إيطاليا", flag: "🇮🇹" },
  // 🇪🇸 إسبانيا
  { code: "MAD", city: "مدريد", country: "إسبانيا", flag: "🇪🇸" },
  { code: "BCN", city: "برشلونة", country: "إسبانيا", flag: "🇪🇸" },
  { code: "PMI", city: "مايوركا", country: "إسبانيا", flag: "🇪🇸" },
  { code: "AGP", city: "ماليقة", country: "إسبانيا", flag: "🇪🇸" },
  { code: "VLC", city: "فالنسيا", country: "إسبانيا", flag: "🇪🇸" },
  { code: "TFN", city: "تينيريفي", country: "إسبانيا", flag: "🇪🇸" },
  // 🇳🇱 هولندا
  { code: "AMS", city: "أمستردام", country: "هولندا", flag: "🇳🇱" },
  // 🇧🇪 بلجيكا
  { code: "BRU", city: "بروكسل", country: "بلجيكا", flag: "🇧🇪" },
  // 🇨🇭 سويسرا
  { code: "ZRH", city: "زيورخ", country: "سويسرا", flag: "🇨🇭" },
  { code: "GVA", city: "جنيف", country: "سويسرا", flag: "🇨🇭" },
  // 🇦🇹 النمسا
  { code: "VIE", city: "فيينا", country: "النمسا", flag: "🇦🇹" },
  { code: "SZG", city: "سالزبورغ", country: "النمسا", flag: "🇦🇹" },
  // 🇵🇹 البرتغال
  { code: "LIS", city: "لشبونة", country: "البرتغال", flag: "🇵🇹" },
  { code: "OPO", city: "بورتو", country: "البرتغال", flag: "🇵🇹" },
  { code: "FAO", city: "فارو", country: "البرتغال", flag: "🇵🇹" },
  // 🇬🇷 اليونان
  { code: "ATH", city: "أثينا", country: "اليونان", flag: "🇬🇷" },
  { code: "SKG", city: "تسالونيكي", country: "اليونان", flag: "🇬🇷" },
  { code: "HER", city: "إيراكليو - كريت", country: "اليونان", flag: "🇬🇷" },
  { code: "RHO", city: "رودس", country: "اليونان", flag: "🇬🇷" },
  // 🇹🇷 تركيا
  { code: "IST", city: "إسطنبول", country: "تركيا", flag: "🇹🇷" },
  { code: "SAW", city: "إسطنبول صبيحة", country: "تركيا", flag: "🇹🇷" },
  { code: "AYT", city: "أنطاليا", country: "تركيا", flag: "🇹🇷" },
  { code: "ADB", city: "إزمير", country: "تركيا", flag: "🇹🇷" },
  { code: "ESB", city: "أنقرة", country: "تركيا", flag: "🇹🇷" },
  { code: "DLM", city: "دالامان", country: "تركيا", flag: "🇹🇷" },
  // 🇷🇺 روسيا
  { code: "SVO", city: "موسكو شيريميتيفو", country: "روسيا", flag: "🇷🇺" },
  { code: "DME", city: "موسكو دوميدوفو", country: "روسيا", flag: "🇷🇺" },
  { code: "LED", city: "سانت بطرسبرغ", country: "روسيا", flag: "🇷🇺" },
  { code: "SVX", city: "يكاترينبرغ", country: "روسيا", flag: "🇷🇺" },
  { code: "VVO", city: "فلاديفوستوك", country: "روسيا", flag: "🇷🇺" },
  // 🇵🇱 بولندا
  { code: "WAW", city: "وارسو", country: "بولندا", flag: "🇵🇱" },
  { code: "KRK", city: "كراكوف", country: "بولندا", flag: "🇵🇱" },
  // 🇨🇿 التشيك
  { code: "PRG", city: "براغ", country: "التشيك", flag: "🇨🇿" },
  // 🇭🇺 هنغاريا
  { code: "BUD", city: "بودابست", country: "هنغاريا", flag: "🇭🇺" },
  // 🇷🇴 رومانيا
  { code: "OTP", city: "بوخارست", country: "رومانيا", flag: "🇷🇴" },
  // 🇧🇬 بلغاريا
  { code: "SOF", city: "صوفيا", country: "بلغاريا", flag: "🇧🇬" },
  { code: "VAR", city: "فارنا", country: "بلغاريا", flag: "🇧🇬" },
  // 🇷🇸 صربيا
  { code: "BEG", city: "بلغراد", country: "صربيا", flag: "🇷🇸" },
  // 🇭🇷 كرواتيا
  { code: "ZAG", city: "زغرب", country: "كرواتيا", flag: "🇭🇷" },
  { code: "DBV", city: "دوبروفنيك", country: "كرواتيا", flag: "🇭🇷" },
  // 🇩🇰 الدنمارك
  { code: "CPH", city: "كوبنهاغن", country: "الدنمارك", flag: "🇩🇰" },
  // 🇸🇪 السويد
  { code: "ARN", city: "ستوكهولم", country: "السويد", flag: "🇸🇪" },
  { code: "GOT", city: "غوتنبرغ", country: "السويد", flag: "🇸🇪" },
  // 🇳🇴 النرويج
  { code: "OSL", city: "أوسلو", country: "النرويج", flag: "🇳🇴" },
  // 🇫🇮 فنلندا
  { code: "HEL", city: "هلسنكي", country: "فنلندا", flag: "🇫🇮" },
  // 🇮🇪 أيرلندا
  { code: "DUB", city: "دبلن", country: "أيرلندا", flag: "🇮🇪" },
  // 🇮🇸 آيسلندا
  { code: "KEF", city: "ريكيافيك", country: "آيسلندا", flag: "🇮🇸" },
  // 🇲🇹 مالطا
  { code: "MLA", city: "مالطا", country: "مالطا", flag: "🇲🇹" },
  // 🇨🇾 قبرص
  { code: "LCA", city: "لارنكا", country: "قبرص", flag: "🇨🇾" },
  { code: "PFO", city: "بافوس", country: "قبرص", flag: "🇨🇾" },
  // 🇨🇳 الصين
  { code: "PEK", city: "بكين", country: "الصين", flag: "🇨🇳" },
  { code: "PKX", city: "بكين داكسينج", country: "الصين", flag: "🇨🇳" },
  { code: "PVG", city: "شنغهاي بودونغ", country: "الصين", flag: "🇨🇳" },
  { code: "SHA", city: "شنغهاي هونغتشياو", country: "الصين", flag: "🇨🇳" },
  { code: "CAN", city: "غوانغتشو", country: "الصين", flag: "🇨🇳" },
  { code: "CTU", city: "تشنغدو", country: "الصين", flag: "🇨🇳" },
  { code: "SZX", city: "شنتشن", country: "الصين", flag: "🇨🇳" },
  { code: "XIY", city: "شيآن", country: "الصين", flag: "🇨🇳" },
  { code: "CKG", city: "تشونغتشينغ", country: "الصين", flag: "🇨🇳" },
  { code: "WUH", city: "ووهان", country: "الصين", flag: "🇨🇳" },
  { code: "HGH", city: "هانغتشو", country: "الصين", flag: "🇨🇳" },
  { code: "URC", city: "أورومتشي", country: "الصين", flag: "🇨🇳" },
  { code: "HRB", city: "هاربين", country: "الصين", flag: "🇨🇳" },
  { code: "KMG", city: "كونمينغ", country: "الصين", flag: "🇨🇳" },
  // 🇭🇰 هونغ كونغ
  { code: "HKG", city: "هونغ كونغ", country: "هونغ كونغ", flag: "🇭🇰" },
  // 🇲🇴 ماكاو
  { code: "MFM", city: "ماكاو", country: "ماكاو", flag: "🇲🇴" },
  // 🇯🇵 اليابان
  { code: "NRT", city: "طوكيو ناريتا", country: "اليابان", flag: "🇯🇵" },
  { code: "HND", city: "طوكيو هانيدا", country: "اليابان", flag: "🇯🇵" },
  { code: "KIX", city: "أوساكا", country: "اليابان", flag: "🇯🇵" },
  { code: "NGO", city: "ناغويا", country: "اليابان", flag: "🇯🇵" },
  { code: "CTS", city: "سابورو", country: "اليابان", flag: "🇯🇵" },
  { code: "FUK", city: "فوكوكا", country: "اليابان", flag: "🇯🇵" },
  { code: "OKA", city: "أوكيناوا", country: "اليابان", flag: "🇯🇵" },
  // 🇰🇷 كوريا الجنوبية
  { code: "ICN", city: "سيؤول إنشيون", country: "كوريا الجنوبية", flag: "🇰🇷" },
  { code: "GMP", city: "سيؤول غيمبو", country: "كوريا الجنوبية", flag: "🇰🇷" },
  { code: "PUS", city: "بوسان", country: "كوريا الجنوبية", flag: "🇰🇷" },
  // 🇹🇼 تايوان
  { code: "TPE", city: "تايبيه", country: "تايوان", flag: "🇹🇼" },
  // 🇹🇭 تايلاند
  { code: "BKK", city: "بانكوك سوفارنابومي", country: "تايلاند", flag: "🇹🇭" },
  { code: "DMK", city: "بانكوك دون مواينج", country: "تايلاند", flag: "🇹🇭" },
  { code: "HKT", city: "فوكيت", country: "تايلاند", flag: "🇹🇭" },
  { code: "CNX", city: "شيانغ ماي", country: "تايلاند", flag: "🇹🇭" },
  // 🇸🇬 سنغافورة
  { code: "SIN", city: "سنغافورة", country: "سنغافورة", flag: "🇸🇬" },
  // 🇲🇾 ماليزيا
  { code: "KUL", city: "كوالالمبور", country: "ماليزيا", flag: "🇲🇾" },
  { code: "PEN", city: "بينانغ", country: "ماليزيا", flag: "🇲🇾" },
  { code: "BKI", city: "كوتا كينابالو", country: "ماليزيا", flag: "🇲🇾" },
  // 🇮🇩 إندونيسيا
  { code: "CGK", city: "جاكرتا", country: "إندونيسيا", flag: "🇮🇩" },
  { code: "DPS", city: "بالي", country: "إندونيسيا", flag: "🇮🇩" },
  { code: "SUB", city: "سورابايا", country: "إندونيسيا", flag: "🇮🇩" },
  // 🇵🇭 الفلبين
  { code: "MNL", city: "مانيلا", country: "الفلبين", flag: "🇵🇭" },
  { code: "CEB", city: "سيبو", country: "الفلبين", flag: "🇵🇭" },
  // 🇻🇳 فيتنام
  { code: "SGN", city: "هوشي منه", country: "فيتنام", flag: "🇻🇳" },
  { code: "HAN", city: "هانوي", country: "فيتنام", flag: "🇻🇳" },
  { code: "DAD", city: "دا نانغ", country: "فيتنام", flag: "🇻🇳" },
  // 🇰🇭 كمبوديا
  { code: "PNH", city: "بنوم بنه", country: "كمبوديا", flag: "🇰🇭" },
  { code: "REP", city: "سيم ريب", country: "كمبوديا", flag: "🇰🇭" },
  // 🇱🇰 سريلانكا
  { code: "CMB", city: "كولومبو", country: "سريلانكا", flag: "🇱🇰" },
  // 🇮🇳 الهند
  { code: "DEL", city: "نيودلهي", country: "الهند", flag: "🇮🇳" },
  { code: "BOM", city: "مومباي", country: "الهند", flag: "🇮🇳" },
  { code: "BLR", city: "بنغالور", country: "الهند", flag: "🇮🇳" },
  { code: "MAA", city: "تشيناي", country: "الهند", flag: "🇮🇳" },
  { code: "CCU", city: "كولكاتا", country: "الهند", flag: "🇮🇳" },
  { code: "HYD", city: "حيدر أباد", country: "الهند", flag: "🇮🇳" },
  { code: "AMD", city: "أحمد آباد", country: "الهند", flag: "🇮🇳" },
  { code: "GOI", city: "غوا", country: "الهند", flag: "🇮🇳" },
  // 🇵🇰 باكستان
  { code: "KHI", city: "كراتشي", country: "باكستان", flag: "🇵🇰" },
  { code: "LHE", city: "لاهور", country: "باكستان", flag: "🇵🇰" },
  { code: "ISB", city: "إسلام أباد", country: "باكستان", flag: "🇵🇰" },
  // 🇧🇩 بنغلاديش
  { code: "DAC", city: "دكا", country: "بنغلاديش", flag: "🇧🇩" },
  // 🇳🇵 نيبال
  { code: "KTM", city: "كاتماندو", country: "نيبال", flag: "🇳🇵" },
  // 🇲🇻 المالديف
  { code: "MLE", city: "ماليه", country: "المالديف", flag: "🇲🇻" },
  // 🇮🇷 إيران
  { code: "THR", city: "طهران مهر أباد", country: "إيران", flag: "🇮🇷" },
  { code: "IKA", city: "طهران إمام خميني", country: "إيران", flag: "🇮🇷" },
  { code: "MHD", city: "مشهد", country: "إيران", flag: "🇮🇷" },
  // 🇦🇿 أذربيجان
  { code: "GYD", city: "باكو", country: "أذربيجان", flag: "🇦🇿" },
  // 🇬🇪 جورجيا
  { code: "TBS", city: "تبليسي", country: "جورجيا", flag: "🇬🇪" },
  { code: "BUS", city: "باتومي", country: "جورجيا", flag: "🇬🇪" },
  // 🇦🇲 أرمينيا
  { code: "EVN", city: "يريفان", country: "أرمينيا", flag: "🇦🇲" },
  // 🇰🇿 كازاخستان
  { code: "ALA", city: "ألماتي", country: "كازاخستان", flag: "🇰🇿" },
  { code: "NQZ", city: "أستانا", country: "كازاخستان", flag: "🇰🇿" },
  // 🇺🇿 أوزبكستان
  { code: "TAS", city: "طشقند", country: "أوزبكستان", flag: "🇺🇿" },
  { code: "SKD", city: "سمرقند", country: "أوزبكستان", flag: "🇺🇿" },
  // 🇺🇸 الولايات المتحدة
  { code: "JFK", city: "نيويورك JFK", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "EWR", city: "نيويورك نيوارك", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "LGA", city: "نيويورك لاغارديا", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "LAX", city: "لوس أنجلوس", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "ORD", city: "شيكاغو أوهير", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "ATL", city: "أتلانتا", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "DFW", city: "دالاس", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "MIA", city: "ميامي", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "SFO", city: "سان فرانسيسكو", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "BOS", city: "بوسطن", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "SEA", city: "سياتل", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "LAS", city: "لاس فيغاس", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "IAH", city: "هيوستن", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "IAD", city: "واشنطن دالس", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "DCA", city: "واشنطن ريغان", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "PHX", city: "فينيكس", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "DEN", city: "دنفر", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "MSP", city: "مينيابوليس", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "DTW", city: "ديترويت", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "CLT", city: "شارلوت", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "PHL", city: "فيلادلفيا", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "SAN", city: "سان دييغو", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "PDX", city: "بورتلاند", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "SLC", city: "سولت ليك سيتي", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "MCO", city: "أورلاندو", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "TPA", city: "تامبا", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "BNA", city: "ناشفيل", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "AUS", city: "أوستن", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "HNL", city: "هونولولو - هاواي", country: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "ANC", city: "أنكوريج - ألاسكا", country: "الولايات المتحدة", flag: "🇺🇸" },
  // 🇨🇦 كندا
  { code: "YYZ", city: "تورنتو", country: "كندا", flag: "🇨🇦" },
  { code: "YUL", city: "مونتريال", country: "كندا", flag: "🇨🇦" },
  { code: "YVR", city: "فانكوفر", country: "كندا", flag: "🇨🇦" },
  { code: "YYC", city: "كالغاري", country: "كندا", flag: "🇨🇦" },
  { code: "YEG", city: "إدمونتون", country: "كندا", flag: "🇨🇦" },
  { code: "YOW", city: "أوتاوا", country: "كندا", flag: "🇨🇦" },
  { code: "YHZ", city: "هاليفاكس", country: "كندا", flag: "🇨🇦" },
  { code: "YWG", city: "وينيبيغ", country: "كندا", flag: "🇨🇦" },
  // 🇲🇽 المكسيك
  { code: "MEX", city: "مكسيكو سيتي", country: "المكسيك", flag: "🇲🇽" },
  { code: "CUN", city: "كانكون", country: "المكسيك", flag: "🇲🇽" },
  { code: "GDL", city: "غوادالاخارا", country: "المكسيك", flag: "🇲🇽" },
  { code: "MTY", city: "مونتيري", country: "المكسيك", flag: "🇲🇽" },
  // 🇧🇷 البرازيل
  { code: "GRU", city: "ساو باولو", country: "البرازيل", flag: "🇧🇷" },
  { code: "GIG", city: "ريو دي جانيرو", country: "البرازيل", flag: "🇧🇷" },
  { code: "BSB", city: "برازيليا", country: "البرازيل", flag: "🇧🇷" },
  { code: "SSA", city: "سالفادور", country: "البرازيل", flag: "🇧🇷" },
  { code: "REC", city: "ريسيفي", country: "البرازيل", flag: "🇧🇷" },
  { code: "FOR", city: "فورتاليزا", country: "البرازيل", flag: "🇧🇷" },
  // 🇦🇷 الأرجنتين
  { code: "EZE", city: "بيونس آيريس", country: "الأرجنتين", flag: "🇦🇷" },
  // 🇨🇱 تشيلي
  { code: "SCL", city: "سانتياغو", country: "تشيلي", flag: "🇨🇱" },
  // 🇨🇴 كولومبيا
  { code: "BOG", city: "بوغوتا", country: "كولومبيا", flag: "🇨🇴" },
  { code: "MDE", city: "ميدلين", country: "كولومبيا", flag: "🇨🇴" },
  // 🇵🇪 بيرو
  { code: "LIM", city: "ليما", country: "بيرو", flag: "🇵🇪" },
  // 🇻🇪 فنزويلا
  { code: "CCS", city: "كاراكاس", country: "فنزويلا", flag: "🇻🇪" },
  // 🇨🇺 كوبا
  { code: "HAV", city: "هافانا", country: "كوبا", flag: "🇨🇺" },
  // 🇩🇴 الدومينيكان
  { code: "PUJ", city: "بونتا كانا", country: "الدومينيكان", flag: "🇩🇴" },
  // 🇦🇺 أستراليا
  { code: "SYD", city: "سيدني", country: "أستراليا", flag: "🇦🇺" },
  { code: "MEL", city: "ملبورن", country: "أستراليا", flag: "🇦🇺" },
  { code: "BNE", city: "بريزبان", country: "أستراليا", flag: "🇦🇺" },
  { code: "PER", city: "بيرث", country: "أستراليا", flag: "🇦🇺" },
  { code: "ADL", city: "أديلايد", country: "أستراليا", flag: "🇦🇺" },
  { code: "CNS", city: "كيرنز", country: "أستراليا", flag: "🇦🇺" },
  // 🇳🇿 نيوزيلندا
  { code: "AKL", city: "أوكلاند", country: "نيوزيلندا", flag: "🇳🇿" },
  { code: "CHC", city: "كرايستشيرش", country: "نيوزيلندا", flag: "🇳🇿" },
  { code: "WLG", city: "ويلينغتون", country: "نيوزيلندا", flag: "🇳🇿" },
  // 🇫🇯 فيجي
  { code: "NAN", city: "سوفا", country: "فيجي", flag: "🇫🇯" },
];

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  iconColor?: string;
  iconRotate?: string;
}

const AirportSelect = ({ label, value, onChange, iconColor = "#D4AF37", iconRotate = "" }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 1
    ? WORLD_AIRPORTS.filter(a =>
        a.city.includes(query) ||
        a.country.includes(query) ||
        a.code.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : WORLD_AIRPORTS.slice(0, 8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = WORLD_AIRPORTS.find(a => `${a.city} (${a.code})` === value);

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => { setOpen(!open); setTimeout(() => (ref.current?.querySelector("input") as HTMLInputElement)?.focus(), 50); }}
        className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-[#D4AF37]/50 flex items-center justify-between transition-all hover:border-white/20"
      >
        <span className={value ? "text-white" : "text-white/30"}>
          {selected ? `${selected.flag} ${selected.city} (${selected.code})` : "اختار مدينة..."}
        </span>
        <FaPlane className={`text-xs shrink-0 ${iconRotate}`} style={{ color: iconColor }} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-[#0a0d35] border border-white/15 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="p-2 border-b border-white/8 flex items-center gap-2">
            <FaSearch className="text-white/30 text-xs shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث عن مدينة أو دولة أو كود..."
              className="flex-1 bg-transparent text-white text-xs placeholder-white/30 focus:outline-none"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-white/30 hover:text-white transition">
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-white/30 text-xs text-center">لا توجد نتائج</div>
            ) : (
              filtered.map(airport => {
                const val = `${airport.city} (${airport.code})`;
                const isActive = value === val;
                return (
                  <button key={airport.code} type="button"
                    onClick={() => { onChange(val); setOpen(false); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-white/8 transition-all duration-150"
                    style={{ backgroundColor: isActive ? "rgba(212,175,55,0.1)" : undefined }}
                  >
                    <span className="text-lg shrink-0">{airport.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-black truncate">{airport.city}</p>
                      <p className="text-white/40 text-[10px] truncate">{airport.country}</p>
                    </div>
                    <span className="text-[#D4AF37] text-[10px] font-black shrink-0">{airport.code}</span>
                    {isActive && <span className="text-[#4caf82] text-xs">✓</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSelect;
