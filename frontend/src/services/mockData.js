// In-memory / LocalStorage Mock Database for Aura E-Commerce

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    description: "High-end flagship gadgets and devices",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80"
  },
  {
    id: 2,
    name: "Clothing",
    description: "Premium modern apparel and fashion accessories",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&q=80"
  },
  {
    id: 3,
    name: "Books",
    description: "Best-selling literature, tech manuals, and novels",
    imageUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80"
  },
  {
    id: 4,
    name: "Home & Kitchen",
    description: "Barista-quality machines and home essentials",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80"
  },
  {
    id: 5,
    name: "Fitness & Outdoors",
    description: "Premium athletic gear and outdoor equipment",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80"
  },
  {
    id: 6,
    name: "Beauty & Wellness",
    description: "Curated self-care, organic skincare, and wellness items",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80"
  },
  {
    id: 7,
    name: "Stationery & Office",
    description: "Beautifully crafted desktop essentials and fine stationery",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80"
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Aura Pro Phone",
    description: "Next-gen flagship smartphone with neural AI processor, 120Hz OLED screen, and triple lens camera system.",
    price: 999.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 4,
    tags: "smartphone, electronics, mobile, phone",
    categoryId: 1
  },
  {
    id: 2,
    name: "Quantum Noise-Canceling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation, high-fidelity audio, and 40-hour battery life.",
    price: 299.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    stockQuantity: 120,
    rating: 4.6,
    reviewCount: 3,
    tags: "headphones, audio, electronics, music",
    categoryId: 1
  },
  {
    id: 3,
    name: "Apex Slim Laptop",
    description: "Ultra-thin lightweight developer laptop with M3 chip, 32GB RAM, and 1TB SSD storage.",
    price: 1299.99,
    discountPercentage: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1496181130204-755241544e3d?w=500&q=80",
    stockQuantity: 25,
    rating: 4.9,
    reviewCount: 2,
    tags: "laptop, computer, electronics, developer",
    categoryId: 1
  },
  {
    id: 4,
    name: "Classic Crewneck Tee",
    description: "Premium heavyweight organic cotton minimalist crewneck t-shirt in stealth black.",
    price: 24.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    stockQuantity: 200,
    rating: 4.5,
    reviewCount: 2,
    tags: "clothing, shirt, apparel, minimalist",
    categoryId: 2
  },
  {
    id: 5,
    name: "Aura Heritage Hoodie",
    description: "Unisex ultra-soft fleece hoodie featuring double-lined hood and spacious kangaroo pocket.",
    price: 59.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    stockQuantity: 150,
    rating: 4.7,
    reviewCount: 2,
    tags: "clothing, hoodie, apparel, fleece",
    categoryId: 2
  },
  {
    id: 6,
    name: "Designing Microservices Architectures",
    description: "A comprehensive guide to building scalable, resilient, and event-driven cloud systems with Spring Boot and Kafka.",
    price: 45.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80",
    stockQuantity: 80,
    rating: 4.9,
    reviewCount: 2,
    tags: "book, tech, software, developer",
    categoryId: 3
  },
  {
    id: 7,
    name: "The Silent Echo",
    description: "Award-winning science fiction thriller about deep space exploration, AI sentience, and the first contact.",
    price: 14.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80",
    stockQuantity: 100,
    rating: 4.3,
    reviewCount: 2,
    tags: "book, fiction, sci-fi, novel",
    categoryId: 3
  },
  {
    id: 8,
    name: "Presto Espresso Machine",
    description: "15-bar high pressure pump espresso maker with integrated steam wand for barista-quality cappuccinos and lattes.",
    price: 189.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1517637382994-f02da38c6128?w=500&q=80",
    stockQuantity: 40,
    rating: 4.7,
    reviewCount: 2,
    tags: "kitchen, coffee, appliance, espresso",
    categoryId: 4
  },
  {
    id: 9,
    name: "Aura Watch Ultra",
    description: "Premium multisport GPS smartwatch with aerospace-grade titanium case and 36-hour battery life.",
    price: 399.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
    stockQuantity: 75,
    rating: 4.8,
    reviewCount: 0,
    tags: "smartwatch, watch, electronics, fitness",
    categoryId: 1
  },
  {
    id: 10,
    name: "Lumina 4K Monitor",
    description: "32-inch 4K UHD IPS professional monitor with HDR600, color accuracy 99% DCI-P3, and USB-C power delivery.",
    price: 649.99,
    discountPercentage: 8.0,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    stockQuantity: 30,
    rating: 4.7,
    reviewCount: 0,
    tags: "monitor, display, electronics, workspace",
    categoryId: 1
  },
  {
    id: 11,
    name: "CineView Mirrorless Camera",
    description: "Compact mirrorless camera with full-frame 24.2MP sensor, 5-axis image stabilization, and 4K60p video capture.",
    price: 1199.99,
    discountPercentage: 12.0,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    stockQuantity: 15,
    rating: 4.9,
    reviewCount: 0,
    tags: "camera, photography, video, electronics",
    categoryId: 1
  },
  {
    id: 12,
    name: "SoundWave Soundbar",
    description: "Dolby Atmos enabled home theater soundbar with wireless subwoofer and Bluetooth streaming.",
    price: 249.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80",
    stockQuantity: 45,
    rating: 4.5,
    reviewCount: 0,
    tags: "soundbar, audio, home-theater, music, electronics",
    categoryId: 1
  },
  {
    id: 13,
    name: "VoltCharge Wireless Charger",
    description: "3-in-1 fast charging station for smartphone, watch, and wireless earbuds with sleek aluminum finish.",
    price: 49.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80",
    stockQuantity: 110,
    rating: 4.4,
    reviewCount: 0,
    tags: "charger, wireless, power, electronics",
    categoryId: 1
  },
  {
    id: 14,
    name: "KeyPro Mechanical Keyboard",
    description: "75% layout mechanical keyboard with hot-swappable tactile switches, RGB backlight, and dye-sub PBT keycaps.",
    price: 119.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
    stockQuantity: 65,
    rating: 4.8,
    reviewCount: 0,
    tags: "keyboard, mechanical, hot-swap, electronics",
    categoryId: 1
  },
  {
    id: 15,
    name: "GlideMouse Ergonomic Mouse",
    description: "Wireless precision mouse with hyper-fast scroll wheel, ergonomic thumb rest, and 8000 DPI track-on-glass sensor.",
    price: 79.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    stockQuantity: 90,
    rating: 4.6,
    reviewCount: 0,
    tags: "mouse, wireless, ergonomic, electronics",
    categoryId: 1
  },
  {
    id: 107,
    name: "Aura VR Headset",
    description: "All-in-one virtual reality headset with ultra-high resolution display and advanced spatial tracking.",
    price: 499.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&q=80",
    stockQuantity: 20,
    rating: 4.7,
    reviewCount: 0,
    tags: "vr, headset, virtual-reality, electronics",
    categoryId: 1
  },
  {
    id: 108,
    name: "Aura Link Router",
    description: "Tri-band Wi-Fi 6E mesh system with 5400 Mbps speed coverage up to 3000 sq ft.",
    price: 179.99,
    discountPercentage: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    stockQuantity: 35,
    rating: 4.5,
    reviewCount: 0,
    tags: "router, wifi, internet, mesh, electronics",
    categoryId: 1
  },
  {
    id: 16,
    name: "Nomad Windbreaker Jacket",
    description: "Water-resistant protective shell windbreaker with adjustable hood and stealth utility zippers.",
    price: 89.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80",
    stockQuantity: 80,
    rating: 4.6,
    reviewCount: 0,
    tags: "clothing, jacket, outerwear, nomad",
    categoryId: 2
  },
  {
    id: 17,
    name: "AeroFit Tapered Joggers",
    description: "Slim-fit technical joggers tailored from breathable stretch knit fabric for commute and training.",
    price: 49.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&q=80",
    stockQuantity: 120,
    rating: 4.5,
    reviewCount: 0,
    tags: "clothing, pants, joggers, activewear",
    categoryId: 2
  },
  {
    id: 18,
    name: "Luxe Cashmere Scarf",
    description: "Incredibly soft 100% Mongolian cashmere scarf woven with fringe details in neutral gray.",
    price: 75.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1520903781411-76fa0c8913b9?w=500&q=80",
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 0,
    tags: "clothing, scarf, cashmere, accessories",
    categoryId: 2
  },
  {
    id: 19,
    name: "Urban Trench Coat",
    description: "Double-breasted classic trench coat featuring storm flaps, belted waist, and water-repellent shell.",
    price: 219.99,
    discountPercentage: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    stockQuantity: 30,
    rating: 4.7,
    reviewCount: 0,
    tags: "clothing, coat, jacket, trench",
    categoryId: 2
  },
  {
    id: 20,
    name: "CloudStep Knit Sneakers",
    description: "Ultra-lightweight breathable engineered knit sneakers with supportive response foam soles.",
    price: 110.00,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    stockQuantity: 65,
    rating: 4.6,
    reviewCount: 0,
    tags: "clothing, shoes, sneakers, cloudstep",
    categoryId: 2
  },
  {
    id: 21,
    name: "Horizon Sunglasses",
    description: "Classic hand-polished acetate sunglasses with polarized lenses and UV400 protection.",
    price: 65.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
    stockQuantity: 85,
    rating: 4.4,
    reviewCount: 0,
    tags: "clothing, sunglasses, eyewear, accessories",
    categoryId: 2
  },
  {
    id: 22,
    name: "Canvas Weekend Duffle Bag",
    description: "Heavy-duty waxed cotton canvas duffle bag with full-grain leather straps and brass hardware.",
    price: 135.00,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    stockQuantity: 40,
    rating: 4.8,
    reviewCount: 0,
    tags: "clothing, bag, duffle, canvas, leather",
    categoryId: 2
  },
  {
    id: 23,
    name: "Merino Wool Beanie",
    description: "Ribbed knit beanie crafted from warm itch-free merino wool, optimal for cold forecasts.",
    price: 29.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80",
    stockQuantity: 140,
    rating: 4.6,
    reviewCount: 0,
    tags: "clothing, beanie, hat, merino",
    categoryId: 2
  },
  {
    id: 24,
    name: "Classic Leather Belt",
    description: "Full-grain vegetable tanned leather belt with premium brushed steel buckle.",
    price: 45.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb8ecfbd4?w=500&q=80",
    stockQuantity: 95,
    rating: 4.5,
    reviewCount: 0,
    tags: "clothing, belt, leather, accessories",
    categoryId: 2
  },
  {
    id: 25,
    name: "All-Weather Commuter Parka",
    description: "Windproof and seam-sealed down-filled parka designed for harsh urban winter climates.",
    price: 279.99,
    discountPercentage: 20.0,
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80",
    stockQuantity: 20,
    rating: 4.9,
    reviewCount: 0,
    tags: "clothing, parka, coat, jacket, winter",
    categoryId: 2
  },
  {
    id: 26,
    name: "Mastering React & Next.js",
    description: "Deep dive into Server Components, Server Actions, state routing, and performance optimization.",
    price: 49.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80",
    stockQuantity: 70,
    rating: 4.8,
    reviewCount: 0,
    tags: "book, software, react, nextjs, tech",
    categoryId: 3
  },
  {
    id: 27,
    name: "The Art of Minimalist Living",
    description: "A thoughtful philosophy on decluttering your home, workspace, and digital lifestyle for clarity.",
    price: 19.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80",
    stockQuantity: 90,
    rating: 4.7,
    reviewCount: 0,
    tags: "book, minimalism, wellness, lifestyle",
    categoryId: 3
  },
  {
    id: 28,
    name: "Chrono-Nexus: Eternity's Edge",
    description: "Best-selling sci-fi epic tracking a time-travel detective chasing paradoxes across centuries.",
    price: 15.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    stockQuantity: 110,
    rating: 4.4,
    reviewCount: 0,
    tags: "book, sci-fi, fiction, novel",
    categoryId: 3
  },
  {
    id: 29,
    name: "Shadows in the Grid",
    description: "Fast-paced cyberpunk thriller exploring corporate hackers, cybernetics, and rogue AI agents.",
    price: 16.50,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&q=80",
    stockQuantity: 85,
    rating: 4.5,
    reviewCount: 0,
    tags: "book, cyberpunk, fiction, thriller",
    categoryId: 3
  },
  {
    id: 30,
    name: "Curation: The Future of E-Commerce",
    description: "Business analysis on how curated boutique catalogs are beating generic search index engines.",
    price: 24.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80",
    stockQuantity: 60,
    rating: 4.6,
    reviewCount: 0,
    tags: "book, business, ecommerce, curation",
    categoryId: 3
  },
  {
    id: 31,
    name: "Principles of Modern Typography",
    description: "A stunning visual textbook dissecting grids, typefaces, scale, and layout hierarchy.",
    price: 39.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&q=80",
    stockQuantity: 45,
    rating: 4.9,
    reviewCount: 0,
    tags: "book, design, typography, arts",
    categoryId: 3
  },
  {
    id: 32,
    name: "The Event-Driven Enterprise",
    description: "Architectural bluebook outlining event sourcing, CQRS, and real-time streaming architectures.",
    price: 55.00,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 0,
    tags: "book, software, architecture, tech",
    categoryId: 3
  },
  {
    id: 33,
    name: "A History of Design Aesthetics",
    description: "An illustrative timeline of architectural and product design movements from Bauhaus to Apple.",
    price: 45.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    stockQuantity: 40,
    rating: 4.7,
    reviewCount: 0,
    tags: "book, design, history, aesthetics",
    categoryId: 3
  },
  {
    id: 34,
    name: "The Conscious Workspace",
    description: "Guide on physical office design, light distribution, ergonomics, and workflow routines.",
    price: 21.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80",
    stockQuantity: 95,
    rating: 4.3,
    reviewCount: 0,
    tags: "book, workspace, ergonomics, office",
    categoryId: 3
  },
  {
    id: 35,
    name: "Infinite Horizons: A Space Odyssey",
    description: "Poetic and scientific inquiry into deep space black holes, exoplanets, and dark energy.",
    price: 18.00,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
    stockQuantity: 75,
    rating: 4.6,
    reviewCount: 0,
    tags: "book, science, space, novel",
    categoryId: 3
  },
  {
    id: 36,
    name: "BrewMaster Gooseneck Kettle",
    description: "Electric temperature-controlled kettle with precision pour gooseneck spout and real-time LCD.",
    price: 119.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80",
    stockQuantity: 50,
    rating: 4.7,
    reviewCount: 0,
    tags: "kitchen, coffee, kettle, appliance",
    categoryId: 4
  },
  {
    id: 37,
    name: "Vortex Power Blender",
    description: "1400-watt heavy duty commercial-grade blender for smoothies, soups, and purees.",
    price: 199.99,
    discountPercentage: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500&q=80",
    stockQuantity: 35,
    rating: 4.6,
    reviewCount: 0,
    tags: "kitchen, blender, appliance, vortex",
    categoryId: 4
  },
  {
    id: 38,
    name: "Ceramic Knife Set",
    description: "6-piece surgical-sharp zirconia ceramic knives with protective covers and matching blocks.",
    price: 89.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&q=80",
    stockQuantity: 40,
    rating: 4.5,
    reviewCount: 0,
    tags: "kitchen, knives, cutlery, ceramic",
    categoryId: 4
  },
  {
    id: 39,
    name: "AeroPress Professional Brewer",
    description: "Immersion style travel-friendly coffee press with 350 micro-filters and storage bag.",
    price: 39.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
    stockQuantity: 120,
    rating: 4.9,
    reviewCount: 0,
    tags: "kitchen, coffee, press, aeropress",
    categoryId: 4
  },
  {
    id: 40,
    name: "CrispAir Digital Fryer",
    description: "4.5-quart digital touch air fryer with 8 preset programs and non-stick basket.",
    price: 129.99,
    discountPercentage: 12.0,
    imageUrl: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&q=80",
    stockQuantity: 45,
    rating: 4.8,
    reviewCount: 0,
    tags: "kitchen, airfryer, fryer, appliance",
    categoryId: 4
  },
  {
    id: 41,
    name: "Slate Stoneware Dinner Set",
    description: "16-piece luxury matte dark gray stoneware plates, bowls, and mugs set.",
    price: 149.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80",
    stockQuantity: 25,
    rating: 4.7,
    reviewCount: 0,
    tags: "kitchen, dinnerware, stoneware, luxury",
    categoryId: 4
  },
  {
    id: 42,
    name: "Aura Smart Thermostat",
    description: "Sleek mirrored thermostat with auto-scheduling, dynamic climate control, and Alexa sync.",
    price: 249.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1567954970774-58d6aa69900f?w=500&q=80",
    stockQuantity: 30,
    rating: 4.8,
    reviewCount: 0,
    tags: "kitchen, thermostat, smart-home, device",
    categoryId: 4
  },
  {
    id: 43,
    name: "PureMist Water Pitcher",
    description: "BPA-free carbon filtration pitcher with visual filter-life indicator and ergonomic handle.",
    price: 34.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=500&q=80",
    stockQuantity: 150,
    rating: 4.3,
    reviewCount: 0,
    tags: "kitchen, filter, pitcher, water",
    categoryId: 4
  },
  {
    id: 44,
    name: "WafflePro Belgian Maker",
    description: "Double rotating waffle maker with non-stick grids and browning selection knobs.",
    price: 79.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1588693721323-8cfb4657cb0e?w=500&q=80",
    stockQuantity: 55,
    rating: 4.6,
    reviewCount: 0,
    tags: "kitchen, waffle, breakfast, appliance",
    categoryId: 4
  },
  {
    id: 45,
    name: "NeoPan Non-Stick Skillet",
    description: "12-inch ceramic-coated heavy gauge copper core fry pan with stainless steel handle.",
    price: 59.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80",
    stockQuantity: 70,
    rating: 4.5,
    reviewCount: 0,
    tags: "kitchen, skillet, pan, cookware",
    categoryId: 4
  },
  {
    id: 46,
    name: "FlexiMat Non-Slip Yoga Mat",
    description: "6mm high-density eco-friendly TPE yoga mat with alignment indicators and carrying strap.",
    price: 39.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
    stockQuantity: 110,
    rating: 4.7,
    reviewCount: 0,
    tags: "fitness, yoga, mat, activewear",
    categoryId: 5
  },
  {
    id: 47,
    name: "IronGrip Adjustable Dumbbells",
    description: "Pair of premium quick-change dumbbells adjusting from 5 to 52.5 lbs with storage tray.",
    price: 349.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80",
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 0,
    tags: "fitness, weights, dumbbells, home-gym",
    categoryId: 5
  },
  {
    id: 48,
    name: "ApexTrail 40L Backpack",
    description: "Ergonomic ripstop nylon hiking pack with rain cover, hydration sleeve, and padded hip belt.",
    price: 99.99,
    discountPercentage: 8.0,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    stockQuantity: 40,
    rating: 4.6,
    reviewCount: 0,
    tags: "fitness, outdoors, backpack, hiking, trail",
    categoryId: 5
  },
  {
    id: 49,
    name: "HydroFlask Smart Bottle",
    description: "Double-wall vacuum insulated stainless steel water bottle with integrated LED hydrate reminder.",
    price: 49.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    stockQuantity: 130,
    rating: 4.5,
    reviewCount: 0,
    tags: "fitness, bottle, hydroflask, water, smart",
    categoryId: 5
  },
  {
    id: 50,
    name: "RidgeLine 2-Person Camping Tent",
    description: "Ultralight double-walled dome tent with aluminum poles and weather-resistant rainfly.",
    price: 159.99,
    discountPercentage: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=80",
    stockQuantity: 30,
    rating: 4.7,
    reviewCount: 0,
    tags: "outdoors, tent, camping, shelter",
    categoryId: 5
  },
  {
    id: 51,
    name: "SpeedGlide Running Shoes",
    description: "High-mileage responsive road running shoes with carbon fiber propulsion plates.",
    price: 139.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    stockQuantity: 60,
    rating: 4.8,
    reviewCount: 0,
    tags: "fitness, shoes, running, speedglide",
    categoryId: 5
  },
  {
    id: 52,
    name: "ActivePulse Heart Rate Monitor",
    description: "Comfortable soft fabric chest strap sensor transmitting ANT+ and Bluetooth analytics.",
    price: 69.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
    stockQuantity: 80,
    rating: 4.4,
    reviewCount: 0,
    tags: "fitness, tracker, heart-rate, activepulse",
    categoryId: 5
  },
  {
    id: 53,
    name: "SpinMax Folding Exercise Bike",
    description: "Compact indoor folding magnetic stationary bike with 10-level resistance and pulse sensors.",
    price: 219.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
    stockQuantity: 20,
    rating: 4.6,
    reviewCount: 0,
    tags: "fitness, bike, exercise, home-gym",
    categoryId: 5
  },
  {
    id: 54,
    name: "Trailblazer Trekking Poles",
    description: "Pair of collapsible lightweight carbon fiber trekking poles with ergonomic cork grips.",
    price: 59.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=500&q=80",
    stockQuantity: 70,
    rating: 4.5,
    reviewCount: 0,
    tags: "outdoors, hiking, trekking, poles",
    categoryId: 5
  },
  {
    id: 55,
    name: "AeroCore Ab Roller",
    description: "Extra-wide dynamic ab roller wheel with comfortable foam handgrips and knee pad.",
    price: 24.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80",
    stockQuantity: 150,
    rating: 4.3,
    reviewCount: 0,
    tags: "fitness, ab-roller, core, home-gym",
    categoryId: 5
  },
  {
    id: 56,
    name: "PowerStretch Resistance Bands",
    description: "Set of 5 color-coded natural latex resistance loop bands with door anchor and travel pouch.",
    price: 19.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80",
    stockQuantity: 200,
    rating: 4.5,
    reviewCount: 0,
    tags: "fitness, bands, resistance, exercise",
    categoryId: 5
  },
  {
    id: 57,
    name: "PeakPerformance Protein Shaker",
    description: "Insulated leak-proof stainless steel shaker bottle with wire whisk ball and loop top.",
    price: 29.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=500&q=80",
    stockQuantity: 100,
    rating: 4.4,
    reviewCount: 0,
    tags: "fitness, shaker, protein, bottle",
    categoryId: 5
  },
  {
    id: 58,
    name: "SunShield Sports Cap",
    description: "Lightweight moisture-wicking athletic cap with UPF 50+ protection and adjustable velcro strap.",
    price: 22.50,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=500&q=80",
    stockQuantity: 140,
    rating: 4.6,
    reviewCount: 0,
    tags: "fitness, cap, hat, activewear",
    categoryId: 5
  },
  {
    id: 59,
    name: "ComfyGrip Cycling Gloves",
    description: "Padded half-finger mountain bike gloves with anti-slip silicone mesh palm grips.",
    price: 18.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=80",
    stockQuantity: 90,
    rating: 4.3,
    reviewCount: 0,
    tags: "fitness, outdoors, gloves, cycling, gear",
    categoryId: 5
  },
  {
    id: 60,
    name: "UltraDry Microfiber Towel",
    description: "Super absorbent compact travel dry towel with quick-snap hanging loop.",
    price: 15.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&q=80",
    stockQuantity: 160,
    rating: 4.6,
    reviewCount: 0,
    tags: "fitness, outdoors, towel, quick-dry",
    categoryId: 5
  },
  {
    id: 61,
    name: "Radiant Glow Vitamin C Serum",
    description: "Organic lightweight serum with 20% Vitamin C, hyaluronic acid, and vitamin E.",
    price: 35.00,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80",
    stockQuantity: 110,
    rating: 4.8,
    reviewCount: 0,
    tags: "beauty, wellness, serum, skincare",
    categoryId: 6
  },
  {
    id: 62,
    name: "ZenMist Ultrasonic Diffuser",
    description: "Premium real wood grain ultrasonic essential oil diffuser with warm ambient light bands.",
    price: 49.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
    stockQuantity: 75,
    rating: 4.6,
    reviewCount: 0,
    tags: "beauty, wellness, diffuser, essential-oil, zen",
    categoryId: 6
  },
  {
    id: 63,
    name: "Jade Roller & Gua Sha Set",
    description: "Dual-sided 100% genuine aventurine jade facial massage roller and heart gua sha plate.",
    price: 24.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80",
    stockQuantity: 130,
    rating: 4.5,
    reviewCount: 0,
    tags: "beauty, jaderoller, guasha, skincare, massage",
    categoryId: 6
  },
  {
    id: 64,
    name: "Santal Aura Eau De Parfum",
    description: "Minimalist woody unisex scent notes of premium Australian sandalwood, cardamom, and amber.",
    price: 125.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
    stockQuantity: 40,
    rating: 4.9,
    reviewCount: 0,
    tags: "beauty, perfume, scent, sandlewood, luxury",
    categoryId: 6
  },
  {
    id: 65,
    name: "Ionic Shine Hair Dryer",
    description: "1800W professional ceramic hair dryer with folding handle and concentrator diffuser.",
    price: 89.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
    stockQuantity: 50,
    rating: 4.7,
    reviewCount: 0,
    tags: "beauty, hair, dryer, appliance",
    categoryId: 6
  },
  {
    id: 66,
    name: "ThermaRelief Percussion Gun",
    description: "Handheld silent deep tissue percussion massage gun with 6 speed options and 4 custom heads.",
    price: 149.99,
    discountPercentage: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80",
    stockQuantity: 30,
    rating: 4.8,
    reviewCount: 0,
    tags: "wellness, massage, therapy, thermarelief",
    categoryId: 6
  },
  {
    id: 67,
    name: "HydraSilk Night Face Cream",
    description: "Rich restorative moisturizing cream blended with peptides, ceramides, and organic honey.",
    price: 42.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80",
    stockQuantity: 90,
    rating: 4.6,
    reviewCount: 0,
    tags: "beauty, skincare, moisturizer, night-cream",
    categoryId: 6
  },
  {
    id: 68,
    name: "Charcoal Purifying Face Mask",
    description: "Deep cleansing bentonite clay mask infused with activated charcoal to refine pores.",
    price: 18.50,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    stockQuantity: 120,
    rating: 4.4,
    reviewCount: 0,
    tags: "beauty, mask, charcoal, skincare",
    categoryId: 6
  },
  {
    id: 69,
    name: "SleepEasy Silk Eye Mask",
    description: "100% natural Mulberry silk eye mask blockout blindfold with adjustable elastic strap.",
    price: 22.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1616627547474-f000b5b0ca87?w=500&q=80",
    stockQuantity: 140,
    rating: 4.7,
    reviewCount: 0,
    tags: "wellness, sleep, eyemask, silk",
    categoryId: 6
  },
  {
    id: 70,
    name: "AuraDent Sonic Toothbrush",
    description: "Rechargeable sonic electric toothbrush with 5 modes, smart timer, and 4 premium heads.",
    price: 79.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1559592481-740760b2950e?w=500&q=80",
    stockQuantity: 65,
    rating: 4.7,
    reviewCount: 0,
    tags: "beauty, wellness, toothbrush, sonic",
    categoryId: 6
  },
  {
    id: 71,
    name: "Rosewater Hydrating Mist",
    description: "100% organic pure Moroccan rose water spray mist to refresh skin and set makeup.",
    price: 15.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80",
    stockQuantity: 150,
    rating: 4.5,
    reviewCount: 0,
    tags: "beauty, skincare, mist, rosewater",
    categoryId: 6
  },
  {
    id: 72,
    name: "Eucalyptus Bath Salts",
    description: "Mineral-rich pure Epsom salt crystals infused with eucalyptus essential oils for muscle recovery.",
    price: 19.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
    stockQuantity: 100,
    rating: 4.6,
    reviewCount: 0,
    tags: "wellness, bath, salts, eucalyptus",
    categoryId: 6
  },
  {
    id: 73,
    name: "Botanical Body Wash",
    description: "Nourishing sulfate-free body wash with tea tree extract, aloe vera, and lavender.",
    price: 16.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80",
    stockQuantity: 85,
    rating: 4.4,
    reviewCount: 0,
    tags: "beauty, bodywash, botanical, shower",
    categoryId: 6
  },
  {
    id: 74,
    name: "Organic Coconut Hair Mask",
    description: "Deep conditioning restorative raw virgin coconut oil treatment for dry damaged hair.",
    price: 24.00,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80",
    stockQuantity: 70,
    rating: 4.6,
    reviewCount: 0,
    tags: "beauty, hair, mask, coconut",
    categoryId: 6
  },
  {
    id: 75,
    name: "SunDefense SPF 50",
    description: "Non-greasy mineral physical zinc oxide sunscreen with broad spectrum UVA/UVB shield.",
    price: 29.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
    stockQuantity: 95,
    rating: 4.7,
    reviewCount: 0,
    tags: "beauty, sunscreen, skincare, sundefense",
    categoryId: 6
  },
  {
    id: 76,
    name: "Leatherbound A5 Notebook",
    description: "Top-grain rustic leather notebook with 200 pages of 120gsm fountain-pen friendly paper.",
    price: 35.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    stockQuantity: 110,
    rating: 4.8,
    reviewCount: 0,
    tags: "stationery, notebook, leather, journal",
    categoryId: 7
  },
  {
    id: 77,
    name: "Precision Brass Fountain Pen",
    description: "Solid raw brass fountain pen with medium German-made steel nib and converter.",
    price: 75.00,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    stockQuantity: 65,
    rating: 4.9,
    reviewCount: 0,
    tags: "stationery, pen, fountain-pen, brass, luxury",
    categoryId: 7
  },
  {
    id: 78,
    name: "Minimalist Merino Desk Pad",
    description: "Elegant non-slip natural wool felt desktop mat protection for laptop and keyboard.",
    price: 45.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?w=500&q=80",
    stockQuantity: 80,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, deskpad, wool, workspace",
    categoryId: 7
  },
  {
    id: 79,
    name: "Solid Walnut Desk Organizer",
    description: "Handcrafted sustainable walnut organizer tray with phone dock and accessory slots.",
    price: 89.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500&q=80",
    stockQuantity: 30,
    rating: 4.7,
    reviewCount: 0,
    tags: "stationery, organizer, walnut, workspace, desk",
    categoryId: 7
  },
  {
    id: 80,
    name: "Drafting Mechanical Pencil",
    description: "Professional full-metal body drafting pencil with lead hardness indicator and 0.5mm lead.",
    price: 19.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80",
    stockQuantity: 120,
    rating: 4.5,
    reviewCount: 0,
    tags: "stationery, pencil, drafting, mechanical",
    categoryId: 7
  },
  {
    id: 81,
    name: "Archival Pigment Fineliners",
    description: "Set of 6 dynamic technical black fineliner pens ranging from 0.05mm to 0.8mm brush.",
    price: 24.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80",
    stockQuantity: 90,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, pens, fineliner, archive",
    categoryId: 7
  },
  {
    id: 82,
    name: "Brass Page Bookmark",
    description: "Classic hand-polished brass clip bookmark to secure pages without folding.",
    price: 12.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    stockQuantity: 150,
    rating: 4.4,
    reviewCount: 0,
    tags: "stationery, bookmark, brass, reading",
    categoryId: 7
  },
  {
    id: 83,
    name: "Concrete Pen Cup",
    description: "Minimalist industrial raw cast concrete desk holder for pens, pencils, and rulers.",
    price: 18.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500&q=80",
    stockQuantity: 100,
    rating: 4.2,
    reviewCount: 0,
    tags: "stationery, pencup, concrete, workspace",
    categoryId: 7
  },
  {
    id: 84,
    name: "Linen Textured Sticky Notes",
    description: "Boutique self-adhesive paper notes in muted earth tone color palette.",
    price: 14.50,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
    stockQuantity: 130,
    rating: 4.5,
    reviewCount: 0,
    tags: "stationery, notes, stickynotes, office",
    categoryId: 7
  },
  {
    id: 85,
    name: "Matte Black Desktop Scissors",
    description: "Ergonomic stainless steel utility scissors coated with protective matte black Teflon.",
    price: 22.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=500&q=80",
    stockQuantity: 70,
    rating: 4.4,
    reviewCount: 0,
    tags: "stationery, scissors, black, workspace",
    categoryId: 7
  },
  {
    id: 86,
    name: "Magnetic Cable Organizer",
    description: "Solid wooden base with 3 magnetic collars to route desktop charging cables safely.",
    price: 29.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80",
    stockQuantity: 85,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, cables, organizer, magnetic",
    categoryId: 7
  },
  {
    id: 87,
    name: "Dual-Height Laptop Stand",
    description: "Sandblasted silver aluminum riser adjusting screen angle for optimal posture health.",
    price: 49.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80",
    stockQuantity: 60,
    rating: 4.7,
    reviewCount: 0,
    tags: "stationery, laptopstand, riser, ergonomic",
    categoryId: 7
  },
  {
    id: 88,
    name: "Ergonomic Lumbar Cushion",
    description: "Slow rebound orthopedic memory foam support pillow wrapped in breathable 3D mesh.",
    price: 39.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80",
    stockQuantity: 75,
    rating: 4.5,
    reviewCount: 0,
    tags: "stationery, cushion, chair, lumbar, ergonomics",
    categoryId: 7
  },
  {
    id: 89,
    name: "Smart Daylight Desk Lamp",
    description: "Dimmable LED architect swing-arm light bar with automatic daylight tracking sensors.",
    price: 119.99,
    discountPercentage: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    stockQuantity: 40,
    rating: 4.8,
    reviewCount: 0,
    tags: "stationery, lamp, light, daylight, smart",
    categoryId: 7
  },
  {
    id: 90,
    name: "Acrylic Dry Erase Board",
    description: "Frameless clear desktop stand whiteboard with neon markers and microfiber eraser.",
    price: 24.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1572945281861-68b291c9f807?w=500&q=80",
    stockQuantity: 110,
    rating: 4.4,
    reviewCount: 0,
    tags: "stationery, whiteboard, acrylic, stand",
    categoryId: 7
  },
  {
    id: 91,
    name: "Leather Passport Wallet",
    description: "Handstitched Horween leather travel sleeve housing passport, tickets, and credit cards.",
    price: 55.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 0,
    tags: "stationery, wallet, travel, leather",
    categoryId: 7
  },
  {
    id: 92,
    name: "Brass Desk Perpetual Calendar",
    description: "Charming interactive brass flip calendar displays month, date, and weekday forever.",
    price: 32.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80",
    stockQuantity: 80,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, calendar, brass, flip",
    categoryId: 7
  },
  {
    id: 93,
    name: "Leather Cord Wrap Organizer",
    description: "Pack of 5 snaps buttons cords manager loops tailored from dark brown leather.",
    price: 15.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80",
    stockQuantity: 200,
    rating: 4.4,
    reviewCount: 0,
    tags: "stationery, cordwrap, leather, cables",
    categoryId: 7
  },
  {
    id: 94,
    name: "Premium Linen Ring Binder",
    description: "Minimalist 3-ring binder wrapped in woven natural flax linen cloth.",
    price: 28.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
    stockQuantity: 90,
    rating: 4.5,
    reviewCount: 0,
    tags: "stationery, binder, linen, workspace",
    categoryId: 7
  },
  {
    id: 95,
    name: "Felt Document Portfolio",
    description: "A4 sized document folder crafted from recycled wool felt with metal snap enclosure.",
    price: 21.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    stockQuantity: 110,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, portfolio, felt, folder",
    categoryId: 7
  },
  {
    id: 96,
    name: "Aura Signature Rollerball Pen",
    description: "Perfect weight executive rollerball pen in matte titanium finish with Schmidt liquid ink refill.",
    price: 65.00,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    stockQuantity: 80,
    rating: 4.8,
    reviewCount: 0,
    tags: "stationery, pen, rollerball, titanium, luxury",
    categoryId: 7
  },
  {
    id: 97,
    name: "Desktop Wooden Letter Tray",
    description: "Stackable A4 size paperwork organizer tray crafted from solid white oak.",
    price: 42.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500&q=80",
    stockQuantity: 60,
    rating: 4.4,
    reviewCount: 0,
    tags: "stationery, lettertray, oak, workspace",
    categoryId: 7
  },
  {
    id: 98,
    name: "Geometric Brass Paperweight",
    description: "Solid cast brass dodecahedron paperweight with beautiful brushed facets.",
    price: 29.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    stockQuantity: 70,
    rating: 4.3,
    reviewCount: 0,
    tags: "stationery, paperweight, brass, desk",
    categoryId: 7
  },
  {
    id: 99,
    name: "Minimalist Matte Tape Dispenser",
    description: "Heavy duty non-slip cast iron tape dispenser in matte black sand textured paint.",
    price: 34.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=500&q=80",
    stockQuantity: 50,
    rating: 4.5,
    reviewCount: 0,
    tags: "stationery, tape, dispenser, black",
    categoryId: 7
  },
  {
    id: 100,
    name: "Precision Aluminum Ruler",
    description: "12-inch anodized space gray aluminum ruler with laser-etched metric and imperial scales.",
    price: 16.50,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80",
    stockQuantity: 130,
    rating: 4.7,
    reviewCount: 0,
    tags: "stationery, ruler, aluminum, precision",
    categoryId: 7
  },
  {
    id: 101,
    name: "Archival Document Storage Box",
    description: "Durable storage box wrapped in heavy charcoal book cloth with metal label holder.",
    price: 26.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
    stockQuantity: 85,
    rating: 4.5,
    reviewCount: 0,
    tags: "stationery, storage, archive, office",
    categoryId: 7
  },
  {
    id: 102,
    name: "Fine Point Calligraphy Ink",
    description: "50ml bottle of deep carbon black pigment ink for fountain pens and dip pens.",
    price: 18.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    stockQuantity: 100,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, ink, calligraphy, writing",
    categoryId: 7
  },
  {
    id: 103,
    name: "Glass Dip Pen Set",
    description: "Hand-blown spiral glass dip pen with 12 colored shimmer ink bottles in storage box.",
    price: 39.99,
    discountPercentage: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    stockQuantity: 45,
    rating: 4.7,
    reviewCount: 0,
    tags: "stationery, dippen, glass, ink, gift",
    categoryId: 7
  },
  {
    id: 104,
    name: "Muted Highlighter Set",
    description: "Pack of 6 double-ended soft pastel highlighters featuring broad and fine chisel tips.",
    price: 12.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80",
    stockQuantity: 180,
    rating: 4.4,
    reviewCount: 0,
    tags: "stationery, highlighters, pastel, notes",
    categoryId: 7
  },
  {
    id: 105,
    name: "Handmade Wax Seal Kit",
    description: "Premium kit including solid brass seal stamp, melting spoon, and 3 jars of wax beads.",
    price: 38.00,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    stockQuantity: 55,
    rating: 4.8,
    reviewCount: 0,
    tags: "stationery, waxseal, stamp, craft, letter",
    categoryId: 7
  },
  {
    id: 106,
    name: "Adjustable Book Stand",
    description: "Natural bamboo book holder with page clips and 5 adjustable reading angles.",
    price: 24.99,
    discountPercentage: 0.0,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    stockQuantity: 70,
    rating: 4.6,
    reviewCount: 0,
    tags: "stationery, bookstand, bamboo, reading",
    categoryId: 7
  }
];

