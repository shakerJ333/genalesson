import React from 'react';
import {
  BookOpen,
  Clock,
  Printer,
  Sparkles,
  Users,
  Target,
  CheckCircle2,
} from 'lucide-react';
import {
  TEACHER_PEDAGOGICAL_GUIDE,
  LESSON_META,
  LESSON_OBJECTIVES,
} from '../data/lessonData';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-100 max-h-[92vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                دَلِيلُ المُعَلِّمِ والتَّخْطيطُ التَّدْريسِيُّ (5Es Model)
              </h3>
              <p className="text-xs text-slate-500">
                خطة تدريس معيارية مصممة وفق أحدث استراتيجيات تصميم التعليم
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="طباعة خطة الدرس"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الخطة</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Overview Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block">المبحث والصف:</span>
            <strong className="text-slate-900 font-bold">{LESSON_META.grade}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">عنوان الدرس:</span>
            <strong className="text-indigo-700 font-bold">{LESSON_META.title}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">النموذج التدريسي:</span>
            <strong className="text-emerald-700 font-bold">دورة التعلم الخماسية 5Es</strong>
          </div>
        </div>

        {/* Learning Objectives Matrix (Bloom's Taxonomy) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>نتاجات التعلم الخاصة (وفق هرم بلوم):</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LESSON_OBJECTIVES.map((obj) => (
              <div
                key={obj.id}
                className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">
                    نتاج {obj.category}:
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {obj.category}
                  </span>
                </div>
                <p className="text-slate-700">{obj.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5Es Learning Cycle Timeline Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>المراحل التدريسية وتوزيع زمن الحصة (45 دقيقة):</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-1/5">المرحلة والزمن</th>
                  <th className="p-3 w-2/5">دور المعلم والأنشطة</th>
                  <th className="p-3 w-2/5">دور الطالب ونمط التعلم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEACHER_PEDAGOGICAL_GUIDE.stages.map((stg, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">
                      <div>{stg.phase}</div>
                      <div className="text-[11px] text-indigo-600 font-medium">{stg.time}</div>
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed">
                      {stg.teacherRole}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed">
                      {stg.studentRole}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Differentiation Strategies */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>استراتيجيات التمايز ومراعاة الفروق الفردية:</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEACHER_PEDAGOGICAL_GUIDE.differentiation.map((diff, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <strong className="text-slate-900 block font-bold">
                  {diff.level}
                </strong>
                <p className="text-slate-600 leading-relaxed">{diff.strategy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
