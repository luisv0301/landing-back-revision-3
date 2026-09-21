"use client"
import { motion, type Variants } from "framer-motion"
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
                                {userRatingTotal} reviews
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


interface TestimonialCardProps {
    testimonial: GoogleReview;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-7 shadow-sm">
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
                    <div>
                        <h3 className="text-base font-bold text-neutral-900 leading-tight">
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
                            className={`h-4 w-4 ${index < testimonial.rating
                                ? "fill-neutral-900"
                                : "fill-neutral-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Testimonial Body */}
                <blockquote className="mt-4 text-sm leading-relaxed text-neutral-700 select-none">
                    <p>{testimonial.text}</p>
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