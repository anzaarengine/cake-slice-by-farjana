'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  UserCheck, 
  Lock, 
  Building2,
  DollarSign,
  Send,
  Sparkles
} from 'lucide-react';
import { TenantAccount } from '@/types/auth';
import { BrandProfile } from '@/data/brands';
import { getAllAccounts, saveTenantAccount, deleteTenantAccount } from '@/data/authAccounts';

interface AdminConsoleModalProps {
  isOpen: boolean;
  brands: BrandProfile[];
  onClose: () => void;
  onAccountsUpdated: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  brands,
  onClose,
  onAccountsUpdated
}) => {
  const [accounts, setAccounts] = useState<TenantAccount[]>(() => getAllAccounts());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states for creating new client
  const [clientName, setClientName] = useState('');
  const [newId, setNewId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState(brands[0]?.id || 'cake-slice');
  const [monthlyRate, setMonthlyRate] = useState('৳১০,০০০/মাস');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const refreshAccounts = () => {
    const list = getAllAccounts();
    setAccounts(list);
    onAccountsUpdated();
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newPassword.trim() || !clientName.trim()) return;

    const newAccount: TenantAccount = {
      id: newId.trim().toLowerCase(),
      password: newPassword.trim(),
      role: 'tenant',
      brandId: selectedBrandId,
      clientName: clientName.trim(),
      monthlyRate: monthlyRate.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveTenantAccount(newAccount);
    refreshAccounts();
    setIsCreating(false);
    // Reset
    setClientName('');
    setNewId('');
    setNewPassword('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    if (confirm(`আপনি কি সত্যিই "${id}" ক্লায়েন্টের অ্যাকাউন্ট বাতিল করতে চান?`)) {
      deleteTenantAccount(id);
      refreshAccounts();
    }
  };

  const copyClientCredentials = (account: TenantAccount) => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://cake-slice-by-farjana.vercel.app';
    const message = `🎉 আপনার BrandOS এআই কন্টেন্ট ড্যাশবোর্ড অ্যাকাউন্ট রেডি!\n\n🌐 লগইন লিংক: ${currentOrigin}\n👤 ক্লায়েন্ট আইডি: ${account.id}\n🔑 পাসওয়ার্ড: ${account.password}\n\nআপনার প্রোডাক্টের ছবি দিয়ে মাত্র ২ ক্লিকে প্রিমিয়াম এডিটোরিয়াল ব্যানার ও ক্যাপশন তৈরি করুন।`;
    
    navigator.clipboard.writeText(message);
    setCopiedId(account.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-[#121116] border border-[#2B2735] rounded-3xl p-5 sm:p-7 shadow-2xl relative text-zinc-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23202C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                মাস্টার অ্যাডমিন কনসোল
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {accounts.length}টি অ্যাকাউন্ট
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                ক্লায়েন্ট আইডি ও পাসওয়ার্ড পরিচালনা করুন এবং নতুন ব্র্যান্ড অ্যাক্সেস দিন।
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar pr-1">

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              বর্তমান ক্লায়েন্ট তালিকা
            </span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              {isCreating ? 'ফর্ম বন্ধ করুন' : 'নতুন ক্লায়েন্ট যোগ করুন'}
            </button>
          </div>

          {/* New Client Form (if active) */}
          {isCreating && (
            <form onSubmit={handleCreateClient} className="p-4 rounded-2xl bg-[#171520] border border-amber-500/30 space-y-3 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#292635]">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  নতুন ক্লায়েন্ট আইডি ও পাসওয়ার্ড তৈরি
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">অন-দ্য-ফ্লাই অ্যাকাউন্ট</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">ক্লায়েন্ট / শপ এর নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Farjana Bakery Ltd."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#110F17] border border-[#2D2A3B] focus:border-amber-400 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">নির্ধারিত ব্র্যান্ড স্পেস</label>
                  <select
                    value={selectedBrandId}
                    onChange={(e) => setSelectedBrandId(e.target.value)}
                    className="w-full bg-[#110F17] border border-[#2D2A3B] focus:border-amber-400 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.icon} {b.nameBn} ({b.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">লগইন আইডি (Username)</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: cakeslice বা brand1"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full bg-[#110F17] border border-[#2D2A3B] focus:border-amber-400 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">পাসওয়ার্ড (Password)</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: pass1234"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#110F17] border border-[#2D2A3B] focus:border-amber-400 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">মাসিক সাবস্ক্রিপশন ফি (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ৳১০,০০০/মাস"
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(e.target.value)}
                    className="w-full bg-[#110F17] border border-[#2D2A3B] focus:border-amber-400 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">নোট / বিবরণ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="ক্লায়েন্টের কন্টাক্ট বা প্যাকেজ তথ্য..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#110F17] border border-[#2D2A3B] focus:border-amber-400 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="py-2 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  অ্যাকাউন্ট সেভ করুন
                </button>
              </div>
            </form>
          )}

          {/* Accounts Cards List */}
          <div className="space-y-2.5">
            {accounts.map((acc) => {
              const assignedBrand = brands.find(b => b.id === acc.brandId);
              const isSuperAdmin = acc.role === 'super_admin';

              return (
                <div
                  key={acc.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSuperAdmin
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-[#15131C] border-[#292635] hover:border-zinc-700'
                  }`}
                >
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {acc.clientName}
                      </span>
                      {isSuperAdmin ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">
                          🛡️ Super Admin
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">
                          🔒 Client Tenant
                        </span>
                      )}
                      {acc.monthlyRate && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                          {acc.monthlyRate}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-zinc-500">ID:</span>
                        <span className="text-amber-300 font-semibold">{acc.id}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-zinc-500">Pass:</span>
                        <span className="text-zinc-300 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{acc.password}</span>
                      </div>
                      {assignedBrand && (
                        <div className="flex items-center gap-1 text-zinc-300">
                          <span className="text-zinc-500">ব্র্যান্ড:</span>
                          <span>{assignedBrand.icon} {assignedBrand.nameBn}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyClientCredentials(acc)}
                      className="py-1.5 px-3 bg-[#1F1C28] hover:bg-[#282434] text-zinc-200 border border-[#353142] rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95"
                      title="ক্লায়েন্টকে পাঠানোর মেসেজ কপি করুন"
                    >
                      {copiedId === acc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">মেসেজ কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>মেসেজ কপি</span>
                        </>
                      )}
                    </button>

                    {!isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                        title="অ্যাকাউন্ট ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#23202C] flex items-center justify-between text-xs text-zinc-500">
          <span>পাসওয়ার্ড পরিবর্তন বা অ্যাকাউন্ট মুছতে ড্যাশবোর্ড রিফ্রেশ প্রয়োজন নেই।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
