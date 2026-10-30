'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Settings, 
  Trash2, 
  RotateCcw,
  Layers,
  Palette,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { PromptWizardModal } from '@/components/PromptWizardModal';
import { SettingsModal } from '@/components/SettingsModal';
import { PromptConfig } from '@/types';
import { BACKGROUND_STYLES } from '@/data/backgroundStyles';
import { TYPOGRAPHY_STYLES } from '@/data/typographyStyles';
import { PEDESTAL_OPTIONS } from '@/data/pedestals';

const DEFAULT_ACTIVE_PROMPT: PromptConfig = {
  headline: 'এক চিলতে মিষ্টি হাসি',
  imageStyle: 'organic-earth',
  typoStyle: 'brush',
  ratio: '4:5',
  basePedestal: 'auto',
  brandOption: 'none',
  textSizeOption: 'refined',
  generatedPrompt: `Act as a world-class Art Director for my luxury bakery brand "Cake Slice by Farjana". Refer to the attached raw photo of my cake.

CRITICAL CAKE PRESERVATION:
Keep the cake from the uploaded photo 100% authentic and unaltered—preserve its exact frosting textures, colors, piping decorations, and topper in high-fidelity without AI re-imagination or distortion. The cake is a round celebration cake with: white smooth frosting on top featuring crossword-style piped lettering in dark chocolate, ocean teal-blue textured buttercream sides scattered with blue candy dots and white pearl sprinkles, elegant gold leaf foil accents at the base band, and a golden acrylic calligraphy topper in the front.

COMPOSITION & CANVAS (Aspect Ratio: 4:5):
The cake sits gracefully in the bottom 25% of the frame, resting naturally on a complementary bespoke natural base dynamically chosen to elevate the cake's authentic colors and design—such as a hand-carved dark wood block, a raw travertine slab, a matte artisanal ceramic platter, or a light-oak timber block, ensuring the placement looks organic and never repetitive. The top 75% of the canvas MUST be completely empty, an empty, seamless warm taupe, sand, or light beige plaster wall, offering massive breathing space. High-end luxury magazine editorial layout, zero clutter, and no random props.

LIGHTING & ATMOSPHERE:
Soft, natural ambient daylight wraps gently around the cake and its base, casting realistic delicate shadows with grounded earthy calmness and serene luxury.

BENGALI TYPOGRAPHY TREATMENT:
In the spacious upper background, render the typography strictly in the Artistic Brush Stroke style:
Brush Strokes / Artistic Brush style in off-white and rich light-gold dual tones. The letters feature rough, hand-painted artistic brushwork with authentic visible bristle textures, expressive sweep effects, dynamic paint strokes, and subtle 3D shading that casts soft shadows on the background.
Ensure the lettering appears organically integrated into the scene with natural 3D depth and subtle ambient shadows against the wall.

STRICT TEXT & BRANDING RULES (NO EXTRA LOGOS OR BRAND TEXT):
Render ONLY the single emotional Bengali headline: "এক চিলতে মিষ্টি হাসি".
Strictly DO NOT generate "Cake Slice by Farjana", "কেক স্লাইস", "বাই ফারজানা", or any English or bakery brand name text anywhere in the image. No bakery subheadings, no secondary logos. Keep the canvas clean with ONLY this single headline.

TYPOGRAPHY SCALE & NEGATIVE SPACE (CRITICAL - DO NOT MAKE TEXT GIGANTIC):
The headline typography MUST be refined, elegant, and moderate-to-small in scale (occupying only 12-18% of the upper negative space). Do NOT render oversized, gigantic, wall-dominating, or thick lettering. The vast, uncluttered negative breathing space around the typography is the primary hallmark of high-end luxury editorial design.

High-end luxury magazine advertising photograph, 8k resolution, photorealistic. --ar 4:5`,
  createdAt: 'প্রস্তুত'
};

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  
  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Prompt History
  const [promptHistory, setPromptHistory] = useState<PromptConfig[]>([DEFAULT_ACTIVE_PROMPT]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined' && window.location.search.includes('wizard')) {
      const params = new URLSearchParams(window.location.search);
      const stepVal = params.get('wizard');
      if (stepVal === '2') setWizardStep(2);
      else if (stepVal === '3') setWizardStep(3);
      else if (stepVal === '4') setWizardStep(4);
      else setWizardStep(1);
      setIsWizardOpen(true);
    }

    const savedKey = localStorage.getItem('cake_slice_gemini_key') || '';
    const savedModel = localStorage.getItem('cake_slice_gemini_model') || 'gemini-2.5-flash';
    setApiKey(savedKey);
    setSelectedModel(savedModel);

    // Load saved prompt history if exists
    try {
      const savedHistory = localStorage.getItem('cake_slice_prompts_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPromptHistory(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default pristine initial prompt
    setPromptHistory([
      {
        headline: 'এক চিলতে মিষ্টি হাসি',
        imageStyle: 'organic-earth',
        typoStyle: 'brush',
        ratio: '4:5',
        basePedestal: 'auto',
        brandOption: 'none',
        textSizeOption: 'refined',
        generatedPrompt: `Act as a world-class Art Director for my luxury bakery brand "Cake Slice by Farjana". Refer to the attached raw photo of my cake.

CRITICAL CAKE PRESERVATION:
Keep the cake from the uploaded photo 100% authentic and unaltered—preserve its exact frosting textures, colors, piping decorations, and topper in high-fidelity without AI re-imagination or distortion. The cake is a round celebration cake with: white smooth frosting on top featuring crossword-style piped lettering in dark chocolate, ocean teal-blue textured buttercream sides scattered with blue candy dots and white pearl sprinkles, elegant gold leaf foil accents at the base band, and a golden acrylic calligraphy topper in the front.

COMPOSITION & CANVAS (Aspect Ratio: 4:5):
The cake sits gracefully in the bottom 25% of the frame, resting naturally on a complementary bespoke natural base dynamically chosen to elevate the cake's authentic colors and design—such as a hand-carved dark wood block, a raw travertine slab, a matte artisanal ceramic platter, or a light-oak timber block, ensuring the placement looks organic and never repetitive. The top 75% of the canvas MUST be completely empty, an empty, seamless warm taupe, sand, or light beige plaster wall, offering massive breathing space. High-end luxury magazine editorial layout, zero clutter, and no random props.

LIGHTING & ATMOSPHERE:
Soft, natural ambient daylight wraps gently around the cake and its base, casting realistic delicate shadows with grounded earthy calmness and serene luxury.

BENGALI TYPOGRAPHY TREATMENT:
In the spacious upper background, render the typography strictly in the Artistic Brush Stroke style:
Brush Strokes / Artistic Brush style in off-white and rich light-gold dual tones. The letters feature rough, hand-painted artistic brushwork with authentic visible bristle textures, expressive sweep effects, dynamic paint strokes, and subtle 3D shading that casts soft shadows on the background.
Ensure the lettering appears organically integrated into the scene with natural 3D depth and subtle ambient shadows against the wall.

STRICT TEXT & BRANDING RULES (NO EXTRA LOGOS OR BRAND TEXT):
Render ONLY the single emotional Bengali headline: "এক চিলতে মিষ্টি হাসি".
Strictly DO NOT generate "Cake Slice by Farjana", "কেক স্লাইস", "বাই ফারজানা", or any English or bakery brand name text anywhere in the image. No bakery subheadings, no secondary logos. Keep the canvas clean with ONLY this single headline.

TYPOGRAPHY SCALE & NEGATIVE SPACE (CRITICAL - DO NOT MAKE TEXT GIGANTIC):
The headline typography MUST be refined, elegant, and moderate-to-small in scale (occupying only 12-18% of the upper negative space). Do NOT render oversized, gigantic, wall-dominating, or thick lettering. The vast, uncluttered negative breathing space around the typography is the primary hallmark of high-end luxury editorial design.

High-end luxury magazine advertising photograph, 8k resolution, photorealistic. --ar 4:5`,
        createdAt: 'এখন প্রস্তুত'
      }
    ]);
  }, []);

  const handleSaveApiKey = (newKey: string, newModel: string) => {
    setApiKey(newKey);
    setSelectedModel(newModel);
    localStorage.setItem('cake_slice_gemini_key', newKey);
    localStorage.setItem('cake_slice_gemini_model', newModel);
  };

  const handleSavePrompt = (newPrompt: PromptConfig) => {
    setPromptHistory((prev) => {
      const updated = [newPrompt, ...prev.slice(0, 19)];
      try {
        localStorage.setItem('cake_slice_prompts_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleDeletePrompt = (indexToDelete: number) => {
    setPromptHistory((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      try {
        localStorage.setItem('cake_slice_prompts_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const copyPromptText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openWizardAt = (stepNum: 1 | 2 | 3 | 4) => {
    setWizardStep(stepNum);
    setIsWizardOpen(true);
  };

  const activePrompt = promptHistory[0];

  const activeBgObj = useMemo(() => {
    if (!activePrompt) return BACKGROUND_STYLES[0];
    return BACKGROUND_STYLES.find(b => b.id === activePrompt.imageStyle) || BACKGROUND_STYLES[0];
  }, [activePrompt]);

  const activeTypoObj = useMemo(() => {
    if (!activePrompt) return TYPOGRAPHY_STYLES[0];
    return TYPOGRAPHY_STYLES.find(t => t.id === activePrompt.typoStyle) || TYPOGRAPHY_STYLES[0];
  }, [activePrompt]);

  const activePedestalObj = useMemo(() => {
    if (!activePrompt) return PEDESTAL_OPTIONS[0];
    return PEDESTAL_OPTIONS.find(p => p.id === activePrompt.basePedestal) || PEDESTAL_OPTIONS[0];
  }, [activePrompt]);

  // Render immediately for instant SSR/paint, state syncs via useEffect

  const isGeminiConnected = Boolean(apiKey && apiKey.trim().length > 10);

  return (
    <div className="min-h-screen bg-[#070609] text-zinc-100 flex flex-col font-sans selection:bg-[#DFBA75] selection:text-black antialiased">
      
      {/* 1. Ultra-Minimalist Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#09080D]/80 backdrop-blur-xl border-b border-[#1E1B24]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1E1712] via-[#2F2116] to-[#453221] border border-[#DFBA75]/40 flex items-center justify-center shadow-sm">
              <span className="font-serif font-black text-sm text-[#DFBA75]">কে</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm tracking-wide text-zinc-100">
                Cake Slice
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300">
                Studio Pro
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openWizardAt(1)}
              className="py-1.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl shadow-md shadow-amber-500/15 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>নতুন প্রম্পট</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-[#141218] hover:bg-[#1C1A22] border border-[#272431] text-zinc-400 hover:text-zinc-200 transition-colors"
              title="API সেটিংস"
            >
              <div className="relative">
                <Settings className="w-4 h-4" />
                <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${isGeminiConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Minimal Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Top Minimal Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white flex items-center gap-2">
              আর্ট ডিরেক্টর প্রম্পট ইঞ্জিন
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              ৮K এডিটোরিয়াল ফটোগ্রাফি • ১০টি লাইটিং আবহ • ১৫টি টাইপোগ্রাফি আর্ট
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => openWizardAt(1)}
              className="py-2.5 px-5 bg-[#17151E] hover:bg-[#201D2A] border border-amber-500/40 hover:border-amber-500 text-amber-300 text-xs font-semibold rounded-2xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>উইজার্ড ওপেন করুন (৪-স্টেপ)</span>
            </button>
          </div>
        </div>

        {/* Live Active Master Prompt Terminal */}
        {activePrompt && (
          <div className="rounded-3xl bg-[#0D0C11] border border-[#23202C] shadow-2xl overflow-hidden">
            
            {/* Terminal Window Header */}
            <div className="px-4 sm:px-5 py-3 bg-[#131117] border-b border-[#211E29] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-3 w-[1px] bg-zinc-700 mx-1" />
                <span className="text-xs font-mono font-medium text-zinc-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  master-prompt-active.txt
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                  {activePrompt.ratio}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyPromptText(activePrompt.generatedPrompt, 0)}
                  className="py-1.5 px-3 bg-[#1E1B26] hover:bg-[#272332] text-xs font-medium text-zinc-200 border border-[#2F2A3B] rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {copiedIndex === 0 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>প্রম্পট কপি</span>
                    </>
                  )}
                </button>

                <a
                  href="https://gemini.google.com/app"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => navigator.clipboard.writeText(activePrompt.generatedPrompt)}
                  className="py-1.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <span>Gemini খুলুন</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Parameter Badges */}
            <div className="px-4 sm:px-5 py-2.5 bg-[#0A090D] border-b border-[#1E1C25] flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#141219] border border-[#262330] text-amber-300 font-medium">
                “{activePrompt.headline}”
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-[#141219] border border-[#262330] text-zinc-400 text-[11px]">
                🎨 {activeBgObj.nameBn}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-[#141219] border border-[#262330] text-zinc-400 text-[11px]">
                ✍️ {activeTypoObj.nameBn}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-[#141219] border border-[#262330] text-zinc-400 text-[11px]">
                🏛️ {activePedestalObj.nameBn}
              </span>
            </div>

            {/* Prompt Code Content */}
            <div className="p-4 sm:p-5 bg-[#07060A] font-mono text-xs text-zinc-300 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap select-all custom-scrollbar">
              {activePrompt.generatedPrompt}
            </div>

            {/* Bottom 1-line note */}
            <div className="px-4 sm:px-5 py-2 bg-[#0C0B0F] border-t border-[#1B1922] text-[11px] text-zinc-400 flex items-center justify-between">
              <span>💡 Gemini ওপেন করে আপনার কেকের ছবি ড্রপ করুন এবং পেস্ট করুন।</span>
              <button
                onClick={() => openWizardAt(1)}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                এডিট করতে চান? উইজার্ড খুলুন →
              </button>
            </div>

          </div>
        )}

        {/* 3. Ten Real Lighting Styles Strip */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              ১০টি এডিটোরিয়াল লাইটিং স্টাইল (বাস্তব প্রিভিউ)
            </h2>
            <button
              onClick={() => openWizardAt(3)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              সবগুলো দেখুন →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {BACKGROUND_STYLES.slice(0, 5).map((bg) => (
              <button
                key={bg.id}
                onClick={() => openWizardAt(3)}
                className="p-2 rounded-2xl bg-[#110F15] hover:bg-[#1A1722] border border-[#24212C] hover:border-amber-500/50 text-left transition-all group overflow-hidden"
              >
                <div className="w-full h-24 rounded-xl overflow-hidden mb-2 relative bg-black/60">
                  <img
                    src={bg.previewImg}
                    alt={bg.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-zinc-300">
                    {bg.nameEn}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-zinc-200 truncate group-hover:text-amber-300 transition-colors">
                  {bg.nameBn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Prompt History (if more than 1 prompt) */}
        {promptHistory.length > 1 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                পূর্বের সংরক্ষিত প্রম্পট ({promptHistory.length})
              </h2>
            </div>

            <div className="space-y-2">
              {promptHistory.slice(1, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#0E0C12] border border-[#211E29] hover:border-[#322E3E] flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-zinc-200 truncate">
                      “{item.headline}”
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{item.imageStyle}</span>
                      <span>•</span>
                      <span>{item.typoStyle}</span>
                      <span>•</span>
                      <span>{item.ratio}</span>
                      <span>•</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyPromptText(item.generatedPrompt, idx + 1)}
                      className="p-2 rounded-xl bg-[#16141D] hover:bg-[#201D28] text-zinc-300 hover:text-white transition-colors"
                      title="কপি করুন"
                    >
                      {copiedIndex === idx + 1 ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(idx + 1)}
                      className="p-2 rounded-xl bg-[#16141D] hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. Minimal Footer */}
      <footer className="w-full border-t border-[#18161F] py-4 px-4 text-center text-[11px] text-zinc-400">
        <p>Cake Slice by Farjana • Editorial Art Direction Studio</p>
      </footer>

      {/* 6. Wizard Modal */}
      <PromptWizardModal
        isOpen={isWizardOpen}
        initialStep={wizardStep}
        onClose={() => setIsWizardOpen(false)}
        onSavePrompt={handleSavePrompt}
      />

      {/* 7. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
      />

    </div>
  );
}
