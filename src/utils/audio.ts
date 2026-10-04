/**
 * Advanced Arabic Text-to-Speech Engine
 * Powered by Gemini 3.8 Flash Lite TTS with HTML5 Audio Playback & Browser SpeechSynthesis Fallback.
 * Built specifically for Arabic educational lessons and accessibility for students with learning difficulties.
 */

export interface TTSOptions {
  rate?: number; // 0.75 (slow / learning support), 0.9 (recommended), 1.1 (normal)
  pitch?: number;
  voice?: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (err: unknown) => void;
  onSentenceChange?: (sentenceIndex: number, sentenceText: string) => void;
  onBoundary?: (charIndex: number) => void;
}

export interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  text: string;
  rate: number;
  currentSentenceIndex: number;
  totalSentences: number;
  errorMessage?: string | null;
}

export class ArabicTTS {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;

  private static activeAudioElement: HTMLAudioElement | null = null;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static activeText: string = '';
  private static currentRate: number = 0.85;
  private static isPausedState: boolean = false;
  private static isSpeakingState: boolean = false;
  private static isLoadingState: boolean = false;
  private static errorMessage: string | null = null;
  private static currentSentenceIdx: number = 0;
  private static sentences: string[] = [];
  private static listeners: Set<(state: TTSState) => void> = new Set();
  private static sentenceTimer: number | null = null;
  private static abortController: AbortController | null = null;
  private static clientAudioCache: Map<string, string> = new Map();

  // Initialize
  static init() {
    if (typeof window === 'undefined') return;
    // Pre-warm audio context on first interaction if possible
    window.addEventListener(
      'click',
      () => {
        sounds.warmup();
      },
      { once: true }
    );
  }

