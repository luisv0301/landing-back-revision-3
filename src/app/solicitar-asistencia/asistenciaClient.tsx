"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Phone,
    Copy,
    Check,
    HelpCircle,
    MessageCircle,
    ShieldAlert,
    Clock,
    MapPin,
    Car,
    FileText,
    ExternalLink,
} from "lucide-react";

export interface InsurerAssistance {
    id: string;
    name: string;
    legalName: string;
    shortName: string;
    logo: string;
    shortCode?: string; // e.g. "#888"
    bogotaPhone?: string; // e.g. "437 8888" or "(601) 437 8888"
    bogotaRaw?: string; // e.g. "+576014378888"
    nationalPhone: string; // e.g. "01 8000 51888"
    nationalRaw?: string; // e.g. "01800051888"
    badge?: string;
}

export const INSURERS_ASSISTANCE_DATA: readonly InsurerAssistance[] = [
    {
        id: "sura",
        name: "Seguros SURA",
        legalName: "Suramericana de Seguros S.A.",
        shortName: "SURA",
        logo: "/images/aseguradoras/sura.png",
        shortCode: "#888",
        bogotaPhone: "(601) 437 8888",
        bogotaRaw: "+576014378888",
        nationalPhone: "01 8000 51888",
        nationalRaw: "01800051888",
    },
    {
        id: "previsora",
        name: "Previsora Seguros",
        legalName: "Previsora Seguros S.A.",
        shortName: "Previsora",
        logo: "/images/aseguradoras/previsora.png",
        shortCode: "#345",
        bogotaPhone: "(601) 348 7555",
        bogotaRaw: "+576013487555",
        nationalPhone: "01 8000 113390",
        nationalRaw: "018000113390",
    },
    {
        id: "mapfre",
        name: "Mapfre Seguros",
        legalName: "Mapfre Seguros S.A.",
        shortName: "Mapfre",
        logo: "/images/aseguradoras/mapfre.png",
        shortCode: "#624",
        bogotaPhone: "(601) 307 7024",
        bogotaRaw: "+576013077024",
        nationalPhone: "01 8000 519991",
        nationalRaw: "018000519991",
    },
    {
        id: "estado",
        name: "Seguros del Estado",
        legalName: "Seguros del Estado S.A.",
        shortName: "Estado",
        logo: "/images/aseguradoras/seguros-de-estado.png",
        shortCode: "#388",
        bogotaPhone: "(601) 307 8288",
        bogotaRaw: "+576013078288",
        nationalPhone: "01 8000 123010",
        nationalRaw: "018000123010",
    },
    {
        id: "zurich",
        name: "Zurich Seguros",
        legalName: "Zurich Colombia Seguros S.A.",
        shortName: "Zurich",
        logo: "/images/aseguradoras/zurich.png",
        shortCode: "#723",
        bogotaPhone: "(601) 518 8575",
        bogotaRaw: "+576015188575",
        nationalPhone: "01 8000 512620",
        nationalRaw: "018000512620",
    },
    {
        id: "colpatria",
        name: "AXA Colpatria",
        legalName: "Axa Colpatria Seguros S.A.",
        shortName: "AXA Colpatria",
        logo: "/images/aseguradoras/colpatria.png",
        shortCode: "#247",
        bogotaPhone: "(601) 423 5757",
        bogotaRaw: "+576014235757",
        nationalPhone: "01 8000 512620",
        nationalRaw: "018000512620",
    },
    {
        id: "equidad",
        name: "La Equidad Seguros",
        legalName: "La Equidad Seguros O.C.",
        shortName: "La Equidad",
        logo: "/images/aseguradoras/equidad.png",
        shortCode: "#324",
        bogotaPhone: "(601) 746 0392",
        bogotaRaw: "+576017460392",
        nationalPhone: "01 8000 919538",
        nationalRaw: "018000919538",
    },
    {
        id: "allianz",
        name: "Allianz Seguros",
        legalName: "Allianz Seguros S.A.",
        shortName: "Allianz",
        logo: "/images/aseguradoras/allianz.png",
        shortCode: "#265",
        bogotaPhone: "(601) 594 1133",
        bogotaRaw: "+576015941133",
        nationalPhone: "01 8000 513500",
        nationalRaw: "018000513500",
    },
    {
        id: "solidaria",
        name: "Aseguradora Solidaria",
        legalName: "Aseguradora Solidaria de Colombia E.C.",
        shortName: "Solidaria",
        logo: "/images/aseguradoras/solidaria.png",
        shortCode: "#789",
        bogotaPhone: "(601) 291 6868",
        bogotaRaw: "+576012916868",
        nationalPhone: "01 8000 512021",
        nationalRaw: "018000512021",
    },
    {
        id: "mundial",
        name: "Seguros Mundial",
        legalName: "Compañía Suramericana de Seguros Mundial",
        shortName: "Mundial",
        logo: "/images/aseguradoras/mundial.png",
        shortCode: "#935",
        bogotaPhone: "(601) 327 4712",
        bogotaRaw: "+576013274712",
        nationalPhone: "01 8000 111935",
        nationalRaw: "018000111935",
    },
    {
        id: "hdi",
        name: "HDI Seguros",
        legalName: "HDI Seguros S.A.",
        shortName: "HDI",
        logo: "/images/aseguradoras/hdi.png",
        shortCode: "#224",
        bogotaPhone: "(601) 307 8320",
        bogotaRaw: "+576013078320",
        nationalPhone: "01 8000 129728",
        nationalRaw: "018000129728",
    },
    {
        id: "sbs",
        name: "SBS Seguros",
        legalName: "SBS Seguros Colombia S.A.",
        shortName: "SBS",
        logo: "/images/aseguradoras/sbs.png",
        shortCode: "#360",
        nationalPhone: "01 8000 91360",
        nationalRaw: "01800091360",
    },
    {
        id: "bolivar",
        name: "Seguros Bolívar",
        legalName: "Seguros Bolívar S.A.",
        shortName: "Bolívar",
        logo: "/images/aseguradoras/bolivar.png",
        shortCode: "#322",
        nationalPhone: "01 8000 123322",
        nationalRaw: "018000123322",
    },
    {
        id: "hdi-liberty",
        name: "HDI (Antes Liberty Seguros)",
        legalName: "HDI Seguros (anteriormente Liberty Seguros)",
        shortName: "HDI / Liberty",
        logo: "/images/aseguradoras/hdi.png",
        shortCode: "#224",
        bogotaPhone: "(601) 307 7050",
        bogotaRaw: "+576013077050",
        nationalPhone: "01 8000 113390",
        nationalRaw: "018000113390",
        badge: "Antes Liberty",
    },
] as const;

