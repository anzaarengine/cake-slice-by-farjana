'use client';

import React from 'react';
import { Sparkles, Image as ImageIcon, Layers, Video, MessageSquare, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'carousel' | 'video' | 'copywriter';
  onTabChange: (tab: 'studio' | 'carousel' | 'video' | 'copywriter') => void;
  onOpenSettings: () => void;
  isGeminiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  isGeminiConnected
}) => {
  const tabs = [
    { id: 'studio', label: 'Studio 4:5', icon: ImageIcon, badge: 'Editorial' },
    { id: 'carousel', label: 'Carousel (3–4 Photos)', icon: Layers, badge: 'Post' },
    { id: 'video', label: 'Reels Studio', icon: Video, badge: '9:16' },
    { id: 'copywriter', label: 'AI Copywriter', icon: MessageSquare, badge: 'Gemini' }
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0A0D]/90 backdrop-blur-md border-b border-[#211E26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E1712] via-[#2F2116] to-[#453221] border border-[#DFBA75]/40 flex items-center justify-center shadow-lg">
            <span className="font-serif font-black text-lg text-[#DFBA75]">কে</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base tracking-wide text-zinc-100">
                কেক স্লাইস বাই ফারজানা
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/25">
                OS
              </span>
            </div>
            <p className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-light">
              Cake Slice by Farjana • Brand Content OS
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-[#131216] border border-[#26232D] p-1 rounded-2xl shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1F1B26] text-[#DFBA75] shadow-[0_0_15px_rgba(223,186,117,0.15)] border border-[#DFBA75]/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18161D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DFBA75]' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Gemini Status & Settings */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-[#141318] hover:bg-[#1B1922] border border-[#2A2733] transition-colors"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isGeminiConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-amber-400/80'
              }`}
            />
            <span className="text-xs text-zinc-300 font-medium">
              {isGeminiConnected ? 'Gemini Pro Ready' : 'Setup Gemini API'}
            </span>
            <Settings className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </button>
        </div>

      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-[#1C1A22] gap-2 bg-[#0E0D10]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#DFBA75] text-black font-semibold'
                  : 'text-zinc-400 bg-[#16141A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
