import axiosClient from "./axiosClient";

export const getRestaurants = async () => {
    const response = await axiosClient.get("/restaurants");
    let data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    data = data.map((r: any) => {
        const titleLc = (r.name || r.title || "").toLowerCase();
        let newImage = r.image;
        if (titleLc.includes("kadoura") || r.name?.includes("قدورة")) newImage = "/images/restaurants/kadoura.png";
        else if (titleLc.includes("balbaa") || r.name?.includes("بلبع")) newImage = "/images/restaurants/balbaa.png";
        else if (titleLc.includes("fares") || r.name?.includes("فارس")) newImage = "/images/restaurants/fares.png";
        else if (titleLc.includes("masrien") || r.name?.includes("المصريين")) newImage = "/images/restaurants/masrien.png";
        else if (titleLc.includes("tarek") || r.name?.includes("طارق")) newImage = "/images/restaurants/cairo/abou_tarek.png";
        else if (titleLc.includes("prince") || r.name?.includes("برنس")) newImage = "/images/restaurants/cairo/el_prince.png";
        else if (titleLc.includes("felfela") || r.name?.includes("فلفلة")) newImage = "/images/restaurants/cairo/felfela.png";
        else if (titleLc.includes("gad") || r.name?.includes("جاد")) newImage = "/images/restaurants/hurghada/gad.png";
        else if (titleLc.includes("starfish") || r.name?.includes("ستار فيش")) newImage = "/images/restaurants/hurghada/starfish.png";
        else if (titleLc.includes("sofra") || r.name?.includes("سفرة")) newImage = "/images/restaurants/luxor/sofra.png";
        else if (titleLc.includes("sahaby") || r.name?.includes("صحابي")) newImage = "/images/restaurants/luxor/sahaby.png";
        else if (titleLc.includes("zephyrion") || r.name?.includes("زفيريون")) newImage = "/images/restaurants/zephyrion.png";
        else if (titleLc.includes("makka") || r.name?.includes("مكة")) newImage = "/images/restaurants/aswan/makka.png";
        else if (titleLc.includes("dokka") || r.name?.includes("دكة")) newImage = "/images/restaurants/aswan/el_dokka.png";
        else if (titleLc.includes("solaih") || r.name?.includes("صالح") || r.name?.includes("صلح")) newImage = "/images/restaurants/aswan/solaih.png";
        else if (newImage?.includes("unsplash") || newImage?.includes("hotel") || newImage === "placeholder.png" || !newImage) {
            const fallbackIndex = r.id ? ((r.id * 7) % 15) + 1 : Math.floor(Math.random() * 15) + 1;
            newImage = `/images/restaurants/r${fallbackIndex}.png`;
        }
        
        const isAr = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl' || document.cookie.includes('/ar');
        const c = (r.cuisine || "").toLowerCase();
        
        let newDesc = r.description;
        if (c.includes("seafood") || titleLc.includes("fish")) {
            newDesc = isAr 
                ? "يقدم أصناف بحرية مميزة تجلب لك طعم البحر المتوسط والأحمر بأسلوب أصيل وتتبيلة رائعة."
                : "Offers exquisite seafood dishes bringing the taste of the Mediterranean and Red Sea with authentic recipes.";
        } else if (c.includes("grill") || c.includes("kebab") || c.includes("مريم")) {
            newDesc = isAr 
                ? "أفضل المشويات الشرقية اللذيذة المحضرة على الفحم بأجود أنواع اللحوم الطازجة والبهارات الأصيلة."
                : "The finest Oriental grills prepared on charcoal with the highest quality fresh meats and authentic spices.";
        } else if (c.includes("nubian")) {
            newDesc = isAr 
                ? "تجربة طعام نوبية ساحرة على ضفاف النيل تقدم أشهر الأطباق بلمسة تراثية أصيلة."
                : "A magical Nubian dining experience on the banks of the Nile offering famous heritage dishes.";
        } else if (c.includes("koshary") || titleLc.includes("koshary")) {
            newDesc = isAr
                ? "مطعم شعبي يقدم ألذ أطباق الكشري الأصيلة بخلطاته المميزة للصلصة والدقة."
                : "Popular restaurant serving the most delicious authentic Koshary bowls with signature sauces.";
        } else if (c.includes("traditional") || c.includes("egyptian")) {
            newDesc = isAr
                ? "يقدم باقة من الأكلات المصرية الأصيلة في أجواء تراثية تعكس عبق التاريخ وضيافة الكرم."
                : "Offers a variety of authentic Egyptian dishes in a traditional atmosphere reflecting rich heritage and hospitality.";
        } else {
            newDesc = isAr
                ? "وجهة رائعة لتناول ألذ الوجبات المحضرة بعناية لتجربة طعام لا تُنسى في أجواء هادئة."
                : "A wonderful destination to enjoy delicious, carefully prepared meals for an unforgettable dining experience.";
        }
        
        return { ...r, image: newImage, image_url: newImage, description: newDesc };
    });
    return data;
};

