/**
 * Gemini Pro Client Integration for Cake Slice by Farjana
 * Supports direct API Key connection with Google Gemini REST API.
 */

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export async function testGeminiConnection(apiKey: string, model: string = DEFAULT_GEMINI_MODEL): Promise<{ success: boolean; message: string }> {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'API Key is missing' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Respond with the single word: READY' }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error?.message || response.statusText;
      return { success: false, message: `Error: ${errMsg}` };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (reply.includes('READY')) {
      return { success: true, message: `Connected to ${model} successfully!` };
    }

    return { success: true, message: `Connected to ${model}` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Connection failed: ${errorMsg}` };
  }
}

export async function generateLuxuryCaption(params: {
  apiKey: string;
  model?: string;
  cakeName: string;
  flavorProfile: string;
  tone: 'editorial' | 'celebration' | 'minimalist' | 'artisan';
  language: 'bengali' | 'banglish' | 'english';
}): Promise<{ hook: string; body: string; callToAction: string; hashtags: string[]; fullText: string }> {
  const { apiKey, model = DEFAULT_GEMINI_MODEL, cakeName, flavorProfile, tone, language } = params;

  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const prompt = `
You are the Executive Art Director & Copywriter for "Cake Slice by Farjana" (কেক স্লাইস বাই ফারজানা) — an ultra-premium artisanal luxury bakery in Dhaka.

Cake Details:
- Name/Description: "${cakeName || 'Artisanal Bespoke Cake'}"
- Flavors/Craft: "${flavorProfile || 'Rich velvety chocolate ganache, handcrafted edible gold accents'}"
- Target Tone: ${tone} (Options: editorial magazine, grand celebration, minimalist chic, artisan craft)
- Language Preference: ${language} (Natural, poetic, high-status Bengali or English with luxury touch)

Brand Essence:
- Understated luxury, magazine editorial elegance, Michelin-level confectionery aesthetics.
- Never cheesy, never pushy. Poetic, sensory, and captivating.

Generate the output in strict JSON format with this exact structure:
{
  "hook": "A captivating, scroll-stopping 1-sentence opening hook",
  "body": "2 to 3 poetic, sensory sentences describing the taste, textures, and artisanal creation of the cake",
  "callToAction": "An elegant, subtle booking/order invitation (e.g. DM to reserve your bespoke slice / Slots limited)",
  "hashtags": ["#CakeSliceByFarjana", "#ArtisanalBakeryDhaka", "#LuxuryCakesDhaka", "#BespokeCakes", "#CoutureCakes"]
}
Only output the raw JSON object, no markdown codeblocks.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to generate caption');
  }

  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  try {
    const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    const fullText = `${parsed.hook}\n\n${parsed.body}\n\n${parsed.callToAction}\n\n${parsed.hashtags.join(' ')}`;
    return {
      hook: parsed.hook,
      body: parsed.body,
      callToAction: parsed.callToAction,
      hashtags: parsed.hashtags,
      fullText
    };
  } catch {
    return {
      hook: "শিল্প ও স্বাদের নিখুঁত মেলবন্ধন — কেক স্লাইস বাই ফারজানা।",
      body: rawJson || "প্রতিটি স্লাইসে অতুলনীয় খাঁটি উপকরণ ও যত্নের স্পর্শ।",
      callToAction: "আপনার বিশেষ দিনের জন্য আগে থেকেই অর্ডার কনফার্ম করুন। ইনবক্সে যোগাযোগ করুন।",
      hashtags: ["#CakeSliceByFarjana", "#DhakaLuxuryBakery", "#BespokeCakes"],
      fullText: rawJson
    };
  }
}

export async function analyzeVideoForReels(params: {
  apiKey: string;
  model?: string;
  videoDescription: string;
}): Promise<{
  hookIdea: string;
  bestTimestamps: string[];
  audioVibe: string;
  editorialAdvice: string;
}> {
  const { apiKey, model = DEFAULT_GEMINI_MODEL, videoDescription } = params;

  const prompt = `
You are the Creative Video Director for "Cake Slice by Farjana" (কেক স্লাইস বাই ফারজানা).
The creator has recorded a raw video of their cake creation/display.
Video Context: "${videoDescription}"

Advise them on how to turn this raw footage into a viral, high-end 9:16 Instagram Reel / Short with zero clutter and pure luxury aesthetic.

Return pure JSON:
{
  "hookIdea": "What the very first 2 seconds should show to stop the scroll",
  "bestTimestamps": ["0:00 - 0:02 : Close-up texture reveal", "0:02 - 0:08 : Slow-motion knife slice or ganache pour", "0:08 - 0:15 : Finished cake on artisanal base"],
  "audioVibe": "e.g., Warm French Accordion / Lo-Fi Classical Cello / Soft ASMR Kitchen Sounds",
  "editorialAdvice": "1 concise sentence on color grading, lighting or text overlay"
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to analyze video');
  }

  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}
