export type BackgroundStyle = 'dark-cinematic' | 'organic-earth';

export type BasePedestal = 
  | 'travertine'
  | 'dark-wood'
  | 'ceramic'
  | 'light-oak'
  | 'terracotta'
  | 'raw-stone';

export type TypographyStyle = 
  | 'brush'       // Style 1: Brush Strokes / Artistic Brush (off-white & light-gold, visible bristle textures, 3D shading)
  | 'fluid'       // Style 2: Fluid / Liquid (rich dark-brown & warm gold tones, smooth organic curves)
  | 'handwritten'; // Style 3: Handwritten / হাতে আঁকা (artisanal calligraphy, flourishes, swooshes)

export interface BrandPreset {
  id: string;
  name: string;
  style: BackgroundStyle;
  typography: TypographyStyle;
  defaultBase: BasePedestal;
  description: string;
}

export interface PostCaption {
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullText: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  type: 'cover' | 'detail' | 'story' | 'order';
  imageSrc?: string;
}
