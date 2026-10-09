import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  CartItem, Product, ChatMessage, MessageAttachment, ChatComponent,
  ConversationContext, Page, Category, AssistantIntent,
} from '../types';
import {
  products,
  getNewArrivals,
  getProductsUnderPrice,
} from '../data/products';
import { customer as initialCustomer } from '../data/customer';

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  currentPage: Page;
  currentProductId: string | null;
  currentCategory: Category | null;
  cartItems: CartItem[];
  wishlistIds: string[];
  assistantOpen: boolean;
  cartOpen: boolean;
  chatMessages: ChatMessage[];
  searchQuery: string;
  conversationContext: ConversationContext;
}

type Action =
  | { type: 'NAVIGATE'; page: Page; productId?: string; category?: Category }
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; productId: string; size: string; color: string }
  | { type: 'UPDATE_CART_QTY'; productId: string; size: string; color: string; quantity: number }
  | { type: 'TOGGLE_WISHLIST'; productId: string }
  | { type: 'TOGGLE_ASSISTANT' }
  | { type: 'OPEN_ASSISTANT' }
  | { type: 'CLOSE_ASSISTANT' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'UPDATE_CONTEXT'; context: ConversationContext };

const initialConversationContext: ConversationContext = {
  intent: null,
  recipient: null,
  budget: null,
  styles: [],
  colors: [],
  occasion: null,
  activeProductId: null,
  recentProductIds: [],
  pendingAddProductId: null,
  turnCount: 0,
};

const initialState: AppState = {
  currentPage: 'home',
  currentProductId: null,
  currentCategory: null,
  cartItems: [],
  wishlistIds: initialCustomer.wishlistIds,
  assistantOpen: false,
  cartOpen: false,
  chatMessages: [],
  searchQuery: '',
  conversationContext: initialConversationContext,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentPage: action.page,
        currentProductId: action.productId ?? null,
        currentCategory: action.category ?? null,
        cartOpen: false,
      };
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find(
        i =>
          i.product.id === action.item.product.id &&
          i.selectedSize === action.item.selectedSize &&
          i.selectedColor === action.item.selectedColor
      );
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.product.id === action.item.product.id &&
            i.selectedSize === action.item.selectedSize &&
            i.selectedColor === action.item.selectedColor
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, action.item] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          i =>
            !(
              i.product.id === action.productId &&
              i.selectedSize === action.size &&
              i.selectedColor === action.color
            )
        ),
      };
    case 'UPDATE_CART_QTY':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.product.id === action.productId &&
          i.selectedSize === action.size &&
          i.selectedColor === action.color
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        wishlistIds: state.wishlistIds.includes(action.productId)
          ? state.wishlistIds.filter(id => id !== action.productId)
          : [...state.wishlistIds, action.productId],
      };
    case 'TOGGLE_ASSISTANT':
      return { ...state, assistantOpen: !state.assistantOpen };
    case 'OPEN_ASSISTANT':
      return { ...state, assistantOpen: true };
    case 'CLOSE_ASSISTANT':
      return { ...state, assistantOpen: false };
    case 'TOGGLE_CART':
      return { ...state, cartOpen: !state.cartOpen };
    case 'CLOSE_CART':
      return { ...state, cartOpen: false };
    case 'ADD_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'UPDATE_CONTEXT':
      return { ...state, conversationContext: action.context };
    default:
      return state;
  }
}

// ─── Smart response builder ───────────────────────────────────────────────────

interface SmartResponse {
  text: string;
  products?: Product[];
  components?: ChatComponent[];
  suggestedFollowUps?: string[];
  contextUpdate?: Partial<ConversationContext>;
  addToCart?: { product: Product; size: string; color: string };
  intent: AssistantIntent;
}

