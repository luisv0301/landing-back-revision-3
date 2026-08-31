"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Star,
  Loader2,
  AlertCircle,
  Check,
  FileDown,
  RefreshCw,
} from "lucide-react";
import { consultarOfertasRespaldoAction } from "@/app/actions/cotizaciones";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface CoberturaDetalle {
  titulo: string;
  descripcion: string;
  grupo?: string;
}

export interface OfertaPoliza {
  id: string;
  aseguradora: string;
  logoUrl?: string;
  planNombre: string;
  precioAnual: number;
  tipoCobertura: string;
  deducible: string;
  coberturaRC: string;
  coberturas: CoberturaDetalle[];
  rawOfferData: any;
}

interface Step4Props {
  session?: {
    channelName: string;
    token?: string;
  };
  oppId?: string;
  vehiculoData: any;
  jsonComparativoUrl?: string;
  pdfUrl?: string;
  onSelectOferta: (oferta: OfertaPoliza) => void;
}

type TipoFiltro = "todas" | "economica" | "cobertura";

const formatearPolizas = (listaRaw: any[]): OfertaPoliza[] => {
  const nuevasOfertas: OfertaPoliza[] = [];

  listaRaw.forEach((poliza: any, idx: number) => {
    const producto = poliza.products?.[0] || poliza.offer || {};
    const rawCoverages: any[] = producto.coverages || [];

    const coberturas: CoberturaDetalle[] = rawCoverages
      .filter((c: any) => {
        const titulo =
          typeof c.description_tag === "string" ? c.description_tag.trim() : "";
        const desc =
          typeof c.description === "string" ? c.description.trim() : "";
        return (
          titulo.length > 0 &&
          desc.length > 0 &&
          c.coverage_tag !== "URLCLA" &&
          c.coverage_tag !== "PRODUCT_NAME"
        );
      })
      .map((c: any) => ({
        titulo: c.description_tag,
        descripcion: c.description,
        grupo: typeof c.group === "string" ? c.group : undefined,
      }));

    const coverageRC = rawCoverages.find((c: any) => {
      const tag = typeof c.coverage_tag === "string" ? c.coverage_tag : "";
      const group = typeof c.group === "string" ? c.group : "";
      return tag === "RESEXT" || group.includes("Responsabilidad Civil");
    });

    const coverageDeducible = rawCoverages.find((c: any) => {
      const tag = typeof c.coverage_tag === "string" ? c.coverage_tag : "";
      return tag === "DEBPPD";
    });

    const precio = Number(
      poliza.total_price || producto.price || poliza.total_premium || 0,
    );

    if (precio > 0) {
      nuevasOfertas.push({
        id: String(poliza.id_db || poliza.process_id || idx),
        aseguradora:
          producto.manufacturer ||
          poliza.provider ||
          poliza.insurer_name ||
          "Aseguradora",
        logoUrl: producto.logo || poliza.insurer_logo_url,
        planNombre:
          producto.name || producto.product_name || "Póliza Todo Riesgo",
        precioAnual: precio,
        tipoCobertura: "Amplia",
        deducible: coverageDeducible?.description || "1.0 SMMLV",
        coberturaRC: coverageRC?.description || "$4.000.000.000",
        coberturas,
        rawOfferData: poliza,
      });
    }
  });

  return nuevasOfertas.sort((a, b) => a.precioAnual - b.precioAnual);
};

