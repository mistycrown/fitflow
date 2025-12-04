
import React from 'react';
import { ViewState } from '../types';
import { ClipboardList, CalendarDays, Dumbbell, History } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const navItems = [
    { id: 'TODAY', label: '今日', icon: ClipboardList },
    { id: 'PLAN', label: '计划', icon: CalendarDays },
    { id: 'HISTORY', label: '记录', icon: History },
    { id: 'LIBRARY', label: '动作库', icon: Dumbbell },
  ];

  return (
    <div className="h-screen bg-zinc-100 text-zinc-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-zinc-200/50">
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full animate-fade-in">
          {children}
        </div>
      </main>

      <nav className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-white/80 backdrop-blur-xl pb-safe z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 active:scale-95 ${isActive ? 'text-indigo-500' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-500/10 translate-y-[-2px]' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-indigo-500' : 'text-zinc-400'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