/** Find first product whose name or keywords match query */
function findProductByQuery(q: string): Product | undefined {
  const lower = q.toLowerCase();

  // Full name match
  const byFullName = products.find(p => lower.includes(p.name.toLowerCase()));
  if (byFullName) return byFullName;

  // Keyword shortcuts for demo products
  if (lower.includes('silk') || (lower.includes('draped dress'))) return products.find(p => p.id === 'p002');
  if (lower.includes('cashmere knit') || lower.includes('oversized knit') || (lower.includes('oversized') && lower.includes('cashmere'))) return products.find(p => p.id === 'p003');
  if (lower.includes('cardigan') || (lower.includes('ribbed') && lower.includes('merino'))) return products.find(p => p.id === 'p007');
  if (lower.includes('cashmere scarf') || (lower.includes('scarf') && !lower.includes('fashion'))) return products.find(p => p.id === 'p016');
  if (lower.includes('leather tote') || lower.includes('structured tote') || (lower.includes('tote'))) return products.find(p => p.id === 'p004');
  if (lower.includes('blazer')) return products.find(p => p.id === 'p001');
  if (lower.includes('double-breasted') || (lower.includes('double') && lower.includes('coat'))) return products.find(p => p.id === 'p009');
  if (lower.includes('wool coat') || lower.includes('oversized coat')) return products.find(p => p.id === 'p019');
  if (lower.includes('loafer') || lower.includes('oxford')) return products.find(p => p.id === 'p018');

  // Category fallbacks
  if (lower.includes('dress') || lower.includes('skirt')) return products.find(p => p.category === 'dresses');
  if (lower.includes('knit') || lower.includes('sweater')) return products.find(p => p.category === 'knitwear' && p.gender !== 'men');
  if (lower.includes('bag') || lower.includes('handbag') || lower.includes('purse')) return products.find(p => p.category === 'bags');
  if (lower.includes('coat') || lower.includes('jacket')) return products.find(p => p.category === 'outerwear');
  if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot')) return products.find(p => p.category === 'shoes');
  if (lower.includes('scarf')) return products.find(p => p.id === 'p016');

  return undefined;
}

/** Find all products mentioned in query (for comparison) */
function findAllProductsByQuery(q: string): Product[] {
  const lower = q.toLowerCase();
  const found: Product[] = [];

  // Check each product name
  for (const p of products) {
    if (lower.includes(p.name.toLowerCase()) && !found.find(x => x.id === p.id)) {
      found.push(p);
    }
  }

  // If only one or zero found, check keywords for two
  if (found.length < 2) {
    const byKeyword = findProductByQuery(q);
    if (byKeyword && !found.find(x => x.id === byKeyword.id)) {
      found.push(byKeyword);
    }
  }

  return found;
}

