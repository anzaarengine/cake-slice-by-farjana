export type ImageStyleKey = 'organic-earth' | 'dark-cinematic';
export type TypoStyleKey = 'fluid' | 'brush' | 'handwritten';
export type AspectRatioKey = '4:5' | '9:16' | '1:1';

// Aliases for compatibility
export type BackgroundStyle = ImageStyleKey;
export type TypographyStyle = TypoStyleKey;

export type BasePedestal = 
  | 'travertine'
  | 'dark-wood'
  | 'ceramic'
  | 'light-oak'
  | 'terracotta'
  | 'raw-stone';

export interface PromptConfig {
  headline: string;
  imageStyle: ImageStyleKey;
  typoStyle: TypoStyleKey;
  ratio: AspectRatioKey;
  generatedPrompt: string;
  createdAt: string;
}
