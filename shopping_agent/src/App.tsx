import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { NoirAssistant } from './components/assistant/NoirAssistant';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';

function AppContent() {
  const { state } = useApp();

  const renderPage = () => {
    switch (state.currentPage) {
      case 'home':          return <HomePage />;
      case 'dashboard':     return <DashboardPage />;
      case 'catalog':       return <CatalogPage />;
      case 'product-detail': return <ProductDetailPage />;
      case 'wishlist':      return <WishlistPage />;
      case 'cart':
      case 'checkout':
      case 'checkout-confirmation':
        return <CheckoutPage />;
      default:              return <HomePage />;
    }
  };

  const hideFooter = state.currentPage === 'checkout' || state.currentPage === 'checkout-confirmation';

  return (
    <div className="min-h-screen bg-ivory font-sans text-charcoal">
      <Header />
      <main>
        {renderPage()}
      </main>
      {!hideFooter && <Footer />}

      {/* Global overlays */}
      <CartDrawer />
      <NoirAssistant />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
