import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import ArtistListing from "./pages/ArtistListing";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistRegistration from "./pages/ArtistRegistration";
import InspirationGallery from "./pages/InspirationGallery";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminArtists from "./pages/admin/AdminArtists";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminEarnings from "./pages/admin/AdminEarnings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <AuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Admin routes — no public navbar/footer */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminOverview />} />
                  <Route path="earnings" element={<AdminEarnings />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="artists" element={<AdminArtists />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Public routes */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar />
                      <CartDrawer />
                      <main className="min-h-screen">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/artists" element={<ArtistListing />} />
                          <Route path="/artist/:id" element={<ArtistProfile />} />
                          <Route path="/register" element={<ArtistRegistration />} />
                          <Route path="/inspiration" element={<InspirationGallery />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/shop/:slug" element={<ProductDetail />} />
                          <Route path="/order-confirmation" element={<OrderConfirmation />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
