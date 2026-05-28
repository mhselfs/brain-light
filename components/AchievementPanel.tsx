
import React from 'react';
import { Achievement } from '../types';

interface Props {
  streakCount: number;
  achievements: Achievement[];
}

const AchievementPanel: React.FC<Props> = ({ streakCount, achievements }) => {
  const earnedCount = achievements.filter(a => streakCount >= a.requiredDays).length;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-100">Milestones</h3>
        <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {earnedCount} Secured
        </span>
      </div>

      <div className="space-y-4 max-h-full overflow-y-auto pr-2 custom-scrollbar">
        {achievements.length === 0 ? (
          <p className="text-center text-slate-400 py-8 text-sm italic">No milestones set for this habit.</p>
        ) : (
          achievements.map(achievement => {
            const isUnlocked = streakCount >= achievement.requiredDays;
            const progress = Math.min(100, (streakCount / achievement.requiredDays) * 100);

            return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900' 
                    : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 grayscale'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`text-3xl shrink-0 w-12 h-12 flex items-center justify-center rounded-xl ${isUnlocked ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{achievement.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{achievement.description || `Maintain a ${achievement.requiredDays}-day streak.`}</p>
                    
                    {!isUnlocked && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">
                          <span>{progress.toFixed(0)}% PROGRESS</span>
                          <span>{streakCount}/{achievement.requiredDays} DAYS</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-400 dark:bg-indigo-600 h-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {isUnlocked && (
                      <div className="mt-2 text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        UNLOCKED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <p className="mt-6 text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
        Streak resets if a day is skipped
      </p>
    </div>
  );
};

export default AchievementPanel;
