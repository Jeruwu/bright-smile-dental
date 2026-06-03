import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../types';

interface BookingViewProps {
  selectedService: string;
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
  setView: (view: 'landing' | 'booking' | 'bookings') => void;
}

const AVAILABLE_TIMES = ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM', '04:30 PM'];

export default function BookingView({ selectedService, onAddAppointment, setView }: BookingViewProps) {
  // Current month rendering state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(9); // Default to 9th, matching design
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  // Selection
  const [selectedTime, setSelectedTime] = useState<string>('01:00 PM'); // Default matching design

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [reason, setReason] = useState('Routine Cleaning & Checkup');

  // Success Confirmation Card State
  const [confirmedBookingData, setConfirmedBookingData] = useState<Omit<Appointment, 'status' | 'createdAt'> | null>(null);

  // Pre-seed the reason from the landing page service selection
  useEffect(() => {
    if (selectedService) {
      setReason(selectedService);
    }
  }, [selectedService]);

  // Calendar Math
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayIndex = getFirstDayOfMonth(selectedYear, selectedMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
    setSelectedDay(1); // Reset selected day to first day of new month
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
    setSelectedDay(1); // Reset selected day
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !emailAddress.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    const dateStr = `${selectedDay} ${monthNames[selectedMonth].slice(0, 3)} ${selectedYear}`;
    const appointmentData = {
      fullName,
      phoneNumber,
      emailAddress,
      reasonForVisit: reason,
      date: dateStr,
      timeSlot: selectedTime
    };

    onAddAppointment(appointmentData);
    setConfirmedBookingData({
      id: Math.random().toString(36).substr(2, 9),
      ...appointmentData
    });
  };

  const handleSuccessClose = () => {
    setConfirmedBookingData(null);
    setView('bookings'); // Redirect directly to historic bookings
  };

  // Generate blank placeholder spots before 1st of month
  const blanks = Array.from({ length: firstDayIndex }).map((_, i) => (
    <div key={`blank-${i}`} className="p-2 text-transparent">-</div>
  ));

  // Generate active calendar days
  const days = Array.from({ length: daysInMonth }).map((_, index) => {
    const day = index + 1;
    const isToday = 
      day === new Date().getDate() && 
      selectedMonth === new Date().getMonth() && 
      selectedYear === new Date().getFullYear();
    
    const isSelected = day === selectedDay;

    // Simulate some weekend days as fully booked or unavailable for booking
    const dayOfWeek = new Date(selectedYear, selectedMonth, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return (
      <button
        key={`day-${day}`}
        type="button"
        disabled={isWeekend}
        onClick={() => setSelectedDay(day)}
        className={`py-2 rounded-full font-semibold transition-all relative outline-none text-xs ${
          isWeekend 
            ? 'text-slate-300 line-through cursor-not-allowed bg-slate-50/20' 
            : isSelected
            ? 'bg-trust-blue-cta text-white font-bold shadow-md hover:bg-primary'
            : isToday
            ? 'border-2 border-trust-blue-cta/40 text-primary hover:bg-soft-cyan-bg/30'
            : 'hover:bg-soft-cyan-bg/50 text-slate-text cursor-pointer'
        }`}
      >
        <span>{day}</span>
        {isToday && !isSelected && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-trust-blue-cta rounded-full"></span>
        )}
      </button>
    );
  });

  return (
    <div className="relative pt-[88px] min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 w-full">
        
        {/* Header Title block */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-3 leading-tight font-heading">
            Book Your Visit in 60 Seconds
          </h1>
          <p className="text-base md:text-lg text-slate-text max-w-2xl mx-auto">
            Experience our tech-forward, pain-free approach in Austin. Select a time that works for you, and we'll handle the rest.
          </p>
        </div>

        {/* Dynamic Multi-State Container */}
        <AnimatePresence mode="wait">
          {!confirmedBookingData ? (
            <motion.div 
              key="booking-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* LEFT COLUMN: Date Picker + Time Slots + Forms */}
              <div className="lg:col-span-8 bg-clinical-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
                <form onSubmit={handleConfirm}>
                  
                  {/* STEP 1: Interactive Calendar calendar_month */}
                  <div className="mb-8 border-b border-slate-100 pb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center gap-2 font-heading">
                      <span className="material-symbols-outlined text-trust-blue-cta font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                        calendar_month
                      </span>
                      Select Date &amp; Time
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Custom Real Calendar Visual Engine */}
                      <div className="bg-surface-bright rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <button 
                            type="button" 
                            onClick={handlePrevMonth}
                            className="text-on-surface-variant hover:text-trust-blue-cta p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <span className="material-symbols-outlined font-bold">chevron_left</span>
                          </button>
                          <span className="font-bold text-sm text-primary uppercase tracking-wider font-heading">
                            {monthNames[selectedMonth]} {selectedYear}
                          </span>
                          <button 
                            type="button" 
                            onClick={handleNextMonth}
                            className="text-on-surface-variant hover:text-trust-blue-cta p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <span className="material-symbols-outlined font-bold">chevron_right</span>
                          </button>
                        </div>

                        {/* Week days */}
                        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-text/75 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">
                          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>

                        {/* Visual calendar grid of days */}
                        <div className="grid grid-cols-7 gap-1 text-center font-semibold">
                          {blanks}
                          {days}
                        </div>
                      </div>

                      {/* Right: Selected Day's Hours options */}
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-text/70 uppercase tracking-widest block mb-1">
                          Availability Schedule
                        </span>
                        <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-1">
                          <span className="material-symbols-outlined text-teal-600 text-lg">event</span>
                          Available on {selectedDay} {monthNames[selectedMonth].slice(0, 3)}
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                          {AVAILABLE_TIMES.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-4 rounded-xl text-xs font-semibold text-center border transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? 'border-2 border-trust-blue-cta bg-soft-cyan-bg font-bold text-trust-blue-cta shadow-sm scale-[1.01]'
                                    : 'border-slate-200 text-slate-text hover:border-slate-300 hover:text-primary hover:bg-slate-50'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-slate-text/70 italic mt-4 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[12px] font-bold text-teal-600">notification_important</span> 
                          Saturdays and Sundays closed for medical rest.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: Guest Details Form */}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center gap-2 font-heading">
                      <span className="material-symbols-outlined text-trust-blue-cta font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                        person
                      </span>
                      Guest Details
                    </h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-text uppercase tracking-widest mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full text-sm rounded-xl border border-slate-200 focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-3 text-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-text uppercase tracking-widest mb-1.5">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="(555) 123-4567"
                            className="w-full text-sm rounded-xl border border-slate-200 focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-3 text-primary outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-text uppercase tracking-widest mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="jane@example.com"
                          className="w-full text-sm rounded-xl border border-slate-200 focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-3 text-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-text uppercase tracking-widest mb-1.5">Reason for Visit</label>
                        <select
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full text-sm rounded-xl border border-slate-200 focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-3 text-primary outline-none bg-white font-medium"
                        >
                          <option value="Family & Pediatric Care">Family &amp; Pediatric Care</option>
                          <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                          <option value="Emergency Dental Care">Emergency Dental Care</option>
                          <option value="Routine Cleaning & Checkup">Routine Cleaning &amp; Checkup</option>
                          <option value="Teeth Whitening Consultation">Teeth Whitening Consultation</option>
                        </select>
                      </div>

                      {/* Terms and secure box */}
                      <div className="pt-6 border-t border-slate-50 mt-8">
                        <button
                          type="submit"
                          className="w-full bg-trust-blue-cta text-clinical-white font-extrabold py-4 rounded-full hover:bg-primary shadow-lg transition-all duration-200 active:scale-[0.99] cursor-pointer text-center text-sm tracking-wide uppercase"
                        >
                          Confirm Appointment
                        </button>
                        
                        <p className="text-center text-xs text-slate-text/70 mt-3 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-teal-600 font-bold">lock</span> 
                          Secure HIPAA Encrypted Booking
                        </p>
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              {/* RIGHT COLUMN: Sidebar elements */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Visual Accent Img Card */}
                <div className="rounded-2xl overflow-hidden h-52 relative shadow-lg group">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent z-10"></div>
                  <img 
                    alt="Modern dental clinic" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGSypLX2_I2uOWHZjtA8R2bVfEBLxTM21MQBuc-nWzXjrnVeFQxW27Rm-f65-WUGE2dXYeCkMcspFWthwtd1ynYnyEU91WVmY1a0PRTAEb8QwP0cP4OFqTiqT6sjeBEo96CPp5BAvyacu-jNBWLMTznxFjcacIm4Fr161eJaHw30DiIqq7UrxeGNKFG7CkfZhKgK4DdtkLT_57o-4ehRQv_HN1GnX18QaHm0qncM_ayC683UlRStV4z2S6w5f6if0w2WEzmxo-gJI"
                  />
                  <div className="absolute bottom-5 left-5 z-20">
                    <div className="flex items-center gap-1 text-accent-gold-star mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined font-bold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <p className="text-clinical-white font-bold text-sm italic">
                      "I had immediate pain relief and exceptional family comfort."
                    </p>
                    <span className="text-[10px] text-white/85 font-semibold uppercase tracking-wider block mt-1">— Mark T., Austin</span>
                  </div>
                </div>

                {/* Guarantee Card */}
                <div className="bg-soft-cyan-bg rounded-2xl p-6 border border-teal-100 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3 text-trust-blue-cta">
                    <div className="bg-trust-blue-cta text-clinical-white rounded-full p-1.5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                    </div>
                    <h3 className="text-lg font-bold font-heading text-primary">Pain-Free Guarantee</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-text leading-relaxed">
                    We utilize modern, tech-forward techniques and gentle micro-instrument care to ensure your visit is as comfortable as physically possible. Dental anxiety is deeply common; our tranquil environment and sensory blocks are designed specifically to help your muscles relax completely.
                  </p>
                </div>

                {/* Family Block Scheduling */}
                <div className="bg-surface-container-highest rounded-2xl p-6 border border-slate-100 relative overflow-hidden transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3 text-trust-blue-cta">
                    <span className="material-symbols-outlined text-3xl font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_1</span>
                    <h3 className="text-lg font-bold font-heading text-primary">Family Block Scheduling</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-text leading-relaxed mb-4">
                    Extremely busy family schedule? Book multiple guests in consecutive or simultaneous blocks with our multi-hygienist team. Save time, minimize commute stress, and keep children together.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setReason('Family & Pediatric Care')}
                    className="text-trust-blue-cta font-extrabold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Select Family Block <span className="material-symbols-outlined text-sm font-semibold">arrow_forward</span>
                  </button>
                </div>

              </div>

            </motion.div>
          ) : (
            /* SUCCESS TICKET DETAILS CARD VIEW */
            <motion.div 
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto bg-clinical-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
            >
              <div className="bg-emerald-600 p-8 text-center text-white relative">
                <div className="absolute top-4 right-4 text-white/30 text-8xl font-bold font-heading select-none pointer-events-none">OK</div>
                <span className="material-symbols-outlined text-5xl font-bold bg-white/20 p-3 rounded-full mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <h2 className="text-2xl font-bold font-heading">Pre-Confirmed Appointment!</h2>
                <p className="text-xs text-white/85 mt-1">Successfully registered in our clinical system.</p>
              </div>

              {/* Appointment card pass styling */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="border-b border-dashed border-slate-200 pb-6 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-text/70 block font-semibold mb-1">RESERVATION CODE</span>
                  <span className="text-xl font-bold font-heading text-primary bg-neutral-100 px-4 py-2 rounded-xl border border-slate-200/50">
                    CC-{(Math.floor(Math.random() * 900000) + 100000)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-text/75 block font-semibold uppercase tracking-wider">Patient:</span>
                    <span className="font-bold text-primary text-base block">{confirmedBookingData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-text/75 block font-semibold uppercase tracking-wider">Phone:</span>
                    <span className="font-semibold text-primary block">{confirmedBookingData.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-text/75 block font-semibold uppercase tracking-wider">Requested Service:</span>
                    <span className="font-semibold text-primary block text-xs">{confirmedBookingData.reasonForVisit}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-text/75 block font-semibold uppercase tracking-wider">Medical Format:</span>
                    <span className="font-bold text-emerald-600 block flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-sm font-semibold">shield</span> Clinically Safe
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 border border-slate-100 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-trust-blue-cta text-3xl">event_available</span>
                    <div>
                      <span className="text-xs text-slate-text/75 block font-semibold uppercase tracking-wider">Scheduled Date and Time:</span>
                      <span className="text-base font-extrabold text-primary">
                        {confirmedBookingData.date} at {confirmedBookingData.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-text/80 leading-relaxed text-center px-4">
                  A confirmation SMS and an email reminder have been sent. You can view or cancel this appointment in the <span className="font-bold text-trust-blue-cta inline">"My Bookings"</span> tab in the top menu.
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={handleSuccessClose}
                    className="w-full bg-trust-blue-cta text-white font-bold py-3.5 rounded-full hover:bg-primary transition-all text-center text-sm cursor-pointer outline-none shadow-md hover:shadow-lg"
                  >
                    View My Bookings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
