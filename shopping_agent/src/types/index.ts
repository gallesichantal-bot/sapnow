export type Category =
  | 'women' | 'men' | 'new-arrivals' | 'dresses' | 'knitwear'
  | 'outerwear' | 'shirts' | 'trousers' | 'shoes' | 'bags' | 'accessories';

export type ProductTag = 'new-arrival' | 'bestseller' | 'sustainable' | 'limited-edition' | 'sale';

export interface Product {
  id: string;
  name: string;
  category: Category;
  gender: 'women' | 'men' | 'unisex';
  price: number;
  previousPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  longDescription: string;
  material: string;
  fit: string;
  care: string;
  tags: ProductTag[];
  available: boolean;
  collections?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Customer {
  id: string;
  name: string;
  firstName: string;
  email: string;
  memberStatus: 'Silver' | 'Gold' | 'Platinum';
  storeCredit: number;
  orders: Order[];
  wishlistIds: string[];
  recommendations: string[];
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'returned';
  items: { productId: string; name: string; price: number; quantity: number; size: string; color: string }[];
  total: number;
  trackingNumber?: string;
}

export type AssistantIntent =
  | 'greeting'
  | 'product-search'
  | 'outfit-building'
  | 'budget-filter'
  | 'new-arrivals'
  | 'size-help'
  | 'add-to-bag'
  | 'product-details'
  | 'image-analysis'
  | 'video-analysis'
  | 'voice-input'
  | 'gift-intent'
  | 'cart-confirmation'
  | 'general';

export type AttachmentType = 'image' | 'audio' | 'video';

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  name?: string;
  mimeType?: string;
  thumbnailUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  components?: ChatComponent[];
  suggestedFollowUps?: string[];
  attachments?: MessageAttachment[];
  timestamp: Date;
  intent?: AssistantIntent;
}

export type Page =
  | 'home'
  | 'dashboard'
  | 'catalog'
  | 'product-detail'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'checkout-confirmation';

export interface ConversationContext {
  intent: 'gift' | 'self' | 'outfit' | null;
  recipient: string | null;
  budget: number | null;
  styles: string[];
  colors: string[];
  occasion: string | null;
  activeProductId: string | null;
  recentProductIds: string[];
  pendingAddProductId: string | null;
  turnCount: number;
}

export type ChatComponent =
  | { type: 'product_carousel'; headline: string; products: Product[] }
  | { type: 'product_detail'; product: Product; highlight?: string }
  | { type: 'comparison_table'; products: Product[] }
  | { type: 'cart_summary'; items: CartItem[]; total: number; justAddedId?: string };

export interface AppState {
  currentPage: Page;
  currentProductId: string | null;
  currentCategory: Category | null;
  cartItems: CartItem[];
  wishlistIds: string[];
  assistantOpen: boolean;
  cartOpen: boolean;
  chatMessages: ChatMessage[];
  searchQuery: string;
}
