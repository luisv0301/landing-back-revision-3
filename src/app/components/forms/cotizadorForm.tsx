"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronDown, Lock, Star, Check, PhoneCall } from "lucide-react";
import Step1Cotiza from "./step1Cotiza";
import Step2Verifica from "./step2Verifica";
import Step3DatosPersonales from "./step3DatosPersonales";
import Step4Ofertas from "./step4Ofertas";
import { seleccionarPolizaAction } from "@/app/actions/cotizaciones";
import { registrarLeadAction } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";

const PASOS = [
  { id: 1, title: "Cotiza" },
  { id: 2, title: "Verifica" },
  { id: 3, title: "Completa datos" },
  { id: 4, title: "Ofertas" },
  { id: 5, title: "Confirmación" },
];

interface CotizadorFormProps {
  initialTipo?: "carro" | "moto" | "pesado";
}

export default function CotizadorForm({
  initialTipo = "carro",
}: CotizadorFormProps) {
  const [step, setStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [datosCotizacion, setDatosCotizacion] = useState<{
    vehiculo?: any;
    personales?: any;
    ticketId?: number | string;
    status?: string;
    jsonComparativoUrl?: string;
    pdfUrl?: string;
    ofertaSeleccionada?: any;
    message?: string;
  }>({});

  const [, startTransition] = useTransition();

  const handleBack = () => {
    if (step > 1) {
      if (datosCotizacion.vehiculo?.esCeroKm && step === 4) {
        setStep(1);
      } else {
        setStep((prev) => prev - 1);
      }
      setIsMenuOpen(false);
    }
  };

  const handleStep1Success = (dataVehiculo: any) => {
    setDatosCotizacion((prev) => ({ ...prev, vehiculo: dataVehiculo }));
    setStep(2);

    startTransition(async () => {
      await registrarLeadAction({
        vehicle_type: dataVehiculo.tipoVehiculo || initialTipo,
        funnel_stage: dataVehiculo.requiresInvoice ? "vehicle_not_found" : "vehicle_found",
        plate: dataVehiculo.placa || undefined,
      });
    });
  };

  const handleStep1Success0Km = (datos: any) => {
    setDatosCotizacion((prev) => ({
      ...prev,
      vehiculo: datos.vehiculo,
      personales: datos.personales,
      ticketId: datos.ticketId,
      status: datos.status,
      message: datos.message,
    }));
    // Salta directamente al paso de ofertas / radicación
    setStep(4);

    startTransition(async () => {
      await registrarLeadAction({
        vehicle_type: datos.vehiculo?.tipoVehiculo || initialTipo,
        funnel_stage: "invoice_pending",
        name: datos.personales?.nombreCompleto,
        phone: datos.personales?.telefono,
        email: datos.personales?.email,
        document_id: datos.personales?.numeroDocumento,
        city: datos.personales?.cityName,
      });
    });
  };

  const handleStep3Success = (datos: any) => {
    setDatosCotizacion((prev) => ({
      ...prev,
      personales: datos.personales,
      ticketId: datos.ticketId,
      status: datos.status,
      message: datos.message,
    }));
    setStep(4);

    startTransition(async () => {
      await registrarLeadAction({
        vehicle_type: datosCotizacion.vehiculo?.tipoVehiculo || initialTipo,
        funnel_stage: "quoted",
        name: datos.personales?.nombreCompleto || `${datos.personales?.firstname || ""} ${datos.personales?.lastname || ""}`.trim(),
        phone: datos.personales?.telefono,
        email: datos.personales?.email,
        document_id: datos.personales?.numeroDocumento,
        plate: datosCotizacion.vehiculo?.placa,
        city: datos.personales?.cityName,
      });
    });
  };

  const handleSelectOferta = (ofertaElegida: any) => {
    setDatosCotizacion((prev) => ({
      ...prev,
      ofertaSeleccionada: ofertaElegida,
    }));
    setStep(5);

    startTransition(async () => {
      if (datosCotizacion.ticketId) {
        await seleccionarPolizaAction(datosCotizacion.ticketId, {
          insurer: ofertaElegida.aseguradora,
          plan_name: ofertaElegida.planNombre,
          premium: ofertaElegida.precioAnual,
          quote_id: Number(ofertaElegida.id) || undefined,
        });

        await registrarLeadAction({
          vehicle_type: datosCotizacion.vehiculo?.tipoVehiculo || initialTipo,
          funnel_stage: "selected",
          name: datosCotizacion.personales?.nombreCompleto,
          phone: datosCotizacion.personales?.telefono,
          email: datosCotizacion.personales?.email,
          plate: datosCotizacion.vehiculo?.placa,
        });
      }
    });
  };

  const isStepAccessible = (targetStep: number) => {
    if (targetStep === 1) return true;
    if (datosCotizacion.vehiculo?.esCeroKm) {
      if (targetStep === 4) return Boolean(datosCotizacion.ticketId);
      if (targetStep === 5) return Boolean(datosCotizacion.ofertaSeleccionada);
      return false;
    }
    if (targetStep === 2) return Boolean(datosCotizacion.vehiculo);
    if (targetStep === 3) return Boolean(datosCotizacion.vehiculo);
    if (targetStep === 4)
      return Boolean(
        datosCotizacion.vehiculo &&
        (datosCotizacion.personales || datosCotizacion.ticketId)
      );
    if (targetStep === 5) return Boolean(datosCotizacion.ofertaSeleccionada);
    return false;
  };

  const handleGoToStep = (targetStep: number) => {
    if (isStepAccessible(targetStep)) {
      setStep(targetStep);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* NAVEGACIÓN DESKTOP (Barra Lateral) */}
        <aside className="hidden md:flex flex-col space-y-6 pt-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center space-x-2 text-sm font-medium transition-colors ${step === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-black cursor-pointer"
              }`}
          >
            <ArrowLeft size={18} />
            <span>Regresar</span>
          </button>

          <nav className="flex flex-col space-y-4 pt-4">
            {PASOS.map((p) => {
              const isCurrent = step === p.id;
              const isCompleted = step > p.id;
              const accessible = isStepAccessible(p.id);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleGoToStep(p.id)}
                  disabled={!accessible}
                  className={`flex items-center space-x-3 text-sm font-medium transition-opacity text-left ${accessible
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-60"
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2
                      size={18}
                      className="text-[#FFCC00] fill-[#FFCC00] stroke-black"
                    />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full bg-[#FFCC00] border-2 border-black flex items-center justify-center" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                  )}
                  <span
                    className={
                      isCurrent
                        ? "font-bold text-black"
                        : isCompleted
                          ? "text-gray-500 line-through"
                          : "text-gray-400"
                    }
                  >
                    {p.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* NAVEGACIÓN MOBILE */}
        <header className="md:hidden w-full space-y-4 relative">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`p-1 rounded-full ${step === 1
                ? "text-gray-300"
                : "text-gray-700 active:bg-gray-200"
                }`}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 text-base font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
              <span>{PASOS.find((p) => p.id === step)?.title}</span>
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} className="text-gray-500" />
              </motion.div>
            </button>
            <div className="w-6" />
          </div>

          {/* Menú Desplegable Móvil */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20 bg-black/10"
                  onClick={() => setIsMenuOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 right-0 z-30 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 space-y-2"
                >
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-1">
                    Pasos del cotizador
                  </div>

                  {PASOS.map((p) => {
                    const isCurrent = step === p.id;
                    const isCompleted = step > p.id;
                    const accessible = isStepAccessible(p.id);

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleGoToStep(p.id)}
                        disabled={!accessible}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isCurrent
                          ? "bg-[#FFCC00]/20 text-black font-bold"
                          : accessible
                            ? "text-gray-700 hover:bg-gray-50"
                            : "text-gray-300 cursor-not-allowed"
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          {isCompleted ? (
                            <CheckCircle2
                              size={18}
                              className="text-[#FFCC00] fill-[#FFCC00] stroke-black"
                            />
                          ) : isCurrent ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-[#FFCC00] border-2 border-black" />
                          ) : (
                            <div
                              className={`w-3.5 h-3.5 rounded-full ${accessible ? "bg-gray-400" : "bg-gray-200"}`}
                            />
                          )}
                          <span
                            className={
                              isCompleted ? "line-through text-gray-400" : ""
                            }
                          >
                            {p.id}. {p.title}
                          </span>
                        </div>

                        {!accessible && (
                          <Lock size={14} className="text-gray-300" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Barra de progreso visual */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#FFCC00] h-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / PASOS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </header>

        {/* CONTENEDOR PRINCIPAL */}
        <main className="w-full flex flex-col justify-center items-center pt-2 md:pt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Cotiza
                key="step1"
                onSuccess={handleStep1Success}
                onSuccess0Km={handleStep1Success0Km}
                initialTipo={initialTipo}
              />
            )}

            {step === 2 && (
              <Step2Verifica
                key="step2"
                vehiculo={datosCotizacion.vehiculo}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <Step3DatosPersonales
                key="step3"
                onNext={handleStep3Success}
                vehiculoData={datosCotizacion.vehiculo}
                initialData={datosCotizacion.personales}
              />
            )}

            {step === 4 && (
              <Step4Ofertas
                key="step4"
                vehiculoData={datosCotizacion.vehiculo}
                ticketId={datosCotizacion.ticketId}
                jsonComparativoUrl={datosCotizacion.jsonComparativoUrl}
                onSelectOferta={handleSelectOferta}
                pdfUrl={datosCotizacion.pdfUrl}
              />
            )}

            {step === 5 && (
              <Step5Confirmacion
                key="step5"
                datosCotizacion={datosCotizacion}
                onReset={() => {
                  setDatosCotizacion({});
                  setStep(1);
                }}
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
            <span className="text-gray-400 font-normal pl-12">
              3.558 reviews
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

function Step5Confirmacion({
  datosCotizacion,
  onReset,
}: {
  datosCotizacion: any;
  onReset: () => void;
}) {
  const oferta = datosCotizacion.ofertaSeleccionada;
  const precioFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(oferta?.precioAnual || 0));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
    >
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
        <Check size={32} strokeWidth={3} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          ¡Excelente elección!
        </h1>
        <p className="text-gray-600 text-sm">
          Has seleccionado la póliza de{" "}
          <strong className="text-black">{oferta?.aseguradora || "tu aseguradora preferida"}</strong>{" "}
          ({oferta?.planNombre || "Todo Riesgo"}).
        </p>
      </div>

      {datosCotizacion.ticketId && (
        <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full text-xs font-semibold text-yellow-900">
          Radicado Sunrise CRM: #{datosCotizacion.ticketId}
        </div>
      )}

      <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left space-y-3">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm text-gray-600">Aseguradora</span>
          <span className="text-sm font-bold text-gray-900">{oferta?.aseguradora}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm text-gray-600">Plan</span>
          <span className="text-sm font-bold text-gray-900">{oferta?.planNombre}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prima Anual</span>
          <span className="text-lg font-bold text-gray-900 tabular-nums">{precioFormateado}</span>
        </div>
      </div>

      <div className="space-y-3 w-full pt-2">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <PhoneCall size={14} className="text-green-600" />
          <span>Un asesor especializado se comunicará contigo para finalizar la emisión.</span>
        </div>

        <Button
          type="button"
          onClick={onReset}
          variant="outline"
          className="w-full rounded-full p-6 text-sm font-semibold border-gray-300 hover:bg-gray-100 cursor-pointer"
        >
          Realizar otra cotización
        </Button>
      </div>
    </motion.div>
  );
}
