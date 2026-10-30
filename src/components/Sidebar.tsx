'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Layers, 
  Type, 
  Palette, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronDown, 
  PlusCircle, 
  PanelLeftClose, 
  PanelLeft, 
  Check, 
  Lock, 
  FolderHeart,
  Tag,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { BrandProfile } from '@/data/brands';
import { AuthSession } from '@/types/auth';

interface SidebarProps {
  session: AuthSession;
  brands: BrandProfile[];
  activeBrand: BrandProfile;
  activeBrandId: string;
  isCollapsed: boolean;
  isOpenMobile: boolean;
  totalHistoryCount: number;
  activeCategoryFilter: string;
  activeView: 'dashboard' | 'brand-setup';
  isGeminiConnected: boolean;
  selectedModel: string;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onSelectBrand: (brand: BrandProfile) => void;
  onOpenCreateBrand: () => void;
  onOpenWizard: (step: 1 | 2 | 3 | 4) => void;
  onOpenSettings: () => void;
  onOpenAdminConsole: () => void;
  onSelectCategoryFilter: (category: string) => void;
  onChangeView: (view: 'dashboard' | 'brand-setup') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  session,
  brands,
  activeBrand,
  activeBrandId,
  isCollapsed,
  isOpenMobile,
  totalHistoryCount,
  activeCategoryFilter,
  activeView,
  isGeminiConnected,
  selectedModel,
  onToggleCollapse,
  onCloseMobile,
  onSelectBrand,
  onOpenCreateBrand,
  onOpenWizard,
  onOpenSettings,
  onOpenAdminConsole,
  onSelectCategoryFilter,
  onChangeView,
  onLogout
}) => {
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  const isSuperAdmin = session.role === 'super_admin';

  const categories = [
    { id: 'all', label: 'সব হিস্ট্রি', icon: '📁' },
    { id: 'love', label: 'প্রিয়জন ও অনুভূতি', icon: '❤️' },
    { id: 'birthday', label: 'জন্মদিন উৎসব', icon: '🎂' },
    { id: 'taste', label: 'খাঁটি স্বাদ ও প্রিমিয়াম', icon: '✨' },
    { id: 'apology', label: 'মান-অভিমান ভাঙানো', icon: '🥺' },
    { id: 'self', label: 'নিজের বিশেষ ট্রিট', icon: '☕' }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 md:z-30 bg-[#09080E] border-r border-[#1C1A24] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* ================= 1. TOP HEADER & BRAND ================= */}
        <div className="p-3 border-b border-[#1C1A24]">
          <div className="flex items-center justify-between gap-2">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-lg border border-white/5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${activeBrand.accentColor}18` }}
              >
                <span>{activeBrand.icon}</span>
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-xs sm:text-sm text-zinc-100 truncate block">
                      {activeBrand.nameBn}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono block truncate">
                    {activeBrand.productTypeBn}
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button (Desktop only) */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-xl hover:bg-[#191722] text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
              title={isCollapsed ? 'সাইডবার প্রসারিত করুন' : 'সাইডবার গুটিয়ে নিন'}
            >
              {isCollapsed ? (
                <PanelLeft className="w-4 h-4 text-amber-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Super Admin Brand Switcher Dropdown (Inside Sidebar) */}
          {!isCollapsed && isSuperAdmin && (
            <div className="relative mt-3">
              <button
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-[#13111A] hover:bg-[#1A1724] border border-[#2B2738] text-xs text-zinc-300 transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="truncate">ব্র্যান্ড পরিবর্তন ({brands.length})</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isBrandDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBrandDropdownOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#121017] border border-[#2B2735] rounded-2xl shadow-2xl z-50 p-1.5 space-y-1 animate-fade-in max-h-56 overflow-y-auto custom-scrollbar">
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSelectBrand(b);
                          setIsBrandDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                          b.id === activeBrandId
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                            : 'hover:bg-[#1B1824] text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{b.icon}</span>
                          <span className="truncate">{b.nameBn}</span>
                        </div>
                        {b.id === activeBrandId && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    ))}

                    <div className="pt-1 border-t border-[#23202C]">
                      <button
                        onClick={() => {
                          setIsBrandDropdownOpen(false);
                          onOpenCreateBrand();
                        }}
                        className="w-full py-1.5 px-2 rounded-xl text-[11px] font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ নতুন ব্র্যান্ড</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tenant Verified Space Badge (Inside Sidebar) */}
          {!isCollapsed && !isSuperAdmin && (
            <div className="mt-2.5 px-2.5 py-1.5 rounded-xl bg-[#14121B] border border-[#23202D] flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5 font-mono">
                <Lock className="w-3 h-3 text-emerald-400" />
                ক্লায়েন্ট স্পেস
              </span>
              <span className="text-[10px] text-amber-300 font-medium truncate max-w-[120px]">
                {session.clientName}
              </span>
            </div>
          )}
        </div>

        {/* ================= 2. MIDDLE NAVIGATION & CONTROLS ================= */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">

          {/* Main Primary Action Button */}
          <div className="px-1">
            <button
              onClick={() => onOpenWizard(1)}
              className={`w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all group ${
                isCollapsed ? 'px-0' : ''
              }`}
              title="নতুন প্রম্পট তৈরি করুন"
            >
              <Sparkles className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
              {!isCollapsed && <span className="truncate">নতুন প্রম্পট তৈরি</span>}
            </button>
          </div>

          {/* Primary View Switcher */}
          <div className="space-y-1">
            <button
              onClick={() => onChangeView('dashboard')}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs ${
                activeView === 'dashboard'
                  ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15131C]'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="ড্যাশবোর্ড ও হিস্ট্রি"
            >
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && <span className="truncate flex-1">ড্যাশবোর্ড ও হিস্ট্রি</span>}
            </button>

            <button
              onClick={() => onChangeView('brand-setup')}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs ${
                activeView === 'brand-setup'
                  ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15131C]'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="ব্র্যান্ড ওএস ডিএনএ সেটআপ"
            >
              <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="truncate">ব্র্যান্ড ওএস সেটআপ</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    DNA
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Quick Studio Nav */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                স্টুডিও ও উইজার্ড
              </div>
            )}

            <button
              onClick={() => onOpenWizard(1)}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#15131C] group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="১. বাংলা স্লোগান নির্বাচন"
            >
              <Type className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="truncate">বাংলা স্লোগান লাইব্রেরি</span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-[#1A1822] px-1.5 py-0.5 rounded">
                    ১
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => onOpenWizard(2)}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#15131C] group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="২. টাইপোগ্রাফি স্টাইল"
            >
              <Palette className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="truncate">টাইপোগ্রাফি স্টাইলস</span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-[#1A1822] px-1.5 py-0.5 rounded">
                    ২
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => onOpenWizard(3)}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#15131C] group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="৩. ব্যাকগ্রাউন্ড ও পেডেস্টাল"
            >
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="truncate">ক্যানভাস ও পেডেস্টাল</span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-[#1A1822] px-1.5 py-0.5 rounded">
                    ৩
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Category Filters (Dynamic Drilldown) */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 flex items-center justify-between">
                <span>হিস্ট্রি ফিল্টার</span>
                <span className="text-[10px] text-amber-400/80 font-mono">{totalHistoryCount}টি</span>
              </div>
            )}

            {categories.map((cat) => {
              const isActive = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14121A]'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={cat.label}
                >
                  <span className="text-sm shrink-0">{cat.icon}</span>
                  {!isCollapsed && (
                    <span className="truncate flex-1">{cat.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin Management Tools (If Super Admin) */}
          {isSuperAdmin && (
            <div className="space-y-1 pt-2 border-t border-[#1C1A24]">
              {!isCollapsed && (
                <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-amber-400/70 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  মাস্টার কন্ট্রোল
                </div>
              )}

              <button
                onClick={onOpenAdminConsole}
                className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs text-amber-300 hover:bg-amber-500/15 border border-transparent hover:border-amber-500/30 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title="অ্যাডমিন কনসোল"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span className="truncate font-semibold">অ্যাডমিন কনসোল</span>}
              </button>
            </div>
          )}

        </div>

        {/* ================= 3. BOTTOM PROFILE & SYSTEM STATUS ================= */}
        <div className="p-2.5 border-t border-[#1C1A24] space-y-2">
          
          {/* AI Model Pulse Status */}
          {!isCollapsed ? (
            <div className="p-2 rounded-xl bg-[#121017] border border-[#211E29] flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
                <span className={`w-2 h-2 rounded-full ${isGeminiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="truncate">{selectedModel}</span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
                title="API সেটিংস"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl hover:bg-[#1A1822] text-zinc-400 hover:text-zinc-200 transition-colors"
                title="API সেটিংস"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User Account & Logout */}
          <div className="flex items-center justify-between gap-1 p-1">
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-200 truncate font-mono">
                  @{session.userId}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {isSuperAdmin ? 'Super Admin' : 'Client Access'}
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              className={`p-2 rounded-xl hover:bg-rose-500/15 text-zinc-500 hover:text-rose-400 transition-colors ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title="লগআউট করুন"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};
