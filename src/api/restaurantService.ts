import axiosClient from "./axiosClient";

export const getRestaurants = async () => {
    const response = await axiosClient.get("/restaurants");
    let data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    data = data.map((r: any) => {
        const titleLc = (r.name || r.title || "").toLowerCase();
        let newImage = r.image;
        if (!newImage || newImage === '/placeholder.png') {
            newImage = '/images/restaurants/generic_traditional.png';
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
        if (!newImage || newImage === '/placeholder.png') {
            newImage = '/images/restaurants/generic_traditional.png';
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
