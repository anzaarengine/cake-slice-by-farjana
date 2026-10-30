'use client';

import React, { useState } from 'react';
import { X, Sparkles, Building2, Check, Palette } from 'lucide-react';
import { BrandProfile, BrandNicheKey } from '@/data/brands';

interface CreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBrand: (newBrand: BrandProfile) => void;
}

const NICHE_PRESETS: Array<{
  id: BrandNicheKey;
  label: string;
  icon: string;
  defaultPreservation: string;
  defaultProductBn: string;
  defaultProductEn: string;
  color: string;
}> = [
  {
    id: 'bakery',
    label: 'বেকারি ও ফুড',
    icon: '🍰',
    defaultProductBn: 'কেক ও মিষ্টান্ন',
    defaultProductEn: 'Bakery Confectionery',
    defaultPreservation: 'frosting textures, colors, piping decorations, and food details in authentic high-fidelity without AI distortion',
    color: '#DFBA75'
  },
  {
    id: 'jewelry',
    label: 'জুয়েলারি ও ঘড়ি',
    icon: '💎',
    defaultProductBn: 'অলঙ্কার ও জুয়েলারি',
    defaultProductEn: 'Fine Jewelry',
    defaultPreservation: 'gold karat luster, precision gemstone facet cuts, brilliant diamond light refraction, claw settings, and flawless metal polishing without AI distortion',
    color: '#60A5FA'
  },
  {
    id: 'cosmetics',
    label: 'পারফিউম ও সুবাস',
    icon: '🧴',
    defaultProductBn: 'পারফিউম ও সুবাস',
    defaultProductEn: 'Luxury Fragrance',
    defaultPreservation: 'crystal-clear glass bottle fluting, liquid amber depth, engraved metallic cap, and embossed bottle branding without AI distortion',
    color: '#F59E0B'
  },
  {
    id: 'fashion',
    label: 'পোশাক ও শাড়ি',
    icon: '👗',
    defaultProductBn: 'পোশাক ও শাড়ি',
    defaultProductEn: 'Handloom Attire',
    defaultPreservation: 'handwoven fabric weave patterns, delicate metallic embroidery threads, natural textile drape, and authentic colors without AI distortion',
    color: '#EC4899'
  },
  {
    id: 'beverage',
    label: 'ক্যাফে ও পানীয়',
    icon: '☕',
    defaultProductBn: 'কফি ও পানীয়',
    defaultProductEn: 'Specialty Beverage',
    defaultPreservation: 'rich golden crema texture, ceramic cup glaze, micro-foam latte art, and warm beverage steam without AI distortion',
    color: '#B45309'
  },
  {
    id: 'general',
    label: 'অন্যান্য লাক্সারি',
    icon: '✨',
    defaultProductBn: 'লাক্সারি প্রোডাক্ট',
    defaultProductEn: 'Luxury Artisan Product',
    defaultPreservation: 'exact material textures, edge highlights, premium artisan craft, and authentic colors without AI distortion',
    color: '#10B981'
  }
];

export const CreateBrandModal: React.FC<CreateBrandModalProps> = ({
  isOpen,
  onClose,
  onCreateBrand
}) => {
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<BrandNicheKey>('bakery');
  const [productTypeBn, setProductTypeBn] = useState('');
  const [preservationPrompt, setPreservationPrompt] = useState(NICHE_PRESETS[0].defaultPreservation);

  if (!isOpen) return null;

  const handleNicheChange = (niche: BrandNicheKey) => {
    setSelectedNiche(niche);
    const preset = NICHE_PRESETS.find(p => p.id === niche);
    if (preset) {
      if (!productTypeBn) setProductTypeBn(preset.defaultProductBn);
      setPreservationPrompt(preset.defaultPreservation);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !nameEn.trim()) return;

    const preset = NICHE_PRESETS.find(p => p.id === selectedNiche) || NICHE_PRESETS[0];

    const newBrand: BrandProfile = {
      id: `custom-${Date.now()}`,
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      niche: selectedNiche,
      icon: preset.icon,
      tagline: tagline.trim() || 'আর্টিসানাল প্রিমিয়াম ব্র্যান্ড',
      productTypeBn: productTypeBn.trim() || preset.defaultProductBn,
      productTypeEn: preset.defaultProductEn,
      preservationPrompt: preservationPrompt.trim() || preset.defaultPreservation,
      accentColor: preset.color,
      defaultHeadlines: [
        { text: 'আভিজাত্যের খাঁটি প্রকাশ', cat: 'taste' },
        { text: 'ভালোবাসার প্রিয় উপহার', cat: 'love' },
        { text: 'বিশেষ দিনের বিশেষ আয়োজন', cat: 'celebration' }
      ],
      isCustom: true
    };

    onCreateBrand(newBrand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#110F15] border border-[#2B2735] rounded-3xl p-5 sm:p-6 shadow-2xl relative text-zinc-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#23202C]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">নতুন ব্র্যান্ড ওয়ার্কস্পেস তৈরি করুন</h3>
              <p className="text-[11px] text-zinc-400">আপনার ব্র্যান্ডের নিজস্ব এডিটোরিয়াল আর্ট ডিরেকশন ইঞ্জিন</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3.5 space-y-3.5 custom-scrollbar pr-1">
          
          {/* Niche Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              ইন্ডাস্ট্রি ও প্রোডাক্ট ক্যাটাগরি
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {NICHE_PRESETS.map((preset) => {
                const isSelected = selectedNiche === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleNicheChange(preset.id)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : 'bg-[#18161E] border-[#2A2734] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="text-xs truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                ব্র্যান্ড নাম (বাংলা) <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: অউরা জুয়েলারি"
                className="w-full bg-[#17151D] border border-[#2B2836] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                ব্র্যান্ড নাম (English) <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Aura Fine Jewelry"
                className="w-full bg-[#17151D] border border-[#2B2836] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tagline & Product Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                স্লোগান / ব্র্যান্ড ট্যাগলাইন
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="যেমন: খাঁটি স্বর্ণ ও ডায়মন্ড অলঙ্কার"
                className="w-full bg-[#17151D] border border-[#2B2836] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                প্রধান প্রোডাক্টের নাম
              </label>
              <input
                type="text"
                value={productTypeBn}
                onChange={(e) => setProductTypeBn(e.target.value)}
                placeholder="যেমন: ডায়মন্ড রিং / সিল্ক শাড়ি"
                className="w-full bg-[#17151D] border border-[#2B2836] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* AI Preservation Rules */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                এআই প্রোডাক্ট প্রিজারভেশন রুল (AI Preservation Formula)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">অটো-জেনারেটেড</span>
            </div>
            <textarea
              rows={3}
              value={preservationPrompt}
              onChange={(e) => setPreservationPrompt(e.target.value)}
              className="w-full bg-[#17151D] border border-[#2B2836] focus:border-amber-500 rounded-xl p-2.5 text-[11px] text-zinc-300 font-mono focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              ✓ কাঁচা ছবি থেকে এআই এই বিবরণগুলো হুবহু অক্ষত রেখে চারপাশে এডিটোরিয়াল ব্যানার তৈরি করবে।
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#23202C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ব্র্যান্ড তৈরি ও অ্যাক্টিভ করুন</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
