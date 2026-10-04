import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Award,
  Send,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/lessonData';
import { sounds } from '../utils/audio';

interface AssessmentSectionProps {
  onAssessmentCompleted: (score: number) => void;
  isCompleted: boolean;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  onAssessmentCompleted,
  isCompleted,
}) => {
  // Q1 Answers: questionId -> boolean (true/false)
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [tfSubmitted, setTfSubmitted] = useState(false);

  // Q2: أفسر
  const [explainAnswer, setExplainAnswer] = useState('');
  const [showExplainModel, setShowExplainModel] = useState(false);

  // Q3: أذكر أهم الصفات
  const [personalTraits, setPersonalTraits] = useState('');

  // Q4: جدول المهارات والصفات
  // الصفة: الاتصال والتواصل -> المهارة المناسبة
  // الصفة: الثقة بالنفس -> المهارة المناسبة
  const [trait1Skill, setTrait1Skill] = useState('');
  const [trait2Skill, setTrait2Skill] = useState('');
  const [showTableSolution, setShowTableSolution] = useState(false);

  const handleSelectTF = (qId: number, val: boolean) => {
    sounds.playPop();
    setTfAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleGradeQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (tfAnswers[q.id] === q.isCorrect) {
        score += 5; // 5 points per TF question = 35 pts
      }
    });

    if (explainAnswer.trim().length > 10) score += 10;
    if (personalTraits.trim().length > 5) score += 10;
    if (trait1Skill && trait2Skill) score += 10;

    sounds.playSuccess();
    setTfSubmitted(true);

    if (score >= 50) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }

    onAssessmentCompleted(score);
  };

  const handleResetQuiz = () => {
    sounds.playPop();
    setTfAnswers({});
    setTfSubmitted(false);
  };

  // Calculate score
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => tfAnswers[q.id] === q.isCorrect
  ).length;

  return (
    <section id="assessment" className="scroll-mt-20 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xs">
            👍
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              التَّقْويمُ والتَّحَقُّقُ النِّهائيُّ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              اختبار شامل يحاكي صفحة التقويم المعتمدة في الكتاب المدرسي
            </p>
          </div>
        </div>

        {tfSubmitted && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>
              أجبت بشكل صحيح على {correctCount} من {QUIZ_QUESTIONS.length} في الفكرة الرئيسة
            </span>
          </div>
        )}
      </div>

      {/* 1. الفكرة الرئيسة: أسئلة صح وخطأ */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>
              الفِكْرَةُ الرَّئيسَةُ: أَضَعُ إِشارَةَ (✓) أَمامَ العِبارَةِ الصَّحيحَةِ، وإِشارَةَ (✗) أَمامَ العِبارَةِ غَيْرِ الصَّحيحَةِ في ما يَأْتي:
            </span>
          </h3>

          {tfSubmitted && (
            <button
              onClick={handleResetQuiz}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الاختبار</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const currentAnswer = tfAnswers[q.id];
            const isAnswered = currentAnswer !== undefined;
            const isCorrect = isAnswered && currentAnswer === q.isCorrect;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  tfSubmitted
                    ? isCorrect
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-rose-50/50 border-rose-300'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-bold text-slate-400 mt-0.5">
                      •
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {q.statement}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {/* True (✓) button */}
                    <button
                      type="button"
                      onClick={() => handleSelectTF(q.id, true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        currentAnswer === true
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      <span>✓</span>
                      <span>صحيحة</span>
                    </button>

                    {/* False (✗) button */}
                    <button
                      type="button"
                      onClick={() => handleSelectTF(q.id, false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        currentAnswer === false
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      <span>✗</span>
                      <span>غير صحيحة</span>
                    </button>
                  </div>
                </div>

                {/* Feedback explanation after submit */}
                {tfSubmitted && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className={isCorrect ? 'text-emerald-900' : 'text-rose-900'}>
                      {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. أفسّر: تؤثر القيادة في الآخرين */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span className="text-red-600 font-extrabold">أُفَسِّرُ:</span>
            <span>تُؤَثِّرُ القِيادَةُ في الآخَرِينَ.</span>
          </h3>

          <button
            type="button"
            onClick={() => setShowExplainModel(!showExplainModel)}
            className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showExplainModel ? 'إخفاء التفسير النموذجي' : 'عرض التفسير التربوي'}</span>
          </button>
        </div>

        <textarea
          value={explainAnswer}
          onChange={(e) => setExplainAnswer(e.target.value)}
          placeholder="اكتب تفسيرك: كيف يُحدث القائد أثراً وتغييراً إيجابياً في سلوك وأفكار أفراد فريقه؟..."
          rows={3}
          className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />

        {showExplainModel && (
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs sm:text-sm text-indigo-950 space-y-1 animate-fadeIn">
            <strong>التفسير التربوي النموذجي:</strong>
            <p className="leading-relaxed">
              تؤثر القيادة في الآخرين لأن القائد الناجح لا يكتفي بإعطاء التوجيهات، بل يشكل قدوة حسنة في الالتزام، ويبث الحماس والتحفيز في نفوسهم، ويشعرهم بأهمية أدوارهم، مما يدفعهم برغبة وطواعية للتعاون والعمل معاً لتحقيق الهدف المشترك.
            </p>
          </div>
        )}
      </div>

      {/* 3. أذكر أهم الصفات */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
            3
          </span>
          <span>أَذْكُرُ أَهَمَّ الصِّفاتِ الَّتي تُمَيِّزُ القِيادَةَ النّاجِحَةَ مِنْ وِجْهَةِ نَظَرِي:</span>
        </h3>

        <div className="flex flex-wrap gap-2 mb-2">
          {['الصدق والأمانة', 'الشجاعة في اتخاذ القرار', 'الاستماع الجيد', 'العدالة بين الزملاء', 'الثقة بالنفس والتواضع'].map(
            (suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPersonalTraits((prev) =>
                    prev ? `${prev}، ${suggestion}` : suggestion
                  );
                }}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer transition-colors"
              >
                + {suggestion}
              </button>
            )
          )}
        </div>

        <textarea
          value={personalTraits}
          onChange={(e) => setPersonalTraits(e.target.value)}
          placeholder="اكتب الصفات التي تراها الأكثر أهمية مع ذكر سبب اختيارك لها..."
          rows={3}
          className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 4. جدول ربط الصفات بالمهارات */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>
              أَكْتُبُ أَسْفَلَ كُلِّ صِفَةٍ مِنَ الصِّفاتِ القِيادِيَّةِ الآتِيَةِ المَهارَةَ المُناسِبَةَ الَّتي تَدْعَمُها:
            </span>
          </h3>

          <button
            type="button"
            onClick={() => setShowTableSolution(!showTableSolution)}
            className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium"
          >
            {showTableSolution ? 'إخفاء حل الجدول' : 'عرض الحل النموذجي للجدول'}
          </button>
        </div>

        {/* Authentic 2-column table styled exactly like the book */}
        <div className="overflow-hidden rounded-xl border-2 border-pink-300">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-pink-100/70 text-slate-900 border-b-2 border-pink-300 font-bold text-xs sm:text-sm">
                <th className="p-3 w-1/4 border-l-2 border-pink-300">العنصر</th>
                <th className="p-3 w-3/8 border-l-2 border-pink-300 text-indigo-900">
                  الاتِّصالُ والتَّواصُلُ
                </th>
                <th className="p-3 w-3/8 text-indigo-900">الثِّقَةُ بالنَّفْسِ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b border-pink-200 text-xs sm:text-sm font-bold">
                <td className="p-3 bg-pink-50/50 border-l-2 border-pink-300 text-slate-800">
                  الصِّفَةُ
                </td>
                <td className="p-3 border-l-2 border-pink-300 text-slate-700">
                  صفة قيادية أصيلة
                </td>
                <td className="p-3 text-slate-700">صفة قيادية أصيلة</td>
              </tr>
              <tr className="bg-white text-xs sm:text-sm">
                <td className="p-3 bg-pink-50/50 border-l-2 border-pink-300 font-bold text-slate-800">
                  المَهارَةُ الدّاعِمَةُ
                </td>
                <td className="p-3 border-l-2 border-pink-300">
                  <select
                    value={trait1Skill}
                    onChange={(e) => setTrait1Skill(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="">-- اختر المهارة الداعمة --</option>
                    <option value="التحفيز">مَهارةُ التَّحفيزِ</option>
                    <option value="التنظيم">مَهارةُ التَّنظيمِ</option>
                    <option value="حل المشكلات">مَهارةُ حلِّ المشكلاتِ</option>
                    <option value="اتخاذ القرار">مَهارةُ اتِّخاذِ القرارِ</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={trait2Skill}
                    onChange={(e) => setTrait2Skill(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="">-- اختر المهارة الداعمة --</option>
                    <option value="اتخاذ القرار">مَهارةُ اتِّخاذِ القرارِ</option>
                    <option value="حل المشكلات">مَهارةُ حلِّ المشكلاتِ</option>
                    <option value="التنظيم">مَهارةُ التَّنظيمِ</option>
                    <option value="التحفيز">مَهارةُ التَّحفيزِ</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {showTableSolution && (
          <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950 space-y-1 animate-fadeIn">
            <strong>الحل النموذجي المعتمد:</strong>
            <ul className="list-disc list-inside space-y-0.5 mt-1">
              <li>صفة (الاتصال والتواصل) تدعمها مهارة <strong>التحفيز والتنظيم</strong>.</li>
              <li>صفة (الثقة بالنفس) تدعمها مهارة <strong>اتخاذ القرار وحل المشكلات</strong>.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Final Submission Button Bar */}
      <div className="p-6 rounded-2xl bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="text-base font-bold">جاهز لتقييم إجاباتك واعتماد نتيجتك؟</h4>
          <p className="text-xs text-indigo-200 mt-0.5">
            سيتم احتساب النقاط وتوثيق إتمام الدرس لتوليد شهادة القيادة المدرسية
          </p>
        </div>

        <button
          onClick={handleGradeQuiz}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>تقييم الدرس واعتماد الدرجة (+50 نقطة)</span>
        </button>
      </div>
    </section>
  );
};
