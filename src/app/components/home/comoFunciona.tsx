"use client";

import { useCallback, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

interface StepItem {
    id: number;
    title: string;
    description: string;
    lottieSrc: string;
}

const HOW_IT_WORKS_STEPS: readonly StepItem[] = [
    {
        id: 1,
        title: "Cuéntanos sobre tu carro",
        description: "Ingresa tu placa y celular - 30 segundos, sin compromiso",
        lottieSrc: "/lotties/servicio-1.lottie",
    },
    {
        id: 2,
        title: "Analizamos el mercado",
        description: "Comparamos tarifas y coberturas entre nuestras aseguradoras aliadas.",
        lottieSrc: "/lotties/servicio-2.lottie",
    },
    {
        id: 3,
        title: "Te presentamos las mejores opciones",
        description: "Una gestora te explica por WhatsApp o llamada, sin tecnicismos",
        lottieSrc: "/lotties/servicio-3.lottie",
    },
    {
        id: 4,
        title: "Emitimos tu póliza",
        description: "Gestionamos el papeleo y queda protegido-nosotros seguimos acompañándote.",
        lottieSrc: "/lotties/servicio-4.lottie",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            //staggerChildren: 0.06,
            staggerChildren: 0.25,
            delayChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: [0.23, 1, 0.32, 1],
        },
    },
};

interface StepCardProps {
    step: StepItem;
}

function StepCard({ step }: StepCardProps) {
    const dotLottieRef = useRef<DotLottie | null>(null);
    const hasStartedRef = useRef(false);

    const handleAnimationStart = useCallback(() => {
        hasStartedRef.current = true;
        dotLottieRef.current?.play();
    }, []);

    const handleLottieRef = useCallback((instance: DotLottie | null) => {
        dotLottieRef.current = instance;
        if (hasStartedRef.current && instance) {
            instance.play();
        }
    }, []);

    return (
        <motion.li
            variants={cardVariants}
            onAnimationStart={handleAnimationStart}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="flex flex-col overflow-hidden rounded-4xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
            <div className="relative flex flex-col justify-between bg-[#FFF6D4] p-6 pb-4 rounded-b-4xl">
                <span
                    className="absolute top-6 left-6 text-3xl font-extrabold text-neutral-900 tracking-tight"
                    aria-hidden="true"
                >
                    {step.id}
                </span>
                <div className="relative mt-2 flex h-40 w-full items-center justify-center">
                    <DotLottieReact
                        src={step.lottieSrc}
                        autoplay={false}
                        loop={false}
                        dotLottieRefCallback={handleLottieRef}
                        className="h-full w-full object-contain"
                        renderConfig={{ autoResize: true }}
                    />
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col justify-start p-6">
                <h3 className="text-xl font-bold text-neutral-900 leading-snug">
                    {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                </p>
            </div>
        </motion.li>
    );
}

export default function ComoFunciona() {
    return (
        <section
            id="como-funciona"
            aria-labelledby="how-it-works-title"
            className="w-full bg-[#1C1C1E] py-16 px-4 sm:px-6 lg:py-24 lg:px-8 rounded-4xl"
        >
            <div className="mx-auto lg:max-w-280">
                {/* Section Header */}
                <header className="mb-12 text-center sm:mb-16">
                    <h2
                        id="how-it-works-title"
                        className="text-3xl font-bold tracking-tight text-white lg:text-5xl"
                    >
                        Cómo funciona
                    </h2>
                    <p className="mt-3 text-sm text-neutral-300 sm:text-base">
                        De la cotización a tu póliza activa en 4 pasos
                    </p>
                </header>

                <motion.ol
                    className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-120px" }}
                >
                    {HOW_IT_WORKS_STEPS.map((step) => (
                        <StepCard key={step.id} step={step} />
                    ))}
                </motion.ol>
            </div>
        </section>
    );
}