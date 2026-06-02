import React, { useState, useEffect } from 'react';
import { Appointment, Review } from './types';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import LandingView from './components/LandingView';
import BookingView from './components/BookingView';
import MyBookingsView from './components/MyBookingsView';

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah Jenkins',
    stars: 5,
    content: "I've always been terrified of the dentist, but the team here completely changed my mind. Pain-free cleaning experience and lovely staff in Austin!"
  },
  {
    id: '2',
    author: 'Mark T.',
    stars: 5,
    content: "Finally, a clinic in Austin that respects my time. I booked my two kids and myself in one single morning block with simultaneous hygenists. Highly recommend!"
  },
  {
    id: '3',
    author: 'Elena Rodriguez',
    stars: 5,
    content: "No hidden fees! They walked me through my insurance coverage thoroughly before doing any work, and their membership options are extremely fair."
  }
];

export default function App() {
  const [currentView, setView] = useState<'landing' | 'booking' | 'bookings'>('landing');
  const [selectedService, setSelectedService] = useState<string>('Routine Cleaning & Checkup');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bright_smile_dark_mode') === 'true';
    } catch (_) {
      return false;
    }
  });
  
  // App states loaded or synced with localStorage
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Load state on mount
  useEffect(() => {
    try {
      const storedApps = localStorage.getItem('bright_smile_appointments');
      if (storedApps) {
        setAppointments(JSON.parse(storedApps));
      }
      const storedReviews = localStorage.getItem('bright_smile_reviews');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    } catch (e) {
      console.error("Could not fetch data from localStorage:", e);
    }
  }, []);

  // Sync dark mode preference with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bright_smile_dark_mode', String(darkMode));
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  // Save appointments to localStorage
  const handleAddAppointment = (newApp: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const fullApp: Appointment = {
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      ...newApp,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const updated = [fullApp, ...appointments];
    setAppointments(updated);
    try {
      localStorage.setItem('bright_smile_appointments', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelAppointment = (id: string) => {
    const updated = appointments.map(app => 
      app.id === id ? { ...app, status: 'cancelled' as const } : app
    );
    setAppointments(updated);
    try {
      localStorage.setItem('bright_smile_appointments', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReview = (newRev: Omit<Review, 'id'>) => {
    const fullRev: Review = {
      id: 'rev-' + Math.random().toString(36).substr(2, 9),
      ...newRev
    };

    const updated = [fullRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('bright_smile_reviews', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const setViewAndSelectedService = (srv: string) => {
    setSelectedService(srv);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-surface-bright text-slate-text'} transition-colors duration-300`}>
      
      {/* Dynamic Top Nav Bar header */}
      <TopNavBar 
        currentView={currentView}
        setView={setView}
        appointments={appointments}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Primary body switcher */}
      <main className="flex-grow">
        {currentView === 'landing' && (
          <LandingView 
            setView={setView}
            setSelectedService={setViewAndSelectedService}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        )}

        {currentView === 'booking' && (
          <BookingView 
            selectedService={selectedService}
            onAddAppointment={handleAddAppointment}
            setView={setView}
          />
        )}

        {currentView === 'bookings' && (
          <MyBookingsView 
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            setView={setView}
          />
        )}
      </main>

      {/* Dynamic Footer */}
      <Footer />

    </div>
  );
}
