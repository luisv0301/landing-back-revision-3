"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Loader2, AlertCircle, Check, FileDown } from "lucide-react";

export interface OfertaPoliza {
  id: string;
  aseguradora: string;
  logoUrl?: string;
  planNombre: string;
  precioAnual: number;
  tipoCobertura: string;
  deducible: string;
  coberturaRC: string;
  rawOfferData?: any;
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

// Función centralizada para estandarizar el objeto JSON que envíe la API o el WebSocket
const formatearPolizas = (listaRaw: any[]): OfertaPoliza[] => {
  const nuevasOfertas: OfertaPoliza[] = [];

  listaRaw.forEach((poliza: any, idx: number) => {
    const producto = poliza.products?.[0] || poliza.offer || {};
    const coverages: any[] = producto.coverages || [];

    const coverageRC = coverages.find(
      (c: any) =>
        c.coverage_tag === "RESEXT" ||
        c.group?.includes("Responsabilidad Civil"),
    );
    const coverageDeducible = coverages.find(
      (c: any) =>
        c.coverage_tag?.includes("DEB") || c.group?.includes("Protección"),
    );

    const precio = Number(
      poliza.total_price || producto.price || poliza.total_premium || 0,
    );

    if (precio > 0) {
      nuevasOfertas.push({
        id: String(poliza.id_db || poliza.process_id || idx),
        aseguradora:
          producto.manufacturer || poliza.insurer_name || "Aseguradora",
        logoUrl: producto.logo || poliza.insurer_logo_url,
        planNombre:
          producto.name || producto.product_name || "Póliza Todo Riesgo",
        precioAnual: precio,
        tipoCobertura: "Amplia",
        deducible: coverageDeducible?.description || "Sin Deducible",
        coberturaRC: coverageRC?.description || "$4.000.000.000",
        rawOfferData: poliza,
      });
    }
  });

  return nuevasOfertas.sort((a, b) => a.precioAnual - b.precioAnual);
};

export default function Step4Ofertas({
  session,
  oppId,
  vehiculoData,
  onSelectOferta,
  jsonComparativoUrl,
  pdfUrl,
}: Step4Props) {
  const [ofertas, setOfertas] = useState<OfertaPoliza[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState<TipoFiltro>("todas");
  const [errorSocket, setErrorSocket] = useState<string | null>(null);
  const [estadoProgreso, setEstadoProgreso] = useState<string>(
    "Iniciando consulta con aseguradoras...",
  );

  const ofertasRef = useRef<OfertaPoliza[]>([]);

  const channelName = session?.channelName;
  const token = session?.token;

  useEffect(() => {
    ofertasRef.current = ofertas;
  }, [ofertas]);

  useEffect(() => {
    if (!channelName) {
      setErrorSocket("No se proporcionó el canal de cotización.");
      setCargando(false);
      return;
    }

    const wsUrl = "wss://www.agm-dev.com/websocket/";
    let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        const payloadRoom = {
          meta: "create_room",
          roomID: channelName,
          clientID: crypto.randomUUID(),
          message: "",
        };
        socket?.send(JSON.stringify(payloadRoom));
      };

      socket.onmessage = (event) => {
        if (
          typeof event.data === "string" &&
          !event.data.trim().startsWith("{") &&
          !event.data.trim().startsWith("[")
        ) {
          return;
        }

        try {
          const payload = JSON.parse(event.data);

          // 1. Mensajes informativos y de reglas de aseguradoras en vivo
          if (
            payload.name === "message-policy" ||
            payload.event_name === "message-policy" ||
            payload.event_name === "error_message"
          ) {
            const aseguradora = payload.insurer || payload.data?.error?.insurer;
            if (aseguradora) {
              setEstadoProgreso(`Procesando con ${aseguradora}...`);
            }
          }

          // 2. Recepción de pólizas aprobadas por WebSocket
          const listaPolizas =
            payload.data ||
            payload.offers ||
            (Array.isArray(payload) ? payload : null);

          if (
            payload.event_name === "policy_list" ||
            payload.name === "policy_list" ||
            (Array.isArray(listaPolizas) &&
              listaPolizas.length > 0 &&
              listaPolizas[0]?.products)
          ) {
            const ofertasFormateadas = formatearPolizas(listaPolizas);
            if (ofertasFormateadas.length > 0) {
              setOfertas(ofertasFormateadas);
              setCargando(false);
            }
          }
        } catch (err) {
          console.error("Error procesando evento WebSocket:", err);
        }
      };

      socket.onerror = () => {
        setErrorSocket(
          "Conexión en vivo intermitente. Generando comparativo...",
        );
      };
    } catch (e: any) {
      setErrorSocket("Error de conexión: " + e.message);
    }

    // ==========================================
    // TEMPORIZADOR DE CONTINGENCIA
    // ==========================================
    // A los 35 segundos sabemos que Agente Motor ya liquidó las primas internamente
    const contingenciaTimer = setTimeout(() => {
      if (ofertasRef.current.length === 0) {
        setCargando(false);
      }
    }, 35000);

    return () => {
      clearTimeout(contingenciaTimer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [channelName, oppId, token]);

  // Lógica de Filtros
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
            ? `Buscando y comparando las mejores opciones para tu ${nombreVehiculo}...`
            : ofertas.length > 0
              ? `Hemos encontrado ${ofertas.length} opciones para tu ${nombreVehiculo}`
              : `Comparativo oficial generado para tu ${nombreVehiculo}`}
        </p>
      </div>

      {/* BARRA DE FILTROS (Solo visible si hay ofertas renderizadas) */}
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

      {/* BANNER DE PROGRESO EN VIVO */}
      {cargando && (
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin text-black" size={20} />
            <p className="text-xs md:text-sm font-medium text-gray-800">
              {estadoProgreso}
            </p>
          </div>
        </div>
      )}

      {errorSocket && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center space-x-2 text-amber-800">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{errorSocket}</p>
        </div>
      )}

      {/* CONTENEDOR DE RESULTADOS */}
      <div className="w-full space-y-6">
        {/* TARJETAS EN VIVO (Si el socket emite policy_list) */}
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
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-12 flex items-center">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.aseguradora}
                        className="max-h-10 object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-black text-gray-900">
                        {item.aseguradora}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 text-sm text-gray-700 font-medium">
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

              <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-500 font-medium block mb-1">
                    Deducible:
                  </span>
                  <span className="font-bold text-gray-900 text-sm md:text-base">
                    {item.deducible}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block mb-1">
                    Coberturas Incluidas:
                  </span>
                  <span className="font-bold text-gray-900 text-sm md:text-base">
                    {item.coberturaRC}
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

                <button
                  type="button"
                  onClick={() =>
                    alert(`Detalles de la póliza: ${item.planNombre}`)
                  }
                  className="w-full text-center text-xs font-semibold text-gray-900 underline hover:text-gray-600 transition-colors"
                >
                  Ver Coberturas y Exclusiones
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Skeleton inicial mientras está cargando */}
        {cargando && ofertas.length === 0 && (
          <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-3 animate-pulse">
            <div className="h-6 bg-gray-200 rounded-full w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto"></div>
          </div>
        )}

        {/* CONTINGENCIA: DESCARGA DE CUADRO COMPARATIVO OFICIAL */}
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
                aseguradoras (Mapfre, Colpatria, Bolívar, HDI, Solidaria, entre
                otras).
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

        {/* Fallback en caso de que no haya ofertas ni enlace PDF */}
        {!cargando && ofertasFiltradas.length === 0 && !pdfUrl && (
          <div className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-2">
            <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">
              No se encontraron ofertas disponibles para este perfil.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
