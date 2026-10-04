import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Volume2,
  Award,
  BookOpen,
  ChevronDown,
  Compass,
} from 'lucide-react';
import {
  LESSON_META,
  LESSON_OBJECTIVES,
  VOCABULARY_TERMS,
  VALUES_AND_ATTITUDES,
  WARMUP_DATA,
} from '../data/lessonData';
import { sounds, ArabicTTS } from '../utils/audio';
import { TTSControlBar } from './TTSControlBar';

// Path of generated hero image
const HERO_IMAGE_SRC = '/src/assets/images/hero_leadership_team_1791125163963.jpg';

interface HeroOverviewProps {
  completedObjectives: string[];
  onToggleObjective: (id: string) => void;
  onWarmupComplete: (answer: string) => void;
  savedWarmupAnswer: string;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  completedObjectives,
  onToggleObjective,
  onWarmupComplete,
  savedWarmupAnswer,
}) => {
  const [warmupInput, setWarmupInput] = useState(savedWarmupAnswer);
  const [isWarmupSubmitted, setIsWarmupSubmitted] = useState(!!savedWarmupAnswer);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleWarmupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warmupInput.trim()) return;
    sounds.playSuccess();
    setIsWarmupSubmitted(true);
    onWarmupComplete(warmupInput.trim());
  };

  const handleAddInspiration = (trait: string) => {
    sounds.playPop();
    const current = warmupInput ? `${warmupInput}، ${trait}` : trait;
    setWarmupInput(current);
  };

  const warmupFullText = `${WARMUP_DATA.title}. ${WARMUP_DATA.figure}. ${WARMUP_DATA.content}. ${WARMUP_DATA.prompt}`;

  return (
    <section id="overview" className="scroll-mt-20">
      {/* Title Header Banner styled authentically like the textbook page */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 mb-8 shadow-sm">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xl shadow-md border-2 border-white/20">
                1
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-lg text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                {LESSON_META.lessonNumber}
              </span>
              <span className="text-slate-300 text-xs font-medium">
                {LESSON_META.grade}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
              {LESSON_META.title}
            </h1>
            <p className="text-indigo-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              مهارة الحياة الأكثر تأثيرًا في بناء الشخصية، إلهام الفرق، وتحقيق النجاح المشترك.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 self-start md:self-auto">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-indigo-200">الزمن المقترح</div>
              <div className="text-sm font-bold text-white">{LESSON_META.duration}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual & Warmup + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Main Column: Visual + Warm-up Station (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual: Pawns Concept */}
          <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs group">
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              {!imgError ? (
                <img
                  src={HERO_IMAGE_SRC}
                  alt="مجموعة بيادق خشبية يقودها بيدق أحمر متميز يرمز للقيادة الإيجابية"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-slate-100 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">رمزية القيادة والعمل الجماعي</h4>
                  <p className="text-slate-500 text-sm max-w-sm mt-1">
                    القائد الحقيقي لا ينعزل عن فريقه، بل يسير في المقدمة ليضيء لهم الطريق بحماس وتواضع.
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-4 text-white">
                <span className="text-xs font-semibold text-amber-300 block mb-0.5">
                  تأمُّل بصري
                </span>
                <p className="text-xs sm:text-sm text-slate-100 leading-snug">
                  القائد في المقدمة يحدد الاتجاه، بينما يصطف الفريق في تناغم لتحقيق الهدف المشترك.
                </p>
              </div>
            </div>
          </div>

          {/* أتهيّأ Station (Warm-up) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                  🎯
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{WARMUP_DATA.title}</h3>
                  <span className="text-xs text-slate-500">{WARMUP_DATA.badge}</span>
                </div>
              </div>

              {/* TTS reader for warmup station */}
              <TTSControlBar
                text={warmupFullText}
                label="استمع لفقرة التهيؤ"
                variant="badge"
              />
            </div>

            {/* King Abdullah II leadership context */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">{WARMUP_DATA.figure}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {WARMUP_DATA.content}
              </p>
            </div>

            {/* Reflection question */}
            <form onSubmit={handleWarmupSubmit} className="space-y-4 pt-1">
              <label className="block text-sm font-semibold text-slate-900 leading-snug">
                {WARMUP_DATA.prompt}
              </label>

              {/* Quick inspiration chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-slate-500 ml-1">أفكار للإلهام:</span>
                {WARMUP_DATA.suggestedTraits.map((trait, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddInspiration(trait)}
                    className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-slate-200"
                  >
                    + {trait}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={warmupInput}
                  onChange={(e) => setWarmupInput(e.target.value)}
                  placeholder="اكتب الصفات القيادية التي تستلهمها من جلالة الملك (مثل: الرؤية، حب السلام، الحوار، تمكين الشباب)..."
                  rows={3}
                  className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  disabled={!warmupInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تأكيد الإجابة وحصد النقاط</span>
                </button>

                {isWarmupSubmitted && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    تم تسجيل إجابتك (+10 نقاط)
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Educational Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. الفكرة الرئيسة (Main Idea) with TTSControlBar */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border border-indigo-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>الفِكْرَةُ الرَّئِيسَةُ</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {LESSON_META.mainIdea}
            </p>

            <TTSControlBar
              text={`الفكرة الرئيسة: ${LESSON_META.mainIdea}`}
              label="استمع للفكرة الرئيسة"
              sublabel="تحكم بالسرعة والإيقاف لدعم ذوي صعوبات التعلم"
              variant="card"
            />
          </div>

          {/* 2. ماذا سأتعلم؟ (What will I learn?) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>ماذا سأتعلّم في هذا الدرس؟</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {completedObjectives.length} / {LESSON_OBJECTIVES.length} مكتمل
              </span>
            </div>

            <ul className="space-y-3">
              {LESSON_OBJECTIVES.map((obj) => {
                const isChecked = completedObjectives.includes(obj.id);
                return (
                  <li
                    key={obj.id}
                    onClick={() => onToggleObjective(obj.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors border ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                        : 'bg-slate-50/70 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-emerald-600 transition-transform active:scale-90"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={`text-xs sm:text-sm leading-snug block ${isChecked ? 'line-through text-slate-500' : 'font-medium'}`}>
                        {obj.text}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                        مستوى {obj.category}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. المفاهيم والمصطلحات (Vocabulary & Concepts) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>المَفاهِيمُ والمُصْطَلَحاتُ</span>
              <span className="text-xs font-normal text-slate-400">انقر للاستكشاف</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {VOCABULARY_TERMS.map((term) => {
                const isSelected = selectedTerm === term.termEn;
                return (
                  <button
                    key={term.termEn}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setSelectedTerm(isSelected ? null : term.termEn);
                    }}
                    className={`p-2.5 rounded-xl text-right transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{term.termAr}</span>
                    <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {term.termEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected term explanation pop-down with integrated TTS */}
            {selectedTerm && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-slate-800 space-y-2 text-xs leading-relaxed animate-fadeIn">
                {(() => {
                  const t = VOCABULARY_TERMS.find((x) => x.termEn === selectedTerm);
                  if (!t) return null;
                  const termFullText = `${t.termAr}، بالإنجليزية ${t.termEn}: ${t.definition}. مثال تطبيقي: ${t.example}`;
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <strong className="text-indigo-900 font-bold text-sm">
                          {t.termAr} ({t.termEn})
                        </strong>
                        <TTSControlBar
                          text={termFullText}
                          label="استمع"
                          variant="badge"
                        />
                      </div>
                      <p>{t.definition}</p>
                      <div className="pt-1 text-slate-600 border-t border-indigo-100">
                        <span className="font-semibold text-indigo-800">مثال تطبيقي:</span> {t.example}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* 4. القيم والاتجاهات (Values & Attitudes) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              القِيَمُ والاتِّجاهاتُ
            </h3>
            <div className="space-y-2.5">
              {VALUES_AND_ATTITUDES.map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {val.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

