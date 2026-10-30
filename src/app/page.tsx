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
  Lock
} from 'lucide-react';
import { PromptWizardModal } from '@/components/PromptWizardModal';
import { SettingsModal } from '@/components/SettingsModal';
import { CreateBrandModal } from '@/components/CreateBrandModal';
import { AdminConsoleModal } from '@/components/AdminConsoleModal';
import { LoginScreen } from '@/components/LoginScreen';
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

  // Filter history: If tenant, strictly only show prompts for their brand
  const visibleHistory = useMemo(() => {
    if (session?.role === 'tenant' && session.brandId) {
      return promptHistory.filter(h => !h.brandId || h.brandId === session.brandId);
    }
    return promptHistory;
  }, [promptHistory, session]);

  const isGeminiConnected = Boolean(apiKey && apiKey.trim().length > 10);

  // GATEKEEPER: If not authenticated, show luxury Login Screen
  if (!session) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070609] text-zinc-100 flex flex-col font-sans selection:bg-[#DFBA75] selection:text-black antialiased">
      
      {/* 1. Minimal Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#09080D]/85 backdrop-blur-xl border-b border-[#1E1B24]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Identity / Selector */}
          {session.role === 'tenant' ? (
            /* Tenant Locked Brand Badge (No dropdown, 100% isolated) */
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#141219] border border-[#2B2736]">
              <span className="text-lg">{activeBrand.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-xs sm:text-sm text-zinc-100 truncate max-w-[150px] sm:max-w-[220px]">
                    {activeBrand.nameBn}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    ভেরিফাইড স্পেস
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono block truncate">
                  {session.clientName}
                </span>
              </div>
            </div>
          ) : (
            /* Super Admin Brand Selector Dropdown */
            <div className="relative">
              <button
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#141219] hover:bg-[#1D1A25] border border-amber-500/40 transition-all text-left"
              >
                <span className="text-base">{activeBrand.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-xs sm:text-sm text-amber-200 truncate max-w-[150px] sm:max-w-[220px]">
                      {activeBrand.nameBn}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    মাস্টার অ্যাডমিন ভিউ
                  </span>
                </div>
              </button>

              {/* Admin Dropdown Menu */}
              {isBrandDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsBrandDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#121017] border border-[#2B2735] shadow-2xl z-50 p-2 space-y-1 animate-fade-in">
                    <div className="px-2.5 py-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                      <span>ব্র্যান্ড ওয়ার্কস্পেস ({brands.length})</span>
                      <span className="text-amber-400">অ্যাডমিন</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
                      {brands.map((b) => {
                        const isCurrent = b.id === activeBrandId;
                        return (
                          <button
                            key={b.id}
                            onClick={() => handleSelectBrand(b)}
                            className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                              isCurrent
                                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                                : 'hover:bg-[#1B1824] text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-base">{b.icon}</span>
                              <div className="truncate">
                                <div className="truncate">{b.nameBn}</div>
                                <div className="text-[10px] text-zinc-500 truncate">{b.tagline}</div>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 border-t border-[#23202C]">
                      <button
                        onClick={() => {
                          setIsBrandDropdownOpen(false);
                          setIsCreateBrandOpen(true);
                        }}
                        className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-black hover:bg-amber-500 bg-[#191622] border border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ নতুন ব্র্যান্ড যোগ করুন</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Master Admin Console Button */}
            {session.role === 'super_admin' && (
              <button
                onClick={() => setIsAdminConsoleOpen(true)}
                className="py-1.5 px-3 bg-[#191522] hover:bg-[#241E32] border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                title="ক্লায়েন্ট আইডি ও পাসওয়ার্ড পরিচালনা করুন"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">অ্যাডমিন কনসোল</span>
              </button>
            )}

            {/* New Prompt Button */}
            <button
              onClick={() => openWizardAt(1)}
              className="py-1.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl shadow-md shadow-amber-500/15 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>নতুন প্রম্পট</span>
            </button>

            {/* Settings */}
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-[#141218] hover:bg-rose-500/15 border border-[#272431] hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 transition-colors"
              title="লগআউট করুন"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Minimal Area - ONLY History (or clean empty state) */}
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
                {activeBrand.tagline}
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
