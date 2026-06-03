import React from 'react';
import { Appointment } from '../types';

interface TopNavBarProps {
  currentView: 'landing' | 'booking' | 'bookings';
  setView: (view: 'landing' | 'booking' | 'bookings') => void;
  appointments: Appointment[];
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function TopNavBar({ currentView, setView, appointments, darkMode, setDarkMode }: TopNavBarProps) {
  const activeBookingsCount = appointments.filter(a => a.status === 'confirmed').length;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setView('landing');
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <button 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
        >
          <div className="bg-soft-cyan-bg dark:bg-slate-800 text-trust-blue-cta dark:text-sky-400 p-2 rounded-xl group-hover:bg-trust-blue-cta group-hover:text-white dark:group-hover:bg-sky-400 dark:group-hover:text-slate-900 transition-all duration-300">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              dentistry
            </span>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-bold font-heading text-primary dark:text-white tracking-tight block">
              Bright Smile Dental
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-trust-blue-cta/80 dark:text-sky-300 -mt-1 block">
              Austin, Texas
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            onClick={(e) => handleNavClick(e, 'services')}
            href="#services" 
            className="text-sm font-semibold text-slate-text dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
          >
            Services
          </a>
          <a 
            onClick={(e) => handleNavClick(e, 'membership')}
            href="#membership" 
            className="text-sm font-semibold text-slate-text dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
          >
            Membership
          </a>
          <a 
            onClick={(e) => handleNavClick(e, 'reviews')}
            href="#reviews" 
            className="text-sm font-semibold text-slate-text dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
          >
            Reviews
          </a>
          <a 
            onClick={(e) => handleNavClick(e, 'about')}
            href="#about" 
            className="text-sm font-semibold text-slate-text dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
          >
            About
          </a>
          
          {/* My Appointments Tab */}
          {appointments.length > 0 && (
            <button
              onClick={() => setView('bookings')}
              className={`relative text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                currentView === 'bookings' 
                  ? 'bg-soft-cyan-bg dark:bg-slate-800 text-trust-blue-cta dark:text-sky-400 font-bold' 
                  : 'text-slate-text dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg">event_available</span>
              My Bookings
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                  {activeBookingsCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle Switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {appointments.length > 0 && (
            <button
              onClick={() => setView('bookings')}
              className="md:hidden p-2 text-slate-text dark:text-slate-300 hover:text-primary dark:hover:text-white rounded-xl relative focus:outline-none"
              title="My Bookings"
            >
              <span className="material-symbols-outlined text-2xl">event_available</span>
              {activeBookingsCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {activeBookingsCount}
                </span>
              )}
            </button>
          )}

          <button 
            onClick={() => setView('booking')}
            className="bg-trust-blue-cta text-clinical-white dark:bg-sky-500 dark:text-slate-950 font-bold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-primary dark:hover:bg-sky-400 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book Online</span>
            <span className="material-symbols-outlined text-sm md:text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
