import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review, Service } from '../types';
import InteractiveCalculator from './InteractiveCalculator';

interface LandingViewProps {
  setView: (view: 'landing' | 'booking' | 'bookings') => void;
  setSelectedService: (service: string) => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id'>) => void;
}

const SERVICES: Service[] = [
  {
    id: 'family',
    name: 'Family & Pediatric Care',
    description: 'Gentle routine cleanings and cavity prevention designed for all ages. Care gentle enough for your little ones.',
    longDescription: 'Our comprehensive family checkups go beyond simple cleanings. We provide safe, specialized care for infants, teenagers, and seniors alike. By monitoring dental benchmarks closely, we prevent dental anxiety earlier in life and build strong foundational brushing habits.',
    startingPrice: '$150 / visit',
    icon: 'child_care',
    benefits: ['Comprehensive Cleanings', 'Cavity Prevention', 'Growth Monitoring', 'Fluoride Shields']
  },
  {
    id: 'cosmetic',
    name: 'Cosmetic Dentistry',
    description: 'Achieve the smile you\'ve always wanted with professional teeth whitening and Invisalign treatments.',
    longDescription: 'Modern aesthetic treatments designed to blend seamless durability with natural beauty. From advanced chairside porcelain veneers and state-of-the-art clear aligners (Invisalign) to express custom bleaching, we customize procedures to fit your biological smile lines.',
    startingPrice: '$300',
    icon: 'auto_awesome',
    benefits: ['Invisalign Aligners', 'Porcelain Veneers', 'Laser Zoom Whitening', 'Bespoke Smile Design']
  },
  {
    id: 'emergency',
    name: 'Emergency Dental Care',
    description: 'Experiencing pain? We offer same-day appointments to provide fast relief when you need it most.',
    longDescription: 'Sudden toothaches, chipped crowns, or sports injuries require active, immediate intervention. We stand by with dedicated same-day emergency slots to treat abscesses, repair structural enamel breaks, control swelling, and relieve sharp nerve pain calmly.',
    startingPrice: '$180 / evaluation',
    icon: 'medical_services',
    benefits: ['Same-day Relief Slots', 'Toothache Interventions', 'Crown Repairs', 'Root Canal Diagnostics']
  }
];

