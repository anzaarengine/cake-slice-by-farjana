'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Layers, 
  Sliders,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';

interface StudioTabProps {
  apiKey?: string;
  onOpenSettings?: () => void;
}

type PresetKey = 'preset-1' | 'preset-2' | 'preset-3';

export const StudioTab: React.FC<StudioTabProps> = ({ apiKey, onOpenSettings }) => {
  // 1. Uploaded Cake State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('preset-2');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [cakeScale, setCakeScale] = useState(75);
  const [cakeOffsetY, setCakeOffsetY] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Locked Brand Presets
  const presets = {
    'preset-1': {
      id: 'preset-1',
      title: '[Preset 1] Dark & Warm Cinematic',
      subtitle: 'Artistic Brush Typography (তুলির ছোঁয়া)',
      bgType: 'dark',
      baseName: 'hand-carved dark wood block or rough dark stone base',
      desc: 'কালো চারকোল ব্যাকগ্রাউন্ড, ড্রামাটিক সোনালি আলো এবং অফ-হোয়াইট/গোল্ডেন ব্রাশ টাইপোগ্রাফি।',
      textColor: '#FFF4D6',
      subColor: '#DFBA75'
    },
    'preset-2': {
      id: 'preset-2',
      title: '[Preset 2] Organic Earth Tone',
      subtitle: 'Fluid / Liquid Typography (তরল প্রবাহ)',
      bgType: 'earth',
      baseName: 'raw travertine stone slab or light-oak timber block',
      desc: 'যেমনটা আপনার ২য় ছবিতে আছে—ন্যাচারাল ট্রাভার্টিন মার্বেল স্ল্যাব, ওয়ার্ম বেইজ দেয়াল ও চকলেট-গোল্ড ফ্লুইড ক্যালিগ্রাফি।',
      textColor: '#3E2419',
      subColor: '#7A5239'
    },
    'preset-3': {
      id: 'preset-3',
      title: '[Preset 3] Organic Earth Tone + Handwritten',
      subtitle: 'Handwritten Typography (হাতে আঁকা)',
      bgType: 'earth',
      baseName: 'artisanal ceramic plate or natural light wood pedestal',
      desc: 'ওয়ার্ম বেইজ প্লাস্টার ব্যাকগ্রাউন্ড ও হস্তলিখিত ক্যালিগ্রাফি সিগনেচার।',
      textColor: '#3C2A1E',
      subColor: '#6B4A34'
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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Build the EXACT master prompt that created Image 2 on gemini.google.com!
  const getGeminiPrompt = () => {
    if (selectedPreset === 'preset-1') {
      return `An editorial, ultra-premium advertising photograph in a 4:5 aspect ratio, featuring the user's uploaded cake situated in the bottom 25% of the frame. The cake rests on a dynamically chosen complementary base based on its colors and design—specifically a hand-carved dark wood block or rough dark stone base, retaining its original textures, frosting, and design in high-fidelity. The top 75% of the canvas is completely empty, seamless pitch-dark charcoal negative space. A warm, golden cinematic side-light hits the cake and its complementary base, creating a moody, high-end dramatic atmosphere with rich contrasts and deep shadows.
In the upper empty space, the Bengali typography “কেক স্লাইস” (Cake Slice) with “বাই ফারজানা” (by Farjana) directly below it is prominently featured in an off-white and light gold dual-tone. The text is rendered strictly in the Brush Strokes / Artistic Brush Style, showcasing rough, hand-painted artistic brushwork with visible bristle textures, expressive sweep effects, and subtle 3D shading on the strokes. Small, understated gold decorative lines or english subtitles sit beneath the brand name. The image is clean, highly aesthetic, entirely uncluttered, with a magazine-like layout focusing only on the textured cake and the dramatic brand name. 8k, photorealistic. --ar 4:5`;
    }

    if (selectedPreset === 'preset-2') {
      return `A natural luxury editorial advertising photograph in a 4:5 aspect ratio, featuring the user's uploaded cake located in the bottom 25% of the frame. The base on which the cake rests is organically chosen to match the specific cake's look—such as a raw travertine slab, a natural light-oak timber block, or a matte terracotta plate—ensuring it looks grounded, never repetitive, and matches the authentic cake's textures, frosting, and design in high-fidelity. The top 75% of the canvas is an empty, seamless warm taupe, sand, or light beige plaster wall, leaving massive breathing space. Soft, natural ambient lighting wraps the cake and its unique base, creating a grounded, earthy, yet highly expensive aesthetic.
Within the spacious upper background, the Bengali typography “কেক স্লাইস” (Cake Slice) with “বাই ফারজানা” (by Farjana) below it is elegantly placed in rich dark-brown and warm gold tones. The text is strictly in the Fluid / Liquid style, characterized by smooth, organic, boldly curved shapes with natural flow, dynamic loops, and interconnected letters, as if written with thick, flowing liquid. A subtle soft-shadow depth is underneath. Understated, small subtitles or fine artistic line ornaments can be placed at the bottom of the name. Completely free of clutter, zero random props, holding a premium editorial magazine layout. 8k, photorealistic. --ar 4:5`;
    }

    return `A natural luxury editorial advertising photograph in a 4:5 aspect ratio, featuring the user's uploaded cake located in the bottom 25% of the frame. The placement of the cake is varied and context-aware, resting on a base that elevates the cake's unique design—such as an artisanal ceramic plate, a natural light wood pedestal, or a raw textured block, preserving its genuine textures, frosting, and design in high-fidelity. The top 75% of the canvas is an empty, seamless warm taupe and light beige plaster wall, offering huge breathing space. Soft, diffused ambient lighting gently illuminates the scene, creating a grounded, natural, yet highly luxurious aesthetic.
In the upper empty canvas, the Bengali typography “কেক স্লাইস” (Cake Slice) with “বাই ফারজানা” (by Farjana) below it is proudly displayed in dark-brown and subtle gold gradients. The text is in a handwritten / "হাতে আঁকা" style, exhibiting artistic calligraphic handwriting with natural curls, elegant strokes, and handwritten flourishes. It feels organic, personalized, and handcrafted with whimsical swooshes and dots around the letters. A small, delicate subtitle or a fine design flourish rests quietly underneath the name. The layout is exceptionally clean, aesthetic, devoid of any clutter or props, capturing a sophisticated, artisanal magazine feel. 8k, photorealistic. --ar 4:5`;
  };

  const handleCopyPromptAndOpenGemini = () => {
    const text = getGeminiPrompt();
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    // Open Gemini Advanced web app
    window.open('https://gemini.google.com/app', '_blank');
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  // Render Live Canvas matching Image 2 exactly
  const renderCanvasPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 864;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const isDark = currentPreset.bgType === 'dark';

    // 1. Background (Exact match to Image 2 warm taupe plaster / or dark cinematic)
    if (isDark) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0F0E11');
      grad.addColorStop(0.5, '#15131A');
      grad.addColorStop(1, '#0A090C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Warm side light
      const light = ctx.createRadialGradient(width * 0.85, height * 0.7, 50, width * 0.7, height * 0.75, 600);
      light.addColorStop(0, 'rgba(235, 185, 100, 0.22)');
      light.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Warm taupe & sand plaster (exact match to Image 2)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#EAE1D0');
      grad.addColorStop(0.3, '#E4D9C7');
      grad.addColorStop(0.7, '#DDCFBA');
      grad.addColorStop(1, '#D5C4AC');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle textured light
      const light = ctx.createRadialGradient(width * 0.5, height * 0.35, 100, width * 0.5, height * 0.5, 600);
      light.addColorStop(0, 'rgba(255, 252, 245, 0.4)');
      light.addColorStop(1, 'rgba(0,0,0,0.02)');
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Travertine Stone Slab (exact match to Image 2 bottom pedestal)
    const slabX = width * 0.22;
    const slabY = height * 0.75;
    const slabW = width * 0.56;
    const slabH = height * 0.08;

    // Slab shadow on floor
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.filter = 'blur(16px)';
    ctx.fillRect(slabX + 10, slabY + slabH - 5, slabW - 20, 25);
    ctx.restore();

    if (isDark) {
      // Dark wood block
      const slabGrad = ctx.createLinearGradient(slabX, slabY, slabX + slabW, slabY);
      slabGrad.addColorStop(0, '#1E140C');
      slabGrad.addColorStop(0.5, '#2D1F13');
      slabGrad.addColorStop(1, '#1A110A');
      ctx.fillStyle = slabGrad;
      ctx.fillRect(slabX, slabY, slabW, slabH);
      ctx.strokeStyle = '#3D2A1C';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(slabX, slabY, slabW, slabH);
    } else {
      // Raw travertine slab
      const slabGrad = ctx.createLinearGradient(slabX, slabY, slabX + slabW, slabY);
      slabGrad.addColorStop(0, '#D6C5AD');
      slabGrad.addColorStop(0.3, '#E6D7C2');
      slabGrad.addColorStop(0.7, '#E0D0B9');
      slabGrad.addColorStop(1, '#CDBAA1');
      ctx.fillStyle = slabGrad;
      ctx.fillRect(slabX, slabY, slabW, slabH);
      ctx.strokeStyle = '#BFA98E';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(slabX, slabY, slabW, slabH);

      // Pores/texture of stone
      ctx.fillStyle = 'rgba(120, 100, 80, 0.12)';
      ctx.fillRect(slabX + 20, slabY + 10, 45, 6);
      ctx.fillRect(slabX + 120, slabY + 25, 60, 8);
      ctx.fillRect(slabX + 240, slabY + 15, 50, 7);
    }

    // 3. Draw Cake
    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        const cakeSize = (width * 0.44 * cakeScale) / 100;
        const cakeX = (width - cakeSize) / 2;
        const cakeY = slabY - cakeSize + 15 + cakeOffsetY;

        // Cake shadow on slab
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(width / 2, slabY + 6, cakeSize * 0.46, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.filter = 'blur(10px)';
        ctx.fill();
        ctx.restore();

        // Draw image clipped inside circular/rounded presentation or directly
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cakeX, cakeY, cakeSize, cakeSize, 16);
        ctx.clip();
        ctx.drawImage(img, cakeX, cakeY, cakeSize, cakeSize);
        ctx.restore();

        // 4. Draw Typography over the image
        drawTypography(ctx, width, height, isDark);
      };
    } else {
      drawTypography(ctx, width, height, isDark);
    }
  };

  const drawTypography = (ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) => {
    ctx.save();
    ctx.textAlign = 'center';
    const textY = height * 0.28;

    // Line 1: কেক স্লাইস (Exact match to Image 2 fluid embossed typography)
    ctx.font = 'bold 82px "Playfair Display", "Anek Bangla", serif';
    ctx.fillStyle = isDark ? '#F5E4C3' : '#3E2419';
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(62, 36, 25, 0.25)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fillText('কেক স্লাইস', width / 2, textY);

    // Line 2: বাই ফারজানা (Exact match to Image 2)
    ctx.font = '600 48px "Anek Bangla", "Hind Siliguri", sans-serif';
    ctx.fillStyle = isDark ? '#DFBA75' : '#5E3C27';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillText('বাই ফারজানা', width / 2, textY + 68);

    // Subtitle
    ctx.font = '500 16px sans-serif';
    ctx.fillStyle = isDark ? 'rgba(223, 186, 117, 0.85)' : 'rgba(94, 60, 39, 0.75)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText('~  P R E M I U M   C A K E S  ~', width / 2, textY + 130);

    ctx.restore();
  };

  useEffect(() => {
    renderCanvasPreview();
  }, [uploadedImage, selectedPreset, cakeScale, cakeOffsetY]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.download = `Cake-Slice-by-Farjana-${selectedPreset}-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: Controls (5 cols) */}
      <div className="lg:col-span-5 space-y-6">

        {/* STEP 1: Upload Cake Photo */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">1</span>
              কাস্টমার কেকের ছবি আপলোড করুন
            </span>
            {uploadedImage && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> ছবি লোড হয়েছে
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

        {/* STEP 2: Choose Preset */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBA75] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#DFBA75] text-black flex items-center justify-center text-[10px] font-bold">2</span>
            লক করা ব্র্যান্ড স্টাইল বেছে নিন
          </span>

          <div className="space-y-3">
            {(Object.keys(presets) as PresetKey[]).map((key) => {
              const p = presets[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPreset(key)}
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
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    {p.desc}
                  </p>
                  {isSelected && (
                    <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: Action Buttons */}
        <div className="space-y-3">
          
          {/* Main Action: Generate directly on Gemini Pro Web (Just like Image 2!) */}
          <button
            onClick={handleCopyPromptAndOpenGemini}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#DFBA75] via-[#F4D998] to-[#C99C47] text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-black" />
            <span>Gemini Pro দিয়ে জেনারেট করুন (২নং ছবির মতো)</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>

          <p className="text-[11px] text-zinc-400 text-center leading-relaxed px-2">
            💡 <strong>ম্যাজিক ট্রিক:</strong> এই বাটনে চাপ দিলে আপনার লক করা মাস্টার প্রম্পটটি স্বয়ংক্রিয়ভাবে কপি হয়ে যাবে এবং <strong>Gemini Advanced</strong> খুলে যাবে। সেখানে শুধু আপনার ছবি দিয়ে <strong>Paste (Ctrl+V)</strong> করে দিলেই হুবহু আপনার ২নং ছবির মতো মাস্টারপিস আউটপুট পাবেন!
          </p>

          {/* Sizing sliders for in-app preview */}
          {uploadedImage && (
            <div className="p-4 bg-[#141316] border border-[#26242B] rounded-xl space-y-3">
              <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#DFBA75]" />
                <span>ইন-অ্যাপ প্রিভিউ সাইজিং:</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>কেকের সাইজ: {cakeScale}%</span>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={cakeScale}
                  onChange={(e) => setCakeScale(Number(e.target.value))}
                  className="accent-[#DFBA75] w-36"
                />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RIGHT: Live 4:5 Preview (7 cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-[480px] bg-[#0A0A0C] border border-[#2A2832] rounded-3xl p-4 shadow-2xl relative">
          
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              ৪:৫ ম্যাগাজিন লেআউট প্রিভিউ
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] bg-[#DFBA75]/10 px-2.5 py-0.5 rounded-full border border-[#DFBA75]/25">
              {currentPreset.title.split(']')[0]}]
            </span>
          </div>

          {/* Canvas Rendering Frame */}
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-2xl bg-[#0F0E11] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
          </div>

          {/* Action Buttons Below Frame */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl font-bold text-xs bg-[#DFBA75] hover:bg-[#E8C885] text-black shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>ছবি ডাউনলোড করুন (4:5)</span>
            </button>

            <button
              onClick={handleCopyPromptAndOpenGemini}
              className="py-3 px-4 bg-[#18161E] hover:bg-[#231F2C] border border-[#3A3545] text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">প্রম্পট কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#DFBA75]" />
                  <span>কপি 8K প্রম্পট & ওপেন Gemini</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 text-center mt-3">
            ২নং ছবির মতো হুবহু নিখুঁত ট্রাভার্টিন মার্বেল বেস, ৭৫% ব্রিদিং স্পেস ও আসল কেক সংরক্ষণের ফরম্যাট।
          </p>

        </div>
      </div>

    </div>
  );
};
