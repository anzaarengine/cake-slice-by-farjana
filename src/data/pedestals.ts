export interface PedestalItem {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  badge?: string;
  previewImg: string;
  description: string;
  promptDescription: string;
}

export const PEDESTAL_OPTIONS: PedestalItem[] = [
  {
    id: 'auto',
    nameBn: 'স্মার্ট অটো-সিলেক্ট',
    nameEn: 'Smart Contextual Base',
    icon: '✨',
    badge: 'রিকমেন্ডেড',
    previewImg: '/pedestal_previews/auto.jpg',
    description: 'কেকের কালার ও ডিজাইন অনুযায়ী এআই নিজে সবচেয়ে মানানসই বেস বেছে নেবে',
    promptDescription: 'a complementary bespoke natural base dynamically chosen to elevate the cake\'s authentic colors and design—such as a hand-carved dark wood block, a raw travertine slab, a matte artisanal ceramic platter, or a light-oak timber block, ensuring the placement looks organic and never repetitive'
  },
  {
    id: 'dark-wood',
    nameBn: 'হ্যান্ড-কার্ভড ডার্ক ওক কাঠ',
    nameEn: 'Hand-Carved Dark Oak Wood',
    icon: '🪵',
    badge: 'লকড ফেভারিট',
    previewImg: '/pedestal_previews/dark_wood.jpg',
    description: 'অভিজাত ডার্ক উড ব্লক, প্রাকৃতিক কাঠের আঁশ ও সূক্ষ্ম অয়েল ফিনিশ',
    promptDescription: 'a bespoke hand-carved dark oak wood block with rich organic wood grains and a subtle matte oiled finish'
  },
  {
    id: 'travertine',
    nameBn: 'র ট্রাভার্টিন মার্বেল স্ল্যাব',
    nameEn: 'Raw Travertine Stone Slab',
    icon: '🏛️',
    badge: 'লকড ফেভারিট',
    previewImg: '/pedestal_previews/travertine.jpg',
    description: 'প্রাকৃতিক ছিদ্রযুক্ত অর্গানিক মার্বেল পাথর, শান্ত ও মাটির কাছাকাছি লুক',
    promptDescription: 'a raw, light-cream travertine marble slab with natural porous textures and unpolished organic edges'
  },
  {
    id: 'ceramic',
    nameBn: 'ম্যাট ব্ল্যাক সিরামিক পেডেস্টাল',
    nameEn: 'Matte Black Artisanal Ceramic',
    icon: '🪨',
    badge: 'মডার্ন গ্যালারি',
    previewImg: '/pedestal_previews/ceramic.jpg',
    description: 'ম্যাট ব্ল্যাক সিরামিক প্ল্যাটফর্ম, প্রিমিয়াম ড্রামাটিক আর্ট গ্যালারি ভাইব',
    promptDescription: 'a handcrafted minimalist matte black ceramic pedestal with a smooth non-reflective artisanal glaze'
  },
  {
    id: 'light-oak',
    nameBn: 'স্ক্যান্ডিনেভিয়ান লাইট-ওক টিম্বার',
    nameEn: 'Scandinavian Light Oak',
    icon: '🪵',
    badge: 'নর্ডিক মিনিমাল',
    previewImg: '/pedestal_previews/light_oak.jpg',
    description: 'হালকা ও উজ্জ্বল ওক কাঠ, পরিপাটি ও প্রশান্ত নর্ডিক ফিল',
    promptDescription: 'a clean, architecturally minimal light-oak timber block showcasing warm Scandinavian natural wood grain'
  },
  {
    id: 'terracotta',
    nameBn: 'অর্গানিক পোড়ামাটি / টেরাকোটা',
    nameEn: 'Artisanal Terracotta Platter',
    icon: '🏺',
    badge: 'ঐতিহ্যবাহী মাটি',
    previewImg: '/pedestal_previews/terracotta.jpg',
    description: 'গ্রামবাংলার মাটির উষ্ণতা, পোড়ামাটির অর্গানিক টেক্সচার্ড থালা',
    promptDescription: 'a rustic handcrafted natural terracotta clay platter with warm terracotta earth textures'
  },
  {
    id: 'slate-stone',
    nameBn: 'খোদাই করা স্লেট পাথর',
    nameEn: 'Chiseled Dark Slate Stone',
    icon: '⛰️',
    badge: 'মিনারেল রক',
    previewImg: '/pedestal_previews/slate_stone.jpg',
    description: 'রুক্ষ ও শক্ত স্লেট পাথর, আধুনিক মিনারেল আর্কিটেকচারাল লুক',
    promptDescription: 'a heavy, chiseled dark mineral slate stone block with rugged layered natural edges'
  }
];
