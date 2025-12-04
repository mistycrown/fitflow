
export enum ExerciseCategory {
  PUSHUPS = '俯卧撑',
  SQUATS = '深蹲',
  PULLUPS = '引体向上',
  LEG_RAISES = '举腿',
  BRIDGES = '桥',
  HANDSTAND_PUSHUPS = '倒立撑',
  CUSTOM = '自定义'
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup?: string;
  isFavorite?: boolean;
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

export type ViewState = 'TODAY' | 'PLAN' | 'LIBRARY' | 'HISTORY';
