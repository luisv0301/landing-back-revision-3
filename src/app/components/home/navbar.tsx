"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function subscribeScroll(callback: () => void) {
    window.addEventListener("scroll", callback, { passive: true });
    window.addEventListener("resize", callback, { passive: true });
    return () => {
        window.removeEventListener("scroll", callback);
        window.removeEventListener("resize", callback);
    };
}

function getScrollThreshold120Snapshot(): boolean {
    return window.scrollY >= window.innerHeight * 1.2;
}

function getScrollThreshold140Snapshot(): boolean {
    return window.scrollY >= window.innerHeight * 1.4;
}

function getScrollThresholdServerSnapshot(): boolean {
    return false;
}

function useScrollThreshold120vh() {
    return useSyncExternalStore(
        subscribeScroll,
        getScrollThreshold120Snapshot,
        getScrollThresholdServerSnapshot
    );
}

function useScrollThreshold140vh() {
    return useSyncExternalStore(
        subscribeScroll,
        getScrollThreshold140Snapshot,
        getScrollThresholdServerSnapshot
    );
}


export interface NavItem {
    label: string;
    href: string;
}

export const NAV_LINKS: readonly NavItem[] = [
    { label: "Solicitar Asistencia", href: "/solicitar-asistencia" },
    { label: "Nuestros Clientes", href: "/#testimonios" },
    { label: "Políticas", href: "/politicas" },
] as const;

