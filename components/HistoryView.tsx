import React, { useState } from 'react';
import { DailyWorkout, Exercise, ExerciseType } from '../types';
import { ChevronLeft, ChevronRight, X, Calendar, CheckCircle2 } from 'lucide-react';
import { getLocalDateKey } from '../App';

interface HistoryViewProps {
    workouts: DailyWorkout[];
    exercises: Exercise[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ workouts, exercises }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday

        const calendarDays = [];

        // Previous month filler
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(new Date(year, month, i));
        }

        return calendarDays;
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const getWorkoutForDate = (date: Date) => {
        const dateStr = getLocalDateKey(date);
        return workouts.find(w => w.date === dateStr);
    };

    const getDayExerciseNames = (workout: DailyWorkout | undefined) => {
        if (!workout || !workout.items || workout.items.length === 0) return [];
        return workout.items.map(item => {
            const ex = exercises.find(e => e.id === item.exerciseId);
            return ex ? ex.name : '未知';
        });
    };

    // Modal Content
    const selectedWorkout = selectedDay ? getWorkoutForDate(selectedDay) : null;
    const formattedSelectedDate = selectedDay?.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <button onClick={() => changeMonth(-1)} className="p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                <h2 className="font-bold text-lg text-textMain tracking-wide">
                    {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                </h2>
                <button onClick={() => changeMonth(1)} className="p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 rounded-full transition-colors"><ChevronRight size={20} /></button>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50/30">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <div key={d} className="py-3 text-center text-xs font-semibold text-zinc-400">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-7 auto-rows-fr h-full">
                    {generateCalendar().map((day, idx) => {
                        if (!day) {
                            return <div key={idx} className="bg-zinc-50/20 border-b border-r border-zinc-100"></div>;
                        }

                        const workout = getWorkoutForDate(day);
                        const exerciseNames = getDayExerciseNames(workout);
                        const isToday = new Date().toDateString() === day.toDateString();
                        const hasWorkout = exerciseNames.length > 0;

                        // Color palette for badges
                        const colors = [
                            "bg-blue-50 text-blue-600 border-blue-100",
                            "bg-emerald-50 text-emerald-600 border-emerald-100",
                            "bg-amber-50 text-amber-600 border-amber-100",
                            "bg-purple-50 text-purple-600 border-purple-100",
                            "bg-rose-50 text-rose-600 border-rose-100"
                        ];

                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedDay(day)}
                                className={`
                          border-b border-r border-zinc-100 p-1 flex flex-col relative cursor-pointer hover:bg-zinc-50 transition-colors
                          ${isToday ? 'bg-primary/5' : 'bg-white'}
                       `}
                            >
                                {/* Date Number */}
                                <div className={`text-xs font-medium mb-1 px-1 flex justify-center items-center h-6 w-6 rounded-full mx-auto ${isToday ? 'bg-primary text-white' : 'text-zinc-500'}`}>
                                    {day.getDate()}
                                </div>

                                {/* Exercise List */}
                                <div className="flex flex-col gap-0.5 overflow-hidden px-0.5">
                                    {exerciseNames.map((name, i) => {
                                        if (i > 2) return null; // Show max 3 items
                                        if (i === 2 && exerciseNames.length > 3) {
                                            return (
                                                <div key={i} className="text-[9px] text-zinc-400 text-center">
                                                    +{exerciseNames.length - 2}
                                                </div>
                                            );
                                        }
                                        const colorClass = colors[i % colors.length];
                                        return (
                                            <div key={i} className={`text-[9px] px-1 py-0.5 rounded border truncate text-center ${colorClass}`}>
                                                {name}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
                        onClick={() => setSelectedDay(null)}
                    ></div>

                    {/* Modal Card */}
                    <div className="bg-white w-[85%] max-w-sm max-h-[70vh] flex flex-col rounded-2xl shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-zinc-100">
                            <div>
                                <h3 className="text-lg font-bold text-textMain">{formattedSelectedDate}</h3>
                                <p className="text-xs text-textMuted flex items-center gap-1 mt-0.5">
                                    <Calendar size={12} />
                                    {selectedWorkout?.items.length || 0} 个训练动作
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-zinc-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto p-4 space-y-4">
                            {!selectedWorkout || selectedWorkout.items.length === 0 ? (
                                <div className="py-10 text-center text-zinc-400 flex flex-col items-center">
                                    <div className="bg-zinc-50 p-4 rounded-full mb-3">
                                        <Calendar size={32} className="opacity-50" />
                                    </div>
                                    <p>当天没有运动记录</p>
                                </div>
                            ) : (
                                selectedWorkout.items.map((item, idx) => {
                                    const ex = exercises.find(e => e.id === item.exerciseId);
                                    const completedCount = item.sets.filter(s => s.completed).length;
                                    const isFullyComplete = completedCount === item.sets.length;

                                    return (
                                        <div key={idx} className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-textMain flex items-center gap-2">
                                                    {isFullyComplete && <CheckCircle2 size={16} className="text-primary" />}
                                                    {ex?.name || '未知动作'}
                                                </h4>
                                                <span className="text-xs font-medium text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-full">
                                                    {item.sets.length} 组
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-2 text-center">
                                                {item.sets.map((set, sIdx) => (
                                                    <div
                                                        key={sIdx}
                                                        className={`
                                                    text-xs py-1.5 rounded-md border
                                                    ${set.completed
                                                                ? 'bg-primary/10 border-primary/20 text-primary font-medium'
                                                                : 'bg-white border-zinc-200 text-zinc-400'}
                                                `}
                                                    >
                                                        {set.reps} {ex?.type === ExerciseType.DURATION ? '秒' : '次'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};