const INITIAL_REVIEWS = {
  1: [
    { id: 101, userName: "Sarah Jenkins", rating: 5, comment: "Absolutely amazing phone! The battery life easily lasts two days, and the camera quality is outstanding.", sentimentLabel: "POSITIVE", sentimentScore: 0.96 },
    { id: 102, userName: "David M.", rating: 4, comment: "Very solid display and fast processor. However, it takes a bit of time to charge fully.", sentimentLabel: "NEUTRAL", sentimentScore: 0.52 },
    { id: 103, userName: "Marcus Vance", rating: 5, comment: "Best smartphone design ever. The 120Hz display is butter smooth, feels like a true piece of luxury.", sentimentLabel: "POSITIVE", sentimentScore: 0.98 },
    { id: 104, userName: "Elena Rostova", rating: 5, comment: "The AI processor makes photo post-processing look incredibly crisp and natural. Highly recommended!", sentimentLabel: "POSITIVE", sentimentScore: 0.97 }
  ],
  2: [
    { id: 201, userName: "Alex Rivers", rating: 5, comment: "The noise cancellation is perfect. I use it on flights and it blocks out jet engine noise completely!", sentimentLabel: "POSITIVE", sentimentScore: 0.99 },
    { id: 202, userName: "Emily Davis", rating: 3, comment: "Sound quality is gorgeous but they feel slightly tight on my head after a few continuous hours of work.", sentimentLabel: "NEUTRAL", sentimentScore: 0.44 },
    { id: 203, userName: "Tyler Chen", rating: 5, comment: "Insane base response and crystal clear high frequencies. Active noise cancellation is top notch.", sentimentLabel: "POSITIVE", sentimentScore: 0.95 }
  ],
  3: [
    { id: 301, userName: "Devon H.", rating: 5, comment: "Extremely fast compile speeds. The screen is highly bright and crisp. Developer's dream laptop.", sentimentLabel: "POSITIVE", sentimentScore: 0.97 },
    { id: 302, userName: "Ravi K.", rating: 5, comment: "Super lightweight, long battery lifespan, and absolute silence even under intense workloads.", sentimentLabel: "POSITIVE", sentimentScore: 0.98 }
  ],
  4: [
    { id: 401, userName: "Jessica L.", rating: 4, comment: "Simple, elegant fit. The fabric feels premium, nice heavy cotton feel. Fits true to size.", sentimentLabel: "POSITIVE", sentimentScore: 0.89 },
    { id: 402, userName: "Nolan Blake", rating: 5, comment: "Amazing basic black shirt. Handwashed several times already and didn't fade at all.", sentimentLabel: "POSITIVE", sentimentScore: 0.92 }
  ],
  5: [
    { id: 501, userName: "Jordan W.", rating: 5, comment: "The hoodie is incredibly soft inside. Extremely warm and matches everything in my wardrobe.", sentimentLabel: "POSITIVE", sentimentScore: 0.96 },
    { id: 502, userName: "Casey Miller", rating: 4, comment: "Heavyweight material keeps its shape. Nice structure, slightly oversized fit which is cool.", sentimentLabel: "POSITIVE", sentimentScore: 0.88 }
  ],
  6: [
    { id: 601, userName: "Aris Thorne", rating: 5, comment: "Best microservices architectures book on the market. Extremely practical code examples with Spring Boot.", sentimentLabel: "POSITIVE", sentimentScore: 0.98 },
    { id: 602, userName: "Sonia G.", rating: 5, comment: "Provides clean strategies for handling event-driven transactions and failure fallbacks.", sentimentLabel: "POSITIVE", sentimentScore: 0.94 }
  ],
  7: [
    { id: 701, userName: "Arthur C.", rating: 4, comment: "Wonderful read. Keeps you hooked from start to finish. Good characters and AI sentience philosophical ideas.", sentimentLabel: "POSITIVE", sentimentScore: 0.86 },
    { id: 702, userName: "Zoe Sterling", rating: 4, comment: "Thought-provoking space opera with a very unique perspective on AI self-awareness. Recommended.", sentimentLabel: "POSITIVE", sentimentScore: 0.82 }
  ],
  8: [
    { id: 801, userName: "Ben Carter", rating: 5, comment: "Makes cafe quality lattes at home easily! The steam wand has outstanding power for foaming milk.", sentimentLabel: "POSITIVE", sentimentScore: 0.97 },
    { id: 802, userName: "Clara Vance", rating: 4, comment: "Good espresso shot extraction. Takes slightly longer to warm up in the morning, but worth the wait.", sentimentLabel: "POSITIVE", sentimentScore: 0.78 }
  ]
};

