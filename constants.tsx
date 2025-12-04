
import { Exercise, ExerciseCategory } from './types';

export const INITIAL_EXERCISES: Exercise[] = [
  // 1. 俯卧撑 (Pushups)
  { id: 'pushups-1', name: '墙壁俯卧撑 (第一式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-2', name: '上斜俯卧撑 (第二式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-3', name: '膝盖俯卧撑 (第三式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-4', name: '半俯卧撑 (第四式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-5', name: '标准俯卧撑 (第五式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-6', name: '窄距俯卧撑 (第六式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-7', name: '偏重俯卧撑 (第七式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-8', name: '单臂半俯卧撑 (第八式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-9', name: '杠杆俯卧撑 (第九式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },
  { id: 'pushups-10', name: '单臂俯卧撑 (第十式)', category: ExerciseCategory.PUSHUPS, muscleGroup: '胸肌 / 三头 / 三角肌前束' },

  // 2. 深蹲 (Squats)
  { id: 'squats-1', name: '肩倒立深蹲 (第一式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-2', name: '折刀深蹲 (第二式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-3', name: '支撑深蹲 (第三式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-4', name: '半深蹲 (第四式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-5', name: '标准深蹲 (第五式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-6', name: '窄距深蹲 (第六式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-7', name: '偏重深蹲 (第七式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-8', name: '单腿半深蹲 (第八式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-9', name: '辅助单腿深蹲 (第九式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },
  { id: 'squats-10', name: '单腿深蹲 (第十式)', category: ExerciseCategory.SQUATS, muscleGroup: '股四头 / 臀部 / 腘绳肌' },

  // 3. 引体向上 (Pullups)
  { id: 'pullups-1', name: '垂直引体 (第一式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-2', name: '水平引体 (第二式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-3', name: '折刀引体 (第三式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-4', name: '半引体向上 (第四式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-5', name: '标准引体向上 (第五式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-6', name: '窄距引体向上 (第六式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-7', name: '偏重引体向上 (第七式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-8', name: '单臂半引体向上 (第八式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-9', name: '辅助单臂引体向上 (第九式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },
  { id: 'pullups-10', name: '单臂引体向上 (第十式)', category: ExerciseCategory.PULLUPS, muscleGroup: '背阔肌 / 二头 / 前臂' },

  // 4. 举腿 (Leg Raises)
  { id: 'legraises-1', name: '坐姿屈膝 (第一式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-2', name: '平卧抬膝 (第二式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-3', name: '平卧屈举腿 (第三式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-4', name: '平卧蛙举腿 (第四式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-5', name: '平卧直举腿 (第五式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-6', name: '悬垂屈膝 (第六式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-7', name: '悬垂屈举腿 (第七式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-8', name: '悬垂蛙举腿 (第八式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-9', name: '悬垂半举腿 (第九式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },
  { id: 'legraises-10', name: '悬垂举腿 (第十式)', category: ExerciseCategory.LEG_RAISES, muscleGroup: '腹直肌 / 腹斜肌' },

  // 5. 桥 (Bridges)
  { id: 'bridges-1', name: '短桥 (第一式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-2', name: '直桥 (第二式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-3', name: '高低桥 (第三式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-4', name: '顶头桥 (第四式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-5', name: '半桥 (第五式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-6', name: '标准桥 (第六式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-7', name: '下行漫步桥 (第七式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-8', name: '上行漫步桥 (第八式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-9', name: '合桥 (第九式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },
  { id: 'bridges-10', name: '铁板桥 (第十式)', category: ExerciseCategory.BRIDGES, muscleGroup: '竖脊肌 / 髋部 / 股二头' },

  // 6. 倒立撑 (Handstand Pushups)
  { id: 'hspu-1', name: '顶墙倒立 (第一式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-2', name: '乌鸦式 (第二式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-3', name: '靠墙倒立 (第三式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-4', name: '半倒立撑 (第四式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-5', name: '标准倒立撑 (第五式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-6', name: '窄距倒立撑 (第六式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-7', name: '偏重倒立撑 (第七式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-8', name: '单臂半倒立撑 (第八式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-9', name: '杠杆倒立撑 (第九式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
  { id: 'hspu-10', name: '单臂倒立撑 (第十式)', category: ExerciseCategory.HANDSTAND_PUSHUPS, muscleGroup: '三角肌 / 三头 / 斜方肌' },
];