export default function Step4Ofertas({
  vehiculoData,
  onSelectOferta,
  jsonComparativoUrl,
  pdfUrl,
}: Step4Props) {
  const [ofertas, setOfertas] = useState<OfertaPoliza[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState<TipoFiltro>("todas");
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null);
  const [segundosEspera, setSegundosEspera] = useState(25);
  const [puedeReintentar, setPuedeReintentar] = useState(false);

  const consultarComparativo = async () => {
    if (!jsonComparativoUrl) {
      setErrorConsulta("No se proporcionó la URL del comparativo.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setErrorConsulta(null);

    try {
      const res = await consultarOfertasRespaldoAction(jsonComparativoUrl);

      if (res.success && Array.isArray(res.ofertas) && res.ofertas.length > 0) {
        const ofertasFormateadas = formatearPolizas(res.ofertas);
        setOfertas(ofertasFormateadas);
      } else {
        setErrorConsulta(
          "Las aseguradoras aún están procesando o no arrojaron pólizas disponibles.",
        );
      }
    } catch (err: any) {
      console.error("Error consultando comparativo:", err);
      setErrorConsulta(err.message || "Error al recuperar las ofertas.");
    } finally {
      setCargando(false);
      setPuedeReintentar(true);
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSegundosEspera((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          consultarComparativo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [jsonComparativoUrl]);

  const ofertasFiltradas = useMemo(() => {
    if (ofertas.length === 0) return [];

    if (filtroActivo === "economica") {
      const menorPrecio = Math.min(...ofertas.map((o) => o.precioAnual));
      return ofertas.filter((o) => o.precioAnual === menorPrecio);
    }

    if (filtroActivo === "cobertura") {
      const amplias = ofertas.filter(
        (o) =>
          o.tipoCobertura.toLowerCase().includes("amplia") ||
          o.tipoCobertura.toLowerCase().includes("premium"),
      );
      return amplias.length > 0 ? amplias : ofertas;
    }

    return ofertas;
  }, [ofertas, filtroActivo]);

  const formatCOP = (valor: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const nombreVehiculo =
    `${vehiculoData?.brand || ""} ${vehiculoData?.line || ""}`.trim() ||
    "tu vehículo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Tus Ofertas Personalizadas
        </h1>
        <p className="text-gray-600 text-sm">
          {cargando
            ? `Consolidando cotizaciones de aseguradoras para tu ${nombreVehiculo}...`
            : ofertas.length > 0
              ? `Hemos encontrado ${ofertas.length} opciones para tu ${nombreVehiculo}`
              : `Comparativo generado para tu ${nombreVehiculo}`}
        </p>
      </div>

      {ofertas.length > 0 && (
        <div className="bg-white p-1.5 rounded-full border border-gray-200 shadow-sm flex items-center justify-between w-full max-w-md mb-8">
          <button
            type="button"
            onClick={() => setFiltroActivo("todas")}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              filtroActivo === "todas"
                ? "bg-[#222222] text-white shadow-sm"
                : "text-gray-700 hover:text-black"
            }`}
          >
            <span>Todas ({ofertas.length})</span>
            {filtroActivo === "todas" && (
              <div className="bg-[#FFCC00] text-black rounded-full p-0.5">
                <Check size={10} strokeWidth={3} />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFiltroActivo("economica")}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center justify-center ${
              filtroActivo === "economica"
                ? "bg-[#222222] text-white shadow-sm"
                : "text-gray-700 hover:text-black"
            }`}
          >
            <span>$ Más Económica</span>
          </button>

          <button
            type="button"
            onClick={() => setFiltroActivo("cobertura")}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-1 ${
              filtroActivo === "cobertura"
                ? "bg-[#222222] text-white shadow-sm"
                : "text-gray-700 hover:text-black"
            }`}
          >
            <span className="text-xs">🛡️</span>
            <span>Mejor Cobertura</span>
          </button>
        </div>
      )}

      {cargando && (
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin text-black" size={20} />
            <p className="text-xs md:text-sm font-medium text-gray-800">
              {segundosEspera > 0
                ? `Liquidando pólizas con las aseguradoras (tiempo estimado: ${segundosEspera}s)...`
                : "Recuperando comparativo consolidado..."}
            </p>
          </div>
        </div>
      )}

      {errorConsulta && !cargando && ofertas.length === 0 && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between text-amber-800">
          <div className="flex items-center space-x-2">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{errorConsulta}</p>
          </div>
          {puedeReintentar && (
            <Button
              variant="outline"
              size="sm"
              onClick={consultarComparativo}
              className="border-amber-300 hover:bg-amber-100 text-amber-900"
            >
              <RefreshCw size={14} className="mr-1.5" /> Reintentar
            </Button>
          )}
        </div>
      )}

      <div className="w-full space-y-6">
        <AnimatePresence mode="popLayout">
          {ofertasFiltradas.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col space-y-6"
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
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
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
                  className="w-full bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold rounded-full py-6 text-base transition-colors shadow-none"
                >
                  La Quiero
                </Button>

                <Dialog>
                  <DialogTrigger
                    render={
                      <button
                        type="button"
                        className="w-full text-center text-xs font-semibold text-gray-900 underline hover:text-gray-600 transition-colors"
                      >
                        Ver Coberturas y Exclusiones
                      </button>
                    }
                  ></DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold text-gray-900">
                        {item.aseguradora} - {item.planNombre}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-gray-500">
                        Detalle de coberturas, condiciones y deducibles
                        incluidos en la póliza.
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
          ))}
        </AnimatePresence>

        {cargando && ofertas.length === 0 && (
          <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-3 animate-pulse">
            <div className="h-6 bg-gray-200 rounded-full w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto"></div>
          </div>
        )}

        {/* Contingencia: Descarga PDF cuando no hay ofertas directas en pantalla */}
        {!cargando && ofertasFiltradas.length === 0 && pdfUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-sm"
          >
            <div className="mx-auto bg-green-50 w-16 h-16 flex items-center justify-center rounded-full">
              <Check size={32} className="text-green-600" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900">
                ¡Cotizaciones Generadas con Éxito!
              </h3>
              <p className="text-gray-600 text-sm">
                Hemos liquidado las opciones disponibles con las principales
                aseguradoras del mercado.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-semibold text-black transition-all bg-[#FFCC00] rounded-full hover:bg-[#E6B800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCC00] shadow-sm"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Descargar Cuadro Comparativo (PDF)
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