const INITIAL_USERS = [
  {
    email: "admin@aura.com",
    name: "Aura Admin",
    password: "admin123",
    role: "ADMIN",
    loyaltyPoints: 500,
    verified: true
  },
  {
    email: "user@aura.com",
    name: "Alex Rivers",
    password: "user123",
    role: "CUSTOMER",
    loyaltyPoints: 120,
    verified: true
  }
];

// Helper to interact with LocalStorage
const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(item);
};

const setStorageItem = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Database Initialization
export const initDb = () => {
  getStorageItem('mock_categories', INITIAL_CATEGORIES);
  getStorageItem('mock_products', INITIAL_PRODUCTS);
  getStorageItem('mock_reviews', INITIAL_REVIEWS);
  getStorageItem('mock_users', INITIAL_USERS);
  getStorageItem('mock_orders', []);
};

// Helper for Real-time Sentiment Tagging
const analyzeSentiment = (text) => {
  const lowercase = text.toLowerCase();
  
  // Keyword lists
  const positiveWords = ['love', 'amazing', 'great', 'perfect', 'good', 'excellent', 'outstanding', 'fast', 'best', 'beautiful', 'beautifully', 'crisp', 'smooth', 'gorgeous', 'crisp', 'premium', 'soft'];
  const negativeWords = ['bad', 'worst', 'broken', 'fail', 'poor', 'hate', 'slow', 'tight', 'disappointed', 'disappointing', 'difficult', 'charge', 'expensive', 'long', 'unhappy'];
  
  let positiveMatches = 0;
  let negativeMatches = 0;
  
  positiveWords.forEach(w => {
    if (lowercase.includes(w)) positiveMatches++;
  });
  
  negativeWords.forEach(w => {
    if (lowercase.includes(w)) negativeMatches++;
  });
  
  if (positiveMatches > negativeMatches) {
    return { label: "POSITIVE", score: 0.7 + Math.random() * 0.28 };
  } else if (negativeMatches > positiveMatches) {
    return { label: "NEGATIVE", score: 0.1 + Math.random() * 0.25 };
  } else {
    return { label: "NEUTRAL", score: 0.4 + Math.random() * 0.2 };
  }
};

