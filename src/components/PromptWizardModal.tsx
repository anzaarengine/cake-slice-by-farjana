'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Shuffle, 
  Search,
  CheckCircle2,
  Database
} from 'lucide-react';
import { ImageStyleKey, TypoStyleKey, AspectRatioKey, PromptConfig } from '@/types';
import headlinesData from '@/data/headlines.json';

interface HeadlineItem {
  text: string;
  cat: string;
}

const ALL_HEADLINES: HeadlineItem[] = headlinesData as HeadlineItem[];

interface PromptWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePrompt: (config: PromptConfig) => void;
}

export const PromptWizardModal: React.FC<PromptWizardModalProps> = ({
  isOpen,
  onClose,
  onSavePrompt
}) => {
  // Step state: 1 (Headline), 2 (Style), 3 (Ratio), 4 (Result)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedHeadline, setSelectedHeadline] = useState<string>('প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedImageStyle, setSelectedImageStyle] = useState<ImageStyleKey>('organic-earth');
  const [selectedTypoStyle, setSelectedTypoStyle] = useState<TypoStyleKey>('fluid');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioKey>('4:5');

  // Generated Result
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Filter headlines by category & search query
  const filteredHeadlines = useMemo(() => {
    return ALL_HEADLINES.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.cat === selectedCategory;
      const matchesSearch = !searchQuery.trim() || item.text.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Shuffle headline
  const handleShuffle = () => {
    const list = filteredHeadlines.length > 0 ? filteredHeadlines : ALL_HEADLINES;
    const item = list[Math.floor(Math.random() * list.length)];
    if (item) setSelectedHeadline(item.text);
  };

  // Generate Master Prompt based on all 3 user choices
  const handleGenerate = () => {
    const headline = selectedHeadline.trim() || 'প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি';

    // 1. Image Style setup
    let baseMaterial = '';
    let backgroundDesc = '';
    let lightingDesc = '';

    if (selectedImageStyle === 'dark-cinematic') {
      baseMaterial = 'a hand-carved dark wood block or rough dark stone base';
      backgroundDesc = 'completely empty, seamless pitch-dark charcoal negative space';
      lightingDesc = 'A warm, golden cinematic side-light hits the cake and its complementary base, creating a moody, high-end dramatic atmosphere with rich contrasts and deep shadows.';
    } else {
      // organic-earth (Image 2 style)
      baseMaterial = 'an authentic raw travertine stone slab (natural porous earth stone)';
      backgroundDesc = 'an empty, seamless warm taupe, sand, or light-beige plaster wall, leaving massive breathing space';
      lightingDesc = 'Soft, natural diffused ambient lighting gently illuminates the cake and its unique base, casting realistic delicate shadows with grounded earthy calmness.';
    }

    // 2. Typo Style setup
    let typoColor = '';
    let typoTreatment = '';
    let subtitleText = '';

    if (selectedTypoStyle === 'brush') {
      typoColor = 'an off-white and light-gold dual-tone with 3D embossed depth';
      typoTreatment = 'strictly in the Brush Strokes / Artistic Brush Style, showcasing rough, hand-painted artistic brushwork with visible bristle textures, expressive sweep effects, and subtle 3D shading on the strokes.';
      subtitleText = '~ ARTISANAL LUXURY BAKERY ~';
    } else if (selectedTypoStyle === 'fluid') {
      typoColor = 'rich dark-brown and warm bronze/gold liquid tones with natural flow and soft shadow depth';
      typoTreatment = 'strictly in the Fluid / Liquid style, characterized by smooth, organic, boldly curved shapes with natural flow, dynamic loops, and interconnected letters as if written with thick flowing liquid.';
      subtitleText = '~ PREMIUM CAKES ~';
    } else {
      // handwritten
      typoColor = 'dark-brown and subtle gold gradients';
      typoTreatment = 'in an intimate handcrafted calligraphic handwriting style with natural curls, elegant flourishes, whimsical swooshes, and handcrafted dots around the letters.';
      subtitleText = '~ ARTISANAL CONFECTIONERY ~';
    }

    // 3. Aspect Ratio string
    const ratioCode = `--ar ${selectedRatio}`;

    // Assemble final master prompt
    const prompt = `An editorial, ultra-premium advertising photograph in a ${selectedRatio} aspect ratio, featuring the user's uploaded cake situated strictly in the bottom 25% of the frame. The cake rests on ${baseMaterial}, retaining its authentic original textures, frosting, decorations, and colors in high-fidelity.

The top 75% of the canvas is ${backgroundDesc}. ${lightingDesc}

In the upper spacious background, elegant 3D embossed Bengali typography is prominently featured in ${typoColor}:
- Main Emotional Headline: "${headline}"
- Brand Name directly below: "কেক স্লাইস" (Line 1) and "বাই ফারজানা" (Line 2)
- Typographical Artistic Treatment: ${typoTreatment}
- Small understated English subtitle at bottom: "${subtitleText}"

The image is clean, highly aesthetic, completely devoid of clutter or random props, strictly holding a luxury magazine cover layout. 8k, photorealistic. ${ratioCode}`;

    setFinalPrompt(prompt);
    setStep(4);

    // Save to history
    onSavePrompt({
      headline,
      imageStyle: selectedImageStyle,
      typoStyle: selectedTypoStyle,
      ratio: selectedRatio,
      generatedPrompt: prompt,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleCopyAndOpenGemini = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    window.open('https://gemini.google.com/app', '_blank');
    setTimeout(() => setCopied(false), 2500);
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#121115] border border-[#2D2936] rounded-3xl p-6 sm:p-7 shadow-2xl relative text-zinc-100 flex flex-col max-h-[90vh]">
        
        {/* Header & Stepper */}
        <div className="flex items-center justify-between pb-4 border-b border-[#24212C]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DFBA75] animate-pulse" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-zinc-100">
                নতুন ইমেজ প্রম্পট উইজার্ড
              </h2>
              <span className="text-[10px] text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20 font-mono">
                ১,০০০+ লাইন লাইব্রেরি
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Cake Slice by Farjana • ৩টি সহজ ধাপে ৮K মাস্টার প্রম্পট তৈরি করুন
            </p>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center justify-between py-3 px-2 border-b border-[#201D27] text-xs">
          {[
            { num: 1, label: '১. বাংলা লাইন' },
            { num: 2, label: '২. স্টাইল' },
            { num: 3, label: '৩. সাইজ/রেশিও' },
            { num: 4, label: '৪. প্রম্পট তৈরি' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step === s.num
                  ? 'text-[#DFBA75] font-bold'
                  : step > s.num
                  ? 'text-emerald-400 font-medium'
                  : 'text-zinc-500'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.num
                    ? 'bg-[#DFBA75] text-black font-bold'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* MODAL BODY (Steps 1, 2, 3, 4) */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">

          {/* ================= STEP 1: SELECT BENGALI HEADLINE (1000+ Unique Database) ================= */}
          {step === 1 && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    <span>পোস্টারের বাংলা লাইন বেছে নিন</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      ({filteredHeadlines.length}টি পাওয়া গেছে)
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    গ্রাহকের অনুভূতি ছুঁয়ে যাওয়ার মতো মিষ্টি ও আন্তরিক লাইন
                  </p>
                </div>

                <button
                  onClick={handleShuffle}
                  className="py-1 px-3 bg-[#1D1A25] hover:bg-[#282433] border border-[#DFBA75]/40 text-xs font-semibold text-[#DFBA75] rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>🎲 র‍্যান্ডম বদলান</span>
                </button>
              </div>

              {/* Active Selection Input */}
              <div className="p-3 rounded-2xl bg-[#0B0A0D] border-2 border-[#DFBA75]/60 flex items-center gap-2.5 shadow-inner">
                <span className="text-base">✍️</span>
                <input
                  type="text"
                  value={selectedHeadline}
                  onChange={(e) => setSelectedHeadline(e.target.value)}
                  placeholder="যেকোনো লাইন সিলেক্ট করুন বা নিজে লিখুন..."
                  className="w-full bg-transparent text-sm text-[#DFBA75] font-semibold focus:outline-none"
                />
              </div>

              {/* Live Search Bar for 1000+ Lines */}
              <div className="p-2 rounded-xl bg-[#16141B] border border-zinc-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-400 ml-1" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="১,০০০+ লাইনের মধ্যে সার্চ করুন (যেমন: ভালোবাসা, জন্মদিন, অভিমান, চকলেট, মা, আড্ডা...)"
                  className="w-full bg-transparent text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs text-zinc-400 hover:text-white px-2">
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                {[
                  { id: 'all', label: 'সব (১,০০০+)' },
                  { id: 'love', label: '❤️ প্রিয়জন' },
                  { id: 'birthday', label: '🎂 জন্মদিন' },
                  { id: 'apology', label: '🥺 মান-অভিমান' },
                  { id: 'self', label: '☕ নিজের ট্রিট' },
                  { id: 'taste', label: '✨ খাঁটি স্বাদ' },
                  { id: 'family', label: '👨‍👩‍👧 পরিবার ও আড্ডা' },
                  { id: 'anniversary', label: '💍 অ্যানিভার্সারি' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#DFBA75] text-black font-bold shadow-md'
                        : 'bg-[#18161E] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 1000+ Scrollable Lines Container */}
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {filteredHeadlines.slice(0, 150).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedHeadline(item.text)}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-all border flex items-center justify-between ${
                      selectedHeadline === item.text
                        ? 'bg-[#DFBA75]/15 border-[#DFBA75] text-[#DFBA75] font-semibold shadow-sm'
                        : 'bg-[#0E0D11] border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-[#15131A]'
                    }`}
                  >
                    <span className="truncate pr-2">“{item.text}”</span>
                    {selectedHeadline === item.text && (
                      <Check className="w-4 h-4 text-[#DFBA75] shrink-0" />
                    )}
                  </button>
                ))}
                {filteredHeadlines.length > 150 && (
                  <div className="p-2 text-center text-[11px] text-zinc-500">
                    আরও {filteredHeadlines.length - 150}টি লাইন রয়েছে (নির্দিষ্ট শব্দ লিখে সার্চ করুন)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: SELECT IMAGE & TYPO STYLE ================= */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  ইমেজ স্টাইল ও বাংলা টাইপোগ্রাফির ধরন বেছে নিন
                </h3>
                <p className="text-[11px] text-zinc-400">
                  আপনার কেকের কালার ও ফিনিশিংয়ের সাথে মানানসই স্টাইল সিলেক্ট করুন
                </p>
              </div>

              {/* Image & Lighting Style Selection */}
              <div>
                <label className="text-xs font-semibold text-[#DFBA75] block mb-2 uppercase tracking-wider">
                  ১. ব্যাকগ্রাউন্ড ও লাইটিং স্টাইল
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Organic Earth Tone */}
                  <button
                    onClick={() => {
                      setSelectedImageStyle('organic-earth');
                      setSelectedTypoStyle('fluid');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all relative group ${
                      selectedImageStyle === 'organic-earth'
                        ? 'border-[#DFBA75] bg-[#1E1A26] shadow-[0_0_20px_rgba(223,186,117,0.2)]'
                        : 'border-[#26242B] bg-[#0E0D10] opacity-80 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-2 relative border border-[#DFBA75]/20 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/preview-earth-tone.jpg"
                        alt="Organic Earth Tone"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-[9px] text-[#DFBA75] font-semibold px-2 py-0.5 rounded-md">
                        ২নং ছবির আসল লুক
                      </span>
                    </div>
                    <div className="text-xs font-bold text-zinc-100">Organic Earth Tone</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">ট্রাভার্টিন মার্বেল স্ল্যাব ও ওয়ার্ম বেইজ দেয়াল</div>
                    {selectedImageStyle === 'organic-earth' && (
                      <div className="absolute right-3 top-3 w-3 h-3 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
                    )}
                  </button>

                  {/* Dark & Warm Cinematic */}
                  <button
                    onClick={() => {
                      setSelectedImageStyle('dark-cinematic');
                      setSelectedTypoStyle('brush');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all relative group ${
                      selectedImageStyle === 'dark-cinematic'
                        ? 'border-[#DFBA75] bg-[#1E1A26] shadow-[0_0_20px_rgba(223,186,117,0.2)]'
                        : 'border-[#26242B] bg-[#0E0D10] opacity-80 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-2 relative border border-[#DFBA75]/20 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/preview-dark-cinematic.jpg"
                        alt="Dark Cinematic"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-[9px] text-[#DFBA75] font-semibold px-2 py-0.5 rounded-md">
                        ডার্ক ও গোল্ড লুক
                      </span>
                    </div>
                    <div className="text-xs font-bold text-zinc-100">Dark & Warm Cinematic</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">কালো চারকোল ব্যাকগ্রাউন্ড ও ড্রামাটিক আলো</div>
                    {selectedImageStyle === 'dark-cinematic' && (
                      <div className="absolute right-3 top-3 w-3 h-3 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Typo Style Selection */}
              <div>
                <label className="text-xs font-semibold text-[#DFBA75] block mb-2 uppercase tracking-wider">
                  ২. বাংলা টাইপোগ্রাফির শৈল্পিক ধরন
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'fluid', title: 'Fluid / Liquid', desc: 'চকলেট ও সোনালি তরল কার্ভ (২নং ছবির মতো)' },
                    { id: 'brush', title: 'Artistic Brush', desc: 'তুলির সোনালি-সাদা ৩ডি টান' },
                    { id: 'handwritten', title: 'Handwritten', desc: 'হাতে আঁকা ক্যালিগ্রাফি সিগনেচার' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTypoStyle(t.id as TypoStyleKey)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedTypoStyle === t.id
                          ? 'border-[#DFBA75] bg-[#1E1A26] text-[#DFBA75]'
                          : 'border-[#26242B] bg-[#0E0D10] text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-zinc-100">{t.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: SELECT ASPECT RATIO ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  ছবির সাইজ / রেশিও বেছে নিন
                </h3>
                <p className="text-[11px] text-zinc-400">
                  সোশ্যাল মিডিয়ায় আপনি কোন ফরম্যাটে পোস্ট করতে চান
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: '4:5',
                    title: '4:5 Editorial Portrait',
                    desc: 'Instagram ও Facebook ফিডের জন্য আদর্শ (ম্যাগাজিন কভার স্টাইল)',
                    badge: 'Recommended'
                  },
                  {
                    id: '9:16',
                    title: '9:16 Full Screen',
                    desc: 'Instagram Stories, Reels কভার এবং TikTok-এর জন্য ফুল স্ক্রিন',
                    badge: 'Story / Reel'
                  },
                  {
                    id: '1:1',
                    title: '1:1 Square Feed',
                    desc: 'ক্লাসিক স্কয়ার সাইজ পোস্ট',
                    badge: 'Square'
                  }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRatio(r.id as AspectRatioKey)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      selectedRatio === r.id
                        ? 'border-[#DFBA75] bg-[#1E1A26] shadow-[0_0_20px_rgba(223,186,117,0.2)]'
                        : 'border-[#26242B] bg-[#0E0D10] opacity-80 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20">
                        {r.badge}
                      </span>
                      <div className="text-base font-bold text-zinc-100 mt-2">{r.id}</div>
                      <div className="text-xs font-semibold text-zinc-200 mt-0.5">{r.title}</div>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{r.desc}</p>
                    </div>

                    {selectedRatio === r.id && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#DFBA75] font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> নির্বাচিত
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 4: FINAL GENERATED PROMPT ================= */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    আপনার মাস্টার প্রম্পট তৈরি হয়ে গেছে!
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    নিচের বাটনটি চাপলেই প্রম্পট কপি হয়ে Gemini Pro খুলে যাবে
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(finalPrompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="py-1.5 px-3 bg-[#1F1B26] hover:bg-[#2A2434] border border-[#DFBA75]/40 text-xs font-semibold text-[#DFBA75] rounded-xl flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে!' : 'প্রম্পট কপি করুন'}</span>
                </button>
              </div>

              {/* Master Prompt Codebox */}
              <div className="p-4 rounded-2xl bg-[#08070A] border border-[#26242B] font-mono text-xs text-zinc-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap selection:bg-[#DFBA75] selection:text-black">
                {finalPrompt}
              </div>

              {/* Main Action to Gemini */}
              <button
                onClick={handleCopyAndOpenGemini}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#DFBA75] via-[#F4D998] to-[#C99C47] text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-black" />
                <span>প্রম্পট কপি করে Gemini Pro-তে যান (২নং ছবির মতো তৈরি করুন)</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>

              <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                💡 <strong>ব্যবহারের নিয়ম:</strong> এই বাটনে চাপ দিলে আপনার প্রম্পট কপি হয়ে সরাসরি Gemini খুলবে। সেখানে আপনার কেকের ছবি ড্রপ করে <strong>Paste</strong> চাপুন—আর পেয়ে যান ২নং ছবির মতো অবিকল লাক্সারি মাস্টারপিস!
              </p>
            </div>
          )}

        </div>

        {/* MODAL FOOTER BUTTONS */}
        <div className="pt-4 border-t border-[#24212C] flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="py-2.5 px-4 rounded-xl border border-zinc-700 bg-[#16141A] text-zinc-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী ধাপ</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as 2 | 3)}
              className="py-2.5 px-5 rounded-xl bg-[#DFBA75] hover:bg-[#E8C885] text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg ml-auto"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleGenerate}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#DFBA75] to-[#B89243] text-black text-xs font-bold flex items-center gap-2 transition-all shadow-lg ml-auto hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>প্রম্পট তৈরি করুন</span>
            </button>
          ) : (
            <button
              onClick={resetAndClose}
              className="py-2.5 px-5 rounded-xl border border-zinc-700 bg-[#16141A] text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition-all ml-auto"
            >
              সম্পন্ন / বন্ধ করুন
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
