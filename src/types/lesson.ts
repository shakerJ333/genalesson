/**
 * Lesson types and data structures
 * Lesson 1: Leadership Skills (الدرس الأول: مهارات القيادة)
 */

export interface LessonObjective {
  id: string;
  text: string;
  category: 'معرفي' | 'مهاري' | 'وجداني';
  completed?: boolean;
}

export interface VocabularyTerm {
  termAr: string;
  termEn: string;
  definition: string;
  example: string;
}

export interface ValueItem {
  name: string;
  description: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MatchingItem {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  traitId: string;
}

export interface TraitItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  schoolExample: string;
  relatedSkill: string;
}

export interface SkillItem {
  id: string;
  title: string;
  color: string;
  description: string;
  application: string;
  reflectionQuestion: string;
}

export interface SimulationScenario {
  id: number;
  title: string;
  context: string;
  situation: string;
  options: {
    id: string;
    text: string;
    style: 'تسلطي' | 'قيادي تشاركي' | 'فوضوي / متجاهل';
    feedback: string;
    isOptimal: boolean;
    points: number;
  }[];
}
