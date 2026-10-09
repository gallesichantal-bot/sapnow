import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Minus, Send, Sparkles, ShoppingBag, ExternalLink,
  Mic, Camera, Image, Video, StopCircle, PhoneOff, Phone,
  MessageSquare, ChevronRight, Check, Maximize2, Minimize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, MessageAttachment, ChatComponent, Page } from '../../types';
import { FashionImage } from '../catalog/ProductCard';

// ─── Constants ───────────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'Find something for an evening event',
  'Build an outfit',
  'Show me new arrivals',
  'Help me find my size',
  'Find a gift',
  'Show me pieces under €250',
];

// ─── Voice state machine ──────────────────────────────────────────────────────

type VoiceState =
  | 'idle'
  | 'requesting_permission'
  | 'connecting'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted'
  | 'error'
  | 'unsupported';

const VOICE_STATE_LABELS: Record<VoiceState, string> = {
  idle: '',
  requesting_permission: 'Requesting microphone access…',
  connecting: 'Connecting…',
  listening: 'Listening…',
  processing: 'Thinking…',
  speaking: 'NOIR is speaking',
  interrupted: 'Interrupted',
  error: 'Something went wrong',
  unsupported: 'Voice not supported in this browser',
};

// ─── Voice waveform visualization ────────────────────────────────────────────

function VoiceWaveform({ state }: { state: VoiceState }) {
  // Symmetric bar heights — taller in the middle
  const heights = [12, 18, 24, 32, 40, 32, 24, 18, 12];
  // Symmetric animation delays — phase shifts create dome-wave effect
  const delays = ['0s', '0.12s', '0.22s', '0.10s', '0s', '0.10s', '0.22s', '0.12s', '0s'];

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing' || state === 'connecting';
  const isActive = isListening || isSpeaking || isProcessing;

  const barClass =
    isListening ? 'voice-bar-listen bg-red-400' :
    isSpeaking  ? 'voice-bar-speak bg-charcoal' :
    isProcessing ? 'voice-bar-process bg-taupe' :
    'bg-beige';

  return (
    <div className="flex items-end justify-center gap-[3px] h-12" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`voice-bar ${barClass}`}
          style={{
            height: isActive ? `${h}px` : '4px',
            animationDelay: delays[i],
          }}
        />
      ))}
    </div>
  );
}

// ─── Compact product card for voice panel ────────────────────────────────────