// --- DATABASE HANDLERS ---

// 1. Categories
export const getCategories = () => getStorageItem('mock_categories', INITIAL_CATEGORIES);

export const createCategory = (catForm) => {
  const categories = getCategories();
  const newCat = {
    id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
    name: catForm.name,
    description: catForm.description,
    imageUrl: catForm.imageUrl || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80"
  };
  categories.push(newCat);
  setStorageItem('mock_categories', categories);
  return newCat;
};

// 2. Products
export const getAllProductsFlat = () => {
  const products = getStorageItem('mock_products', INITIAL_PRODUCTS);
  const categories = getCategories();
  
  // Map category object into each product
  return products.map(prod => ({
    ...prod,
    category: categories.find(c => c.id === prod.categoryId) || null
  }));
};

export const getProducts = (page = 0, size = 6, sortBy = 'id', sortDir = 'asc', categoryId = '', minPrice = 0, maxPrice = 5000) => {
  let list = getAllProductsFlat();
  
  // Filter by category
  if (categoryId) {
    list = list.filter(p => p.categoryId.toString() === categoryId.toString());
  }
  
  // Filter by price range
  list = list.filter(p => {
    const finalPrice = p.price * (1 - (p.discountPercentage / 100));
    return finalPrice >= minPrice && finalPrice <= maxPrice;
  });
  
  // Sort
  list.sort((a, b) => {
    let valA, valB;
    if (sortBy === 'price') {
      valA = a.price * (1 - (a.discountPercentage / 100));
      valB = b.price * (1 - (b.discountPercentage / 100));
    } else if (sortBy === 'rating') {
      valA = a.rating;
      valB = b.rating;
    } else {
      valA = a.id;
      valB = b.id;
    }
    
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Paginate
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / size);
  const paginatedContent = list.slice(page * size, (page + 1) * size);
  
  return {
    content: paginatedContent,
    totalPages: totalPages || 1,
    totalElements: totalElements
  };
};

export const getProductById = (id) => {
  const products = getAllProductsFlat();
  return products.find(p => p.id.toString() === id.toString()) || null;
};

export const createProduct = (prodForm) => {
  const products = getStorageItem('mock_products', INITIAL_PRODUCTS);
  const newProd = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: prodForm.name,
    description: prodForm.description,
    price: parseFloat(prodForm.price),
    discountPercentage: parseFloat(prodForm.discountPercentage || 0),
    imageUrl: prodForm.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    stockQuantity: parseInt(prodForm.stockQuantity || 10),
    rating: 5.0,
    reviewCount: 0,
    tags: prodForm.tags || "",
    categoryId: parseInt(prodForm.categoryId)
  };
  
  products.push(newProd);
  setStorageItem('mock_products', products);
  return newProd;
};

