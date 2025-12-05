import { supabase, DbExercise, DbWorkout, DbTemplate } from '../src/supabaseClient';
import { Exercise, DailyWorkout, WorkoutTemplate, ExerciseCategory, ExerciseType } from '../types';
import { INITIAL_EXERCISES } from '../constants';

// Helper to check session
export const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
};

// --- Sync Functions ---

// Helper to check UUID
const isValidUuid = (id: string) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(id);
};

// 1. Sync Exercises
export const pushExercises = async (localExercises: Exercise[]) => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    // Only sync items with valid UUIDs (skipping default exercises like 'chest-1')
    const validExercises = localExercises.filter(e => isValidUuid(e.id));
    if (validExercises.length === 0) return;

    const { error } = await supabase
        .from('exercises')
        .upsert(validExercises.map(e => ({
            id: e.id,
            user_id: user.id,
            name: e.name,
            category: e.category,
            muscle_group: e.muscleGroup,
            type: e.type,
            is_favorite: e.isFavorite
        })));

    if (error) throw error;
};

export const pullExercises = async (): Promise<Exercise[]> => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const { data: remoteData, error } = await supabase
        .from('exercises')
        .select('*');

    if (error) throw error;

    const remoteExercises = remoteData.map((dbEx: DbExercise) => ({
        id: dbEx.id,
        name: dbEx.name,
        category: dbEx.category as ExerciseCategory,
        muscleGroup: dbEx.muscle_group,
        type: dbEx.type as ExerciseType,
        isFavorite: dbEx.is_favorite
    }));

    // Merge with INITIAL_EXERCISES to ensure default exercises are not lost
    const exerciseMap = new Map<string, Exercise>();

    // 1. Add Initials
    INITIAL_EXERCISES.forEach(e => exerciseMap.set(e.id, e));

    // 2. Add Remotes (Overrides if ID conflict)
    remoteExercises.forEach(e => exerciseMap.set(e.id, e));

    return Array.from(exerciseMap.values());
};

// 2. Sync Templates
// 2. Sync Templates
export const pushTemplates = async (localTemplates: WorkoutTemplate[]) => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const validTemplates = localTemplates.filter(t => isValidUuid(t.id));
    if (validTemplates.length === 0) return;

    const { error } = await supabase.from('workout_templates').upsert(validTemplates.map(t => ({
        id: t.id,
        user_id: user.id,
        name: t.name,
        items: t.items
    })));

    if (error) throw error;
};

export const pullTemplates = async (): Promise<WorkoutTemplate[]> => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const { data: remoteData, error } = await supabase.from('workout_templates').select('*');
    if (error) throw error;

    return remoteData.map((t: DbTemplate) => ({
        id: t.id,
        name: t.name,
        items: t.items
    }));
};

// 3. Sync Workouts
// 3. Sync Workouts
export const pushWorkouts = async (localWorkouts: DailyWorkout[]) => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase.from('daily_workouts').upsert(localWorkouts.map(w => ({
        user_id: user.id,
        date_key: w.date,
        items: w.items
    })), { onConflict: 'user_id, date_key' });

    if (error) throw error;
};

export const pullWorkouts = async (): Promise<DailyWorkout[]> => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const { data: remoteData, error } = await supabase.from('daily_workouts').select('*');
    if (error) throw error;

    return remoteData.map((w: DbWorkout) => ({
        id: w.id,
        date: w.date_key,
        items: w.items
    }));
};
