
import React from 'react';

interface Props {
  streak: number;
  total: number;
  habitName: string;
}

const StatsSummary: React.FC<Props> = ({ streak, total, habitName }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
        <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Consistency Streak</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-outfit">{streak}</span>
          <span className="text-indigo-200 font-bold">Days</span>
        </div>
        <p className="text-[10px] text-indigo-200 mt-2 font-medium">Keep the light burning! 🕯️</p>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Lifetime Done</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-outfit text-slate-800 dark:text-slate-100">{total}</span>
          <span className="text-slate-400 dark:text-slate-500 font-bold">Sessions</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">Your brain is growing. 🌱</p>
      </div>
    </div>
  );
};

export default StatsSummary;
