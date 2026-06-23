export interface SceneConfig {
  id: number;
  title: string;
  triggerStart: number;
  triggerEnd: number;
  audioTrack: string;
  description: string;
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export interface EntryPointProps {
  onEnter: () => void;
}

export interface ScrollProgressProps {
  progress: number;
  currentScene: number;
  scenes: SceneConfig[];
}

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  currentScene: number;
  volume: number;
}

export interface AudioContextType {
  audioState: AudioState;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  crossfadeToScene: (sceneId: number) => void;
  initAudio: () => void;
}

export const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "آغاز مسیر",
    triggerStart: 0,
    triggerEnd: 0.15,
    audioTrack: "/assets/audio/desert_wind.mp3",
    description: "سفر از اینجا آغاز می‌شود...",
  },
  {
    id: 2,
    title: "کاروان",
    triggerStart: 0.15,
    triggerEnd: 0.3,
    audioTrack: "/assets/audio/caravan_bells.mp3",
    description: "کاروان عشق در بیابان حرکت می‌کند",
  },
  {
    id: 3,
    title: "عطش",
    triggerStart: 0.3,
    triggerEnd: 0.45,
    audioTrack: "/assets/audio/water_drop.mp3",
    description: "تشنگی، آزمونی برای صبر و ایستادگی",
  },
  {
    id: 4,
    title: "برادری",
    triggerStart: 0.45,
    triggerEnd: 0.6,
    audioTrack: "/assets/audio/epic_tension.mp3",
    description: "پیوندی فراتر از خون، عهدی برای ابدیت",
  },
  {
    id: 5,
    title: "شجاعت",
    triggerStart: 0.6,
    triggerEnd: 0.75,
    audioTrack: "/assets/audio/sword_draw.mp3",
    description: "شمشیر حق در برابر باطل",
  },
  {
    id: 6,
    title: "وداع",
    triggerStart: 0.75,
    triggerEnd: 0.9,
    audioTrack: "/assets/audio/sorrow_vocals.mp3",
    description: "آخرین نگاه، آخرین کلام",
  },
  {
    id: 7,
    title: "جاودانگی",
    triggerStart: 0.9,
    triggerEnd: 1,
    audioTrack: "/assets/audio/ambient_resolve.mp3",
    description: "حسین(ع) زنده است و زنده خواهد ماند",
  },
];
