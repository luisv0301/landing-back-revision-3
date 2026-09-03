"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
export type VehicleType = "carro" | "moto";

export interface BenefitItem {
    id: string;
    text: string;
}

export interface CoverageInfo {
    id: VehicleType;
    label: string;
    icon: string; // SVG path or icon identifier
    title: string;
    totalLossTitle: string;
    totalLossPercentage: string;
    totalLossDescription: string;
    image: {
        mobileSrc: string;
        desktopSrc: string;
        alt: string;
    };
    benefits: BenefitItem[];
}

const COVERAGE_DATA: Record<VehicleType, CoverageInfo> = {
    carro: {
        id: "carro",
        label: "Carro",
        icon: "car",
        title: "Auto todo Riesgo",
        totalLossTitle: "Pérdida total",
        totalLossPercentage: "80-90%",
        totalLossDescription: "Indemnización sobre el valor comercial del vehículo.",
        image: {
            mobileSrc: "/images/cobertura-carro.webp",
            desktopSrc: "/images/cobertura-carro-xl.webp",
            alt: "Pareja feliz en auto disfrutando un viaje",
        },
        benefits: [
            {
                id: "c1",
                text: "Daños por accidente de tránsito, sin importar el responsable.",
            },
            {
                id: "c2",
                text: "Hurto total y hurto de accesorios/partes.",
            },
            {
                id: "c3",
                text: "Asistencia en viaje 24/7 (grúa, cerrajería, batería).",
            },
            {
                id: "c4",
                text: "Responsabilidad civil extracontractual.",
            },
            {
                id: "c5",
                text: "Vehículo de reemplazo mientras reparan el tuyo.",
            },
        ],
    },
    moto: {
        id: "moto",
        label: "Moto",
        icon: "moto",
        title: "Moto todo Riesgo",
        totalLossTitle: "Pérdida total",
        totalLossPercentage: "100%",
        totalLossDescription: "Indemnización completa sobre el valor comercial de la moto.",
        image: {
            mobileSrc: "/images/cobertura-moto.webp",
            desktopSrc: "/images/cobertura-moto-xl.webp",
            alt: "Conductor en motocicleta equipado y seguro",
        },
        benefits: [
            {
                id: "m1",
                text: "Cobertura total ante accidentes y colisiones en la vía.",
            },
            {
                id: "m2",
                text: "Protección integral contra hurto total de la motocicleta.",
            },
            {
                id: "m3",
                text: "Asistencia inmediata 24/7 (remolque, auxilio mecánico).",
            },
            {
                id: "m4",
                text: "Responsabilidad civil para daños a terceros.",
            },
            {
                id: "m5",
                text: "Gastos médicos para el conductor y acompañante.",
            },
        ],
    },
};