// 3. Reviews
export const getReviews = (productId) => {
  const reviewsMap = getStorageItem('mock_reviews', INITIAL_REVIEWS);
  return reviewsMap[productId.toString()] || [];
};

export const createReview = (productId, reviewForm, userEmail) => {
  const reviewsMap = getStorageItem('mock_reviews', INITIAL_REVIEWS);
  const products = getStorageItem('mock_products', INITIAL_PRODUCTS);
  
  const users = getStorageItem('mock_users', INITIAL_USERS);
  const user = users.find(u => u.email === userEmail);
  const userName = user ? user.name : "Alex Rivers";
  
  const pid = productId.toString();
  if (!reviewsMap[pid]) {
    reviewsMap[pid] = [];
  }
  
  const sentiment = analyzeSentiment(reviewForm.comment);
  
  const newReview = {
    id: Date.now(),
    userName: userName,
    rating: parseInt(reviewForm.rating),
    comment: reviewForm.comment,
    sentimentLabel: sentiment.label,
    sentimentScore: sentiment.score
  };
  
  reviewsMap[pid].unshift(newReview);
  setStorageItem('mock_reviews', reviewsMap);
  
  // Re-calculate product ratings and review count
  const productIndex = products.findIndex(p => p.id.toString() === pid);
  if (productIndex !== -1) {
    const prodReviews = reviewsMap[pid];
    const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    products[productIndex].rating = totalRating / prodReviews.length;
    products[productIndex].reviewCount = prodReviews.length;
    setStorageItem('mock_products', products);
  }
  
  return newReview;
};

