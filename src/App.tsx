
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Categories from './pages/Categories';
import Recipes from './pages/Recipes';
import Offers from './pages/Offers';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AgeVerificationDialog from './components/AgeVerificationDialog';
import { CartProvider } from './context/CartContext';
import DeliveryServices from './pages/DeliveryServices';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <CartProvider>
          <div className="min-h-screen bg-background">
            <AgeVerificationDialog />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/delivery-services" element={<DeliveryServices />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
