import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  LEADERSHIP_DEFINITION,
  LEADERSHIP_SKILLS,
} from '../data/lessonData';
import { sounds, ArabicTTS } from '../utils/audio';
import { TTSControlBar } from './TTSControlBar';

interface ReadAndLearnProps {
  onCheckPassed: () => void;
  isCheckCompleted: boolean;
}

export const ReadAndLearn: React.FC<ReadAndLearnProps> = ({
  onCheckPassed,
  isCheckCompleted,
}) => {
  const [activeSkillId, setActiveSkillId] = useState<string>('decision-making');
  const [checkInput, setCheckInput] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(isCheckCompleted);

  const activeSkill =
    LEADERSHIP_SKILLS.find((s) => s.id === activeSkillId) ||
    LEADERSHIP_SKILLS[0];

  const handleCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInput.trim()) return;
    sounds.playSuccess();
    setShowModelAnswer(true);
    onCheckPassed();
  };

  const activeSkillFullText = `${activeSkill.title}. ${activeSkill.description}. تطبيق واقعي: ${activeSkill.application}`;

  return (
    <section id="learn" className="scroll-mt-20 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-xs">
            📖
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              أَقْرَأُ وأَتَعَلَّمُ: مَفْهُومُ القِيادَةِ ومَهاراتُها النّاجِحَةُ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              تفكيك مفهوم القيادة المعاصر واستكشاف مهارات التأثير الفعّال
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Concept Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-extrabold uppercase">
              {LEADERSHIP_DEFINITION.concept}
            </span>
            <span className="text-xs font-mono text-slate-400">Leadership Concept</span>
          </div>

          <TTSControlBar
            text={LEADERSHIP_DEFINITION.text}
            label="استمع لتعريف القيادة"
            sublabel="التحكم بالصوت وسرعة الإلقاء لدعم الفهم"
            variant="badge"
          />
        </div>

        <p className="text-base sm:text-xl font-medium text-slate-800 leading-relaxed text-justify">
          {LEADERSHIP_DEFINITION.text}
        </p>

        {/* أتحقّق Box from the textbook */}
        <div className="rounded-xl bg-slate-50 border-2 border-dashed border-indigo-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>أَتَحَقَّقُ: {LEADERSHIP_DEFINITION.checkQuestion}</span>
            </div>
            {isCheckCompleted && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                تم التحقق (+10 نقاط)
              </span>
            )}
          </div>

          <form onSubmit={handleCheckSubmit} className="space-y-3">
            <input
              type="text"
              value={checkInput}
              onChange={(e) => setCheckInput(e.target.value)}
              placeholder="اكتب تعريف القيادة بأسلوبك الخاص للتحقق من استيعابك..."
              className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 p-3 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!checkInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                تأكيد الإجابة
              </button>
              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                {showModelAnswer ? 'إخفاء الإجابة النموذجية' : 'كشف الإجابة النموذجية'}
              </button>
            </div>
          </form>

          {showModelAnswer && (
            <div className="p-4 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1 animate-fadeIn">
              <div className="font-bold flex items-center justify-between text-emerald-700">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>الإجابة النموذجية من المنهاج:</span>
                </div>
                <button
                  type="button"
                  onClick={() => ArabicTTS.speak(LEADERSHIP_DEFINITION.checkAnswer)}
                  className="text-emerald-700 hover:text-emerald-900"
                  title="استمع للإجابة النموذجية"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="leading-relaxed">{LEADERSHIP_DEFINITION.checkAnswer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Leadership Skills Section (The Fan / Arch Diagram) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-1">
            مَهاراتُ القِيادَةِ النّاجِحَةِ
          </span>
          <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
            تشتملُ القيادةُ على مهاراتٍ عديدة، انقر على كل مهارة لاستكشافها والاستماع لشرحها:
          </h3>
        </div>

        {/* Interactive Arch Diagram & Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Fan Diagram representation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4">
            {/* 4 Interactive Arc Segments */}
            <div className="relative w-72 h-36 sm:w-88 sm:h-44 flex items-end justify-center">
              {/* Central hub */}
              <div className="absolute -bottom-4 z-20 w-32 h-16 bg-white border-2 border-slate-300 rounded-t-full flex items-center justify-center text-center shadow-md">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  مهاراتُ<br />القيادةِ الناجحة
                </span>
              </div>

              {/* Fan Sectors styled as clickable semi-circular petals */}
              <div className="grid grid-cols-4 w-full h-full gap-2 items-end pb-4">
                {LEADERSHIP_SKILLS.map((skill, idx) => {
                  const isActive = activeSkillId === skill.id;
                  const bgColors = [
                    'bg-blue-500 hover:bg-blue-600',
                    'bg-amber-400 hover:bg-amber-500',
                    'bg-rose-500 hover:bg-rose-600',
                    'bg-emerald-500 hover:bg-emerald-600',
                  ];

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setActiveSkillId(skill.id);
                      }}
                      className={`relative flex flex-col items-center justify-center text-white font-bold p-3 transition-all duration-300 cursor-pointer shadow-sm rounded-t-2xl ${
                        bgColors[idx % 4]
                      } ${
                        isActive
                          ? 'scale-105 -translate-y-2 ring-4 ring-offset-2 ring-indigo-500 z-10'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{ height: `${90 + (idx % 2 === 0 ? 15 : 0)}%` }}
                    >
                      <span className="text-xs sm:text-sm text-center leading-tight">
                        {skill.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <span className="text-xs text-slate-400 mt-6 block text-center">
              (مخطط مروحة المهارات الأربع المعتمد في المنهاج المدرسي)
            </span>
          </div>

          {/* Interactive Skill Detail Card with Integrated TTS Control */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  <h4 className="text-lg font-bold text-slate-900">
                    {activeSkill.title}
                  </h4>
                </div>

                <TTSControlBar
                  text={activeSkillFullText}
                  label="استمع للشرح والتطبيق"
                  variant="badge"
                />
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {activeSkill.description}
              </p>

              {/* School Application */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-indigo-700 block">
                  🏫 تطبيق واقعي في المدرسة:
                </span>
                <p className="leading-relaxed">{activeSkill.application}</p>
              </div>

              {/* Self Reflection Prompt */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  سؤال التأمل الذاتي:
                </span>
                <p>{activeSkill.reflectionQuestion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

