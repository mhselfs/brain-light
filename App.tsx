
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { GoogleGenAI } from "@google/genai";
import { AppState, HabitData, DEFAULT_ACHIEVEMENTS, Achievement } from './types';
import HabitMenu from './components/HabitMenu';
import CalendarView from './components/CalendarView';
import AchievementPanel from './components/AchievementPanel';
import Header from './components/Header';
import StatsSummary from './components/StatsSummary';

const STORAGE_KEY = 'brain_light_v4_data';
const THEME_KEY = 'brain_light_theme';
const CALENDAR_TOKEN_KEY = 'brain_light_gcal_token';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
    return {
      habits: [],
      activeHabitId: null,
    };
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const [viewMode, setViewMode] = useState<'single' | 'total'>('single');
  const [gcalToken, setGcalToken] = useState<string | null>(() => localStorage.getItem(CALENDAR_TOKEN_KEY));
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);
  const tokenClientRef = useRef<any>(null);

  const activeHabit = useMemo(() => {
    return appState.habits.find(h => h.id === appState.activeHabitId) || null;
  }, [appState.habits, appState.activeHabitId]);

  const globalCompletions = useMemo(() => {
    return appState.habits.map(h => ({
      color: h.color,
      completions: h.completions,
      name: h.name
    }));
  }, [appState.habits]);

  // useEffect(() => {
  //   const initGis = () => {
  //     if (!(window as any).google) return;
  //     tokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
  //       client_id: '965154378857-8v8h1o5a58g88v8h1o5a58g88.apps.googleusercontent.com', 
  //       scope: 'https://www.googleapis.com/auth/calendar.events',
  //       callback: (resp: any) => {
  //         if (resp.error) return;
  //         setGcalToken(resp.access_token);
  //         localStorage.setItem(CALENDAR_TOKEN_KEY, resp.access_token);
  //       },
  //     });
  //   };
  //   if ((window as any).google) initGis();
  // }, []);

  // const connectGoogleCalendar = () => tokenClientRef.current?.requestAccessToken({ prompt: 'consent' });
  // const disconnectGoogleCalendar = () => {
  //   setGcalToken(null);
  //   localStorage.removeItem(CALENDAR_TOKEN_KEY);
  // };

  // const createCalendarEvent = async (dateStr: string, habitName: string, completionsCount: number) => {
  //   if (!gcalToken) return;
  //   const endDate = new Date(dateStr);
  //   endDate.setDate(endDate.getDate() + 1);
  //   const event = {
  //     summary: `(Day [${completionsCount}] of ${habitName})`,
  //     description: 'Logged via Brain Light Habit Tracker',
  //     start: { date: dateStr },
  //     end: { date: endDate.toISOString().split('T')[0] },
  //   };
  //   try {
  //     const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
  //       method: 'POST',
  //       headers: { 'Authorization': `Bearer ${gcalToken}`, 'Content-Type': 'application/json' },
  //       body: JSON.stringify(event),
  //     });
  //     if (response.status === 401) disconnectGoogleCalendar();
  //   } catch (err) { console.error('Calendar sync error:', err); }
  // };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const addHabit = (name: string, icon: string, color: string, achievements: Achievement[]) => {
    const newHabit: HabitData = {
      id: crypto.randomUUID(),
      name,
      icon,
      color,
      startDate: new Date().toISOString(),
      completions: [],
      streakCount: 0,
      achievements: achievements.length > 0 ? achievements : [...DEFAULT_ACHIEVEMENTS],
    };
    setAppState(prev => ({
      habits: [...prev.habits, newHabit],
      activeHabitId: newHabit.id,
    }));
    setViewMode('single');
  };

  const editHabit = (id: string, name: string, icon: string, color: string, achievements: Achievement[]) => {
    setAppState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, name, icon, color, achievements } : h)
    }));
  };

  const deleteHabit = (id: string) => {
    setAppState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
      activeHabitId: prev.activeHabitId === id ? null : prev.activeHabitId,
    }));
  };

  const selectHabit = (id: string) => {
    setAppState(prev => ({ ...prev, activeHabitId: id }));
    setViewMode('single');
    setAiTip('');
  };

  const calculateStreak = (completions: string[]): number => {
    if (completions.length === 0) return 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // STRICT STREAK: If neither today nor yesterday is in the list, streak is broken.
    if (!completions.includes(todayStr) && !completions.includes(yesterdayStr)) {
      return 0;
    }

    let streakCount = 0;
    let pointer = completions.includes(todayStr) ? new Date(today) : new Date(yesterday);

    while (true) {
      const pStr = pointer.toISOString().split('T')[0];
      if (completions.includes(pStr)) {
        streakCount++;
      } else {
        break; // STRICT: Any gap resets the count
      }
      pointer.setDate(pointer.getDate() - 1);
      if (streakCount > 5000) break; // Infinite loop safety
    }
    return streakCount;
  };

  const toggleDay = (dateStr: string) => {
    if (!appState.activeHabitId) return;
    const clickedDate = new Date(dateStr); clickedDate.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((today.getTime() - clickedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 7) return;

    setAppState(prev => {
      const updatedHabits = prev.habits.map(h => {
        if (h.id !== prev.activeHabitId) return h;
        const isCompleted = h.completions.includes(dateStr);
        const newCompletions = isCompleted ? h.completions.filter(d => d !== dateStr) : [...h.completions, dateStr];
        return { ...h, completions: newCompletions, streakCount: calculateStreak(newCompletions) };
      });
      return { ...prev, habits: updatedHabits };
    });
  };


  const handleGoTotalView = () => { setAppState(prev => ({ ...prev, activeHabitId: null })); setViewMode('total'); };
  const handleGoMenu = () => { setAppState(prev => ({ ...prev, activeHabitId: null })); setViewMode('single'); };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header
        isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode}
        onGoMenu={handleGoMenu} hasActiveHabit={!!activeHabit || viewMode === 'total'}
      />
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8 pb-20">
        {!activeHabit && viewMode === 'single' ? (
          <HabitMenu
            habits={appState.habits} onSelect={selectHabit} onAdd={addHabit} onEdit={editHabit} onDelete={deleteHabit} onGoTotalView={handleGoTotalView}
          />
        ) : viewMode === 'total' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black font-outfit text-slate-900 dark:text-white">Global Dashboard</h2>
              <button onClick={handleGoMenu} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Back to List</button>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6 font-outfit text-slate-800 dark:text-slate-100">All Habits Timeline</h3>
              <CalendarView completions={[]} onToggleDay={() => { }} globalCompletions={globalCompletions} />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-${activeHabit!.color}-50 dark:bg-${activeHabit!.color}-900/20 text-${activeHabit!.color}-600 dark:text-${activeHabit!.color}-400`}>{activeHabit!.icon}</div>
                  <div>
                    <h2 className="text-2xl font-black font-outfit text-slate-800 dark:text-slate-100">{activeHabit!.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Target: Strict Consistency</p>
                  </div>
                </div>
                <StatsSummary streak={activeHabit!.streakCount} total={activeHabit!.completions.length} habitName={activeHabit!.name} />
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-6 font-outfit text-slate-800 dark:text-slate-100">Tracking Progress</h3>
                  <CalendarView completions={activeHabit!.completions} onToggleDay={toggleDay} activeColor={activeHabit!.color} />
                  <p className="mt-4 text-[10px] text-slate-400 italic">Gaps break your streak. Track today or up to 7 days back.</p>
                </div>
              </div>
              <div className="space-y-8">
                <AchievementPanel streakCount={activeHabit!.streakCount} achievements={activeHabit!.achievements} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
