'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Sparkles, LayoutGrid, Layers, Trash2, Check } from 'lucide-react';
import { TypographyOverlay } from '@/lib/typography';
import { BackgroundStyle, TypographyStyle } from '@/types';

export const CarouselTab: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [carouselMode, setCarouselMode] = useState<'slides' | 'collage'>('slides');
  const [activeSlide, setActiveSlide] = useState(0);
  const [style, setStyle] = useState<BackgroundStyle>('dark-cinematic');
  const [typography, setTypography] = useState<TypographyStyle>('brush');
  const [cakeTitle, setCakeTitle] = useState('Velvet Chocolate Ganache');
  const [flavorNotes, setFlavorNotes] = useState('70% Belgian Dark Chocolate, Salted Caramel Core, Edible Gold');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default sample images for demonstration
  const sampleCakes = [
    '/sample-1.svg',
    '/sample-2.svg',
    '/sample-3.svg'
  ];

  const handleMultipleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setImages((prev) => [...prev, ...newImages].slice(0, 4));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (activeSlide >= images.length - 1) {
      setActiveSlide(Math.max(0, images.length - 2));
    }
  };

  const isDark = style === 'dark-cinematic';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Controls (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Upload Multi-Image Box */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#DFBA75]" />
              Upload 3–4 Cake Photos
            </h3>
            <span className="text-[11px] text-zinc-500">{images.length}/4 Photos</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-4 border border-dashed border-[#DFBA75]/40 hover:border-[#DFBA75] bg-[#16141A] hover:bg-[#1E1A24] rounded-xl text-center transition-all group"
          >
            <Upload className="w-6 h-6 text-[#DFBA75] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-zinc-200 block">
              Click to select 3-4 photos of the same cake
            </span>
            <span className="text-[10px] text-zinc-500">
              Hero shot, close-up details, slice cut, and styling angles
            </span>
          </button>

          {/* Uploaded Thumbnails */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {images.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#3A3545] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Cake view ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-[9px] text-zinc-300 px-1 rounded">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Layout Style Toggle */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase mb-3">
            Layout Presentation
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCarouselMode('slides')}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                carouselMode === 'slides'
                  ? 'border-[#DFBA75] bg-[#1C1824]'
                  : 'border-[#26242B] bg-[#0E0D10] text-zinc-400'
              }`}
            >
              <Layers className="w-5 h-5 text-[#DFBA75]" />
              <div>
                <div className="text-xs font-semibold text-zinc-200">Carousel Slides</div>
                <div className="text-[10px] text-zinc-400">Sequential swipe cards</div>
              </div>
            </button>

            <button
              onClick={() => setCarouselMode('collage')}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                carouselMode === 'collage'
                  ? 'border-[#DFBA75] bg-[#1C1824]'
                  : 'border-[#26242B] bg-[#0E0D10] text-zinc-400'
              }`}
            >
              <LayoutGrid className="w-5 h-5 text-[#DFBA75]" />
              <div>
                <div className="text-xs font-semibold text-zinc-200">Editorial Collage</div>
                <div className="text-[10px] text-zinc-400">3-in-1 Magazine Grid</div>
              </div>
            </button>
          </div>
        </div>

        {/* Content & Details */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase">
            Post Details
          </h3>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Cake Name / Flavour</label>
            <input
              type="text"
              value={cakeTitle}
              onChange={(e) => setCakeTitle(e.target.value)}
              className="w-full bg-[#0E0D10] border border-[#2A2832] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            />
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Artisanal Notes / Ingredients</label>
            <textarea
              rows={2}
              value={flavorNotes}
              onChange={(e) => setFlavorNotes(e.target.value)}
              className="w-full bg-[#0E0D10] border border-[#2A2832] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            />
          </div>
        </div>

      </div>

      {/* RIGHT: Live 4:5 Carousel Preview (7 cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-[480px] bg-[#0A0A0C] border border-[#2A2832] rounded-3xl p-4 shadow-2xl relative">
          
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold tracking-wider text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#DFBA75]" />
              {carouselMode === 'slides' ? `SLIDE ${activeSlide + 1} OF 4` : 'MAGAZINE COLLAGE'}
            </span>
            <div className="flex gap-2">
              {['dark-cinematic', 'organic-earth'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s as BackgroundStyle)}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                    style === s
                      ? 'border-[#DFBA75] text-[#DFBA75] bg-[#DFBA75]/10'
                      : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  {s === 'dark-cinematic' ? 'Dark' : 'Earth'}
                </button>
              ))}
            </div>
          </div>

          {/* 4:5 Ratio Container */}
          <div 
            className={`w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-2xl transition-colors duration-500 ${
              isDark 
                ? 'bg-gradient-to-b from-[#0F0E11] via-[#141218] to-[#0A090C]'
                : 'bg-gradient-to-b from-[#EAE3D2] via-[#DFD6C3] to-[#D5C9B3]'
            }`}
          >
            {carouselMode === 'slides' ? (
              // CAROUSEL SLIDES MODE
              <div className="w-full h-full flex flex-col justify-between p-6 relative">
                
                {/* Slide 1: Cover */}
                {activeSlide === 0 && (
                  <>
                    <div className="h-[75%] flex flex-col items-center justify-center">
                      <TypographyOverlay style={typography} isDarkTheme={isDark} />
                    </div>
                    <div className="h-[25%] flex flex-col justify-end items-center relative">
                      <div className="w-full h-8 bg-black/40 border-t border-[#DFBA75]/30 rounded-t-lg" />
                      <div className="absolute bottom-2 text-center">
                        <span className="text-[11px] font-serif text-[#DFBA75] tracking-widest uppercase">
                          {cakeTitle}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Slide 2: Texture Details */}
                {activeSlide === 1 && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#DFBA75] mb-2">
                      A R T I S A N A L   D E T A I L S
                    </span>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#DFBA75]/30 shadow-2xl bg-zinc-900 mb-4 flex items-center justify-center">
                      {images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[0]} alt="Cake Texture" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-zinc-500">Upload photo for texture view</span>
                      )}
                    </div>
                    <p className={`text-xs font-serif italic max-w-xs ${isDark ? 'text-zinc-300' : 'text-[#3E2419]'}`}>
                      &ldquo;{flavorNotes}&rdquo;
                    </p>
                  </div>
                )}

                {/* Slide 3: Cross Section / Craft */}
                {activeSlide === 2 && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#DFBA75] mb-2">
                      T H E   C R A F T
                    </span>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#DFBA75]/30 shadow-2xl bg-zinc-900 mb-4 flex items-center justify-center">
                      {images[1] || images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[1] || images[0]} alt="Cake Craft" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-zinc-500">Upload slice view photo</span>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-[#DFBA75]">কেক স্লাইস বাই ফারজানা</div>
                      <div className={`text-[10px] mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>
                        Bespoke orders baked fresh with 100% pure ingredients.
                      </div>
                    </div>
                  </div>
                )}

                {/* Slide 4: Reserve / Order CTA */}
                {activeSlide === 3 && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <TypographyOverlay style="handwritten" subtitle="B E S P O K E   O R D E R S" isDarkTheme={isDark} />
                    <div className="my-6 p-4 rounded-xl border border-[#DFBA75]/40 bg-black/30 backdrop-blur-sm max-w-xs">
                      <div className="text-xs font-semibold text-zinc-100 mb-1">Reserve Your Cake</div>
                      <div className="text-[11px] text-zinc-400">
                        Orders require 48 hours prior notice for bespoke finishing.
                      </div>
                    </div>
                    <span className="text-[10px] tracking-widest text-[#DFBA75] uppercase">
                      INBOX / WHATSAPP TO CONFIRM
                    </span>
                  </div>
                )}

              </div>
            ) : (
              // COLLAGE GRID MODE (3-in-1 Luxury Magazine Layout)
              <div className="w-full h-full p-5 flex flex-col justify-between">
                {/* Header branding */}
                <div className="text-center py-2">
                  <div className="text-lg font-serif font-bold tracking-widest text-[#DFBA75]">
                    কেক স্লাইস বাই ফারজানা
                  </div>
                  <div className={`text-[9px] tracking-[0.3em] uppercase ${isDark ? 'text-zinc-400' : 'text-[#5A3E2C]'}`}>
                    EDITORIAL COLLECTION
                  </div>
                </div>

                {/* 3-grid Magazine layout */}
                <div className="grid grid-cols-2 gap-2.5 flex-1 my-3">
                  {/* Big Hero image on Left */}
                  <div className="rounded-xl overflow-hidden border border-[#DFBA75]/30 bg-zinc-900 shadow-lg">
                    {images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[0]} alt="Hero Cake" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                        Hero Photo
                      </div>
                    )}
                  </div>

                  {/* 2 stacked images on Right */}
                  <div className="grid grid-rows-2 gap-2.5">
                    <div className="rounded-xl overflow-hidden border border-[#DFBA75]/30 bg-zinc-900 shadow-md">
                      {images[1] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[1]} alt="Cake Angle 2" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500">
                          Angle 2
                        </div>
                      )}
                    </div>
                    <div className="rounded-xl overflow-hidden border border-[#DFBA75]/30 bg-zinc-900 shadow-md">
                      {images[2] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[2]} alt="Cake Angle 3" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500">
                          Slice Cut
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer text */}
                <div className="text-center pt-1 border-t border-[#DFBA75]/20">
                  <div className="text-[11px] font-medium text-[#DFBA75]">{cakeTitle}</div>
                  <div className={`text-[9px] truncate ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>
                    {flavorNotes}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Carousel Slide Indicators */}
          {carouselMode === 'slides' && (
            <div className="flex justify-center items-center gap-2 mt-4">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx
                      ? 'w-6 bg-[#DFBA75]'
                      : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => alert('All slides exported in high-res 4:5 editorial format!')}
              className="flex-1 py-3 px-4 bg-[#DFBA75] hover:bg-[#E5C685] text-black font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              <span>Download Carousel Pack (4:5)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
