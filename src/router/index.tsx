import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layout/RootLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// ── Loading fallback ──
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin" />
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// ── Lazy page imports — only loads when visited ──
const HomePage               = lazy(() => import("../pages/Home"));
const ExplorePage            = lazy(() => import("../pages/ExplorePage"));
const HotelDetailsPage       = lazy(() => import("../pages/HotelDetailsPage"));
const HotelsPage             = lazy(() => import("../pages/HotelsPage"));
const LoginPage              = lazy(() => import("../pages/Login"));
const ForgotPasswordPage     = lazy(() => import("../pages/ForgotPassword"));

const SignUpPage              = lazy(() => import("../pages/SignUp"));
const TourDetailsPage        = lazy(() => import("../pages/TourDetailsPage"));
const ToursPage              = lazy(() => import("../pages/ToursPage"));
const TransportationDetailsPage = lazy(() => import("../pages/TransportationDetailsPage"));
const TransportationPage     = lazy(() => import("../pages/TransportationPage"));
const TravelPackageDetailsPage = lazy(() => import("../pages/TravelPackageDetailsPage"));
const TravelPackagesPage     = lazy(() => import("../pages/TravelPackagesPage"));
const ThingToDoDetailsPage   = lazy(() => import("../pages/ThingToDoDetailsPage"));
const ReviewsPage            = lazy(() => import("../pages/ReviewsPage"));
const RestaurantDetailsPage  = lazy(() => import("../pages/RestaurantDetailsPage"));
const RestaurantsPage        = lazy(() => import("../pages/RestaurantsPage"));
const MenuCategoryPage       = lazy(() => import("../pages/MenuCategoryPage"));
const MealDetailsPage        = lazy(() => import("../pages/MealDetailsPage"));
const EventsPage             = lazy(() => import("../pages/EventsPage"));
const SafariPage             = lazy(() => import("../pages/SafariPage"));
const MuseumsPage            = lazy(() => import("../pages/MuseumsPage"));
const BazaarsPage            = lazy(() => import("../pages/BazaarsPage"));
const EventDetailsPage       = lazy(() => import("../pages/EventDetailsPage"));
const SafariDetailsPage      = lazy(() => import("../pages/SafariDetailsPage"));
const MuseumDetailsPage      = lazy(() => import("../pages/MuseumDetailsPage"));
const BazaarDetailsPage      = lazy(() => import("../pages/BazaarDetailsPage"));
const NotFoundPage           = lazy(() => import("../pages/NotFoundPage"));
const AITripPlannerPage      = lazy(() => import("../pages/AITripPlannerPage"));
const AboutPage              = lazy(() => import("../pages/AboutPage"));
const ContactPage            = lazy(() => import("../pages/ContactPage"));
const TravelGuidesPage       = lazy(() => import("../pages/TravelGuidesPage"));
const DataPolicyPage         = lazy(() => import("../pages/DataPolicyPage"));
const CookiePolicyPage       = lazy(() => import("../pages/CookiePolicyPage"));
const LegalPage              = lazy(() => import("../pages/LegalPage"));
const AdminLiveChatPage      = lazy(() => import("../pages/AdminLiveChatPage"));
const SitemapPage            = lazy(() => import("../pages/SitemapPage"));
const HelpCenterPage         = lazy(() => import("../pages/HelpCenterPage"));
const HowItWorksPage         = lazy(() => import("../pages/HowItWorksPage"));
const MobileAppPage          = lazy(() => import("../pages/MobileAppPage"));
const ActivitiesPage         = lazy(() => import("../pages/ActivitiesPage"));
const SupportPage            = lazy(() => import("../pages/SupportPage"));
const WishlistPage           = lazy(() => import("../pages/WishlistPage"));
const CheckoutPage           = lazy(() => import("../pages/CheckoutPage"));
const MyBookingsPage         = lazy(() => import("../pages/MyBookingsPage"));
const ProfileSettingsPage    = lazy(() => import("../pages/ProfileSettingsPage"));
const ShopPage               = lazy(() => import("../pages/ShopPage"));
const ShopCheckoutPage       = lazy(() => import("../pages/ShopCheckoutPage"));
const DealDetailsPage        = lazy(() => import("../pages/DealDetailsPage"));
const SearchPage             = lazy(() => import("../pages/SearchPage"));
const AttractionPage         = lazy(() => import("../pages/AttractionPage"));
const FlightPage             = lazy(() => import("../pages/FlightPage"));
const DashboardPage          = lazy(() => import("../pages/DashboardPage"));
const AdminApprovalsPage     = lazy(() => import("../pages/AdminApprovalsPage"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={withSuspense(HomePage)} />

        <Route path="explore/:destination" element={withSuspense(ExplorePage)} />
        <Route path="attraction/:destination" element={withSuspense(AttractionPage)} />
        <Route path="flights" element={withSuspense(FlightPage)} />
        <Route path="ai-planner" element={withSuspense(AITripPlannerPage)} />
        <Route path="hotels" element={withSuspense(HotelsPage)} />
        <Route path="hotels/:hotelId" element={withSuspense(HotelDetailsPage)} />
        <Route path="transportation" element={withSuspense(TransportationPage)} />
        <Route path="transportation/:transportId" element={withSuspense(TransportationDetailsPage)} />
        <Route path="packages" element={withSuspense(TravelPackagesPage)} />
        <Route path="packages/:packageId" element={withSuspense(TravelPackageDetailsPage)} />
        <Route path="tours" element={withSuspense(ToursPage)} />
        <Route path="tours/:tourId" element={withSuspense(TourDetailsPage)} />
        <Route path="things-to-do/:id" element={withSuspense(ThingToDoDetailsPage)} />
        <Route path="reviews" element={withSuspense(ReviewsPage)} />
        <Route path="restaurants" element={withSuspense(RestaurantsPage)} />
        <Route path="restaurants/:id" element={withSuspense(RestaurantDetailsPage)} />
        <Route path="restaurants/menu/:category" element={withSuspense(MenuCategoryPage)} />
        <Route path="restaurants/meal/:id" element={withSuspense(MealDetailsPage)} />
        <Route path="events" element={withSuspense(EventsPage)} />
        <Route path="events/:id" element={withSuspense(EventDetailsPage)} />
        <Route path="safari" element={withSuspense(SafariPage)} />
        <Route path="safari/:id" element={withSuspense(SafariDetailsPage)} />
        <Route path="museums" element={withSuspense(MuseumsPage)} />
        <Route path="museums/:id" element={withSuspense(MuseumDetailsPage)} />
        <Route path="bazaars" element={withSuspense(BazaarsPage)} />
        <Route path="bazaars/:id" element={withSuspense(BazaarDetailsPage)} />

        {/* Top Navbar Remaining Pages */}
        <Route path="deals/:id" element={withSuspense(DealDetailsPage)} />
        <Route path="activities" element={withSuspense(ActivitiesPage)} />
        <Route path="search" element={withSuspense(SearchPage)} />
        <Route path="support" element={withSuspense(SupportPage)} />
        <Route path="wishlist" element={<ProtectedRoute>{withSuspense(WishlistPage)}</ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute>{withSuspense(MyBookingsPage)}</ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute>{withSuspense(ProfileSettingsPage)}</ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute>{withSuspense(DashboardPage)}</ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="admin/approvals" element={<ProtectedRoute>{withSuspense(AdminApprovalsPage)}</ProtectedRoute>} />
        <Route path="admin/livechat" element={withSuspense(AdminLiveChatPage)} />
        {/* Footer Pages */}
        <Route path="about" element={withSuspense(AboutPage)} />
        <Route path="contact" element={withSuspense(ContactPage)} />
        <Route path="travel-guides" element={withSuspense(TravelGuidesPage)} />
        <Route path="data-policy" element={withSuspense(DataPolicyPage)} />
        <Route path="cookie-policy" element={withSuspense(CookiePolicyPage)} />
        <Route path="legal" element={withSuspense(LegalPage)} />
        <Route path="sitemap" element={withSuspense(SitemapPage)} />
        <Route path="help-center" element={withSuspense(HelpCenterPage)} />
        <Route path="how-it-works" element={withSuspense(HowItWorksPage)} />
        <Route path="app" element={withSuspense(MobileAppPage)} />

        {/* Checkout */}
        <Route path="checkout" element={<ProtectedRoute>{withSuspense(CheckoutPage)}</ProtectedRoute>} />
        <Route path="shop" element={withSuspense(ShopPage)} />
        <Route path="shop-checkout" element={<ProtectedRoute>{withSuspense(ShopCheckoutPage)}</ProtectedRoute>} />

        {/* 404 Catch All */}
        <Route path="*" element={withSuspense(NotFoundPage)} />

      </Route>
      <Route path="/login" element={withSuspense(LoginPage)} />
      <Route path="/forgot-password" element={withSuspense(ForgotPasswordPage)} />
      <Route path="/sign-up" element={withSuspense(SignUpPage)} />
    </>
  )
);

export default router;
