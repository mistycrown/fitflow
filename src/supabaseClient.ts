
import { createClient } from '@supabase/supabase-js';

// 这些环境变量需要在项目根目录的 .env 文件中配置
// VITE_SUPABASE_URL=your_project_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbExercise = {
    id: string;
    user_id: string;
    name: string;
    category: string;
    muscle_group: string;
    type: 'REPS' | 'DURATION';
    is_favorite: boolean;
    created_at?: string;
};

export type DbTemplate = {
    id: string;
    user_id: string;
    name: string;
    items: any; // JSONB
    created_at?: string;
};

export type DbWorkout = {
    id: string;
    user_id: string;
    date_key: string; // "2023-10-27"
    items: any; // JSONB
    created_at?: string;
};
