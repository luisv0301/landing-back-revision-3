'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronDown, Star } from 'lucide-react';
import Step1Cotiza from './step1Cotiza';
import Step2Verifica from './step2Verifica';
import Step3DatosPersonales from './step3DatosPersonales';
import Step4Ofertas from './step4Ofertas';



const PASOS = [
  { id: 1, title: 'Cotiza' },
  { id: 2, title: 'Verifica' },
  { id: 3, title: 'Completa datos' },
  { id: 4, title: 'Ofertas' },
  { id: 5, title: 'Elige tu póliza' },
];

export default function CotizadorForm() {
  const [step, setStep] = useState(1);
  const [datosCotizacion, setDatosCotizacion] = useState<{
    vehiculo?: any;
    personales?: any;
    ofertas?: any[];
    session?: { channelName: string, token: string | undefined };
  }>({});

  // Manejo de retroceso
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleStep1Success = (dataVehiculo: any) => {
    setDatosCotizacion((prev) => ({ ...prev, vehiculo: dataVehiculo }));
    setStep(2);
  };

  const handleStep3Success = (datos: any) => {
    setDatosCotizacion((prev) => ({ ...prev, personales: datos.personales, session: datos.session }));
    setStep(4);
  };

  const handleSelectOferta = (ofertaElegida: any) => {
    setDatosCotizacion((prev) => ({ ...prev, ofertaSeleccionada: ofertaElegida }));
    setStep(5);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">

        {/* ========================================================= */}
        {/* NAVEGACIÓN DESKTOP (Barra Lateral)                       */}
        {/* ========================================================= */}
        <aside className="hidden md:flex flex-col space-y-6 pt-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center space-x-2 text-sm font-medium transition-colors ${step === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-black cursor-pointer'
              }`}
          >
            <ArrowLeft size={18} />
            <span>Regresar</span>
          </button>

          <nav className="flex flex-col space-y-4 pt-4">
            {PASOS.map((p) => {
              const isCurrent = step === p.id;
              const isCompleted = step > p.id;

              return (
                <div key={p.id} className="flex items-center space-x-3 text-sm font-medium">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-[#FFCC00] fill-[#FFCC00] stroke-black" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full bg-[#FFCC00] border-2 border-black flex items-center justify-center" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                  )}
                  <span
                    className={
                      isCurrent
                        ? 'font-bold text-black'
                        : isCompleted
                          ? 'text-gray-500 line-through'
                          : 'text-gray-400'
                    }
                  >
                    {p.title}
                  </span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ========================================================= */}
        {/* NAVEGACIÓN MOBILE (Barra Superior y Progreso)             */}
        {/* ========================================================= */}
        <header className="md:hidden w-full space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`p-1 rounded-full ${step === 1 ? 'text-gray-300' : 'text-gray-700 active:bg-gray-200'
                }`}
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center space-x-2 text-base font-bold text-gray-900">
              <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
              <span>{PASOS.find((p) => p.id === step)?.title}</span>
              <ChevronDown size={18} className="text-gray-500" />
            </div>

            <div className="w-6" /> {/* Spacer de balance flex */}
          </div>

          {/* Barra de progreso visual */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#FFCC00] h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / PASOS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </header>

        {/* ========================================================= */}
        {/* CONTENEDOR PRINCIPAL DEL FORMULARIO                       */}
        {/* ========================================================= */}
        <main className="w-full flex flex-col justify-center items-center pt-2 md:pt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Cotiza key="step1" onSuccess={handleStep1Success} />
            )}

            {step === 2 && (
              <Step2Verifica
                vehiculo={datosCotizacion.vehiculo}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <Step3DatosPersonales onNext={handleStep3Success} vehiculoData={datosCotizacion.vehiculo} initialData={datosCotizacion.personales} />
            )}

            {step === 4 && (
              <Step4Ofertas
                session={datosCotizacion.session}
                vehiculoData={datosCotizacion.vehiculo}
                onSelectOferta={handleSelectOferta}
              />
            )}

          </AnimatePresence>
          <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-600 font-medium">
            <div className="flex text-black">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span>4.9 en Google</span>
            <span className="text-gray-400 font-normal pl-12">3.558 reviews</span>
          </div>
        </main>

      </div>
    </div>
  );
}