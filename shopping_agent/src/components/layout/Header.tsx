import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

const mainNav = [
  { label: 'New Arrivals', page: 'catalog' as const, category: 'new-arrivals' as Category },
  { label: 'Women', page: 'catalog' as const, category: 'women' as Category },
  { label: 'Men', page: 'catalog' as const, category: 'men' as Category },
  { label: 'Collections', page: 'catalog' as const, category: null },
  { label: 'Accessories', page: 'catalog' as const, category: 'accessories' as Category },
  { label: 'Sale', page: 'catalog' as const, category: null },
];

export function Header() {
  const { state, navigate, cartCount, toggleCart } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: typeof mainNav[0]) => {
    navigate(item.page, undefined, item.category ?? undefined);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-ivory/95 backdrop-blur-sm shadow-sm' : 'bg-ivory'
        }`}
      >
        {/* Promo bar */}
        <div className="bg-charcoal text-ivory text-center py-2 text-[11px] tracking-[0.15em] uppercase font-medium">
          Complimentary shipping on orders over €200 · New season arrivals now in
        </div>

        {/* Main header */}
        <div className="border-b border-beige">
          <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('home')}
              className="font-serif text-xl tracking-[0.2em] uppercase font-normal text-charcoal hover:opacity-70 transition-opacity"
            >
              ATELIER NOIR
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNav.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`nav-link ${
                    state.currentPage === item.page &&
                    state.currentCategory === item.category
                      ? 'opacity-100 border-b border-charcoal pb-0.5'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(s => !s)}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => navigate('dashboard')}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity hidden sm:block"
                aria-label="Account"
              >
                <User size={18} />
              </button>
              <button
                onClick={() => navigate('wishlist')}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </button>
              <button
                onClick={toggleCart}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal text-ivory text-[10px] rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                className="lg:hidden p-1 opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => setMobileOpen(s => !s)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-b border-beige bg-ivory animate-fade-in">
            <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center gap-4">
              <Search size={16} className="text-muted-gray shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search for products, collections..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchValue.trim()) {
                    navigate('catalog');
                    setSearchOpen(false);
                    setSearchValue('');
                  }
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                className="flex-1 bg-transparent text-sm outline-none placeholder-muted-gray text-charcoal"
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-gray hover:text-charcoal">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ivory pt-[7rem] animate-fade-in lg:hidden">
          <nav className="px-6 flex flex-col gap-6">
            {mainNav.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-left text-lg font-serif font-normal text-charcoal border-b border-beige pb-4"
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => { navigate('dashboard'); setMobileOpen(false); }} className="text-left text-lg font-serif font-normal text-charcoal border-b border-beige pb-4">Account</button>
            <button onClick={() => { navigate('wishlist'); setMobileOpen(false); }} className="text-left text-lg font-serif font-normal text-charcoal border-b border-beige pb-4">Wishlist</button>
          </nav>
        </div>
      )}
    </>
  );
}
