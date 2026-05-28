
import React, { useState } from 'react';
import { HabitData, Achievement, DEFAULT_ACHIEVEMENTS } from '../types';

interface Props {
  habits: HabitData[];
  onSelect: (id: string) => void;
  onAdd: (name: string, icon: string, color: string, achievements: Achievement[]) => void;
  onEdit: (id: string, name: string, color: string, achievements: Achievement[]) => void;
  onDelete: (id: string) => void;
  onGoTotalView: () => void;
}

const HabitMenu: React.FC<Props> = ({ habits, onSelect, onAdd, onEdit, onDelete, onGoTotalView }) => {
  const [modalState, setModalState] = useState<{ show: boolean, habitId?: string }>({ show: false });
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💡');
  const [selectedColor, setSelectedColor] = useState('indigo');
  const [milestones, setMilestones] = useState<Achievement[]>([...DEFAULT_ACHIEVEMENTS]);
  const [activeTab, setActiveTab] = useState<'basic' | 'milestones'>('basic');

  const icons = ['💡', '📚', '💪', '🧘', '🍎', '💧', '🏃', '🎨', '🧠', '📵', '🎸', '💻', '🎮', '🏆', '🔥', '🌱'];
  const openAddModal = () => {
    setNewName('');
    setSelectedIcon('💡');
    setSelectedColor('indigo');
    setMilestones([...DEFAULT_ACHIEVEMENTS]);
    setModalState({ show: true });
    setActiveTab('basic');
  };

  const openEditModal = (habit: HabitData) => {
    setNewName(habit.name);
    setSelectedIcon(habit.icon);
    setSelectedColor(habit.color);
    setMilestones([...habit.achievements]);
    setModalState({ show: true, habitId: habit.id });
    setActiveTab('basic');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (modalState.habitId) {
      onEdit(modalState.habitId, newName.trim(), selectedIcon, selectedColor, milestones);
    } else {
      onAdd(newName.trim(), selectedIcon, selectedColor, milestones);
    }
    setModalState({ show: false });
  };

  const addMilestone = () => {
    const newM: Achievement = {
      id: crypto.randomUUID(),
      title: 'New Goal',
      description: 'Keep the light on.',
      icon: '✨',
      requiredDays: milestones.length > 0 ? milestones[milestones.length - 1].requiredDays + 7 : 1
    };
    setMilestones([...milestones, newM]);
  };

  const updateMilestone = (index: number, updates: Partial<Achievement>) => {
    const next = [...milestones];
    next[index] = { ...next[index], ...updates };
    setMilestones(next);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black font-outfit text-slate-900 dark:text-white mb-2">My Brain Lights</h2>
          <p className="text-slate-500 dark:text-slate-400">Build consistency with custom rewards.</p>
        </div>
        {habits.length > 0 && (
          <button onClick={onGoTotalView} className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">Global View</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex items-center justify-between" onClick={() => onSelect(habit.id)}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-${habit.color}-50 dark:bg-${habit.color}-900/20 text-${habit.color}-600 group-hover:scale-110 transition-transform`}>{habit.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{habit.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">🔥 {habit.streakCount} Streak</span>
                  <span className="text-xs font-semibold text-slate-400">✅ {habit.completions.length} Total</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); openEditModal(habit); }} className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }} className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        ))}
        <button onClick={openAddModal} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 transition-colors flex items-center justify-center gap-2 group min-h-25">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Add Habit</span>
        </button>
      </div>

      {modalState.show && (
        <div className="fixed inset-0 z-vi100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-8 pb-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black font-outfit text-slate-800 dark:text-white">{modalState.habitId ? 'Edit Habit' : 'New Habit'}</h3>
                <button onClick={() => setModalState({ show: false })} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
                <button onClick={() => setActiveTab('basic')} className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${activeTab === 'basic' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400'}`}>Basic Info</button>
                <button onClick={() => setActiveTab('milestones')} className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${activeTab === 'milestones' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400'}`}>Milestones</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              {activeTab === 'basic' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Name</label>
                    <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Morning Yoga" className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {icons.map(icon => (
                        <button key={icon} type="button" onClick={() => setSelectedIcon(icon)} className={`h-10 rounded-xl flex items-center justify-center text-xl transition-all ${selectedIcon === icon ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'}`}>{icon}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 mb-4">Set required consecutive days to unlock your milestones.</p>
                  {milestones.map((m, idx) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <input readOnly type="text" value={m.icon} onChange={(e) => updateMilestone(idx, { icon: e.target.value })} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl text-center text-lg focus:outline-none" />
                      <div className="flex-1">
                        <input type="text" value={m.title} onChange={(e) => updateMilestone(idx, { title: e.target.value })} className="w-full text-sm font-bold bg-transparent focus:outline-none focus:border-b-2 focus:transition-all duration-200" placeholder="Title" />
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                          <input type="number" value={m.requiredDays} onChange={(e) => updateMilestone(idx, { requiredDays: parseInt(e.target.value) || 0 })} className="w-10 bg-transparent border-b border-slate-200 dark:border-slate-600 focus:outline-none" />
                          <span>Days</span>
                        </div>
                      </div>
                      <button onClick={() => removeMilestone(idx)} className="text-slate-300 hover:text-red-400 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  ))}
                  <button onClick={addMilestone} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 font-bold text-xs hover:border-indigo-400 hover:text-indigo-500 transition-all uppercase tracking-widest">+ Add Milestone</button>
                </div>
              )}
            </div>

            <div className="p-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleSubmit} disabled={!newName.trim()} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
                {modalState.habitId ? 'Save Changes' : 'Start Ignite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitMenu;
