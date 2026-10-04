import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  X,
  Gauge,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ArabicTTS, TTSState } from '../utils/audio';

export const GlobalTTSBar: React.FC = () => {
  const [ttsState, setTtsState] = useState<TTSState>({
    isSpeaking: false,
    isPaused: false,
    isLoading: false,
    text: '',
    rate: 0.85,
    currentSentenceIndex: 0,
    totalSentences: 0,
  });

  useEffect(() => {
    const unsubscribe = ArabicTTS.subscribe((state) => {
      setTtsState(state);
    });
    return unsubscribe;
  }, []);

  const { isSpeaking, isPaused, isLoading, text, rate, currentSentenceIndex, totalSentences } = ttsState;

  if (!isSpeaking && !isPaused && !isLoading) return null;

  const handlePlayPause = () => {
    if (isLoading) return;
    if (isPaused) {
      ArabicTTS.resume();
    } else {
      ArabicTTS.pause();
    }
  };

  const handleStop = () => {
    ArabicTTS.stop();
  };

  const handleRateChange = (newRate: number) => {
    ArabicTTS.setRate(newRate);
  };

  return (
    <aside
      aria-label="مشغل القارئ الصوتي الميسّر"
      className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-40 max-w-xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-indigo-400/40 flex flex-col gap-2.5 animate-slideUp"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-xs">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Volume2 className="w-5 h-5 text-white animate-pulse" />
            )}
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">
                {isLoading
                  ? '⏳ جارِ تحضير الصوت فائق الوضوح...'
                  : isPaused
                  ? '⏸️ القراءة متوقفة مؤقتاً'
                  : '🔊 جارِ الاستماع الصوتي'}
              </span>
              {totalSentences > 1 && !isLoading && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                  فقرة {currentSentenceIndex + 1} من {totalSentences}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 truncate font-medium mt-0.5">
              {text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Speed toggle for learning support */}
          <button
            onClick={() => handleRateChange(rate === 0.75 ? 0.9 : rate === 0.9 ? 1.1 : 0.75)}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-indigo-200 rounded-xl text-xs font-semibold cursor-pointer border border-white/10"
            title="تغيير سرعة القراءة للتحكم بوضوح الصوت"
          >
            {rate === 0.75 ? '0.75x بطيء' : rate === 0.9 ? '0.9x ميسّر' : '1.1x عادي'}
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className={`p-2.5 rounded-xl font-bold cursor-pointer transition-colors shadow-xs ${
              isLoading
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : isPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
            }`}
            title={isLoading ? 'جارِ التحضير...' : isPaused ? 'استئناف القراءة' : 'إيقاف مؤقت'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPaused ? (
              <Play className="w-4 h-4 fill-current" />
            ) : (
              <Pause className="w-4 h-4 fill-current" />
            )}
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white font-bold cursor-pointer transition-colors"
            title="إيقاف نهائي"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Visual progress bar across sentences */}
      {totalSentences > 1 && !isLoading && (
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-indigo-400 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, ((currentSentenceIndex + 1) / totalSentences) * 100)}%` }}
          />
        </div>
      )}
    </aside>
  );
};
