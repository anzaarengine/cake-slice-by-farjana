'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Palette, 
  RefreshCw,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';
import { TypographyOverlay } from '@/lib/typography';
import { analyzeCakeVisuals, generateEditorialImage } from '@/lib/gemini';

interface StudioTabProps {
  apiKey: string;
  onOpenSettings: () => void;
}

type PresetKey = 'preset-1' | 'preset-2' | 'preset-3';

export const StudioTab: React.FC<StudioTabProps> = ({ apiKey, onOpenSettings }) => {
  // 1. Uploaded Cake State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('preset-1');
  const [baseMaterial, setBaseMaterial] = useState<string>('hand-carved dark wood block');

  // 2. Generation & AI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedResultImage, setGeneratedResultImage] = useState<string | null>(null);
  const [aiCakeDetails, setAiCakeDetails] = useState<{
    cakeDescription: string;
    colors: string[];
    features: string;
    suggestedBase: string;
  } | null>(null);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Locked Brand Presets definitions
  const presets = {
    'preset-1': {
      id: 'preset-1',
      title: '[Preset 1] Dark & Warm Cinematic',
      subtitle: 'Artistic Brush Typography (তুলির ছোঁয়া)',
      bgTheme: 'dark',
      bgDescription: 'Pitch-dark charcoal seamless negative space with warm golden cinematic side-light and high-contrast dramatic highlights.',
      typographyStyle: 'brush' as const,
      defaultBase: 'hand-carved dark wood block or rough dark stone base',
      cardGradient: 'from-black via-[#1C1822] to-[#2E2415]',
      borderActive: 'border-[#DFBA75]'
    },
    'preset-2': {
      id: 'preset-2',
      title: '[Preset 2] Organic Earth Tone',
      subtitle: 'Fluid / Liquid Typography (তরল প্রবাহ)',
      bgTheme: 'earth',
      bgDescription: 'Seamless warm taupe, sand, or light-beige plaster wall with soft natural diffused ambient light.',
      typographyStyle: 'fluid' as const,
      defaultBase: 'raw travertine stone slab or light-oak timber block',
      cardGradient: 'from-[#D7CBBA] via-[#E8DECE] to-[#C9B9A3]',
      borderActive: 'border-[#DFBA75]'
    },
    'preset-3': {
      id: 'preset-3',
      title: '[Preset 3] Organic Earth Tone',
      subtitle: 'Handwritten Typography (হাতে আঁকা)',
      bgTheme: 'earth',
      bgDescription: 'Warm earth plaster with artisanal calligraphy and delicate flourishes.',
      typographyStyle: 'handwritten' as const,
      defaultBase: 'artisanal ceramic plate or natural light wood pedestal',
      cardGradient: 'from-[#DFD3C3] via-[#EAE1D2] to-[#C8B8A2]',
      borderActive: 'border-[#DFBA75]'
    }
  };

  const currentPreset = presets[selectedPreset];

  // Handle Cake Upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setGeneratedResultImage(null);
          setAiCakeDetails(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Build Master 8K Prompt
  const buildPrompt = (cakeDesc?: string, baseChoice?: string) => {
    const activeCakeDesc = cakeDesc || "artisanal luxury cake with piped frosting and refined decorations";
    const activeBase = baseChoice || currentPreset.defaultBase;

    if (selectedPreset === 'preset-1') {
      return `An editorial luxury advertising photograph in a 4:5 portrait ratio, featuring ${activeCakeDesc} sitting in the bottom 25% of the frame on a ${activeBase}. The top 75% of the frame is completely empty, clean, seamless pitch-dark charcoal negative space. Moody, cinematic side-lighting with warm golden highlights and deep shadows. Zero props, zero clutter, high-end Vogue dessert magazine cover style. 8k, photorealistic. --ar 4:5`;
    }

    if (selectedPreset === 'preset-2') {
      return `An organic luxury editorial advertising photograph in a 4:5 portrait ratio, featuring ${activeCakeDesc} located in the bottom 25% of the frame on an authentic ${activeBase}. The top 75% of the canvas is seamless warm taupe, sand, and light beige plaster wall, offering huge empty breathing space. Soft, natural diffused ambient daylight, grounded earthy calmness, zero clutter, ultra-luxury artisanal bakery editorial. 8k, photorealistic. --ar 4:5`;
    }

    return `An artisanal luxury bakery advertising photograph in a 4:5 portrait ratio, featuring ${activeCakeDesc} in the bottom 25% of the frame on a ${activeBase}. The top 75% of the canvas is empty seamless warm taupe and sand plaster wall. Soft diffused wrap-around natural lighting, delicate shadows, high-end pastry magazine aesthetic, 8k, photorealistic. --ar 4:5`;
  };

  // Main AI Generation Handler
  const handleGenerateWithGemini = async () => {
    if (!uploadedImage) {
      alert('অনুগ্রহ করে প্রথমে আপনার কেকের একটি ছবি আপলোড করুন!');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('ধাপ ১/২: আপনার কেকের নকশা, কালার ও ফিনিশিং স্ক্যান হচ্ছে...');

    try {
      // 1. Analyze the cake using Gemini Vision
      const visualAnalysis = await analyzeCakeVisuals({
        apiKey,
        imageBase64: uploadedImage
      });

      setAiCakeDetails(visualAnalysis);
      setBaseMaterial(visualAnalysis.suggestedBase);

      setGenerationStep('ধাপ ২/২: AI দিয়ে ৪:৫ ম্যাগাজিন স্টাইলের ছবি তৈরি হচ্ছে...');

      // 2. Build tailored prompt
      const prompt = buildPrompt(
        visualAnalysis.cakeDescription,
        visualAnalysis.suggestedBase
      );

      // 3. Generate photorealistic image using 8K AI Image Engine
      const generatedImageUrl = await generateEditorialImage({
        apiKey,
        prompt
      });

      setGeneratedResultImage(generatedImageUrl);
      setGenerationStep('');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Generation Error:', err);
      alert(`ইমেজ তৈরিতে সাময়িক সমস্যা হয়েছে: ${errorMsg}\nদয়া করে আবার "জেনারেট করুন" বাটনে চাপ দিন।`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopyPrompt = () => {
    const text = buildPrompt(aiCakeDetails?.cakeDescription, baseMaterial);
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Export Combined High-Res Image (Generated AI Background + Bengali Typography Overlay)
  const handleDownloadCompositedImage = async () => {
    if (!generatedResultImage) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw generated image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = generatedResultImage;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      ctx.drawImage(img, 0, 0, 1080, 1350);

      // 2. Overlay Bengali Typography into the top 75% negative space
      ctx.textAlign = 'center';
      const isDark = currentPreset.bgTheme === 'dark';
      const textY = 1350 * 0.28;

      if (currentPreset.typographyStyle === 'brush') {
        ctx.font = 'bold 88px "Playfair Display", "Anek Bangla", serif';
        const goldGrad = ctx.createLinearGradient(1080 * 0.3, textY - 60, 1080 * 0.7, textY);
        goldGrad.addColorStop(0, '#FFF9E8');
        goldGrad.addColorStop(0.5, '#DFBA75');
        goldGrad.addColorStop(1, '#C29B48');
        ctx.fillStyle = goldGrad;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 18;
        ctx.fillText('কেক স্লাইস', 1080 / 2, textY);

        ctx.font = '600 48px "Anek Bangla", sans-serif';
        ctx.fillStyle = '#FFF1D0';
        ctx.fillText('বাই ফারজানা', 1080 / 2, textY + 70);

        ctx.strokeStyle = '#DFBA75';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(1080 * 0.38, textY + 115);
        ctx.lineTo(1080 * 0.62, textY + 115);
        ctx.stroke();

        ctx.font = '500 20px sans-serif';
        ctx.fillStyle = 'rgba(223, 186, 117, 0.9)';
        ctx.shadowBlur = 0;
        ctx.fillText('A R T I S A N A L   L U X U R Y   B A K E R Y', 1080 / 2, textY + 155);

      } else if (currentPreset.typographyStyle === 'fluid') {
        ctx.font = 'bold 84px "Playfair Display", "Anek Bangla", serif';
        ctx.fillStyle = isDark ? '#F7E3B5' : '#3E2419';
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 14;
        ctx.fillText('কেক স্লাইস', 1080 / 2, textY);

        ctx.font = '600 46px "Anek Bangla", sans-serif';
        ctx.fillStyle = isDark ? '#D4AF37' : '#523422';
        ctx.fillText('বাই ফারজানা', 1080 / 2, textY + 68);

        ctx.font = '500 19px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.85)' : 'rgba(74, 46, 27, 0.8)';
        ctx.shadowBlur = 0;
        ctx.fillText('A R T I S A N A L   L U X U R Y   B A K E R Y', 1080 / 2, textY + 140);

      } else {
        // Handwritten
        ctx.font = 'italic bold 82px "Anek Bangla", cursive, serif';
        ctx.fillStyle = isDark ? '#F5E4C3' : '#3C2A1E';
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 16;
        ctx.fillText('কেক স্লাইস', 1080 / 2, textY);

        ctx.font = 'italic 500 48px "Anek Bangla", cursive';
        ctx.fillStyle = isDark ? '#DFBA75' : '#6A4B35';
        ctx.fillText('বাই ফারজানা', 1080 / 2, textY + 66);

        ctx.font = '500 18px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(245, 228, 195, 0.8)' : 'rgba(90, 62, 44, 0.8)';
        ctx.shadowBlur = 0;
        ctx.fillText('A R T I S A N A L   L U X U R Y   B A K E R Y', 1080 / 2, textY + 135);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Cake-Slice-by-Farjana-${selectedPreset}-${Date.now()}.jpg`;
      link.click();
    } catch (e) {
      console.error(e);
      // Fallback direct download
      const link = document.createElement('a');
      link.href = generatedResultImage;
      link.download = `Cake-Slice-by-Farjana-${selectedPreset}.jpg`;
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: 3-Step Simple Generator Controls (5 cols) */}
      <div className="lg:col-span-5 space-y-6">

        {/* STEP 1: Upload Photo */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">1</span>
              কাস্টমার কেকের ছবি আপলোড করুন
            </span>
            {uploadedImage && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> আপলোড কমপ্লিট
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer w-full p-4 border-2 border-dashed rounded-xl transition-all text-center flex flex-col items-center justify-center ${
              uploadedImage
                ? 'border-[#DFBA75]/60 bg-[#1A1722]'
                : 'border-[#332F3D] hover:border-[#DFBA75]/80 bg-[#100F13] hover:bg-[#16141A]'
            }`}
          >
            {uploadedImage ? (
              <div className="flex items-center gap-4 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage}
                  alt="Uploaded Cake"
                  className="w-16 h-16 object-cover rounded-lg border border-[#DFBA75]/40 shadow-md"
                />
                <div className="text-left flex-1">
                  <div className="text-xs font-semibold text-zinc-100">কেকের ছবি পাওয়া গেছে</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">ছবি পরিবর্তন করতে এখানে আবার ক্লিক করুন</div>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#DFBA75] mb-2" />
                <span className="text-xs font-semibold text-zinc-200">
                  কেকের কাঁচা ছবি এখানে ড্রপ করুন বা ক্লিক করুন
                </span>
                <span className="text-[10px] text-zinc-500 mt-1">
                  (মোবাইল বা ক্যামেরায় তোলা যেকোনো সাধারণ ছবি)
                </span>
              </>
            )}
          </div>
        </div>

        {/* STEP 2: Select Locked Style Preset */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">2</span>
              লক করা ৩টি স্টাইলের একটি বেছে নিন
            </span>
          </div>

          <div className="space-y-3">
            {(Object.keys(presets) as PresetKey[]).map((key) => {
              const p = presets[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedPreset(key);
                    setGeneratedResultImage(null);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-[#DFBA75] bg-[#1E1A26] shadow-[0_0_20px_rgba(223,186,117,0.15)]'
                      : 'border-[#26242B] bg-[#0E0D10] opacity-80 hover:opacity-100 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-100">{p.title}</span>
                    <span className="text-[10px] text-[#DFBA75] font-medium">{p.subtitle}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {p.bgDescription}
                  </p>
                  {isSelected && (
                    <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: Click Generate Button */}
        <div className="space-y-3">
          <button
            onClick={handleGenerateWithGemini}
            disabled={isGenerating || !uploadedImage}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
              isGenerating || !uploadedImage
                ? 'bg-[#2E281F] text-zinc-500 cursor-not-allowed border border-zinc-800'
                : 'bg-gradient-to-r from-[#DFBA75] via-[#F4D998] to-[#C99C47] text-black hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-black" />
                <span>ম্যাজিক চলছে: AI ছবি তৈরি করছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-black" />
                <span>AI দিয়ে ইমেজ জেনারেট করুন</span>
              </>
            )}
          </button>

          {/* Live Progress Tracker */}
          {generationStep && (
            <div className="p-3 bg-[#1B1724] border border-[#DFBA75]/40 rounded-xl text-xs text-[#DFBA75] flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{generationStep}</span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT: Live Generated Result / Studio Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-[480px] bg-[#0A0A0C] border border-[#2A2832] rounded-3xl p-4 shadow-2xl relative">
          
          {/* Header Status */}
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-zinc-300">
                {generatedResultImage ? '✨ AI জেনারেটেড ফাইনাল ছবি' : '৪:৫ লাইভ প্রিভিউ ফ্রেম'}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] bg-[#DFBA75]/10 px-2.5 py-0.5 rounded-full border border-[#DFBA75]/25">
              4:5 Editorial
            </span>
          </div>

          {/* 4:5 Aspect Frame */}
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-2xl bg-[#0F0E11] flex items-center justify-center">
            
            {generatedResultImage ? (
              // CASE A: AI Generated Image with Bengali Typography Overlay
              <div className="w-full h-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedResultImage}
                  alt="AI Generated Editorial Cake"
                  className="w-full h-full object-cover"
                />

                {/* Locked Bengali Typography Overlaid into Top 75% Seamless Space */}
                <div className="absolute top-0 left-0 right-0 h-[70%] flex items-center justify-center p-6 pointer-events-none">
                  <TypographyOverlay
                    style={currentPreset.typographyStyle}
                    isDarkTheme={currentPreset.bgTheme === 'dark'}
                  />
                </div>
              </div>
            ) : uploadedImage ? (
              // CASE B: Uploaded Image Preview (Ready to generate)
              <div className="w-full h-full relative flex flex-col justify-between p-6">
                
                {/* Background Styling */}
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    currentPreset.bgTheme === 'dark'
                      ? 'bg-gradient-to-b from-[#0F0E11] via-[#15131A] to-[#0A090C]'
                      : 'bg-gradient-to-b from-[#EAE3D2] via-[#DFD6C3] to-[#D5C9B3]'
                  }`}
                />

                {/* Top 75% Typography */}
                <div className="relative z-10 h-[70%] flex items-center justify-center">
                  <TypographyOverlay
                    style={currentPreset.typographyStyle}
                    isDarkTheme={currentPreset.bgTheme === 'dark'}
                  />
                </div>

                {/* Bottom 25% Cake Preview */}
                <div className="relative z-10 h-[30%] flex flex-col justify-end items-center">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#DFBA75] shadow-2xl bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedImage}
                      alt="Raw uploaded cake"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-[#DFBA75] bg-black/80 px-2.5 py-1 rounded-full mt-2 border border-[#DFBA75]/30">
                    আপনার আপলোড করা ছবি (জেনারেট বাটনে চাপ দিন)
                  </span>
                </div>

              </div>
            ) : (
              // CASE C: Empty State (Waiting for upload)
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#1A1722] border border-[#DFBA75]/30 flex items-center justify-center mx-auto text-[#DFBA75]">
                  <Wand2 className="w-8 h-8" />
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  কেকের ছবি আপলোড করে স্টাইল সিলেক্ট করুন
                </div>
                <div className="text-xs text-zinc-500 max-w-xs mx-auto">
                  এরপর &ldquo;AI দিয়ে ইমেজ জেনারেট করুন&rdquo; চাপলে মুহূর্তেই এমন আউটপুট আসবে যা সরাসরি ইনস্টাগ্রাম বা ফেসবুকে পোস্ট করতে পারবেন।
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons Below Frame */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCompositedImage}
              disabled={!generatedResultImage}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                generatedResultImage
                  ? 'bg-[#DFBA75] hover:bg-[#E8C885] text-black shadow-lg hover:scale-[1.01]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{generatedResultImage ? 'ছবি ডাউনলোড করুন (4:5)' : 'প্রথমে জেনারেট করুন'}</span>
            </button>

            <button
              onClick={handleCopyPrompt}
              className="py-3 px-4 bg-[#18161E] hover:bg-[#231F2C] border border-[#3A3545] text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">8K প্রম্পট কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#DFBA75]" />
                  <span>কপি 8K মাস্টার প্রম্পট</span>
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Details Tag */}
          {aiCakeDetails && (
            <div className="mt-4 p-3 bg-[#131217] border border-[#2A2733] rounded-xl text-[11px] text-zinc-400 space-y-1">
              <div className="text-[#DFBA75] font-semibold">Gemini Vision বিশ্লেষণ:</div>
              <div>&bull; {aiCakeDetails.cakeDescription}</div>
              <div>&bull; নির্বাচিত বেস: {aiCakeDetails.suggestedBase}</div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
