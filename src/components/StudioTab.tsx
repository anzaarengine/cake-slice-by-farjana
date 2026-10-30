'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BackgroundStyle, BasePedestal, TypographyStyle } from '@/types';
import { TypographyOverlay } from '@/lib/typography';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  Sliders, 
  Palette,
  Eye,
  Layers
} from 'lucide-react';

interface StudioTabProps {
  onCopyPrompt?: (prompt: string) => void;
}

export const StudioTab: React.FC<StudioTabProps> = () => {
  // Brand States
  const [style, setStyle] = useState<BackgroundStyle>('dark-cinematic');
  const [typography, setTypography] = useState<TypographyStyle>('brush');
  const [pedestal, setPedestal] = useState<BasePedestal>('dark-wood');
  const [subtitle, setSubtitle] = useState('A R T I S A N A L   L U X U R Y   B A K E R Y');

  // Cake Image States
  const [cakeImage, setCakeImage] = useState<string | null>(null);
  const [cakeScale, setCakeScale] = useState(85); // Percentage
  const [cakeOffsetY, setCakeOffsetY] = useState(0); // Offset within bottom 25%
  const [cakeRotation, setCakeRotation] = useState(0);
  const [shadowIntensity, setShadowIntensity] = useState(70);

  // Status & Export States
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sample default luxury cake for demonstration if no image uploaded
  const defaultCakeSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" fill="none">
    <ellipse cx="200" cy="270" rx="140" ry="25" fill="black" opacity="0.4"/>
    <path d="M 80 180 C 80 180, 80 260, 200 260 C 320 260, 320 180, 320 180 Z" fill="%232D1810"/>
    <ellipse cx="200" cy="180" rx="120" ry="40" fill="%233E2419"/>
    <path d="M 110 130 C 110 130, 110 190, 200 190 C 290 190, 290 130, 290 130 Z" fill="%23DFBA75"/>
    <ellipse cx="200" cy="130" rx="90" ry="30" fill="%23FFF2D4"/>
    <!-- Gold leaf flakes -->
    <circle cx="180" cy="125" r="4" fill="%23F3DA8E"/>
    <circle cx="215" cy="132" r="3" fill="%23DFBA75"/>
    <circle cx="150" cy="175" r="3.5" fill="%23F7E7B4"/>
    <circle cx="240" cy="182" r="4" fill="%23C29B48"/>
    <!-- Cream drip -->
    <path d="M 140 180 Q 145 210 150 200 Q 155 180 160 180" fill="%23DFBA75"/>
    <path d="M 230 180 Q 235 220 240 210 Q 245 180 250 180" fill="%23DFBA75"/>
  </svg>`;

  const activeCakeImage = cakeImage || defaultCakeSvg;

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCakeImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync default pedestal on style change
  const handleStyleChange = (newStyle: BackgroundStyle) => {
    setStyle(newStyle);
    if (newStyle === 'dark-cinematic') {
      if (pedestal === 'light-oak' || pedestal === 'terracotta') {
        setPedestal('dark-wood');
      }
      setTypography('brush');
    } else {
      if (pedestal === 'dark-wood') {
        setPedestal('travertine');
      }
      setTypography('fluid');
    }
  };

  // Pedestal details
  const pedestalStyles: Record<BasePedestal, { name: string; desc: string; bgClass: string }> = {
    'dark-wood': {
      name: 'Dark Carved Wood',
      desc: 'Hand-carved dark timber block with rich grain',
      bgClass: 'bg-gradient-to-r from-[#1A120B] via-[#2A1D13] to-[#120B06] border-t border-[#3D2919]'
    },
    'travertine': {
      name: 'Raw Travertine',
      desc: 'Textured natural porous earth stone slab',
      bgClass: 'bg-gradient-to-r from-[#D8C7B0] via-[#E6D7C3] to-[#C9B79E] border-t border-[#EFE5D8]'
    },
    'ceramic': {
      name: 'Matte Ceramic',
      desc: 'Artisanal matte black pottery pedestal',
      bgClass: 'bg-gradient-to-r from-[#1C1C1E] via-[#2C2C2E] to-[#141416] border-t border-[#3A3A3C]'
    },
    'light-oak': {
      name: 'Light-Oak Timber',
      desc: 'Natural Scandinavian light-oak block',
      bgClass: 'bg-gradient-to-r from-[#D7B98E] via-[#E7CB9F] to-[#CBA77B] border-t border-[#F2DEBF]'
    },
    'terracotta': {
      name: 'Matte Terracotta',
      desc: 'Warm earthen baked clay platter',
      bgClass: 'bg-gradient-to-r from-[#944D38] via-[#AB5C45] to-[#803E2C] border-t border-[#C77259]'
    },
    'raw-stone': {
      name: 'Artisanal Slate Stone',
      desc: 'Chiseled charcoal natural mineral slab',
      bgClass: 'bg-gradient-to-r from-[#22252A] via-[#2F343B] to-[#1B1D21] border-t border-[#3F454F]'
    }
  };

  // Generate exact Master AI Prompt
  const generateMasterPrompt = () => {
    const typographyDesc = 
      typography === 'brush'
        ? 'strictly in the Brush Strokes / Artistic Brush Style (similar to image_4.png), showcasing rough, hand-painted artistic brushwork with visible bristle textures, expressive sweep effects, and subtle 3D shading on the strokes in an off-white and light gold dual-tone.'
        : typography === 'fluid'
        ? 'strictly in the Fluid / Liquid style (similar to image_5.png), characterized by smooth, organic, boldly curved shapes with natural flow, dynamic loops, and interconnected letters, as if written with thick, flowing liquid in rich dark-brown and warm gold tones.'
        : 'in a handwritten / "হাতে আঁকা" style (similar to image_6.png), exhibiting artistic calligraphic handwriting with natural curls, elegant strokes, and handcrafted flourishes with whimsical swooshes and dots around the letters in dark-brown and subtle gold gradients.';

    const backgroundDesc =
      style === 'dark-cinematic'
        ? 'The top 75% of the canvas is completely empty, seamless pitch-dark charcoal negative space. A warm, golden cinematic side-light hits the cake and its complementary base, creating a moody, high-end dramatic atmosphere with rich contrasts and deep shadows.'
        : 'The top 75% of the canvas is an empty, seamless warm taupe, sand, or light beige plaster wall, leaving massive breathing space. Soft, natural ambient lighting wraps the cake and its unique base, creating a grounded, earthy, yet highly expensive aesthetic.';

    return `An editorial, ultra-premium advertising photograph in a 4:5 aspect ratio, featuring the user's uploaded cake situated in the bottom 25% of the frame. The cake rests on a dynamically chosen complementary base based on its colors and design—specifically a ${pedestalStyles[pedestal].name} (${pedestalStyles[pedestal].desc}), retaining its original textures, frosting, and design in high-fidelity. ${backgroundDesc}
In the upper empty space, the Bengali typography “কেক স্লাইস” (Cake Slice) with “বাই ফারজানা” (by Farjana) directly below it is prominently featured ${typographyDesc}
Small, understated gold decorative lines or english subtitle "${subtitle}" sit beneath the brand name. The image is clean, highly aesthetic, entirely uncluttered, with a magazine-like layout focusing only on the textured cake and the dramatic brand name. 8k, photorealistic. --ar 4:5`;
  };

  const copyPromptToClipboard = () => {
    const text = generateMasterPrompt();
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // High-Resolution Export using HTML5 Canvas (1080 x 1350 px = 4:5)
  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      const width = 1080;
      const height = 1350;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background
      if (style === 'dark-cinematic') {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0F0E11');
        bgGrad.addColorStop(0.5, '#16141A');
        bgGrad.addColorStop(1, '#0A090C');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Cinematic Warm Side-light beam
        const lightGrad = ctx.createRadialGradient(width * 0.9, height * 0.7, 50, width * 0.7, height * 0.75, 650);
        lightGrad.addColorStop(0, 'rgba(235, 185, 100, 0.22)');
        lightGrad.addColorStop(0.4, 'rgba(212, 160, 75, 0.08)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Organic Earth Tone
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#EAE3D2');
        bgGrad.addColorStop(0.5, '#DFD6C3');
        bgGrad.addColorStop(1, '#D5C9B3');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft ambient warm diffusion
        const lightGrad = ctx.createRadialGradient(width * 0.5, height * 0.4, 100, width * 0.5, height * 0.5, 700);
        lightGrad.addColorStop(0, 'rgba(255, 250, 240, 0.35)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.03)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Pedestal / Base in bottom 25% (Y: 1012 to 1350)
      const pedestalY = height * 0.82;
      const pedestalHeight = height * 0.18;
      
      const pColors = {
        'dark-wood': ['#1B120B', '#2E1D13', '#140D07'],
        'travertine': ['#D8C7B0', '#EAE0D0', '#C9B79E'],
        'ceramic': ['#18181A', '#28282B', '#121214'],
        'light-oak': ['#D5B68B', '#E5CAA0', '#C6A275'],
        'terracotta': ['#914935', '#A75640', '#7A3A28'],
        'raw-stone': ['#22252A', '#313740', '#1A1C20']
      }[pedestal];

      const pGrad = ctx.createLinearGradient(0, pedestalY, width, pedestalY);
      pGrad.addColorStop(0, pColors[0]);
      pGrad.addColorStop(0.5, pColors[1]);
      pGrad.addColorStop(1, pColors[2]);
      ctx.fillStyle = pGrad;
      ctx.fillRect(0, pedestalY, width, pedestalHeight);

      // Pedestal edge highlight
      ctx.strokeStyle = style === 'dark-cinematic' ? 'rgba(223, 186, 117, 0.3)' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, pedestalY);
      ctx.lineTo(width, pedestalY);
      ctx.stroke();

      // 3. Draw Cake Image (Anchored strictly in bottom 25%)
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeCakeImage;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      // Calculate cake dimensions
      const baseCakeSize = width * 0.55 * (cakeScale / 100);
      const aspect = img.width && img.height ? img.width / img.height : 1;
      const cakeWidth = baseCakeSize;
      const cakeHeight = baseCakeSize / aspect;
      const cakeX = (width - cakeWidth) / 2;
      const cakeY = pedestalY - cakeHeight + 40 + cakeOffsetY;

      // Cake shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        width / 2, 
        pedestalY + 10, 
        cakeWidth * 0.42, 
        18, 
        0, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity / 100 * 0.75})`;
      ctx.filter = 'blur(14px)';
      ctx.fill();
      ctx.restore();

      // Draw Cake
      ctx.save();
      ctx.translate(width / 2, cakeY + cakeHeight / 2);
      ctx.rotate((cakeRotation * Math.PI) / 180);
      ctx.drawImage(img, -cakeWidth / 2, -cakeHeight / 2, cakeWidth, cakeHeight);
      ctx.restore();

      // 4. Render Bengali Typography in the top 75% negative space
      ctx.save();
      ctx.textAlign = 'center';
      
      const isDark = style === 'dark-cinematic';
      const textCenterY = height * 0.28;

      if (typography === 'brush') {
        // Line 1: কেক স্লাইস
        ctx.font = 'bold 88px "Playfair Display", "Anek Bangla", serif';
        const goldTextGrad = ctx.createLinearGradient(width * 0.3, textCenterY - 60, width * 0.7, textCenterY);
        goldTextGrad.addColorStop(0, '#FFF9E8');
        goldTextGrad.addColorStop(0.5, '#DFBA75');
        goldTextGrad.addColorStop(1, '#C29B48');
        ctx.fillStyle = goldTextGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 16;
        ctx.fillText('কেক স্লাইস', width / 2, textCenterY);

        // Line 2: বাই ফারজানা
        ctx.font = '600 48px "Anek Bangla", sans-serif';
        ctx.fillStyle = '#FFF1D0';
        ctx.shadowBlur = 10;
        ctx.fillText('বাই ফারজানা', width / 2, textCenterY + 70);

        // Brush divider
        ctx.strokeStyle = '#DFBA75';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.38, textCenterY + 115);
        ctx.lineTo(width * 0.62, textCenterY + 115);
        ctx.stroke();

        // Subtitle
        ctx.font = '500 20px sans-serif';
        ctx.fillStyle = 'rgba(223, 186, 117, 0.85)';
        ctx.shadowBlur = 0;
        ctx.letterSpacing = '8px';
        ctx.fillText(subtitle, width / 2, textCenterY + 155);

      } else if (typography === 'fluid') {
        // Line 1: কেক স্লাইস (Fluid curve)
        ctx.font = 'bold 84px "Playfair Display", "Anek Bangla", serif';
        ctx.fillStyle = isDark ? '#F7E3B5' : '#3E2419';
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 12;
        ctx.fillText('কেক স্লাইস', width / 2, textCenterY);

        // Line 2: বাই ফারজানা
        ctx.font = '600 46px "Anek Bangla", sans-serif';
        ctx.fillStyle = isDark ? '#D4AF37' : '#523422';
        ctx.fillText('বাই ফারজানা', width / 2, textCenterY + 68);

        // Subtitle
        ctx.font = '500 19px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.8)' : 'rgba(74, 46, 27, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText(subtitle, width / 2, textCenterY + 140);

      } else {
        // Handwritten / হাতে আঁকা
        ctx.font = 'italic bold 82px "Anek Bangla", cursive, serif';
        ctx.fillStyle = isDark ? '#F5E4C3' : '#3C2A1E';
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 14;
        ctx.fillText('কেক স্লাইস', width / 2, textCenterY);

        ctx.font = 'italic 500 48px "Anek Bangla", cursive';
        ctx.fillStyle = isDark ? '#DFBA75' : '#6A4B35';
        ctx.fillText('বাই ফারজানা', width / 2, textCenterY + 66);

        // Subtitle
        ctx.font = '500 18px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(245, 228, 195, 0.75)' : 'rgba(90, 62, 44, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText(subtitle, width / 2, textCenterY + 135);
      }
      ctx.restore();

      // 5. Trigger download
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      const link = document.createElement('a');
      link.download = `Cake-Slice-by-Farjana-${style}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed. Please check image permissions.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Controls & Presets Panel (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Style Preset Selector */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#DFBA75]" />
              Locked Aesthetic Styles
            </h3>
            <span className="text-[11px] text-zinc-500">4:5 Aspect Ratio</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Style 1 */}
            <button
              onClick={() => handleStyleChange('dark-cinematic')}
              className={`p-3.5 rounded-xl text-left transition-all border ${
                style === 'dark-cinematic'
                  ? 'border-[#DFBA75] bg-[#1E1B22] shadow-[0_0_20px_rgba(223,186,117,0.15)]'
                  : 'border-[#26242B] bg-[#0E0D10] opacity-75 hover:opacity-100 hover:border-zinc-700'
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-black via-[#1C1822] to-[#2E2415] mb-2 border border-zinc-800" />
              <div className="font-semibold text-xs text-zinc-100">Dark & Warm Cinematic</div>
              <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2">
                Pitch charcoal, golden cinematic side-light, moody luxury.
              </div>
            </button>

            {/* Style 2 */}
            <button
              onClick={() => handleStyleChange('organic-earth')}
              className={`p-3.5 rounded-xl text-left transition-all border ${
                style === 'organic-earth'
                  ? 'border-[#DFBA75] bg-[#1E1B22] shadow-[0_0_20px_rgba(223,186,117,0.15)]'
                  : 'border-[#26242B] bg-[#0E0D10] opacity-75 hover:opacity-100 hover:border-zinc-700'
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-[#D7CBBA] via-[#E8DECE] to-[#C9B9A3] mb-2 border border-[#B8A893]" />
              <div className="font-semibold text-xs text-zinc-100">Organic Earth Tone</div>
              <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2">
                Warm taupe/sand plaster, soft diffused ambient glow.
              </div>
            </button>
          </div>
        </div>

        {/* Bengali Typography Locked Styles */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-[#DFBA75]" />
            Bengali Typography Styles
          </h3>

          <div className="space-y-2.5">
            {[
              { id: 'brush', name: 'Artistic Brush (তুলির ছোঁয়া)', desc: 'Off-white & light gold dual-tones, textured sweeps with 3D depth' },
              { id: 'fluid', name: 'Fluid / Liquid (তরল প্রবাহ)', desc: 'Rich dark-brown & warm gold curves with smooth organic flow' },
              { id: 'handwritten', name: 'Handwritten (হাতে আঁকা)', desc: 'Artisanal calligraphy with whimsical curls and signature intimacy' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTypography(item.id as TypographyStyle)}
                className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between ${
                  typography === item.id
                    ? 'border-[#DFBA75] bg-[#1C1824]'
                    : 'border-[#26242B] bg-[#0E0D10] hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-200">{item.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</div>
                </div>
                {typography === item.id && (
                  <div className="w-2 h-2 rounded-full bg-[#DFBA75] shadow-[0_0_8px_#DFBA75]" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#26242B]">
            <label className="text-[11px] text-zinc-400 font-medium block mb-1.5">
              Custom Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. A R T I S A N A L   B A K E R Y"
              className="w-full bg-[#0E0D10] border border-[#2A2832] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            />
          </div>
        </div>

        {/* Natural Base / Pedestal Selector */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#DFBA75]" />
              Natural Base Variety
            </h3>
            <span className="text-[10px] text-zinc-500">Zero Monotony</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(pedestalStyles) as BasePedestal[]).map((key) => {
              const item = pedestalStyles[key];
              const isSelected = pedestal === key;
              return (
                <button
                  key={key}
                  onClick={() => setPedestal(key)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#DFBA75] bg-[#1E1B24]'
                      : 'border-[#26242B] bg-[#0E0D10] hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-full h-4 rounded mb-1.5 ${item.bgClass}`} />
                  <div className="text-[11px] font-medium text-zinc-200 truncate">{item.name}</div>
                  <div className="text-[9px] text-zinc-500 truncate">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cake Positioning & Upload */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#DFBA75]" />
              Cake Photo & Positioning
            </h3>
            {cakeImage && (
              <button
                onClick={() => setCakeImage(null)}
                className="text-[10px] text-red-400 hover:underline"
              >
                Reset to Sample
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 border border-dashed border-[#DFBA75]/40 hover:border-[#DFBA75] bg-[#16141A] hover:bg-[#1E1A24] rounded-xl text-center transition-all group"
          >
            <Upload className="w-5 h-5 text-[#DFBA75] mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-zinc-200 block">
              {cakeImage ? 'Change Uploaded Cake Photo' : 'Upload Your Customer Cake Photo'}
            </span>
            <span className="text-[10px] text-zinc-500">Supports PNG, JPG, WebP (Transparent or solid)</span>
          </button>

          {/* Positioning Sliders */}
          <div className="mt-4 space-y-3 pt-3 border-t border-[#26242B]">
            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>Cake Scale (আকার)</span>
                <span>{cakeScale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="130"
                value={cakeScale}
                onChange={(e) => setCakeScale(Number(e.target.value))}
                className="w-full accent-[#DFBA75] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>Vertical Placement (নিচের ২৫% অংশ)</span>
                <span>{cakeOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={cakeOffsetY}
                onChange={(e) => setCakeOffsetY(Number(e.target.value))}
                className="w-full accent-[#DFBA75] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>Shadow Contrast (ছায়ার গভীরতা)</span>
                <span>{shadowIntensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={shadowIntensity}
                onChange={(e) => setShadowIntensity(Number(e.target.value))}
                className="w-full accent-[#DFBA75] cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT: 4:5 Live Editorial Canvas & Export Panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        
        {/* Canvas Card */}
        <div className="w-full max-w-[480px] bg-[#0A0A0C] border border-[#2A2832] rounded-3xl p-4 shadow-2xl relative">
          
          {/* Header Badges */}
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-zinc-300">
                EDITORIAL RATIO: 4:5
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20">
              {style === 'dark-cinematic' ? 'Cinematic Dark' : 'Organic Earth'}
            </span>
          </div>

          {/* Exact 4:5 Ratio Aspect Box (w: 100%, h: 125%) */}
          <div 
            className={`w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-inner flex flex-col justify-between transition-colors duration-700 ${
              style === 'dark-cinematic'
                ? 'bg-gradient-to-b from-[#0F0E11] via-[#15131A] to-[#0A090C]'
                : 'bg-gradient-to-b from-[#EAE3D2] via-[#DFD6C3] to-[#D5C9B3]'
            }`}
          >
            {/* Cinematic Lighting Effect */}
            {style === 'dark-cinematic' ? (
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_80%_80%,rgba(235,185,100,0.18),transparent_65%)]" />
            ) : (
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.4),transparent_70%)]" />
            )}

            {/* TOP 70%-75%: Massive Empty Negative Space with Locked Bengali Typography */}
            <div className="h-[75%] w-full flex flex-col items-center justify-center p-6 relative z-10">
              <TypographyOverlay
                style={typography}
                subtitle={subtitle}
                isDarkTheme={style === 'dark-cinematic'}
              />
            </div>

            {/* BOTTOM 25%: Cake Sitting on the Bespoke Natural Pedestal */}
            <div className="h-[25%] w-full relative z-20 flex flex-col justify-end">
              
              {/* Pedestal Surface */}
              <div className={`w-full h-14 ${pedestalStyles[pedestal].bgClass} relative shadow-2xl`}>
                {/* Surface top edge shine */}
                <div 
                  className={`w-full h-[1.5px] ${
                    style === 'dark-cinematic' ? 'bg-[#DFBA75]/30' : 'bg-white/40'
                  }`} 
                />
              </div>

              {/* Floating/Anchored Cake */}
              <div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center transition-all duration-300"
                style={{
                  transform: `translateX(-50%) translateY(${cakeOffsetY}px) scale(${cakeScale / 100}) rotate(${cakeRotation}deg)`,
                }}
              >
                {/* Shadow underneath cake */}
                <div 
                  className="w-48 h-6 rounded-full bg-black/80 blur-md translate-y-3"
                  style={{ opacity: shadowIntensity / 100 }}
                />

                {/* Cake Element */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeCakeImage}
                  alt="Customer Cake"
                  className="max-h-56 max-w-[280px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                />
              </div>

            </div>

            {/* Grid overlay toggle preview lines (Subtle Guide for 75% / 25%) */}
            <div className="absolute top-[75%] left-0 right-0 border-t border-dashed border-[#DFBA75]/20 pointer-events-none flex justify-end pr-2">
              <span className="text-[9px] text-[#DFBA75]/40 -translate-y-4">
                75% Negative Space Boundary
              </span>
            </div>

          </div>

          {/* Action Buttons Below Canvas */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="py-3 px-4 bg-[#DFBA75] hover:bg-[#E5C685] text-black font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generating 4:5...' : 'Download High-Res 4:5'}
            </button>

            <button
              onClick={copyPromptToClipboard}
              className="py-3 px-4 bg-[#18161E] hover:bg-[#231F2C] border border-[#3A3545] text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Master Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#DFBA75]" />
                  <span>Copy 8K AI Prompt</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 text-center mt-3">
            Pure magazine editorial layout. Zero clutter. Preserves original cake textures in high fidelity.
          </p>

        </div>

      </div>
    </div>
  );
};
