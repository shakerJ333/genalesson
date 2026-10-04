import React, { useState } from 'react';
import {
  Link2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '../utils/audio';

// Authentic images generated matching the textbook exactly
const IMG_PAWN_SHADOW = '/src/assets/images/match_pawn_king_shadow_1791125187460.jpg';
const IMG_TEAM_NETWORK = '/src/assets/images/match_team_network_1791125209053.jpg';
const IMG_TANGLED_SOLVED = '/src/assets/images/match_tangled_solved_1791125198498.jpg';
const IMG_ORGANIZED_TEAM = '/src/assets/images/hero_leadership_team_1791125163963.jpg';

interface InteractiveMatchingProps {
  onAllMatched: () => void;
  isCompleted: boolean;
}

interface ImageCardItem {
  id: string;
  imgSrc: string;
  alt: string;
  correctPhraseId: string;
  explanation: string;
}

interface PhraseCardItem {
  id: string;
  number: number;
  text: string;
}

const IMAGE_ITEMS: ImageCardItem[] = [
  {
    id: 'img-organized',
    imgSrc: IMG_ORGANIZED_TEAM,
    alt: 'مجموعة بيادق مصطفة بتناسق ودقة مع أدوات التنظيم',
    correctPhraseId: 'phrase-4', // التنظيم
    explanation:
      'تمثل الصورة مهارة (التنظيم) حيث يوزع العمل وتصطف الموارد والمهام بتناغم تام لتحقيق الهدف المشترك.',
  },
  {
    id: 'img-tangled',
    imgSrc: IMG_TANGLED_SOLVED,
    alt: 'خط متشابك معقد يتحول بواسطة قلم إلى دائرة منتظمة',
    correctPhraseId: 'phrase-3', // اتخاذ القرار وحل المشكلات
    explanation:
      'تمثل الصورة مهارة (اتخاذ القرار وحل المشكلات)؛ فالفوضى والتعقيد يتم تبسيطهما وحلهما بأسلوب هادئ ومنهجي.',
  },
  {
    id: 'img-shadow',
    imgSrc: IMG_PAWN_SHADOW,
    alt: 'بيدق شطرنج متواضع يلقي ظل ملك عظيم متوّج',
    correctPhraseId: 'phrase-1', // الثقة بالنفس
    explanation:
      'تمثل الصورة صفة (الثقة بالنفس)؛ فالإنسان قد يبدو بسيطاً لكن إيمانه بقدراته يمنحه هيبة وروح قائد عظيم.',
  },
  {
    id: 'img-network',
    imgSrc: IMG_TEAM_NETWORK,
    alt: 'شبكة مكعبات مترابطة بخيوط ضوئية تدل على الاتصال',
    correctPhraseId: 'phrase-2', // الاتصال والتواصل
    explanation:
      'تمثل الصورة صفة (الاتصال والتواصل)؛ حيث ترتبط العقول وتتدفق المعلومات بين أعضاء الفريق بسلاسة ووضوح.',
  },
];

const PHRASE_ITEMS: PhraseCardItem[] = [
  { id: 'phrase-1', number: 1, text: 'الثِّقَةُ بالنَّفْسِ.' },
  { id: 'phrase-2', number: 2, text: 'الاتِّصالُ والتَّواصُلُ.' },
  { id: 'phrase-3', number: 3, text: 'اتِّخاذُ القَرارِ وحَلُّ المُشْكِلاتِ.' },
  { id: 'phrase-4', number: 4, text: 'التَّنْظِيمُ.' },
];

export const InteractiveMatching: React.FC<InteractiveMatchingProps> = ({
  onAllMatched,
  isCompleted,
}) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // imageId -> phraseId
  const [feedbackState, setFeedbackState] = useState<{
    status: 'idle' | 'correct' | 'wrong';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleImageClick = (imgId: string) => {
    sounds.playPop();
    // If already correctly matched, show explanation
    if (matchedPairs[imgId]) {
      const item = IMAGE_ITEMS.find((x) => x.id === imgId);
      if (item) {
        setFeedbackState({ status: 'correct', message: item.explanation });
      }
      return;
    }

    setSelectedImageId(imgId);

    // If phrase already selected, evaluate match
    if (selectedPhraseId) {
      evaluatePair(imgId, selectedPhraseId);
    }
  };

  const handlePhraseClick = (phrId: string) => {
    sounds.playPop();
    // Check if phrase is already part of a matched pair
    const isAlreadyMatched = Object.values(matchedPairs).includes(phrId);
    if (isAlreadyMatched) {
      return;
    }

    setSelectedPhraseId(phrId);

    // If image already selected, evaluate match
    if (selectedImageId) {
      evaluatePair(selectedImageId, phrId);
    }
  };

  const evaluatePair = (imgId: string, phrId: string) => {
    const item = IMAGE_ITEMS.find((x) => x.id === imgId);
    if (!item) return;

    if (item.correctPhraseId === phrId) {
      sounds.playSuccess();
      const updated = { ...matchedPairs, [imgId]: phrId };
      setMatchedPairs(updated);
      setSelectedImageId(null);
      setSelectedPhraseId(null);
      setFeedbackState({
        status: 'correct',
        message: `إجابة صحيحة ومطابقة دقيقة! ${item.explanation}`,
      });

      if (Object.keys(updated).length === IMAGE_ITEMS.length) {
        onAllMatched();
      }
    } else {
      sounds.playError();
      setFeedbackState({
        status: 'wrong',
        message: 'مطابقة غير صحيحة، تأمل رمزية الصورة ودلالتها وحاول مجدداً!',
      });
      // Clear selections after short delay
      setTimeout(() => {
        setSelectedImageId(null);
        setSelectedPhraseId(null);
      }, 700);
    }
  };

  const handleReset = () => {
    sounds.playPop();
    setMatchedPairs({});
    setSelectedImageId(null);
    setSelectedPhraseId(null);
    setFeedbackState({ status: 'idle', message: '' });
  };

  const isAllComplete = Object.keys(matchedPairs).length === IMAGE_ITEMS.length;

  return (
    <section id="matching" className="scroll-mt-20 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-xs rounded-lg">
            نَشاط 2
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              أَصِلُ بِخَطٍّ بَيْنَ الصُّورَةِ والعِبارَةِ المُناسِبَةِ لَها
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              انقر على الصورة ثم انقر على العبارة المناسبة لوصلهما معاً
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 tabular-nums">
            تمت مطابقة {Object.keys(matchedPairs).length} من 4 صور
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      </div>

      {/* Main Matching Stage Container */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Dynamic feedback banner */}
        {feedbackState.message && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-fadeIn border ${
              feedbackState.status === 'correct'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {feedbackState.status === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="leading-relaxed">{feedbackState.message}</p>
          </div>
        )}

        {/* 2-Columns Grid: Left Images, Right Phrases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Images Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>الصور الرمزية (الجانب الأيمن):</span>
            </h3>

            <div className="space-y-4">
              {IMAGE_ITEMS.map((item, idx) => {
                const isSelected = selectedImageId === item.id;
                const isMatched = !!matchedPairs[item.id];
                const matchedPhrase = PHRASE_ITEMS.find(
                  (p) => p.id === matchedPairs[item.id]
                );

                return (
                  <div
                    key={item.id}
                    onClick={() => handleImageClick(item.id)}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-2 flex items-center gap-4 ${
                      isMatched
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md scale-101'
                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-28 sm:w-36 aspect-4/3 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/70 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Metadata & Status */}
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-slate-700 line-clamp-2">
                        {item.alt}
                      </p>
                      {isMatched ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>موصل بـ: {matchedPhrase?.text}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 block">
                          {isSelected ? 'محدد حالياً (اختر العبارة)' : 'انقر للتحديد'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phrases Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>العبارات والمهارات (الجانب الأيسر):</span>
            </h3>

            <div className="space-y-4">
              {PHRASE_ITEMS.map((phrase) => {
                const isSelected = selectedPhraseId === phrase.id;
                const isMatched = Object.values(matchedPairs).includes(phrase.id);

                return (
                  <div
                    key={phrase.id}
                    onClick={() => handlePhraseClick(phrase.id)}
                    className={`rounded-2xl border-2 p-5 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isMatched
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-bold'
                        : isSelected
                        ? 'border-indigo-600 bg-indigo-50 shadow-md scale-101 font-bold text-indigo-950'
                        : 'border-slate-200 hover:border-indigo-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isMatched
                            ? 'bg-emerald-600 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {phrase.number}
                      </span>
                      <span className="text-sm sm:text-base font-bold">
                        {phrase.text}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {isMatched ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Link2
                          className={`w-4 h-4 ${
                            isSelected ? 'text-indigo-600' : 'text-slate-300'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation box on completion */}
            {isAllComplete && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>أحسنت! أتممت التوصيل بنجاح تام (+20 نقطة)</span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  أظهرت فهماً بصرياً ورمزياً عميقاً للمهارات والصفات القيادية، وربطت الصور بمدلولاتها الفكرية بدقة بالغة.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