export const PHONE_CONTACT = {
    number: "+57 (322) 628-9504",
    href: "tel:+573226289504",
} as const;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const isPast120vh = useScrollThreshold120vh();
    const isPast140vh = useScrollThreshold140vh();
    const shouldReduceMotion = useReducedMotion();

    const layoutTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.25, ease: [0.23, 1, 0.32, 1] };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <header className="sticky top-0 z-50 w-full py-4 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 lg:max-w-280 lg:mx-auto rounded-3xl bg-white shadow-sm border border-neutral-200/70">

                {/* Brand / Logo */}
                <a href="/" className="flex h-15.5 items-center py-2 rounded-full bg-white px-3 lg:py-2 lg:px-5 lg:max-h-13.5" aria-label="Segurautos inicio">
                    <picture>
                        <img
                            src="/images/logo-transparent.png"
                            alt="Segurautos"
                            loading="eager"
                            decoding="async"
                            className="h-9 sm:h-11 w-auto object-contain select-none"
                        />
                    </picture>
                </a>

                {/* Desktop Navigation Capsule */}
                <motion.div
                    layout
                    transition={layoutTransition}
                    className="hidden lg:flex items-center rounded-full bg-white pl-8 pr-2 py-1.5"
                >
                    <motion.nav layout="position" transition={layoutTransition} aria-label="Navegación principal">
                        <motion.ul
                            layout="position"
                            transition={layoutTransition}
                            className="flex items-center gap-7 mr-6 text-sm font-semibold text-neutral-600 whitespace-nowrap"
                        >
                            {NAV_LINKS.map((link) => (
                                <motion.li
                                    key={link.label}
                                    layout="position"
                                    transition={layoutTransition}
                                >
                                    <a
                                        href={link.href}
                                        className="transition-colors duration-200 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                                    >
                                        {link.label}
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.nav>

                    {/* Desktop Phone Pill CTA / Cotizar Link Swap */}
                    <motion.div layout transition={layoutTransition} className="relative flex items-center overflow-x-clip">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {isPast140vh ? (
                                <motion.div
                                    key="cotizar-cta"
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <Link
                                        href="/formulario"
                                        className="flex items-center justify-center whitespace-nowrap rounded-full bg-[#FFCC00] px-6 py-2.5 text-sm font-bold text-neutral-950 transition-all duration-200 hover:bg-[#e6b800] active:scale-[0.98] shadow-xs hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                                    >
                                        Cotizar
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="phone-cta"
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <a
                                        href={PHONE_CONTACT.href}
                                        className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-neutral-100/80 px-5 py-2.5 text-sm font-bold text-neutral-900 transition-all duration-200 hover:bg-neutral-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                                    >
                                        <PhoneIcon className="h-4 w-4 stroke-[2.5]" />
                                        <span>{PHONE_CONTACT.number}</span>
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Mobile Right Controls */}
                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full lg:hidden">
                    {/* Mobile Quick Call Button */}
                    <a
                        href={PHONE_CONTACT.href}
                        aria-label={`Llamar a ${PHONE_CONTACT.number}`}
                        className="flex py-2 w-16 items-center justify-center rounded-full bg-neutral-100/90 text-neutral-900 transition-all active:scale-[0.96] active:bg-neutral-200"
                    >
                        <PhoneIcon className="h-5 w-5 stroke-[2.2]" />
                    </a>

                    {/* Hamburger / Close Button */}
                    <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Cerrar menú principal" : "Abrir menú principal"}
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl text-neutral-900 transition-transform active:scale-[0.94] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 cursor-pointer"
                    >
                        <span
                            className={`h-0.5 w-6 rounded-full bg-neutral-900 transition-transform duration-200 ${isOpen ? "translate-y-2 rotate-45" : ""
                                }`}
                        />
                        <span
                            className={`h-0.5 w-6 rounded-full bg-neutral-900 transition-opacity duration-200 ${isOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`h-0.5 w-6 rounded-full bg-neutral-900 transition-transform duration-200 ${isOpen ? "-translate-y-2 -rotate-45" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-0 w-full border-b border-neutral-200/80 bg-white backdrop-blur-md px-6 py-6 shadow-xl lg:hidden rounded-b-2xl"
                    >
                        <nav aria-label="Navegación móvil">
                            <motion.ul
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.04 },
                                    },
                                }}
                                className="flex flex-col gap-3 text-center"
                            >
                                {NAV_LINKS.map((link) => (
                                    <motion.li
                                        key={link.label}
                                        variants={{
                                            hidden: { opacity: 0, y: -4 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } },
                                        }}
                                    >
                                        <a
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block py-2 text-lg font-bold text-neutral-800 transition-colors hover:text-neutral-950 active:scale-[0.98]"
                                        >
                                            {link.label}
                                        </a>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </nav>

                        <div className="mt-6 pt-4 border-t border-neutral-200/80 flex flex-col gap-3">
                            <a
                                href={PHONE_CONTACT.href}
                                className="flex items-center justify-center gap-3 rounded-full bg-neutral-100 py-3.5 text-base font-bold text-neutral-900 transition-transform active:scale-[0.98]"
                            >
                                <PhoneIcon className="h-5 w-5" />
                                <span>{PHONE_CONTACT.number}</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Floating CTA at 120vh */}
            <AnimatePresence>
                {isPast120vh && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 12 }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.22,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-5 z-40 lg:hidden"
                    >
                        <Link
                            href="/formulario"
                            className="flex items-center justify-center rounded-full bg-[#FFCC00] px-6 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-black/15 transition-transform hover:bg-[#e6b800] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 touch-manipulation"
                            aria-label="Ir a cotizar seguro"
                        >
                            Cotizar
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7.71344 2.75062C9.13432 3.78675 10.2098 5.2425 11.1256 6.58012L11.8433 7.63537C12.0662 7.96113 12.1682 8.35456 12.1316 8.74758C12.0951 9.14059 11.9222 9.50845 11.6431 9.7875L10.1176 11.313L10.2784 11.655C10.6722 12.4526 11.3517 13.6012 12.3743 14.625C13.0816 15.3192 13.8775 15.9168 14.7413 16.4025L15.1542 16.6241L15.5221 16.8064L15.6863 16.8817L17.2107 15.3562C17.4906 15.0761 17.8602 14.9033 18.2546 14.8681C18.6491 14.8329 19.0434 14.9376 19.3684 15.1639L20.5092 15.9548C21.8052 16.866 23.1586 17.9044 24.2104 19.2521C24.3923 19.486 24.5079 19.7645 24.5453 20.0583C24.5827 20.3522 24.5405 20.6508 24.4231 20.9228C23.4814 23.1199 21.0987 24.9908 18.6203 24.8985L18.2828 24.8805L18.0207 24.858L17.7304 24.8243L17.4143 24.7815L17.0712 24.7241L16.7044 24.6521L16.3152 24.5655L15.9034 24.4598L15.4703 24.336L15.0181 24.1898C12.9413 23.4855 10.3054 22.1018 7.60094 19.3973C4.89644 16.6927 3.51382 14.058 2.80957 11.9812L2.66332 11.529L2.53957 11.0959L2.43382 10.6841L2.34607 10.2949C2.32075 10.173 2.29713 10.0507 2.27519 9.92812L2.21894 9.585L2.17394 9.26887L2.14132 8.97862L2.11882 8.7165L2.10082 8.379C2.00969 5.9085 3.90082 3.50887 6.08782 2.57175C6.35104 2.45809 6.6393 2.41481 6.92429 2.44617C7.20929 2.47753 7.48123 2.58245 7.71344 2.75062ZM6.67057 4.78462C5.46457 5.41462 4.29682 6.85462 4.34969 8.29575L4.37219 8.66475L4.39694 8.89537L4.42957 9.15412L4.47457 9.43875L4.53194 9.75037L4.60507 10.0856L4.69507 10.4456L4.80307 10.827L4.93132 11.2297C4.97857 11.367 5.02882 11.5076 5.08207 11.6516L5.25532 12.0926L5.45332 12.5505C6.15982 14.1052 7.31182 15.9255 9.19394 17.8065C11.0749 19.6875 12.8952 20.8406 14.4499 21.5471L14.9078 21.7451L15.3488 21.9184C15.4928 21.9724 15.6334 22.0226 15.7707 22.0691L16.1734 22.1974L16.5559 22.3054L16.9148 22.3954L17.2501 22.4685L17.5617 22.5259L17.8474 22.5709L18.1062 22.6046L18.3357 22.6271L18.7047 22.6496C20.1267 22.7025 21.5779 21.5415 22.2057 20.3512C21.4047 19.4119 20.4102 18.6413 19.3133 17.865L18.4718 17.2789L18.2581 17.5027L17.8013 18.0011L17.5594 18.2554C16.9002 18.927 16.1307 19.4974 15.2082 19.125L14.9539 19.0181L14.6434 18.8786L14.4702 18.7965L14.0899 18.6064L13.6726 18.3814C12.6173 17.792 11.646 17.0636 10.7847 16.2157C9.9368 15.3544 9.20841 14.3831 8.61907 13.3279L8.39407 12.9116L8.20282 12.5302L7.98232 12.0465L7.87432 11.79C7.52444 10.9249 8.00594 10.1947 8.62132 9.5625L8.87332 9.315L9.49994 8.73787L9.72495 8.52412L9.19282 7.7445C8.40194 6.597 7.62907 5.562 6.66944 4.7835L6.67057 4.78462ZM16.8664 6.795L16.9969 6.80962C17.8158 6.95407 18.568 7.35406 19.1456 7.95226C19.7232 8.55046 20.0965 9.31617 20.2122 10.1396C20.2534 10.4245 20.1839 10.7143 20.018 10.9494C19.8521 11.1846 19.6024 11.3472 19.3202 11.4038C19.038 11.4604 18.7449 11.4068 18.5011 11.2539C18.2573 11.101 18.0813 10.8604 18.0094 10.5817L17.9836 10.4524C17.9383 10.1296 17.8005 9.82686 17.5869 9.58071C17.3733 9.33455 17.093 9.15552 16.7798 9.06525L16.6054 9.02587C16.323 8.9758 16.0703 8.8197 15.8991 8.58949C15.7279 8.35928 15.6511 8.07236 15.6844 7.78741C15.7177 7.50246 15.8587 7.24101 16.0784 7.05654C16.2981 6.87207 16.58 6.77851 16.8664 6.795ZM16.8743 3.375C18.6645 3.375 20.3814 4.08616 21.6473 5.35203C22.9132 6.6179 23.6243 8.33479 23.6243 10.125C23.624 10.4117 23.5142 10.6875 23.3174 10.896C23.1205 11.1045 22.8515 11.23 22.5653 11.2468C22.279 11.2636 21.9971 11.1705 21.7773 10.9865C21.5574 10.8024 21.4161 10.5414 21.3822 10.2566L21.3743 10.125C21.3742 8.98263 20.9396 7.88306 20.1587 7.04929C19.3778 6.21551 18.309 5.70995 17.1691 5.63512L16.8743 5.625C16.576 5.625 16.2898 5.50647 16.0788 5.29549C15.8678 5.08452 15.7493 4.79837 15.7493 4.5C15.7493 4.20163 15.8678 3.91548 16.0788 3.7045C16.2898 3.49352 16.576 3.375 16.8743 3.375Z" fill="#161616" />
        </svg>

    );
}