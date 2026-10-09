import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown, Grid2X2, Grid3X3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/catalog/ProductCard';
import { products } from '../data/products';
import { Category } from '../types';

const categories: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New Arrivals', value: 'new-arrivals' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Knitwear', value: 'knitwear' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Shirts', value: 'shirts' },
  { label: 'Trousers', value: 'trousers' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Bags', value: 'bags' },
  { label: 'Accessories', value: 'accessories' },
];

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const priceRanges = [
  { label: 'Under €150', min: 0, max: 150 },
  { label: '€150 – €300', min: 150, max: 300 },
  { label: '€300 – €500', min: 300, max: 500 },
  { label: 'Over €500', min: 500, max: Infinity },
];

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43'];

export function CatalogPage() {
  const { state, navigate } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [compact, setCompact] = useState(false);

  const activeCategory = state.currentCategory;

  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory) {
      if (activeCategory === 'women') {
        result = result.filter(p => p.gender === 'women' || p.gender === 'unisex');
      } else if (activeCategory === 'men') {
        result = result.filter(p => p.gender === 'men' || p.gender === 'unisex');
      } else if (activeCategory === 'new-arrivals') {
        result = result.filter(p => p.tags.includes('new-arrival'));
      } else {
        result = result.filter(p => p.category === activeCategory);
      }
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    // Price filter
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => (b.tags.includes('new-arrival') ? 1 : 0) - (a.tags.includes('new-arrival') ? 1 : 0));

    return result;
  }, [activeCategory, selectedSizes, selectedPriceRange, sortBy]);

  const categoryLabel = categories.find(c => c.value === activeCategory)?.label || 'All Products';

  const toggleSize = (s: string) =>
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedPriceRange(null);
  };

  const hasActiveFilters = selectedSizes.length > 0 || selectedPriceRange !== null;

  return (
    <div className="pt-[7rem]">
      {/* Breadcrumb + Title */}
      <div className="border-b border-beige">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-xs text-muted-gray mb-3 tracking-wide">
            <button onClick={() => navigate('home')} className="hover:text-charcoal transition-colors">Home</button>
            {' / '}
            <span className="text-charcoal">{categoryLabel}</span>
          </p>
          <div className="flex items-end justify-between">
            <h1 className="section-title">{categoryLabel}</h1>
            <p className="text-sm text-muted-gray hidden sm:block">{filtered.length} pieces</p>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-beige sticky top-[7rem] bg-ivory z-30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => navigate('catalog', undefined, cat.value === 'all' ? undefined : cat.value as Category)}
                className={`nav-link whitespace-nowrap shrink-0 ${
                  (activeCategory === cat.value) || (!activeCategory && cat.value === 'all')
                    ? 'opacity-100 border-b border-charcoal pb-0.5'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Controls bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(s => !s)}
              className={`flex items-center gap-2 text-xs tracking-widest uppercase font-medium px-4 py-2 border transition-colors ${
                filterOpen || hasActiveFilters ? 'bg-charcoal text-ivory border-charcoal' : 'border-beige text-charcoal hover:border-charcoal'
              }`}
            >
              <SlidersHorizontal size={13} />
              Filter
              {hasActiveFilters && <span className="bg-ivory text-charcoal w-4 h-4 rounded-full text-[10px] flex items-center justify-center ml-1">{selectedSizes.length + (selectedPriceRange !== null ? 1 : 0)}</span>}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-muted-gray hover:text-charcoal flex items-center gap-1">
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-gray sm:hidden">{filtered.length} pieces</p>
            <div className="flex items-center gap-2 border border-beige p-1 hidden sm:flex">
              <button onClick={() => setCompact(false)} className={`p-1.5 ${!compact ? 'bg-charcoal text-ivory' : 'text-muted-gray hover:text-charcoal'}`}>
                <Grid2X2 size={14} />
              </button>
              <button onClick={() => setCompact(true)} className={`p-1.5 ${compact ? 'bg-charcoal text-ivory' : 'text-muted-gray hover:text-charcoal'}`}>
                <Grid3X3 size={14} />
              </button>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none text-xs tracking-widest uppercase font-medium pl-3 pr-8 py-2 border border-beige bg-ivory text-charcoal outline-none cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal" />
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="border border-beige p-6 mb-6 bg-white animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Size */}
              <div>
                <p className="label-sm mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`w-10 h-10 border text-xs font-medium transition-colors ${
                        selectedSizes.includes(s) ? 'bg-charcoal text-ivory border-charcoal' : 'border-beige text-charcoal hover:border-charcoal'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="label-sm mb-3">Price</p>
                <div className="space-y-2">
                  {priceRanges.map((r, i) => (
                    <button
                      key={r.label}
                      onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                      className={`w-full text-left text-sm py-1.5 px-3 border transition-colors ${
                        selectedPriceRange === i ? 'bg-charcoal text-ivory border-charcoal' : 'border-transparent text-charcoal hover:border-beige'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="label-sm mb-3">Collection</p>
                <div className="space-y-2">
                  {['New Arrivals', 'Bestsellers', 'Sustainable', 'Limited Edition'].map(tag => (
                    <button key={tag} className="w-full text-left text-sm py-1.5 px-3 border border-transparent text-charcoal hover:border-beige transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-charcoal mb-3">No pieces found</p>
            <p className="text-muted-gray text-sm mb-6">Try adjusting your filters.</p>
            <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
          </div>
        ) : (
          <div className={`grid gap-4 md:gap-6 ${
            compact
              ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
