import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TodayView } from './components/TodayView';
import { PlanView } from './components/PlanView';
import { LibraryView } from './components/LibraryView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { Exercise, DailyWorkout, ViewState, WorkoutItem, WorkoutTemplate, ExercisePreferences, AiSettings } from './types';
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
    const saved = localStorage.getItem('fitflow_exercises_v4');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [workouts, setWorkouts] = useState<DailyWorkout[]>(() => {
    const saved = localStorage.getItem('fitflow_workouts_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem('fitflow_templates_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [preferences, setPreferences] = useState<ExercisePreferences>(() => {
    const saved = localStorage.getItem('fitflow_preferences_v1');
    return saved ? JSON.parse(saved) : {};
  });

  const [aiSettings, setAiSettings] = useState<AiSettings>(() => {
    const saved = localStorage.getItem('fitflow_ai_settings');
    return saved ? JSON.parse(saved) : { provider: 'GEMINI', apiKey: '' };
  });

  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('fitflow_theme') || 'default';
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fitflow_exercises_v4', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('fitflow_workouts_v4', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitflow_templates_v4', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('fitflow_preferences_v1', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('fitflow_ai_settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  useEffect(() => {
    localStorage.setItem('fitflow_theme', theme);
    // Apply theme to body
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
  }, [theme]);

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
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setExercises(prev => prev.map(e => e.id === updatedExercise.id ? updatedExercise : e));
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
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveSettings = (settings: AiSettings) => {
    setAiSettings(settings);
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
          onUpdateWorkout={handleUpdateToday}
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
          onUpdateExercise={handleUpdateExercise}
          onDeleteExercise={handleDeleteExercise}
          onToggleFavorite={handleToggleFavorite}
          onAddTemplate={handleAddTemplate}
          onUpdateTemplate={handleUpdateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )}
      {view === 'SETTINGS' && (
        <SettingsView
          initialSettings={aiSettings}
          onSaveSettings={handleSaveSettings}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      )}
    </Layout>
  );
};

export default App;