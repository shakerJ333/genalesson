import React, { useState } from 'react';
import {
  Shield,
  Award,
  Radio,
  Compass,
  Users,
  CheckCircle2,
  Share2,
  Download,
  FolderHeart,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import {
  LEADERSHIP_TRAITS,
  ACTIVITY_1_FIELDS,
} from '../data/lessonData';
import { sounds } from '../utils/audio';
import { TTSControlBar } from './TTSControlBar';

interface TraitsAndActivity1Props {
  onActivity1Complete: (data: Activity1Submission) => void;
  savedActivity1Data?: Activity1Submission | null;
}

export interface Activity1Submission {
  fieldId: string;
  leaderName: string;
  leaderRole: string;
  traits: string[];
  achievements: string;
  teamLeader: string;
  researcher: string;
  speaker: string;
}

export const TraitsAndActivity1: React.FC<TraitsAndActivity1Props> = ({
  onActivity1Complete,
  savedActivity1Data,
}) => {
  const [activeTraitId, setActiveTraitId] = useState<string>('courage');
  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    savedActivity1Data?.fieldId || 'educational'
  );
  const [leaderName, setLeaderName] = useState(
    savedActivity1Data?.leaderName || ''
  );
  const [traitsList, setTraitsList] = useState<string[]>(
    savedActivity1Data?.traits || ['الشجاعة', 'الثقة بالنفس']
  );
  const [achievements, setAchievements] = useState(
    savedActivity1Data?.achievements || ''
  );
  const [teamLeader, setTeamLeader] = useState(
    savedActivity1Data?.teamLeader || ''
  );
  const [researcher, setResearcher] = useState(
    savedActivity1Data?.researcher || ''
  );
  const [speaker, setSpeaker] = useState(savedActivity1Data?.speaker || '');
  const [isSaved, setIsSaved] = useState(!!savedActivity1Data);
  const [checkAnswer, setCheckAnswer] = useState('');
  const [showCheckModel, setShowCheckModel] = useState(false);

  const activeTrait =
    LEADERSHIP_TRAITS.find((t) => t.id === activeTraitId) ||
    LEADERSHIP_TRAITS[0];

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderName.trim() || !achievements.trim()) return;

    sounds.playSuccess();
    const data: Activity1Submission = {
      fieldId: selectedFieldId,
      leaderName: leaderName.trim(),
      leaderRole: ACTIVITY_1_FIELDS.find((f) => f.id === selectedFieldId)?.name || '',
      traits: traitsList,
      achievements: achievements.trim(),
      teamLeader: teamLeader.trim() || 'قائد المجموعة',
      researcher: researcher.trim() || 'الباحث',
      speaker: speaker.trim() || 'المتحدث',
    };

    setIsSaved(true);
    onActivity1Complete(data);
  };

  const handleToggleTraitTag = (traitName: string) => {
    sounds.playPop();
    setTraitsList((prev) =>
      prev.includes(traitName)
        ? prev.filter((t) => t !== traitName)
        : [...prev, traitName]
    );
  };

  return (
    <section id="traits" className="scroll-mt-20 space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shadow-xs">
            🌸
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              صِفاتُ القِيادَةِ النّاجِحَةِ ووَرْشَةُ «شَخْصِيَّةٌ مِنْ بَلَدِي»
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              الوردة الرباعية للصفات القيادية والنشاط التعاوني المدرسي
            </p>
          </div>
        </div>
      </div>

      {/* The 4-Clover Traits Diagram Container */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            مِنَ الصِّفاتِ المُهِمَّةِ للقِيادَةِ النّاجِحَةِ ما يَأْتِي:
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            شكل الوردة الرباعية لصفات القائد الملهم (انقر على كل بتلة):
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Clover Diagram Representation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Central hub */}
              <div className="absolute z-20 w-28 h-28 rounded-full bg-white border-4 border-indigo-100 shadow-md flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs font-bold text-indigo-900 leading-tight">
                  صفاتُ<br />القيادةِ الناجحة
                </span>
              </div>

              {/* 4 Clover Petals */}
              {/* Top: الشجاعة */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTraitId('courage');
                }}
                className={`absolute top-0 w-28 h-28 rounded-t-full bg-gradient-to-b from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-start pt-3 shadow-md transition-all cursor-pointer ${
                  activeTraitId === 'courage'
                    ? 'scale-110 z-10 ring-4 ring-orange-300'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <Shield className="w-4 h-4 mb-1" />
                <span>الشَّجاعةُ</span>
              </button>

              {/* Right: الاتصال والتواصل */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTraitId('communication');
                }}
                className={`absolute right-0 w-28 h-28 rounded-r-full bg-gradient-to-l from-teal-500 to-emerald-500 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center pr-3 shadow-md transition-all cursor-pointer ${
                  activeTraitId === 'communication'
                    ? 'scale-110 z-10 ring-4 ring-teal-300'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <Radio className="w-4 h-4 mb-1" />
                <span>الاتِّصالُ<br />والتَّواصُلُ</span>
              </button>

              {/* Bottom: التخطيط للمستقبل */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTraitId('future-planning');
                }}
                className={`absolute bottom-0 w-28 h-28 rounded-b-full bg-gradient-to-t from-emerald-600 to-green-500 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-end pb-3 shadow-md transition-all cursor-pointer ${
                  activeTraitId === 'future-planning'
                    ? 'scale-110 z-10 ring-4 ring-emerald-300'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <span>التَّخْطيطُ<br />للمُسْتَقْبَلِ</span>
                <Compass className="w-4 h-4 mt-1" />
              </button>

              {/* Left: الثقة بالنفس */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTraitId('confidence');
                }}
                className={`absolute left-0 w-28 h-28 rounded-l-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center pl-3 shadow-md transition-all cursor-pointer ${
                  activeTraitId === 'confidence'
                    ? 'scale-110 z-10 ring-4 ring-blue-300'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <Award className="w-4 h-4 mb-1" />
                <span>الثِّقَةُ<br />بالنَّفْسِ</span>
              </button>
            </div>
            <span className="text-xs text-slate-400 mt-4 block text-center">
              (مخطط الوردة الرباعية لصفات القيادة الناجحة)
            </span>
          </div>

          {/* Trait Details */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <h4 className="text-lg font-bold text-slate-900">
                    صفة: {activeTrait.name}
                  </h4>
                </div>

                <TTSControlBar
                  text={`صفة ${activeTrait.name}. ${activeTrait.description}. تدعم مهارة ${activeTrait.relatedSkill}. مثال في الحياة المدرسية: ${activeTrait.schoolExample}`}
                  label="استمع للصفة"
                  variant="badge"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 font-medium">
                  تدعم مهارة: {activeTrait.relatedSkill}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {activeTrait.description}
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-indigo-700 block">
                  🏫 مثال في الحياة المدرسية:
                </span>
                <p className="leading-relaxed">{activeTrait.schoolExample}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نشاط 1: شخصية من بلدي (Authentic from textbook) */}
      <div className="rounded-2xl bg-white border-2 border-rose-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-lg">
              نَشاط 1
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              شَخْصِيَّةٌ مِنْ بَلَدِي
            </h3>
          </div>
          <span className="text-xs text-rose-800 bg-rose-50 px-3 py-1 rounded-full font-medium border border-rose-100">
            هدف النشاط: تعزيز فهم مفهوم القيادة، وتطوير مهارات البحث والتحليل والتقديم
          </span>
        </div>

        {/* Steps Guide from textbook with Integrated TTS */}
        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-rose-900">خطوات العمل المنهجية (5 خطوات):</h4>
            <TTSControlBar
              text="نشاط 1: شخصية من بلدي. خطوات العمل: 1. أشارك مجموعتي في اختيار شخصية قيادية في أحد المجالات. 2. نتفق على تحديد قائد للمجموعة يوزع المهام على الفريق. 3. أتعاون مع أفراد مجموعتي على البحث عن المعلومات المطلوبة. 4. نناقش مع المجموعات الأخرى ما نتوصل إليه. 5. أحتفظ بنسخة من العرض في ملف إنجازي."
              label="استمع لخطوات النشاط"
              variant="badge"
            />
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 list-decimal list-inside">
            <li>أشارك مجموعتي في اختيار شخصية قيادية في أحد المجالات المندرجة في ورقة العمل.</li>
            <li>أتفق مع مجموعتي على تحديد قائد للمجموعة؛ ليوزع المهام على الفريق.</li>
            <li>أتعاون مع أفراد مجموعتي على البحث عن المعلومات المطلوبة عن الشخصية القيادية.</li>
            <li>نناقش مع المجموعات الأخرى ما نتوصل إليه في جلسة الحوار الصفي.</li>
            <li>أحتفظ بنسخة من العرض في ملف إنجازي الخاص.</li>
          </ol>
        </div>

        {/* Interactive Group Builder */}
        <form onSubmit={handleSaveActivity} className="space-y-6 pt-2">
          {/* Step 1: Field Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              الخطوة 1: اختر المجال المناسب للشخصية القيادية:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {ACTIVITY_1_FIELDS.map((field) => {
                const isSelected = selectedFieldId === field.id;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setSelectedFieldId(field.id);
                    }}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{field.name}</span>
                    <span className={`text-[10px] block mt-1 line-clamp-2 ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                      {field.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Roles Distribution */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              الخطوة 2: توزيع أدوار الفريق (تطبيق عملي لمهارة التنظيم القيادي):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">قائد المجموعة (الموجّه):</span>
                <input
                  type="text"
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  placeholder="اسم الطالب (القائد)..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">مسؤول البحث وجمع المعلومات:</span>
                <input
                  type="text"
                  value={researcher}
                  onChange={(e) => setResearcher(e.target.value)}
                  placeholder="اسم الباحث..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">المتحدث الرسمي أمام الصف:</span>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="اسم المتحدث..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Leader Character & Traits & Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                اسم الشخصية القيادية المختارة:
              </label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="مثال: جلالة الملكة رانيا، د. يعقوب ناصر الدين، البطل أحمد أبو غوش..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                الصفات القيادية التي تميزها (اختر ما يناسبها):
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'الشجاعة',
                  'الثقة بالنفس',
                  'الاتصال والتواصل',
                  'التخطيط للمستقبل',
                  'التحفيز',
                  'التواضع',
                  'المبادرة',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleToggleTraitTag(t)}
                    className={`text-xs px-2.5 py-1 rounded-md border cursor-pointer transition-colors ${
                      traitsList.includes(t)
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {traitsList.includes(t) ? '✓ ' : '+ '}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              أبرز إنجازاتها وأثرها في خدمة المجتمع والوطن:
            </label>
            <textarea
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="اكتب نبذة موجزة عما حققته هذه الشخصية وكيف ألهمت الآخرين..."
              rows={3}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={!leaderName.trim() || !achievements.trim()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <FolderHeart className="w-4 h-4" />
              <span>توليد بطاقة العرض وحفظها في ملف إنجازي (+15 نقطة)</span>
            </button>

            {isSaved && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                تم حفظ بطاقة النشاط بنجاح
              </span>
            )}
          </div>
        </form>

        {/* أتحقّق Box for Activity 1 from textbook */}
        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>أَتَحَقَّقُ: ما المهاراتُ التي امتلكها قائد/ قائدة الفريقِ عندَ تقديمِ العرض؟</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCheckModel(!showCheckModel)}
              className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              {showCheckModel ? 'إخفاء الإجابة' : 'عرض الإجابة النموذجية'}
            </button>
          </div>

          <input
            type="text"
            value={checkAnswer}
            onChange={(e) => setCheckAnswer(e.target.value)}
            placeholder="اكتب المهارات التي تظهر أثناء التقديم (مثل: الثقة بالنفس، فصاحة الحديث، لغة الجسد)..."
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
          />

          {showCheckModel && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 animate-fadeIn space-y-1">
              <strong>الإجابة النموذجية:</strong>
              <p>
                امتلك القائد: الثقة بالنفس وطلاقة الحديث، التواصل الفعّال، القدرة على الإقناع، تنظيم الأفكار وتوزيع وقت العرض، والاستماع لأسئلة الزملاء والإجابة عنها بروح إيجابية.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
