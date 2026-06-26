"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { submitMemory } from "@/utils/memoriesClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, CheckCircle, AlertCircle, Mic, Square, Trash2 } from "lucide-react";
import CustomAudioPlayer from "./CustomAudioPlayer";

export default function MemoriesForm() {
  const { t } = useTranslation();
  const { language, dir } = useLanguage();
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Max 60 seconds
  const MAX_RECORDING_TIME = 60;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setStatus({ type: 'error', message: "لطفاً دسترسی به میکروفون را فعال کنید." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus(null);
    formData.append("language", language);
    
    if (audioBlob) {
      formData.append("audio", audioBlob, "voice.webm");
    }
    
    try {
      const result = await submitMemory(formData);
      
      if (result?.error) {
        setStatus({ type: 'error', message: result.error });
      } else if (result?.success) {
        const trackingText = language === 'fa' 
          ? ` کد پیگیری شما: ${result.trackingCode}` 
          : language === 'ar' 
            ? ` رمز المتابعة الخاص بك: ${result.trackingCode}`
            : ` Your tracking code: ${result.trackingCode}`;
            
        setStatus({ type: 'success', message: t('ui.memorySubmittedSuccess') + trackingText });
        formRef.current?.reset();
        deleteRecording();
      }
    } catch (err) {
      setStatus({ type: 'error', message: t('ui.memorySubmitError') });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/10 blur-[100px] pointer-events-none" />
      
      <h3 className="text-2xl font-black text-white mb-2">{t('ui.writeYourMemory')}</h3>
      <p className="text-white/60 text-sm mb-6">{t('ui.writeYourMemoryDesc')}</p>

      <form ref={formRef} action={handleSubmit} className="relative z-10 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
            {t('ui.yourName')} <span className="text-white/40 text-xs">({t('ui.optional')})</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={t('ui.namePlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-2 flex justify-between items-center">
            <span>{t('ui.yourMemory')}</span>
            <span className="text-xs text-white/40">{t('ui.voiceOptional')}</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            placeholder={t('ui.memoryPlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none custom-scrollbar"
          />
        </div>

        {/* Audio Recording UI */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
          {!isRecording && !audioUrl && (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-full transition-colors"
            >
              <Mic className="w-5 h-5" />
              <span className="font-medium text-sm">{t('ui.recordVoice')}</span>
            </button>
          )}

          {isRecording && (
            <div className="flex items-center w-full justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-mono text-sm">{formatTime(recordingTime)}</span>
              </div>
              
              {/* Fake Audio Waveform for visuals */}
              <div className="flex-1 flex items-center justify-center gap-1 h-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 bg-red-500 rounded-full animate-wave" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>

              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full transition-colors shrink-0"
              >
                <Square className="w-4 h-4" fill="currentColor" />
                <span className="font-medium text-sm">{t('ui.stopRecording')}</span>
              </button>
            </div>
          )}

          {audioUrl && !isRecording && (
            <div className="w-full flex flex-col gap-2 relative">
              <CustomAudioPlayer src={audioUrl} />
              <button
                type="button"
                onClick={deleteRecording}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 z-20"
                title={t('ui.deleteVoice')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {status && (
          <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="text-sm font-medium leading-relaxed">{status.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
        >
          {isPending ? (
            <span className="animate-pulse">{t('ui.submitting')}</span>
          ) : (
            <>
              <span>{t('ui.submitMemory')}</span>
              <Send className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
