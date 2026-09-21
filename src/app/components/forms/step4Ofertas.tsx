"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OfertaPoliza } from "@/lib/utils";
import { useComparativoOfertas } from "@/app/hooks/useComparativoOfertas";
import {
  Star,
  Loader2,
  AlertCircle,
  Check,
  FileDown,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Step4Props {
  vehiculoData: any;
  ticketId?: number | string;
  jsonComparativoUrl?: string;
  pdfUrl?: string;
  onSelectOferta: (oferta: OfertaPoliza) => void;
}

type TipoFiltro = "todas" | "economica" | "cobertura";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function formatCOP(valor: number): string {
  return CURRENCY_FORMATTER.format(valor);
}

export default function Step4Ofertas({
  vehiculoData,
  ticketId,
  onSelectOferta,
  jsonComparativoUrl,
  pdfUrl,
}: Step4Props) {
  const {
    ofertas,
    status,
    comparativePdfUrl,
    cargando,
    errorConsulta,
    segundosRestantes,
    reintentar,
  } = useComparativoOfertas(ticketId, jsonComparativoUrl);

  const [filtroActivo, setFiltroActivo] = useState<TipoFiltro>("todas");

  const pdfFinal = comparativePdfUrl || pdfUrl;

  const ofertasFiltradas = useMemo(() => {
    if (ofertas.length === 0) return [];

    if (filtroActivo === "economica") {
      const menorPrecio = ofertas.reduce(
        (min, o) => (o.precioAnual < min ? o.precioAnual : min),
        ofertas[0].precioAnual,
      );
      return ofertas.filter((o) => o.precioAnual === menorPrecio);
    }

    if (filtroActivo === "cobertura") {
      const amplias = ofertas.filter(
        (o) =>
          o.tipoCobertura.toLowerCase().includes("amplia") ||
          o.tipoCobertura.toLowerCase().includes("premium") ||
          o.tipoCobertura.toLowerCase().includes("recomendada"),
      );
      return amplias.length > 0 ? amplias : ofertas;
    }

    return ofertas;
  }, [ofertas, filtroActivo]);

  const nombreVehiculo =
    `${vehiculoData?.brand || ""} ${vehiculoData?.line || ""}`.trim() ||
    "tu vehículo";

  const isAwaitingAdvisor = status === "awaiting_advisor" || status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {isAwaitingAdvisor ? "Solicitud Radicada" : "Tus Ofertas Personalizadas"}
        </h1>
        <p className="text-gray-600 text-sm">
          {cargando
            ? `Cotizando en simultáneo con las principales aseguradoras para tu ${nombreVehiculo}…`
            : isAwaitingAdvisor
              ? `Hemos recibido los datos de tu ${nombreVehiculo} con éxito.`
              : ofertas.length > 0
                ? `Hemos encontrado ${ofertas.length} opciones disponibles para tu ${nombreVehiculo}`
                : `Comparativo liquidado para tu ${nombreVehiculo}`}
        </p>
      </div>

      {/* Filtros rápidos */}
      {!isAwaitingAdvisor && ofertas.length > 0 && (
        <OfertasFiltros
          totalOfertas={ofertas.length}
          filtroActivo={filtroActivo}
          onSelectFiltro={setFiltroActivo}
        />
      )}

      {/* Barra de progreso / Loader visual */}
      {cargando && (
        <OfertasLoadingState segundosRestantes={segundosRestantes} />
      )}

      {/* Manejo de error o reintento manual */}
      {errorConsulta && !cargando && ofertas.length === 0 && !isAwaitingAdvisor && (
        <OfertasErrorBanner
          mensaje={errorConsulta}
          onReintentar={reintentar}
        />
      )}

      {/* Caso: Asesor asignado (awaiting_advisor o failed) */}
      {!cargando && isAwaitingAdvisor && (
        <OfertaAwaitingAdvisorCard ticketId={ticketId} />
      )}

      {/* Listado de Tarjetas de Oferta */}
      {!isAwaitingAdvisor && (
        <div className="w-full space-y-6">
          <AnimatePresence mode="popLayout">
            {ofertasFiltradas.map((item) => (
              <OfertaCard
                key={item.id}
                item={item}
                onSelectOferta={onSelectOferta}
              />
            ))}
          </AnimatePresence>

          {/* Skeleton de carga inicial */}
          {cargando && ofertas.length === 0 && (
            <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-3 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-full w-1/3 mx-auto" />
              <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto" />
            </div>
          )}

          {/* Fallback de PDF consolidado si no hay ofertas directas */}
          {!cargando && ofertasFiltradas.length === 0 && pdfFinal && (
            <OfertasFallbackPDF pdfUrl={pdfFinal} />
          )}
        </div>
      )}
    </motion.div>
  );
}

