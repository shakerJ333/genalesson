import React, { useState } from 'react';
import {
  Award,
  Printer,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { LESSON_META } from '../data/lessonData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userScore: number;
  totalScore: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userScore,
  totalScore,
}) => {
  const [studentName, setStudentName] = useState('عمر أحمد النجار');
  const [schoolName, setSchoolName] = useState('مدرسة الأمل الأساسية');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const percentage = Math.round((userScore / Math.max(totalScore, 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-100 max-h-[92vh] overflow-y-auto animate-scaleUp">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">
              شهادة القائد الصغير المتميز
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الرسمية</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Inputs for student customization (hidden on print) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs no-print">
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              اسم الطالب / الطالبة:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="اكتب اسمك الثلاثي..."
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              اسم المدرسة:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="اكتب اسم مدرستك..."
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Certificate Canvas / Layout (Printable) */}
        <div className="p-8 sm:p-12 rounded-2xl border-8 border-double border-amber-600/40 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 text-center relative overflow-hidden shadow-inner">
          {/* Subtle Watermark/Emblem */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-indigo-900" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <span className="text-xs tracking-widest font-extrabold text-amber-700 uppercase">
                المملكة الأردنية الهاشمية · وزارة التربية والتعليم
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                شَهادَةُ تَمَيُّزٍ وإِتْمامِ دَرْسِ مَهاراتِ القِيادَةِ
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {LESSON_META.grade} · {LESSON_META.unit}
              </span>
            </div>

            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              تَشْهَدُ المَنَصَّةُ التَّعْليمِيَّةُ بأَنَّ الطّالِبَ / الطّالِبَةَ:
            </p>

            <div className="py-2 border-b-2 border-slate-300 max-w-sm mx-auto">
              <span className="text-xl sm:text-2xl font-black text-indigo-950 font-serif">
                {studentName || '................................'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
              قَدْ أَتَمَّ بِنَجاحٍ وتَمَيُّزٍ كافَّةَ الأَنْشِطَةِ التَّفاعُلِيَّةِ والتَّقْويمِ المَعْرِفِيِّ لِدَرْسِ <strong>(مَهاراتُ القِيادَةِ)</strong>، وأَظْهَرَ كَفاءَةً في مَهاراتِ اتِّخاذِ القَرارِ، والتَّحْفيزِ، والتَّنْظيمِ، وحَلِّ المُشْكِلاتِ.
            </p>

            {/* Score & Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>التقدير العام: قائد ملهم ومتميز (نسبة الإنجاز: {Math.max(percentage, 85)}%)</span>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 max-w-lg mx-auto text-xs text-slate-700">
              <div className="space-y-1">
                <span className="font-bold block">معلم / معلمة المبحث</span>
                <span className="text-slate-400 font-mono">الختم والاعتماد</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold block">مدير / مديرة المدرسة</span>
                <span className="text-slate-400 font-mono">{schoolName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
