import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { getFeaturedProducts, getNewArrivals } from '../data/products';
import { FashionImage } from '../components/catalog/ProductCard';

const HERO_IMG = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=1080&fit=crop&q=80';
const EDITORIAL_1 = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=80';
const EDITORIAL_2 = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1000&fit=crop&q=80';
const EDITORIAL_3 = 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=800&h=600&fit=crop&q=80';

export function HomePage() {
  const { navigate, openAssistant } = useApp();
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals().slice(0, 4);

  return (
    <div className="pt-[7rem]">
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-warm-white">
        <div className="absolute inset-0">
          <FashionImage
            src={HERO_IMG}
            alt="ATELIER NOIR — New Season Campaign"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/20 to-transparent" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-screen-xl mx-auto px-6 w-full">
            <div className="max-w-lg animate-slide-up">
              <p className="label-sm text-ivory/80 mb-4">The New Season</p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-ivory leading-tight mb-6">
                The Art of<br />Everyday
              </h1>
              <p className="text-ivory/80 text-base md:text-lg leading-relaxed mb-8 max-w-sm">
                Discover refined silhouettes, modern essentials, and distinctive pieces designed for the season ahead.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('catalog', undefined, 'new-arrivals')} className="btn-primary">
                  Shop New Arrivals
                </button>
                <button onClick={() => navigate('catalog')} className="btn-secondary border-ivory text-ivory hover:bg-ivory hover:text-charcoal">
                  Explore the Collection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-ivory/40" />
        </div>
      </section>

      {/* Editorial collections */}
      <section className="py-20 max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-sm text-muted-gray mb-2">Featured</p>
            <h2 className="section-title">Collections</h2>
          </div>
          <button onClick={() => navigate('catalog')} className="btn-ghost flex items-center gap-2 hidden sm:flex">
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card */}
          <div
            className="md:col-span-2 relative h-96 md:h-[500px] overflow-hidden bg-warm-white cursor-pointer group"
            onClick={() => navigate('catalog', undefined, 'outerwear')}
          >
            <FashionImage src={EDITORIAL_1} alt="Outerwear Collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="label-sm text-ivory/70 mb-2">New Season</p>
              <h3 className="font-serif text-3xl text-ivory mb-3">The Outerwear Edit</h3>
              <button className="text-ivory border-b border-ivory/60 text-sm tracking-wider pb-0.5 hover:border-ivory transition-colors">
                Explore →
              </button>
            </div>
          </div>

          {/* Stack of two */}
          <div className="flex flex-col gap-4">
            <div
              className="relative h-56 md:h-[236px] overflow-hidden bg-warm-white cursor-pointer group"
              onClick={() => navigate('catalog', undefined, 'knitwear')}
            >
              <FashionImage src={EDITORIAL_2} alt="Knitwear Studio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-serif text-2xl text-ivory mb-1">Knitwear Studio</h3>
                <button className="text-ivory border-b border-ivory/60 text-xs tracking-wider pb-0.5">Shop →</button>
              </div>
            </div>
            <div
              className="relative h-56 md:h-[236px] overflow-hidden bg-warm-white cursor-pointer group"
              onClick={() => navigate('catalog', undefined, 'accessories')}
            >
              <FashionImage src={EDITORIAL_3} alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-serif text-2xl text-ivory mb-1">Accessories</h3>
                <button className="text-ivory border-b border-ivory/60 text-xs tracking-wider pb-0.5">Shop →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-sm text-muted-gray mb-2">Just In</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <button
              onClick={() => navigate('catalog', undefined, 'new-arrivals')}
              className="btn-ghost flex items-center gap-2 hidden sm:flex"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-10 flex justify-center sm:hidden">
            <button onClick={() => navigate('catalog', undefined, 'new-arrivals')} className="btn-secondary">
              View All New Arrivals
            </button>
          </div>
        </div>
      </section>

      {/* Brand manifesto */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 text-center">
        <p className="label-sm text-muted-gray mb-6">Our Philosophy</p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-charcoal max-w-3xl mx-auto leading-tight mb-8">
          Discover the new language of contemporary fashion
        </h2>
        <p className="text-muted-gray text-base max-w-xl mx-auto mb-10 leading-relaxed">
          We believe in clothing that carries meaning — pieces made with care, worn with intention, and kept for years.
        </p>
        <button onClick={() => navigate('catalog')} className="btn-primary">
          Shop the Collection
        </button>
      </section>

      {/* Featured / Bestsellers */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-sm text-muted-gray mb-2">Most Loved</p>
              <h2 className="section-title">Bestsellers</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* AI Assistant promo */}
      <section className="py-20 bg-charcoal text-ivory">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-ivory rounded-full flex items-center justify-center">
                <span className="text-charcoal text-xs font-serif font-bold">N</span>
              </div>
              <p className="label-sm text-ivory/60">NOIR — Personal Style Assistant</p>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4">
              Let NOIR style you.
            </h2>
            <p className="text-ivory/70 max-w-md leading-relaxed">
              Discover pieces selected just for you. Tell NOIR what you're looking for and get personalised recommendations from the collection.
            </p>
          </div>
          <button
            onClick={openAssistant}
            className="shrink-0 border border-ivory/40 text-ivory px-8 py-3 text-xs tracking-widest uppercase font-medium hover:bg-ivory hover:text-charcoal transition-all duration-200 flex items-center gap-3"
          >
            <Sparkles size={14} />
            Start Styling
          </button>
        </div>
      </section>
    </div>
  );
}
