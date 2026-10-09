import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

function FashionImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className={`img-placeholder ${className}`}>
        <span className="text-center px-4 text-muted-gray">{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}

export { FashionImage };

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const { state, navigate, toggleWishlist } = useApp();
  const [hovered, setHovered] = useState(false);
  const isWishlisted = state.wishlistIds.includes(product.id);
  const secondImage = product.images[1];

  return (
    <div
      className={`group cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-warm-white aspect-[3/4] mb-4"
        onClick={() => navigate('product-detail', product.id)}
      >
        <FashionImage
          src={hovered && secondImage ? secondImage : product.images[0]}
          alt={product.name}
          className="product-card-img"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.tags.includes('new-arrival') && (
            <span className="bg-charcoal text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1">
              New
            </span>
          )}
          {product.tags.includes('limited-edition') && (
            <span className="bg-gold text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1">
              Limited
            </span>
          )}
          {product.previousPrice && (
            <span className="bg-red-700 text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-ivory/90 backdrop-blur-sm rounded-full transition-opacity opacity-0 group-hover:opacity-100"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            className={isWishlisted ? 'fill-charcoal text-charcoal' : 'text-charcoal'}
          />
        </button>

        {/* Quick view */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => navigate('product-detail', product.id)}
            className="w-full bg-charcoal/90 backdrop-blur-sm text-ivory py-3 text-xs tracking-widest uppercase font-medium"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div onClick={() => navigate('product-detail', product.id)}>
        {/* Color swatches */}
        <div className="flex gap-1.5 mb-2">
          {product.colors.slice(0, 4).map(color => (
            <div
              key={color.name}
              title={color.name}
              className="w-3 h-3 rounded-full border border-beige"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted-gray self-center">+{product.colors.length - 4}</span>
          )}
        </div>

        <h3 className="text-sm font-medium text-charcoal leading-tight mb-1 hover:opacity-70 transition-opacity">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="price">€{product.price.toLocaleString()}</span>
          {product.previousPrice && (
            <span className="price-old">€{product.previousPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
