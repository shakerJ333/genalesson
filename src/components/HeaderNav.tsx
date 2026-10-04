import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Printer,
  Compass,
} from 'lucide-react';

interface HeaderNavProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onOpenSimulator: () => void;
  onOpenTeacherGuide: () => void;
  onOpenCertificate: () => void;
  onPrintLesson: () => void;
  userScore: number;
  totalScore: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSection,
  onSelectSection,
  onOpenSimulator,
  onOpenTeacherGuide,
  onOpenCertificate,
  onPrintLesson,
  userScore,
  totalScore,
}) => {
  const navItems = [
    { id: 'overview', label: 'المقدمة والأهداف' },
    { id: 'explore', label: 'أستكشف' },
    { id: 'learn', label: 'أقرأ وأتعلّم' },
    { id: 'traits', label: 'صفات القيادة' },
    { id: 'matching', label: 'نشاط التوصيل' },
    { id: 'enrichment', label: 'الإثراء والتوسّع' },
    { id: 'assessment', label: 'التّقويم النهائي' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand element */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              درس مهارات القيادة
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              الصف السابع الأساسي · الوحدة الأولى
            </span>
          </div>
        </div>

        {/* Zone 2: Clean 4-6 text nav links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Points counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-xs font-semibold tabular-nums">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{userScore} / {totalScore} نقطة</span>
          </div>

          {/* Simulator button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="محاكي المواقف القيادية"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">محاكي المواقف</span>
          </button>

          {/* Teacher Guide button */}
          <button
            onClick={onOpenTeacherGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="دليل المعلم وخطة الدرس"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">دليل المعلم</span>
          </button>

          {/* Certificate button */}
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="شهادة إتمام الدرس"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">الشهادة</span>
          </button>

          {/* Print button */}
          <button
            onClick={onPrintLesson}
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="طباعة ورقة عمل الدرس"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden lg:inline ml-1">طباعة</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer / scrollbar */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 overflow-x-auto flex gap-2 text-xs scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeSection === item.id
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
