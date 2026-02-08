
import React, { useState } from 'react';

interface GlobalHabitCompletion {
  color: string;
  completions: string[];
  name: string;
}

interface Props {
  completions: string[];
  onToggleDay: (date: string) => void;
  globalCompletions?: GlobalHabitCompletion[];
  activeColor?: string;
}

const CalendarView: React.FC<Props> = ({ completions, onToggleDay, globalCompletions, activeColor = 'indigo' }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(viewDate);

  const isGlobalView = !!globalCompletions;

  const navigateMonth = (direction: number) => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderDays = () => {
    const days = [];
    const emptyDays = firstDay === 0 ? 0 : firstDay; 
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    for (let i = 0; i < emptyDays; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10 md:h-12 md:w-12"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      const isToday = dateStr === todayStr;
      const isFuture = date > today;
      const isOld = date < sevenDaysAgo;
      const isInteractable = !isFuture && !isOld && !isGlobalView;

      const dayHabits = isGlobalView 
        ? globalCompletions.filter(h => h.completions.includes(dateStr))
        : [];
      
      const isCompleted = isGlobalView ? dayHabits.length > 0 : completions.includes(dateStr);

      let opacityClass = "opacity-100";
      let bgClass = "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50";
      let borderClass = isToday ? 'border-2 border-indigo-400 dark:border-indigo-500' : 'border border-transparent';
      
      if (isCompleted && !isGlobalView) {
        bgClass = `bg-${activeColor}-600 text-white shadow-md shadow-${activeColor}-100 dark:shadow-none`;
      } else if (isFuture) {
        bgClass = "bg-white dark:bg-slate-700/30 text-slate-300 dark:text-slate-500 border-slate-200 dark:border-slate-800 border-dashed";
      } else if (isOld && !isCompleted) {
        opacityClass = "opacity-40";
      }

      days.push(
        <button
          key={d}
          disabled={!isInteractable}
          onClick={() => isInteractable && onToggleDay(dateStr)}
          title={isGlobalView ? (dayHabits.map(h => h.name).join(', ')) : (!isInteractable ? (isFuture ? "Future day" : "Locked (7+ days old)") : "Toggle completion")}
          className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all group relative ${
            isInteractable ? 'active:scale-90 cursor-pointer' : 'cursor-default'
          } ${bgClass} ${opacityClass} ${borderClass}`}
        >
          <span className={isGlobalView && isCompleted ? 'mb-1' : ''}>{d}</span>
          
          {/* Global View Multi-Habit Indicators */}
          {isGlobalView && isCompleted && (
            <div className="flex flex-wrap gap-0.5 justify-center px-1 max-w-full">
               {dayHabits.slice(0, 4).map((h, i) => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full bg-${h.color}-500 shadow-sm`}></div>
               ))}
               {dayHabits.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
            </div>
          )}

          {/* Simple Completed Badge for Single View */}
          {!isGlobalView && isCompleted && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${activeColor}-400 opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 bg-${activeColor}-500`}></span>
            </span>
          )}
          
          {isInteractable && !isCompleted && (
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-900/50 transition-colors"></div>
          )}
        </button>
      );
    }
    return days;
  };

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h4 className="font-black text-2xl font-outfit text-slate-800 dark:text-slate-100">{monthName}</h4>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{year}</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => setViewDate(new Date())}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all uppercase tracking-wider"
          >
            Today
          </button>

          <button 
            onClick={() => navigateMonth(1)}
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 pb-4 uppercase tracking-tighter">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-${isGlobalView ? 'indigo' : activeColor}-600`}></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isGlobalView ? 'Habits' : 'Completed'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Future</span>
          </div>
      </div>
    </div>
  );
};

export default CalendarView;
