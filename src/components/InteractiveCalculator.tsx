import React, { useState } from 'react';

interface Procedure {
  name: string;
  regularPrice: number;
  membershipDiscount: number; // as percentage, e.g. 0.20 for 20%
  insuranceCover: number; // typical insurance coverage percentage, e.g. 0.80
}

const PROCEDURES: Procedure[] = [
  { name: 'Limpieza y Examen Dental (Preventivo)', regularPrice: 210, membershipDiscount: 1.00, insuranceCover: 1.00 }, // Free with membership/insurance
  { name: 'Examen de Rayos X Completo', regularPrice: 140, membershipDiscount: 1.00, insuranceCover: 1.00 }, // Free with membership/insurance
  { name: 'Empaste Composite (Resina)', regularPrice: 190, membershipDiscount: 0.25, insuranceCover: 0.80 },
  { name: 'Extracción Simple', regularPrice: 220, membershipDiscount: 0.20, insuranceCover: 0.70 },
  { name: 'Corona Dental de Porcelana', regularPrice: 1250, membershipDiscount: 0.20, insuranceCover: 0.50 },
  { name: 'Tratamiento de Conducto (Endodoncia)', regularPrice: 950, membershipDiscount: 0.20, insuranceCover: 0.80 },
  { name: 'Blanqueamiento Dental Profesional', regularPrice: 450, membershipDiscount: 0.30, insuranceCover: 0.00 }, // Estético, no cubierto por seguro
];

export default function InteractiveCalculator() {
  const [coverageType, setCoverageType] = useState<'regular' | 'membership' | 'insurance'>('membership');
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([
    'Limpieza y Examen Dental (Preventivo)', 
    'Empaste Composite (Resina)'
  ]);

  const toggleProcedure = (name: string) => {
    if (selectedProcedures.includes(name)) {
      setSelectedProcedures(selectedProcedures.filter(p => p !== name));
    } else {
      setSelectedProcedures([...selectedProcedures, name]);
    }
  };

  const calculateCosts = () => {
    let regularTotal = 0;
    let patientOwes = 0;

    selectedProcedures.forEach(procName => {
      const proc = PROCEDURES.find(p => p.name === procName);
      if (!proc) return;

      regularTotal += proc.regularPrice;

      if (coverageType === 'regular') {
        patientOwes += proc.regularPrice;
      } else if (coverageType === 'membership') {
        // Membership gives full free checkups, 20-30% off other procedures
        if (procName.includes('Limpieza') || procName.includes('Rayos X')) {
          patientOwes += 0; // Included in Membership
        } else {
          patientOwes += proc.regularPrice * (1 - proc.membershipDiscount);
        }
      } else if (coverageType === 'insurance') {
        // Insurance usually pays certain percentages, subject to deductibles (we approximate)
        patientOwes += proc.regularPrice * (1 - proc.insuranceCover);
      }
    });

    return {
      regularTotal,
      patientOwes,
      savings: regularTotal - patientOwes
    };
  };

  const { regularTotal, patientOwes, savings } = calculateCosts();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-trust-blue-cta text-3xl">calculate</span>
        <div>
          <h3 className="text-xl font-bold font-heading text-primary">Simulador de Precios Transparentes</h3>
          <p className="text-xs text-slate-text">Visualiza tarifas y calcula tu ahorro al instante antes de visitarnos.</p>
        </div>
      </div>

      {/* Select coverage type */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-text/70 mb-2">
          ¿Cuál es tu método de cobertura?
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setCoverageType('regular')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
              coverageType === 'regular'
                ? 'border-primary bg-primary text-white shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-text'
            }`}
          >
            Sin Seguro / Particular
          </button>
          <button
            type="button"
            onClick={() => setCoverageType('membership')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col items-center justify-center relative overflow-hidden ${
              coverageType === 'membership'
                ? 'border-trust-blue-cta bg-soft-cyan-bg text-trust-blue-cta font-bold shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-text'
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider absolute top-0 bg-trust-blue-cta text-white w-full text-center">Bestseller</span>
            <span className="mt-1">Afiliado BrightSmile</span>
          </button>
          <button
            type="button"
            onClick={() => setCoverageType('insurance')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
              coverageType === 'insurance'
                ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-text'
            }`}
          >
            Seguro Convencional
          </button>
        </div>
      </div>

      {/* Checklist of services */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-text/70 mb-2">
          Selecciona los Tratamientos / Servicios:
        </label>
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
          {PROCEDURES.map((proc, index) => {
            const isSelected = selectedProcedures.includes(proc.name);
            return (
              <label
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-soft-cyan-bg bg-surface/80'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProcedure(proc.name)}
                    className="rounded text-trust-blue-cta focus:ring-trust-blue-cta w-4.5 h-4.5 border-slate-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-primary block">{proc.name}</span>
                    <span className="text-xs text-slate-text/80">
                      {proc.regularPrice === 210 || proc.regularPrice === 140 ? (
                        <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                          Gratis con Afiliación
                        </span>
                      ) : (
                        <span>Descuento del {Math.round(proc.membershipDiscount * 100)}% disponible</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-text line-through block">${proc.regularPrice}</span>
                  <span className="text-sm font-bold text-primary">
                    ${coverageType === 'membership' && (proc.name.includes('Limpieza') || proc.name.includes('Rayos X'))
                      ? 0
                      : Math.round(
                          coverageType === 'membership'
                            ? proc.regularPrice * (1 - proc.membershipDiscount)
                            : coverageType === 'insurance'
                            ? proc.regularPrice * (1 - proc.insuranceCover)
                            : proc.regularPrice
                        )
                    }
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Summary report */}
      <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-200 text-sm">
          <div>
            <span className="text-slate-text/80 block">Precio Particular Total:</span>
            <span className="text-base font-semibold text-slate-text line-through">${regularTotal}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-text/80 block">Tu Copago Estimado:</span>
            <span className="text-lg font-bold text-trust-blue-cta">${Math.round(patientOwes)}</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">savings</span>
            <div>
              <span className="text-xs text-slate-text uppercase font-semibold">Ahorro con este Plan:</span>
              <span className="text-base font-bold text-emerald-600 block">
                ${Math.round(savings)} {regularTotal > 0 && `(${Math.round((savings / regularTotal) * 100)}%)`}
              </span>
            </div>
          </div>
          {coverageType === 'membership' && (
            <div className="text-right text-[10px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md max-w-[200px]">
              ¡Tu plan incluye exámenes y limpiezas preventivas al 100%!
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] text-slate-text/60 italic">
          *Los cálculos son estimaciones ilustrativas basados en planes estándar. Las tarifas oficiales se confirman en consulta.
        </p>
      </div>
    </div>
  );
}
