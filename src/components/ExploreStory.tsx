import React, { useState } from 'react';
import {
  Compass,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowDownCircle,
  Play,
  Pause,
  Square,
} from 'lucide-react';
import { OMAR_STORY } from '../data/lessonData';
import { sounds, ArabicTTS } from '../utils/audio';
import { TTSControlBar } from './TTSControlBar';

// Path to generated wooden crafts image
const WOOD_CRAFTS_IMAGE = '/src/assets/images/lesson_wood_crafts_1791125175224.jpg';

interface ExploreStoryProps {
  onQuestionAnswered: (questionId: string, answer: string) => void;
  savedAnswers: Record<string, string>;
}

export const ExploreStory: React.FC<ExploreStoryProps> = ({
  onQuestionAnswered,
  savedAnswers,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [activeReadingParagraph, setActiveReadingParagraph] = useState<number | null>(null);
  const [imgError, setImgError] = useState(false);

  const fullStoryText = `${OMAR_STORY.title}. ${OMAR_STORY.initiativeTitle}. ${OMAR_STORY.paragraphs.join(' ')}`;

  const handleReadParagraph = (idx: number, text: string) => {
    if (activeReadingParagraph === idx && ArabicTTS.isSpeaking()) {
      ArabicTTS.pause();
    } else if (activeReadingParagraph === idx && ArabicTTS.isPaused()) {
      ArabicTTS.resume();
    } else {
      setActiveReadingParagraph(idx);
      ArabicTTS.speak(text, {
        rate: 0.85,
        onEnd: () => setActiveReadingParagraph(null),
        onError: () => setActiveReadingParagraph(null),
      });
    }
  };

  const handleStopParagraph = () => {
    ArabicTTS.stop();
    setActiveReadingParagraph(null);
  };

  const handleAnswerSubmit = (qId: string) => {
    if (!answers[qId]?.trim()) return;
    sounds.playSuccess();
    onQuestionAnswered(qId, answers[qId].trim());
    setRevealedAnswers((prev) => ({ ...prev, [qId]: true }));
  };

  const toggleHint = (qId: string) => {
    sounds.playPop();
    setShowHints((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleRevealModel = (qId: string) => {
    sounds.playPop();
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <section id="explore" className="scroll-mt-20 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shadow-xs">
            🔍
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              أَسْتَكْشِفُ: قِصَّةُ عُمَرَ ومُبادَرَتُهُ الإِبْداعيَّةُ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              استقصاء الحالة وتحليل السلوك القيادي في البيئة المدرسية
            </p>
          </div>
        </div>
      </div>

      {/* Primary TTS Controller for Omar's Story */}
      <TTSControlBar
        text={fullStoryText}
        label="القارئ الصوتي: استمع لقصة عُمَر كاملة"
        sublabel="أداة ميسّرة للتحكم بالتشغيل، الإيقاف المؤقت، وتعديل السرعة لمساندة الطلاب ذوي صعوبات التعلم"
        variant="card"
      />

      {/* Main Story Container with Image */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {/* Story Illustration */}
        <div className="relative aspect-16/9 md:aspect-21/9 overflow-hidden bg-slate-100 border-b border-slate-200">
          {!imgError ? (
            <img
              src={WOOD_CRAFTS_IMAGE}
              alt="مجسمات خشبية فنية صنعها الطالب عمر في ورشة النجارة"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 p-6 text-center">
              <Compass className="w-12 h-12 text-amber-600 mb-2" />
              <p className="text-sm font-semibold text-amber-900">
                مبادرة عمر: تحويل بقايا الخشب إلى تحف فنية
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex items-end p-6">
            <div className="text-white max-w-2xl">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-xs font-bold mb-2">
                {OMAR_STORY.initiativeTitle}
              </span>
              <h3 className="text-lg sm:text-xl font-bold leading-tight">
                عندما تتحول الفكرة البسيطة إلى مشروع قيادي يلهم المدرسة
              </h3>
            </div>
          </div>
        </div>

        {/* Narrative Paragraphs with Individual Audio Playback */}
        <div className="p-6 sm:p-8 space-y-4 text-slate-800 text-base sm:text-lg leading-relaxed bg-gradient-to-b from-white to-slate-50/50">
          {OMAR_STORY.paragraphs.map((p, idx) => {
            const isPlayingThis = activeReadingParagraph === idx && ArabicTTS.isSpeaking();
            const isPausedThis = activeReadingParagraph === idx && ArabicTTS.isPaused();

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl transition-all border ${
                  isPlayingThis || isPausedThis
                    ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-200'
                    : 'bg-transparent border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-justify flex-1 leading-relaxed">
                    {p}
                  </p>

                  {/* Accessible per-paragraph audio control */}
                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    <button
                      type="button"
                      onClick={() => handleReadParagraph(idx, p)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                        isPlayingThis
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : isPausedThis
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                      }`}
                      title={isPlayingThis ? 'إيقاف مؤقت' : isPausedThis ? 'متابعة الاستماع' : 'استمع لهذه الفقرة فقط'}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span className="hidden sm:inline">
                        {isPlayingThis ? 'مؤقت' : isPausedThis ? 'استئناف' : 'قراءة'}
                      </span>
                    </button>

                    {(isPlayingThis || isPausedThis) && (
                      <button
                        type="button"
                        onClick={handleStopParagraph}
                        className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer"
                        title="إيقاف القراءة"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inquiry Questions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>أَسْئِلَةُ الاسْتِكْشافِ والتَّحْليلِ (أجِبْ وفَكِّرْ كَقائِد):</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OMAR_STORY.questions.map((q, idx) => {
            return (
              <div
                key={q.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => ArabicTTS.speak(`السؤال: ${q.question}`)}
                        className="text-slate-400 hover:text-indigo-600 p-1"
                        title="استمع للسؤال بصوت واضح"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHint(q.id)}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>تلميح</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h4>

                  {showHints[q.id] && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-fadeIn">
                      💡 {q.hint}
                    </div>
                  )}

                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="اكتب إجابتك هنا بأسلوبك الخاص..."
                    rows={3}
                    className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleAnswerSubmit(q.id)}
                      disabled={!answers[q.id]?.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex-1"
                    >
                      تسجيل الإجابة
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleRevealModel(q.id)}
                      className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-lg transition-colors cursor-pointer"
                      title="عرض الإجابة النموذجية"
                    >
                      {revealedAnswers[q.id] ? 'إخفاء الحل' : 'الإجابة النموذجية'}
                    </button>
                  </div>

                  {revealedAnswers[q.id] && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 animate-fadeIn">
                      <div className="font-bold mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>الإجابة النموذجية:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => ArabicTTS.speak(q.modelAnswer)}
                          className="text-emerald-700 hover:text-emerald-900"
                          title="استمع للإجابة النموذجية"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="leading-relaxed">{q.modelAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* أستنتج Conclusion Box (Authentic from textbook) */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200 flex items-center gap-1">
                <ArrowDownCircle className="w-4 h-4" />
                أَسْتَنْتِجُ (خُلاصَةُ التَّعَلُّم)
              </span>
              <p className="text-base sm:text-xl font-bold leading-relaxed text-white">
                {OMAR_STORY.conclusion}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-auto">
            <TTSControlBar
              text={OMAR_STORY.conclusion}
              label="استمع للاستنتاج"
              sublabel=""
              variant="badge"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