export const getSentimentStats = (productId) => {
  const reviews = getReviews(productId);
  const total = reviews.length || 1;
  
  const positive = reviews.filter(r => r.sentimentLabel === 'POSITIVE').length;
  const neutral = reviews.filter(r => r.sentimentLabel === 'NEUTRAL').length;
  const negative = reviews.filter(r => r.sentimentLabel === 'NEGATIVE').length;
  
  // Sentiment Score is percentage of positive reviews out of total reviews (or avg sentiment score)
  const averageSentiment = (positive / total) * 100;
  
  return {
    totalReviewsCount: reviews.length,
    positiveCount: positive,
    neutralCount: neutral,
    negativeCount: negative,
    averageSentimentPercentage: averageSentiment
  };
};

// 4. AI Recommendations & Search
export const getSimilarProducts = (productId) => {
  const current = getProductById(productId);
  if (!current) return [];
  
  const all = getAllProductsFlat().filter(p => p.id.toString() !== productId.toString());
  
  // Simple tag matching score or category match
  const scored = all.map(p => {
    let score = 0;
    if (p.categoryId === current.categoryId) score += 5;
    
    const tags1 = current.tags.split(',').map(t => t.trim().toLowerCase());
    const tags2 = p.tags.split(',').map(t => t.trim().toLowerCase());
    
    tags1.forEach(t => {
      if (tags2.includes(t)) score += 3;
    });
    
    return { product: p, score };
  });
  
  // Sort by score and return top 4
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map(s => s.product);
};

