
import { supabase, DbExercise, DbWorkout, DbTemplate } from '../src/supabaseClient';
import { Exercise, DailyWorkout, WorkoutTemplate, ExerciseCategory, ExerciseType } from '../types';

// Helper to check session
export const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
};

// --- Sync Functions ---

// 1. Sync Exercises
export const syncExercises = async (localExercises: Exercise[]) => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    // A. Fetch remote
    const { data: remoteData, error } = await supabase
        .from('exercises')
        .select('*');

    if (error) throw error;

    const remoteExercises: Exercise[] = remoteData.map((dbEx: DbExercise) => ({
        id: dbEx.id,
        name: dbEx.name,
        category: dbEx.category as ExerciseCategory,
        muscleGroup: dbEx.muscle_group,
        type: dbEx.type as ExerciseType,
        isFavorite: dbEx.is_favorite
    }));

    // B. Basic Merge (Union by ID)
    // Strategy: If local has items not in remote (and they look like new UUIDs or existing ones), upload them.
    // If remote has items not in local, add them to local.
    // For now, we prefer Remote data if IDs match to avoid conflicts, OR we can implement "last modified" if we tracked it (we don't effectively).
    // Let's do:
    // 1. Map of all exercises by ID.
    // 2. Add Remote to Map.
    // 3. Add Local to Map (if not exists? or overwrite?). 
    //    If we assume 'Sync' means 'Save Local to Cloud' mostly initially:
    //    Let's identify records that are ONLY local and need PUSH.

    // Identification:
    const remoteIds = new Set(remoteExercises.map(e => e.id));
    const toUpload = localExercises.filter(e => !remoteIds.has(e.id));

    // Upload new local items
    if (toUpload.length > 0) {
        const { error: insertError } = await supabase
            .from('exercises')
            .insert(toUpload.map(e => ({
                id: e.id,
                user_id: user.id,
                name: e.name,
                category: e.category,
                muscle_group: e.muscleGroup,
                type: e.type,
                is_favorite: e.isFavorite
            })));
        if (insertError) console.error("Error uploading exercises:", insertError);
    }

    // Return the combined list (Remote + Just Uploaded Local)
    // Actually, simply refetch or manually combine.
    // To be safe, let's just use the merged list from memory.
    const merged = [...remoteExercises, ...toUpload];
    return merged;
};

// 2. Sync Templates
export const syncTemplates = async (localTemplates: WorkoutTemplate[]) => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const { data: remoteData, error } = await supabase.from('workout_templates').select('*');
    if (error) throw error;

    const remoteTemplates: WorkoutTemplate[] = remoteData.map((t: DbTemplate) => ({
        id: t.id,
        name: t.name,
        items: t.items
    }));

    const remoteIds = new Set(remoteTemplates.map(t => t.id));
    const toUpload = localTemplates.filter(t => !remoteIds.has(t.id));

    if (toUpload.length > 0) {
        await supabase.from('workout_templates').insert(toUpload.map(t => ({
            id: t.id,
            user_id: user.id,
            name: t.name,
            items: t.items
        })));
    }

    return [...remoteTemplates, ...toUpload];
};

// 3. Sync Workouts
export const syncWorkouts = async (localWorkouts: DailyWorkout[]) => {
    const user = await getUser();
    if (!user) throw new Error("Not logged in");

    const { data: remoteData, error } = await supabase.from('daily_workouts').select('*');
    if (error) throw error;

    const remoteWorkouts: DailyWorkout[] = remoteData.map((w: DbWorkout) => ({
        id: w.id,
        date: w.date_key,
        items: w.items
    }));

    // Conflict Resolution for Workouts is trickier because 'date' is the key conceptually, but we use ID or Date?
    // The App uses 'unique(user_id, date_key)' constraint.
    // So we should UPSERT based on date.

    // Strategy:
    // If we have a local workout for '2023-12-05', and remote also has it.
    // Which one wins? Usually the one with MORE items? Or just latest?
    // Let's assume WE merge items? That's hard.
    // Let's simplisticly assume: If Local has data and Remote doesn't, Upload.
    // If Remote has data, USE Remote (overwrite local). 
    // *Unless* we flag local as 'dirty'. Not tracking dirty state currently.

    // For this V1 Sync:
    // We will download everything from Remote.
    // Then for any Local dates that are NOT in Remote, we upload them.
    // (This means if you edited today on mobile, and open desktop, desktop gets mobile data. Good.)
    // (If you edited today on desktop offline, then came online, and mobile had data... conflict. We will skip uploading desktop version to avoid overwriting mobile data if constraint fails, or we can use upsert).

    const remoteDates = new Set(remoteWorkouts.map(w => w.date));
    const toUpload = localWorkouts.filter(w => !remoteDates.has(w.date));

    if (toUpload.length > 0) {
        // Using upsert to be safe, but mostly inserts
        await supabase.from('daily_workouts').upsert(toUpload.map(w => ({
            user_id: user.id,
            date_key: w.date,
            items: w.items
        })), { onConflict: 'user_id, date_key' });
    }

    // Re-fetch or merge locally
    // Because we might have just upserted, let's trust the "Remote + Uploaded" logic
    const mergedMap = new Map<string, DailyWorkout>();
    remoteWorkouts.forEach(w => mergedMap.set(w.date, w));
    toUpload.forEach(w => mergedMap.set(w.date, w)); // Local ones we just sent

    return Array.from(mergedMap.values());
};
