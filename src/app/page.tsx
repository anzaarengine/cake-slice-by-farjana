'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StudioTab } from '@/components/StudioTab';
import { CarouselTab } from '@/components/CarouselTab';
import { VideoTab } from '@/components/VideoTab';
import { CopywriterTab } from '@/components/CopywriterTab';
import { SettingsModal } from '@/components/SettingsModal';
import { PromptWizardModal } from '@/components/PromptWizardModal';
import { PromptConfig } from '@/types';
import { 
  Sparkles, 
  PlusCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Layers, 
  Crop, 
  HeartHandshake
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'studio' | 'carousel' | 'video' | 'copywriter'>('studio');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  
  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Prompt History
  const [promptHistory, setPromptHistory] = useState<PromptConfig[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedKey = localStorage.getItem('cake_slice_gemini_key') || '';
    const savedModel = localStorage.getItem('cake_slice_gemini_model') || 'gemini-2.5-flash';
    setApiKey(savedKey);
    setSelectedModel(savedModel);

    // Initial default prompt in history
    setPromptHistory([
      {
        headline: 'প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি',
        imageStyle: 'organic-earth',
        typoStyle: 'fluid',
        ratio: '4:5',
        generatedPrompt: `An editorial, ultra-premium advertising photograph in a 4:5 aspect ratio, featuring the user's uploaded cake situated strictly in the bottom 25% of the frame. The cake rests on an authentic raw travertine stone slab (natural porous earth stone), retaining its authentic original textures, frosting, decorations, and colors in high-fidelity.

The top 75% of the canvas is an empty, seamless warm taupe, sand, or light-beige plaster wall, leaving massive breathing space. Soft, natural diffused ambient lighting gently illuminates the cake and its unique base, casting realistic delicate shadows with grounded earthy calmness.

In the upper spacious background, elegant 3D embossed Bengali typography is prominently featured in rich dark-brown and warm bronze/gold liquid tones with natural flow and soft shadow depth:
- Main Emotional Headline: "প্রিয় মানুষটার মুখে এক চিলতে মিষ্টি হাসি"
- Brand Name directly below: "কেক স্লাইস" (Line 1) and "বাই ফারজানা" (Line 2)
- Typographical Artistic Treatment: strictly in the Fluid / Liquid style, characterized by smooth, organic, boldly curved shapes with natural flow, dynamic loops, and interconnected letters as if written with thick flowing liquid.
- Small understated English subtitle at bottom: "~ PREMIUM CAKES ~"

The image is clean, highly aesthetic, completely devoid of clutter or random props, strictly holding a luxury magazine cover layout. 8k, photorealistic. --ar 4:5`,
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
    setPromptHistory((prev) => [newPrompt, ...prev]);
  };

  const copyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#070608]" />;
  }

  const latestPrompt = promptHistory[0];

  return (
    <div className="min-h-screen bg-[#070608] text-zinc-100 flex flex-col font-sans selection:bg-[#DFBA75] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isGeminiConnected={Boolean(apiKey && apiKey.trim().length > 10)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HERO BANNER & MAIN CTA BUTTON */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141217] via-[#1C1824] to-[#121016] border border-[#2B2735] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#DFBA75] font-bold block mb-1">
              EDITORIAL PROMPT STUDIO & ARCHITECTURE
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-zinc-100">
              Cake Slice by Farjana (কেক স্লাইস বাই ফারজানা)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              আপনার কেকের কাঁচা ছবি আর আমাদের তৈরি মাস্টার প্রম্পট জেমিনি চ্যাটে দিলেই নিমেষেই তৈরি হবে ২নং ছবির মতো আর্ট ডিরেক্টর গ্রেড ভিজ্যুয়াল।
            </p>
          </div>

          {/* MAIN PROMPT CREATION BUTTON (User's primary requested button) */}
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="w-full md:w-auto py-4 px-7 rounded-2xl bg-gradient-to-r from-[#DFBA75] via-[#F4D998] to-[#C99C47] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(223,186,117,0.3)] hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>✨ নতুন ইমেজ প্রম্পট তৈরি করুন</span>
            </button>
          </div>

          {/* Subtle gold decorative glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#DFBA75]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* LATEST GENERATED PROMPT CARD (Appears prominently on the dashboard) */}
        {latestPrompt && (
          <div className="mb-8 p-6 rounded-3xl bg-[#111014] border-2 border-[#DFBA75]/40 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24202D]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-zinc-100">
                  সর্বশেষ প্রস্তুত মাস্টার প্রম্পট
                </span>
                <span className="text-[10px] text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20 font-medium">
                  {latestPrompt.ratio}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyPrompt(latestPrompt.generatedPrompt, 0)}
                  className="py-2 px-3.5 bg-[#1C1824] hover:bg-[#272233] border border-[#DFBA75]/40 text-xs font-semibold text-zinc-200 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  {copiedId === 0 ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#DFBA75]" />
                      <span>প্রম্পট কপি করুন</span>
                    </>
                  )}
                </button>

                <a
                  href="https://gemini.google.com/app"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => navigator.clipboard.writeText(latestPrompt.generatedPrompt)}
                  className="py-2 px-4 bg-[#DFBA75] hover:bg-[#E8C885] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>কপি করে Gemini-তে যান</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Selected parameters badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="py-1 px-2.5 rounded-lg bg-[#18161E] border border-zinc-800 text-[#DFBA75] font-semibold">
                বাংলা লাইন: “{latestPrompt.headline}”
              </span>
              <span className="py-1 px-2.5 rounded-lg bg-[#18161E] border border-zinc-800 text-zinc-300">
                স্টাইল: {latestPrompt.imageStyle === 'organic-earth' ? 'Organic Earth Tone (২নং ছবি)' : 'Dark & Warm Cinematic'}
              </span>
              <span className="py-1 px-2.5 rounded-lg bg-[#18161E] border border-zinc-800 text-zinc-300 capitalize">
                টাইপো: {latestPrompt.typoStyle}
              </span>
            </div>

            {/* Prompt Text Container */}
            <div className="p-4 rounded-2xl bg-[#09080B] border border-[#23202B] font-mono text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
              {latestPrompt.generatedPrompt}
            </div>

            <p className="text-[11px] text-zinc-400">
              💡 <strong>কীভাবে ব্যবহার করবেন:</strong> “কপি করে Gemini-তে যান” বাটনে চাপ দিয়ে Gemini খোলামাত্র আপনার কেকের ছবি ড্রপ করুন এবং <strong>Paste (Ctrl+V)</strong> দিয়ে সেন্ড করুন—২নং ছবির মতো ফলাফল পেয়ে যাবেন!
            </p>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#211E28]">
              <div>
                <h3 className="text-base font-serif font-bold text-zinc-100">
                  ৪:৫ লাইভ ভিজ্যুয়াল স্টুডিও ও কাস্টমাইজেশন
                </h3>
                <p className="text-xs text-zinc-400">
                  প্রম্পট দিয়ে জেমিনিতে বানানোর পাশাপাশি আপনি চাইলে সরাসরি এখানেও কেকের ছবি রেখে লাইভ পোস্টার দেখতে ও ডাউনলোড করতে পারেন
                </p>
              </div>
            </div>

            <StudioTab />
          </div>
        )}
        {activeTab === 'carousel' && <CarouselTab />}
        {activeTab === 'video' && <VideoTab apiKey={apiKey} />}
        {activeTab === 'copywriter' && <CopywriterTab apiKey={apiKey} />}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1B1922] py-6 px-4 text-center text-xs text-zinc-500">
        <p className="font-serif">
          © {new Date().getFullYear()} Cake Slice by Farjana (কেক স্লাইস বাই ফারজানা). All rights reserved.
        </p>
        <p className="text-[10px] text-zinc-600 mt-1">
          Super-minimalist high-end magazine editorial aesthetics. 100% Bespoke Craft.
        </p>
      </footer>

      {/* Prompt Wizard Step-by-Step Modal */}
      <PromptWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSavePrompt={handleSavePrompt}
      />

      {/* Settings Modal */}
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
