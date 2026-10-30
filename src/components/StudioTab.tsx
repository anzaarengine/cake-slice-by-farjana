'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Sliders,
  Shuffle,
  Eye,
  Type,
  Palette
} from 'lucide-react';

type ImageStyleKey = 'dark-cinematic' | 'organic-earth';
type TypoStyleKey = 'brush' | 'fluid' | 'handwritten';

// 60+ Heartfelt, Relatable Bengali Lines categorized by customer emotion
const HEADLINE_VAULT = [
  // ১. প্রিয়জন ও ভালোবাসা (Loved Ones)
  { text: 'প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি', cat: 'love' },
  { text: 'তুমি পাশে আছো বলেই দিনটা এত সুন্দর', cat: 'love' },
  { text: 'ভালোবাসার কথাগুলো একটু মিষ্টিমুখেই হোক', cat: 'love' },
  { text: 'তোমার জন্য একটু বাড়তি ভালোবাসা দিয়ে বেক করা', cat: 'love' },
  { text: 'একটুখানি ভালোবাসা, এক টুকরো কেক', cat: 'love' },
  { text: 'খুশির উপলক্ষ তোমায় ঘিরেই', cat: 'love' },
  { text: 'ভালোবাসা প্রকাশের সবচেয়ে মিষ্টি উপায়', cat: 'love' },
  { text: 'তোমাকে স্পেশাল ফিল করাতে এই ছোট্ট চেষ্টা', cat: 'love' },
  { text: 'মনের মানুষটার পছন্দের সেরা স্বাদ', cat: 'love' },

  // ২. জন্মদিন ও বড় দিন (Birthdays & Celebrations)
  { text: 'আরও একটা বছর সুন্দর স্মৃতি হয়ে থাকুক', cat: 'birthday' },
  { text: 'জন্মদিনের সেরা মুহূর্তটা মিষ্টিমুখেই হোক', cat: 'birthday' },
  { text: 'হাসি-খুশির দিনগুলোতে মিষ্টি ছোঁয়া', cat: 'birthday' },
  { text: 'আজকের দিনটা শুধুই তোমার উদযাপনের', cat: 'birthday' },
  { text: 'বছরের সবচেয়ে স্পেশাল দিনটার জন্য', cat: 'birthday' },
  { text: 'জীবনের নতুন বছরে অনেক অনেক মিষ্টি শুভেচ্ছা', cat: 'birthday' },
  { text: 'উদযাপন হোক মনের মতো', cat: 'birthday' },
  { text: 'বিশেষ দিনের এক মিষ্টি আয়োজন', cat: 'birthday' },
  { text: 'স্মৃতিরা মিষ্টি হয়ে জমুক মনে', cat: 'birthday' },

  // ৩. মান-অভিমান ও মিষ্টি আবদার (Apology & Patch-up)
  { text: 'একটু মিষ্টি মুখে সব রাগ ভুলে যাই, চলো?', cat: 'apology' },
  { text: 'রাগ ভাঙাতে এক টুকরো ভালোবাসা', cat: 'apology' },
  { text: 'অভিমান ভুলে দিনটা মিষ্টি হোক', cat: 'apology' },
  { text: 'একটু মিষ্টি হাসি দেখতেই তো এত আয়োজন!', cat: 'apology' },
  { text: 'ছোট্ট ভুলে মন খারাপ? মিষ্টি খেয়ে মন ভালো করো', cat: 'apology' },
  { text: 'চলো, সব মান-অভিমান আজ মিষ্টিমুখেই শেষ হোক', cat: 'apology' },
  { text: 'তোমার এক টুকরো মিষ্টি হাসির জন্য', cat: 'apology' },

  // ৪. নিজের জন্য ও একটু স্বস্তি (Self-Care & Craving)
  { text: 'সারা দিনের ক্লান্তি শেষে নিজের জন্য একটু মিষ্টি সময়', cat: 'self' },
  { text: 'আজ মন ভালো করার দায়িত্বটা আমাদের', cat: 'self' },
  { text: 'আজকের দিনটা একটু স্পেশাল হোক না!', cat: 'self' },
  { text: 'একটুখানি মিষ্টি সুখ, শুধুই নিজের জন্য', cat: 'self' },
  { text: 'এক টুকরো কেক আর এক কাপ চা—দিনটা তো সুন্দর!', cat: 'self' },
  { text: 'কখনো কখনো নিজের জন্যও একটু মিষ্টি উপহার লাগে', cat: 'self' },
  { text: 'দিনের সেরা মুহূর্ত—নিজের পছন্দের এক স্লাইস', cat: 'self' },
  { text: 'একটু মিষ্টি হলে ক্ষতি কি?', cat: 'self' },

  // ৫. খাঁটি স্বাদ ও ঘরোয়া যত্ন (Taste & Pure Homemade Care)
  { text: 'অতিরিক্ত মিষ্টি নয়, মুখে লেগে থাকার মতো স্বাদ', cat: 'taste' },
  { text: 'ঘরের মানুষের জন্য যেভাবে বানাই, ঠিক ততখানি যত্ন', cat: 'taste' },
  { text: 'মুখে দিলেই একদম মিলিয়ে যায়', cat: 'taste' },
  { text: 'এক স্লাইস খাওয়ার পর মনটা ভরে যাবে', cat: 'taste' },
  { text: 'খাঁটি বাটার আর সেরা চকলেটের নিখুঁত মেলবন্ধন', cat: 'taste' },
  { text: 'অর্ডারের পর তাজা বেক করা পরম যত্ন', cat: 'taste' },
  { text: 'কম মিষ্টি, ভরপুর খাঁটি ফ্লেভার', cat: 'taste' },
  { text: 'স্বাদে কোনো আপস নেই', cat: 'taste' },

  // ৬. আড্ডা, চা ও পরিবার (Family & Adda)
  { text: 'বিকেলের চায়ের সাথে মিষ্টি এক টুকরো আড্ডা', cat: 'family' },
  { text: 'পরিবারের সবাইকে নিয়ে একটু মিষ্টি আনন্দ', cat: 'family' },
  { text: 'আড্ডা জমুক মিষ্টি স্বাদে', cat: 'family' },
  { text: 'একসাথে থাকার আনন্দগুলো মিষ্টি হোক', cat: 'family' },
  { text: 'ছুটির দিনের মিষ্টি আয়োজন', cat: 'family' },
  { text: 'প্রিয় আড্ডায় মিষ্টি ছোঁয়া', cat: 'family' }
];

