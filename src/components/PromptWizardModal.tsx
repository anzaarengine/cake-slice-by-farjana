'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Database,
  Layers,
  Palette,
  Ratio as RatioIcon,
  Flame,
  Star,
  Tag
} from 'lucide-react';
import { ImageStyleKey, TypoStyleKey, AspectRatioKey, BasePedestalKey, PromptConfig } from '@/types';
import headlinesData from '@/data/headlines.json';
import { TYPOGRAPHY_STYLES, TypographyStyleItem } from '@/data/typographyStyles';
import { BACKGROUND_STYLES, BackgroundStyleItem } from '@/data/backgroundStyles';
import { BrandProfile, INITIAL_BRANDS } from '@/data/brands';
import { PEDESTAL_OPTIONS, PedestalItem } from '@/data/pedestals';

interface HeadlineItem {
  text: string;
  cat: string;
}

const ALL_HEADLINES: HeadlineItem[] = headlinesData as HeadlineItem[];

interface PromptWizardModalProps {
  isOpen: boolean;
  initialStep?: 1 | 2 | 3 | 4;
  activeBrand?: BrandProfile;
  onClose: () => void;
  onSavePrompt: (config: PromptConfig) => void;
}

export const PromptWizardModal: React.FC<PromptWizardModalProps> = ({
  isOpen,
  initialStep = 1,
  activeBrand,
  onClose,
  onSavePrompt
}) => {
  const currentBrand = activeBrand || INITIAL_BRANDS[0];
  // Step state: 1 (Headline), 2 (Typography with Real Previews), 3 (Canvas, Pedestal & Ratio with Real Previews), 4 (Result)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);

  // Selections
  const [selectedHeadline, setSelectedHeadline] = useState<string>(activeBrand?.defaultHeadlines[0]?.text || 'এক চিলতে মিষ্টি হাসি');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (activeBrand?.defaultHeadlines?.[0]?.text) {
      setSelectedHeadline(activeBrand.defaultHeadlines[0].text);
    }
  }, [activeBrand]);
  
  // Typo selection & filter
  const [selectedTypoStyle, setSelectedTypoStyle] = useState<string>('brush');
  const [typoFilter, setTypoFilter] = useState<'locked' | 'all'>('locked');

  // Background, Pedestal & Ratio
  const [selectedImageStyle, setSelectedImageStyle] = useState<string>('organic-earth');
  const [selectedPedestal, setSelectedPedestal] = useState<BasePedestalKey>('auto');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioKey>('4:5');

  // Generated Result
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [promptMode, setPromptMode] = useState<'full' | 'composition'>('full');
  // Brand name option: 'none' (default - no Cake Slice by Farjana), 'subtle' (tiny micro signature), 'full' (prominent)
  const [brandOption, setBrandOption] = useState<'none' | 'subtle' | 'full'>('none');
  // Text scale option: 'refined' (modest/small with lots of space), 'medium' (balanced), 'large' (bold)
  const [textSizeOption, setTextSizeOption] = useState<'refined' | 'medium' | 'large'>('refined');

  // In-App Direct Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleGenerateInApp = async () => {
    if (!finalPrompt) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const savedKey = typeof window !== 'undefined' ? localStorage.getItem('cake_slice_gemini_key') || '' : '';
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: savedKey,
          prompt: finalPrompt
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        setGenerateError(data.error || 'জেনারেশন সম্পন্ন হয়নি। Gemini-তে চেষ্টা করুন।');
      }
    } catch {
      setGenerateError('সার্ভারে সাময়িক সমস্যা। প্রম্পটটি কপি করে Gemini-তে পেস্ট করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter headlines by category & search query (merging brand specific headlines)
  const combinedHeadlines = useMemo(() => {
    const brandList = currentBrand.defaultHeadlines || [];
    const brandTexts = new Set(brandList.map(b => b.text));
    const rest = ALL_HEADLINES.filter(h => !brandTexts.has(h.text));
    return [...brandList, ...rest];
  }, [currentBrand]);

  const filteredHeadlines = useMemo(() => {
    return combinedHeadlines.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.cat === selectedCategory;
      const matchesSearch = !searchQuery.trim() || item.text.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Filter typography styles
  const filteredTypoStyles = useMemo(() => {
    if (typoFilter === 'locked') {
      return TYPOGRAPHY_STYLES.filter(s => s.isLocked);
    }
    return TYPOGRAPHY_STYLES;
  }, [typoFilter]);

  // Selected Typo Object
  const currentTypoObj = useMemo(() => {
    return TYPOGRAPHY_STYLES.find(s => s.id === selectedTypoStyle) || TYPOGRAPHY_STYLES[0];
  }, [selectedTypoStyle]);

  // Selected Background Style Object
  const currentBgObj = useMemo(() => {
    return BACKGROUND_STYLES.find(b => b.id === selectedImageStyle) || BACKGROUND_STYLES[0];
  }, [selectedImageStyle]);

  // Selected Pedestal Object
  const currentPedestalObj = useMemo(() => {
    return PEDESTAL_OPTIONS.find(p => p.id === selectedPedestal) || PEDESTAL_OPTIONS[0];
  }, [selectedPedestal]);

  if (!isOpen) return null;

  // Shuffle headline
  const handleShuffle = () => {
    const list = filteredHeadlines.length > 0 ? filteredHeadlines : ALL_HEADLINES;
    const item = list[Math.floor(Math.random() * list.length)];
    if (item) setSelectedHeadline(item.text);
  };

  // Generate Master Prompt based on World-Class Art Direction System
  const buildPrompt = (
    mode: 'full' | 'composition',
    headline: string,
    currentBrandOption: 'none' | 'subtle' | 'full' = brandOption,
    currentSize: 'refined' | 'medium' | 'large' = textSizeOption
  ): string => {
    const pedestalText = currentPedestalObj.promptDescription;
    const backgroundDesc = currentBgObj.promptBackgroundDesc;
    const lightingDesc = currentBgObj.promptLightingDesc;
    const typoTreatmentDesc = currentTypoObj.treatmentPrompt;

    // Dynamic product visual preservation description tailored to the active brand
    const productPreserveDesc = currentBrand.preservationPrompt;
    const productNoun = currentBrand.productTypeEn.toLowerCase();

    const preservationBlock = `CRITICAL PRODUCT PRESERVATION:\nKeep the ${productNoun} from the uploaded raw photo 100% authentic and unaltered—preserve its exact ${productPreserveDesc}. Zero AI re-imagination, zero artificial distortion.`;

    const compositionBlock = `COMPOSITION & CANVAS (Aspect Ratio: ${selectedRatio}):\nThe ${productNoun} rests gracefully in the bottom 25% of the frame, resting naturally on ${pedestalText}. The top 75% of the canvas MUST be completely empty, ${backgroundDesc}. High-end luxury magazine editorial layout, zero clutter, and no random props.`;

    if (mode === 'composition') {
      const compHeader = currentBrandOption === 'none'
        ? `Act as an elite luxury Art Director and high-fashion editorial photographer for bespoke ${productNoun}. Refer to the attached raw photo of my product.`
        : `Act as a world-class Art Director for my luxury ${currentBrand.productTypeEn} brand "${currentBrand.nameEn}". Refer to the attached raw photo of my product.`;

      return `${compHeader}

${preservationBlock}

${compositionBlock}

LIGHTING & ATMOSPHERE:
${lightingDesc}

IMPORTANT: Leave the upper 75% canvas completely clean and text-free — absolutely NO typography, NO overlays, and NO brand text. This space is strictly reserved for post-production text design.

High-end luxury magazine advertising photograph, 8k resolution, photorealistic. --ar ${selectedRatio}`;
    }

    let headerLine = '';
    let brandInstruction = '';

    if (currentBrandOption === 'none') {
      headerLine = `Act as an elite luxury Art Director and high-fashion advertising photographer for bespoke ${productNoun}. Refer to the attached raw photo of my product.`;
      brandInstruction = `EXCLUSIVE TYPOGRAPHY SPECIFICATION (STRICT - SINGLE PHRASE ONLY):
Render ONLY one single typography line: "${headline}".
There must be NO other text, no company or brand names, no secondary subheadings, no micro-logos, and no English text anywhere on the canvas. The entire image must contain strictly and exclusively this single phrase: "${headline}".`;
    } else if (currentBrandOption === 'subtle') {
      headerLine = `Act as a world-class Art Director for my luxury ${currentBrand.productTypeEn} brand "${currentBrand.nameEn}". Refer to the attached raw photo of my product.`;
      brandInstruction = `BRAND SIGNATURE:
Primary headline: "${headline}".
Far below the headline or in a quiet lower corner, place an ultra-small, discreet, minimalist micro-signature: "${currentBrand.nameBn}" (tiny subtle font size, strictly understated, never competing with or overpowering the headline).`;
    } else {
      headerLine = `Act as a world-class Art Director for my luxury ${currentBrand.productTypeEn} brand "${currentBrand.nameEn}". Refer to the attached raw photo of my product.`;
      brandInstruction = `BRANDING:
Feature the headline "${headline}" with a balanced, modest subtitle "${currentBrand.nameBn}" underneath (kept tasteful, medium-small, and never oversized).`;
    }

    let sizeInstruction = '';
    if (currentSize === 'refined') {
      sizeInstruction = `TYPOGRAPHY SCALE & LUXURY EDITORIAL SPACING:
- Font Scale: Delicate, subtle, and petite (small headline font size with thin, fine, elegant calligraphic strokes).
- Negative Space: At least 80% to 85% of the upper wall canvas MUST remain completely empty, clean, and bare.
- Placement: Centered in the upper negative space with generous wide margins on top, left, and right.
- Aesthetics: Understated high-fashion magazine editorial headline, soft and graceful whisper rather than a loud banner.`;
    } else if (currentSize === 'medium') {
      sizeInstruction = `TYPOGRAPHY SCALE & NEGATIVE SPACE:
- Font Scale: Balanced medium font size with clean proportions.
- Negative Space: At least 70% of the upper background canvas remains empty breathing space.
- Placement: Centered with comfortable margins.`;
    } else {
      sizeInstruction = `TYPOGRAPHY SCALE & NEGATIVE SPACE:
- Font Scale: Prominent, bold editorial typography.
- Negative Space: Clean margins around the text.`;
    }

    const typoBlock = `BENGALI TYPOGRAPHY TREATMENT:
In the spacious upper background, render the typography strictly in the ${currentTypoObj.nameEn} style:
${typoTreatmentDesc}
Ensure the lettering appears organically integrated into the scene with natural 3D depth and subtle ambient shadows against the wall.

${brandInstruction}

${sizeInstruction}`;

    return `${headerLine}

${preservationBlock}

${compositionBlock}

LIGHTING & ATMOSPHERE:
${lightingDesc}

${typoBlock}

High-end luxury magazine advertising photograph, 8k resolution, photorealistic. --ar ${selectedRatio}`;
  };

  const handleGenerate = () => {
    const headline = selectedHeadline.trim() || (currentBrand.defaultHeadlines[0]?.text || 'এক চিলতে মিষ্টি হাসি');

    const prompt = buildPrompt(promptMode, headline, brandOption, textSizeOption);

    setFinalPrompt(prompt);
    setStep(4);

    // Save to history
    onSavePrompt({
      headline,
      imageStyle: selectedImageStyle as ImageStyleKey,
      typoStyle: selectedTypoStyle,
      basePedestal: selectedPedestal,
      ratio: selectedRatio,
      brandOption,
      textSizeOption,
      brandId: currentBrand.id,
      brandName: currentBrand.nameBn,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-[#121115] border border-[#2D2936] rounded-3xl p-5 sm:p-7 shadow-2xl relative text-zinc-100 flex flex-col max-h-[94vh]">
        
        {/* Header & Stepper */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#24212C]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                মাস্টার প্রম্পট উইজার্ড
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                  ৪-স্টেপ
                </span>
              </h2>
            </div>
          </div>
          <button 
            onClick={resetAndClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-4 gap-2 pt-3 pb-3 border-b border-[#24212C]/60 text-xs">
          <div className={`flex items-center gap-1.5 transition-colors ${step === 1 ? 'text-amber-400 font-semibold' : step > 1 ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${step === 1 ? 'bg-amber-500 text-black font-bold' : step > 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'}`}>
              {step > 1 ? '✓' : '১'}
            </span>
            <span className="truncate">১. লাইন</span>
          </div>

          <div className={`flex items-center gap-1.5 transition-colors ${step === 2 ? 'text-amber-400 font-semibold' : step > 2 ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${step === 2 ? 'bg-amber-500 text-black font-bold' : step > 2 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'}`}>
              {step > 2 ? '✓' : '২'}
            </span>
            <span className="truncate">২. টাইপো</span>
          </div>

          <div className={`flex items-center gap-1.5 transition-colors ${step === 3 ? 'text-amber-400 font-semibold' : step > 3 ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${step === 3 ? 'bg-amber-500 text-black font-bold' : step > 3 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'}`}>
              {step > 3 ? '✓' : '৩'}
            </span>
            <span className="truncate">৩. ক্যানভাস</span>
          </div>

          <div className={`flex items-center gap-1.5 transition-colors ${step === 4 ? 'text-amber-400 font-semibold' : 'text-zinc-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${step === 4 ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
              ৪
            </span>
            <span className="truncate">৪. প্রম্পট</span>
          </div>
        </div>

        {/* Modal Body / Steps */}
        <div className="flex-1 overflow-y-auto py-3.5 custom-scrollbar pr-1">

          {/* ================= STEP 1: SELECT BENGALI HEADLINE ================= */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    বাংলা লাইন নির্বাচন
                    <span className="text-[10px] text-zinc-500 font-mono">({filteredHeadlines.length}টি)</span>
                  </h3>
                </div>

                <button
                  onClick={handleShuffle}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B1922] hover:bg-[#252230] text-amber-300 border border-amber-500/30 rounded-xl text-xs font-medium transition-all active:scale-95 shadow-sm"
                  title="র‍্যান্ডম লাইন পরিবর্তন"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  🎲 র‍্যান্ডম
                </button>
              </div>

              {/* Active Selected Headline Banner (Directly Editable!) */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 flex items-center gap-1.5">
                    নির্বাচিত লাইন (এডিটেবল)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {selectedHeadline.split(' ').filter(Boolean).length} শব্দ • ছোট ও মার্জিত
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedHeadline}
                    onChange={(e) => setSelectedHeadline(e.target.value)}
                    placeholder="নিজের মতো ছোট বাংলা লাইন লিখুন (যেমন: এক চিলতে মিষ্টি হাসি)..."
                    className="w-full bg-[#100F15] border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-200 placeholder-amber-200/40 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Live Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="সংক্ষিপ্ত লাইনের মধ্যে সার্চ করুন (যেমন: ভালোবাসা, জন্মদিন, অভিমান, স্বাদ...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#18161E] border border-[#2B2735] focus:border-amber-500/60 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'all', label: `সব (${ALL_HEADLINES.length})` },
                  { id: 'love', label: '❤️ প্রিয়জন' },
                  { id: 'birthday', label: '🎂 জন্মদিন' },
                  { id: 'apology', label: '🥺 মান-অভিমান' },
                  { id: 'self', label: '☕ নিজের ট্রিট' },
                  { id: 'taste', label: '✨ খাঁটি স্বাদ' },
                  { id: 'family', label: '👨‍👩‍👧 পরিবার' },
                  { id: 'anniversary', label: '💍 বিবাহবার্ষিকী' },
                  { id: 'celebration', label: '🎉 উৎসব ও আড্ডা' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-colors text-xs ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-black font-semibold shadow-sm'
                        : 'bg-[#18161E] text-zinc-400 hover:text-zinc-200 hover:bg-[#201D28]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Headlines Compact 2-Column Grid */}
              <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 pr-1 custom-scrollbar">
                {filteredHeadlines.map((item, idx) => {
                  const isSelected = selectedHeadline.trim() === item.text.trim();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedHeadline(item.text)}
                      className={`text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-amber-500/20 border border-amber-500/60 text-amber-200 font-semibold shadow-sm'
                          : 'bg-[#15131A] hover:bg-[#1D1A25] border border-[#262330] text-zinc-300'
                      }`}
                    >
                      <span className="truncate pr-1.5">“{item.text}”</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 font-mono shrink-0">
                          বাছাই
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 2: SELECT TYPOGRAPHY STYLE (REAL PREVIEWS!) ================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    টাইপোগ্রাফি স্টাইল
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                      ১৫টি স্টাইল
                    </span>
                  </h3>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#18161E] p-1 rounded-xl border border-[#2B2735] text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setTypoFilter('locked')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      typoFilter === 'locked'
                        ? 'bg-amber-500 text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    লকড (৩)
                  </button>
                  <button
                    onClick={() => setTypoFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      typoFilter === 'all'
                        ? 'bg-amber-500 text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    সব ({TYPOGRAPHY_STYLES.length})
                  </button>
                </div>
              </div>

              {/* Active Selection Summary Banner */}
              <div className="p-3 rounded-2xl bg-[#17151E] border border-amber-500/30 flex items-center gap-3">
                <img 
                  src={currentTypoObj.previewImg} 
                  alt={currentTypoObj.nameBn} 
                  className="w-16 h-12 rounded-lg object-cover border border-amber-500/40 shrink-0 bg-black/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-200 truncate">{currentTypoObj.nameBn}</span>
                    {currentTypoObj.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                        {currentTypoObj.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{currentTypoObj.description}</p>
                </div>
              </div>

              {/* Typography Preview Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredTypoStyles.map((item) => {
                  const isSelected = selectedTypoStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTypoStyle(item.id)}
                      className={`relative flex flex-col rounded-2xl overflow-hidden text-left transition-all p-3 border group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                          : 'bg-[#15131A] hover:bg-[#1D1A25] border-[#2B2735] text-zinc-300'
                      }`}
                    >
                      {item.badge && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            item.isLocked 
                              ? 'bg-amber-500 text-black font-bold shadow-md'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                      )}

                      <div className="w-full h-24 rounded-xl overflow-hidden bg-black/60 border border-white/5 mb-2.5 relative flex items-center justify-center">
                        <img 
                          src={item.previewImg} 
                          alt={item.nameBn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-zinc-300 font-medium">
                          {item.nameEn}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-zinc-200'}`}>
                          {item.nameBn}
                        </h4>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Typography Scale & Brand Name Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#23202B]">
                {/* Brand Name Option */}
                <div className="p-3 rounded-2xl bg-[#141219] border border-[#2B2735] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      ব্র্যান্ড নাম (&quot;{currentBrand.nameBn}&quot;)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                      {brandOption === 'none' ? 'বাদ দেওয়া' : brandOption === 'subtle' ? 'ছোট সিগনেচার' : 'পূর্ণ'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBrandOption('none')}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        brandOption === 'none'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-[#1A1822] border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      🚫 বাদ দিন (সেরা)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrandOption('subtle')}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        brandOption === 'subtle'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-[#1A1822] border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      🪶 ছোট সিগনেচার
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrandOption('full')}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        brandOption === 'full'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-[#1A1822] border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      🏷️ পূর্ণ নাম
                    </button>
                  </div>

                </div>

                {/* Text Size / Negative Space Option */}
                <div className="p-3 rounded-2xl bg-[#141219] border border-[#2B2735] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      লেখার সাইজ ও নেগেটিভ স্পেস
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                      {textSizeOption === 'refined' ? 'পরিমিত (১৫-১৮%)' : textSizeOption === 'medium' ? 'মাঝারি' : 'বোল্ড'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTextSizeOption('refined')}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        textSizeOption === 'refined'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-[#1A1822] border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      ✨ মার্জিত ও ছোট
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextSizeOption('medium')}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        textSizeOption === 'medium'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-[#1A1822] border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      ⚖️ মাঝারি
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextSizeOption('large')}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        textSizeOption === 'large'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-[#1A1822] border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      📢 বড় ও বোল্ড
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: SELECT BACKGROUND, PEDESTAL & RATIO ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Section 1: Background & Lighting (10 Real Generated Styles!) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      ১. ব্যাকগ্রাউন্ড ও লাইটিং
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                    ১০টি শৈলী
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {BACKGROUND_STYLES.map((bg) => {
                    const isSelected = selectedImageStyle === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => setSelectedImageStyle(bg.id)}
                        className={`relative p-3 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                            : 'bg-[#15131A] hover:bg-[#1D1A25] border-[#2B2735]'
                        }`}
                      >
                        {/* Real Image Preview */}
                        <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 relative bg-black/60">
                          <img 
                            src={bg.previewImg} 
                            alt={bg.nameBn} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-amber-300 truncate">{bg.nameBn}</h4>
                            {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                          </div>

                          {bg.badge && (
                            <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                              {bg.badge}
                            </span>
                          )}

                          <p className="text-[11px] text-zinc-300 font-medium mt-1 line-clamp-1">{bg.shortDesc}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {bg.fullDescBn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Pedestal Selection with REAL PREVIEWS! */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      ২. পেডেস্টাল বেস
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                    ৭টি বেস
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {PEDESTAL_OPTIONS.map((ped) => {
                    const isSelected = selectedPedestal === ped.id;
                    return (
                      <button
                        key={ped.id}
                        onClick={() => setSelectedPedestal(ped.id as BasePedestalKey)}
                        className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 text-amber-200 shadow-md'
                            : 'bg-[#15131A] hover:bg-[#1D1A25] border-[#2B2735] text-zinc-300'
                        }`}
                      >
                        {/* Real Base Preview Image */}
                        <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-black/60 border border-white/5 relative">
                          <img 
                            src={ped.previewImg} 
                            alt={ped.nameBn} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-1 left-1.5 text-xs bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {ped.icon}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1.5 bg-amber-500 text-black p-0.5 rounded-full">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-[11px] font-bold leading-tight truncate">{ped.nameBn}</div>
                          <div className="text-[9px] text-zinc-400 truncate mt-0.5">{ped.nameEn}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Ratio Selection */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1 flex items-center gap-2">
                  <RatioIcon className="w-4 h-4 text-amber-400" />
                  ৩. অ্যাসপেক্ট রেশিও
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: '4:5', label: '৪:৫ পোর্ট্রেট', sub: 'ইনস্টাগ্রাম/ম্যাগাজিন (লকড রিকমেন্ডেড)' },
                    { id: '9:16', label: '৯:১৬ ভার্টিক্যাল', sub: 'স্টোরি, রিল ও শর্টস' },
                    { id: '1:1', label: '১:১ স্কয়ার', sub: 'ফেসবুক স্কয়ার পোস্ট' }
                  ].map((r) => {
                    const isSelected = selectedRatio === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRatio(r.id as AspectRatioKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-bold'
                            : 'bg-[#15131A] hover:bg-[#1D1A25] border-[#2B2735] text-zinc-400'
                        }`}
                      >
                        <div className="text-xs">{r.label}</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5">{r.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 4: RESULT & LAUNCH TO GEMINI ================= */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    ৮K মাস্টার প্রম্পট প্রস্তুত
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateInApp}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>রেন্ডার হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ সরাসরি ছবি তৈরি</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyAndOpenGemini}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1B1824] hover:bg-[#252230] text-amber-300 border border-amber-500/40 hover:border-amber-500 font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি ও জেমিনি ↗</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Selection Summary Pill with Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#17151E] border border-[#2B2735] flex items-center gap-2">
                  <img src={currentTypoObj.previewImg} alt={currentTypoObj.nameBn} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-amber-500/30" />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">টাইপো স্টাইল</span>
                    <span className="font-semibold text-amber-300 truncate block">{currentTypoObj.nameBn}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#17151E] border border-[#2B2735] flex items-center gap-2">
                  <img src={currentBgObj.previewImg} alt={currentBgObj.nameBn} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-amber-500/30" />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">ক্যানভাস লাইটিং</span>
                    <span className="font-semibold text-zinc-200 truncate block">{currentBgObj.nameBn}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#17151E] border border-[#2B2735] flex items-center gap-2">
                  <img src={currentPedestalObj.previewImg} alt={currentPedestalObj.nameBn} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-amber-500/30" />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">পেডেস্টাল</span>
                    <span className="font-semibold text-zinc-200 truncate block">{currentPedestalObj.nameBn}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#17151E] border border-[#2B2735] flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">রেশিও</span>
                    <span className="text-[9px] text-zinc-400">{brandOption === 'none' ? 'ব্র্যান্ড ছাড়া' : 'ব্র্যান্ড সহ'}</span>
                  </div>
                  <span className="font-semibold text-amber-400 block">{selectedRatio} • {textSizeOption === 'refined' ? 'পরিমিত সাইজ' : textSizeOption === 'medium' ? 'মাঝারি' : 'বোল্ড'}</span>
                </div>
              </div>

              {/* Prompt Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-[#0D0C10] border border-[#2D2936] rounded-xl">
                <button
                  onClick={() => {
                    setPromptMode('full');
                    const h = selectedHeadline.trim() || (currentBrand.defaultHeadlines[0]?.text || 'এক চিলতে মিষ্টি হাসি');
                    setFinalPrompt(buildPrompt('full', h, brandOption, textSizeOption));
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${promptMode === 'full' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  ✍️ টাইপোগ্রাফি সহ (সম্পূর্ণ)
                </button>
                <button
                  onClick={() => {
                    setPromptMode('composition');
                    const h = selectedHeadline.trim() || (currentBrand.defaultHeadlines[0]?.text || 'এক চিলতে মিষ্টি হাসি');
                    setFinalPrompt(buildPrompt('composition', h, brandOption, textSizeOption));
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${promptMode === 'composition' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  🎨 শুধু কম্পোজিশন (রিকমেন্ডেড)
                </button>
              </div>

              {/* In-App Generated Image Preview (if generated) */}
              {generatedImageUrl && (
                <div className="p-3.5 rounded-2xl bg-[#110F16] border-2 border-emerald-500/40 space-y-2.5 animate-fade-in shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      ৮K এডিটোরিয়াল ব্যানার সফলভাবে তৈরি হয়েছে!
                    </span>
                    <a
                      href={generatedImageUrl}
                      download={`brand-banner-${Date.now()}.jpg`}
                      className="py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      📥 ডাউনলোড ইমেজ
                    </a>
                  </div>
                  <div className="w-full max-h-72 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
                    <img
                      src={generatedImageUrl}
                      alt="Generated Visual Banner"
                      className="max-h-72 w-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {generateError && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
                  <span>⚠️ {generateError}</span>
                  <button
                    onClick={handleCopyAndOpenGemini}
                    className="text-amber-400 font-bold underline ml-2"
                  >
                    Gemini-তে খুলুন →
                  </button>
                </div>
              )}

              {/* Prompt Output Code Box */}
              <div className="relative">
                <textarea
                  readOnly
                  value={finalPrompt}
                  className="w-full h-56 p-3.5 bg-[#0D0C10] border border-[#2D2936] rounded-2xl text-xs sm:text-sm text-zinc-300 font-mono focus:outline-none custom-scrollbar resize-none leading-relaxed"
                />
              </div>

              {/* Quick Helper Note */}
              <div className="py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
                <span>💡 Gemini ওপেন করে আপনার আসল কেকের ছবি আপলোড করুন এবং প্রম্পটটি পেস্ট করুন।</span>
                <span className="text-[10px] text-amber-400/80 font-mono">Image-to-Image 8K</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="pt-3 border-t border-[#24212C] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1B1922] hover:bg-[#252230] text-zinc-300 rounded-xl text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              পূর্ববর্তী ধাপ
            </button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all ml-auto"
            >
              পরবর্তী ধাপ: টাইপো স্টাইল
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all ml-auto"
            >
              পরবর্তী ধাপ: বেস ও রেশিও
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all ml-auto"
            >
              ৮K প্রম্পট তৈরি করুন
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1B1922] hover:bg-[#252230] text-zinc-300 rounded-xl text-xs font-medium transition-colors ml-auto"
            >
              নতুন প্রম্পট তৈরি করুন 🔄
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
