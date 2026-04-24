export interface INavbarItems {
  name: string;
  link?: string;
  dropdown?: INavbarItems[];
}

export interface IHeroImages {
  src: string;
  alt: string;
  type?: "image" | "video";
}

export interface IWhyChooseUs {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export interface IDestinationCard {
  id: number;
  src: string;
  alt: string;
  title: string;
  tours: string | number;
}

type FooterLinks = {
  id: number;
  title: string;
  link: string;
};
export const IFooterLinks: Record<string, FooterLinks[]> = {
  Company: [
    {
      id: 1,
      title: "About",
      link: "/about"
    },
    {
      id: 2,
      title: "Tourz Reviews",
      link: "/reviews"
    },
    {
      id: 3,
      title: "Contact us",
      link: "/contact"
    },

    {
      id: 5,
      title: "Data Policy",
      link: "/data-policy"
    },
    {
      id: 6,
      title: "Cookie Policy",
      link: "/cookie-policy"
    },
    {
      id: 7,
      title: "Legal",
      link: "/legal"
    },
    {
      id: 8,
      title: "Sitemap",
      link: "/sitemap"
    },
  ],

  Support: [
    {
      id: 1,
      title: "Get in Touch",
      link: "/contact"
    },
    {
      id: 2,
      title: "Help center",
      link: "/help-center"
    },
    {
      id: 3,
      title: "Live chat",
      link: "#chatbot"
    },
    {
      id: 4,
      title: "How it works",
      link: "/how-it-works"
    },
  ],

  Mobile: [
    {
      id: 1,
      title: "Android App",
      link: "/app"
    },
    {
      id: 2,
      title: "iOS App",
      link: "/app"
    },
  ],
};

export interface IPayImages {
  id: number;
  src: string;
  alt: string;
}

export interface IActivity {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  duration: string;
  price: number;
  originalPrice?: number;
  isBestSeller?: boolean;
  category: string;
}

export interface IRoom {
  id: number;
  name: string;
  images: string[];
  type: string;
  beds: number;
  price: number;
  size: number;
  amenities: string[];
  status: "Available" | "Booked";
  description?: string;
  hasBestValueBadge?: boolean;
  available_count?: number;
  ar_url?: string;
}

export interface IHotel {
  id: number;
  name: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  Services: string[];
  reviewCount: number;
  rooms?: IRoom[];
}

export interface IBlogCard {
  id: number;
  src: string;
  alt: string;
  date: string;
  author: string;
  title: string;
  tag: string;
}

export interface ITransportation {
  id: number;
  type: "Bus" | "Van" | "Car";
  image: string;
  images: string[];
  price: number;
  seats: number;
  departureTime: string;
  rating: number;
  route: string;
  description: string;
  features: string[];
  company: string;
  duration: string;
}

export interface ITravelPackage {
  id: number;
  title: string;
  image: string;
  alt: string;
  tag: string;
  date: string;
  author: string;
  price: number;
  duration: string;
  hotel?: string;
  museum?: string;
  activities: string[];
  highlights: string[];
  excluded?: string[];
}

export interface ITour {
  id: number;
  title: string;
  location: string;
  image: string;
  video?: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  duration: string;
  price: number;
  description: string;
  itinerary: string[];
  label?: string;
  tag?: string;
  start_time?: string;
  includes?: string;
}
