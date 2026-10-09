import { Customer } from '../types';

export const customer: Customer = {
  id: 'c001',
  name: 'Olivia Marchetti',
  firstName: 'Olivia',
  email: 'olivia.marchetti@email.com',
  memberStatus: 'Gold',
  storeCredit: 240,
  orders: [
    {
      id: 'ORD-8821',
      date: '2024-09-08',
      status: 'shipped',
      items: [
        { productId: 'p001', name: 'The Tailored Wool Blazer', price: 390, quantity: 1, size: 'S', color: 'Black' },
      ],
      total: 390,
      trackingNumber: 'DHL-4921823',
    },
    {
      id: 'ORD-8764',
      date: '2024-08-22',
      status: 'delivered',
      items: [
        { productId: 'p007', name: 'Ribbed Merino Cardigan', price: 160, quantity: 1, size: 'S', color: 'Cream' },
        { productId: 'p016', name: 'Cashmere Scarf', price: 130, quantity: 1, size: 'One Size', color: 'Camel' },
      ],
      total: 290,
    },
  ],
  wishlistIds: ['p002', 'p004', 'p009', 'p011', 'p016', 'p018'],
  recommendations: ['p003', 'p005', 'p008', 'p011', 'p017', 'p019', 'p020', 'p006'],
};

export const activityFeed = [
  {
    id: 'a1',
    type: 'order',
    message: 'Your Tailored Wool Blazer has been shipped',
    detail: 'Estimated delivery: 2–3 business days',
    time: '2 hours ago',
    productId: 'p001',
  },
  {
    id: 'a2',
    type: 'restock',
    message: 'Double-Breasted Coat is back in your size',
    detail: 'Limited stock remaining',
    time: '1 day ago',
    productId: 'p009',
  },
  {
    id: 'a3',
    type: 'wishlist',
    message: 'Silk Draped Dress added to wishlist',
    detail: '',
    time: '3 days ago',
    productId: 'p002',
  },
  {
    id: 'a4',
    type: 'recommendation',
    message: 'Selected for you: Oversized Cashmere Knit',
    detail: 'Based on your recent purchases',
    time: '4 days ago',
    productId: 'p003',
  },
];
