
import React, { useState } from 'react';

interface Props {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isConnectedCalendar: boolean;
  onConnectCalendar: () => void;
  onDisconnectCalendar: () => void;
  onGoMenu: () => void;
  hasActiveHabit: boolean;
}

const Header: React.FC<Props> = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  isConnectedCalendar, 
  onConnectCalendar, 
  onDisconnectCalendar,
  onGoMenu,
  hasActiveHabit
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 py-4">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          {hasActiveHabit && (
            <button 
              onClick={onGoMenu}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Back to Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-outfit text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">Brain Light</h1>
              <span className="text-xs text-indigo-500 font-semibold uppercase tracking-widest">Habit Tracker</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {showSettings && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSettings(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50 overflow-hidden">
                <div className="p-3">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Settings</h3>
                  
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark Mode</span>
                    <button 
                      onClick={onToggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Google Calendar Sync */}
                  <div className="pt-3 border-t border-slate-50 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">Google Calendar</span>
                    {isConnectedCalendar ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Sync Active
                        </div>
                        <button 
                          onClick={onDisconnectCalendar}
                          className="w-full py-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={onConnectCalendar}
                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
                        </svg>
                        Connect Google Cal
                      </button>
                    )}
                  </div>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-700 my-1 pt-2 p-3 text-[10px] text-slate-400 text-center italic">
                  Brain Light v2.0.0
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
