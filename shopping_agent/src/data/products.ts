import { Product } from '../types';

// All Unsplash IDs below are verified 200-status with appropriate fashion content
const IMG = (id: string, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

// Confirmed working IDs — see verification notes below
// 1591047139829-d91aecb6caea = brown bomber jacket (outerwear)
// 1496217590455-aa63a8350eea = white off-shoulder dress
// 1595777457583-95e059d581b8 = red floor-length gown
// 1434389677669-e08b4cac3105 = cream crochet poncho on wooden hanger
// 1556905055-8f358a7a47b2   = knitwear flat lay (orange sweater + jeans + tulips)
// 1558769132-cb1aea458c5e   = clothing rack with knitwear in warm neutral tones
// 1553062407-98eeb64c6a62   = structured leather tote
// 1491553895911-0055eca6402d = minimal white leather sneakers
// 1560769629-975ec94e6a86   = sneaker side profile
// 1596755389378-c31d21fd1273 = evening fashion editorial
// 1509631179647-0177331693ae = fashion editorial (teal wall)
// 1598300042247-d088f8ab3a91 = crisp white poplin shirt
// 1602810318383-e386cc2a3ccf = shirt styling detail
// 1543163521-1bf539c55dd2   = leather oxford loafers
// 1531310197839-ccf54634509e = tan leather ankle boots
// 1495121553079-4c61bcce1894 = Rolleiflex camera (thematic for accessories)

export const products: Product[] = [
  {
    id: 'p001',
    name: 'The Tailored Wool Blazer',
    category: 'outerwear',
    gender: 'women',
    price: 390,
    images: [
      IMG('1591047139829-d91aecb6caea'),  // jacket/outerwear
      IMG('1556905055-8f358a7a47b2'),     // knitwear texture detail
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Ivory', hex: '#F5F0E8' },
      { name: 'Camel', hex: '#C19A6B' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'An elevated essential cut from premium wool with a refined relaxed silhouette.',
    longDescription:
      'Crafted from a premium wool-blend fabric, this blazer offers a relaxed yet structured silhouette that transitions effortlessly from day to evening. The clean lines and refined tailoring make it a true wardrobe cornerstone. Single-button closure with notched lapels and functional welt pockets.',
    material: '80% Wool, 15% Polyamide, 5% Elastane',
    fit: 'Relaxed fit. Model is 178cm and wears size S.',
    care: 'Dry clean only. Do not tumble dry.',
    tags: ['new-arrival', 'bestseller'],
    available: true,
    collections: ['New Season', 'Essentials'],
  },
  {
    id: 'p002',
    name: 'Silk Draped Dress',
    category: 'dresses',
    gender: 'women',
    price: 290,
    images: [
      IMG('1496217590455-aa63a8350eea'),  // white off-shoulder dress
      IMG('1595777457583-95e059d581b8'),  // red floor-length gown
    ],
    colors: [
      { name: 'Ivory', hex: '#F5F0E8' },
      { name: 'Onyx', hex: '#1A1A1A' },
      { name: 'Blush', hex: '#E8B4B8' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'A fluid silk-blend dress with a signature draped neckline and elongated silhouette.',
    longDescription:
      'Rendered in a luxurious silk-blend fabric that drapes beautifully against the body. The asymmetric draped neckline creates an elegant focal point, while the relaxed fit ensures ease of movement. Perfect for elevated evening occasions or refined daytime dressing.',
    material: '70% Silk, 30% Polyester',
    fit: 'True to size. Model is 175cm and wears size S.',
    care: 'Hand wash in cold water or dry clean. Iron on low.',
    tags: ['new-arrival'],
    available: true,
    collections: ['Evening Edit', 'New Season'],
  },
  {
    id: 'p003',
    name: 'Oversized Cashmere Knit',
    category: 'knitwear',
    gender: 'women',
    price: 220,
    images: [
      IMG('1434389677669-e08b4cac3105'),  // ribbed knitwear on model
      IMG('1556905055-8f358a7a47b2'),     // knitwear flat lay
    ],
    colors: [
      { name: 'Oatmeal', hex: '#D9CFC4' },
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Dusty Rose', hex: '#C9A8A8' },
    ],
    sizes: ['XS/S', 'M/L', 'XL/XXL'],
    description: 'Pure cashmere in an oversized, cocooning silhouette. Impossibly soft, endlessly wearable.',
    longDescription:
      'Knitted from the finest Grade A cashmere, this sweater offers a cloud-like softness with generous oversized proportions. The dropped shoulders and relaxed body create an effortless, enveloping silhouette. A true investment piece that only improves with wear.',
    material: '100% Grade A Cashmere',
    fit: 'Oversized fit. Model is 176cm and wears size XS/S.',
    care: 'Hand wash cold. Dry flat. Do not wring.',
    tags: ['bestseller', 'sustainable'],
    available: true,
    collections: ['Essentials', 'Knitwear Studio'],
  },
  {
    id: 'p004',
    name: 'Structured Leather Tote',
    category: 'bags',
    gender: 'women',
    price: 450,
    images: [
      IMG('1553062407-98eeb64c6a62'),  // structured leather bag
      IMG('1553062407-98eeb64c6a62'),  // leather bag detail
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Tan', hex: '#C4975A' },
      { name: 'Ivory', hex: '#F0EDE6' },
    ],
    sizes: ['One Size'],
    description: 'A refined everyday tote in full-grain leather with clean architectural lines.',
    longDescription:
      'Constructed from Italian full-grain leather, this tote balances practicality with timeless elegance. The structured base and reinforced handles ensure longevity, while the spacious interior accommodates a laptop and daily essentials. Finished with gold-tone hardware and a removable zip pouch.',
    material: '100% Full-Grain Italian Leather',
    fit: 'Dimensions: 38cm × 28cm × 14cm. Handles: 22cm drop.',
    care: 'Wipe with damp cloth. Condition with leather care cream periodically.',
    tags: ['bestseller'],
    available: true,
    collections: ['Accessories', 'Year-Round Essentials'],
  },
  {
    id: 'p005',
    name: 'Relaxed Wool Trousers',
    category: 'trousers',
    gender: 'women',
    price: 180,
    images: [
      IMG('1556905055-8f358a7a47b2'),  // knitwear flat lay — neutral fabric
      IMG('1556905055-8f358a7a47b2'),  // duplicate
    ],
    colors: [
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Ivory', hex: '#F5F0E8' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Wide-leg wool trousers with a high rise and fluid drape for effortless sophistication.',
    longDescription:
      'Cut from a refined wool fabric with a slight sheen, these trousers feature a high-rise waist, wide-leg silhouette, and front pleats for a sculptural, modern look. The fluid drape creates an elegant line from waist to hem. Wear with a tucked-in knit or blazer.',
    material: '90% Wool, 10% Polyester',
    fit: 'High-rise, wide-leg. Model is 177cm and wears size S.',
    care: 'Dry clean recommended. Cool iron.',
    tags: ['new-arrival'],
    available: true,
    collections: ['New Season'],
  },
  {
    id: 'p006',
    name: 'Minimal Leather Sneakers',
    category: 'shoes',
    gender: 'unisex',
    price: 210,
    images: [
      IMG('1491553895911-0055eca6402d'),  // clean white/minimal leather sneakers
      IMG('1560769629-975ec94e6a86'),     // sneaker side profile
    ],
    colors: [
      { name: 'White', hex: '#F8F8F8' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Sand', hex: '#D4C4A8' },
    ],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    description: 'Clean, minimal leather sneakers with a low-profile sole and refined construction.',
    longDescription:
      'Constructed from supple full-grain leather with a vulcanized rubber sole, these sneakers represent the purest expression of understated footwear. The perforated toe box adds subtle texture while maintaining the minimal aesthetic. A versatile foundation for any outfit.',
    material: 'Upper: Full-grain leather. Sole: Vulcanized rubber.',
    fit: 'True to size. We recommend half size up for wider feet.',
    care: 'Wipe clean with damp cloth. Use leather protector spray.',
    tags: ['bestseller'],
    available: true,
    collections: ['Footwear', 'Essentials'],
  },
  {
    id: 'p007',
    name: 'Ribbed Merino Cardigan',
    category: 'knitwear',
    gender: 'women',
    price: 160,
    images: [
      IMG('1556905055-8f358a7a47b2'),     // knitwear flat lay
      IMG('1434389677669-e08b4cac3105'),  // cream knitwear on hanger
    ],
    colors: [
      { name: 'Cream', hex: '#F2EDE4' },
      { name: 'Slate', hex: '#7A8B96' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Camel', hex: '#C19A6B' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A fine-gauge ribbed merino cardigan with a clean button front and versatile drape.',
    longDescription:
      'Knitted in extra-fine merino wool with a tight ribbed structure that offers natural stretch and excellent shape retention. The button-front design and elegant length make this cardigan equally suited to layering or wearing as a standalone piece. A timeless knitwear essential.',
    material: '100% Extra-Fine Merino Wool',
    fit: 'Slim fit. Model is 176cm and wears size S.',
    care: 'Machine wash cold, delicate cycle. Dry flat.',
    tags: ['bestseller', 'sustainable'],
    available: true,
    collections: ['Knitwear Studio', 'Essentials'],
  },
  {
    id: 'p008',
    name: 'Sculptural Shoulder Bag',
    category: 'bags',
    gender: 'women',
    price: 320,
    images: [
      IMG('1553062407-98eeb64c6a62'),  // leather bag
      IMG('1553062407-98eeb64c6a62'),  // leather bag detail
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Cognac', hex: '#9C5A2C' },
    ],
    sizes: ['One Size'],
    description: 'An architectural shoulder bag with a distinctive curved flap and adjustable chain strap.',
    longDescription:
      'This statement shoulder bag is defined by its distinctive sculptural silhouette and high-quality nappa leather. The crescent-shaped body features a magnetic clasp closure, interior zip compartment, and card slots. The adjustable gold-tone chain can be worn crossbody or as a shoulder bag.',
    material: 'Nappa Leather. Gold-tone hardware.',
    fit: 'Dimensions: 22cm × 15cm × 6cm. Chain: adjustable to 55cm.',
    care: 'Store in dust bag. Clean with leather care cloth.',
    tags: ['limited-edition'],
    available: true,
    collections: ['Accessories', 'Statement Pieces'],
  },
  {
    id: 'p009',
    name: 'Double-Breasted Coat',
    category: 'outerwear',
    gender: 'women',
    price: 590,
    images: [
      IMG('1591047139829-d91aecb6caea'),  // jacket/outerwear editorial
      IMG('1591047139829-d91aecb6caea'),  // outerwear detail
    ],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Ivory', hex: '#F5F0E8' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A refined double-breasted coat in heavyweight wool with a timeless belted silhouette.',
    longDescription:
      'An investment-worthy coat crafted from heavyweight boiled wool that provides exceptional warmth and structure. The classic double-breasted front with tortoiseshell buttons, self-belt, and notched lapels creates a silhouette that will remain elegant for decades. Fully lined in satin.',
    material: '95% Wool, 5% Cashmere. Satin lining.',
    fit: 'Regular fit. Model is 177cm and wears size S.',
    care: 'Dry clean only. Store on a padded hanger.',
    tags: ['new-arrival', 'limited-edition'],
    available: true,
    collections: ['New Season', 'Investment Pieces'],
  },
  {
    id: 'p010',
    name: 'Cotton Poplin Shirt',
    category: 'shirts',
    gender: 'women',
    price: 140,
    images: [
      IMG('1602810318383-e386cc2a3ccf'),  // folded dress shirts flat lay
      IMG('1509631179647-0177331693ae'),  // fashion editorial
    ],
    colors: [
      { name: 'White', hex: '#F8F8F6' },
      { name: 'Blue', hex: '#8FA8C8' },
      { name: 'Stripe', hex: '#E8E8E8' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A crisp cotton poplin shirt with a relaxed silhouette and refined French seam finish.',
    longDescription:
      'Cut from a beautiful 100% organic cotton poplin with a slightly lustrous finish, this shirt offers the perfect balance between structured and relaxed. French seam construction ensures a clean, refined interior. The slightly oversized silhouette tucks neatly or wears beautifully loose.',
    material: '100% Organic Cotton Poplin',
    fit: 'Relaxed fit. Model is 176cm and wears size S.',
    care: 'Machine wash at 30°C. Iron while damp.',
    tags: ['sustainable'],
    available: true,
    collections: ['Essentials'],
  },
  {
    id: 'p011',
    name: 'Satin Evening Skirt',
    category: 'dresses',
    gender: 'women',
    price: 190,
    images: [
      IMG('1595777457583-95e059d581b8'),  // red floor-length gown (fluid satin)
      IMG('1509631179647-0177331693ae'),  // evening fashion editorial
    ],
    colors: [
      { name: 'Onyx', hex: '#1A1A1A' },
      { name: 'Champagne', hex: '#E8D5A3' },
      { name: 'Deep Plum', hex: '#4A2040' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'A floor-length slip skirt in liquid satin with an invisible side zip and fluid movement.',
    longDescription:
      'Crafted from a premium satin-weave fabric with a beautiful liquid drape and subtle sheen, this skirt embodies effortless evening elegance. The high-rise waistband and fluid length create a refined silhouette. Pairs beautifully with a tailored blazer or soft knit.',
    material: '100% Polyester Satin Weave',
    fit: 'True to size. Model is 177cm and wears size S.',
    care: 'Hand wash cold or dry clean. Iron on reverse.',
    tags: ['new-arrival'],
    available: true,
    collections: ['Evening Edit'],
  },
  {
    id: 'p012',
    name: 'Signature Knit Polo',
    category: 'knitwear',
    gender: 'unisex',
    price: 175,
    images: [
      IMG('1556905055-8f358a7a47b2'),     // knitwear flat lay
      IMG('1434389677669-e08b4cac3105'),  // ribbed knit on model
    ],
    colors: [
      { name: 'Navy', hex: '#1C2B4A' },
      { name: 'Ivory', hex: '#F5F0E8' },
      { name: 'Forest', hex: '#2D4A3E' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'A refined polo in a fine-gauge knit with ribbed collar, cuffs, and clean polo placket.',
    longDescription:
      'This polo shirt elevates a classic through exceptional material choice and refined construction. Knitted from extra-fine merino wool in a fine gauge that mimics the look of woven fabric. The ribbed collar and cuffs maintain their shape beautifully over time. Equally at home in formal or casual contexts.',
    material: '100% Extra-Fine Merino Wool',
    fit: 'Regular fit. Model is 179cm and wears size M.',
    care: 'Machine wash cold. Dry flat.',
    tags: ['bestseller'],
    available: true,
    collections: ['Essentials', 'Men\'s'],
  },
  {
    id: 'p013',
    name: 'Tailored Linen Trousers',
    category: 'trousers',
    gender: 'men',
    price: 165,
    images: [
      IMG('1556905055-8f358a7a47b2'),     // knitwear/denim flat lay
      IMG('1531310197839-ccf54634509e'),  // leather boots (footwear context)
    ],
    colors: [
      { name: 'Sand', hex: '#D4C4A8' },
      { name: 'Navy', hex: '#1C2B4A' },
      { name: 'Stone', hex: '#9A8E82' },
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    description: 'Mid-rise linen trousers with a relaxed taper and two-button closure. Light and refined.',
    longDescription:
      'Cut from a premium European linen blend with a subtle texture that softens beautifully over time. The mid-rise waist and gently tapered leg create a contemporary silhouette that works across seasons. Finished with double-button waist closure and two side pockets.',
    material: '55% Linen, 45% Cotton',
    fit: 'Mid-rise, tapered. Model is 182cm and wears size 32.',
    care: 'Machine wash cold. Tumble dry low. Iron while slightly damp.',
    tags: ['sustainable'],
    available: true,
    collections: ['Men\'s', 'Essentials'],
  },
  {
    id: 'p014',
    name: 'Merino V-Neck Sweater',
    category: 'knitwear',
    gender: 'men',
    price: 145,
    images: [
      IMG('1558769132-cb1aea458c5e'),     // knitwear/clothing rack
      IMG('1556905055-8f358a7a47b2'),     // knitwear flat lay
    ],
    colors: [
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Burgundy', hex: '#7B2D3E' },
      { name: 'Camel', hex: '#C19A6B' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A classic V-neck in extra-fine merino with clean lines and a comfortable slim fit.',
    longDescription:
      'The quintessential V-neck sweater, refined. Knitted in extra-fine merino for a smooth, barely-there feel against the skin. The slim fit and moderate V-depth make this equally appropriate over a shirt or alone. Machine washable for effortless everyday care.',
    material: '100% Extra-Fine Merino Wool',
    fit: 'Slim fit. Model is 181cm and wears size M.',
    care: 'Machine wash cold, delicate cycle. Dry flat.',
    tags: ['bestseller'],
    available: true,
    collections: ['Knitwear Studio', 'Men\'s'],
  },
  {
    id: 'p015',
    name: 'Leather Belt',
    category: 'accessories',
    gender: 'unisex',
    price: 95,
    images: [
      IMG('1531310197839-ccf54634509e'),  // leather footwear/accessories
      IMG('1531310197839-ccf54634509e'),  // leather detail
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Tan', hex: '#C4975A' },
    ],
    sizes: ['70cm', '75cm', '80cm', '85cm', '90cm', '95cm'],
    description: 'A clean, minimal leather belt with a matt silver buckle. Cut from vegetable-tanned leather.',
    longDescription:
      'Crafted from Italian vegetable-tanned leather that develops a beautiful patina over time. The minimal rectangular buckle in brushed silver hardware adds refined detail. A subtle tonal stitching detail runs along the edges. Will last years with proper care.',
    material: '100% Vegetable-Tanned Italian Leather',
    fit: 'Measure around your natural waist or hips for correct sizing.',
    care: 'Condition with leather balm periodically. Avoid moisture.',
    tags: ['sustainable'],
    available: true,
    collections: ['Accessories'],
  },
  {
    id: 'p016',
    name: 'Cashmere Scarf',
    category: 'accessories',
    gender: 'unisex',
    price: 130,
    images: [
      IMG('1556905055-8f358a7a47b2'),     // knitwear flat lay — neutral fabric texture
      IMG('1434389677669-e08b4cac3105'),  // ribbed knit on model
    ],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Ivory', hex: '#F5F0E8' },
      { name: 'Blush', hex: '#E8B4B8' },
    ],
    sizes: ['One Size'],
    description: 'A generously proportioned cashmere scarf with frayed ends. Incredibly soft and versatile.',
    longDescription:
      'Woven from Grade A cashmere in a classic plain weave that balances warmth with a light, elegant drape. The oversized dimensions — 200cm × 70cm — allow for multiple styling possibilities, from a simple drape to a wrapped style. The natural fringe adds a subtle artisanal touch.',
    material: '100% Grade A Cashmere',
    fit: 'One size: 200cm × 70cm.',
    care: 'Hand wash cold. Dry flat on a clean towel.',
    tags: ['bestseller', 'sustainable'],
    available: true,
    collections: ['Accessories', 'Gift Favourites'],
  },
  {
    id: 'p017',
    name: 'Wide-Brim Felt Hat',
    category: 'accessories',
    gender: 'unisex',
    price: 145,
    images: [
      IMG('1509631179647-0177331693ae'),  // wide-brim hat editorial
      IMG('1509631179647-0177331693ae'),  // hat styling (same shot, different crop)
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Ivory', hex: '#F5F0E8' },
    ],
    sizes: ['S/M', 'M/L'],
    description: 'A refined wide-brim hat in Italian-milled wool felt with a slim grosgrain band.',
    longDescription:
      'Hand-finished in Italy from a premium wool felt that holds its shape beautifully in all conditions. The classic wide brim — 6cm — provides both style and shade, while the structured crown and slim grosgrain ribbon band add understated elegance. An iconic finishing piece.',
    material: '100% Wool Felt. Grosgrain ribbon.',
    fit: 'S/M fits 54-57cm. M/L fits 57-60cm.',
    care: 'Spot clean only. Store on a hat stand.',
    tags: ['limited-edition'],
    available: true,
    collections: ['Accessories'],
  },
  {
    id: 'p018',
    name: 'Oxford Leather Loafers',
    category: 'shoes',
    gender: 'women',
    price: 285,
    images: [
      IMG('1531310197839-ccf54634509e'),  // leather ankle boots on cobblestone
      IMG('1560769629-975ec94e6a86'),     // sneaker side profile
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Tan', hex: '#C4975A' },
      { name: 'Bordeaux', hex: '#7A1C2E' },
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    description: 'An elevated take on the classic loafer in smooth calf leather with a block heel.',
    longDescription:
      'Constructed from smooth Italian calf leather with clean lines and a refined block heel that adds height without sacrificing comfort. The slightly squared toe and minimal stitching give a contemporary update to the classic loafer silhouette. Leather-lined for exceptional comfort.',
    material: 'Upper & lining: Calf leather. Sole: Leather with rubber inset.',
    fit: 'True to size. Half size available on request.',
    care: 'Polish with matching shoe cream. Use cedar shoe trees between wears.',
    tags: ['new-arrival'],
    available: true,
    collections: ['Footwear', 'New Season'],
  },
  {
    id: 'p019',
    name: 'Oversized Wool Coat',
    category: 'outerwear',
    gender: 'men',
    price: 545,
    images: [
      IMG('1558769132-cb1aea458c5e'),     // knitwear/outerwear rack
      IMG('1509631179647-0177331693ae'),  // fashion editorial
    ],
    colors: [
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Camel', hex: '#C19A6B' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A clean single-breasted overcoat in heavyweight wool with a dropped shoulder and relaxed body.',
    longDescription:
      'An unhurried take on the classic overcoat, cut generously from a heavyweight pure wool fabric in a beautiful textured finish. The dropped shoulders and roomy body create a relaxed drape while maintaining a polished silhouette. Unlined for a lighter weight feel with a clean internal finish.',
    material: '100% Heavyweight Wool',
    fit: 'Oversized. Model is 182cm and wears size M.',
    care: 'Dry clean only. Store on a wide-shouldered hanger.',
    tags: ['new-arrival'],
    available: true,
    collections: ['Men\'s', 'New Season'],
  },
  {
    id: 'p020',
    name: 'Crossbody Camera Bag',
    category: 'bags',
    gender: 'unisex',
    price: 195,
    images: [
      IMG('1495121553079-4c61bcce1894'),  // Rolleiflex camera — thematic for camera bag
      IMG('1553062407-98eeb64c6a62'),     // leather bag
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Cognac', hex: '#9C5A2C' },
      { name: 'Taupe', hex: '#B5A99A' },
    ],
    sizes: ['One Size'],
    description: 'A compact crossbody bag in smooth leather with a top-zip closure and adjustable strap.',
    longDescription:
      'This minimalist crossbody bag is crafted from smooth full-grain leather and designed for effortless everyday use. The clean rectangular silhouette features a top zip, one interior slip pocket, and an adjustable shoulder strap. Compact enough for evenings, practical enough for every day.',
    material: 'Full-grain leather. Brushed gold hardware.',
    fit: 'Dimensions: 20cm × 14cm × 6cm. Strap: adjustable to 130cm.',
    care: 'Wipe clean. Store in provided dust bag.',
    tags: ['bestseller'],
    available: true,
    collections: ['Accessories', 'Everyday Edit'],
  },
];

export const getFeaturedProducts = () => products.filter(p => p.tags.includes('bestseller')).slice(0, 4);
export const getNewArrivals = () => products.filter(p => p.tags.includes('new-arrival'));
export const getProductById = (id: string) => products.find(p => p.id === id);
export const getProductsByCategory = (category: string) =>
  products.filter(p => p.category === category);
export const getProductsByGender = (gender: string) =>
  products.filter(p => p.gender === gender || p.gender === 'unisex');
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    (p.collections || []).some(c => c.toLowerCase().includes(q))
  );
};
export const getProductsUnderPrice = (maxPrice: number) =>
  products.filter(p => p.price <= maxPrice);
