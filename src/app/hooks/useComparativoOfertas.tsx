import { useState, useCallback, useRef } from "react";
import { useEffect } from "react";
import {
  consultarEstadoCotizacionAction,
} from "@/app/actions/cotizaciones";
import { QuoteStatus, SunriseQuoteItem } from "@/lib/types/sunrise";

function useMountEffect(effect: () => void | (() => void)) {
  /* eslint-disable react-hooks/exhaustive-deps, no-restricted-syntax */
  useEffect(effect, []);
}

export function useComparativoOfertas(
  ticketId?: number | string,
  jsonComparativoUrl?: string,
) {
  const [ofertas, setOfertas] = useState<SunriseQuoteItem[]>([]);
  const [status, setStatus] = useState<QuoteStatus | null>(null);
  const [ticketState, setTicketState] = useState<string | null>(null);
  const [comparativePdfUrl, setComparativePdfUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(30);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  const realizarConsulta = useCallback(async () => {
    if (!ticketId && !jsonComparativoUrl) {
      setErrorConsulta("No se proporcionó el número de radicado o ticket.");
      setCargando(false);
      stopPolling();
      return;
    }

    try {
      if (ticketId) {
        const res = await consultarEstadoCotizacionAction(ticketId);

        if (res.success) {
          setStatus(res.status as QuoteStatus);
          setTicketState(res.ticketState || null);
          if (res.comparativePdfUrl) {
            setComparativePdfUrl(res.comparativePdfUrl);
          }

          console.log("estados del polling", res.status)
          console.log("cotizaciones que llegan", res.quotes)
          console.log("Ticket state: ", res.ticketState)
          console.log("mensaje", res.message)

          if (res.status === "ready" || (res.quotes && res.quotes.length > 0)) {
            const rawQuotes = (res.quotes || []).sort(
              (a, b) => Number(a.premium || 0) - Number(b.premium || 0),
            );
            setOfertas(rawQuotes);
            setCargando(false);
            stopPolling();
            return;
          }

          if (res.status === "awaiting_advisor" || res.status === "failed") {
            setCargando(false);
            stopPolling();
            return;
          }
        } else {
          setErrorConsulta(res.error || "Demora al recuperar cotizaciones.");
        }
      }
    } catch (err: any) {
      console.error("[useComparativoOfertas] Error en sondeo:", err);
      setErrorConsulta(err.message || "Error al recuperar las ofertas.");
    }
  }, [ticketId, jsonComparativoUrl, stopPolling]);

  const iniciarPolling = useCallback(() => {
    stopPolling();
    setCargando(true);
    setErrorConsulta(null);
    setSegundosRestantes(30);
    isPollingRef.current = true;

    // Ejecutar primera consulta inmediata
    void realizarConsulta();

    // Contador regresivo visual
    timerRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling cada 5 segundos
    pollIntervalRef.current = setInterval(() => {
      if (isPollingRef.current) {
        void realizarConsulta();
      }
    }, 5000);
  }, [realizarConsulta, stopPolling]);

  useMountEffect(() => {
    iniciarPolling();
    return () => {
      stopPolling();
    };
  });

  return {
    ofertas,
    status,
    ticketState,
    comparativePdfUrl,
    cargando,
    errorConsulta,
    segundosRestantes,
    reintentar: iniciarPolling,
  };
}