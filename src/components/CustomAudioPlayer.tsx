"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface CustomAudioPlayerProps {
  src: string;
}

function audioBufferToWav(buffer: AudioBuffer) {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const result = new Float32Array(buffer.length);
  buffer.copyFromChannel(result, 0);
  
  const bufferLength = buffer.length;
  const wavBuffer = new ArrayBuffer(44 + bufferLength * 2);
  const view = new DataView(wavBuffer);
  
  const writeString = (v: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      v.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + bufferLength * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, bufferLength * 2, true);
  
  let offset = 44;
  for (let i = 0; i < bufferLength; i++) {
    let sample = Math.max(-1, Math.min(1, result[i]));
    sample = sample < 0 ? sample * 32768 : sample * 32767;
    view.setInt16(offset, sample, true);
    offset += 2;
  }
  
  return new Blob([view], { type: 'audio/wav' });
}

export default function CustomAudioPlayer({ src }: CustomAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fixedSrc, setFixedSrc] = useState(src);
  
  const [waveformData] = useState(() => {
    const bars = 40;
    return Array.from({ length: bars }, (_, i) => {
      const position = i / (bars - 1);
      const taper = Math.sin(position * Math.PI);
      const pseudoRandom = Math.abs(Math.sin(i * 13.9898 + 78.233)) * 60;
      const height = (20 + pseudoRandom) * taper + 15;
      return Math.min(100, Math.max(15, height));
    });
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const audio = audioRef.current;
      if (audio) {
        const dur = duration > 0 ? duration : (audio.duration && isFinite(audio.duration) ? audio.duration : 1);
        const current = audio.currentTime || 0;
        setCurrentTime(current);
        setProgress((current / dur) * 100);
        
        if (!audio.paused) {
          frameRef.current = requestAnimationFrame(updateProgress);
        }
      }
    };

    if (isPlaying) {
      frameRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    }
    
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audio) audio.currentTime = 0;
    };
    
    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);

    if (audio.readyState >= 1) {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
    };
  }, [fixedSrc]);

  // Safely fetch exact duration and convert to WAV to fix WebM seek bugs in Chrome
  useEffect(() => {
    let isMounted = true;
    let urlToRevoke = "";
    
    if (!src) return;

    const fixAudioFormat = async () => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        
        if (isMounted) {
          if (decoded.duration > 0) {
            setDuration(decoded.duration);
          }
          
          try {
            // Convert to WAV so Chrome's native audio element can seek perfectly!
            const wavBlob = audioBufferToWav(decoded);
            const wavUrl = URL.createObjectURL(wavBlob);
            urlToRevoke = wavUrl;
            setFixedSrc(wavUrl);
          } catch (e) {
            console.error("Wav conversion failed", e);
          }
        }
      } catch (err) {
        console.warn("Could not decode audio, relying on native fallback.", err);
      }
    };

    fixAudioFormat();

    return () => {
      isMounted = false;
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name !== 'AbortError') {
              console.error("Playback failed:", e);
            }
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const val = Number(e.target.value);
      // Use the exact duration we fetched via AudioContext if native is broken!
      const dur = duration > 0 ? duration : (audio.duration && isFinite(audio.duration) ? audio.duration : 0);
      
      if (dur > 0) {
        const newTime = (val / 100) * dur;
        try {
          audio.currentTime = newTime;
          setCurrentTime(newTime);
          setProgress(val);
        } catch (err) {
          console.error("Seek failed", err);
        }
      }
    }
  };

  return (
    <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-5 group hover:border-amber-500/30 transition-colors" dir="ltr">
      <audio ref={audioRef} src={fixedSrc} preload="auto" />
      
      {/* Play/Pause Button */}
      <button 
        type="button"
        onClick={togglePlay}
        className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black flex items-center justify-center transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 z-10 relative"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 fill-current" />
        ) : (
          <Play className="w-6 h-6 fill-current ml-1" />
        )}
      </button>

      {/* Waveform & Progress Container */}
      <div className="flex-1 flex flex-col gap-1 relative overflow-hidden py-1">
        {/* Fake Waveform */}
        <div className="h-10 flex items-center gap-[3px] w-full relative z-0">
          {waveformData.map((height, i) => {
            const isActive = (i / waveformData.length) * 100 <= progress;
            return (
              <div 
                key={i}
                className={`flex-1 rounded-full transition-colors duration-150 ${
                  isActive ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-white/20"
                }`}
                style={{ 
                  height: `${height}%`
                }}
              />
            );
          })}
        </div>

        {/* Seek Bar Overlay */}
        <input 
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-10"
        />

        {/* Timestamps */}
        <div className="flex justify-start text-[11px] text-white/50 font-mono mt-1 px-1">
          <span className="text-amber-500/80">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
