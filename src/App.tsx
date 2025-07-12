import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ModelGeneratorPage from "@/pages/ModelGeneratorPage";
import ModelViewerPage from "@/pages/ModelViewerPage";
import ProfilePage from "@/pages/ProfilePage";
import MarketplacePage from "@/pages/MarketplacePage";
import PricingPage from "@/pages/PricingPage";
import PricingPage1 from "@/pages/pricingPage1";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import LoginPage from "./pages/loginPage";
import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage"
import InboxPage from "./pages/inboxPage"
import ImageToModelPage from "./pages/ImageToModelPage"
import ProtectedRoute from '@/middleware/protectedRoute';
import AssetsPage from "@/pages/AssetsPage"
import BillingPage from "@/pages/BillingPage"
import ProfilePageSelf from "./pages/ProfilePageSelf";
import BillingSuccessPage from "./pages/billing-succes-page";
function Router() {
  return ( 
    
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/pricing1" component={PricingPage1} />
      <Route path="/community" component={MarketplacePage} />
      <Route path="/profile/:username" component={ProfilePage} />
      <Route path="/account/profile/:username" component={ProfilePageSelf} />
      <Route path="/model/:id" component={ModelViewerPage} />

      {/* Protected Routes */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/account/assets" component={() => <ProtectedRoute component={AssetsPage} />} />
      <Route path="/account/billing" component={() => <ProtectedRoute component={BillingPage} />} />
      <Route path="/account/billing-success" component={() => <ProtectedRoute component={BillingSuccessPage} />} />
      <Route path="/create" component={() => <ProtectedRoute component={ModelGeneratorPage} />} />
      <Route path="/image-to-model" component={() => <ProtectedRoute component={ImageToModelPage} />} />
      <Route path="/inbox" component={() => <ProtectedRoute component={InboxPage} />} />
      <Route path="/inbox/:conversationId" component={() => <ProtectedRoute component={InboxPage} />} />

      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header 
          onMenuOpen={() => setIsMobileMenuOpen(true)} 
        />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