  static subscribe(cb: (state: TTSState) => void) {
    this.listeners.add(cb);
    // Send immediate initial state
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  static getState(): TTSState {
    return {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      isLoading: this.isLoadingState,
      text: this.activeText,
      rate: this.currentRate,
      currentSentenceIndex: this.currentSentenceIdx,
      totalSentences: this.sentences.length,
      errorMessage: this.errorMessage,
    };
  }

  private static notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch {
        // ignore
      }
    });
  }

  private static splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?؟\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Speak Arabic text with full controls
   */
  static async speak(text: string, options: TTSOptions = {}) {
    if (typeof window === 'undefined') return;

    const cleanText = text.trim();
    if (!cleanText) return;

    // Reset previous playback
    this.stop();

    this.activeText = cleanText;
    this.currentRate = options.rate ?? this.currentRate ?? 0.85;
    this.sentences = this.splitIntoSentences(cleanText);
    this.currentSentenceIdx = 0;
    this.isLoadingState = true;
    this.isSpeakingState = true;
    this.isPausedState = false;
    this.errorMessage = null;
    this.notify();

    // Abort any ongoing fetch
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    // Step 1: Check Client-side Cache
    const cacheKey = `${options.voice || 'Kore'}_${cleanText}`;
    if (this.clientAudioCache.has(cacheKey)) {
      const cachedDataUrl = this.clientAudioCache.get(cacheKey)!;
      this.playHtmlAudio(cachedDataUrl, options);
      return;
    }

    // Step 2: Try Server-side High-Fidelity Gemini TTS
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice: options.voice || 'Kore',
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS server returned status ${response.status}`);
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audio data in server response');
      }

      const audioDataUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      this.clientAudioCache.set(cacheKey, audioDataUrl);

      // Play audio via HTML5 Audio
      this.playHtmlAudio(audioDataUrl, options);
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.warn('Server TTS failed or unavailable, using Web Speech API fallback:', err);
      // Step 3: Fallback to Web Speech API
      this.fallbackWebSpeech(cleanText, options);
    }
  }

  /**
   * Play studio-grade WAV speech audio via HTML5 Audio element
   */
  private static playHtmlAudio(audioSrc: string, options: TTSOptions) {
    try {
      this.cleanupAudio();

      const audio = new Audio(audioSrc);
      this.activeAudioElement = audio;
      audio.playbackRate = this.currentRate;

      audio.onloadeddata = () => {
        this.isLoadingState = false;
        this.isSpeakingState = true;
        this.isPausedState = false;
        this.notify();
        options.onStart?.();

        // Start progressive sentence highlight simulation based on duration
        this.startSentenceTracking(audio.duration || 10, options);
      };

      audio.onplay = () => {
        this.isLoadingState = false;
        this.isSpeakingState = true;
        this.isPausedState = false;
        this.notify();
        options.onResume?.();
      };

      audio.onpause = () => {
        // If it wasn't intentionally ended
        if (!audio.ended) {
          this.isSpeakingState = false;
          this.isPausedState = true;
          this.notify();
          options.onPause?.();
        }
      };

      audio.onended = () => {
        this.cleanup();
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.isLoadingState = false;
        this.notify();
        options.onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('HTML5 Audio playback error:', e);
        this.fallbackWebSpeech(this.activeText, options);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Auto-play was prevented or audio failed to start:', err);
          // Try Web Speech API fallback
          this.fallbackWebSpeech(this.activeText, options);
        });
      }
    } catch (err) {
      console.warn('Error initializing HTML5 audio:', err);
      this.fallbackWebSpeech(this.activeText, options);
    }
  }

  /**
   * Web Speech API Fallback
   */
  private static fallbackWebSpeech(text: string, options: TTSOptions) {
    if (!this.synth) {
      this.isLoadingState = false;
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.errorMessage = 'عذراً، محرك الصوت غير متوفر في متصفحك الحالي.';
      this.notify();
      options.onError?.(new Error('No speech synthesis available'));
      return;
    }

    try {
      this.cleanupAudio();
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;

      utterance.rate = this.currentRate;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.lang = 'ar-SA';

      // Look for Arabic voice
      const voices = this.synth.getVoices();
      const arVoice =
        voices.find((v) => v.lang === 'ar-SA') ||
        voices.find((v) => v.lang.startsWith('ar')) ||
        voices.find(
          (v) =>
            v.name.toLowerCase().includes('arabic') ||
            v.name.toLowerCase().includes('tarik') ||
            v.name.toLowerCase().includes('maged')
        );

      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onstart = () => {
        this.isLoadingState = false;
        this.isSpeakingState = true;
        this.isPausedState = false;
        this.notify();
        options.onStart?.();

        const wordsCount = text.split(/\s+/).length;
        const estimatedSeconds = (wordsCount / (120 * this.currentRate)) * 60;
        this.startSentenceTracking(estimatedSeconds, options);
      };

      utterance.onpause = () => {
        this.isSpeakingState = false;
        this.isPausedState = true;
        this.notify();
        options.onPause?.();
      };

      utterance.onresume = () => {
        this.isSpeakingState = true;
        this.isPausedState = false;
        this.notify();
        options.onResume?.();
      };

      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex);
      };

      utterance.onend = () => {
        this.cleanup();
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.isLoadingState = false;
        this.notify();
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        this.cleanup();
        this.isLoadingState = false;
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.errorMessage = 'تعذر تشغيل الصوت من خلال المتصفح.';
        this.notify();
        options.onError?.(e);
      };

      this.synth.speak(utterance);
    } catch (err) {
      this.cleanup();
      this.isLoadingState = false;
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.errorMessage = 'حدث خطأ أثناء تشغيل الصوت.';
      this.notify();
      options.onError?.(err);
    }
  }

  private static startSentenceTracking(totalDurationSec: number, options: TTSOptions) {
    if (this.sentences.length <= 1) return;

    if (this.sentenceTimer) {
      clearInterval(this.sentenceTimer);
      this.sentenceTimer = null;
    }

    const intervalMs = Math.max(
      1500,
      ((totalDurationSec * 1000) / this.sentences.length) * 0.95
    );

    let idx = 0;
    this.sentenceTimer = window.setInterval(() => {
      if (!this.isSpeakingState || this.isPausedState) return;

      idx++;
      if (idx < this.sentences.length) {
        this.currentSentenceIdx = idx;
        this.notify();
        options.onSentenceChange?.(idx, this.sentences[idx]);
      } else {
        if (this.sentenceTimer) {
          clearInterval(this.sentenceTimer);
          this.sentenceTimer = null;
        }
      }
    }, intervalMs);
  }

  static pause() {
    this.isPausedState = true;
    this.isSpeakingState = false;

    if (this.activeAudioElement) {
      try {
        this.activeAudioElement.pause();
      } catch {
        // ignore
      }
    } else if (this.synth && this.synth.speaking) {
      try {
        this.synth.pause();
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  static resume() {
    this.isPausedState = false;
    this.isSpeakingState = true;

    if (this.activeAudioElement) {
      try {
        this.activeAudioElement.play();
      } catch {
        // ignore
      }
    } else if (this.synth && this.synth.paused) {
      try {
        this.synth.resume();
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  static stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.cleanupAudio();

    this.isSpeakingState = false;
    this.isPausedState = false;
    this.isLoadingState = false;
    this.activeText = '';
    this.currentSentenceIdx = 0;
    this.sentences = [];
    this.errorMessage = null;

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }

    this.notify();
  }

  private static cleanupAudio() {
    if (this.sentenceTimer) {
      clearInterval(this.sentenceTimer);
      this.sentenceTimer = null;
    }

    if (this.activeAudioElement) {
      try {
        this.activeAudioElement.pause();
        this.activeAudioElement.src = '';
        this.activeAudioElement = null;
      } catch {
        // ignore
      }
    }

    this.activeUtterance = null;
  }

  private static cleanup() {
    this.cleanupAudio();
  }

  static setRate(newRate: number) {
    this.currentRate = newRate;
    if (this.activeAudioElement) {
      this.activeAudioElement.playbackRate = newRate;
      this.notify();
    } else if (this.isSpeakingState && this.activeText) {
      this.speak(this.activeText, { rate: newRate });
    } else {
      this.notify();
    }
  }

  static getRate(): number {
    return this.currentRate;
  }

  static isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  static isPaused(): boolean {
    return this.isPausedState;
  }

  static isLoading(): boolean {
    return this.isLoadingState;
  }

  static getActiveText(): string {
    return this.activeText;
  }
}

// Auto-initialize voice engine on module load
if (typeof window !== 'undefined') {
  ArabicTTS.init();
}

/**
 * Sound effects for educational gamification
 */
class SoundEffects {
  private ctx: AudioContext | null = null;

  warmup() {
    try {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch {
      // ignore
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  playError() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  playPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }
}

export const sounds = new SoundEffects();
