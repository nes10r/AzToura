import { PrismaClient, Role, BookingStatus, PriceRange } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'nature' },
      update: {},
      create: { name: 'Nature', slug: 'nature', description: 'Mountains, forests, and natural landscapes', icon: '🏔️' },
    }),
    prisma.category.upsert({
      where: { slug: 'culture' },
      update: {},
      create: { name: 'Culture', slug: 'culture', description: 'Historical sites and cultural heritage', icon: '🏛️' },
    }),
    prisma.category.upsert({
      where: { slug: 'adventure' },
      update: {},
      create: { name: 'Adventure', slug: 'adventure', description: 'Extreme sports and outdoor activities', icon: '🧗' },
    }),
    prisma.category.upsert({
      where: { slug: 'gastronomy' },
      update: {},
      create: { name: 'Gastronomy', slug: 'gastronomy', description: 'Azerbaijani cuisine and food experiences', icon: '🍽️' },
    }),
    prisma.category.upsert({
      where: { slug: 'beach' },
      update: {},
      create: { name: 'Beach', slug: 'beach', description: 'Caspian Sea coast and beach resorts', icon: '🏖️' },
    }),
    prisma.category.upsert({
      where: { slug: 'winter' },
      update: {},
      create: { name: 'Winter', slug: 'winter', description: 'Ski resorts and winter activities', icon: '⛷️' },
    }),
  ]);

  const [nature, culture, adventure, gastronomy, beach, winter] = categories;
  console.log('✅ Categories created');

  // ── Admin & Users ────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
  const userPassword = await bcrypt.hash('User@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@azerbaijantourism.az' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@azerbaijantourism.az',
      password: adminPassword,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: userPassword,
      name: 'John Smith',
      phone: '+994501234567',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'aynur@example.com' },
    update: {},
    create: {
      email: 'aynur@example.com',
      password: userPassword,
      name: 'Aynur Həsənova',
      phone: '+994557654321',
    },
  });
  console.log('✅ Users created');

  // ── Destinations ─────────────────────────────────────────────────────────────
  const baku = await prisma.destination.upsert({
    where: { slug: 'baku' },
    update: {},
    create: {
      name: 'Baku',
      slug: 'baku',
      description: 'The capital and largest city of Azerbaijan, where ancient and modern architecture blend seamlessly. Baku is famous for its walled Old City, the Flame Towers, and vibrant nightlife along the Caspian Sea boulevard.',
      region: 'Absheron',
      city: 'Baku',
      latitude: 40.4093,
      longitude: 49.8671,
      coverImage: '/images/baku-night.jpg',
      featured: true,
      categoryId: culture.id,
    },
  });

  const gabala = await prisma.destination.upsert({
    where: { slug: 'gabala' },
    update: {},
    create: {
      name: 'Gabala',
      slug: 'gabala',
      description: 'A picturesque city in the foothills of the Greater Caucasus Mountains, known for its lush forests, ski resort, and adventure sports. Gabala offers stunning natural beauty throughout the year.',
      region: 'Gabala',
      city: 'Gabala',
      latitude: 40.9981,
      longitude: 47.8453,
      coverImage: 'https://images.unsplash.com/photo-1544735716-ea9ef790f501?w=1200',
      featured: true,
      categoryId: nature.id,
    },
  });

  const sheki = await prisma.destination.upsert({
    where: { slug: 'sheki' },
    update: {},
    create: {
      name: 'Sheki',
      slug: 'sheki',
      description: 'A UNESCO World Heritage city famous for its Palace of Sheki Khans, ancient caravanserais, silk production, and distinctive Azerbaijani cuisine. Sheki sits in a scenic mountain valley.',
      region: 'Sheki-Zagatala',
      city: 'Sheki',
      latitude: 41.1978,
      longitude: 47.1706,
      coverImage: 'https://images.unsplash.com/photo-1563784462386-044fd95e9852?w=1200',
      featured: true,
      categoryId: culture.id,
    },
  });

  const guba = await prisma.destination.upsert({
    where: { slug: 'guba' },
    update: {},
    create: {
      name: 'Guba',
      slug: 'guba',
      description: 'Known as the apple capital of Azerbaijan, Guba is a charming mountain town with colorful bazaars, the unique village of Khinalig, and breathtaking Caucasus scenery.',
      region: 'Guba-Khachmaz',
      city: 'Guba',
      latitude: 41.3603,
      longitude: 48.5126,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      featured: false,
      categoryId: nature.id,
    },
  });

  const shahdag = await prisma.destination.upsert({
    where: { slug: 'shahdag' },
    update: {},
    create: {
      name: 'Shahdag',
      slug: 'shahdag',
      description: "Azerbaijan's premier ski resort located in the Greater Caucasus Mountains near Guba. Shahdag offers world-class skiing, snowboarding, and year-round mountain activities.",
      region: 'Guba-Khachmaz',
      city: 'Shahdag',
      latitude: 41.4200,
      longitude: 48.2300,
      coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f5a?w=1200',
      featured: true,
      categoryId: winter.id,
    },
  });

  const lankaran = await prisma.destination.upsert({
    where: { slug: 'lankaran' },
    update: {},
    create: {
      name: 'Lankaran',
      slug: 'lankaran',
      description: 'A subtropical city on the Caspian coast, famous for its tea plantations, Talysh Mountains, rich biodiversity, and unique cuisine. Lankaran enjoys a mild humid climate year-round.',
      region: 'Lankaran',
      city: 'Lankaran',
      latitude: 38.7529,
      longitude: 48.8513,
      coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200',
      featured: false,
      categoryId: nature.id,
    },
  });

  const gobustan = await prisma.destination.upsert({
    where: { slug: 'gobustan' },
    update: {},
    create: {
      name: 'Gobustan',
      slug: 'gobustan',
      description: 'A UNESCO World Heritage site with thousands of ancient rock carvings dating back 40,000 years. Gobustan is also home to active mud volcanoes — a truly unique geological phenomenon.',
      region: 'Absheron',
      city: 'Gobustan',
      latitude: 40.1097,
      longitude: 49.3718,
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200',
      featured: false,
      categoryId: culture.id,
    },
  });

  const khinalig = await prisma.destination.upsert({
    where: { slug: 'khinalig' },
    update: {},
    create: {
      name: 'Khinalig',
      slug: 'khinalig',
      description: "One of the highest and oldest villages in the Caucasus, perched at 2,350 meters. Khinalig has its own unique language, ancient culture, and stunning mountain landscapes that feel untouched by time.",
      region: 'Guba-Khachmaz',
      city: 'Khinalig',
      latitude: 41.5033,
      longitude: 48.0900,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      featured: true,
      categoryId: adventure.id,
    },
  });

  const nakhchivan = await prisma.destination.upsert({
    where: { slug: 'nakhchivan' },
    update: {},
    create: {
      name: 'Nakhchivan',
      slug: 'nakhchivan',
      description: 'An autonomous republic of Azerbaijan with a rich history, ancient monuments including the Momine Khatun Mausoleum, diverse landscapes, and a unique culture shaped by its historical position on the Silk Road.',
      region: 'Nakhchivan',
      city: 'Nakhchivan',
      latitude: 39.2092,
      longitude: 45.4126,
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200',
      featured: false,
      categoryId: culture.id,
    },
  });
  console.log('✅ Destinations created');

  // ── Hotels ──────────────────────────────────────────────────────────────────
  const fourSeasonsHotel = await prisma.hotel.upsert({
    where: { slug: 'four-seasons-baku' },
    update: {},
    create: {
      name: 'Four Seasons Hotel Baku',
      slug: 'four-seasons-baku',
      description: 'Overlooking the Caspian Sea, the Four Seasons Hotel Baku offers unrivaled luxury in the heart of the city, with stunning views, world-class dining, and exceptional service.',
      city: 'Baku',
      address: '1 Neftchilar Avenue, Baku',
      stars: 5,
      pricePerNight: 450,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      featured: true,
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking', 'Business Center'],
      destinationId: baku.id,
      latitude: 40.3698,
      longitude: 49.8378,
    },
  });

  const marriottHotel = await prisma.hotel.upsert({
    where: { slug: 'jw-marriott-absheron-baku' },
    update: {},
    create: {
      name: 'JW Marriott Absheron Baku',
      slug: 'jw-marriott-absheron-baku',
      description: "Located in the city center, JW Marriott Absheron offers sophisticated luxury accommodations with panoramic Caspian Sea views and Azerbaijan's finest dining experiences.",
      city: 'Baku',
      address: '2 Azadliq Square, Baku',
      stars: 5,
      pricePerNight: 320,
      coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f5a?w=1200',
      featured: true,
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service'],
      destinationId: baku.id,
      latitude: 40.4030,
      longitude: 49.8671,
    },
  });

  const gabalaHotel = await prisma.hotel.upsert({
    where: { slug: 'qafqaz-resort-gabala' },
    update: {},
    create: {
      name: 'Qafqaz Resort Hotel',
      slug: 'qafqaz-resort-gabala',
      description: 'Set amidst lush forests and mountain scenery, Qafqaz Resort is the premier destination in Gabala for nature lovers, offering luxurious rooms and excellent recreational facilities.',
      city: 'Gabala',
      address: 'Nohur Lake Road, Gabala',
      stars: 5,
      pricePerNight: 180,
      coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      featured: true,
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Tennis Court', 'Children Playground'],
      destinationId: gabala.id,
      latitude: 40.9900,
      longitude: 47.8200,
    },
  });

  const shekiHotel = await prisma.hotel.upsert({
    where: { slug: 'sheki-saray-hotel' },
    update: {},
    create: {
      name: 'Sheki Saray Hotel',
      slug: 'sheki-saray-hotel',
      description: 'A charming boutique hotel in the heart of historic Sheki, offering traditional Azerbaijani architecture blended with modern comforts. Steps away from the Palace of Sheki Khans.',
      city: 'Sheki',
      address: '7 Khan Street, Sheki',
      stars: 4,
      pricePerNight: 95,
      coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      featured: false,
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Garden', 'Parking'],
      destinationId: sheki.id,
      latitude: 41.1978,
      longitude: 47.1706,
    },
  });
  console.log('✅ Hotels created');

  // ── Restaurants ─────────────────────────────────────────────────────────────
  await prisma.restaurant.upsert({
    where: { slug: 'firuze-restaurant-baku' },
    update: {},
    create: {
      name: 'Firuze Restaurant',
      slug: 'firuze-restaurant-baku',
      description: 'An elegant restaurant serving authentic Azerbaijani cuisine in a beautifully restored historical building in the Old City. Famous for its plov, dolma, and traditional bread.',
      city: 'Baku',
      address: '15 Kichik Gala Street, Old City, Baku',
      cuisine: 'Azerbaijani',
      priceRange: PriceRange.EXPENSIVE,
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      featured: true,
      destinationId: baku.id,
      phone: '+994124930101',
    },
  });

  await prisma.restaurant.upsert({
    where: { slug: 'mugham-club-baku' },
    update: {},
    create: {
      name: 'Mugham Club',
      slug: 'mugham-club-baku',
      description: 'Dine to the sounds of live mugham music in this unique restaurant celebrating Azerbaijani cultural heritage. The menu features traditional dishes made with locally sourced ingredients.',
      city: 'Baku',
      address: '9 Istiglaliyyat Street, Baku',
      cuisine: 'Azerbaijani',
      priceRange: PriceRange.EXPENSIVE,
      coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
      featured: true,
      destinationId: baku.id,
      phone: '+994124931234',
    },
  });

  await prisma.restaurant.upsert({
    where: { slug: 'khan-lənkəran-lankaran' },
    update: {},
    create: {
      name: 'Khan Lankaran',
      slug: 'khan-lənkəran-lankaran',
      description: "Specializing in Talysh and Azerbaijani cuisine, this cozy restaurant is known for its cured fish, levragi (sea bass), and Lankaran-style pilaf cooked with herbs from the surrounding mountains.",
      city: 'Lankaran',
      address: '3 Heydar Aliyev Avenue, Lankaran',
      cuisine: 'Talysh / Azerbaijani',
      priceRange: PriceRange.MODERATE,
      coverImage: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200',
      featured: false,
      destinationId: lankaran.id,
    },
  });
  console.log('✅ Restaurants created');

  // ── Tours ────────────────────────────────────────────────────────────────────
  const tour1 = await prisma.tour.upsert({
    where: { slug: 'baku-old-city-walking-tour' },
    update: {},
    create: {
      name: 'Baku Old City Walking Tour',
      slug: 'baku-old-city-walking-tour',
      description: 'Explore the UNESCO-listed Icherisheher (Old City) with an expert local guide. Visit the Maiden Tower, Palace of the Shirvanshahs, ancient mosques, caravanserais, and hidden alleys of medieval Baku.',
      price: 35,
      duration: 1,
      maxGroupSize: 15,
      coverImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=1200',
      featured: true,
      destinationId: baku.id,
      categoryId: culture.id,
    },
  });

  const tour2 = await prisma.tour.upsert({
    where: { slug: 'gabala-nature-and-adventure-tour' },
    update: {},
    create: {
      name: 'Gabala Nature & Adventure Tour',
      slug: 'gabala-nature-and-adventure-tour',
      description: 'A thrilling 3-day adventure through Gabala\'s mountains, forests, and waterfalls. Activities include zip-lining, ATV rides, hiking to Nohur Lake, and an archery experience.',
      price: 220,
      duration: 3,
      maxGroupSize: 12,
      coverImage: 'https://images.unsplash.com/photo-1544735716-ea9ef790f501?w=1200',
      featured: true,
      destinationId: gabala.id,
      categoryId: adventure.id,
    },
  });

  const tour3 = await prisma.tour.upsert({
    where: { slug: 'sheki-cultural-heritage-tour' },
    update: {},
    create: {
      name: 'Sheki Cultural Heritage Tour',
      slug: 'sheki-cultural-heritage-tour',
      description: 'Discover the ancient Silk Road city of Sheki over 2 days. Visit the Palace of Sheki Khans, watch master craftsmen create shebeke stained glass, tour silk workshops, and enjoy traditional Sheki halva.',
      price: 150,
      duration: 2,
      maxGroupSize: 10,
      coverImage: 'https://images.unsplash.com/photo-1563784462386-044fd95e9852?w=1200',
      featured: true,
      destinationId: sheki.id,
      categoryId: culture.id,
    },
  });

  const tour4 = await prisma.tour.upsert({
    where: { slug: 'khinalig-highland-trekking' },
    update: {},
    create: {
      name: 'Khinalig Highland Trekking',
      slug: 'khinalig-highland-trekking',
      description: 'Trek to one of the highest and most remote villages in the Caucasus. Experience authentic village life at 2,350 meters altitude, meet locals who speak a unique language, and enjoy spectacular mountain views.',
      price: 180,
      duration: 2,
      maxGroupSize: 8,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      featured: true,
      destinationId: khinalig.id,
      categoryId: adventure.id,
    },
  });

  const tour5 = await prisma.tour.upsert({
    where: { slug: 'gobustan-mud-volcanoes-tour' },
    update: {},
    create: {
      name: 'Gobustan & Mud Volcanoes Day Tour',
      slug: 'gobustan-mud-volcanoes-tour',
      description: 'A full-day excursion from Baku to see ancient petroglyphs at Gobustan National Park and the remarkable bubbling mud volcanoes nearby. Includes a local guide and transport from Baku.',
      price: 55,
      duration: 1,
      maxGroupSize: 20,
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200',
      featured: false,
      destinationId: gobustan.id,
      categoryId: culture.id,
    },
  });
  console.log('✅ Tours created');

  // ── Events ──────────────────────────────────────────────────────────────────
  await prisma.event.upsert({
    where: { slug: 'baku-jazz-festival-2025' },
    update: {},
    create: {
      name: 'Baku Jazz Festival 2025',
      slug: 'baku-jazz-festival-2025',
      description: 'The annual Baku Jazz Festival brings world-class jazz musicians together for five unforgettable nights at the Heydar Aliyev Center. Experience the best of international and local jazz talent.',
      city: 'Baku',
      address: 'Heydar Aliyev Center, Baku',
      startDate: new Date('2025-10-15'),
      endDate: new Date('2025-10-19'),
      price: 30,
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
      featured: true,
      destinationId: baku.id,
      categoryId: culture.id,
      latitude: 40.4086,
      longitude: 49.8671,
    },
  });

  await prisma.event.upsert({
    where: { slug: 'shahdag-ski-opening-2025' },
    update: {},
    create: {
      name: 'Shahdag Ski Season Opening 2025',
      slug: 'shahdag-ski-opening-2025',
      description: 'Celebrate the opening of the ski season at Shahdag Mountain Resort with live music, free ski lessons, snowboarding demonstrations, and special discounts on lift passes.',
      city: 'Shahdag',
      address: 'Shahdag Mountain Resort',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-03'),
      price: 0,
      coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f5a?w=1200',
      featured: true,
      destinationId: shahdag.id,
      categoryId: winter.id,
    },
  });

  await prisma.event.upsert({
    where: { slug: 'sheki-novruz-festival-2025' },
    update: {},
    create: {
      name: 'Sheki Novruz Festival 2025',
      slug: 'sheki-novruz-festival-2025',
      description: "Celebrate Azerbaijan's beloved Novruz spring holiday in the magical setting of Sheki. Enjoy traditional music, dance performances, fire-jumping rituals, and an abundance of seasonal foods.",
      city: 'Sheki',
      address: 'Sheki City Center',
      startDate: new Date('2025-03-20'),
      endDate: new Date('2025-03-22'),
      price: 0,
      coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
      featured: false,
      destinationId: sheki.id,
      categoryId: culture.id,
    },
  });
  console.log('✅ Events created');

  // ── Reviews ──────────────────────────────────────────────────────────────────
  await prisma.review.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: user1.id,
        destinationId: baku.id,
        rating: 5,
        comment: 'Baku is an absolutely stunning city. The blend of ancient Old City and ultra-modern architecture is unlike anywhere else in the world. Flame Towers at night are breathtaking!',
      },
      {
        userId: user2.id,
        destinationId: sheki.id,
        rating: 5,
        comment: 'Sheki stole my heart. The Palace of Sheki Khans is magnificent, the local food is incredible, and the people are so warm and welcoming. A must-visit in Azerbaijan.',
      },
      {
        userId: user1.id,
        tourId: tour1.id,
        rating: 5,
        comment: 'The Old City walking tour was fantastic. Our guide knew every corner of Icherisheher and shared amazing stories. Highly recommend!',
      },
      {
        userId: user2.id,
        tourId: tour2.id,
        rating: 4,
        comment: 'The Gabala adventure tour was thrilling. Zip-lining through the forest was the highlight. Would have given 5 stars but we had some rain on day 2.',
      },
      {
        userId: user2.id,
        hotelId: fourSeasonsHotel.id,
        rating: 5,
        comment: 'Impeccable service and stunning views over the Caspian. The spa is world-class. Worth every penny for a special occasion.',
      },
    ],
  });
  console.log('✅ Reviews created');

  // ── Bookings ─────────────────────────────────────────────────────────────────
  await prisma.booking.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: user1.id,
        tourId: tour1.id,
        status: BookingStatus.CONFIRMED,
        startDate: new Date('2025-06-15'),
        guests: 2,
        totalPrice: 70,
      },
      {
        userId: user2.id,
        tourId: tour2.id,
        status: BookingStatus.PENDING,
        startDate: new Date('2025-07-10'),
        endDate: new Date('2025-07-12'),
        guests: 1,
        totalPrice: 220,
      },
      {
        userId: user1.id,
        hotelId: gabalaHotel.id,
        status: BookingStatus.CONFIRMED,
        startDate: new Date('2025-07-10'),
        endDate: new Date('2025-07-13'),
        guests: 2,
        totalPrice: 540,
        notes: 'Please arrange airport pickup.',
      },
    ],
  });
  console.log('✅ Bookings created');

  // ── Blog Posts ───────────────────────────────────────────────────────────────
  await prisma.blogPost.upsert({
    where: { slug: 'top-10-destinations-azerbaijan' },
    update: {},
    create: {
      title: 'Top 10 Must-Visit Destinations in Azerbaijan',
      slug: 'top-10-destinations-azerbaijan',
      excerpt: 'From the ancient streets of Baku to the mountain village of Khinalig, discover the most breathtaking destinations Azerbaijan has to offer.',
      content: `Azerbaijan is a land of contrasts — ancient and modern, mountainous and coastal, Eastern and Western. Whether you are a history enthusiast, nature lover, or adventure seeker, Azerbaijan has something extraordinary to offer. Here are the top 10 destinations you must visit.

**1. Baku** — The capital city seamlessly blends a medieval walled city with futuristic architecture like the Flame Towers and Heydar Aliyev Center.

**2. Sheki** — A UNESCO World Heritage city famous for the Palace of Sheki Khans and traditional craftsmanship.

**3. Gabala** — A paradise for nature lovers with lush forests, waterfalls, and adventure activities.

**4. Shahdag** — Azerbaijan's premier ski resort offering world-class winter sports.

**5. Khinalig** — One of the highest ancient villages in the Caucasus with a unique culture and language.

**6. Gobustan** — Home to thousands of prehistoric rock carvings and mysterious mud volcanoes.

**7. Guba** — The "apple capital" with colorful bazaars and access to Khinalig village.

**8. Lankaran** — A subtropical paradise with tea plantations and Talysh mountain scenery.

**9. Nakhchivan** — An autonomous republic rich in ancient monuments and Silk Road history.

**10. Lahij** — A medieval copper-craft village where traditional artisans still work as their ancestors did centuries ago.`,
      published: true,
      authorId: admin.id,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'azerbaijani-cuisine-guide' },
    update: {},
    create: {
      title: 'A Guide to Azerbaijani Cuisine: What to Eat and Where',
      slug: 'azerbaijani-cuisine-guide',
      excerpt: 'Azerbaijani cuisine is one of the richest in the Caucasus region. Here is everything you need to know about the must-try dishes and the best places to enjoy them.',
      content: `Azerbaijani cuisine is a delicious blend of Caucasian, Persian, and Turkish influences, built around fresh herbs, saffron, pomegranate, and locally sourced meats and vegetables.

**Essential Dishes:**

- **Plov** — The crown jewel of Azerbaijani cooking. Saffron-scented rice served with lamb, dried fruits, and chestnuts.
- **Dolma** — Vine leaves stuffed with spiced minced meat and rice.
- **Qutab** — Thin flatbreads filled with meat, greens, or pumpkin.
- **Dushbara** — Tiny lamb dumplings served in a savory broth.
- **Levengi** — Whole chicken or fish stuffed with a walnut and onion paste.

**Where to Eat:**

- In **Baku**: Visit the Old City restaurants for the most authentic experience.
- In **Sheki**: Try the local plov and the famous Sheki halva (a layered pastry with rice flour and nuts).
- In **Lankaran**: Do not miss the Talysh-style cured fish and herb-infused rice dishes.`,
      published: true,
      authorId: admin.id,
    },
  });
  console.log('✅ Blog posts created');

  console.log('\n🎉 Database seeded successfully!');
  // ── Site Settings ─────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Azerbaijan Tourism',
      siteSlogan: 'Discover the Beauty of Azerbaijan',
      metaTitle: 'Azerbaijan Tourism — Explore Baku, Gabala, Sheki & More',
      metaDescription: 'Plan your perfect trip to Azerbaijan. Book tours, hotels, restaurants, and discover unforgettable destinations.',
      seoKeywords: 'azerbaijan, tourism, baku, travel, tours, hotels, caucasus',
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
      contactEmail: 'info@azerbaijantourism.az',
      contactPhone: '+994 12 598 00 00',
      contactAddress: 'Neftchilar Ave, Baku AZ1000, Azerbaijan',
      allowRegistration: true,
      allowReviews: true,
      allowBooking: true,
    },
  });

  // ── Theme Settings ────────────────────────────────────────────────────────
  await prisma.themeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      primaryColor: '#0A8F6A',
      secondaryColor: '#0F4C81',
      accentColor: '#F6B73C',
      bgColor: '#F8FAFC',
      textColor: '#1E293B',
      cardColor: '#FFFFFF',
      borderColor: '#E2E8F0',
      headerColor: '#0F4C81',
      footerColor: '#1E293B',
      fontFamily: 'Geist',
      headingFont: 'Geist',
      fontSize: '16',
      lineHeight: '1.6',
      borderRadius: '8',
      buttonStyle: 'rounded',
      cardStyle: 'shadow',
    },
  });
  console.log('✅ Site & Theme Settings created');

  console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@azerbaijantourism.az'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
