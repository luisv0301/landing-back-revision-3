import { useState, useEffect, useCallback } from "react";
import { consultarOfertasRespaldoAction } from "@/app/actions/cotizaciones";
import { formatearPolizas, OfertaPoliza } from "@/lib/utils";

export function useComparativoOfertas(jsonComparativoUrl?: string) {
    const [ofertas, setOfertas] = useState<OfertaPoliza[]>([]);
    const [cargando, setCargando] = useState(true);
    const [errorConsulta, setErrorConsulta] = useState<string | null>(null);
    const [segundosRestantes, setSegundosRestantes] = useState(25);

    const consultarComparativo = useCallback(async () => {
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
                const formateadas = formatearPolizas(res.ofertas);
                setOfertas(formateadas);
            } else {
                setErrorConsulta(
                    "Las aseguradoras no arrojaron opciones disponibles o se presentó una demora en la liquidación.",
                );
            }
        } catch (err: any) {
            setErrorConsulta(err.message || "Error al recuperar las ofertas.");
        } finally {
            setCargando(false);
        }
    }, [jsonComparativoUrl]);

    useEffect(() => {
        setSegundosRestantes(25);
        const timer = setInterval(() => {
            setSegundosRestantes((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [jsonComparativoUrl]);

    useEffect(() => {
        if (segundosRestantes === 0) {
            consultarComparativo();
        }
    }, [segundosRestantes, consultarComparativo]);

    return {
        ofertas,
        cargando,
        errorConsulta,
        segundosRestantes,
        reintentar: consultarComparativo,
    };
}