function buildSmartResponse(
  content: string,
  _currentProductId: string | null,
  attachments: MessageAttachment[] | undefined,
  ctx: ConversationContext,
  currentCartItems: CartItem[],
): SmartResponse {
  const q = content.toLowerCase().trim();

  // ── 1. Media attachments ──────────────────────────────────────────────────
  if (attachments?.some(a => a.type === 'image')) {
    const dress  = products.find(p => p.category === 'dresses') || products[1];
    const coat   = products.find(p => p.category === 'outerwear' && p.gender !== 'men') || products[8];
    const bag    = products.find(p => p.category === 'bags') || products[3];
    const knit   = products.find(p => p.category === 'knitwear' && p.gender === 'women') || products[2];

    let prods = [coat, knit, bag];
    let text = "I can see a relaxed, neutral-toned silhouette with clean lines. Here are pieces that capture a similar aesthetic:";

    if (q.includes('outfit') || q.includes('style')) {
      prods = [dress, coat, bag];
      text = "Based on your photo, I'd suggest building around these complementary pieces:";
    } else if (q.includes('pair') || q.includes('with')) {
      prods = [knit, bag, dress];
      text = "To complement what I can see in your photo, these pieces would work beautifully together:";
    }

    return { text, products: prods, intent: 'image-analysis' };
  }

  if (attachments?.some(a => a.type === 'video')) {
    return {
      text: "I've reviewed your styling video. The look has a relaxed, contemporary feel. I'd suggest elevating it with a structured outer layer and a refined bag:",
      products: [products[0], products[3], products[5]],
      intent: 'video-analysis',
    };
  }

  // ── 2. Pending add-to-cart — waiting for size/colour ─────────────────────
  if (ctx.pendingAddProductId) {
    const product = products.find(p => p.id === ctx.pendingAddProductId);
    if (product) {
      const sizeFound = product.sizes.find(s =>
        q.includes(s.toLowerCase()) || q.toLowerCase().includes(`size ${s.toLowerCase()}`)
      );
      const colorFound = product.colors.find(c =>
        q.toLowerCase().includes(c.name.toLowerCase())
      );

      if (sizeFound || colorFound) {
        const size  = sizeFound || product.sizes[0];
        const color = colorFound ? colorFound.name : product.colors[0].name;

        // Compute updated cart including new item
        const newCartItems = [...currentCartItems];
        const existingIdx = newCartItems.findIndex(
          i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
        );
        if (existingIdx >= 0) {
          newCartItems[existingIdx] = { ...newCartItems[existingIdx], quantity: newCartItems[existingIdx].quantity + 1 };
        } else {
          newCartItems.push({ product, selectedSize: size, selectedColor: color, quantity: 1 });
        }
        const total = newCartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

        return {
          text: `Perfect. I've added the ${product.name} in size ${size}, ${color} to your bag.`,
          components: [{ type: 'cart_summary', items: newCartItems, total, justAddedId: product.id }],
          suggestedFollowUps: ['View full cart', 'Continue shopping', 'Add another piece'],
          contextUpdate: { pendingAddProductId: null },
          addToCart: { product, size, color },
          intent: 'cart-confirmation',
        };
      }

      // Still can't detect size/colour
      return {
        text: `Which size would you like for the ${product.name}? Available: ${product.sizes.join(', ')}. And in which colour — ${product.colors.map(c => c.name).join(', ')}?`,
        suggestedFollowUps: product.sizes.slice(0, 2).flatMap(sz =>
          product.colors.slice(0, 2).map(c => `Size ${sz} in ${c.name}`)
        ).slice(0, 4),
        intent: 'add-to-bag',
      };
    }
  }

  // ── 3. Add-to-cart command ────────────────────────────────────────────────
  const addTrigger = /\b(add|buy|take|get|i('ll| will) take|i want)\b/;
  const cartTarget = /\b(cart|bag|it|this|dress|knit|scarf|coat|tote|blazer|cardigan|skirt)\b/;
  if (addTrigger.test(q) && cartTarget.test(q)) {
    let target = findProductByQuery(q);
    if (!target && ctx.activeProductId) target = products.find(p => p.id === ctx.activeProductId);
    if (!target && ctx.recentProductIds.length > 0) target = products.find(p => p.id === ctx.recentProductIds[0]);

    if (target) {
      const sizeFound  = target.sizes.find(s => q.includes(s.toLowerCase()) || q.includes(`size ${s.toLowerCase()}`));
      const colorFound = target.colors.find(c => q.toLowerCase().includes(c.name.toLowerCase()));

      if (sizeFound || colorFound) {
        const size  = sizeFound || target.sizes[0];
        const color = colorFound ? colorFound.name : target.colors[0].name;

        const newCartItems = [...currentCartItems];
        const existingIdx = newCartItems.findIndex(
          i => i.product.id === target!.id && i.selectedSize === size && i.selectedColor === color
        );
        if (existingIdx >= 0) {
          newCartItems[existingIdx] = { ...newCartItems[existingIdx], quantity: newCartItems[existingIdx].quantity + 1 };
        } else {
          newCartItems.push({ product: target, selectedSize: size, selectedColor: color, quantity: 1 });
        }
        const total = newCartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

        return {
          text: `I've added the ${target.name} (${size}, ${color}) to your bag.`,
          components: [{ type: 'cart_summary', items: newCartItems, total, justAddedId: target.id }],
          suggestedFollowUps: ['View full cart', 'Continue shopping', 'Add another piece'],
          contextUpdate: { pendingAddProductId: null, activeProductId: target.id },
          addToCart: { product: target, size, color },
          intent: 'cart-confirmation',
        };
      }

      // Need size/colour
      return {
        text: `I'd love to add the ${target.name} to your bag. Which size and colour would you like?`,
        suggestedFollowUps: target.sizes.slice(0, 2).flatMap(sz =>
          target!.colors.slice(0, 2).map(c => `Size ${sz} in ${c.name}`)
        ).slice(0, 4),
        contextUpdate: { pendingAddProductId: target.id, activeProductId: target.id },
        intent: 'add-to-bag',
      };
    }
  }

  // ── 4. Comparison request ─────────────────────────────────────────────────
  if (/\b(compare|comparison|versus|vs\.?|difference|between|which one)\b/.test(q)) {
    const mentioned = findAllProductsByQuery(q);
    let compareProds: Product[] = mentioned.slice(0, 2);

    // Fallback: use recent products
    if (compareProds.length < 2 && ctx.recentProductIds.length >= 2) {
      const recent = ctx.recentProductIds.slice(0, 2)
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p));
      for (const p of recent) {
        if (!compareProds.find(x => x.id === p.id)) compareProds.push(p);
      }
      compareProds = compareProds.slice(0, 2);
    }

    // Fallback: active + first recent
    if (compareProds.length < 2 && ctx.activeProductId && ctx.recentProductIds.length > 0) {
      const active = products.find(p => p.id === ctx.activeProductId);
      const other  = products.find(p => ctx.recentProductIds.includes(p.id) && p.id !== ctx.activeProductId);
      if (active && other) compareProds = [active, other];
    }

    if (compareProds.length >= 2) {
      return {
        text: `Here's a side-by-side comparison to help you decide:`,
        components: [{ type: 'comparison_table', products: compareProds.slice(0, 3) }],
        suggestedFollowUps: [
          `Add the ${compareProds[0].name} to cart`,
          `Add the ${compareProds[1].name} to cart`,
          'Show me more options',
        ],
        contextUpdate: { recentProductIds: compareProds.map(p => p.id) },
        intent: 'product-details',
      };
    }
  }

  // ── 5. Product detail request ─────────────────────────────────────────────
  const detailTrigger = /\b(tell me|more about|details?|describe|what is|about the|show me the|tell me about)\b/;
  if (detailTrigger.test(q) || (q.match(/\b(this|it)\b/) && ctx.activeProductId)) {
    let detail = findProductByQuery(q);
    if (!detail && ctx.activeProductId) detail = products.find(p => p.id === ctx.activeProductId);

    if (detail) {
      const otherRecent = ctx.recentProductIds.find(id => id !== detail!.id);
      const otherProduct = otherRecent ? products.find(p => p.id === otherRecent) : null;

      return {
        text: `${detail.name} — ${detail.description}`,
        components: [{
          type: 'product_detail',
          product: detail,
          highlight: ctx.intent === 'gift' && ctx.recipient
            ? `A beautiful gift for ${ctx.recipient}`
            : undefined,
        }],
        suggestedFollowUps: [
          `Add to cart`,
          otherProduct ? `Compare with the ${otherProduct.name}` : null,
          'What colours are available?',
        ].filter((s): s is string => Boolean(s)),
        contextUpdate: { activeProductId: detail.id },
        intent: 'product-details',
      };
    }
  }

  // ── 6. Gift refinement (intent already set, now receiving budget/style) ───
  if (ctx.intent === 'gift') {
    const budgetMatch = q.match(/\b(\d{2,4})\b/);
    const extractedBudget = budgetMatch ? parseInt(budgetMatch[1]) : null;
    const budget = extractedBudget || ctx.budget;

    const isElegant = q.includes('elegant') || q.includes('classic') || q.includes('chic') ||
      q.includes('sophisticated') || q.includes('refined') || ctx.styles.includes('elegant');
    const isCasual  = q.includes('casual') || q.includes('relaxed') || q.includes('everyday') ||
      ctx.styles.includes('casual');

    const colorMentioned =
      q.includes('black') ? 'black' :
      q.includes('ivory') ? 'ivory' :
      q.includes('white') ? 'white' :
      q.includes('beige') || q.includes('camel') ? 'camel' :
      q.includes('blush') || q.includes('pink') ? 'blush' :
      ctx.colors[0] || null;

    // Any refinement info → show carousel
    if (budget || isElegant || isCasual || colorMentioned || ctx.budget || ctx.styles.length > 0) {
      const effectiveBudget = budget || ctx.budget;
      const styles = isElegant ? ['elegant'] : isCasual ? ['casual'] : ctx.styles;
      const colors = colorMentioned ? [colorMentioned] : ctx.colors;

      let giftProducts = products.filter(p => p.gender !== 'men');

      if (effectiveBudget) {
        giftProducts = giftProducts.filter(p => p.price <= effectiveBudget);
      }

      if (colors.length > 0) {
        const withColor = giftProducts.filter(p =>
          p.colors.some(c => colors.some(col => c.name.toLowerCase().includes(col)))
        );
        if (withColor.length >= 2) giftProducts = withColor;
      }

      if (isElegant || styles.includes('elegant')) {
        const priority: Record<string, number> = {
          dresses: 0, bags: 1, accessories: 2, knitwear: 3,
          outerwear: 4, shirts: 5, trousers: 6, shoes: 7,
        };
        giftProducts.sort((a, b) => (priority[a.category] ?? 9) - (priority[b.category] ?? 9));
      } else {
        // Sort by bestseller / new arrival for casual
        giftProducts.sort((a, b) => {
          const aScore = (a.tags.includes('bestseller') ? 2 : 0) + (a.tags.includes('new-arrival') ? 1 : 0);
          const bScore = (b.tags.includes('bestseller') ? 2 : 0) + (b.tags.includes('new-arrival') ? 1 : 0);
          return bScore - aScore;
        });
      }

      giftProducts = giftProducts.slice(0, 4);

      const budgetLabel = effectiveBudget ? ` · Under €${effectiveBudget}` : '';
      const genderLabel =
        ctx.recipient?.includes('husband') || ctx.recipient?.includes('boyfriend')
          ? 'Him' : 'Her';

      return {
        text: `Here are some pieces she would truly treasure — each one a considered, lasting gift.`,
        components: [{
          type: 'product_carousel',
          headline: `Curated For ${genderLabel}${budgetLabel}`,
          products: giftProducts,
        }],
        suggestedFollowUps: giftProducts.length > 0 ? [
          `Tell me about the ${giftProducts[0].name}`,
          giftProducts.length > 1
            ? `Compare the ${giftProducts[0].name} with the ${giftProducts[1].name}`
            : 'Show me more options',
          'She loves the colour black',
        ] : ['Show me all gift options', 'Increase my budget'],
        contextUpdate: {
          budget: effectiveBudget,
          styles,
          colors,
          recentProductIds: giftProducts.map(p => p.id),
        },
        intent: 'product-search',
      };
    }

    // Have gift intent but no refinement yet
    const recipient = ctx.recipient ? `for ${ctx.recipient}` : 'for her';
    return {
      text: `I'd love to help you choose something truly special ${recipient}. Could you tell me a little about her style — classic and elegant, or more casual and relaxed? And do you have a budget in mind?`,
      suggestedFollowUps: [
        'Around €200–300',
        'Around €300–400',
        'She loves classic and elegant styles',
        'She prefers casual, everyday pieces',
      ],
      intent: 'general',
    };
  }

  // ── 7. Gift intent initiation ─────────────────────────────────────────────
  const giftTrigger = /\b(gift|present|for my|partner|wife|husband|girlfriend|boyfriend|sister|mother|mum|mom|friend)\b/;
  if (giftTrigger.test(q) || q.includes('someone special')) {
    let recipient: string | null = null;
    if (q.includes('wife'))       recipient = 'your wife';
    else if (q.includes('husband'))    recipient = 'your husband';
    else if (q.includes('girlfriend')) recipient = 'your girlfriend';
    else if (q.includes('boyfriend'))  recipient = 'your boyfriend';
    else if (q.includes('partner'))    recipient = 'your partner';
    else if (q.includes('sister'))     recipient = 'your sister';
    else if (q.includes('mother') || q.includes('mum') || q.includes('mom')) recipient = 'your mother';
    else if (q.includes('friend'))     recipient = 'a friend';

    const forWhom = recipient ? ` for ${recipient}` : '';

    return {
      text: `How wonderful — I'd love to help you find the perfect gift${forWhom}. Do you have a budget in mind, and what's her sense of style — classic and elegant, or more casual and relaxed?`,
      suggestedFollowUps: [
        'Around €200–300',
        'Around €300–400',
        'She loves classic and elegant styles',
        'She prefers casual, everyday pieces',
      ],
      contextUpdate: { intent: 'gift', recipient },
      intent: 'gift-intent',
    };
  }

  // ── 8. Greeting ───────────────────────────────────────────────────────────
  if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
    return {
      text: "Hello! I'm NOIR, your personal style assistant. How can I help you discover something beautiful today?",
      intent: 'greeting',
    };
  }

  // ── 9. Budget filter ──────────────────────────────────────────────────────
  const budgetMatch = q.match(/under\s*[€$£]?\s*(\d+)/i) ||
    q.match(/less than\s*[€$£]?\s*(\d+)/i) ||
    q.match(/below\s*[€$£]?\s*(\d+)/i);
  if (budgetMatch) {
    const max = parseInt(budgetMatch[1]);
    const found = getProductsUnderPrice(max).slice(0, 4);
    return {
      text: `Here are some beautiful pieces under €${max} — each one a considered choice for any wardrobe.`,
      products: found,
      suggestedFollowUps: found.length > 0 ? [`Tell me about the ${found[0].name}`, 'Show more under that price', 'Show new arrivals'] : undefined,
      intent: 'budget-filter',
    };
  }

  // ── 10. New arrivals ──────────────────────────────────────────────────────
  if (q.includes('new arrival') || q.includes('new in') || q.includes('latest') || q.includes('just in')) {
    const found = getNewArrivals().slice(0, 4);
    return {
      text: "Our latest arrivals — pieces that define the direction of the new season.",
      products: found,
      intent: 'new-arrivals',
    };
  }

  // ── 11. Outfit building ───────────────────────────────────────────────────
  if (q.includes('outfit') || q.includes('look') || q.includes('styling') || q.includes('wear with') || q.includes('pair with') || q.includes('wedding') || q.includes('event')) {
    let occasion = 'a refined occasion';
    if (q.includes('wedding')) occasion = 'a wedding';
    else if (q.includes('dinner') || q.includes('evening')) occasion = 'an evening dinner';
    else if (q.includes('work') || q.includes('office')) occasion = 'the office';
    else if (q.includes('casual') || q.includes('weekend')) occasion = 'a relaxed weekend';

    const dress = products.find(p => p.category === 'dresses') || products[1];
    const coat  = products.find(p => p.category === 'outerwear' && p.gender !== 'men') || products[8];
    const bag   = products.find(p => p.category === 'bags') || products[3];
    const shoes = products.find(p => p.category === 'shoes') || products[5];

    return {
      text: `For ${occasion}, I'd suggest building around a key statement piece. Here's a complete look.`,
      products: [dress, coat, bag, shoes],
      intent: 'outfit-building',
    };
  }

  // ── 12. Size help ─────────────────────────────────────────────────────────
  if (q.includes('size') || q.includes('sizing') || q.includes('fit') || q.includes('measurements')) {
    return {
      text: "Our pieces are sized XS (UK 6–8), S (UK 8–10), M (UK 10–12), L (UK 12–14), XL (UK 14–16). For outerwear and knitwear, size up if between sizes. Which piece are you sizing for?",
      intent: 'size-help',
    };
  }

  // ── 13. Category searches ─────────────────────────────────────────────────
  if (q.includes('dress') || q.includes('skirt')) {
    const found = products.filter(p => p.category === 'dresses').slice(0, 3);
    return {
      text: "Our current selection of dresses and skirts — each designed with careful consideration of fabric and silhouette.",
      products: found,
      suggestedFollowUps: found.length > 0 ? [`Tell me about the ${found[0].name}`, 'Add to cart', 'Show me something else'] : undefined,
      intent: 'product-search',
    };
  }
  if (q.includes('coat') || q.includes('blazer') || q.includes('jacket') || q.includes('outerwear')) {
    const found = products.filter(p => p.category === 'outerwear').slice(0, 3);
    return { text: "Our outerwear collection — investment pieces designed to carry you through seasons and years.", products: found, intent: 'product-search' };
  }
  if (q.includes('knit') || q.includes('sweater') || q.includes('cashmere') || q.includes('cardigan') || q.includes('merino')) {
    const found = products.filter(p => p.category === 'knitwear').slice(0, 4);
    return { text: "Our knitwear studio — crafted from the finest natural fibres for enduring warmth and elegance.", products: found, intent: 'product-search' };
  }
  if (q.includes('bag') || q.includes('tote') || q.includes('handbag') || q.includes('purse')) {
    const found = products.filter(p => p.category === 'bags').slice(0, 3);
    return { text: "Our bag collection — refined shapes in quality leathers that age beautifully.", products: found, intent: 'product-search' };
  }
  if (q.includes('shoe') || q.includes('sneaker') || q.includes('loafer') || q.includes('boot') || q.includes('heel')) {
    const found = products.filter(p => p.category === 'shoes').slice(0, 3);
    return { text: "A selection of footwear that completes any look with quiet distinction.", products: found, intent: 'product-search' };
  }
  if (q.includes('accessories') || q.includes('scarf') || q.includes('hat') || q.includes('belt') || q.includes('jewel')) {
    const found = products.filter(p => p.category === 'accessories').slice(0, 4);
    return { text: "The details that complete a look — refined accessories made with care.", products: found, intent: 'product-search' };
  }
  if (q.includes('trouser') || q.includes('pant') || q.includes('bottom')) {
    const found = products.filter(p => p.category === 'trousers').slice(0, 3);
    return { text: "Our trouser edit — precise cuts in beautiful fabrics that move well and hold their shape.", products: found, intent: 'product-search' };
  }

  // ── 14. Default: bestsellers ──────────────────────────────────────────────
  const recommended = products.filter(p => p.tags.includes('bestseller')).slice(0, 4);
  return {
    text: "Here are some of our most beloved pieces — a considered selection that represents ATELIER NOIR at its best.",
    products: recommended,
    intent: 'general',
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  navigate: (page: Page, productId?: string, category?: Category) => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQty: (productId: string, size: string, color: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  toggleAssistant: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  sendMessage: (content: string, attachments?: MessageAttachment[]) => void;
  cartCount: number;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

let msgIdCounter = 0;
const newId = () => `msg-${++msgIdCounter}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useCallback((page: Page, productId?: string, category?: Category) => {
    dispatch({ type: 'NAVIGATE', page, productId, category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', item: { product, quantity, selectedSize: size, selectedColor: color } });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId, size, color });
  }, []);

  const updateCartQty = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', productId, size, color });
    } else {
      dispatch({ type: 'UPDATE_CART_QTY', productId, size, color, quantity });
    }
  }, []);

  const toggleWishlist  = useCallback((productId: string) => dispatch({ type: 'TOGGLE_WISHLIST', productId }), []);
  const toggleAssistant = useCallback(() => dispatch({ type: 'TOGGLE_ASSISTANT' }), []);
  const openAssistant   = useCallback(() => dispatch({ type: 'OPEN_ASSISTANT' }), []);
  const closeAssistant  = useCallback(() => dispatch({ type: 'CLOSE_ASSISTANT' }), []);
  const toggleCart      = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const closeCart       = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const sendMessage = useCallback(
    (content: string, attachments?: MessageAttachment[]) => {
      const userMsg: ChatMessage = {
        id: newId(),
        role: 'user',
        content,
        attachments,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', message: userMsg });

      // Capture context snapshot at call time (not in timeout)
      const ctx         = state.conversationContext;
      const cartItems   = state.cartItems;
      const currentProd = state.currentProductId;

      setTimeout(() => {
        const result = buildSmartResponse(content, currentProd, attachments, ctx, cartItems);

        // Dispatch cart action if needed
        if (result.addToCart) {
          dispatch({
            type: 'ADD_TO_CART',
            item: {
              product: result.addToCart.product,
              selectedSize: result.addToCart.size,
              selectedColor: result.addToCart.color,
              quantity: 1,
            },
          });
        }

        // Update conversation context
        const updatedContext: ConversationContext = {
          ...ctx,
          ...(result.contextUpdate || {}),
          turnCount: ctx.turnCount + 1,
        };
        dispatch({ type: 'UPDATE_CONTEXT', context: updatedContext });

        const assistantMsg: ChatMessage = {
          id: newId(),
          role: 'assistant',
          content: result.text,
          products: result.products,
          components: result.components,
          suggestedFollowUps: result.suggestedFollowUps,
          timestamp: new Date(),
          intent: result.intent,
        };
        dispatch({ type: 'ADD_MESSAGE', message: assistantMsg });
      }, 800 + Math.random() * 400);
    },
    [state.currentProductId, state.conversationContext, state.cartItems]
  );

  const cartCount = state.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        state,
        navigate,
        addToCart,
        removeFromCart,
        updateCartQty,
        toggleWishlist,
        toggleAssistant,
        openAssistant,
        closeAssistant,
        toggleCart,
        closeCart,
        sendMessage,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
