'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StudioTab } from '@/components/StudioTab';
import { CarouselTab } from '@/components/CarouselTab';
import { VideoTab } from '@/components/VideoTab';
import { CopywriterTab } from '@/components/CopywriterTab';
import { SettingsModal } from '@/components/SettingsModal';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'studio' | 'carousel' | 'video' | 'copywriter'>('studio');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load API Key & Model from localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedKey = localStorage.getItem('cake_slice_gemini_key') || '';
    const savedModel = localStorage.getItem('cake_slice_gemini_model') || 'gemini-2.5-flash';
    setApiKey(savedKey);
    setSelectedModel(savedModel);
  }, []);

  const handleSaveApiKey = (newKey: string, newModel: string) => {
    setApiKey(newKey);
    setSelectedModel(newModel);
    localStorage.setItem('cake_slice_gemini_key', newKey);
    localStorage.setItem('cake_slice_gemini_model', newModel);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#070608]" />;
  }

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
        
        {/* Welcome & Brand Banner */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#141217] via-[#1B1721] to-[#141118] border border-[#26222E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#DFBA75] font-semibold">
                L U X U R Y   E D I T O R I A L   A E S T H E T I C S
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
              Cake Slice by Farjana (কেক স্লাইস বাই ফারজানা)
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              আপনার কেকের আসল রূপ অপরিবর্তিত রেখে তৈরি করুন আন্তর্জাতিক ম্যাগাজিন স্টাইলের ভিজ্যুয়াল, ক্যারোসেল ও ভাইরাল রিলস কনটেন্ট।
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            {!apiKey && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="py-2 px-3.5 bg-[#DFBA75]/10 hover:bg-[#DFBA75]/20 text-[#DFBA75] text-xs font-medium rounded-xl border border-[#DFBA75]/30 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFBA75]" />
                <span>Connect Gemini Pro API</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'studio' && (
          <StudioTab
            apiKey={apiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
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
          Designed for 4:5 Editorial Portrait Feeds & 9:16 Social Reels. Zero Clutter. 100% Bespoke Craft.
        </p>
      </footer>

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
