"use client"
import { motion, type Variants } from "framer-motion"

export interface TestimonialItem {
    id: string;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    content: string;
}

const TESTIMONIALS_DATA: readonly TestimonialItem[] = [
    {
        id: "t-1",
        name: "María Salamanka",
        location: "Bogotá",
        avatar: "/images/profile-img.png",
        rating: 5,
        content:
            "Excelente experiencia al contratar mi póliza todo riesgo. La atención y asesoramiento fueron fundamentales para encontrar la mejor opción para mis necesidades. Me explicaron claramente los términos y condiciones, y me ayudaron a entender todo el proceso. La amabilidad y profesionalismo me dieron confianza en la decisión que tomé. ¡Gracias por el excelente servicio!",
    },
    {
        id: "t-2",
        name: "María Salamanka",
        location: "Bogotá",
        avatar: "/images/profile-img.png",
        rating: 5,
        content:
            "En el desarrollo de actualizar la vigencia de mi seguro de vehículo me atendio la Sra. Manuela Leyton y el apoyo durante todo el tramite fue muy cordial, clara y atenta. Muchas gracias.",
    },
    {
        id: "t-3",
        name: "María Salamanka",
        location: "Bogotá",
        avatar: "/images/profile-img.png",
        rating: 5,
        content:
            "El proceso con ellos es muy ágil y rápido, facilitan mucho la comparación entre aseguradoras permitiendo escoger la que mejor se adapte a las necesidades del usuario, Karen Mendivelso me colaboró en todo el proceso, estuvo muy atenta todo el tiempo y resolvió todas mis dudas.",
    },
] as const;

export default function TestimonialsSection() {
    return (
        <section
            id="testimonios"
            aria-labelledby="testimonials-heading"
            className="relative w-full overflow-hidden bg-[#222325] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 rounded-4xl"
        >

            <img src="/images/testimonios-bg.webp" alt="" className="w-full h-full absolute object-cover object-bottom-left top-0 left-0" />

            <div className="relative mx-auto lg:max-w-280">

                <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
                    <h2
                        id="testimonials-heading"
                        className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                        Miles de conductores ya confían en nosotros
                    </h2>
                    <p className="mt-4 text-sm font-medium leading-relaxed text-neutral-300 sm:text-base">
                        Nuestras gestoras acompañan personalmente cada caso — por eso la
                        mayoría de nuestras reseñas las mencionan por nombre.
                    </p>

                    {/* Aggregate Rating Banner */}
                    <div className="mt-8 flex flex-col items-center justify-center">
                        {/* 5 Big Stars with 4.9 split representation */}
                        <div
                            className="flex items-center gap-2"
                            aria-label="Calificación promedio de 4.9 de 5 estrellas"
                        >
                            {Array.from({ length: 4 }).map((_, i) => (
                                <BigStar key={i} filled />
                            ))}
                            <HalfBigStar />
                        </div>

                        {/* Google Badge Scores */}
                        <div className="mt-4 flex items-center gap-6 sm:gap-8 text-white">
                            <span className="text-xl sm:text-2xl font-bold tracking-tight">
                                4.9/5 en Google
                            </span>
                            <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-300">
                                3.558 reviews
                            </span>
                        </div>
                    </div>
                </header>

                {/* Testimonials Stream */}
                <TestimonialList testimonials={TESTIMONIALS_DATA} />
            </div>
        </section>
    );
}

function BigStar({ filled }: { filled?: boolean }) {
    return (
        <svg
            className={`h-10 w-10 sm:h-12 sm:w-12 ${filled ? "fill-[#FFF3C2]" : "fill-neutral-600"
                }`}
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}

function HalfBigStar() {
    return (
        <div className="relative h-10 w-10 sm:h-12 sm:w-12">
            <svg
                className="absolute inset-0 h-full w-full fill-neutral-500"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <div className="absolute inset-0 w-[80%] overflow-hidden">
                <svg
                    className="h-10 w-10 sm:h-12 sm:w-12 fill-[#FFF3C2]"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            </div>
        </div>
    );
}

interface TestimonialListProps {
    testimonials: readonly TestimonialItem[];
}

const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

export function TestimonialList({ testimonials }: TestimonialListProps) {
    return (
        <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
        >
            {testimonials.map((item) => (
                <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="w-[85vw] shrink-0 snap-center sm:w-[360px] lg:w-auto"
                >
                    <TestimonialCard testimonial={item} />
                </motion.div>
            ))}
        </motion.div>
    );
}


interface TestimonialCardProps {
    testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-7 shadow-sm">
            <div>
                {/* Author Header */}
                <header className="flex items-center gap-3.5">
                    <picture className="h-13 w-13 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                        <img
                            src={testimonial.avatar}
                            alt={`Fotografía de ${testimonial.name}`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    </picture>
                    <div>
                        <h3 className="text-base font-bold text-neutral-900 leading-tight">
                            {testimonial.name}
                        </h3>
                        <p className="text-sm font-medium text-neutral-400">
                            {testimonial.location}
                        </p>
                    </div>
                </header>

                {/* Star Rating */}
                <div
                    className="mt-4 flex items-center gap-1 text-neutral-900"
                    aria-label={`Calificación: ${testimonial.rating} de 5 estrellas`}
                >
                    {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon
                            key={index}
                            className={`h-4 w-4 ${index < testimonial.rating
                                ? "fill-neutral-900"
                                : "fill-neutral-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Testimonial Body */}
                <blockquote className="mt-4 text-sm leading-relaxed text-neutral-700">
                    <p>{testimonial.content}</p>
                </blockquote>
            </div>
        </article>
    );
}

function StarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}