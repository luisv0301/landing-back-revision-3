'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, Loader2, AlertCircle, Check } from 'lucide-react';
import io from 'socket.io-client';

export interface OfertaPoliza {
    id: string;
    aseguradora: string;
    logoUrl?: string;
    planNombre: string;
    precioAnual: number;
    tipoCobertura: string; // Ej: 'Amplia', 'Esencial', 'Premium'
    deducible: string;
    coberturaRC: string;
    rawOfferData?: any;
}

interface Step4Props {
    session?: {
        channelName: string;
        token?: string;
    };
    vehiculoData: any;
    onSelectOferta: (oferta: OfertaPoliza) => void;
}

type TipoFiltro = 'todas' | 'economica' | 'cobertura';

export default function Step4Ofertas({ session, vehiculoData, onSelectOferta }: Step4Props) {
    const [ofertas, setOfertas] = useState<OfertaPoliza[]>([]);
    const [cargando, setCargando] = useState(true);
    const [errorSocket, setErrorSocket] = useState<string | null>(null);
    const [filtroActivo, setFiltroActivo] = useState<TipoFiltro>('todas');

    useEffect(() => {
        if (!session?.channelName) {
            setErrorSocket('No se encontró una sesión activa de cotización.');
            setCargando(false);
            return;
        }

        const tokenLimpio = session.token?.startsWith('Bearer ')
            ? session.token
            : `Bearer ${session.token}`;

        const socket = io('https://apipro.agentemotor.com', {
            transports: ['polling', 'websocket'], // Permitimos polling primero para pasar el handshake
            auth: {
                token: tokenLimpio,
            },
            query: {
                token: tokenLimpio,
            },
        });

        socket.on('connect', () => {
            socket.emit('subscribe', { channel: session.channelName });
        });

        socket.on('event-quote-response', (data: any) => {
            if (data && data.quotation_status === 'SUCCESS' && data.offer) {
                const nuevaOferta: OfertaPoliza = {
                    id: data.offer.id || String(Date.now()),
                    aseguradora: data.insurer_name || 'Aseguradora',
                    logoUrl: data.insurer_logo_url,
                    planNombre: data.offer.product_name || 'Cobertura Todo Riesgo',
                    precioAnual: Number(data.offer.total_premium || 0),
                    tipoCobertura: data.offer.category_name || 'Amplia',
                    deducible: data.offer.deductible || '$4.500.000',
                    coberturaRC: data.offer.liability_coverage || '$4.500.000',
                    rawOfferData: data,
                };

                setOfertas((prev) => {
                    if (prev.some((o) => o.id === nuevaOferta.id)) return prev;
                    return [...prev, nuevaOferta].sort((a, b) => a.precioAnual - b.precioAnual);
                });
            }
        });

        socket.on('event-quote-finished', () => {
            setCargando(false);
        });

        socket.on('connect_error', () => {
            setErrorSocket('Ocurrió un inconveniente al conectar con el servidor de ofertas.');
            setCargando(false);
        });

        const timer = setTimeout(() => {
            setCargando(false);
        }, 20000);

        return () => {
            clearTimeout(timer);
            socket.disconnect();
        };
    }, [session]);

    // Lista de ofertas filtradas según la pestaña activa
    const ofertasFiltradas = useMemo(() => {
        if (ofertas.length === 0) return [];

        if (filtroActivo === 'economica') {
            // Retorna la más económica (o las 2 más económicas)
            const menorPrecio = Math.min(...ofertas.map((o) => o.precioAnual));
            return ofertas.filter((o) => o.precioAnual === menorPrecio);
        }

        if (filtroActivo === 'cobertura') {
            // Prioriza planes de categoría 'Amplia' o 'Premium'
            const amplias = ofertas.filter(
                (o) =>
                    o.tipoCobertura.toLowerCase().includes('amplia') ||
                    o.tipoCobertura.toLowerCase().includes('premium')
            );
            return amplias.length > 0 ? amplias : ofertas;
        }

        return ofertas; // 'todas'
    }, [ofertas, filtroActivo]);

    const formatCOP = (valor: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(valor);
    };

    const nombreVehiculo = `${vehiculoData?.brand || ''} ${vehiculoData?.line || ''}`.trim() || 'tu vehículo';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-auto flex flex-col items-center"
        >
            {/* Encabezado */}
            <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Tus Ofertas Personalizadas
                </h1>
                <p className="text-gray-600 text-sm">
                    {cargando && ofertas.length === 0
                        ? 'Buscando las mejores opciones para ti...'
                        : `Hemos encontrado ${ofertas.length} opciones para tu ${nombreVehiculo}`}
                </p>
            </div>

            {/* BARRA DE FILTROS (Diseño de la Imagen) */}
            <div className="bg-white p-1.5 rounded-full border border-gray-200 shadow-xs flex items-center justify-between w-full max-w-md mb-8">
                <button
                    type="button"
                    onClick={() => setFiltroActivo('todas')}
                    className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-1.5 ${filtroActivo === 'todas'
                        ? 'bg-[#222222] text-white shadow-sm'
                        : 'text-gray-700 hover:text-black'
                        }`}
                >
                    <span>Todas</span>
                    {filtroActivo === 'todas' && (
                        <div className="bg-[#FFCC00] text-black rounded-full p-0.5">
                            <Check size={10} strokeWidth={3} />
                        </div>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setFiltroActivo('economica')}
                    className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center justify-center ${filtroActivo === 'economica'
                        ? 'bg-[#222222] text-white shadow-sm'
                        : 'text-gray-700 hover:text-black'
                        }`}
                >
                    <span>$ Más Económica</span>
                </button>

                <button
                    type="button"
                    onClick={() => setFiltroActivo('cobertura')}
                    className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-1 ${filtroActivo === 'cobertura'
                        ? 'bg-[#222222] text-white shadow-sm'
                        : 'text-gray-700 hover:text-black'
                        }`}
                >
                    <span className="text-xs">🛡️</span>
                    <span>Mejor Cobertura</span>
                </button>
            </div>

            {/* Indicador de Búsqueda Activa */}
            {cargando && (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Loader2 className="animate-spin text-black" size={20} />
                        <p className="text-xs md:text-sm font-medium text-gray-800">
                            Consultando aseguradoras en tiempo real... ({ofertas.length} recibidas)
                        </p>
                    </div>
                </div>
            )}

            {/* Mensaje de Error */}
            {errorSocket && (
                <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center space-x-2 text-red-700">
                    <AlertCircle size={18} />
                    <p className="text-sm font-medium">{errorSocket}</p>
                </div>
            )}

            {/* LISTADO DE TARJETAS DE OFERTAS */}
            <div className="w-full space-y-6">
                <AnimatePresence mode="popLayout">
                    {ofertasFiltradas.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            className="w-full bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col space-y-6"
                        >
                            {/* Header de la Tarjeta: Logo + Precio */}
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
                                    {/* Calificación / Estrellas */}
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
                                    <span className="text-xs text-gray-500 font-medium block">Prima Anual</span>
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {formatCOP(item.precioAnual)}
                                    </div>
                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        {item.tipoCobertura}
                                    </span>
                                </div>
                            </div>

                            {/* Detalle de Deducible y Coberturas */}
                            <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <span className="text-xs text-gray-500 font-medium block mb-1">Deducible:</span>
                                    <span className="font-bold text-gray-900 text-sm md:text-base">
                                        {item.deducible}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 font-medium block mb-1">Coberturas Incluidas:</span>
                                    <span className="font-bold text-gray-900 text-sm md:text-base">
                                        {item.coberturaRC}
                                    </span>
                                </div>
                            </div>

                            {/* Botón Principal y Enlace */}
                            <div className="space-y-3 pt-1">
                                <Button
                                    onClick={() => onSelectOferta(item)}
                                    className="w-full bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold rounded-full py-6 text-base transition-colors shadow-none"
                                >
                                    La Quiero
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => alert(`Detalles del plan: ${item.planNombre}`)}
                                    className="w-full text-center text-xs font-semibold text-gray-900 underline hover:text-gray-600 transition-colors"
                                >
                                    Ver Coberturas y Exclusiones
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Estado sin ofertas */}
                {!cargando && ofertasFiltradas.length === 0 && (
                    <div className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-2">
                        <p className="text-gray-600 font-medium">No hay ofertas en este filtro.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}