'use client';

import React, { useState, useRef } from 'react';
import { Upload, Video, Sparkles, Scissors, Music, Wand2, Clock, Check } from 'lucide-react';
import { analyzeVideoForReels } from '@/lib/gemini';

interface VideoTabProps {
  apiKey: string;
}

export const VideoTab: React.FC<VideoTabProps> = ({ apiKey }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoDescription, setVideoDescription] = useState('Raw mobile video of decorating chocolate cake with gold leaf and knife slice cut.');
  
  // Gemini Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    hookIdea: string;
    bestTimestamps: string[];
    audioVibe: string;
    editorialAdvice: string;
  } | null>(null);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(15);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleAnalyzeWithGemini = async () => {
    if (!apiKey) {
      alert('Please configure your Gemini Pro API key in the top settings header first!');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeVideoForReels({
        apiKey,
        videoDescription: videoDescription || 'Raw video of artisanal cake creation'
      });
      setAiReport(result);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert(`AI Video Analysis failed: ${errorMsg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Upload & AI Video Director (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Upload Box */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
              <Video className="w-4 h-4 text-[#DFBA75]" />
              Upload Raw Video Footage
            </h3>
            <span className="text-[11px] text-zinc-500">Full-Length or Clips</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 px-4 border border-dashed border-[#DFBA75]/40 hover:border-[#DFBA75] bg-[#16141A] hover:bg-[#1E1A24] rounded-xl text-center transition-all group"
          >
            <Upload className="w-6 h-6 text-[#DFBA75] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-zinc-200 block">
              {videoFile ? videoFile.name : 'Click to Upload Cake Making / Display Video'}
            </span>
            <span className="text-[10px] text-zinc-500">Supports MP4, MOV, WebM</span>
          </button>
        </div>

        {/* AI Video Director (Powered by Gemini Pro) */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#DFBA75]" />
              Gemini Pro Reels Director
            </h3>
            <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              AI Smart Cut
            </span>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              What does this video show? (AI Context)
            </label>
            <textarea
              rows={2}
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="e.g. Frosting the cake, dripping ganache, placing edible gold, slow knife slice..."
              className="w-full bg-[#0E0D10] border border-[#2A2832] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            />
          </div>

          <button
            onClick={handleAnalyzeWithGemini}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#DFBA75] to-[#B38F44] text-black font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-95"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing Footage with Gemini Pro...' : 'Analyze & Extract 9:16 Viral Reels Cut'}
          </button>

          {/* AI Output Card */}
          {aiReport && (
            <div className="mt-4 p-4 rounded-xl border border-[#DFBA75]/30 bg-[#1C1824] space-y-3">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-[#DFBA75] uppercase block">
                  3-Second Hook Strategy:
                </span>
                <p className="text-xs text-zinc-200 mt-0.5">{aiReport.hookIdea}</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-widest text-[#DFBA75] uppercase block">
                  Cut Pacing (Timestamps):
                </span>
                <ul className="text-xs text-zinc-300 space-y-1 mt-1">
                  {aiReport.bestTimestamps.map((ts, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#DFBA75]" />
                      <span>{ts}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-widest text-[#DFBA75] uppercase block">
                  Audio & Music Mood:
                </span>
                <p className="text-xs text-amber-300/90 flex items-center gap-1.5 mt-0.5">
                  <Music className="w-3.5 h-3.5" />
                  {aiReport.audioVibe}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trimming & Framing Controls */}
        <div className="bg-[#141316] border border-[#26242B] rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-semibold tracking-wider text-[#DFBA75] uppercase flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#DFBA75]" />
            Target Duration (Reels / Shorts)
          </h3>

          <div className="flex gap-2">
            {[10, 15, 30].map((sec) => (
              <button
                key={sec}
                onClick={() => setTrimEnd(sec)}
                className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                  trimEnd === sec
                    ? 'border-[#DFBA75] bg-[#1F1B26] text-[#DFBA75] font-semibold'
                    : 'border-[#26242B] bg-[#0E0D10] text-zinc-400'
                }`}
              >
                {sec} Seconds
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT: 9:16 Vertical Reels Player & Safe Zones (7 cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-[380px] bg-[#0A0A0C] border border-[#2A2832] rounded-3xl p-4 shadow-2xl relative">
          
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REELS FORMAT: 9:16
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#DFBA75] bg-[#DFBA75]/10 px-2 py-0.5 rounded-full border border-[#DFBA75]/20">
              0:00 – 0:{trimEnd < 10 ? `0${trimEnd}` : trimEnd}
            </span>
          </div>

          {/* 9:16 Aspect Ratio Frame */}
          <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black relative border border-zinc-800 shadow-2xl flex items-center justify-center">
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <Video className="w-10 h-10 text-zinc-600 mx-auto" />
                <div className="text-xs font-medium text-zinc-400">
                  Upload a video to preview in 9:16 Reels Frame
                </div>
                <div className="text-[10px] text-zinc-600">
                  Auto-fitted with luxury branding safe zones
                </div>
              </div>
            )}

            {/* Branded Overlay Watermark in Safe Zone */}
            <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
              <div className="text-sm font-serif font-bold text-[#DFBA75] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                কেক স্লাইস বাই ফারজানা
              </div>
              <div className="text-[8px] tracking-[0.25em] text-white/80 uppercase">
                A R T I S A N A L   C O N F E C T I O N E R Y
              </div>
            </div>

            {/* UI Safe Zone Guidelines (Instagram Overlay Simulation) */}
            <div className="absolute bottom-6 left-4 right-16 pointer-events-none space-y-1">
              <div className="h-3 w-28 bg-white/20 rounded-full" />
              <div className="h-2 w-44 bg-white/10 rounded-full" />
            </div>

          </div>

          <p className="text-[11px] text-zinc-500 text-center mt-3">
            Designed for Instagram Reels & Facebook Shorts. Safe zones prevent titles from being blocked by platform buttons.
          </p>

        </div>
      </div>
    </div>
  );
};
