
import React, { useState } from 'react';
import { Exercise, ExerciseCategory, WorkoutTemplate } from '../types';
import { Search, Plus, Dumbbell, X, Layers, Trash2, Heart, Save, Edit2, ArrowDownToLine, ArrowUpFromLine, MoveVertical, Zap, Star, Activity } from 'lucide-react';
import { Button } from './Button';

interface LibraryViewProps {
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  onAddExercise: (exercise: Exercise) => void;
  onDeleteExercise: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onAddTemplate: (template: WorkoutTemplate) => void;
  onUpdateTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

type TabState = 'EXERCISES' | 'TEMPLATES' | 'FAVORITES';

const getCategoryIcon = (category: ExerciseCategory) => {
  switch (category) {
    case ExerciseCategory.PUSHUPS:
      return <Dumbbell size={20} />;
    case ExerciseCategory.SQUATS:
      return <ArrowDownToLine size={20} />;
    case ExerciseCategory.PULLUPS:
      return <ArrowUpFromLine size={20} />;
    case ExerciseCategory.LEG_RAISES:
      return <MoveVertical size={20} />;
    case ExerciseCategory.BRIDGES:
      return <Activity size={20} />;
    case ExerciseCategory.HANDSTAND_PUSHUPS:
      return <Zap size={20} />;
    case ExerciseCategory.CUSTOM:
    default:
      return <Star size={20} />;
  }
};

export const LibraryView: React.FC<LibraryViewProps> = ({
  exercises, templates, onAddExercise, onDeleteExercise, onToggleFavorite, onAddTemplate, onUpdateTemplate, onDeleteTemplate
}) => {
  const [activeTab, setActiveTab] = useState<TabState>('EXERCISES');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | 'ALL'>('ALL');

  // Modals state
  const [showAddExModal, setShowAddExModal] = useState(false);
  const [showAddTplModal, setShowAddTplModal] = useState(false);

  // New Exercise State
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState<ExerciseCategory>(ExerciseCategory.CUSTOM);
  const [newExerciseMuscle, setNewExerciseMuscle] = useState('');

  // Template State (Create or Edit)
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [tplDraftItems, setTplDraftItems] = useState<{ exerciseId: string; sets: number; reps: number }[]>([]);
  const [tplPickerTab, setTplPickerTab] = useState<ExerciseCategory | 'COMMON' | 'CUSTOM'>('COMMON');

  // Filter main list (Handles both EXERCISES and FAVORITES tabs)
  const filteredExercises = exercises.filter(e => {
    // 1. Tab Filter
    if (activeTab === 'FAVORITES' && !e.isFavorite) return false;

    // 2. Search Filter
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.muscleGroup?.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Category Filter (Only applies to EXERCISES tab)
    const matchesCategory = activeTab !== 'EXERCISES' || activeCategory === 'ALL' || e.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter Picker list for Template Modal
  const pickerExercises = exercises.filter(e => {
    if (tplPickerTab === 'COMMON') return e.category !== ExerciseCategory.CUSTOM;
    return e.category === tplPickerTab;
  });

  const handleAddExerciseAction = () => {
    if (!newExerciseName) return;
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: newExerciseName,
      category: newExerciseCategory,
      muscleGroup: newExerciseMuscle || '综合',
      isFavorite: false
    };
    onAddExercise(newExercise);
    setShowAddExModal(false);
    setNewExerciseName('');
    setNewExerciseMuscle('');
  };

  const openNewTemplateModal = () => {
    setEditingTemplateId(null);
    setNewTemplateName('');
    setTplDraftItems([]);
    setShowAddTplModal(true);
  };

  const openEditTemplateModal = (tpl: WorkoutTemplate) => {
    setEditingTemplateId(tpl.id);
    setNewTemplateName(tpl.name);
    setTplDraftItems(tpl.items.map(item => ({
      exerciseId: item.exerciseId,
      sets: item.defaultSets,
      reps: item.defaultReps
    })));
    setShowAddTplModal(true);
  };

  const handleSaveTemplateAction = () => {
    if (!newTemplateName || tplDraftItems.length === 0) return;

    const templateData: WorkoutTemplate = {
      id: editingTemplateId || crypto.randomUUID(),
      name: newTemplateName,
      items: tplDraftItems.map(item => ({
        exerciseId: item.exerciseId,
        defaultSets: item.sets,
        defaultReps: item.reps
      }))
    };

    if (editingTemplateId) {
      onUpdateTemplate(templateData);
    } else {
      onAddTemplate(templateData);
    }

    setShowAddTplModal(false);
    setEditingTemplateId(null);
    setNewTemplateName('');
    setTplDraftItems([]);
  };

  const addToDraft = (exId: string) => {
    setTplDraftItems(prev => [...prev, { exerciseId: exId, sets: 3, reps: 10 }]);
  };

  const removeFromDraft = (index: number) => {
    setTplDraftItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateDraftItem = (index: number, field: 'sets' | 'reps', value: number) => {
    setTplDraftItems(prev => prev.map((item, i) => {
      if (i === index) return { ...item, [field]: value };
      return item;
    }));
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-zinc-900">库管理</h2>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-100 rounded-xl mb-4">
        <button
          onClick={() => setActiveTab('EXERCISES')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'EXERCISES' ? 'bg-white text-indigo-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          动作库
        </button>
        <button
          onClick={() => setActiveTab('FAVORITES')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'FAVORITES' ? 'bg-white text-indigo-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          我的收藏
        </button>
        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'TEMPLATES' ? 'bg-white text-indigo-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          我的模板
        </button>
      </div>

      {activeTab === 'TEMPLATES' ? (
        /* TEMPLATES VIEW */
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={openNewTemplateModal} size="sm" icon={<Plus size={16} />}>
              新建模板
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 pb-8">
            {templates.length === 0 && <div className="text-center text-zinc-500 text-sm py-10">暂无模板，点击右上角新建</div>}
            {templates.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => openEditTemplateModal(tpl)}
                className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm relative cursor-pointer hover:border-indigo-500/50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Layers size={20} className="text-purple-500" />
                    <h3 className="font-bold text-zinc-900">{tpl.name}</h3>
                    <Edit2 size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(tpl.id);
                    }}
                    className="text-zinc-300 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-xs text-zinc-500 flex flex-wrap gap-1">
                  {tpl.items.map((item, idx) => {
                    const ex = exercises.find(e => e.id === item.exerciseId);
                    return (
                      <span key={idx} className="bg-zinc-100 px-2 py-1 rounded-md">
                        {ex?.name || '未知'} <span className="text-zinc-400">({item.defaultSets}x{item.defaultReps})</span>
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* EXERCISES & FAVORITES VIEW */
        <>
          <div className="flex justify-between items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder={activeTab === 'FAVORITES' ? "搜索收藏的动作..." : "搜索动作..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-10 pr-4 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {/* Only show Add button in generic Exercises tab */}
            {activeTab === 'EXERCISES' && (
              <Button onClick={() => setShowAddExModal(true)} size="sm" icon={<Plus size={16} />}>
                新建
              </Button>
            )}
          </div>

          {/* Only show categories in generic Exercises tab */}
          {activeTab === 'EXERCISES' && (
            <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeCategory === 'ALL' ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-600 border-zinc-200'}`}
              >
                全部
              </button>
              {Object.values(ExerciseCategory).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeCategory === cat ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-zinc-600 border-zinc-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 pb-8">
            {filteredExercises.length === 0 && (
              <div className="text-center text-zinc-400 text-sm py-10">
                {activeTab === 'FAVORITES' ? '暂无收藏的动作' : '没有找到匹配的动作'}
              </div>
            )}
            {filteredExercises.map(exercise => (
              <div key={exercise.id} className="bg-white p-3 rounded-xl flex justify-between items-center border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="bg-zinc-50 p-2 rounded-lg text-indigo-500/80">
                    {getCategoryIcon(exercise.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-textMain text-sm flex items-center gap-2">
                      {exercise.name}
                      {exercise.isFavorite && <Heart size={12} className="fill-red-500 text-red-500" />}
                    </h3>
                    <p className="text-xs text-textMuted">{exercise.category} • {exercise.muscleGroup}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onToggleFavorite(exercise.id)}
                    className={`p-2 transition-colors ${exercise.isFavorite ? 'text-red-500' : 'text-zinc-300 hover:text-red-400'}`}
                  >
                    <Heart size={18} className={exercise.isFavorite ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={() => onDeleteExercise(exercise.id)}
                    className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Exercise Modal */}
      {showAddExModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white shadow-xl border border-zinc-200 w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-textMain">添加新动作</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-textMuted block mb-1">动作名称</label>
                <input
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-textMain focus:ring-2 focus:ring-primary focus:outline-none"
                  value={newExerciseName}
                  onChange={e => setNewExerciseName(e.target.value)}
                  placeholder="例如: 单臂俯卧撑"
                />
              </div>
              <div>
                <label className="text-xs text-textMuted block mb-1">部位分类</label>
                <select
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-textMain focus:ring-2 focus:ring-primary focus:outline-none"
                  value={newExerciseCategory}
                  onChange={(e) => setNewExerciseCategory(e.target.value as ExerciseCategory)}
                >
                  {Object.values(ExerciseCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-textMuted block mb-1">具体肌群/备注</label>
                <input
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-textMain focus:ring-2 focus:ring-primary focus:outline-none"
                  value={newExerciseMuscle}
                  onChange={e => setNewExerciseMuscle(e.target.value)}
                  placeholder="例如: 胸大肌上束"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="ghost" onClick={() => setShowAddExModal(false)}>取消</Button>
              <Button onClick={handleAddExerciseAction}>保存</Button>
            </div>
          </div>
        </div>
      )}

      {/* NEW/EDIT Template Modal (Split View) */}
      {showAddTplModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white shadow-xl border border-zinc-200 w-[90%] max-w-sm h-[80vh] rounded-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-textMain">{editingTemplateId ? '编辑模板' : '新建模板'}</h3>
              <button onClick={() => setShowAddTplModal(false)} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
            </div>

            {/* Top: Editor Section */}
            <div className="p-4 flex-1 overflow-y-auto bg-zinc-50 border-b border-zinc-200 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">模板名称</label>
                <input
                  className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-textMain font-medium focus:ring-2 focus:ring-primary focus:outline-none placeholder-zinc-300"
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  placeholder="例如: 胸部基础训练A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">已添加动作 ({tplDraftItems.length})</label>
                {tplDraftItems.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-sm bg-white rounded-lg border border-dashed border-zinc-200">
                    点击下方列表添加动作
                  </div>
                )}
                {tplDraftItems.map((item, index) => {
                  const ex = exercises.find(e => e.id === item.exerciseId);
                  return (
                    <div key={index} className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm text-textMain">{ex?.name}</span>
                        <button onClick={() => removeFromDraft(index)} className="text-zinc-300 hover:text-red-500"><X size={16} /></button>
                      </div>
                      <div className="flex gap-2 text-xs items-center">
                        <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                          <span className="text-zinc-500">组数</span>
                          <input
                            type="number"
                            value={item.sets}
                            onChange={(e) => updateDraftItem(index, 'sets', parseInt(e.target.value) || 0)}
                            className="w-8 text-center bg-transparent font-bold text-textMain focus:outline-none"
                          />
                        </div>
                        <span className="text-zinc-300">x</span>
                        <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                          <span className="text-zinc-500">次数</span>
                          <input
                            type="number"
                            value={item.reps}
                            onChange={(e) => updateDraftItem(index, 'reps', parseInt(e.target.value) || 0)}
                            className="w-8 text-center bg-transparent font-bold text-textMain focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Picker Section */}
            <div className="h-1/3 flex flex-col bg-white">
              <div className="p-2 border-b border-zinc-100 flex gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setTplPickerTab('COMMON')} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${tplPickerTab === 'COMMON' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'}`}>常用</button>
                {Object.values(ExerciseCategory).filter(c => c !== ExerciseCategory.CUSTOM).map(c => (
                  <button key={c} onClick={() => setTplPickerTab(c)} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${tplPickerTab === c ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-600'}`}>{c}</button>
                ))}
                <button onClick={() => setTplPickerTab(ExerciseCategory.CUSTOM)} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${tplPickerTab === ExerciseCategory.CUSTOM ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-600'}`}>自定义</button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {pickerExercises.map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => addToDraft(ex.id)}
                    className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg cursor-pointer border border-transparent hover:border-zinc-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Plus size={14} className="text-primary" />
                      <span className="text-sm text-textMain">{ex.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{ex.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 bg-white">
              <Button onClick={handleSaveTemplateAction} className="w-full" icon={<Save size={18} />}>
                {editingTemplateId ? '更新模板' : '保存模板'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
