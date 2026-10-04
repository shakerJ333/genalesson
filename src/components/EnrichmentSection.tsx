import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  Briefcase,
  ExternalLink,
  Volume2,
  CheckCircle2,
  Building2,
  Lightbulb,
} from 'lucide-react';
import { ENRICHMENT_PROGRAM } from '../data/lessonData';
import { ArabicTTS, sounds } from '../utils/audio';
import { TTSControlBar } from './TTSControlBar';

export const EnrichmentSection: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [businessReflection, setBusinessReflection] = useState('');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  const enrichmentFullText = `${ENRICHMENT_PROGRAM.title}. ${ENRICHMENT_PROGRAM.content}`;
  const businessFullText = `${ENRICHMENT_PROGRAM.crossCurricular.title}. ${ENRICHMENT_PROGRAM.crossCurricular.text}`;

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessReflection.trim()) return;
    sounds.playSuccess();
    setIsReflectionSaved(true);
  };

  return (
    <section id="enrichment" className="scroll-mt-20 space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-lg shadow-xs">
            📢
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              الإِثْراءُ والتَّوَسُّعُ والرَّبْطُ مَعَ إِدارَةِ الأَعْمالِ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              آفاق وطنية وعالمية لتطبيقات القيادة وريادة الأعمال المعاصرة
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column: School Leadership Program (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-extrabold w-fit">
              {ENRICHMENT_PROGRAM.subtitle}
            </span>
            <TTSControlBar
              text={enrichmentFullText}
              label="استمع لبرنامج القيادة"
              variant="badge"
            />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-red-600 leading-tight">
            {ENRICHMENT_PROGRAM.title}
          </h3>

          <span className="text-xs font-semibold text-slate-500 block">
            {ENRICHMENT_PROGRAM.partnership}
          </span>

          <div className="space-y-4 text-sm sm:text-base text-slate-800 leading-relaxed text-justify">
            {ENRICHMENT_PROGRAM.content.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* QR Code Card from textbook */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                onClick={() => {
                  sounds.playPop();
                  setShowQrModal(true);
                }}
                className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-2 shadow-xs cursor-pointer hover:border-indigo-400 transition-colors shrink-0"
                title="انقر لتكبير الرمز والاطلاع على الموقع"
              >
                <QrCode className="w-full h-full text-slate-800" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block">
                  أستخدمُ الرمزَ المجاور للدخولِ إلى الموقعِ الإلكترونيِّ لمؤسسةِ وليِّ العهد
                </span>
                <p className="text-[11px] text-slate-500">
                  للتعرّفِ مزيدًا عن مبادرات وبرامج تنمية القيادات الشبابية والمدرسية.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                setShowQrModal(true);
              }}
              className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 cursor-pointer whitespace-nowrap"
            >
              استكشف الرابط
            </button>
          </div>
        </div>

        {/* Right Column: Business Administration Connection (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-indigo-200 block">تكامل بين المناهج</span>
                <h4 className="text-base font-bold text-white">
                  {ENRICHMENT_PROGRAM.crossCurricular.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => ArabicTTS.speak(businessFullText)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-200 text-xs flex items-center gap-1 cursor-pointer"
              title="استمع للربط مع إدارة الأعمال"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استماع</span>
            </button>
          </div>

          <p className="text-sm text-indigo-100 leading-relaxed text-justify bg-white/5 p-4 rounded-xl border border-white/10">
            {ENRICHMENT_PROGRAM.crossCurricular.text}
          </p>

          {/* Practical Application in School */}
          <form onSubmit={handleSaveReflection} className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-amber-300">
              سؤال التطبيق العملي: كيف توظف القيادة وتنظيم الموارد في تنظيم بازار خيري أو إذاعة مدرسية؟
            </label>
            <textarea
              value={businessReflection}
              onChange={(e) => setBusinessReflection(e.target.value)}
              placeholder="اكتب كيف ستدير وقت زملائك والموارد المتاحة بذكاء لتحقيق التميز..."
              rows={3}
              className="w-full text-xs rounded-xl bg-white/10 text-white placeholder:text-slate-400 border border-white/20 p-3 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={!businessReflection.trim()}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                حفظ الفكرة (+10 نقاط)
              </button>

              {isReflectionSaved && (
                <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم الحفظ
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>مؤسسة وليّ العهد (Crown Prince Foundation)</span>
              </h4>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-40 h-40 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-xs text-slate-500 mt-2 font-mono">
                www.cpf.jo · مبادرة برنامج القيادة للمدارس
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              تأسست مؤسسة ولي العهد لترجمة رؤية سمو الأمير الحسين بن عبدالله الثاني المعظم في إعداد الشباب الأردني الواعد وتزويدهم بمهارات المستقبل، ومن ضمنها برامج مهارات القيادة والريادة المجتمعية.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
