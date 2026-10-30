'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Settings, 
  Trash2, 
  ChevronDown, 
  PlusCircle, 
  Clock, 
  LogOut, 
  ShieldCheck, 
  Lock,
  Menu,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { PromptWizardModal } from '@/components/PromptWizardModal';
import { SettingsModal } from '@/components/SettingsModal';
import { CreateBrandModal } from '@/components/CreateBrandModal';
import { AdminConsoleModal } from '@/components/AdminConsoleModal';
import { LoginScreen } from '@/components/LoginScreen';
import { Sidebar } from '@/components/Sidebar';
import { PromptConfig } from '@/types';
import { BrandProfile, INITIAL_BRANDS } from '@/data/brands';
import { AuthSession } from '@/types/auth';
import { getCurrentSession, logoutSession } from '@/data/authAccounts';

export default function Home() {
  // Authentication State
  const [session, setSession] = useState<AuthSession | null>(() => {
    if (typeof window !== 'undefined') {
      return getCurrentSession();
    }
    return null;
  });
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);

  // Dynamic Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('brandos_sidebar_collapsed') === 'true';
    }
    return false;
  });
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Settings State
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  
  // Brands Multi-Tenant State
  const [brands, setBrands] = useState<BrandProfile[]>(INITIAL_BRANDS);
  const [activeBrandId, setActiveBrandId] = useState<string>('cake-slice');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isCreateBrandOpen, setIsCreateBrandOpen] = useState(false);

  // Modals & Wizard
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Prompt History
  const [promptHistory, setPromptHistory] = useState<PromptConfig[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Toggle Sidebar collapse & save
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('brandos_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut for toggling sidebar: "[" or "Ctrl+B" / "Cmd+B"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load state from localStorage on mount
  useEffect(() => {
    // 1. Check existing Auth session
    const currentSess = getCurrentSession();
    if (currentSess) {
      setSession(currentSess);
      if (currentSess.role === 'tenant' && currentSess.brandId) {
        setActiveBrandId(currentSess.brandId);
      }
    }

    // 2. Deep link check
    if (typeof window !== 'undefined' && window.location.search.includes('wizard')) {
      const params = new URLSearchParams(window.location.search);
      const stepVal = params.get('wizard');
      if (stepVal === '2') setWizardStep(2);
      else if (stepVal === '3') setWizardStep(3);
      else if (stepVal === '4') setWizardStep(4);
      else setWizardStep(1);
      setIsWizardOpen(true);
    }

    // 3. Load API settings
    const savedKey = localStorage.getItem('cake_slice_gemini_key') || '';
    const savedModel = localStorage.getItem('cake_slice_gemini_model') || 'gemini-2.5-flash';
    setApiKey(savedKey);
    setSelectedModel(savedModel);

    // 4. Load Brand Workspaces
    try {
      const savedBrands = localStorage.getItem('brand_workspaces');
      if (savedBrands) {
        const parsed = JSON.parse(savedBrands);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customOnly = parsed.filter(b => b.isCustom);
          setBrands([...INITIAL_BRANDS, ...customOnly]);
        }
      }
      if (!currentSess || currentSess.role === 'super_admin') {
        const savedActiveBrand = localStorage.getItem('active_brand_id');
        if (savedActiveBrand) {
          setActiveBrandId(savedActiveBrand);
        }
      }
    } catch {
      // ignore
    }

    // 5. Load Saved Prompt History
    try {
      const savedHistory = localStorage.getItem('cake_slice_prompts_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPromptHistory(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    if (newSession.role === 'tenant' && newSession.brandId) {
      setActiveBrandId(newSession.brandId);
    }
  };

  const handleLogout = () => {
    logoutSession();
    setSession(null);
  };

  const activeBrand = useMemo(() => {
    return brands.find(b => b.id === activeBrandId) || brands[0] || INITIAL_BRANDS[0];
  }, [brands, activeBrandId]);

  const handleSelectBrand = (brand: BrandProfile) => {
    if (session?.role === 'tenant') return; // Locked for tenants
    setActiveBrandId(brand.id);
    setIsBrandDropdownOpen(false);
    try {
      localStorage.setItem('active_brand_id', brand.id);
    } catch {
      // ignore
    }
  };

  const handleCreateBrand = (newBrand: BrandProfile) => {
    setBrands((prev) => {
      const updated = [...prev, newBrand];
      try {
        localStorage.setItem('brand_workspaces', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    handleSelectBrand(newBrand);
  };

  const handleSaveApiKey = (newKey: string, newModel: string) => {
    setApiKey(newKey);
    setSelectedModel(newModel);
    localStorage.setItem('cake_slice_gemini_key', newKey);
    localStorage.setItem('cake_slice_gemini_model', newModel);
  };

  const handleSavePrompt = (newPrompt: PromptConfig) => {
    setPromptHistory((prev) => {
      const updated = [newPrompt, ...prev];
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

  const handleClearAllHistory = () => {
    if (confirm('আপনি কি সমস্ত প্রম্পট হিস্ট্রি মুছে ফেলতে চান?')) {
      setPromptHistory([]);
      try {
        localStorage.removeItem('cake_slice_prompts_history');
      } catch {
        // ignore
      }
    }
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

  // Filter history: If tenant, strictly only show prompts for their brand + apply category filter
  const visibleHistory = useMemo(() => {
    let list = promptHistory;
    if (session?.role === 'tenant' && session.brandId) {
      list = list.filter(h => !h.brandId || h.brandId === session.brandId);
    }
    if (activeCategoryFilter !== 'all') {
      const keywords: Record<string, string[]> = {
        love: ['ভালোবাসা', 'প্রিয়', 'যত্ন', 'হাসি', 'মন', 'মিষ্টি'],
        birthday: ['জন্মদিন', 'বছর', 'শুভ', 'উৎসব'],
        taste: ['স্বাদ', 'খাঁটি', 'তৃপ্তি', 'চকলেট', 'ক্রিম'],
        apology: ['অভিমান', 'ভুল', 'রাগ', 'ক্ষমা'],
        self: ['নিজের', 'ট্রিট', 'মুহূর্ত', 'একলা', 'আনন্দ']
      };
      const words = keywords[activeCategoryFilter] || [];
      if (words.length > 0) {
        list = list.filter(h => words.some(w => h.headline.includes(w)));
      }
    }
    return list;
  }, [promptHistory, session, activeCategoryFilter]);

  const isGeminiConnected = Boolean(apiKey && apiKey.trim().length > 10);

  // GATEKEEPER: If not authenticated, show luxury Login Screen
  if (!session) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070609] text-zinc-100 flex font-sans selection:bg-[#DFBA75] selection:text-black antialiased overflow-x-hidden">
      
      {/* ================= SUPER DYNAMIC ADVANCED SIDEBAR ================= */}
      <Sidebar
        session={session}
        brands={brands}
        activeBrand={activeBrand}
        activeBrandId={activeBrandId}
        isCollapsed={isSidebarCollapsed}
        isOpenMobile={isOpenMobileSidebar}
        totalHistoryCount={promptHistory.length}
        activeCategoryFilter={activeCategoryFilter}
        isGeminiConnected={isGeminiConnected}
        selectedModel={selectedModel}
        onToggleCollapse={toggleSidebarCollapse}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        onSelectBrand={handleSelectBrand}
        onOpenCreateBrand={() => setIsCreateBrandOpen(true)}
        onOpenWizard={openWizardAt}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onSelectCategoryFilter={(cat) => setActiveCategoryFilter(cat)}
        onLogout={handleLogout}
      />

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-72'
        }`}
      >
        
        {/* Minimalist Top Bar */}
        <header className="sticky top-0 z-20 w-full bg-[#09080D]/85 backdrop-blur-xl border-b border-[#1E1B24]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            
            {/* Left: Mobile Sidebar Trigger & Brand Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpenMobileSidebar(true)}
                className="md:hidden p-2 rounded-xl bg-[#141219] hover:bg-[#1E1B26] border border-[#2B2736] text-zinc-300 transition-colors"
                title="মেনু খুলুন"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xl hidden sm:inline">{activeBrand.icon}</span>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-serif">
                    {activeBrand.nameBn}
                    <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      BrandOS
                    </span>
                  </h2>
                  <span className="text-[10px] text-zinc-500 font-mono hidden sm:block">
                    {activeBrand.tagline}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action & Shortcuts */}
            <div className="flex items-center gap-2">
              {activeCategoryFilter !== 'all' && (
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors flex items-center gap-1"
                >
                  <span>ফিল্টার ক্লিয়ার</span>
                  <span className="text-xs">✕</span>
                </button>
              )}

              <button
                onClick={() => openWizardAt(1)}
                className="py-1.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl shadow-md shadow-amber-500/15 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>নতুন প্রম্পট</span>
              </button>
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          {visibleHistory.length === 0 ? (
            /* EMPTY STATE (When no prompts created yet) */
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-[#141219] border border-[#2A2635] flex items-center justify-center shadow-xl text-3xl">
                {activeBrand.icon}
              </div>

              <div className="space-y-1 max-w-sm">
                <h2 className="text-lg font-serif font-bold text-white">
                  {activeBrand.nameBn}
                </h2>
                <p className="text-xs text-zinc-400">
                  {activeCategoryFilter !== 'all' 
                    ? `"${activeCategoryFilter}" ক্যাটাগরিতে কোনো সংরক্ষিত প্রম্পট নেই` 
                    : activeBrand.tagline}
                </p>
                <p className="text-[11px] font-mono text-zinc-500 pt-1">
                  লগইন করা অ্যাকাউন্ট: <span className="text-amber-300">{session.clientName}</span>
                </p>
              </div>

              <button
                onClick={() => openWizardAt(1)}
                className="py-3 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>✨ নতুন প্রম্পট তৈরি করুন</span>
              </button>
            </div>
          ) : (
            /* PROMPT HISTORY VIEW (Only shown when prompts exist) */
            <div className="space-y-5 animate-fade-in">
              
              {/* History Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1E1C26]">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    সংরক্ষিত প্রম্পট হিস্ট্রি
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono">
                      {visibleHistory.length}টি
                    </span>
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openWizardAt(1)}
                    className="py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ নতুন প্রম্পট</span>
                  </button>

                  <button
                    onClick={handleClearAllHistory}
                    className="py-1.5 px-2.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                    title="সব হিস্ট্রি ক্লিয়ার করুন"
                  >
                    ক্লিয়ার
                  </button>
                </div>
              </div>

              {/* History Items List */}
              <div className="space-y-4">
                {visibleHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#0D0C11] border border-[#211E29] hover:border-[#332F3F] transition-all overflow-hidden shadow-lg space-y-0"
                  >
                    {/* Item Top Bar */}
                    <div className="px-4 py-2.5 bg-[#121017] border-b border-[#1F1C26] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300 text-sm">
                          “{item.headline}”
                        </span>
                        {item.brandName && (
                          <span className="text-[10px] text-zinc-400 font-mono bg-zinc-800/80 px-2 py-0.5 rounded-md">
                            {item.brandName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyPromptText(item.generatedPrompt, idx)}
                          className="py-1 px-3 bg-[#1C1924] hover:bg-[#252230] text-zinc-200 border border-[#2D293A] hover:border-amber-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>কপি</span>
                            </>
                          )}
                        </button>

                        <a
                          href="https://gemini.google.com/app"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => navigator.clipboard.writeText(item.generatedPrompt)}
                          className="py-1 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                        >
                          <span>Gemini ↗</span>
                        </a>

                        <button
                          onClick={() => handleDeletePrompt(idx)}
                          className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Tags */}
                    <div className="px-4 py-1.5 bg-[#0A090D] border-b border-[#191720] flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 font-mono">
                      <span>রেশিও: <strong className="text-zinc-300">{item.ratio}</strong></span>
                      <span>•</span>
                      <span>স্টাইল: <strong className="text-zinc-300">{item.imageStyle}</strong></span>
                      <span>•</span>
                      <span>টাইপো: <strong className="text-zinc-300">{item.typoStyle}</strong></span>
                      {item.createdAt && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-500">{item.createdAt}</span>
                        </>
                      )}
                    </div>

                    {/* Prompt Text Box */}
                    <div className="p-3.5 bg-[#07060A] font-mono text-[11px] text-zinc-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap select-all custom-scrollbar">
                      {item.generatedPrompt}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>

      </div>

      {/* 3. Wizard Modal */}
      <PromptWizardModal
        isOpen={isWizardOpen}
        initialStep={wizardStep}
        activeBrand={activeBrand}
        onClose={() => setIsWizardOpen(false)}
        onSavePrompt={handleSavePrompt}
      />

      {/* 4. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
      />

      {/* 5. Create Brand Modal (Admin only) */}
      <CreateBrandModal
        isOpen={isCreateBrandOpen}
        onClose={() => setIsCreateBrandOpen(false)}
        onCreateBrand={handleCreateBrand}
      />

      {/* 6. Master Admin Console Modal */}
      <AdminConsoleModal
        isOpen={isAdminConsoleOpen}
        brands={brands}
        onClose={() => setIsAdminConsoleOpen(false)}
        onAccountsUpdated={() => {}}
      />

    </div>
  );
}
