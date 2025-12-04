import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TodayView } from './components/TodayView';
import { PlanView } from './components/PlanView';
import { LibraryView } from './components/LibraryView';
import { HistoryView } from './components/HistoryView';
import { Exercise, DailyWorkout, ViewState, WorkoutItem, WorkoutTemplate, ExercisePreferences } from './types';
import { INITIAL_EXERCISES } from './constants';

// Helper to get local date string YYYY-MM-DD
export const getLocalDateKey = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const App: React.FC = () => {
  // Global State
  const [view, setView] = useState<ViewState>('TODAY');
  
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('fitflow_exercises_v3');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [workouts, setWorkouts] = useState<DailyWorkout[]>(() => {
    const saved = localStorage.getItem('fitflow_workouts_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem('fitflow_templates_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [preferences, setPreferences] = useState<ExercisePreferences>(() => {
    const saved = localStorage.getItem('fitflow_preferences_v1');
    return saved ? JSON.parse(saved) : {};
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fitflow_exercises_v3', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('fitflow_workouts_v3', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitflow_templates_v3', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('fitflow_preferences_v1', JSON.stringify(preferences));
  }, [preferences]);

  // Derived State (Use Local Date)
  const todayStr = getLocalDateKey(new Date());
  const todayWorkout = workouts.find(w => w.date === todayStr) || { date: todayStr, items: [] };

  // Handlers
  const handleUpdateToday = (updatedWorkout: DailyWorkout) => {
    setWorkouts(prev => {
      const exists = prev.find(w => w.date === updatedWorkout.date);
      if (exists) {
        return prev.map(w => w.date === updatedWorkout.date ? updatedWorkout : w);
      } else {
        return [...prev, updatedWorkout];
      }
    });
  };

  const handleAssignWorkout = (date: string, items: WorkoutItem[]) => {
    setWorkouts(prev => {
        // If workout exists for date, append items. Else create new.
        const existing = prev.find(w => w.date === date);
        if (existing) {
            return prev.map(w => w.date === date ? { ...w, items: [...w.items, ...items] } : w);
        } else {
            return [...prev, { date, items }];
        }
    });
  };

  const handleUpdatePreference = (exerciseId: string, sets: number, reps: number) => {
    setPreferences(prev => ({
      ...prev,
      [exerciseId]: { defaultSets: sets, defaultReps: reps }
    }));
  };

  const handleAddExercise = (newExercise: Exercise) => {
    setExercises(prev => [...prev, newExercise]);
  };

  const handleDeleteExercise = (id: string) => {
      if (confirm("确定要删除这个动作吗?")) {
        setExercises(prev => prev.filter(e => e.id !== id));
      }
  };

  const handleToggleFavorite = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
  };

  const handleAddTemplate = (template: WorkoutTemplate) => {
      setTemplates(prev => [...prev, template]);
  };

  const handleUpdateTemplate = (updatedTemplate: WorkoutTemplate) => {
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const handleDeleteTemplate = (id: string) => {
      if (confirm("确定要删除这个模板吗?")) {
        setTemplates(prev => prev.filter(t => t.id !== id));
      }
  };

  return (
    <Layout currentView={view} onChangeView={setView}>
      {view === 'TODAY' && (
        <TodayView 
          workout={todayWorkout} 
          exercises={exercises}
          onUpdateWorkout={handleUpdateToday}
          onAddExercise={() => setView('PLAN')}
        />
      )}
      {view === 'PLAN' && (
        <PlanView 
          exercises={exercises}
          templates={templates}
          workouts={workouts}
          exercisePreferences={preferences}
          onAddTemplate={handleAddTemplate}
          onAssignWorkout={handleAssignWorkout}
          onUpdatePreference={handleUpdatePreference}
        />
      )}
      {view === 'HISTORY' && (
        <HistoryView 
          workouts={workouts}
          exercises={exercises}
        />
      )}
      {view === 'LIBRARY' && (
        <LibraryView 
          exercises={exercises}
          templates={templates}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onToggleFavorite={handleToggleFavorite}
          onAddTemplate={handleAddTemplate}
          onUpdateTemplate={handleUpdateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )}
    </Layout>
  );
};

export default App;