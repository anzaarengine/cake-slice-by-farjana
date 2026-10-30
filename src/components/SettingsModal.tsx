'use client';

import React, { useState } from 'react';
import { Key, CheckCircle, AlertCircle, Sparkles, X, ShieldCheck } from 'lucide-react';
import { testGeminiConnection } from '@/lib/gemini';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string, model: string) => void;
  selectedModel: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  selectedModel
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [model, setModel] = useState(selectedModel || 'gemini-2.5-flash');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testGeminiConnection(keyInput, model);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    onSaveApiKey(keyInput, model);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#131215] border border-[#2E2A36] rounded-3xl p-6 shadow-2xl relative text-zinc-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-[#DFBA75]/10 border border-[#DFBA75]/20 text-[#DFBA75]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-wide text-zinc-100">
              Gemini Pro API Connection
            </h2>
            <p className="text-[11px] text-zinc-400">
              Connect your Google AI Studio key for live captioning & video insights
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setTestResult(null);
              }}
              placeholder="AIzaSy..."
              className="w-full bg-[#0B0A0D] border border-[#2A2633] rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-[#DFBA75] font-mono"
            />
            <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Stored safely in your browser localStorage. Never shared or sent to any third party.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              AI Intelligence Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#0B0A0D] border border-[#2A2633] rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#DFBA75]"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast & Free Tier Friendly - Recommended)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Luxury Editorial Quality)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (World-Class Highest Reasoning)</option>
            </select>
          </div>

          {/* Test Status Indicator */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                testResult.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="truncate">{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleTest}
              disabled={testing || !keyInput}
              className="flex-1 py-2.5 px-3 bg-[#1B1921] hover:bg-[#25222D] border border-[#332E3E] text-zinc-200 text-xs font-medium rounded-xl transition-all"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={handleSave}
              className="flex-1 py-2.5 px-3 bg-[#DFBA75] hover:bg-[#E8C885] text-black text-xs font-semibold rounded-xl shadow-lg transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
