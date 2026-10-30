/**
 * Gemini & Imagen 3 Integration for Cake Slice by Farjana
 * Supports:
 * 1. Multimodal Cake Analysis (Gemini 1.5 Pro / 2.5 Flash)
 * 2. Imagen 3 Photorealistic Generation (imagen-3.0-generate-002)
 * 3. AI Caption & Reels Video Director
 */

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
export const IMAGEN_MODEL = 'imagen-3.0-generate-002';

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
    return { success: true, message: `Connected to Gemini Pro & Imagen 3 successfully!` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Connection failed: ${msg}` };
  }
}

/**
 * Step 1: Analyze user's uploaded cake photo with Gemini Vision
 */
export async function analyzeCakeVisuals(params: {
  apiKey: string;
  imageBase64: string;
}): Promise<{
  cakeDescription: string;
  colors: string[];
  features: string;
  suggestedBase: string;
}> {
  const { apiKey, imageBase64 } = params;

  // Strip data:image/...;base64, prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `
Analyze this uploaded cake for the luxury brand "Cake Slice by Farjana".
Identify:
1. Exact cake shape, tiers, and frosting style (e.g. textured buttercream, smooth fondant, drip, rosettes).
2. Color palette (e.g. powder blue, ivory cream, dark chocolate, gold flakes).
3. Decorations, toppings, or toppers (e.g. sprinkles, chocolate shards, floral, calligraphy).
4. Recommend the most complementary luxury base/pedestal: hand-carved dark wood block, raw travertine stone slab, matte ceramic plate, light-oak timber, or terracotta platter.

Output strictly valid JSON:
{
  "cakeDescription": "2-sentence high-fidelity physical description of this exact cake",
  "colors": ["color1", "color2"],
  "features": "specific frosting textures and toppers",
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
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to analyze cake photo');
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Step 2: Generate the editorial image with Google Imagen 3 API
 */
export async function generateEditorialImageWithImagen(params: {
  apiKey: string;
  prompt: string;
  aspectRatio?: '3:4' | '4:5' | '1:1' | '9:16';
}): Promise<string> {
  const { apiKey, prompt, aspectRatio = '3:4' } = params;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${apiKey.trim()}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/jpeg'
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `Imagen 3 error (${response.status})`);
  }

  const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
  if (!base64Image) {
    throw new Error('No image was returned from Imagen 3. Please verify your Gemini API key has access to Imagen 3.');
  }

  return `data:image/jpeg;base64,${base64Image}`;
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
