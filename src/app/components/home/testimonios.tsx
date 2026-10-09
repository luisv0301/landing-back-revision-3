"use client"
import { useState, useCallback, useId } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { GoogleReview } from "@/lib/google-reviews";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export interface TestimonialItem {
    id: string;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    content: string;
}



export default function TestimonialsSection({ reviews, rating, userRatingTotal }: { reviews: GoogleReview[], rating: number, userRatingTotal: number }) {
    return (
        <section
            id="testimonios"
            aria-labelledby="testimonials-heading"
            className="relative w-full overflow-hidden bg-[#222325] py-16 lg:px-8 lg:py-24 rounded-4xl"
        >

            <img src="/images/testimonios-bg.webp" alt="" className="w-full h-full absolute object-cover object-bottom-left top-0 left-0" />

            <div className="relative mx-auto lg:max-w-280">

                <header className="mx-auto mb-12 max-w-3xl text-center px-4 sm:mb-16 sm:px-6 ">
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
                            aria-label={`Calificación promedio de ${rating} de 5 estrellas`}
                        >
                            {Array.from({ length: 4 }).map((_, i) => (
                                <BigStar key={i} filled />
                            ))}
                            <HalfBigStar />
                        </div>

                        {/* Google Badge Scores */}
                        <div className="mt-4 flex items-center gap-6 sm:gap-8 text-white">
                            <span className="text-xl sm:text-2xl font-bold tracking-tight">
                                {rating}/5 en Google
                            </span>
                            <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-300">
                                {new Intl.NumberFormat("es-CO").format(userRatingTotal)} reviews
                            </span>
                        </div>
                    </div>
                </header>

                {/* Testimonials Stream */}
                <TestimonialList testimonials={reviews} />
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
    testimonials: readonly GoogleReview[];
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
        <>
            {/* Mobile: Scroll horizontal nativo con touch swipe */}
            <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
            >
                {testimonials?.map((item, id) => (
                    <motion.div
                        key={item.time ? `${item.author_name}-${item.time}` : id}
                        variants={itemVariants}
                        className="w-[85%] shrink-0 snap-center sm:w-[360px] first:ml-4 last:mr-4"
                    >
                        <TestimonialCard testimonial={item} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Desktop: Carousel de shadcn con 3 cards y botones de navegación */}
            <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="hidden lg:block w-full relative"
            >
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full relative"
                >
                    <CarouselContent className="-ml-6">
                        {testimonials?.map((item, id) => (
                            <CarouselItem
                                key={item.time ? `${item.author_name}-${item.time}` : id}
                                className="pl-6 basis-1/3"
                            >
                                <motion.div variants={itemVariants} className="h-full">
                                    <TestimonialCard testimonial={item} />
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 xl:-left-12 size-10 rounded-full border-neutral-700 bg-neutral-800/90 text-white hover:bg-neutral-700 hover:text-white disabled:opacity-20 transition-colors shadow-lg" />
                    <CarouselNext className="-right-4 xl:-right-12 size-10 rounded-full border-neutral-700 bg-neutral-800/90 text-white hover:bg-neutral-700 hover:text-white disabled:opacity-20 transition-colors shadow-lg" />
                </Carousel>
            </motion.div>
        </>
    );
}


interface TestimonialExpandableTextProps {
    text: string;
}

export function TestimonialExpandableText({
    text,
}: TestimonialExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [canTruncate, setCanTruncate] = useState(false);
    const [collapsedHeight, setCollapsedHeight] = useState<number | undefined>(undefined);
    const shouldReduceMotion = useReducedMotion();
    const contentId = useId();

    // Callback ref para medir el DOM sin usar useEffect (cumpliendo no-use-effect)
    const textRef = useCallback((node: HTMLParagraphElement | null) => {
        if (!node) return;

        const checkTruncation = () => {
            if (node.scrollHeight > node.clientHeight) {
                setCanTruncate(true);
                setCollapsedHeight(node.clientHeight);
            }
        };

        checkTruncation();

        const observer = new ResizeObserver(() => {
            checkTruncation();
        });

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Detiene propagación para no activar el enlace absoluto de Google Maps de la tarjeta
        e.stopPropagation();
        setIsAnimating(true);
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="mt-4 flex flex-col">
            <blockquote className="text-sm leading-relaxed text-neutral-700 select-none">
                <motion.div
                    initial={false}
                    animate={{
                        height: isExpanded ? "auto" : collapsedHeight ?? "auto",
                    }}
                    transition={{
                        duration: shouldReduceMotion || !isAnimating ? 0 : 0.25,
                        ease: [0.23, 1, 0.32, 1], // Emil Kowalski standard UI ease-out
                    }}
                    onAnimationComplete={() => {
                        setIsAnimating(false);
                    }}
                    className="overflow-hidden"
                >
                    <p
                        id={contentId}
                        ref={textRef}
                        className={`whitespace-pre-line ${
                            !isExpanded && !isAnimating ? "line-clamp-8" : ""
                        }`}
                    >
                        {text}
                    </p>
                </motion.div>
            </blockquote>

            {canTruncate && (
                <div className="mt-2.5 flex items-center">
                    <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={contentId}
                        onClick={handleToggle}
                        className="relative z-10 inline-flex items-center text-xs font-semibold text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-sm touch-manipulation py-1"
                    >
                        {isExpanded ? "Leer menos" : "Leer más"}
                    </button>
                </div>
            )}
        </div>
    );
}

interface TestimonialCardProps {
    testimonial: GoogleReview;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-7 shadow-sm relative group">
            <div>
                {/* Author Header */}
                <header className="flex items-center gap-3.5">
                    <picture className="h-13 w-13 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                        <img
                            src={testimonial.profile_photo_url}
                            alt={`Fotografía de ${testimonial.author_name}`}
                            loading="lazy"
                            decoding="async"
                            width={52}
                            height={52}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                        />
                    </picture>
                    <div className="min-w-0">
                        <h3 className="text-base font-bold text-neutral-900 leading-tight truncate">
                            {testimonial.author_name}
                        </h3>
                        <p className="text-sm font-medium text-neutral-400">
                            {testimonial.relative_time_description}
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
                            className={`h-4 w-4 ${
                                index < testimonial.rating
                                    ? "fill-neutral-900"
                                    : "fill-neutral-300"
                            }`}
                        />
                    ))}
                </div>

                {/* Testimonial Body */}
                <TestimonialExpandableText text={testimonial.text} />
            </div>
            <a
                href="https://www.google.com/maps/place/INTERCOL+LTDA+%7C+Agencia+de+Seguros/@4.5869229,-74.1034454,2255m/data=!3m1!1e3!4m8!3m7!1s0x8e3f99c345d5e159:0x126b4eaa710d198c!8m2!3d4.5869176!4d-74.1008705!9m1!1b1!16s%2Fg%2F11h1tp0v6l?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label={`Ver reseña completa de ${testimonial.author_name} en Google Maps`}
            />
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