function OfertasFiltros({
  totalOfertas,
  filtroActivo,
  onSelectFiltro,
}: {
  totalOfertas: number;
  filtroActivo: TipoFiltro;
  onSelectFiltro: (filtro: TipoFiltro) => void;
  }) {
  return (
    <div className="relative bg-white p-1.5 rounded-full border border-gray-200 shadow-xs flex items-center justify-between w-full max-w-md mb-8">
      <button
        type="button"
        onClick={() => onSelectFiltro("todas")}
        className={`relative z-10 flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-colors duration-150 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-[0.98] ${filtroActivo === "todas"
          ? "text-white"
          : "text-gray-700 hover:text-black"
          }`}
      >
        {filtroActivo === "todas" && (
          <motion.div
            layoutId="activeFilterPill"
            className="absolute inset-0 rounded-full bg-[#222222] shadow-xs z-[-1]"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="whitespace-nowrap text-[10px] lg:text-sm">Todas ({totalOfertas})</span>
        {filtroActivo === "todas" && (
          <div className="bg-[#FFCC00] text-black rounded-full p-0.5 animate-in fade-in zoom-in-75 duration-150">
            <Check size={10} strokeWidth={3} />
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelectFiltro("economica")}
        className={`relative z-10 flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-colors duration-150 flex items-center justify-center cursor-pointer active:scale-[0.98] ${filtroActivo === "economica"
          ? "text-white"
          : "text-gray-700 hover:text-black"
          }`}
      >
        {filtroActivo === "economica" && (
          <motion.div
            layoutId="activeFilterPill"
            className="absolute inset-0 rounded-full bg-[#222222] shadow-xs z-[-1]"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="whitespace-nowrap text-[10px] lg:text-sm">$ Más Económica</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectFiltro("cobertura")}
        className={`relative z-10 flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-colors duration-150 flex items-center justify-center space-x-1 cursor-pointer active:scale-[0.98] ${filtroActivo === "cobertura"
          ? "text-white"
          : "text-gray-700 hover:text-black"
          }`}
      >
        {filtroActivo === "cobertura" && (
          <motion.div
            layoutId="activeFilterPill"
            className="absolute inset-0 rounded-full bg-[#222222] shadow-xs z-[-1]"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="text-xs">🛡️</span>
        <span className="whitespace-nowrap text-[10px] lg:text-sm">Recomendadas</span>
      </button>
    </div>
  );
}

function OfertasLoadingState({ segundosRestantes }: { segundosRestantes: number }) {
  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Loader2 className="animate-spin text-black" size={20} />
        <p className="text-xs md:text-sm font-medium text-gray-800">
          {segundosRestantes > 0
            ? `Consultando con aseguradoras (tiempo estimado: ${segundosRestantes}s)…`
            : "Consolidando las mejores opciones…"}
        </p>
      </div>
    </div>
  );
}

function OfertasErrorBanner({
  mensaje,
  onReintentar,
}: {
  mensaje: string;
  onReintentar: () => void;
}) {
  return (
    <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between text-amber-800">
      <div className="flex items-center space-x-2">
        <AlertCircle size={18} />
        <p className="text-sm font-medium">{mensaje}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onReintentar}
        className="border-amber-300 hover:bg-amber-100 text-amber-900 cursor-pointer"
      >
        <RefreshCw size={14} className="mr-1.5" /> Reintentar
      </Button>
    </div>
  );
}

function OfertaAwaitingAdvisorCard({ ticketId }: { ticketId?: number | string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-xs"
    >
      <div className="mx-auto bg-yellow-100 w-16 h-16 flex items-center justify-center rounded-full">
        <UserCheck size={32} className="text-yellow-700" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-900">
          Un asesor te contactará a la brevedad
        </h3>
        <p className="text-gray-600 text-sm">
          Hemos recibido tu solicitud y un especialista de Segurautos revisará las opciones y te contactará con la mejor tarifa disponible.
        </p>
        {ticketId && (
          <div className="inline-block mt-3 px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
            Radicado de Solicitud: #{ticketId}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function OfertaCard({
  item,
  onSelectOferta,
}: {
  item: OfertaPoliza;
  onSelectOferta: (oferta: OfertaPoliza) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="w-full bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center">
            {item.logoUrl ? (
              <img
                src={item.logoUrl}
                alt={item.aseguradora}
                className="max-h-10 object-contain lg:w-24 lg:max-h-max"
              />
            ) : (
              <span className="text-2xl font-black text-gray-900">
                {item.aseguradora}
              </span>
            )}
          </div>
          <div className="hidden items-center space-x-1.5 text-sm text-gray-700 font-medium">
            <div className="flex text-black">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span>4.9</span>
          </div>
        </div>

        <div className="text-right space-y-1">
          <span className="text-xs text-gray-500 font-medium block">
            Prima Anual
          </span>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 tabular-nums">
            {formatCOP(item.precioAnual)}
          </div>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {item.tipoCobertura}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <Button
          onClick={() => onSelectOferta(item)}
          className="w-full bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold rounded-full py-6 text-base transition-colors shadow-none cursor-pointer"
        >
          La Quiero
        </Button>

        <Dialog>
          <DialogTrigger
            render={
              <button
                type="button"
                className="w-full text-center text-xs font-semibold text-gray-900 underline hover:text-gray-600 transition-colors cursor-pointer"
              >
                Ver Coberturas y Exclusiones
              </button>
            }
          />
          <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900">
                {item.aseguradora} - {item.planNombre}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Detalle de coberturas, condiciones y deducibles incluidos en la póliza.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 divide-y divide-gray-100">
              {item.coberturas.map((cobertura, i) => (
                <div key={i} className="py-3 flex flex-col gap-1">
                  <h4 className="text-sm font-semibold text-gray-800 leading-snug">
                    {cobertura.titulo}
                  </h4>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-700">
                      Deducible / Cobertura:{" "}
                    </span>
                    {cobertura.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}

function OfertasFallbackPDF({ pdfUrl }: { pdfUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-xs"
    >
      <div className="mx-auto bg-green-50 w-16 h-16 flex items-center justify-center rounded-full">
        <Check size={32} className="text-green-600" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-900">
          ¡Cotizaciones Generadas con Éxito!
        </h3>
        <p className="text-gray-600 text-sm">
          Hemos liquidado las opciones disponibles con las principales aseguradoras del mercado.
        </p>
      </div>

      <div className="pt-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-semibold text-black transition-all bg-[#FFCC00] rounded-full hover:bg-[#E6B800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCC00] shadow-xs"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Descargar Cuadro Comparativo (PDF)
        </a>
      </div>
    </motion.div>
  );
}