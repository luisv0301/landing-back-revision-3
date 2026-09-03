"use client"

import { motion, type Variants } from "framer-motion"

export interface InsurerItem {
    id: string;
    name: string;
    logo: string;
    width?: number;
    height?: number;
}

export const INSURERS_DATA: readonly InsurerItem[] = [
    { id: "sura", name: "Seguros Sura", logo: "/images/aseguradoras/sura.png" },
    { id: "allianz", name: "Allianz", logo: "/images/aseguradoras/allianz.png" },
    { id: "estado", name: "Seguros del Estado", logo: "/images/aseguradoras/seguros-de-estado.png" },
    { id: "colpatria", name: "AXA Colpatria", logo: "/images/aseguradoras/colpatria.png" },
    { id: "hdi", name: "HDI Seguros", logo: "/images/aseguradoras/hdi.png" },
    { id: "chubb", name: "Chubb", logo: "/images/aseguradoras/chubb.png" },
    { id: "bolivar", name: "Seguros Bolívar", logo: "/images/aseguradoras/bolivar.png" },
    { id: "mapfre", name: "Mapfre Seguros", logo: "/images/aseguradoras/mapfre.png" },
    { id: "sbs", name: "SBS Seguros Colombia", logo: "/images/aseguradoras/sbs.png" },
    { id: "previsora", name: "Previsora Seguros", logo: "/images/aseguradoras/previsora.png" },
    { id: "solidaria", name: "Aseguradora Solidaria de Colombia", logo: "/images/aseguradoras/solidaria.png" },
    { id: "mundial", name: "Seguros Mundial", logo: "/images/aseguradoras/mundial.png" },
    { id: "equidad", name: "La Equidad Seguros", logo: "/images/aseguradoras/equidad.png" },
] as const;


export default function Aseguradoras() {
    return (
        <section
            id="aseguradoras"
            aria-labelledby="insurers-heading"
            className="w-full px-4 py-16 lg:py-24 lg:max-w-280 lg:mx-auto"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section Heading */}
                <header className="mb-10 sm:mb-14 text-center">
                    <h2
                        id="insurers-heading"
                        className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
                    >
                        Comparamos entre +13
                        <span className="block mt-1">aseguradoras aliadas</span>
                    </h2>
                </header>
                <InsurerGrid insurers={INSURERS_DATA} />
            </div>
        </section>
    );
}

interface InsurerGridProps {
    insurers: readonly InsurerItem[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.28,
            ease: [0.23, 1, 0.32, 1],
        },
    },
};

export function InsurerGrid({ insurers }: InsurerGridProps) {
    return (
        <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4"
        >
            {insurers.map((insurer) => (
                <motion.li
                    key={insurer.id}
                    variants={itemVariants}
                    whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex h-20 sm:h-24 w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-md cursor-default select-none ${insurer.id === "solidaria" && "lg:col-start-2"} ${insurer.id === "mundial" && "lg:col-start-3"} ${insurer.id === "equidad" && "lg:col-start-4"}`}
                >
                    <img
                        src={insurer.logo}
                        alt={`Logo de ${insurer.name}`}
                        loading="lazy"
                        decoding="async"
                        className="max-h-10 sm:max-h-12 w-auto max-w-[85%] object-contain select-none transition-transform duration-200"
                    />
                </motion.li>
            ))}
        </motion.ul>
    );
}