export default function Coberturas() {
    const [selectedType, setSelectedType] = useState<VehicleType>("carro");
    const tabListId = useId();

    const currentCoverage = COVERAGE_DATA[selectedType];

    return (
        <section
            id="coberturas"
            aria-labelledby="coverage-heading"
            className="w-full py-16 px-6 sm:px-6 lg:py-24 lg:max-w-280 lg:mx-auto"
        >
            <div className="mx-auto max-w-6xl">

                <header className="mb-10 text-center max-w-2xl mx-auto">
                    <h2
                        id="coverage-heading"
                        className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
                    >
                        Cobertura Destacada
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                        Analizamos entre 13+ aseguradoras aliadas para encontrar el respaldo
                        que mejor se ajusta a tu vehículo y presupuesto.
                    </p>

                    {/* Vehicle Selector Tabs */}
                    <div className="mt-8 flex justify-center">
                        <div
                            role="tablist"
                            aria-label="Selecciona el tipo de vehículo"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white p-1.5  lg:p-1 shadow-sm border border-neutral-200"
                        >
                            {(Object.keys(COVERAGE_DATA) as VehicleType[]).map((type) => {
                                const isSelected = selectedType === type;
                                const tabId = `${tabListId}-tab-${type}`;
                                const panelId = `${tabListId}-panel-${type}`;

                                return (
                                    <button
                                        key={type}
                                        id={tabId}
                                        role="tab"
                                        aria-selected={isSelected}
                                        aria-controls={panelId}
                                        onClick={() => setSelectedType(type)}
                                        className={`relative z-10 flex items-center justify-center gap-2.5 rounded-full px-7 py-3 text-base font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${isSelected ? "text-white" : "text-neutral-700 hover:text-neutral-900"
                                            }`}
                                    >
                                        {/* Active Tab Highlight Animation */}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="activeTabIndicator"
                                                className="absolute inset-0 z-[-1] rounded-full bg-[#232325]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <VehicleIcon type={type} />

                                        <span>{COVERAGE_DATA[type].label}</span>

                                        {/* Active Checkmark Badge */}
                                        {isSelected && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD000] text-neutral-900">
                                                <CheckIcon className="h-3 w-3 stroke-[3]" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </header>

                {/* Dynamic Card Container */}
                <div
                    id={`${tabListId}-panel-${selectedType}`}
                    role="tabpanel"
                    aria-labelledby={`${tabListId}-tab-${selectedType}`}
                    className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_1px_4px_0_#00000040]"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedType}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2"
                        >
                            {/* Left Column: Visual Illustration & Banner */}
                            <div className=" overflow-hidden ">
                                <picture className="relative block h-full w-full">

                                    <source
                                        media="(min-width: 64rem)"
                                        srcSet={currentCoverage.image.desktopSrc}
                                    />
                                    <img
                                        src={currentCoverage.image.mobileSrc}
                                        alt={currentCoverage.image.alt}
                                        loading="lazy"
                                        decoding="async"
                                        className="object-cover rounded-b-4xl lg:h-full lg:rounded-t-4xl w-full lg:w-auto lg:object-right"
                                    />
                                </picture>
                            </div>




                            {/* Right Column: Coverage Details & Benefits */}
                            <div className="flex flex-col justify-between p-5 sm:p-10 lg:p-12">
                                <div>
                                    <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight text-center">
                                        {currentCoverage.title}
                                    </h3>

                                    {/* Highlight Box (Total Loss) */}
                                    <div className="mt-6 rounded-2xl bg-[#232325] p-5 sm:p-6 text-white shadow-inner">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-base sm:text-lg font-bold">
                                                {currentCoverage.totalLossTitle}
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-extrabold text-white">
                                                {currentCoverage.totalLossPercentage}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                            {currentCoverage.totalLossDescription}
                                        </p>
                                    </div>

                                    {/* Benefits Checklist */}
                                    <ul className="mt-8 space-y-4" role="list">
                                        {currentCoverage.benefits.map((benefit) => (
                                            <li key={benefit.id} className="flex items-start gap-3.5">
                                                <span
                                                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white"
                                                    aria-hidden="true"
                                                >
                                                    <CheckIcon className="h-3 w-3 stroke-[3]" />
                                                </span>
                                                <span className="text-sm sm:text-base font-medium text-neutral-800 leading-snug">
                                                    {benefit.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-10">
                                    <a
                                        href="#cotizar"
                                        className="inline-flex py-5 px-6 rounded-full bg-yellow-400 text-black w-full min-h-14 items-center justify-center text-center font-bold  transition-all duration-200 hover:bg-[#e6bd00] focus:outline-none focus:ring-4 focus:ring-[#FFD000]/40 active:scale-[0.99]"
                                    >
                                        Cotizar tu Seguro
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

// Helpers / Icons Components
function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function VehicleIcon({ type, className }: { type: VehicleType; className?: string }) {
    if (type === "carro") {
        return (
            <img src="/images/carro.svg" alt="" className="max-w-6 lg:max-w-10" />
        );
    }

    return (
        <img src="/images/moto.svg" alt="" className="max-w-6 lg:max-w-10" />
    );
}