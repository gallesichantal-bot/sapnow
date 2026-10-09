import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Plus, Minus, Truck, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products } from '../data/products';
import { ProductCard } from '../components/catalog/ProductCard';
import { FashionImage } from '../components/catalog/ProductCard';

export function ProductDetailPage() {
  const { state, navigate, addToCart, toggleWishlist, openAssistant } = useApp();
  const product = products.find(p => p.id === state.currentProductId) || products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? '');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>('description');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const isWishlisted = state.wishlistIds.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const sections = [
    { id: 'description', label: 'Description', content: product.longDescription },
    { id: 'materials', label: 'Materials & Composition', content: product.material },
    { id: 'fit', label: 'Fit & Sizing', content: product.fit },
    { id: 'care', label: 'Care Instructions', content: product.care },
    { id: 'delivery', label: 'Delivery & Returns', content: 'Complimentary standard delivery on orders over €200. Standard delivery 3–5 business days. Express delivery 1–2 business days. Free returns within 30 days of purchase.' },
  ];

  return (
    <div className="pt-[7rem]">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <p className="text-xs text-muted-gray tracking-wide">
          <button onClick={() => navigate('home')} className="hover:text-charcoal transition-colors">Home</button>
          {' / '}
          <button onClick={() => navigate('catalog', undefined, product.category as any)} className="hover:text-charcoal transition-colors capitalize">
            {product.category}
          </button>
          {' / '}
          <span className="text-charcoal">{product.name}</span>
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="sticky top-28 h-fit">
            <div className="flex gap-3">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2 w-16 shrink-0">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`aspect-[3/4] overflow-hidden border-2 transition-colors ${
                        imgIdx === i ? 'border-charcoal' : 'border-transparent'
                      }`}
                    >
                      <FashionImage src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-warm-white">
                <FashionImage
                  src={product.images[imgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Nav arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-ivory/90 backdrop-blur-sm flex items-center justify-center hover:bg-ivory transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-ivory/90 backdrop-blur-sm flex items-center justify-center hover:bg-ivory transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.tags.includes('new-arrival') && (
                    <span className="bg-charcoal text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1">New</span>
                  )}
                  {product.tags.includes('limited-edition') && (
                    <span className="bg-gold text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1">Limited</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="py-2">
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-charcoal mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl font-medium">€{product.price.toLocaleString()}</span>
              {product.previousPrice && (
                <span className="price-old text-base">€{product.previousPrice.toLocaleString()}</span>
              )}
            </div>
            <p className="text-muted-gray text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Color selector */}
            <div className="mb-6">
              <p className="label-sm mb-3">
                Color — <span className="text-charcoal normal-case font-normal text-xs tracking-normal">{selectedColor}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? 'border-charcoal scale-110' : 'border-transparent hover:border-taupe'
                    }`}
                    style={{ backgroundColor: color.hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className={`label-sm ${sizeError ? 'text-red-600' : ''}`}>
                  Size {sizeError && '— Please select a size'}
                </p>
                <button className="text-xs text-muted-gray hover:text-charcoal flex items-center gap-1 transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] h-10 px-3 border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-charcoal text-ivory border-charcoal'
                        : sizeError
                        ? 'border-red-300 text-charcoal hover:border-charcoal'
                        : 'border-beige text-charcoal hover:border-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="label-sm mb-3">Quantity</p>
              <div className="flex items-center border border-beige w-32">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-beige transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-beige transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToBag}
                className={`flex-1 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-200 ${
                  addedFeedback
                    ? 'bg-green-700 text-ivory'
                    : 'bg-charcoal text-ivory hover:bg-black'
                }`}
              >
                {addedFeedback ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  isWishlisted ? 'bg-charcoal border-charcoal text-ivory' : 'border-beige text-charcoal hover:border-charcoal'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Ask stylist */}
            <button
              onClick={openAssistant}
              className="w-full mb-8 py-3 border border-beige flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium text-charcoal hover:border-charcoal transition-colors"
            >
              <Sparkles size={13} />
              Ask NOIR for Styling Advice
            </button>

            {/* Delivery info */}
            <div className="space-y-3 py-5 border-t border-beige mb-6">
              <div className="flex items-center gap-3 text-sm text-charcoal">
                <Truck size={15} className="text-muted-gray shrink-0" />
                <span>Complimentary delivery on orders over €200</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-charcoal">
                <RefreshCw size={15} className="text-muted-gray shrink-0" />
                <span>Free returns within 30 days</span>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="border-t border-beige">
              {sections.map(section => (
                <div key={section.id} className="border-b border-beige">
                  <button
                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between py-4 text-sm font-medium text-charcoal hover:opacity-70 transition-opacity"
                  >
                    {section.label}
                    <ChevronDown
                      size={16}
                      className={`text-muted-gray transition-transform ${openSection === section.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openSection === section.id && (
                    <div className="pb-4 text-sm text-muted-gray leading-relaxed animate-fade-in">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <p className="label-sm text-muted-gray mb-2">You May Also Like</p>
              <h2 className="section-title">Complete the Look</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