export default function LandingView({ setView, setSelectedService, reviews, onAddReview }: LandingViewProps) {
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<Service | null>(null);
  
  // Custom interactive symptom checker variables
  const [symptomInput, setSymptomInput] = useState('');
  const [customAlertMessage, setCustomAlertMessage] = useState<string | null>(null);
  const [showInteractiveAlert, setShowInteractiveAlert] = useState(false);

  // Feedback form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) {
      setCustomAlertMessage("Please enter a valid dental query before submitting.");
      setShowInteractiveAlert(true);
      return;
    }

    const query = symptomInput.toLowerCase();
    let adviceText = '';
    if (query.includes('dolor') || query.includes('duele') || query.includes('pain') || query.includes('ache') || query.includes('molestia')) {
      adviceText = '⚠️ EMERGENCY RECOMMENDATION:\nDental pain or discomfort is usually an indicator of active infection, structural damage, or nerve inflammation. It is important NOT to self-medicate. We recommend scheduling an "Emergency Dental Care" appointment today for immediate relief. Avoid very hot or cold foods.';
    } else if (query.includes('blanqueamiento') || query.includes('amarillo') || query.includes('mancha') || query.includes('estetic') || query.includes('white')) {
      adviceText = '✨ COSMETIC RECOMMENDATION:\nZoom laser teeth whitening is ideal to safely revitalize your enamel tone. Schedule a "Teeth Whitening" or "Cosmetic Dentistry" consultation with Dr. Michael Chen.';
    } else if (query.includes('limpieza') || query.includes('sarro') || query.includes('preventiv') || query.includes('chequeo') || query.includes('clean')) {
      adviceText = '🩺 PREVENTIVE INDICATION:\nA professional dental cleaning should be done every 6 months. It removes tartar, preventing gingivitis and gum disease. Book a "Family & Pediatric Care" or "Routine Cleaning & Checkup" session right now.';
    } else if (query.includes('precio') || query.includes('costo') || query.includes('descuento') || query.includes('membresia') || query.includes('ahorro') || query.includes('price')) {
      adviceText = '💳 RATE INFORMATION:\nAt Bright Smile Dental we promote total financial transparency. Check our Price Simulator on this page to calculate your savings with our Membership Plan.';
    } else {
      adviceText = `🦷 GENERAL RECOMMENDATION:\nThank you for asking about "${symptomInput}". Dr. Michael Chen suggests a complete physical and radiographic exam in our clinic for an accurate diagnosis. We are ready to assist you today!`;
    }

    setCustomAlertMessage(adviceText);
    setShowInteractiveAlert(true);

    // Also trigger standard native alert safely
    try {
      window.alert(`Bright Smile Alert - Dental Query: "${symptomInput}"\n\nRecommendation:\n${adviceText}`);
    } catch (err) {
      console.log("Could not trigger browser window.alert, displaying modern overlay alert instead", err);
    }
  };

  const handleBookingWithService = (serviceName: string) => {
    setSelectedService(serviceName);
    setView('booking');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    onAddReview({
      author: newAuthor,
      content: newContent,
      stars: newRating,
      isCustom: true
    });

    setNewAuthor('');
    setNewContent('');
    setNewRating(5);
    setShowFeedbackSuccess(true);
    setTimeout(() => {
      setShowFeedbackSuccess(false);
    }, 4000);
  };

  return (
    <div className="relative overflow-x-hidden pt-[88px]">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-20 md:pb-28 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-soft-cyan-bg rounded-full blur-[100px] opacity-60 -z-10 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-surface-container rounded-full blur-[80px] opacity-30 -z-10 -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Rating badge */}
            <div className="inline-flex items-center gap-2 bg-soft-cyan-bg/80 border border-teal-100/60 px-4 py-2 rounded-full w-fit">
              <div className="flex text-accent-gold-star">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <span className="font-semibold text-xs md:text-sm text-primary">4.9-star rating from 312 reviews</span>
            </div>

            <h1 className="font-extrabold text-4xl md:text-6xl text-primary leading-[1.1] tracking-tight">
              Your Texas Home for a <br />
              <span className="text-trust-blue-cta relative inline-block">
                Pain-Free,
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-soft-cyan-bg -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                </svg>
              </span> <br />
              Brighter Smile.
            </h1>
            
            <p className="text-base md:text-lg text-slate-text max-w-2xl leading-relaxed">
              Experience modern care designed around your comfort. We combine advanced technology with gentle techniques, offering flexible family scheduling so you can prioritize your health without the stress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setView('booking')}
                className="bg-trust-blue-cta text-clinical-white font-bold text-sm px-8 py-4 rounded-full hover:bg-primary hover:shadow-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Booking In 60 Seconds
                <span className="material-symbols-outlined">calendar_month</span>
              </button>
              
              <button 
                onClick={() => {
                  document.getElementById('transparent-pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-clinical-white text-trust-blue-cta border-2 border-trust-blue-cta/80 font-bold text-sm px-8 py-4 rounded-full hover:bg-soft-cyan-bg/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                View Transparent Pricing
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative mt-8 lg:mt-0"
          >
            {/* Aspect image of modern dental room */}
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] bg-slate-100 transform hover:scale-[1.01] transition-transform duration-300"
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZ1GnaeS8rgC9UqSWFY89tq2ptNgQROJIBFfOELppPYddN_bXjkD3RZFuPh4N5KMXSRO770QGkNMAKSIAwEnjm-pW-qwrAI0NrT0J5EYZG1uZMXEHRo4R1CIYRVjKFKTXOAJbkaZKdWgpLU9v_Bd4HYXWu3kUQ-h2PM9_hy8oIJjuWAio83xY-oxrn3YZ4du5aWZGUvzu1AshIyHNg82hRwisHGBAdPHIhmwg9toMdATRUyZnq5TZQmtNjVmUbIEsBys7yt0G170k')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
            </div>
            
            {/* Floating Family Booking Widget */}
            <div className="absolute -bottom-6 -left-6 glass-panel rounded-xl p-5 soft-shadow max-w-[280px] border border-white/60">
              <div className="flex items-start gap-4">
                <div className="bg-soft-cyan-bg p-3 rounded-full text-trust-blue-cta">
                  <span className="material-symbols-outlined font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-primary mb-1">Family Block Scheduling</h3>
                  <p className="text-xs text-slate-text">Book multiple members in one simple structured appointment.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Services Section (Bento Grid) */}
      <section className="py-20 bg-soft-cyan-bg/50" id="services">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 font-heading">
              Comprehensive Care for Every Smile
            </h2>
            <p className="text-base md:text-lg text-slate-text">
              Advanced dental treatments tailored specifically to your comfort, time, and budget. Transparent pricing in writing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((srv, index) => {
              const isDark = srv.id === 'emergency';
              return (
                <motion.div 
                  key={srv.id}
                  whileHover={{ y: -6 }}
                  className={`rounded-2xl p-8 soft-shadow flex flex-col h-full border transition-all ${
                    isDark 
                      ? 'bg-trust-blue-cta text-clinical-white border-primary-container lg:translate-y-4' 
                      : 'bg-clinical-white border-slate-100 hover:border-slate-300 text-slate-text'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
                    isDark ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-surface-container text-trust-blue-cta'
                  }`}>
                    <span className="material-symbols-outlined text-3xl font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {srv.icon}
                    </span>
                  </div>

                  <h3 className={`text-xl md:text-2xl font-bold font-heading mb-3 ${
                    isDark ? 'text-white' : 'text-primary'
                  }`}>
                    {srv.name}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-6 flex-grow ${
                    isDark ? 'text-white/90' : 'text-slate-text'
                  }`}>
                    {srv.description}
                  </p>

                  <div className="mb-6">
                    <button
                      onClick={() => setSelectedServiceDetail(srv)}
                      className={`text-xs font-bold underline flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${
                        isDark ? 'text-white' : 'text-trust-blue-cta'
                      }`}
                    >
                      Read full treatment coverage
                      <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                    </button>
                  </div>

                  <div className={`mt-auto pt-6 border-t flex items-center justify-between ${
                    isDark ? 'border-white/20' : 'border-slate-100'
                  }`}>
                    <div>
                      <span className={`text-[10px] block font-semibold uppercase tracking-wider ${
                        isDark ? 'text-white/70' : 'text-slate-text/70'
                      }`}>
                        Starting From
                      </span>
                      <span className={`text-base font-extrabold ${
                        isDark ? 'text-white' : 'text-trust-blue-cta'
                      }`}>
                        {srv.startingPrice}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleBookingWithService(srv.name)}
                      className={`font-semibold text-xs px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer ${
                        isDark 
                          ? 'bg-white text-trust-blue-cta hover:bg-neutral-50' 
                          : 'bg-trust-blue-cta text-white hover:bg-primary'
                      }`}
                    >
                      {isDark ? 'Fast Call/Book' : 'Book Services'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Dentist Intro Section */}
      <section className="py-20 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[4/5] bg-neutral-100 group">
            <img 
              alt="Dr. Michael Chen" 
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHXbsGOkbyewxBv1udlZYradV9YK2O8fxzRq66I8d8CxrRYjNWhX4IBY4EXDvoqDKtSJvNFshf2MkcGX4LOk6S3fAxy98zglhJcrmkVrOz05WG5j4q65Yr_05A8-MfsPMdy8ga1Dqx8kbZtOilaOu4MSKhsbrxlgaFk-MTZilyNTSJbspK7blKv4doU7LI2xpDtiyVpJWhWAOKGtu0bJimedUjGsYHIWRPCs44s9mIyDfD1JrafQT8RffcyW4pzDqjN4fCGhK26Sg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-slate-text text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-md w-fit">
              <span className="material-symbols-outlined text-xs">verified_user</span> Clinician Highlight
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary font-heading">
              Meet Dr. Michael Chen
            </h2>
            <p className="text-lg text-slate-text leading-relaxed">
              With over 8 years of experience serving the Austin community, Dr. Chen is dedicated to providing advanced care in a welcoming environment. He believes that every patient deserves a comfortable, pain-free experience tailored to their unique needs.
            </p>
            <div className="border-l-4 border-trust-blue-cta pl-4 my-2">
              <p className="font-medium text-slate-text text-base italic leading-relaxed">
                "My goal is to change the way people think about visiting the dentist. By combining the latest technology with a focus on patient comfort, we strive to make every visit a positive one."
              </p>
              <span className="text-xs font-bold uppercase text-primary tracking-wider block mt-2">
                — Dr. Michael Chen, DDS
              </span>
            </div>
            <div className="pt-4 flex flex-wrap gap-4 items-center text-slate-text text-sm">
              <div className="flex items-center gap-1 bg-neutral-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="material-symbols-outlined text-trust-blue-cta text-lg">school</span>
                <span>Columbia Dental School, DDS</span>
              </div>
              <div className="flex items-center gap-1 bg-neutral-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="material-symbols-outlined text-trust-blue-cta text-lg">workspace_premium</span>
                <span>Active ADA Member</span>
              </div>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => setView('booking')}
                className="bg-trust-blue-cta text-clinical-white font-bold text-sm px-8 py-4 rounded-full hover:bg-primary transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
              >
                Schedule Consultation With Dr. Chen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3b. Consultorio de Orientación Buco-Dental (Interactivo) */}
      <section className="py-16 bg-neutral-50 dark:bg-slate-900/40 border-t border-b border-slate-100 dark:border-slate-800 transition-colors duration-300" id="consultation">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-trust-blue-cta dark:text-sky-400 bg-soft-cyan-bg dark:bg-slate-800 px-3 py-1 rounded-md">
            Self-Service Patient Support
          </span>
          <h2 className="text-3xl font-extrabold text-primary dark:text-white mt-3 mb-4 font-heading">
            Quick Symptom Checker
          </h2>
          <p className="text-sm md:text-base text-slate-text dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Feeling discomfort or have a specific question? Enter your symptom or question (e.g., <code className="bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded text-trust-blue-cta dark:text-sky-300 font-mono text-xs">pain</code>, <code className="bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded text-trust-blue-cta dark:text-sky-300 font-mono text-xs">whitening</code>, <code className="bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded text-trust-blue-cta dark:text-sky-300 font-mono text-xs">cleaning</code>) and click below for our Bright Smile Dental virtual assistant to provide an alert with immediate recommendations.
          </p>

          <form onSubmit={handleSymptomSubmit} className="max-w-xl mx-auto bg-white dark:bg-slate-800/90 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-750 flex flex-col gap-4">
            <div className="text-left">
              <label htmlFor="symptom-input" className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2 font-heading">
                Enter your Question or Symptom:
              </label>
              <input
                id="symptom-input"
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="E.g. Constant toothache when biting, crown price..."
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary dark:text-white focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-4 outline-none transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-trust-blue-cta dark:bg-sky-500 hover:bg-primary dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold py-3.5 px-6 rounded-full transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer outline-none text-sm tracking-wide"
            >
              <span className="material-symbols-outlined text-lg">medical_information</span>
              Get Clinical Recommendation Alert
            </button>
          </form>
        </div>
      </section>

      {/* 4. Membership & Transparent Pricing */}
      <section className="py-20 bg-soft-cyan-bg/50 border-t border-slate-100" id="transparent-pricing">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6" id="membership">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary font-heading">
              Membership &amp; Transparent Pricing
            </h2>
            <p className="text-base md:text-lg text-slate-text">
              We believe in transparent pricing with no surprise bills. For those without insurance, our in-house membership plan offers a simple, affordable way to get the preventive care you need, plus hefty discounts on structural dental treatments.
            </p>
            
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-trust-blue-cta mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <span className="font-semibold text-primary text-sm block">Clarity from the Start</span>
                  <span className="text-xs text-slate-text">We verify cost, outline a flat percentage map, and get approval before cleanings begin.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-trust-blue-cta mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <span className="font-semibold text-primary text-sm block">Affordable Monthly Plans</span>
                  <span className="text-xs text-slate-text">Starting at just $29/mo for standard adult cleanings, checkups, x-rays, and examinations.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-trust-blue-cta mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <span className="font-semibold text-primary text-sm block">No Bureaucracy or Underwriters</span>
                  <span className="text-xs text-slate-text">No pre-approvals, maximum caps, waiting periods, or complex deductibles. Real care when you ask.</span>
                </div>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => setView('booking')}
                className="bg-trust-blue-cta text-clinical-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-full hover:bg-primary transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                Subscribe to Plan Online
              </button>
              <button 
                onClick={() => {
                  window.location.href = "tel:(123)456-7890";
                }}
                className="bg-transparent text-slate-text border border-slate-300 font-semibold text-xs md:text-sm px-6 py-3.5 rounded-full hover:bg-slate-100 transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">phone_in_talk</span> Consult a Specialist
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square lg:aspect-[4/3] bg-clinical-white flex items-center justify-center p-8 border border-neutral-100 hover:shadow-3xl transition-shadow duration-300">
            <img 
              alt="Membership Card" 
              className="max-w-full max-h-full object-contain transform hover:scale-[1.02] transition-transform duration-300" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQfmNiNnk2VLX_e3whHTRbfJF7Fl2v9jCdFXaF7jiPC1OdPjIt_hOR1_pFuBlIux9USsIYN7y71IKCVGUTUWrRXfgPMKGsvL3zKHd1ut-gkp1OsFGRTi1sr_FMxnXGEIMuiCzAWKfq9qa8bCrbNBtXulyjqaiTvokXpUzUhLqiUqkNfLT9qGJeHQjEXVjFmKnFc7nMCsi0ecBcR6yGCIH0jY8C7ZmklnWdNOmXCzGPl0u-D3Y5RaPPXV3BxWl4gPxcuqzJDrGsf58"
            />
          </div>
        </div>

        {/* 4b. Embedded Interactive Price Calculator */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 mt-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-trust-blue-cta bg-soft-cyan-bg px-3 py-1 rounded">Interactive Tool</span>
            <h3 className="text-2xl font-bold font-heading text-primary mt-2">Calculate Your Treatment Savings</h3>
            <p className="text-sm text-slate-text mt-1 max-w-xl mx-auto">Toggle dental treatments to compare out-of-pocket rates with our Membership Plan.</p>
          </div>
          <InteractiveCalculator />
        </div>
      </section>

      {/* 5. Modern Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[4/5] bg-neutral-100">
            <img 
              alt="Patient Lounge" 
              className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZuC4EXrOdqK8jQpRmcLl0GyWA5O9pJCsIq_5-pik9T0L9U5ThC1u5gXnRPUrFctscahTPsHwXGgxr9NJxboAu5SWMJAJjpptglHodEgTXq61gYHKsXbU1Tj4Yxep5sPHVQN-ATzPA7rzeeIlCeohmamf4pJiAdp9IQMevNI5PaoFk6n_3fUsjs4B54YblyyKcA2CWJxd0poFr5T8vLoI64o_j2KNlZcaYYGHlh9k4RdmgoL_DCmd3nnPN1bnDiFFcAusl6yvVyWE"
            />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary font-heading">
              Modern Technology, Warm Environment
            </h2>
            <p className="text-base md:text-lg text-slate-text leading-relaxed">
              Step into our Patient Lounge and relax. We've designed our clinic to feel more like a comfortable, cozy living room than a sterile, daunting medical office. Combined with our use of advanced non-invasive machinery, we ensure faster, more accurate scans and virtually pain-free experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-2 text-trust-blue-cta">
                  <span className="material-symbols-outlined text-3xl font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>chair</span>
                  <h4 className="font-bold text-primary text-base">Cozy Seating Area</h4>
                </div>
                <p className="text-sm text-slate-text">
                  Relax before your checkup in our welcoming, designer-styled waiting lounge with fresh coffee and soft lighting.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-trust-blue-cta">
                  <span className="material-symbols-outlined text-3xl font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                  <h4 className="font-bold text-primary text-base">State-of-the-art Enamel Scan</h4>
                </div>
                <p className="text-sm text-slate-text">
                  Ultralow-radiation 3D imaging, digital dental impressions, and painless laser cleaning instruments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Reviews & Patient Voices Section with interactive review builder */}
      <section className="py-20 bg-soft-cyan-bg/30 border-t border-b border-slate-100" id="reviews">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-trust-blue-cta bg-soft-cyan-bg px-3 py-1 rounded">Real Opinions</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mt-2 font-heading">
              What Our Patients Say
            </h2>
            <p className="text-base md:text-lg text-slate-text mt-1">
              Real stories written by our wonderful family of patients in the Austin community.
            </p>
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <motion.div 
                key={r.id}
                layout
                className={`bg-clinical-white p-8 rounded-2xl soft-shadow border border-surface-container flex flex-col justify-between ${
                  r.isCustom ? 'border-teal-200 bg-teal-50/10' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-accent-gold-star">
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    {r.isCustom && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                        Current User
                      </span>
                    )}
                  </div>
                  <p className="text-slate-text font-medium text-sm italic leading-relaxed mb-6">
                    "{r.content}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {r.author.slice(0, 2)}
                  </div>
                  <span className="font-bold text-primary text-sm">— {r.author}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Leave a review interactive segment */}
          <div className="mt-16 max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200/60 p-6 md:p-8">
            <h3 className="text-xl font-bold font-heading text-primary flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-trust-blue-cta">rate_review</span>
              Already visited us? Write your review!
            </h3>
            <p className="text-xs text-slate-text mb-6">Your opinion helps us keep our clinical quality high and transparent.</p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-text mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="E.g. Sophia Garza"
                    className="w-full text-sm rounded-xl border border-slate-200 focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-3 text-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-text mb-1">Star Rating</label>
                  <div className="flex items-center gap-1.5 h-[46px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-accent-gold-star hover:scale-110 active:scale-95 transition-all text-left focus:outline-none"
                      >
                        <span 
                          className="material-symbols-outlined text-2xl"
                          style={{ fontVariationSettings: star <= newRating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-text pl-2">{newRating} out of 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-text mb-1">Your Comment / Experience</label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Comment on Dr. Chen's care, technology or environment..."
                  className="w-full text-sm rounded-xl border border-slate-200 focus:border-trust-blue-cta focus:ring-1 focus:ring-trust-blue-cta p-3 text-primary outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="bg-trust-blue-cta text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-primary transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Submit Public Review
                </button>

                <AnimatePresence>
                  {showFeedbackSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm font-semibold">check</span> Thank you! Review added above.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* 7. Final Booking CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-trust-blue-cta text-clinical-white text-center relative overflow-hidden">
        {/* Absolute patterns */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-soft-cyan-bg/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Ready for a Brighter, Healthier Smile?
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-2xl">
            Join the Bright Smile Dental family today and experience our modern, patient-first approach in Austin. Book a hassle-free Slot.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setView('booking')}
              className="bg-white text-trust-blue-cta font-extrabold text-base px-10 py-5 rounded-full hover:bg-soft-cyan-bg hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              Book Your Visit in 60 Seconds
              <span className="material-symbols-outlined font-semibold">arrow_forward</span>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> 24/7 Emergency Care
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified_user</span> No Medical Insurance / Membership Plan
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">payments</span> Financing Available
            </span>
          </div>
        </div>
      </section>

      {/* Modal / Dialog for service read more */}
      <AnimatePresence>
        {selectedServiceDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl border border-slate-100"
            >
              <button 
                onClick={() => setSelectedServiceDetail(null)}
                className="absolute top-4 right-4 text-slate-text/60 hover:text-slate-text p-1.5 hover:bg-slate-50 rounded-xl"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-soft-cyan-bg text-trust-blue-cta p-3 rounded-xl">
                  <span className="material-symbols-outlined text-3xl font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {selectedServiceDetail.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary font-heading">{selectedServiceDetail.name}</h3>
                  <p className="text-xs text-trust-blue-cta font-bold">Starts from {selectedServiceDetail.startingPrice}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-text text-sm leading-relaxed">
                <p>{selectedServiceDetail.longDescription}</p>
                
                <div>
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2">Key points of interest:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedServiceDetail.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-emerald-600 text-base font-bold">check</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleBookingWithService(selectedServiceDetail.name);
                    setSelectedServiceDetail(null);
                  }}
                  className="flex-1 bg-trust-blue-cta text-white font-bold py-3 rounded-full hover:bg-primary active:scale-95 transition-all outline-none"
                >
                  Book {selectedServiceDetail.name}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedServiceDetail(null)}
                  className="px-6 py-3 border border-slate-200 rounded-full text-slate-text font-semibold hover:bg-slate-50 transition-all text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Clinical Alert Modal */}
      <AnimatePresence>
        {showInteractiveAlert && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 md:p-8 relative shadow-2xl border border-teal-100 dark:border-slate-800"
            >
              <button 
                onClick={() => setShowInteractiveAlert(false)}
                className="absolute top-4 right-4 text-slate-text/60 dark:text-slate-400 hover:text-slate-text dark:hover:text-white p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-3xl font-bold">
                    warning_amber
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary dark:text-white font-heading">
                    Clinical Alert Issued
                  </h3>
                  <p className="text-[10px] text-slate-text/75 dark:text-slate-400 uppercase tracking-widest font-semibold">
                    Bright Smile Guidance System
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 mb-6">
                <span className="text-[10px] font-bold text-slate-text/60 dark:text-slate-400 block uppercase tracking-wider mb-1">
                  Query Text Entered:
                </span>
                <p className="font-semibold text-primary dark:text-sky-300 text-sm italic">
                  "{symptomInput}"
                </p>
              </div>

              <div className="text-slate-text dark:text-slate-200 text-xs md:text-sm leading-relaxed space-y-4">
                {customAlertMessage && (
                  <p className="whitespace-pre-line font-medium text-slate-700 dark:text-slate-300">
                    {customAlertMessage}
                  </p>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInteractiveAlert(false);
                    // Autofill booking and go to page if they typed pain
                    if (symptomInput.toLowerCase().includes('dolor') || symptomInput.toLowerCase().includes('emergency') || symptomInput.toLowerCase().includes('pain') || symptomInput.toLowerCase().includes('duele') || symptomInput.toLowerCase().includes('molestia')) {
                      handleBookingWithService('Emergency Dental Care');
                    } else {
                      setView('booking');
                    }
                  }}
                  className="flex-1 bg-trust-blue-cta dark:bg-sky-500 hover:bg-primary dark:hover:bg-sky-400 text-clinical-white dark:text-slate-950 font-bold py-3 rounded-full active:scale-95 transition-all text-xs cursor-pointer outline-none text-center"
                >
                  Schedule Quick Appointment!
                </button>
                <button
                  type="button"
                  onClick={() => setShowInteractiveAlert(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 rounded-full text-slate-text dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs outline-none cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
