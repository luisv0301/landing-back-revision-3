"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileCheck2,
  PhoneCall,
  ShieldCheck,
  RotateCcw,
  Home,
} from "lucide-react";
import Navbar from "@/app/components/home/navbar";
import Footer from "@/app/components/home/footer";
import { Button } from "@/components/ui/button";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const insurer = searchParams.get("insurer");
  const plan = searchParams.get("plan");
  const premium = searchParams.get("premium");
  const ticketId = searchParams.get("ticketId");
  const logo = searchParams.get("logo");

  const formattedPremium = premium
    ? new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(premium))
    : null;


  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Encabezado Principal */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-2 shadow-inner">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>



          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            ¡Felicitaciones! Tu cotización ha culminado
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
            Hemos registrado tu selección. Una gestora especializada de{" "}
            <strong className="text-gray-900 font-bold">Segurautos</strong> se pondrá en
            contacto contigo en breve para dar el siguiente paso.
          </p>
        </div>

        {/* Resumen de la Selección */}
        {(insurer || ticketId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Detalle de la oferta seleccionada
                </span>
                {logo && (
                  <img
                    src={logo}
                    alt=""
                    className="w-20 h-auto"
                  />
                )}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
                  {insurer || "Aseguradora Aliada"}
                </h2>
                {plan && <p className="text-sm text-gray-500 font-medium">{plan}</p>}
              </div>

              {ticketId && (
                <div className="inline-flex flex-col sm:items-end">
                  <span className="text-xs font-medium text-gray-500">Radicado CRM</span>
                  <span className="w-fit text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full mt-1 border border-gray-200">
                    #{ticketId}
                  </span>
                </div>
              )}
            </div>

            {formattedPremium && (
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Valor estimado prima anual:
                </span>
                <span className="text-2xl font-black text-gray-900 tabular-nums">
                  {formattedPremium}
                </span>
              </div>
            )}
          </motion.div>
        )}



        {/* Acciones de Navegación */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 py-6 font-semibold text-sm border-gray-300 hover:bg-gray-100 text-gray-800 cursor-pointer"
            >
              <Home size={16} className="mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <Link href="/formulario" className="w-full sm:w-auto">
            <Button
              type="button"
              className="w-full sm:w-auto bg-[#FFCC00] hover:bg-yellow-500 text-black rounded-full px-8 py-6 font-semibold text-sm cursor-pointer shadow-sm"
            >
              <RotateCcw size={16} className="mr-2" />
              Realizar una nueva cotización
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50/60 font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="py-20 text-center text-gray-500 font-medium">
              Cargando confirmación…
            </div>
          }
        >
          <ConfirmacionContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
