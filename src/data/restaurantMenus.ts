import type { IMeal } from "../pages/MenuCategoryPage";

export const getSpecificRestaurantMenu = (restaurantName: string, category: string): IMeal[] | null => {
  const nameLc = (restaurantName || "").toLowerCase();

  // If the user clicks 'drinks' or 'desserts' or 'breakfast', unless it's a specific cafe/bakery, 
  // return null to let the system auto-generate the restaurant-specific generic drinks/desserts.
  const isDessertOrDrinkCafe = nameLc.includes('delices') || nameLc.includes('ديليس') || nameLc.includes('farsha') || nameLc.includes('فرشة') || nameLc.includes('terrace') || nameLc.includes('تيراس');
  
  if (!isDessertOrDrinkCafe) {
    if (category === 'drinks' || category === 'desserts' || category === 'breakfast') {
      return null;
    }
  }

  /* =========================================
     CAIRO & GIZA (6 Restaurants)
     ========================================= */
  if (nameLc.includes("baha") || nameLc.includes("بحة")) {
    return [
      { id: 101, title: "رغيف سمين مشكل (رغيف بحة الأصلي)", img: "/food/samin_sandwich.png", price: 12.0, calories: 850 },
      { id: 102, title: "طلب حلويات المذبح (فشة وطحال)", img: "/food/fesha_spleen.png", price: 15.0, calories: 950 },
      { id: 103, title: "طلب ممبار بلدي محمر", img: "/food/mombar_only.png", price: 10.0, calories: 700 },
      { id: 104, title: "طاجن كوارع مخلية بالبصل", img: "/food/knuckles_onion_tagine.png", price: 18.0, calories: 900 },
      { id: 105, title: "طاجن عكاوي", img: "/food/okra_lamb_tagine.png", price: 20.0, calories: 950 }
    ];
  }
  if (nameLc.includes("sobhy") || nameLc.includes("صبحي")) {
    return [
      { id: 201, title: "طاجن ملوخية صبحي كابر", img: "/food/molokhia_new.png", price: 4.0, calories: 350 },
      { id: 202, title: "طاجن عكاوي بالبصل", img: "/food/okra_lamb_tagine.png", price: 18.0, calories: 950 },
      { id: 203, title: "كفتة مشوية على الفحم", img: "/food/egyptian_kebab_kofta.png", price: 20.0, calories: 900 },
      { id: 204, title: "طرب ضاني محشي", img: "/food/egyptian_kebab_kofta.png", price: 25.0, calories: 950 },
      { id: 205, title: "كباب بتلو مخصوص", img: "/food/egyptian_kebab_kofta.png", price: 30.0, calories: 800 },
      { id: 206, title: "نيفة مشوية بالفرن", img: "/food/lamb_chops_grill.png", price: 28.0, calories: 850 },
      { id: 207, title: "دجاجة مشوية على الفحم", img: "/food/egyptian_chicken_grill.png", price: 15.0, calories: 750 },
      { id: 208, title: "طاجن ورق عنب بالكوارع", img: "/food/grape_leaves_knuckles.png", price: 15.0, calories: 850 },
      { id: 209, title: "رغيف حواوشي على الفحم", img: "/food/hawawshi_meat.png", price: 5.0, calories: 600 }
    ];
  }
  if (nameLc.includes("kababgy") || nameLc.includes("كبابجي")) {
    return [
      { id: 301, title: "ريش ضاني مشوية على الفحم", img: "/food/lamb_chops_grill.png", price: 45.0, calories: 1100 },
      { id: 302, title: "موزة ضاني بالخضار والارز", img: "/food/mandi_meat_tray.png", price: 35.0, calories: 950 },
      { id: 303, title: "حمام محشي أرز بالخلطة", img: "/food/stuffed_pigeon.png", price: 18.0, calories: 800 },
      { id: 304, title: "طرب ضاني محشي", img: "/food/egyptian_kebab_kofta.png", price: 25.0, calories: 900 },
      { id: 305, title: "كباب وكفتة مشكل", img: "/food/egyptian_kebab_kofta.png", price: 30.0, calories: 850 },
      { id: 306, title: "نصف دجاجة مشوية", img: "/food/egyptian_chicken_grill.png", price: 12.0, calories: 600 }
    ];
  }
  if (nameLc.includes("tarek") || nameLc.includes("طارق")) {
    return [
      { id: 401, title: "كشري أبو طارق", img: "/food/koshary_authentic.png", price: 3.0, calories: 650 },
      { id: 402, title: "طاجن مكرونة بالفراخ", img: "/food/koshary_chicken_tagine.png", price: 4.5, calories: 750 },
      { id: 403, title: "طاجن مكرونة باللحمة المفرومة", img: "/food/koshary_meat_tagine.png", price: 4.0, calories: 800 },
      { id: 404, title: "طاجن مكرونة فراخ بالموتزاريلا", img: "/food/koshary_chicken_mozzarella.png", price: 5.5, calories: 950 },
      { id: 405, title: "طاجن مكرونة لحمة بالموتزاريلا", img: "/food/koshary_meat_mozzarella.png", price: 5.0, calories: 1000 },
      { id: 406, title: "عيش توست محمص", img: "/food/koshary_toast_bread.png", price: 1.0, calories: 350 },
      { id: 407, title: "سلطة بلدي خضراء", img: "/food/koshary_baladi_salad.png", price: 1.5, calories: 120 },
      { id: 408, title: "أكياس شطة ودقة إضافية", img: "/food/koshary_shata_dakka.png", price: 0.5, calories: 50 }
    ];
  }
  if (nameLc.includes("antar") || nameLc.includes("عنتر")) {
    return [
      { id: 501, title: "صينية الوحش للعائلات (مندي ومشويات)", img: "/food/mandi_family_tray.png", price: 150.0, calories: 5000 },
      { id: 502, title: "نفر لحم مندي دايب", img: "/food/mandi_meat_tray.png", price: 25.0, calories: 950 },
      { id: 503, title: "دجاجة مظبي على الحجر", img: "/food/egyptian_chicken_grill.png", price: 18.0, calories: 800 },
      { id: 504, title: "صينية بط وحمام محشي بالخلطة", img: "/food/duck_pigeon_tray.png", price: 45.0, calories: 1500 },
      { id: 505, title: "ريش ضاني مشوية عالفحم", img: "/food/lamb_chops_grill.png", price: 28.0, calories: 850 },
      { id: 506, title: "طلب طرب مشوي (كفتة بالمنديل)", img: "/food/egyptian_kebab_kofta.png", price: 20.0, calories: 1100 },
      { id: 507, title: "جوز حمام محشي أرز بالخلطة", img: "/food/stuffed_pigeon.png", price: 15.0, calories: 850 },
      { id: 508, title: "نصف بطة محمرة مع أرز خلطة", img: "/food/stuffed_ducks_fayoum.png", price: 30.0, calories: 1200 },
      { id: 509, title: "طاجن بامية باللحمة الضاني", img: "/food/okra_lamb_tagine.png", price: 16.0, calories: 650 },
      { id: 510, title: "طلب ممبار بلدي محمر", img: "/food/mombar_only.png", price: 10.0, calories: 750 },
      { id: 511, title: "شوربة كوارع مخلية بالبهارات", img: "/food/kaware_soup.png", price: 12.0, calories: 450 },
      { id: 512, title: "سلطة دقوس حارة", img: "/food/daqoos_sauce.png", price: 2.0, calories: 80 }
    ];
  }
  if (nameLc.includes("khufu") || nameLc.includes("خوفو")) {
    return [
      { id: 601, title: "سمان مشوي محشي بالفريك بصوص الرمان", img: "/food/khufu_stuffed_quail.png", price: 65.0, calories: 750 },
      { id: 602, title: "موزة ضاني مطهوة ببطء مع بيوريه", img: "/food/khufu_lamb_shank.png", price: 85.0, calories: 850 },
      { id: 603, title: "طاجن سي فود فاخر بصوص الزعفران", img: "/food/khufu_seafood_saffron.png", price: 95.0, calories: 600 },
      { id: 604, title: "حمام محشي فاخر بأرز الكمأة (الترافل)", img: "/food/khufu_pigeon_truffle.png", price: 75.0, calories: 700 }
    ];
  }

  /* =========================================
     ALEXANDRIA (6 Restaurants)
     ========================================= */
  if (nameLc.includes("samak") || nameLc.includes("حلقة")) {
    return [
      { id: 701, title: "سمك بوري سنجاري حلقة السمك", img: "/food/singary_bouri_new.png", price: 20.0, calories: 650 },
      { id: 702, title: "جمبري جامبو مشوي بترفلاي", img: "/food/butterfly_shrimp.png", price: 30.0, calories: 800 },
      { id: 703, title: "طاجن سبيط وبطارخ إسكندراني", img: "/food/seafood_creamy_tagine.png", price: 35.0, calories: 950 },
      { id: 704, title: "شوربة سي فود مخلية", img: "/food/seafood_soup_new.png", price: 15.0, calories: 400 },
      { id: 705, title: "أرز صيادية بالجمبري", img: "/food/sayadia_shrimp_rice.png", price: 10.0, calories: 500 },
      { id: 706, title: "سمك موسى مقلي", img: "/food/singary_fish.png", price: 22.0, calories: 550 }
    ];
  }
  if (nameLc.includes("falah") || nameLc.includes("فلاح")) {
    return [
      { id: 801, title: "رغيف كبدة إسكندراني", img: "/food/falah_kibda.png", price: 1.0, calories: 250 },
      { id: 802, title: "رغيف كبدة بالخلطة", img: "/food/falah_kibda_khalta.png", price: 1.2, calories: 280 },
      { id: 803, title: "رغيف سجق مشوي", img: "/food/falah_sogoq_grill.png", price: 1.5, calories: 320 },
      { id: 804, title: "رغيف سجق إسكندراني", img: "/food/falah_sogoq.png", price: 1.5, calories: 350 },
      { id: 805, title: "رغيف كبدة بالليمون المعصفر", img: "/food/falah_lemon_safflower.png", price: 1.2, calories: 260 },
      { id: 806, title: "رغيف سجق بالليمون المعصفر", img: "/food/falah_sogoq_lemon.png", price: 1.5, calories: 340 },
      { id: 807, title: "رغيف سوسيس إسكندراني", img: "/food/falah_hotdog.png", price: 1.2, calories: 380 },
      { id: 808, title: "رغيف كبدة إسكندراني (عيش بلدي)", img: "/food/falah_kibda_baladi.png", price: 1.5, calories: 300 },
      { id: 809, title: "رغيف سجق إسكندراني (عيش بلدي)", img: "/food/falah_sogoq_baladi.png", price: 2.0, calories: 400 }
    ];
  }
  if (nameLc.includes("swesra") || nameLc.includes("سويسرا")) {
    return [
      { id: 901, title: "طاسة سجق بالجبنة الشيدر والموتزاريلا", img: "/food/swesra_sogoq.png", price: 6.0, calories: 950 },
      { id: 902, title: "طاسة بسطرمة بالجبنة السايحة", img: "/food/swesra_pastrami.png", price: 7.0, calories: 850 },
      { id: 903, title: "مكرونة وايت صوص بالجبن السويسرية", img: "/food/macaroni_bechamel.png", price: 8.0, calories: 1000 },
      { id: 904, title: "طاسة سوسيس بصوص الكريمة", img: "/food/swesra_hotdog.png", price: 6.5, calories: 900 },
      { id: 905, title: "طاسة لحم مفروم وجبن الركفورد", img: "/food/swesra_minced_meat.png", price: 8.5, calories: 1100 }
    ];
  }
  if (nameLc.includes("wahab") || nameLc.includes("وهاب")) {
    return [
      { id: 1001, title: "مشاوي مشكلة لبنانية (كباب، طاووق)", img: "/food/egyptian_kebab_kofta.png", price: 28.0, calories: 1200 },
      { id: 1002, title: "دجاج مسحب مشوي على الفحم", img: "/food/egyptian_chicken_grill.png", price: 18.0, calories: 750 },
      { id: 1003, title: "تبولة وفتوش ومقبلات لبنانية", img: "/food/green_salad.png", price: 8.0, calories: 300 },
      { id: 1004, title: "حمص بيروتي باللحمة", img: "/food/babaganoush_new.png", price: 10.0, calories: 500 }
    ];
  }
  if (nameLc.includes("kadoura") || nameLc.includes("قدورة")) {
    return [
      { id: 1101, title: "طاجن سي فود بالكريمة والجبن الموزاريلا", img: "/food/seafood_creamy_tagine.png", price: 25.0, calories: 850 },
      { id: 1102, title: "سمك دنيس مشوي زيت وليمون", img: "/food/singary_fish.png", price: 22.0, calories: 500 },
      { id: 1103, title: "كاليماري مقلي مقرمش", img: "/food/fried_calamari.png", price: 15.0, calories: 600 },
      { id: 1104, title: "شوربة قدورة المخصوصة", img: "/food/seafood_soup_new.png", price: 18.0, calories: 450 },
      { id: 1105, title: "مكرونة سي فود", img: "/food/macaroni_bechamel.png", price: 20.0, calories: 750 }
    ];
  }
  if (nameLc.includes("delices") || nameLc.includes("ديليس")) {
    return [
      { id: 1201, title: "أومليت فرنسي بالجبنة والمشروم", img: "/food/delices_omelet.png", price: 8.0, calories: 450 },
      { id: 1202, title: "كرواسون اللوز الطازج", img: "/food/delices_croissant.png", price: 4.0, calories: 380 },
      { id: 1203, title: "ملفيه ديليس الفرنسي الكلاسيكي", img: "/food/delices_millefeuille.png", price: 5.0, calories: 450 },
      { id: 1204, title: "كعكة الشوكولاتة اليونانية", img: "/food/delices_chocolate_cake.png", price: 6.0, calories: 550 },
      { id: 1205, title: "قهوة إسبريسو إيطالية", img: "/food/delices_coffee.png", price: 2.0, calories: 10 }
    ];
  }

  /* =========================================
     LUXOR & ASWAN (6 Restaurants)
     ========================================= */
  if (nameLc.includes("solaih") || nameLc.includes("صليح") || nameLc.includes("صلح")) {
    return [
      { id: 1301, title: "طاجن جاكود نوبي بالسبانخ واللحم", img: "/food/okra_lamb_tagine.png", price: 14.0, calories: 650 },
      { id: 1302, title: "ويكة صعيدي مفرومة بالتقلية", img: "/food/molokhia_new.png", price: 8.0, calories: 300 },
      { id: 1303, title: "أرز بالشعيرية نوبي بالسمن البلدي", img: "/food/vermicelli_rice_new.png", price: 4.0, calories: 450 },
      { id: 1304, title: "مشروب الكركديه الأسواني الساقع", img: "/food/enab.png", price: 2.0, calories: 120 }
    ];
  }
  if (nameLc.includes("sofra") || nameLc.includes("سفرة")) {
    return [
      { id: 1401, title: "حمام محشي فريك أكل بيتي مصري", img: "/food/stuffed_pigeon.png", price: 18.0, calories: 800 },
      { id: 1402, title: "طاجن ملوخية بالثوم والكسبرة (سفرة)", img: "/food/molokhia_new.png", price: 6.0, calories: 350 },
      { id: 1403, title: "محشي كرنب وورق عنب بلدي", img: "/food/mixed_mahshi_new.png", price: 8.0, calories: 600 },
      { id: 1404, title: "طاجن كوارع بالحمص", img: "/food/grape_leaves_knuckles.png", price: 20.0, calories: 850 },
      { id: 1405, title: "بط بلدي محمر في الفرن", img: "/food/stuffed_ducks_fayoum.png", price: 25.0, calories: 950 }
    ];
  }
  if (nameLc.includes("saeed") || nameLc.includes("صعيد")) {
    return [
      { id: 1501, title: "صينية مندي لحم ضاني صعيدي", img: "/food/mandi_meat_tray.png", price: 30.0, calories: 1300 },
      { id: 1502, title: "دجاج مدفون في التنور تحت الأرض", img: "/food/egyptian_chicken_grill.png", price: 15.0, calories: 900 },
      { id: 1503, title: "كفتة حاتي مشوية بالمكسرات", img: "/food/egyptian_kebab_kofta.png", price: 18.0, calories: 850 }
    ];
  }
  if (nameLc.includes("sahaby") || nameLc.includes("سحابي")) {
    return [
      { id: 1601, title: "ستيك لحم جملي مشوي (Camel Steak)", img: "/food/egyptian_kebab_kofta.png", price: 35.0, calories: 800 },
      { id: 1602, title: "طاجن بامية باللحم الجملي", img: "/food/okra_lamb_tagine.png", price: 20.0, calories: 650 },
      { id: 1603, title: "مكرونة فوتشيني ألفريدو الدجاج", img: "/food/macaroni_bechamel.png", price: 18.0, calories: 750 },
      { id: 1604, title: "أرز بسمتي بالزعفران والمكسرات", img: "/food/sayadia_rice.png", price: 8.0, calories: 400 }
    ];
  }
  if (nameLc.includes("dokka") || nameLc.includes("دكة")) {
    return [
      { id: 1701, title: "كوارع صعيدي مخلية بالصلصة", img: "/food/grape_leaves_knuckles.png", price: 20.0, calories: 950 },
      { id: 1702, title: "طبق حلويات المذبح (فشة وطحال)", img: "/food/mombar_fesha.png", price: 16.0, calories: 850 },
      { id: 1703, title: "ممبار بلدي محمر بالسمن", img: "/food/mombar_fesha.png", price: 12.0, calories: 700 },
      { id: 1704, title: "طاجن لحمة راس بالبصل", img: "/food/okra_lamb_tagine.png", price: 18.0, calories: 800 }
    ];
  }
  if (nameLc.includes("terrace") || nameLc.includes("تيراس")) {
    return [
      { id: 1801, title: "فطور الكاتراكت الملكي (High Tea)", img: "/food/greek_bakery.png", price: 40.0, calories: 850 },
      { id: 1802, title: "تشكيلة معجنات فرنسية وكعك", img: "/food/greek_bakery.png", price: 25.0, calories: 500 },
      { id: 1803, title: "ساندوتش كلوب تراس المميز", img: "/food/melted_cheese_sandwich.png", price: 15.0, calories: 600 },
      { id: 1804, title: "قهوة فرنسية وعصائر طازجة", img: "/food/orange_juice.png", price: 10.0, calories: 150 }
    ];
  }

  /* =========================================
     SHARM & HURGHADA (6 Restaurants)
     ========================================= */
  if (nameLc.includes("farsha") || nameLc.includes("فرشة")) {
    return [
      { id: 1901, title: "بيتزا مارجريتا نابوليتان", img: "/food/bedouin_pizza.png", price: 14.0, calories: 800 },
      { id: 1902, title: "عصير ليمون بالنعناع الفريش المميز", img: "/food/roz_bel_laban.png", price: 5.0, calories: 150 },
      { id: 1903, title: "شاي بدوي بالمريمية والنعناع عالفحم", img: "/food/egyptian_tea.png", price: 3.0, calories: 50 },
      { id: 1904, title: "شيشة فواكه طبيعية", img: "/food/turkish_coffee.png", price: 8.0, calories: 0 },
      { id: 1905, title: "كوكتيل فرشة الاستوائي", img: "/food/orange_juice.png", price: 6.0, calories: 200 }
    ];
  }
  if (nameLc.includes("starfish") || nameLc.includes("ستار فيش")) {
    return [
      { id: 2001, title: "شوربة ستار فيش المخصوصة (كريمة وموزاريلا)", img: "/food/seafood_soup_new.png", price: 18.0, calories: 600 },
      { id: 2002, title: "سمك دنيس مشوي زيت وليمون", img: "/food/singary_fish.png", price: 24.0, calories: 550 },
      { id: 2003, title: "مكرونة سي فود وايت صوص", img: "/food/macaroni_bechamel.png", price: 20.0, calories: 800 },
      { id: 2004, title: "جمبري بترفلاي مشوي مع خضار سوتيه", img: "/food/butterfly_shrimp.png", price: 35.0, calories: 700 },
      { id: 2005, title: "طاجن سبيط وجمبري أحمر", img: "/food/seafood_creamy_tagine.png", price: 28.0, calories: 850 }
    ];
  }
  if (nameLc.includes("zaitoun") || nameLc.includes("زيتون")) {
    return [
      { id: 2101, title: "لحم بدوي مدفون تحت الأرض (تسوية 12 ساعة)", img: "/food/mandi_meat_tray.png", price: 38.0, calories: 1200 },
      { id: 2102, title: "دجاج مظبي واحة الزيتون على الحجر", img: "/food/egyptian_chicken_grill.png", price: 15.0, calories: 800 },
      { id: 2103, title: "منسف بدوي واحاتي بالجميد", img: "/food/bedouin_mansaf.png", price: 40.0, calories: 1500 },
      { id: 2104, title: "أرز زرب واحاتي بالمكسرات", img: "/food/sayadia_rice.png", price: 8.0, calories: 450 }
    ];
  }
  if (nameLc.includes("masrien") || nameLc.includes("مصريين")) {
    return [
      { id: 2201, title: "كباب وكفتة مشكل ضاني حاتي", img: "/food/egyptian_kebab_kofta.png", price: 28.0, calories: 950 },
      { id: 2202, title: "حمام محشي مشوي (طريقة المصريين)", img: "/food/stuffed_pigeon.png", price: 16.0, calories: 850 },
      { id: 2203, title: "ريش بتلو مشوية على الفحم", img: "/food/lamb_chops_grill.png", price: 35.0, calories: 1050 },
      { id: 2204, title: "طاجن ورق عنب بالكوارع", img: "/food/grape_leaves_knuckles.png", price: 18.0, calories: 800 },
      { id: 2205, title: "نصف دجاجة مشوية", img: "/food/egyptian_chicken_grill.png", price: 12.0, calories: 600 }
    ];
  }
  if (nameLc.includes("buddha") || nameLc.includes("بودا")) {
    return [
      { id: 2301, title: "بلاتر سوشي مشكل (رولز ونينجيري)", img: "/food/sushi_platter.png", price: 45.0, calories: 850 },
      { id: 2302, title: "نودلز ترياكي بالدجاج والخضروات", img: "/food/sushi_platter.png", price: 22.0, calories: 700 },
      { id: 2303, title: "سلمون ترياكي مشوي مع أرز ستيكي", img: "/food/singary_fish.png", price: 40.0, calories: 550 },
      { id: 2304, title: "ديناميت شريمب سبايسي", img: "/food/fried_calamari.png", price: 18.0, calories: 450 }
    ];
  }
  if (nameLc.includes("gad") || nameLc.includes("جاد")) {
    return [
      { id: 2401, title: "ساندوتش فول إسكندراني بالزيت الحار", img: "/food/foul_medames.png", price: 1.0, calories: 400 },
      { id: 2402, title: "ساندوتش طعمية محشية شطة", img: "/food/taameya.png", price: 1.5, calories: 350 },
      { id: 2403, title: "فطيرة ميكس جبن (فطير جاد المالح)", img: "/food/feteer_meshaltet.png", price: 6.0, calories: 800 },
      { id: 2404, title: "ساندوتش بطاطس بانيه مقرمشة", img: "/food/taameya.png", price: 1.2, calories: 450 },
      { id: 2405, title: "فطيرة سكر ولبن (حلو)", img: "/food/feteer_meshaltet.png", price: 4.0, calories: 600 }
    ];
  }

  /* =========================================
     FAYOUM (6 Restaurants)
     ========================================= */
  if (nameLc.includes("ibis") || nameLc.includes("إيبيس")) {
    return [
      { id: 2501, title: "فطير مشلتت فلاحي كبير أوريجينال", img: "/food/feteer_meshaltet.png", price: 15.0, calories: 1200 },
      { id: 2502, title: "عسل أسود وطحينة وجبنة قديمة (مش)", img: "/food/babaganoush_new.png", price: 5.0, calories: 450 },
      { id: 2503, title: "بط محمر بالمرتة والأرز", img: "/food/stuffed_ducks_fayoum.png", price: 25.0, calories: 1100 },
      { id: 2504, title: "طاجن أرز معمر فلاحي بالقشطة", img: "/food/rice_pudding.png", price: 12.0, calories: 800 }
    ];
  }
  if (nameLc.includes("lake") || nameLc.includes("ليك")) {
    return [
      { id: 2601, title: "كفتة وطرب ضاني مشوي (تونس ليك)", img: "/food/egyptian_kebab_kofta.png", price: 18.0, calories: 1050 },
      { id: 2602, title: "نصف دجاجة مشوية عالفحم", img: "/food/egyptian_chicken_grill.png", price: 12.0, calories: 700 },
      { id: 2603, title: "مكرونة فرن بالبشاميل", img: "/food/macaroni_bechamel.png", price: 10.0, calories: 850 }
    ];
  }
  if (nameLc.includes("rashwan") || nameLc.includes("رشوان")) {
    return [
      { id: 2701, title: "بط فيومي محشي أرز وخلطة", img: "/food/stuffed_ducks_fayoum.png", price: 30.0, calories: 1400 },
      { id: 2702, title: "طاجن أرز معمر بالحمام المحشي", img: "/food/stuffed_pigeon.png", price: 20.0, calories: 950 },
      { id: 2703, title: "حمام كداب (وراك مخلية محشية أرز)", img: "/food/stuffed_pigeon.png", price: 15.0, calories: 850 },
      { id: 2704, title: "طاجن لسان عصفور باللحمة", img: "/food/okra_lamb_tagine.png", price: 12.0, calories: 600 }
    ];
  }
  if (nameLc.includes("zad") || nameLc.includes("زاد")) {
    return [
      { id: 2801, title: "طواجن لحم بالبصل في الفرن البلدي", img: "/food/okra_lamb_tagine.png", price: 16.0, calories: 850 },
      { id: 2802, title: "طاجن خضار بلدي مشكل (تورلي باللحم)", img: "/food/mixed_mahshi_new.png", price: 14.0, calories: 700 },
      { id: 2803, title: "فراخ مشوية بالخلطة الريفية", img: "/food/egyptian_chicken_grill.png", price: 12.0, calories: 650 }
    ];
  }
  if (nameLc.includes("gabaly") || nameLc.includes("جبلي")) {
    return [
      { id: 2901, title: "سمك الموسى المقلي (بحيرة قارون)", img: "/food/singary_fish.png", price: 20.0, calories: 600 },
      { id: 2902, title: "صينية جمبري بحيرة قارون الشهير", img: "/food/sayadia_shrimp_rice.png", price: 28.0, calories: 750 },
      { id: 2903, title: "طاجن مكرونة سي فود أسماك", img: "/food/macaroni_bechamel.png", price: 18.0, calories: 800 }
    ];
  }
  if (nameLc.includes("fayoum") && nameLc.includes("hadramout")) {
    return [
      { id: 3001, title: "صواني تيس مندي ريفي بالمكسرات", img: "/food/mandi_meat_tray.png", price: 35.0, calories: 1250 },
      { id: 3002, title: "دجاج مندي بالفحم", img: "/food/egyptian_chicken_grill.png", price: 14.0, calories: 700 }
    ];
  }

  /* =========================================
     PORT SAID & MATROUH (6 Restaurants)
     ========================================= */
  if (nameLc.includes("borg") || nameLc.includes("برج")) {
    return [
      { id: 3101, title: "شوربة بورسعيدي بيضاء أوريجينال", img: "/food/seafood_soup_new.png", price: 12.0, calories: 450 },
      { id: 3102, title: "سيبيا مقلية (كاليماري بورسعيدي أحجام)", img: "/food/fried_calamari.png", price: 22.0, calories: 600 },
      { id: 3103, title: "سمك لوط صينية بالبطاطس والليمون", img: "/food/singary_fish.png", price: 25.0, calories: 700 },
      { id: 3104, title: "طاجن بطارخ وسبيط بورسعيدي", img: "/food/seafood_creamy_tagine.png", price: 30.0, calories: 850 },
      { id: 3105, title: "جمبري مشوي بخلطة البرج", img: "/food/sayadia_shrimp_rice.png", price: 28.0, calories: 600 }
    ];
  }
  if (nameLc.includes("sultan") || nameLc.includes("سلطان")) {
    return [
      { id: 3201, title: "صينية منسف بدوي بالجميد الكركي", img: "/food/bedouin_mansaf.png", price: 35.0, calories: 1500 },
      { id: 3202, title: "اللحم المكمور الواحاتي (بدون أسماك)", img: "/food/bedouin_mansaf.png", price: 28.0, calories: 1200 },
      { id: 3203, title: "مكرونة مبكبكة باللحم الضاني", img: "/food/macaroni_bechamel.png", price: 20.0, calories: 950 },
      { id: 3204, title: "دجاج مشوي على الحطب والميرمية", img: "/food/egyptian_chicken_grill.png", price: 15.0, calories: 700 }
    ];
  }
  if (nameLc.includes("casten") || nameLc.includes("كاستن")) {
    return [
      { id: 3301, title: "ممبار بورسعيدي رفيع حار", img: "/food/mombar_fesha.png", price: 12.0, calories: 800 },
      { id: 3302, title: "شوربة كوارع مخلية (مخصوص كاستن)", img: "/food/grape_leaves_knuckles.png", price: 15.0, calories: 600 },
      { id: 3303, title: "طحال وفشة محمرة بالثوم", img: "/food/mombar_fesha.png", price: 14.0, calories: 750 },
      { id: 3304, title: "رغيف كبدة إسكندراني بورسعيدي", img: "/food/kibda_new.png", price: 5.0, calories: 450 }
    ];
  }
  if (nameLc.includes("daawa") || nameLc.includes("دعوة")) {
    return [
      { id: 3401, title: "رز صيادية بني غامق بورسعيدي", img: "/food/sayadia_shrimp_rice.png", price: 14.0, calories: 750 },
      { id: 3402, title: "صينية بطاطس بالسمك البوري والصلصة", img: "/food/singary_fish.png", price: 18.0, calories: 650 },
      { id: 3403, title: "سمك دنيس مشوي ردة بورسعيدي", img: "/food/singary_fish.png", price: 20.0, calories: 500 },
      { id: 3404, title: "ساندوتش جمبري مقلي فينو", img: "/food/fried_calamari.png", price: 8.0, calories: 450 }
    ];
  }
  if (nameLc.includes("tahrir") || nameLc.includes("تحرير")) {
    return [
      { id: 3501, title: "كشري التحرير ميجا (أكبر حجم)", img: "/food/koshary_authentic.png", price: 4.0, calories: 800 },
      { id: 3502, title: "كشري توب التحرير (وسط)", img: "/food/koshary_authentic.png", price: 3.0, calories: 600 },
      { id: 3503, title: "طاجن دجاج بصلصة الطماطم", img: "/food/fatta_new.png", price: 5.0, calories: 600 },
      { id: 3504, title: "طاجن لحمة مفرومة", img: "/food/fatta_new.png", price: 5.5, calories: 650 },
      { id: 3505, title: "أرز بلبن سادة", img: "/food/rice_pudding.png", price: 1.5, calories: 350 }
    ];
  }
  if (nameLc.includes("corallo") || nameLc.includes("كورالو")) {
    return [
      { id: 3601, title: "بيتزا بيبروني إيطالية بجبنة الموزاريلا", img: "/food/bedouin_pizza.png", price: 18.0, calories: 950 },
      { id: 3602, title: "مكرونة بيني أربياتا حارة", img: "/food/macaroni_bechamel.png", price: 14.0, calories: 600 },
      { id: 3603, title: "ريزوتو سي فود إيطالي", img: "/food/macaroni_bechamel.png", price: 25.0, calories: 800 },
      { id: 3604, title: "فوتشيني الفريدو بالدجاج والمشروم", img: "/food/macaroni_bechamel.png", price: 20.0, calories: 750 },
      { id: 3605, title: "سلطة سيزر بالدجاج المشوي", img: "/food/green_salad.png", price: 12.0, calories: 350 }
    ];
  }

  return null;
};