interface StudioTabProps {
  apiKey?: string;
  onOpenSettings?: () => void;
}

export const StudioTab: React.FC<StudioTabProps> = () => {
  // 1. Three Core Selections: Image Style + Typo Style + Bangla Line
  const [imageStyle, setImageStyle] = useState<ImageStyleKey>('organic-earth');
  const [typoStyle, setTypoStyle] = useState<TypoStyleKey>('fluid');
  const [customHeadline, setCustomHeadline] = useState<string>('প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি');

  // 2. Upload & Canvas State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [cakeScale, setCakeScale] = useState(75);
  const [cakeOffsetY, setCakeOffsetY] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Random Shuffle Headline
  const handleRandomShuffle = () => {
    const list = selectedCategory === 'all' 
      ? HEADLINE_VAULT 
      : HEADLINE_VAULT.filter(i => i.cat === selectedCategory);
    const random = list[Math.floor(Math.random() * list.length)];
    if (random) setCustomHeadline(random.text);
  };

  // Filter headlines by category
  const filteredHeadlines = selectedCategory === 'all'
    ? HEADLINE_VAULT
    : HEADLINE_VAULT.filter(i => i.cat === selectedCategory);

  // Handle Cake Upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // BUILD THE EXACT 100% PROMPT COMBINING ALL THREE ELEMENTS
  const generateDynamicMasterPrompt = () => {
    const headline = customHeadline.trim() || 'প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি';

    // 1. Image Style & Lighting Configuration
    let baseMaterial = '';
    let backgroundDesc = '';
    let lightingDesc = '';

    if (imageStyle === 'dark-cinematic') {
      baseMaterial = 'a hand-carved dark wood block or rough dark stone base';
      backgroundDesc = 'completely empty, seamless pitch-dark charcoal negative space';
      lightingDesc = 'A warm, golden cinematic side-light hits the cake and its complementary base, creating a moody, high-end dramatic atmosphere with rich contrasts and deep shadows.';
    } else {
      // organic-earth (Image 2 style)
      baseMaterial = 'an authentic raw travertine stone slab (natural porous earth stone)';
      backgroundDesc = 'an empty, seamless warm taupe, sand, or light-beige plaster wall, leaving massive breathing space';
      lightingDesc = 'Soft, natural diffused ambient lighting gently illuminates the cake and its unique base, casting realistic delicate shadows with grounded earthy calmness.';
    }

    // 2. Typography Treatment Configuration
    let typoColor = '';
    let typoTreatment = '';
    let subtitleText = '';

    if (typoStyle === 'brush') {
      typoColor = 'an off-white and light-gold dual-tone with 3D embossed depth';
      typoTreatment = 'strictly in the Brush Strokes / Artistic Brush Style, showcasing rough, hand-painted artistic brushwork with visible bristle textures, expressive sweep effects, and subtle 3D shading on the strokes.';
      subtitleText = '~ ARTISANAL LUXURY BAKERY ~';
    } else if (typoStyle === 'fluid') {
      typoColor = 'rich dark-brown and warm bronze/gold liquid tones with natural flow and soft shadow depth';
      typoTreatment = 'strictly in the Fluid / Liquid style, characterized by smooth, organic, boldly curved shapes with natural flow, dynamic loops, and interconnected letters as if written with thick flowing liquid.';
      subtitleText = '~ PREMIUM CAKES ~';
    } else {
      // handwritten
      typoColor = 'dark-brown and subtle gold gradients';
      typoTreatment = 'in an intimate handcrafted calligraphic handwriting style with natural curls, elegant flourishes, whimsical swooshes, and handcrafted dots around the letters.';
      subtitleText = '~ ARTISANAL CONFECTIONERY ~';
    }

    // Full Assembled Master Prompt
    return `An editorial, ultra-premium advertising photograph in a 4:5 aspect ratio, featuring the user's uploaded cake situated strictly in the bottom 25% of the frame. The cake rests on ${baseMaterial}, retaining its authentic original textures, frosting, decorations, and colors in high-fidelity.

The top 75% of the canvas is ${backgroundDesc}. ${lightingDesc}

In the upper spacious background, elegant 3D embossed Bengali typography is prominently featured in ${typoColor}:
- Main Emotional Headline: "${headline}"
- Brand Name directly below: "কেক স্লাইস" (Line 1) and "বাই ফারজানা" (Line 2)
- Typographical Artistic Treatment: ${typoTreatment}
- Small understated English subtitle at bottom: "${subtitleText}"

The image is clean, highly aesthetic, completely devoid of clutter or random props, strictly holding a luxury magazine cover layout. 8k, photorealistic. --ar 4:5`;
  };

  const handleCopyAndOpenGemini = () => {
    const prompt = generateDynamicMasterPrompt();
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    window.open('https://gemini.google.com/app', '_blank');
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  // Render Live Canvas Preview synchronized with selections
  const renderCanvasPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 864;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const isDark = imageStyle === 'dark-cinematic';

    // 1. Background
    if (isDark) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0F0E11');
      grad.addColorStop(0.5, '#15131A');
      grad.addColorStop(1, '#0A090C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const light = ctx.createRadialGradient(width * 0.85, height * 0.7, 50, width * 0.7, height * 0.75, 600);
      light.addColorStop(0, 'rgba(235, 185, 100, 0.22)');
      light.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Warm taupe plaster (Image 2 style)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#EAE1D0');
      grad.addColorStop(0.3, '#E4D9C7');
      grad.addColorStop(0.7, '#DDCFBA');
      grad.addColorStop(1, '#D5C4AC');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const light = ctx.createRadialGradient(width * 0.5, height * 0.35, 100, width * 0.5, height * 0.5, 600);
      light.addColorStop(0, 'rgba(255, 252, 245, 0.4)');
      light.addColorStop(1, 'rgba(0,0,0,0.02)');
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Pedestal Slab (Wood or Travertine)
    const slabX = width * 0.22;
    const slabY = height * 0.75;
    const slabW = width * 0.56;
    const slabH = height * 0.08;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.filter = 'blur(16px)';
    ctx.fillRect(slabX + 10, slabY + slabH - 5, slabW - 20, 25);
    ctx.restore();

    if (isDark) {
      const slabGrad = ctx.createLinearGradient(slabX, slabY, slabX + slabW, slabY);
      slabGrad.addColorStop(0, '#1E140C');
      slabGrad.addColorStop(0.5, '#2D1F13');
      slabGrad.addColorStop(1, '#1A110A');
      ctx.fillStyle = slabGrad;
      ctx.fillRect(slabX, slabY, slabW, slabH);
    } else {
      const slabGrad = ctx.createLinearGradient(slabX, slabY, slabX + slabW, slabY);
      slabGrad.addColorStop(0, '#D6C5AD');
      slabGrad.addColorStop(0.3, '#E6D7C2');
      slabGrad.addColorStop(0.7, '#E0D0B9');
      slabGrad.addColorStop(1, '#CDBAA1');
      ctx.fillStyle = slabGrad;
      ctx.fillRect(slabX, slabY, slabW, slabH);

      ctx.fillStyle = 'rgba(120, 100, 80, 0.12)';
      ctx.fillRect(slabX + 20, slabY + 10, 45, 6);
      ctx.fillRect(slabX + 120, slabY + 25, 60, 8);
    }

    // 3. Cake
    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        const cakeSize = (width * 0.44 * cakeScale) / 100;
        const cakeX = (width - cakeSize) / 2;
        const cakeY = slabY - cakeSize + 15 + cakeOffsetY;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(width / 2, slabY + 6, cakeSize * 0.46, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.filter = 'blur(10px)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cakeX, cakeY, cakeSize, cakeSize, 16);
        ctx.clip();
        ctx.drawImage(img, cakeX, cakeY, cakeSize, cakeSize);
        ctx.restore();

        drawTypography(ctx, width, height, isDark);
      };
    } else {
      drawTypography(ctx, width, height, isDark);
    }
  };

  const drawTypography = (ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) => {
    ctx.save();
    ctx.textAlign = 'center';
    const textY = height * 0.24;

    // Line 1: Emotional Headline
    ctx.font = typoStyle === 'handwritten' 
      ? 'italic bold 42px "Playfair Display", "Anek Bangla", cursive'
      : 'bold 44px "Playfair Display", "Anek Bangla", serif';
    ctx.fillStyle = isDark ? '#FFF4D6' : '#3E2419';
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(62, 36, 25, 0.2)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;
    ctx.fillText(`“${customHeadline}”`, width / 2, textY);

    // Line 2: Brand Name "কেক স্লাইস"
    if (typoStyle === 'brush') {
      ctx.font = 'bold 78px "Playfair Display", "Anek Bangla", serif';
      ctx.fillStyle = isDark ? '#DFBA75' : '#5A3D28';
    } else if (typoStyle === 'fluid') {
      ctx.font = 'bold 76px "Playfair Display", "Anek Bangla", serif';
      ctx.fillStyle = isDark ? '#F5E4C3' : '#4E2F1F';
    } else {
      ctx.font = 'italic bold 74px "Anek Bangla", cursive, serif';
      ctx.fillStyle = isDark ? '#F5E4C3' : '#3C2A1E';
    }

    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fillText('কেক স্লাইস', width / 2, textY + 85);

    // Line 3: "বাই ফারজানা"
    ctx.font = typoStyle === 'handwritten'
      ? 'italic 600 42px "Anek Bangla", cursive'
      : '600 42px "Anek Bangla", sans-serif';
    ctx.fillStyle = isDark ? '#EEDBB2' : '#6A452F';
    ctx.fillText('বাই ফারজানা', width / 2, textY + 145);

    // Subtitle
    ctx.font = '500 15px sans-serif';
    ctx.fillStyle = isDark ? 'rgba(223, 186, 117, 0.85)' : 'rgba(94, 60, 39, 0.75)';
    ctx.shadowBlur = 0;
    const subText = typoStyle === 'brush' 
      ? '~ ARTISANAL LUXURY BAKERY ~' 
      : typoStyle === 'fluid' 
      ? '~ PREMIUM CAKES ~' 
      : '~ ARTISANAL CONFECTIONERY ~';
    ctx.fillText(subText, width / 2, textY + 195);

    ctx.restore();
  };

  useEffect(() => {
    renderCanvasPreview();
  }, [uploadedImage, imageStyle, typoStyle, customHeadline, cakeScale, cakeOffsetY]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.download = `Cake-Slice-by-Farjana-${imageStyle}-${typoStyle}.jpg`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: 4-Step Master Selection Matrix (6 cols) */}
      <div className="lg:col-span-6 space-y-4">

        {/* STEP 1: Upload Photo */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">1</span>
              কেকের ছবি দিন
            </span>
            {uploadedImage && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> ছবি লোড হয়েছে
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer w-full p-3 border-2 border-dashed rounded-xl transition-all text-center flex items-center justify-center gap-3 ${
              uploadedImage
                ? 'border-[#DFBA75]/60 bg-[#1A1722]'
                : 'border-[#332F3D] hover:border-[#DFBA75]/80 bg-[#100F13] hover:bg-[#16141A]'
            }`}
          >
            {uploadedImage ? (
              <div className="flex items-center gap-3 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage}
                  alt="Uploaded Cake"
                  className="w-12 h-12 object-cover rounded-lg border border-[#DFBA75]/40"
                />
                <div className="text-left flex-1">
                  <div className="text-xs font-semibold text-zinc-100">কেকের ছবি পাওয়া গেছে</div>
                  <div className="text-[10px] text-zinc-400">ছবি পরিবর্তন করতে এখানে ক্লিক করুন</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-zinc-300 text-xs py-1">
                <Upload className="w-5 h-5 text-[#DFBA75]" />
                <span>কেকের কাঁচা ছবি আপলোড করুন</span>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: Image & Background Style */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-4 shadow-xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">2</span>
            ইমেজ ও ব্যাকগ্রাউন্ড স্টাইল
          </span>

          <div className="grid grid-cols-2 gap-3">
            {/* Style 2: Organic Earth */}
            <button
              onClick={() => setImageStyle('organic-earth')}
              className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                imageStyle === 'organic-earth'
                  ? 'border-[#DFBA75] bg-[#1E1A26] shadow-[0_0_20px_rgba(223,186,117,0.2)]'
                  : 'border-[#26242B] bg-[#0E0D10] opacity-80 hover:opacity-100 hover:border-zinc-700'
              }`}
            >
              {/* Visual Image Preview */}
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-2 relative border border-[#DFBA75]/20 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/preview-earth-tone.jpg"
                  alt="Organic Earth Tone Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-[9px] text-[#DFBA75] font-semibold px-1.5 py-0.5 rounded-md border border-[#DFBA75]/30">
                  ২নং ছবির আসল লুক
                </span>
              </div>

              <div className="text-xs font-bold text-zinc-100">Organic Earth Tone</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">ট্রাভার্টিন মার্বেল স্ল্যাব ও ওয়ার্ম বেইজ প্লাস্টার দেয়াল</div>
              {imageStyle === 'organic-earth' && (
                <div className="absolute right-3 top-3 w-2.5 h-2.5 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
              )}
            </button>

            {/* Style 1: Dark Cinematic */}
            <button
              onClick={() => setImageStyle('dark-cinematic')}
              className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                imageStyle === 'dark-cinematic'
                  ? 'border-[#DFBA75] bg-[#1E1A26] shadow-[0_0_20px_rgba(223,186,117,0.2)]'
                  : 'border-[#26242B] bg-[#0E0D10] opacity-80 hover:opacity-100 hover:border-zinc-700'
              }`}
            >
              {/* Visual Image Preview */}
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-2 relative border border-[#DFBA75]/20 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/preview-dark-cinematic.jpg"
                  alt="Dark Cinematic Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-[9px] text-[#DFBA75] font-semibold px-1.5 py-0.5 rounded-md border border-[#DFBA75]/30">
                  ডার্ক ও গোল্ডেন লুক
                </span>
              </div>

              <div className="text-xs font-bold text-zinc-100">Dark & Warm Cinematic</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">কালো চারকোল ব্যাকগ্রাউন্ড ও ড্রামাটিক সোনালি আলো</div>
              {imageStyle === 'dark-cinematic' && (
                <div className="absolute right-3 top-3 w-2.5 h-2.5 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
              )}
            </button>
          </div>
        </div>

        {/* STEP 3: Typography Style Selector */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-4 shadow-xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">3</span>
            বাংলা টাইপোগ্রাফির শৈল্পিক ধরন (Typo Style)
          </span>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'fluid', title: 'Fluid / Liquid', desc: 'তরল চকলেট ও সোনালি কার্ভ (২নং ছবির মতো)' },
              { id: 'brush', title: 'Artistic Brush', desc: 'তুলির সোনালি-সাদা ৩ডি টান ও টেক্সচার' },
              { id: 'handwritten', title: 'Handwritten', desc: 'হাতে আঁকা নান্দনিক ক্যালিগ্রাফি সিগনেচার' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypoStyle(t.id as TypoStyleKey)}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  typoStyle === t.id
                    ? 'border-[#DFBA75] bg-[#1E1A26] text-[#DFBA75]'
                    : 'border-[#26242B] bg-[#0E0D10] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-[11px] font-bold text-zinc-100 truncate">{t.title}</div>
                <div className="text-[9px] text-zinc-400 mt-0.5 leading-tight">{t.desc}</div>
                {typoStyle === t.id && (
                  <div className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-[#DFBA75]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 4: Emotional Bengali Headline Selection */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-4 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">4</span>
              আবেগঘন বাংলা হেডলাইন (Headline Vault)
            </span>

            <button
              onClick={handleRandomShuffle}
              className="py-1 px-2.5 bg-[#1F1B26] hover:bg-[#2A2434] border border-[#DFBA75]/30 text-[10px] font-semibold text-[#DFBA75] rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Shuffle className="w-3 h-3" />
              <span>🎲 র‍্যান্ডম বদলান</span>
            </button>
          </div>

          {/* Active Editable Input */}
          <div className="p-2 rounded-xl bg-[#0E0D10] border border-[#DFBA75]/40 flex items-center gap-2">
            <span className="text-xs">✍️</span>
            <input
              type="text"
              value={customHeadline}
              onChange={(e) => setCustomHeadline(e.target.value)}
              placeholder="যেকোনো লাইন সিলেক্ট করুন বা নিজে লিখুন..."
              className="w-full bg-transparent text-xs text-[#DFBA75] font-semibold focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-none">
            {[
              { id: 'all', label: 'সব' },
              { id: 'love', label: '❤️ প্রিয়জন' },
              { id: 'birthday', label: '🎂 জন্মদিন' },
              { id: 'apology', label: '🥺 মান-অভিমান' },
              { id: 'self', label: '☕ নিজের ট্রিট' },
              { id: 'taste', label: '✨ খাঁটি স্বাদ' },
              { id: 'family', label: '👨‍👩‍👧 আড্ডা' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#DFBA75] text-black font-bold'
                    : 'bg-[#18161D] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Headline Selector List */}
          <div className="max-h-36 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {filteredHeadlines.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCustomHeadline(item.text)}
                className={`w-full text-left p-1.5 rounded-lg text-[11px] transition-all border ${
                  customHeadline === item.text
                    ? 'bg-[#DFBA75]/15 border-[#DFBA75] text-[#DFBA75] font-semibold'
                    : 'bg-[#0E0D10] border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-[#16141A]'
                }`}
              >
                “{item.text}”
              </button>
            ))}
          </div>
        </div>

        {/* STEP 5: Live Synthesized Prompt Action */}
        <div className="space-y-2">
          <button
            onClick={handleCopyAndOpenGemini}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#DFBA75] via-[#F4D998] to-[#C99C47] text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-black" />
            <span>প্রম্পট কপি করে Gemini Pro-তে যান (২নং ছবির মতো তৈরি করুন)</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>

          <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
            ⚡ <strong>সিস্টেম গ্যারান্টি:</strong> আপনার পছন্দ করা <strong>ইমেজ স্টাইল + টাইপো স্টাইল + বাংলা হেডলাইন</strong> একসাথে নিখুঁতভাবে মার্জ হয়ে মাস্টার প্রম্পট তৈরি হয়ে গেছে। বাটনে চাপ দিয়ে Gemini চ্যাটে পেস্ট করলেই ২নং ছবির মতো ছবি তৈরি হয়ে যাবে!
          </p>
        </div>

      </div>

      {/* RIGHT: Live 4:5 Poster Preview (6 cols) */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-[440px] bg-[#0A0A0C] border border-[#2A2832] rounded-3xl p-4 shadow-2xl relative">
          
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-semibold tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              লাইভ প্রিভিউ (৪:৫ রেশিও)
            </span>
            <div className="flex gap-1">
              <span className="text-[9px] text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20">
                {imageStyle === 'organic-earth' ? 'Earth' : 'Cinematic'}
              </span>
              <span className="text-[9px] text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20 capitalize">
                {typoStyle}
              </span>
            </div>
          </div>

          {/* Canvas Rendering Frame */}
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-2xl bg-[#0F0E11] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
          </div>

          {/* Action Buttons Below Frame */}
          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl font-bold text-xs bg-[#DFBA75] hover:bg-[#E8C885] text-black shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>ছবি ডাউনলোড করুন</span>
            </button>

            <button
              onClick={handleCopyAndOpenGemini}
              className="py-3 px-4 bg-[#18161E] hover:bg-[#231F2C] border border-[#3A3545] text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">প্রম্পট কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#DFBA75]" />
                  <span>কপি 8K প্রম্পট</span>
                </>
              )}
            </button>
          </div>

          {/* Sliders for fine-tuning */}
          {uploadedImage && (
            <div className="mt-3 p-2.5 bg-[#131217] border border-[#26242B] rounded-xl flex items-center justify-between text-[11px] text-zinc-400">
              <span>কেকের সাইজ: {cakeScale}%</span>
              <input
                type="range"
                min="50"
                max="100"
                value={cakeScale}
                onChange={(e) => setCakeScale(Number(e.target.value))}
                className="accent-[#DFBA75] w-32"
              />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
