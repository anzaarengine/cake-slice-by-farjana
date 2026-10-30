'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Save, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Layers, 
  Palette, 
  Tag, 
  ArrowRight,
  Info,
  Wand2,
  RefreshCw,
  Building2
} from 'lucide-react';
import { BrandProfile, BrandNicheKey } from '@/data/brands';
import { AuthSession } from '@/types/auth';

interface BrandSetupViewProps {
  session: AuthSession;
  activeBrand: BrandProfile;
  onUpdateBrand: (updated: BrandProfile) => void;
  onOpenWizard: () => void;
}

interface IndustryPreset {
  id: BrandNicheKey;
  nameBn: string;
  icon: string;
  defaultTagline: string;
  productTypeBn: string;
  productTypeEn: string;
  preservationPrompt: string;
  suggestedHeadlines: string[];
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: 'bakery',
    nameBn: 'বেকারি ও মিষ্টি',
    icon: '🍰',
    defaultTagline: 'আর্টিসানাল লাক্সারি কেক ও মিষ্টান্ন',
    productTypeBn: 'কেক ও মিষ্টান্ন',
    productTypeEn: 'Bespoke Celebration Cake',
    preservationPrompt: 'frosting textures, piping decorations, custom colors, chocolate lettering, and topper details in authentic high-fidelity without AI distortion',
    suggestedHeadlines: [
      'এক চিলতে মিষ্টি হাসি',
      'একটু বাড়তি যত্ন',
      'ভালোবাসার খাঁটি স্বাদ',
      'আজকের দিনটি শুধুই তোমার',
      'একটি কামড়েই মন ভালো'
    ]
  },
  {
    id: 'jewelry',
    nameBn: 'লাক্সারি জুয়েলারি',
    icon: '💎',
    defaultTagline: 'হাতে গড়া খাঁটি স্বর্ণ ও ডায়মন্ড অলঙ্কার',
    productTypeBn: 'অলঙ্কার ও জুয়েলারি',
    productTypeEn: 'Handcrafted Fine Jewelry',
    preservationPrompt: 'gold karat luster, precision gemstone facet cuts, brilliant diamond light refraction, claw settings, and flawless metal polishing without AI distortion',
    suggestedHeadlines: [
      'চিরন্তন ভালোবাসার প্রতীক',
      'আভিজাত্যের খাঁটি রূপ',
      'স্বপ্নের চেয়েও সুন্দর',
      'তোমার রূপের মুগ্ধতা'
    ]
  },
  {
    id: 'cosmetics',
    nameBn: 'স্কিনকেয়ার ও কসমেটিকস',
    icon: '✨',
    defaultTagline: 'ন্যাচারাল গ্লো ও প্রিমিয়াম স্কিনকেয়ার',
    productTypeBn: 'স্কিনকেয়ার ও বিউটি',
    productTypeEn: 'Organic Skincare Serum Bottle',
    preservationPrompt: 'frosted glass bottle texture, amber serum liquid viscosity, rubber pipette dropper, authentic label typography, and dewy skin tone fidelity without AI distortion',
    suggestedHeadlines: [
      'ত্বকের গভীরে প্রকৃতির ছোঁয়া',
      'নিখুঁত উজ্জ্বলতার রহস্য',
      'স্নিগ্ধ কোমল রূপ',
      'প্রতিদিনের ত্বকের যত্ন'
    ]
  },
  {
    id: 'fashion',
    nameBn: 'লাক্সারি ফ্যাশন ও জামদানি',
    icon: '👗',
    defaultTagline: 'হাতে বোনা ঐতিহ্যবাহী জামদানি ও পোশাক',
    productTypeBn: 'ফ্যাশন ও শাড়ি',
    productTypeEn: 'Handloom Luxury Saree',
    preservationPrompt: 'authentic handloom thread weave density, metallic zari gold border embroidery, silk drape texture, and exact fabric color shades without AI distortion',
    suggestedHeadlines: [
      'ঐতিহ্যের রাজকীয় সাজ',
      'হাতে বোনা খাঁটি আভিজাত্য',
      'রূপের অহংকার জামদানি',
      'উৎসবের সেরা আকর্ষণ'
    ]
  },
  {
    id: 'beverage',
    nameBn: 'স্পেশালিটি ক্যাফে ও কফি',
    icon: '☕',
    defaultTagline: 'আর্টিসানাল রোস্টেড কফি ও স্পেশালিটি ব্রিউ',
    productTypeBn: 'কফি ও ক্যাফে',
    productTypeEn: 'Artisan Ceramic Coffee Cup',
    preservationPrompt: 'artisan ceramic cup glaze, micro-foam poured latte art swirl, espresso crema richness, and warm ambient cafe steam without AI distortion',
    suggestedHeadlines: [
      'এক কাপ কফিতে সারাদিনের ক্লান্তি শেষ',
      'তাজা কফির খাঁটি সুবাস',
      'একটু শান্তির মুহূর্ত',
      'আড্ডার সেরা সঙ্গী'
    ]
  },
  {
    id: 'general',
    nameBn: 'লেদার ও প্রিমিয়াম গুডস',
    icon: '👞',
    defaultTagline: 'খাঁটি লেদার পণ্য ও লাক্সারি আনুষঙ্গিক',
    productTypeBn: 'লেদার গুডস',
    productTypeEn: 'Handcrafted Full-Grain Leather Product',
    preservationPrompt: 'full-grain leather texture, authentic edge stitching, brass buckles, metallic hardware, and patina sheen without AI alteration',
    suggestedHeadlines: [
      'আভিজাত্য যার প্রতিটি পদক্ষেপে',
      'খাঁটি লেদারের দীর্ঘস্থায়ী সঙ্গী',
      'প্রিমিয়াম শৈলী ও ব্যক্তিত্ব',
      'নিখুঁত হস্তশিল্পের প্রমাণ'
    ]
  }
];

