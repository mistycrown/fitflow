
import React from 'react';
import { ViewState } from '../types';
import { ClipboardList, CalendarDays, Dumbbell, History, Settings } from 'lucide-react';

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
    { id: 'SETTINGS', label: '设置', icon: Settings },
  ];

  return (
    <div className="h-screen bg-zinc-100 text-zinc-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-zinc-200/50">
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full animate-fade-in">
          {children}
        </div>
      </main>

      <nav className="bg-white/80 backdrop-blur-xl pb-safe z-50">
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 active:scale-95 ${isActive ? 'text-primary' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