function VoiceProductCard({
  product,
  onNavigate,
  onAddToCart,
}: {
  product: Product;
  onNavigate: (page: Page, id?: string) => void;
  onAddToCart: (p: Product, size: string, color: string) => void;
}) {
  const [added, setAdded] = useState(false);
  return (
    <div className="bg-white border border-beige overflow-hidden flex flex-col animate-scale-in">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-warm-white cursor-pointer"
        onClick={() => onNavigate('product-detail', product.id)}
      >
        <FashionImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.tags.includes('new-arrival') && (
          <span className="absolute top-2 left-2 bg-charcoal text-ivory text-[9px] tracking-wider uppercase px-1.5 py-0.5">
            New
          </span>
        )}
      </div>
      <div className="p-2 space-y-1.5">
        <p className="text-[10px] font-medium text-charcoal leading-tight line-clamp-2">{product.name}</p>
        <p className="text-[10px] text-muted-gray">€{product.price.toLocaleString()}</p>
        <div className="flex gap-1">
          <button
            onClick={() => onNavigate('product-detail', product.id)}
            className="flex-1 py-1.5 border border-beige text-[9px] tracking-widest uppercase text-charcoal hover:border-charcoal transition-colors"
          >
            View
          </button>
          <button
            onClick={() => {
              onAddToCart(product, product.sizes[0], product.colors[0].name);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className={`flex-1 py-1.5 text-[9px] tracking-widest uppercase transition-colors ${
              added ? 'bg-green-700 text-ivory' : 'bg-charcoal text-ivory hover:bg-black'
            }`}
          >
            {added ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Voice conversation panel ─────────────────────────────────────────────────

function VoicePanel({
  voiceState,
  liveTranscript,
  errorMsg,
  lastText,
  lastProducts,
  lastComponents,
  lastFollowUps,
  expanded,
  onStopSpeaking,
  onEnd,
  onSwitchToText,
  onNavigate,
  onAddToCart,
  onPrompt,
}: {
  voiceState: VoiceState;
  liveTranscript: string;
  errorMsg: string;
  lastText: string;
  lastProducts: Product[];
  lastComponents: ChatComponent[];
  lastFollowUps: string[];
  expanded: boolean;
  onStopSpeaking: () => void;
  onEnd: () => void;
  onSwitchToText: () => void;
  onNavigate: (page: Page, id?: string) => void;
  onAddToCart: (p: Product, size: string, color: string) => void;
  onPrompt: (p: string) => void;
}) {
  const hasResponse = lastText || lastComponents.length > 0 || lastProducts.length > 0;
  const isError = voiceState === 'error' || voiceState === 'unsupported';

  return (
    <div className="flex-1 flex flex-col bg-ivory overflow-hidden">

      {/* NOIR identity — compact horizontal bar */}
      <div className="px-4 py-2.5 border-b border-beige shrink-0 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-charcoal rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-ivory font-serif text-xs font-bold">N</span>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal leading-tight">NOIR</p>
          <p className="text-[9px] text-muted-gray tracking-wide">Your Personal Style Assistant</p>
        </div>
      </div>

      {/* Waveform + status */}
      <div className="flex flex-col items-center py-4 px-4 gap-2.5 shrink-0">
        <VoiceWaveform state={voiceState} />

        <p className={`text-xs font-medium tracking-wide text-center ${
          voiceState === 'listening'  ? 'text-red-500' :
          voiceState === 'speaking'   ? 'text-charcoal' :
          isError                     ? 'text-red-600' :
          'text-muted-gray'
        }`}>
          {VOICE_STATE_LABELS[voiceState]}
        </p>

        {liveTranscript && voiceState === 'listening' && (
          <p className="text-xs text-muted-gray italic text-center max-w-[260px] leading-relaxed animate-fade-in">
            "{liveTranscript}"
          </p>
        )}

        {errorMsg && isError && (
          <p className="text-[10px] text-red-600 text-center max-w-[260px] leading-relaxed">
            {errorMsg}
          </p>
        )}

        {voiceState === 'unsupported' && (
          <p className="text-[10px] text-muted-gray text-center max-w-[260px] leading-relaxed">
            Please use Chrome or Edge for voice conversations with NOIR.
          </p>
        )}
      </div>

      {/* Last assistant response + rich components + products */}
      {hasResponse && (
        <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-3 scrollbar-hide">
          {lastText && (
            <div className="bg-white border border-beige px-4 py-3 text-sm text-charcoal leading-relaxed animate-fade-in">
              {lastText}
            </div>
          )}
          {/* Rich components: comparison table, detail card, carousel, cart summary */}
          {lastComponents.length > 0 && (
            <div className="space-y-2 animate-fade-in">
              <MessageComponents components={lastComponents} onPrompt={onPrompt} />
            </div>
          )}
          {/* Fallback simple product grid (only when no rich components) */}
          {lastComponents.length === 0 && lastProducts.length > 0 && (
            <div className={`grid gap-2 animate-fade-in ${
              lastProducts.length === 1
                ? 'grid-cols-1 max-w-[180px]'
                : expanded
                  ? 'grid-cols-3'
                  : 'grid-cols-2'
            }`}>
              {lastProducts.slice(0, expanded ? 6 : 4).map(p => (
                <VoiceProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
          {/* Suggested follow-ups */}
          {lastFollowUps.length > 0 && (
            <SuggestedFollowUps prompts={lastFollowUps} onPrompt={onPrompt} />
          )}
        </div>
      )}

      {!hasResponse && <div className="flex-1" />}

      {/* Controls */}
      <div className="px-4 pb-4 pt-3 border-t border-beige space-y-2 shrink-0">
        {voiceState === 'speaking' && (
          <button
            onClick={onStopSpeaking}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-charcoal/40 text-charcoal text-[10px] tracking-widest uppercase font-medium hover:border-charcoal transition-colors"
          >
            <StopCircle size={11} />
            Stop speaking
          </button>
        )}

        <div className="flex gap-2">
          <button
            onClick={onSwitchToText}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-beige text-[10px] tracking-widest uppercase text-muted-gray hover:border-charcoal hover:text-charcoal transition-colors"
          >
            <MessageSquare size={11} />
            Text
          </button>
          <button
            onClick={onEnd}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-charcoal text-ivory text-[10px] tracking-widest uppercase font-medium hover:bg-black transition-colors"
          >
            <PhoneOff size={11} />
            End
          </button>
        </div>

        <p className="text-[9px] text-muted-gray/50 text-center tracking-widest uppercase">
          {voiceState === 'listening'  ? 'Speak naturally — NOIR is listening' :
           voiceState === 'speaking'   ? 'You can stop speaking at any time' :
           voiceState === 'processing' ? 'Processing your request…' :
           'Voice conversation mode'}
        </p>
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white border border-beige w-fit rounded-none">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

// ─── Attachment components ────────────────────────────────────────────────────

function AttachmentPreview({
  attachment,
  onRemove,
}: {
  attachment: MessageAttachment;
  onRemove: () => void;
}) {
  return (
    <div className="relative inline-flex rounded overflow-hidden border border-beige bg-warm-white">
      {attachment.type === 'image' && (
        <img src={attachment.url} alt={attachment.name || 'Attachment'} className="w-16 h-16 object-cover" />
      )}
      {attachment.type === 'video' && (
        <div className="w-16 h-16 flex items-center justify-center bg-charcoal/10">
          <Video size={20} className="text-charcoal/60" />
        </div>
      )}
      {attachment.type === 'audio' && (
        <div className="w-16 h-16 flex items-center justify-center bg-charcoal/10">
          <Mic size={20} className="text-charcoal/60" />
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-charcoal text-ivory rounded-full flex items-center justify-center hover:bg-black transition-colors"
        aria-label="Remove attachment"
      >
        <X size={10} />
      </button>
    </div>
  );
}

function MessageAttachmentDisplay({ attachment }: { attachment: MessageAttachment }) {
  if (attachment.type === 'image') {
    return (
      <img
        src={attachment.url}
        alt={attachment.name || 'Image'}
        className="max-w-[200px] max-h-[200px] object-cover rounded border border-beige/40"
      />
    );
  }
  if (attachment.type === 'video') {
    return (
      <video
        src={attachment.url}
        controls
        className="max-w-[200px] max-h-[160px] rounded border border-beige/40"
        style={{ display: 'block' }}
      />
    );
  }
  return null;
}

// ─── Text chat product card ───────────────────────────────────────────────────

function AssistantProductCard({ product }: { product: Product }) {
  const { navigate, addToCart } = useApp();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, product.sizes[0], product.colors[0].name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white border border-beige overflow-hidden flex flex-col min-w-0 animate-scale-in">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-warm-white cursor-pointer flex-shrink-0"
        onClick={() => navigate('product-detail', product.id)}
      >
        <FashionImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.tags.includes('new-arrival') && (
          <span className="absolute top-2 left-2 bg-charcoal text-ivory text-[9px] tracking-wider uppercase px-2 py-0.5">New</span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h4 className="text-xs font-medium text-charcoal leading-tight mb-0.5 line-clamp-2">{product.name}</h4>
          <p className="text-xs text-muted-gray">€{product.price.toLocaleString()}</p>
        </div>
        <div className="flex gap-1">
          {product.colors.slice(0, 3).map(c => (
            <div key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-beige" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
        <div className="flex gap-1.5 mt-auto">
          <button
            onClick={() => navigate('product-detail', product.id)}
            className="flex-1 flex items-center justify-center gap-1 py-2 border border-beige text-[10px] tracking-widest uppercase text-charcoal hover:border-charcoal transition-colors font-medium"
          >
            <ExternalLink size={10} />
            View
          </button>
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] tracking-widest uppercase font-medium transition-colors ${
              added ? 'bg-green-700 text-ivory' : 'bg-charcoal text-ivory hover:bg-black'
            }`}
          >
            {added ? '✓' : <ShoppingBag size={10} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Attachment helpers ───────────────────────────────────────────────────────

let attachmentIdCounter = 0;
const newAttachmentId = () => `att-${++attachmentIdCounter}`;

// ─── Rich chat component renderers ───────────────────────────────────────────

function ProductCarouselRenderer({
  component,
  onPrompt,
}: {
  component: Extract<ChatComponent, { type: 'product_carousel' }>;
  onPrompt: (p: string) => void;
}) {
  const { navigate, addToCart } = useApp();
  return (
    <div className="w-full animate-fade-in">
      <p className="label-sm text-muted-gray mb-2">{component.headline}</p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {component.products.map(p => (
          <div key={p.id} className="shrink-0 w-[140px] bg-white border border-beige overflow-hidden flex flex-col">
            <div
              className="relative h-[180px] overflow-hidden bg-warm-white cursor-pointer"
              onClick={() => navigate('product-detail', p.id)}
            >
              <FashionImage
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {p.tags.includes('new-arrival') && (
                <span className="absolute top-1.5 left-1.5 bg-charcoal text-ivory text-[8px] tracking-wider uppercase px-1.5 py-0.5">New</span>
              )}
            </div>
            <div className="p-2 flex flex-col gap-1.5 flex-1">
              <p className="text-[10px] font-medium text-charcoal leading-tight line-clamp-2">{p.name}</p>
              <p className="text-[10px] text-muted-gray">€{p.price.toLocaleString()}</p>
              <div className="flex gap-0.5 mt-0.5">
                {p.colors.slice(0, 3).map(c => (
                  <div key={c.name} title={c.name} className="w-2.5 h-2.5 rounded-full border border-beige/60" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <button
                onClick={() => onPrompt(`Tell me about the ${p.name}`)}
                className="w-full mt-auto py-1.5 border border-beige text-[9px] tracking-widest uppercase text-charcoal hover:border-charcoal hover:bg-warm-white transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailRenderer({
  component,
  onPrompt,
}: {
  component: Extract<ChatComponent, { type: 'product_detail' }>;
  onPrompt: (p: string) => void;
}) {
  const { navigate } = useApp();
  const p = component.product;
  return (
    <div className="w-full bg-white border border-beige overflow-hidden animate-fade-in">
      {component.highlight && (
        <div className="px-3 py-1.5 bg-charcoal/5 border-b border-beige">
          <p className="text-[9px] tracking-widest uppercase text-muted-gray">{component.highlight}</p>
        </div>
      )}
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div
          className="shrink-0 w-[100px] h-[133px] overflow-hidden bg-warm-white cursor-pointer"
          onClick={() => navigate('product-detail', p.id)}
        >
          <FashionImage
            src={p.images[0]}
            alt={p.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h4 className="text-xs font-medium text-charcoal leading-tight mb-0.5">{p.name}</h4>
            <p className="text-sm font-medium text-charcoal">€{p.price.toLocaleString()}</p>
          </div>
          <p className="text-[10px] text-muted-gray leading-relaxed line-clamp-3">{p.description}</p>
          <div className="space-y-0.5">
            <p className="text-[9px] text-muted-gray"><span className="text-charcoal font-medium">Material</span> {p.material}</p>
            <p className="text-[9px] text-muted-gray"><span className="text-charcoal font-medium">Fit</span> {p.fit.split('.')[0]}</p>
          </div>
          {/* Colour swatches */}
          <div className="flex gap-1 items-center">
            <span className="text-[9px] text-muted-gray mr-0.5">Colours</span>
            {p.colors.map(c => (
              <div key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-beige" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          {/* Sizes */}
          <div className="flex flex-wrap gap-1">
            {p.sizes.slice(0, 5).map(s => (
              <span key={s} className="text-[8px] tracking-wide px-1.5 py-0.5 border border-beige text-charcoal">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-beige">
        <button
          onClick={() => navigate('product-detail', p.id)}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 text-[9px] tracking-widest uppercase text-charcoal hover:bg-warm-white transition-colors border-r border-beige"
        >
          <ExternalLink size={10} />
          Full Details
        </button>
        <button
          onClick={() => onPrompt(`Add the ${p.name} to cart`)}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-charcoal text-ivory text-[9px] tracking-widest uppercase hover:bg-black transition-colors"
        >
          <ShoppingBag size={10} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}

function ComparisonTableRenderer({
  component,
  onPrompt,
}: {
  component: Extract<ChatComponent, { type: 'comparison_table' }>;
  onPrompt: (p: string) => void;
}) {
  const { navigate } = useApp();
  const prods = component.products.slice(0, 3);

  const rows: { label: string; value: (p: Product) => string }[] = [
    { label: 'Price',    value: p => `€${p.price.toLocaleString()}` },
    { label: 'Material', value: p => p.material.split('.')[0] },
    { label: 'Fit',      value: p => p.fit.split('.')[0] },
    { label: 'Sizes',    value: p => p.sizes.slice(0, 4).join(', ') },
    { label: 'Care',     value: p => p.care.split('.')[0] },
  ];

  const colW = prods.length === 2 ? 'w-1/2' : 'w-1/3';

  return (
    <div className="w-full bg-white border border-beige overflow-hidden animate-fade-in">
      {/* Header images */}
      <div className="flex">
        {prods.map(p => (
          <div key={p.id} className={`${colW} border-r border-beige last:border-r-0 p-2 flex flex-col items-center gap-1`}>
            <div
              className="w-full h-[90px] overflow-hidden bg-warm-white cursor-pointer"
              onClick={() => navigate('product-detail', p.id)}
            >
              <FashionImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <p className="text-[9px] font-medium text-charcoal text-center leading-tight line-clamp-2">{p.name}</p>
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map(row => (
        <div key={row.label} className="flex border-t border-beige">
          <div className="w-[52px] shrink-0 px-2 py-1.5 bg-warm-white border-r border-beige flex items-center">
            <span className="text-[8px] text-muted-gray uppercase tracking-wide">{row.label}</span>
          </div>
          {prods.map(p => (
            <div key={p.id} className={`${colW} px-2 py-1.5 border-r border-beige last:border-r-0 flex items-start`}>
              <span className="text-[9px] text-charcoal leading-relaxed">{row.value(p)}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Add buttons */}
      <div className="flex border-t border-beige">
        {prods.map(p => (
          <div key={p.id} className={`${colW} border-r border-beige last:border-r-0 p-1.5`}>
            <button
              onClick={() => onPrompt(`Add the ${p.name} to cart`)}
              className="w-full py-1.5 bg-charcoal text-ivory text-[8px] tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingBag size={8} />
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartSummaryRenderer({ component }: {
  component: Extract<ChatComponent, { type: 'cart_summary' }>;
}) {
  const { navigate } = useApp();

  return (
    <div className="w-full bg-white border border-beige overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-charcoal/5 border-b border-beige">
        <div className="flex items-center gap-1.5">
          <Check size={11} className="text-green-600" />
          <span className="text-[10px] font-medium tracking-wide text-charcoal">Added to bag</span>
        </div>
        <span className="text-[9px] text-muted-gray">{component.items.length} item{component.items.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Items */}
      <div className="divide-y divide-beige max-h-[200px] overflow-y-auto scrollbar-hide">
        {component.items.map((item, i) => {
          const isJustAdded = item.product.id === component.justAddedId;
          return (
            <div key={i} className={`flex gap-2 px-3 py-2 ${isJustAdded ? 'bg-green-50/60' : ''}`}>
              <div className="shrink-0 w-10 h-[52px] overflow-hidden bg-warm-white">
                <FashionImage src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-charcoal leading-tight line-clamp-1">{item.product.name}</p>
                <p className="text-[9px] text-muted-gray">{item.selectedSize} · {item.selectedColor}</p>
                <p className="text-[9px] text-muted-gray">Qty: {item.quantity}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-medium text-charcoal">€{(item.product.price * item.quantity).toLocaleString()}</p>
                {isJustAdded && (
                  <span className="text-[8px] text-green-600 font-medium">Just added</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total + CTA */}
      <div className="px-3 py-2.5 border-t border-beige space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-gray tracking-wide">Subtotal</span>
          <span className="text-sm font-medium text-charcoal">€{component.total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => navigate('cart')}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-charcoal text-ivory text-[10px] tracking-widest uppercase font-medium hover:bg-black transition-colors"
        >
          <ShoppingBag size={11} />
          View Bag & Checkout
          <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}

function SuggestedFollowUps({
  prompts,
  onPrompt,
}: {
  prompts: string[];
  onPrompt: (p: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1 animate-fade-in">
      {prompts.map(p => (
        <button
          key={p}
          onClick={() => onPrompt(p)}
          className="text-[9px] tracking-wide px-2.5 py-1.5 border border-beige bg-white text-charcoal hover:border-charcoal hover:bg-warm-white transition-colors rounded-sm"
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function MessageComponents({
  components,
  onPrompt,
}: {
  components: ChatComponent[];
  onPrompt: (p: string) => void;
}) {
  return (
    <>
      {components.map((comp, i) => {
        if (comp.type === 'product_carousel') return <ProductCarouselRenderer key={i} component={comp} onPrompt={onPrompt} />;
        if (comp.type === 'product_detail')   return <ProductDetailRenderer   key={i} component={comp} onPrompt={onPrompt} />;
        if (comp.type === 'comparison_table') return <ComparisonTableRenderer key={i} component={comp} onPrompt={onPrompt} />;
        if (comp.type === 'cart_summary')     return <CartSummaryRenderer     key={i} component={comp} />;
        return null;
      })}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NoirAssistant() {
  const { state, closeAssistant, toggleAssistant, sendMessage, navigate, addToCart } = useApp();

  // ── Text chat state ────────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // ── Voice conversation state ───────────────────────────────────────────────
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [lastVoiceText, setLastVoiceText] = useState('');
  const [lastVoiceProducts, setLastVoiceProducts] = useState<Product[]>([]);
  const [lastVoiceComponents, setLastVoiceComponents] = useState<ChatComponent[]>([]);
  const [lastVoiceFollowUps, setLastVoiceFollowUps] = useState<string[]>([]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const messagesEndRef   = useRef<HTMLDivElement>(null);
  const inputRef         = useRef<HTMLInputElement>(null);
  const prevMsgCountRef  = useRef(state.chatMessages.length);
  const photoInputRef    = useRef<HTMLInputElement>(null);
  const videoInputRef    = useRef<HTMLInputElement>(null);
  const videoRef         = useRef<HTMLVideoElement>(null);

  // Voice engine refs (avoid stale closures in callbacks)
  const voiceModeRef      = useRef(false);
  const voiceStateRef     = useRef<VoiceState>('idle');
  const recognitionRef    = useRef<any>(null);
  const pendingVoiceRef   = useRef(false);   // waiting for assistant response to speak
  const lastSpokenIdRef   = useRef<string | null>(null);
  const voiceFnsRef       = useRef<{
    startListening: () => void;
    speak: (text: string) => void;
    stopSpeaking: () => void;
    stopConversation: () => void;
  }>({
    startListening: () => {},
    speak: () => {},
    stopSpeaking: () => {},
    stopConversation: () => {},
  });

  // Keep voice refs in sync with state
  const setVS = (s: VoiceState) => { voiceStateRef.current = s; setVoiceState(s); };
  const setVM = (v: boolean)     => { voiceModeRef.current = v; setVoiceMode(v); };

  // Keep sendMessage ref fresh (captures current product context)
  const sendMessageRef = useRef(sendMessage);
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

  // ── Preload TTS voices ────────────────────────────────────────────────────
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    // Chrome loads voices asynchronously
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // ── Voice engine setup ────────────────────────────────────────────────────
  // Defined in a single effect so all functions share one closure.
  // `sendMessageRef` is used inside to avoid stale captures.
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const getPreferredVoice = (): SpeechSynthesisVoice | null => {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      return (
        voices.find(v => v.name === 'Google UK English Female') ||
        voices.find(v => v.name.includes('Aria') && !v.localService) ||
        voices.find(v => v.lang === 'en-GB' && !v.localService) ||
        voices.find(v => v.lang.startsWith('en-') && !v.localService) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null
      );
    };

    const startListening = () => {
      if (!voiceModeRef.current) return;
      if (!SpeechRecognitionAPI) { setVS('unsupported'); return; }

      // Abort any active recognition
      try { recognitionRef.current?.abort(); } catch { /* ok */ }

      const r = new SpeechRecognitionAPI();
      r.lang = 'en-US';
      r.continuous = false;
      r.interimResults = true;
      r.maxAlternatives = 1;
      recognitionRef.current = r;

      r.onstart = () => {
        setVS('listening');
      };

      r.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (interim) setLiveTranscript(interim);
        if (final.trim()) {
          setLiveTranscript('');
          setVS('processing');
          pendingVoiceRef.current = true;
          sendMessageRef.current(final.trim());
        }
      };

      r.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setVS('error');
          setVoiceError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'aborted') {
          // Deliberate abort — no action needed
        }
        // 'no-speech' handled by onend → restart
      };

      r.onend = () => {
        // If still in listening state (no speech / natural end) → restart
        if (voiceModeRef.current && voiceStateRef.current === 'listening') {
          setTimeout(voiceFnsRef.current.startListening, 350);
        }
      };

      try {
        r.start();
      } catch {
        setVS('error');
        setVoiceError('Failed to start voice recognition. Please try again.');
      }
    };

    const speak = (text: string) => {
      if (!('speechSynthesis' in window)) {
        // No TTS support — show text only, restart listening
        if (voiceModeRef.current) {
          setVS('listening');
          setTimeout(startListening, 500);
        }
        return;
      }

      window.speechSynthesis.cancel();
      setVS('speaking');

      // Clean text: convert prices to speakable form, strip excess whitespace
      const spokenText = text
        .replace(/€(\d+(?:,\d{3})*(?:\.\d+)?)/g, '$1 euros')
        .replace(/\n+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
        .substring(0, 350); // cap length to keep responses snappy

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      const voice = getPreferredVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (voiceModeRef.current) {
          setVS('listening');
          setTimeout(startListening, 400);
        }
      };

      utterance.onerror = (e) => {
        // 'interrupted'/'canceled' are expected (user stopped or tab changed)
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          if (voiceModeRef.current) {
            setVS('listening');
            setTimeout(startListening, 400);
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
      window.speechSynthesis?.cancel();
      if (voiceModeRef.current) {
        setVS('listening');
        setTimeout(startListening, 300);
      }
    };

    const stopConversation = () => {
      setVM(false);
      setVS('idle');
      setLiveTranscript('');
      pendingVoiceRef.current = false;
      try { recognitionRef.current?.abort(); } catch { /* ok */ }
      recognitionRef.current = null;
      window.speechSynthesis?.cancel();
    };

    voiceFnsRef.current = { startListening, speak, stopSpeaking, stopConversation };

    return () => {
      // Cleanup on unmount
      try { recognitionRef.current?.abort(); } catch { /* ok */ }
      window.speechSynthesis?.cancel();
    };
  }, []); // stable — reads from refs only

  // ── Detect new assistant message while in voice processing ───────────────
  useEffect(() => {
    if (!pendingVoiceRef.current) return;
    const msgs = state.chatMessages;
    const last = msgs[msgs.length - 1];
    if (last?.role === 'assistant' && last.id !== lastSpokenIdRef.current) {
      lastSpokenIdRef.current = last.id;
      pendingVoiceRef.current = false;
      setLastVoiceText(last.content);
      setLastVoiceComponents(last.components ?? []);
      setLastVoiceFollowUps(last.suggestedFollowUps ?? []);

      // Extract products only when there are no rich components (fallback grid)
      const voiceProds: Product[] = [];
      if (!last.components || last.components.length === 0) {
        if (last.products) voiceProds.push(...last.products);
      }
      setLastVoiceProducts(voiceProds.slice(0, 4));

      voiceFnsRef.current.speak(last.content);
    }
  }, [state.chatMessages]);

  // ── Start voice conversation ──────────────────────────────────────────────
  const startVoiceConversation = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVM(true);
      setVS('unsupported');
      setVoiceError('');
      return;
    }

    setVM(true);
    setVS('connecting');
    setVoiceError('');
    setLastVoiceText('');
    setLastVoiceProducts([]);
    setLastVoiceComponents([]);
    setLastVoiceFollowUps([]);
    setLiveTranscript('');
    pendingVoiceRef.current = false;
    lastSpokenIdRef.current = null;

    // Brief connecting pause then start listening
    setTimeout(() => {
      voiceFnsRef.current.startListening();
    }, 250);
  }, []);

  // ── Voice prompt handler (re-arms TTS for chip taps in voice mode) ────────
  const handleVoicePrompt = useCallback((prompt: string) => {
    pendingVoiceRef.current = true;
    setVS('processing');
    try { recognitionRef.current?.abort(); } catch { /* ok */ }
    sendMessage(prompt);
  }, [sendMessage]);

  // ── Text chat: detect typing state ───────────────────────────────────────
  useEffect(() => {
    const count = state.chatMessages.length;
    if (count > prevMsgCountRef.current) {
      const lastMsg = state.chatMessages[count - 1];
      if (lastMsg?.role === 'user') {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
      prevMsgCountRef.current = count;
    }
  }, [state.chatMessages]);

  useEffect(() => {
    if (state.assistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.chatMessages, isTyping, state.assistantOpen]);

  useEffect(() => {
    if (state.assistantOpen && !minimized && !voiceMode) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state.assistantOpen, minimized, voiceMode]);

  // ── Camera cleanup ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    };
  }, [cameraStream]);

  const closeCameraStream = useCallback(() => {
    cameraStream?.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    setCameraOpen(false);
  }, [cameraStream]);

  useEffect(() => {
    if (cameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraOpen, cameraStream]);

  // ── Text send ─────────────────────────────────────────────────────────────
  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg && pendingAttachments.length === 0) return;
    sendMessage(
      msg || (pendingAttachments.length > 0 ? "I've shared a photo — what do you think?" : ''),
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );
    setInputValue('');
    setPendingAttachments([]);
  };

  const handlePrompt = (prompt: string) => sendMessage(prompt);

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      setPendingAttachments(prev => [
        ...prev,
        { id: newAttachmentId(), type: 'image', url, name: file.name, mimeType: file.type },
      ]);
    });
    e.target.value = '';
  };

  // ── Camera capture ────────────────────────────────────────────────────────
  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setCameraOpen(true);
    } catch {
      // Permission denied — silent fail, user sees no capture
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setPendingAttachments(prev => [
        ...prev,
        { id: newAttachmentId(), type: 'image', url, name: 'camera-photo.jpg', mimeType: 'image/jpeg' },
      ]);
      closeCameraStream();
    }, 'image/jpeg', 0.9);
  };

  // ── Video upload ──────────────────────────────────────────────────────────
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      if (!file.type.startsWith('video/')) return;
      const url = URL.createObjectURL(file);
      setPendingAttachments(prev => [
        ...prev,
        { id: newAttachmentId(), type: 'video', url, name: file.name, mimeType: file.type },
      ]);
    });
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments(prev => {
      const att = prev.find(a => a.id === id);
      if (att) URL.revokeObjectURL(att.url);
      return prev.filter(a => a.id !== id);
    });
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const hasGreeting = state.chatMessages.length === 0;
  const canSend = inputValue.trim().length > 0 || pendingAttachments.length > 0;

  // ── FAB when closed ───────────────────────────────────────────────────────
  if (!state.assistantOpen) {
    return (
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-charcoal text-ivory rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors group"
        aria-label="Open NOIR assistant"
      >
        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  // ── Panel ─────────────────────────────────────────────────────────────────
  return (
    <div className={`fixed bottom-6 right-6 z-40 bg-ivory border border-beige shadow-2xl flex flex-col transition-all duration-300 animate-slide-up
      ${expanded ? 'w-[680px] max-w-[calc(100vw-2rem)]' : 'w-[400px] max-w-[calc(100vw-1rem)]'}
      ${minimized ? 'h-16' : expanded ? 'h-[85vh]' : 'h-[640px] max-h-[calc(100vh-5rem)]'}
    `}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-beige bg-charcoal text-ivory shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ivory rounded-full flex items-center justify-center">
            <span className="text-charcoal text-xs font-serif font-bold">N</span>
          </div>
          <div>
            <p className="text-sm font-medium tracking-wider">NOIR</p>
            <p className="text-[10px] text-ivory/60 tracking-wide">
              {voiceMode ? 'Voice Conversation' : 'Personal Style Assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Voice / text toggle */}
          <button
            onClick={voiceMode ? voiceFnsRef.current.stopConversation : startVoiceConversation}
            title={voiceMode ? 'End voice conversation' : 'Start voice conversation'}
            className={`p-1.5 rounded transition-colors ${
              voiceMode
                ? 'bg-red-500/80 text-white hover:bg-red-600'
                : 'hover:bg-ivory/10 text-ivory/80 hover:text-ivory'
            }`}
            aria-label={voiceMode ? 'End voice conversation' : 'Start voice conversation'}
          >
            {voiceMode ? <PhoneOff size={15} /> : <Phone size={15} />}
          </button>
          <button
            onClick={() => { setExpanded(e => !e); setMinimized(false); }}
            title={expanded ? 'Collapse' : 'Expand'}
            className="p-1.5 hover:bg-ivory/10 transition-colors rounded"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={() => setMinimized(m => !m)}
            className="p-1.5 hover:bg-ivory/10 transition-colors rounded"
            aria-label={minimized ? 'Expand' : 'Minimize'}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={closeAssistant}
            className="p-1.5 hover:bg-ivory/10 transition-colors rounded"
            aria-label="Close assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* ── Voice conversation panel ─────────────────────────────── */}
          {voiceMode && (
            <VoicePanel
              voiceState={voiceState}
              liveTranscript={liveTranscript}
              errorMsg={voiceError}
              lastText={lastVoiceText}
              lastProducts={lastVoiceProducts}
              lastComponents={lastVoiceComponents}
              lastFollowUps={lastVoiceFollowUps}
              expanded={expanded}
              onStopSpeaking={voiceFnsRef.current.stopSpeaking}
              onEnd={voiceFnsRef.current.stopConversation}
              onSwitchToText={voiceFnsRef.current.stopConversation}
              onNavigate={navigate}
              onAddToCart={addToCart}
              onPrompt={handleVoicePrompt}
            />
          )}

          {/* ── Text chat (hidden in voice mode) ─────────────────────── */}
          {!voiceMode && (
            <>
              {/* Camera preview overlay */}
              {cameraOpen && (
                <div className="absolute inset-0 z-50 bg-charcoal flex flex-col" style={{ top: '64px' }}>
                  <video ref={videoRef} autoPlay playsInline muted className="flex-1 w-full object-cover" />
                  <div className="flex items-center justify-center gap-4 p-4 bg-charcoal">
                    <button
                      onClick={closeCameraStream}
                      className="px-4 py-2 border border-ivory/30 text-ivory text-xs tracking-widest uppercase hover:bg-ivory/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="px-6 py-2 bg-ivory text-charcoal text-xs tracking-widest uppercase font-medium hover:bg-beige transition-colors"
                    >
                      Capture
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
                {hasGreeting && (
                  <div className="space-y-4">
                    <div className="bg-white border border-beige p-4 text-sm text-charcoal leading-relaxed animate-fade-in">
                      <p className="font-medium mb-1">Hello, I'm NOIR.</p>
                      <p className="text-muted-gray">
                        Ask me anything, or tap the{' '}
                        <Phone size={11} className="inline mx-0.5 text-charcoal" />
                        {' '}phone icon above to start a voice conversation.
                      </p>
                    </div>
                    <div>
                      <p className="label-sm text-muted-gray mb-3">Suggested</p>
                      <div className="flex flex-col gap-2">
                        {SUGGESTED_PROMPTS.map(prompt => (
                          <button
                            key={prompt}
                            onClick={() => handlePrompt(prompt)}
                            className="text-left px-4 py-2.5 border border-beige bg-white text-xs text-charcoal hover:border-charcoal hover:bg-warm-white transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {state.chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col gap-2 animate-fade-in ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 max-w-[85%]">
                        {msg.attachments.map(att => (
                          <MessageAttachmentDisplay key={att.id} attachment={att} />
                        ))}
                      </div>
                    )}
                    {msg.content && (
                      <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-charcoal text-ivory'
                          : 'bg-white border border-beige text-charcoal'
                      }`}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    )}
                    {/* Rich components (carousel, detail, comparison, cart summary) */}
                    {msg.role === 'assistant' && msg.components && msg.components.length > 0 && (
                      <div className="w-full space-y-2">
                        <MessageComponents components={msg.components} onPrompt={handlePrompt} />
                      </div>
                    )}
                    {/* Legacy products grid */}
                    {msg.products && msg.products.length > 0 && (
                      <div className={`w-full grid gap-2 ${msg.products.length === 1 ? 'grid-cols-1 max-w-[200px]' : 'grid-cols-2'}`}>
                        {msg.products.slice(0, 4).map(p => (
                          <AssistantProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    )}
                    {/* Suggested follow-up chips */}
                    {msg.role === 'assistant' && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <SuggestedFollowUps prompts={msg.suggestedFollowUps} onPrompt={handlePrompt} />
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start animate-fade-in">
                    <TypingIndicator />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts after conversation starts */}
              {state.chatMessages.length > 0 && state.chatMessages.length < 8 && (
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                  {SUGGESTED_PROMPTS.slice(0, 3).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePrompt(p)}
                      className="whitespace-nowrap text-[10px] tracking-wide px-3 py-1.5 border border-beige text-charcoal hover:border-charcoal transition-colors shrink-0 bg-white"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Pending attachments preview */}
              {pendingAttachments.length > 0 && (
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                  {pendingAttachments.map(att => (
                    <AttachmentPreview
                      key={att.id}
                      attachment={att}
                      onRemove={() => removeAttachment(att.id)}
                    />
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="px-3 pb-3 pt-2 shrink-0 border-t border-beige">
                {/* Multimodal toolbar */}
                <div className="flex items-center gap-1 mb-2">
                  {/* Voice conversation button */}
                  <button
                    onClick={startVoiceConversation}
                    title="Start voice conversation"
                    className="p-2 rounded text-muted-gray hover:text-charcoal hover:bg-beige/50 transition-colors"
                    aria-label="Start voice conversation"
                  >
                    <Mic size={16} />
                  </button>

                  {/* Photo upload */}
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    title="Upload photo"
                    className="p-2 rounded text-muted-gray hover:text-charcoal hover:bg-beige/50 transition-colors"
                  >
                    <Image size={16} />
                  </button>

                  {/* Camera */}
                  <button
                    onClick={openCamera}
                    title="Take photo"
                    className="p-2 rounded text-muted-gray hover:text-charcoal hover:bg-beige/50 transition-colors"
                  >
                    <Camera size={16} />
                  </button>

                  {/* Video upload */}
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    title="Upload video"
                    className="p-2 rounded text-muted-gray hover:text-charcoal hover:bg-beige/50 transition-colors"
                  >
                    <Video size={16} />
                  </button>

                  <div className="flex-1" />
                  <span className="text-[9px] text-muted-gray/60 tracking-widest uppercase mr-1">NOIR</span>
                </div>

                {/* Text input + send */}
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={pendingAttachments.length > 0 ? 'Add a message… (optional)' : 'Ask NOIR anything…'}
                    className="flex-1 border border-beige bg-white px-3 py-2.5 text-sm outline-none focus:border-charcoal transition-colors placeholder-muted-gray"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="w-10 h-10 bg-charcoal text-ivory flex items-center justify-center hover:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    aria-label="Send"
                  >
                    <Send size={14} />
                  </button>
                </div>

                <p className="text-[9px] text-muted-gray/60 mt-1.5 text-center tracking-widest uppercase">
                  ATELIER NOIR · Personal Style Assistant
                </p>
              </div>

              {/* Hidden file inputs */}
              <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
              <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/mov" className="hidden" onChange={handleVideoSelect} />
            </>
          )}
        </>
      )}
    </div>
  );
}
