import ashura from './ashura.json';
import warith from './warith.json';

export interface ZiyaratVerse {
  arabic: string;
  fa: string;
  en: string;
  ar: string;
}

export interface ZiyaratAudio {
  fa: string;
  en: string;
  ar: string;
}

export interface Ziyarat {
  id: string;
  titleKey: string;
  descriptionKey: string;
  audio?: ZiyaratAudio;
  verses: ZiyaratVerse[];
}

export const ziyarats: Ziyarat[] = [
  ashura as Ziyarat,
  warith as Ziyarat
];
