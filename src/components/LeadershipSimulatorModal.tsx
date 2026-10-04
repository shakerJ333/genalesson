import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../data/lessonData';
import { sounds } from '../utils/audio';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const LeadershipSimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answeredScenarios, setAnsweredScenarios] = useState<
    Record<number, string>
  >({});
  const [totalSimPoints, setTotalSimPoints] = useState(0);

  if (!isOpen) return null;

  const scenario = SIMULATION_SCENARIOS[currentScenarioIdx];
  const isAnswered = answeredScenarios[scenario.id] !== undefined;
  const chosenOption = scenario.options.find(
    (o) => o.id === (isAnswered ? answeredScenarios[scenario.id] : selectedOptionId)
  );

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    sounds.playPop();
    setSelectedOptionId(optId);
  };

  const handleConfirmChoice = () => {
    if (!selectedOptionId || isAnswered) return;
    const opt = scenario.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    if (opt.isOptimal) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    setAnsweredScenarios((prev) => ({ ...prev, [scenario.id]: selectedOptionId }));
    setTotalSimPoints((prev) => prev + opt.points);
  };

  const handleNext = () => {
    if (currentScenarioIdx < SIMULATION_SCENARIOS.length - 1) {
      setCurrentScenarioIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      // Finished
      sounds.playSuccess();
      onComplete(totalSimPoints);
      onClose();
    }
  };

  const handleReset = () => {
    setCurrentScenarioIdx(0);
    setSelectedOptionId(null);
    setAnsweredScenarios({});
    setTotalSimPoints(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                مُحاكي المَواقِفِ القِيادِيَّةِ التَّفاعُلِيُّ
              </h3>
              <p className="text-xs text-slate-500">
                اختبر قراراتك القيادية في مواقف مدرسية واقعية وتعرّف على أثرها
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            الموقف {currentScenarioIdx + 1} من {SIMULATION_SCENARIOS.length}
          </span>
          <span className="text-indigo-600 tabular-nums">
            النقاط المكتسبة: {totalSimPoints} نقطة
          </span>
        </div>

        {/* Scenario Card */}
        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
          <span className="px-2.5 py-0.5 rounded-md bg-indigo-200 text-indigo-900 font-bold text-xs">
            {scenario.context}
          </span>
          <h4 className="text-base font-bold text-indigo-950">
            {scenario.title}
          </h4>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {scenario.situation}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 block">
            بصفتك قائد الفريق، ما هو الإجراء الأنسب الذي ستتخذه؟
          </span>

          {scenario.options.map((opt) => {
            const isSelected = (isAnswered ? answeredScenarios[scenario.id] : selectedOptionId) === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? isAnswered
                      ? opt.isOptimal
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                        : 'border-rose-500 bg-rose-50 text-rose-950'
                      : 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                    : 'border-slate-200 hover:border-indigo-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? isAnswered
                          ? opt.isOptimal
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {opt.id.replace('opt-', '')}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt.text}
                    </p>
                    {isAnswered && isSelected && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                        <span className="font-bold block">
                          النمط القيادي: ({opt.style})
                        </span>
                        <p className="mt-0.5">{opt.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة المحاكي من البداية</span>
          </button>

          {!isAnswered ? (
            <button
              onClick={handleConfirmChoice}
              disabled={!selectedOptionId}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              تأكيد القرار القيادي
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>
                {currentScenarioIdx < SIMULATION_SCENARIOS.length - 1
                  ? 'الموقف التالي'
                  : 'اعتماد النتيجة وإنهاء المحاكي'}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
