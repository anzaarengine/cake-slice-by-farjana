export interface BackgroundStyleItem {
  id: string;
  nameBn: string;
  nameEn: string;
  badge?: string;
  isPopular?: boolean;
  previewImg: string;
  shortDesc: string;
  fullDescBn: string;
  promptBackgroundDesc: string;
  promptLightingDesc: string;
}

export const BACKGROUND_STYLES: BackgroundStyleItem[] = [
  {
    id: 'organic-earth',
    nameBn: 'Organic Earth Tone (অর্গানিক বেইজ)',
    nameEn: 'Organic Earth Tone',
    badge: 'চ্যাট ১ ও ২ লকড',
    isPopular: true,
    previewImg: '/bg_styles/organic_earth.jpg',
    shortDesc: 'ওয়ার্ম বেইজ দেয়াল ও সফট ডিফিউজড ন্যাচারাল আলো',
    fullDescBn: 'মাটির উষ্ণতা, শান্ত বেইজ প্লাস্টার দেয়াল ও নরম প্রভাতী প্রাকৃতিক আলো। স্নিগ্ধ ও আভিজাত্যপূর্ণ পরিবেশ।',
    promptBackgroundDesc: 'an empty, seamless warm taupe, sand, or light beige plaster wall, offering massive breathing space',
    promptLightingDesc: 'Soft, natural ambient daylight wraps gently around the cake and its base, casting realistic delicate shadows with grounded earthy calmness and serene luxury.'
  },
  {
    id: 'dark-cinematic',
    nameBn: 'Dark & Warm Cinematic (ডার্ক ড্রামাটিক)',
    nameEn: 'Dark & Warm Cinematic',
    badge: 'চ্যাট ১ ও ২ লকড',
    isPopular: true,
    previewImg: '/bg_styles/dark_cinematic.jpg',
    shortDesc: 'চারকোল কালো স্পেস ও সোনালি সিনেম্যাটিক আলো',
    fullDescBn: 'চারকোল কালো ব্যাকগ্রাউন্ডে ড্রামাটিক সোনালি সাইড-লাইট ও গাঢ় ভেলভেটি ছায়া। এক্সক্লুসিভ মুভি-পোস্টার লাক্সারি ভাইব।',
    promptBackgroundDesc: 'an empty, seamless pitch-dark charcoal and deep shadow negative space, offering massive breathing space',
    promptLightingDesc: 'A warm, golden cinematic side-light hits the cake and its complementary base, creating a moody, high-end dramatic atmosphere with rich highlights and deep, velvety shadows.'
  },
  {
    id: 'nordic-minimal',
    nameBn: 'Nordic Minimal Daylight (নর্ডিক ডে-লাইট)',
    nameEn: 'Nordic Minimalist Daylight',
    badge: 'স্ক্যান্ডিনেভিয়ান',
    previewImg: '/bg_styles/nordic_minimal.jpg',
    shortDesc: 'পরিচ্ছন্ন অফ-হোয়াইট দেয়াল ও প্রশান্ত স্নিগ্ধ আলো',
    fullDescBn: 'স্ক্যান্ডিনেভিয়ান মিনিমালিজম, হালকা দুধ-সাদা দেয়াল এবং পরিমিত ছায়া। অত্যন্ত রিফ্রেশিং ও মার্জিত।',
    promptBackgroundDesc: 'a vast, seamless crisp off-white and chalky limestone wall with clean modern architectural breathing space',
    promptLightingDesc: 'Soft, diffused northern skylight gently illuminating the composition, yielding ultra-clean highlights and pale airy shadows.'
  },
  {
    id: 'moody-espresso',
    nameBn: 'Moody Espresso & Amber (এসপ্রেসো ও অ্যাম্বার)',
    nameEn: 'Moody Espresso & Warm Amber',
    badge: 'ওয়ার্ম মুডি',
    previewImg: '/bg_styles/moody_espresso.jpg',
    shortDesc: 'এসপ্রেসো চকলেট দেয়াল ও পেছনের সোনালি অ্যাম্বার আভা',
    fullDescBn: 'গাঢ় এস্প্রেসো কফি রঙের দেয়াল, ব্যাকগ্রাউন্ড থেকে ভেসে আসা উষ্ণ অ্যাম্বার ব্যাক-লাইট। প্রিমিয়াম রোমান্টিক ফিল।',
    promptBackgroundDesc: 'an empty, seamless deep roasted-espresso brown plaster wall with luxurious warm undertones',
    promptLightingDesc: 'Atmospheric low-key back-lighting with warm amber undertones rim-lighting the cake, creating an intimate, cozy, and ultra-expensive feeling.'
  },
  {
    id: 'creamy-limestone',
    nameBn: 'Creamy Limestone Chic (ক্রিমি লাইমস্টোন)',
    nameEn: 'Creamy Limestone Studio',
    badge: 'এডিটোরিয়াল',
    previewImg: '/bg_styles/creamy_limestone.jpg',
    shortDesc: 'আইভরি ক্রিম লাইমস্টোন ও ব্যালেন্সড সফটবক্স লাইট',
    fullDescBn: 'ফরাসি পেস্ট্রিশপ ধাঁচের আইভরি বেইজ দেয়াল, নরম ও সমান আলোর বিচ্ছুরণ। অত্যন্ত পরিষ্কার ও প্রিমিয়াম ম্যাগাজিন কভার লুক।',
    promptBackgroundDesc: 'a seamless warm ivory and creamy textured limestone surface, leaving expansive uncluttered negative space',
    promptLightingDesc: 'Balanced high-end editorial softbox studio illumination, bringing out the delicate shimmer of gold leaf and smooth frosting textures.'
  },
  {
    id: 'terracotta-twilight',
    nameBn: 'Earthen Terracotta Twilight (পোড়ামাটি গোধূলি)',
    nameEn: 'Earthen Terracotta Twilight',
    badge: 'গ্রামবাংলার মডার্ন রূপ',
    previewImg: '/bg_styles/terracotta_twilight.jpg',
    shortDesc: 'টেরাকোটা মাটির রঙ ও সূর্যাস্তের সোনালি আলো',
    fullDescBn: 'গাঢ় পোড়ামাটির ওয়াল আর্ট, গোধূলির সোনালি কমলা আলো ও লং শ্যাডো। উষ্ণতা ও নস্টালজিয়া ছড়ানো লুক।',
    promptBackgroundDesc: 'a rich, seamless terracotta and sun-baked clay earth backdrop with vast open space',
    promptLightingDesc: 'Warm late-afternoon golden hour sunlight casting elongated artistic shadows, infusing the cake with sunset radiance and rustic warmth.'
  },
  {
    id: 'midnight-obsidian',
    nameBn: 'Midnight Obsidian Luxury (অবসিডিয়ান ড্রামা)',
    nameEn: 'Midnight Obsidian Luxury',
    badge: 'গ্যালারি স্পটলাইট',
    previewImg: '/bg_styles/midnight_obsidian.jpg',
    shortDesc: 'জেট-ব্ল্যাক ব্যাকড্রপ ও কেকের ওপর ড্রামাটিক স্পটলাইট',
    fullDescBn: 'আর্ট গ্যালারির মতো পিচ-ব্ল্যাক ক্যানভাস, ওপর থেকে সরু ও উজ্জ্বল স্পটলাইট শুধুই কেককে আলোকিত করে।',
    promptBackgroundDesc: 'a completely seamless, pitch-dark obsidian black void with immense breathing space',
    promptLightingDesc: 'A single, high-contrast overhead theatrical gallery spotlight focusing exclusively on the cake, creating glowing reflections on the gold accents against complete darkness.'
  },
  {
    id: 'mineral-slate',
    nameBn: 'Chiseled Mineral Slate (স্লেট মিনারেল)',
    nameEn: 'Chiseled Mineral Slate',
    badge: 'মিনারেল লুক',
    previewImg: '/bg_styles/mineral_slate.jpg',
    shortDesc: 'স্লেট-গ্রে মুডি দেয়াল ও সিলভার-গোল্ড রিম লাইট',
    fullDescBn: 'পাথুরে ধূসর স্লেট দেয়াল, সূক্ষ্ম সিলভার ও গোল্ডেন রিম লাইটিং। আধুনিক রুক্ষ আভিজাত্য।',
    promptBackgroundDesc: 'a moody, textural slate-gray mineral plaster background with ample uncluttered upper canvas',
    promptLightingDesc: 'Crisp side-directional rim lighting that carves the silhouette of the cake with dual cool-gray and subtle warm-gold edge highlights.'
  },
  {
    id: 'desert-sand',
    nameBn: 'Desert Sand Warm Minimal (মরুবালুর সোনালি রোদ)',
    nameEn: 'Desert Sand Sunlit',
    badge: 'উষ্ণ সানলিট',
    previewImg: '/bg_styles/desert_sand.jpg',
    shortDesc: 'উষ্ণ ডেজার্ট স্যান্ড দেয়াল ও উইন্ডো শ্যাডো',
    fullDescBn: 'মরুভূমির সোনালি বালির রঙের দেয়াল, জানালার শার্প ও নান্দনিক জ্যামিতিক ছায়া। হাই-এন্ড ট্রাভেল ম্যাগাজিন লুক।',
    promptBackgroundDesc: 'a warm, sun-drenched desert-sand textured plaster wall offering massive negative space above',
    promptLightingDesc: 'Sharp architectural window-frame shadows cast across the wall from natural sunlight, framing the cake with dramatic geometric elegance.'
  },
  {
    id: 'velvet-charcoal',
    nameBn: 'Velvet Charcoal Radiance (ভেলভেট চারকোল)',
    nameEn: 'Velvet Charcoal Radiance',
    badge: 'রয়্যাল নাইট',
    previewImg: '/bg_styles/velvet_charcoal.jpg',
    shortDesc: 'ডিপ ভেলভেটি চারকোল ও সফট ডুয়াল-টোন আলো',
    fullDescBn: 'মখমলে চারকোল কালো স্পেস, নরম দ্বিমুখী নরম আলো। কেকের নীল ও সাদা টেক্সচার চোখ ধাঁধানো উজ্জ্বল হয়ে ওঠে।',
    promptBackgroundDesc: 'a deep, velvety charcoal gradient background with seamless luxury texture and generous breathing space',
    promptLightingDesc: 'Delicate dual-source studio fill lighting providing soft luminous highlights across the cake frosting and deep rich shadows.'
  }
];
