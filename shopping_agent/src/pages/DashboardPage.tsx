import { ArrowRight, Package, Heart, CreditCard, Star, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { customer, activityFeed } from '../data/customer';
import { products } from '../data/products';
import { ProductCard } from '../components/catalog/ProductCard';
import { FashionImage } from '../components/catalog/ProductCard';

const EDIT_IMG = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&q=80';

const statusColors: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  returned: 'bg-gray-100 text-gray-600',
};

const activityIcons: Record<string, typeof Package> = {
  order: Package,
  restock: Bell,
  wishlist: Heart,
  recommendation: Sparkles,
};

export function DashboardPage() {
  const { navigate, openAssistant } = useApp();
  const recommendations = customer.recommendations
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  const metrics = [
    { icon: Package, label: 'Orders in progress', value: customer.orders.filter(o => o.status !== 'delivered').length.toString(), sub: 'active orders' },
    { icon: Heart, label: 'Saved pieces', value: customer.wishlistIds.length.toString(), sub: 'in your wishlist', action: () => navigate('wishlist') },
    { icon: CreditCard, label: 'Available balance', value: `€${customer.storeCredit}`, sub: 'store credit' },
    { icon: Star, label: 'Member status', value: customer.memberStatus, sub: 'loyalty tier' },
  ];

  return (
    <div className="pt-[7rem] pb-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Greeting */}
        <div className="py-10 border-b border-beige mb-10">
          <p className="label-sm text-muted-gray mb-2">Welcome back</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-charcoal mb-3">
            {customer.firstName}
          </h1>
          <p className="text-muted-gray text-base">Discover pieces selected for your style.</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.label}
                onClick={m.action}
                className={`bg-white border border-beige p-5 text-left transition-shadow hover:shadow-md ${m.action ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <Icon size={16} className="text-muted-gray mb-3" />
                <div className="font-serif text-2xl text-charcoal mb-1">{m.value}</div>
                <div className="text-xs text-muted-gray tracking-wide">{m.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          {/* Your Edit editorial card */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden bg-warm-white h-80 cursor-pointer group" onClick={() => navigate('catalog')}>
              <FashionImage src={EDIT_IMG} alt="Your Edit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/30 to-transparent" />
              <div className="absolute inset-0 flex items-center p-10">
                <div>
                  <p className="label-sm text-ivory/70 mb-3">Curated for you</p>
                  <h2 className="font-serif text-3xl text-ivory mb-3">Your Edit</h2>
                  <p className="text-ivory/70 text-sm mb-5 max-w-xs leading-relaxed">
                    Elevated essentials selected for your style preferences this season.
                  </p>
                  <button className="btn-primary text-xs px-6 py-2.5">
                    Explore Your Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white border border-beige p-6">
            <h3 className="font-medium text-sm tracking-wide mb-5 flex items-center justify-between">
              Recent Activity
              <Bell size={14} className="text-muted-gray" />
            </h3>
            <div className="space-y-5">
              {activityFeed.map(item => {
                const Icon = activityIcons[item.type] || Bell;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-7 h-7 bg-beige rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={13} className="text-charcoal" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-charcoal leading-snug mb-0.5">{item.message}</p>
                      {item.detail && <p className="text-xs text-muted-gray">{item.detail}</p>}
                      <p className="text-[11px] text-muted-gray mt-1">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-normal text-charcoal">Recent Orders</h2>
            <button className="btn-ghost text-sm flex items-center gap-1">View All <ArrowRight size={13} /></button>
          </div>
          <div className="space-y-3">
            {customer.orders.map(order => (
              <div key={order.id} className="bg-white border border-beige p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-medium text-sm">{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-gray">
                    {order.items.map(i => i.name).join(', ')}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-xs text-muted-gray mt-0.5">Tracking: {order.trackingNumber}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm">€{order.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-gray">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="label-sm text-muted-gray mb-2">Personalised</p>
              <h2 className="font-serif text-2xl font-normal text-charcoal">Selected for You</h2>
            </div>
            <button onClick={openAssistant} className="btn-ghost text-sm flex items-center gap-2 hidden sm:flex">
              <Sparkles size={13} />
              Ask NOIR
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recommendations.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