export default function AsistenciaClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Derived state for filtering - no useEffect used
    const filteredInsurers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return INSURERS_ASSISTANCE_DATA;

        return INSURERS_ASSISTANCE_DATA.filter((item) => {
            return (
                item.name.toLowerCase().includes(query) ||
                item.legalName.toLowerCase().includes(query) ||
                item.shortName.toLowerCase().includes(query) ||
                (item.shortCode && item.shortCode.toLowerCase().includes(query)) ||
                (item.bogotaPhone && item.bogotaPhone.toLowerCase().includes(query)) ||
                item.nationalPhone.toLowerCase().includes(query)
            );
        });
    }, [searchQuery]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => {
            setCopiedId((curr) => (curr === id ? null : curr));
        }, 2000);
    };

    return (
        <div className="w-full">
            {/* Search and Quick Advisory Section */}
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Search Input Box */}
                <div className="relative">
                    <label htmlFor="insurer-search" className="sr-only">
                        Buscar aseguradora o número de asistencia
                    </label>
                    <div className="relative flex items-center">
                        <Search
                            className="absolute left-4.5 h-5 w-5 text-neutral-400 pointer-events-none"
                            aria-hidden="true"
                        />
                        <input
                            id="insurer-search"
                            type="search"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar tu aseguradora (ej. Sura, Allianz, Bolívar, #888)…"
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full rounded-2xl border border-neutral-300 bg-white py-4 pl-12 pr-14 text-base text-neutral-900 placeholder:text-neutral-400 shadow-xs transition-colors focus:border-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="Borrar búsqueda"
                                className="absolute right-3.5 rounded-full px-2 py-1 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* Insurers Assistance Directory List */}
            <div className="mx-auto max-w-4xl mt-10">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                        {filteredInsurers.length}{" "}
                        {filteredInsurers.length === 1
                            ? "Aseguradora encontrada"
                            : "Aseguradoras disponibles"}
                    </p>
                </div>

                {filteredInsurers.length === 0 ? (
                    <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <HelpCircle className="mx-auto h-12 w-12 text-neutral-400" aria-hidden="true" />
                        <h3 className="mt-4 text-lg font-bold text-neutral-900">
                            No encontramos aseguradoras con &ldquo;{searchQuery}&rdquo;
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
                            Verifica el nombre o ponte en contacto con nuestro equipo por WhatsApp para asesorarte de inmediato.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="mt-5 inline-flex items-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                        >
                            Ver todas las aseguradoras
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredInsurers.map((insurer) => {
                            const shortCodeClean = insurer.shortCode
                                ? insurer.shortCode.replace("#", "%23")
                                : null;

                            return (
                                <article
                                    key={insurer.id}
                                    className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs transition-shadow duration-200 hover:shadow-md"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                        {/* Header / Logo / Name */}
                                        <div className="flex items-center gap-4 min-w-0 lg:w-1/3">
                                            <div className="flex h-14 w-20 sm:h-16 sm:w-24 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/60 p-2">
                                                <img
                                                    src={insurer.logo}
                                                    alt={`Logo de ${insurer.name}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="max-h-10 sm:max-h-11 w-auto max-w-full object-contain select-none"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 truncate">
                                                        {insurer.name}
                                                    </h3>
                                                    {insurer.badge && (
                                                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                                            {insurer.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-500 truncate mt-0.5">
                                                    {insurer.legalName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Contact Numbers Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-xl">
                                            {/* Short Code (#) */}
                                            <div className="flex flex-col justify-between rounded-2xl bg-amber-50/70 border border-amber-200/70 p-3">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                                                    # Asistencia Celular
                                                </span>
                                                <div className="mt-1 flex items-center justify-between gap-1">
                                                    {insurer.shortCode ? (
                                                        <>
                                                            <span className="font-mono text-base font-extrabold text-neutral-900 tabular-nums">
                                                                {insurer.shortCode}
                                                            </span>
                                                            <a
                                                                href={`tel:${shortCodeClean}`}
                                                                aria-label={`Marcar ${insurer.shortCode} para ${insurer.name}`}
                                                                className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                                                            >
                                                                <Phone className="h-3 w-3" aria-hidden="true" />
                                                                <span>Llamar</span>
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs font-medium text-neutral-400 italic">
                                                            Usar línea fija
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bogotá Line */}
                                            <div className="flex flex-col justify-between rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                                    Bogotá D.C.
                                                </span>
                                                <div className="mt-1 flex items-center justify-between gap-1">
                                                    {insurer.bogotaPhone ? (
                                                        <>
                                                            <span className="font-mono text-sm font-bold text-neutral-900 tabular-nums truncate">
                                                                {insurer.bogotaPhone}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCopy(
                                                                            insurer.bogotaPhone!,
                                                                            `${insurer.id}-bogota`
                                                                        )
                                                                    }
                                                                    aria-label={`Copiar teléfono Bogotá de ${insurer.name}`}
                                                                    className="rounded-full p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
                                                                >
                                                                    {copiedId === `${insurer.id}-bogota` ? (
                                                                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                                                                    ) : (
                                                                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                                                    )}
                                                                </button>
                                                                <a
                                                                    href={`tel:${insurer.bogotaRaw ?? insurer.bogotaPhone.replace(/[^0-9+]/g, "")}`}
                                                                    aria-label={`Llamar al teléfono de Bogotá de ${insurer.name}`}
                                                                    className="rounded-full bg-neutral-200/90 p-1 text-neutral-800 hover:bg-neutral-300 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
                                                                >
                                                                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                                                                </a>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs font-medium text-neutral-400 italic">
                                                            Línea Nacional
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* National Line (01 8000) */}
                                            <div className="flex flex-col justify-between rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                                    Línea Nacional
                                                </span>
                                                <div className="mt-1 flex items-center justify-between gap-1">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 tabular-nums truncate">
                                                        {insurer.nationalPhone}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCopy(
                                                                    insurer.nationalPhone,
                                                                    `${insurer.id}-national`
                                                                )
                                                            }
                                                            aria-label={`Copiar línea nacional de ${insurer.name}`}
                                                            className="rounded-full p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
                                                        >
                                                            {copiedId === `${insurer.id}-national` ? (
                                                                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                                                            ) : (
                                                                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                                            )}
                                                        </button>
                                                        <a
                                                            href={`tel:${insurer.nationalRaw ?? insurer.nationalPhone.replace(/[^0-9]/g, "")}`}
                                                            aria-label={`Llamar a la línea nacional de ${insurer.name}`}
                                                            className="rounded-full bg-neutral-200/90 p-1 text-neutral-800 hover:bg-neutral-300 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
                                                        >
                                                            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>


            {/* WhatsApp Help Banner for Unsure Clients */}
            <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                        <MessageCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                            ¿No recuerdas cuál es tu aseguradora?
                        </h2>
                        <p className="mt-0.5 text-sm text-neutral-600">
                            Consúltanos en segundos. Un asesor te confirmará tu compañía y gestionará tu asistencia.
                        </p>
                    </div>
                </div>
                <a
                    href="https://wa.me/573226289504?text=Hola,%20necesito%20asistencia%20y%20no%20recuerdo%20con%20qu%C3%A9%20aseguradora%20tengo%20mi%20p%C3%B3liza."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                    <span>Escribir al WhatsApp</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
            </div>

        </div>
    );
}