export const BrandSetupView: React.FC<BrandSetupViewProps> = ({
  session,
  activeBrand,
  onUpdateBrand,
  onOpenWizard
}) => {
  // Form State initialized with activeBrand
  const [nameBn, setNameBn] = useState(activeBrand.nameBn);
  const [nameEn, setNameEn] = useState(activeBrand.nameEn);
  const [icon, setIcon] = useState(activeBrand.icon);
  const [tagline, setTagline] = useState(activeBrand.tagline);
  const [productTypeBn, setProductTypeBn] = useState(activeBrand.productTypeBn);
  const [productTypeEn, setProductTypeEn] = useState(activeBrand.productTypeEn);
  const [niche, setNiche] = useState<BrandNicheKey>(activeBrand.niche);
  const [preservationPrompt, setPreservationPrompt] = useState(activeBrand.preservationPrompt);
  const [headlines, setHeadlines] = useState<Array<{ text: string; cat: string }>>(
    activeBrand.defaultHeadlines || []
  );
  
  // New headline input
  const [newHeadlineText, setNewHeadlineText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if activeBrand changes externally
  useEffect(() => {
    setNameBn(activeBrand.nameBn);
    setNameEn(activeBrand.nameEn);
    setIcon(activeBrand.icon);
    setTagline(activeBrand.tagline);
    setProductTypeBn(activeBrand.productTypeBn);
    setProductTypeEn(activeBrand.productTypeEn);
    setNiche(activeBrand.niche);
    setPreservationPrompt(activeBrand.preservationPrompt);
    setHeadlines(activeBrand.defaultHeadlines || []);
  }, [activeBrand]);

  // Apply Industry Preset
  const handleApplyPreset = (preset: IndustryPreset) => {
    setNiche(preset.id);
    setIcon(preset.icon);
    setProductTypeBn(preset.productTypeBn);
    setProductTypeEn(preset.productTypeEn);
    setTagline(preset.defaultTagline);
    setPreservationPrompt(preset.preservationPrompt);
    setHeadlines(preset.suggestedHeadlines.map(text => ({ text, cat: 'love' })));
  };

  // Add custom headline
  const handleAddHeadline = () => {
    if (!newHeadlineText.trim()) return;
    setHeadlines(prev => [...prev, { text: newHeadlineText.trim(), cat: 'custom' }]);
    setNewHeadlineText('');
  };

  // Remove headline
  const handleRemoveHeadline = (indexToRemove: number) => {
    setHeadlines(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BrandProfile = {
      ...activeBrand,
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      icon: icon.trim() || '✨',
      tagline: tagline.trim(),
      productTypeBn: productTypeBn.trim(),
      productTypeEn: productTypeEn.trim(),
      niche,
      preservationPrompt: preservationPrompt.trim(),
      defaultHeadlines: headlines
    };

    onUpdateBrand(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#15121D] via-[#100E16] to-[#0A090E] border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BrandOS • Dynamic AI Architecture</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-serif">
              ব্র্যান্ড ডিএনএ ও ওএস কনফিগারেশন
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              আপনার ব্র্যান্ডের প্রোডাক্ট সংরক্ষণ নীতি, স্লোগান ও আর্ট-ডিরেকশন রুলস সেট করুন। সিস্টেমটি স্বয়ংক্রিয়ভাবে এই তথ্য ব্যবহার করে প্রতিবার নিখুঁত বিজ্ঞাপন ব্যানার প্রম্পট জেনারেট করবে।
            </p>
          </div>

          {/* Live Preview Pill */}
          <div className="p-3.5 rounded-2xl bg-[#0D0C12]/90 border border-[#2B2738] flex items-center gap-3 shrink-0 self-start sm:self-auto shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl">
              {icon || '✨'}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">{nameBn || 'ব্র্যান্ডের নাম'}</div>
              <div className="text-[10px] text-zinc-400 font-mono">{productTypeBn || 'ক্যাটাগরি'}</div>
              <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                সক্রিয় ব্র্যান্ড
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-3 text-emerald-300 text-xs animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">ব্র্যান্ড ওএস সফলভাবে সেভ করা হয়েছে! এখন থেকে সব প্রম্পট এই ব্র্যান্ডের জন্য প্রস্তুত হবে।</span>
          </div>
          <button
            onClick={onOpenWizard}
            className="py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1"
          >
            <span>টেস্ট প্রম্পট বানান</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* 2. Step 1: 1-Click Industry Presets */}
        <div className="p-5 rounded-3xl bg-[#111016] border border-[#23202E] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                ১. দ্রুত সেটআপের জন্য ইন্ডাস্ট্রি টেমপ্লেট
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">১-ক্লিক ফিল</span>
          </div>
          <p className="text-xs text-zinc-400">
            নিচের যেকোনো ক্যাটাগরিতে ক্লিক করলে সেই ইন্ডাস্ট্রির জন্য প্রিমিয়াম প্রিজারভেশন রুল ও স্লোগান স্বয়ংক্রিয়ভাবে বসে যাবে:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {INDUSTRY_PRESETS.map((preset) => {
              const isSelected = niche === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200 ring-1 ring-amber-500/30 shadow-md'
                      : 'bg-[#16141F] hover:bg-[#1E1B29] border-[#292636] text-zinc-300'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{preset.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{preset.nameBn}</div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">{preset.productTypeBn}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Step 2: Brand Identity Details */}
        <div className="p-5 rounded-3xl bg-[#111016] border border-[#23202E] space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              ২. ব্র্যান্ডের সাধারণ পরিচিতি
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="text-zinc-300 font-medium block mb-1">
                ব্র্যান্ডের নাম (বাংলা) *
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: কেক স্লাইস বাই ফারজানা বা অউরা জুয়েলারি"
                className="w-full bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">
                ব্র্যান্ডের নাম (English) *
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Ex: Cake Slice by Farjana / Aura Jewelry"
                className="w-full bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">
                ব্র্যান্ড আইকন / ইমোজি
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="যেমন: 🍰, 💎, ✨, 👗, ☕"
                className="w-full bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none text-center font-emoji"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">
                প্রোডাক্টের ধরন (বাংলা)
              </label>
              <input
                type="text"
                value={productTypeBn}
                onChange={(e) => setProductTypeBn(e.target.value)}
                placeholder="যেমন: কেক ও মিষ্টান্ন / অলঙ্কার ও জুয়েলারি"
                className="w-full bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-medium block mb-1">
                প্রোডাক্টের সুনির্দিষ্ট ইংরেজি নাম (Product Specific Noun) *
              </label>
              <input
                type="text"
                required
                value={productTypeEn}
                onChange={(e) => setProductTypeEn(e.target.value)}
                placeholder="Ex: Bespoke Celebration Cake / Handcrafted Diamond Ring / Organic Face Serum"
                className="w-full bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono text-[11px]"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                এই নামটি প্রম্পটের কম্পোজিশনে আপনার আসল প্রোডাক্টটিকে আইডেন্টিফাই করবে।
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-medium block mb-1">
                ব্র্যান্ড ট্যাগলাইন
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="যেমন: নিখুঁত শিল্প ও খাঁটি চকলেটের এক রাজকীয় রসায়ন"
                className="w-full bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Step 3: Critical AI Visual Preservation DNA */}
        <div className="p-5 rounded-3xl bg-[#111016] border border-amber-500/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                ৩. এআই প্রিজারভেশন রুল (Product Visual Integrity DNA)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
              সবচেয়ে গুরুত্বপূর্ণ
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            AI আপনার আপলোড করা আসল ফটো থেকে ঠিক কোন কোন উপাদান বিন্দুমাত্র পরিবর্তন বা বিকৃত করতে পারবে না—তা এখানে সংজ্ঞায়িত থাকে।
          </p>

          <textarea
            required
            rows={3}
            value={preservationPrompt}
            onChange={(e) => setPreservationPrompt(e.target.value)}
            placeholder="Ex: exact frosting textures, piping decorations, custom colors, chocolate lettering, and topper details without AI distortion..."
            className="w-full bg-[#15131D] border border-amber-500/30 focus:border-amber-400 rounded-2xl p-3 text-xs text-amber-200 placeholder-zinc-600 focus:outline-none font-mono leading-relaxed"
          />

          {/* Quick Insert helpers */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-zinc-500 font-mono">কুইক ইনসার্ট:</span>
            {[
              'gold karat luster',
              'diamond facet refraction',
              'frosting textures & piping',
              'dropper bottle & serum viscosity',
              'handloom thread weave density',
              'full-grain leather stitching'
            ].map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPreservationPrompt(prev => prev ? `${prev}, ${tag}` : tag)}
                className="px-2 py-1 rounded-lg bg-[#191724] hover:bg-[#232032] text-zinc-400 hover:text-amber-300 border border-[#2D2A3C] transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Step 4: Brand Signature Headlines Library */}
        <div className="p-5 rounded-3xl bg-[#111016] border border-[#23202E] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                ৪. ব্র্যান্ডের সিগনেচার বাংলা স্লোগান লাইব্রেরি ({headlines.length}টি)
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">ছোট ও মার্জিত (২-৪ শব্দ)</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newHeadlineText}
              onChange={(e) => setNewHeadlineText(e.target.value)}
              placeholder="নতুন সংক্ষিপ্ত বাংলা স্লোগান লিখুন (যেমন: এক চিলতে মিষ্টি হাসি)..."
              className="flex-1 bg-[#16141E] border border-[#2B2838] focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddHeadline();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddHeadline}
              className="py-2 px-3.5 bg-[#1F1C2A] hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>যোগ করুন</span>
            </button>
          </div>

          {/* Slogans List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {headlines.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#16141F] border border-[#282535] flex items-center justify-between text-xs text-zinc-200"
              >
                <span className="truncate pr-2 font-medium">“{item.text}”</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHeadline(idx)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Save & Activate Action Footer */}
        <div className="p-4 rounded-3xl bg-[#0F0E14] border border-[#272333] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl">
          <div className="text-xs text-zinc-400">
            সেভ করলে সিস্টেম তাৎক্ষণিকভাবে এই সেটিংস সক্রিয় করবে।
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="py-2.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>ব্র্যান্ড ওএস সেভ ও সক্রিয় করুন</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
