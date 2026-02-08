
import React, { useState } from 'react';
import { PRESET_HABITS } from '../types';

interface Props {
  currentHabit: string;
  onSelect: (habit: string) => void;
}

const HabitSelector: React.FC<Props> = ({ currentHabit, onSelect }) => {
  const [customInput, setCustomInput] = useState('');
  const [isEditing, setIsEditing] = useState(!currentHabit);

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelect(customInput.trim());
      setCustomInput('');
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-100">What's your focus?</h2>
        {currentHabit && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline underline-offset-4"
          >
            Change Goal
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {PRESET_HABITS.map(h => (
              /* Fix: h is an object, use h.name as the unique key */
              <button
                key={h.name}
                onClick={() => {
                  /* Fix: Pass the habit name string to onSelect callback */
                  onSelect(h.name);
                  setIsEditing(false);
                }}
                className={`px-6 py-3 rounded-2xl font-medium transition-all transform active:scale-95 ${
                  /* Fix: Compare currentHabit string with h.name property */
                  currentHabit === h.name 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {/* Fix: Render icon and name instead of the object */}
                {h.icon} {h.name}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSubmitCustom} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or write your own habit..."
              className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors disabled:opacity-50"
              disabled={!customInput.trim()}
            >
              Set Target
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-4 py-2">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Goal</p>
            <h3 className="text-2xl font-bold font-outfit text-indigo-600 dark:text-indigo-400">{currentHabit}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitSelector;
