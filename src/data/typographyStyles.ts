export interface TypographyStyleItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'locked' | 'modern' | 'classic';
  isLocked?: boolean;
  badge?: string;
  previewImg: string;
  description: string;
  treatmentPrompt: string;
}

export const TYPOGRAPHY_STYLES: TypographyStyleItem[] = [
  // --- The 3 Chat 2 Locked Favorites ---
  {
    id: 'brush',
    nameBn: 'তুলির টান (Artistic Brush)',
    nameEn: 'Artistic Brush Stroke',
    category: 'locked',
    isLocked: true,
    badge: 'লক করা প্রিয় #১',
    previewImg: '/typo_previews/brush_stroke.png',
    description: 'সাদা ও সোনালি তুলির টান, ব্রিসল টেক্সচার ও সূক্ষ্ম ৩D শেড',
    treatmentPrompt: 'Brush Strokes / Artistic Brush style in off-white and rich light-gold dual tones. The letters feature rough, hand-painted artistic brushwork with authentic visible bristle textures, expressive sweep effects, dynamic paint strokes, and subtle 3D shading that casts soft shadows on the background.'
  },
  {
    id: 'fluid',
    nameBn: 'তরল ও ফ্লুইড (Fluid / Liquid)',
    nameEn: 'Fluid Liquid Elegance',
    category: 'locked',
    isLocked: true,
    badge: 'লক করা প্রিয় #২',
    previewImg: '/typo_previews/liquid.png',
    description: 'ডার্ক চকলেট ও ওয়ার্ম গোল্ডের মসৃণ, বাঁকানো তরল প্রবাহ',
    treatmentPrompt: 'Fluid / Liquid style in rich dark-brown chocolate and warm honey gold tones. The letterforms are smooth, organic, and boldly curved with a natural flowing liquid viscosity, dynamic interconnected loops, and glossy highlights as if drawn with warm molten chocolate.'
  },
  {
    id: 'handwritten',
    nameBn: 'হাতে আঁকা ক্যালিগ্রাফি (Handwritten)',
    nameEn: 'Handwritten Artisanal Calligraphy',
    category: 'locked',
    isLocked: true,
    badge: 'লক করা প্রিয় #৩',
    previewImg: '/typo_previews/handwritten.png',
    description: 'ক্যালিগ্রাফিক সিগনেচার কার্লস, স্বুশ ও আন্তরিক পার্সোনালাইজড ফিল',
    treatmentPrompt: 'Handwritten / "হাতে আঁকা" artisanal calligraphy in espresso dark-brown and subtle gold gradients. Featuring expressive handwritten curls, delicate swooshes, artisanal flourishes, and intimate personalized signature flair that feels custom made and heartfelt.'
  },

  // --- Modern Contemporary Collection from Gemini Chat Samples ---
  {
    id: 'minimal',
    nameBn: 'মিনিমাল এলিগেন্স (Minimal Modern)',
    nameEn: 'Minimal Sans Elegance',
    category: 'modern',
    badge: 'হাই-ফ্যাশন',
    previewImg: '/typo_previews/minimal.png',
    description: 'স্লিক, জ্যামিতিক, আল্ট্রা-থিন হাই-ফ্যাশন এডিটোরিয়াল ফন্ট',
    treatmentPrompt: 'Minimal modern geometric sans-serif typography in matte white and champagne gold. Ultra-sleek, clean hairline strokes, generous letter-spacing, and architectural precision with zero extraneous flourishes for an understated luxury magazine feel.'
  },
  {
    id: '3d_modern',
    nameBn: 'ত্রিমাত্রিক ভলিউম (3D Modern Extrusion)',
    nameEn: '3D Modern Volumetric',
    category: 'modern',
    badge: 'বোল্ড ও পপ',
    previewImg: '/typo_previews/3d_modern.png',
    description: 'বোল্ড ভলিউমেট্রিক এক্সট্রুশন, সফট বেভেল ও অ্যাম্বিয়েন্ট ড্রপ শ্যাডো',
    treatmentPrompt: '3D Modern volumetric typography in warm champagne gold and deep bronze. Features soft rounded bevels, tactile extrusion, smooth lighting gradients, and floating ambient drop shadows creating genuine physical depth on the wall.'
  },
  {
    id: 'curves',
    nameBn: 'বক্রতা ও নান্দনিক রেখা (Curves)',
    nameEn: 'Organic Aesthetic Curves',
    category: 'modern',
    previewImg: '/typo_previews/curves.png',
    description: 'মসৃণ ও ছন্দময় নান্দনিক বাঁক, গভীর শৈল্পিক কার্ভস',
    treatmentPrompt: 'Organic curved modern typography with flowing elongated swashes, fluid transitions, and balanced geometric curves in warm cream and metallic bronze tones.'
  },
  {
    id: 'kinetic',
    nameBn: 'কাইনেটিক গতিশীল (Kinetic Motion)',
    nameEn: 'Kinetic Dynamic Motion',
    category: 'modern',
    previewImg: '/typo_previews/kinetic.png',
    description: 'গতিময় ও ছন্দময় আধুনিক টাইপো, আধুনিক ভিজ্যুয়াল মোশন',
    treatmentPrompt: 'Kinetic modern typography with dynamic italicized angles, subtle motion blur trails on the edges, and overlapping rhythmic letterforms in warm ochre and crisp white.'
  },
  {
    id: 'folk_fusion',
    nameBn: 'ফোক ফিউশন (Folk Fusion & Alpona)',
    nameEn: 'Folk Art Fusion',
    category: 'modern',
    previewImg: '/typo_previews/folk_fusion.png',
    description: 'ঐতিহ্যবাহী আলপনা মোটিফের সাথে আধুনিক মিনিমালিজমের মিশ্রণ',
    treatmentPrompt: 'Contemporary Folk-Fusion typography that marries traditional Bengali alpona motifs with sleek modern lines in warm terracotta, cream, and fine gold filigree lines.'
  },
  {
    id: 'neon',
    nameBn: 'নিয়ন অ্যাম্বিয়েন্ট গ্লো (Neon Ambient)',
    nameEn: 'Neon Ambient Glow',
    category: 'modern',
    previewImg: '/typo_previews/neon.png',
    description: 'সোনালি নিয়ন আলো ও মৃদু অ্যাম্বিয়েন্ট হলো এফেক্ট',
    treatmentPrompt: 'Warm golden ambient neon typography with a subtle, soft-glowing halo around the letterforms, creating a luminous, sophisticated evening glow on the dark backdrop.'
  },
  {
    id: 'futuristic',
    nameBn: 'ফিউচারিস্টিক মেটালিক (Futuristic)',
    nameEn: 'Futuristic Metallic',
    category: 'modern',
    previewImg: '/typo_previews/futuristic.png',
    description: 'শার্প কাট, অ্যাঙ্গুলার মেটালিক ফিনিশ ও সাইবার টাচ',
    treatmentPrompt: 'Futuristic geometric typography featuring sharp angular cuts, sleek metallic gold and chrome reflections, and minimal cybernetic ligatures.'
  },

  // --- Classic, Royal & Expressive Styles ---
  {
    id: 'calligraphy_royal',
    nameBn: 'রাজকীয় ক্যালিগ্রাফি (Royal Calligraphy)',
    nameEn: 'Royal Calligraphy',
    category: 'classic',
    badge: 'রাজকীয় আভিজাত্য',
    previewImg: '/typo_previews/calligraphy_royal.png',
    description: 'আভিজাত্যপূর্ণ সোনালি কার্লস, ঐতিহ্য ও আধুনিকতার মেলবন্ধন',
    treatmentPrompt: 'Regal royal calligraphy in warm reflective gold leaf. Elaborate sweeping flourishes, graceful ligatures, balanced top matra bars, and classic regal grandeur.'
  },
  {
    id: 'cinematic_drama',
    nameBn: 'সিনেম্যাটিক গোল্ড (Cinematic Drama 3D)',
    nameEn: 'Cinematic Gold Drama',
    category: 'classic',
    previewImg: '/typo_previews/cinematic_drama.png',
    description: 'মুভি পোস্টার ফ্ল্যায়ার, গাঢ় সোনালি টেক্সচার ও গভীর ছায়া',
    treatmentPrompt: 'Cinematic dramatic typography with heavy golden metallic textures, chipped-edge depth, and dramatic directional spotlight highlights.'
  },
  {
    id: 'dhrupodi_classic',
    nameBn: 'ধ্রুপদী ট্র্যাডিশনাল (Dhrupodi Classic)',
    nameEn: 'Dhrupodi Traditional Serif',
    category: 'classic',
    previewImg: '/typo_previews/dhrupodi_classic.png',
    description: 'প্রাচীন ও ক্ল্যাসিক মার্জিত হরফ, পুরনো বইয়ের শৈলী',
    treatmentPrompt: 'Dhrupodi classic traditional Bengali typography reminiscent of antique luxury book-cover titles with elegant serifs and timeless vintage balance in ivory white.'
  },
  {
    id: 'alpona_folk',
    nameBn: 'আলপনা ফোক আর্ট (Alpona Folk)',
    nameEn: 'Alpona Traditional Folk',
    category: 'classic',
    previewImg: '/typo_previews/alpona_folk.png',
    description: 'গ্রামবাংলার ঐতিহ্যবাহী আলপনা আঁকা কারুকাজ ও লতাগুল্ম',
    treatmentPrompt: 'Traditional Alpona folk typography decorated with organic paisley curves, dots, and natural flora ornaments in soft off-white and chalky earth tones.'
  },
  {
    id: 'retro_vintage',
    nameBn: 'রেট্রো ভিন্টেজ (Retro Vintage)',
    nameEn: 'Retro Vintage Shadow',
    category: 'classic',
    previewImg: '/typo_previews/retro_vintage.png',
    description: 'মিড-সেঞ্চুরি ক্লাসিক লুক, ডাবল আউটলাইন ও ড্রপ শ্যাডো',
    treatmentPrompt: 'Retro vintage mid-century typography featuring bold warm outlines, dimensional block drop-shadows, and a warm nostalgic palette.'
  }
];
