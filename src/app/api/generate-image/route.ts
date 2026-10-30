import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, prompt, preset, cakeDetails } = await req.json();

    // 1. If user provided a Gemini API Key, let's check what image models their key supports
    if (apiKey && apiKey.trim().length > 5) {
      try {
        // Test Imagen models: imagen-3.0-generate-002 or imagen-3.0-generate-001
        for (const model of ['imagen-3.0-generate-002', 'imagen-3.0-generate-001']) {
          const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;
          const res = await fetch(imagenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey.trim(),
            },
            body: JSON.stringify({
              instances: [{ prompt }],
              parameters: {
                sampleCount: 1,
                aspectRatio: '3:4',
              },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const b64 = data.predictions?.[0]?.bytesBase64Encoded;
            if (b64) {
              return NextResponse.json({
                success: true,
                imageUrl: `data:image/jpeg;base64,${b64}`,
                source: `Google Imagen 3 (${model})`,
              });
            }
          }
        }
      } catch (err) {
        console.warn('Imagen 3 API check error:', err);
      }
    }

    // 2. High-Performance Server-Side Photorealistic 8K Fallback
    // Done server-side so there are zero browser CORS issues or blocks!
    const cleanPrompt = encodeURIComponent(
      `${prompt}, award-winning luxury editorial commercial food photography, Vogue dessert magazine cover, Hasselblad H6D-100c, 8k, photorealistic, sharp focus, cinematic lighting`
    );

    const seed = Math.floor(Math.random() * 9999999);
    const fluxUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=864&height=1080&model=flux&seed=${seed}&nologo=true&enhance=true`;

    const imgRes = await fetch(fluxUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });

    if (imgRes.ok) {
      const arrayBuffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      return NextResponse.json({
        success: true,
        imageUrl: `data:${contentType};base64,${base64}`,
        source: 'FLUX 8K Studio',
      });
    }

    // 3. Secondary Backup Service (if pollinations is slow)
    const backupUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=864&height=1080&seed=${seed}&nologo=true`;
    const backupRes = await fetch(backupUrl);
    if (backupRes.ok) {
      const arrayBuffer = await backupRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return NextResponse.json({
        success: true,
        imageUrl: `data:image/jpeg;base64,${base64}`,
        source: 'AI Editorial Studio',
      });
    }

    return NextResponse.json(
      { error: 'Generation service is momentarily busy. Please try again in 5 seconds.' },
      { status: 503 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Server Image Generation Error:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
