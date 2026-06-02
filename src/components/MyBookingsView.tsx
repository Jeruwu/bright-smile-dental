import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../types';

interface MyBookingsViewProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  setView: (view: 'landing' | 'booking' | 'bookings') => void;
}

export default function MyBookingsView({ appointments, onCancelAppointment, setView }: MyBookingsViewProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const activeAppointments = appointments.filter(a => a.status === 'confirmed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  const handleCancel = (id: string) => {
    onCancelAppointment(id);
    setCancellingId(null);
  };

  const handleDownloadCalendar = (appointment: Appointment) => {
    // Generate simple simulated client .ics download payload or show success alert
    const title = `Cita Bright Smile Dental - ${appointment.reasonForVisit}`;
    const desc = `Cita odontologica para ${appointment.fullName}. Consulta en Austin, TX.`;
    const location = "Bright Smile Dental, Austin, TX";
    
    // We can simulate creating a real file download! This is very premium.
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bright Smile Dental//Cal//EN
BEGIN:VEVENT
UID:${appointment.id}
DTSTAMP:20261010T120000Z
DTSTART:20261009T130000Z
DURATION:PT1H
SUMMARY:${title}
DESCRIPTION:${desc}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cita-bright-smile-dental.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative pt-[88px] min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        
        {/* Header navigation section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary font-heading">
              Gestión de Mis Citas
            </h1>
            <p className="text-sm text-slate-text mt-1">
              Visualiza, descarga invitaciones de calendario, o cancela tus reservaciones actuales.
            </p>
          </div>

          <button 
            onClick={() => setView('booking')}
            className="bg-trust-blue-cta text-white text-xs font-bold px-5 py-3 rounded-full hover:bg-primary transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm font-semibold">add</span>
            Programar Nueva Cita
          </button>
        </div>

        {/* Content list layout */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-12 text-center">
            <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">calendar_today</span>
            <h3 className="text-lg font-bold text-primary font-heading">Aún no cuentas con citas registradas</h3>
            <p className="text-sm text-slate-text max-w-sm mx-auto mt-1 mb-6">
              Programa tu limpieza dental, blanqueamiento o consulta con el Dr. Michael Chen hoy mismo.
            </p>
            <button
              onClick={() => setView('booking')}
              className="bg-soft-cyan-bg text-trust-blue-cta hover:bg-trust-blue-cta hover:text-white font-bold text-xs px-6 py-3 rounded-full transition-all cursor-pointer"
            >
              Reservar Cita en 60 Segundos
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 1. Active Confirmed Bookings list */}
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-extrabold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg w-fit mb-4">
                <span className="material-symbols-outlined text-sm font-semibold">verified</span> 
                Próximas Reservas Confirmadas ({activeAppointments.length})
              </div>

              {activeAppointments.length === 0 ? (
                <p className="text-xs text-slate-text italic pl-1">No cuentas con citas confirmadas pendientes para las siguientes semanas.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeAppointments.map((app) => (
                    <motion.div
                      key={app.id}
                      layout
                      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-primary to-primary-container p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined">schedule</span>
                          <span className="font-bold text-xs font-heading">{app.timeSlot}</span>
                        </div>
                        <span className="text-[9px] uppercase font-extrabold tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-500/45 px-2 py-0.5 rounded-full">
                          Confirmado
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-text/70 block">Fecha Agendada</span>
                          <span className="text-base font-extrabold text-primary">{app.date}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-text/70 block">Paciente</span>
                            <span className="font-semibold text-primary">{app.fullName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-text/70 block">Tratamiento</span>
                            <span className="font-semibold text-primary">{app.reasonForVisit}</span>
                          </div>
                        </div>

                        {/* Pseudo barcode graphic to mimic clinic passes in design! */}
                        <div className="border-t border-b border-dashed border-slate-100 py-3 flex flex-col items-center justify-center">
                          <div className="text-[14px] text-primary/45 tracking-[4px] font-mono leading-none font-bold">
                            ||||| | ||||| | ||| |||| || ||
                          </div>
                          <span className="text-[9px] text-slate-text/60 mt-1 uppercase font-semibold">Cita ID: {app.id.toUpperCase()}</span>
                        </div>

                        <div className="flex gap-2 pt-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleDownloadCalendar(app)}
                            className="flex-1 bg-soft-cyan-bg text-trust-blue-cta text-center py-2.5 rounded-xl font-bold hover:bg-trust-blue-cta hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                            Calendario .ics
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setCancellingId(app.id)}
                            className="bg-red-50 text-red-600 px-3.5 rounded-xl font-semibold hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center"
                            title="Cancelar Cita"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Cancelled appointments registry */}
            {cancelledAppointments.length > 0 && (
              <div className="pt-8 border-t border-slate-100/80">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-extrabold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit mb-4">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Historial de Citas Canceladas ({cancelledAppointments.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                  {cancelledAppointments.map((app) => (
                    <div
                      key={app.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <span className="text-[10px] text-slate-text/60 font-semibold uppercase block">Fecha cancelada</span>
                        <span className="text-sm font-bold text-slate-600 line-through block">{app.date} - {app.timeSlot}</span>
                        <span className="text-xs text-slate-text italic block mt-0.5">{app.reasonForVisit}</span>
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wider bg-red-100 text-red-700 px-2.5 py-1 rounded-full uppercase border border-red-200">
                        Cancelada
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Confirmation Dialog Dialog for Cancellation */}
      <AnimatePresence>
        {cancellingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-red-50"
            >
              <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
              
              <h3 className="text-lg font-extrabold text-primary font-heading">¿Seguro que deseas cancelar?</h3>
              <p className="text-sm text-slate-text my-2 leading-relaxed">
                Esta acción liberará el espacio solicitado para que otro paciente en Austin pueda agendar al Dr. Michael Chen.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleCancel(cancellingId)}
                  className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 active:scale-95 transition-all cursor-pointer text-xs"
                >
                  Sí, Cancelar Cita
                </button>
                <button
                  type="button"
                  onClick={() => setCancellingId(null)}
                  className="flex-1 bg-neutral-100 text-slate-text font-semibold py-2.5 rounded-xl hover:bg-neutral-200 transition-all cursor-pointer text-xs"
                >
                  Mantener Cita
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
