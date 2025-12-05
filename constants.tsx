
import { Exercise, ExerciseCategory, ExerciseType } from './types';

export const INITIAL_EXERCISES: Exercise[] = [
  // 胸部 (Chest)
  { id: 'chest-1', name: '标准俯卧撑', category: ExerciseCategory.CHEST, muscleGroup: '胸大肌 / 三头肌', type: ExerciseType.REPS },
  { id: 'chest-2', name: '上斜俯卧撑', category: ExerciseCategory.CHEST, muscleGroup: '胸大肌下束', type: ExerciseType.REPS },

  // 背部 (Back)
  { id: 'back-1', name: '标准引体向上', category: ExerciseCategory.BACK, muscleGroup: '背阔肌 / 二头肌', type: ExerciseType.REPS },

  // 腿部 (Legs)
  { id: 'legs-1', name: '徒手深蹲', category: ExerciseCategory.LEGS, muscleGroup: '股四头肌 / 臀大肌', type: ExerciseType.REPS },
  { id: 'legs-2', name: '箭步蹲', category: ExerciseCategory.LEGS, muscleGroup: '股四头肌 / 臀大肌', type: ExerciseType.REPS },
  { id: 'legs-3', name: '臀桥', category: ExerciseCategory.LEGS, muscleGroup: '臀大肌 / 腘绳肌', type: ExerciseType.REPS },
  { id: 'legs-4', name: '单腿深蹲', category: ExerciseCategory.LEGS, muscleGroup: '腿部综合', type: ExerciseType.REPS },
  { id: 'legs-5', name: '提踵', category: ExerciseCategory.LEGS, muscleGroup: '小腿三头肌', type: ExerciseType.REPS },
  { id: 'legs-6', name: '靠墙静蹲', category: ExerciseCategory.LEGS, muscleGroup: '股四头肌', type: ExerciseType.DURATION },

  // 核心 (Core)
  { id: 'core-1', name: '卷腹', category: ExerciseCategory.CORE, muscleGroup: '腹直肌上部', type: ExerciseType.REPS },
  { id: 'core-2', name: '仰卧举腿', category: ExerciseCategory.CORE, muscleGroup: '腹直肌下部', type: ExerciseType.REPS },
  { id: 'core-3', name: '平板支撑', category: ExerciseCategory.CORE, muscleGroup: '核心稳定性', type: ExerciseType.DURATION },
  { id: 'core-4', name: '侧支撑', category: ExerciseCategory.CORE, muscleGroup: '腹外斜肌', type: ExerciseType.DURATION },
  { id: 'core-5', name: '俄罗斯转体', category: ExerciseCategory.CORE, muscleGroup: '腹外斜肌', type: ExerciseType.REPS },
  { id: 'core-6', name: '登山跑', category: ExerciseCategory.CORE, muscleGroup: '核心 / 心肺', type: ExerciseType.DURATION },
  { id: 'core-7', name: 'V字两头起', category: ExerciseCategory.CORE, muscleGroup: '腹直肌整体', type: ExerciseType.REPS },

  // 肩部 (Shoulders)
  { id: 'shoulders-1', name: '倒立撑', category: ExerciseCategory.SHOULDERS, muscleGroup: '三角肌 / 三头肌', type: ExerciseType.REPS },
  { id: 'shoulders-2', name: '折刀俯卧撑', category: ExerciseCategory.SHOULDERS, muscleGroup: '三角肌前束', type: ExerciseType.REPS },

  // 手臂 (Arms)
  { id: 'arms-1', name: '凳上反屈伸', category: ExerciseCategory.ARMS, muscleGroup: '三头肌', type: ExerciseType.REPS },
  { id: 'arms-2', name: '三头肌撑起', category: ExerciseCategory.ARMS, muscleGroup: '三头肌', type: ExerciseType.REPS },

  // 有氧/全身 (Cardio/Full Body)
  { id: 'cardio-1', name: '波比跳', category: ExerciseCategory.FULL_BODY, muscleGroup: '全身 / 心肺', type: ExerciseType.REPS },
  { id: 'cardio-2', name: '开合跳', category: ExerciseCategory.CARDIO, muscleGroup: '全身 / 心肺', type: ExerciseType.DURATION },
  { id: 'cardio-3', name: '高抬腿', category: ExerciseCategory.CARDIO, muscleGroup: '腿部 / 心肺', type: ExerciseType.DURATION }
];
