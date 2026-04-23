export type BlockType = 'HERO' | 'STATS' | 'NEWS' | 'TEXT_IMAGE';

export interface CMSBlock {
  id: string;
  type: BlockType;
  content: any; // Hier liegen die spezifischen Daten (Texte, Bilder)
}

// Beispiel für spezifische Content-Typen (erleichtert die Arbeit im Editor)
export interface HeroContent {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
}

export interface StatsContent {
  items: { label: string; value: string; icon?: string }[];
}