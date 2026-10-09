import { useApp } from '../../context/AppContext';

export function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="bg-charcoal text-ivory mt-24">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl tracking-[0.2em] uppercase mb-4">ATELIER NOIR</h3>
            <p className="text-sm text-ivory/60 leading-relaxed max-w-xs">
              Modern essentials. Distinctive pieces. Crafted with intention and worn with confidence.
            </p>
          </div>
          <div>
            <p className="label-sm text-ivory/40 mb-4">Shop</p>
            <ul className="space-y-3">
              {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map(l => (
                <li key={l}>
                  <button onClick={() => navigate('catalog')} className="text-sm text-ivory/70 hover:text-ivory transition-colors">
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-sm text-ivory/40 mb-4">Help</p>
            <ul className="space-y-3">
              {['Sizing Guide', 'Delivery & Returns', 'Contact Us', 'Sustainability', 'About'].map(l => (
                <li key={l}>
                  <button className="text-sm text-ivory/70 hover:text-ivory transition-colors">{l}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-ivory/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/40">© 2024 ATELIER NOIR. All rights reserved.</p>
          <p className="text-xs text-ivory/40">Modern Essentials. Distinctive Pieces.</p>
        </div>
      </div>
    </footer>
  );
}
