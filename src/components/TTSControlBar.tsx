import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ArabicTTS } from '../utils/audio';

interface TTSControlBarProps {
  text: string;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card' | 'badge';
  onPlayingChange?: (isPlaying: boolean, isPaused: boolean) => void;
  className?: string;
}

export const TTSControlBar: React.FC<TTSControlBarProps> = ({
  text,
  label = 'القارئ الصوتي الذكي',
  sublabel = 'اضغط للاستماع بنطق سليم واضح (للطلبة وذوي صعوبات التعلم)',
  size = 'md',
  variant = 'card',
  onPlayingChange,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState(0.85); // Default clear slow speed for learning support

  // Subscribe to TTS state changes to stay in sync
  useEffect(() => {
    const cleanTargetText = text.trim();
    const unsubscribe = ArabicTTS.subscribe((state) => {
      const cleanStateText = state.text.trim();
      const isThisActive =
        cleanStateText.length > 0 &&
        (cleanStateText === cleanTargetText ||
          cleanTargetText.startsWith(cleanStateText) ||
          cleanStateText.startsWith(cleanTargetText));

      setIsSpeaking(isThisActive && state.isSpeaking && !state.isPaused && !state.isLoading);
      setIsPaused(isThisActive && state.isPaused);
      setIsLoading(isThisActive && state.isLoading);
      onPlayingChange?.(
        isThisActive && state.isSpeaking && !state.isPaused,
        isThisActive && state.isPaused
      );
    });
    return unsubscribe;
  }, [text, onPlayingChange]);

  const handlePlay = () => {
    if (isPaused) {
      ArabicTTS.resume();
    } else {
      ArabicTTS.speak(text, {
        rate,
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
          setIsLoading(false);
        },
        onPause: () => {
          setIsSpeaking(false);
          setIsPaused(true);
        },
        onResume: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setIsLoading(false);
        },
        onError: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setIsLoading(false);
        },
      });
    }
  };

  const handlePause = () => {
    ArabicTTS.pause();
    setIsSpeaking(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    ArabicTTS.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoading(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    ArabicTTS.setRate(newRate);
  };

  const isActive = isSpeaking || isPaused || isLoading;

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs ${className}`}>
        {!isActive ? (
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors cursor-pointer"
            title="تشغيل القراءة الصوتية"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{label}</span>
          </button>
        ) : (
          <>
            {isLoading ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>تحضير الصوت...</span>
              </span>
            ) : isSpeaking ? (
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors cursor-pointer"
                title="إيقاف مؤقت"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف مؤقت</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                title="استئناف القراءة"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>متابعة</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStop}
              className="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer"
              title="إيقاف نهائي"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl transition-all border ${
        isActive
          ? 'bg-gradient-to-l from-indigo-50/90 via-white to-purple-50/80 border-indigo-300 shadow-sm'
          : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
      } p-3.5 sm:p-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Label & Sound wave animation */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isLoading
                ? 'bg-indigo-100 text-indigo-600'
                : isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isActive ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                {label}
              </span>
              {isLoading && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  جارِ تحضير الصوت عالي الجودة...
                </span>
              )}
              {isSpeaking && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  جارِ الاستماع...
                </span>
              )}
              {isPaused && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  متوقف مؤقتاً
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              {sublabel}
            </p>
          </div>
        </div>

        {/* Action Controls Group: Play / Pause / Stop / Speed */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
          {/* Main Play / Pause Button */}
          {!isActive ? (
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل الصوت</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {isLoading ? (
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>تحضير الصوت...</span>
                </button>
              ) : isSpeaking ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>إيقاف مؤقت</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>متابعة</span>
                </button>
              )}

              {/* Stop button */}
              <button
                type="button"
                onClick={handleStop}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                title="إيقاف نهائي وإعادة للبداية"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">إيقاف</span>
              </button>
            </div>
          )}

          {/* Reading Speed Selector for Learning Support */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs text-slate-600">
            <span className="text-[10px] text-slate-400 px-1.5 hidden md:inline">السرعة:</span>
            {[
              { val: 0.75, label: '0.75x بطيء' },
              { val: 0.9, label: '0.9x ميسّر' },
              { val: 1.1, label: '1.1x عادي' },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => handleRateChange(s.val)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  rate === s.val
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
                title={`ضبط سرعة القراءة إلى ${s.label}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
