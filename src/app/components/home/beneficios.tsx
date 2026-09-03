"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1],
        },
    },
};

export default function Beneficios() {
    return (
        <div className="px-6 py-12 lg:py-24 lg:max-w-280 lg:mx-auto">
            <h2 className="text-4xl text-center font-bold lg:text-5xl tracking-tight">Doble Respaldo</h2>
            <p className="text-center mt-3 text-neutral-600">No solo vendemos pólizas: te acompañamos en todo el proceso</p>
            <div className="lg:flex lg:gap-3 flex-row-reverse mt-12">
                <motion.img
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    src="/images/respaldo.webp"
                    alt="Equipo Segurautos acompañándote"
                    className="rounded-t-4xl lg:max-w-[50%] lg:rounded-4xl lg:object-cover w-full lg:w-auto"
                />
                <motion.ul
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-200px" }}
                    className="space-y-0.5 lg:space-y-3 bg-[#FFF7CF] py-7 rounded-b-4xl lg:py-0 lg:bg-transparent"
                >
                    <motion.li
                        variants={itemVariants}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="py-8 px-5 bg-white rounded-t-4xl lg:rounded-4xl lg:shadow-[-12px_0_0_#FFF7CF] transition-shadow duration-200 hover:shadow-md"
                    >
                        <div className="flex gap-3 items-center">
                            <img src="images/analizamos-icon.svg" alt="" />
                            <p className="text-2xl font-bold lg:text-3xl">Analizamos</p>
                        </div>
                        <p className="mt-2 text-neutral-600 leading-relaxed">
                            Comparamos coberturas, deducibles y tarifas entre más de 13 aseguradoras aliadas para encontrar la póliza que de verdad se ajuste a ti.
                        </p>
                    </motion.li>
                    <motion.li
                        variants={itemVariants}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="py-8 px-5 bg-white lg:rounded-4xl lg:shadow-[-12px_0_0_#FFF7CF] transition-shadow duration-200 hover:shadow-md"
                    >
                        <div className="flex gap-3 items-center">
                            <img src="images/gestionamos-icon.svg" alt="" />
                            <p className="text-2xl lg:text-3xl font-bold">Gestionamos</p>
                        </div>
                        <p className="mt-2 text-neutral-600 leading-relaxed">
                            Nos encargamos de toda la documentación y trámites con la aseguradora. Tú solo firmas.
                        </p>
                    </motion.li>
                    <motion.li
                        variants={itemVariants}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="py-8 px-5 bg-white rounded-b-4xl lg:rounded-4xl lg:shadow-[-12px_0_0_#FFF7CF] transition-shadow duration-200 hover:shadow-md"
                    >
                        <div className="flex gap-3 items-center">
                            <img src="images/acompanamos-icon.svg" alt="" />
                            <p className="text-2xl font-bold lg:text-3xl">Acompañamos</p>
                        </div>
                        <p className="mt-2 text-neutral-600 leading-relaxed">
                            Seguimos contigo durante toda la vigencia de tu póliza, incluyendo el proceso de un siniestro o reclamación.
                        </p>
                    </motion.li>
                </motion.ul>
            </div>
        </div>
    );
}   