/**
 * Audio Manager — Howler.js wrapper for scene-based audio
 * Creates synthetic ambient tones as placeholders.
 * Preloads only Scene 1 & 2; lazy loads the rest.
 */

interface AudioTrack {
  sceneId: number;
  oscillator: OscillatorNode | null;
  gainNode: GainNode | null;
  isLoaded: boolean;
}

// Each scene gets a unique ambient frequency/character
const SCENE_AUDIO_CONFIG: Record<
  number,
  { frequency: number; type: OscillatorType; detune: number }
> = {
  1: { frequency: 80, type: "sine", detune: 0 }, // Deep wind drone
  2: { frequency: 120, type: "triangle", detune: -5 }, // Caravan bells feel
  3: { frequency: 200, type: "sine", detune: 10 }, // Water drop shimmer
  4: { frequency: 150, type: "sawtooth", detune: -10 }, // Epic tension
  5: { frequency: 100, type: "square", detune: 5 }, // Sword metallic
  6: { frequency: 90, type: "sine", detune: -15 }, // Sorrowful drone
  7: { frequency: 220, type: "triangle", detune: 0 }, // Ambient resolve
};

class AudioManager {
  private audioContext: AudioContext | null = null;
  private tracks: Map<number, AudioTrack> = new Map();
  private masterGain: GainNode | null = null;
  private currentScene: number = 0;
  private isInitialized: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.3;

  init(): void {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);
      this.isInitialized = true;

      // Preload scenes 1 and 2
      this.loadScene(1);
      this.loadScene(2);
    } catch (e) {
      console.warn("Audio initialization failed:", e);
    }
  }

  private loadScene(sceneId: number): void {
    if (!this.audioContext || !this.masterGain) return;
    if (this.tracks.has(sceneId)) return;

    const config = SCENE_AUDIO_CONFIG[sceneId];
    if (!config) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = config.type;
    oscillator.frequency.value = config.frequency;
    oscillator.detune.value = config.detune;

    // Add subtle modulation for a more ambient feel
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = 0.3 + Math.random() * 0.5;
    lfoGain.gain.value = config.frequency * 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();

    gainNode.gain.value = 0;
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    oscillator.start();

    this.tracks.set(sceneId, {
      sceneId,
      oscillator,
      gainNode,
      isLoaded: true,
    });
  }

  crossfadeToScene(sceneId: number): void {
    if (!this.audioContext || !this.isInitialized) return;
    if (sceneId === this.currentScene) return;

    // Lazy load if not already loaded
    if (!this.tracks.has(sceneId)) {
      this.loadScene(sceneId);
    }
    // Preload next scene
    if (!this.tracks.has(sceneId + 1) && sceneId < 7) {
      this.loadScene(sceneId + 1);
    }

    const fadeTime = 1.5;
    const now = this.audioContext.currentTime;

    // Fade out current
    if (this.currentScene > 0) {
      const currentTrack = this.tracks.get(this.currentScene);
      if (currentTrack?.gainNode) {
        currentTrack.gainNode.gain.cancelScheduledValues(now);
        currentTrack.gainNode.gain.setValueAtTime(
          currentTrack.gainNode.gain.value,
          now
        );
        currentTrack.gainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
      }
    }

    // Fade in new
    const newTrack = this.tracks.get(sceneId);
    if (newTrack?.gainNode) {
      newTrack.gainNode.gain.cancelScheduledValues(now);
      newTrack.gainNode.gain.setValueAtTime(0, now);
      newTrack.gainNode.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : 0.15,
        now + fadeTime
      );
    }

    this.currentScene = sceneId;
  }

  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.audioContext.currentTime
      );
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : this.volume,
        now + 0.3
      );
    }
    return this.isMuted;
  }

  play(): void {
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  pause(): void {
    if (this.audioContext?.state === "running") {
      this.audioContext.suspend();
    }
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  destroy(): void {
    this.tracks.forEach((track) => {
      track.oscillator?.stop();
      track.oscillator?.disconnect();
      track.gainNode?.disconnect();
    });
    this.tracks.clear();
    this.masterGain?.disconnect();
    this.audioContext?.close();
    this.isInitialized = false;
  }
}

// Singleton
let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}

export default AudioManager;
