
import React, { useState, useMemo } from 'react';
import { DailyWorkout, Exercise, WorkoutTemplate, WorkoutItem, ExerciseCategory, ExercisePreferences, ExerciseType } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Layers, Plus, ClipboardList, X, Save, Heart } from 'lucide-react';
import { Button } from './Button';
import { getLocalDateKey } from '../App';

interface PlanViewProps {
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  workouts: DailyWorkout[];
  exercisePreferences: ExercisePreferences;
  onAddTemplate: (template: WorkoutTemplate) => void;
  onAssignWorkout: (date: string, items: WorkoutItem[]) => void;
  onUpdatePreference: (exerciseId: string, sets: number, reps: number) => void;
  onUpdateWorkout: (workout: DailyWorkout) => void;
}

// Helper to get week days
const getWeekDays = (startDate: Date) => {
  const days = [];
  const day = startDate.getDay();
  const diff = startDate.getDate() - day;
  const sunday = new Date(startDate);
  sunday.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }
  return days;
};

type TabType = 'COMMON' | 'TEMPLATE' | 'FAVORITE' | ExerciseCategory;

export const PlanView: React.FC<PlanViewProps> = ({
  exercises, templates, workouts, exercisePreferences, onAddTemplate, onAssignWorkout, onUpdatePreference, onUpdateWorkout
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>('COMMON');

  // Config Modal State
  const [configItem, setConfigItem] = useState<{ type: 'EXERCISE' | 'TEMPLATE', data: Exercise | WorkoutTemplate } | null>(null);
  const [configSets, setConfigSets] = useState(3);
  const [configReps, setConfigReps] = useState(10);

  // Save Template Modal State
  const [showSaveTplModal, setShowSaveTplModal] = useState(false);
  const [saveTplName, setSaveTplName] = useState('');

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

  const changeWeek = (offset: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (offset * 7));
    setCurrentWeekStart(newStart);
  };

  // Use local date key helper
  const dateKey = getLocalDateKey(selectedDate);

  // Find workout for selected date
  const selectedDayWorkout = workouts.find(w => w.date === dateKey);

  // Calculate Usage Frequency for Sorting
  const usageMap = useMemo(() => {
    const map = new Map<string, number>();
    workouts.forEach(w => {
      w.items.forEach(item => {
        map.set(item.exerciseId, (map.get(item.exerciseId) || 0) + 1);
      });
    });
    return map;
  }, [workouts]);

  // Filter Logic
  const filteredExercises = useMemo(() => {
    if (activeTab === 'COMMON') {
      return exercises
        .filter(e => e.category !== ExerciseCategory.CUSTOM)
        .sort((a, b) => {
          const freqA = usageMap.get(a.id) || 0;
          const freqB = usageMap.get(b.id) || 0;
          if (freqB !== freqA) return freqB - freqA;
          return 0;
        });
    }
    if (activeTab === 'TEMPLATE') return [];
    if (activeTab === 'FAVORITE') return exercises.filter(e => e.isFavorite);
    return exercises.filter(e => e.category === activeTab);
  }, [activeTab, exercises, usageMap]);

  // Actions
  const openAddModal = (item: { type: 'EXERCISE' | 'TEMPLATE', data: Exercise | WorkoutTemplate }) => {
    setConfigItem(item);
    if (item.type === 'EXERCISE') {
      const ex = item.data as Exercise;
      const pref = exercisePreferences[ex.id];
      setConfigSets(pref?.defaultSets || 3);
      setConfigReps(pref?.defaultReps || 10);
    } else {
      setConfigSets(3);
      setConfigReps(10);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, item: { type: 'EXERCISE' | 'TEMPLATE', data: Exercise | WorkoutTemplate }) => {
    e.stopPropagation(); // Prevent opening modal

    if (item.type === 'EXERCISE') {
      const ex = item.data as Exercise;
      const pref = exercisePreferences[ex.id];
      const sets = pref?.defaultSets || 3;
      const reps = pref?.defaultReps || 10;

      const newItem: WorkoutItem = {
        id: crypto.randomUUID(),
        exerciseId: ex.id,
        sets: Array.from({ length: sets }).map(() => ({
          id: crypto.randomUUID(),
          reps: reps,
          completed: false
        }))
      };
      onAssignWorkout(dateKey, [newItem]);
    } else {
      const tpl = item.data as WorkoutTemplate;
      const items: WorkoutItem[] = tpl.items.map(tItem => ({
        id: crypto.randomUUID(),
        exerciseId: tItem.exerciseId,
        sets: Array.from({ length: tItem.defaultSets || 3 }).map(() => ({
          id: crypto.randomUUID(),
          reps: tItem.defaultReps || 10,
          completed: false
        }))
      }));
      onAssignWorkout(dateKey, items);
    }
  };

  const handleConfirmAdd = () => {
    if (!configItem) return;

    if (configItem.type === 'EXERCISE') {
      const ex = configItem.data as Exercise;

      // Update Preference
      onUpdatePreference(ex.id, configSets, configReps);

      const newItem: WorkoutItem = {
        id: crypto.randomUUID(),
        exerciseId: ex.id,
        sets: Array.from({ length: configSets }).map(() => ({
          id: crypto.randomUUID(),
          reps: configReps,
          completed: false
        }))
      };
      onAssignWorkout(dateKey, [newItem]);
    } else {
      const tpl = configItem.data as WorkoutTemplate;
      const items: WorkoutItem[] = tpl.items.map(tItem => ({
        id: crypto.randomUUID(),
        exerciseId: tItem.exerciseId,
        sets: Array.from({ length: tItem.defaultSets || configSets }).map(() => ({
          id: crypto.randomUUID(),
          reps: tItem.defaultReps || configReps,
          completed: false
        }))
      }));
      onAssignWorkout(dateKey, items);
    }

    setConfigItem(null);
  };

  const openSaveTemplateModal = () => {
    if (!selectedDayWorkout || selectedDayWorkout.items.length === 0) {
      alert("请先添加动作到今日安排");
      return;
    }
    setSaveTplName(`${selectedDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} 训练`);
    setShowSaveTplModal(true);
  };

  const handleConfirmSaveTemplate = () => {
    if (saveTplName && selectedDayWorkout) {
      const newTemplate: WorkoutTemplate = {
        id: crypto.randomUUID(),
        name: saveTplName,
        items: selectedDayWorkout.items.map(item => {
          const firstSet = item.sets[0];
          return {
            exerciseId: item.exerciseId,
            defaultSets: item.sets.length,
            defaultReps: firstSet ? Number(firstSet.reps) : 10
          };
        })
      };
      onAddTemplate(newTemplate);
      setShowSaveTplModal(false);
      setActiveTab('TEMPLATE'); // Switch to template tab to show it
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 relative overflow-hidden">

      {/* --- TOP: Calendar Section --- */}
      <div className="bg-white p-4 pb-2 shadow-sm border-b border-zinc-200 sticky top-0 z-10 flex-none">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <CalendarIcon size={18} className="text-primary" />
            {currentWeekStart.toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-1">
            <button onClick={() => changeWeek(-1)} className="p-1 rounded hover:bg-zinc-100 text-zinc-500"><ChevronLeft size={20} /></button>
            <button onClick={() => {
              const now = new Date();
              setCurrentWeekStart(now);
              setSelectedDate(now);
            }} className="text-xs font-medium px-2 py-1 rounded bg-zinc-100 text-zinc-600">本周</button>
            <button onClick={() => changeWeek(1)} className="p-1 rounded hover:bg-zinc-100 text-zinc-500"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dKey = getLocalDateKey(day);
            const isSelected = dKey === dateKey;
            const isToday = dKey === getLocalDateKey(new Date());
            const hasWorkout = workouts.some(w => w.date === dKey && w.items.length > 0);

            let dayClassName = "flex flex-col items-center justify-center py-2 rounded-2xl cursor-pointer transition-all border relative ";
            if (isSelected) {
              dayClassName += "bg-primary text-white border-primary shadow-md transform scale-105";
            } else if (isToday) {
              dayClassName += "text-primary font-bold bg-zinc-50 border-zinc-200";
            } else {
              dayClassName += "bg-transparent text-zinc-900 border-transparent hover:bg-zinc-50";
            }

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={dayClassName}
              >
                <span className="text-[10px] opacity-80">{day.toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
                <span className={`text-sm font-medium ${isSelected ? 'font-bold' : ''}`}>{day.getDate()}</span>
                {hasWorkout && (
                  <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-primary'}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MIDDLE: Selected Day Preview --- */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm mx-1 min-h-[120px] max-h-[200px] overflow-y-auto flex-none">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-2 mb-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-zinc-900">{selectedDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'long' })} 安排</h3>
            {selectedDayWorkout && selectedDayWorkout.items.length > 0 && (
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                {selectedDayWorkout.items.length} 动作
              </span>
            )}
          </div>
          {selectedDayWorkout && selectedDayWorkout.items.length > 0 && (
            <button onClick={openSaveTemplateModal} className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-lg transition-colors">
              <Save size={12} />
              存为模板
            </button>
          )}
        </div>

        <div className="space-y-2">
          {!selectedDayWorkout || selectedDayWorkout.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-zinc-400 gap-2">
              <ClipboardList size={24} className="opacity-50" />
              <span className="text-sm">点击下方动作列表添加</span>
            </div>
          ) : (
            selectedDayWorkout.items.map((item, idx) => {
              const ex = exercises.find(e => e.id === item.exerciseId);
              return (
                <div key={idx} className="flex items-center justify-between text-sm p-2 bg-zinc-50 rounded-xl border border-zinc-100 group">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 rounded text-xs font-bold text-zinc-500">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-zinc-900">{ex?.name || '未知动作'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">{item.sets.length} 组</span>
                    <button
                      onClick={() => {
                        const updatedItems = selectedDayWorkout.items.filter(i => i.id !== item.id);
                        onUpdateWorkout({ ...selectedDayWorkout, items: updatedItems });
                      }}
                      className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- BOTTOM: Library --- */}
      <div className="flex-1 overflow-hidden flex flex-col bg-zinc-50 border-t border-zinc-200 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {/* Tabs */}
        <div className="p-3 border-b border-zinc-200 bg-white overflow-x-auto no-scrollbar flex-none">
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('COMMON')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'COMMON' ? 'bg-primary text-white shadow-md' : 'bg-zinc-100 text-zinc-600'}`}>常用</button>
            <button onClick={() => setActiveTab('TEMPLATE')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'TEMPLATE' ? 'bg-primary text-white shadow-md' : 'bg-zinc-100 text-zinc-600'}`}>模板</button>
            <button onClick={() => setActiveTab('FAVORITE')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${activeTab === 'FAVORITE' ? 'bg-primary text-white shadow-md' : 'bg-zinc-100 text-zinc-600'}`}>
              收藏
            </button>

            {/* Standard Categories */}
            {Object.values(ExerciseCategory).filter(c => c !== ExerciseCategory.CUSTOM).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === cat ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-zinc-100 text-zinc-600'}`}
              >
                {cat}
              </button>
            ))}

            {/* Custom Category */}
            <button onClick={() => setActiveTab(ExerciseCategory.CUSTOM)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === ExerciseCategory.CUSTOM ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-zinc-100 text-zinc-600'}`}>自定义</button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">

          {/* Templates View */}
          {activeTab === 'TEMPLATE' && (
            <div className="grid grid-cols-2 gap-2 pb-4">
              {templates.length === 0 && <div className="col-span-2 text-center text-zinc-400 text-sm py-8">暂无模板，请去动作库添加</div>}
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={(e) => handleQuickAdd(e, { type: 'TEMPLATE', data: template })}
                  className="bg-white border border-zinc-200 p-3 rounded-2xl shadow-sm active:scale-95 transition-transform cursor-pointer flex flex-col justify-between hover:border-primary/50 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Layers size={16} className="text-purple-500 mb-1" />
                    <button
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-medium text-sm text-zinc-900 truncate">{template.name}</span>
                  <span className="text-[10px] text-zinc-500">{template.items.length} 动作</span>
                </div>
              ))}
            </div>
          )}

          {/* Exercises View (Common, Favorite, Categories) */}
          {activeTab !== 'TEMPLATE' && (
            <div className="grid grid-cols-1 gap-2 pb-4">
              {filteredExercises.length === 0 && <div className="text-center text-zinc-400 text-sm py-8">该分类下暂无动作</div>}
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  onClick={() => openAddModal({ type: 'EXERCISE', data: exercise })}
                  className="bg-white border border-zinc-200 p-3 rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer group hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-zinc-900 text-sm flex items-center gap-2">
                        {exercise.name}
                        {exercise.isFavorite && <Heart size={12} className="fill-red-500 text-red-500" />}
                      </div>
                      <div className="text-[10px] text-zinc-500">{exercise.muscleGroup}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(e, { type: 'EXERCISE', data: exercise })}
                    className="w-8 h-8 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- ADD CONFIG MODAL --- */}
      {configItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md pointer-events-auto transition-opacity" onClick={() => setConfigItem(null)}></div>

          {/* Modal */}
          <div className="bg-white w-[85%] max-w-xs rounded-3xl shadow-2xl p-6 pointer-events-auto transform transition-transform animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">{configItem.data.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {configItem.type === 'TEMPLATE' ? '添加整个模板计划' : '设置目标'}
                </p>
              </div>
              <button onClick={() => setConfigItem(null)} className="p-1.5 bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">目标组数 (Sets)</label>
                <input
                  type="number"
                  value={configSets}
                  onChange={(e) => setConfigSets(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center text-lg font-semibold text-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  {configItem.type === 'EXERCISE' && (configItem.data as Exercise).type === ExerciseType.DURATION
                    ? '每组时长 (秒)'
                    : '每组次数 (Reps)'}
                </label>
                <input
                  type="number"
                  value={configReps}
                  onChange={(e) => setConfigReps(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center text-lg font-semibold text-zinc-900 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <Button onClick={handleConfirmAdd} className="w-full shadow-lg shadow-primary/30">
              确认添加
            </Button>
          </div>
        </div>
      )}

      {/* --- SAVE TEMPLATE MODAL --- */}
      {showSaveTplModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md pointer-events-auto" onClick={() => setShowSaveTplModal(false)}></div>
          <div className="bg-white w-[85%] max-w-xs rounded-3xl shadow-2xl p-6 pointer-events-auto transform transition-transform animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">保存为模板</h3>
            <input
              autoFocus
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
              value={saveTplName}
              onChange={e => setSaveTplName(e.target.value)}
              placeholder="输入模板名称"
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setShowSaveTplModal(false)} className="flex-1">取消</Button>
              <Button onClick={handleConfirmSaveTemplate} className="flex-1 shadow-lg shadow-primary/30">保存</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
