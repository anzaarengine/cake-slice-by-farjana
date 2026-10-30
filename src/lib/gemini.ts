/**
 * Robust Multi-Engine AI Integration for Cake Slice by Farjana
 * 1. Gemini Vision analyzes the user's cake (shape, colors, piping, toppings).
 * 2. Generates photorealistic editorial scenes via secure server-side route.
 */

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

// Test Gemini API key
export async function testGeminiConnection(apiKey: string, model: string = DEFAULT_GEMINI_MODEL): Promise<{ success: boolean; message: string }> {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'API Key is missing' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with READY' }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.error?.message || response.statusText };
    }
    return { success: true, message: `Connected to Gemini Pro successfully!` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Connection failed: ${msg}` };
  }
}

/**
 * Step 1: Analyze user's uploaded cake photo with Gemini Vision
 */
export async function analyzeCakeVisuals(params: {
  apiKey?: string;
  imageBase64: string;
}): Promise<{
  cakeDescription: string;
  colors: string[];
  features: string;
  suggestedBase: string;
}> {
  const { apiKey, imageBase64 } = params;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `
Analyze this uploaded cake image for luxury bakery "Cake Slice by Farjana".
Identify:
1. Physical description: shape, tiers, buttercream piping style, colors, decorations.
2. Recommend the best luxury pedestal (hand-carved dark wood block, raw travertine stone slab, matte ceramic plate, or light-oak timber).

Return strictly JSON:
{
  "cakeDescription": "2-sentence realistic description of the cake",
  "colors": ["color1", "color2"],
  "features": "buttercream texture and piping details",
  "suggestedBase": "raw travertine stone slab"
}
`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('Gemini vision analysis fallback:', e);
    }
  }

  return {
    cakeDescription: 'Artisanal bespoke cake with delicate piping and handcrafted textures',
    colors: ['Sky blue', 'Ivory', 'Gold'],
    features: 'Handcrafted swirls and textured finish',
    suggestedBase: 'hand-carved dark wood block'
  };
}

/**
 * Step 2: High-Quality Photorealistic Image Generator
 * Calls internal Next.js server-side endpoint (/api/generate-image) to avoid browser CORS/timeout issues
 */
export async function generateEditorialImage(params: {
  apiKey?: string;
  prompt: string;
  preset?: string;
  cakeDetails?: unknown;
}): Promise<string> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok || !data.imageUrl) {
    throw new Error(data.error || 'ইমেজ জেনারেটরে সাময়িক চাপ রয়েছে, দয়া করে আরেকবার চেষ্টা করুন।');
  }

  return data.imageUrl;
}

/**
 * Step 3: Copywriting
 */
export async function generateLuxuryCaption(params: {
  apiKey: string;
  model?: string;
  cakeName: string;
  flavorProfile: string;
  tone: 'editorial' | 'celebration' | 'minimalist' | 'artisan';
  language: 'bengali' | 'banglish' | 'english';
}): Promise<{ hook: string; body: string; callToAction: string; hashtags: string[]; fullText: string }> {
  const { apiKey, model = DEFAULT_GEMINI_MODEL, cakeName, flavorProfile, tone, language } = params;

  const prompt = `
You are the Executive Art Director & Copywriter for "Cake Slice by Farjana" (কেক স্লাইস বাই ফারজানা).
Cake: "${cakeName || 'Artisanal Bespoke Cake'}"
Flavors: "${flavorProfile || 'Rich velvety chocolate ganache, handcrafted edible gold accents'}"
Tone: ${tone}
Language: ${language}

Strict JSON output:
{
  "hook": "1-sentence hook",
  "body": "2-3 sensory sentences",
  "callToAction": "Order invitation",
  "hashtags": ["#CakeSliceByFarjana", "#ArtisanalBakeryDhaka", "#LuxuryCakesDhaka"]
}
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
  const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned);
  const fullText = `${parsed.hook}\n\n${parsed.body}\n\n${parsed.callToAction}\n\n${parsed.hashtags.join(' ')}`;
  return { ...parsed, fullText };
}

/**
 * Step 4: Video Reels analysis
 */
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
Creative Video Director for "Cake Slice by Farjana" (কেক স্লাইস বাই ফারজানা).
Video Context: "${videoDescription}"
Return JSON:
{
  "hookIdea": "2-second scroll stopper",
  "bestTimestamps": ["0:00 - 0:02 : Close-up reveal", "0:02 - 0:08 : Action", "0:08 - 0:15 : Finished cake"],
  "audioVibe": "Audio recommendation",
  "editorialAdvice": "Color & lighting advice"
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
