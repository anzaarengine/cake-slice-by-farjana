'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, MessageSquare, Flame, BookOpen, Crown, Coffee } from 'lucide-react';
import { generateLuxuryCaption } from '@/lib/gemini';

interface CopywriterTabProps {
  apiKey: string;
}

export const CopywriterTab: React.FC<CopywriterTabProps> = ({ apiKey }) => {
  const [cakeName, setCakeName] = useState('Vintage Belgian Chocolate Ganache');
  const [flavorProfile, setFlavorProfile] = useState('70% Callebaut dark chocolate, salted Madagascar vanilla caramel, handcrafted edible 24k gold leaf.');
  const [tone, setTone] = useState<'editorial' | 'celebration' | 'minimalist' | 'artisan'>('editorial');
  const [language, setLanguage] = useState<'bengali' | 'banglish' | 'english'>('bengali');
  
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Default initial output
  const [captionOutput, setCaptionOutput] = useState<{
    hook: string;
    body: string;
    callToAction: string;
    hashtags: string[];
    fullText: string;
  }>({
    hook: 'নিখুঁত শিল্প ও খাঁটি চকলেটের এক রাজকীয় রসায়ন — কেক স্লাইস বাই ফারজানা।',
    body: 'প্রতিটি স্তর তৈরি হয়েছে প্রিমিয়াম বেলজিয়ান চকলেটের গভীরতায়, যেখানে আলতো নোনতা ক্যারামেল আর খাঁটি ভ্যানিলার সুবাস মিলেমিশে একাকার। আমরা শুধু কেক বেক করি না, প্রতিটি স্লাইসে তৈরি করি একটি বিশেষ মুহূর্ত।',
    callToAction: 'আপনার বিশেষ মুহূর্তগুলো আরো মধুর করতে অন্তত ৪৮ ঘণ্টা আগে প্রি-অর্ডার কনফার্ম করুন। বিস্তারিত জানতে ইনবক্সে যোগাযোগ করুন।',
    hashtags: [
      '#CakeSliceByFarjana',
      '#কেক_স্লাইস_বাই_ফারজানা',
      '#ArtisanalBakeryDhaka',
      '#LuxuryCakesDhaka',
      '#DhakaFoodies',
      '#BespokeCakes'
    ],
    fullText: `নিখুঁত শিল্প ও খাঁটি চকলেটের এক রাজকীয় রসায়ন — কেক স্লাইস বাই ফারজানা।\n\nপ্রতিটি স্তর তৈরি হয়েছে প্রিমিয়াম বেলজিয়ান চকলেটের গভীরতায়, যেখানে আলতো নোনতা ক্যারামেল আর খাঁটি ভ্যানিলার সুবাস মিলেমিশে একাকার। আমরা শুধু কেক বেক করি না, প্রতিটি স্লাইসে তৈরি করি একটি বিশেষ মুহূর্ত।\n\nআপনার বিশেষ মুহূর্তগুলো আরো মধুর করতে অন্তত ৪৮ ঘণ্টা আগে প্রি-অর্ডার কনফার্ম করুন। বিস্তারিত জানতে ইনবক্সে যোগাযোগ করুন।\n\n#CakeSliceByFarjana #কেক_স্লাইস_বাই_ফারজানা #ArtisanalBakeryDhaka #LuxuryCakesDhaka #DhakaFoodies #BespokeCakes`
  });

  const handleGenerate = async () => {
    if (!apiKey) {
      alert('Please set your Gemini Pro API Key in the top Settings to generate live bespoke captions!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await generateLuxuryCaption({
        apiKey,
        cakeName,
        flavorProfile,
        tone,
        language
      });
      setCaptionOutput(res);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert(`Caption generation error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyFullCaption = () => {
    navigator.clipboard.writeText(captionOutput.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Inputs & Controls (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Cake Details Form */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#DFBA75]" />
            Cake Details
          </h3>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Cake Name / Creation</label>
            <input
              type="text"
              value={cakeName}
              onChange={(e) => setCakeName(e.target.value)}
              placeholder="e.g. Raw Pistachio & Saffron Rose"
              className="w-full bg-[#0E0D10] border border-[#2A2832] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            />
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Flavor Notes & Textures</label>
            <textarea
              rows={3}
              value={flavorProfile}
              onChange={(e) => setFlavorProfile(e.target.value)}
              placeholder="e.g. Layers of soft sponge, slow-melt chocolate ganache, raspberry reduction..."
              className="w-full bg-[#0E0D10] border border-[#2A2832] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-[11px] text-zinc-400 block mb-2">Editorial Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'editorial', label: 'Artisanal Editorial', icon: BookOpen },
                { id: 'celebration', label: 'Royal Celebration', icon: Crown },
                { id: 'minimalist', label: 'Minimalist Chic', icon: Coffee },
                { id: 'artisan', label: 'Behind The Craft', icon: Flame }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = tone === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTone(item.id as typeof tone)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-[#DFBA75] bg-[#1E1B24] text-[#DFBA75]'
                        : 'border-[#26242B] bg-[#0E0D10] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1.5">Language</label>
            <div className="flex gap-2">
              {[
                { id: 'bengali', label: 'নান্দনিক বাংলা' },
                { id: 'banglish', label: 'Banglish' },
                { id: 'english', label: 'Luxury English' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id as typeof language)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                    language === item.id
                      ? 'border-[#DFBA75] bg-[#1C1824] text-[#DFBA75] font-semibold'
                      : 'border-[#26242B] bg-[#0E0D10] text-zinc-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#DFBA75] to-[#B89243] hover:from-[#E6C685] hover:to-[#C9A250] text-black font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Writing with Gemini Pro...' : 'Generate Luxury Editorial Caption'}
          </button>
        </div>

      </div>

      {/* RIGHT: Output Card (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-6 shadow-2xl relative">
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#26242B]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-[#DFBA75] tracking-wider uppercase">
                কেক স্লাইস বাই ফারজানা — POST CAPTION
              </span>
            </div>
            
            <button
              onClick={copyFullCaption}
              className="py-1.5 px-3 bg-[#1F1B26] hover:bg-[#2A2434] border border-[#3A3545] text-xs font-medium text-zinc-200 rounded-lg flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#DFBA75]" />
                  <span>Copy Caption</span>
                </>
              )}
            </button>
          </div>

          {/* Structured Output Blocks */}
          <div className="space-y-4">
            {/* Hook */}
            <div className="p-3 rounded-xl bg-[#0E0D10] border border-[#26242B]">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] font-semibold block mb-1">
                1. Scroll-Stopping Hook:
              </span>
              <p className="text-sm font-medium text-zinc-100">{captionOutput.hook}</p>
            </div>

            {/* Story / Sensory Body */}
            <div className="p-3 rounded-xl bg-[#0E0D10] border border-[#26242B]">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] font-semibold block mb-1">
                2. Story & Sensory Taste:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {captionOutput.body}
              </p>
            </div>

            {/* Call To Action */}
            <div className="p-3 rounded-xl bg-[#0E0D10] border border-[#26242B]">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] font-semibold block mb-1">
                3. Order & Reservation Invitation:
              </span>
              <p className="text-xs text-amber-200/90">{captionOutput.callToAction}</p>
            </div>

            {/* Hashtags */}
            <div className="p-3 rounded-xl bg-[#0E0D10] border border-[#26242B]">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] font-semibold block mb-1">
                4. Bakery SEO Hashtags:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {captionOutput.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-[#DFBA75]/80 bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#26242B] flex items-center justify-between text-[11px] text-zinc-500">
            <span>Powered by Gemini Pro Luxury Prompt Matrix</span>
            <span>Ready for Instagram & Facebook</span>
          </div>

        </div>
      </div>
    </div>
  );
};
