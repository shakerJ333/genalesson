/**
 * Interactive Leadership Skills Educational Platform
 * مهارات القيادة - الصف السابع الأساسي
 */

import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HeroOverview } from './components/HeroOverview';
import { ExploreStory } from './components/ExploreStory';
import { ReadAndLearn } from './components/ReadAndLearn';
import { TraitsAndActivity1, Activity1Submission } from './components/TraitsAndActivity1';
import { InteractiveMatching } from './components/InteractiveMatching';
import { EnrichmentSection } from './components/EnrichmentSection';
import { AssessmentSection } from './components/AssessmentSection';
import { LeadershipSimulatorModal } from './components/LeadershipSimulatorModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { CertificateModal } from './components/CertificateModal';
import { GlobalTTSBar } from './components/GlobalTTSBar';
import { LESSON_META } from './data/lessonData';
import { sounds } from './utils/audio';
import { Award, Compass, BookOpen, ArrowUp, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([
    'obj-1',
  ]);
  const [userScore, setUserScore] = useState<number>(10);
  const totalScore = 100;

  // Stored inputs
  const [warmupAnswer, setWarmupAnswer] = useState<string>('');
  const [exploreAnswers, setExploreAnswers] = useState<Record<string, string>>({});
  const [isCheckCompleted, setIsCheckCompleted] = useState<boolean>(false);
  const [activity1Data, setActivity1Data] = useState<Activity1Submission | null>(null);
  const [isMatchingCompleted, setIsMatchingCompleted] = useState<boolean>(false);
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState<boolean>(false);

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleObjective = (id: string) => {
    sounds.playPop();
    setCompletedObjectives((prev) => {
      const isAlready = prev.includes(id);
      const updated = isAlready
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      if (!isAlready) {
        setUserScore((s) => Math.min(totalScore, s + 5));
      }
      return updated;
    });
  };

  const handleWarmupComplete = (answer: string) => {
    setWarmupAnswer(answer);
    setUserScore((s) => Math.min(totalScore, s + 10));
  };

  const handleExploreAnswer = (qId: string, answer: string) => {
    setExploreAnswers((prev) => ({ ...prev, [qId]: answer }));
    setUserScore((s) => Math.min(totalScore, s + 5));
  };

  const handleCheckPassed = () => {
    if (!isCheckCompleted) {
      setIsCheckCompleted(true);
      setUserScore((s) => Math.min(totalScore, s + 10));
    }
  };

  const handleActivity1Complete = (data: Activity1Submission) => {
    setActivity1Data(data);
    setUserScore((s) => Math.min(totalScore, s + 15));
  };

  const handleMatchingAllCompleted = () => {
    if (!isMatchingCompleted) {
      setIsMatchingCompleted(true);
      setUserScore((s) => Math.min(totalScore, s + 20));
    }
  };

  const handleAssessmentCompleted = (score: number) => {
    setIsAssessmentCompleted(true);
    setUserScore((s) => Math.min(totalScore, Math.max(s, score)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Navigation Top Bar */}
      <HeaderNav
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onPrintLesson={handlePrint}
        userScore={userScore}
        totalScore={totalScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16">
        {/* Section 1: Overview & Warmup */}
        <HeroOverview
          completedObjectives={completedObjectives}
          onToggleObjective={handleToggleObjective}
          onWarmupComplete={handleWarmupComplete}
          savedWarmupAnswer={warmupAnswer}
        />

        {/* Section 2: Explore & Omar's Story */}
        <ExploreStory
          onQuestionAnswered={handleExploreAnswer}
          savedAnswers={exploreAnswers}
        />

        {/* Section 3: Read & Learn - Definition & Fan Diagram */}
        <ReadAndLearn
          onCheckPassed={handleCheckPassed}
          isCheckCompleted={isCheckCompleted}
        />

        {/* Section 4: Traits & Activity 1 */}
        <TraitsAndActivity1
          onActivity1Complete={handleActivity1Complete}
          savedActivity1Data={activity1Data}
        />

        {/* Section 5: Matching Activity (Activity 2) */}
        <InteractiveMatching
          onAllMatched={handleMatchingAllCompleted}
          isCompleted={isMatchingCompleted}
        />

        {/* Section 6: Enrichment & Business Connection */}
        <EnrichmentSection />

        {/* Section 7: Final Assessment */}
        <AssessmentSection
          onAssessmentCompleted={handleAssessmentCompleted}
          isCompleted={isAssessmentCompleted}
        />
      </main>

      {/* Quick Access Floating Action Dock (Desktop/Mobile) */}
      <aside aria-label="أدوات الوصول السريع" className="fixed bottom-5 left-5 z-30 flex items-center gap-2 no-print">
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          title="محاكي المواقف القيادية"
        >
          <Compass className="w-5 h-5" />
          <span className="hidden sm:inline">محاكي المواقف</span>
        </button>

        <button
          onClick={() => setIsCertificateOpen(true)}
          className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          title="شهادة إتمام الدرس"
        >
          <Award className="w-5 h-5" />
          <span className="hidden sm:inline">استلام الشهادة</span>
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl shadow-md transition-all cursor-pointer"
          title="العودة لأعلى الصفحة"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </aside>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">
            {LESSON_META.grade} · {LESSON_META.unit} · {LESSON_META.lessonNumber}
          </p>
          <p>
            تم تصميم هذا الدرس التعليمي التفاعلي وفق معايير وزارة التربية والتعليم ومؤسسة ولي العهد لترسيخ مهارات القيادة والمواطنة الصالحة.
          </p>
        </div>
      </footer>

      {/* Global Accessible TTS Floating Bar for Learning Support */}
      <GlobalTTSBar />

      {/* Modals */}
      <LeadershipSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onComplete={(pts) => setUserScore((s) => Math.min(totalScore, s + pts))}
      />

      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        userScore={userScore}
        totalScore={totalScore}
      />
    </div>
  );
}
