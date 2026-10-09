import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FashionImage } from '../catalog/ProductCard';

export function CartDrawer() {
  const { state, closeCart, removeFromCart, updateCartQty, cartTotal, navigate } = useApp();

  if (!state.cartOpen) return null;

  const isEmpty = state.cartItems.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ivory z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-beige">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-charcoal" />
            <span className="font-medium text-sm tracking-wide">
              YOUR BAG ({state.cartItems.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-beige" />
              <p className="font-serif text-xl text-charcoal">Your bag is empty</p>
              <p className="text-sm text-muted-gray">Discover pieces worth adding.</p>
              <button
                onClick={() => { navigate('catalog'); closeCart(); }}
                className="btn-primary mt-2"
              >
                Explore the Collection
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {state.cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-20 h-28 bg-warm-white shrink-0 overflow-hidden">
                    <FashionImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-charcoal leading-tight mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-gray mb-1">
                      {item.selectedColor} · {item.selectedSize}
                    </p>
                    <p className="text-sm font-medium">€{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-beige">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-beige transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-beige transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-xs text-muted-gray hover:text-charcoal transition-colors tracking-wide"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="px-6 py-6 border-t border-beige space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-gray">Subtotal</span>
              <span className="font-medium">€{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-gray">
              Complimentary delivery on orders over €200. Taxes calculated at checkout.
            </p>
            <button
              onClick={() => { navigate('checkout'); closeCart(); }}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="btn-secondary w-full text-center"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
