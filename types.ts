
export enum ExerciseCategory {
  CHEST = '胸部',
  BACK = '背部',
  LEGS = '腿部',
  CORE = '核心',
  ARMS = '手臂',
  SHOULDERS = '肩部',
  CARDIO = '有氧',
  FULL_BODY = '全身',
  CUSTOM = '自定义'
}

export enum ExerciseType {
  REPS = 'REPS',
  DURATION = 'DURATION'
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup?: string;
  isFavorite?: boolean;
  type?: ExerciseType;
}

export interface WorkoutSet {
  id: string;
  reps: number | string;
  completed: boolean;
}

export interface WorkoutItem {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface DailyWorkout {
  date: string; // YYYY-MM-DD
  items: WorkoutItem[];
  completed?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  items: {
    exerciseId: string;
    defaultSets: number;
    defaultReps: number;
  }[];
}

export type ExercisePreferences = Record<string, { defaultSets: number; defaultReps: number }>;

export type ViewState = 'TODAY' | 'PLAN' | 'LIBRARY' | 'HISTORY' | 'SETTINGS';

export type AiProvider = 'GEMINI' | 'DEEPSEEK' | 'SILICONFLOW' | 'CUSTOM';

export interface AiSettings {
  provider: AiProvider;
  apiKey: string;
  baseUrl?: string;
  modelName?: string;
}