export const getRestaurantById = async (id: string | number) => {
    const response = await axiosClient.get(`/restaurants/${id}`);
    let data = response.data?.data || response.data;
    if (data) {
        const titleLc = (data.name || data.title || "").toLowerCase();
        let newImage = data.image;
        if (titleLc.includes("kadoura") || data.name?.includes("قدورة")) newImage = "/images/restaurants/kadoura.png";
        else if (titleLc.includes("balbaa") || data.name?.includes("بلبع")) newImage = "/images/restaurants/balbaa.png";
        else if (titleLc.includes("fares") || data.name?.includes("فارس")) newImage = "/images/restaurants/fares.png";
        else if (titleLc.includes("masrien") || data.name?.includes("المصريين")) newImage = "/images/restaurants/masrien.png";
        else if (titleLc.includes("tarek") || data.name?.includes("طارق")) newImage = "/images/restaurants/cairo/abou_tarek.png";
        else if (titleLc.includes("prince") || data.name?.includes("برنس")) newImage = "/images/restaurants/cairo/el_prince.png";
        else if (titleLc.includes("felfela") || data.name?.includes("فلفلة")) newImage = "/images/restaurants/cairo/felfela.png";
        else if (titleLc.includes("gad") || data.name?.includes("جاد")) newImage = "/images/restaurants/hurghada/gad.png";
        else if (titleLc.includes("starfish") || data.name?.includes("ستار فيش")) newImage = "/images/restaurants/hurghada/starfish.png";
        else if (titleLc.includes("sofra") || data.name?.includes("سفرة")) newImage = "/images/restaurants/luxor/sofra.png";
        else if (titleLc.includes("sahaby") || data.name?.includes("صحابي")) newImage = "/images/restaurants/luxor/sahaby.png";
        else if (titleLc.includes("zephyrion") || data.name?.includes("زفيريون")) newImage = "/images/restaurants/zephyrion.png";
        else if (titleLc.includes("makka") || data.name?.includes("مكة")) newImage = "/images/restaurants/aswan/makka.png";
        else if (titleLc.includes("dokka") || data.name?.includes("دكة")) newImage = "/images/restaurants/aswan/el_dokka.png";
        else if (titleLc.includes("solaih") || data.name?.includes("صالح") || data.name?.includes("صلح")) newImage = "/images/restaurants/aswan/solaih.png";
        else if (newImage?.includes("unsplash") || newImage?.includes("hotel") || newImage === "placeholder.png" || !newImage) {
            const fallbackIndex = data.id ? ((data.id * 7) % 15) + 1 : Math.floor(Math.random() * 15) + 1;
            newImage = `/images/restaurants/r${fallbackIndex}.png`;
        }
        
        const isAr = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl' || document.cookie.includes('/ar');
        const c = (data.cuisine || "").toLowerCase();
        
        let newDesc = data.description;
        if (c.includes("seafood") || titleLc.includes("fish")) {
            newDesc = isAr 
                ? "يقدم أصناف بحرية مميزة تجلب لك طعم البحر المتوسط والأحمر بأسلوب أصيل وتتبيلة رائعة."
                : "Offers exquisite seafood dishes bringing the taste of the Mediterranean and Red Sea with authentic recipes.";
        } else if (c.includes("grill") || c.includes("kebab") || c.includes("مريم")) {
            newDesc = isAr 
                ? "أفضل المشويات الشرقية اللذيذة المحضرة على الفحم بأجود أنواع اللحوم الطازجة والبهارات الأصيلة."
                : "The finest Oriental grills prepared on charcoal with the highest quality fresh meats and authentic spices.";
        } else if (c.includes("nubian")) {
            newDesc = isAr 
                ? "تجربة طعام نوبية ساحرة على ضفاف النيل تقدم أشهر الأطباق بلمسة تراثية أصيلة."
                : "A magical Nubian dining experience on the banks of the Nile offering famous heritage dishes.";
        } else if (c.includes("koshary") || titleLc.includes("koshary")) {
            newDesc = isAr
                ? "مطعم شعبي يقدم ألذ أطباق الكشري الأصيلة بخلطاته المميزة للصلصة والدقة."
                : "Popular restaurant serving the most delicious authentic Koshary bowls with signature sauces.";
        } else if (c.includes("traditional") || c.includes("egyptian")) {
            newDesc = isAr
                ? "يقدم باقة من الأكلات المصرية الأصيلة في أجواء تراثية تعكس عبق التاريخ وضيافة الكرم."
                : "Offers a variety of authentic Egyptian dishes in a traditional atmosphere reflecting rich heritage and hospitality.";
        } else {
            newDesc = isAr
                ? "وجهة رائعة لتناول ألذ الوجبات المحضرة بعناية لتجربة طعام لا تُنسى في أجواء هادئة."
                : "A wonderful destination to enjoy delicious, carefully prepared meals for an unforgettable dining experience.";
        }

        data.image = newImage;
        data.image_url = newImage;
        data.description = newDesc;
    }
    return data;
};