export const getRecommendations = () => {
  const all = getAllProductsFlat();
  // Return the first 4 products or random selection
  return all.slice(0, 4);
};

export const aiSearch = (query) => {
  const cleanQuery = query.toLowerCase().trim();
  const all = getAllProductsFlat();
  
  if (!cleanQuery) return all;
  
  // Score based on keywords
  const scored = all.map(p => {
    let score = 0;
    if (p.name.toLowerCase().includes(cleanQuery)) score += 10;
    if (p.description.toLowerCase().includes(cleanQuery)) score += 5;
    
    p.tags.split(',').forEach(t => {
      if (cleanQuery.includes(t.trim().toLowerCase())) score += 4;
    });
    
    return { product: p, score };
  });
  
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.product);
};

// 5. AI Chatbot
export const aiChat = (msg, userEmail) => {
  const lowercase = msg.toLowerCase().trim();
  const products = getAllProductsFlat();
  
  let reply = "";
  let productsToAttach = [];
  
  if (lowercase.includes("coupon") || lowercase.includes("discount") || lowercase.includes("promo") || lowercase.includes("offer")) {
    reply = "Here are the active promo codes for Aura:\n\n• **WELCOME10** — 10% off no minimum purchase.\n• **MINIMALIST** — Flat $25 discount off orders over $100.\n• **AURA50** — High-end 50% discount off orders over $200.\n\nYou can easily apply these codes on step 2 of checkout!";
  } else if (lowercase.includes("audio") || lowercase.includes("headphone") || lowercase.includes("sound") || lowercase.includes("music") || lowercase.includes("noise")) {
    const hp = products.find(p => p.id === 2);
    if (hp) productsToAttach.push(hp);
    reply = "For audio enthusiasts, we highly recommend the **Quantum Noise-Canceling Headphones**! It features active noise cancellation, high-fidelity acoustics, and a massive 40-hour battery life.";
  } else if (lowercase.includes("phone") || lowercase.includes("mobile") || lowercase.includes("aura pro")) {
    const phone = products.find(p => p.id === 1);
    if (phone) productsToAttach.push(phone);
    reply = "Our premier smartphone is the **Aura Pro Phone**, built with a custom neural AI processor, a gorgeous 120Hz OLED screen, and a professional triple-lens camera array.";
  } else if (lowercase.includes("laptop") || lowercase.includes("computer") || lowercase.includes("apex") || lowercase.includes("developer")) {
    const lap = products.find(p => p.id === 3);
    if (lap) productsToAttach.push(lap);
    reply = "Developers love our flagship **Apex Slim Laptop**! Built with an M3 processor, 32GB RAM, and 1TB SSD storage inside a beautiful space-gray chassis.";
  } else if (lowercase.includes("coffee") || lowercase.includes("espresso") || lowercase.includes("machine") || lowercase.includes("kitchen")) {
    const esp = products.find(p => p.id === 8);
    if (esp) productsToAttach.push(esp);
    reply = "Indulge in cafe-quality mornings with the **Presto Espresso Machine**, built with a 15-bar Italian pressure pump and an integrated steam wand for foaming perfect lattes.";
  } else if (lowercase.includes("book") || lowercase.includes("novel") || lowercase.includes("fiction") || lowercase.includes("silent echo") || lowercase.includes("microservices")) {
    const books = products.filter(p => p.categoryId === 3);
    productsToAttach = books;
    reply = "Our book shelf contains event-driven architecture books like **Designing Microservices Architectures** as well as science-fiction thrillers like **The Silent Echo**.";
  } else if (lowercase.includes("loyalty") || lowercase.includes("points") || lowercase.includes("reward")) {
    reply = "Aura's Loyalty system gives you 5% back of your order values as gold points immediately upon checkout. You can check the 'Redeem Points' box during payment, where each point earns you a flat $0.10 discount!";
  } else {
    // Try to search for products
    const searchResults = aiSearch(lowercase);
    if (searchResults.length > 0) {
      productsToAttach = searchResults.slice(0, 3);
      reply = `I found these products in our catalog that match your interest: ${productsToAttach.map(p => `**${p.name}**`).join(', ')}. Would you like me to tell you more about any of them?`;
    } else {
      reply = "Welcome to Aura E-Commerce! I can suggest active coupons, recommend premium audio/gadget gear, explain our loyalty rewards program, or locate catalog products. What can I do for you today?";
    }
  }
  
  return {
    reply,
    products: productsToAttach
  };
};

