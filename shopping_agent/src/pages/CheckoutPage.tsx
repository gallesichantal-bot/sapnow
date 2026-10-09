import { useState } from 'react';
import { Check, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FashionImage } from '../components/catalog/ProductCard';

type Step = 'shipping' | 'delivery' | 'payment' | 'confirmation';

export function CheckoutPage() {
  const { state, navigate, cartTotal } = useApp();
  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState({
    firstName: 'Olivia',
    lastName: 'Marchetti',
    email: 'olivia.marchetti@email.com',
    address: '14 Rue du Faubourg',
    city: 'Paris',
    postcode: '75001',
    country: 'France',
    phone: '+33 6 12 34 56 78',
  });
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');

  const shipping = delivery === 'express' ? 12 : cartTotal >= 200 ? 0 : 8;
  const orderTotal = cartTotal + shipping;

  const stepsList: { id: Step; label: string; icon: typeof Check }[] = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmed', icon: Check },
  ];

  const stepOrder: Step[] = ['shipping', 'delivery', 'payment', 'confirmation'];
  const currentStepIdx = stepOrder.indexOf(step);

  if (step === 'confirmation') {
    return (
      <div className="pt-[7rem] pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={28} className="text-ivory" />
          </div>
          <h1 className="font-serif text-4xl font-normal text-charcoal mb-4">Order Confirmed</h1>
          <p className="text-muted-gray text-base mb-2">Thank you, Olivia.</p>
          <p className="text-muted-gray text-sm mb-8">
            Your order has been placed and will be dispatched within 1–2 business days.
            You'll receive a confirmation email shortly.
          </p>
          <div className="bg-warm-white border border-beige p-6 mb-8 text-left">
            <p className="label-sm text-muted-gray mb-3">Order Summary</p>
            {state.cartItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <span>{item.product.name} × {item.quantity}</span>
                <span>€{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-beige mt-3 pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>€{orderTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('dashboard')} className="btn-primary w-full text-center">
              View Your Account
            </button>
            <button onClick={() => navigate('home')} className="btn-secondary w-full text-center">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[7rem] pb-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="py-8 border-b border-beige mb-8 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="font-serif text-xl tracking-[0.2em] uppercase">
            ATELIER NOIR
          </button>
          {/* Steps */}
          <div className="hidden sm:flex items-center gap-2">
            {stepsList.slice(0, 3).map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs tracking-wide ${i <= currentStepIdx ? 'text-charcoal' : 'text-muted-gray'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${i < currentStepIdx ? 'bg-charcoal text-ivory' : i === currentStepIdx ? 'border-2 border-charcoal' : 'border border-beige'}`}>
                    {i < currentStepIdx ? <Check size={10} /> : i + 1}
                  </div>
                  {s.label}
                </div>
                {i < 2 && <ChevronRight size={12} className="text-beige" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === 'shipping' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-6">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {([
                    ['firstName', 'First Name'], ['lastName', 'Last Name'],
                    ['email', 'Email Address'], ['phone', 'Phone Number'],
                    ['address', 'Street Address'], ['city', 'City'],
                    ['postcode', 'Postcode'], ['country', 'Country'],
                  ] as [keyof typeof form, string][]).map(([field, label]) => (
                    <div key={field} className={field === 'address' || field === 'email' ? 'col-span-2' : ''}>
                      <label className="label-sm block mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('delivery')} className="btn-primary mt-8">
                  Continue to Delivery
                </button>
              </div>
            )}

            {step === 'delivery' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-6">Delivery Options</h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard' as const, label: 'Standard Delivery', detail: '3–5 business days', price: cartTotal >= 200 ? 'Free' : '€8' },
                    { id: 'express' as const, label: 'Express Delivery', detail: '1–2 business days', price: '€12' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setDelivery(opt.id)}
                      className={`w-full flex items-center justify-between p-4 border text-left transition-colors ${
                        delivery === opt.id ? 'border-charcoal bg-white' : 'border-beige hover:border-charcoal/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${delivery === opt.id ? 'border-charcoal bg-charcoal' : 'border-beige'}`} />
                        <div>
                          <p className="text-sm font-medium text-charcoal">{opt.label}</p>
                          <p className="text-xs text-muted-gray">{opt.detail}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{opt.price}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep('shipping')} className="btn-secondary">Back</button>
                  <button onClick={() => setStep('payment')} className="btn-primary">Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-6">Payment</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label-sm block mb-1.5">Card Number</label>
                    <input type="text" defaultValue="•••• •••• •••• 4242" className="w-full border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors" readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-sm block mb-1.5">Expiry</label>
                      <input type="text" defaultValue="12/26" className="w-full border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors" readOnly />
                    </div>
                    <div>
                      <label className="label-sm block mb-1.5">CVV</label>
                      <input type="text" defaultValue="•••" className="w-full border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-charcoal transition-colors" readOnly />
                    </div>
                  </div>
                  <p className="text-xs text-muted-gray">This is a demo — no real payment is processed.</p>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep('delivery')} className="btn-secondary">Back</button>
                  <button onClick={() => setStep('confirmation')} className="btn-primary flex items-center gap-2">
                    <Check size={15} />
                    Place Order — €{orderTotal.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-warm-white border border-beige p-6 sticky top-28">
              <h3 className="font-medium text-sm tracking-wide mb-5">Order Summary</h3>
              <div className="space-y-4 mb-5">
                {state.cartItems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-20 bg-beige overflow-hidden shrink-0">
                      <FashionImage src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{item.product.name}</p>
                      <p className="text-xs text-muted-gray">{item.selectedColor} · {item.selectedSize}</p>
                      <p className="text-xs text-muted-gray">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">€{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {state.cartItems.length === 0 && (
                  <p className="text-sm text-muted-gray">No items in cart.</p>
                )}
              </div>
              <div className="space-y-2 pt-4 border-t border-beige">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-gray">Subtotal</span>
                  <span>€{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-gray">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `€${shipping}`}</span>
                </div>
                <div className="flex justify-between font-medium pt-3 border-t border-beige mt-2">
                  <span>Total</span>
                  <span>€{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
