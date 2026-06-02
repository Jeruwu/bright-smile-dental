import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-10 max-w-7xl mx-auto gap-6 text-center md:text-left">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold font-heading text-primary tracking-tight">Bright Smile Dental</span>
          <span className="text-xs text-slate-text">
            © 2026 Bright Smile Dental Austin. All rights reserved.
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-text">
          <a className="hover:text-trust-blue-cta underline transition-all" href="#sc" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a className="hover:text-trust-blue-cta underline transition-all" href="#sc" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a className="hover:text-trust-blue-cta underline transition-all" href="#sc" onClick={(e) => e.preventDefault()}>HIPAA Compliance</a>
          <a className="hover:text-trust-blue-cta underline transition-all" href="#sc" onClick={(e) => e.preventDefault()}>Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