// 6. Orders
export const getOrders = (userEmail) => {
  const orders = getStorageItem('mock_orders', []);
  return orders.filter(o => o.userEmail === userEmail).sort((a, b) => b.id - a.id);
};

export const createOrder = (orderPayload, userEmail) => {
  const orders = getStorageItem('mock_orders', []);
  const products = getStorageItem('mock_products', INITIAL_PRODUCTS);
  const categories = getCategories();
  
  // Calculate financial details
  let subtotal = 0;
  const orderItems = orderPayload.items.map((item, idx) => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) throw new Error("Product not found");
    
    // Decrement stock
    prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
    
    const discPrice = prod.price * (1 - (prod.discountPercentage / 100));
    subtotal += discPrice * item.quantity;
    
    return {
      id: Date.now() + idx,
      product: {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        discountPercentage: prod.discountPercentage,
        imageUrl: prod.imageUrl,
        category: categories.find(c => c.id === prod.categoryId) || null
      },
      quantity: item.quantity,
      price: discPrice
    };
  });
  
  // Save updated product stock quantities
  setStorageItem('mock_products', products);
  
  // Calculate coupon discount
  let couponDiscount = 0;
  if (orderPayload.couponCode) {
    const code = orderPayload.couponCode.toUpperCase().trim();
    if (code === 'AURA50' && subtotal >= 200) {
      couponDiscount = subtotal * 0.50;
    } else if (code === 'WELCOME10') {
      couponDiscount = subtotal * 0.10;
    } else if (code === 'MINIMALIST' && subtotal >= 100) {
      couponDiscount = 25.00;
    }
  }
  
  // Calculate loyalty point discount
  let pointsDiscount = 0;
  const users = getStorageItem('mock_users', INITIAL_USERS);
  const user = users.find(u => u.email === userEmail);
  
  if (orderPayload.useLoyaltyPoints && user && user.loyaltyPoints > 0) {
    const remaining = subtotal - couponDiscount;
    const pointsValue = user.loyaltyPoints * 0.10;
    pointsDiscount = Math.min(remaining, pointsValue);
  }
  
  const discount = couponDiscount + pointsDiscount;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.10;
  const finalAmount = taxableAmount + tax;
  
  // Generate random tracking number
  const trackingNumber = "AU-" + Math.floor(100000 + Math.random() * 900000) + "-US";
  
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 4501,
    orderDate: new Date().toISOString(),
    status: "PROCESSING",
    shippingAddress: orderPayload.shippingAddress,
    billingAddress: orderPayload.billingAddress || orderPayload.shippingAddress,
    paymentMethod: orderPayload.paymentMethod,
    trackingNumber: trackingNumber,
    subtotal: subtotal,
    discountAmount: discount,
    taxAmount: tax,
    finalAmount: finalAmount,
    orderItems: orderItems,
    userEmail: userEmail
  };
  
  orders.push(newOrder);
  setStorageItem('mock_orders', orders);
  
  return newOrder;
};

// 7. Admin Analytics
export const getAdminAnalytics = () => {
  const orders = getStorageItem('mock_orders', []);
  
  let totalRevenue = 0;
  orders.forEach(o => {
    totalRevenue += o.finalAmount;
  });
  
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    activeCoupons: 3 // AURA50, WELCOME10, MINIMALIST
  };
};

export const getAdminForecast = () => {
  const analytics = getAdminAnalytics();
  
  // Simulated linear regression forecast: Base amount + 1.2x order variance
  const baseForecast = 2500.00;
  const dynamicForecast = baseForecast + (analytics.totalRevenue * 0.15);
  return dynamicForecast;
};

// 8. Authentication
export const registerUser = (registerForm) => {
  const users = getStorageItem('mock_users', INITIAL_USERS);
  
  if (users.find(u => u.email === registerForm.email)) {
    throw { response: { data: { message: "Email address already registered" } } };
  }
  
  const newUser = {
    email: registerForm.email,
    name: registerForm.name,
    password: registerForm.password,
    role: "CUSTOMER",
    loyaltyPoints: 0,
    verified: false,
    otpCode: "123456" // Default mock OTP
  };
  
  users.push(newUser);
  setStorageItem('mock_users', users);
  return { message: "OTP code sent to email. Check inbox (Simulated code is '123456')" };
};

export const verifyUserOtp = (email, otp) => {
  const users = getStorageItem('mock_users', INITIAL_USERS);
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw { response: { data: { message: "User not found" } } };
  }
  
  if (otp === "123456" || otp === user.otpCode) {
    user.verified = true;
    setStorageItem('mock_users', users);
    return { message: "Account verification successful." };
  } else {
    throw { response: { data: { message: "Invalid verification code" } } };
  }
};

export const loginUser = (email, password) => {
  const users = getStorageItem('mock_users', INITIAL_USERS);
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw { response: { data: { message: "Bad credentials. Email not found." } } };
  }
  
  if (user.password !== password) {
    throw { response: { data: { message: "Bad credentials. Invalid password." } } };
  }
  
  if (!user.verified) {
    throw { response: { data: { message: "Please verify your email OTP before logging in." } } };
  }
  
  // Generate simulated JWT tokens
  const accessToken = `mock-access-token-jwt-${user.email}-${Date.now()}`;
  const refreshToken = `mock-refresh-token-jwt-${user.email}-${Date.now()}`;
  
  return {
    accessToken,
    refreshToken,
    name: user.name,
    role: user.role,
    loyaltyPoints: user.loyaltyPoints
  };
};

export const forgotUserPassword = (email) => {
  const users = getStorageItem('mock_users', INITIAL_USERS);
  const user = users.find(u => u.email === email);
  if (!user) {
    throw { response: { data: { message: "Email address not registered." } } };
  }
  return { message: "Reset password token dispatched to email." };
};

export const resetUserPassword = (token, newPassword) => {
  const users = getStorageItem('mock_users', INITIAL_USERS);
  // Just update the first user for simplicity or any user
  if (users.length > 0) {
    users[0].password = newPassword;
    setStorageItem('mock_users', users);
  }
  return { message: "Password updated successfully." };
};

export const updateUserLoyaltyPoints = (userEmail, points) => {
  const users = getStorageItem('mock_users', INITIAL_USERS);
  const user = users.find(u => u.email === userEmail);
  if (user) {
    user.loyaltyPoints = points;
    setStorageItem('mock_users', users);
  }
};
