import { Heart, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products } from '../data/products';
import { FashionImage } from '../components/catalog/ProductCard';

export function WishlistPage() {
  const { state, navigate, toggleWishlist, addToCart } = useApp();
  const wishlisted = state.wishlistIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <div className="pt-[7rem] pb-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="py-10 border-b border-beige mb-10">
          <p className="label-sm text-muted-gray mb-2">Your Collection</p>
          <h1 className="section-title">Wishlist</h1>
          <p className="text-muted-gray text-sm mt-2">{wishlisted.length} saved {wishlisted.length === 1 ? 'piece' : 'pieces'}</p>
        </div>

        {wishlisted.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="text-beige mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-charcoal mb-3">Your wishlist is empty</h2>
            <p className="text-muted-gray text-sm mb-8">Save pieces you love and come back to them later.</p>
            <button onClick={() => navigate('catalog')} className="btn-primary">
              Explore the Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlisted.map(product => (
              <div key={product.id} className="group">
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-warm-white mb-4 cursor-pointer"
                  onClick={() => navigate('product-detail', product.id)}
                >
                  <FashionImage
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-ivory transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <X size={14} className="text-charcoal" />
                  </button>
                </div>
                <div>
                  <h3
                    className="text-sm font-medium text-charcoal mb-1 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => navigate('product-detail', product.id)}
                  >
                    {product.name}
                  </h3>
                  <p className="price mb-3">€{product.price.toLocaleString()}</p>
                  <button
                    onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-charcoal text-xs tracking-widest uppercase font-medium text-charcoal hover:bg-charcoal hover:text-ivory transition-colors"
                  >
                    <ShoppingBag size={13} />
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
