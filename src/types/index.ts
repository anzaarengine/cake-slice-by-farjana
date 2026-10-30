export type ImageStyleKey = 
  | 'organic-earth' 
  | 'dark-cinematic' 
  | 'nordic-minimal' 
  | 'moody-espresso' 
  | 'creamy-limestone' 
  | 'terracotta-twilight' 
  | 'midnight-obsidian' 
  | 'mineral-slate' 
  | 'desert-sand' 
  | 'velvet-charcoal'
  | string;

export type TypoStyleKey = 
  | 'brush' 
  | 'fluid' 
  | 'handwritten' 
  | 'minimal' 
  | '3d_modern' 
  | 'kinetic' 
  | 'curves' 
  | 'folk_fusion' 
  | 'neon' 
  | 'calligraphy_royal' 
  | 'futuristic' 
  | 'cinematic_drama' 
  | 'dhrupodi_classic' 
  | 'alpona_folk' 
  | 'retro_vintage'
  | string;

export type AspectRatioKey = '4:5' | '9:16' | '1:1';

export type BasePedestalKey = 
  | 'auto'
  | 'dark-wood'
  | 'travertine'
  | 'ceramic'
  | 'light-oak'
  | 'terracotta'
  | 'slate-stone';

// Aliases for compatibility
export type BackgroundStyle = ImageStyleKey;
export type TypographyStyle = TypoStyleKey;
export type BasePedestal = BasePedestalKey;

export interface PromptConfig {
  headline: string;
  imageStyle: ImageStyleKey;
  typoStyle: TypoStyleKey;
  ratio: AspectRatioKey;
  basePedestal?: BasePedestalKey;
  brandOption?: 'none' | 'subtle' | 'full';
  textSizeOption?: 'refined' | 'medium' | 'large';
  generatedPrompt: string;
  createdAt: string;
}
