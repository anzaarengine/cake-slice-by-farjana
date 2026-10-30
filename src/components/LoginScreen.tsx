'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AuthSession } from '@/types/auth';
import { verifyCredentials } from '@/data/authAccounts';

interface LoginScreenProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!loginId.trim() || !password.trim()) {
      setErrorMsg('দয়া করে আইডি এবং পাসওয়ার্ড উভয়ই লিখুন।');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const session = verifyCredentials(loginId, password);
      if (session) {
        onLoginSuccess(session);
      } else {
        setErrorMsg('ভুল আইডি অথবা পাসওয়ার্ড! সঠিক তথ্য দিন অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।');
        setIsLoading(false);
      }
    }, 300);
  };

  const handleDemoFill = (demoId: string, demoPass: string) => {
    setLoginId(demoId);
    setPassword(demoPass);
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const session = verifyCredentials(demoId, demoPass);
      if (session) {
        onLoginSuccess(session);
      }
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#070608] text-zinc-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#DFBA75]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DFBA75] to-[#8C6B2D] p-[1px] flex items-center justify-center shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-[#121016] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#DFBA75]" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
              BrandOS <span className="text-[10px] text-[#DFBA75] font-sans font-normal border border-[#DFBA75]/30 px-1.5 py-0.2 rounded-full">v2.0</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-[#121118]/80 border border-[#221F2B] px-3 py-1.5 rounded-full backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>প্রাইভেট এনক্রিপ্টেড অ্যাক্সেস</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-[#111015]/90 border border-[#262330] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          
          {/* Subtle Golden Top Border Highlight */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#DFBA75]/50 to-transparent" />

          {/* Heading */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono tracking-wider uppercase mb-1">
              <Lock className="w-3 h-3 text-amber-400" />
              ক্লায়েন্ট লগইন পোর্টাল
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              লগইন করুন
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              আপনার ব্র্যান্ডের প্রিমিয়াম এআই কন্টেন্ট ড্যাশবোর্ডে প্রবেশ করতে নির্ধারিত আইডি ও পাসওয়ার্ড দিন।
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* ID Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center justify-between">
                <span>ক্লায়েন্ট আইডি (Username)</span>
                <span className="text-[10px] font-mono text-zinc-500">Ex: cakeslice</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="আপনার আইডি লিখুন..."
                  autoFocus
                  required
                  className="w-full bg-[#17151E] border border-[#2D2938] focus:border-[#DFBA75] focus:ring-1 focus:ring-[#DFBA75]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center justify-between">
                <span>পাসওয়ার্ড (Password)</span>
                <span className="text-[10px] font-mono text-zinc-500">Case-sensitive</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  required
                  className="w-full bg-[#17151E] border border-[#2D2938] focus:border-[#DFBA75] focus:ring-1 focus:ring-[#DFBA75]/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#DFBA75] to-[#B8934B] hover:brightness-110 active:scale-[0.98] text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ভেরিফাই করা হচ্ছে...
                </>
              ) : (
                <>
                  <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts Selector */}
          <div className="mt-6 pt-5 border-t border-[#23202C] space-y-2.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-mono text-zinc-500 uppercase tracking-wider">⚡ টেস্ট করার জন্য ডেমো আইডি</span>
              <span className="text-[#DFBA75] font-medium">১-ক্লিকে পূরণ</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('cakeslice', 'farjana2026')}
                className="p-2 rounded-xl bg-[#16141D] hover:bg-[#1E1B27] border border-[#282533] text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-zinc-200 group-hover:text-[#DFBA75]">
                  <span>🍰</span>
                  <span className="truncate">Cake Slice</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">cakeslice</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('aurajewelry', 'aura2026')}
                className="p-2 rounded-xl bg-[#16141D] hover:bg-[#1E1B27] border border-[#282533] text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-zinc-200 group-hover:text-[#DFBA75]">
                  <span>💎</span>
                  <span className="truncate">Aura Jewelry</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">aurajewelry</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('royaloud', 'oud2026')}
                className="p-2 rounded-xl bg-[#16141D] hover:bg-[#1E1B27] border border-[#282533] text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-zinc-200 group-hover:text-[#DFBA75]">
                  <span>✨</span>
                  <span className="truncate">Royal Oud</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">royaloud</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('admin', 'admin2026')}
                className="p-2 rounded-xl bg-[#1A1624] hover:bg-[#251E33] border border-[#DFBA75]/30 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#DFBA75]">
                  <span>🛡️</span>
                  <span className="truncate">Master Admin</span>
                </div>
                <div className="text-[10px] text-amber-400/70 font-mono mt-0.5">admin (অল এক্সেস)</div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between text-[11px] text-zinc-600 z-10 pb-2">
        <span>© 2026 BrandOS Client Network</span>
        <span>Secure Multitenant Isolation</span>
      </div>

    </div>
  );
};
