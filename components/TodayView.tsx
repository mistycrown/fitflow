
import React, { useState } from 'react';
import { DailyWorkout, Exercise, WorkoutSet } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { Button } from './Button';

interface TodayViewProps {
  workout: DailyWorkout | null;
  exercises: Exercise[];
  onUpdateWorkout: (workout: DailyWorkout) => void;
  onAddExercise: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ workout, exercises, onUpdateWorkout, onAddExercise }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleSetComplete = (itemId: string, setId: string) => {
    if (!workout) return;

    const updatedItems = workout.items.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        sets: item.sets.map(set => {
          if (set.id !== setId) return set;
          return { ...set, completed: !set.completed };
        })
      };
    });

    onUpdateWorkout({ ...workout, items: updatedItems });
  };

  const updateSetData = (itemId: string, setId: string, value: string) => {
    if (!workout) return;
    const updatedItems = workout.items.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        sets: item.sets.map(set => {
          if (set.id !== setId) return set;
          return { ...set, reps: value };
        })
      };
    });
    onUpdateWorkout({ ...workout, items: updatedItems });
  };

  const addSet = (itemId: string) => {
    if (!workout) return;
    const updatedItems = workout.items.map(item => {
      if (item.id !== itemId) return item;
      const lastSet = item.sets[item.sets.length - 1];
      const newSet: WorkoutSet = {
        id: crypto.randomUUID(),
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      };
      return { ...item, sets: [...item.sets, newSet] };
    });
    onUpdateWorkout({ ...workout, items: updatedItems });
  };

  const removeSet = (itemId: string, setId: string) => {
    if (!workout) return;
    const updatedItems = workout.items.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, sets: item.sets.filter(s => s.id !== setId) };
    });
    onUpdateWorkout({ ...workout, items: updatedItems });
  };

  if (!workout || workout.items.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-6 no-scrollbar">
        <div className="bg-white p-8 rounded-full shadow-soft animate-fade-in">
          <CheckCircle2 size={64} className="text-primary/20" />
        </div>
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-textMain">今日暂无训练计划</h2>
          <p className="text-textMuted">今天是休息日，或者开始新的训练？</p>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Button onClick={onAddExercise} icon={<Plus size={18} />} size="lg" className="shadow-glow">
            添加动作
          </Button>
        </div>
      </div>
    );
  }

  // Calculate progress
  const totalSets = workout.items.reduce((acc, item) => acc + item.sets.length, 0);
  const completedSets = workout.items.reduce((acc, item) => acc + item.sets.filter(s => s.completed).length, 0);
  const progress = totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 no-scrollbar pb-24">
      {/* Header Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-6 shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
          <Trophy size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold">今日训练</h1>
              <p className="text-indigo-200 text-sm mt-1 font-medium">{new Date(workout.date).toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold tracking-tight">{progress}%</span>
            </div>
          </div>
          <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-white h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {workout.items.map((item, index) => {
          const exercise = exercises.find(e => e.id === item.exerciseId) || { name: '未知动作', muscleGroup: '综合' };
          const isExpanded = expandedItems[item.id] ?? true;
          const completedCount = item.sets.filter(s => s.completed).length;
          const isFullyComplete = completedCount === item.sets.length && item.sets.length > 0;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 ${isFullyComplete ? 'border-indigo-500/30 shadow-md' : 'border-zinc-100'}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50/50 transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isFullyComplete ? 'bg-indigo-500 text-white shadow-glow' : 'bg-zinc-100 text-zinc-400'}`}>
                    {isFullyComplete ? <CheckCircle2 size={24} /> : <span className="font-bold text-lg">{exercise.name.substring(0, 1)}</span>}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isFullyComplete ? 'text-indigo-600' : 'text-zinc-900'}`}>{exercise.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium bg-zinc-100 inline-block px-2 py-0.5 rounded-md mt-1">{item.sets.length} 组 • {exercise.muscleGroup}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-zinc-100' : ''}`}>
                  <ChevronDown size={20} className="text-zinc-400" />
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="grid grid-cols-10 gap-3 text-xs text-zinc-400 uppercase tracking-wider mb-2 text-center font-bold px-2">
                    <div className="col-span-2">组数</div>
                    <div className="col-span-5">次数</div>
                    <div className="col-span-3">状态</div>
                  </div>

                  {item.sets.map((set, index) => (
                    <div key={set.id} className={`grid grid-cols-10 gap-3 items-center text-center py-3 rounded-xl transition-all duration-300 ${set.completed ? 'bg-indigo-500/5' : 'bg-zinc-50'}`}>
                      <div className="col-span-2 text-sm font-bold text-zinc-400">#{index + 1}</div>
                      <div className="col-span-5">
                        <div className="relative mx-auto max-w-[80px]">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSetData(item.id, set.id, e.target.value)}
                            className={`w-full text-center bg-white rounded-lg py-1.5 font-mono text-lg font-bold shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all ${set.completed ? 'text-indigo-600' : 'text-zinc-900'}`}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-center items-center space-x-2">
                        <button
                          onClick={() => toggleSetComplete(item.id, set.id)}
                          className={`p-2 rounded-full transition-all duration-300 active:scale-90 ${set.completed ? 'text-indigo-500 bg-white shadow-sm' : 'text-zinc-300 hover:text-zinc-400'}`}
                        >
                          {set.completed ? <CheckCircle2 size={28} className="fill-current" /> : <Circle size={28} strokeWidth={1.5} />}
                        </button>
                        {!set.completed && (
                          <button onClick={() => removeSet(item.id, set.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 flex justify-center">
                    <Button variant="ghost" size="sm" onClick={() => addSet(item.id)} className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 w-full border border-dashed border-indigo-200">
                      <Plus size={14} className="mr-1" /> 添加一组
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-6 flex justify-center pb-8">
        <Button variant="secondary" onClick={onAddExercise} icon={<Plus size={18} />} className="shadow-soft bg-white/80 backdrop-blur-sm">
          添加更多动作
        </Button>
      </div>
    </div>
  );
};
