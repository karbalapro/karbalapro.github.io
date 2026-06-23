"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { getAudioManager } from "@/lib/audioManager";
import { AudioContextType, AudioState } from "@/lib/types";

const AudioCtx = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isMuted: false,
    currentScene: 0,
    volume: 0.3,
  });

  const managerRef = useRef(getAudioManager());

  const initAudio = useCallback(() => {
    managerRef.current.init();
    managerRef.current.play();
    setAudioState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const play = useCallback(() => {
    managerRef.current.play();
    setAudioState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    managerRef.current.pause();
    setAudioState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const toggleMute = useCallback(() => {
    const isMuted = managerRef.current.toggleMute();
    setAudioState((prev) => ({ ...prev, isMuted }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    managerRef.current.setVolume(volume);
    setAudioState((prev) => ({ ...prev, volume }));
  }, []);

  const crossfadeToScene = useCallback((sceneId: number) => {
    managerRef.current.crossfadeToScene(sceneId);
    setAudioState((prev) => ({ ...prev, currentScene: sceneId }));
  }, []);

  useEffect(() => {
    return () => {
      managerRef.current.destroy();
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{
        audioState,
        play,
        pause,
        toggleMute,
        setVolume,
        crossfadeToScene,
        initAudio,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
