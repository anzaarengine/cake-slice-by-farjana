export type BrandNicheKey = 'bakery' | 'jewelry' | 'cosmetics' | 'fashion' | 'beverage' | 'general';

export interface BrandProfile {
  id: string;
  nameBn: string;
  nameEn: string;
  niche: BrandNicheKey;
  icon: string;
  tagline: string;
  productTypeBn: string;
  productTypeEn: string;
  preservationPrompt: string;
  defaultHeadlines: Array<{ text: string; cat: string }>;
  accentColor: string;
  isCustom?: boolean;
}

export const INITIAL_BRANDS: BrandProfile[] = [
  {
    id: 'cake-slice',
    nameBn: 'কেক স্লাইস বাই ফারজানা',
    nameEn: 'Cake Slice by Farjana',
    niche: 'bakery',
    icon: '🍰',
    tagline: 'আর্টিসানাল লাক্সারি কেক ও মিষ্টান্ন',
    productTypeBn: 'কেক ও মিষ্টান্ন',
    productTypeEn: 'Bespoke Celebration Cake',
    preservationPrompt: 'frosting textures, piping decorations, custom colors, chocolate lettering, and topper details in authentic high-fidelity without AI distortion',
    accentColor: '#DFBA75',
    defaultHeadlines: [
      { text: 'এক চিলতে মিষ্টি হাসি', cat: 'love' },
      { text: 'একটু বাড়তি যত্ন', cat: 'love' },
      { text: 'ভালোবাসার খাঁটি স্বাদ', cat: 'love' },
      { text: 'আজকের দিনটি শুধুই তোমার', cat: 'birthday' },
      { text: 'অভিমান ভাঙুক মিষ্টিতে', cat: 'apology' },
      { text: 'একটি কামড়েই মন ভালো', cat: 'self' },
      { text: 'খাঁটি স্বাদের পরম তৃপ্তি', cat: 'taste' },
      { text: 'পরিবারের মিষ্টি আনন্দ', cat: 'family' }
    ]
  },
  {
    id: 'aura-jewelry',
    nameBn: 'অউরা লাক্সারি জুয়েলারি',
    nameEn: 'Aura Fine Jewelry',
    niche: 'jewelry',
    icon: '💎',
    tagline: 'হাতে গড়া খাঁটি স্বর্ণ ও ডায়মন্ড অলঙ্কার',
    productTypeBn: 'অলঙ্কার ও জুয়েলারি',
    productTypeEn: 'Handcrafted Fine Jewelry',
    preservationPrompt: 'gold karat luster, precision gemstone facet cuts, brilliant diamond light refraction, claw settings, and flawless metal polishing without AI distortion',
    accentColor: '#60A5FA',
    defaultHeadlines: [
      { text: 'চিরন্তন ভালোবাসার খাঁটি রূপ', cat: 'love' },
      { text: 'আভিজাত্যে মোড়ানো প্রতিটি পল', cat: 'taste' },
      { text: 'আজকের দিনটি তোমার আলোয় উজ্জ্বল', cat: 'birthday' },
      { text: 'সম্পর্কের এক অনন্য বন্ধন', cat: 'anniversary' },
      { text: 'হৃদয়ের সবচেয়ে দামি উপহার', cat: 'love' },
      { text: 'রাজকীয় আভিজাত্যের নিখুঁত রূপ', cat: 'taste' },
      { text: 'স্মৃতিরা হয়ে থাকুক স্বর্ণালি', cat: 'anniversary' }
    ]
  },
  {
    id: 'royal-oud',
    nameBn: 'রয়্যাল ঔদ আতর ও পারফিউম',
    nameEn: 'Royal Oud Luxury Fragrance',
    niche: 'cosmetics',
    icon: '🧴',
    tagline: 'অভিজাত সুবাস ও অর্গানিক ফ্র্যাগ্রেন্স',
    productTypeBn: 'পারফিউম ও সুবাস',
    productTypeEn: 'Artisanal Perfume Flacon',
    preservationPrompt: 'fluted crystal glass transparency, warm amber liquid depth, engraved metallic cap finish, and embossed luxury bottle typography without AI distortion',
    accentColor: '#F59E0B',
    defaultHeadlines: [
      { text: 'একটি সুবাসেই মন কেড়ে নেওয়া', cat: 'love' },
      { text: 'আভিজাত্যের নিজস্ব এক ঘ্রাণ', cat: 'taste' },
      { text: 'স্মৃতিতে বেঁচে থাকুক এই সুবাস', cat: 'love' },
      { text: 'প্রতিটি ফোঁটায় রাজকীয় স্পর্শ', cat: 'taste' },
      { text: 'নিজের ভালোলাগার শ্রেষ্ঠ উপহার', cat: 'self' },
      { text: 'অনবদ্য এক মিষ্টি মুগ্ধতা', cat: 'love' }
    ]
  },
  {
    id: 'heritage-attire',
    nameBn: 'ঐতিহ্য জামদানি ও ফ্যাশন',
    nameEn: 'Heritage Handloom Silk & Attire',
    niche: 'fashion',
    icon: '👗',
    tagline: 'বাংলার ঐতিহ্যবাহী সুতা ও আধুনিক ডিজাইন',
    productTypeBn: 'পোশাক ও শাড়ি',
    productTypeEn: 'Handloom Silk & Attire',
    preservationPrompt: 'handwoven fabric weave patterns, delicate zari metallic embroidery threads, natural textile drape, and authentic color shades without AI distortion',
    accentColor: '#EC4899',
    defaultHeadlines: [
      { text: 'উৎসবে তুমি অনন্য সুন্দর', cat: 'celebration' },
      { text: 'ঐতিহ্যের এক অপূর্ব পুনর্জন্ম', cat: 'taste' },
      { text: 'স্নিগ্ধ সাজে ভালোবাসার মানুষটি', cat: 'love' },
      { text: 'আভিজাত্যে মোড়ানো খাঁটি বাঙালিয়ানা', cat: 'taste' },
      { text: 'বিশেষ দিনের বিশেষ এক রূপ', cat: 'celebration' },
      { text: 'ভালোবাসার রঙের রেশমি ছোঁয়া', cat: 'love' }
    ]
  },
  {
    id: 'artisan-coffee',
    nameBn: 'আর্টিসান কফি রোস্টার্স',
    nameEn: 'Artisan Coffee Roasters',
    niche: 'beverage',
    icon: '☕',
    tagline: 'তাজা রোস্টেড প্রিমিয়াম কফি বিন ও বেভারেজ',
    productTypeBn: 'কফি ও পানীয়',
    productTypeEn: 'Specialty Roasted Coffee Cup',
    preservationPrompt: 'rich golden crema texture, ceramic cup glaze, micro-foam latte art geometry, and warm beverage steam without AI distortion',
    accentColor: '#B45309',
    defaultHeadlines: [
      { text: 'এক চুমুকেই মন চাঙা', cat: 'self' },
      { text: 'ক্লান্ত দিনের পরম স্বস্তি', cat: 'self' },
      { text: 'আড্ডা জমুক কফির কাপে', cat: 'celebration' },
      { text: 'খাঁটি কফি বিনের আসল সুবাস', cat: 'taste' },
      { text: 'বৃষ্টিভেজা বিকেলের মিষ্টি সঙ্গী', cat: 'love' }
    ]
  }
];
